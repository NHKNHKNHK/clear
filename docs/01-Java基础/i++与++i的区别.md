# i++ 与 ++i 的**区别**

-   i++：后置递增，先返回当前值，再自增
-   ++i：前置递增，先自增，再返回新值

**示例：**

```java
public static void main(String[] args){
    int i = 1;

    System.out.println("i: "  +   i);	// 1
    System.out.println("++i: "+   ++i); // 2
    System.out.println("i++: "+   i++); // 2
    System.out.println("i: "  +     i); // 3
    System.out.println("--i: "+   --i); // 2
    System.out.println("i--: "+   i--); // 2
    System.out.println("i: "  +   i);   // 1
}
```
