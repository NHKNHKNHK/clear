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

-   安全性：#{} 采用了**预编译**（PreparedStatement）的方式，有效防止了 SQL 注入。因为 MyBatis 会将 #{} 中的内容当作参数处理，而不是直接拼接到 SQL 语句中。
-   处理方式：MyBatis 会为 #{} 中的内容生成一个参数占位符 ?，并使用 PreparedStatement 的 setXXX() 方法来设置参数值。因此，你不需要担心数据类型或引号问题。
-   例子：SELECT * FROM users WHERE id = #{userId}，这条 SQL 语句在 MyBatis 中处理时，会将其转换为类似 SELECT * FROM users WHERE id = ? 的形式，并通过 PreparedStatement 的 setInt() 或其他相关方法来设置 userId 的值。

**${}（字符串拼接方式）**

-   安全性：\${} 是**直接字符串拼接**（Statement）的方式，所以存在 SQL 注入的风险。如果参数来自用户输入或其他不可信的来源，那么使用 ${} 是非常危险的。
-   处理方式：MyBatis 会直接将 ${} 中的内容替换到 SQL 语句中。这意味着你需要自己处理数据类型、引号等问题。
-   用途：虽然 \${} 存在安全风险，但在某些场景下它是必要的。例如，当你要动态地构建表名或列名时，就必须使用 ${}。
-   例子：SELECT * FROM ${tableName}，这里的 tableName 是一个变量，MyBatis 会直接将其替换到 SQL 语句中。因此，如果你不能保证 tableName 的来源是可信的，那么这条 SQL 语句就存在 SQL 注入的风险。

在大多数情况下，你应该优先使用 #{}，因为它更安全、更方便，有效的防止 SQL 注入。

当需要动态构建表名、列名或其他 SQL 语句的片段时，可以使用 ${}，但请确保相关参数来源是可信的，并尽量避免使用用户输入或其他不可信的数据作为参数。



## **如何避免 sql 注入？**

sql 注入是一个非常难搞的问题。如果不加以防范就会对我们的系统造成危险。mybatis 避免 sql 注入的方式，有几层。首先就是 myabtis 采取了**预编译的 sql 语句**，预编译的 sql 语句是参数化查询，不是直接拼接，这种就会导致攻击者的输入并不会当作 sql 执行，这是一种防御机制。另一种就是我们在开发的过程中，要保证在拼接的时候，使用**#占位符**。#不会直接拼接，可以安全的传递，然而如果使用\$就会导致直接拼接，这样会造成 sql 注入问题，不过有些需求确实是动态的 sql 处理，要动态传入表名，动态传入字段等等。这种情况也就只能使用$进行了

本题关键点：预编译、#占位符

**使用预编译的SQL语句**

MyBatis 通过预编译的 SQL 语句来执行查询和更新操作。预编译的 SQL 语句使用参数化查询，不是直接拼接到 SQL 语句中。这样可以让攻击者的输入不会被当作 SQL 代码执行

**使用#{}占位符**

MyBatis 提供了#{}占位符，用于安全地传递参数。与之相对的是\${}，后者会直接将参数值嵌入到 SQL 语句中，容易导致 SQL 注入，因此应尽量避免使用${}。#{id}是一个占位符，MyBatis 会将其替换为一个安全的参数，而不是直接拼接到 SQL 字符串中

安全的使用方式：

```xml
<select id="selectUserByName" parameterType="string" resultType="com.example.model.User">
  SELECT * FROM users WHERE username = #{username}
</select>
```

不安全的使用方式：

```xml
<select id="selectUserByName" parameterType="string" resultType="com.example.model.User">
  SELECT * FROM users WHERE username = '${username}'
</select>
```

**使用SQL构建工具**

MyBatis 提供了 SQL 构建工具（如SqlBuilder），可以帮助构建安全的 SQL 查询，现实很少用，本质也是#占位符

```java
import org.apache.ibatis.jdbc.SQL;

public String buildSelectUserById(final int id) {
    return new SQL() {{
        SELECT("*");
        FROM("users");
        WHERE("user_id = #{id}");
    }}.toString();
}
```





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



## MyBatis的Xml映射文件中，都有哪些常见标签？

