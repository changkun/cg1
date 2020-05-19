#version 300 es

precision highp float;

out vec4 outColor;

// TODO: define the in to receive the (interpolated) vertex color
// from the previous shaders


void main() {
    outColor = vec4(0.5, 0.5, 0.5, 1.0);
}