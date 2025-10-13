# RESTful API基本操作

## 0 RESTful & JSON

REST 指的是一组架构约束条件和原则。满足这些约束条件和原则的应用程序或设计就是 RESTful。 Web 应用程序最重要的 REST 原则是，客户端和服务器之间的交互在请求之间是无状态的。从客户端到服务器的每个请求都必须包含理解请求所必需的信息。如果服务器在请求之间的任何时间点重启，客户端不会得到通知。此外，无状态请求可以由任何可用服务器回答，这十分适合云计算之类的环境。客户端可以缓存数据以改进性能。

在服务器端，应用程序状态和功能可以分为各种资源。资源是一个有趣的概念实体，它向客户端公开。资源的例子有：应用程序对象、数据库记录、算法等等。每个资源都使用 URI(Universal Resource Identifier) 得到一个唯一的地址。所有资源都共享统一的接口，以便在客户端和服务器之间传输状态。使用的是标准的 HTTP 方法，比如 GET、 PUT、 POST 和DELETE。

在 REST 样式的 Web 服务中，每个资源都有一个地址。资源本身都是方法调用的目标，方法列表对所有资源都是一样的。这些方法都是标准方法，包括 HTTP GET、 POST、PUT、 DELETE，还可能包括 HEAD 和 OPTIONS。简单的理解就是，如果想要访问互联网上的资源，就必须向资源所在的服务器发出请求，请求体中必须包含资源的网络路径， 以及对资源进行的操作(增删改查)。

REST 样式的 Web 服务若有返回结果，大多数以JSON字符串形式返回。

## 1 ES数据格式

Elasticsearch 是**面向文档型数据库**，一条数据在这里就是一个文档。 

为了方便理解，我们将 Elasticsearch 里存储文档数据和关系型数据库 MySQL 存储数据的概念进行一个类比：

-   ElasticSearch ===> MySQL
-   Index(索引) ===> Database(数据库)
-   Type(类型) ===> Table(表)
-   Documents(文档) ===> Row(行)
-   Fields(字段) ===> Column(列)

![1701306503229](assets\ES数据格式.png)

ES 里的 Index 可以看做一个库，而 Types 相当于表， Documents 则相当于表的行。

:::tip
这里 Types 的概念已经被逐渐弱化， Elasticsearch 6.X 中，一个 index 下已经只能包含一个type， **Elasticsearch 7.X 中, Type 的概念已经被删除了。**
:::

## 2 倒排索引简单概念

**正排索引：**

例如：

```
​	id							content

​	1001				my name is zhang san

​	1002				my name is li si
```

**倒排索引：**

例如：

```
​	keyword				id

​	name					 1001, 1002

​	zhang					1001
```

## 3 索引操作

> Postman 官网：https://www.getpostman.com 
> 
> Postman 下载：https://www.getpostman.com/apps

### 3.1 创建索引 PUT

在ES中创建索引（index），对比关系型数据库，创建索引就等同于创建数据库

在 Postman 中，向 ES 服务器发 **PUT** 请求 ：`http://127.0.0.1:9200/shopping`

```
PUT http://127.0.0.1:9200/shopping
```

说明：
- `http://127.0.0.1:9200` 表示的是ES
- `shopping` 表示的是index的名称

请求后，服务器返回响应：

```json
{
    "acknowledged": true,	// 响应结果，true表示操作成功
    "shards_acknowledged": true,	// 分片结果，true表示分片操作成功
    "index": "shopping"	// 索引名称
}
```

服务器后台日志：

```
[2023-09-08T15:55:30,053][INFO ][o.e.c.m.MetadataCreateIndexService] [YOU] [shopping] creating index, cause [api], templates [], shards [1]/[1], mappings []
```

:::warning 注意
​如果重复发 PUT 请求： `http://127.0.0.1:9200/shopping` 添加索引，会返回错误信息 
:::

### 3.2 获取索引 GET

#### 3.2.1 查看单个索引

在 Postman 中，向 ES 服务器发 **GET** 请求 ：`http://127.0.0.1:9200/shopping`

```
GET	http://127.0.0.1:9200/shopping
```

返回结果如下：

