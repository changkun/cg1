import { 
  Vector3, Mesh, CircleGeometry, MeshBasicMaterial, 
  Geometry, Line, LineBasicMaterial
} from 'three'
import Renderer from './renderer'

export default class Bazier extends Renderer {
  constructor() { 
    super()

    // control points
    this.controlPoints = [
      new Vector3(-20, 10, 0),
      new Vector3(-10, -1, 0),
      new Vector3(10, 7, 0),
      new Vector3(20, 20, 0),
    ]
    this.draw()
  }
  draw() {
    // 1. add control points
    this.controlPoints.forEach(v => {
      const p = new Mesh(
        new CircleGeometry(0.2, 32),
        new MeshBasicMaterial({color: 0xffffff}),
      )
      p.position.copy(v)
      this.scene.add(p)
    })

    // 2. add bazier curve geometry
    const g = new Geometry()
    const samples = 80
    const step = 1/samples
    g.vertices = new Array(samples)
    for (let i = 0; i <= samples; i++) {
      g.vertices[i] = this.createDeCasteljauPointAt(i*step)
    }
    this.scene.add(new Line(g, new LineBasicMaterial({color:0xffffff})))
  }
  /**
   * This function returns the point on bézier curve given t.
   * @param {number} t bézier curve parameter, a float number in [0, 1]
   */
  createDeCasteljauPointAt(t) {
    // TODO: implement de Casteljau's algorithm
    //
    // use this.controlPoints to access the given control points









    return new Vector3(0, 0, 0)
  }
}