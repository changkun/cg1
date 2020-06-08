#version 300 es
precision mediump float;

// TODO: receive light position, bunny's texture, coefficients and
// shininess from three.js
//
// the type of received uniform value can be found in:
// https://threejs.org/docs/#api/en/core/Uniform





out vec4 vColor;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // TODO: implement the Blinn-Phong reflection model
    // and compute the vColor


















    vColor = vec4(1.0);
}