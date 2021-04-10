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
  GridHelper,
  AxesHelper,
  Group,
  PointLightHelper,
  PointLight,
  Color,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';

class SimpleWorld {
  // A WebGLRenderer for rendering the world
  renderer: WebGLRenderer;
  // A Scene manages all objects of the world
  scene: Scene;
  // A Camera defines where to look at
  camera: PerspectiveCamera;
  controls: OrbitControls;

  constructor() {
    const container = document.body;
    container.style.overflow = 'hidden';
    container.style.margin = '0';

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
      fov: 40,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: new Vector3(0.3, 0.3, 1.2),
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
    this.setupGridPlane();
    this.setupAxes();
    this.setupBunny();
    this.setupLight();
  }
  setupGridPlane() {
    const gridParam = {
      size: 5,
      divisions: 100,
      materialOpacity: 0.25,
      materialTransparency: true,
    };
    // TODO: 1. Create a GridHelper then add it to the scene.
    // const gh = new GridHelper(gridParam.size, gridParam.divisions);
    // this.scene.add(gh);
  }
  setupAxes() {
    // TODO: 2. Create a AxesHelper then add it to the scene.
    // const ah = new AxesHelper(10);
    // this.scene.add(ah);
  }
  setupBunny() {
    // TODO: 3. Create an OBJ Loader and use the loader to load bunny.obj file.
    // const loader = new OBJLoader();
    // loader.load('assets/bunny.obj', model => {
    //   const mesh = model.children[0];
    //   this.scene.add(mesh);
    // });
  }
  setupLight() {
    const lightParams = {
      color: 0xffffff,
      intensity: 1,
      distance: 5,
      position: new Vector3(0.5, 0.5, 0.5),
    };
    const g = new Group();

    // TODO: 4. Create a PointLight and add to the group, then
    // create a PointLightHelper and also adds to the light group.
    // const light = new PointLight(
    //   lightParams.color,
    //   lightParams.intensity,
    //   lightParams.distance
    // );
    // light.position.copy(lightParams.position);
    // g.add(light);

    // const helper = new PointLightHelper(light, 0.1);
    // g.add(helper);

    // this.scene.add(g);
  }
}

// Create a simple world and render it.
new SimpleWorld().render();
