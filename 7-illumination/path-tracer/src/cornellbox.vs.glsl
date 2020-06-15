#version 300 es

out vec2 uv_coord;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    uv_coord = uv;
}