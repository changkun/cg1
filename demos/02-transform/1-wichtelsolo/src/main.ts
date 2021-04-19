/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 * Created by Changkun Ou <https://changkun.de>.
 *
 * Use of this source code is governed by a GNU GLPv3 license that
 * can be found in the LICENSE file.
 */

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Vector3,
  PointLight,
  Color,
  MathUtils,
  Object3D,
  Euler,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {VRMLLoader} from 'three/examples/jsm/loaders/VRMLLoader';
import {GUI} from 'dat.gui';

interface menu {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  transX: number;
  transY: number;
  transZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
}

class SimpleWorld {
  // A WebGLRenderer for rendering the world
  renderer: WebGLRenderer;
  // A Scene manages all objects of the world
  scene: Scene;
  // A Camera defines where to look at
  camera: PerspectiveCamera;
  // A OrbitController which allows to rotate the scene using mouse
  controls: OrbitControls;
  // A GUI menu for controlling parameters
  gui: GUI;
  // All parameters on the GUI menu
  menuParams: menu;

  constructor() {
    const container = document.body;
    container.style.overflow = 'hidden';
    container.style.margin = '0';

    this.menuParams = {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      transX: 0,
      transY: 0,
      transZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
    };

    this.gui = new GUI();
    const r = this.gui.addFolder('rotation');
    ['rotateX', 'rotateY', 'rotateZ'].forEach(v => {
      r.add(this.menuParams, v, 0, 360, 0.001).onChange(() =>
        this.setupEulerAngle()
      );
    });
    r.open();

    const t = this.gui.addFolder('translate');
    ['transX', 'transY', 'transZ'].forEach(v => {
      t.add(this.menuParams, v, -5, 5, 0.001).onChange(() =>
        this.setupTranslate()
      );
    });
    t.open();

    const s = this.gui.addFolder('scale');
    ['scaleX', 'scaleY', 'scaleZ'].forEach(v => {
      s.add(this.menuParams, v, -5, 5, 0.001).onChange(() => this.setupScale());
    });
    s.open();

    // Create renderer and add to the container
    this.renderer = new WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Create scene
    this.scene = new Scene();
    this.scene.background = new Color('#181818');

    // Create a camera
    const cameraParam = {
      fov: MathUtils.radToDeg(0.7),
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: new Vector3(0, 0.75, 2.5),
      lookAt: new Vector3(0, 0, 0),
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

    // Setup orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.15;

    // setup everything
    this.setup();
  }
  // The render loop
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.render());
  }
  setup() {
    this.setupMan();
    this.setupLight();
  }
  setupMan() {
    const loader = new VRMLLoader();
    loader.load('assets/wichtelsolo.wrl', model => {
      const mesh = model.children[0];
      mesh.name = 'tinman';
      this.scene.add(mesh);
    });
  }
  setupLight() {
    const lightParams = {
      color: 0xffffff,
      intensity: 1.5,
      distance: 6,
      position: this.camera.position,
    };
    const light = new PointLight(
      lightParams.color,
      lightParams.intensity,
      lightParams.distance
    );
    light.position.copy(lightParams.position);
    this.scene.add(light);
  }
  setupEulerAngle() {
    const o = <Object3D>this.scene.getObjectByName('tinman');
    o.setRotationFromEuler(
      new Euler(
        MathUtils.degToRad(this.menuParams.rotateX),
        MathUtils.degToRad(this.menuParams.rotateY),
        MathUtils.degToRad(this.menuParams.rotateZ),
        'XYZ'
      )
    );
  }
  setupTranslate() {
    const o = <Object3D>this.scene.getObjectByName('tinman');

    // TODO: set o.position by this.menuParams.trans*
    // Hint: you can use:
    //  1. o.position.copy(new Vector(x, y, z)), or
    //  2. directly set o.position.x = ..., etc.





  }
  setupScale() {
    const o = <Object3D>this.scene.getObjectByName('tinman');

    // TODO: set o.scale by this.menuParams.scale*
    // Hint: you can use:
    //  1. o.scale.copy(new Vector(x, y, z)), or
    //  2. directly set o.scale.x = ..., etc.




  }
}

// Create a simple world and render it.
new SimpleWorld().render();
