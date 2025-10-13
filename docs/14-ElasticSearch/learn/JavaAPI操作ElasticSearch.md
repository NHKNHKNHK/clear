# Java API操作Elasticsearch

## ES 客户端说明

目前市面上有两类客户端。

-   一类是 `TransportClient` 为代表的 **ES 原生客户端**，不能执行原生 DSL 语句，必须使用它的 Java API 方法。 

-   **另外一种是以 Rest API 为主的 missing client**，最典型的就是 jest。 这种客户端可以直接使用 DSL 语句拼成的字符串，直接传给服务端，然后返回 json 字符串再解析。 

两种方式各有优劣，但是最近 elasticsearch 官网，宣布计划在 **7.0 以后的版本中废除 `TransportClient`**，以 RestClient 为主。

目前 RestClient 类型的 es 客户端有很多种，比如：

- `Jest`
- `High level Rest Client`
- `ElasticsearchRestTemplate`（Spring Data Elasticsearch）

下面是官网描述：

We plan on deprecating the TransportClient in Elasticsearch 7.0 and removing it completely in 8.0. Instead, you should be using the Java High Level REST Client, which executes HTTP requests rather than serialized Java requests. The migration guide describes all the steps needed to migrate.
The Java High Level REST Client currently has support for the more commonly used APIs, but there are a lot more that still need to be added. You can help us prioritise by telling us which missing APIs you need for your application by adding a comment to this issue: Java high-level REST client completeness.
Any missing APIs can always be implemented today by using the low level Java REST Client with JSON request and response bodies.

:::details 翻译

我们**计划在Elasticsearch 7.0中弃用TransportClient，并在8.0中完全删除它**。相反，您应该使用Java高级REST客户端，它执行HTTP请求而不是序列化的Java请求。迁移指南描述了迁移所需的所有步骤。

Java高级REST客户端目前支持更常用的api，但还有很多需要添加的。您可以通过在这个问题上添加注释来告诉我们您的应用程序需要哪些缺失的api，从而帮助我们确定优先级Java高级REST客户端完整性。

现在，任何缺失的api都可以通过使用带有JSON请求和响应主体的底层Java REST客户机来实现。

:::

## 开发准备

Elasticsearch 软件是由 Java 语言开发的，所以也可以通过 Java API 的方式对 Elasticsearch 服务进行访问

### 创建Maven项目

GAV

| GroupId   | artifactId         | version      |
| --------- | ------------------ | ------------ |
| com.clear | elasticsearch-demo | 1.0-SNAPSHOT |

POM

```xml
<dependencies>
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
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.9.9</version>
    </dependency>
    <!-- fastjson -->
    <!--
 <dependency>
   <groupId>com.alibaba</groupId>
   <artifactId>fastjson</artifactId>
   <version>1.2.62</version>
 </dependency>
 -->

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.20</version>
    </dependency>
    <!-- junit 单元测试 -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>
</dependencies>
```

## 客户端对象说明

代码中创建 Elasticsearch 客户端对象 因为早期版本的客户端对象已经不再推荐使用，且在未来版本中会被删除，所以这里我们采用高级 REST 客户端对象

```java
// TransportClient 旧的 ES客户端，已被弃用
// 下面使用 RestHighLevelClient
RestHighLevelClient esClient = new RestHighLevelClient(
    RestClient.builder(new HttpHost("localhost", 9200, "http"))
);

// 关闭ES客户端
try {
    if (esClient != null)
        esClient.close();
} catch (IOException e) {
    e.printStackTrace();
}
```

## 索引操作

ES 服务器正常启动后，可以通过 Java API 客户端对象对 ES 索引进行操作

### 创建索引