```json
{
    "shopping": {	//索引名
        "aliases": {},	//别名
        "mappings": {},	//映射
        "settings": {	//设置
            "index": {	//设置 - 索引
                "creation_date": "1694159730034",	//设置 - 索引 - 创建时间	
                "number_of_shards": "1",	//设置 - 索引 - 主分片数量
                "number_of_replicas": "1",	//设置 - 索引 - 副本数量
                "uuid": "b16KI_pfTxq61Fq0cdZiPg",
                "version": {	//设置 - 索引 - 版本
                    "created": "7080099"
                },
                "provided_name": "shopping"	//设置 - 索引 - 名称
            }
        }
    }
}
```

#### 3.2.2 查看所有索引

在 Postman 中，向 ES 服务器发 **GET** 请求 ： `http://127.0.0.1:9200/_cat/indices?v`

```
GET	http://127.0.0.1:9200/_cat/indices?v
```

查看索引向 ES 服务器发送的请求路径和创建索引是一致的。但是 HTTP 方法不一致。这里可以体会一下 RESTful 的意义

说明：
- `_cat` 表示查看的意思
- `indices` 表示索引
- 所以整体含义就是查看当前 ES服务器中的所有索引，就好像 MySQL 中的 show tables 的感觉

服务器响应结果如下 :

```java
health status index    uuid    					pri rep docs.count docs.deleted store.size pri.store.size
yellow open   shopping b16KI_pfTxq61Fq0cdZiPg   1   1          0            0       208b           208b
```

说明：

-   `health`	当前服务器健康状态： green(集群完整) 、yellow(单点正常、集群不完整) 、red(单点不正常)
-   `status`	索引打开、关闭状态
-   `index`	索引名
-   `uuid`	索引统一编号
-   `pri`	主分片数量
-   `rep`	副本数量
-   `docs.count`	可用文档数量
-   `docs.deleted`	文档删除状态（逻辑删除）
-   `store.size`	主分片和副分片整体占空间大小
-   `pri.store.size`	主分片占空间大小
    

### 3.3 删除索引 DELETE

在 Postman 中，向 ES 服务器发 **DELETE** 请求 ： `http://127.0.0.1:9200/shopping`

```shell
DELETE http://127.0.0.1:9200/shopping
```

返回结果如下：

```json
{
    "acknowledged": true
}
```

## 4 文档操作

### 4.1 创建文档 POST & PUT

假设索引已经创建好了，接下来我们来创建文档，并添加数据。这里的**文档（Documents）可以类比为关系型数据库中的表数据**，添加的数据格式为 **JSON** 格式

:::warning 注意
​ES 7.x 中没有Type（类型）的概念，而是直接在 index 中添加 Documents
:::

在 Postman 中，向 ES 服务器发 **POST** 请求 ： `http://127.0.0.1:9200/shopping/_doc`

```json
POST http://127.0.0.1:9200/shopping/_doc
	
{
    "title":"小米手机",
    "category":"小米",
    "images":"http://www.gulixueyuan.com/xm.jpg",
    "price":3999.00
}
```

:::warning 注意
此处发送请求的方式必须为 POST，不能是 PUT，否则会发生错误
:::
 

返回结果：

```json
{
    "_index": "shopping",	//索引
    "_type": "_doc",	//类型-文档	
    "_id": "8vYEdIoBt6ApT_JW_v5k",	//唯一标识，可以类比为 MySQL 中的主键，随机生成
    "_version": 1,		//版本
    "result": "created",	//结果，这里的 create 表示创建成功
    "_shards": {
        "total": 2,	//分片 - 总数
        "successful": 1,	//分片 - 成功
        "failed": 0			//分片 - 失败
    },
    "_seq_no": 0,
    "_primary_term": 1
}
```

说明：

- **在没有指定数据唯一性标识（ID），默认情况下， ES 服务器会随机生成一个**

如果想要自定义唯一性标识，需要在创建时指定： `http://127.0.0.1:9200/shopping/_doc/1001`，请求体JSON内容为：

```json
PUT	http://127.0.0.1:9200/shopping/_doc/1001

{
    "title":"小米手机",
    "category":"小米",
    "images":"http://www.gulixueyuan.com/xm.jpg",
    "price":3999.00
}
```

:::warning 注意

如果增加数据时明确数据主键，那么请求方式也可以为 PUT。

:::


返回结果如下：

