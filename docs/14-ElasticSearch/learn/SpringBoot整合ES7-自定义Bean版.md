# SpringBoot整合ES7

## ES RestFul 基础操作

### 创建/查询/删除索引

```shell
PUT http://192.168.188.150:9200/books

GET	http://192.168.188.150:9200/books

DELETE http://192.168.188.150:9200/books
```

### 创建索引并指定规则

```json
PUT http://192.168.188.150:9200/books

{
    "mappings":{
        "properties":{
            "id":{
                "type":"keyword"
            },
            "name":{
                "type":"keyword",
                "analyzer":"ik_max_word",
                "copy_to":"all"
            },
            "type":{
                "type":"keyword"
            },
            "description":{
                "type":"text",
                "analyzer":"ik_max_word",
                "copy_to":"all"
            },
            "all":{
                "type":"text",
                "analyzer":"ik_max_word"
            }
        }
    }
}
```

说明：

- **记得加上IK分词器**

### 创建文档

```shell
POST http://192.168.188.150:9200/books/_doc 	# 使用系统生成的id

POST http://192.168.188.150:9200/books/_create/1 # 使用指定ID

POST http://192.168.188.150:9200/books/_doc/1 # 使用指定id，不存在则创建，存在则更新（版本递增）
```

```json
{
	"name": "springboot",
    "type": "springboot",
    "description": "springboot"
}
```

### 查询文档

```shell
GET http://192.168.188.150:9200/books/_doc/1 # 查询单个文档
GET http://192.168.188.150:9200/books/_search # 查询全部文档
```

### 条件查询

```shell
GET http://192.168.188.150:9200/books/_search?q=name:springboot # 查询单个文档
```

### 删除文档

```shell
DELETE	http://192.168.188.150:9200/books/_doc/1 
```

### 修改文档

#### 全量修改

```shell
PUT http://192.168.188.150:9200/books/_doc/1 

{
	"name": "springboot",
    "type": "springboot2",
    "description": "springboot"
}
```

#### 局部修改

```shell
POST http://192.168.188.150:9200/books/_update/1 

{
	"doc":{
		"type": "springboot2"
	}
}
```

## SpringBoot整合ElasticSearch（自定义Bean版）

> ES客户端官网：https://www.elastic.co/guide/en/elasticsearch/client/index.html
> 
> https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.8/index.html

目前版本（7.x）的ES提供了两个版本的客户端
- Low level Client
- High level Client

### High level Client

- 1）导入相应starter

```xml
<properties>
    <java.version>1.8</java.version>
    <!--自定义ES版本依赖，保证和本地的ES保持一致-->
    <elasticsearch.version>7.8.0</elasticsearch.version>
</properties>


<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>


<!--<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
</dependency> -->
```

- 2）编写相关配置

略

- 3）自定义bean

```java
// Spring两步骤：
//  1.找到对象
//  2.放到spring中待使用
@Configuration
public class ElasticSearchClientConfig {
    // 类似于Spring  <beans id="restHighLevelClient" class="RestHighLevelClient">
    @Bean
    public RestHighLevelClient restHighLevelClient(){
        RestHighLevelClient client = new RestHighLevelClient(
                RestClient.builder(
                        new HttpHost("192.168.188.150", 9200, "http")));
        return client;
    }
}
```

- 4）编写相关代码

```java
@SpringBootTest
class SpringbootElasticsearchApplicationTests {
    
    @Autowired
    @Qualifier("restHighLevelClient")
    private RestHighLevelClient client; // 注意：在IDEA中一定要看到这一行有spring的小绿叶

}
```

#### 创建索引

```json
{
    "mappings":{
        "properties":{
            "id":{
                "type":"keyword"
            },
            "name":{
                "type":"keyword",
                "analyzer":"ik_max_word",
                "copy_to":"all"
            },
            "type":{
                "type":"keyword"
            },
            "description":{
                "type":"text",
                "analyzer":"ik_max_word",
                "copy_to":"all"
            },
            "all":{
                "type":"text",
                "analyzer":"ik_max_word"
            }
        }
    }
}
```

