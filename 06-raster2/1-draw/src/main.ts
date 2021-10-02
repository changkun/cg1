/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 * Created by Changkun Ou <https://changkun.de>.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

import {Vector2, Vector3, Mesh, MeshBasicMaterial, PlaneGeometry} from 'three';
import Renderer from './renderer';

export default class Drawing extends Renderer {
  constructor() {
    super();
    const tri = [
      new Vector2(15.7, 20.2),
      new Vector2(35.3, 50.1),
      new Vector2(55.5, 30.7),
    ];

    this.drawTriangle(tri[0], tri[1], tri[2], 0x2e75b5);
  }
  /**
   * drawTriangle draws a triangle via testing if pixels of a AABB are
   * inside the given triangle.
   * @param v1 is a position
   * @param v2 is a position
   * @param v3 is a position
   * @param color the color to draw
   */
  drawTriangle(v1: Vector2, v2: Vector2, v3: Vector2, color: number) {
    // TODO: implements triangle drawing based on the point-in-triangle assertion
    // Hint: use this.drawPoint to render a grid.

  }
  /**
   * drawPoint draws a given pixel using the given color
   * @param x coordinates
   * @param y coordinates
   * @param color color to fill
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
}

new Drawing().render();