```json
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1001",
    "_version": 1,
    "result": "created",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 1,
    "_primary_term": 1
}
```

### 4.2 查询文档—主键查询 GET

**查看文档时，需要指明文档的唯一性标识**，类似于 MySQL 中数据的主键查询

在 Postman 中，向 ES 服务器发 **GET** 请求 ： `http://127.0.0.1:9200/shopping/_doc/1001`

```
GET	http://127.0.0.1:9200/shopping/_doc/1001
```

返回结果：

```json
{
    "_index": "shopping",	//索引
    "_type": "_doc",	//文档类型
    "_id": "1001",
    "_version": 9,
    "_seq_no": 9,
    "_primary_term": 1,
    "found": true,	//查询结果， true 表示查找到，false 表示未查找到
    "_source": {	//下面是文档源信息
        "title": "小米手机",
        "category": "小米",
        "images": "http://www.gulixueyuan.com/xm.jpg",
        "price": 3999.00
    }
}
```

查找不存在的内容，向 ES 服务器发 GET 请求 ： `http://127.0.0.1:9200/shopping/_doc/1002`

```
GET	http://127.0.0.1:9200/shopping/_doc/1002
```

返回结果：

```json
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1002",
    "found": false	// false 表示查询失败，查询不到结果
}
```

### 4.3 查询文档—全查询 GET

查看索引下所有数据，向 ES 服务器发 **GET** 请求 ： `http://127.0.0.1:9200/shopping/_search`

```
GET		 http://127.0.0.1:9200/shopping/_search
```

返回结果如下：

```json
{	
    "took": 63,		// 查询耗费的时间，以ms为单位
    "timed_out": false,	 // 是否超时
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 2,
            "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [	//命中，下面是查询到的数据
            {	
                "_index": "shopping",
                "_type": "_doc",
                "_id": "8vYEdIoBt6ApT_JW_v5k",
                "_score": 1.0,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1001",
                "_score": 1.0,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            }
        ]
    }
}
```

### 4.4 修改文档—全量修改 POST & PUT

全量修改（完全修改）和新增文档一样，输入相同的 URL 地址请求，**如果请求体变化，会将原有的数据内容覆盖**

注意：**全量修改时，POST 和 PUT 请求都可以**

在 Postman 中，向 ES 服务器发 **POST** 请求 ： `http://127.0.0.1:9200/shopping/_doc/1001`

```json
POST http://127.0.0.1:9200/shopping/_doc/1001

{
    "title":"华为手机",
    "category":"华为",
    "images":"http://www.gulixueyuan.com/hw.jpg",
    "price":1999.00
}
```

修改成功后，服务器响应结果：

```json
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1001",
    "_version": 10,			//版本
    "result": "updated",	//<-----------updated 表示数据被更新
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 10,
    "_primary_term": 1
}
```

### 4.5 修改文档—局部修改 POST

修改数据时，也可以只修改某一给条数据的局部信息

在 Postman 中，向 ES 服务器发 POST 请求 ： `http://127.0.0.1:9200/shopping/_update/1001`

```json
POST    http://127.0.0.1:9200/shopping/_update/1001

{
	"doc": {
		"title":"小米手机",
		"category":"小米"
	}
}
```

:::warning 注意
​局部修改的是时候，所使用的请求体也不同
:::

返回结果：

```json
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1001",
    "_version": 11,
    "result": "updated",	//<-----------updated 表示数据被更新
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 11,
    "_primary_term": 1
}
```

在 Postman 中，向 ES 服务器发 GET请求 ： `http://127.0.0.1:9200/shopping/_doc/1001`，查看修改内容

```
GET	http://127.0.0.1:9200/shopping/_doc/1001
```

返回结果：

```json
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1001",
    "_version": 11,
    "_seq_no": 11,
    "_primary_term": 1,
    "found": true,
    "_source": {
        "title": "小米手机",
        "category": "小米",
        "images": "http://www.gulixueyuan.com/hw.jpg",
        "price": 1999.0
    }
}
```

### 全量修改与局部修改的区别

-   全量修改为**全覆盖**某条文档中的所有属性的值
-   局部修改为只会修改某条文档中指定的属性的值


### 4.6 删除文档 DELETE

删除一个文档不会立即从磁盘上移除，它只是被标记成已删除（**逻辑删除**）。

