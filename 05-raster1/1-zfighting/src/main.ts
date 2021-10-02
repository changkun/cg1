/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 * Created by Changkun Ou <https://changkun.de>.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

import {BoxGeometry, Mesh, MeshBasicMaterial} from 'three';
import {Renderer} from './renderer';

class zFighting extends Renderer {
  constructor() {
    super();
    const m1 = new Mesh(
      new BoxGeometry(0.4, 0.5, 0.5),
      new MeshBasicMaterial({
        color: 0x980000,
      })
    );
    const m2 = new Mesh(
      new BoxGeometry(0.5, 0.5, 0.5),
      new MeshBasicMaterial({
        color: 0x2e75b5,
        // TODO: uncomment the following code to avoid z-fighting
        // polygonOffset: true,
        // polygonOffsetFactor: 1.0,
        // polygonOffsetUnits: 4.0,
      })
    );
    this.scene.add(m1, m2);
  }
}
new zFighting().render();
