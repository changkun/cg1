import Renderer from './renderer'
import PerlinNoise from './perlin'
import { Mesh, PointLight, PlaneGeometry, Vector3, MeshStandardMaterial, DoubleSide } from 'three'

export default class Terrain extends Renderer {
  constructor() {
    super()
    this.init()
  }
  init() {
    const params = {
      lightColor: 0xff0000,
      lightPos: new Vector3(10, 10, 0),
      size: 100,
      fragment: 50,
    }

    // TODO: Implement a terrain. Hint: use PerlinNoise.










  }
}
