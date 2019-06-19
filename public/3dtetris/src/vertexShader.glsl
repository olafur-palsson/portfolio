
attribute vec3 vertexPosition;
attribute vec3 vertexColor;
attribute vec2 a_textcoord;
attribute vec3 vertexNormals;

// Object manipulation
uniform mat4 orientation;
uniform vec3 translation;
uniform float scalar;

// World manipulation
uniform mat4 mWorld;
uniform mat4 mWorldInverse;
uniform mat4 mView;
uniform mat4 mProjection;

// Fragment shader variables
varying vec2 v_textcoord;

// Lighting
uniform vec3 lightPos; // Needs to be normalized before
uniform vec3 lightColor;
uniform vec3 viewDirection;

// Calculated for lighting
varying vec3 reflection; 
varying vec4 specularColor;
varying float diffuseScalar;
varying float specularIntensity;

varying float attenuation;

varying vec4 adjustedPosition;
varying vec4 adjustedNormals;
varying vec3 light;
varying vec3 view;
varying float lightDistance;

void main() {
  adjustedNormals  = orientation * vec4(vertexNormals, 0.0);
  adjustedPosition = orientation * vec4(scalar * vertexPosition, 0.0);

  gl_Position = mProjection
    * mView
    * mWorld
    * (adjustedPosition + vec4(translation, 1.0));
  view = (mWorldInverse * vec4(viewDirection, 1.0)).xyz;
  view = normalize(view);

  lightDistance = length(lightPos - adjustedPosition.xyz + translation);
  light = normalize(lightPos - adjustedPosition.xyz);
  attenuation = 1.0 / pow(lightDistance / 80.0, 2.0) * 4.0 * 3.14;

  specularIntensity = clamp(dot(view, normalize(reflect(light, adjustedNormals.xyz))), 0.0, 1.0);
  specularIntensity = pow(specularIntensity, 64.0);

  specularColor = vec4(specularIntensity * lightColor, 1.0);
  diffuseScalar = max(0.0, 0.0 - dot(normalize(light), normalize(adjustedNormals.xyz)));
  v_textcoord = a_textcoord;
}

