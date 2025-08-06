# HashSet、LinkedHashSet、TreeSet的区别？


|             | HashSet            | LinkedHashSet             | TreeSet         |
| ----------- | ------------------ | ------------------------- | --------------- |
| 底层集合    | HashMap            | LinkedHashMap             | TreeMap         |
| 数据结构    | 数组+单链表+红黑树 | 数组+单链表+红黑树+双链表 | 红黑树          |
| 顺序特点    | 无序               | 插入顺序                  | 按k元素大小顺序 |
| key支持null | 支持               | 支持                      | 不支持          |
| 线程安全    | 不安全             | 不安全                    | 不安全          |
