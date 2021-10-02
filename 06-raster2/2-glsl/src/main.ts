/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 * Created by Changkun Ou <https://changkun.de>.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

import {
  BufferAttribute,
  BufferGeometry,
  GLSL3,
  Mesh,
  ShaderMaterial,
} from 'three';
import {Renderer} from './renderer';

import vert from './shaders/vs.glsl';
import frag from './shaders/fs.glsl';

class GLSL extends Renderer {
  constructor() {
    super();

    const tetra = new BufferGeometry();
    tetra.setAttribute(
      'position',
      new BufferAttribute(
        new Float32Array([
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
        ]),
        3
      )
    );
    tetra.setAttribute(
      'color',
      new BufferAttribute(
        new Float32Array([1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0]),
        3
      )
    );
    tetra.setIndex([2, 3, 1, 2, 0, 3, 3, 0, 1, 1, 0, 2]);

    // TODO: create a mesh with the geometry (tetra) created above,
    // then pass the loaded vertex and fragment shader to ShaderMaterial.
    // Enable vertexColor parameter to input the specified color from
    // threejs (CPU) to the fragment shader (GPU).
    //
    // const mesh = new Mesh(
    //   tetra,
    //   new ShaderMaterial({
    //     glslVersion: GLSL3, // use the latest GLSL version (3.0)
    //     vertexShader: vert,
    //     fragmentShader: frag,
    //     vertexColors: true,
    //   })
    // );
    // this.scene.add(mesh);
  }
}

new GLSL().render();
