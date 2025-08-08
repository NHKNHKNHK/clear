# JavaScript中for...in和for...of的区别是什么？

在 JavaScript 里，for...in 和 for...of 都是用于循环遍历的语句，它们的主要区别是遍历的对象和返回的值类型不同

## **遍历对象类型**

-   for...in：
    -   主要用于遍历对象的可枚举属性，包含对象自身的属性以及继承的属性。
    -   可以遍历对象、字符串等
        -   也可以数组，不过在遍历数组时，返回的是数组的索引（字符串类型）。（但不推荐使用for...in遍历数组）
    -   返回的是属性名（键名）
    -   ES3语法
-   for...of：
    -   主要用于遍历可迭代对象，像数组、字符串、Set、Map 等。
    -   它无法直接遍历普通对象，因为普通对象不是可迭代对象。
    -   返回的是每次迭代的值
    -   ES6语法

## **遍历内容**

-   for...in：遍历得到的是对象的属性名（键）。在数组中，这个键是字符串类型的索引；在普通对象中，是对象的属性名。
-   for...of：遍历得到的是可迭代对象的每个值。在数组中，是数组的元素值；在字符串中，是每个字符。

```js
// for...in 遍历对象
const person = {
    name: 'John',
    age: 30,
    occupation: 'Developer'
};

for (const key in person) {
    console.log(key + ': ' + person[key]);
}

// for...in 遍历数组
const numbers = [10, 20, 30];
for (const index in numbers) {
    console.log('索引: ' + index + ', 值: ' + numbers[index]);
}

// for...of 遍历数组
const fruits = ['apple', 'banana', 'cherry'];
for (const fruit of fruits) {
    console.log(fruit);
}

// for...of 遍历字符串
const str = 'hello';
for (const char of str) {
    console.log(char);
}

// for...of 不能直接遍历普通对象，会报错
// const obj = { a: 1, b: 2 };
// for (const value of obj) {
//     console.log(value);
// }
```

## **性能与使用场景**

-   for...in：由于它会遍历对象的所有可枚举属性，包含原型链上的属性，因此性能相对较低。
    -   适用于需要遍历对象属性名的场景。
-   for...of：专门用于遍历可迭代对象，性能较高。
    -   适用于需要遍历可迭代对象值的场景。

## **重要区别**

-   for...in 主要用于遍历对象的属性名，而 for...of 主要用于遍历可迭代对象的值。
-   遍历顺序：for...in 不保证遍历顺序，而 for...of 会按照迭代器定义的顺序进行遍历 
-   在遍历数组时，建议优先使用for...of
-   继承属性：for...in会遍历对象的原型链，而for...of不会


