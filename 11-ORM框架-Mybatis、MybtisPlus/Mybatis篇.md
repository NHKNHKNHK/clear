## 什么是Mybatis

​	MyBatis 是一个优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis消除了几乎所有的 JDBC 代码和手动设置参数以及获取结果集的工作。MyBatis可以使用简单的XML或注解来配置和映射原生类型、接口和Java POJO（Plain Old Java Objects）到数据库中的记录。



## MyBatis 特性

1.  **SQL映射**：MyBatis 允许你直接编写 SQL 语句，并将这些 SQL 语句与 Java 方法进行映射。你可以在 XML 文件中定义 SQL 语句，也可以使用注解直接在 Java 类中定义。
2.  **动态 SQL**：MyBatis 提供了一种强大的动态 SQL 生成功能，可以根据条件动态生成 SQL 语句，避免了拼接 SQL 字符串的麻烦。
3.  **高级映射**：MyBatis 支持复杂的结果集映射，可以将查询结果映射到复杂的 Java 对象结构中。
4.  **缓存支持**：MyBatis 内置了一级缓存和二级缓存，能够显著提高查询性能。
5.  **插件机制**：MyBatis 提供了灵活的插件机制，可以在执行 SQL 语句之前或之后进行拦截和处理。



## Myabtis优缺点？



## 



## #{}和${}的区别？

在 MyBatis 中，#{} 和 ${} 是用于参数绑定的两种不同的方式，但它们之间存在显著的差异，特别是在安全性和处理机制上。

### #{}（预编译方式）

-   安全性：#{} 采用了预编译（PreparedStatement）的方式，有效防止了 SQL 注入。因为 MyBatis 会将 #{} 中的内容当作参数处理，而不是直接拼接到 SQL 语句中。
-   处理方式：MyBatis 会为 #{} 中的内容生成一个参数占位符 ?，并使用 PreparedStatement 的 setXXX() 方法来设置参数值。因此，你不需要担心数据类型或引号问题。
-   例子：SELECT * FROM users WHERE id = #{userId}，这条 SQL 语句在 MyBatis 中处理时，会将其转换为类似 SELECT * FROM users WHERE id = ? 的形式，并通过 PreparedStatement 的 setInt() 或其他相关方法来设置 userId 的值。

### ${}（字符串拼接方式）

-   安全性：${} 是直接字符串拼接的方式，所以存在 SQL 注入的风险。如果参数来自用户输入或其他不可信的来源，那么使用 ${} 是非常危险的。
-   处理方式：MyBatis 会直接将 ${} 中的内容替换到 SQL 语句中。这意味着你需要自己处理数据类型、引号等问题。
-   用途：虽然 ${} 存在安全风险，但在某些场景下它是必要的。例如，当你要动态地构建表名或列名时，就必须使用 ${}。
-   例子：SELECT * FROM ${tableName}，这里的 tableName 是一个变量，MyBatis 会直接将其替换到 SQL 语句中。因此，如果你不能保证 tableName 的来源是可信的，那么这条 SQL 语句就存在 SQL 注入的风险。

在大多数情况下，你应该优先使用 #{}，因为它更安全、更方便。

当需要动态构建表名、列名或其他 SQL 语句的片段时，可以使用 ${}，但请确保相关参数来源是可信的，并尽量避免使用用户输入或其他不可信的数据作为参数。



## **如何避免 sql 注入？**



## 说说Mybatis的缓存机制？



## Mybatis的一级缓存



## Mybatis的二级缓存



## Springboot中mybatis缓存如何配置方案？



## mybatis 使用的时候 mapper 为什么也是接口形式的？



## 使用 MyBatis 的 mapper 接口调用时有哪些要求？





## Mybaits执行原理？



## MyBatis的Xml映射文件中，都有哪些常见标签？



## Mybaits写个xml映射文件，在写给DAO接口就能执行，这是什么原理？



## Mybatis的Xml映射文件中，不同的Xml映射文件，id是否可以重复？





## 模糊查询like语句该怎么写?

-   方案一：使用 XML 映射文件进行模糊查询

假设我们有一个UserMapper接口和对应的 XML 映射文件。我们希望通过用户名进行模糊查询

Mapper接口

