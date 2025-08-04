# 怎么理解wait、notify、notifyAll方法？

wait、notify、notifyAll是Java中用于**线程间通信**的重要方法，它们都定义在Object类中。这些方法主要用于协调多个线程对共享资源的访问，确保线程之间的正确同步，主要用于解决生产者与消费者问题，它们的搭配使用我们也成为**等待与唤醒机制**。

-   wait()：使当前线程进入等待状态，并释放当前对象的锁，直到其他线程调用该对象上的 notify() 或 notifyAll() 方法唤醒它。
-   notify()：唤醒一个正在等待该对象监视器的单个线程（如果有多个线程等待被唤醒，具体哪个线程由 JVM 决定）
-   notifyAll()：唤醒所有正在等待该对象监视器的线程。被唤醒的线程会重新竞争锁，但最终只有一个线程能够获取锁并继续执行。

这三个方法都必须在同步上下文中调用，即必须在 synchronized 块或方法中使用。否则，会抛出 IllegalMonitorStateException 异常。

>   在JUC中，也有一组类似的方法，Condition的signal（唤醒）、await

**注意事项**

-   **必须在同步上下文中调用**
    -   wait()、notify() 和 notifyAll() 必须在 synchronized 块或方法中调用，因为它们依赖于对象的监视器锁。如果不在同步上下文中调用，会导致 IllegalMonitorStateException。

```java
// 正确的用法
synchronized (obj) {
    obj.wait(); // 在同步块中调用
}

// 错误的用法
obj.wait(); // 不在同步块中调用，会抛出异常
```

-   **避免忙等**
    -   不要在循环外直接调用 wait()，而应该使用 while 循环来检查条件是否满足。这是因为当线程被唤醒时，条件可能仍然不满足，或者存在虚假唤醒的情况

```java
synchronized (obj) {
    while (!conditionMet()) {
        obj.wait(); // 使用 while 循环检查条件
    }
}
```

-   **虚假唤醒**
    -   Java 规范允许 wait() 方法在没有显式调用 notify() 或 notifyAll() 的情况下返回，这被称为“虚假唤醒”。因此，始终使用 while 循环来确保条件真正满足。

```java
synchronized (obj) {
    while (!conditionMet()) {
        obj.wait(); // 处理虚假唤醒
    }
}
```

-   **选择 notify() 还是 notifyAll()**
    -   notify()：只唤醒一个线程，适用于只需要唤醒一个线程的场景。由于 JVM 选择哪个线程不可预测，可能会导致某些线程永远无法被唤醒。
    -   notifyAll()：唤醒所有等待中的线程，适用于多个线程都在等待同一条件变化的场景。虽然性能稍差，但更安全，避免了某些线程永远无法被唤醒的问题。

生产者与消费者示例

```java
import java.util.LinkedList;
import java.util.Queue;

public class ProducerConsumerExample {

    private final Queue<Integer> queue = new LinkedList<>();
    private final int capacity = 5;

    public static void main(String[] args) {
        ProducerConsumerExample example = new ProducerConsumerExample();

        Thread producer = new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                example.produce(i);
            }
        });

        Thread consumer = new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                example.consume();
            }
        });

        producer.start();
        consumer.start();
    }

    public synchronized void produce(int value) {
        while (queue.size() == capacity) {
            try {
                System.out.println("Queue is full, producer is waiting...");
                wait(); // 当队列满时，生产者等待
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        queue.offer(value);
        System.out.println("Produced: " + value);
        notifyAll(); // 唤醒所有等待的消费者
    }

    public synchronized void consume() {
        while (queue.isEmpty()) {
            try {
                System.out.println("Queue is empty, consumer is waiting...");
                wait(); // 当队列空时，消费者等待
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        int value = queue.poll();
        System.out.println("Consumed: " + value);
        notifyAll(); // 唤醒所有等待的生产者
    }
}
```

produce() 方法：当队列满时，生产者调用 wait() 等待；当有空间时，调用 notifyAll() 唤醒所有等待的消费者。

consume() 方法：当队列空时，消费者调用 wait() 等待；当有数据时，调用 notifyAll() 唤醒所有等待的生产者。



