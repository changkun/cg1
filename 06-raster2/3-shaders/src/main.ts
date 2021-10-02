/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 * Created by Changkun Ou <https://changkun.de>.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

import {GLSL3, Mesh, ShaderMaterial} from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {Renderer} from './renderer';
import depthVert from './shaders/bunny.depth.vs.glsl';
import noiseVert from './shaders/bunny.noise.vs.glsl';
import normalVert from './shaders/bunny.normal.vs.glsl';
import randomVert from './shaders/bunny.random.vs.glsl';
import frag from './shaders/bunny.fs.glsl';

class Bunny extends Renderer {
  constructor() {
    super();

    const loader = new OBJLoader();
    loader.load('assets/bunny.obj', model => {
      const mesh = <Mesh>model.children[0];

      const vertexShaders = [depthVert, normalVert, randomVert, noiseVert];
      vertexShaders.forEach((vs, idx) => {
        const m = new Mesh(
          mesh.geometry,
          new ShaderMaterial({
            vertexColors: true,
            vertexShader: vs,
            fragmentShader: frag,
            glslVersion: GLSL3,
          })
        );
        m.translateX(0.2 * idx);
        this.scene.add(m);
      });
    });
  }
}

new Bunny().render();
