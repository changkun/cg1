import { 
  Scene, WebGLRenderer, PerspectiveCamera,
  Euler, Font, PointLight, Math, GridHelper, AxesHelper,
  PointLightHelper, Vector3, Object3D, Mesh,
  CylinderGeometry, TextGeometry, MeshBasicMaterial, Group
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json'
import Stats from 'stats.js'

export default class World {
  constructor() {
    const container = document.body
    container.style.overflow = 'hidden'
    container.style.margin = 0

    // 1. create renderer and add to the container
    this.renderer = new WebGLRenderer({ antialias: true })
    container.appendChild(this.renderer.domElement)

    // 2. create scene
    this.scene = new Scene()

    // TODO: 3. create a camera
    const cameraParam = {
      fov: 50,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 2000,
      position: new Vector3(10, 15, 25),
      lookAt: new Vector3(0, 0, 0)
    }





    // TODO: 4. setup orbit controls




    // TODO: 5. (optional) setup performance monitor



  }
  
  // 6. render loop
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    const animate = () => {
      window.requestAnimationFrame(animate)
      // TODO: complete render loop for orbit controls, renderer and
      //       performance monitor




    }
    animate()
  }
  setupScene() {
    this.setupHelpers()
    this.setupBunnies()
    return this
  }
  setupHelpers() {
    this.setupGridPlane()
    this.setupAxes()
    this.setupLight()
  }
  setupAxes() {
    // You can comment out the following two lines to get an urgly 
    // three.js built-in axes.
    //
    // const axesHelper = new AxesHelper(10)
    // this.scene.add(axesHelper)

    // create a better axes, complete the this.createAxis function and
    // make them work as expected. Use Euler angle and direction vector
    // for rotation and translation.
    const axes = new Object3D()
    axes.add(
      this.createAxis('X', 
        new Euler(0, 0, -Math.degToRad(90)), new Vector3(1, 0, 0), 0xdc0015),
      this.createAxis('Y', 
        new Euler(0, 0, 0), new Vector3(0, 1, 0), 0x4caf50),
      this.createAxis('Z', 
        new Euler(Math.degToRad(90), 0, 0), new Vector3(0, 0, 1), 0x1e479d)
    )
    this.scene.add(axes)
  }
  createAxis(label, euler, direction, color) {
    // Provided parameters, use them instead of change them.
    const length = 10
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

    // TODO: 1. create the axis cylinder, use CylinderGeometry and MeshBasicMaterial








    // TODO: 2. create the axis arrow (i.e. the cone), use CylinderGeometry and MeshBasicMaterial








    // TODO: 3. create the text label, use TextGeometry and Font
















    return axis
  }
  setupLight() {
    // Provided parameters, use them instead of change them.
    const lightGroup = new Group()
    const lightParams = {
      color: 0xffffff,
      intensity: 1,
      distance: 50,
      position: new Vector3(10, 10, 10),
    }

    // TODO: 1. create a PointLight and add to the lightGroup




    // TODO: 2. create a PointLightHelper and add to the lightGroup



    this.scene.add(lightGroup)
  }
  setupBunnies() {
    const rabbits = new Group()
    const loader = new GLTFLoader()
    loader.load('assets/bunny.glb', (model => {
      // Provided parameters, use them instead of change them.
      const scale = new Vector3(40, 40, 40)
      const translate = {
        axis: new Vector3(1, 0, 0),
        distance: 8,
      }
      // TODO: duplicate, scale and translate the bunny model, 
      //       then add it to the rabbits group.







    }).bind(this))
    this.scene.add(rabbits)
  }
  setupGridPlane() {
    // Provided parameters, use them instead of change them.
    const gridParam = {
      size: 50,
      divisions: 100,
      materialOpacity: 0.25,
      materialTransparency: true,
    }
    // TODO: create a GridHelper then add it to the scene.





  }
}