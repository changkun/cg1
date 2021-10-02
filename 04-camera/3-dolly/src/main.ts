/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 *
 * Created by Changkun Ou <https://changkun.de> in 2020,
 * modified by Florian Lang <florian.lang@ifi.lmu.de> in 2021.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

import Renderer from './renderer';
import {Mesh, Vector3, Vector2, MeshStandardMaterial, SplineCurve} from 'three';
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';

export default class DollyZoom extends Renderer {
  params: {animate: boolean; distance: number; fov: number};
  bunny: Mesh = new Mesh();
  path: SplineCurve;
  frame: number;
  positive: boolean;
  constructor() {
    super();
    this.params = {
      animate: true,
      distance: 0.5,
      fov: 90,
    };

    // GUI menu for controlling parameters
    this.gui.add(this.params, 'animate').listen();
    this.gui
      .add(this.params, 'distance', 0.5, 7.23, 0.01)
      .listen()
      .onChange(() => this.changeDist());
    this.gui
      .add(this.params, 'fov', 8, 90, 0.01)
      .listen()
      .onChange(() => this.changeFOV());

    this.path = new SplineCurve([
      new Vector2(0.5, 5.15),
      new Vector2(7.23, 0.15),
    ]);
    this.frame = 0;
    this.positive = true;

    this.init();
  }

  init() {
    new GLTFLoader().load('assets/sponza.glb', (gltf: GLTF) => {
      this.scene.add(gltf.scene);
    });
    const loader = new OBJLoader();
    loader.load('assets/bunny.obj', model => {
      this.bunny = <Mesh>model.children[0];
      this.bunny.material = new MeshStandardMaterial({
        color: 0x555555,
        flatShading: true,
      });
      this.bunny.rotateX(Math.PI / 2);
      this.bunny.rotateY(Math.PI / 2);
      this.bunny.rotateZ(-Math.PI / 2);
      this.bunny.position.copy(new Vector3(0, 5, -0.25));
      this.bunny.scale.copy(new Vector3(1, 1, 1));
      this.scene.add(this.bunny);
    });
    return;
  }
  /**
   * returns the needed fov for dolly zoom effect
   * @param {number} dist is the distance between the object and the camera
   */
  dollyZoomFOV(dist: number): number {
    // TODO: calculate the corresponding fov of given distance
    return dist;
  }
  /**
   * returns the needed distance for dolly zoom effect
   * @param {number} fov is the fov of the camera
   */
  dollyZoomDist(fov: number): number {
    // TODO: calculate the corresponding distance of given fov
    return fov;
  }
  /**
   * Update camera parameters including fov and distance to the bunny
   * This function should be called when updating camera transformations.
   */
  cameraAnimate() {
    if (!this.params.animate) {
      return;
    }
    if (this.frame === 1000) {
      this.frame--;
      this.positive = false;
    }
    if (this.frame === 0) {
      this.frame++;
      this.positive = true;
    }

    const p = this.path.getPoint(this.frame / 1000);
    this.camera.position.x = p.x;
    this.params.distance = p.x;
    const fov = this.dollyZoomFOV(this.params.distance);
    this.camera.fov = fov;
    this.params.fov = fov;

    if (this.positive) {
      this.frame++;
    } else {
      this.frame--;
    }
  }
  /**
   * changeFOV is called if the camera distance to the given bunny
   * is changed.
   */
  changeFOV() {
    if (this.params.animate) {
      return;
    }

    // TODO: update the fov of the given camera.

  }
  /**
   * changeDist is called if the camera fov is changed.
   */
  changeDist() {
    if (this.params.animate) {
      return;
    }

    // TODO: update the camera distance to the bunny.

  }
  /**
   * update is executed in the render loop. One can use it to update
   * objects or camera for the next frame.
   */
  update() {
    this.cameraAnimate();
    this.camera.updateProjectionMatrix();
  }
}

new DollyZoom().render();
