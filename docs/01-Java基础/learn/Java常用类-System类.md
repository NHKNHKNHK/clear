# System 类

​	System 类代表系统，系统级的很多属性和控制方法都放置在该类的内部。该类位于 `java.lang` *包*。 

​	由于该类的构造器是 private 的，所以无法创建该类的对象。其内部的成员变量和成员方法都是 *static* *的*，所以也可以很方便的进行调用。 

**成员变量**

例如： Scanner scan = new Scanner(System.in);  

​	System 类内部包含 *in*、*out* 和 *err* 三个成员变量

```java
public final static InputStream in   // 标准输入流
public final static PrintStream out  // 标准输出流
public final static PrintStream err  // 标准错误输出流
```

**成员方法** 

```java
public static native long currentTimeMillis()  // 返回当前的计算机时间，时间的表达格式为当前计算机时间和 GMT 时间(格林威治时间)1970 年 1 月 1 号 0 时 0 分 0 秒所差的毫秒数
```

```java
public static native void arraycopy(Object src,  int  srcPos,
                                        Object dest, int destPos,
                                        int length)  // 拷贝数组(了解即可)，常用于数组的插入与删除
```

```java
public static void exit(int status)  // 退出程序。其中 status 的值为 0 代表正常退出，非零代表异常退出。使用该方法可以在图形界面编程中实现程序的退出功能等。 
```

```java
public static void gc()  // 请求系统进行垃圾回收。至于系统是否立刻回收，则取决于系统中垃圾回收算法的实现以及系统执行时的情况。
```

```java
public static String getProperty(String key)  // 获得系统中属性名为 key 的属性对应的值。系统中常见的属性名以及属性的作用如下表 
```

| 属性名       | 说明               |
| ------------ | ------------------ |
| java.version | java运行时环境版本 |
| java.home    | java安装目录       |
| os.name      | 操作系统的名称     |
| os.version   | 操作系统的版本     |
| user.name    | 用户的账户名称     |
| user.home    | 用户的主目录       |
| user.dir     | 用户当前的工作目录 |

注意

​	`System` 类中的方法和字段都是静态的，可以直接通过类名调用，无需创建对象。

```java
public class SystemDemo {
    @Test
    public void test() {
        // 慎用
        // System.exit(0);

        // currentTimeMillis 返回当前时间毫秒值
        long startTime = System.currentTimeMillis();
        System.out.println("开始时间：" + startTime);

        for (int i = 0; i < 1000; i++) {
            System.out.println("输出：" + i);
        }
        long endTime = System.currentTimeMillis();
        System.out.println("结束时间：" + endTime);

        System.out.println("总耗时" + (endTime - startTime) / 1000.0 + "s");
        System.out.println("结束");

        // 拷贝数组(了解即可)
        int[] arr1 = {10, 20, 30, 40, 50, 60};
        int[] arr2 = new int[6];  // [0,0,0,0,0,0] ==> [0,0,0,20,30,40]
        System.arraycopy(arr1, 1, arr2, 3, 3);
        System.out.println(Arrays.toString(arr2));  // [0, 0, 0, 20, 30, 40]
    }

    @Test
    public void test2() {
        String javaVersion = System.getProperty("java.version");
        System.out.println("java 的 version:" + javaVersion);  // java 的 version:1.8.0_131
        String javaHome = System.getProperty("java.home");
        System.out.println("java 的 home:" + javaHome);  // java 的 home:D:\sofeware\Java\jdk1.8.0_131\jre
        String osName = System.getProperty("os.name");
        System.out.println("os 的 name:" + osName);  // os 的 name:Windows 10
        String osVersion = System.getProperty("os.version");
        System.out.println("os 的 version:" + osVersion);  // os 的 version:10.0
        String userName = System.getProperty("user.name");
        System.out.println("user 的 name:" + userName);  // user 的 name:没事我很好
        String userHome = System.getProperty("user.home");
        System.out.println("user 的 home:" + userHome);  // user 的 home:C:\Users\没事我很好
        String userDir = System.getProperty("user.dir");
        System.out.println("user 的 dir:" + userDir);  // user 的 dir:C:\Users\没事我很好\IdeaProjects\test_1
    }

    @Test
    public void test3() throws InterruptedException {
        for (int i = 1; i <= 10; i++) {
            MyDemo my = new MyDemo(i);
            // 每一次循环 my 就会指向新的对象，那么上次的对象就没有变量引用它了，就成垃圾对象
        }
        // 为了看到垃圾回收器工作，我要加下面的代码，让 main 方法不那么快结束，因为 main 结束就会导致 JVM 退出，GC 也会跟着结束。
        System.gc();  // 如果不调用这句代码，GC 可能不工作，因为当前内存很充足，GC 就觉得不着急回收垃圾对象。
        // 调用这句代码，会让 GC 尽快来工作。
        Thread.sleep(5000);
    }
}

class MyDemo {
    private int value;

    public MyDemo(int value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "MyDemo{" + "value=" + value + '}';
    }

    //重写 finalize 方法，让大家看一下它的调用效果
    @Override
    protected void finalize() throws Throwable {
        // 正常重写，这里是编写清理系统内存的代码
        // 这里写输出语句是为了看到 finalize()方法被调用的效果
        System.out.println(this + "轻轻的我走了，不带走一段代码....");
    }
}
```

