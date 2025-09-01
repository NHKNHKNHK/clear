# Zookeeper如何实现分布式锁？


## 1.1 Zookeeper分布式锁原理

**核心思想**：当客户端要获取锁，则创建节点，使用完锁，则删除该节点。

当我们假设根节点/ 下有/locks节点时

1）客户端获取锁时，在locks节点下创建**临时顺序**节点。

2）然后获取lock下面的所有子节点，客户端获取到所有的子节点之后，如果**发现自己创建的子节点序号最小，那么就认为该客户端获取到了锁。**（即需要小的优先）使用完锁后，将删除该结点。

3）如果发现自己创建的节点并非locks所有子节点中最小的，说明自己还没获取到锁，此时客户端需要**找到比自己小的那个节点，同时对其注册事件监听器，监听删除事件。**

4）如果发现比自己小的那个节点被删除，则客户端的Watcher会收到相应通知，此时再次判断自己创建的节点是否是locks子节点中序号最小的，如果是则获取到了锁，如果不是则重复以上步骤继续获取到比自己小的一个节点并注册监听。

## 1.2 分布式锁案例分析

-   客户端获取到锁时创建临时顺序节点 create -e -s /locks/seq-
-   接收到请求后，在/locks节点下创建一个临时顺序节点
-   判断自己是不是当前节点下最小的节点，如果是，获取到锁；如果不是，对前一个节点进行监听
-   获取到锁，处理完业务以后，delete节点释放锁，然后下面的节点将会收到通知，重复上述判断

### 1.2.1 原生Zookeeper实现代码实现

```java
package com.clear.case2;

import org.apache.zookeeper.*;
import org.apache.zookeeper.data.Stat;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;

/**
 * 分布式锁案例
 */
public class DistributedLock {
    private final String connectString = "kk01:2181,kk02:2181,kk01:2181";
    private final int sessionTimeout = 2000;
    private final ZooKeeper zk;

    private CountDownLatch countDownLatch = new CountDownLatch(1);
    private CountDownLatch waitLatch = new CountDownLatch(1);

    private String waitPath;
    private String currentMode;

    public DistributedLock() throws IOException, InterruptedException, KeeperException {
        // 获取连接
        zk = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
            @Override
            public void process(WatchedEvent event) {
                //  countDownLatch 如果连接上zk，可以释放
                if (event.getState() == Event.KeeperState.SyncConnected) {
                    countDownLatch.countDown();
                }
                // waitLatch 可以释放
                if (event.getType() == Event.EventType.NodeDeleted && event.getPath().equals(waitPath)) {
                    waitLatch.countDown();
                }
                System.out.println("");
            }
        });

        // 等待zk正常连接后再执行后续程序
        countDownLatch.await();

        // 判断根节点/locks是否存在
        Stat stat = zk.exists("/locks", false);
        if (stat == null) {
            // 创建根节点(根节点为持久节点)
            zk.create("/locks", "locks".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
        }
    }

    // 对zk加锁
    public void zkLock() {
        // 创建对应的临时带序号的节点
        try {
            currentMode = zk.create("/locks/" + "seq-", null, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);
            // 判断创建的节点是否是根目录下最小节点，如果是获得锁；如果不是，监听它序号前一个节点
            List<String> children = zk.getChildren("/locks", false);
            // 如果children只有一个值，那就直接获取锁，如果有多个节点，那就需要判断谁最小
            if (children.size() == 1) {
                return;
            } else {
                Collections.sort(children);

                // 获取节点名称 seq-0000...
                String thisNode = currentMode.substring("/locks/".length());
                // 通过 seq-0000... 获取其在集合children 中的位置
                int index = children.indexOf(thisNode);

                // 判断
                if (index == -1) {
                    System.out.println("数据异常");
                } else if (index == 0) {
                    // 就一个节点，获取到了锁
                    return;
                } else {
                    // 监听它前一个节点
                    waitPath = "/locks/" + children.get(index - 1);
                    zk.getData(waitPath, true, null);

                    // 等待监听
                    waitLatch.await();

                    return;
                }

            }

        } catch (KeeperException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }


    }

    // 对zk解锁
    public void unZkLock() {
        // 删除节点
        try {
            zk.delete(currentMode, -1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (KeeperException e) {
            e.printStackTrace();
        }
    }
}
```

