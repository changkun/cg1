import { 
  Scene, WebGLRenderer, PerspectiveCamera, Vector3, AmbientLight, PointLight, HemisphereLight
} from 'three'
import Stats from 'stats.js'

export default class Renderer {
  constructor() {
    const container = document.body
    container.style.overflow = 'hidden'
    container.style.margin = 0
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('webgl2')
    this.renderer = new WebGLRenderer({ canvas: canvas, context: ctx, antialias: true })
    container.appendChild(this.renderer.domElement)
    this.scene = new Scene()
    const params = {
      fov: 45,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: new Vector3(0, 0, 10),
      lookAt: new Vector3(0, 0, -1)
    }
    this.camera = new PerspectiveCamera(
      params.fov, params.aspect, params.near, params.far)
    this.camera.position.copy(params.position)
    this.camera.lookAt(params.lookAt)
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)
    this.stats = new Stats()
    this.stats.showPanel(0)
    container.appendChild(this.stats.domElement)
  }
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.stats.update()
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(() => this.render())
  }
}
