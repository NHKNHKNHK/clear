# MyBatis的Xml映射文件中，都有哪些常见标签？

常见的有 mapper，select，resultmap，if，sql 等等标签，像 mapper 标签是 xml 中的根部，有了它才能够和接口进行映射。select，insert 这些定义了这个 sql 行为到底是查询还是插入。当我们把查询出的数据要映射到实体的时候，可以封装一个 map，这样我们不用每个字段都写 as，只需要用 resultmap，就可以自动帮我们进行属性映射。当想要判断一些条件来决定是否拼接 sql 的时候，可以使用 if。最后就是公共的 sql，比如 select 后面的一堆属性，可以放在 sql 标签内。以上。

主要还是考察你在用 mybatis 的时候一个复杂程度，是否很多标签都用过，可以考察出你的熟练度。

## \<mapper>

-   定义一个映射文件的根元素，包含所有的映射配置。
-   **常用属性**：
    -   namespace，指定与之关联的 Mapper 接口的全限定名

```xml
<mapper namespace="com.example.mapper.UserMapper">
  <!-- SQL 语句和其他配置 -->
</mapper>
```

## \<select>

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

## \<insert>

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

## \<update> \<delete>

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

## \<resultMap>

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

## \<if>

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

## \<choose>,\<when>,\<otherwise>

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

## \<trim>,\<where>,\<set>

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

## \<foreach>

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

## \<sql>

-   定义可重用的 SQL 片段。
-   **属性**：id，唯一标识该 SQL 片段

```xml
<!-- 抽取公共字段 -->
<sql id="userColumns">
  id, username, password
</sql>

<select id="selectUser" resultType="com.example.model.User">
  SELECT <include refid="userColumns"/> FROM users WHERE id = #{id}
</select>
```

## \<include>

-   引入\<sql>标签定义的 SQL 片段。
-   **属性**：refid，引用\<sql>标签的 ID

```xml
<select id="selectUser" resultType="com.example.model.User">
  SELECT <include refid="userColumns"/> FROM users WHERE id = #{id}
</select>
```
