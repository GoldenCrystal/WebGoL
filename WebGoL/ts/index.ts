import { Vector2D, Matrix2D } from './vector-math';

interface VertexBufferDefinition {
    buffer: WebGLBuffer;
    itemSize: number;
    itemCount: number;
}

interface FrameBufferDefinition {
    framebuffer: WebGLFramebuffer;
    texture: WebGLTexture;
}

interface GameOfLifeShaderProgram extends WebGLProgram {
    samplerUniform: WebGLUniformLocation;
    pixelSizeUniform: WebGLUniformLocation;
    vertexPositionAttribute: number;
}

interface VisualizationShaderProgram extends WebGLProgram {
    samplerUniform: WebGLUniformLocation;
    transformXUniform: WebGLUniformLocation;
    transformYUniform: WebGLUniformLocation;
    vertexPositionAttribute: number;
}

const _bufferWidth = 2048;
const _bufferHeight = 2048;
// Define the reference projection matrix, used for transforming vertex coordinates into texture coordinates for a square viewport)
const _squareProjectionMatrix = Matrix2D.multiply(Matrix2D.scale(0.5, -0.5), Matrix2D.translate(0.5));

var _projectionMatrix = _squareProjectionMatrix;
var _rotationMatrix = Matrix2D.identity();
var _viewMatrix = Matrix2D.identity();

var _angle = 0;

var _canvas: HTMLCanvasElement = null;
var _pauseSimulationButton: HTMLButtonElement = null;
var _clearCanvasButton: HTMLButtonElement = null;
var _reseedGameOfLifeButton: HTMLButtonElement = null;
var _resetViewButton: HTMLButtonElement = null;
var _gl: WebGLRenderingContext = null;
var _rectangleVertexBuffer: VertexBufferDefinition = null;
var _frontBuffer: FrameBufferDefinition = null;
var _backBuffer: FrameBufferDefinition = null;
var _visShaderProgram: VisualizationShaderProgram = null;
var _golShaderProgram: GameOfLifeShaderProgram = null;
var _currentProgramIsGameOfLife = false;
var _isContextCreated = false;
var _isSimulationPaused = false;

var shaderValues = {
    "gol-vs": null as string,
    "gol-fs": null as string,
    "vis-vs": null as string,
    "vis-fs": null as string,
};

run();

async function run() {
    try {
        await preloadData();
        start();
    } catch (e) {
        console.log("Failed to run the application.\n" + e.toString());
    }
}

async function preloadData(): Promise<void> {
    try {
        var responses = await Promise.all([
            fetch("/shaders/gol.vert"),
            fetch("/shaders/gol.frag"),
            fetch("/shaders/vis.vert"),
            fetch("/shaders/vis.frag"),
        ]);
        var textBodies = await Promise.all(responses.map(response => response.text()));

        shaderValues["gol-vs"] = textBodies[0];
        shaderValues["gol-fs"] = textBodies[1];
        shaderValues["vis-vs"] = textBodies[2];
        shaderValues["vis-fs"] = textBodies[3];
    }
    catch (e) {
        throw Error("Preloading failed.\n" + e.toString());
    }
}

function start() {
    _canvas = document.getElementById("golCanvas") as HTMLCanvasElement;
    _pauseSimulationButton = document.getElementById("pauseSimulationButton") as HTMLButtonElement;
    _clearCanvasButton = document.getElementById("clearCanvasButton") as HTMLButtonElement;
    _reseedGameOfLifeButton = document.getElementById("reseedGameOfLifeButton") as HTMLButtonElement;
    _resetViewButton = document.getElementById("resetViewButton") as HTMLButtonElement;

    resizeCanvas();

    _canvas.addEventListener("webglcontextlost", function (e: WebGLContextEvent) { event.preventDefault(); _isContextCreated = false; }, false);
    _canvas.addEventListener("webglcontextrestored", function (e: WebGLContextEvent) { setupWebGL(); }, false);

    setupWebGL();

    setupInteractivity();
}

