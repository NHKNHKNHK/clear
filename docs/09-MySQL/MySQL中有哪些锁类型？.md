---
permalink: /25/10/26/mysql/lock/lock
---

# MySQL中有哪些锁类型？

```markmap
# MySQL锁类型

## 粒度分类
- 全局锁
- 表锁
- 行锁

## 模式分类
- 乐观锁（Optimistic Lock）
- 悲观锁（Pessimistic Lock）

## 属性分类
- 共享锁（Shared Lock）
- 排他锁（Exclusive Lock）

## 状态分类
- 意向共享锁（IS）
- 意向排他锁（IX）

## 算法分类
- 记录锁（Record Lock）
- 间隙锁（Gap Lock）
- 临键锁（Next-Key Lock）
```