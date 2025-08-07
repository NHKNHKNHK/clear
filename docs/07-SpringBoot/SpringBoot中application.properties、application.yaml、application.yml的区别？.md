# SpringBoot中application.properties、application.yaml、application.yml的区别？


在 Spring Boot 中，`application.properties` 和 `application.yaml`（或 `application.yml`）都是用于配置应用程序属性的文件，但它们在语法和使用方式上有一些区别。

-   **application.properties**
    -   使用键值对的形式，每行一个配置项。
    -   格式简单，适合快速编写和阅读。但层级关系不明显
-   **application.yaml / application.yml**
    -   使用 YAML 格式，支持嵌套结构。
    -   更加直观地表达层级关系，适合复杂的配置场景。但是需要注意缩进



## **配置文件加载的优先级从高到低**：

-   **application.properties**（传统格式/默认格式）

例如：

```properties
server.port=80
```

-   **application.yml**（主流格式）

例如：

```yml
server:
  port: 80
```

-   **application.yaml**

例如：

```yaml
server:
  port: 80
```

说明：

​	不同配置文件中**相同的配置按照加载优先级相互覆盖，不同配置文件中不同配置完全保留**

## 扩展

**属性提示失效解决方案**

>   在IDEA中，在配置文件中编写属性时会智能提示，这是IDEA为我们做的，但是在yaml中编写属性是智能提示会失效，因为IDEA认为yaml不是配置文件 
>
>   解决思路： 让IDEA识别出 yaml 格式的文件是配置文件
>
>   解决方案： 点击File ==> Project Structure.. ==> Facets ==> 找到相应工程 ==> 点击SpringBoot的图标(一般是小绿叶) ==> 点击加号➕ ==> 在src/main/resources目录中将想要识别为配置文件的文件选择（这里是yaml） ==> 点击OK
>
>   新版IDEA不必这么麻烦，它直接会自动使用 yaml 格式的文件为配置文件