### 1.2.2 测试代码

```java
package com.clear.case2;

import org.apache.zookeeper.*;
import org.apache.zookeeper.data.Stat;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;

/**
 * 分布式锁案例
 */
public class DistributedLockTest {
    public static void main(String[] args) throws InterruptedException, IOException, KeeperException {
        final DistributedLock lock1 = new DistributedLock();
        final DistributedLock lock2 = new DistributedLock();

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    lock1.zkLock();
                    System.out.println("线程1 启动，获取到锁");
                    Thread.sleep(5000);
                    lock1.unZkLock();
                    System.out.println("线程1 释放锁");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    lock2.zkLock();
                    System.out.println("线程2 启动，获取到锁");
                    Thread.sleep(5000);
                    lock2.unZkLock();
                    System.out.println("线程2 释放锁");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
}
```

启动后，结果如下

```
线程1 启动，获取到锁
线程1 释放锁

线程2 启动，获取到锁
线程2 释放锁
```

两个线程不会同时得到锁，此致，分布式锁案例完成



### 1.2.3 Curator 框架实现分布式案例

1）原生的 Java API 开发存在的问题

-   会话连接是异步的，需要自己去处理，比如使用 CountDownLatch
-   Watch 需要重复注册，不然就不能生效
-   开发的复杂性还是比较高的
-   不支持多节点删除和创建。需要自己去递归



2）Curator是一个专门解决分布式锁的框架，解决了原生Java API 开发分布式遇到的问题

Cutator官方文档 https://curator.apache.org/index.html



1、导入依赖

```xml
<!-- curator-->
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-framework</artifactId>
            <version>4.0.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-recipes</artifactId>
            <version>4.0.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-client</artifactId>
            <version>4.0.0</version>
        </dependency>
```

2、代码实现

```java
package com.clear.case3;

import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.recipes.locks.InterProcessMutex;
import org.apache.curator.retry.ExponentialBackoffRetry;
import org.apache.log4j.Logger;

public class CuratorLockTest {
    private final static Logger logger = Logger.getLogger(CuratorLockTest.class);

    public static void main(String[] args) {
        // 创建分布式锁1
        InterProcessMutex lock1 = new InterProcessMutex(getCuratorFramework(), "/locks");

        // 创建分布式锁2
        InterProcessMutex lock2 = new InterProcessMutex(getCuratorFramework(), "/locks");

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    lock1.acquire();
                    System.out.println("线程1 获取到锁");
                    lock1.acquire();
                    System.out.println("线程1 再次获取到锁");

                    Thread.sleep(5000);
                    lock1.release();
                    System.out.println("线程1 释放锁");

                    lock1.release();
                    System.out.println("线程1 再次释放锁");

                } catch (Exception exception) {
                    exception.printStackTrace();
                }
            }
        }).start();

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    lock2.acquire();
                    System.out.println("线程2 获取到锁");
                    lock2.acquire();
                    System.out.println("线程2 再次获取到锁");

                    Thread.sleep(5000);
                    lock2.release();
                    System.out.println("线程2 释放锁");

                    lock2.release();
                    System.out.println("线程2 再次释放锁");

                } catch (Exception exception) {
                    exception.printStackTrace();
                }
            }
        }).start();
    }

    private static CuratorFramework getCuratorFramework() {
        CuratorFramework client = CuratorFrameworkFactory.builder()
                .connectString("kk01:2181,kk02:2181,kk03:2181")
                .connectionTimeoutMs(2000)
                .sessionTimeoutMs(2000)
                .retryPolicy(new ExponentialBackoffRetry(3000, 3))
                .build();

        // 启动客户端
        client.start();

        logger.info("zookeeper启动成功");
        return client;
    }
}
```

结果如下

```
线程2 获取到锁
线程2 再次获取到锁
线程2 释放锁
线程2 再次释放锁
线程1 获取到锁
线程1 再次获取到锁
```

