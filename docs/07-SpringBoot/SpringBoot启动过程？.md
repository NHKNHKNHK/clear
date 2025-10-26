# SpringBoot启动过程？

1、引导类初始化：应用从main方法开始，调用SpringApplication.run()方法，创建一个SpringApplication实例

2、环境准备：SpringApplication通过prepareEnvironment()方法加载配置文件（如application.properties或application.yml），并创建Environment对象，设置系统变量和属性源

3、上下文创建：createApplicationContext()创建应用上下文（如）

4、启动监听器

5、Bean加载与注册

6、嵌入式服务启动

7、运行启动器与命名行运行器

8、启动完成


todo SpringBoot的启动流程是怎么样的？