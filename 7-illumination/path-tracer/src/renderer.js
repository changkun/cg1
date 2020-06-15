import { 
  Scene, WebGLRenderer, OrthographicCamera,
} from 'three'
import Stats from 'stats.js'

export default class Renderer {
  constructor() {
    const container = document.body
    container.style.overflow = 'hidden'
    container.style.margin = 0
    const canvas = document.createElement('canvas')
    this.renderer = new WebGLRenderer({ 
      canvas: canvas,
      context: canvas.getContext('webgl2'),
    })
    container.appendChild(this.renderer.domElement)
    this.scene = new Scene()
    this.camera = new OrthographicCamera(-1, 1, 1, -1, -1, 1)
    this.stats = new Stats()
    this.stats.showPanel(0)
    container.appendChild(this.stats.domElement)
  }
  render(t) {
    t *= 0.001
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.stats.update()
    this.update(t)
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(t => this.render(t))
  }
}
