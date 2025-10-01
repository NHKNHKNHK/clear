# Lombok

Lombok是一个Java库，它**通过注解的方式简化了Java代码的编写**，减少了样板代码的数量，提高了开发效率。

使用Lombok可以省略一些常见的Java代码，如getter和setter方法、构造函数、equals和hashCode方法、toString方法等。通过在类上添加相应的注解，Lombok会在编译时自动为类生成这些代码。

常用的Lombok注解：

-   `@Getter`和`@Setter`：自动生成字段的getter和setter方法。
-   `@NoArgsConstructor`：自动生成无参构造函数。
-   `@AllArgsConstructor`：自动生成包含所有字段的构造函数。
-   `@EqualsAndHashCode`：自动生成`equals()`和`hashCode()`方法。
-   `@ToString`：自动生成`toString()`方法。
-   `@Data`：包含了`@Getter`、`@Setter`、`@EqualsAndHashCode`和`@ToString`的功能，可以一次性生成所有常用方法。
-   `@Builder`：生成Builder模式的构造器。

## Lombok的使用

**方式一：javac**

-   拷贝jar包到类路径
-   javac -cp lombok.jar ...

**方式二：Maven**

-   引入Lombok库的依赖
-   并在IDE中安装Lombok插件(以便在编译时正确处理Lombok注解)

​	Lombok的使用可以简化代码，减少样板代码的编写，提高开发效率。但需要注意的是，使用Lombok可能会导致一些工具无法正确解析生成的代码，因此在使用Lombok时需要谨慎考虑。

**pom.xml**

```xml
<dependencies>
    <!-- Lombok依赖 -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.20</version>
        <!-- 该依赖在编译时和测试时可用，但在打包时不会被包含在最终构建产物中 -->
        <scope>provided</scope>
    </dependency>
</dependencies>
```

说明：

​	为了让IDE正确处理Lombok注解，我们还需要在IDE中安装Lombok插件。不同的IDE安装Lombok插件的方式可能有所不同，请根据自己使用的IDE进行相应的安装配置。

注意：

​	Lombok是在==编译时通过注解处理器生成代码==，因此在使用Lombok时，IDE可能无法正确地显示生成的代码。但在编译时，Lombok会自动为我们生成相应的代码，所以在实际运行时是没有问题的。



## lombok的注解

@Getter / @Setter：自动生成字段的getter和setter方法

@FieldNameConstants：用于在编译时期自动生成字段名的常量

@ToString：自动生成`toString()`方法

@EqualsAndHashCode：自动生成`equals()`和`hashCode()`方法

@NoArgsConstructor：自动生成无参构造方法

@AllArgsConstructor：自动生成全参构造方法

@RequiredArgsConstructor：自动生成必需参数的构造方法

@Data： 包含了`@Getter`、`@Setter`、`@ToString`、`@EqualsAndHashCode`和`@RequiredArgsConstructor`的组合注解

@Value: 类似于`@Data`，但生成的类是不可变的（immutable）（简单来说就是被final修饰）

@Cleanup： 自动关闭资源，如IO流。

@NonNull: 标记字段或参数为非空。

@Log：自动生成`java.util.logging.Logger`对象

@Log4j：

@Log4j2

@Slf4j：自动生成`org.slf4j.Logger`对象

@XSlf4j

@CommonsLog：自动生成`org.apache.commons.logging.Log`对象

 @JBossLog

 @Flogger

@CustomLog

@Builder：自动生成Builder模式的构造方法

@SuperBuilder：

@Singular：

@Delegate

@Accessors：配置链式调用和Fluent API风格的方法

@Wither

@With

@SneakyThrows

@StandardException

`@Synchronized`: 自动生成同步锁

@val

@var

@UtilityClass



### @Getter / @Setter

-   @Getter和@Setter用于**自动生成Java类的getter和setter方法**

-   生成的方法**默认是 public 修饰**，可以使用 `AccessLevel` 类 设置方法的修饰符

```java
public enum AccessLevel {
	PUBLIC, MODULE, PROTECTED, PACKAGE, PRIVATE,
    // 表示不生成任何内容或完全缺乏方法
	NONE;
}
```

-   @Getter和@Setter注解**可以用在类级别或字段级别**（即可以用在类上，或特定字段上）

注意：

-   @Getter和@Setter只对成员属性有作用，static属性不会生成getter和setter方法
-   对 final 修饰的属性，只会生成getter方法（不会生成setter方法）

演示：

```java
@Getter(AccessLevel.PUBLIC)
@Setter
public class User {
    private Integer id;
    private String userName;
    private String passWord;
    @Setter(AccessLevel.NONE) // 排除该属性生成setter方法
    private String phone;
    // @Getter和 @Setter 注解对类变量不起作用
    static String area = "广东";
    // 对 final 修饰的属性，只会生成getter方法
    final int cc = 10;
}
```

反编译后：

