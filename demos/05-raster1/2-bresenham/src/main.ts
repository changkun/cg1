/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 *
 * Created by Changkun Ou <https://changkun.de> in 2020,
 * modified by Florian Lang <florian.lang@ifi.lmu.de> in 2021.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

import {Vector2, Mesh, MeshBasicMaterial, PlaneGeometry} from 'three';
import Renderer from './renderer';

export default class Bresenham extends Renderer {
  constructor() {
    super();
    const color = 0xffff00;
    const x0 = 40;
    const y0 = 40;
    const r = 30;
    const p1 = new Vector2(x0, y0);
    this.drawPoint(p1.x, p1.y, color);

    const thetas = [];
    for (let i = 0; i <= 360; i += 15) {
      thetas.push(i);
    }
    thetas.forEach(theta => {
      const x = Math.round(x0 + r * Math.cos((theta * Math.PI) / 180));
      const y = Math.round(y0 + r * Math.sin((theta * Math.PI) / 180));
      const p2 = new Vector2(x, y);
      this.drawLine(p1, p2, color);
    });

    const tri = [
      new Vector2(80, 30),
      new Vector2(100, 50),
      new Vector2(120, 20),
    ];

    this.drawTriangle(tri[0], tri[1], tri[2], color);
  }
  /**
   * drawPoint draws a given pixel using the given color
   * @param {number} x coordinates
   * @param {number} y coordinates
   * @param {number} color color to fill
   */
  drawPoint(x: number, y: number, color: number) {
    const m = new Mesh(
      new PlaneGeometry(1, 1, 1, 1),
      new MeshBasicMaterial({color: color || 0xffffff})
    );
    m.translateX(x + 0.5);
    m.translateY(y + 0.5);
    this.scene.add(m);
  }

  /**
   * drawLine draws a line with given starting point p1 till
   * the end point p2 with given color, which implements the
   * Bresenham algorithm.
   * @param {Vector2} p1 start point of the line
   * @param {Vector2} p2 end point of the line
   * @param {number} color color of the line
   */
  drawLine(p1: Vector2, p2: Vector2, color: number) {
    // TODO: implement Bresenham algorithm

  }
  drawLineLow(x0: number, y0: number, x1: number, y1: number, color: number) {

  }
  drawLineHigh(x0: number, y0: number, x1: number, y1: number, color: number) {

  }

  drawTriangle(v1: Vector2, v2: Vector2, v3: Vector2, color: number) {
    // TODO: implement the scan line algorithm for filling triangles
    // sort three vertices to guarantee v1.y > v2.y > v3.y

  }
  drawTriangleTop(v1: Vector2, v2: Vector2, v3: Vector2, color: number) {

  }
  drawTriangleBottom(v1: Vector2, v2: Vector2, v3: Vector2, color: number) {

  }
}

new Bresenham().render();
