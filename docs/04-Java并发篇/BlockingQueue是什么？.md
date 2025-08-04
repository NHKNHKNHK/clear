# BlockingQueue是什么？

BlockingQueue是 Java 中定义在`java.util.concurrent`包下的一个接口，它扩展了`Queue`接口，并添加了阻塞操作。BlockingQueue提供了一种线程安全的机制，用于在多线程环境中处理生产者-消费者问题。

## **特点**

-   **线程安全**：所有方法都使用内部锁或其他同步机制来确保线程安全
-   **阻塞操作**：当队列为空时，从队列中取元素会被阻塞，直到有元素加入；当队列满时，往队列中添加元素会被阻塞，直到有空间可用。

## **常用方法**

-   `put(E e)`：将指定元素插入此队列中，如果该队列已满，则等待空间变得可用。
-   `take()`：从此队列中获取并移除头部元素，如果此队列为空，则等待元素变得可用。
-   `offer(E e, long timeout, TimeUnit unit)`：尝试在指定的等待时间内将指定元素插入此队列，如果超时则返回 `false`。
-   `poll(long timeout, TimeUnit unit)`：尝试在指定的等待时间内从此队列中获取并移除头部元素，如果超时则返回 `null`。

## 常见的BlockingQueue有实现方式

-   **ArrayBlockingQueue**：基于数组的有界阻塞队列。需要在初始化时指定队列大小，队列满时，生产者会被阻塞，队列空时，消费者会被阻塞

-   **LinkedBlockingQueue**：基于链表的阻塞队列，允许可选的界限（有界或无界）。无界模式下，可以不断添加元素，直到耗尽系统资源。有界模式下类似于ArrayBlockingQueue，但吞吐量通常较高

-   **PriorityBlockingQueue**：支持优先级排序的无界阻塞队列。元素按照自然排序或比较器顺序排序。与其他队列不同，此队列不保证元素的FIFO顺序

-   **DelayQueue**：支持延迟元素的无界阻塞队列。只有在延迟期满时才能从中提取元素的无界阻塞队列。常用于任务调度

-   **SynchronousQueue**：不存储元素的阻塞队列，每个插入操作必须等待一个对应的移除操作。反之亦然。常用于在线程直接的直接传递任务，而不是存储任务。

### 扩展

-   **LinkedTransferQueue**：基于链表的无界阻塞队列，支持传输操作（即元素入队时判断是否已有消费者在等待，如果有，直接将数据给消费者，这里没有锁操作）

## **使用场景**

-   ArrayBlockingQueue 和 LinkedBlockingQueue常用于典型的生产者-消费者场景。

-   PriorityBlockingQueue 更适用于处理带有优先级的任务场景，如任务调度系统
-   DelayQueue 使用于需要延迟处理的任务，例如：缓存失效处理、定时任务调度等
-   SynchronousQueue：适合在线程间直接传递数据，而不希望数据存储在队列中。例如：ThreadPoolExecutor的直接交付模式中使用SynchronousQueue来传递任务



## 使用BlockingQueue实现生产者-消费者模式

```java
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class BlockingQueueExample {
    public static void main(String[] args) {
        BlockingQueue<Integer> queue = new LinkedBlockingQueue<>(5);

        // 生产者线程
        Thread producer = new Thread(() -> {
            try {
                for (int i = 0; i < 10; i++) {
                    System.out.println("Producing: " + i);
                    queue.put(i); // 如果队列已满，阻塞
                    Thread.sleep(100); // 模拟生产时间
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        // 消费者线程
        Thread consumer = new Thread(() -> {
            try {
                for (int i = 0; i < 10; i++) {
                    Integer value = queue.take(); // 如果队列为空，阻塞
                    System.out.println("Consuming: " + value);
                    Thread.sleep(150); // 模拟消费时间
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        producer.start();
        consumer.start();
    }
}
```


## **主要方法**

BlockingQueue提供了一些常用的方法，这些方法分为四类：

**抛出异常**：

add(E e)：如果队列已满，抛出IllegalStateException。

remove()：如果队列为空，抛出NoSuchElementException。

element()：如果队列为空，抛出NoSuchElementException。

**返回特殊值**：

offer(E e)：如果队列已满，返回false。

poll()：如果队列为空，返回null。

peek()：如果队列为空，返回null。

**阻塞操作**：

put(E e)：如果队列已满，阻塞直到有空间可插入元素。

take()：如果队列为空，阻塞直到有元素可取。

**超时操作**：

offer(E e, long timeout, TimeUnit unit)：在指定的时间内插入元素，如果队列已满，等待直到超时或插入成功。

poll(long timeout, TimeUnit unit)：在指定的时间内取出元素，如果队列为空，等待直到超时或取出成功。

