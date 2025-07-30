## 如何使用css实现一个三角形？

实现一个三角形的关键在于利用css的`border`属性。

通过将元素的宽度和高度都设置为 0，这意味着元素本身在页面上不会占据实际的空间，但是通过边框的设置可以创造出可见的形状。然后可以通过设置不同边的`border`属性的颜色，来实现一个三角形效果。

例如：

```html
<div class="triangle"></div>
```

```css
.triangle {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 40px solid red;
}
```

这个css样式表示的是创建一个底边为红色的等腰三角形

其中，元素的左右边框宽度为 20 像素，颜色为透明。这意味着左右边框是不可见的，但它们仍然存在，并且会影响元素的整体形状。

然后，还设置元素的底部边框宽度为 20 像素，颜色为红色。由于左右边框是透明的，底部边框就会形成一个三角形的形状。

**扩展**

向左三角形

```css
.triangle {
    width: 0;
    height: 0;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-right: 40px solid green;
}
```

向右三角形

```css
.triangle {
    width: 0;
    height: 0;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 40px solid green;
}
```

等边三角形

```css
.triangle {
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 34.64px solid red; /* 20 * Math.sqrt(3)，约等于 34.64，根据勾股定理计算得出 */
}
```

>   等边三角形高与边长的关系为：高 = 边长 × Math.sqrt(3) / 2

css并不局限于创建三角形，还可以创建其他图形，如圆形、多边形等等。





## 如何实现元素的水平垂直居中？

先说结论：

-   对于行内元素，可采用 text-align 和 line-height 实现居中。
-   Flexbox 和 Grid 布局简洁易用，兼容性良好，是实现元素水平垂直居中的首选方法。
-   绝对定位+负边距适合已知子元素尺寸的情况，绝对定位+transform 则适用于未知子元素尺寸的情况

### 对于块级元素

**Flexbox**

```html
<div class="outer">
    <div class="inner"></div>
</div>
```

```css
.outer{
    background-color: orange;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.inner{
    width: 100px;
    height: 100px;
    background-color: red;
}
```

**Grid**

Grid 布局也能方便地实现水平垂直居中

```html
<div class="outer">
    <div class="inner"></div>
</div>
```

```css
.outer{
    height: 200px;
    background-color: orange;
    display: grid;
    place-items: center;

}
.inner{
    width: 100px;
    height: 100px;
    background-color: red;

}
```

**绝对定位+transform（未知子元素尺寸）**

```html
<div class="outer">
    <div class="inner"></div>
</div>
```

```css
.outer{
    height: 200px;
    background-color: orange;
    position: relative; /* 子绝父相 */
}
.inner{
    width: 100px;
    height: 100px;
    background-color: red;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

**绝对定位+负边距（已知子元素尺寸）**

```html
<div class="outer">
    <div class="inner"></div>
</div>
```

```css
.outer{
    height: 200px;
    background-color: orange;
    position: relative; /* 子绝父相 */
}
.inner{
    width: 100px;
    height: 100px;
    background-color: red;
    position: absolute;
    top: 50%;
    left: 50%;
    /* transform: translate(-50%, -50%); */
    margin-top: -50px;
    margin-left: -50px;
}
```

负边距的计算：

-   对于水平方向，需要将子元素宽度的一半作为负的左边距。例如，如果子元素的宽度是100px，那么负的左边距就是-50px，这样可以使子元素在水平方向上相对于父元素的中心位置向左移动自身宽度的一半，从而实现水平居中。

-   对于垂直方向，计算方式类似，是将子元素高度的一半作为负的上边距。比如子元素的高度是50px，则负的上边距为-25px，这会使子元素在垂直方向上相对于父元素的中心位置向上移动自身高度的一半，达到垂直居中的效果。

**表格布局法**

现在开发中不常用，但是我们也需要了解

```html
<div class="outer">
    <div class="inner">
        <div></div>
    </div>
</div>
```

```css
.outer {
    height: 200px;
    width: 200px;
    background-color: orange;
    display: table;
}

.inner {
    display: table-cell;
    vertical-align: middle;
    text-align: center;

}

.inner div {
    background-color: red;
    display: inline-block;
    width: 100px;
    height: 100px;
}
```

说明：

1、display: table：把父容器当作表格来显示，这为后续使用表格相关的布局属性奠定了基础
2、display: table-cell：把内层元素当作表格单元格来显示

3、vertical-align: middle：让表格单元格内的内容在垂直方向上居中。

4、text-align: center：使表格单元格内的文本以及行内元素（如 inline-block 元素）在水平方向上居中。

5、display: inline-block：把目标元素显示为行内块元素，这样它就能受到 text-align: center 的影响而实现水平居中

### 对于行内、行内块元素

**文本或图片等行内元素**

可使用 text-align: center 实现水平居中，用 line-height 等于元素高度实现垂直居中

```html
<div class="outer">
    <span class="inner">这是一个行内元素</span>
