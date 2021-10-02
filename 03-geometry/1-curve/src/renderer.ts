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
  Vector3,
  GridHelper,
  Color,
  OrthographicCamera,
  MathUtils,
  Object3D,
  Group,
  Mesh,
  CylinderGeometry,
  MeshBasicMaterial,
  TextGeometry,
  Font,
  Euler,
  Material,
} from 'three';
import {TrackballControls} from 'three/examples/jsm/controls/TrackballControls';
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json';

export class Renderer {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: OrthographicCamera;
  controls: TrackballControls;

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

    this.scene = new Scene();
    this.scene.background = new Color('#181818');

    const param = {
      frustum: 40 / (window.innerHeight / window.innerWidth),
      aspect: window.innerHeight / window.innerWidth,
      position: new Vector3(0, 10, 20),
      lookAt: new Vector3(0, 10, 0),
    };
    this.camera = new OrthographicCamera(
      param.frustum / -2,
      param.frustum / 2,
      (param.frustum * param.aspect) / 2,
      (param.frustum * param.aspect) / -2
    );
    this.camera.position.copy(param.position);
    this.camera.lookAt(param.lookAt);

    window.addEventListener(
      'resize',
      () => {
        const aspect = window.innerWidth / window.innerHeight;
        const change = param.aspect / aspect;
        const newsize = param.frustum * change;
        this.camera.left = (0.3 * aspect * newsize) / -2;
        this.camera.right = (1.5 * aspect * newsize) / 2;
        this.camera.top = (1.5 * newsize) / 2;
        this.camera.bottom = (-0.3 * newsize) / 2;
        this.camera.updateProjectionMatrix();
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

    this.setup();
  }
  render() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.render());
  }
  setup() {
    this.setupGridPlane();
    this.setupAxes();
  }
  setupGridPlane() {
    const params = {
      size: 150,
      divisions: 150,
      materialOpacity: 0.25,
      materialTransparency: true,
    };
    const gh = new GridHelper(params.size, params.divisions);
    (<Material>gh.material).opacity = params.materialOpacity;
    (<Material>gh.material).transparent = params.materialTransparency;
    gh.rotateX(MathUtils.degToRad(90));
    this.scene.add(gh);
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
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
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
        curveSegments: fontParam.curveSegments,
        bevelEnabled: fontParam.bevelEnabled,
        bevelThickness: fontParam.bevelThickness,
        bevelSize: fontParam.bevelSize,
      }),
      new MeshBasicMaterial({color: color})
    );
    text.translateOnAxis(direction, length / 2 + 0.5);
    text.translateOnAxis(new Vector3(-1, 0, 0), 0.2);
    text.translateOnAxis(new Vector3(0, -1, 0), 0.25);
    axis.add(text);

    return axis;
  }
}
