import Renderer from './renderer'
import {Mesh, PlaneBufferGeometry, ShaderMaterial} from 'three'
import { GUI } from 'dat.gui'
import vert from './cornellbox.vs.glsl'
import frag from './cornellbox.fs.glsl'

class CornellBox extends Renderer {
  constructor() {
    super()
    this.params = { bounces: 2, spp: 1 }
    this.uniforms = {
      pi: {value: Math.PI},
      time: { value: 0 },
      width: {value: window.innerWidth},
      height: {value: window.innerHeight},
      bounces: {value: this.params.bounces},
      spp: {value: this.params.spp},
    }
    this.gui = new GUI()
    this.gui.add(this.params, 'bounces', 0, 20, 1).listen()
      .onChange(v => this.uniforms.bounces.value = v)
    this.gui.add(this.params, 'spp', 0, 20, 1).listen()
      .onChange(v => this.uniforms.spp.value = v)
    const screen = new Mesh(
      new PlaneBufferGeometry(2, 2),
      new ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: this.uniforms,
      })
    )
    this.scene.add(screen)
  }
  update(t) {
    this.uniforms.width.value = window.innerWidth
    this.uniforms.height.value = window.innerHeight
    this.uniforms.time.value = t
  }
}

new CornellBox().render()