```java
public interface UserMapper {
    List<User> selectUsersByUsername(String username);
}
```

XML 映射文件

```xml
<mapper namespace="com.example.mapper.UserMapper">

  <!-- 定义 resultMap -->
  <resultMap id="userResultMap" type="com.example.model.User">
    <id property="id" column="user_id"/>
    <result property="username" column="user_name"/>
    <result property="password" column="user_password"/>
  </resultMap>

  <!-- 模糊查询 -->
  <select id="selectUsersByUsername" parameterType="String" resultMap="userResultMap">
    SELECT * FROM users WHERE user_name LIKE CONCAT('%', #{username}, '%')
  </select>

</mapper>
```

-   方案二：使用注解进行模糊查询

Mapper 接口

```java
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface UserMapper {

    @Results(id = "userResultMap", value = {
        @Result(property = "id", column = "user_id", id = true),
        @Result(property = "username", column = "user_name"),
        @Result(property = "password", column = "user_password")
    })
    @Select("SELECT * FROM users WHERE user_name LIKE CONCAT('%', #{username}, '%')")
    List<User> selectUsersByUsername(String username);
}
```

说明：

-   **LIKE语句**：用于模糊查询，CONCAT('%', #{username}, '%') 用于在输入的用户名前后添加百分号（%），以实现模糊匹配。
-   **#{username}**：表示参数占位符，MyBatis 会自动将传入的参数值替换到这个位置。



## Mybaits动态SQL有什么用？执行原理？有哪些动态SQL？



## 简述Mybaits的插件运行原理，以及如何编写一个插件？



## JDBC有哪些不足？Mybaits是如何解决的？



## mybatis与jdbc编程相比有什么优势





## Mybaits是否支持延迟加载？它的实现原理？



## 当实体类中的属性名和表中的字段名不一样 ，怎么办？





## Mybaits如何实现数据库类型和Java类型的转换？



## Mybatis是如何将sql执行结果封装为目标对象？都有哪些映射形式？



## Mybaits自带的连接池有了解过吗？



## Mybatis自带连接池都有什么？





## Mybatis中常见的设计模式有哪些？

1、工厂模式（Factory Pattern）

**应用场景**：创建复杂对象时使用。

-   **SqlSessionFactory**：MyBatis 使用SqlSessionFactory来创建SqlSession实例。SqlSessionFactory本身是由SqlSessionFactoryBuilder创建的。

-   **示例**：

    ```java
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    ```

2、单例模式（Singleton Pattern）

**应用场景**：确保某个类只有一个实例，并提供一个全局访问点。

-   **Configuration**：MyBatis 的Configuration类使用了单例模式，确保在一个SqlSessionFactory中只有一个Configuration实例。

-   **示例**：

    ```java
    Configuration configuration = sqlSessionFactory.getConfiguration();
    ```

    

## Mybatis分页的原理和分页插件的原理？



## mybatis和数据库交互的原理？



## mybatis的paramtertype为什么可以写简称？



## Mybatis是否可以映射Enum枚举类？



## Mybatis都有哪些Executor执行器？它们之间的区别是什么？





# MybatisPlus

## 什么是MybtisPlus，它与Myabtis的区别？



## 请说一下你是如何使用MybaitsPlus的QueryWrapper实现了对MySQl的灵活查询？



## MybtisPlus的saveBatch？

`saveBatch` 方法是 MyBatis Plus 中用于批量插入记录的一个方法。

```java
List<User> userList = new ArrayList<>();
// 添加多个 User 对象到列表中
userList.add(new User("张三", 25));
userList.add(new User("李四", 30));
userList.add(new User("王五", 28));

// 调用 saveBatch 方法批量保存用户数据
boolean result = userService.saveBatch(userList);
if (result) {
    System.out.println("批量插入成功");
} else {
    System.out.println("批量插入失败");
}
```

说明：

-   `saveBatch` 方法接受两个参数
    -   第一个参数是 `List<T>` 类型，其中 `T` 是你要批量插入的实体类。
    -   第二个参数是 `int batchSize`，表示每次批量插入的最大数量，**默认值为 1000**。
-   如果插入的列表元素数量大于`batchSize`，那么会自动拆分成多个批次进行插入

