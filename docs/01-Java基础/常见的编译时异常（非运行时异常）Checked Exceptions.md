# 常见的编译时异常（非运行时异常）Checked Exceptions？

编译时异常（受检异常）是指那些在**编译阶段**就必须处理的异常。编译器会强制要求程序员处理这些异常，否则代码无法通过编译。

调用者**必须通过 try-catch 块捕获异常或通过 throws 关键字声明**该方法可能抛出此异常。

常见类型：`IOException`、`SQLException`、`ClassNotFoundException` 、`FileNotFoundException`等。

`ParseException`

```java
public static void main(String[] args) throws ParseException {
    String data = " 2020-04-10 14:25:25";
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date d = simpleDateFormat.parse(data);  // 抛出编译时异常
    System.out.println(d);
}
```

`InterruptedException`

```java
@Test
public void test1() {
    try {
        Thread.sleep(1000);  // InterruptedException
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```

`ClassNotFoundException`

```java
@Test
public void test2() {
    try {
        Class.forName("java.lang.String");  // ClassNotFoundException
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    }
}
```

`FileNotFoundException`

```java
@Test
    public void test3() {
        try {
            // FileNotFoundException
            FileInputStream fis = new FileInputStream("hello.txt");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }
```

`SQLException`

```java
@Test
public void test4() {
    try {
        DriverManager.getConnection("...");  // SQLException
    } catch (SQLException throwables) {
        throwables.printStackTrace();
    }
}
```

`IOException`

```java
@Test
public void test5() {
    try {
        FileInputStream fis = new FileInputStream("hello.txt");  // FileNotFoundException
        fis.read();  // IOException
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```