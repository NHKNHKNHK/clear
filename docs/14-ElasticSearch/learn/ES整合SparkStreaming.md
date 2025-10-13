# ElasticSearch整合SparkStreaming

## POM

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.spark</groupId>
        <artifactId>spark-core_2.12</artifactId>
        <version>3.2.0</version>
    </dependency>
    <dependency>
        <groupId>org.apache.spark</groupId>
        <artifactId>spark-streaming_2.12</artifactId>
        <version>3.2.0</version>
    </dependency>

    <dependency>
        <groupId>org.elasticsearch</groupId>
        <artifactId>elasticsearch</artifactId>
        <version>7.8.0</version>
    </dependency>
    <!-- elasticsearch 的客户端 -->
    <dependency>
        <groupId>org.elasticsearch.client</groupId>
        <artifactId>elasticsearch-rest-high-level-client</artifactId>
        <version>7.8.0</version>
    </dependency>
    <!-- elasticsearch 依赖 2.x 的 log4j -->
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-api</artifactId>
        <version>2.8.2</version>
    </dependency>
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-core</artifactId>
        <version>2.8.2</version>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.20</version>
    </dependency>

    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.9.9</version>
    </dependency>
    <!-- junit 单元测试 -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>
</dependencies>
```

## 代码示例

```scala
package com.clear.es

import org.apache.http.HttpHost
import org.apache.spark.SparkConf
import org.apache.spark.streaming.dstream.ReceiverInputDStream
import org.apache.spark.streaming.{Duration, StreamingContext}
import org.elasticsearch.action.index.{IndexRequest, IndexResponse}
import org.elasticsearch.client.{RequestOptions, RestClient, RestHighLevelClient}
import org.elasticsearch.common.xcontent.XContentType

/**
 * ES整合SparkStreaming
 */
object ES_Sparkstreaming {
  def main(args: Array[String]): Unit = {
    val sparkConf: SparkConf = new SparkConf()
      .setMaster("local[2]")
      .setAppName("ES整合SparkStreaming")
    val ssc = new StreamingContext(sparkConf, Duration(5))

    // 获取socket数据
    val ds: ReceiverInputDStream[String] = ssc.socketTextStream("localhost", 9999)
    ds.foreachRDD(
      rdd => {
        rdd.foreach(
          data => {
            val ss = data.split(" ")

            val esClient = new RestHighLevelClient(RestClient.builder(new HttpHost("localhost", 9200, "http")))

            val request: IndexRequest = new IndexRequest()
            request.index("product").id(ss(0))
            val json =
              s"""
                 |{ "data":"${ss(1)}"}
                 |""".stripMargin
            request.source(json, XContentType.JSON)
            esClient.index(request, RequestOptions.DEFAULT)
            
            // 获取响应
            val response : IndexResponse = esClient.index(request,RequestOptions.DEFAULT) 

          }
        )
      }
    )
    ssc.start()
    ssc.awaitTermination()
  }
}
```
