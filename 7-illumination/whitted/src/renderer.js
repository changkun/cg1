import { 
  Scene, WebGLRenderer, PerspectiveCamera, Vector3, Color
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'

export default class Renderer {
  constructor() {
    const container = document.body
    container.style.overflow = 'hidden'
    container.style.margin = 0

    this.renderer = new WebGLRenderer({ antialias: true })
    const c = new Color()
    c.setRGB(0.3, 0.5, 0.9)
    this.renderer.setClearColor(c)
    container.appendChild(this.renderer.domElement)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.scene = new Scene()

    const params = {
      fov: 60,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 3000,
      position: new Vector3(7.5, 2.3, -4.2),
      lookAt: new Vector3(4.2, 2.3, -4.2)
    }
    this.camera = new PerspectiveCamera(
      params.fov, params.aspect, params.near, params.far)
    this.camera.position.copy(params.position)
    this.camera.lookAt(params.lookAt)
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)
    this.stats = new Stats()
    this.stats.showPanel(0)
    container.appendChild(this.stats.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.copy(params.lookAt)
  }
  update() {
    // This method is required to be implemented in a subclass for animations.
  }
  render() {
    this.controls.update()
    this.stats.update()
    this.update() // from subclass
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(() => this.render())
  }
}