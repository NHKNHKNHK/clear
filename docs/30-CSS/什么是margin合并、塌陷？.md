# 什么是margin合并、塌陷？

## **margin 塌陷问题**

-   第一个子元素的上 margin 会作用在父元素上，最后一个子元素的下 margin 会作用在父元素上
-   大白话就是第一个子元素的margin-top，最后一个子元素的margin-bottom，被父元素给抢走了
    演示：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        .outer {
            width: 400px;
            background-color: gray;
        }

        .inner1 {
            width: 100px;
            height: 100px;
            background-color: orange;
            /* 下面这行代码是有问题的:margin塌陷 */
            margin-top: 50px;
        }

        .inner2 {
            width: 100px;
            height: 100px;
            background-color: green;
            /* 下面这行代码是有问题的:margin塌陷 */
            margin-bottom: 50px;
        }
    </style>
</head>

<body>
    <div class="outer">
        <div class="inner1">inner1</div>
        <div class="inner2">inner2</div>
    </div>
    <div>我是一段测试的文字</div>
</body>

</html>
```

如下：


## 解决margin塌陷

解决margin塌陷问题，有如下方案：

-   给父元素设置边框

```css
.outer {
    width: 400px;
    background-color: gray;
    border: 1px solid black;
}
```

但是，某些情况下，我们不想为父元素设置边框，因为边框会增加父元素的高度，这样会破坏布局。还会破坏美感

-   给父元素设置内边距

```css
.outer {
    width: 400px;
    background-color: gray;
    padding: 10px;
}
```

## **margin合并问题**

-   上面兄弟元素的下外边距和下面兄弟元素的上外边距会合并，取一个最大的值，而不是相加。

## 如何解决 margin  合并？

无需解决，布局的时候上下的兄弟元素，只给一个设置上下外边距就可以了。

>   需要注意的是，margin合并是css的一个特性，并非bug。

演示：

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <title>margin合并问题</title>
    <style>
        .box {
            width: 200px;
            height: 200px;
        }

        .box1 {
            background-color: deepskyblue;
            margin-bottom: 110px;
        }

        .box2 {
            background-color: orange;
            margin-top: 60px;
        }
    </style>
</head>

<body>
    <div class="box box1">1</div>
    <div class="box box2">2</div>
</body>

</html>
```

如下：

当然如果某些人非要解决margin合并问题，也不是不可以
