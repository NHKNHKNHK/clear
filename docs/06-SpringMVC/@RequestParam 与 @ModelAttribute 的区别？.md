# @RequestParam 与 @ModelAttribute 的区别？


| 特性             | @RequestParam        | @ModelAttribute        |
| ---------------- | -------------------- | ---------------------- |
| 绑定目标         | 单个请求参数         | Java 对象              |
| 绑定来源         | Query 参数或表单数据 | 表单数据或 Query 参数  |
| 适用场景         | 可选参数、搜索条件   | 表单提交、复杂对象绑定 |
| 是否支持嵌套绑定 | 否                   | 是                     |
| RESTful API 支持 | 不常见               | 不常见                 |
