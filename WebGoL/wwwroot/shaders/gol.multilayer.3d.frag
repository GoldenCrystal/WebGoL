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

    n = (vec3(n.x + n.y + n.z) + c.yzx + c.zxy);

    /*gl_FragColor = vec4(vec3(greaterThan(n, 8.5 - 3.0 * c)) * vec3(lessThan(n, vec3(9.5))), 1.0);*/
    /*gl_FragColor = vec4(vec3(greaterThan(n, 5.5 - c)) * vec3(lessThan(n, 6.5 + c)), 1.0);*/
    gl_FragColor = vec4(vec3(greaterThan(n, 8.5 - c)) * vec3(lessThan(n, 9.5 + 2.0 * c)), 1.0);
}