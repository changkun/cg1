#version 300 es
precision highp float;

// TODO: receive coefficients and shininess from three.js
//
// the type of received uniform value can be found in:
// https://threejs.org/docs/#api/en/core/Uniform




in vec3 N; // normal
in vec4 x; // shading point
in vec3 L; // light direction
in vec2 uvCoordinates; // uv coordinates

out vec4 outColor;

void main() {
    // TODO: implement the Blinn-Phong reflection model
    // and compute the outColor












    outColor = vec4(1.0);
}