```java
public class User {
    private Integer id;
    private String userName;
    private String passWord;
    private String phone;
    static String area = "广东";
    final int cc = 10;

    public User() {
    }

    public Integer getId() {
        return this.id;
    }

    public String getUserName() {
        return this.userName;
    }

    public String getPassWord() {
        return this.passWord;
    }

    public String getPhone() {
        return this.phone;
    }

    public int getCc() {
        this.getClass();
        return 10;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setPassWord(String passWord) {
        this.passWord = passWord;
    }
}
```

### @ToString

-   @ToString注解用于自动生成Java类的toString方法，它会按照默认的格式将类的字段名和字段值拼接成一个字符串

-   **默认情况下，@ToString会包含所有非静态字段**（不包含类变量）
    -   对于没有getter和setter方法的成员属性，会使用 this.属性名 的方式拼接在toString方法中
    -   可以通过`exclude`属性来**排除某些字段**，
    -   可以通过`of`属性**用于指定要包含在的字段**（可以将类中的类变量加入到toString方法中）
    -   可以通过`includeFieldNames`属性来指定**是否在生成的toString方法中包含字段的名称**。默认情况下，includeFieldNames的值为true

-   @ToString注解**只能用在类级别**

演示1：

```java
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class User {
    private Integer id;
    private String userName;
    private String passWord;
    @Setter(AccessLevel.NONE) // 排除该属性生成setter方法
    private String phone;
    // @Getter和 @Setter 注解对类变量不起作用
    static String area = "广东";
    // 对 final 修饰的属性，只会生成getter方法
    final int cc = 10;
}
```

反编译后：

```java
public class User {
    private Integer id;
    private String userName;
    private String passWord;
    private String phone;
    static String area = "广东";
    final int cc = 10;

    ...

    public String toString() {
        return "User(id=" + this.getId() + ", userName=" + this.getUserName() + ", passWord=" + this.getPassWord() + ", phone=" + this.getPhone() + ", cc=" + this.getCc() + ")";
    }
}
```

演示1：

可以通过`exclude`属性来排除某些字段

```java
@Getter
@Setter
@ToString(exclude = {"passWord"})  // 排除toString在输入passWord属性
public class User {
    private Integer id;
    private String userName;
    private String passWord;
    @Setter(AccessLevel.NONE) // 排除该属性生成setter方法
    @Getter(AccessLevel.NONE)  // 排除该属性生成getter方法
    private String phone;
    // @Getter和 @Setter 注解对类变量不起作用
    static String area = "广东";
    // 对 final 修饰的属性，只会生成getter方法
    final int cc = 10;
}
```

反编译后：

```java
public class User {
    private Integer id;
    private String userName;
    private String passWord;
    private String phone;
    static String area = "广东";
    final int cc = 10;

    ...

    public String toString() {	// phone字段没有生成getter方法，使用 this.phone
        return "User(id=" + this.getId() + ", userName=" + this.getUserName() + ", phone=" + this.phone + ", cc=" + this.getCc() + ")";
    }
}
```

### @EqualsAndHashCode

-   @EqualsAndHashCode注解用于自动生成Java类的equals和hashCode方法，还有canEqual方法

-   默认情况下，@EqualsAndHashCode会包含所有非静态和非瞬态的字段
    -   可以通过`exclude`属性来**排除某些字段**，
    -   可以通过`of`属性**用于指定要包含在的字段**
    -   可以通过`onlyExplicitlyIncluded`属性指定只包含被`@EqualsAndHashCode.Include`注解标记的字段放入equals和hashCode方法

演示：

```java
@Getter
@Setter
@ToString()
// 默认会将所有的非静态和非瞬态的字段放入
// 可通过exclude排除字段或of指定那些字段放入
@EqualsAndHashCode(of={"userName","passWord"})
public class User {
    private Integer id;
    private String userName;
    private String passWord;
    @Setter(AccessLevel.NONE) // 排除该属性生成setter方法
    @Getter(AccessLevel.NONE)  // 排除该属性生成getter方法
    private String phone;
    // @Getter和 @Setter 注解对类变量不起作用
    static String area = "广东";
    // 对 final 修饰的属性，只会生成getter方法
    final int cc = 10;
}
```

反编译后：

```java
public class User {
    private Integer id;
    private String userName;
    private String passWord;
    private String phone;
    static String area = "广东";
    final int cc = 10;
	
    ...

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof User)) {
            return false;
        } else {
            User other = (User)o;
            if (!other.canEqual(this)) {
                return false;
            } else {
                Object this$userName = this.getUserName();
                Object other$userName = other.getUserName();
                if (this$userName == null) {
                    if (other$userName != null) {
                        return false;
                    }
                } else if (!this$userName.equals(other$userName)) {
                    return false;
                }

                Object this$passWord = this.getPassWord();
                Object other$passWord = other.getPassWord();
                if (this$passWord == null) {
                    if (other$passWord != null) {
                        return false;
                    }
                } else if (!this$passWord.equals(other$passWord)) {
                    return false;
                }

                return true;
            }
        }
    }

    protected boolean canEqual(Object other) {
        return other instanceof User;
    }

    public int hashCode() {
        int PRIME = true;
        int result = 1;
        Object $userName = this.getUserName();
        result = result * 59 + ($userName == null ? 43 : $userName.hashCode());
        Object $passWord = this.getPassWord();
        result = result * 59 + ($passWord == null ? 43 : $passWord.hashCode());
        return result;
    }
}
```

