# SpringBoot整合ES-ElasticsearchRestTemplate

Spring Data ElasticSearch版本对比

| Spring Data Release | Spring Data Elasticsearch | Elasticsearch | Spring Boot |
| ------------------- | ------------------------- | ------------- | ----------- |
| Neumann             | 4.0.x                     | 7.6.2         | 2.3.x       |
| Moore               | 3.2.x                     | 6.8.6         | 2.2.x       |
| Lovelace            | 3.1.x                     | 6.2.2         | 2.1.x       |
| Kay                 | 3.0.x                     | 5.5.0         | 2.0.x       |
| lngalls             | 2.1.x                     | 2.4.0         | 1.5.x       |

> 目前最新SpringBoot对应Elasticsearch7.6.2，**SpringBoot 2.3.x 一般可以兼容Elasticsearch 7.x**

ES客户端官网：https://www.elastic.co/guide/en/elasticsearch/client/index.html

​							https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.8/index.html

## 1 整合步骤

### 1）导入相应starter

```xml
<properties>
    <java.version>1.8</java.version>
    <!--自定义ES版本依赖，保证和本地的ES版本保持一致-->
    <elasticsearch.version>7.8.0</elasticsearch.version>
</properties>


<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

### 2）编写相关配置

`application.yml`

```yaml title="application.yml"
# ES相关配置
elasticsearch:
  host: 192.168.188.150
  port: 9200

# 配置日志级别
logging:
  level:
    com:
      clear: debug
```

### 3）配置类

说明：

- `ElasticsearchRestTemplate`是Spring-data-elasticsearch项目中的一个类，和启用Spring项目中的template类似。
- 在新版的Spring-data-elasticsearch中，`ElasticsearchRestTemplate` 替代了原来的`ElasticsearchTemplate`。
- 原因是`ElasticsearchTemp` 基于 `TransportClient`， `TransportClient` 即将在 8.x 以后的版本中移除。所以我们非常推荐使用 `ElasticsearchRestTemplate。`
- `ElasticsearchRestTemplate` 是基于`RestHighLevelClient` 客户端的。需要**自定义配置类，继承`AbstractElasticsearchConfiguration`，并实现`elasticsearchClient()`抽象方法**，创建`RestHighLevelClient` 对象。

```java
package com.clear.config;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration;

@ConfigurationProperties(prefix = "elasticsearch")	
@Configuration
public class ElasticsearchConfig extends AbstractElasticsearchConfiguration {
    private String host;
    private Integer port;

    @Override
    public RestHighLevelClient elasticsearchClient() {
        RestHighLevelClient restHighLevelClient = new RestHighLevelClient(
                RestClient.builder(
                        new HttpHost(host, port)));
        return restHighLevelClient;
    }
}
```

### 4）Dao数据访问对象

```java
package com.clear.dao;

import com.clear.domain.Book;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookDao extends ElasticsearchRepository<Book, Long> {  // Long为id类型

}
```

### 5）编写相关代码

```java
@SpringBootTest
@Slf4j
class SpringbootElasticsearchApplicationTests {

    @Autowired
    private ElasticsearchRestTemplate elasticsearchRestTemplate;
}
```

## 创建索引

```java
// 创建索引
// PUT http://192.168.188.150:9200/books
@Test
void testCreateIndex() throws IOException {
    // todo 系统会自动读取实体类Book，我们在实体类中使用了注解 @Document(indexName = "books", shards = 3, replicas = 1)，如果索引不存在，则自动创建
    // 创建索引，系统初始化会自动创建索引
    log.info("创建索引");
}
```

## 删除索引

```java
// 删除索引
// DELETE http://192.168.188.150:9200/books
@Test
void testDeleteIndex() throws IOException {
    // boolean flg = elasticsearchRestTemplate.deleteIndex(Book.class);
    // todo 在新版中上面方法已被移除，可以使用indexOps(Book.class).delete() 代替
    boolean flg = elasticsearchRestTemplate.indexOps(Book.class).delete();
    log.info("删除索引，状态为 = {}", flg);
}
```

## 新增文档

```java
// 添加文档
@Test
void testCreateDoc() throws IOException {
    Book book = new Book();
    book.setId(7);
    book.setType("计算机理论");
    book.setName("深入理解Java虚拟机");
    book.setDescription("5个维度全面剖析JVM,面试知识点全覆盖");

    bookDao.save(book);	// 注意：这里使用的bookDao是有 @Repository 注解的BookDao的对象
}

// 批量添加文档
@Test
void testCreateDocAll() throws IOException {
    List<Book> bookList = new ArrayList<>();
    for (int i = 0; i < 10; i++) {
        Book book = new Book();
        book.setId(i);
        book.setType("计算机理论");
        book.setName("深入理解Java虚拟机");
        book.setDescription("5个维度全面剖析JVM,面试知识点全覆盖");

        bookList.add(book);
    }
    bookDao.saveAll(bookList);
}

```

## 查询文档

```java
// 查询文档:根据id查询
@Test
void testGet() throws IOException {
    Book book = bookDao.findById(7L).get();
    log.info("book ==> {}", book);
}

// 查询文档:查询全部
@Test
void testSearchAll() throws IOException {
    Book book = bookDao.findById(7L).get();
    log.info("book ==> {}", book);
}

// 查询文档:分页查询
@Test
void testSearchByPage() throws IOException {
    // 设置排序（排序方式，正序还是倒序，排序的id ）
    Sort sort = Sort.by(Sort.Direction.DESC, "id");
    int currentPage = 0;    // 当前页码  索引从0开始，表示第一页
    int pageSize = 5;  // 没有显示条数
    // 设置查询查询分页
    PageRequest pageRequest = PageRequest.of(currentPage, pageSize, sort);
    // 分页查询
    Page<Book> books = bookDao.findAll(pageRequest);
    books.forEach(System.out::println);

}
```

## 更新文档

修改文档：修改分为全量修改、局部修改

```java
// 修改文档
@Test
void testUpdate() throws IOException {
    Book book = new Book();
    book.setId(7);
    book.setType("计算机理论");
    book.setName("深入理解Java虚拟机2");
    book.setDescription("5个维度全面剖析JVM,面试知识点全覆盖");

    bookDao.save(book);
}
```

## 删除文档

```java
// 删除文档:按id删除
@Test
void testDelete() throws IOException {
    Book book = new Book();
    book.setId(1);

    bookDao.delete(book);
}
```
