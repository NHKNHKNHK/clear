# Java反射机制可以访问父类的私有方法吗

可以，但是需要进行一个额外的操作来绕过Java的访问限制控制。步骤如下：

-   1、获取父类的 Class 对象
-   2、使用 getDeclaredMethod 方法获取私有方法
-   3、使用 setAccessible 方法解除访问限制（暴力反射）

-   4、使用 invoke 方法调用父类私有方法
