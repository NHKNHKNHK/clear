# private、public、protected以及不写的区别？

在Java中，访问修饰符（access modifiers）用于控制类、方法和变量的访问级别。主要有四种访问修饰符：private、public、protected和 默认（不写）。

它们的区别如下：

**private**

-   **访问范围**：仅在同一个类内可访问。

-   **使用场景**：用于隐藏类的实现细节，保护类的成员变量和方法不被外部类访问和修改

**public**

-   **访问范围**：在任何地方都可以访问。

-   **使用场景**：用于类、方法或变量需要被其他类访问的情况

**protected**

-   **访问范围**：在同一个包内，以及在不同包中的子类中可访问。

-   **使用场景**：用于希望在同一个包内或子类中访问，但不希望在包外的非子类中访问的情况

**默认（不写）**

-   **访问范围**：仅在同一个包内可访问。

-   **使用场景**：用于包级访问控制，不希望类、方法或变量被包外的类访问

| 修饰符       | 同一个类 | 同一个包 | 子类（不同包） | 其他包 |
| ------------ | -------- | -------- | -------------- | ------ |
| private      | 是       | 否       | 否             | 否     |
| 默认（不写） | 是       | 是       | 否             | 否     |
| protected    | 是       | 是       | 是             | 否     |
| public       | 是       | 是       | 是             | 是     |

```java
package package1;

public class PublicClass {
    private int privateVar;
    int defaultVar;
    protected int protectedVar;
    public int publicVar;

    private void privateMethod() {}
    void defaultMethod() {}
    protected void protectedMethod() {}
    public void publicMethod() {}
}

package package2;

import package1.PublicClass;

public class SubClass extends PublicClass {
    public void accessMethods() {
        // privateMethod(); // 错误，无法访问
        // defaultMethod(); // 错误，无法访问
        protectedMethod(); // 正确，可以访问
        publicMethod(); // 正确，可以访问
    }
}

package package1;

public class SamePackageClass {
    public void accessMethods() {
        PublicClass obj = new PublicClass();
        // obj.privateMethod(); // 错误，无法访问
        obj.defaultMethod(); // 正确，可以访问
        obj.protectedMethod(); // 正确，可以访问
        obj.publicMethod(); // 正确，可以访问
    }
}
```
