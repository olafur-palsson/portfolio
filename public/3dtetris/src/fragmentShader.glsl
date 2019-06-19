precision mediump float;
varying vec2 v_textcoord;
uniform sampler2D u_sampler;

varying float attenuation;

varying vec4 specularColor;
varying float diffuseScalar;
varying vec3 textureColor;
uniform float ambientScalar;

uniform vec3 color;

void main() {
  gl_FragColor = texture2D(u_sampler, v_textcoord); 
  gl_FragColor = vec4(gl_FragColor.x * color.x, gl_FragColor.y * color.y, gl_FragColor.z * color.z, gl_FragColor.w);
  gl_FragColor = attenuation * 
    clamp(gl_FragColor 
      * (ambientScalar + diffuseScalar) 
      + specularColor, 0.0, 1.0
    );
}
