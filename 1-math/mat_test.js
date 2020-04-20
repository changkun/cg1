const {Vector3, Matrix} = require('./mat')
const tests = [
  {
    type: 'sum',
    vs: [
      {v1: new Vector3(0, 0, 0), v2: new Vector3(1, 2, 3), want: new Vector3(1, 2, 3)},
      {v1: new Vector3(3, 2, 1), v2: new Vector3(1, 2, 3), want: new Vector3(4, 4, 4)},
    ],
  }, {
    type: 'multiply',
    vs: [
      {v1: new Vector3(0, 0, 0), scalar: 1, want: new Vector3(0, 0, 0)},
      {v1: new Vector3(10, 6, 7), scalar: 2, want: new Vector3(20, 12, 14)},
    ]
  }, {
    type: 'norm',
    vs: [
      {v: new Vector3(1, 1, 1), want: Math.sqrt(3)},
      {v: new Vector3(2, 1, 2), want: 3},
      {v: new Vector3(1, 1, 3), want: Math.sqrt(11)},
      {v: new Vector3(1, 2, -2),want: 3},
    ]
  }, {
    type: 'dot',
    vs: [
      {v1: new Vector3(0, 0, 0), v2: new Vector3(1, 2, 3), want: 0},
      {v1: new Vector3(1, 2, 3), v2: new Vector3(1, 2, 3), want: 14},
      {v1: new Vector3(1, 2, 3), v2: new Vector3(1, -2, 3), want: 6},
    ]
  }, {
    type: 'angle',
    vs: [
      {v1: new Vector3(1, 0, 0), v2: new Vector3(0, 1, 0), want: Math.PI / 2},
      {v1: new Vector3(1, 0, 0), v2: new Vector3(0, 0, 1), want: Math.PI / 2},
      {v1: new Vector3(0, 1, 0), v2: new Vector3(0, 0, 1), want: Math.PI / 2},
      {v1: new Vector3(2, 1, 2), v2: new Vector3(1, 1, 3),  want: Math.acos(3 / Math.sqrt(11))},
      {v1: new Vector3(1, 1, 3), v2: new Vector3(1, 2, -2), want: Math.acos(- 1 / Math.sqrt(11))},
      {v1: new Vector3(0, 0, 0), v2: new Vector3(1, 2, 3),  want: NaN},
    ]
  }, {
    type: 'cross',
    vs: [
      {v1: new Vector3(0, 0, 0), v2: new Vector3(1, 2, 3), want: new Vector3(0, 0, 0)},
      {v1: new Vector3(1, 2, 3), v2: new Vector3(1, 2, 3), want: new Vector3(0, 0, 0)},
      {v1: new Vector3(1, 0, 0), v2: new Vector3(0, 1, 0), want: new Vector3(0, 0, 1)},
    ]
  }, {
    type: 'special',
    vs: [
      {rule: 'v1 · (v1 x v2)', want: 0},
      {rule: 'v1 x (v2 x v3) + v2 x (v3 x v1) + v3 x (v1 x v2)', want: new Vector3(0, 0, 0)},
    ]
  }, {
    type: 'matmul',
    vs: [
      {mat1: new Matrix(3, 3,
        1, 0, 0, 0, 1, 0, 0, 0, 1
      ), mat2: new Matrix(3, 3,
        2, 1, 1, 1, 1, 2, 1, 2, -2
      ), want: new Matrix(3, 3,
        2, 1, 1, 1, 1, 2, 1, 2, -2)},
      {mat1: new Matrix(3, 3,
        1, 0, 0, 0, 1, 0, 0, 0, 1
      ), mat2: new Matrix(3, 3,
        2, 1, 1, 1, 1, 2, 1, 2, -2
      ), want: new Matrix(3, 3,
        2, 1, 1, 1, 1, 2, 1, 2, -2)},
      {mat1: new Matrix(4, 2,
        1, 2, 3, 4, 5, 6, 7, 8,
      ), mat2: new Matrix(2, 5,
        9, 8, 7, 6, 5, 4, 3, 2, 1, 0
      ), want: new Matrix(4, 5,
        17, 14, 11, 8, 5,
       	43, 36, 29, 22, 15,
       	69, 58, 47, 36, 25,
       	95, 80, 65, 50, 35,)}
    ]
  }, {
    type: 'det',
    vs: [
      {mat: new Matrix(3, 3,
        1, 0, 0, 0, 1, 0, 0, 0, 1
      ), want: 1},
      {mat: new Matrix(2, 2,
        1, 1,
        2, 3
      ), want: 1},
    ]
  }
]

