## 什么是Mybatis

​	MyBatis 是一个优秀的**持久层框架**，它支持自定义 SQL、存储过程以及高级映射。MyBatis消除了几乎所有的 JDBC 代码和手动设置参数以及获取结果集的工作。MyBatis可以使用简单的XML或注解来配置和映射原生类型、接口和Java POJO（Plain Old Java Objects）到数据库中的记录。



## MyBatis 特性

1.  **SQL映射**：MyBatis 允许你直接编写 SQL 语句，并将这些 SQL 语句与 Java 方法进行映射。你可以在 XML 文件中定义 SQL 语句，也可以使用注解直接在 Java 类中定义。
2.  **动态 SQL**：MyBatis 提供了一种强大的动态 SQL 生成功能，可以根据条件动态生成 SQL 语句，避免了拼接 SQL 字符串的麻烦。
3.  **高级映射**：MyBatis 支持复杂的结果集映射，可以将查询结果映射到复杂的 Java 对象结构中。
4.  **缓存支持**：MyBatis 内置了一级缓存和二级缓存，能够显著提高查询性能。
5.  **插件机制**：MyBatis 提供了灵活的插件机制，可以在执行 SQL 语句之前或之后进行拦截和处理。



## Myabtis优缺点？
优点：
- 基于sql语句编程，相对灵活，不会对应用程序或数据库的现有设计造成任何影响，sql写在xml中，解除与程序代码的耦合，统一方便管理；提供xml标签，支持编写动态sql语句，并可以重用
- 简单易用，MyBatis 提供了简洁的 API，使得开发人员可以快速上手，与JDBC相比，减少了50%以上的代码量，消除了JDBC大量冗余的代码，不需要手动开关连接
- 很好的与各种数据库兼容（因为Mybatis底层使用的是JDBC，所有只要JDBC支持的数据库，MyBatis 都可以支持）
- 能与Spring框架无缝集成
- 提供映射标签，支持对象与数据库的ORM字段关系映射；提供对象关系映射标签，支持对象关系组件维护

缺点：
- sql语句的编写工作量较大，尤其是字段多、关联表多时，对开发人员编写sql语句的功底有一定的要求
- sql语句依赖于数据库，导致数据库移植性较差，不能随意更换数据库
## 



## #{}和${}的区别？

在 MyBatis 中，#{} 和 ${} 是用于参数绑定的两种不同的方式，但它们之间存在显著的差异，特别是在安全性和处理机制上。

**#{}（预编译方式）**

-   安全性：#{} 采用了预编译（PreparedStatement）的方式，有效防止了 SQL 注入。因为 MyBatis 会将 #{} 中的内容当作参数处理，而不是直接拼接到 SQL 语句中。
-   处理方式：MyBatis 会为 #{} 中的内容生成一个参数占位符 ?，并使用 PreparedStatement 的 setXXX() 方法来设置参数值。因此，你不需要担心数据类型或引号问题。
-   例子：SELECT * FROM users WHERE id = #{userId}，这条 SQL 语句在 MyBatis 中处理时，会将其转换为类似 SELECT * FROM users WHERE id = ? 的形式，并通过 PreparedStatement 的 setInt() 或其他相关方法来设置 userId 的值。

**${}（字符串拼接方式）**

-   安全性：${} 是直接字符串拼接（Statement）的方式，所以存在 SQL 注入的风险。如果参数来自用户输入或其他不可信的来源，那么使用 ${} 是非常危险的。
-   处理方式：MyBatis 会直接将 ${} 中的内容替换到 SQL 语句中。这意味着你需要自己处理数据类型、引号等问题。
-   用途：虽然 ${} 存在安全风险，但在某些场景下它是必要的。例如，当你要动态地构建表名或列名时，就必须使用 ${}。
-   例子：SELECT * FROM ${tableName}，这里的 tableName 是一个变量，MyBatis 会直接将其替换到 SQL 语句中。因此，如果你不能保证 tableName 的来源是可信的，那么这条 SQL 语句就存在 SQL 注入的风险。

在大多数情况下，你应该优先使用 #{}，因为它更安全、更方便，有效的防止 SQL 注入。

当需要动态构建表名、列名或其他 SQL 语句的片段时，可以使用 ${}，但请确保相关参数来源是可信的，并尽量避免使用用户输入或其他不可信的数据作为参数。



## **如何避免 sql 注入？**



## 说说Mybatis的缓存机制？



## Mybatis的一级缓存



## Mybatis的二级缓存



## Springboot中mybatis缓存如何配置方案？



## mybatis 使用的时候 mapper 为什么也是接口形式的？



## 使用 MyBatis 的 mapper 接口调用时有哪些要求？