```java
// 创建索引
@Test
void testCreateIndex() throws IOException {
    // 1.创建索引请求
    CreateIndexRequest createIndexRequest = new CreateIndexRequest("books");
    // 2.客户端 IndicesClient 执行请求，请求后获得响应
    CreateIndexResponse createIndexResponse = client.indices()
        .create(createIndexRequest, RequestOptions.DEFAULT);
    boolean acknowledged = createIndexResponse.isAcknowledged();
    System.out.println(acknowledged);
}

// 创建索引
@Test
void testCreateIndexByIK() throws IOException {
    CreateIndexRequest createIndexRequest = new CreateIndexRequest("books");
    String json = "{\n" +
        "    \"mappings\":{\n" +
        "        \"properties\":{\n" +
        "            \"id\":{\n" +
        "                \"type\":\"keyword\"\n" +
        "            },\n" +
        "            \"name\":{\n" +
        "                \"type\":\"keyword\",\n" +
        "                \"analyzer\":\"ik_max_word\",\n" +
        "                \"copy_to\":\"all\"\n" +
        "            },\n" +
        "            \"type\":{\n" +
        "                \"type\":\"keyword\"\n" +
        "            },\n" +
        "            \"description\":{\n" +
        "                \"type\":\"text\",\n" +
        "                \"analyzer\":\"ik_max_word\",\n" +
        "                \"copy_to\":\"all\"\n" +
        "            },\n" +
        "            \"all\":{\n" +
        "                \"type\":\"text\",\n" +
        "                \"analyzer\":\"ik_max_word\"\n" +
        "            }\n" +
        "        }\n" +
        "    }\n" +
        "}";
    // 设置请求中的参数
    createIndexRequest.source(json, XContentType.JSON);
    CreateIndexResponse createIndexResponse = client.indices().create(createIndexRequest, RequestOptions.DEFAULT);
    
    boolean acknowledged = createIndexResponse.isAcknowledged();
    System.out.println(acknowledged);
}
```

#### 删除索引

```java
// 删除索引
@Test
void testDeleteIndex() throws IOException {
    // 1.创建索引请求
    DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("books");
    // 2.客户端 IndicesClient 执行请求，请求后获得响应
    AcknowledgedResponse delete = client.indices()
        .delete(deleteIndexRequest, RequestOptions.DEFAULT);
    boolean acknowledged = delete.isAcknowledged();
    System.out.println(acknowledged);
}
```

#### 新增文档

```java
// 添加文档
@Test
void testCreateDoc() throws IOException {
    // 从数据库中查询到对象
    Book book = bookDao.selectById(1);
    // 指定索引
    IndexRequest indexRequest = new IndexRequest("books");
    // 规则   POST http://192.168.188.150:9200/books/_doc/1
    indexRequest.id(book.getId() + "");
    indexRequest.timeout("3s");

    // 设置请求中的参数
    // 将我们的数据放入请求 json
    indexRequest.source(JSON.toJSONString(book), XContentType.JSON); // 注意:要使用fastjson的类必须实现getter\setter

    // 客户端发送请求，获取响应结果
    IndexResponse indexResponse = client.index(indexRequest, RequestOptions.DEFAULT);
    RestStatus status = indexResponse.status();
    System.out.println(status);  // CREATE
    System.out.println(status.getStatus());  // 状态码为201，表示资源创建成功
}


// 批量添加文档
@Test
void testCreateDocAll() throws IOException {
    // 从数据库中查询所有的对象
    List<Book> bookList = bookDao.selectList(null);

    BulkRequest bulkRequest = new BulkRequest();
    bulkRequest.timeout("10s");
    // todo 批处理请求
    bookList.forEach(
        // todo 批量更新、删除的操作只需要修改对应的请求即可
        book -> {
            IndexRequest indexRequest = new IndexRequest("books").id(book.getId() + "");
            // 设置请求中的参数
            String json = JSON.toJSONString(book);  // 注意:要使用fastjson的类必须实现getter\setter
            indexRequest.source(json, XContentType.JSON);
            bulkRequest.add(indexRequest);
        }
    );
    BulkResponse bulkResponse = client.bulk(bulkRequest, RequestOptions.DEFAULT);
    System.out.println(bulkResponse.status());  // 状态码为OK，表示资源创建成功
}
```

