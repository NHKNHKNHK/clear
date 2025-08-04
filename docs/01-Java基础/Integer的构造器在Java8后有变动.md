# Integer的构造器在Java8后有变动？

```java
public Integer(int value) {
    this.value = value;
} // 从jdk9开始，此构造器被标记为 @Deprecated ，而推荐使用valueOf方法
```