### @NonNull

-   @NonNull注解用于标记字段、方法参数或方法返回值不允许为null
-   使用@NonNull注解可以在编译时自动生成null值检查的代码，**减少了手动编写null检查的工作量**
-   当我们在字段、方法参数或方法返回值上使用@NonNull注解时，Lombok会自动在编译时生成相应的null检查代码。如果在运行时发现null值，会抛出NullPointerException异常

演示1：

```java
// @NonNull注解标记普通方法的参数
public void test(@NonNull String name){  
    // 使用@NonNull注解标记name参数，表示该参数不允许为null，会在编译时生成相应的null检查代码，以确保不会出现空指针异常
    System.out.printf("%s你好\r\n",name);
}
```

反编译后：

```java
public void test(@NonNull String name) {
    if (name == null) {		// 这里的判断非空就是Lombok注解生成的
        throw new NullPointerException("name is marked non-null but is null");
    } else {
        System.out.printf("%s你好\r\n", name);
    }
}
```

演示2：

```java
public class User {
    private Integer id;
    @NonNull private String userName;  // @NonNull注解标记该参数表示该参数不能为空
    private String passWord;
 
    @NonNull
    public User(String userName, String passWord){
        this.userName = userName;
        this.passWord = passWord;
    }
}
```

反编译后：

```java
public class User {
    private Integer id;
    private @NonNull String userName;
    private String passWord;

    public @NonNull User(String userName, String passWord) {
        this.userName = userName;
        this.passWord = passWord;
    }
}
```

### Constructor相关

-   @NoArgsConstructor注解用于自动**生成无参构造方法**

-   @AllArgsConstructor注解用于**自动生成全参构造方法**
-   @RequiredArgsConstructor注解用于**自动生成带有被@NonNull注解标记的字段的构造方法**。
    -   构造方法包含被**@NonNull**注解标记的字段
    -   构造方法包含被**final**修饰且没有赋值的字段

演示1：

```java
@NoArgsConstructor  // 生成无参构造器
@AllArgsConstructor  // 生成全参构造器
@RequiredArgsConstructor  // 生成带有被@NonNull注解标记的字段的构造器
public class User {
    private Integer id;
    @NonNull private String userName;  // @NonNull注解标记该参数表示该参数不能为空
    @NonNull private String passWord;
    private String phone;
 
    static String area = "广东";
    final int cc = 10;
}
```

反编译后：

```java
public class User {
    private Integer id;
    private @NonNull String userName;
    private @NonNull String passWord;
    private String phone;
    static String area = "广东";
    final int cc = 10;

    public User() {		// 生成的无参构造器
    }

    public User(Integer id, @NonNull String userName, @NonNull String passWord, String phone) {			// 生成的全参构造器
        if (userName == null) {
            throw new NullPointerException("userName is marked non-null but is null");
        } else if (passWord == null) {
            throw new NullPointerException("passWord is marked non-null but is null");
        } else {
            this.id = id;
            this.userName = userName;
            this.passWord = passWord;
            this.phone = phone;
        }
    }

    public User(@NonNull String userName, @NonNull String passWord) {
        if (userName == null) {
            throw new NullPointerException("userName is marked non-null but is null");
        } else if (passWord == null) {
            throw new NullPointerException("passWord is marked non-null but is null");
        } else {
            this.userName = userName;
            this.passWord = passWord;
        }
    }
}
```

演示2：

@RequiredArgsConstructor注解用于**自动生成带有被@NonNull注解标记的字段的构造方法**。

-   构造方法包含被@NonNull注解标记的字段
-   构造方法包含被final修饰且没有赋值的字段

```java
@RequiredArgsConstructor  // 生成带有被@NonNull注解标记、final修饰未赋值的字段的构造器
public class User {
    private Integer id;
    @NonNull private String userName;  // @NonNull注解标记该参数表示该参数不能为空
    @NonNull private String passWord;
    private String phone;

    static String area = "广东";
    final int cc;  // final修饰
}
```

反编译后：

```java
public class User {
    private Integer id;
    private @NonNull String userName;
    private @NonNull String passWord;
    private String phone;
    static String area = "广东";
    final int cc;

    public User(@NonNull String userName, @NonNull String passWord, int cc) {
        if (userName == null) {
            throw new NullPointerException("userName is marked non-null but is null");
        } else if (passWord == null) {
            throw new NullPointerException("passWord is marked non-null but is null");
        } else {
            this.userName = userName;
            this.passWord = passWord;
            this.cc = cc;
        }
    }
}
```

