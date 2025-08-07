# @RequestBody、@RequestParam、@PathVariable的区别

## @RequestBody

| 名称 | @RequestBody                                                 |
| ---- | ------------------------------------------------------------ |
| 类型 | ==形参注解==                                                 |
| 位置 | SpringMVC控制器方法形参定义前面                              |
| 作用 | **将请求中请求体所包含的数据传递给请求参数**，此注解一个处理器方法只能使用一次 |

## @RequestParam

| 名称     | @RequestParam                                       |
| -------- | --------------------------------------------------- |
| 类型     | ==形参注解==                                        |
| 位置     | SpringMVC控制器方法形参定义前面                     |
| 作用     | 绑定请求参数与处理器方法形参间的关系                |
| 相关参数 | required：是否为必传参数   defaultValue：参数默认值 |

## @PathVariable

| 名称 | @PathVariable                                                |
| ---- | ------------------------------------------------------------ |
| 类型 | ==形参注解==                                                 |
| 位置 | SpringMVC控制器方法形参定义前面                              |
| 作用 | 绑定路径参数与处理器方法形参间的关系，要求路径参数名与形参名一一对应 |


## 区别

三个注解之间的区别和应用分别是什么?

-   @RequestParam用于**接收url地址传参（**query参数），**表单传参**【application/x-www-form-urlencoded】
    -   qeury参数：`/users?search=John`
-   @RequestBody用于接收**json**数据【application/json】
-   @PathVariable**用于接收路径参数**，使用{参数名称}描述路径参数
    -   例如：`/users/1`

## 应用

-   后期开发中，发送请求参数超过1个时，以json格式为主，@RequestBody应用较广
-   如果发送非json格式数据，选用@RequestParam接收请求参数
-   采用RESTful进行开发，当参数数量较少时，例如1个，可以采用@PathVariable接收请求路径变量，通常用于传递id值