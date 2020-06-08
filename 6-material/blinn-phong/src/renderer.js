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
    const canvas = document.createElement('canvas')
    this.renderer = new WebGLRenderer({ 
      canvas: canvas,
      context: canvas.getContext('webgl2'),
      antialias: true,
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.outputEncoding = sRGBEncoding
    container.appendChild(this.renderer.domElement)

    // scene
    this.scene = new Scene()
    this.scene.fog = new Fog(0xcce0ff, 500, 10000)
    this.scene.background = new Color( 0xcce0ff )

    // camera
    const params = {
      fov: 30,
      aspect: window.innerWidth / window.innerHeight,
      near: 1,
      far: 10000,
      position: new Vector3( 1000, 50, 1500),
      lookAt: new Vector3(0, 0, 0)
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
    this.controls.maxPolarAngle = Math.PI*0.45
    this.controls.minDistance = 400
    this.controls.maxDistance = 5000

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
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(() => this.render())
  }
}
