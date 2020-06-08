import { 
  Scene, WebGLRenderer, PerspectiveCamera, Vector3, Fog, Color, sRGBEncoding
} from 'three'
import Stats from 'stats.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Renderer {
  constructor() {
    // renderer
    const container = document.body
    container.style.overflow = 'hidden'
    container.style.margin = 0
    this.renderer = new WebGLRenderer({antialias: true})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.outputEncoding = sRGBEncoding
    container.appendChild(this.renderer.domElement)

    // scene
    this.scene = new Scene()

    // camera
    const params = {
      fov: 50,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: new Vector3(-10, 3, 10),
      lookAt: new Vector3(0, 0, -1)
    }
    this.camera = new PerspectiveCamera(
      params.fov, params.aspect, params.near, params.far)
    this.camera.position.copy(params.position)
    this.camera.lookAt(params.lookAt)
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.camera.updateProjectionMatrix()
    }, false)

    // orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.copy(params.lookAt)

    // monitor
    this.stats = new Stats()
    this.stats.showPanel(0)
    container.appendChild(this.stats.domElement)
  }
  render() {
    // render loop
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.controls.update()
    this.stats.update()
    this.update()
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(() => this.render())
  }
}
