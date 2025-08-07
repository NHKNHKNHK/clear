# SpringBoot有哪些核心注解？

::: warning
误区：

@Autowired、@Configuration、@Bean、@Import.... 都是Spring 3.x提供的注解，而非SpringBoot提供的
:::

SpringBoot 的核心注解围绕**简化配置、自动装配、条件化加载**等特性设计，以下是与 SpringBoot 框架强关联的核心注解及其作用解析，结合用户提醒的误区，特别区分了 SpringBoot 原生注解与 Spring 原有注解：

**启动类与配置核心注解**

-   `@SpringBootApplication`核心作用：标记 SpringBoot 应用的入口类，是以下三个注解的组合：
    -   **@SpringBootConfiguration**：标识启动类为配置类，继承自 Spring 的 `@Configuration`，允许通过 `@Bean` 定义组件。
    -   **@EnableAutoConfiguration**：启用自动配置机制，根据依赖和配置自动加载符合条件的 Bean（通过 `spring.factories` 加载自动配置类）。
    -   **@ComponentScan**：扫描当前包及其子包下的组件（如 `@Service`、`@Controller`），纳入 Spring 容器管理。 **示例**：主类必须标注此注解以启动应用

**自动配置核心注解**

-   **@EnableAutoConfiguration** **核心机制**：

    -   通过 `AutoConfigurationImportSelector` 读取 `META-INF/spring.factories` 中的自动配置类列表（如 `DataSourceAutoConfiguration`）。

    -   结合条件注解（如 @ConditionalOnClass）按需加载配置，避免不必要的组件初始化。

    -   如果要**排除特定配置**，使用如下：

        -   ```java
            @SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
            ```

**条件化装配注解（@Conditional 系列）**

SpringBoot 的自动配置依赖于**条件注解**动态决定 Bean 的加载，关键子注解包括： 

-   **@ConditionalOnClass** 当类路径存在指定类时生效（如 `DataSource` 存在时自动配置数据库连接） 

-   **@ConditionalOnMissingBean**  当容器中不存在指定 Bean 时生效（允许用户自定义 Bean 覆盖默认配置） 

-   **@ConditionalOnProperty** 根据配置文件属性（如 spring.datasource.enabled=true）决定是否加载配置  

-   **@ConditionalOnWebApplication** 仅在 Web 应用环境中生效，区分传统应用与 Web 应用配置 
-   @ConditionalOnBean
-   @ConditionalOnResource
-   @ConditionalOnExpression
-   ...

**其他高频 SpringBoot 注解**

-   `@SpringBootTest` 用于测试类，启动完整的 Spring 上下文，支持集成测试环境

-   `@ConfigurationProperties` 将配置文件（如application.yml）中的属性绑定到 Java 对象，支持类型安全配置

-   **@RestController** 组合 `@Controller` 和 `@ResponseBody`，声明 RESTful 接口，直接返回 JSON 数据（非 SpringBoot提供） 

