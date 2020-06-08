#version 300 es
precision highp float;

// TODO: receive light position from three.js
//
// the type of received uniform value can be found in:
// https://threejs.org/docs/#api/en/core/Uniform
uniform vec3 lightPos;

out vec3 N; // normal
out vec4 x; // shading point
out vec3 L; // light direction
out vec2 uvCoordinates; // uv coordinates

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // TODO: compute the normal, position of shading point, light direction
    // and uv coordinates





}