常见的有 mapper，select，resultmap，if，sql 等等标签，像 mapper 标签是 xml 中的根部，有了它才能够和接口进行映射。select，insert 这些定义了这个 sql 行为到底是查询还是插入。当我们把查询出的数据要映射到实体的时候，可以封装一个 map，这样我们不用每个字段都写 as，只需要用 resultmap，就可以自动帮我们进行属性映射。当想要判断一些条件来决定是否拼接 sql 的时候，可以使用 if。最后就是公共的 sql，比如 select 后面的一堆属性，可以放在 sql 标签内。以上。

主要还是考察你在用 mybatis 的时候一个复杂程度，是否很多标签都用过，可以考察出你的熟练度。

**\<mapper>**

-   定义一个映射文件的根元素，包含所有的映射配置。

-   **常用属性**：
    -   namespace，指定与之关联的 Mapper 接口的全限定名

```xml
<mapper namespace="com.example.mapper.UserMapper">
  <!-- SQL 语句和其他配置 -->
</mapper>
```

**\<select>**

-   定义一个查询语句。

-   **常用属性**：
    -   id：唯一标识该 SQL 语句的 ID。
    -   parameterType：指定输入参数的类型（可选）。
    -   resultType：指定返回结果的类型（常用）。
    -   resultMap：指定自定义的结果映射（可选）

```xml
<select id="selectUser" parameterType="int" resultType="com.example.model.User">
  SELECT * FROM users WHERE id = #{id}
</select>
```

**\<insert>**

-   定义一个插入语句。

-   **常用属性**：
    -   id：唯一标识该 SQL 语句的 ID。
    -   parameterType：指定输入参数的类型（常用）。
    -   useGeneratedKeys和keyProperty：用于获取自动生成的主键值

```xml
<insert id="insertUser" parameterType="com.example.model.User" useGeneratedKeys="true" keyProperty="id">
  INSERT INTO users (username, password) VALUES (#{username}, #{password})
</insert>
```

**\<update> \<delete>**

-   定义一个更新/删除语句。

-   **常用属性**：
    -   id：唯一标识该 SQL 语句的 ID。
    -   parameterType：指定输入参数的类型（常用）

```xml
<update id="updateUser" parameterType="com.example.model.User">
  UPDATE users SET username = #{username}, password = #{password} WHERE id = #{id}
</update>
```

```xml
<delete id="deleteUser" parameterType="int">
  DELETE FROM users WHERE id = #{id}
</delete>
```

**\<resultMap>**

-   定义复杂的结果集映射，适用于复杂的对象结构。

-   **常用子标签**：
    -   \<id>：标识主键字段。
    -   \<result>：标识普通字段。
    -   \<association>：标识对象关联。
    -   \<collection>：标识集合关联。

```xml
<resultMap id="userResultMap" type="com.example.model.User">
  <id property="id" column="id"/>
  <result property="username" column="username"/>
  <result property="password" column="password"/>
</resultMap>
```

**\<if>**

-   根据条件动态包含 SQL 片段。

-   属性：test，指定条件表达式。

```xml
<select id="findUsers" resultType="com.example.model.User">
  SELECT * FROM users
  WHERE 1=1
  <if test="username != null">
    AND username = #{username}
  </if>
  <if test="password != null">
    AND password = #{password}
  </if>
</select>
```

**\<choose>,\<when>,\<otherwise>**

-   类似于 switch-case 语句，根据条件选择执行不同的 SQL 片段。

-   **属性**：test，指定条件表达式（用于\<when>标签）

```xml
<select id="findUsers" resultType="com.example.model.User">
  SELECT * FROM users
  WHERE 1=1
  <choose>
    <when test="username != null">
      AND username = #{username}
    </when>
    <when test="password != null">
      AND password = #{password}
    </when>
    <otherwise>
      AND status = 'active'
    </otherwise>
  </choose>
</select>
```

**\<trim>,\<where>,\<set>**

-   用于生成动态 SQL 片段，自动处理 SQL 语句中的多余字符（如逗号、AND、OR 等）。

-   **属性**：
    -   \<trim>：prefix、suffix、prefixOverrides、suffixOverrides。
    -   \<where>：自动添加 WHERE 关键字。
    -   \<set>：自动添加 SET 关键字并处理逗号

