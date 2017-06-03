precision mediump float;

uniform vec2 uGridPixelSize;
uniform vec2 uGridSpacing;
uniform vec4 uGridColor;
const vec4 whiteColor = vec4(1.0, 1.0, 1.0, 1.0);

uniform sampler2D uSampler;

varying vec2 vTexture;

void main(void) {
    vec2 rem = mod(vTexture, uGridSpacing);
    vec4 baseColor = any(lessThan(rem, vec2(uGridPixelSize))) ? uGridColor : whiteColor;
    gl_FragColor = (vec4(1.0, 1.0, 1.0, 2.0) - texture2D(uSampler, vTexture)) * baseColor;
}