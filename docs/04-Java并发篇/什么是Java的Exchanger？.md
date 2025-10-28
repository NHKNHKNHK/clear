# 什么是Java的Exchanger？


Exchanger是一个用于线程间协作的工具类，用于两个线程间能够交换。它提供了一个交换的同步点，在这个同步点两个线程能够交换数据。具体交换数据是通过exchange方法来实现的，如果一个线程先执行exchange方法，那么它会同步等待另一个线程也执行exchange方法，这个时候两个线程就都达到了同步点，两个线程就可以交换数据。

## 常用方法

Exchanger除了一个无参的构造方法外，主要方法如下：

```java
//当一个线程执行该方法的时候，会等待另一个线程也执行该方法，因此两个线程就都达到了同步点
//将数据交换给另一个线程，同时返回获取的数据
V exchange(V x) throws InterruptedException

//同上一个方法功能基本一样，只不过这个方法同步等待的时候，增加了超时时间
V exchange(V x, long timeout, TimeUnit unit)
    throws InterruptedException, TimeoutException 
```

## 演示

Exchanger理解起来很容易，这里用一个简单的例子来看下它的具体使用。我们来模拟这样一个情景，在青春洋溢的中学时代，下课期间，男生经常会给走廊里为自己喜欢的女孩子送情书，相信大家都做过这样的事情吧。男孩会先到女孩教室门口，然后等女孩出来，教室那里就是一个同步点，然后彼此交换信物，也就是彼此交换了数据。现在，就来模拟这个情景。

```java
public class ExchangerDemo {
    private static Exchanger<String> exchanger = new Exchanger();

    public static void main(String[] args) {

        //代表男生和女生
        ExecutorService service = Executors.newFixedThreadPool(2);

        service.execute(() -> {
            try {
                //男生对女生说的话
                String girl = exchanger.exchange("我其实暗恋你很久了......");
                System.out.println("女孩儿说：" + girl);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        service.execute(() -> {
            try {
                System.out.println("女生慢慢的从教室你走出来......");
                TimeUnit.SECONDS.sleep(3);
                //男生对女生说的话
                String boy = exchanger.exchange("我也很喜欢你......");
                System.out.println("男孩儿说：" + boy);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

    }
}
```

这个例子很简单，也很能说明Exchanger的基本使用。当两个线程都到达调用exchange方法的同步点的时候，两个线程就能交换彼此的数据。

输出结果：

```
女生慢慢的从教室你走出来......
男孩儿说：我其实暗恋你很久了......
女孩儿说：我也很喜欢你......
```

