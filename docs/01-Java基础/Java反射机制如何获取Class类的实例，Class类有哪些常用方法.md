# Java反射机制如何获取Class类的实例，Class类有哪些常用方法？

**获取Class类的实例的四种方式**

-   类型名.class
-   Java对象.getClass()
-   Class.forName("类型全名称")
-   ClassLoader类加载对象.loadClass("类型全名称")

**方式 1：类型名.class**

​	**要求编译期间已知类型前提**：若已知具体的类，**通过类的 class 属性（静态属性）获取**，**该方法最为安全可靠，程序性能最高** 

```java
Class clazz = String.class; 	// 类调用静态属性
```

**方式 2：Java对象.getClass()**

```java
Class clazz = "hello".getClass(); // 对象.getClass()，因为在方法定义在Object在，任意内都可以使方法
```

 **方式 3：Class.forName("类型全名称")**

​	**可以获取编译期间未知的类型** 

**前提：已知一个类的全类名**，且该类在类路径下，可通过 Class 类的静态方法forName()获取，可能抛出 `ClassNotFoundException`

```java
Class clazz = Class.forName("java.lang.String"); // Class的静态方法，forName(String className) 推荐使用
```

**方式 4：ClassLoader类加载对象.loadClass("类型全名称")**

​	**使用类的加载器方式**（其实我们知道了类的全限名，完成可以使用第三种方式）

前提：可以**用系统类加载对象或自定义加载器对象加载指定路径下的类型** 

例如：

```java
ClassLoader cl = this.getClass().getClassLoader(); 
Class clazz4 = cl.loadClass("类的全类名")
```



**哪些类型可以有 Class 对象**

Class的实例都可以指向哪些结构呢？

简言之，所有 Java 类型！ 

（1）class：外部类，成员(成员内部类，静态内部类)，局部内部类，匿名内部类

（2）interface：接口 

（3）[]：数组 

（4）enum：枚举 

（5）annotation： 注解@interface

（6）primitive type：基本数据类型

（7）void



**Class类的常用方法**

（1）获取类信息

-   getName()  获取类的完全限定名
-    getSimpleName()  获取类的简单名称
-   getPackage()  获取类所在的包
-   isInterface()  判断该类是否是一个接口
-   isEnum()  判断该类是否是一个枚举
-   isAnnotation()  判断该类是否是一个注解  

（2）获取构造器

-   getConstructor(Class<?>... parameterTypes)  获取类的某个构造器：只能拿public修饰的某个构造器对象
-   getConstructors()  获取类的所有构造方法，只能获取public修饰的构造器  
-   getDeclaredConstructor(Class<?>... parameterTypes)  获取某个构造器：只要你敢写，就能拿到，无所谓权限是否可及（包括私有）
-   getDeclaredConstructors()  获取全部的构造器：只要你敢写，无所谓权限是否可及

-   setAccessible(boolean flag) 暴力反射(反射会破坏封装性)

（3）获取方法

-   getMethod(String name, Class<?>... parameterTypes)  获取类中的某个成员方法，只能获取public修饰的
-   getMethods()  获取类中的所有成员方法，只能获取public修饰的 
-    getDeclaredMethod(String name, Class<?>... parameterTypes)  获取类中某个成员方法
-   getDeclaredMethods()  获取类声明的所有方法

（4）获取字段

-   getField(String name)  获取类的某个成员变量，只能获取public修饰的
-   getFields() 获取类的所有成员变量，只能获取public修饰的
-   获取类的某个成员变量 getDeclaredField(String name)
-   getDeclaredFields()  获取类声明的所有字段

（5）创建实例

-   newInstance()  创建类的实例
    -   注意：要想对象创建成功，需满足以下条件
        -   1、要求运行时类中必须提供空参构造器
        -   2、要求提供的空参构造器的权限要足够，否则报错 IllegalAccessException
    -   从JDK9开始，此方法被标记为 `@Deprecated(since="9") `已过时   
    -   JDK9之后，我们会使用 Constructor 类的 newInstance方法 创建类的实例

-   Constructor\<T>.newInstance(Object... initargs)  使用指定的构造器创建一个实例

（6）获取父类和接口

-   getSuperclass()  获取类的父类
-   getInterfaces()  获取类实现的接口

（7）获取注解

-   getAnnotation(Class\<T> annotationClass)  获取该类上的指定注解
-   getAnnotations()  获取该类上的所有注解
-   getDeclaredAnnotation(Class\<T> annotationClass)  获取该类上的指定注解（包括私有）
-   getDeclaredAnnotations()  获取该类上的所有注解