```xml
<!-- 使用 <where> -->
<select id="findUsers" resultType="com.example.model.User">
  SELECT * FROM users
  <where>
    <if test="username != null">
      username = #{username}
    </if>
    <if test="password != null">
      AND password = #{password}
    </if>
  </where>
</select>

<!-- 使用 <set> -->
<update id="updateUser" parameterType="com.example.model.User">
  UPDATE users
  <set>
    <if test="username != null">
      username = #{username},
    </if>
    <if test="password != null">
      password = #{password}
    </if>
  </set>
  WHERE id = #{id}
</update>
```

**\<foreach>**

-   用于遍历集合生成动态 SQL 语句，常用于 IN 子句等。

-   **属性**：item、index、collection、open、close、separator

```xml
<select id="findUsersByIds" resultType="com.example.model.User">
  SELECT * FROM users WHERE id IN
  <foreach item="id" collection="list" open="(" separator="," close=")">
    #{id}
  </foreach>
</select>
```

 **\<sql>**

-   定义可重用的 SQL 片段。

-   **属性**：id，唯一标识该 SQL 片段

```xml
<sql id="userColumns">
  id, username, password
</sql>

<select id="selectUser" resultType="com.example.model.User">
  SELECT <include refid="userColumns"/> FROM users WHERE id = #{id}
</select>
```

**\<include>**

-   引入\<sql>标签定义的 SQL 片段。

-   **属性**：refid，引用\<sql>标签的 ID

```xml
<select id="selectUser" resultType="com.example.model.User">
  SELECT <include refid="userColumns"/> FROM users WHERE id = #{id}
</select>
```



## 当实体类中的属性名和表中的字段名不一样 ，怎么办？

实际使用中，经常会出现比如实体类里面叫 userName，但是数据库字段是 user_name 这种情况。我们要使用 resultmap 来进行使用。**resultmap** 里面可以定义出一套**数据库字段和属性的对应关系**，然后 mybtais 会帮助我们自动的进行映射。这是常见的方式。另一种就是可以手动把**字段不断的 as 重新命名映射**。假设是接口的形式，可以使用 **@Results 配合 @Result** 来进行配合实现一波映射

本题关键点：resultmap 映射，as 处理，接口@result 注解

**使用\<resultMap>标签进行映射**

假设有一个数据库表users，字段如下：

```sql
CREATE TABLE users (
  user_id INT PRIMARY KEY,
  user_name VARCHAR(50),
  user_password VARCHAR(50)
);
```

对应的实体类User如下：

```java
public class User {
    private int id;
    private String username;
    private String password;

    // Getters and setters
}
```

由于数据库表的字段名和实体类的属性名不一致，我们可以在 MyBatis 的 XML 映射文件中定义一个\<resultMap>来进行映射。

xml映射文件：

```xml
<mapper namespace="com.example.mapper.UserMapper">

  <!-- 定义 resultMap -->
  <resultMap id="userResultMap" type="com.example.model.User">
    <id property="id" column="user_id"/>
    <result property="username" column="user_name"/>
    <result property="password" column="user_password"/>
  </resultMap>

  <!-- 使用 resultMap 的查询语句 -->
  <select id="selectUser" parameterType="int" resultMap="userResultMap">
    SELECT * FROM users WHERE user_id = #{id}
  </select>

</mapper>
```

**使用注解进行映射**

```java
import org.apache.ibatis.annotations.*;

public interface UserMapper {

    @Results(id = "userResultMap", value = {
        @Result(property = "id", column = "user_id", id = true),
        @Result(property = "username", column = "user_name"),
        @Result(property = "password", column = "user_password")
    })
    @Select("SELECT * FROM users WHERE user_id = #{id}")
    User selectUser(int id);
}
```



## Mybaits写个xml映射文件，在写给DAO接口就能执行，这是什么原理？



## Mybatis的Xml映射文件中，不同的Xml映射文件，id是否可以重复？

## Mybaits执行原理？



## 模糊查询like语句该怎么写?

like 在 xml 中，可以直接在 xml 内部使用 concat 去拼接%来实现，也可以在外面拼接好之后，传递进来。其实本质的目的就是在要模糊查询的字段上，增加上%

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



## Mybatis是如何将sql执行结果封装为目标对象？都有哪些映射形式？

