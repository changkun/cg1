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
  PointLight,
  Color,
  MathUtils,
  BufferGeometry,
  BufferAttribute,
  Mesh,
  MeshPhongMaterial,
  AmbientLight,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

class Tetrahedron {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  controls: OrbitControls;

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
    this.scene.background = new Color('#181818');

    const cameraParam = {
      fov: MathUtils.radToDeg(0.7),
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: new Vector3(0, 0.75, 3.5),
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

    this.camera.add(new AmbientLight(0xffffff, 0.15));
    this.camera.add(new PointLight(0xffffff));
    this.scene.add(this.camera);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.15;

    this.setup();
  }
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.render());
  }
  setup() {
    // vertex position buffer
    const vbo = new Float32Array([
      -0.363322,
      -0.387725,
      0.85933, // 0
      -0.55029,
      -0.387725,
      -0.682297, // 1
      -0.038214,
      0.990508,
      -0.126177, // 2
      0.951827,
      -0.215059,
      -0.050857, // 3
    ]);

    // create a buffer-based geometry
    const g = new BufferGeometry();
    g.setIndex([
      // TODO: fill the vertex indices
    ]);
    g.setAttribute('position', new BufferAttribute(vbo, 3));

    const t = new Mesh(
      g,
      new MeshPhongMaterial({flatShading: true, color: 0xff0000})
    );
    this.scene.add(t);
  }
}

// Create a tetrahedron and render it.
new Tetrahedron().render();