在 Postman 中，向 ES 服务器发 DELETE 请求 ： `http://127.0.0.1:9200/shopping/_doc/1001`

```
DELETE http://127.0.0.1:9200/shopping/_doc/1001
```

返回结果：

```json
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1001",
    "_version": 12,	//版本，对数据的操作，都会更新版本
    "result": "deleted",	//<---deleted 表示数据被标记为删除（逻辑删除）
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 12,
    "_primary_term": 1
}
```

删除一个不存在的数据会返回 not_found  ，如下：

```json
{
    "_index": "shopping",
    "_type": "_doc",
    "_id": "1001",
    "_version": 13,
    "result": "not_found",	// not_found 表示未查找到，表示删除的数据不存在
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 13,
    "_primary_term": 1
}
```

### 4.7 条件删除文档

一般删除数据都是根据文档的唯一性标识进行删除，实际操作时，也可以**根据条件对多条数据进行删除**

1）首先分别增加多条数据

```json
POST http://127.0.0.1:9200/shopping/phone/1

{
    "title":"小米手机",
    "category":"小米",
    "images":"http://www.gulixueyuan.com/xm.jpg",
    "price":4000.00
}

POST http://127.0.0.1:9200/shopping/phone/1

{
    "title":"华为手机",
    "category":"华为",
    "images":"http://www.gulixueyuan.com/hw.jpg",
    "price":4000.00
}
```

2）向 ES 服务器发 **POST** 请求 ：`http://127.0.0.1:9200/shopping/_delete_by_query`

```json
POST  http://127.0.0.1:9200/shopping/_delete_by_query

{
    "query":{
        "match":{
            "price":4000.00
        }
    }
}
```

删除成功后，服务器响应结果：

```json
{
    "took": 175,	//耗时
    "timed_out": false,	//是否超时
    "total": 2,		//总数
    "deleted": 2,	//删除数量
    "batches": 1,
    "version_conflicts": 0,
    "noops": 0,
    "retries": {
    "bulk": 0,
    "search": 0
},
"throttled_millis": 0,
"requests_per_second": -1.0,
"throttled_until_millis": 0,
"failures": []
}
```



## 5 查询

Elasticsearch 提供了基于 JSON 提供完整的查询 DSL 来定义查询

### 映射关系

有了索引库，等于有了数据库中的 database。

接下来就需要建索引库(index)中的映射了，类似于数据库(database)中的表结构(table)。

创建数据库表需要设置字段名称，类型，长度，约束等；**索引库也一样，需要知道这个类型下有哪些字段，每个字段有哪些约束信息，这就叫做映射(mapping)。**

1）**先创建一个索引（不含映射关系）**：（PUT请求）

```
PUT	http://127.0.0.1:9200/user
```

返回结果：

```json
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "user"
}
```

#### **创建映射** PUT

映射关系说明：

-   字段名：任意填写，下面指定许多属性，例如：title、subtitle、images、price

-   `type`：类型，Elasticsearch 中支持的数据类型非常丰富，说几个关键的：

    -   `String` 类型，又分两种：

        `text`：可分词

        `keyword`：不可分词，数据会作为完整字段进行匹配

    -   `Numerical`：数值类型，分两类

        基本数据类型：`long`、`integer`、`short`、`byte`、`double`、`float`、`half_float`

        浮点数的高精度类型：`scaled_float`

    -   `Date`：日期类型 

    -   `Array`：数组类型 

    -   `Object`：对象

-   `index`：是否索引，默认为 true，也就是说你不进行任何配置，所有字段都会被索引。 
    -   true：字段会被索引，则可以用来进行搜索 
    -   false：字段不会被索引，不能用来搜索 

-   `store`：是否将数据进行独立存储，默认为 false 
    
    -   原始的文本会存储在`_source` 里面，默认情况下其他提取出来的字段都不是独立存储的，是从`_source` 里面提取出来的。当然你也可以独立的存储某个字段，只要设置 `"store": true` 即可，获取独立存储的字段要比从`_source` 中解析快得多，但是也会占用更多的空间，所以要根据实际业务需求来设置。 

-   `analyzer`：分词器，这里的 `ik_max_word` 即使用 ik 分词器

2）**修改映射：**

