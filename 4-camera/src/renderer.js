import { 
  Scene, WebGLRenderer, PerspectiveCamera, Vector3, AmbientLight, PointLight, HemisphereLight
} from 'three'
import { GUI } from 'dat.gui'
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
      far: 1000,
      position: new Vector3(0.5, 5.15, -0.25),
      lookAt: new Vector3(-1, 5.15, -0.25)
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

    this.gui = new GUI()

    this.lights()
  }
  update() {
    // This method is required to be implemented in a subclass for animations.
  }
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    const animate = () => {
      window.requestAnimationFrame(animate)
      this.stats.update()
      this.update() // from subclass.
      this.renderer.render(this.scene, this.camera)
    }
    animate()
  }
  lights() {
    this.scene.add(new AmbientLight(0xffffff))
    const light = new PointLight(0xffffff, 1, 1000);
    light.position.copy(new Vector3(-5, 5, 0))
    this.scene.add(light)
    const light2 = new PointLight(0xffffff, 1, 1000);
    light2.position.copy(new Vector3(5, 5, 0))
    this.scene.add(light2)
    this.scene.add(new HemisphereLight( 0xffffff, 0x080820, 1 ))
  }
}