# SpringBoot外部配置文件加载顺序？


SpringBoot外部配置文件的加载顺序，从高到低大致如下

## **1）命令行参数**

通过命令行传递的参数具有最高优先级，这些参数在应用启动时直接传递，可以覆盖其他配置文件中相同的配置项

```shell
java -jar app.jar --server.port=8081
```

## **2）Java 系统属性**`System.getProperties()`

可以通过`System.setProperty`方法设置，或者在启动JVM时通过`-D`参数指定

```shell
java -Dserver.port=8082 -jar app.jar
```

这些属性来自 System.getProperties()

## **3）操作系统环境变量**

在Unix/Linux系统中使用export，Windows中使用set命令设置。优先级低于Java系统属性

```sh
export SERVER_PORT=8083
```

## **4）外部配置文件（jar包外部）**

包括`application-{profile}.properties`或`application-{profile}.yml`（带有profile的）和`application.properties`或`application.yml`（不带profile的），这些文件从jar包外向jar包内寻找，带profile的配置文件优先于不带profile的。

## **5）外部配置文件（jar包内部）**

与jar包外部的配置文件类似，但优先级更低。

## 6）通过`@Configuration`注解类上的`@PropertySource`指定的配置文件：

这些配置文件的优先级低于上述所有外部配置方式。

```java
@Configuration
@PropertySource("classpath:custom.properties")
public class AppConfig { ... }
```

## **7）默认属性**

通过`SpringApplication.setDefaultProperties`指定的默认属性

```java
public static void main(String[] args) {
  SpringApplication app = new SpringApplication(MyApp.class);
  Properties defaults = new Properties();
  defaults.setProperty("server.port", "8080");
  app.setDefaultProperties(defaults);
  app.run(args);
}
```

这是Spring Boot提供的另一种设置默认属性的方式，优先级最低。
