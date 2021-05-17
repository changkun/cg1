/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 * Created by Changkun Ou <https://changkun.de>.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Vector3,
  Color,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

export class Renderer {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  controls: OrbitControls;

  constructor() {
    const container = document.body;
    container.style.overflow = 'hidden';
    container.style.margin = '0';

    const canvas = document.createElement('canvas');
    const ctx = <WebGL2RenderingContext>canvas.getContext('webgl2');
    this.renderer = new WebGLRenderer({
      canvas: canvas,
      context: ctx,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.scene = new Scene();
    this.scene.background = new Color('#181818');

    const cameraParam = {
      fov: 60,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: new Vector3(
        0.36095456208499446,
        0.4018828146684531,
        0.6923440448696763
      ),
      lookAt: new Vector3(
        0.3140197098857927,
        -0.37541713209832145,
        -0.9267499256335501
      ),
    };
    this.camera = new PerspectiveCamera(
      cameraParam.fov,
      cameraParam.aspect,
      cameraParam.near,
      cameraParam.far
    );
    this.camera.position.copy(cameraParam.position);
    this.camera.lookAt(cameraParam.lookAt);
    window.addEventListener(
      'resize',
      () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.updateProjectionMatrix();
      },
      false
    );
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = cameraParam.lookAt;
  }
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
    window.requestAnimationFrame(() => this.render());
  }
}
