# 为什么Map接口不继承Collection接口？


Map继承Collection没有意义。Collection代表的是一组独立元素的集合，操作的是单个元素。而Map代表的是一组key-value键值对形式的集合，操作的是键值对，而不是“一组对象”的概念。分开两个不同的集合，语义上更加清晰。
