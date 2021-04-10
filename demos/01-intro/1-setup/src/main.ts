/**
 * Copyright © 2021 LMU Munich Medieninformatik. All rights reserved.
 * Created by Changkun Ou <https://changkun.de>.
 *
 * Use of this source code is governed by a GNU GPLv3 license that
 * can be found in the LICENSE file.
 */

import './others';

// Create an input box
const input = document.createElement('input');
document.body.appendChild(input);

// Create a button and append it to the document body
const btn = document.createElement('button');
btn.textContent = 'Hello Computer Graphics 1 using TypeScript?';
document.body.appendChild(btn);

// Listen on the click event of the button
btn.addEventListener('click', () => {
  // Get the string from the input box and
  // pass it as argument to sayHello
  const msg = input.value;
  sayHello(msg);
});

/**
 * sayHello will print a console log in the JavaScript console, and
 * create three <p> elements repeatedly.
 *
 * @param msg is an input message
 */
function sayHello(msg: string) {
  // Print a console log
  console.log('Hello mimuc/cg1 from console!');
  if (msg.length !== 0) {
    console.log('Your input is: ' + msg);
  } else {
    console.log('No inputs!');
  }

  // Create a <p> element and append to the document body
  for (let i = 0; i < 3; i++) {
    const p = document.createElement('p');
    if (msg.length !== 0) {
      p.textContent = `Hello mimuc.de/cg1! Your input is: ${msg}`;
    } else {
      p.textContent = 'Hello mimuc.de/cg1! But you did not say anything.';
    }
    document.body.appendChild(p);
  }
}

// Hidden Question:
//
// The above code is almost the same as how you did JavaScript, right?
// Except the `sayHello` function:
//
//   function sayHello(msg: string)
//
// Can you tell what will happen if the argument of sayHello is not a string?
