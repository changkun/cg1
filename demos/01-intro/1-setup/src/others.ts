/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 * Created by Changkun Ou <https://changkun.de>.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

/**
 * Class
 */

class MyClass {
  p1: string;
  p2: number;
  pn: Object[];
  constructor(p1: string, p2: number, ...pn: Object[]) {
    this.p1 = p1;
    this.p2 = p2;
    this.pn = [...pn];
  }
  f() {
    console.log(this.p1, this.p2, this.pn);
  }
}
const m = new MyClass('1', 2, 1, 2);
m.f(); // '1', 2, [1, 2]

/**
 * Interface
 */

interface User {
  name: string;
  id: number;
}

class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

const user: User = new UserAccount('Murphy', 1);
console.log(user);

/**
 * Data types
 */

const b = false;
const n = 3.1415;
const s = 'Hello CG1';
const a: Array<number> = [1, 2, 3, 4];
const o: object = {course: 'mimuc/cg1', year: 2021, difficulty: 'ultra-easy'};
console.log(b, n, s, a, o);

/**
 * elements counts the number of elements of a given argument.
 *
 * @param s is either a string or an array of string
 * @returns the number of character elements of the given string or array.
 */
function elements(s: string | string[]) {
  if (typeof s === 'string') {
    return s.length;
  }
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    sum += s[i].length;
  }
  return sum;
}

console.log(elements('Hello CG1!'));
console.log(elements(['Hello CG1!', 'Awesome Computer Graphics']));