### @Data

-   @Data： 包含了`@Getter`、`@Setter`、`@ToString`、`@EqualsAndHashCode`和`@RequiredArgsConstructor`的组合注解

-   @Data注解用于自动生成Java类的常用方法，如getter、setter、equals、hashCode和toString、构造器

-   @Data注解使用细节：

    -   使用方式：在类上添加@Data注解即可
    -   自动生成的方法：@Data注解会为类生成以下方法：
        -   所有非静态字段的getter方法。
        -   所有非静态字段的setter方法。
        -   equals方法，用于比较两个对象是否相等。
        -   hashCode方法，用于生成对象的哈希码。
        -   toString方法，用于返回对象的字符串表示。

    -   静态字段和 final字段：@Data注解不会为静态字段和final字段生成setter方法。
    -   继承和接口：@Data注解也可以用于继承和实现接口的类。
    -   额外方法：如果需要在生成的方法之外添加其他方法，可以手动编写这些方法，它们不会被@Data注解覆盖

演示：

```java
package com.clear;

import com.sun.istack.internal.NotNull;
import lombok.*;

//@Getter
//@Setter
//@ToString()
//// 默认会将所有的非静态和非瞬态的字段放入
//// 可通过exclude排除字段或of指定那些字段放入
//@EqualsAndHashCode(of={"userName","passWord"},onlyExplicitlyIncluded = true)
//@NoArgsConstructor  // 生成无参构造器
//@AllArgsConstructor  // 生成全参构造器
//@RequiredArgsConstructor  // 生成带有被@NonNull注解标记、final修饰未赋值的字段的构造器

@Data
public class User {
    private Integer id;
    @NonNull private String userName;  // @NonNull注解标记该参数表示该参数不能为空
    @NonNull private String passWord;
//    @Setter(AccessLevel.NONE) // 排除该属性生成setter方法
//    @Getter(AccessLevel.NONE)  // 排除该属性生成getter方法
    private String phone;
    // @Getter和 @Setter 注解对类变量不起作用
    static String area = "广东";
    // 对 final 修饰的属性，只会生成getter方法
    final int cc = 10;
}
```

反编译后：

```java
public class User {
    private Integer id;
    private @NonNull String userName;
    private @NonNull String passWord;
    private String phone;
    static String area = "广东";
    final int cc = 10;

    public User(@NonNull String userName, @NonNull String passWord) {  // 生成的构造器
        if (userName == null) {
            throw new NullPointerException("userName is marked non-null but is null");
        } else if (passWord == null) {
            throw new NullPointerException("passWord is marked non-null but is null");
        } else {
            this.userName = userName;
            this.passWord = passWord;
        }
    }

    public Integer getId() {
        return this.id;
    }

    public @NonNull String getUserName() {
        return this.userName;
    }

    public @NonNull String getPassWord() {
        return this.passWord;
    }

    public String getPhone() {
        return this.phone;
    }

    public int getCc() {
        this.getClass();
        return 10;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setUserName(@NonNull String userName) {
        if (userName == null) {
            throw new NullPointerException("userName is marked non-null but is null");
        } else {
            this.userName = userName;
        }
    }

    public void setPassWord(@NonNull String passWord) {
        if (passWord == null) {
            throw new NullPointerException("passWord is marked non-null but is null");
        } else {
            this.passWord = passWord;
        }
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof User)) {
            return false;
        } else {
            User other = (User)o;
            if (!other.canEqual(this)) {
                return false;
            } else if (this.getCc() != other.getCc()) {
                return false;
            } else {
                label61: {
                    Object this$id = this.getId();
                    Object other$id = other.getId();
                    if (this$id == null) {
                        if (other$id == null) {
                            break label61;
                        }
                    } else if (this$id.equals(other$id)) {
                        break label61;
                    }

                    return false;
                }

                label54: {
                    Object this$userName = this.getUserName();
                    Object other$userName = other.getUserName();
                    if (this$userName == null) {
                        if (other$userName == null) {
                            break label54;
                        }
                    } else if (this$userName.equals(other$userName)) {
                        break label54;
                    }

                    return false;
                }

                Object this$passWord = this.getPassWord();
                Object other$passWord = other.getPassWord();
                if (this$passWord == null) {
                    if (other$passWord != null) {
                        return false;
                    }
                } else if (!this$passWord.equals(other$passWord)) {
                    return false;
                }

                Object this$phone = this.getPhone();
                Object other$phone = other.getPhone();
                if (this$phone == null) {
                    if (other$phone != null) {
                        return false;
                    }
                } else if (!this$phone.equals(other$phone)) {
                    return false;
                }

                return true;
            }
        }
    }

    protected boolean canEqual(Object other) {
        return other instanceof User;
    }

    public int hashCode() {
        int PRIME = true;
        int result = 1;
        result = result * 59 + this.getCc();
        Object $id = this.getId();
        result = result * 59 + ($id == null ? 43 : $id.hashCode());
        Object $userName = this.getUserName();
        result = result * 59 + ($userName == null ? 43 : $userName.hashCode());
        Object $passWord = this.getPassWord();
        result = result * 59 + ($passWord == null ? 43 : $passWord.hashCode());
        Object $phone = this.getPhone();
        result = result * 59 + ($phone == null ? 43 : $phone.hashCode());
        return result;
    }

    public String toString() {
        return "User(id=" + this.getId() + ", userName=" + this.getUserName() + ", passWord=" + this.getPassWord() + ", phone=" + this.getPhone() + ", cc=" + this.getCc() + ")";
    }
}
```

