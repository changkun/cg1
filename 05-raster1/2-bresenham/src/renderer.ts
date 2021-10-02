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
  OrthographicCamera,
  Euler,
  Font,
  Vector3,
  Object3D,
  Mesh,
  CylinderGeometry,
  TextGeometry,
  MeshBasicMaterial,
  Group,
  MathUtils,
  Color,
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
} from 'three';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json';
import {GUI} from 'dat.gui';

export default class Renderer {
  scene: Scene;
  renderer: WebGLRenderer;
  camera: OrthographicCamera;
  controls: TrackballControls;
  gui: GUI;

  constructor() {
    const container = document.body;
    container.style.overflow = 'hidden';
    container.style.margin = '0';

    this.gui = new GUI();
    this.gui
      .add({export: () => this.exportScreenshot()}, 'export')
      .name('screenshot');

    this.renderer = new WebGLRenderer({
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.scene = new Scene();
    this.scene.background = new Color('#181818');

    const param = {
      frustum: 100 / (window.innerHeight / window.innerWidth),
      aspect: window.innerHeight / window.innerWidth,
      position: new Vector3(0, 10, 10),
      lookAt: new Vector3(0, 10, 0),
      left: -window.innerWidth / 15 + 75,
      right: window.innerWidth / 15 + 75,
      top: window.innerHeight / 15 + 25,
      bottom: -window.innerHeight / 15 + 25,
      near: 0.1,
      far: 10,
    };

    this.camera = new OrthographicCamera(
      param.left,
      param.right,
      param.top,
      param.bottom,
      param.near,
      param.far
    );
    this.camera.position.copy(param.position);
    this.camera.lookAt(param.lookAt);
    this.camera.position.copy(param.position);
    this.camera.lookAt(param.lookAt);
    window.addEventListener(
      'resize',
      () => {
        this.camera.left = -window.innerWidth / 15 + 75;
        this.camera.right = window.innerWidth / 15 + 75;
        this.camera.top = window.innerHeight / 15 + 25;
        this.camera.bottom = -window.innerHeight / 15 + 25;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      },
      false
    );

    this.controls = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.noRotate = true;
    this.controls.panSpeed = 10;
    this.controls.target.copy(param.lookAt);

    this.setupHelpers();
  }
  update() {
    // This method is required to be implemented in a subclass for animations.
  }
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls.update();
    this.camera.updateProjectionMatrix();
    this.update(); // from subclass
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.render());
  }
  setupHelpers() {
    this.initScreen(150, 75);
    this.setupAxes();
  }
  setupAxes() {
    const axes = new Object3D();
    axes.add(
      this.createAxis(
        'X',
        new Euler(0, 0, -MathUtils.degToRad(90)),
        new Vector3(1, 0, 0),
        0xdc0015
      ),
      this.createAxis('Y', new Euler(0, 0, 0), new Vector3(0, 1, 0), 0x4caf50)
    );
    this.scene.add(axes);
  }
  createAxis(label: string, euler: Euler, direction: Vector3, color: number) {
    const length = 50;
    const radius = 0.05;
    const height = 0.3;
    const segments = 32;
    const fontParam = {
      object: helvetiker,
      size: 0.5,
      height: 0.1,
      curveSegments: 1,
    };
    const axis = new Group();
    const line = new Mesh(
      new CylinderGeometry(radius, radius, length, segments),
      new MeshBasicMaterial({color: color})
    );
    line.translateOnAxis(direction, length / 2);
    line.setRotationFromEuler(euler);
    axis.add(line);

    const arrow = new Mesh(
      new CylinderGeometry(0, radius * 2, height, segments),
      new MeshBasicMaterial({color: color})
    );
    arrow.translateOnAxis(direction, length);
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
    text.translateOnAxis(direction, length + 0.5);
    text.translateOnAxis(new Vector3(-1, 0, 0), 0.2);
    text.translateOnAxis(new Vector3(0, -1, 0), 0.25);
    axis.add(text);

    return axis;
  }
  initScreen(width: number, height: number) {
    const color = new Color(0xffffff);
    const vs = new Array<number>();
    const cs = new Array<number>();
    for (let i = 0, j = 0, k = 0; i <= height; i++, k++) {
      vs.push(0, k, 0, width, k, 0);
      for (let l = 0; l < 4; l++) {
        color.toArray(cs, j);
        j += 3;
      }
    }
    for (let i = 0, j = 0, k = 0; i <= width; i++, k++) {
      vs.push(k, 0, 0, k, height, 0);
      for (let l = 0; l < 4; l++) {
        color.toArray(cs, j);
        j += 3;
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(vs, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(cs, 3));
    const material = new LineBasicMaterial({vertexColors: true});
    material.opacity = 0.15;
    material.transparent = true;
    const screen = new LineSegments(geometry, material);
    this.scene.add(screen);
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