```json
PUT	http://127.0.0.1:9200/user/_mapping

{
    "properties": {
        "name":{
            "type": "text",
            "index": true	// 表示该字段可以索引查询
        },
        "sex":{
            "type": "keyword",	// 表示该字段不能分词，需要完整匹配
            "index": true
        },
        "tel":{
            "type": "keyword",
            "index": false	// 表示该字段不能被索引
        }
    }
}
```

返回结果如下：

```json
{
    "acknowledged": true
}
```

#### **查询映射** GET

3）查询映射：

```shell
GET		http://127.0.0.1:9200/user/_mapping
```

返回结果如下：

```json
{
    "user": {
        "mappings": {
            "properties": {
                "name": {
                    "type": "text"
                },
                "sex": {
                    "type": "keyword"
                },
                "tel": {
                    "type": "keyword",
                    "index": false
                }
            }
        }
    }
}
```

增加数据（发送PUT请求）

`http://127.0.0.1:9200/user/_create/1001`

JSON请求体如下：

```json
{
	"name":"小米",
	"sex":"男的",
	"tel":"1111"
}
```

返回结果如下：

```json
{
    "_index": "user",
    "_type": "_doc",
    "_id": "1001",
    "_version": 1,
    "result": "created",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "_seq_no": 0,
    "_primary_term": 1
}
```

查找name含有”小“数据（GET请求）

`http://127.0.0.1:9200/user/_search`

JSON请求体如下：

```json
{
    "query":{
        "match":{
            "name":"小"
        }
    }
}
```

返回结果如下：

```json
{
    "took": 434,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 0.2876821,
        "hits": [
            {
                "_index": "user",
                "_type": "_doc",
                "_id": "1001",
                "_score": 0.2876821,
                "_source": {
                    "name": "小米",
                    "sex": "男的",
                    "tel": "1111"
                }
            }
        ]
    }
}
```

查找sex含有”男“数据（GET请求）：

 `http://127.0.0.1:9200/user/_search`

JSON请求体如下：

```json
{
	"query":{
		"match":{	// 查询 keyword 类型的字段必须完全匹配才能查询到结果
			"sex":"男"
		}
	}
}
```

返回结果：

```json
{
    "took": 2,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 0,
            "relation": "eq"
        },
        "max_score": null,
        "hits": []
    }
}
```

结果分析：

​	找不想要的结果，只因创建映射时"sex"的类型为"keyword"。

​	"sex"只能完全为”男的“，才能得出原数据。

再次请求

 `http://127.0.0.1:9200/user/_search`

JSON请求体如下：

```json
{
	"query":{
		"match":{
			"sex":"男的"
		}
	}
}
```

返回结果：

```json
{
    "took": 2,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 0.2876821,
        "hits": [
            {
                "_index": "user",
                "_type": "_doc",
                "_id": "1001",
                "_score": 0.2876821,
                "_source": {
                    "name": "小米",
                    "sex": "男的",
                    "tel": "1111"
                }
            }
        ]
    }
}
```

查询电话（GET请求）

`http://127.0.0.1:9200/user/_search`

```json
{
	"query":{
		"match":{
			"tel":"11"
		}
	}
}
```

返回结果：

```json
{
    "error": {
        "root_cause": [
            {
                "type": "query_shard_exception",
                "reason": "failed to create query: Cannot search on field [tel] since it is not indexed.",
                "index_uuid": "Y78pfXRTTpOUEKW62cuPaQ",
                "index": "user"
            }
        ],
        "type": "search_phase_execution_exception",
        "reason": "all shards failed",
        "phase": "query",
        "grouped": true,
        "failed_shards": [
            {
                "shard": 0,
                "index": "user",
                "node": "oVyGByB_QHiui1Zk_gIOFA",
                "reason": {
                    "type": "query_shard_exception",
                    "reason": "failed to create query: Cannot search on field [tel] since it is not indexed.",
                    "index_uuid": "Y78pfXRTTpOUEKW62cuPaQ",
                    "index": "user",
                    "caused_by": {
                        "type": "illegal_argument_exception",
                        "reason": "Cannot search on field [tel] since it is not indexed."
                    }
                }
            }
        ]
    },
    "status": 400
}
```

结果分析：

​	报错只因创建映射时"tel"的"index"为false。

### 条件查询

