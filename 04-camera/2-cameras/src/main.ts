/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 * Created by Changkun Ou <https://changkun.de>.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

import {
  Vector3,
  GridHelper,
  Group,
  PointLight,
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
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json';
import {Renderer} from './renderer';

class SceneGraph extends Renderer {
  theta: number;

  constructor() {
    super();

    this.theta = 0;

    this.setup();
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
  update() {
    const sun = <Group>this.scene.getObjectByName('sun');
    if (sun === undefined) {
      return;
    }

    this.theta += 0.005;
    const u = new Vector3(0, 1, 0);
    const cost = Math.cos(this.theta);
    const sint = Math.sin(this.theta);
    sun.setRotationFromQuaternion(
      new Quaternion(u.x * sint, u.y * sint, u.z * sint, cost)
    );

    const bunnies = <Group>this.scene.getObjectByName('bunnies');
    if (bunnies === undefined) {
      return;
    }

    const bunny1 = <Group>this.scene.getObjectByName('bunny1');
    const bunny2 = <Group>this.scene.getObjectByName('bunny2');
    const bunny3 = <Group>this.scene.getObjectByName('bunny3');

    bunnies.rotateY(0.01);
    bunny1.rotateY(0.01);
    bunny2.rotateY(0.01);
    bunny3.rotateY(0.01);
  }
}

new SceneGraph().render();
