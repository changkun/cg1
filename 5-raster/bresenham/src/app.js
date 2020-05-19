import { 
  Vector2, Mesh, MeshBasicMaterial, PlaneGeometry
} from 'three'
import Renderer from './renderer'

export default class Application extends Renderer {
  constructor() { 
    super()
    const color = 0xffff00
    const x0 = 40
    const y0 = 40
    const r = 30
    const p1 = new Vector2(x0, y0)
    this.drawPoint(p1.x, p1.y, color)

    let thetas = []
    for (let i = 0; i <=360; i+=15) {
      thetas.push(i)
    }
    thetas.forEach(theta => {
      const x = Math.round(x0 + r * Math.cos(theta * Math.PI / 180))
      const y = Math.round(y0 + r * Math.sin(theta * Math.PI / 180))
      const p2 = new Vector2(x, y)
      this.drawLine(p1, p2, color)
    })


    const tri = [
      new Vector2(80, 30),
      new Vector2(100, 50),
      new Vector2(120, 20),
    ]

    this.drawTriangle(tri[0], tri[1], tri[2], color)
  }
  /**
   * drawPoint draws a given pixel using the given color
   * @param {number} x coordinates
   * @param {number} y coordinates
   * @param {number} color color to fill
   */
  drawPoint(x, y, color) {
    const m = new Mesh(
      new PlaneGeometry(1, 1, 1, 1),
      new MeshBasicMaterial({color: color || 0xffffff})
    )
    m.translateX(x + 0.5)
    m.translateY(y + 0.5)
    this.scene.add(m)
  }

  /**
   * drawLine draws a line with given starting point p1 till 
   * the end point p2 with given color, which implements the
   * Bresenham algorithm.
   * @param {Vector2} p1 start point of the line
   * @param {Vector2} p2 end point of the line
   * @param {number} color color of the line
   */
  drawLine(p1, p2, color) {
    // TODO: implement Bresenham algorithm



























  }
  drawTriangle(v1, v2, v3, color) {
    // TODO: implement the scan line algorithm for filling triangles


























  }
}