mybatis 映射结果从形式上主要分为**自动映射**和**手动映射**。从类型上面又可以变为**嵌套映射，集合映射**。手动映射主要是借助 **resultmap**，采取property 属性和 cloumn 一一对应的关系，然后查询的时候，可以映射到实体。自动映射是要保持查询的时候，列名和类的属性名一致，才可以自动完成。针对一些类里面又嵌套类的情况的，mybatis 提供了**association** 来进行映射，association 使用方式和 resultmap 一样，不过他是放到 resultmap 中的。如果是集合的映射则适用**collection** 来进行。

 **自动映射**

MyBatis 可以根据结果集的列名自动映射到目标对象的属性上。自动映射通常依赖于**数据库列名和 Java 对象属性名之间的一致性**。MyBatis 会自动将结果集中的id列映射到User对象的id属性，username列映射到username属性，email列映射到email属性。

假设有一个User类：

```java
public class User {
    private int id;
    private String username;
    private String email;

    // Getters and Setters
}
```

对应的SQL查询：

```xml
<select id="selectUserById" parameterType="int" resultType="com.example.model.User">
    SELECT id, username, email FROM users WHERE id = #{id}
</select>
```

**手动映射**

手动映射允许明确**指定数据库列和 Java 对象属性之间的映射关系**，可以通过\<resultMap>元素来实现。

UserResultMap明确指定了数据库列和User对象属性之间的映射关系。

```xml
<resultMap id="UserResultMap" type="com.example.model.User">
    <id property="id" column="id"/>
    <result property="username" column="username"/>
    <result property="email" column="email"/>
</resultMap>
```

```xml
<select id="selectUserById" parameterType="int" resultMap="UserResultMap">
    SELECT id, username, email FROM users WHERE id = #{id}
</select>
```

**嵌套映射**

嵌套映射用于**处理复杂对象的映射**，例如一个对象包含另一个对象。

假设有一个Order类，其中包含一个User对象：

```java
public class Order {
    private int id;
    private User user;
    private String orderNumber;

    // Getters and Setters
}
```

定义一个嵌套的resultMap：

```xml
<resultMap id="OrderResultMap" type="com.example.model.Order">
    <id property="id" column="id"/>
    <result property="orderNumber" column="order_number"/>
    <association property="user" javaType="com.example.model.User">
        <id property="id" column="user_id"/>
        <result property="username" column="username"/>
        <result property="email" column="email"/>
    </association>
</resultMap>
```

使用嵌套的resultMap：

```xml
<select id="selectOrderById" parameterType="int" resultMap="OrderResultMap">
    SELECT o.id, o.order_number, u.id AS user_id, u.username, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = #{id}
</select>
```

OrderResultMap包含了一个嵌套的association元素，用于将User对象的属性映射到Order对象的user属性

**嵌套查询**

嵌套查询用于处理复杂对象的映射，类似于嵌套映射，但它通过执行额外的查询来获取嵌套对象的数据。

定义一个嵌套查询的resultMap：

```xml
<resultMap id="OrderResultMap" type="com.example.model.Order">
    <id property="id" column="id"/>
    <result property="orderNumber" column="order_number"/>
    <association property="user" javaType="com.example.model.User" select="selectUserById" column="user_id"/>
</resultMap>
```

定义嵌套查询：

```xml
<select id="selectUserById" parameterType="int" resultType="com.example.model.User">
    SELECT id, username, email FROM users WHERE id = #{id}
</select>
```

使用嵌套查询的resultMap：

```xml
<select id="selectOrderById" parameterType="int" resultMap="OrderResultMap">
    SELECT id, order_number, user_id FROM orders WHERE id = #{id}
</select>
```

OrderResultMap中的association元素使用select属性指定了一个额外的查询selectUserById，用于获取User对象的数据

**集合映射**

集合映射用于处理一对多的关系，例如一个对象包含一个集合。

假设有一个Department类，其中包含一个List\<User>：

```java
public class Department {
    private int id;
    private String name;
    private List<User> users;

    // Getters and Setters
}
```

定义一个集合的resultMap：

```xml
<resultMap id="DepartmentResultMap" type="com.example.model.Department">
    <id property="id" column="id"/>
    <result property="name" column="name"/>
    <collection property="users" ofType="com.example.model.User">
        <id property="id" column="user_id"/>
        <result property="username" column="username"/>
        <result property="email" column="email"/>
    </collection>
</resultMap>
```

使用集合的resultMap：

