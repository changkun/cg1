import Renderer from './renderer'
import { Mesh, Vector3, Geometry, MeshStandardMaterial, AmbientLight, PointLight } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier'
import { SubdivisionModifier } from 'three/examples/jsm/modifiers/SubdivisionModifier'

export default class Bunny extends Renderer {
  constructor() {
    super()
    this.scene.add(new AmbientLight(0x333333))


    const loader = new GLTFLoader()
    loader.load('assets/bunny.glb', (model => {

      const modifier = new SimplifyModifier()
      const subdivision = new SubdivisionModifier(2)
      const reduceRatio = 0.95
      const N = 4

      // TODO: Implement repetative subdivision and simplification.





















    }).bind(this))
  }
  
}