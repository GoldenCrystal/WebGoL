precision mediump float;

attribute vec2 aVertexPosition;

uniform vec3 uTransformX;
uniform vec3 uTransformY;

varying vec2 vTexture;

void main(void) {
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    vec3 p = vec3(aVertexPosition, 1.0);
    vTexture = vec2(dot(p, uTransformX), dot(p, uTransformY));
}