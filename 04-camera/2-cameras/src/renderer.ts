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
  OrthographicCamera,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GUI} from 'dat.gui';

export class Renderer {
  renderer: WebGLRenderer;
  scene: Scene;
  orthoCamera: OrthographicCamera;
  perspCamera: PerspectiveCamera;
  controls: OrbitControls[];
  gui: GUI;
  menu: {
    cameraType: string;
    near: number;
    far: number;
    fov: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  cameraParam: {
    lookAt: Vector3;
    position: Vector3;
    aspect: number;
  };

  constructor() {
    const container = document.body;
    container.style.overflow = 'hidden';
    container.style.margin = '0';

    this.menu = {
      cameraType: 'Perspective',
      near: 0.1,
      far: 10,
      fov: 45,
      left: -window.innerWidth / 1000, // left
      right: window.innerWidth / 1000, // right
      top: window.innerHeight / 1000, // top
      bottom: -window.innerHeight / 1000, // bottom
    };
    console.log(window.innerWidth / 1000, window.innerHeight / 1000);
    this.gui = new GUI();
    this.gui
      .add({export: () => this.exportScreenshot()}, 'export')
      .name('screenshot');
    this.gui.add(this.menu, 'cameraType', ['Perspective', 'Orthographic']);

    const common = this.gui.addFolder('Common');
    common.open();

    const persp = this.gui.addFolder('PerspCam');
    persp.add(this.menu, 'near', 0.001, 10, 0.001).onChange(v => {
      this.perspCamera.near = v;
    });
    persp.add(this.menu, 'far', 0, 10, 0.01).onChange(v => {
      this.perspCamera.far = v;
    });
    persp.add(this.menu, 'fov', 0, 180, 1).onChange(v => {
      this.perspCamera.fov = v;
    });
    persp.open();

    const ortho = this.gui.addFolder('OrthoCam');
    ortho
      .add(this.menu, 'left', -2, 2, 0.01)
      .listen()
      .onChange(v => {
        this.orthoCamera.left = v;
        this.orthoCamera.right = -v;
        this.menu.right = -v;
      });
    ortho
      .add(this.menu, 'right', -2, 2, 0.01)
      .listen()
      .onChange(v => {
        this.orthoCamera.right = v;
        this.orthoCamera.left = -v;
        this.menu.left = -v;
      });
    ortho
      .add(this.menu, 'top', -2, 2, 0.01)
      .listen()
      .onChange(v => {
        this.orthoCamera.top = v;
        this.orthoCamera.bottom = -v;
        this.menu.bottom = -v;
      });
    ortho
      .add(this.menu, 'bottom', -2, 2, 0.01)
      .listen()
      .onChange(v => {
        this.orthoCamera.bottom = v;
        this.orthoCamera.top = -v;
        this.menu.top = -v;
      });
    ortho.add(this.menu, 'near', -10, 10, 0.01).onChange(v => {
      this.orthoCamera.near = v;
    });
    ortho.add(this.menu, 'far', 0, 10, 0.01).onChange(v => {
      this.orthoCamera.far = v;
    });
    ortho.open();

    this.renderer = new WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.scene = new Scene();
    this.scene.background = new Color('#181818');

    // Common camera parameters
    this.cameraParam = {
      position: new Vector3(0.6, 0.6, 1.5),
      lookAt: new Vector3(0, 0, 0),
      aspect: window.innerWidth / window.innerHeight,
    };

    // Create a perspective camera
    this.perspCamera = new PerspectiveCamera(
      this.menu.fov, // fov
      this.cameraParam.aspect, // aspect
      this.menu.near, // near
      this.menu.far // far
    );
    this.perspCamera.position.copy(this.cameraParam.position);
    this.perspCamera.lookAt(this.cameraParam.lookAt);

    // Create a orthographic camera
    this.orthoCamera = new OrthographicCamera(
      this.menu.left,
      this.menu.right,
      this.menu.top,
      this.menu.bottom,
      this.menu.near,
      this.menu.far
    );
    this.orthoCamera.position.copy(this.cameraParam.position);
    this.orthoCamera.lookAt(this.cameraParam.lookAt);

    // Handle when the window size is changed
    window.addEventListener(
      'resize',
      () => {
        if (this.menu.cameraType === 'Perspective') {
          this.perspCamera.aspect = window.innerWidth / window.innerHeight;
        } else {
          this.orthoCamera.left = -window.innerWidth / 1000;
          this.orthoCamera.right = window.innerWidth / 1000;
          this.orthoCamera.top = window.innerHeight / 1000;
          this.orthoCamera.bottom = -window.innerHeight / 1000;
        }
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      },
      false
    );

    // Create two types of orbit controls
    this.controls = [
      new OrbitControls(this.perspCamera, this.renderer.domElement),
      new OrbitControls(this.orthoCamera, this.renderer.domElement),
    ];
  }
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.update();

    // Render view depending on the camera type
    this.renderer.render(this.scene, this.perspCamera);

    // TODO: Comment the above render call, and render the view depending
    // on the camera type.
    //
    // Hint: you can check the camera type using this.menu.cameraType
    // - Perspective camera is stored in this.perspCamera
    // - Orthographic camera is stored in this.orthoCamera


    // TODO: update projection matrix
    //
    // Hint: you can call .updateProjectionMatrix from different cameras.


    window.requestAnimationFrame(() => this.render());
  }
  /**
   * update is implemented in a subclass
   */
  update() {}
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
