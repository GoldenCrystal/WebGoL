precision mediump float;

uniform sampler2D uSampler;
uniform mediump vec2 uPixelSize;

varying mediump vec2 vPosition;

void main(void) {  
    vec3 n = (texture2D(uSampler, vPosition + uPixelSize * vec2(-1.0, -1.0))
        + texture2D(uSampler, vPosition + uPixelSize * vec2(0.0, -1.0))
        + texture2D(uSampler, vPosition + uPixelSize * vec2(1.0, -1.0))

        + texture2D(uSampler, vPosition + uPixelSize * vec2(-1.0, 0.0))
        + texture2D(uSampler, vPosition + uPixelSize * vec2(1.0, 0.0))

        + texture2D(uSampler, vPosition + uPixelSize * vec2(-1.0, 1.0))
        + texture2D(uSampler, vPosition + uPixelSize * vec2(0.0, 1.0))
        + texture2D(uSampler, vPosition + uPixelSize * vec2(1.0, 1.0))).xyz;

    vec3 c = texture2D(uSampler, vPosition).xyz;

    gl_FragColor = vec4(vec3(greaterThan(n, 2.5 - c)) * vec3(lessThan(n, vec3(3.5))), 1.0);
}