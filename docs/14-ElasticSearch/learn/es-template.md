# Elasticsearch Template

ES 的 Template 主要分为两大类：索引模板（Index Template） 和搜索模板（Search Template）

- 索引模板：用于自动管理新索引的配置

- 搜索模板：用于复用查询逻辑

## 索引模板：自动配置新索引

:::tip
核心作用：在创建新索引时，ES 会根据模板的 “索引模式” 自动匹配，并将模板中的配置（分片、映射、别名等）应用到新索引，避免重复手动配置
:::

### 核心概念

- **索引模式（Index Pattern）**：指定模板匹配哪些索引，支持通配符（如`log-*`匹配所有以`log-`开头的索引）。
- **优先级（Priority）**：当多个模板匹配同一索引时，优先级高（数值大）的模板生效，相同优先级则后创建的覆盖先创建的。
- **组成部分**：
  - `settings`：索引的底层配置，如分片数（`number_of_shards`）、副本（`number_of_replicas`）。
  - `mappings`：字段的映射规则，如字段类型（`text`/`keyword`/`date`）、分词器、是否索引等。
  - `aliases`：自动为新索引添加的别名，方便后续查询

:::warning 注意
索引模板版本：ES 7.x 后推荐使用 Composable Index Template（即`_index_template`端点），替代旧版的`_template`（Legacy Index Template），功能更灵活

模板匹配规则：多个索引模板匹配同一索引时，优先级高的模板配置会覆盖优先级低的，相同优先级则 “后创建覆盖先创建”。
:::

### 适用场景

- 日志类索引（如log-2025-10）：按时间创建，需统一的分片和字段映射。
- 多业务索引：不同业务线的索引需各自固定的配置（如商品索引、用户索引）

### 实战

常用 DSL

| | |
| --- | --- |
| `PUT _template/template_name` | 创建或更新索引模板 |
| `GET _template/template_name` | 获取索引模板 |
| `DELETE _template/template_name` | 删除索引模板 |

#### 创建或更新索引模板

```json
# 创建登录日志索引模板：模板名=login-log-template，匹配所有login-log-*开头的索引
PUT http://192.168.188.150:9200/_template/login-log-template

{
  "order": 1,  # 模板优先级，与Java代码的indexTemplateRequest.order(1)对应
  "index_patterns": ["login-log-*"],  # 索引匹配模式，与Java的patterns("login-log-*")对应
  "settings": {  # 索引底层配置，完全对应Java中的Settings构建逻辑
    "number_of_shards": 1,  # 主分片数：测试环境1个（生产可调整为3-5）
    "number_of_replicas": 1  # 副本数：1个（保证高可用）
  },
  "mappings": {  # 字段映射，与Java中XContentBuilder定义的三个字段完全一致
    "properties": {
      "userId": {  # 用户ID字段
        "type": "keyword",  # 不分词，支持精确查询/聚合
        "doc_values": true  # 开启文档值，支持排序和聚合
      },
      "operateTime": {  # 操作时间字段
        "type": "date",  # 日期类型，支持时间范围查询
        "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"  # 支持的日期格式（字符串+时间戳）
      },
      "ip": {  # 登录IP字段
        "type": "ip"  # ES专用IP类型，支持IPv4/IPv6及网段查询（如192.168.1.0/24）
      }
    }
  }
}
```

响应：

```json
{
  "acknowledged": true  # 表示模板创建成功
}
```

DSL 查询已创建的模板，确认配置无误：

```json
GET http://192.168.188.150:9200/_template/login-log-template
```

##### Java代码示例