### @Value

-   @Value: 类似于`@Data`，但生成的类是不可变的（immutable）

-   @Value是Lombok库中的注解，用于生成一个不可变的Java类

-   @Value注解使用细节

    -   使用方式：在类上添加@Value注解即可。
    -   自动生成的方法：@Value注解会为类生成以下方法：
        -   所有字段的getter方法。
    -   equals方法，用于比较两个对象是否相等。
    -   hashCode方法，用于生成对象的哈希码。
    -   toString方法，用于返回对象的字符串表示。
    -   不可变性：由于所有字段都是final的，@Value注解生成的类是不可变的。这意味着一旦创建了对象，就无法修改其字段的值。

    -   构造方法：@Value注解**会为类生成一个包含所有字段的构造方法**（final修饰但未赋值的也会包含）。这个构造方法会将所有字段作为参数，并在对象创建时初始化这些字段。
        -   这一点和@Data不同，**@Data生成的构造器只包含@NonNull标记和final修饰未赋值的字段**
        -   **@Value生成的构造器会包含所有的字段，除了final修饰且赋值的字段**
    -   继承和接口：@Value注解也可以用于继承和实现接口的类。

演示：

```java
@Value
public class User {
    private Integer id;
    @NonNull private String userName;  // @NonNull注解标记该参数表示该参数不能为空
    @NonNull private String passWord;
    private String phone;
  
    static String area = "广东";
    final int cc = 10;
}
```

反编译后：

```java
public final class User {
    private final Integer id;		// 与 @Data的区别，所有字段都final修饰了
    private final @NonNull String userName;
    private final @NonNull String passWord;
    private final String phone;
    static String area = "广东";
    private final int cc = 10;

    public User(Integer id, @NonNull String userName, @NonNull String passWord, String phone) {	// 与 @Data的区别，没有@NouNull标记的字段也放入了构造器
        if (userName == null) {
            throw new NullPointerException("userName is marked non-null but is null");
        } else if (passWord == null) {
            throw new NullPointerException("passWord is marked non-null but is null");
        } else {
            this.id = id;
            this.userName = userName;
            this.passWord = passWord;
            this.phone = phone;
        }
    }

    public Integer getId() {
        return this.id;
    }

    public @NonNull String getUserName() {
        return this.userName;
    }

    public @NonNull String getPassWord() {
        return this.passWord;
    }

    public String getPhone() {
        return this.phone;
    }

    public int getCc() {
        this.getClass();
        return 10;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof User)) {
            return false;
        } else {
            User other = (User)o;
            if (this.getCc() != other.getCc()) {
                return false;
            } else {
                label59: {
                    Object this$id = this.getId();
                    Object other$id = other.getId();
                    if (this$id == null) {
                        if (other$id == null) {
                            break label59;
                        }
                    } else if (this$id.equals(other$id)) {
                        break label59;
                    }

                    return false;
                }

                Object this$userName = this.getUserName();
                Object other$userName = other.getUserName();
                if (this$userName == null) {
                    if (other$userName != null) {
                        return false;
                    }
                } else if (!this$userName.equals(other$userName)) {
                    return false;
                }

                Object this$passWord = this.getPassWord();
                Object other$passWord = other.getPassWord();
                if (this$passWord == null) {
                    if (other$passWord != null) {
                        return false;
                    }
                } else if (!this$passWord.equals(other$passWord)) {
                    return false;
                }

                Object this$phone = this.getPhone();
                Object other$phone = other.getPhone();
                if (this$phone == null) {
                    if (other$phone != null) {
                        return false;
                    }
                } else if (!this$phone.equals(other$phone)) {
                    return false;
                }

                return true;
            }
        }
    }

    public int hashCode() {
        int PRIME = true;
        int result = 1;
        result = result * 59 + this.getCc();
        Object $id = this.getId();
        result = result * 59 + ($id == null ? 43 : $id.hashCode());
        Object $userName = this.getUserName();
        result = result * 59 + ($userName == null ? 43 : $userName.hashCode());
        Object $passWord = this.getPassWord();
        result = result * 59 + ($passWord == null ? 43 : $passWord.hashCode());
        Object $phone = this.getPhone();
        result = result * 59 + ($phone == null ? 43 : $phone.hashCode());
        return result;
    }

    public String toString() {
        return "User(id=" + this.getId() + ", userName=" + this.getUserName() + ", passWord=" + this.getPassWord() + ", phone=" + this.getPhone() + ", cc=" + this.getCc() + ")";
    }
}
```

