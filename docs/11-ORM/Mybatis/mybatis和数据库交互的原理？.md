# mybatis和数据库交互的原理？

mybatis 和数据库交互主要分为几个阶段，第一步是 mybatis 会去加载配置文件，获取必要的基础的信息，然后创建出 sqlsessionfactory 工厂，工厂会帮助我们进行环境初始化，数据源加载等等。然后创建一个 sqlsession 对象，sqlsession 承担了与数据库交互的核心。每次执行数据库操作，可以从 sqlsession 里面获取到需要执行的 mapper。然后通过 mapper 开始执行 sql，获取数据。如果涉及事务也是 session 帮助我们来做事务提交或回滚的操作。

## **1、初始化阶段**

**加载全局配置文件 (mybatis-config.xml)**

使用Resources.getResourceAsStream方法读取 MyBatis 全局配置文件。

解析配置文件中的\<environments>、\<mappers>等节点，加载数据源、事务管理器和 Mapper 文件。

```java
String resource = "mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
```

## **2、创建SqlSessionFactory**

使用SqlSessionFactoryBuilder构建SqlSessionFactory对象。

SqlSessionFactory会根据配置文件初始化 MyBatis 环境，包括数据源、事务管理器和 Mapper 文件。

```java
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

## **3、获取 SqlSession**

**打开 SqlSession**

从SqlSessionFactory获取一个新的SqlSession实例。SqlSession是 MyBatis 与数据库交互的核心对象，负责执行 SQL 语句、获取 Mapper 接口实例、管理事务等。

```java
SqlSession session = sqlSessionFactory.openSession()
```

## **4、Mapper 接口操作**

**获取 Mapper 接口实例**

通过SqlSession获取 Mapper 接口的实现类实例。MyBatis 会在运行时生成 Mapper 接口的实现类，并通过SqlSession获取其实例。

```java
UserMapper mapper = session.getMapper(UserMapper.class);
```

## **5、执行SQL语句**

**调用Mapper方法**

调用 Mapper 接口的方法，例如mapper.selectUserById(1);

```java
User user = mapper.selectUserById(1);
```

**参数处理**

将方法参数转换为 SQL 语句中的占位符（如#{id}）所需的值。MyBatis 使用TypeHandler将 Java 类型转换为 JDBC 类型。

**执行 SQL 语句**

MyBatis 使用 JDBC 通过数据源执行 SQL 语句，数据库返回结果集。

**结果映射**

将 SQL 查询结果集映射为 Java 对象。根据映射文件或注解中的配置，将结果集中的数据映射到 Java 对象的属性中。

## **6、事务管理**

**提交事务**

如果执行的数据操作需要提交事务，调用session.commit();提交事务，提交事务会将所有未提交的更改保存到数据库。

```java
session.commit();
```

**回滚事务**

如果操作过程中发生异常，需要回滚事务，调用session.rollback();回滚事务，回滚事务会撤销所有未提交的更改

```java
session.rollback();
```

## **7、关闭资源**

**关闭 SqlSession** 

操作完成后，调用session.close();关闭SqlSession，释放数据库连接。

```java
session.close();
```

## 代码示例

```java
// 1. 加载配置文件并创建 SqlSessionFactory
String resource = "mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

// 2. 获取 SqlSession
try (SqlSession session = sqlSessionFactory.openSession()) {
    // 3. 获取 Mapper 接口实例
    UserMapper mapper = session.getMapper(UserMapper.class);

    // 4. 执行 SQL 语句
    User user = mapper.selectUserById(1);
    System.out.println(user);

    // 5. 提交事务（如果有数据修改操作）
    session.commit();
} catch (Exception e) {
    // 5. 回滚事务
    session.rollback();
    e.printStackTrace();
} finally {
    // 6. 关闭 SqlSession
    session.close();
}
```

  
