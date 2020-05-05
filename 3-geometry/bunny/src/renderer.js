import { 
  Scene, WebGLRenderer, PerspectiveCamera, Vector3
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'

export default class Renderer {
  constructor() {
    const container = document.body
    container.style.overflow = 'hidden'
    container.style.margin = 0

    this.renderer = new WebGLRenderer({ antialias: true })
    container.appendChild(this.renderer.domElement)
    this.scene = new Scene()
    const params = {
      fov: 90,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 2000,
      position: new Vector3(-5, 5, 10),
      lookAt: new Vector3(0, 0, 0)
    }
    this.camera = new PerspectiveCamera(
      params.fov, params.aspect, params.near, params.far)
    this.camera.position.copy(params.position)
    this.camera.lookAt(params.lookAt)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.copy(params.lookAt)

    this.stats = new Stats()
    this.stats.showPanel(0)
    container.appendChild(this.stats.domElement)
  }
  // 6. render loop
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    const animate = () => {
      window.requestAnimationFrame(animate)
      this.controls.update()
      this.stats.begin()
      this.renderer.render(this.scene, this.camera)
      this.stats.end()
    }
    animate()
  }
}