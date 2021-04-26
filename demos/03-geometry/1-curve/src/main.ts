/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 * Created by Changkun Ou <https://changkun.de>.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

import {
  Vector3,
  LineBasicMaterial,
  BufferGeometry,
  Line,
  Mesh,
  MeshBasicMaterial,
  BufferAttribute,
  BoxGeometry,
  Object3D,
  Group,
  Vector2,
} from 'three';
import {DragControls} from 'three/examples/jsm/controls/DragControls';
import {Renderer} from './renderer';
import {GUI} from 'dat.gui';

interface menu {
  samples: number;
  show: boolean;
  t: number;
}

class BezierCurve extends Renderer {
  controlPoints: Vector2[];
  gui: GUI;
  menuParams: menu;

  constructor() {
    super();
    this.menuParams = {
      samples: 80,
      show: false,
      t: 0.5,
    };
    this.gui = new GUI();
    this.gui.add(this.menuParams, 'samples', 1, 100, 1).onChange(() => {
      this.drawCurve();
    });
    this.gui.add(this.menuParams, 'show').onChange(() => {
      this.visualizeDeCasteljauPoint();
    });
    this.gui.add(this.menuParams, 't', 0, 1, 0.01).onChange(() => {
      this.visualizeDeCasteljauPoint();
    });

    // Control points
    this.controlPoints = [
      // TODO: add more points.
      new Vector2(-20, 10),
      new Vector2(-10, -1),
      new Vector2(10, -7),
      new Vector2(20, 20),
      // For example:
      // new Vector2(-10, 20),
    ];

    // The actual geometry to render
    const points: Mesh[] = [];
    this.controlPoints.forEach((v, index) => {
      const p = new Mesh(
        new BoxGeometry(1, 1),
        new MeshBasicMaterial({color: 0x569cd6})
      );
      p.position.x = v.x;
      p.position.y = v.y;
      p.name = `${index}`;
      points.push(p);
      this.scene.add(p);
    });

    // Handling drag events
    const controls = new DragControls(
      points,
      this.camera,
      this.renderer.domElement
    );
    controls.addEventListener('drag', event => {
      const idx = parseInt(event.object.name);
      this.controlPoints[idx].x = event.object.position.x;
      this.controlPoints[idx].y = event.object.position.y;
      this.drawCurve();
      this.visualizeDeCasteljauPoint();
    });

    this.drawCurve();
    this.visualizeDeCasteljauPoint();
  }
  /**
   * drawCurve draws a bezier curve based on sampling.
   */
  drawCurve() {
    // clear old curve if possible.
    const name = 'bézier';
    const b = <Object3D>this.scene.getObjectByName(name);
    this.scene.remove(b);

    // draw the bezier curve
    const g = new BufferGeometry();
    const step = 1 / this.menuParams.samples;
    const vbo = new Float32Array(3 * this.menuParams.samples + 3);
    for (let i = 0; i <= this.menuParams.samples; i++) {
      const p = this.sampleDeCasteljauPointAt(i * step);
      vbo[3 * i + 0] = p.x;
      vbo[3 * i + 1] = p.y;
    }
    g.setAttribute('position', new BufferAttribute(vbo, 3));
    const l = new Line(
      g,
      new LineBasicMaterial({color: 0xffffff, linewidth: 3})
    );
    l.name = name;
    this.scene.add(l);
  }
  /**
   * sampleDeCasteljauPointAt returns the point on bézier curve given t.
   * @param {number} t bézier curve parameter, a float number in [0, 1]
   */
  sampleDeCasteljauPointAt(t: number): Vector2 {
    const n = this.controlPoints.length;

    // Make a copy of our controlpoints to not override this.controlPoints.
    const tc = new Array<Vector2>(n);
    for (let i = 0; i < n; i++) {
      tc[i] = this.controlPoints[i].clone();
    }

    // The de Casteljau algorithm.
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n - j - 1; i++) {
        const b01 = this.interpolate(tc[i], tc[i + 1], t);
        tc[i].x = b01.x;
        tc[i].y = b01.y;
      }
    }
    return tc[0];
  }
  interpolate(b0: Vector2, b1: Vector2, t: number): Vector2 {
    // TODO: implement the de Casteljau algorithm
    const x = 0;
    const y = 0;
    return new Vector2(x, y);
  }
  /**
   * visualizeDeCasteljauPoint draws the calculation process of the
   * de Casteljau algorithm at t.
   */
  visualizeDeCasteljauPoint() {
    // Clear old curve if possible.
    const name = 'intermediate-process';
    const b = <Object3D>this.scene.getObjectByName(name);
    this.scene.remove(b);

    // Prepare the visualization group
    const g = new Group();
    g.name = name;

    const n: number = this.controlPoints.length;
    const tc: Vector2[] = new Array<Vector2>(n);
    for (let i = 0; i < n; i++) {
      tc[i] = this.controlPoints[i].clone();
    }

    for (let j = 0; j < n; j++) {
      if (this.menuParams.show) {
        const points = [];
        for (let i = 0; i <= this.controlPoints.length - j - 1; i++) {
          points.push(new Vector3(tc[i].x, tc[i].y, 0));
        }
        g.add(
          new Line(
            new BufferGeometry().setFromPoints(points),
            new LineBasicMaterial({
              color: 0x666666,
              linewidth: 1,
            })
          )
        );
      }

      for (let i = 0; i < n - j - 1; i++) {
        const b01 = this.interpolate(tc[i], tc[i + 1], this.menuParams.t);
        tc[i].x = b01.x;
        tc[i].y = b01.y;
      }
    }

    // Create the final point on the Bézier curve.
    const p = new Mesh(
      new BoxGeometry(0.5, 0.5),
      new MeshBasicMaterial({color: 0xffffff})
    );
    p.position.x = tc[0].x;
    p.position.y = tc[0].y;
    g.add(p);

    // Add the visualization group to the scene.
    this.scene.add(g);
  }
}

new BezierCurve().render();
