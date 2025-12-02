# MongoDB数据模型

-   **MongoDB的最小存储单位就是文档(document)对象**。文档(document)对象对应于关系型数据库的行。数据在MongoDB中以BSON（Binary-JSON）文档的格式存储在磁盘上。 
-   BSON（Binary Serialized Document Format）是一种类json的一种二进制形式的存储格式，简称Binary JSON。BSON和JSON一样，支持内嵌的文档对象和数组对象，但是BSON有JSON没有的一些数据类型，如Date和BinData类型。 
-   BSON采用了类似于 C 语言结构体的名称、对表示方法，支持内嵌的文档对象和数组对象，具有轻量性、可遍历性、高效性的三个特点，可以有效描述非结构化数据和结构化数据。这种格式的优点是灵活性高，但它的缺点是空间利用率不是很理想。 
-   Bson中，除了基本的JSON类型：string,integer,boolean,double,null,array和object，mongo还使用了特殊的数据类型。这些类型包括 date,object id,binary data,regular expression 和code。每一个驱动都以特定语言的方式实现了这些类型，查看你的驱动的文档来获取详细信息。 

BSON数据类型参考列表：

| 数据类型      | 描述                                                         | 举例                                                 |
| ------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| 字符串        | UTF-8字符串都可表示为字符串类型的数据                        | `{"x" : "foobar"}`                                   |
| 对象id        | 对象id是文档的12字节的唯一 ID                                | `{"X" :ObjectId() }`                                 |
| 布尔值        | 真或者假：true或者false                                      | `{"x":true}`                                         |
| 数组          | 值的集合或者列表可以表示成数组                               | `{"x" ： ["a", "b", "c"]}`                           |
| 32位整数      | 类型**不可用**。JavaScript仅支持64位浮点数，所以32位整数会被自动转换。 | shell是不支持该类型的，shell中默认会转换成64位浮点数 |
| 64位整数      | **不支持**这个类型。shell会使用一个特殊的内嵌文档来显示64位整数 | shell是不支持该类型的，shell中默认会转换成64位浮点数 |
| 64位浮点数    | shell中的数字就是这一种类型                                  | `{"x"：3.14159，"y"：3}`                             |
| null          | 表示空值或者未定义的对象                                     | `{"x":null}`                                         |
| undefined     | 文档中也可以使用未定义类型                                   | `{"x":undefined}`                                    |
| 符号          | shell**不支持**，shell会将数据库中的符号类型的数据自动转换成字符串 |                                                      |
| 正则表达式    | 文档中可以包含正则表达式，采用JavaScript的正则表达式语法     | `{"x" ： /foobar/i}`                                 |
| 代码          | 文档中还可以包含JavaScript代码                               | `{"x" ： function() { /* …… */ }}`                   |
| 二进制数据    | 二进制数据可以由任意字节的串组成，不过shell中无法使用        |                                                      |
| 最大值/最小值 | BSON包括一个特殊类型，表示可能的最大值。shell中没有这个类型。 |                                                      |



Shell默认使用64位浮点型数值。对于整型值，可以使用：

- NumberInt (4字节有符号整数): {"x": NumberInt("3")}

- NumberLong (8字节有符号整数): {"x": NumberLong("3")}
例如：

在关系型数据库中

| id   | user_name  | email        | age  | city        |
| ---- | ---------- | ------------ | ---- | ----------- |
| 1    | Mark Hanks | mark@abc.com | 25   | Los Angeles |

BSON

```json
{
	"_id": ObjectId("5146bb52d8524270060001f3"),
    "age": 25,
    "city": "Los Angeles",
    "email": "mark@abc.com",
    "user_name": "Mark Hanks"
}
```
