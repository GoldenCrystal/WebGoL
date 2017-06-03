precision mediump float;

uniform sampler2D uSampler;

varying vec2 vTexture;

void main(void) {
    gl_FragColor = (vec4(1.0, 1.0, 1.0, 2.0) - texture2D(uSampler, vTexture));
}