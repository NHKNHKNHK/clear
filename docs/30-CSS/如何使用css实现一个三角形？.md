# 如何使用css实现一个三角形？

# 如何使用css实现一个三角形？

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

## **扩展**

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

:::tip
css并不局限于创建三角形，还可以创建其他图形，如圆形、多边形等等。
:::