# MySQL的 where 1=1会不会影响性能？


>   参考文章：https://juejin.cn/post/7374238289107648551



在MySQL中，使用`WHERE 1=1`通常**不会对性能产生显著影响**，原因如下：

## 1、 **查询优化器的处理**

-   MySQL的查询优化器会在解析阶段对条件进行简化。`1=1`是一个恒真条件（`true`），优化器会直接将其移除，最终的查询计划与没有该条件的语句完全一致。

例如：

```sql
SELECT * FROM table WHERE 1=1 AND name='Alice';
```

会被优化为：

```sql
SELECT * FROM table WHERE name='Alice';
```

>   **Constant-Folding Optimization**（MySQL5.7版本开始引入）
>
>   MySQL的优化器具有一项称为 Constant-Folding Optimization（常量折叠优化）的功能，可以从查询中消除重言式表达式。
>
>   Constant-Folding Optimization 是一种编译器的优化技术，用于优化编译时计算表达式的常量部分，从而减少运行时的计算量，换句话说：Constant-Folding Optimization 是发生在编译期，而不是引擎执行期间。
>
>   
>
>   **重言式**
>
>   重言式（Tautology ）又称为永真式，它的汉语拼音为：[Chóng yán shì]，是逻辑学的名词。命题公式中有一类重言式，如果一个公式，对于它的任一解释下其真值都为真，就称为重言式（永真式）。
>
>   其实，重言式在计算机领域也具有重要应用，比如"重言式表达式"（Tautological expression），它指的是那些总是为真的表达式或逻辑条件。
>
>   在 SQL查询中，重言式表达式是指无论在什么情况下，结果永远为真，它们通常会被优化器识别并优化掉，以提高查询效率。
>
>   例如，如果 where中包含 1=1 或 A=A 这种重言式表达式，它们就会被优化器移除，因为对查询结果没有实际影响



## 2、**对索引的影响**

-   如果查询的其他条件能够命中索引，添加`1=1`不会导致索引失效。例如，若`name`字段有索引，优化后的查询仍会使用该索引。
-   执行计划（可通过`EXPLAIN`命令查看）不会包含`1=1`，因此不影响索引选择或扫描方式。



## 3、**动态SQL的便利性**

-   `WHERE 1=1`常用于动态生成SQL的场景（如拼接多个可选条件），避免处理首条件是否需要`WHERE`或后续条件是否需要`AND`的复杂性。

例如，代码中可以统一添加`AND condition`，无需额外逻辑判断：

```sql
query = "SELECT * FROM table WHERE 1=1"
if name_filter:
    query += " AND name = %s"
if date_filter:
    query += " AND date > %s"
```

>   补充：
>
>   对于Mybatis而言，我们更多的是使用他提供的`<where>`标签



## **总结**

`WHERE 1=1`是一种**安全的写法**，其性能影响可忽略不计。优化器会将其移除，动态SQL的便利性收益远大于可能的理论性能损耗。在实际开发中，可以放心使用这种模式来简化条件拼接逻辑。


