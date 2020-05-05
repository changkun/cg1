import { 
  Scene, WebGLRenderer, OrthographicCamera,
  Euler, Font, Math, GridHelper,
  Vector3, Object3D, Mesh,
  CylinderGeometry, TextGeometry, MeshBasicMaterial, Group
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
      frustum: 40/(window.innerHeight/window.innerWidth),
      aspect: window.innerHeight/window.innerWidth,
      position: new Vector3(0, 10, 20),
      lookAt: new Vector3(0, 10, 0),
    }
    this.camera = new OrthographicCamera(
      param.frustum/-2,             param.frustum/2, 
      param.frustum*param.aspect/2, param.frustum*param.aspect/-2)
    this.camera.position.copy(param.position)
    this.camera.lookAt(param.lookAt)

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
  setupHelpers() {
    this.setupGridPlane()
    this.setupAxes()
  }
  setupGridPlane() {
    const gridParam = {
      size: 150,
      divisions: 150,
      materialOpacity: 0.25,
      materialTransparency: true,
    }
    const helper = new GridHelper(gridParam.size, gridParam.divisions)
    helper.material.opacity = gridParam.materialOpacity
    helper.material.transparent = gridParam.materialTransparency
    helper.rotateX(Math.degToRad(90))
    this.scene.add(helper)
  }
  setupAxes() {
    // Create a better axes, each axis contains a cylinder, 
    // a cone and a text label.
    const axes = new Object3D()
    axes.add(
      this.createAxis('X', 
        new Euler(0, 0, -Math.degToRad(90)), new Vector3(1, 0, 0), 0xdc0015),
      this.createAxis('Y', 
        new Euler(0, 0, 0), new Vector3(0, 1, 0), 0x4caf50),
      // this.createAxis('Z', 
      //   new Euler(Math.degToRad(90), 0, 0), new Vector3(0, 0, 1), 0x1e479d)
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
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 1,
    }
    const axis = new Group()

    // create axis roller
    const line = new Mesh(
      new CylinderGeometry(radius, radius, length, segments),
      new MeshBasicMaterial({ color: color })
    )
    line.setRotationFromEuler(euler)
    axis.add(line)

    // create axis arrow
    const arrow = new Mesh(
      new CylinderGeometry(0, radius*2, height, segments),
      new MeshBasicMaterial({ color: color })
    )
    arrow.translateOnAxis(direction, length/2)
    arrow.setRotationFromEuler(euler)
    axis.add(arrow)

    // create axis label
    const text = new Mesh(
      new TextGeometry(label, {
        font: new Font(fontParam.object),
        size: fontParam.size,
        height: fontParam.height,
        curveSegments: fontParam.curveSegments,
        bevelEnabled: fontParam.bevelEnabled,
        bevelThickness: fontParam.bevelThickness,
        bevelSize: fontParam.bevelSize,
        bevelOffset: fontParam.bavelOffset,
        bevelSegments: fontParam.bavelSegments,
      }),
      new MeshBasicMaterial({ color: color }),
    )
    text.translateOnAxis(direction, length/2 + 0.5)
    text.translateOnAxis(new Vector3(-1, 0, 0), 0.2)
    text.translateOnAxis(new Vector3(0, -1, 0), 0.25)
    axis.add(text)

    return axis
  }
}