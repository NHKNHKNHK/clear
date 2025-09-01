# 服务器动态上下线监听案例

## 需求

在分布式系统中，主节点可以有多台，可以动态上下线，任意一台客户端都能实时感知到主节点服务器的上下线。

## 需求分析

客户端能实时洞察到服务器上下线的变化

基本流程：

​	1.服务端启动时去注册信息（创建的都是临时节点）

​	2.客户端获取到当前在线服务器列表，并注册监听

​	3.当服务器节点下线

​	4.服务器节点上下线的通知

​	5.process()重新再去获取服务器列表，并注册监听



## 具体实现

环境准备

在pom.xml添加相关依赖

```xml
 <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.8.2</version>
        </dependency>

        <dependency>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
            <version>3.6.1</version>
        </dependency>
    </dependencies>
```

1、启动zookeeper集群，在集群上创建/servers节点

```shell
[root@kk01 ~]# xzk.sh start  	# zk集群启动脚本

# 如果没有脚本，使用下面命令去集群的每台机器收到启动zkServer也可以
zkServer.sh start

# 进入zk客户端
[root@kk01 ~]# zkCli.sh -server

# 创建servers节点
[zk: localhost:2181(CONNECTED) 3] ls /
[zookeeper]
[zk: localhost:2181(CONNECTED) 4] create /servers "servers"
Created /servers

```

2.服务器端向zookeeper注册代码

```java
public class DistributeServer {
    private String connectString = "kk01:2181,kk02:2181,kk01:2181";
    private int sessionTimeout = 2000;
    private ZooKeeper zk;

    public static void main(String[] args) {
        DistributeServer server = new DistributeServer();
        try {
            // 1.获取zk连接
            server.getConnect();

            // 2.注册服务器到zk集群
            server.regist(args[0]);

            // 3.业务逻辑（因为是演示，所以睡眠即可）
            server.business();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (KeeperException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void business() throws InterruptedException {
        // 模拟业务逻辑
        Thread.sleep(Long.MAX_VALUE);
    }

    private void regist(String hostname) throws KeeperException, InterruptedException {
        zk.create("/servers/"+hostname, hostname.getBytes(),
                // CreateMode.EPHEMERAL_SEQUENTIAL 表示创建的是临时顺序节点
                ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);

        System.out.println(hostname + " is online");
    }

    private void getConnect() throws IOException {
        zk = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
            @Override
            public void process(WatchedEvent event) {

            }
        });
    }
}

```

3.客户端获取到当前在线服务器列表，并注册监听，代码如下

```java

public class DistributeClient {
    private String connectString = "kk01:2181,kk02:2181,kk01:2181";
    private int sessionTimeout = 2000;
    private ZooKeeper zk;

    public static void main(String[] args) {
        DistributeClient client = new DistributeClient();
        try {
            // 1.获取zk连接
            client.getConnect();

            // 2.监听 /server 下面子节点的增加和删除
            client.getServerList();
            // 3.业务逻辑（因为是演示，所以睡眠即可）
            client.business();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (KeeperException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void business() throws InterruptedException {
        // 模拟业务逻辑
        Thread.sleep(Long.MAX_VALUE);
    }

        private void getServerList() throws KeeperException, InterruptedException {
            List<String> children = zk.getChildren("/servers", true);

            List<String> servers = new ArrayList<>();

            for (String child : children) {
                byte[] data = zk.getData("/servers/" + child, false, null);
                servers.add(new String(data));
            }

            // 打印
            System.out.println(servers);

        }
    private void getConnect() throws IOException {
        zk = new ZooKeeper(connectString, sessionTimeout, new Watcher() {
            @Override
            public void process(WatchedEvent event) {
                try {
                    getServerList();
                } catch (KeeperException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
    }
}

```



## 测试

**1、在Linux上（zk客户端）命令行增加减少服务器**

1）启动 DistributeClient 客户端

即在idea上运行

2）在kk01上的zk客户端 /servers 目录下创建 **临时带序号节点**

```shell
[zk: localhost:2181(CONNECTED) 11] create -e -s /servers/hadoop100 "hadoop100"
Created /servers/hadoop1000000000000
[zk: localhost:2181(CONNECTED) 12] create -e -s /servers/hadoop101 "hadoop101"
Created /servers/hadoop1010000000001
[zk: localhost:2181(CONNECTED) 13] create -e -s /servers/hadoop103 "hadoop103"
Created /servers/hadoop1030000000002
[zk: localhost:2181(CONNECTED) 18] ls /servers
[hadoop1000000000000, hadoop1010000000001, hadoop1030000000002]

```

3）观察idea控制台变化

```
[]
[]
[hadoop100]
[hadoop101, hadoop100]
	[hadoop101, hadoop100, hadoop103]

```

4）执行删除操作，删除部分节点

```
[zk: localhost:2181(CONNECTED) 19] delete /servers/hadoop1030000000002
[zk: localhost:2181(CONNECTED) 20] ls /servers
[hadoop1000000000000, hadoop1010000000001]

```

5）再次观察idea控制台变化

```
[hadoop101, hadoop100]
```

2、在idea上操作增加减少服务器

1）启动 DistributeClient客户端（如果前面已经启动过了，则忽略此步骤）

2）启动DistributeServer服务

​	在args[]数组传入 hadoop103

3）观察idea控制台发现打印了如下信息

```
hadoop103 is online
```

4）在zkClient查询节点信息，如下

```shell
[zk: localhost:2181(CONNECTED) 33] ls /servers
[hadoop1000000000000, hadoop1010000000001, hadoop1030000000003]

```

