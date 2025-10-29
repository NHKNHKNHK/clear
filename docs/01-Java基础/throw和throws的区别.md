# throw和throws的区别

-   throws使用于方法声明（方法签名）处，指明将产生的异常向上一层抛出（抛给方法调用者）。
-   trhow使用于方法内部，后面紧跟着的是异常类对象，表示手动抛出指定的异常类对象。
    -   例如：`throw new Exception("输入的id非法");`
-   throws是用来处理异常对象的
-   throw是用来产生异常对象的
