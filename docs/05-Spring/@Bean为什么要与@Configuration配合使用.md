# @Bean为什么要与@Configuration配合使用

`@Bean`注解，一般与`@Configuration`配合使用，`@Bean`注解用于定义bean，`@Configuration`注解用于定义配置类

核心原因是为了保证多次调用同一个`@Bean`方法时，能够返回同一个bean实例

更多细节可以看：[@Bean写在配置类与@Bean不写在配置类中的区别](./@Bean写在配置类与@Bean不写在配置类中的区别.md)