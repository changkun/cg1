import Renderer from './renderer'
import { AmbientLight, Mesh, Vector3, PlaneGeometry, MeshBasicMaterial, MeshPhongMaterial, Color, SphereGeometry, DoubleSide, FrontSide, CubeRefractionMapping, CubeCamera, BackSide, PCFSoftShadowMap, DirectionalLight, MeshStandardMaterial } from 'three'

export default class Whitted extends Renderer {
  constructor() {
    super()

    // lights
    const l = new DirectionalLight(0xffffff, 1)
    l.position.copy(new Vector3(10, 13, -2))
    l.castShadow = true
    this.scene.add(l)
    this.scene.add(new AmbientLight(0xffffff, 0.23))

    // Try to use these parameters.
    this.params = {
      radius: 1,
      refractionRatio: 0.7,
      reflectivity: 0.9,
      position: {
        left: new Vector3(2, 1.9, -2.5),
        right: new Vector3(4.2, 2.6, -4.2),
        plane: new Vector3(-8, 0, 0),
      },
      color_sphere: 0xcadcd9,
      color_plane: [new Color(0xcccc00), new Color(0xee0000)],
      plane_width: 30,
      plane_height: 15
    }

    // TODO: create a glass sphere based on MeshBasicMaterial. 
    // Note that the light is refracted when pass through the sphere.

















    // TODO: create a metal sphere based on phong material











    // TODO: create a checkerboard with red and yellow color

    
















    // enable shadows
    this.enableShadow() // do not touch this line.
  }
  update() {
    // TODO: implement update if you needed.




  }
  enableShadow() {
    // TODO: enable shadows of objects you created










  }
}

new Whitted().render()