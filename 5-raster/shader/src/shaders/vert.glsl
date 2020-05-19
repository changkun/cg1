#version 300 es

precision highp float;

// TODO: define the out to transmit the vertex color to
// the subsequent shaders


void main()
{
    // TODO: scale y position by 1.5
    gl_Position = projectionMatrix * modelViewMatrix * vec4(
        position.x,
        position.y,
        position.z,
        1.0
    );
    // TODO: set the vColor out to the color we recieved
    // from the three.js code

}