const vec3equals = (v1, v2) => {
  if (v1.x1 === v2.x1 && v1.x2 === v2.x2 && v1.x3 === v2.x3) {
    return true
  }
  return false
}
const matEquals = (m1, m2) => {
  if (m1.m !== m2.m || m1.n !== m2.n) {
    return false
  }
  for (let i = 0; i < m1.m * m1.n; i++) {
    if (m1.xs[i] != m2.xs[i]) {
      console.log(i, m1.xs[i], m2.xs[i])
      return false
    }
  }
  return true
}
const randomInts = () => {
  return Math.floor(Math.random() * 10)
}
const runVectorTests = () => {
  tests.forEach(t => {
    switch (t.type) {
    case 'sum':
      t.vs.forEach(tt => {
        const got = tt.v1.sum(tt.v2)
        if (vec3equals(got, tt.want)) { return }
        throw {type: t.type, test: tt, got: got}
      })
      return
    case 'multiply':
      t.vs.forEach(tt => {
        const got = tt.v1.multiply(tt.scalar)
        if (vec3equals(got, tt.want)) { return }
        throw {type: t.type, test: tt, got: got}
      })
      return
    case 'norm':
      t.vs.forEach(tt => {
        const got = tt.v.norm()
        if (got === tt.want) { return }
        throw {type: t.type, test: tt, got: got}
      })
      return
    case 'dot':
      t.vs.forEach(tt => {
        const got = tt.v1.dot(tt.v2)
        if (got === tt.want) { return }
        throw {type: t.type, test: tt, got: got}
      })
      return
    case 'angle':
      t.vs.forEach(tt => {
        const got = tt.v1.angle(tt.v2)
        if (isNaN(tt.want) && isNaN(got)) { return }
        if (got === tt.want) { return }
        throw {type: t.type, test: tt, got: got}
      })
      return
    case 'cross':
      t.vs.forEach(tt => {
        const got = tt.v1.cross(tt.v2)
        if (vec3equals(got, tt.want)) { return }
        throw {type: t.type, test: tt, got: got}
      })
      return
    case 'special':
      t.vs.forEach(tt => {
        if (tt.rule === 'v1 · (v1 x v2)') {
          let v1 = new Vector3(randomInts(), randomInts(), randomInts())
          let v2 = new Vector3(randomInts(), randomInts(), randomInts())
          const got = v1.dot(v1.cross(v2))
          if (tt.want === got) { return }
          throw {type: t.type, test: tt.rule, vs: [v1, v2], got: got, want: tt.want}
        }
        if (tt.rule === 'v1 x (v2 x v3) + v2 x (v3 x v1) + v3 x (v1 x v2)') {
          let v1 = new Vector3(randomInts(), randomInts(), randomInts())
          let v2 = new Vector3(randomInts(), randomInts(), randomInts())
          let v3 = new Vector3(randomInts(), randomInts(), randomInts())
          const got = v1.cross(v2.cross(v3)).sum(v2.cross(v3.cross(v1))).sum(v3.cross(v1.cross(v2)))
          if (vec3equals(got, tt.want)) { return }
          throw {type: t.type, test: tt.rule, vs: [v1, v2, v3], got: got, want: tt.want}
        }
      })
      return
    case 'matmul':
      t.vs.forEach(tt => {
        const got = tt.mat1.multiply(tt.mat2)
        if (matEquals(got, tt.want)) { return }
        throw {type: t.type, test: tt, got: got}
      })
      return
    case 'det':
      t.vs.forEach(tt => {
        const got = tt.mat.det()
        if (got === tt.want) { return }
        throw {type: t.type, test: tt, got: got}
      })
      return
    default:
      return
    }
  })
}

try {
  runVectorTests()
  console.log('\x1b[32m%s\x1b[0m', 'PASS')
} catch (err) {
  console.log(err)
  console.error('\x1b[31m%s\x1b[0m', 'FAIL')
}
