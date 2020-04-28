const {Vector3, Matrix} = require('./mat')

const randomInts = () => {
    return Math.floor(Math.random() * 10);
};

describe('Vector', () => {
    test('sum', () => {
      expect(new Vector3(0, 0, 0).sum(new Vector3(1, 2, 3))).toEqual(new Vector3(1, 2, 3));
      expect(new Vector3(3, 2, 1).sum(new Vector3(1, 2, 3))).toEqual(new Vector3(4, 4, 4));
    });

    test('norm', () => {
        expect(new Vector3(1, 1, 1).norm()).toBe(Math.sqrt(3));
        expect(new Vector3(2, 1, 2).norm()).toBe(3);
        expect(new Vector3(1, 1, 3).norm()).toBe(Math.sqrt(11));
        expect(new Vector3(1, 2, -2).norm()).toBe(3);
    });

    test('dot', () => {
        expect(new Vector3(0, 0, 0).dot(new Vector3(1, 2, 3))).toEqual(0);
        expect(new Vector3(1, 2, 3).dot(new Vector3(1, 2, 3))).toEqual(14);
        expect(new Vector3(1, 2, 3).dot(new Vector3(1, -2, 3))).toEqual(6);
    });

    test('angle', () => {
        expect(new Vector3(1, 0, 0).angle(new Vector3(0, 1, 0))).toEqual(Math.PI / 2);
        expect(new Vector3(1, 0, 0).angle(new Vector3(0, 0, 1))).toEqual(Math.PI / 2);
        expect(new Vector3(0, 1, 0).angle(new Vector3(0, 0, 1))).toEqual(Math.PI / 2);
        expect(new Vector3(2, 1, 2).angle(new Vector3(1, 1, 3))).toEqual(Math.acos(3 / Math.sqrt(11)));
        expect(new Vector3(1, 1, 3).angle(new Vector3(1, 2, -2))).toEqual(Math.acos(- 1 / Math.sqrt(11)));
        expect(new Vector3(0, 0, 0).angle(new Vector3(1, 2, 3))).toEqual(NaN);
    });

    test('cross', () => {
        expect(new Vector3(0, 0, 0).cross(new Vector3(1, 2, 3))).toEqual(new Vector3(0, 0, 0));
        expect(new Vector3(1, 2, 3).cross(new Vector3(1, 2, 3))).toEqual(new Vector3(0, 0, 0));
        expect(new Vector3(1, 0, 0).cross(new Vector3(0, 1, 0))).toEqual(new Vector3(0, 0, 1));
    });

    test('special1', () => {
        const v1 = new Vector3(randomInts(), randomInts(), randomInts());
        const v2 = new Vector3(randomInts(), randomInts(), randomInts());

        expect(v1.dot(v1.cross(v2))).toBe(0);
    });

    test('special2', () => {
        const v1 = new Vector3(randomInts(), randomInts(), randomInts())
        const v2 = new Vector3(randomInts(), randomInts(), randomInts())
        const v3 = new Vector3(randomInts(), randomInts(), randomInts())

        expect(v1.cross(v2.cross(v3)).sum(v2.cross(v3.cross(v1))).sum(v3.cross(v1.cross(v2)))).toEqual(new Vector3(0, 0, 0));
    });
}); 

describe('Matrix', () => {
    test('matmul', () => {
        expect(new Matrix(3, 3,
            1, 0, 0, 0, 1, 0, 0, 0, 1
          ).multiply(new Matrix(3, 3,
            2, 1, 1, 1, 1, 2, 1, 2, -2
          ))).toEqual(new Matrix(3, 3,
            2, 1, 1, 1, 1, 2, 1, 2, -2));
    
        expect(new Matrix(3, 3,
            1, 0, 0, 0, 1, 0, 0, 0, 1
          ).multiply(new Matrix(3, 3,
            2, 1, 1, 1, 1, 2, 1, 2, -2
          ))).toEqual(new Matrix(3, 3,
            2, 1, 1, 1, 1, 2, 1, 2, -2));

        expect(new Matrix(4, 2,
            1, 2, 3, 4, 5, 6, 7, 8,
          ).multiply(new Matrix(2, 5,
            9, 8, 7, 6, 5, 4, 3, 2, 1, 0
          ))).toEqual(new Matrix(4, 5,
            17, 14, 11, 8, 5,
               43, 36, 29, 22, 15,
               69, 58, 47, 36, 25,
               95, 80, 65, 50, 35));
    });

    test('det', () => {
        expect(new Matrix(3, 3,
            1, 0, 0, 0, 1, 0, 0, 0, 1
          ).det()).toBe(1);

        expect(new Matrix(2, 2,
            1, 1,
            2, 3
          ).det()).toBe(1)
    });
});
