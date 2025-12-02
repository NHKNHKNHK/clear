# SpringBoot整合MongoDB

SpringData家族成员之一，用于操作MongoDB的持久层框架，封装了底层的mongodb-driver。 

官网主页： https://projects.spring.io/spring-data-mongodb/ 

## 1 导入对应的starter

如果SpringBoot官方没有收录，可以在mvnrepository中查找

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

## 2 编写application.yml配置文件

mongodb没有开启任何安全协议下的配置（无密码）

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://192.168.188.150:27017/testdb
```

mongodb开启任何安全协议下的配置（有密码）

```yaml
spring:
  data:
    mongodb:
      host: 192.168.188.150
      port: 27017
      database: testdb
      username: root
      password: root
```

说明：

​	如果为了安全，可以使用第二章配置的方式

​	但是我一般都是使用第一种

## 3 相关注解说明

-   @Document
    -   修饰范围：用在类上
    -   作用：用来映射这个类的一个对象为 mongo 中一条文档数据
    -   属性：（value、collection）用来指定操作的集合名称
-   @Id
    -   修饰范围：用在成员变量、方法上
    -   作用：用来将成员变量的值映射为文档的_id 的值
-   @Field
    -   修饰范围：用在成员变量、方法上
    -   作用：用来将成员变量以及值映射为文档中一个key、value对
    -   属性：（name, value）用来指定在文档中 key的名称，默认为成员变量名
-   @Transient
    -   修饰范围：用在成员变量、方法上
    -   作用：用来指定改成员变量，不参与文档的序列化

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("users")  // 这个类的实例就代表 MongoDB 中的一条文档
public class User {
    @Id  // 用来将这个类的 id 映射为文档中的 _id
    private Integer id;
    @Field("username")
    private String name;
    @Field
    private Double salary;
    @Field
    private Date birthday;
}
```

## 4 集合操作

### 4.1 创建集合

```java
/**
 * 创建集合
 * db.createCollection("orders");
 */
@Test
public void testCreateCollection() {
    String collection = "products";
    if (mongoTemplate.collectionExists(collection))
        log.info("集合 {} 已存在", collection);
    else
        // 集合如果存在，继续创建会抛出异常 UncategorizedMongoDbException
        mongoTemplate.createCollection(collection);
}
```

### 4.2 删除集合

```java
/**
 * 删除集合
 */
@Test
public void testDropCollection() {
    String collection = "products";
    mongoTemplate.dropCollection(collection);
}
```

## 5 文档操作

### 5.1 添加文档

```java
/**
 * 添加文档/更新文档
 */
@Test
public void testAddDocument() {
    User user = new User(1, "nhk", 9999D, new Date());
    User user2 = new User(2, "clear", 9999D, new Date());
    User save = mongoTemplate.save(user);// save方法在 _id 存在时更新数据，返回保存的对象
    User insert = mongoTemplate.insert(user2);  // insert方法在 _id 存在时抛出异常，返回保存的对象
}

/**
 * 批量添加文档
 */
@Test
public void testAddBulkDocument() {
    User user3 = new User(3, "nhk", 9999D, new Date());
    User user4 = new User(4, "clear", 9999D, new Date());
    List<User> userList = Arrays.asList(user3, user4);
    //mongoTemplate.insert(userList,"users");   // 参数1：批量数据  参数2：放入哪一个集合
    // 等同于
    mongoTemplate.insert(userList, User.class);
}
```

说明：

-   插入重复数据时
    -   insert 报`DuplicateKeyException`提示主键重复
    -   save 会对已存在的文档进行更新

-   批处理操作时
    -   insert 可以一次性插入多条文档，效率高
    -   save 一次只能插入一条文档，插入多条文档需要通过遍历，效率较低



### 5.2 查询文档

#### 5.2.1 查询所有

```java
/**
 * 查询文档：查询所有
 */
@Test
public void testFindAllDocument() {
    // 查询所有
    // db.users.find()
    List<User> userList = mongoTemplate.findAll(User.class);
    userList.forEach(System.out::println);

    // todo 如果没有在实体类中设置 @Document 注解，这可以使用以下方式
    List<User> userList2 = mongoTemplate.findAll(User.class, "users");
    userList2.forEach(System.out::println);

    // 另一种方法
    // db.users.find({})
    List<User> userList3 = mongoTemplate.find(new Query(), User.class);
    userList3.forEach(System.out::println);
}
```

#### 5.2.2 根据id查询

```java
/**
 * 查询文档：根据Id查询
 */
@Test
public void testFindDocumentById() {
    // 基于 id 查询一条文档
    User user = mongoTemplate.findById(1, User.class);
    System.out.println(user);
}
```

#### 5.2.3 等值查询

