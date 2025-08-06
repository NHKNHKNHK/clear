# Mybatis修改字段类型引发的bug <Badge text="生产环境真实踩坑经历" type="danger"/>

## **问题产生背景**

我们可能由于在做项目的过程中，由于前期需求的不确定性，通过会把一些字段设置为varchar类型。

然后我们会根据表去生成POJO、DAO以及Mapper映射文件。

后续如果我们对这些字段的类型做了修改，例如修改成了bigint类型，对应的POJO类需要修改成Long类型。

此时我们可能会忽略（或者说忘记）Mapper映射文件中该字段的查询条件，如`<if test="status != null and status  != ''">`。

会导致数值型参数值为 **0** 时条件失效

此时我们在进行条件查询是status=0，由于OGNL，会将0也会当成''空字符串，会导致数值型参数值为 **0** 时条件失效

>   当你在 MyBatis 里修改字段类型后，由于 OGNL（Object Graph Navigation Language）表达式的特性，将 0 当作 '' 来处理

例如：

```xml
<if test="status != null and status != ''">  <!-- 问题点：status在实体类中为Long，但保留了对空字符串的校验 -->
    AND status = #{status}
</if>
```

解决方法很简单，将校验逻辑从 **status != null and status != ''** 简化为 **status != null**

```xml
<if test="status != null">  <!-- 修正后：仅校验非空 -->
    AND status = #{status}
</if>
```

## **总结**

-   **字段类型变更后**：需同步检查 Mapper 中所有相关条件，删除对数值型字段的 **空字符串校验**（`!= ''`）。
-   **OGNL 隐式规则**：数值类型字段与空字符串 `''` 比较时，会转换为 `0`，导致逻辑错误。