# Runtime 类 

​	在Java中，`Runtime` 类表示应用程序的运行时环境。它是一个**单例类**，通过静态方法 `Runtime.getRuntime()` 获取唯一的 `Runtime` 实例

每个 Java 应用程序都有一个 *Runtime* 类实例，使应用程序能够与其运行的环境相连接。 

`Runtime` 类提供了一些方法来与操作系统进行交互和执行系统级操作，例如：

```java
public static Runtime getRuntime()  //  返回与当前 Java 应用程序相关的运行时对象。应用程序不能创建自己的 Runtime 类实例。 
```



```java
public Process exec(String command)  // 执行指定的命令，并返回一个 `Process` 对象，可以用于与子进程进行交互
```

```java
public native int availableProcessors()  // 返回可用的处理器数量
```

```java
public native long totalMemory()  // 返回Java虚拟机的总内存量，此方法返回的值可能随时间的推移而变化，这取决于主机环境。默认为物理电脑内存的 1/64。 
```

```java
public native long maxMemory()  // 返回 Java 虚拟机中最大程度能使用的内存总量。 默认为物理电脑内存的 1/4。 
```

```java
public native long freeMemory()  // 回 Java 虚拟机中的空闲内存量。调用 gc 方法可能导致 freeMemory 返回值的增加。
```

```java
public native void gc()  // 运行垃圾回收器
```

```java
public void exit(int status)  // 终止当前正在运行的Java虚拟机
```

```java
/**
 * RunTime
 * 对应着java进程的内存使用的运行时环境，单例类
 */
public class RunTimeDemo {
    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        long initialMemory = runtime.totalMemory(); //获取虚拟机初始化时堆内存总量
        long maxMemory = runtime.maxMemory(); //获取虚拟机最大堆内存总量
        String str = "";
        //模拟占用内存
        for (int i = 0; i < 10000; i++) {
            str += i;
        }
        long freeMemory = runtime.freeMemory(); //获取空闲堆内存总量
        System.out.println("可用处理器数量： " +runtime.availableProcessors());
        System.out.println("总内存：" + initialMemory / 1024 / 1024 * 64 + "MB");
        System.out.println("总内存：" + maxMemory / 1024 / 1024 * 4 + "MB");
        System.out.println("空闲内存：" + freeMemory / 1024 / 1024 + "MB");
        System.out.println("已用内存：" + (initialMemory - freeMemory) / 1024 / 1024 + "MB");
    }
}
```

