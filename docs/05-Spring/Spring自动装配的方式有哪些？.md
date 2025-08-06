# Spring自动装配的方式有哪些？

>   在`AutowireCapableBeanFactory`接口中定义了一系列常量，用于定义自动装配的方式



spring中xml配置中有5种自动装配的方式：

-   1）no（默认）：不进行自动装配，需要显式地定义依赖。通过手动设置ref属性来进行装配bean。
    -   @Autowrited来进行手动指定需要自动装配注入的属性（更加人性化，先byType，后byName）

-   2）byName：通过bean名称进行自动装配
    -   注意：这里的名称是set方法的名称，去掉set前缀，然后按照小驼峰。例如setTask，名称就是task

-   3）byType：通过bean类型进行自动装配

-   4）constructor：通过构造器进行自动装配。构造器中参数通过byType进行装配

-   5）autodetect：自动探针，如果有构造器，通过constructor的方式进行自动装配，否则使用byType的方式进行自动装配（Spring3.0已被弃用）