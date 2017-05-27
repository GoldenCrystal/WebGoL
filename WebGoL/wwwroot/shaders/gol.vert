precision mediump float;

attribute vec2 aVertexPosition;

varying vec2 vPosition;

void main(void) {
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    vPosition = clamp(vec2(aVertexPosition), 0.0, 1.0);
}