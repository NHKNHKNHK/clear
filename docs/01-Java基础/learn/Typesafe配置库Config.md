# Typesafe配置库Config

对于一个完整的工程来说，如果所有的配置、通用代码等都指定到代码里，就会造成：
- 代码非常混乱
- 代码不易于管理，修改代码时可能会设计多个地方的修改
- 修改配置文件时，需要修改多个地方
- 数据库相关配置信息直接暴露在代码中，反编译即可看到，不安全

综上所述，需要一个配置文件工具类，来专门获取配置文件的内容。**Typesafe** 的`Config`库，纯Java写成、零外部依赖、代码精简、功能灵活、API友好。支持Java properties、JSON、JSON超集格式以及环境变量，它也是Akka的配置管理库。

**默认加载classpath下的** 

application.conf,application.json和application.properties文件，通过`ConfigFactory.load()`加载，也可指定文件地址

说明：

​	classpath在IDEA中表示的是编译后的项目的target/classes下面

**pom.xml**

```xml
<!-- 管理配置文件 -->
<dependency>
    <groupId>com.typesafe</groupId>
    <artifactId>config</artifactId>
    <version>1.2.1</version>
</dependency>
```

属性配置文件 resources/config.properties

```properties
# Spark相关配置
app.is.local=true
app.spark.master=local[4]
#spark.cores=local[*]

# mysql config
mysql.jdbc.driver=com.mysql.cj.jdbc.Driver
mysql.jdbc.url= jdbc:mysql://192.168.188.128:3306/?serverTimezone=UTC&characterEncoding=utf8&useUnicode=true
mysql.jdbc.username=root
mysql.jdbc.password=123456

# ES相关配置
# http主机列表（采用逗号分隔）
es.httpHosts=localhost:9200
# transport主机列表
es.transportHosts=localhost:9300
# 需要操作的索引
es.index=recommend
# 集群的名称，默认elasticsearch
es.cluster.name=elasticsearch

# Mongo相关配置
mongo.uri=mongodb://192.168.188.128:27017/recommend
mongo.db=recommend
```

演示代码

```java
package com.clear.common.config

import com.typesafe.config.{Config, ConfigFactory}

/**
 * 演示typesafe：加载应用Application属性配置文件config.properties获取属性值
 * 每个属性变量前使用lazy，当第一次使用变量时，才会进行初始化
 */
object ApplicationConfig {
  // 加载属性文件
  private val config: Config = ConfigFactory.load("config.properties")

  /**
   * 运行模式：开发测试为本地模式，测试生产通过--master传递
   */
  lazy val APP_LOCAL_MODE: Boolean = config.getBoolean("app.is.local")
  lazy val APP_SPARK_MASTER: String = config.getString("app.spark.master")


  /*
  * 数据库连接四要素信息
  */
  lazy val MYSQL_JDBC_DRIVER: String = config.getString("mysql.jdbc.driver")
  lazy val MYSQL_JDBC_URL: String = config.getString("mysql.jdbc.url")
  lazy val MYSQL_JDBC_USERNAME: String = config.getString("mysql.jdbc.username")
  lazy val MYSQL_JDBC_PASSWORD: String = config.getString("mysql.jdbc.password")

  /**
   * ES相关配置文件
   */
  lazy val ES_HTTPHOSTS: String = config.getString("es.httpHosts")
  lazy val ES_TRANSPORTHOSTS: String = config.getString("es.transportHosts")
  lazy val ES_INDEX: String = config.getString("es.index")
  lazy val ES_CLUSTER_NAME: String = config.getString("es.cluster.name")

  /**
   * MongoDB相关配置
   */
  lazy val MONGO_URI: String = config.getString("mongo.uri")
  lazy val MONGO_DB: String = config.getString("mongo.db")

}
```