```java
// 创建或更新索引模板
// PUT http://192.168.188.150:9200/books
@Test
void testPutIndexTemplate() throws IOException {
    // 1.创建创建索引模板请求
    PutIndexTemplateRequest indexTemplateRequest = new PutIndexTemplateRequest("login-log-template");
    indexTemplateRequest.patterns(Arrays.asList("login-log-*"));
    indexTemplateRequest.order(1); // 模板优先级：多个模板匹配时，数值大的优先

    // 配置 settings：分片、副本（根据集群规模调整，测试环境1主1副足够）
    Settings settings = Settings.builder()
            .put("number_of_shards", 1) // 主分片数：测试环境1个，生产环境根据数据量设3-5个
            .put("number_of_replicas", 1) // 副本数：生产环境至少1个保证高可用
            .build();
    indexTemplateRequest.settings(settings);

    // 3. 配置 mappings：定义 userId、操作时间、ip 字段的类型和属性
    XContentBuilder mappings = JsonXContent.contentBuilder()
            .startObject()
            .startObject("properties")
            // userId：用户唯一标识，精确匹配（如查询某用户的所有登录日志）
            .startObject("userId")
            .field("type", "keyword") // keyword 类型：不分词，支持精确查询/聚合
            .field("doc_values", true) // 开启文档值：支持聚合和排序
            .endObject()
            // 操作时间：登录时间，需指定日期格式（支持字符串和时间戳）
            .startObject("operateTime")
            .field("type", "date") // date 类型：支持时间范围查询（如近24小时日志）
            .field("format", "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis") // 支持的日期格式
            .field("index", true) // 开启索引：允许通过时间查询
            .endObject()
            // ip：登录IP地址，用 ES 专用的 ip 类型（支持IP范围查询）
            .startObject("ip")
            .field("type", "ip") // ip 类型：支持 IPv4/IPv6，且可查某网段的日志（如 192.168.1.0/24）
            .field("index", true)
            .endObject()
            .endObject()
            .endObject();
    indexTemplateRequest.mapping(mappings);


    // 2.客户端 IndicesClient 执行请求，请求后获得响应
    AcknowledgedResponse acknowledgedResponse = client.indices()
            .putTemplate(indexTemplateRequest, RequestOptions.DEFAULT);
    if (acknowledgedResponse.isAcknowledged()) {
        System.out.println("创建索引模板成功");
    } else {
        System.out.println("创建索引模板失败");
    }
}
```

#### 查询索引模板

```json
GET http://192.168.188.150:9200/_template/login-log-template
```

##### Java代码示例

```java
@Test
void testGetIndexTemplate() throws IOException {
    // 1.创建查询索引模板请求
    GetIndexTemplatesRequest getIndexTemplatesRequest = new GetIndexTemplatesRequest("login-log-template");
    // 2.客户端 IndicesClient 执行请求，请求后获得响应
    GetIndexTemplatesResponse getIndexTemplatesResponse = client.indices()
            .getIndexTemplate(getIndexTemplatesRequest, RequestOptions.DEFAULT);
    // 3.处理响应
    // 3. 处理响应：提取模板列表（通常匹配1个，多个时需遍历）
    List<IndexTemplateMetadata> templateList = getIndexTemplatesResponse.getIndexTemplates();
    if (templateList.isEmpty()) {
        System.out.println("未查询到名为【login-log-template】的索引模板");
        return;
    }

    // 遍历模板（此处仅1个，遍历是为了兼容多模板场景）
    for (IndexTemplateMetadata template : templateList) {
        System.out.println("======================================= 索引模板详情 =======================================");

        System.out.println("1. 模板基础配置");
        System.out.println("   模板名：" + template.name());
        System.out.println("   匹配索引模式：" + template.patterns()); // 如 [login-log-*]
        System.out.println("   模板优先级（order）：" + template.order());
        System.out.println("   索引别名：" + template.aliases());

        System.out.println("\n2. 模板 settings 配置");
        // 提取关键 settings 字段
        System.out.println("   主分片数（number_of_shards）：" + template.settings().get("index.number_of_shards"));
        System.out.println("   副本数（number_of_replicas）：" + template.settings().get("index.number_of_replicas"));

        System.out.println("\n3. 模板 mappings 字段配置");
        // 获取 mappings 源数据（Map 结构，逐层解析）
        Map<String, Object> mappingsMap = template.mappings().getSourceAsMap();
        // 提取 properties（所有自定义字段都在这一层）
        Map<String, Object> propertiesMap = (Map<String, Object>) mappingsMap.get("properties");

        System.out.println("==========================================================================================");
    }
}
```

结果

```
======================================= 索引模板详情 =======================================
1. 模板基础配置
   模板名：login-log-template
   匹配索引模式：[login-log-*]
   模板优先级（order）：1
   索引别名：[]

2. 模板 settings 配置
   主分片数（number_of_shards）：1
   副本数（number_of_replicas）：1
   刷新间隔（refresh_interval）：null

3. 模板 mappings 字段配置
==========================================================================================
```

#### 删除索引模板

```json
DELETE http://192.168.188.150:9200/_template/login-log-template
```

##### Java代码示例

```java
@Test
void testDeleteIndexTemplate() throws IOException {
    // 1.创建删除索引模板请求
    DeleteIndexTemplateRequest deleteIndexTemplateRequest = new DeleteIndexTemplateRequest("login-log-template");
    // 2.客户端 IndicesClient 执行请求，请求后获得响应
    AcknowledgedResponse delete = client.indices()
            .deleteTemplate(deleteIndexTemplateRequest, RequestOptions.DEFAULT);
    if (delete.isAcknowledged()) {
        System.out.println("删除成功");
    } else {
        System.out.println("删除失败");
    }
}
```

### 创建索引时指定配置并匹配到template

