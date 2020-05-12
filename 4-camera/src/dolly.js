import Renderer from './renderer'
import { Mesh, Vector3, Vector2, Geometry, MeshStandardMaterial, SplineCurve } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class DollyZoom extends Renderer {
  constructor() {
    super()
    this.params = {
      animate: true,
      distance: 0.5,
      fov: 90
    }

    // GUI menu for controlling parameters
    this.gui.add(this.params, 'animate').listen()
    this.gui.add(this.params, 'distance', 0.5, 7.23, 0.01)
      .listen().onChange(() => this.changeDist())
    this.gui.add(this.params, 'fov', 8, 90, 0.01)
      .listen().onChange(() => this.changeFOV())

    // Model urls will be replaced by the actual model.
    this.models = {
      bunny: 'assets/bunny.glb',
      sponza: 'assets/sponza.glb',
    }
    this.path = new SplineCurve([
      new Vector2(0.5, 5.15), 
      new Vector2(7.22, 0.15),
    ])
    this.frame = 0
    this.positive = true

    this.init().then(() => this.setup())
  }
  async init() {
    const load = (url) => {
      return new Promise(resolve => {
        new GLTFLoader().load(url, resolve)
      })
    }
    const promises = [
      load(this.models.bunny),
      load(this.models.sponza),
    ]
    const models = await Promise.all(promises)
    this.models.bunny = models[0]
    this.models.sponza = models[1]
    return
  }
  setup() {
    this.scene.add(this.models.sponza.scene)

    const bunny = new Mesh(
      new Geometry().fromBufferGeometry(this.models.bunny.scene.children[0].geometry),
      new MeshStandardMaterial({color: 0x555555, flatShading: true}),
    )
    bunny.rotateX(Math.PI/2)
    bunny.rotateZ(-Math.PI/2)
    bunny.position.copy(new Vector3(0, 5, -0.25))
    bunny.scale.copy(new Vector3(1, 1, 1))
    this.models.bunny = bunny
    this.scene.add(bunny)
  }
  /**
   * returns the needed fov for dolly zoom effect
   * @param {number} dist is the distance between the object and the camera
   */
  dollyZoomFOV(dist) {
    // TODO: calculate the corresponding fov of given distance
    return 0
  }
  /**
   * returns the needed distance for dolly zoom effect
   * @param {number} fov is the fov of the camera
   */
  dollyZoomDist(fov) {
    // TODO: calculate the corresponding distance of given fov
    return 0
  }
  /**
   * Update camera parameters including fov and distance to the bunny
   * This function should be called when updating camera transformations.
   */
  cameraAnimate() {
    // TODO: use this.path for updating camera position















  }
  /**
   * changeFOV is called if the camera distance to the given bunny
   * is changed.
   */
  changeFOV() {
    // TODO: update the fov of the given camera.








  }
  /**
   * changeDist is called if the camera fov is changed.
   */
  changeDist() {
    // TODO: update the camera distance to the bunny.










  }
  /**
   * update is executed in the render loop. One can use it to update
   * objects or camera for the next frame.
   */
  update() {
    // TODO:





  }
}