# Bean标签的（常用）属性？

bean 是最长使用的标签，如果是使用 xml 形式。最常见的基本属性就是 id，name，class。分别标识唯一的 bean，bean 的别名和实际要注入的类。也可以通过一些属性实现，bean 初始化时候的操作，比如init-method，配置的方法，可以在 bean 初始化的时候，进行执行。bean 还有常见的构造函数注入标签，注入 bean 中的属性。

## id

Bean 的唯一标识符。

作用：用于引用该 Bean。

```xml
<bean id="myService" class="com.example.MyService"/>
```

## name

Bean 的名称（别名），可以有多个，用逗号、空格或分号分隔。

作用：类似于 id，但可以有多个名称。

```xml
<bean id="myService" name="service1, service2" class="com.example.MyService"/>
```

## class

Bean 所对应的类的全限定名。

作用：指定要实例化的类。

```xml
<bean id="myService" class="com.example.MyService"/>
```

## scope

定义 Bean 的作用域。

常见取值：

- singleton（默认）：单例模式，整个应用中只有一个实例。
- prototype：每次请求都会创建一个新的实例。
- request：每个 HTTP 请求创建一个新的实例（仅限 Web 应用）。
- session：每个 HTTP 会话创建一个新的实例（仅限 Web 应用）。
- application：每个 ServletContext 创建一个新的实例（仅限 Web 应用）。

```xml
<bean id="myService" class="com.example.MyService" scope="prototype"/>
```

## init-method

指定初始化方法，在 Bean 实例化后调用。

作用：用于执行一些初始化逻辑。

```xml
<bean id="myService" class="com.example.MyService" init-method="init"/>
```

## destroy-method

指定销毁方法，在容器关闭时调用。

作用：用于执行一些清理逻辑。

```xml
<bean id="myService" class="com.example.MyService" destroy-method="clearup"/>
```

## factory-bean 和 factory-method

factory-bean：指定用于创建Bean实例的工厂Bean的 ID。

factory-method：指定用于创建Bean实例的静态工厂方法

作用：用于通过工厂方法创建 Bean。

```xml
<bean id="myFactory" class="com.example.MyFactory"/>
<bean id="myService" factory-bean="myFactory" factory-method="createService"/>
```

## autowire

自动装配依赖关系的方式。

取值：

- no（默认）：不进行自动装配。
- byName：根据属性名称自动装配。
- byType：根据属性类型自动装配。
- constructor：通过构造函数参数类型自动装配。
- autodetect：先尝试通过构造函数自动装配，如果不行则按 byType 自动装配。

```xml
<bean id="myService" class="com.example.MyService" autowire="byType"/>
```

## depends-on

指定该 Bean 依赖的其他 Bean，确保这些 Bean 在当前 Bean 初始化之前被初始化。

作用：用于强制依赖顺序。

```xml
<bean id="myService" class="com.example.MyService" depends-on="dataSource"/>
```

## lazy-init

是否延迟初始化。

取值：

- true：延迟初始化，直到第一次使用时才创建实例。
- false（默认）：立即初始化。

```xml
<bean id="myService" class="com.example.MyService" lazy-init="true"/>
```

## primary

当自动装配时，如果有多个候选Bean，可以将某个Bean标记为主要候选者。

```xml
<bean id="myService" class="com.example.MyService" primary="true"/>
```

## bean标签子元素constructor-arg

用于通过构造函数注入依赖。

作用：指定构造函数的参数值，支持按索引、类型或名称注入。

常见属性：

- index：参数的索引位置（从 0 开始）。
- type：参数的类型。
- name：参数的名称（如果构造函数参数有名称）。
- value：直接赋值。
- ref：引用其他 Bean。

```xml
<bean id="myService" class="com.example.MyService">
    <constructor-arg index="0" value="someValue"/>
    <constructor-arg index="1" ref="myRepository"/>
</bean>
```

## bean标签子元素property

用于通过设值方法（Setter 方法）注入依赖。

作用：为 Bean 的属性赋值，支持直接赋值或引用其他 Bean。

常见属性：

- name：属性的名称。
- value：直接赋值。
- ref：引用其他 Bean。

```xml
<bean id="myService" class="com.example.MyService">
    <property name="repository" ref="myRepository"/>
    <property name="timeout" value="3000"/>
</bean>
```

## p命名空间

描述：简化属性注入的 XML 配置。

作用：使用 `p: `命名空间可以简化 `<property>` 元素的配置。

```xml
<bean id="myService" class="com.example.MyService" p:repository-ref="myRepository" p:timeout="3000"/>
```

## c命名空间

描述：简化构造函数注入的 XML 配置。

作用：使用 `c:` 命名空间可以简化 `<constructor-arg>` 元素的配置。

```xml
<bean id="myService" class="com.example.MyService" c:_0="someValue" c:_1-ref="myRepository"/>
```