### @Builder

-   @Builder注解用于生成一个建造者模式的Java类。通过使用@Builder注解，可以方便地创建具有复杂构造参数的对象，而无需手动编写繁琐的构造方法。

-   使用@Builder注解的类需要满足以下条件：
    -   **类必须是一个具体的类**，不能是接口或抽象类。
    -   **类必须具有至少一个非静态字段**。

-   @Builder注解使用细节：
    -   使用方式：在类上添加@Builder注解即可。
    -   自动生成的方法：@Builder注解会为类生成一个静态内部类Builder，该Builder类包含以下方法：
        -   针对每个非静态字段的setter方法，用于设置字段的值。
        -   build方法，用于创建最终的对象

演示：

```java
@Data
@Builder
public class User {
    private Integer id;
    @NonNull private String userName;  // @NonNull注解标记该参数表示该参数不能为空
    @NonNull private String passWord;
    @Setter(AccessLevel.NONE) // 排除该属性生成setter方法
    @Getter(AccessLevel.NONE)  // 排除该属性生成getter方法
    private String phone;
    // @Getter和 @Setter 注解对类变量不起作用
    static String area = "广东";
    // 对 final 修饰的属性，只会生成getter方法
    final int cc = 10;
}
```

反编译后：

```java
public class User {
    private Integer id;
    private @NonNull String userName;
    private @NonNull String passWord;
    private String phone;
    static String area = "广东";
    final int cc = 10;

    User(Integer id, @NonNull String userName, @NonNull String passWord, String phone) {
        if (userName == null) {
            throw new NullPointerException("userName is marked non-null but is null");
        } else if (passWord == null) {
            throw new NullPointerException("passWord is marked non-null but is null");
        } else {
            this.id = id;
            this.userName = userName;
            this.passWord = passWord;
            this.phone = phone;
        }
    }

    public static UserBuilder builder() {	// 使用 @Builder 生成的
        return new UserBuilder();
    }

    public Integer getId() {
        return this.id;
    }

    public @NonNull String getUserName() {
        return this.userName;
    }

    public @NonNull String getPassWord() {
        return this.passWord;
    }

    public int getCc() {
        this.getClass();
        return 10;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setUserName(@NonNull String userName) {
        if (userName == null) {
            throw new NullPointerException("userName is marked non-null but is null");
        } else {
            this.userName = userName;
        }
    }

    public void setPassWord(@NonNull String passWord) {
        if (passWord == null) {
            throw new NullPointerException("passWord is marked non-null but is null");
        } else {
            this.passWord = passWord;
        }
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof User)) {
            return false;
        } else {
            User other = (User)o;
            if (!other.canEqual(this)) {
                return false;
            } else if (this.getCc() != other.getCc()) {
                return false;
            } else {
                label61: {
                    Object this$id = this.getId();
                    Object other$id = other.getId();
                    if (this$id == null) {
                        if (other$id == null) {
                            break label61;
                        }
                    } else if (this$id.equals(other$id)) {
                        break label61;
                    }

                    return false;
                }

                label54: {
                    Object this$userName = this.getUserName();
                    Object other$userName = other.getUserName();
                    if (this$userName == null) {
                        if (other$userName == null) {
                            break label54;
                        }
                    } else if (this$userName.equals(other$userName)) {
                        break label54;
                    }

                    return false;
                }

                Object this$passWord = this.getPassWord();
                Object other$passWord = other.getPassWord();
                if (this$passWord == null) {
                    if (other$passWord != null) {
                        return false;
                    }
                } else if (!this$passWord.equals(other$passWord)) {
                    return false;
                }

                Object this$phone = this.phone;
                Object other$phone = other.phone;
                if (this$phone == null) {
                    if (other$phone != null) {
                        return false;
                    }
                } else if (!this$phone.equals(other$phone)) {
                    return false;
                }

                return true;
            }
        }
    }

    protected boolean canEqual(Object other) {
        return other instanceof User;
    }

    public int hashCode() {
        int PRIME = true;
        int result = 1;
        result = result * 59 + this.getCc();
        Object $id = this.getId();
        result = result * 59 + ($id == null ? 43 : $id.hashCode());
        Object $userName = this.getUserName();
        result = result * 59 + ($userName == null ? 43 : $userName.hashCode());
        Object $passWord = this.getPassWord();
        result = result * 59 + ($passWord == null ? 43 : $passWord.hashCode());
        Object $phone = this.phone;
        result = result * 59 + ($phone == null ? 43 : $phone.hashCode());
        return result;
    }

    public String toString() {
        return "User(id=" + this.getId() + ", userName=" + this.getUserName() + ", passWord=" + this.getPassWord() + ", phone=" + this.phone + ", cc=" + this.getCc() + ")";
    }

    public static class UserBuilder {	// 使用@Builder 后生成的内部类
        private Integer id;
        private String userName;
        private String passWord;
        private String phone;

        UserBuilder() {
        }

        public UserBuilder id(Integer id) {
            this.id = id;
            return this;
        }

        public UserBuilder userName(@NonNull String userName) {
            if (userName == null) {
                throw new NullPointerException("userName is marked non-null but is null");
            } else {
                this.userName = userName;
                return this;
            }
        }

        public UserBuilder passWord(@NonNull String passWord) {
            if (passWord == null) {
                throw new NullPointerException("passWord is marked non-null but is null");
            } else {
                this.passWord = passWord;
                return this;
            }
        }

        public UserBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public User build() {
            return new User(this.id, this.userName, this.passWord, this.phone);
        }

        public String toString() {
            return "User.UserBuilder(id=" + this.id + ", userName=" + this.userName + ", passWord=" + this.passWord + ", phone=" + this.phone + ")";
        }
    }
}
```