```xml
<select id="selectDepartmentById" parameterType="int" resultMap="DepartmentResultMap">
    SELECT d.id, d.name, u.id AS user_id, u.username, u.email
    FROM departments d
    LEFT JOIN users u ON d.id = u.department_id
    WHERE d.id = #{id}
</select>
```



## Mybatis都有哪些Executor执行器？它们之间的区别是什么？

主要用三种执行器 SimpleExecutor，ReuseExecutor，BatchExecutor。SimpleExecutor 是默认的执行器，每次执行都会创建新的Statement对象，适用于简单的场景。ReuseExecutor 会重用Statement对象，适用于大量相同或类似 SQL 语句的场景。BatchExecutor 用于批量执行 SQL 语句，适用于批量更新操作的场景。

**SimpleExecutor**

-   SimpleExecutor是 MyBatis 的**默认执行器**。每次执行更新或查询操作时，都会开启一个新的Statement对象。适用于简单的、对性能要求不高的场景

-   **工作原理**：每次执行 SQL 操作时，SimpleExecutor都会创建一个新的Statement对象并执行 SQL 语句。执行完毕后，Statement对象会被关闭和销毁
-   特点
    -   每次执行 SQL 都会重新创建 PreparedStatement。
    -   不支持批量操作。
    -   不使用二级缓存

**ReuseExecutor**

-   ReuseExecutor 相比SimpleExecutor会重用Statement对象，以减少Statement对象的创建和销毁开销。适用于需要执行大量相同或类似 SQL 语句的场景。

-   **工作原理**：ReuseExecutor会缓存已经创建的Statement对象。当再次执行相同的 SQL 语句时，会重用缓存中的Statement对象，而不是重新创建一个新的对象。执行完毕后，Statement对象不会立即关闭，而是保存在缓存中，等待下次使用。
-   特点
    -   在同一个 SqlSession 内重用 PreparedStatement。
    -   支持批量操作。
    -   不使用二级缓存。

**BatchExecutor**

-   BatchExecutor会将多条 SQL 语句累积在一起，批量执行，以减少数据库的交互次数。适用于需要执行大量批量更新操作的场景，如批量插入、更新或删除

-   **工作原理**：BatchExecutor会将多条 SQL 语句添加到一个批处理中，直到调用commit或flushStatements方法时，才会将这些 SQL 语句一次性发送到数据库执行。这种方式可以显著减少数据库的交互次数，提高性能
-   特点
    -   支持批量操作，可以显著减少与数据库的交互次数。
    -   需要显式调用 `flushStatements()` 或 `commit()` 来提交批处理。
    -   不使用二级缓存

**配置方式**

可以在 MyBatis 全局配置文件（mybatis-config.xml）中通过defaultExecutorType属性来指定默认的执行器类型：

```xml
<settings>
    <setting name="defaultExecutorType" value="SIMPLE"/>
    <!-- 或者 -->
    <setting name="defaultExecutorType" value="REUSE"/>
    <!-- 或者 -->
    <setting name="defaultExecutorType" value="BATCH"/>
</settings>
```

也可以在代码中通过SqlSessionFactory来指定执行器类型：

```java
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader);
SqlSession sqlSession = sqlSessionFactory.openSession(ExecutorType.BATCH);
```

**CachingExecutor**

-   包装其他 Executor，添加二级缓存功能。它会在执行 SQL 之前先检查缓存，如果命中则直接返回缓存结果，否则执行实际的 SQL 并将结果存入缓存。
-   **适用场景**：适用于需要启用二级缓存的场景，可以减少数据库查询次数，提高查询性能。
-   特点
    -   包装其他 Executor（如 SimpleExecutor、ReuseExecutor 或 BatchExecutor）。
    -   支持二级缓存。
    -   缓存命中时可以直接返回结果，不执行 SQL。

| Executor        | 特点                                       | 适用场景                     |
| :-------------- | :----------------------------------------- | :--------------------------- |
| SimpleExecutor  | 每次查询创建新的 PreparedStatement，不缓存 | 简单查询，不需要缓存         |
| ReuseExecutor   | 同一 SqlSession 内重用 PreparedStatement   | 频繁执行相同 SQL             |
| BatchExecutor   | 批量处理 SQL，减少与数据库交互次数         | 批量插入、更新或删除大量数据 |
| CachingExecutor | 包装其他 Executor，添加二级缓存功能        | 需要启用二级缓存的场景       |



