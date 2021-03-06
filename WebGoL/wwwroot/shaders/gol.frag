﻿precision mediump float;

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

    gl_FragColor = vec4(vec3(n > 2.5 - c && n < 3.5), 1.0);
}