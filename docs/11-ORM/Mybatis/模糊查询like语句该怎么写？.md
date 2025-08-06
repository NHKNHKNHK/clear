# 模糊查询like语句该怎么写？


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

