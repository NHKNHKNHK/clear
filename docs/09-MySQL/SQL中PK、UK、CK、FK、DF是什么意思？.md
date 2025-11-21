# SQL中PK、UK、CK、FK、DF是什么意思？

K是Key的意思，就是代表约束的，所以PK、UK这些都是代表不同类型的约束：

- PK：Primary Key ，主键约束
- UK：Unique Key， 唯一约束
- CK： check()， 检查约束
- FK：Foreign Key， 外键约束
- DF：default ，默认约束

> MySQL8之前不支持检查约束，即使设置了也不生效，MySQL8之后支持了检查约束