使用：

```java
public class Main {
    public static void main(String[] args) {
        User user = User.builder().id(11)
                .userName("张三").passWord("123456")
                .phone("10086").build();
        System.out.println(user);  // User(id=11, userName=张三, passWord=123456, phone=10086, cc=10)
    }
}
```



### 日志相关

Lombok还提供了一些与日志相关的注解，可以帮助简化日志的使用。以下是的Lombok日志注解：

```
@Log, @Log4j, @Log4j2, @Slf4j, @XSlf4j, @CommonsLog, @JBossLog, @Flogger, @CustomLog
```

#### @Log

-   `@Log`：自动生成一个名为`log`的`java.util.logging.Logger`对象，可以用于日志输出。使用该注解不需要额外引入日志框架依赖。
-   使用@Log注解，可以方便地在类中添加日志记录功能，而无需手动编写日志记录的代码。
-   @Log注解可以与以下几个注解配合使用，以生成不同类型的日志记录代码：

1.  @Slf4j：生成基于Slf4j日志框架的日志记录代码。
2.  @Log4j：生成基于Log4j日志框架的日志记录代码。
3.  @Log4j2：生成基于Log4j2日志框架的日志记录代码。
4.  @CommonsLog：生成基于Apache Commons Logging日志框架的日志记录代码。
5.  @XSlf4j：生成基于XSlf4j日志框架的日志记录代码。

-   @Log注解的类需要满足以下条件：
    -   类必须是一个具体的类，不能是接口或抽象类。

-   @Log注解使用细节：
    -   使用方式：在类上添加@Log注解即可。
    -   自动生成的代码：**@Log注解会为类生成一个静态的日志记录器字段**，以及相应的日志记录方法。生成的日志记录方法包括debug、info、warn和error等级的方法。

演示：

```java
import lombok.extern.java.Log;

@Log
public class LogTest {
    public void test(){
        log.info("info message");
    }
}
```

反编译后：

```java
import java.util.logging.Logger;

public class LogTest {
    // 自动生成的Logger实例
    private static final Logger log = Logger.getLogger(LogTest.class.getName());

    public LogTest() {
    }

    public void test() {
        log.info("info message");
    }
}
```

#### @Slf4j

-   `@Slf4j`：自动生成一个名为`log`的`org.slf4j.Logger`对象，可以用于日志输出。
-   **使用该注解需要在项目中引入相应的日志框架依赖**，如SLF4J和Logback。

演示：

**pom.xml**

```xml
<!-- SLF4J API -->
<!-- SLF4J是一个抽象层，它提供了统一的日志接口，可以与不同的日志实现框架（如Logback、Log4j等）进行交互 -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.32</version>
</dependency>

<!-- Logback Core -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-core</artifactId>
    <version>1.2.3</version>
</dependency>

<!-- Logback Classic -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>
```

```java
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Slf4jTest {
    public void test(){
        log.info("info message");
    }
}
```

反编译后：

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Slf4jTest {
    private static final Logger log = LoggerFactory.getLogger(Slf4jTest.class);

    public Slf4jTest() {
    }

    public void test() {
        log.info("info message");
    }
}
```

#### @CommonsLog

-   `@CommonsLog`：自动生成一个名为`log`的`org.apache.commons.logging.Log`（JCL）对象，可以用于日志输出。
-   使用该注解需要在项目中引入`commons-logging`依赖。

演示：

pom.xml

```xml
<dependency>
    <groupId>commons-logging</groupId>
    <artifactId>commons-logging</artifactId>
    <version>1.2</version>
</dependency>
```

```java
import lombok.extern.apachecommons.CommonsLog;