</div>
```

```css
.outer{
    height: 200px;
    background-color: orange;
    text-align: center; /* 水平居中 */
    line-height: 200px; /* 垂直居中 */

}
.inner{
    background-color: red;
}
```

**行内块元素**

利用 text-align: center 实现水平居中，display: flex 和 align-items: center 实现垂直居中

```html
<div class="outer">
    <div class="inner">这是一个行内块元素</div>
</div>
```

```css
.outer {
    height: 200px;
    background-color: orange;
    text-align: center; /* 水平居中 */
    display: flex;
    /* 垂直居中 */
    justify-content: center; 
    align-items: center;
}

.inner {
    display: inline-block;
    background-color: red;

}
```



## 常见的css布局单位有哪些？

https://www.mianshiya.com/bank/1810644318667538433/question/1810655448643178498#heading-0

px（像素）

em（相对于当前元素或其父元素的font-size的倍数）

rem（相对于根元素的font-size的倍数）

%（相对其父元素的百分比）





在 CSS 中，常见的布局单位可以分为绝对单位和相对单位，以下为你详细介绍：
绝对单位
px（像素）：
是最常用的绝对单位，代表屏幕上的一个物理像素点。
特点是固定大小，不会随其他元素或页面设置改变。例如设置 width: 200px; ，元素宽度就是 200 个像素。
适用于需要精确控制元素尺寸的场景，如绘制固定大小的图标、设置固定宽度的边框等。
pt（点）：
主要用于印刷设计，1 点等于 1/72 英寸。
在屏幕上显示时，其大小会根据屏幕分辨率进行换算。通常在打印样式表中使用，如设置打印文档的字体大小。
cm（厘米） 和 mm（毫米）：
是现实世界中的长度度量单位。
在屏幕上使用时，会根据设备的物理尺寸和分辨率进行转换。不过由于不同设备的显示效果差异，使用场景相对较少，主要用于需要和现实尺寸对应的设计中。
in（英寸）：
同样是现实世界的长度单位，1 英寸等于 2.54 厘米。
在屏幕上使用较少，更多用于印刷和打印相关的设计。
相对单位
em：
相对单位，相对于父元素的字体大小。例如父元素字体大小是 16px，设置子元素 width: 2em; ，则子元素宽度为 32px（16px * 2）。
常用于设置与字体大小相关的元素尺寸，如按钮内边距、子元素字体大小等，能保证元素在不同字体大小的父元素中保持相对比例。
rem：
相对于根元素（<html> 元素）的字体大小。若根元素字体大小为 16px，设置 width: 3rem; ，元素宽度就是 48px（16px * 3）。
适合用于响应式设计和全局布局，避免了 em 可能出现的级联影响，通过调整根元素字体大小可方便地实现页面整体缩放。
%（百分比）：
相对于父元素的尺寸。例如父元素宽度为 500px，子元素设置 width: 50%; ，则子元素宽度为 250px。
常用于实现响应式布局，使元素大小能根据父元素动态调整，如设置列宽、元素的内边距和外边距等。
vw 和 vh：
vw 是相对于视口宽度的单位，1vw 等于视口宽度的 1%。例如视口宽度为 1000px，width: 20vw; 则元素宽度为 200px。
vh 是相对于视口高度的单位，1vh 等于视口高度的 1%。
常用于创建与视口大小相关的布局，如全屏背景、自适应的导航栏等。
vmin 和 vmax：
vmin 取视口宽度和高度中较小值的百分比，1vmin 是其 1%。
vmax 取视口宽度和高度中较大值的百分比，1vmax 是其 1%。
可用于创建在不同视口尺寸下都能保持合适大小的元素，如圆形元素，使其在不同屏幕上都保持圆形。
ch：
基于数字 0 的宽度。如果字体中数字 0 的宽度是 10px，设置 width: 5ch; ，元素宽度大约为 50px。
常用于设置等宽字体元素的宽度，如代码块。
ex：
相对于当前字体中小写字母 x 的高度。
在一些需要根据字体的小写字母高度进行布局的场景中使用，不过使用频率相对较低



## 说说px、em、rem的区别及其使用场景？

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

-   定义：rem 也是一个相对单位，但它是相对于根元素（即 <html> 元素）的字体大小。如果根元素的字体大小是 16 px，那么 1 rem 就等于 16 px。
-   特点：
    -   相对性：rem 的值会随着根元素字体大小的变化而变化，具有良好的灵活性。
    -   统一控制：由于 rem 只相对于根元素，避免了 em 的级联影响，可以更方便地进行全局布局的调整。

**使用场景**
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

## 说说margin和padding的使用场景？

https://www.mianshiya.com/bank/1810644318667538433/question/1810655447464579073#heading-0

## 什么是margin合并、塌陷？

**margin 塌陷问题**

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

**margin合并问题**

-   上面兄弟元素的下外边距和下面兄弟元素的上外边距会合并，取一个最大的值，而不是相加。

如何解决 margin  合并？

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

## 什么是margin重叠问题？如何解决？

https://www.mianshiya.com/bank/1810644318667538433/question/1810655449649811458

**margin合并问题**

-   上面兄弟元素的下外边距和下面兄弟元素的上外边距会合并，取一个最大的值，而不是相加。

如何解决 margin  合并？

无需解决，布局的时候上下的兄弟元素，只给一个设置上下外边距就可以了。

>   需要注意的是，margin合并是css的一个特性，并非bug。

当然如果某些人非要解决margin合并问题，也不是不可以

有以下方法：

-   使用padding来替代margin
    -   需要注意的是，元素的背景也在padding区域，如果涉及到背景，则需要额外调整
-   利用css的flexbox、grid布局等避免块级元素上下相邻

## 为什么需要清除浮动？清除的方式有哪些？

>   什么是浮动？
>   浮动最初是用来实现文字环绕图片效果的，现在广泛运用于页面布局之一

清除浮动主要是为了避免由于浮动元素脱离文档流而引发的布局问题（如父元素高度塌陷）

当一个元素浮动时，他从文档流中脱离，常常会影响到其父元素和后续兄弟元素的显示效果。

典型的问题就是父元素无法包裹浮动元素的高度等。

浮动的特点：

-   1.浮动后不独占一行、不撑满父容器，由内容撑开
-   2.浮动后脱离文档流
-   3.不会margin合并、塌陷
-   4.不会像行内块一样被当做文本处理（没有行内块的空白问题）

清除浮动的方式有：

-   使用空的清除浮动元素（clearfix hack）
-   使用伪元素`::after`清除浮动
-   使用`overflow`属性清除浮动
-   使用`display: flow-root`清除浮动

解决父元素高度塌陷

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        .outer {
            width: 500px;
            background-color: gray;
            border: 1px solid black;
        }

        .box {
            width: 100px;
            height: 100px;
            background-color: skyblue;
            margin: 10px;
        }

        .box1,
        .box2,
        .box3,
        .box4 {
            float: left;
        }
    </style>
</head>

<body>
    <div class="outer">
        <div class="box box1">1</div>
        <div class="box box2">2</div>
        <div class="box box3">3</div>
        <div class="box box4">4</div>
    </div>
    <div style="background-color: orange;">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint, minus magnam accusamus eum laborum ducimus
        possimus beatae fugit illum molestias odit et asperiores adipisci sunt dolorem qui autem enim excepturi alias ab
        unde temporibus. Sapiente labore a magnam commodi itaque architecto quos doloribus voluptates perferendis rem,
        earum consectetur. Tempora inventore ducimus veritatis voluptatem deleniti rem laboriosam. Officiis, impedit
        explicabo! Impedit labore ea et vero rerum nihil in cum qui, itaque blanditiis eius nemo est? Tempora explicabo
        voluptates consectetur officia aperiam eos impedit veritatis necessitatibus quidem deleniti ea, in odit cum ex
        harum voluptas, quos eveniet quae voluptate aspernatur quod! Nostrum?
    </div>
</body>

</html>
```