## Mybatis是否可以映射Enum枚举类？

mybatis 是可以映射枚举的。如果数据库字段是字符串类型，直接使用 enumtypehandler 指定好枚举之后，就可以自动映射，如果枚举是包含属性这种情况，我们需要自己实现一个TypeHandler 来继承 BaseTypeHandler，实现其中的如何从枚举映射的规则。在后面的版本中，mybatis 给我们提供了两个新东西。

EnumOrdinalTypeHandler和EnumTypeHandler。EnumOrdinalTypeHandler 可以将枚举的序数（ordinal）存储到数据库中。EnumTypeHandler 会将枚举的名称（name）存储到数据库中。以上。

**使用内置的EnumTypeHandler**

-   映射到字符串

假设有一个UserStatus枚举类：

```java
public enum UserStatus {
    ACTIVE,
    INACTIVE,
    DELETED
}
```

在数据库中，status字段是字符串类型。可以在 MyBatis 的 XML 配置文件中指定使用EnumTypeHandler：

```xml
<resultMap id="userResultMap" type="com.example.model.User">
    <id property="id" column="id"/>
    <result property="status" column="status" typeHandler="org.apache.ibatis.type.EnumTypeHandler"/>
</resultMap>
```

或者在注解中使用：

```java
@Results({
    @Result(property = "id", column = "id"),
    @Result(property = "status", column = "status", typeHandler = EnumTypeHandler.class)
})
@Select("SELECT id, status FROM users WHERE id = #{id}")
User selectUserById(int id);
```

-   映射到整数

假设UserStatus枚举类有一个整数值：

```java
public enum UserStatus {
    ACTIVE(1),
    INACTIVE(2),
    DELETED(3);

    private final int value;

    UserStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
```

可以创建一个自定义的TypeHandler来处理枚举和整数之间的转换：

```java
public class UserStatusTypeHandler extends BaseTypeHandler<UserStatus> {
    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, UserStatus parameter, JdbcType jdbcType) throws SQLException {
        ps.setInt(i, parameter.getValue());
    }

    @Override
    public UserStatus getNullableResult(ResultSet rs, String columnName) throws SQLException {
        int value = rs.getInt(columnName);
        return UserStatus.fromValue(value);
    }

    @Override
    public UserStatus getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        int value = rs.getInt(columnIndex);
        return UserStatus.fromValue(value);
    }

    @Override
    public UserStatus getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        int value = cs.getInt(columnIndex);
        return UserStatus.fromValue(value);
    }
}
```

在枚举类中添加一个静态方法来根据整数值获取枚举实例：

```java
public static UserStatus fromValue(int value) {
    for (UserStatus status : UserStatus.values()) {
        if (status.getValue() == value) {
            return status;
        }
    }
    throw new IllegalArgumentException("Unknown enum value: " + value);
}
```

然后在 MyBatis 配置文件中使用自定义的TypeHandler：

```xml
<resultMap id="userResultMap" type="com.example.model.User">
    <id property="id" column="id"/>
    <result property="status" column="status" typeHandler="com.example.typehandler.UserStatusTypeHandler"/>
</resultMap>
```

**EnumOrdinalTypeHandler和EnumTypeHandler**

MyBatis 3.4.5 及以上版本提供了两个新的TypeHandler：EnumOrdinalTypeHandler和EnumTypeHandler。

-   **EnumOrdinalTypeHandler**：将枚举的序数（ordinal）存储到数据库中。

-   **EnumTypeHandler**：将枚举的名称（name）存储到数据库中。

可以在配置文件中指定使用这些TypeHandler：

```xml
<resultMap id="userResultMap" type="com.example.model.User">
    <id property="id" column="id"/>
    <result property="status" column="status" typeHandler="org.apache.ibatis.type.EnumOrdinalTypeHandler"/>
</resultMap>
```

**全局配置枚举处理器**

可以在 MyBatis 全局配置文件中指定默认的枚举处理器，这样就不需要在每个resultMap或注解中重复指定TypeHandler。

```xml
<typeHandlers>
    <typeHandler javaType="com.example.model.UserStatus" handler="org.apache.ibatis.type.EnumTypeHandler"/>
</typeHandlers>
```



## mybatis和数据库交互的原理？

