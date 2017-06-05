var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("vector-math", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Matrix2D = (function () {
        function Matrix2D(m11, m12, m13, m21, m22, m23) {
            if (m11 === void 0) { m11 = 0; }
            if (m12 === void 0) { m12 = 0; }
            if (m13 === void 0) { m13 = 0; }
            if (m21 === void 0) { m21 = 0; }
            if (m22 === void 0) { m22 = 0; }
            if (m23 === void 0) { m23 = 0; }
            this.m11 = m11;
            this.m12 = m12;
            this.m13 = m13;
            this.m21 = m21;
            this.m22 = m22;
            this.m23 = m23;
        }
        Matrix2D.prototype.multiply = function (other) {
            return Matrix2D.multiply(this, other);
        };
        Matrix2D.prototype.determinant = function () {
            return this.m11 * this.m22 - this.m12 * this.m21;
        };
        Matrix2D.prototype.inverse = function () {
            var det = this.determinant();
            if (det === 0)
                return null;
            var c = 1 / det;
            return new Matrix2D(c * this.m22, -c * this.m12, c * (this.m12 * this.m23 - this.m22 * this.m13), -c * this.m21, c * this.m11, -c * (this.m11 * this.m23 - this.m21 * this.m13));
        };
        Matrix2D.identity = function () {
            return new Matrix2D(1, 0, 0, 0, 1, 0);
        };
        Matrix2D.scale = function (sx, sy) {
            if (sx === void 0) { sx = 1; }
            if (sy === void 0) { sy = sx; }
            return new Matrix2D(sx, 0, 0, 0, sy, 0);
        };
        Matrix2D.translate = function (tx, ty) {
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = tx; }
            return new Matrix2D(1, 0, tx, 0, 1, ty);
        };
        Matrix2D.rotate = function (a) {
            return new Matrix2D(Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0);
        };
        Matrix2D.multiply = function (a, b) {
            return new Matrix2D(b.m11 * a.m11 + b.m12 * a.m21, b.m11 * a.m12 + b.m12 * a.m22, b.m11 * a.m13 + b.m12 * a.m23 + b.m13, b.m21 * a.m11 + b.m22 * a.m21, b.m21 * a.m12 + b.m22 * a.m22, b.m21 * a.m13 + b.m22 * a.m23 + b.m23);
        };
        return Matrix2D;
    }());
    exports.Matrix2D = Matrix2D;
    var Vector2D = (function () {
        function Vector2D(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = x; }
            this.x = x;
            this.y = y;
        }
        Vector2D.prototype.scale = function (sx, sy) {
            if (sx === void 0) { sx = 0; }
            if (sy === void 0) { sy = sx; }
            return new Vector2D(this.x * sx, this.y * sy);
        };
        Vector2D.prototype.translate = function (tx, ty) {
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = tx; }
            return new Vector2D(this.x + tx, this.y + ty);
        };
        Vector2D.prototype.floor = function () {
            return new Vector2D(Math.floor(this.x), Math.floor(this.y));
        };
        Vector2D.prototype.ceil = function () {
            return new Vector2D(Math.ceil(this.x), Math.ceil(this.y));
        };
        Vector2D.prototype.round = function () {
            return new Vector2D(Math.round(this.x), Math.round(this.y));
        };
        Vector2D.prototype.frac = function () {
            return new Vector2D(this.x % 1, this.y % 1);
        };
        Vector2D.prototype.wrap = function () {
            return new Vector2D(_fracToPositive(this.x % 1), _fracToPositive(this.y % 1));
        };
        Vector2D.prototype.multiply = function (v) {
            return new Vector2D(this.x * v.x, this.y * v.y);
        };
        Vector2D.prototype.negate = function () {
            return new Vector2D(-this.x, -this.y);
        };
        Vector2D.prototype.add = function (v) {
            return new Vector2D(this.x + v.x, this.y + v.y);
        };
        Vector2D.prototype.subtract = function (v) {
            return new Vector2D(this.x - v.x, this.y - v.y);
        };
        Vector2D.prototype.transform = function (m) {
            return new Vector2D(this.x * m.m11 + this.y * m.m12 + m.m13, this.x * m.m21 + this.y * m.m22 + m.m23);
        };
        Vector2D.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        Vector2D.zero = function () {
            return new Vector2D(0, 0);
        };
        return Vector2D;
    }());
    exports.Vector2D = Vector2D;
    function _fracToPositive(f) { return f < 0 ? f + 1 : f; }
});
define("index", ["require", "exports", "vector-math"], function (require, exports, vector_math_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _bufferWidth = 2048;
    var _bufferHeight = 2048;
    var _squareProjectionMatrix = vector_math_1.Matrix2D.multiply(vector_math_1.Matrix2D.scale(0.5, -0.5), vector_math_1.Matrix2D.translate(0.5));
    var _projectionMatrix = _squareProjectionMatrix;
    var _rotationMatrix = vector_math_1.Matrix2D.identity();
    var _viewMatrix = vector_math_1.Matrix2D.identity();
    var _angle = 0;
    var _canvas = null;
    var _gridVisibilityCheckbox = null;
    var _pauseSimulationButton = null;
    var _stepSimulationButton = null;
    var _clearCanvasButton = null;
    var _reseedGameOfLifeButton = null;
    var _resetViewButton = null;
    var _gl = null;
    var _rectangleVertexBuffer = null;
    var _frontBuffer = null;
    var _backBuffer = null;
    var _visShaderProgram = null;
    var _gridVisShaderProgram = null;
    var _golShaderProgram = null;
    var _currentShaderProgramId = -1;
    var _isContextCreated = false;
    var _isSimulationPaused = false;
    var _shouldPauseSimulationAfterNextFrame = false;
    var _isGridVisible = false;
    var _shouldUpdateShader = false;
    var shaderValues = {
        "gol-vs": null,
        "gol-fs": null,
        "gol-ml-fs": null,
        "hl-fs": null,
        "vis-vs": null,
        "vis-fs": null,
        "vis-grid-fs": null,
    };
    run();
    function run() {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, preloadData()];
                    case 1:
                        _a.sent();
                        start();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log("Failed to run the application.\n" + e_1.toString());
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function preloadData() {
        return __awaiter(this, void 0, void 0, function () {
            var responses, textBodies, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.all([
                                fetch("/shaders/gol.vert"),
                                fetch("/shaders/gol.frag"),
                                fetch("/shaders/gol.multilayer.frag"),
                                fetch("/shaders/highlife.frag"),
                                fetch("/shaders/vis.vert"),
                                fetch("/shaders/vis.frag"),
                                fetch("/shaders/vis.grid.frag"),
                            ])];
                    case 1:
                        responses = _a.sent();
                        return [4 /*yield*/, Promise.all(responses.map(function (response) { return response.text(); }))];
                    case 2:
                        textBodies = _a.sent();
                        shaderValues["gol-vs"] = textBodies[0];
                        shaderValues["gol-fs"] = textBodies[1];
                        shaderValues["gol-ml-fs"] = textBodies[2];
                        shaderValues["hl-fs"] = textBodies[3];
                        shaderValues["vis-vs"] = textBodies[4];
                        shaderValues["vis-fs"] = textBodies[5];
                        shaderValues["vis-grid-fs"] = textBodies[6];
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        throw Error("Preloading failed.\n" + e_2.toString());
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function start() {
        _canvas = document.getElementById("golCanvas");
        _gridVisibilityCheckbox = document.getElementById("gridVisibilityCheckbox");
        _pauseSimulationButton = document.getElementById("pauseSimulationButton");
        _stepSimulationButton = document.getElementById("stepSimulationButton");
        _clearCanvasButton = document.getElementById("clearCanvasButton");
        _reseedGameOfLifeButton = document.getElementById("reseedGameOfLifeButton");
        _resetViewButton = document.getElementById("resetViewButton");
        resizeCanvas();
        _canvas.addEventListener("webglcontextlost", function (e) { event.preventDefault(); _isContextCreated = false; }, false);
        _canvas.addEventListener("webglcontextrestored", function (e) { setupWebGL(); }, false);
        setupWebGL();
        setupInteractivity();
    }
    function setupWebGL() {
        _isContextCreated = false;
        var options = {
            alpha: false,
            depth: false,
            stencil: false,
            antialias: false,
            preserveDrawingBuffer: false
        };
        _gl = _canvas.getContext("webgl", options) || _canvas.getContext("experimental-webgl", options) || null;
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
        _gl.disable(_gl.BLEND);
        _gl.disable(_gl.DEPTH_TEST);
        if (!(_frontBuffer = createFrameBuffer(_bufferWidth, _bufferHeight))) {
            console.error("Could not create frame buffer.");
            return;
        }
        if (!(_backBuffer = createFrameBuffer(_bufferWidth, _bufferHeight))) {
            console.error("Could not create frame buffer.");
            return;
        }
        _visShaderProgram = createShaderProgram("vis-vs", "vis-fs");
        _gridVisShaderProgram = createShaderProgram("vis-vs", "vis-grid-fs");
        _golShaderProgram = createShaderProgram("gol-vs", "gol-fs");
        if (!_visShaderProgram || !_golShaderProgram) {
            console.error("Could not create shader programs.");
            return;
        }
        _visShaderProgram.samplerUniform = _gl.getUniformLocation(_visShaderProgram, "uSampler");
        _visShaderProgram.transformXUniform = _gl.getUniformLocation(_visShaderProgram, "uTransformX");
        _visShaderProgram.transformYUniform = _gl.getUniformLocation(_visShaderProgram, "uTransformY");
        _visShaderProgram.vertexPositionAttribute = _gl.getAttribLocation(_visShaderProgram, "aVertexPosition");
        _gl.enableVertexAttribArray(_visShaderProgram.vertexPositionAttribute);
        _gridVisShaderProgram.samplerUniform = _gl.getUniformLocation(_gridVisShaderProgram, "uSampler");
        _gridVisShaderProgram.transformXUniform = _gl.getUniformLocation(_gridVisShaderProgram, "uTransformX");
        _gridVisShaderProgram.transformYUniform = _gl.getUniformLocation(_gridVisShaderProgram, "uTransformY");
        _gridVisShaderProgram.vertexPositionAttribute = _gl.getAttribLocation(_gridVisShaderProgram, "aVertexPosition");
        _gridVisShaderProgram.gridPixelSizeUniform = _gl.getUniformLocation(_gridVisShaderProgram, "uGridPixelSize");
        _gridVisShaderProgram.gridSpacingUniform = _gl.getUniformLocation(_gridVisShaderProgram, "uGridSpacing");
        _gridVisShaderProgram.gridColorUniform = _gl.getUniformLocation(_gridVisShaderProgram, "uGridColor");
        _gl.enableVertexAttribArray(_gridVisShaderProgram.vertexPositionAttribute);
        _golShaderProgram.samplerUniform = _gl.getUniformLocation(_golShaderProgram, "uSampler");
        _golShaderProgram.pixelSizeUniform = _gl.getUniformLocation(_golShaderProgram, "uPixelSize");
        _golShaderProgram.vertexPositionAttribute = _gl.getAttribLocation(_golShaderProgram, "aVertexPosition");
        _gl.enableVertexAttribArray(_golShaderProgram.vertexPositionAttribute);
        _currentShaderProgramId = -1;
        setRandomPixels(_frontBuffer.texture, getSeedPixelCount());
        _isContextCreated = true;
        tick();
    }
    function getSeedPixelCount() {
        return Math.round(_bufferWidth * _bufferHeight * 1 / 4);
    }
    function setupInteractivity() {
        _canvas.addEventListener("wheel", onWheel);
        _canvas.addEventListener("mousedown", onMouseDown, true);
        _canvas.addEventListener("mousemove", onMouseMove, true);
        _canvas.addEventListener("mouseup", onMouseUp, true);
        _canvas.addEventListener("touchstart", onTouchStart);
        _canvas.addEventListener("touchmove", onTouchMove);
        _canvas.addEventListener("touchend", onTouchEnd);
        _canvas.addEventListener("touchcancel", onTouchCancel);
        _canvas.addEventListener("contextmenu", consumeEvent);
        _gridVisibilityCheckbox.addEventListener("change", updateGridVisibility);
        _pauseSimulationButton.addEventListener("click", togglePause);
        _stepSimulationButton.addEventListener("click", stepForward);
        _clearCanvasButton.addEventListener("click", function (e) { return clearPixels(_frontBuffer.texture); });
        _reseedGameOfLifeButton.addEventListener("click", function (e) { return setRandomPixels(_frontBuffer.texture, getSeedPixelCount()); });
        _resetViewButton.addEventListener("click", resetView);
    }
    var _red = new Uint8Array([255, 0, 0, 255]);
    var _yellow = new Uint8Array([255, 255, 0, 255]);
    var _green = new Uint8Array([0, 255, 0, 255]);
    var _cyan = new Uint8Array([0, 255, 255, 255]);
    var _blue = new Uint8Array([0, 0, 255, 255]);
    var _magenta = new Uint8Array([255, 0, 255, 255]);
    var _white = new Uint8Array([255, 255, 255, 255]);
    var _black = new Uint8Array([0, 0, 0, 255]);
    var _colors = [_red, _yellow, _green, _cyan, _blue, _magenta, _white];
    function createInitializedBuffer() {
        var buffer = new Uint8Array((_bufferWidth * _bufferHeight) << 2);
        var n = _bufferWidth * _bufferHeight;
        for (var i = 0; i < n; i++) {
            buffer.set(_black, i << 2);
        }
        return buffer;
    }
    function clearPixels(texture) {
        _gl.bindTexture(_gl.TEXTURE_2D, texture);
        _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _bufferWidth, _bufferHeight, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, createInitializedBuffer());
    }
    function setRandomPixels(texture, pixelCount) {
        var buffer = createInitializedBuffer();
        for (var i = 0; i < pixelCount; i++) {
            var x = Math.round(Math.random() * (_bufferWidth - 1));
            var y = Math.round(Math.random() * (_bufferHeight - 1));
            var color = _white;
            buffer.set(color, (y * _bufferWidth + x) << 2);
        }
        _gl.bindTexture(_gl.TEXTURE_2D, texture);
        _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, _bufferWidth, _bufferHeight, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, buffer);
    }
    function writePixel(texture, x, y, set) {
        if (set === void 0) { set = true; }
        _gl.bindTexture(_gl.TEXTURE_2D, texture);
        _gl.texSubImage2D(_gl.TEXTURE_2D, 0, x, y, 1, 1, _gl.RGBA, _gl.UNSIGNED_BYTE, set ? _white : _black);
    }
    function drawLine(texture, x0, y0, x1, y1, set) {
        if (set === void 0) { set = true; }
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;
        var cx = x0 % _bufferWidth;
        if (cx < 0)
            cx += _bufferWidth;
        var cy = y0 % _bufferHeight;
        if (cy < 0)
            cy += _bufferHeight;
        while (true) {
            writePixel(texture, cx, cy, set);
            if ((x0 == x1) && (y0 == y1))
                break;
            var e2 = err << 1;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
                cx += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
                cy += sy;
            }
            if (cx >= _bufferWidth)
                cx -= _bufferWidth;
            if (cy >= _bufferHeight)
                cy -= _bufferHeight;
        }
    }
    function tick() {
        if (_isContextCreated) {
            window.requestAnimationFrame(tick);
            drawScene();
        }
    }
    function togglePause() {
        setPause(!_isSimulationPaused);
    }
    function updateGridVisibility() {
        setGridVisibility(_gridVisibilityCheckbox.checked);
    }
    function setPause(shouldPause) {
        if (shouldPause === void 0) { shouldPause = true; }
        document.body.className = (_isSimulationPaused = shouldPause) ? "paused" : "running";
    }
    function setGridVisibility(visible) {
        if (visible === void 0) { visible = true; }
        _isGridVisible = visible;
    }
    function stepForward() {
        _isSimulationPaused = false;
        _shouldPauseSimulationAfterNextFrame = true;
    }
    function drawScene() {
        resizeCanvas();
        if (!_isSimulationPaused) {
            iterateGameOfLife();
            if (_shouldPauseSimulationAfterNextFrame) {
                setPause();
                _shouldPauseSimulationAfterNextFrame = false;
            }
        }
        renderGameOfLife();
    }
    function renderGameOfLife() {
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
        _gl.viewport(0, 0, _gl.drawingBufferWidth, _gl.drawingBufferHeight);
        _gl.clear(_gl.COLOR_BUFFER_BIT);
        var requestedProgramId = _isGridVisible ? 2 : 1;
        var visShaderProgram = _isGridVisible ? _gridVisShaderProgram : _visShaderProgram;
        if (_currentShaderProgramId != requestedProgramId) {
            _gl.useProgram(visShaderProgram);
            _currentShaderProgramId = requestedProgramId;
            _gl.bindBuffer(_gl.ARRAY_BUFFER, _rectangleVertexBuffer.buffer);
            _gl.vertexAttribPointer(visShaderProgram.vertexPositionAttribute, _rectangleVertexBuffer.itemSize, _gl.FLOAT, false, 0, 0);
        }
        _gl.activeTexture(_gl.TEXTURE0);
        _gl.bindTexture(_gl.TEXTURE_2D, _frontBuffer.texture);
        if (_zoomLevelIndex < NEUTRAL_ZOOM_LEVEL_INDEX) {
            _gl.generateMipmap(_gl.TEXTURE_2D);
            _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.LINEAR_MIPMAP_LINEAR);
        }
        _gl.uniform1i(visShaderProgram.samplerUniform, 0);
        var finalViewMatrix = vector_math_1.Matrix2D.multiply(vector_math_1.Matrix2D.multiply(_projectionMatrix, _rotationMatrix), _viewMatrix);
        if (_isGridVisible) {
            _gl.uniform2f(_gridVisShaderProgram.gridPixelSizeUniform, _viewMatrix.m11 / _bufferWidth, _viewMatrix.m22 / _bufferHeight);
            _gl.uniform2f(_gridVisShaderProgram.gridSpacingUniform, ZOOM_GRID_SIZES[_zoomLevelIndex] / _bufferWidth, ZOOM_GRID_SIZES[_zoomLevelIndex] / _bufferHeight);
            _gl.uniform4f(_gridVisShaderProgram.gridColorUniform, 0.9, 0.9, 0.9, 1.0);
        }
        _gl.uniform3f(visShaderProgram.transformXUniform, finalViewMatrix.m11, finalViewMatrix.m12, finalViewMatrix.m13);
        _gl.uniform3f(visShaderProgram.transformYUniform, finalViewMatrix.m21, finalViewMatrix.m22, finalViewMatrix.m23);
        _gl.drawArrays(_gl.TRIANGLE_STRIP, 0, _rectangleVertexBuffer.itemCount);
        if (_zoomLevelIndex < NEUTRAL_ZOOM_LEVEL_INDEX) {
            _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST);
        }
    }
    function iterateGameOfLife() {
        var currentBuffer = _backBuffer;
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, currentBuffer.framebuffer);
        _gl.viewport(0, 0, _bufferWidth, _bufferHeight);
        _gl.clear(_gl.COLOR_BUFFER_BIT);
        if (_currentShaderProgramId != 0) {
            _gl.useProgram(_golShaderProgram);
            _currentShaderProgramId = 0;
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
            _projectionMatrix = vector_math_1.Matrix2D.multiply(vector_math_1.Matrix2D.scale(desiredWidth / _bufferWidth, desiredHeight / _bufferHeight), _squareProjectionMatrix);
        }
    }
    function mapCanvasCoordinatesToViewportCoordinates(p) {
        var hw = _canvas.clientWidth - 1;
        var hh = _canvas.clientHeight - 1;
        return new vector_math_1.Vector2D((2 * p.x - hw) / hw, (hh - 2 * p.y) / hh);
    }
    function mapCanvasTranslationVectorToViewportTranslationVector(v) {
        var hw = _canvas.clientWidth - 1;
        var hh = _canvas.clientHeight - 1;
        return new vector_math_1.Vector2D(2 * v.x / hw, -2 * v.y / hh);
    }
    function mapCanvasCoordinatesToTextureCoordinates(p) {
        return mapCanvasCoordinatesToViewportCoordinates(p).transform(vector_math_1.Matrix2D.multiply(vector_math_1.Matrix2D.multiply(_projectionMatrix, _rotationMatrix), _viewMatrix));
    }
    function mapCanvasCoordinatesToTexturePixelCoordinates(p) {
        return mapCanvasCoordinatesToTextureCoordinates(p).scale(_bufferWidth, _bufferHeight).floor();
    }
    function applyViewportSpaceTransformToView(transform) {
        var projection = vector_math_1.Matrix2D.multiply(_projectionMatrix, _rotationMatrix);
        _viewMatrix = vector_math_1.Matrix2D.multiply(vector_math_1.Matrix2D.multiply(vector_math_1.Matrix2D.multiply(projection.inverse(), transform), projection), _viewMatrix);
    }
    function applyViewportTranslationToView(translationInCanvasPixels) {
        var p = mapCanvasTranslationVectorToViewportTranslationVector(translationInCanvasPixels);
        applyViewportSpaceTransformToView(vector_math_1.Matrix2D.translate(p.x, p.y));
    }
    var NEUTRAL_ZOOM_LEVEL_INDEX = 2;
    var ZOOM_LEVELS = [0.25, 0.5, 1.0, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 8, 16, 32];
    var ZOOM_GRID_SIZES = [32, 16, 8, 8, 8, 8, 4, 4, 4, 4, 1, 1, 1];
    var _zoomLevelIndex = NEUTRAL_ZOOM_LEVEL_INDEX;
    function onWheel(e) {
        if (e.deltaY != 0) {
            e.stopPropagation();
            e.preventDefault();
            var previousZoomLevelIndex = _zoomLevelIndex;
            if (e.deltaY < 0 && _zoomLevelIndex + 1 < ZOOM_LEVELS.length) {
                _zoomLevelIndex++;
            }
            else if (e.deltaY > 0 && _zoomLevelIndex > 0) {
                _zoomLevelIndex--;
            }
            else {
                return;
            }
            var relativeZoomFactor = ZOOM_LEVELS[previousZoomLevelIndex] / ZOOM_LEVELS[_zoomLevelIndex];
            var mousePosition = mapCanvasCoordinatesToViewportCoordinates(new vector_math_1.Vector2D(e.clientX, e.clientY));
            var transform = vector_math_1.Matrix2D.multiply(vector_math_1.Matrix2D.multiply(vector_math_1.Matrix2D.translate(-mousePosition.x, -mousePosition.y), vector_math_1.Matrix2D.scale(relativeZoomFactor, relativeZoomFactor)), vector_math_1.Matrix2D.translate(mousePosition.x, mousePosition.y));
            applyViewportSpaceTransformToView(transform);
        }
    }
    var ACTION_DRAW = 0;
    var ACTION_ERASE = 1;
    var ACTION_PAN = 2;
    var ACTION_ZOOM = 3;
    var TOUCH_MOUSE_BUTTON = 31415;
    var _mouseDownButton = -1;
    var _mouseLastPoint = null;
    function handleMouseMoveAction(point) {
        var actionId;
        switch (_mouseDownButton) {
            case 0:
                actionId = ACTION_DRAW;
                break;
            case 1:
                actionId = ACTION_PAN;
                break;
            case 2:
                actionId = ACTION_ERASE;
                break;
            default: return;
        }
        handleInputAction(actionId, _mouseLastPoint, point);
    }
    function handleInputAction(actionId, startPoint, endPoint) {
        switch (actionId) {
            case ACTION_DRAW:
            case ACTION_ERASE:
                var a = mapCanvasCoordinatesToTexturePixelCoordinates(startPoint);
                var b = mapCanvasCoordinatesToTexturePixelCoordinates(endPoint);
                drawLine(_frontBuffer.texture, a.x, a.y, b.x, b.y, actionId == ACTION_DRAW);
                break;
            case ACTION_PAN:
                applyViewportTranslationToView(startPoint.subtract(endPoint));
                break;
        }
    }
    function onMouseDown(e) {
        if (_mouseDownButton == -1 && e.button >= 0 && e.button < 3) {
            consumeEvent(e);
            _mouseDownButton = e.button;
            _mouseLastPoint = new vector_math_1.Vector2D(e.clientX, e.clientY);
        }
    }
    function onMouseMove(e) {
        if (_mouseDownButton >= 0 && _mouseDownButton < 3) {
            consumeEvent(e);
            var point = new vector_math_1.Vector2D(e.clientX, e.clientY);
            handleMouseMoveAction(point);
            _mouseLastPoint = point;
        }
    }
    function onMouseUp(e) {
        if (_mouseDownButton >= 0 && _mouseDownButton < 3 && _mouseDownButton == e.button) {
            consumeEvent(e);
            handleMouseMoveAction(new vector_math_1.Vector2D(e.clientX, e.clientY));
            _mouseLastPoint = null;
            _mouseDownButton = -1;
        }
    }
    var _trackedTouches = [];
    var _touchAction;
    function onTouchStart(e) {
        if (_mouseDownButton < 0) {
            consumeEvent(e);
            var touches = e.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                _trackedTouches.push({
                    identifier: touch.identifier,
                    position: new vector_math_1.Vector2D(touch.pageX, touch.pageY)
                });
            }
            _touchAction = ACTION_PAN;
            _mouseDownButton = TOUCH_MOUSE_BUTTON;
        }
    }
    function onTouchMove(e) {
        if (_mouseDownButton === TOUCH_MOUSE_BUTTON) {
            consumeEvent(e);
            var touches = e.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var index = findTrackedTouchIndex(touches[i].identifier);
                var oldPosition = _trackedTouches[index].position;
                var newPosition = new vector_math_1.Vector2D(touch.pageX, touch.pageY);
                _trackedTouches[index].position = newPosition;
                handleInputAction(_touchAction, oldPosition, newPosition);
            }
        }
    }
    function onTouchEnd(e) {
        if (_mouseDownButton === TOUCH_MOUSE_BUTTON) {
            consumeEvent(e);
            var touches = e.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                var index = findTrackedTouchIndex(touches[i].identifier);
                var oldPosition = _trackedTouches[index].position;
                var newPosition = new vector_math_1.Vector2D(touch.pageX, touch.pageY);
                handleInputAction(_touchAction, oldPosition, newPosition);
                _trackedTouches.splice(index, 1);
            }
            if (_trackedTouches.length === 0) {
                _mouseDownButton = -1;
            }
        }
    }
    function onTouchCancel(e) {
        if (_mouseDownButton === TOUCH_MOUSE_BUTTON) {
            consumeEvent(e);
            var touches = e.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                var index = findTrackedTouchIndex(touches[i].identifier);
                _trackedTouches.splice(index, 1);
            }
            if (_trackedTouches.length === 0) {
                _mouseDownButton = -1;
            }
        }
    }
    function findTrackedTouchIndex(identifier) {
        for (var i = 0; i < _trackedTouches.length; i++) {
            if (_trackedTouches[i].identifier == identifier)
                return i;
        }
        return -1;
    }
    function consumeEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    function resetView() {
        _zoomLevelIndex = NEUTRAL_ZOOM_LEVEL_INDEX;
        _viewMatrix = vector_math_1.Matrix2D.identity();
    }
    function createRectangleVertexBuffer() {
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
    function getShader(id, kind) {
        var shader = _gl.createShader(kind);
        _gl.shaderSource(shader, shaderValues[id]);
        _gl.compileShader(shader);
        if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
            console.log(_gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    function createShaderProgram(vertexShaderName, fragmentShaderName) {
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
    function createFrameBuffer(width, height) {
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
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.REPEAT);
        _gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.REPEAT);
        _gl.texImage2D(_gl.TEXTURE_2D, 0, _gl.RGBA, width, height, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, null);
        _gl.generateMipmap(_gl.TEXTURE_2D);
        _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_2D, texture, 0);
        _gl.bindTexture(_gl.TEXTURE_2D, null);
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
        return {
            framebuffer: framebuffer,
            texture: texture,
        };
    }
});
