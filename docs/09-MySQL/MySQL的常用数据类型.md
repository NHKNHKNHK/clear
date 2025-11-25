---
permalink: /mysql/mysql-datatype
---

# MySQL的常用数据类型

```markmap
# 
## 数值类型
### 整数类型 
- TINYINT、SMALLINT、MEDIUMINT、INT(或INTEGER)、BIGINT
### 浮点类型
- FLOAT、DOUBLE
### 定点数类型
- DECIMAL
### 位类型
- BIT

## 日期时间类型
- YEAR、TIME、DATE
- DATETIME
- TIMESTAMP

## 字符串类型
### 文本字符串类型
- CHAR
- VARCHAR
- TINYTEXT、TEXT、MEDIUMTEXT、LONGTEXT
### 枚举类型
- ENUM
### 集合类型
- SET
### 二进制字符串类型
- BINARY、VARBINARY
- TINYBLOB、BLOB
- MEDIUMBLOB、LONGBLOB
### JSON类型
- JSON对象、JSON数组

## 空间数据类型
### 单值类型
- GEOMETRY、POINT、LINESTRING、POLYGON
### 集合类型
- MULTIPOINT、MULTILINESTRING、MULTIPOLYGON、GEOMETRYCOLLECTION
```

## 全部数据类型

| 数据类型 | 举例 |
| -------- | ---- |
| 整数类型 | TINYINT、SMALLINT、MEDIUMINT、INT(或INTEGER)、BIGINT |
| 浮点类型 | FLOAT、DOUBLE |
| 定点数类型 | DECIMAL |
| 位类型 | BIT |
| 日期时间类型 | YEAR、TIME、DATE、DATETIME、TIMESTAMP |
| 文本字符串类型 | CHAR、VARCHAR、TINYTEXT、TEXT、MEDIUMTEXT、LONGTEXT |
| 枚举类型 | ENUM |
| 集合类型 | SET |
| 二进制字符串类型 | BINARY、VARBINARY、TINYBLOB、BLOB、MEDIUMBLOB、LONGBLOB |
| JSON类型 | JSON对象、JSON数组 |
| 空间数据类型 | 单值类型：GEOMETRY、POINT、LINESTRING、POLYGON；<br>集合类型：MULTIPOINT、MULTILINESTRING、MULTIPOLYGON、GEOMETRYCOLLECTION |

## 使用时的注意点

- INT类型可以设置显示宽度，如`INT(11)`，但是他与真正存储的值范围无关；MySQL 8开始不推荐使用显示宽度属性
  - `INT(M)`必须和`UNSIGNED ZEROFILL`配合使用采用意义
- 使用DECIMAL类型时必须指定精度M、标度D——DECIMAL(M,D)，如`DECIMAL(5, 2)`表示取值范围是 -999.99 ~ 999.99
- 日期时间类型，建议使用`DATETIME`，因为此数据类型包含完整的日期和时间信息，取值范围也大
- TIMESTAMP类型只能存储“1970-01-01 00:00:01 UTC”到“2038-01-19 03:14:07 UTC”之间的时间，且使用TIMESTAMP存储的同一个时间值，在不同的时区查询时会显示不同的时间。因此一般不用
- 使用CHAR类型是建议指定长度，，否则默认`CHAR(1)`
- 使用VARCHAR类型是**必须指定**长度，否则报错
  - `VARCHAR(M)`，建议M是2的幂，如 16、32、64

## 数据类型的选择建议

在定义数据类型时，如果确定是 `整数` ，就用 `INT` ；

如果是 `小数` ，一定用定点数类型 `DECIMAL(M,D)` ；

如果是`日期与时间`，就用 `DATETIME` 。

这样做的好处是，首先确保你的系统不会因为数据类型定义出错。不过，凡事都是有两面的，可靠性好，并不意味着高效。比如，`TEXT` 虽然使用方便，但是效率不如 `CHAR(M)` 和 `VARCHAR(M)`。

关于字符串的选择，建议参考如下阿里巴巴的《Java开发手册》规范：

- 任何字段如果为非负数，必须是 `UNSIGNED`
- <span style="color: var(--alibaba-qiangzhi-text-color);">【强制】</span>小数类型为 `DECIMAL`，禁止使用 FLOAT 和 DOUBLE。
    - 说明：在存储的时候，FLOAT 和 DOUBLE 都存在精度损失的问题，很可能在比较值的时候，得到不正确的结果。如果存储的数据范围超过 DECIMAL 的范围，建议将数据拆成整数和小数并分开存储。

- <span style="color: var(--alibaba-qiangzhi-text-color);">【强制】</span>如果存储的字符串长度几乎相等，使用 CHAR 定长字符串类型
- <span style="color: var(--alibaba-qiangzhi-text-color);">【强制】</span>VARCHAR 是可变长字符串，不预先分配存储空间，长度不要超过 5000。如果存储长度大于此值，定义字段类型为 TEXT，独立出来一张表，用主键来对应，避免影响其它字段索引效率。
