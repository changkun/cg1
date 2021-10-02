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
  Group,
  PointLight,
  Color,
  Euler,
  MathUtils,
  TextGeometry,
  MeshBasicMaterial,
  Mesh,
  Font,
  CylinderGeometry,
  SphereGeometry,
  TextureLoader,
  Quaternion,
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {GUI} from 'dat.gui';
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json';

class SceneGraph {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  gui: GUI;
  theta: number;

  constructor() {
    const container = document.body;
    container.style.overflow = 'hidden';
    container.style.margin = '0';

    this.gui = new GUI();
    this.gui
      .add({export: () => this.exportScreenshot()}, 'export')
      .name('screenshot');

    this.renderer = new WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.scene = new Scene();
    this.scene.background = new Color('#181818');

    const cameraParam = {
      fov: 45,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 1000,
      position: new Vector3(0.6, 0.6, 1.5),
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

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.15;

    this.theta = 0;

    this.setup();
  }
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls.update();
    this.update();
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
  setup() {
    this.setupGridPlane();
    this.setupAxes();
    this.setupLight();
    this.setupBunny();
  }
  setupGridPlane() {
    const gridParam = {
      size: 5,
      divisions: 100,
      materialOpacity: 0.25,
      materialTransparency: true,
    };
    const gh = new GridHelper(gridParam.size, gridParam.divisions);
    this.scene.add(gh);
  }
  setupAxes() {
    const axes = new Group();
    axes.add(
      this.createAxis(
        'X',
        new Euler(0, 0, -MathUtils.degToRad(90)),
        new Vector3(1, 0, 0),
        0xdc0015
      ),
      this.createAxis('Y', new Euler(0, 0, 0), new Vector3(0, 1, 0), 0x4caf50),
      this.createAxis(
        'Z',
        new Euler(MathUtils.degToRad(90), 0, 0),
        new Vector3(0, 0, 1),
        0x1e479d
      )
    );
    this.scene.add(axes);
  }
  createAxis(label: string, euler: Euler, direction: Vector3, color: number) {
    const length = 1;
    const radius = 0.003;
    const height = 0.01;
    const segments = 32;
    const fontParam = {
      object: helvetiker,
      size: 0.03,
      height: 0.01,
    };
    const axis = new Group();

    const line = new Mesh(
      new CylinderGeometry(radius, radius, length, segments),
      new MeshBasicMaterial({color: color})
    );
    line.setRotationFromEuler(euler);
    axis.add(line);

    const arrow = new Mesh(
      new CylinderGeometry(0, radius * 2, height, segments),
      new MeshBasicMaterial({color: color})
    );
    arrow.translateOnAxis(direction, length / 2);
    arrow.setRotationFromEuler(euler);
    axis.add(arrow);

    const text = new Mesh(
      new TextGeometry(label, {
        font: new Font(fontParam.object),
        size: fontParam.size,
        height: fontParam.height,
      }),
      new MeshBasicMaterial({color: color})
    );
    text.translateOnAxis(direction, length / 2 + 0.05);
    text.translateOnAxis(new Vector3(-1, 0, 0), 0.01);
    text.translateOnAxis(new Vector3(0, -1, 0), 0.01);
    axis.add(text);

    return axis;
  }
  setupLight() {
    const lightParams = {
      color: 0xf06c11,
      intensity: 1,
      distance: 5,
      position: new Vector3(-0.5, 0.5, 0.5),
    };
    const g = new Group();

    const light = new PointLight(
      lightParams.color,
      lightParams.intensity,
      lightParams.distance
    );
    light.position.copy(lightParams.position);
    g.add(light);

    const sun = new Mesh(
      new SphereGeometry(0.05, 32, 32),
      new MeshBasicMaterial({
        map: new TextureLoader().load('./assets/sun.jpg'),
      })
    );
    sun.position.copy(lightParams.position);

    g.add(sun);
    g.name = 'sun';
    this.scene.add(g);
  }
  setupBunny() {
    const scale = new Vector3(1.5, 1.5, 1.5);
    const translate = {
      axis: new Vector3(1, 0, 0),
      distance: 0.3,
    };

    const loader = new OBJLoader();
    loader.load('assets/bunny.obj', model => {
      const mesh = model.children[0];

      const bunny1 = mesh;
      bunny1.name = 'bunny1';
      const bunny2 = mesh
        .clone()
        .translateOnAxis(translate.axis, translate.distance);
      bunny2.name = 'bunny2';
      const bunny3 = mesh
        .clone()
        .translateOnAxis(translate.axis, -translate.distance);
      bunny3.name = 'bunny3';

      mesh.scale.copy(scale);

      const bunnies = new Group();
      bunnies.add(bunny1, bunny2, bunny3);
      bunnies.name = 'bunnies';
      this.scene.add(bunnies);
    });
  }
  /**
   * update updates the scene graph in a frame. This function is called
   * @returns nothing
   */
  update() {
    const sun = <Group>this.scene.getObjectByName('sun');
    if (sun === undefined) {
      return;
    }

    // Use quaternion to rotate around +Y axis
    this.theta += 0.005;
    const u = new Vector3(0, 1, 0);
    const cost = Math.cos(this.theta);
    const sint = Math.sin(this.theta);
    sun.setRotationFromQuaternion(
      new Quaternion(u.x * sint, u.y * sint, u.z * sint, cost)
    );

    // Bunnies are loaded asynchronously, thus we need check if it is
    // defined. Usually this will cause data race in other concurrent
    // environment, as JavaScript only executes on a single thread,
    // we are safe.
    const bunnies = <Group>this.scene.getObjectByName('bunnies');
    if (bunnies === undefined) {
      return;
    }

    const bunny1 = <Group>this.scene.getObjectByName('bunny1');
    const bunny2 = <Group>this.scene.getObjectByName('bunny2');
    const bunny3 = <Group>this.scene.getObjectByName('bunny3');

    // TODO: Apply rotation around Y-axis (or X-, Z-axis) to the
    // three bunnies at the same time.

  }
}

new SceneGraph().render();
