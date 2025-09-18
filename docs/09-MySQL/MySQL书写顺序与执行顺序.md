# MySQL书写顺序与执行顺序（SQL层面）

## 手写SQL的顺序

**SQL92语法**

```sql
SELECT DISTINCT ...,... （存在聚合函数）
FROM ...,...
WHERE 多表连接条件 AND 不包含聚合函数的过滤条件
GROUP BY ...,...
HAVING 包含聚合函数的过滤条件
ORDER BY ...,...(ASC / DESC)
LIMIT ...,...
```

**SQL99语法**

```sql
SELECT DISTINCT ...,... （存在聚合函数）
FROM ... (LEFT / RIGHT) JOIN ...
ON 多表连接条件 
WHERE 不包含聚合函数的过滤条件
GROUP BY ...,...
HAVING 包含聚合函数的过滤条件
ORDER BY ...,...(ASC / DESC)
LIMIT ...,...
```

## SQL语句执行顺序

```sql
FROM
	<left_table> <join_type>
JOIN <right_table> 
ON <JOIN_condition>
WHERE
	<where_condition>
GROUP BY
	<group_by_list>
HAVING
	<having_condition>
SELECT 
DISTINCT
	<select_list>
ORDER BY
	<order_by_condition>
LIMIT <limit_number>

-- 说明
-- 		FROM 从那些表中筛选
-- 		ON 关联多表查询时，去除笛卡尔积
-- 		WHERE 从表中筛选的条件
-- 		GROUP BY 分组依据
-- 		HAVING 在统计结果中再次筛选
-- 		ORDER BY 排序依据
-- 		LIMIT 分页
```

示例：

```sql
SELECT name, age
	FROM users
	WHERE age > 18
    	GROUP BY department
        	HAVING COUNT(*) > 5
        ORDER BY age DESC
		LIMIT 10 OFFSET 5;
```

表示，从users表中查询，筛选出age>18，然后根据department进行分组，接着对分组后的结果进行筛选，只筛选出记录数大于5的分组。然后取出name, age字段。最后根据age字段进行降序排序，返回第6到第15条记录

## SQL执行原理

## 注意点

- SELECT后面的非聚合字段必须在GROUP BY后面出现，否则会报错。例如：

```sql
-- 错误示例
SELECT department_id, JOB_ID, AVG(salary)
FROM employees
GROUP BY department_id;
```

- 非法使用聚合函数：不能在WHERE子句中使用聚合函数，但是可以在HAVING子句中使用。

```sql
-- 错误示例：查询部门平均工资大于8000的部门信息
SELECT department_id, AVG(salary)
FROM employees
WHERE AVG(salary) > 8000
GROUP BY department_id;

-- 正确示例：
SELECT department_id, AVG(salary)
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 8000;
```

## 扩展

### where和having的区别

:::tip
where和having都是过滤数据，但是where是在分组之前过滤，having是在分组之后过滤。
:::

- 区别1：WHERE可以直接使用表中的字段作为筛选条件，但不能使用聚合函数作为筛选条件；HAVING必须要与GROUP BY配合使用，可以把聚合函数、分组字段作为筛选条件

HAVING可以完成WHERE不能完成的操作，因为WHERE执行在GROUP BY之前，所以无法对分组结果进行筛选。

- 区别2：如果需要通过连接从多表中获取数据，WHERE是先筛选后连接，HAVING是先连接后筛选。

所以WHERE比HAVING更高效。
