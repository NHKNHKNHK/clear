# 使用 MyBatis 的 mapper 接口调用时有哪些要求？

在使用 mybatis 的 mapper 的时候，我们要注意，接口必须是 public 的，其次就是接口中的方法名，必须与 xml 文件中的 id 相同，才能正常映射成功，在 xml 文件中，要保证 namespace 与接口的全类名，保持一致。还有就是要保证接口里面的入参与 xml 里面的 paramtype 和 resulttype 保持一致

本题关键要点：**接口必须public、方法名对应、namespace对应、参数对应**

## 1、**Mapper接口要求**

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

## 2、**映射文件要求**

**命名空间**：映射文件的namespace命名空间必须与 Mapper 接口的全限定名一致。

```xml
<mapper namespace="com.example.mapper.UserMapper">
  <select id="selectUser" parameterType="int" resultType="com.example.model.User">
    SELECT * FROM users WHERE id = #{id}
  </select>
</mapper>
```

**SQL 语句 ID**：映射文件中的 SQL 语句 ID 必须与 Mapper 接口中的方法名一致

##  3、**配置文件要求**

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

## 4、**参数和返回类型**

**参数类型**：Mapper 接口方法的参数类型必须与映射文件中的parameterType一致。如果使用注解方式，参数名要与 SQL 中的占位符一致

-   单个参数：如果方法只有一个参数，可以直接传递。
-   多个参数：如果方法有多个参数，可以使用@Param注解来指定参数名称，或者将参数封装到对象中。

**返回类型**：Mapper 接口方法的返回类型必须与映射文件中的resultType一致。

-   单个结果：方法返回单个对象或基本类型
-   多个结果：方法返回集合（List或Map）
