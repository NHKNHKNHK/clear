# MapReduce分组

## **分组概念、默认分组规则**

-   分组发生在reduce阶段，决定了同一个reduce中哪些数据将组成一组去调用reduce方法处理。
-   默认分组规则：key相同的就会分组一组（**前后比较key直接比较是否相等**）
-   注意：在reduce阶段进行分组前，已经进行了排序，因此**排序+分组将会使得key相同的数据一定会被分到同一组，一组去调用reduce方法**


## 自定义分组规则 

-   继承WritableComparator，重写Compare方法
-   只要**Compare方法返回0**，MapReduce框架在分组的时候就会认为**前后两个相等，分为一组**
-   在Job对象中进行设置，让自己的重写分组类生效

```java
// todo 如果重写了分组规则 还需要在job中进行设置才能生效
job.setGroupingComparatorClass(xxxx.class);
```

演示：

如下是一个自定义分组的实现类：

```Java
public class CovidGroupingComparator extends WritableComparator {
    public CovidGroupingComparator() {
        super(CovidBean.class, true);  // 允许创建对象实例
    }

    @Override
    public int compare(WritableComparable a, WritableComparable b) {
        // 类型转化
        CovidBean aBean = (CovidBean) a;
        CovidBean bBean = (CovidBean) b;

        // 本需求中，分组规则是：只要前后两个数据的state一样 就应该分到同一组
        // 只要compareTo 返回0 mapreduce框架就认为两个一样
        return aBean.getState().compareTo(bBean.getState());
    }
}
```

如果我们想让我们自定义的分组规则生效，还如进行如下设置

```java
// todo 如果重写了分组规则 还需要在job中进行设置才能生效
job.setGroupingComparatorClass(CovidGroupingComparator.class);
```



