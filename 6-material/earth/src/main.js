import Renderer from './renderer'
import { TextureLoader, Vector3, Mesh, PointLight, AmbientLight, SphereBufferGeometry, MeshBasicMaterial, MeshPhongMaterial, BackSide, DirectionalLight
} from 'three'

export default class Earth extends Renderer {
  constructor() {
    super()
    this.assets = {
      earth: {
        texture: 'assets/earth-diff.jpg',
        normal: 'assets/earth-normal.jpg',
        displacement: 'assets/earth-dis.jpg',
        spec: 'assets/earth-spec.jpg',
      },
      env: {
        texture: 'assets/stars.jpg',
      }
    }
    this.loadAssets().then(() => this.setup())
  }
  async loadAssets() {
    const loader = (T, url) => {
      return new Promise(resolve => new T().load(url, resolve))
    }
    const promises = [
      loader(TextureLoader, this.assets.earth.texture),
      loader(TextureLoader, this.assets.earth.normal),
      loader(TextureLoader, this.assets.earth.displacement),
      loader(TextureLoader, this.assets.earth.spec),
      loader(TextureLoader, this.assets.env.texture),
    ]
    const assets = await Promise.all(promises)
    this.assets.earth.texture = assets[0]
    this.assets.earth.normal = assets[1]
    this.assets.earth.displacement = assets[2]
    this.assets.earth.spec = assets[3]
    this.assets.env.texture = assets[4]
  }
  setup() {
    const params = {
      light: {
        color: 0xf2dcea,
        position: new Vector3(-20, 0, 0)
      },
      ambient: {
        color: 0xeeeeee,
        intensity: 0.01,
      }
    }

    // TODO: create a directional light and an ambient light
    // using params in above






    // TODO: create a phong material that uses loaded earth texture, 
    // normal map, displacement map, and specular map.













    // TODO: create the earth using SphereBufferGeometry and 
    // the created material, then add the earth to the scene







    // TODO: add a sphere that is bigger enough to fake the sky,
    // and map a environment texture from the inside of the sphere






    this.render() // do not touch this line
  }
  /**
   * update is called in the render loop for on each frame
   */
  update() {
    // TODO: animate the rotation of the earth




  }
}

new Earth()