function setupWebGL() {
    _isContextCreated = false;

    _gl = _canvas.getContext("webgl") || _canvas.getContext("experimental-webgl") || null;

    if (!_gl) {
        console.error("Could not get WebGL context.");
        return;
    }

    if (!(_rectangleVertexBuffer = createRectangleVertexBuffer())) {
        console.error("Could not create vertex buffer.");
        return;
    }

    _gl.clearColor(0.0, 0.0, 0.0, 1.0);
    _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);

    if (!(_frontBuffer = createFrameBuffer(_bufferWidth, _bufferHeight))) {
        console.error("Could not create frame buffer.");
        return;
    }

    if (!(_backBuffer = createFrameBuffer(_bufferWidth, _bufferHeight))) {
        console.error("Could not create frame buffer.");
        return;
    }

    _visShaderProgram = createShaderProgram("vis-vs", "vis-fs") as VisualizationShaderProgram;
    _golShaderProgram = createShaderProgram("gol-vs", "gol-fs") as GameOfLifeShaderProgram;

    if (!_visShaderProgram || !_golShaderProgram) {
        console.error("Could not create shader programs.");
        return;
    }

    _visShaderProgram.samplerUniform = _gl.getUniformLocation(_visShaderProgram, "uSampler");
    _visShaderProgram.transformXUniform = _gl.getUniformLocation(_visShaderProgram, "uTransformX");
    _visShaderProgram.transformYUniform = _gl.getUniformLocation(_visShaderProgram, "uTransformY");
    _visShaderProgram.vertexPositionAttribute = _gl.getAttribLocation(_visShaderProgram, "aVertexPosition");
    _gl.enableVertexAttribArray(_visShaderProgram.vertexPositionAttribute);

    _golShaderProgram.samplerUniform = _gl.getUniformLocation(_golShaderProgram, "uSampler");
    _golShaderProgram.pixelSizeUniform = _gl.getUniformLocation(_golShaderProgram, "uPixelSize");
    _golShaderProgram.vertexPositionAttribute = _gl.getAttribLocation(_golShaderProgram, "aVertexPosition");
    _gl.enableVertexAttribArray(_golShaderProgram.vertexPositionAttribute);

    _currentProgramIsGameOfLife = false;

    setRandomPixels(_frontBuffer.texture, getSeedPixelCount());

    _isContextCreated = true;

    tick();
}

function getSeedPixelCount() {
    return Math.round(_bufferWidth * _bufferHeight * 1 / 4);
}

function setupInteractivity() {
    _canvas.addEventListener("wheel", onWheel);
    _canvas.addEventListener("mousedown", onMouseDown);
    _canvas.addEventListener("mousemove", onMouseMove);
    _canvas.addEventListener("mouseup", onMouseUp);
    _canvas.addEventListener("contextmenu", consumeEvent);
    _pauseSimulationButton.addEventListener("click", togglePause);
    _clearCanvasButton.addEventListener("click", e => clearPixels(_frontBuffer.texture));
    _reseedGameOfLifeButton.addEventListener("click", e => setRandomPixels(_frontBuffer.texture, getSeedPixelCount()));
    _resetViewButton.addEventListener("click", resetView);
}

const _white = new Uint8Array([255, 255, 255, 255]);
const _black = new Uint8Array([0, 0, 0, 0]);

function clearPixels(texture: WebGLTexture) {
    _gl.bindTexture(_gl.TEXTURE_2D, texture);
    _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _bufferWidth, _bufferHeight, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, new Uint8Array(_bufferWidth * _bufferHeight * 4));
}

function setRandomPixels(texture: WebGLTexture, pixelCount: number) {
    var buffer = new Uint8Array(_bufferWidth * _bufferHeight * 4);
    
    for (var i = 0; i < pixelCount; i++) {
        var x = Math.round(Math.random() * (_bufferWidth - 1));
        var y = Math.round(Math.random() * (_bufferHeight - 1));
        
        buffer.set(_white, (y * _bufferWidth + x) * 4);
    }
    _gl.bindTexture(_gl.TEXTURE_2D, texture);
    _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _bufferWidth, _bufferHeight, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, buffer);
}

