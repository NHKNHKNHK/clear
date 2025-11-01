# 为什么不把Iterable和Iterator合成一个使用

- 通过Javadoc文档我们可以发现，Iterable和Iterator并不是同时出现的，`Iterator`于`1.2`就出现了，目的是为了代替`Enumeration`，而`Iterable`则是`1.5`才出现的

- 将`是否可以迭代`和`迭代方式`抽出来，更符合**单一职责原则**，如果抽出来，迭代方式就可以被多个可迭代的集合复用，更符合面向对象的特点。

> [Enumeration和Iterator接口的区别？](./Enumeration和Iterator接口的区别？.md)