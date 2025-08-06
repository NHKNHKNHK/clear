# 如何避免 sql 注入？

sql 注入是一个非常难搞的问题。如果不加以防范就会对我们的系统造成危险。mybatis 避免 sql 注入的方式，有几层。首先就是 myabtis 采取了**预编译的 sql 语句**，预编译的 sql 语句是参数化查询，不是直接拼接，这种就会导致攻击者的输入并不会当作 sql 执行，这是一种防御机制。另一种就是我们在开发的过程中，要保证在拼接的时候，使用**#占位符**。#不会直接拼接，可以安全的传递，然而如果使用\$就会导致直接拼接，这样会造成 sql 注入问题，不过有些需求确实是动态的 sql 处理，要动态传入表名，动态传入字段等等。这种情况也就只能使用$进行了

> 本题关键点：预编译、#占位符

## **使用预编译的SQL语句**

MyBatis 通过预编译的 SQL 语句来执行查询和更新操作。预编译的 SQL 语句使用参数化查询，不是直接拼接到 SQL 语句中。这样可以让攻击者的输入不会被当作 SQL 代码执行

## **使用#{}占位符**

MyBatis 提供了#{}占位符，用于安全地传递参数。与之相对的是\${}，后者会直接将参数值嵌入到 SQL 语句中，容易导致 SQL 注入，因此应尽量避免使用${}。#{id}是一个占位符，MyBatis 会将其替换为一个安全的参数，而不是直接拼接到 SQL 字符串中

### 安全的使用方式

```xml
<select id="selectUserByName" parameterType="string" resultType="com.example.model.User">
  SELECT * FROM users WHERE username = #{username}
</select>
```

### 不安全的使用方式

```xml
<select id="selectUserByName" parameterType="string" resultType="com.example.model.User">
  SELECT * FROM users WHERE username = '${username}'
</select>
```

## **使用SQL构建工具**

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


