varying vec2 vUv; 
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vMatCapUV;

uniform float uTime;
uniform float uPos;
uniform float uSize;
uniform float uSpeed;
uniform float uSpace;

void main() {
    vUv = uv; 
    vNormal = normal;
    vPosition = position;

    vec4 p = vec4( position, 1. );

    vec3 e = normalize( vec3( modelViewMatrix * p ) );
    vec3 n = normalize( normalMatrix * normal );

    vec3 r = reflect( e, n );
    float m = 2. * sqrt(
        pow( r.x, 2. ) +
        pow( r.y, 2. ) +
        pow( r.z + 1., 2. )
    );
    vMatCapUV = r.xy / m + .5;

    vec3 pos = position;

    float mapPos = position.x*uSize+uPos;
    mapPos /=uSpace;
    mapPos *= 3.14;

    float amp = cos(mapPos)+1.;
    amp /= 2.;
    amp *= 1.;
    if(mapPos <= -3.14 || mapPos >= 3.14){
        amp = 0.;
    }

    float w = sin(position.x*uSize+uTime*uSpeed)*amp;
    pos.y+=w;


    vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
}