假设有以下文档内容，（在 Postman 中，向 ES 服务器发 GET请求 ： `http://127.0.0.1:9200/shopping/_search`）：

```json
{
    "took": 698,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 3,
            "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "8vYEdIoBt6ApT_JW_v5k",
                "_score": 1.0,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1001",
                "_score": 1.0,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "9vYrdIoBt6ApT_JWH_6A",
                "_score": 1.0,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/hw.jpg",
                    "price": 1999.00
                }
            }
        ]
    }
}
```

#### URL带参查询 GET

**查找category为小米的文档**，在 Postman 中，向 ES 服务器发 GET请求 ： 

```
GET http://127.0.0.1:9200/shopping/_search?q=category:小米
```

返回结果如下：

```json
{
    "took": 45,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 2,
            "relation": "eq"
        },
        "max_score": 0.9400072,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "8vYEdIoBt6ApT_JW_v5k",
                "_score": 0.9400072,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1001",
                "_score": 0.9400072,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            }
        ]
    }
}
```

**URL带参数查询的劣势：**

-   1）参数值如果是中文，容易出现中文乱码问题
-   2）容易让不善者心怀恶意

为了避免这些情况，我们可用使用带JSON请求体（Body）请求进行查询

#### 请求体带参查询 GET

接下带JSON请求体，还是**查找category为小米的文档**，在 Postman 中，向 ES 服务器发 GET请求

```json
GET http://127.0.0.1:9200/shopping/_search

{
	"query":{
		"match":{
			"category":"小米"
		}
	}
}
```

查询结果如下：

```json
{
    "took": 3,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 2,
            "relation": "eq"
        },
        "max_score": 0.9400072,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "8vYEdIoBt6ApT_JW_v5k",
                "_score": 0.9400072,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1001",
                "_score": 0.9400072,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            }
        ]
    }
}
```

#### 带请求体方式的查找所有内容 GET

**查找所有文档内容**，也可以这样，在 Postman 中，向 ES 服务器发 GET请求：

```json
GET	http://127.0.0.1:9200/shopping/_search	

{
	"query":{
		"match_all":{}	// 全量查询
	}
}

// 说明：
	 "query"：这里的 query 代表一个查询对象，里面可以有不同的查询属性
	 "match_all"：查询类型，例如：match_all(代表查询所有)， match，term，range 等等
	 {查询条件}：查询条件会根据类型的不同，写法也有差异
```

返回结果：

```json
{
    "took": 3,	//查询花费时间，单位毫秒
    "timed_out": false,	//是否超时
    "_shards": {	//分片信息
        "total": 1,	//分片总数
        "successful": 1,	//成功
        "skipped": 0,	//忽略
        "failed": 0	//失败
    },
    "hits": {	//搜索命中结果
        "total": {	//搜索条件匹配的文档总数
            "value": 3,	//总命中计数的值
            "relation": "eq"	//计数规则，eq 表示计数准确， gte 表示计数不准确
        },
        "max_score": 1.0,	//匹配度分值
        "hits": [	//命中结果集合
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "8vYEdIoBt6ApT_JW_v5k",
                "_score": 1.0,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1001",
                "_score": 1.0,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "9vYrdIoBt6ApT_JWH_6A",
                "_score": 1.0,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/hw.jpg",
                    "price": 1999.00
                }
            }
        ]
    }
}
```

#### 查询指定字段 GET

**如果你想查询指定字段**，在 Postman 中，向 ES 服务器发 GET请求 ：

```json
GET http://127.0.0.1:9200/shopping/_search

{
	"query":{
		"match_all":{}
	},
	"_source":["title"]	// 只查询这里指定的字段
}
```

返回结果：

```json
{
    "took": 3,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 3,
            "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "8vYEdIoBt6ApT_JW_v5k",
                "_score": 1.0,
                "_source": {
                    "title": "小米手机"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1001",
                "_score": 1.0,
                "_source": {
                    "title": "小米手机"
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "9vYrdIoBt6ApT_JWH_6A",
                "_score": 1.0,
                "_source": {
                    "title": "华为手机"
                }
            }
        ]
    }
}
```

### 分页查询 GET

在 Postman 中，向 ES 服务器发 GET请求 ：

```json
GET http://127.0.0.1:9200/shopping/_search

{
	"query":{
		"match_all":{}
	},
	"from":0,	// 起始页码   计算公式 (页码-1)*每页数据条数
	"size":2	// 每页查询的条数
}
```

