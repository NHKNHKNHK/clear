# ArrayList集合中的elementData数组为什么要加transient修饰

elementData数组中可能有很多`null`值，通常情况下`size` < `elementData.length`，因此序列化时，只需要序列化size个对象即可，而不是整个数组。

因此ArrayList类中手动实现了`writeObject`和`readObject`方法定制了特殊的序列化过程。