第一种解决方案：给父元素指定高度

```css
.outer{
  height: 122px;
}
```

第二种解决方案：给父元素也指定浮动，但是会带来其他影响

```css
.outer{
  float: left;
}
```

第三种解决方案：给父元素设置overflow: hidden

```css
.outer{
  overflow: hidden;
}
```

第四种解决方案：在所有浮动元素最后面，添加一个块级元素，并给该块级元素设置`clear:both`

```html
 <div class="outer">
  <div class="box box1">1</div>
  <div class="box box2">2</div>
  <div class="box box3">3</div>
  <div class="box box4">4</div>
  <div class="mofa"></div>
</div>
```

```css
.mofa {
    /*
      left:元素被向下移动以清除左浮动。
      right:元素被向下移动以清除右浮动。
      both:元素被向下移动以清除左右浮动
    */
    clear: both;
}
```

第五种解决方案：给浮动元素的父元素设置一个伪元素，并给该伪元素设置clear: both，原理与方案四相同（推荐这种）

```css
.outer::after {
  content: '';
  display: block;
  clear: both;
}
```

>   这种方式开发中是比较常用的，因此也总结出来一个泛用的clearfix类来解决浮动

```css
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
```

扩展：使用`display: flow-root`清除浮动

css的`display: flow-root`属性可以创建一个新的块级格式化上下文（BFC），从而清除浮动。

