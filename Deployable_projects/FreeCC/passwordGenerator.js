function generatePassword(l) {
  if (l === 0) {
    console.log("Generated password:");
    return "";
  }
  const charSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  let arr = new Uint32Array(l);
  const cryptoSource =
    typeof window !== "undefined" ? window.crypto : globalThis.crypto;

  if (!cryptoSource) {
    console.error("Cryptographically secure random source not available.");
    return "";
  }
  cryptoSource.getRandomValues(arr);
  for (let i = 0; i < l; i++) {
    let randomIndex = arr[i] % charSet.length;
    password += charSet[randomIndex];
  }
  console.log(`Generated password: '${password}' `);
}
let n = 4;
console.log(generatePassword(n));

/*

// unsafe method to generate a number
function generatePassword(l) {
  let charSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let setL = charset.length;
  let password = "";
  for (let i = 0; i < length; i++) {
    // a. Math.random(): Generates a float between 0 (inclusive) and 1 (exclusive).
    // b. Multiplication (* charSetLength): Scales the random float to the range [0, charSetLength).
    // c. Math.floor(): Truncates the float to an integer, giving a random index [0, charSetLength - 1].
    const randomIndex = Math.floor(Math.random() * setL);

    // d. Select the character and append it to the password string.
    password += charSet[randomIndex];
  }
  return password;
}
const d = 12;
const password = generatePassword(d);
console.log(`Generated password: '${password}'`);
*/
