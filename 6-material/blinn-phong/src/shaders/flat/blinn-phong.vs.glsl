#version 300 es
precision highp float;

// TODO: receive light position from three.js
//
// the type of received uniform value can be found in:
// https://threejs.org/docs/#api/en/core/Uniform



out vec3 x;  // shading point
out vec3 L;  // light direction
out vec2 uvCoordinates;  // uv coordinates

void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // TODO: compute the position of shading point, light direction 
    // and uv coordinates





}