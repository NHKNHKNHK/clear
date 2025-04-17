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