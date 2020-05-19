import Renderer from './renderer'
import { ShaderMaterial, VertexColors, Geometry, Vector3, Face3, Color, Mesh, AxesHelper } from 'three'
import vert from './shaders/vert.glsl'
import frag from './shaders/frag.glsl'

export default class Shader extends Renderer {
  constructor() {
    super()

    // TODO: 1. create a geometry, then push three vertices
    // coordinates: (-5, -3, -10), (0, 5, -10), (10, -5, -10)







    // TODO: 2. create a face for the created geometry
    // replace vertexColors for the face by 0x3399ff, 0x00ffff, 0x5500ee








    // TODO: 3. create a mesh with the geometry that you created in above,
    // then pass the loaded vertex and fragment shader to ShaderMaterial.
    // Enable vertexColor parameter to pass color from threejs to 
    // the fragment shader.









    // TODO: 4. add the created mesh to the scene

  }
}

new Shader().render()