```java
/**
 * 查询文档：等值查询
 */
@Test
public void testEquivalentFindDocument() {
    // db.users.find({username:"nhk"})
    // 参数1：查询条件  参赛2：返回类型
    // todo 我们在User实体类中使用了 @Field("username")，因此这里直接写成员变量即可，当然用username也行
    List<User> userList = mongoTemplate.find(Query.query(Criteria.where("name").is("nhk")), User.class);
    userList.forEach(System.out::println);
}
```

#### 5.2.4 条件查询

```java
/**
 * 查询文档：条件查询
 * > gt  < lt  >= gte  <= lte
 */
@Test
public void testConditionalFindDocument() {
    // 参数1：查询条件  参赛2：返回类型
    // >
    List<User> userList = mongoTemplate.find(Query.query(Criteria.where("salary").gt(5000)), User.class);
    userList.forEach(System.out::println);
    System.out.println("=============================");
    // <
    List<User> userList2 = mongoTemplate.find(Query.query(Criteria.where("salary").lt(5000)), User.class);
    userList2.forEach(System.out::println);
    System.out.println("=============================");
    // >=
    List<User> userList3 = mongoTemplate.find(Query.query(Criteria.where("salary").gte(5000)), User.class);
    userList3.forEach(System.out::println);
    System.out.println("=============================");
    // <=
    List<User> userList4 = mongoTemplate.find(Query.query(Criteria.where("salary").lte(5000)), User.class);
    userList4.forEach(System.out::println);
    System.out.println("=============================");
}
```

#### Criteria

| Criteria                                    | Mongodb | 说明     |
| ------------------------------------------- | ------- | -------- |
| Criteria and (String key)                   | $and    | 并且     |
| Criteria andOperator (Criteria... criteria) | $and    | 并且     |
| Criteria orOperator (Criteria... criteria)  | $or     | 或者     |
| Criteria gt (Object o)                      | $gt     | 大于     |
| Criteria gte (Object o)                     | $gte    | 大于等于 |
| Criteria in (Object... o)                   | $in     | 包含     |
| Criteria is (Object o)                      | $is     | 等于     |
| Criteria It (Object o)                      | $lt     | 小于     |
| Criteria Ite (Object o)                     | $lte    | 小等于   |
| Criteria nin (Object... o)                  | $nin    | 不包含   |

#### 5.2.5 and/or

```java
/**
 * 查询文档： and
 */
@Test
public void testFindDocumentByAND() {
    // db.users.find({username:"nhk",salary:9999})
    List<User> userList = mongoTemplate.find(Query.query(Criteria.where("name").is("nhk")
                                                         // todo 注意：查询时需要考虑类型，salary是Double
                                                         .and("salary").is(9999D)), User.class);
    userList.forEach(System.out::println);
}

/**
 * 查询文档： or
 */
@Test
public void testFindDocumentByOR() {
    // db.users.find({$or:[{username:"nhk"},{username:"clear"}]})
    // fixme 错误示例
    List<User> userList = mongoTemplate.find(Query.query(Criteria.where("name").is("nhk")
                                                         .orOperator(Criteria.where("name").is("clear"))), User.class);
    userList.forEach(System.out::println);
    // 正确示例
    Criteria criteria = new Criteria();
    criteria.orOperator(
        Criteria.where("name").is("nhk"),
        Criteria.where("name").is("clear"),
        Criteria.where("salary").lte(10000D)
    );
    List<User> userList2 = mongoTemplate.find(Query.query(criteria), User.class);
    userList2.forEach(System.out::println);

}


/**
 * 查询文档： and or
 */
@Test
public void testFindDocumentByAND_OR() {
    List<User> userList = mongoTemplate.find(Query.query(Criteria.where("salary").is(9999D)
                                                         .orOperator(Criteria.where("name").is("clear"))), User.class);
    userList.forEach(System.out::println);
}
```

#### 5.2.6 排序查询

```java
/**
 * 查询文档：sort
 */
@Test
public void testSortFindDocument() {
    // 按照id降序排序，按照salary升序排序
    Query querySort = new Query();
    querySort.with(Sort.by(Sort.Order.desc("id"), Sort.Order.asc("salary")));
    List<User> userList = mongoTemplate.find(querySort, User.class);
    userList.forEach(System.out::println);
}
```

#### 5.2.7 查询总数

```java
/**
 * 查询文档：查询总条数
 */
@Test
public void testFindDocumentCount() {
    long count = mongoTemplate.count(new Query(), User.class);
    System.out.println(count);

    // 查询符合条件的总条数
    long count2 = mongoTemplate.count(new Query(Criteria.where("name").is("nhk")), User.class);
    System.out.println(count2);
}
```

#### 5.2.8 分页查询