#### 查询文档

```java
// 查询文档:根据id查询
@Test
void testGet() throws IOException {
    //GetRequest getRequest = new GetRequest("books").id("1");
    GetRequest getRequest = new GetRequest("books", "1");
    GetResponse getResponse = client.get(getRequest, RequestOptions.DEFAULT);
    String json = getResponse.getSourceAsString();
    System.out.println(json);
}

// 查询文档:按条件查询
//      SearchRequest 搜索请求
//      QueryBuilders 查询条件构造工具类
//      SearchSourceBuilder 条件构造
//      HighlightBuilder 高亮构造
//      TermQueryBuilder 精确查询构造
//      MatchQueryBuilder 模糊查询构造
//     
@Test
void testSearch() throws IOException {
    SearchRequest searchRequest = new SearchRequest("books");
    // 构建搜索条件
    SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();

    // 设置查询条件，这里可以使用 QueryBuilders 工具类来实现
    // 例如：
    //      QueryBuilders.termQuery 精确
    //      QueryBuilders.matchAllQuery  匹配所有
    //      QueryBuilders.matchQuery  单字段查询
    //      QueryBuilders.multiMatchQuery  多字段查询
    //      QueryBuilders.geoDistanceQuery 地理查询
    //      QueryBuilders.functionScoreQuery  算分函数查询
    //      QueryBuilders.boolQuery  布尔查询
    //      QueryBuilders.rangeQuery  范围查询
    TermQueryBuilder termQueryBuilder = QueryBuilders.termQuery("name", "java");
    sourceBuilder.query(termQueryBuilder);
    sourceBuilder.timeout(new TimeValue(10, TimeUnit.SECONDS));

    searchRequest.source(sourceBuilder);

    SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
    SearchHits hits = searchResponse.getHits();  // 获取命中的数据
    hits.forEach(hit -> {   // 遍历命中的数据
        String source = hit.getSourceAsString();
        //System.out.println(source);
        // 将查询结果转化Book对象
        Book book = JSONObject.parseObject(source, Book.class);
        System.out.println(book);
    });
}
```

#### 更新文档

修改文档：修改分为全量修改、局部修改

##### 全量更新

全量更新的API与新增文档完全一致，关键在于：

- id存在时，则修改文档
- id不存在时，则新增文档

##### 局部更新

```java
// 修改文档:局部修改
@Test
void testUpdate() throws IOException {
    UpdateRequest updateRequest = new UpdateRequest();
    updateRequest.index("books").id("5");
    //updateRequest.doc( "name", "轻量级Java Web企业应用实战2",XContentType.JSON);
    updateRequest
        .doc(XContentType.JSON, "name", "轻量级Java Web企业应用实战2");

    UpdateResponse updateResponse = client.update(updateRequest, RequestOptions.DEFAULT);
    RestStatus status = updateResponse.status();
    System.out.println(status);     // OK,表示修改成功
}
```

#### 删除文档

```java
// 删除文档:按id删除
@Test
void testDelete() throws IOException {
    DeleteRequest deleteRequest = new DeleteRequest();
    deleteRequest.index("books").id("10");
    deleteRequest.timeout("2s");
    DeleteResponse deleteResponse = client.delete(deleteRequest, RequestOptions.DEFAULT);
    RestStatus status = deleteResponse.status();
    System.out.println(status); // OK,表示删除成功
}


// 删除文档:可以用于删库跑路
@Test
void testDeleteDocAll() throws IOException {
    BulkRequest bulkRequest = new BulkRequest();
    bulkRequest.add(new DeleteRequest().index("books").id("1"));
    bulkRequest.add(new DeleteRequest().index("books").id("2"));
    bulkRequest.add(new DeleteRequest().index("books").id("3"));

    BulkResponse bulkResponse = client.bulk(bulkRequest, RequestOptions.DEFAULT);
    RestStatus status = bulkResponse.status();
    System.out.println(status);  // OK,表示删除成功
}
```
