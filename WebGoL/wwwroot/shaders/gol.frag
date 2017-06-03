precision mediump float;

uniform sampler2D uSampler;
uniform mediump vec2 uPixelSize;

varying mediump vec2 vPosition;

void main(void) {  
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