function writePixel(texture: WebGLTexture, x: number, y: number, set: boolean = true) {
    _gl.bindTexture(_gl.TEXTURE_2D, texture);
    _gl.texSubImage2D(_gl.TEXTURE_2D, 0, x, y, 1, 1, _gl.RGBA, _gl.UNSIGNED_BYTE, set ? _white : _black);
}

function drawLine(texture: WebGLTexture, x0: number, y0: number, x1: number, y1: number, set: boolean = true) {
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;

    // Wrap coordinates around
    var cx = x0 % _bufferWidth;
    if (cx < 0) cx += _bufferWidth;
    var cy = y0 % _bufferHeight;
    if (cy < 0) cy += _bufferHeight;

    while (true) {
        writePixel(texture, cx, cy, set);

        if ((x0 == x1) && (y0 == y1)) break;
        var e2 = err << 1;
        if (e2 > -dy) { err -= dy; x0 += sx; cx += sx; }
        if (e2 < dx) { err += dx; y0 += sy; cy += sy; }
        if (cx >= _bufferWidth) cx -= _bufferWidth;
        if (cy >= _bufferHeight) cy -= _bufferHeight;
    }
}

function tick() {
    if (_isContextCreated) {
        //rotationMatrix = Matrix2D.multiply(Matrix2D.multiply(Matrix2D.translate(-0.5), Matrix2D.rotate((angle += 0.5) * Math.PI / 180)), Matrix2D.translate(0.5));
        window.requestAnimationFrame(tick);
        drawScene();
    }
}

function togglePause() {
    document.body.className = (_isSimulationPaused = !_isSimulationPaused) ? "paused" : "running";
}

function drawScene() {
    resizeCanvas();
    if (!_isSimulationPaused) {
        iterateGameOfLife();
    }
    renderGameOfLife();
}

function renderGameOfLife() {
    _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
    _gl.viewport(0, 0, _gl.drawingBufferWidth, _gl.drawingBufferHeight);
    _gl.clear(_gl.COLOR_BUFFER_BIT);
    if (_currentProgramIsGameOfLife) {
        _gl.useProgram(_visShaderProgram);
        _currentProgramIsGameOfLife = false;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, _rectangleVertexBuffer.buffer);
        _gl.vertexAttribPointer(_visShaderProgram.vertexPositionAttribute, _rectangleVertexBuffer.itemSize, _gl.FLOAT, false, 0, 0);
    }
    _gl.activeTexture(_gl.TEXTURE0);
    _gl.bindTexture(_gl.TEXTURE_2D, _frontBuffer.texture);
    _gl.uniform1i(_visShaderProgram.samplerUniform, 0);
    var finalViewMatrix = Matrix2D.multiply(Matrix2D.multiply(_projectionMatrix, _rotationMatrix), _viewMatrix);
    _gl.uniform3f(_visShaderProgram.transformXUniform, finalViewMatrix.m11, finalViewMatrix.m12, finalViewMatrix.m13);
    _gl.uniform3f(_visShaderProgram.transformYUniform, finalViewMatrix.m21, finalViewMatrix.m22, finalViewMatrix.m23);
    _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, _rectangleVertexBuffer.itemCount);
}

function iterateGameOfLife() {
    var currentBuffer = _backBuffer;

    _gl.bindFramebuffer(_gl.FRAMEBUFFER, currentBuffer.framebuffer);
    _gl.viewport(0, 0, _bufferWidth, _bufferHeight);
    _gl.clear(_gl.COLOR_BUFFER_BIT);
    if (!_currentProgramIsGameOfLife) {
        _gl.useProgram(_golShaderProgram);
        _currentProgramIsGameOfLife = true;
        _gl.bindBuffer(_gl.ARRAY_BUFFER, _rectangleVertexBuffer.buffer);
        _gl.vertexAttribPointer(_golShaderProgram.vertexPositionAttribute, _rectangleVertexBuffer.itemSize, _gl.FLOAT, false, 0, 0);
    }
    _gl.activeTexture(_gl.TEXTURE0);
    _gl.bindTexture(_gl.TEXTURE_2D, _frontBuffer.texture);
    _gl.uniform1i(_golShaderProgram.samplerUniform, 0);
    _gl.uniform2f(_golShaderProgram.pixelSizeUniform, 1.0 / _bufferWidth, 1.0 / _bufferHeight);
    _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, _rectangleVertexBuffer.itemCount);

    _backBuffer = _frontBuffer;
    _frontBuffer = currentBuffer;
}

