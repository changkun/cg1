// Copyright 2020 Changkun Ou. All rights reserved.
// Use of this source code is governed by a GNU GPL-3.0+
// license that can be found in the LICENSE file.

/**
 * PerlinNoise implements a 2 dimentional Perlin noise generator.
 */
export default class PerlinNoise {
  constructor() {
    this.grad = [
      [1, 1], [-1, 1], [1, -1], [-1, -1],
      [1, 0], [-1, 0], [1, 0], [-1, 0],
      [0, 1], [0, -1], [0, 1], [0, -1]
    ]
    let p = new Array(256)
    for (let i = 0; i < 256; i++) {
      p[i] = Math.floor(Math.random()*256)
    }
    this.perm = new Array(512)
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255]
    }
  }
  /**
   * Generates a 2d perlin noise for given (x, y)
   * @param {number} x coordinate x
   * @param {number} y coordinate y
   */
  gen(x, y) {
    const i = Math.floor(x + 0.5 * (x+y) * (Math.sqrt(3)-1))
    const j = Math.floor(y + 0.5 * (x+y) * (Math.sqrt(3)-1))
    const G2 = 0.5 - Math.sqrt(3) / 6
    const x0 = x - (i-(i+j)*G2)
    const y0 = y - (j-(i+j)*G2)

    const i1 = x0 > y0 ? 1 : 0
    const j1 = x0 > y0 ? 0 : 1
    const x1 = x0 - i1 + G2
    const y1 = y0 - j1 + G2 
    const x2 = x0 - 1 + 2 * G2
    const y2 = y0 - 1 + 2 * G2

    const gi0 = this.perm[i & 255+this.perm[j & 255]] % 12
    const gi1 = this.perm[i & 255+i1+this.perm[j & 255+j1]] % 12
    const gi2 = this.perm[i & 255+1+this.perm[j & 255+1]] % 12

    const t0 = 0.5 - x0*x0-y0*y0
    const t1 = 0.5 - x1*x1-y1*y1
    const t2 = 0.5 - x2*x2-y2*y2

    const n0 = t0 > 0 ? t0 * t0 * t0 * t0 * (this.grad[gi0][0]*x0+this.grad[gi0][1]*y0) : 0
    const n1 = t1 > 0 ? t1 * t1 * t1 * t1 * (this.grad[gi1][0]*x1+this.grad[gi1][1]*y1) : 0
    const n2 = t2 > 0 ? t2 * t2 * t2 * t2 * (this.grad[gi2][0]*x2+this.grad[gi2][1]*y2) : 0
    return 70 * (n0 + n1 + n2)
  }
}
