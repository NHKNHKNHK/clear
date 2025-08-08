# JavaScript中==与===有什么区别？

在 JavaScript 里，`==` 和 `===` 都是用于比较两个值的运算符，它们之间的最主要区别是 是否进行类型转换

## **类型转换**

-   **==（相等运算符）**：在进行比较时，会先尝试进行**类型转换**，然后再比较值是否相等。这种比较方式也被称作 “宽松相等”。

```js
console.log(5 == '5'); // true
console.log(true == 1); // true
console.log(null == undefined); // true，null 和 undefined 在使用 == 比较时被视为相等
```

-   **===（严格相等运算符）**：在比较时，不会进行类型转换，只有当两个值的类型和值都相等时，才会返回 true。这种比较方式也被称作 “严格相等”。

```js
console.log(5 === '5'); // false
console.log(true === 1); // false
console.log(null === undefined); // false，类型不同，null 是对象类型，undefined 是 undefined 类型
```

## **性能**

从性能方面考虑，`===` 通常会比 `==` 更快，这是因为 `==` 需要进行类型转换的操作，而 `===` 无需进行类型转换

>   不过在现代JavaScript引擎中，这种性能差异微乎其微了已经


## **可预测性**

`===` 的性能更加可预测。因为他不进行类型转换，所以不会出现一些令人困惑的结果。例如：

```js
console.log(0 == false) // true
console.log(0 === false) // false

console.log(null == undefined) // true
console.log(null === undefined) // false
```

在上面的例子中，很明显由于类型转换的原因，`===` 运算符造成了一些反直觉的结果

注意！！！NaN的特殊情况（他是唯一一个 NaN不等价于NaN的，类似于MySQL中的null不等于null）

```js
console.log(NaN == NaN) // false
console.log(NaN === NaN) // false
```

## **总结**

在开发中，推荐使用 `===`，这可以避免很多潜在的bug