返回结果如下：

```json
{
    "took": 2,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 3,
            "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "8vYEdIoBt6ApT_JW_v5k",
                "_score": 1.0,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1001",
                "_score": 1.0,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            }
        ]
    }
}
```

### 查询排序 GET

如果你想通过排序查出价格最高的手机，在 Postman 中，向 ES 服务器发 GET请求 ：

```json
GET http://127.0.0.1:9200/shopping/_search

{
	"query":{
		"match_all":{}
	},
	"sort":{	
		"price":{	// 排序的字段，类似与MySQL中 order by price desc
			"order":"desc"
		}
	}
}
```

返回结果如下：

```json
{
    "took": 22,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 3,
            "relation": "eq"
        },
        "max_score": null,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "8vYEdIoBt6ApT_JW_v5k",
                "_score": null,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                },
                "sort": [
                    3999.0
                ]
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1001",
                "_score": null,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                },
                "sort": [
                    3999.0
                ]
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "9vYrdIoBt6ApT_JWH_6A",
                "_score": null,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/hw.jpg",
                    "price": 1999.00
                },
                "sort": [
                    1999.0
                ]
            }
        ]
    }
}
```

### 多条件查询 GET

#### must

假设想找出小米牌子，价格为3999元的。

在 Postman 中，向 ES 服务器发 GET请求 ：

:::tip
must相当于数据库的&&
:::

```json
GET http://127.0.0.1:9200/shopping/_search

{
	"query":{
		"bool":{
			"must":[{	// must 就是 &&
				"match":{
					"category":"小米"
				}
			},{
				"match":{
					"price":3999.00
				}
			}]
		}
	}
}
```

返回结果如下：

```json
{
    "took": 15,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 2,
            "relation": "eq"
        },
        "max_score": 1.9400072,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "8vYEdIoBt6ApT_JW_v5k",
                "_score": 1.9400072,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1001",
                "_score": 1.9400072,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            }
        ]
    }
}
```

#### should

假设想找出小米和华为的牌子。

在 Postman 中，向 ES 服务器发 GET请求 ：

:::tip
should相当于数据库的||
:::

```json
GET http://127.0.0.1:9200/shopping/_search

{
	"query":{
		"bool":{
			"should":[{	// should 就是 || 
				"match":{
					"category":"小米"
				}
			},{
				"match":{
					"category":"华为"
				}
			}]
		},
        "filter":{
            "range":{
                "price":{
                    "gt":2000
                }
            }
        }
	}
}
```

返回结果：

```json
{
    "error": {
        "root_cause": [
            {
                "type": "parsing_exception",
                "reason": "[bool] malformed query, expected [END_OBJECT] but found [FIELD_NAME]",
                "line": 14,
                "col": 9
            }
        ],
        "type": "parsing_exception",
        "reason": "[bool] malformed query, expected [END_OBJECT] but found [FIELD_NAME]",
        "line": 14,
        "col": 9
    },
    "status": 400
}
```

### 范围查询 GET

假设想找出小米和华为的牌子，价格大于2000元的手机。

在 Postman 中，向 ES 服务器发 GET请求 ：

```json
GET http://127.0.0.1:9200/shopping/_search

{
	"query":{
		"bool":{
			"should":[{
				"match":{
					"category":"小米"
				}
			},{
				"match":{
					"category":"华为"
				}
			}],
            "filter":{
            	"range":{
                	"price":{
                    	"gt":2000
                	}
	            }
    	    }
		}
	}
}
```

返回结果：

```json
{
    "took": 7,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 2,
            "relation": "eq"
        },
        "max_score": 0.9400072,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "8vYEdIoBt6ApT_JW_v5k",
                "_score": 0.9400072,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1001",
                "_score": 0.9400072,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            }
        ]
    }
}
```

### 全文检索 GET

这功能像搜索引擎那样，如品牌输入“小华”，返回结果带回品牌有“小米”和华为的。

在 Postman 中，向 ES 服务器发 GET请求 ： 

```json
GET http://127.0.0.1:9200/shopping/_search

{
	"query":{
		"match":{
			"category" : "小华"	// 底层会将文字拆解然后与文档进行匹配
		}
	}
}
```

