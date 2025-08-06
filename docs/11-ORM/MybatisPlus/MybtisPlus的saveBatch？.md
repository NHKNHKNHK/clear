# MybtisPlus的saveBatch？

`saveBatch` 方法是 MyBatis Plus 中用于批量插入记录的一个方法。

```java
List<User> userList = new ArrayList<>();
// 添加多个 User 对象到列表中
userList.add(new User("张三", 25));
userList.add(new User("李四", 30));
userList.add(new User("王五", 28));

// 调用 saveBatch 方法批量保存用户数据
boolean result = userService.saveBatch(userList);
if (result) {
    System.out.println("批量插入成功");
} else {
    System.out.println("批量插入失败");
}
```

说明：

-   `saveBatch` 方法接受两个参数
    -   第一个参数是 `List<T>` 类型，其中 `T` 是你要批量插入的实体类。
    -   第二个参数是 `int batchSize`，表示每次批量插入的最大数量，**默认值为 1000**。
-   如果插入的列表元素数量大于`batchSize`，那么会自动拆分成多个批次进行插入

