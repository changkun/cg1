class Vector3 {
  /**
   * constructs a vector with given parameters.
   * @param {number} x1 is the first component of a vector
   * @param {number} x2 is the second component of a vector
   * @param {number} x3 is the third component of a vector
   */
  constructor(x1, x2, x3) {
    this.x1 = x1 || 0
    this.x2 = x2 || 0
    this.x3 = x3 || 0
  }
  /**
   * returns the sum of this and w.
   * @param {Vector3} w is a 3 dimensional vector
   */
  sum(w) {
    // TODO: Implement vector sum: this + w
    return this
  }
  /**
   * return the multiplication of a scalar and a vector.
   * @param {number} scalar is a scalar number
   */
  multiply(scalar) {
    // TODO: Implement vector scalar multiplication: scalar*this
    return this
  }
  /**
   * returns the dot product of two 3D vectors.
   * @param {Vector3} w is a 3 dimensional vector
   */
  dot(w) {
    // TODO: Implement vector dot product: this · w
    return 0
  }
  /**
   * returns the norm of the given vector
   */
  norm() {
    // TODO: Implement vector norm: || this ||
    return Math.sqrt(this.dot(this))
  }
  /**
   * returns the cross product of two 3D vectors.
   * @param {Vector3} w is a 3 dimensional vector
   */
  cross(w) {
    // TODO: Implement vector cross product: this × w
    return this
  }
  /**
   * computes the angle with respect to the given w.
   * @param {Vector3} w is a 3 dimensional vector
   */
  angle(w) {
    // TODO: Implement angle of this and w: ∠(this, w)
    return 0
  }
}

class Matrix {
  /**
   * constructs a matrix.
   * @param {number} m is the number of row of the matrix
   * @param {number} n is the number of column of the matrix
   * @param  {...any} xs is a list of elements
   */
  constructor(m, n, ...xs) {
    this.m = m
    this.n = n
    this.xs = [...xs]
  }
  /**
   * returns the multiplication of given matrix
   * @param {Matrix} mat is a m x n matrix
   */
  multiply(mat) {
    // TODO: Implement matrix multiplication
    return this
  }
  det() {
    if (this.m !== this.n) {
      throw "matrix is not a square matrix"
    }
    if (this.m > 3) {
      throw "matrix is too big"
    }
    // TODO: Implement determinant for 2x2, 3x3 matrix
    return 0
  }
}

module.exports = {
  Vector3,
  Matrix
}