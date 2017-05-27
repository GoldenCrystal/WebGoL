precision mediump float;

uniform sampler2D uSampler;
uniform mediump vec2 uPixelSize;

varying mediump vec2 vPosition;

void main(void) {
/*
vec4 n = texture2D(uSampler, vPosition + uPixelSize * vec2(-1.0, -1.0))
    + texture2D(uSampler, vPosition + uPixelSize * vec2(0.0, -1.0))
    + texture2D(uSampler, vPosition + uPixelSize * vec2(1.0, -1.0))

    + texture2D(uSampler, vPosition + uPixelSize * vec2(-1.0, 0.0))
    + texture2D(uSampler, vPosition + uPixelSize * vec2(1.0, 0.0))

    + texture2D(uSampler, vPosition + uPixelSize * vec2(-1.0, 1.0))
    + texture2D(uSampler, vPosition + uPixelSize * vec2(0.0, 1.0))
    + texture2D(uSampler, vPosition + uPixelSize * vec2(1.0, 1.0));

vec4 c = texture2D(uSampler, vPosition);

vec4 h = vec4(0.5) * (vec4(1.0) + c);

gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) - step(abs(n - (vec4(1.5) + h)), h);
*/

float n = (texture2D(uSampler, vPosition + uPixelSize * vec2(-1.0, -1.0))
    + texture2D(uSampler, vPosition + uPixelSize * vec2(0.0, -1.0))
    + texture2D(uSampler, vPosition + uPixelSize * vec2(1.0, -1.0))

    + texture2D(uSampler, vPosition + uPixelSize * vec2(-1.0, 0.0))
    + texture2D(uSampler, vPosition + uPixelSize * vec2(1.0, 0.0))

    + texture2D(uSampler, vPosition + uPixelSize * vec2(-1.0, 1.0))
    + texture2D(uSampler, vPosition + uPixelSize * vec2(0.0, 1.0))
    + texture2D(uSampler, vPosition + uPixelSize * vec2(1.0, 1.0))).x;

float c = texture2D(uSampler, vPosition).x;

if (n > 2.5 - c && n < 3.5)
    gl_FragColor = vec4(1, 1, 1, 1);
else
    gl_FragColor = vec4(0, 0, 0, 1);
}