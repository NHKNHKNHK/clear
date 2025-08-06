# List遍历有那几种遍历方式？

## 普通for循环

```java
List<String> list = Arrays.asList("A", "B", "C", "D");
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}
```

## foreach

```java
List<String> list = Arrays.asList("A", "B", "C", "D");
for (String item : list) {
    System.out.println(item);
}
```

## Iterator迭代器

```java
List<String> list = Arrays.asList("A", "B", "C", "D");
Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    System.out.println(iterator.next());
}
```

##  ListIterator

```java
List<String> list = Arrays.asList("A", "B", "C", "D");
ListIterator<String> listIterator = list.listIterator();
while (listIterator.hasNext()) {
    System.out.println(listIterator.next());
}
```

## Java 8 Stream API

```java
List<String> list = Arrays.asList("A", "B", "C", "D");
list.stream().forEach(System.out::println);
```