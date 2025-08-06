# Mybatis中常见的设计模式有哪些？

## 1、工厂模式（Factory Pattern）

**应用场景**：创建复杂对象时使用。

-   **SqlSessionFactory**：MyBatis 使用SqlSessionFactory来创建SqlSession实例。SqlSessionFactory本身是由SqlSessionFactoryBuilder创建的。

-   **示例**：

    ```java
    String resource = "mybatis-config.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    ```

## 2、单例模式（Singleton Pattern）

**应用场景**：确保某个类只有一个实例，并提供一个全局访问点。

-   **Configuration**：MyBatis 的Configuration类使用了单例模式，确保在一个SqlSessionFactory中只有一个Configuration实例。

-   **示例**：

    ```java
    Configuration configuration = sqlSessionFactory.getConfiguration();
    ```


