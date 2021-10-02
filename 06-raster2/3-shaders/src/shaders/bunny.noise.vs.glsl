/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 * Created by Changkun Ou <https://changkun.de>.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

out vec3 vertexColor;

float rand(vec2 co){
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{
    // TODO: add noise to vertex using the rand function
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(
        position.x,
        position.y,
        position.z,
        1.0
    );

    // normal as color
    vertexColor = vec3(1.0);
}