# SQL语法顺序？

手写SQL的顺序：

```sql
SELECT DISTINCT
	<select_list>
FROM
	<left_table> <join_type>
JOIN <right_table> ON <JOIN_condition>
WHERE
	<where_condition>
GROUP BY
	<group_by_list>
HAVING
	<having_condition>
ORDER BY
	<order_by_condition>
LIMIT <limit_number>
```

机读顺序：

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