function resizeCanvas() {
    var devicePixelRatio = window.devicePixelRatio || 1;

    var desiredWidth = _canvas.clientWidth * devicePixelRatio;
    var desiredHeight = _canvas.clientHeight * devicePixelRatio;

    if (_canvas.width != desiredWidth || _canvas.height != desiredHeight) {
        _canvas.width = desiredWidth;
        _canvas.height = desiredHeight;

        _projectionMatrix = Matrix2D.multiply(Matrix2D.scale(desiredWidth / _bufferWidth, desiredHeight / _bufferHeight), _squareProjectionMatrix);
    }
}

function mapCanvasCoordinatesToViewportCoordinates(p: Vector2D): Vector2D {
    let hw = _canvas.clientWidth - 1;
    let hh = _canvas.clientHeight - 1;
    return new Vector2D((2 * p.x - hw) / hw, (hh - 2 * p.y) / hh); // NB: Top-left is (-1, 1) and not (-1, -1)
}

function mapCanvasTranslationVectorToViewportTranslationVector(v: Vector2D): Vector2D {
    let hw = _canvas.clientWidth - 1;
    let hh = _canvas.clientHeight - 1;
    return new Vector2D(2 * v.x / hw, -2 * v.y / hh); // NB: Top-left is (-1, 1) and not (-1, -1)
}

function mapCanvasCoordinatesToTextureCoordinates(p: Vector2D): Vector2D {
    return mapCanvasCoordinatesToViewportCoordinates(p).transform(Matrix2D.multiply(Matrix2D.multiply(_projectionMatrix, _rotationMatrix), _viewMatrix));
}

//function mapCanvasCoordinatesToClampedTexturePixelCoordinates(p: Vector2D): Vector2D {
//    return mapCanvasCoordinatesToTextureCoordinates(p).frac().scale( _bufferWidth - 1, _bufferHeight - 1).round();
//}

function mapCanvasCoordinatesToTexturePixelCoordinates(p: Vector2D): Vector2D {
    return mapCanvasCoordinatesToTextureCoordinates(p).scale(_bufferWidth - 1, _bufferHeight - 1).round();
}

function applyViewportSpaceTransformToView(transform: Matrix2D) {
    var projection = Matrix2D.multiply(_projectionMatrix, _rotationMatrix);
    _viewMatrix = Matrix2D.multiply(Matrix2D.multiply(Matrix2D.multiply(projection.inverse(), transform), projection), _viewMatrix);
}

function applyViewportTranslationToView(translationInCanvasPixels: Vector2D) {
    var p = mapCanvasTranslationVectorToViewportTranslationVector(translationInCanvasPixels);

    applyViewportSpaceTransformToView(Matrix2D.translate(p.x, p.y));
}

var _zoomLevels = [1.0, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 8, 16];
var _zoomLevelIndex = 0;
function onWheel(e: WheelEvent) {
    if (e.deltaY != 0) {
        e.stopPropagation();
        e.preventDefault();

        var previousZoomLevelIndex = _zoomLevelIndex;

        if (e.deltaY < 0 && _zoomLevelIndex + 1 < _zoomLevels.length) {
            _zoomLevelIndex++;
        } else if (e.deltaY > 0 && _zoomLevelIndex > 0) {
            _zoomLevelIndex--;
        } else {
            return;
        }

        var relativeZoomFactor = _zoomLevels[previousZoomLevelIndex] / _zoomLevels[_zoomLevelIndex];
        
        var mousePosition = mapCanvasCoordinatesToViewportCoordinates(new Vector2D(e.clientX, e.clientY));

        var transform = Matrix2D.multiply(Matrix2D.multiply(Matrix2D.translate(-mousePosition.x, -mousePosition.y), Matrix2D.scale(relativeZoomFactor, relativeZoomFactor)), Matrix2D.translate(mousePosition.x, mousePosition.y));

        applyViewportSpaceTransformToView(transform);
    }
}

