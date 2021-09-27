varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vMatCapUV;

uniform sampler2D uMatCap;

void main() {

    vec4 matTex = texture2D(uMatCap,vMatCapUV);

    gl_FragColor = vec4(matTex);
}