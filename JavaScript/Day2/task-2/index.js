array1 = [1, 2, 3, 4, 5];
array2 = [6, 7, 8, 9, 10];

if (array1.length < array2.length) {
  [array1, array2] = [array2, array1];
}

/* method 1 */
for(let i = 0; i < array1.length; i++) {
  array1[i] += array2[i];
}
console.log(array1);

/* another way using map */
console.log(array1.map((value, index) => value + array2[index]));
