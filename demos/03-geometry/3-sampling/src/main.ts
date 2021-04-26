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
  PointLight,
  Color,
  Mesh,
  BufferGeometry,
  Geometry,
  MeshPhongMaterial,
  Object3D,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {SimplifyModifier} from 'three/examples/jsm/modifiers/SimplifyModifier';
import {GUI} from 'dat.gui';
import {SubdivisionModifier} from 'three/examples/jsm/modifiers/SubdivisionModifier';

interface menu {
  simplify: number;
  subdivide: number;
  repeat: number;
  sampling: () => void;
  clear: () => void;
}

class MeshSampling {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  gui: GUI;
  menuParam: menu;
  sampledMeshes: string[];

  constructor() {
    const container = document.body;
    container.style.overflow = 'hidden';
    container.style.margin = '0';

    this.menuParam = {
      simplify: 0.95,
      subdivide: 2,
      repeat: 10,
      sampling: () => {
        const m = <Mesh>this.scene.getObjectByName('root');
        this.meshSampling(m);
      },
      clear: () => {
        this.meshClear();
      },
    };

    this.gui = new GUI();
    this.gui
      .add({export: () => this.exportScreenshot()}, 'export')
      .name('screenshot');
    this.gui.add(this.menuParam, 'simplify', 0.9, 1, 0.001);
    this.gui.add(this.menuParam, 'subdivide', 1, 4, 1);
    this.gui.add(this.menuParam, 'repeat', 0, 10, 2);
    this.gui.add(this.menuParam, 'sampling');
    this.gui.add(this.menuParam, 'clear');

    this.renderer = new WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.scene = new Scene();
    this.scene.background = new Color('#181818');

    const cameraParam = {
      fov: 40,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: new Vector3(-0.3, 0.3, 1.2),
      lookAt: new Vector3(0.5, 0, 0),
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
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.15;

    const gridParam = {
      size: 5,
      divisions: 100,
      materialOpacity: 0.25,
      materialTransparency: true,
    };
    const gh = new GridHelper(gridParam.size, gridParam.divisions);
    this.scene.add(gh);

    const lightParams = {
      color: 0xffffff,
      intensity: 1,
      distance: 5,
      position: new Vector3(0.5, 0.5, 0.5),
    };
    const light = new PointLight(
      lightParams.color,
      lightParams.intensity,
      lightParams.distance
    );
    light.position.copy(lightParams.position);
    this.scene.add(light);

    this.sampledMeshes = [];

    this.setupBunnies();
  }
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.render());
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
  setupBunnies() {
    const loader = new OBJLoader();
    loader.load('assets/bunny.obj', model => {
      const mesh = <Mesh>model.children[0];
      mesh.material = new MeshPhongMaterial({color: 0x42a0dc});
      mesh.name = 'root';
      this.scene.add(mesh);
      this.meshSampling(mesh);
    });
  }
  meshClear() {
    for (let i = 0; i < this.sampledMeshes.length; i++) {
      const m = <Object3D>this.scene.getObjectByName(this.sampledMeshes[i]);
      this.scene.remove(m);
    }
    this.sampledMeshes = [];
  }

  /**
   * meshSampling repeats subdivision and simplification modifiers for the given mesh.
   * @param mesh is a given mesh
   */
  meshSampling(mesh: Mesh) {
    this.meshClear();

    const modSim = new SimplifyModifier();
    const modSub = new SubdivisionModifier(this.menuParam.subdivide);
    const addBunny = (g: Geometry, i: number, color: number) => {
      const bunny = new Mesh(
        g,
        new MeshPhongMaterial({flatShading: true, color: color})
      );
      bunny.translateX(i / 5);
      bunny.name = `bunny-${i}`;
      this.sampledMeshes.push(bunny.name);
      this.scene.add(bunny);
    };

    let g = new Geometry().fromBufferGeometry(<BufferGeometry>mesh.geometry);
    g.mergeVertices();
    for (let i = 1; i <= this.menuParam.repeat; i += 2) {
      // subdivision
      g = <Geometry>modSub.modify(g);
      addBunny(g, i, 0xa31515);

      // simplification
      g = new Geometry().fromBufferGeometry(
        modSim.modify(
          g,
          Math.floor(g.vertices.length * this.menuParam.simplify)
        )
      );
      addBunny(g, i + 1, 0x098658);
    }
  }
}

new MeshSampling().render();
