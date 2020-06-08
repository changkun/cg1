import Renderer from './renderer'
import { ShaderMaterial, TextureLoader, Vector3, Mesh, PlaneBufferGeometry, PointLightHelper, PointLight, AmbientLight, NearestFilter, RepeatWrapping, sRGBEncoding, MeshStandardMaterial
} from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

// shaders
import flatVS from './shaders/flat/blinn-phong.vs.glsl'
import flatFS from './shaders/flat/blinn-phong.fs.glsl'
import gouraudVS from './shaders/gouraud/blinn-phong.vs.glsl'
import gouraudFS from './shaders/gouraud/blinn-phong.fs.glsl'
import phongVS from './shaders/phong/blinn-phong.vs.glsl'
import phongFS from './shaders/phong/blinn-phong.fs.glsl'

export default class BlinnPhong extends Renderer {
  constructor() {
    super()

    this.assets = {
      bunny: {
        geometry: 'assets/bunny-mesh.obj',
        texture: 'assets/bunny-texture.jpg',
      },
      ground: {
        texture: 'assets/ground.jpg'
      }
    }
    this.params = {
      light: {
        color: 0xffffff,
        distance: 5000,
        position: new Vector3(500, 800, 500),
        Kamb: 0.5,
        Kdiff: 0.6,
        Kspec: 1.0,
        Shininess: 100.0,
      }
    }
    this.light = null
    this.ground = null
    this.bunnies = []
    this.setup()
  }
  async setup() {
    await this.loadAssets()
    this.setupLights()
    this.setupGround()
    this.setupBunny()
    this.setupShadow()
  }
  async loadAssets() {
    const loader = (T, url) => {
      return new Promise(resolve => new T().load(url, resolve))
    }
    const promises = [
      loader(OBJLoader, this.assets.bunny.geometry),
      loader(TextureLoader, this.assets.bunny.texture),
      loader(TextureLoader, this.assets.ground.texture),
    ]
    const assets = await Promise.all(promises)
    this.assets.bunny.geometry = assets[0].children[0].geometry
    this.assets.bunny.texture = assets[1]
    this.assets.bunny.texture.magFilter = NearestFilter
    this.assets.ground.texture = assets[2]
    return
  }
  setupLights() {
    this.light = new PointLight(this.params.light.color,
      this.params.light.Kspec, this.params.light.distance)
    this.light.position.copy(this.params.light.position)
    this.scene.add(this.light)
    this.scene.add(new PointLightHelper(this.light, 100))
    this.scene.add(new AmbientLight(0xffffff, 0.1))
  }
  setupGround() {
    this.assets.ground.texture.wrapS = RepeatWrapping
    this.assets.ground.texture.wrapT = RepeatWrapping
    this.assets.ground.texture.repeat.set(25, 25)
    this.assets.ground.texture.anisotropy = 16
    this.assets.ground.texture.encoding = sRGBEncoding
    this.ground = new Mesh(
      new PlaneBufferGeometry(20000, 20000),
      new MeshStandardMaterial({map: this.assets.ground.texture})
    )
    this.ground.rotateX(-Math.PI/2)
    this.scene.add(this.ground)
  }
  setupBunny() {
    const shaders = {
      flat: {vert: flatVS, frag: flatFS},
      gouraud: {vert: gouraudVS, frag: gouraudFS},
      phong: {vert: phongVS, frag: phongFS},
    }
    const scale = new Vector3(1000, 1000, 1000)
    let i = -300
    for (let name in shaders) {
      const m = new Mesh(
        this.assets.bunny.geometry,
        new ShaderMaterial({
          vertexShader: shaders[name].vert,
          fragmentShader: shaders[name].frag,
          vertexColors: true,
          uniforms: {
            // TODO: pass the bunny's texture, light position,
            // Kamb, Kdiff, Kspec, shininess to custom shaders.









          }
        }),
      )
      m.scale.copy(scale)
      m.translateX(i)
      i += 300
      this.bunnies.push(m)
      this.scene.add(m)
    }
  }
  setupShadow() {
    // TODO: activate shadow map









  }
}

new BlinnPhong().render()