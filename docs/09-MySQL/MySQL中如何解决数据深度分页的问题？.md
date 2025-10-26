---
permalink: /mysql/deep-limit
---

# MySQL中如何解决数据深度分页的问题？

`LIMIT offset, size`在offset很大时，需要扫描并跳过大量记录，造成性能瓶颈，这就是所谓的深分页问题。

```sql
-- 创建测试表，假设有1000万数据
CREATE TABLE order (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    amount DECIMAL(10,2),
    status TINYINT,
    created_time DATETIME,
    INDEX idx_created_time (created_time)
);

-- 传统的分页写法：当offset达到500万时，性能急剧下降
EXPLAIN SELECT * FROM order
ORDER BY created_time DESC
LIMIT 5000000, 20;
```

**传统分页的性能瓶颈**：

- **大量无效IO**：需要读取进内存并跳过offset条记录
- **回表成本**：对于非覆盖索引，需要回表查询完整数据
- **排序开销**：大数据量的排序可能在磁盘进行


## 游标分页（推荐）

**游标分页的优势**：
- 直接定位到起始位置，无需跳过大量记录。
  - 例如查询第1000000条数据并展示20条记录，传统分页查询需要扫描1000000 + 20 条记录， 
  而游标分页只需要获取到第1000000条数据的id并基于索引扫描20条记录即可。前者时间复杂度O(n)，后者仅为O(1)
- 利用索引的有序性，避免排序
- 操作性能稳定，不随数据量增长而下降

```sql
-- 第一页
SELECT * FROM order
ORDER BY created_time DESC, id DESC
LIMIT 20;

-- 第二页：记住上一页最后一条记录的created_time和id
SELECT * FROM order
WHERE created_time < '2023-06-01 10:00:00'
   OR (created_time = '2023-06-01 10:00:00' AND id < 1000000)
ORDER BY created_time DESC, id DESC
LIMIT 20;
```

## 子查询优化

```sql
SELECT * FROM order
WHERE id >= (
    SELECT id FROM order
    ORDER BY created_time DESC
    LIMIT 5000000, 1
)
ORDER BY created_time DESC
LIMIT 20;
```