在使用 mybatis 的 mapper 的时候，我们要注意，接口必须是 public 的，其次就是接口中的方法名，必须与 xml 文件中的 id 相同，才能正常映射成功，在 xml 文件中，要保证 namespace 与接口的全类名，保持一致。还有就是要保证接口里面的入参与 xml 里面的 paramtype 和 resulttype 保持一致

本题关键要点：**接口必须public、方法名对应、namespace对应、参数对应**

1、**Mapper接口要求**

**接口必须是公共的**：Mapper 接口必须用public关键字修饰

**方法签名**：接口中的方法签名必须与XML映射文件中的 SQL 语句 ID属性一致

```java
package com.example.mapper;

import com.example.model.User;
import org.apache.ibatis.annotations.Select;

public interface UserMapper {
    User selectUser(int id);
}
```

2、**映射文件要求**

**命名空间**：映射文件的namespace命名空间必须与 Mapper 接口的全限定名一致。

```xml
<mapper namespace="com.example.mapper.UserMapper">
  <select id="selectUser" parameterType="int" resultType="com.example.model.User">
    SELECT * FROM users WHERE id = #{id}
  </select>
</mapper>
```

**SQL 语句 ID**：映射文件中的 SQL 语句 ID 必须与 Mapper 接口中的方法名一致

3、**配置文件要求**

**注册 Mapper**：在 MyBatis 配置文件中，必须注册 Mapper 接口或映射文件

```xml
<mappers>
  <mapper resource="com/example/mapper/UserMapper.xml"/>
</mappers>
```

或者可以使用包扫描的方式：

```xml
<mappers>
  <package name="com.example.mapper"/>
</mappers>
```

4、**参数和返回类型**

**参数类型**：Mapper 接口方法的参数类型必须与映射文件中的parameterType一致。如果使用注解方式，参数名要与 SQL 中的占位符一致

-   单个参数：如果方法只有一个参数，可以直接传递。
-   多个参数：如果方法有多个参数，可以使用@Param注解来指定参数名称，或者将参数封装到对象中。

**返回类型**：Mapper 接口方法的返回类型必须与映射文件中的resultType一致。

-   单个结果：方法返回单个对象或基本类型
-   多个结果：方法返回集合（List或Map）



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

### MyBatis分页原理

- 1、**查询总记录数**：
    - 在进行分页查询之前，首先需要查询总记录数。MyBatis提供了一个select **count(*)**的方法来获取总记录数。

    -   这个方法会生成一个查询语句，但是不会返回结果集，而是返回一个整数值，即总记录数。

-   2、**设置分页参数**：
    -   在进行分页查询之前，需要设置分页参数，包括每页显示的记录数和当前页数。
    -   MyBatis提供了一个RowBounds类来实现分页功能。通过设置RowBounds的offset和limit属性，可以实现指定查询的起始位置和查询的记录数。

-   3、执行分页查询：
    -   在设置好分页参数后，就可以执行分页查询了。MyBatis会根据设置的分页参数，生成相应的查询语句，并在数据库中执行该查询语句。
    -   查询结果将会被封装成一个List集合返回给调用者。

-   4、数据库方言：
    -   不同的数据库在分页查询语法上有所不同。MyBatis并不直接支持所有数据库的分页语法，而是通过数据库方言（Dialect）来处理。
    -   数据库方言是一个抽象层，它根据数据库类型生成相应的分页查询语句。

### 分页插件原理

-   1、拦截器（Interceptor）：
    -   分页插件实际上是MyBatis的一个拦截器，它可以在查询被执行之前或之后进行干预。

-   2、处理分页逻辑：
    -   在查询执行之前，分页插件会检测是否有分页参数传入。
    -   如果有分页参数，插件会根据数据库方言生成适当的分页查询语句。

-   3、修改查询参数：
    -   插件会修改查询的SQL语句，添加分页的限制条件。同时，它还会修改参数对象，将分页参数替换为实际的分页偏移量（offset）和每页条数（limit）。

-   4、执行查询与封装结果：
    -   修改后的查询语句被执行，得到查询结果。
    -   插件会根据查询结果和分页参数，将查询结果进行切割，得到分页后的结果，并可能封装成特定的对象（如Page对象）返回给调用者。

MyBatis分页原理主要依赖于数据库的特性和MyBatis提供的API，包括查询总记录数、设置分页参数、执行分页查询以及利用数据库方言处理不同数据库的分页语法。

分页插件则是MyBatis的一个扩展机制，通过拦截器在查询过程中自动应用分页逻辑，从而增强分页功能。分页插件能够检测分页参数、修改查询语句和参数对象，并最终执行分页查询并封装结果。



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

