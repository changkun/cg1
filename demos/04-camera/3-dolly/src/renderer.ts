/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 *
 * Created by Changkun Ou <https://changkun.de> in 2020,
 * modified by Florian Lang <florian.lang@ifi.lmu.de> in 2021.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Vector3,
  AmbientLight,
  PointLight,
  HemisphereLight,
} from 'three';
import {GUI} from 'dat.gui';

export default class Renderer {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  gui: GUI;

  constructor() {
    const container = document.body;
    container.style.overflow = 'hidden';
    container.style.margin = '0';

    this.renderer = new WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
    this.scene = new Scene();

    const params = {
      fov: 90,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: new Vector3(0.5, 5.15, -0.25),
      lookAt: new Vector3(-1, 5.15, -0.25),
    };
    this.camera = new PerspectiveCamera(
      params.fov,
      params.aspect,
      params.near,
      params.far
    );
    this.camera.position.copy(params.position);
    this.camera.lookAt(params.lookAt);
    window.addEventListener(
      'resize',
      () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      },
      false
    );

    this.gui = new GUI();
    this.gui
      .add({export: () => this.exportScreenshot()}, 'export')
      .name('screenshot');

    this.lights();
  }
  update() {
    // This method is required to be implemented in a subclass for animations.
  }
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const animate = () => {
      window.requestAnimationFrame(animate);
      this.update(); // from subclass.
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }
  lights() {
    this.scene.add(new AmbientLight(0xffffff));
    const light = new PointLight(0xffffff, 1, 1000);
    light.position.copy(new Vector3(-5, 5, 0));
    this.scene.add(light);
    const light2 = new PointLight(0xffffff, 1, 1000);
    light2.position.copy(new Vector3(5, 5, 0));
    this.scene.add(light2);
    this.scene.add(new HemisphereLight(0xffffff, 0x080820, 1));
  }
  exportScreenshot() {
    const url = this.renderer.domElement.toDataURL('image/png', 'export');
    const e = document.createElement('a');
    e.setAttribute('href', url);
    e.style.display = 'none';
    e.setAttribute('download', 'export.png');
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
  }
}