```json
# 创建名为 "login-log-2025-10-15" 的索引（名称符合 login-log-* 模式，会自动匹配模板）
PUT http://192.168.188.150:9200/_template/login-log-2025-10-15

{
  "settings": {
    "number_of_replicas": 2 # 覆盖模板中的 number_of_replicas
  },
  # 会自动继承模板中的 userId、operateTime、ip 字段配
  "mappings": {
    "properties": {
      "expand": {
        "type": "text",
        "index": true
      }
    }
  }
}
```

创建的索引如下

```json
{
	"login-log-2025-10-15": {
		"aliases": {},
		"mappings": {
			"properties": {
				"expand": { // 新增字段
					"type": "text"
				},
        // 模板继承
				"ip": {
					"type": "ip"
				},
				"operateTime": {
					"type": "date",
					"format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
				},
				"userId": {
					"type": "keyword"
				}
			}
		},
		"settings": {
			"index": {
				"creation_date": "1760529266708",
				"number_of_shards": "1", // 模板继承
				"number_of_replicas": "2", // 覆盖模板
				"uuid": "df0EBxi9SdOtUO5f6wKt5Q",
				"version": {
					"created": "7080099"
				},
				"provided_name": "login-log-2025-10-15"
			}
		}
	}
}
```

- **模板匹配原理**：索引名称 `login-log-2025-10-15` 符合模板的 `index_patterns: ["login-log-*"]` 规则，创建时会自动应用模板中的

- **配置优先级**：若创建索引时的 settings 与模板冲突（如都定义了 number_of_replicas），模板配置不会被覆盖，除非在模板中设置 order 优先级更低
  - 建议：模板定义通用配置（如分片数、字段类型），创建索引时仅补充临时配置（如别名、临时副本数）。

## 搜索模板：复用查询逻辑

:::tip
核心作用：将重复使用的查询 DSL（如复杂的过滤、聚合逻辑）定义为模板，通过 “参数化” 动态传入变量，避免每次查询都写完整 DSL
:::

### 核心概念

- **参数化（Parameters）**：模板中用`{{param_name}}`定义变量，调用时传入具体值。
- **模板类型**：
  - 内联模板（Inline）：直接在查询请求中定义模板，适合临时复用。
  - 存储模板（Stored）：将模板保存到 ES 中，通过 ID 调用，适合全局复用
- **脚本语言**：默认使用mustache语法，支持条件判断、循环等简单逻辑。

:::warning 注意
安全性考虑：在模板中避免传入未验证的参数（如字段名），防止注入攻击；可通过 ES 的权限控制限制模板的创建 / 调用权限。
:::

### 适用场景

- 业务中固定的查询逻辑（如 “查询近 7 天某用户的订单”“按分类统计商品销量”）。
- 多系统共用同一查询逻辑，避免 DSL 不一致导致的问题。

### 实战

示例 1：存储式搜索模板（推荐）

```json
# 步骤1：创建存储模板（保存到ES，ID为 order_search_template）
PUT _scripts/order_search_template
{
  "script": {
    "lang": "mustache",  # 脚本语言
    "source": {
      "query": {
        "bool": {
          "filter": [
            { "term": { "user_id": "{{user_id}}" } },  # 参数1：用户ID
            { "range": { 
                "create_time": { 
                  "gte": "{{start_time}}",  # 参数2：开始时间
                  "lte": "{{end_time}}"    # 参数3：结束时间
                } 
              } 
            }
          ]
        }
      },
      "sort": [{"create_time": "desc"}]  # 固定排序：按创建时间倒序
    }
  }
}

# 步骤2：调用模板（传入具体参数）
POST orders/_search/template
{
  "id": "order_search_template",  # 模板ID
  "params": {
    "user_id": "12345",           # 传入用户ID
    "start_time": "2025-10-01",   # 传入开始时间
    "end_time": "2025-10-15"      # 传入结束时间
  }
}
```

示例 2：内联搜索模板（临时使用）

无需提前创建，直接在查询中定义模板：

```json
POST orders/_search/template
{
  "source": {
    "query": { "term": { "order_status": "{{status}}" } }
  },
  "params": { "status": "PAID" }  # 传入“已支付”状态
}
```

## 索引模板 vs 搜索模板

核心区别

| | 索引模板（Index Template）| 搜索模板（Search Template） |
|--- | --- | --- |
| 核心目标 | 自动配置新索引（settings/mappings） | 复用查询逻辑（DSL） |
| 作用对象 | 新创建的索引 | 搜索 / 聚合请求 |
| 触发时机 | 创建索引时自动触发 | 调用模板时手动触发 |
| 核心语法 | JSON 配置（settings/mappings/aliases） | Mustache 模板（参数化 DSL） |
