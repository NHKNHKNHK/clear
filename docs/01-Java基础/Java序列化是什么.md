# Java序列化是什么

Java 序列化（Serialization）是将对象的状态转换为字节流的过程，以便将其保存到文件、内存或通过网络传输。反序列化（Deserialization）则是将字节流恢复为对象的过程。序列化和反序列化是 Java 中实现对象持久化和远程通信的重要机制。

## **主要用途**

-   **对象持久化**：将对象状态保存到磁盘，以便稍后可以恢复。

-   **网络传输**：通过网络发送对象时，需要将其转换为字节流进行传输。

-   **分布式系统**：在分布式系统中，对象可以在不同的 JVM 之间传递。

## **实现序列化的步骤**

要使一个类的对象可序列化，该类必须实现 `java.io.Serializable` 接口。Serializable 是一个**标记接口**，它不包含任何方法，只是用来标识该类的对象可以被序列化。

如果不实现此接口的类将不会使任何状态序列化或反序列化，会抛出 `NotSerializableException` 。 

-   如果对象的某个属性也是引用数据类型，那么如果该属性也要序列化的话，也要实现`Serializable` 接口 
-   该类的所有属性必须是可序列化的。如果有一个属性不需要可序列化的，则该属性必须注明是**瞬态的**，使用 `transient `关键字修饰。 
-   静态（**static**）变量的值不会序列化。因为静态变量的值不属于某个对象

```java
import java.io.Serializable;

public class Person implements Serializable {
    private static final long serialVersionUID = 1L; // 建议显式指定版本号

    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }
}
```

## **序列化对象**

使用 `ObjectOutputStream` 将对象写入文件或输出流。

```java
import java.io.*;

public class SerializeExample {
    public static void main(String[] args) {
        Person person = new Person("Alice", 30);
        String filePath = "person.ser";

        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(filePath))) {
            oos.writeObject(person);
            System.out.println("Object serialized and saved to " + filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## **反序列化对象**

使用 `ObjectInputStream` 从文件或输入流读取对象。

```java
import java.io.*;

public class DeserializeExample {
    public static void main(String[] args) {
        String filePath = "person.ser";
        Person person = null;

        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(filePath))) {
            person = (Person) ois.readObject();
            System.out.println("Object deserialized: " + person);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```



## **反序列化失败问题**

**问题1：**

对于 JVM 可以反序列化对象，它必须是能够找到 class 文件的类。如果找不到该类的 class 文件，则抛出一个 `ClassNotFoundException` 异常

**问题2：**

当 JVM 反序列化对象时，能找到 class 文件，但是 class 文件在序列化对象之后发生了修改，那么反序列化操作也会失败，抛出一个 `InvalidClassException`异常。发生这个异常的原因如下： 

-   该类的序列版本号与从流中读取的类描述符的版本号不匹配 
-   该类包含未知数据类型 

**解决方法：**

`Serializable` 接口给需要序列化的类，提供了一个序列版本号： `serialVersionUID` 。凡是实现 Serializable 接口的类都应该有一个表示序列化版本标识符的静态变量： 

```JAVA
static final long serialVersionUID = 234242343243L;  // 它的值由程序员随意指定即可
```

-   serialVersionUID 用来表明类的不同版本间的兼容性。简单来说，Java 的序列化机制是通过在运行时判断类的 serialVersionUID 来验证版本一致性的。在进行反序列化时，JVM 会把传来的字节流中的 serialVersionUID 与本地相应实体类的 serialVersionUID 进行比较，如果相同就认为是一致的，可以进行反序列化，否则就会出现序列化版本不一致的异常(InvalidCastException)。 

-   如果类没有显示定义这个静态常量，它的值是 Java 运行时环境根据类的内部细节（包括类名、接口名、成员方法和属性等）自动生成的。若类的实例变量做了修改，serialVersionUID 可能发生变化。因此，建议显式声明。 

-   如果声明了 serialVersionUID，即使在序列化完成之后修改了类导致类重新编译，则原来的数据也能正常反序列化，只是新增的字段值是默认值而已。