返回结果：

返回结果分析：我们查询的是“小华”，但是结果中只要出现了 "小" 或 "华" 就会被查询出来。能查询到结果的原因主要是当保存文档(Documents)数据时ES会将数据文字进行分词拆解操作，并将结果放到倒排索引中，这样查询时，即使使用文字的一部分也能查询到数据，这就是**全文检索**。

```json
{
    "took": 1,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 3,
            "relation": "eq"
        },
        "max_score": 0.9808291,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "9vYrdIoBt6ApT_JWH_6A",
                "_score": 0.9808291,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/hw.jpg",
                    "price": 1999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "8vYEdIoBt6ApT_JW_v5k",
                "_score": 0.4700036,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1001",
                "_score": 0.4700036,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            }
        ]
    }
}
```

### 完全匹配 GET

在 Postman 中，向 ES 服务器发 GET请求 ：

```json
GET http://127.0.0.1:9200/shopping/_search

{
	"query":{
		"match_phrase":{
			"category" : "为"
		}
	}
}
```

返回结果：

```json
{
    "took": 1,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 0.9808291,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "9vYrdIoBt6ApT_JWH_6A",
                "_score": 0.9808291,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/hw.jpg",
                    "price": 1999.00
                }
            }
        ]
    }
}
```

### 高亮查询 GET

在 Postman 中，向 ES 服务器发 GET请求 ：

````json
GET http://127.0.0.1:9200/shopping/_search

{
	"query":{
		"match_phrase":{
			"category" : "为"
		}
	},
    "highlight":{
        "fields":{
            "category":{}//<----高亮这字段
        }
    }
}
````

返回结果：

```json
{
    "took": 63,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 0.9808291,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "9vYrdIoBt6ApT_JWH_6A",
                "_score": 0.9808291,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/hw.jpg",
                    "price": 1999.00
                },
                "highlight": {
                    "category": [
                        "华<em>为</em>"	//<------高亮一个为字。
                    ]
                }
            }
        ]
    }
}
```

 
### 聚合查询

聚合允许使用者对 es 文档进行统计分析，类似与关系型数据库中的 `group by`，当然还有很多其他的聚合，例如取最大值max、平均值avg等等。

接下来按price字段进行分组：

在 Postman 中，向 ES 服务器发 GET请求 ：

```json
GET http://127.0.0.1:9200/shopping/_search

{
	"aggs":{	//聚合操作
		"price_group":{	//名称，随意起名
			"terms":{	//分组 ，如果想求其他的话该这里就行，例如 平均值 avg
				"field":"price"	//分组字段
			}
		}
	}
}
```

返回结果：

```json
{
    "took": 32,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 3,
            "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "8vYEdIoBt6ApT_JW_v5k",
                "_score": 1.0,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "1001",
                "_score": 1.0,
                "_source": {
                    "title": "小米手机",
                    "category": "小米",
                    "images": "http://www.gulixueyuan.com/xm.jpg",
                    "price": 3999.00
                }
            },
            {
                "_index": "shopping",
                "_type": "_doc",
                "_id": "9vYrdIoBt6ApT_JWH_6A",
                "_score": 1.0,
                "_source": {
                    "title": "华为手机",
                    "category": "华为",
                    "images": "http://www.gulixueyuan.com/hw.jpg",
                    "price": 1999.00
                }
            }
        ]
    },
    "aggregations": {
        "price_group": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
                {
                    "key": 3999.0,
                    "doc_count": 2
                },
                {
                    "key": 1999.0,
                    "doc_count": 1
                }
            ]
        }
    }
}
```

上面返回结果会附带原始数据的。

若不想要不附带原始数据的结果，在 Postman 中，向 ES 服务器发 GET请求 ：

```json
GET http://127.0.0.1:9200/shopping/_search

{
	"aggs":{
		"price_group":{
			"terms":{
				"field":"price"
			}
		}
	},
    "size":0
}
```

返回结果如下：

```json
{
    "took": 9,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 3,
            "relation": "eq"
        },
        "max_score": null,
        "hits": []
    },
    "aggregations": {
        "price_group": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
                {
                    "key": 3999.0,
                    "doc_count": 2
                },
                {
                    "key": 1999.0,
                    "doc_count": 1
                }
            ]
        }
    }
}
```