mybatis 和数据库交互主要分为几个阶段，第一步是 mybatis 会去加载配置文件，获取必要的基础的信息，然后创建出 sqlsessionfactory 工厂，工厂会帮助我们进行环境初始化，数据源加载等等。然后创建一个 sqlsession 对象，sqlsession 承担了与数据库交互的核心。每次执行数据库操作，可以从 sqlsession 里面获取到需要执行的 mapper。然后通过 mapper 开始执行 sql，获取数据。如果涉及事务也是 session 帮助我们来做事务提交或回滚的操作。

**1、初始化阶段**

**加载全局配置文件 (mybatis-config.xml)**

使用Resources.getResourceAsStream方法读取 MyBatis 全局配置文件。

解析配置文件中的\<environments>、\<mappers>等节点，加载数据源、事务管理器和 Mapper 文件。

```java
String resource = "mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
```

**2、创建SqlSessionFactory**

使用SqlSessionFactoryBuilder构建SqlSessionFactory对象。

SqlSessionFactory会根据配置文件初始化 MyBatis 环境，包括数据源、事务管理器和 Mapper 文件。

```java
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

**3、获取 SqlSession**

**打开 SqlSession**

从SqlSessionFactory获取一个新的SqlSession实例。SqlSession是 MyBatis 与数据库交互的核心对象，负责执行 SQL 语句、获取 Mapper 接口实例、管理事务等。

```java
SqlSession session = sqlSessionFactory.openSession()
```

**4、Mapper 接口操作**

**获取 Mapper 接口实例**

通过SqlSession获取 Mapper 接口的实现类实例。MyBatis 会在运行时生成 Mapper 接口的实现类，并通过SqlSession获取其实例。

```java
UserMapper mapper = session.getMapper(UserMapper.class);
```

**5、执行SQL语句**

**调用Mapper方法**

调用 Mapper 接口的方法，例如mapper.selectUserById(1);

```java
User user = mapper.selectUserById(1);
```

**参数处理**

将方法参数转换为 SQL 语句中的占位符（如#{id}）所需的值。MyBatis 使用TypeHandler将 Java 类型转换为 JDBC 类型。

**执行 SQL 语句**

MyBatis 使用 JDBC 通过数据源执行 SQL 语句，数据库返回结果集。

**结果映射**

将 SQL 查询结果集映射为 Java 对象。根据映射文件或注解中的配置，将结果集中的数据映射到 Java 对象的属性中。

**6、事务管理**

**提交事务**

如果执行的数据操作需要提交事务，调用session.commit();提交事务，提交事务会将所有未提交的更改保存到数据库。

```java
session.commit();
```

**回滚事务**

如果操作过程中发生异常，需要回滚事务，调用session.rollback();回滚事务，回滚事务会撤销所有未提交的更改

```java
session.rollback();
```

**7、关闭资源**

**关闭 SqlSession** 

操作完成后，调用session.close();关闭SqlSession，释放数据库连接。

```java
session.close();
```

Demo

```java
// 1. 加载配置文件并创建 SqlSessionFactory
String resource = "mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

// 2. 获取 SqlSession
try (SqlSession session = sqlSessionFactory.openSession()) {
    // 3. 获取 Mapper 接口实例
    UserMapper mapper = session.getMapper(UserMapper.class);

    // 4. 执行 SQL 语句
    User user = mapper.selectUserById(1);
    System.out.println(user);

    // 5. 提交事务（如果有数据修改操作）
    session.commit();
} catch (Exception e) {
    // 5. 回滚事务
    session.rollback();
    e.printStackTrace();
} finally {
    // 6. 关闭 SqlSession
    session.close();
}
```

  



## Mybaits动态SQL有什么用？执行原理？有哪些动态SQL？



## 简述Mybaits的插件运行原理，以及如何编写一个插件？



## JDBC有哪些不足？Mybaits是如何解决的？



## mybatis与jdbc编程相比有什么优势





## Mybaits是否支持延迟加载？它的实现原理？



## 





## Mybaits如何实现数据库类型和Java类型的转换？







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





## mybatis的paramtertype为什么可以写简称？



## 对于公共字段你是怎么处理的？

-   利用MP提供的能力：实现`MetaObjectHandler`接口
-   手写Mybatis拦截器实现
-   AOP+自定义注解，然后在需要填充的方法上使用注解（例如：insert、update等方法）





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