var _mouseDownButton = -1;
var _mouseLastPoint = null as Vector2D;

function handleMouseMoveAction(point: Vector2D) {
    switch (_mouseDownButton) {
        case 0:
        case 2:
            var a = mapCanvasCoordinatesToTexturePixelCoordinates(_mouseLastPoint);
            var b = mapCanvasCoordinatesToTexturePixelCoordinates(point);
            drawLine(_frontBuffer.texture, a.x, a.y, b.x, b.y, _mouseDownButton == 0);
            break;
        case 1:
            applyViewportTranslationToView(_mouseLastPoint.subtract(point));
            break;
    }
}

function onMouseDown(e: MouseEvent) {
    if (_mouseDownButton == -1 && e.button >= 0 && e.button < 3) {
        e.stopPropagation();
        e.preventDefault();

        _mouseDownButton = e.button;
        _mouseLastPoint = new Vector2D(e.clientX, e.clientY);
    }
}

function onMouseMove(e: MouseEvent) {
    if (_mouseDownButton >= 0 && _mouseDownButton < 3) {
        e.stopPropagation();
        e.preventDefault();

        var point = new Vector2D(e.clientX, e.clientY);

        handleMouseMoveAction(point);
        
        _mouseLastPoint = point;
    }
}

function onMouseUp(e: MouseEvent) {
    if (_mouseDownButton >= 0 && _mouseDownButton < 3 && _mouseDownButton == e.button) {
        e.stopPropagation();
        e.preventDefault();

        handleMouseMoveAction(new Vector2D(e.clientX, e.clientY));

        _mouseLastPoint = null;
        _mouseDownButton = -1;
    }
}

function consumeEvent(e: Event) {
    e.stopPropagation();
    e.preventDefault();
}

function resetView() {
    _zoomLevelIndex = 0;
    _viewMatrix = Matrix2D.identity();
}

function createRectangleVertexBuffer(): VertexBufferDefinition {
    var vertexBuffer = _gl.createBuffer();

    if (!vertexBuffer) {
        return null;
    }

    _gl.bindBuffer(_gl.ARRAY_BUFFER, vertexBuffer);
    _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        1.0, 1.0,
    ]), _gl.STATIC_DRAW);

    return {
        buffer: vertexBuffer,
        itemSize: 2,
        itemCount: 4
    };
}

function getShader(id: string, kind: number) {
    var shader = _gl.createShader(kind);

    _gl.shaderSource(shader, shaderValues[id]);
    _gl.compileShader(shader);

    if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
        console.log(_gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function createShaderProgram(vertexShaderName: string, fragmentShaderName: string) {
    var vertexShader = getShader(vertexShaderName, _gl.VERTEX_SHADER);
    var fragmentShader = getShader(fragmentShaderName, _gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
        return null;
    }

    var program = _gl.createProgram();
    _gl.attachShader(program, vertexShader);
    _gl.attachShader(program, fragmentShader);
    _gl.linkProgram(program);

    return program;
}

function createFrameBuffer(width: number, height: number): FrameBufferDefinition {
    var framebuffer = _gl.createFramebuffer();
    if (!framebuffer) {
        return null;
    }
    _gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);
    var texture = _gl.createTexture();
    if (!texture) {
        return null;
    }
    _gl.bindTexture(_gl.TEXTURE_2D, texture);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, 0);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 0);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.REPEAT);
    _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.REPEAT);
    _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, width, height, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, null);
    _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_2D, texture, 0);
    _gl.bindTexture(_gl.TEXTURE_2D, null);
    _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);

    return {
        framebuffer: framebuffer,
        texture: texture,
    };
}