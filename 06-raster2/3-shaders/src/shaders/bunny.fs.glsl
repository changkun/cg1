/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 * Created by Changkun Ou <https://changkun.de>.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

in vec3 vertexColor;
out vec4 outputColor;

void main() {
    // TODO: use the vertex color
    outputColor = vec4(1.0, 1.0, 1.0, 1.0);
    outputColor = vec4(vertexColor, 1.0);
}