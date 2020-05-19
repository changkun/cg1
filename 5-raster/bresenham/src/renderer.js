import { 
  Scene, WebGLRenderer, OrthographicCamera,
  Euler, Font, Math, GridHelper,
  Vector3, Object3D, Mesh, Geometry, Line, LineBasicMaterial, LineSegments,
  CylinderGeometry, TextGeometry, MeshBasicMaterial, Group, PlaneGeometry
} from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
import Stats from 'stats.js'

export default class Renderer {
  constructor() {
    const container = document.body
    container.style.overflow = 'hidden'
    container.style.margin = 0

    this.renderer = new WebGLRenderer({ antialias: true })
    container.appendChild(this.renderer.domElement)
    this.scene = new Scene()

    const param = {
      frustum: 100 / (window.innerHeight/window.innerWidth),
      aspect: window.innerHeight/window.innerWidth,
      position: new Vector3(0, 10, 10),
      lookAt: new Vector3(0, 10, 0),
    }
    this.camera = new OrthographicCamera(
      -0.3*param.frustum/2,             1.5*param.frustum/2, 
      1.5*param.frustum*param.aspect/2, -0.3*param.frustum*param.aspect/2)
    this.camera.position.copy(param.position)
    this.camera.lookAt(param.lookAt)
    window.addEventListener('resize', () => {
      const aspect = window.innerWidth / window.innerHeight
      const change = param.aspect / aspect
      const newsize = param.frustum * change
      this.camera.left = 0.3*aspect*newsize / - 2;
      this.camera.right = 1.5*aspect*newsize / 2;
      this.camera.top = 1.5*newsize / 2;
      this.camera.bottom = -0.3*newsize / 2;
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)
    this.controls = new TrackballControls(this.camera, this.renderer.domElement)
    this.controls.noRotate = true
    this.controls.panSpeed = 10
    this.controls.target.copy(param.lookAt)

    this.stats = new Stats()
    this.stats.showPanel(0)
    container.appendChild(this.stats.domElement)

    // init helpers
    this.setupHelpers()
  }
  update() {
    // This method is required to be implemented in a subclass for animations.
  }
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.controls.update()
    this.stats.update()
    this.update() // from subclass
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(() => this.render())
  }
  setupHelpers() {
    this.setupGridPlane()
    this.setupAxes()
  }
  setupGridPlane() {
    const gridParam = {
      size: 1000,
      divisions: 1000,
      materialOpacity: 0.15,
      materialTransparency: true,
    }
    const helper = new GridHelper(gridParam.size, gridParam.divisions)
    helper.material.opacity = gridParam.materialOpacity
    helper.material.transparent = true
    helper.rotateX(-Math.degToRad(90))
    helper.translateX(gridParam.size / 2)
    helper.translateZ(gridParam.size / 2)
    this.scene.add(helper)
  }
  setupAxes() {
    const axes = new Object3D()
    axes.add(
      this.createAxis('X', 
        new Euler(0, 0, -Math.degToRad(90)), new Vector3(1, 0, 0), 0xdc0015),
      this.createAxis('Y', 
        new Euler(0, 0, 0), new Vector3(0, 1, 0), 0x4caf50),
    )
    this.scene.add(axes)
  }
  createAxis(label, euler, direction, color) {
    const length = 50
    const radius = 0.05
    const height = 0.3
    const segments = 32
    const fontParam = {
      object: helvetiker,
      size: 0.5,
      height: 0.1,
      curveSegments: 1,
    }
    const axis = new Group()

    // create axis roller
    const line = new Mesh(
      new CylinderGeometry(radius, radius, length, segments),
      new MeshBasicMaterial({ color: color })
    )
    line.translateOnAxis(direction, length/2)
    line.setRotationFromEuler(euler)
    axis.add(line)

    // create axis arrow
    const arrow = new Mesh(
      new CylinderGeometry(0, radius*2, height, segments),
      new MeshBasicMaterial({ color: color })
    )
    arrow.translateOnAxis(direction, length)
    arrow.setRotationFromEuler(euler)
    axis.add(arrow)

    // create axis label
    const text = new Mesh(
      new TextGeometry(label, {
        font: new Font(fontParam.object),
        size: fontParam.size,
        height: fontParam.height,
      }),
      new MeshBasicMaterial({ color: color }),
    )
    text.translateOnAxis(direction, length + 0.5)
    text.translateOnAxis(new Vector3(-1, 0, 0), 0.2)
    text.translateOnAxis(new Vector3(0, -1, 0), 0.25)
    axis.add(text)

    return axis
  }
}