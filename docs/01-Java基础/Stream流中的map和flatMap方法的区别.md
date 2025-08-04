# Stream流中的map和flatMap方法的区别？

map方法不会影响流中元素的个数，但是流中元素的类型、元素值可能发生变化。它的原理是按照统一的规则将现在的流中每一个元素改造为另一个对象。

map方法会影响流中元素的个数，同时流中元素的类型、元素值可能发生变化。它的原理是按照某个规则将现在的流中每一个元素计算为一个新的Stream，然后最后将所有Stream合并为一个大的Stream

`map` 方法

-   **作用**：将每个元素通过给定的函数进行转换，并生成一个新的流。
-   **返回值**：返回一个与原始流大小相同的新流，其中每个元素都是经过转换后的结果。
-   **适用场景**：当你需要对每个元素进行一对一的转换时使用

```java
List<String> words = Arrays.asList("hello", "world");

List<Integer> wordLengths = words.stream()
    .map(String::length)
    .collect(Collectors.toList());

System.out.println(wordLengths); // 输出: [5, 5]
```

`flatMap` 方法

-   **作用**：将每个元素通过给定的函数进行转换，并将结果流展平（flatten）为一个单一的流。
-   **返回值**：返回一个包含所有转换后元素的新流，可能会比原始流更长或更短，具体取决于转换函数的输出。
-   **适用场景**：当你需要对每个元素进行一对多的转换，或者将嵌套的流展平为一个单一的流时使用。

```java
List<List<Integer>> nestedLists = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4)
);

List<Integer> flatList = nestedLists.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());

System.out.println(flatList); // 输出: [1, 2, 3, 4]
```

**关键区别**

| 特性         | `map`                    | `flatMap`                            |
| :----------- | :----------------------- | :----------------------------------- |
| **转换方式** | 一对一转换               | 一对多转换或展平嵌套流               |
| **返回结果** | 每个元素转换为一个新元素 | 每个元素转换为多个元素或展平为单一流 |
| **流的结构** | 维持原有的流结构         | 展平嵌套的流结构                     |



## Stream中map、peek、forEach方法的区别？

`map`

-   **作用**：将每个元素通过给定的函数进行转换，并生成一个新的流。
-   **返回值**：返回一个与原始流大小相同的新流，其中每个元素都是经过转换后的结果。
-   **适用场景**：当你需要对每个元素进行一对一的转换时使用。
-   **是否终止操作**：不是终止操作（中间操作），可以链式调用其他流操作。

```java
List<String> words = Arrays.asList("hello", "world");

List<Integer> wordLengths = words.stream()
    .map(String::length)
    .collect(Collectors.toList());

System.out.println(wordLengths); // 输出: [5, 5]
```

`peek`

-   **作用**：用于调试目的，在不改变流中元素的情况下对每个元素执行操作（如打印日志）。
-   **返回值**：返回包含相同元素的新流，流的结构保持不变。
-   **适用场景**：主要用于调试，查看流中元素的状态，而不影响后续操作。
-   **是否终止操作**：不是终止操作（中间操作），可以链式调用其他流操作。

```java
List<String> words = Arrays.asList("hello", "world");

List<String> result = words.stream()
    .peek(System.out::println) // 打印每个元素
    .map(String::toUpperCase)
    .collect(Collectors.toList());

System.out.println(result); // 输出: [HELLO, WORLD]
```

`forEach`

-   **作用**：对流中的每个元素执行给定的操作。
-   **返回值**：无返回值（`void`），操作完成后流结束。
-   **适用场景**：当你需要对每个元素执行某些副作用操作（如打印、更新状态等）时使用。
-   **是否终止操作**：是终止操作（终端操作），执行后流结束，不能再链式调用其他流操作。

```java
List<String> words = Arrays.asList("hello", "world");

words.stream()
    .forEach(System.out::println); // 输出: hello world

// 注意：forEach之后不能再调用其他流操作
```

**关键区别**

| 特性             | `map`                    | `peek`                   | `forEach`                            |
| :--------------- | :----------------------- | :----------------------- | :----------------------------------- |
| **作用**         | 转换元素                 | 调试/查看元素            | 执行副作用操作                       |
| **返回值**       | 新流（转换后的元素）     | 新流（原样元素）         | 无返回值（`void`）                   |
| **是否终止操作** | 不是终止操作（中间操作） | 不是终止操作（中间操作） | 是终止操作（终端操作）               |
| **适用场景**     | 元素转换                 | 调试、日志记录           | 执行副作用操作（如打印、更新状态等） |

**使用注意事项**

-   **性能考虑**：`peek` 主要用于调试，不应在生产代码中滥用，因为它可能会引入不必要的性能开销。
-   **副作用**：`forEach` 适用于有副作用的操作（如打印、更新状态等），但它会终止流，因此不能与其他流操作链式调用。
-   **不可变性**：`map` 和 `peek` 都是中间操作，不会改变原始流的内容，而是返回新的流，这使得流操作更加安全和可预测。

**总结**

-   **map**：用于转换流中的元素，生成新流。
-   **peek**：用于调试或查看流中元素的状态，不影响流的结构。
-   **forEach**：用于对每个元素执行副作用操作，终止流