```java
package com.clear.es.index;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.CreateIndexResponse;

import java.io.IOException;

/**
 * 创建索引
 */
@Slf4j
public class CreateIndex {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );
        // todo 创建索引
        CreateIndexRequest request = new CreateIndexRequest("user");
        CreateIndexResponse createIndexResponse = null;
        try {
            // 发起请求
            createIndexResponse = esClient.indices().create(request, RequestOptions.DEFAULT);
            // 获取响应状态
            boolean acknowledged = createIndexResponse.isAcknowledged();
            if (acknowledged){
                log.info("索引创建成功");
            }
        } catch (IOException e) {
            log.info("索引创建失败 {}",e.getMessage());
            e.printStackTrace();
        }
        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 查询索引

```java
package com.clear.es;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.client.indices.GetIndexResponse;

import java.io.IOException;

/**
 * 查询索引
 */
public class SearchIndex {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );
        try {
            // todo 查询索引
            GetIndexRequest request = new GetIndexRequest("user");
            GetIndexResponse getIndexResponse = esClient.indices().get(request, RequestOptions.DEFAULT);
            // 响应状态
            System.out.println(getIndexResponse.getAliases());
            System.out.println(getIndexResponse.getMappings());
            System.out.println(getIndexResponse.getSettings());

        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 删除索引

```java
package com.clear.es;

import org.apache.http.HttpHost;
import org.elasticsearch.action.admin.indices.delete.DeleteIndexRequest;
import org.elasticsearch.action.support.master.AcknowledgedResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;


import java.io.IOException;

/**
 * 删除索引
 */
public class DeleteIndex {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 删除索引
        DeleteIndexRequest request = new DeleteIndexRequest("user");
        AcknowledgedResponse response = null;
        try {
            response = esClient.indices().delete(request, RequestOptions.DEFAULT);
            // 获取响应状态
            boolean acknowledged = response.isAcknowledged();
            if (acknowledged){
                System.out.println("索引删除成功");
            }
        } catch (IOException e) {
            System.out.println("索引删除失败");
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## 文档操作

### 新增文档

User类

```java
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String name;
    private int age;
    private String sex;
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpHost;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;

import java.io.IOException;

/**
 * 新增文档
 */
public class InsertDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );
        // todo 新增文档（数据）
        IndexRequest request = new IndexRequest();
        request.index("user").id("1001");

        User user = new User("zhangsan", 18, "男");
        // 要将数据插入到ES中，首先需要先将数据转为JSON
        try {
            ObjectMapper mapper = new ObjectMapper();
            String userJSON = mapper.writeValueAsString(user);
            request.source(userJSON, XContentType.JSON);

            IndexResponse response = esClient.index(request, RequestOptions.DEFAULT);

            // 响应
            System.out.println(response.getResult());
            System.out.println(request);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 修改文档

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;

import java.io.IOException;

/**
 * 修改文档：修改分为全量修改、局部修改
	全量更新的API与新增文档完全一致，关键在于：
		id存在时，则修改文档
		id不存在时，则新增文档
 * 下面演示局部修改
 */
public class UpdateDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );
     
        UpdateRequest request = new UpdateRequest();
        request.index("user").id("1001");
        request.doc(XContentType.JSON, "sex", "女");

        try {
            UpdateResponse response = esClient.update(request, RequestOptions.DEFAULT);
            System.out.println(response.getResult());
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 查询文档

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;

import java.io.IOException;

/**
 * 查询文档
 */
public class GetDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );
        // todo 查询文档
        GetRequest request = new GetRequest();
        request.index("user").id("1001");

        GetResponse response = null;
        try {
            response = esClient.get(request, RequestOptions.DEFAULT);
            System.out.println(response.getSourceAsString());
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 删除文档

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;

import java.io.IOException;

/**
 * 删除文档
 */
public class DeleteDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 删除文档（数据）
        DeleteRequest request = new DeleteRequest();
        request.index("user").id("1001");

        DeleteResponse response = null;
        try {
            response = esClient.delete(request, RequestOptions.DEFAULT);
            System.out.println(response.getResult());
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 批量新增文档

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;

import java.io.IOException;

/**
 * 
 * 批量新增文档：多条文档一起新增，提高效率
 */
public class InsertDocuments_Batch {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );
        // todo 批量新增文档（数据）
        BulkRequest request = new BulkRequest();
        request.add(new IndexRequest().index("user").id("1001").source(XContentType.JSON, "name", "zhangsan"));
        request.add(new IndexRequest().index("user").id("1002").source(XContentType.JSON, "name", "lisi"));
        request.add(new IndexRequest().index("user").id("1003").source(XContentType.JSON, "name", "wangwu"));

        BulkResponse response = null;
        try {
            response = esClient.bulk(request, RequestOptions.DEFAULT);
            System.out.println(response.getTook()); 
            System.out.println(response.getItems());
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 批量删除文档

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;

import java.io.IOException;

/**
 * 批量删除文档
 */
public class DeleteDocuments_Batch {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 批量删除文档（数据）
        BulkRequest request = new BulkRequest();
        request.add(new DeleteRequest().index("user").id("1001"));
        request.add(new DeleteRequest().index("user").id("1002"));
        request.add(new DeleteRequest().index("user").id("1003"));

        try {
            BulkResponse response = esClient.bulk(request, RequestOptions.DEFAULT);
            System.out.println(response.getTook());
            System.out.println(response.getItems());
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 高级查询

#### 全量查询

```java
/**
 * 全量查询
 */
public class QueryDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 全量查询
        SearchRequest request = new SearchRequest();
        request.indices("user");  // 针对哪一个索引进行查询
        // 构建查询对象
        request.source(new SearchSourceBuilder().query(QueryBuilders.matchAllQuery()));

        try {
            SearchResponse response = esClient.search(request, RequestOptions.DEFAULT);
            SearchHits hits = response.getHits();
            System.out.println(hits.getTotalHits());  // 获取查询结果条数
            System.out.println(response.getTook());
            // 遍历查询到的数据
            for (SearchHit hit : hits) {
                System.out.println(hit.getSourceAsString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 分页查询

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import java.io.IOException;

/**
 * 分页查询：分页查询需要明确查询页码、每页查询条数
 */
public class PagingQueryDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 分页查询
        SearchRequest request = new SearchRequest();
        request.indices("user");  // 针对哪一个索引进行查询
        // 构建查询对象
        SearchSourceBuilder query = new SearchSourceBuilder().query(QueryBuilders.matchAllQuery());
        // (当前页码-1)*每页条数
        query.from(0);  // 起始
        query.size(2);  // 每页条数
        request.source(query);

        try {
            SearchResponse response = esClient.search(request, RequestOptions.DEFAULT);
            SearchHits hits = response.getHits();
            System.out.println(hits.getTotalHits());  // 获取查询结果条数
            System.out.println(response.getTook());
            // 遍历查询到的数据
            for (SearchHit hit : hits) {
                System.out.println(hit.getSourceAsString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 排序查询

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;

import java.io.IOException;

/**
 * 排序查询
 */
public class SortQueryDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 排序查询
        SearchRequest request = new SearchRequest();
        request.indices("user");  // 针对哪一个索引进行查询
        // 构建查询对象
        SearchSourceBuilder query = new SearchSourceBuilder().query(QueryBuilders.matchAllQuery());
        query.sort("age", SortOrder.DESC);  // 将查询结果根据年龄进行倒序排序
        request.source(query);

        try {
            SearchResponse response = esClient.search(request, RequestOptions.DEFAULT);
            SearchHits hits = response.getHits();
            System.out.println(hits.getTotalHits());  // 获取查询结果条数
            System.out.println(response.getTook());
            // 遍历查询到的数据
            for (SearchHit hit : hits) {
                System.out.println(hit.getSourceAsString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 条件查询

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import java.io.IOException;

/**
 * 条件查询
 */
public class ConditionQueryDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 条件查询
        SearchRequest request = new SearchRequest();
        request.indices("user");  // 针对哪一个索引进行查询
        // 构建查询对象：查询 age = 30
        request.source(new SearchSourceBuilder().query(QueryBuilders.termQuery("age", 30)));

        try {
            SearchResponse response = esClient.search(request, RequestOptions.DEFAULT);
            SearchHits hits = response.getHits();
            System.out.println(hits.getTotalHits());  // 获取查询结果条数
            System.out.println(response.getTook());
            // 遍历查询到的数据
            for (SearchHit hit : hits) {
                System.out.println(hit.getSourceAsString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 字段查询

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import java.io.IOException;

/**
 * 字段查询
 */
public class FieldQueryDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 字段查询
        SearchRequest request = new SearchRequest();
        request.indices("user");  // 针对哪一个索引进行查询
        // 构建查询对象
        SearchSourceBuilder query = new SearchSourceBuilder().query(QueryBuilders.matchAllQuery());
        String[] includes = {};  // 包含字段
        String[] excludes = {"age"};  // 排除字段
        query.fetchSource(includes, excludes);
        request.source(query);

        try {
            SearchResponse response = esClient.search(request, RequestOptions.DEFAULT);
            SearchHits hits = response.getHits();
            System.out.println(hits.getTotalHits());  // 获取查询结果条数
            System.out.println(response.getTook());
            // 遍历查询到的数据
            for (SearchHit hit : hits) {
                System.out.println(hit.getSourceAsString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 组合查询

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import java.io.IOException;

/**
 * 组合查询：查询 age = 30 && sex = "男"
 */
public class CombinatorialQueryDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 组合查询
        SearchRequest request = new SearchRequest();
        request.indices("user");  // 针对哪一个索引进行查询
        // 构建查询对象
        SearchSourceBuilder query = new SearchSourceBuilder().query(QueryBuilders.matchAllQuery());
        BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
        boolQueryBuilder.must(QueryBuilders.matchQuery("age", 30));
        boolQueryBuilder.must(QueryBuilders.matchQuery("sex", "男"));
        query.query(boolQueryBuilder);

        request.source(query);
        try {
            SearchResponse response = esClient.search(request, RequestOptions.DEFAULT);
            SearchHits hits = response.getHits();
            System.out.println(hits.getTotalHits());  // 获取查询结果条数
            System.out.println(response.getTook());
            // 遍历查询到的数据
            for (SearchHit hit : hits) {
                System.out.println(hit.getSourceAsString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 范围查询

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import java.io.IOException;

/**
 * 范围查询：查询 age >= 20 && age <= 40
 */
public class RangeQueryDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 范围查询
        SearchRequest request = new SearchRequest();
        request.indices("user");  // 针对哪一个索引进行查询
        // 构建查询对象
        SearchSourceBuilder query = new SearchSourceBuilder().query(QueryBuilders.matchAllQuery());
        RangeQueryBuilder rangeQuery = QueryBuilders.rangeQuery("age");
        // todo get:>= lte:<= ge:> lt:<
        rangeQuery.gte(20);  // gte 表示 >=
        rangeQuery.lte(40);  // lte 表示 <=

        query.query(rangeQuery);
        request.source(query);
        try {
            SearchResponse response = esClient.search(request, RequestOptions.DEFAULT);
            SearchHits hits = response.getHits();
            System.out.println(hits.getTotalHits());  // 获取查询结果条数
            System.out.println(response.getTook());
            // 遍历查询到的数据
            for (SearchHit hit : hits) {
                System.out.println(hit.getSourceAsString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 模糊查询

```java
package com.clear.es.document;

import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import java.io.IOException;

/**
 * 模糊查询
 */
public class FuzzyQueryDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
            RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 模糊查询
        SearchRequest request = new SearchRequest();
        request.indices("user");  // 针对哪一个索引进行查询
        // 构建查询对象
        SearchSourceBuilder query = new SearchSourceBuilder().query(QueryBuilders.matchAllQuery());
        query.query(QueryBuilders
                    .fuzzyQuery("name", "wangwu")
                    .fuzziness(Fuzziness.ONE)   // Fuzziness.ONE 表示范围偏差：相差一个字符可以查询出来；此外还有 Fuzziness.TWO 等
                   );

        request.source(query);
        try {
            SearchResponse response = esClient.search(request, RequestOptions.DEFAULT);
            SearchHits hits = response.getHits();
            System.out.println(hits.getTotalHits());  // 获取查询结果条数
            System.out.println(response.getTook());
            // 遍历查询到的数据
            for (SearchHit hit : hits) {
                System.out.println(hit.getSourceAsString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

#### 高亮查询

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.TermsQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;

import java.io.IOException;

/**
 * 高亮查询：就是将查询的结果高亮显示
 */
public class HighlightQueryDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 高亮查询
        SearchRequest request = new SearchRequest();
        request.indices("user");  // 针对哪一个索引进行查询
        // 构建查询对象
        SearchSourceBuilder query = new SearchSourceBuilder().query(QueryBuilders.matchAllQuery());
        TermsQueryBuilder termsQueryBuilder = QueryBuilders.termsQuery("name", "wangwu");

        // 高亮
        HighlightBuilder highlightBuilder = new HighlightBuilder();
        highlightBuilder.preTags("<font color='red'>");
        highlightBuilder.postTags("</font>");
        highlightBuilder.field("name");
        query.highlighter(highlightBuilder);

        query.query(termsQueryBuilder);

        request.source(query);
        try {
            SearchResponse response = esClient.search(request, RequestOptions.DEFAULT);
            SearchHits hits = response.getHits();
            System.out.println(hits.getTotalHits());  // 获取查询结果条数
            System.out.println(response.getTook());
            // 遍历查询到的数据
            for (SearchHit hit : hits) {
                System.out.println(hit.getSourceAsString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

#### 聚合查询

##### 最大值查询

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import java.io.IOException;

/**
 * 最大值查询
 */
public class MaxQueryDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 最大值查询
        SearchRequest request = new SearchRequest();
        request.indices("user");  // 针对哪一个索引进行查询
        // 构建查询对象
        SearchSourceBuilder query = new SearchSourceBuilder();
        AggregationBuilder aggregationBuilder = AggregationBuilders.max("maxAge").field("age");
        query.aggregation(aggregationBuilder);

        request.source(query);
        try {
            SearchResponse response = esClient.search(request, RequestOptions.DEFAULT);
            SearchHits hits = response.getHits();
            System.out.println(hits.getTotalHits());  // 获取查询结果条数
            System.out.println(response.getTook());
            // 遍历查询到的数据
            for (SearchHit hit : hits) {
                System.out.println(hit.getSourceAsString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

##### 分组查询

```java
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import java.io.IOException;

/**
 * 分组查询
 */
public class GroupingQueryDocuments {
    public static void main(String[] args) {
        // TransportClient 旧的 ES客户端
        RestHighLevelClient esClient = new RestHighLevelClient(
                RestClient.builder(new HttpHost("localhost", 9200, "http"))
        );

        // todo 分组查询
        SearchRequest request = new SearchRequest();
        request.indices("user");  // 针对哪一个索引进行查询
        // 构建查询对象
        SearchSourceBuilder query = new SearchSourceBuilder();
        AggregationBuilder aggregationBuilder = AggregationBuilders.terms("ageGroup").field("age");
        query.aggregation(aggregationBuilder);

        request.source(query);
        try {
            SearchResponse response = esClient.search(request, RequestOptions.DEFAULT);
            SearchHits hits = response.getHits();
            System.out.println(hits.getTotalHits());  // 获取查询结果条数
            System.out.println(response.getTook());
            // 遍历查询到的数据
            for (SearchHit hit : hits) {
                System.out.println(hit.getSourceAsString());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 关闭ES客户端
        try {
            if (esClient != null)
                esClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
