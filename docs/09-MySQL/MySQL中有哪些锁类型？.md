---
permalink: /mysql/lock/lock
---

# MySQL中有哪些锁类型？

```markmap
# MySQL锁类型

## 粒度分类
### 全局锁
### 表锁
#### 表级别的S锁、X锁
#### 意向锁（Intention Lock）
#### 自增锁（AUTO-INC Lock）
#### MDL锁
### 行锁
#### 记录锁（Record Lock）
#### 间隙锁（Gap Lock）
#### 临键锁（Next-Key Lock）
#### 插入意向锁（Insert Intention Lock）

## 模式分类|对待锁的态度
- 乐观锁（Optimistic Lock）
- 悲观锁（Pessimistic Lock）

## 属性分类|对数据的操作类型划分
- 共享锁（Shared Lock）
- 排他锁（Exclusive Lock）

## 状态分类
- 意向共享锁（IS）
- 意向排他锁（IX）

## 加锁方式
- 隐式锁
- 显式锁

## 算法分类
- 记录锁（Record Lock）
- 间隙锁（Gap Lock）
- 临键锁（Next-Key Lock）
```

