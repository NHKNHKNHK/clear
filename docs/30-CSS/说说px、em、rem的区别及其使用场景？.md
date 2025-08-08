# 说说px、em、rem的区别及其使用场景？

https://www.mianshiya.com/bank/1810644318667538433/question/1810655448727064578

px、em、rem 是三种常见的长度单位

**px（像素）**

-   定义：px 是固定的像素单位，它代表屏幕上的一个物理像素点。无论在何种设备或环境下，1 px 所代表的物理尺寸是固定的。
-   特点：
    -   固定性：使用 px 设置的元素大小不会随着其他元素的变化而变化，具有很高的精确性。
    -   缺乏灵活性：由于其固定性，当需要进行页面整体缩放或响应式设计时，使用 px 可能会导致布局混乱。

**em（相对单位）**

-   定义：em 是一个相对单位，它的值相对于其父元素的字体大小。如果父元素的字体大小是 16 px，那么 1 em 就等于 16 px；如果设置为 2 em，则等于 32 px。
-   特点：
    -   相对性：em 的值会随着父元素字体大小的变化而变化，具有一定的灵活性。
    -   级联影响：由于 em 是相对于父元素的，当元素嵌套层级较深时，可能会出现级联影响，导致元素大小难以控制。

**rem（根元素相对单位）**

-   定义：rem 也是一个相对单位，但它是相对于根元素（即 `<html>` 元素）的字体大小。如果根元素的字体大小是 16 px，那么 1 rem 就等于 16 px。
-   特点：
    -   相对性：rem 的值会随着根元素字体大小的变化而变化，具有良好的灵活性。
    -   统一控制：由于 rem 只相对于根元素，避免了 em 的级联影响，可以更方便地进行全局布局的调整。

## **使用场景**

px 的使用场景

-   需要精确控制元素大小的场景：例如绘制固定尺寸的图标、设置固定宽度的边框等。
-   对布局要求不高，不需要进行响应式设计的场景：例如一些简单的静态页面。

em 的使用场景

-   元素大小与父元素字体大小相关的场景：例如设置按钮的内边距、子元素的字体大小等，这样可以保证元素在不同字体大小的父元素中保持相对一致的比例。
-   需要在局部范围内进行灵活布局的场景：例如在一个特定的模块中，元素的大小需要根据该模块的字体大小进行调整。

rem 的使用场景

-   响应式设计：通过设置根元素的字体大小，可以方便地实现页面整体的缩放，从而适应不同的设备屏幕尺寸。
-   全局布局：在进行全局布局时，使用 rem 可以避免 em 的级联影响，使布局更加清晰和易于控制

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        html {
            font-size: 16px; /* 设置根元素字体大小 */
        }

        .px-example {
            width: 200px;
            height: 100px;
            background-color: lightblue;
        }

        .parent-em {
            font-size: 20px;
        }

        .em-example {
            width: 10em; /* 20px * 10 = 200px */
            height: 5em; /* 20px * 5 = 100px */
            background-color: lightgreen;
        }

        .rem-example {
            width: 12.5rem; /* 16px * 12.5 = 200px */
            height: 6.25rem; /* 16px * 6.25 = 100px */
            background-color: lightcoral;
        }
    </style>
</head>

<body>
    <div class="px-example">
        这是使用 px 单位的元素
    </div>
    <div class="parent-em">
        <div class="em-example">
            这是使用 em 单位的元素
        </div>
    </div>
    <div class="rem-example">
        这是使用 rem 单位的元素
    </div>
</body>

</html> 
```