```css
.outer {
  display: flow-root;
}
```

这种做法是相对比较简单的的处理方式，因为它不影响其他样式

总结：布局中的一个原则：设置浮动的时候，兄弟元素要么全部设置浮动，要么全部不设置浮动。

## 使用clear属性清除浮动原理？

https://www.mianshiya.com/bank/1810644318667538433/question/1810655449456873473





## 固定定位的参考点？

CSS固定定位(fixed)的参考点是浏览器窗口的**视口(viewport)**，而不是文档流中的任何元素。无论页面如何滚动，固定定位的元素都会保持在视口的同一位置。

示例：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>固定定位</title>
    <style>
        .box {
            width: 200px;
            height: 200px;
            font-size: 20px;
        }

        .box2 {
            background-color: green;
            position: fixed;
            /* 注意！！！固定定位、绝对定位、浮动等，都会将行盒设置为块盒，因此可以设置宽度和高度 */
            width: 200px;
            height: 200px;

            /* 小广告的感觉 */
            right: 0;
            bottom: 0;
        }
    </style>
</head>

<body>
    <div class="outer">
        <span class="box box2">哥哥需要视频聊天吗?快点击吧!</span>
    </div>
    <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem fuga esse fugiat, quaerat enim sunt suscipit id
        vitae, unde exercitationem aspernatur modi similique quia nobis voluptatibus ipsum iure autem quasi officiis
        省略1000行文本....
    </div>

</body>

</html>
```

！！！但固定定位元素的祖先的 `transform`、`perspective`、`filter`、`backdrop-filter`属性非`none`时，固定定位**相对于该祖先元素定位**

示例：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>固定定位</title>
  <!-- 
    参考点:视口
    （！！！但固定定位元素的祖先的 transform、perspective、filter、backdrop-filter属性非none时，固定定位相对于该祖先元素定位）
  -->
  <style>
    .box {
      width: 300px;
      height: 300px;
      background-color: skyblue;
      /* 固定定位，元素水平垂直居中 */
      position: fixed;
      left: 50%;
      top: 50%;
      
      /* 注意！！！这里使用了 transform */
      transform: translate(-50%, -50%);
    }

    .box .close {
      width: 50px;
      height: 50px;
      background-color: red;
      border-radius: 50%;
      /* ！！！固定定位元素的祖先的 transform、perspective、filter、backdrop-filter属性非none时，
      固定定位相对于该祖先元素定位 */
      position: fixed;
      right: 0;
      top: 0;

      /* 虽然上面这种方式可以让close在其祖先元素的右上角，但是开发中，一般情况下这种效果我们会使用绝对定位来实现 */
      /* position: absolute;
      right: 0;
      top: 0; */

      /* 所以，学习固定定位的特殊参考点（非视口）是为了在开发中，我们使用固定定位完成一些效果时，一直达不到要求时，方便排查问题 */
    }
  </style>
</head>

<body>
  <div class="box">
    <div class="close"></div>
  </div>
</body>
</html>
```





## overflow: hidden 、 display: none、visibility: hidden 有什么区别 ？

-   `display: none;` 加在元素自身，元素自身隐藏，元素占据的位置也不存在了
-   `visibility: hidden;` 加在元素自身，元素自身隐藏，元素占据的位置依然存在
-   `overflow:hidden;` 加在父元素身上，当父元素中的子元素超出父元素宽高时，超出部分隐藏。隐藏的部分依然占据着位置。（父元素必需是块级或行内块级元素)



## display:none; 与 visibility:hidden; 两者的区别 ？

| 区别         | display: none                                                | visibility: hidden                                           |
| :----------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 空间占据性   | 不占据空间                                                   | 占据原空间                                                   |
| 回流与渲染性 | 会产生回流与重绘                                             | 不会产生回流，只会产生重绘                                   |
| 对子元素影响 | 子孙元素全部隐藏不可见。并且只要父元素隐藏，子孙没有任何办法可见 | 子孙元素全部不可见，但是给子孙加上 `visibility: visible;`时，子孙可见。 |