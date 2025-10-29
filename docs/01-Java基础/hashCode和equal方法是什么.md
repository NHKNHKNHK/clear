# hashCode和equal方法是什么

equals方法用于比较两个对象是否相等，hashCode方法用于返回对象的哈希值，这两个方法必须一起重写，而且选择的属性必须一致，因为：

hashCode方法必须遵循：

（1）如果进行equals比较时所用的信息没有被修改，那么同一个对象多次调用hashCode方法时，必须结果一致

（2）如果两个对象equals为true，那么它们的hashCode值也必须相同

（3）如果两个对象equals为false，那么它们的hashCode值相同或不同都可以。当然不同可以提升哈希表的性能

另外，equals方法必须遵循：

（1）自反性：x不为null，那么x.equals(x)必须为true

（2）对称性：x、y不为null，那么x.equals(y)与y.equals(x)结果必须相同

（3）传递性：x、y、z不为null，如果x.equals(y)为true，y.equals(z)为true，那么x.equals(z)结果必须一致

（4）一致性：x、y不为null，且x和y用于equals比较的属性值也没有修改，那么多次调用x.equals(y)结果必须一致

（5）如果x不为null，x.eqauls(null)必须返回false

>   问：两个对象的equals方法相等，hashCode方法也会相等吗？
>
>   答：对
>
>   问：两个对象的hashCode方法相等，equals方法也会相等吗？
>
>   答：不对
>
>   问：为什么重写equals就要重写hashCode？
>
>   答：因为hashCode必须遵循上述3条常规协定，这些规定是为`HashMap`、`HashSet`等基于哈希的集合类型提供正确行为的基础。如果不遵守这个约定，对象在使用这些集合类型时可能会表现出不可预测的行为
