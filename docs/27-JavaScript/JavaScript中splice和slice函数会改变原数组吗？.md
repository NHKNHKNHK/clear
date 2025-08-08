# JavaScript中splice和slice函数会改变原数组吗？


>   MDN
>   [【Array.prototype.splice()】](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
>   [【Array.prototype.slice()】](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

## 口语化

先说结论：

-   splice() 方法**就地**移除或者替换已存在的元素和/或添加新的元素

-   slice() 方法**返回一个新的数组对象**，这一对象是一个由 start 和 end 决定的原数组的浅拷贝（包括 start，不包括 end），其中 start 和 end 代表了数组元素的索引。原始数组不会被改变

## **Array.prototype.splice()**

```js
const arr = new Array(1, 2, 3, 4, 5)

// splice 就地移除或者替换已存在的元素和/或添加新的元素

// 1.删除，删除索引1开始的2个元素
console.log(arr.splice(1, 2)) // [2, 3] 返回被删除的元素
console.log(arr) // [1, 4, 5]

// 2.新增，在索引1的位置插入元素'a'和'b'
arr.splice(1, 0, 'a', 'b')
console.log(arr) // [1, "a", "b", 4, 5]

// 3.替换，替换索引1开始的2个元素
console.log(arr.splice(1, 2, 'c')) // ['a', 'b'] 返回被替换的元素
console.log(arr) // [1, "c", 4, 5]
```

## **Array.prototype.slice()**

```js
const arr = new Array(1, 2, 3, 4, 5)

// slice 提取数组的一部分（浅拷贝），返回新数组
// start参数1：开始位置，end参数2：结束位置（不包含）
// 此方法也可以用作浅拷贝数组

const res = arr.slice(1, 3) 
console.log(res) // [2, 3]
```