```java
/**
 * 查询文档： 分页查询
 */
@Test
public void testFindDocumentPage() {
    // 页面大小
    int pageSize = 2;
    Query querySortPage = new Query();
    for (int i = 0; i < mongoTemplate.count(new Query(), User.class) / pageSize; i++) {
        System.out.printf("==============第 {%d} 页=================\n", i + 1);
        querySortPage.with(Sort.by(Sort.Order.desc("id")))
            .skip(i * 2)
            .limit(pageSize);
        List<User> userList = mongoTemplate.find(querySortPage, User.class);
        userList.forEach(System.out::println);

    }
}
```

#### 5.2.9 去重查询

```java
/**
 * 查询文档：去重查询
 */
@Test
public void testFindDocumentDistinct() {
    // 参数1：查询条件  参数2：去重字段  参数3：操作的集合  参数4：返回结果类型
    List<String> nameList = mongoTemplate.findDistinct(new Query(), "name", User.class, String.class);
    nameList.forEach(System.out::println);

    List<Double> salaryList = mongoTemplate.findDistinct(new Query(), "salary", User.class, Double.class);
    salaryList.forEach(System.out::println);
}
```

#### 5.2.10 JSON方式查询

```java
/**
 * 查询文档  以JSON字符串形式查询
 */
@Test
public void testFindDocumentByJSON() {
    Query query = new BasicQuery("{name: 'nhk', salary: 9999}");
    List<User> userList = mongoTemplate.find(query, User.class);
    userList.forEach(System.out::println);

    Query query2 = new BasicQuery("{$or: [{name: 'nhk'}, {name: 'clear'}]}");
    List<User> userList2 = mongoTemplate.find(query2, User.class);
    userList2.forEach(System.out::println);

    // 参数1：查询条件  参数2：返回的字段
    Query query3 = new BasicQuery("{$or: [{name: 'nhk'}, {name: 'clear'}]}", "{birthday: 0}");  // "{birthday: 0}" 表示返回值忽略该字段
    List<User> userList3 = mongoTemplate.find(query3, User.class);
    userList3.forEach(System.out::println);
}
```

### 5.3 更新文档

```java
/**
 * 更新文档
 */
@Test
public void testUpdateDocument() {
    // 设置更新条件
    Query query = Query.query(Criteria.where("name").is("clear"));
    // 设置更新内容
    Update update = new Update();
    update.set("salary", 19999D);

    // 单条更新：更新符合条件的第一条文档
    mongoTemplate.updateFirst(query, update, User.class);
    // 多条更新：更新符合条件的所有文档
    UpdateResult updateResult = mongoTemplate.updateMulti(query, update, User.class);
    // 更新插入：没有符合条件的文档时，插入文档
    mongoTemplate.upsert(query, update, User.class);

    // 返回值均为 updateResult
    System.out.println("本次匹配的文档数：" + updateResult.getMatchedCount());
    System.out.println("本次修改的文档数：" + updateResult.getModifiedCount());
    System.out.println("插入id_：" + updateResult.getUpsertedId());
}
```

### 5.4 删除文档

```java
/**
 * 删除文档
 */
@Test
public void testDeleteDocument() {
    // 删除所有文档
    mongoTemplate.remove(new Query(), User.class);

    // 条件删除
    // a.设置删除条件
    Query query = Query.query(Criteria.where("id").is(1));
    // b.删除
    DeleteResult deleteResult = mongoTemplate.remove(query, User.class);
    System.out.println(deleteResult.wasAcknowledged());
    System.out.println(deleteResult.getDeletedCount());
}
```

## 6 常用方法总结

常用方法

`mongoTemplate.findAll(User.class)`: 查询User文档的全部数据

`mongoTemplate.findById(<id>, User.class)`: 查询User文档id为id的数据

`mongoTemplate.find(query, User.class)`: 根据query内的查询条件查询

`mongoTemplate.upsert(query, update, User.class)`: 修改

`mongoTemplate.remove(query, User.class)`: 删除

`mongoTemplate.insert(User)`: 新增

**Query对象说明**

- 创建一个query对象（用来封装所有条件对象），再创建一个criteria对象（用来构建条件）

- 精准条件：criteria.and(“key”).is(“条件”)
- 模糊条件：criteria.and(“key”).regex(“条件”)

- 封装条件：query.addCriteria(criteria)

- 大于（创建新的criteria）：Criteria gt = Criteria.where(“key”).gt（“条件”）
- 小于（创建新的criteria）：Criteria lt = Criteria.where(“key”).lt（“条件”）

- Query.addCriteria(new Criteria().andOperator(gt,lt));

- 一个query中只能有一个andOperator()。其参数也可以是Criteria数组。

- 排序 ：query.with(new Sort(Sort.Direction.ASC, "age"). and(new Sort(Sort.Direction.DESC, "date")))
