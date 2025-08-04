# 如何避免ThreadLocal的内存泄漏？

为了避免 `ThreadLocal` 引发的内存泄漏，可以采取以下措施：

(1) **及时调用 remove() 方法**

-   在使用完 `ThreadLocal` 后，应显式调用 `remove()` 方法清除线程本地变量。

(2) **在 finally 块中清理**

-   将 `remove()` 放在 `finally` 块中，确保无论是否发生异常都能正确清理。

(3) **避免在长生命周期的线程（如：线程池）中滥用 ThreadLocal**

-   线程池中的线程是长期存活的，因此更需要注意 `ThreadLocal` 的清理。
-   如果必须使用 `ThreadLocal`，建议在任务执行完毕后立即清理。

(4) **自定义 ThreadLocalMap 清理逻辑**

-   如果需要更复杂的清理逻辑，可以继承 `ThreadLocal` 并重写其方法，例如 `initialValue()` 或 `childValue()`。

示例：

```java
public class ThreadLocalDemo {

    public static void main(String[] args) {
        MyData myData = new MyData();
        // 模拟一个银行有3个办理业务的窗口
        ExecutorService threadPool = Executors.newFixedThreadPool(3);
        try {
            // 模拟10个顾客来办理业务，正常情况应该 0 -> 1
            for (int i = 0; i < 10; i++) {
                int finalI = i;
                threadPool.execute(new Thread(() -> {
                    try {
                        Integer beforeInt = myData.threadLocalField.get();
                        myData.add();
                        Integer afterInt = myData.threadLocalField.get();
                        System.out.println(Thread.currentThread().getName() 
                                           + "\t工作窗口\t受理第" +
                                           finalI + "个顾客业务处理" +
                                		   "beforeInt:" + beforeInt +
                                           "\tafterInt:" + afterInt);
                    } finally {
                        myData.threadLocalField.remove(); // 显式清理threadlocal变量，避免内存泄露
                    }
                }));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            threadPool.shutdown();
        }
    }
}

class MyData {
    ThreadLocal<Integer> threadLocalField = ThreadLocal.withInitial(() -> 0);

    public void add() {
        threadLocalField.set(threadLocalField.get() + 1);
    }
}
```