@CommonsLog
public class JCLTest {
    public void test(){
        log.info("info message");
    }
}
```

反编译后：

```java
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class JCLTest {
    private static final Log log = LogFactory.getLog(JCLTest.class);

    public JCLTest() {
    }

    public void test() {
        log.info("info message");
    }
}
```



### val / var

演示：

```java
import lombok.val;
import lombok.var;

public void tricky(){
    // 能用，但是最好别用
    val list = new HashMap<String,String>();
    var id = 10;
}
```

反编译后：

```java
public void tricky() {
    new HashMap();
    int id = true;
}
```

### @Cleanup

-   @Cleanup注解**用于自动关闭资源**。它可以应用于局部变量或实例变量上，用于自动关闭需要手动关闭的资源，如流、数据库连接等。
-   **使用@Cleanup注解时**，Lombok会在变量作用域结束时自动调用资源的关闭方法，**无需手动编写finally块来关闭资源。**

注意：

-   @Cleanup注解只能应用于实现了Closeable或AutoCloseable接口的资源。
-   但是实现了这些接口的资源，我们更愿意使用`try-with-resources`关闭资源（Java 7引入的一个语法结构，用于自动关闭实现了AutoCloseable接口的资源）

演示：

```java
// @Cleanup注解自动关闭了FileInputStream和FileOutputStream资源
// 在copyFile方法执行完毕后，Lombok会自动调用close方法关闭这两个资源，无需手动编写finally块来关闭资源。
// todo 注意：@Cleanup注解只能应用于实现了Closeable或AutoCloseable接口的资源。
public void copyFile(String sourceFile, String targetFile) {
    try {
        @Cleanup FileInputStream fis = new FileInputStream(sourceFile);
        @Cleanup FileOutputStream fos = new FileOutputStream(targetFile);

        byte[] buffer = new byte[1024];
        int bytesRead;
        while ((bytesRead = fis.read(buffer)) != -1) {
            fos.write(buffer, 0, bytesRead);
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

反编译后：

```java
public void copyFile(String sourceFile, String targetFile) {
    try {
        FileInputStream fis = new FileInputStream(sourceFile);

        try {
            FileOutputStream fos = new FileOutputStream(targetFile);

            try {
                byte[] buffer = new byte[1024];

                int bytesRead;
                while((bytesRead = fis.read(buffer)) != -1) {
                    fos.write(buffer, 0, bytesRead);
                }
            } finally {
                if (Collections.singletonList(fos).get(0) != null) {
                    fos.close();
                }
	
            }
        } finally {
            if (Collections.singletonList(fis).get(0) != null) {
                fis.close();
            }

        }
    } catch (IOException var17) {
        var17.printStackTrace();
    }
}
```



## Lombok原理

**JSR 269：插件化处理API**

​	JSR 269是Java规范请求（Java Specification Request）的编号，它定义了Java编译时注解处理的标准。JSR 269规范提供了一种机制，允许开发者在编译时期处理Java源代码中的注解，并生成额外的代码。

JSR 269规范的核心是注解处理器（Annotation Processor）。

JSR 269规范定义了一些接口和注解，用于编写注解处理器。其中最重要的接口是`javax.annotation.processing.Processor`，它是所有注解处理器的基础接口。开发者可以实现该接口，并通过`@SupportedAnnotationTypes`和`@SupportedSourceVersion`注解指定要处理的注解类型和源代码版本。

通过JSR 269规范，开发者可以利用注解处理器在编译时期对Java源代码进行自动化处理，例如生成代码、验证注解的正确性、生成文档等。这种机制在许多框架和工具中得到了广泛应用，例如Lombok、Hibernate Validator等。

**JDK 6提供的特性，在 javac 编译期利用注解来搞事情**

![1690116579659](images\Lombok原理.png)



Lombok的原理是通过在编译时期通过注解处理器（Annotation Processor）来修改Java源代码，从而生成相应的代码。具体的原理如下：

-   **注解处理器**：Lombok通过自定义的注解处理器来处理带有Lombok注解的Java源代码。注解处理器会在编译时期扫描源代码中的注解，并根据注解的定义生成相应的代码。
-   **编译过程**：在编译Java源代码时，注解处理器会被自动触发执行。注解处理器会扫描源代码中的注解，并根据注解的定义生成新的Java源代码。
-   **代码生成**：注解处理器根据注解的定义生成新的Java源代码，并将其添加到编译过程中。生成的代码可以包括getter和setter方法、构造方法、toString方法等。
-   **代码替换**：生成的Java源代码会替换原始的源代码，从而实现了自动生成代码的效果。在编译后的类文件中，可以看到生成的代码。

通过这种方式，Lombok能够在编译时期自动为Java类生成一些常用的代码，从而减少了开发人员的工作量。同时，由于生成的代码是在编译时期完成的，因此对于运行时的性能没有影响。