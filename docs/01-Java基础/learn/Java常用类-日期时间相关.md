# Java常用类-日期时间相关

## JDK8之前的API

### System类的currentTimeMillis()

​	System 类提供的 **public static long currentTimeMillis()**：用来返回当前时间与 1970 年 1 月 1 日 0 时 0 分 0 秒之间以毫秒为单位的时间差。即时间戳

```java
public static void main(String[] args) {
    // 返回当前时间戳
    System.out.println(System.currentTimeMillis());
}
```

-   此方法适于计算时间差。 

-   计算世界时间的主要标准有： 
    -    UTC(Coordinated Universal Time) 
    -    GMT(Greenwich Mean Time) 
    -    CST(Central Standard Time) 

在国际无线电通信场合，为了统一起见，使用一个统一的时间，称为通用协调时(UTC, Universal Time Coordinated)。UTC 与格林尼治平均时(GMT, Greenwich Mean Time)一样，都与英国伦敦的本地时相同。

这里，UTC 与 GMT 含义完全相同

### Date类

​	Java中的`Date`类是用于表示日期和时间的类。它位于`java.util`包中，并提供了许多方法来操作日期和时间。

​	`Date`类在Java 8及更高版本中已经被废弃，推荐使用`java.time`包中的新日期和时间API。新的API提供了更好的可读性、线程安全性和功能性。

Data类其实有两个，分别为：

-   java.util.Date
-   java.sql.Date

这两个Data类其实是有继承关系的，可以从它们的类声明中看出来

```java
package java.util;

public class Date
    implements java.io.Serializable, Cloneable, Comparable<Date>

package java.sql;

public class Date extends java.util.Date  // java.sql.Date 是继承自java.util.Date
```

我们接下来主要是了解java.util.Date

**构造器**

```java
// Date类有很多构造器，但是几乎都已经Deprecated了，还剩下如下两个可以使用
// 无参构造器：创建的对象可以获取本地当前时间
public Date() {
    this(System.currentTimeMillis());
}

// 有参构造器
public Date(long date) {  // 把该毫秒值换算成日期时间对象 
    fastTime = date;  
}
```

**常用方法** 

```java
public long getTime()  // 返回表示日期对象的毫秒数(自 1970 年 1 月 1 日 00:00:00 GMT)
```

```java
public String toString()  // 将日期对象转换为字符串表示形式
// 以下形式的 String： dow mon dd  hh:mm:ss zzz yyyy
// 其中： dow 是一周中的某一天 (Sun, Mon, Tue, Wed,  Thu, Fri, Sat)，zzz 是时间标准。 
```

```java
public boolean before(Date when)  // 检查当前日期是否在指定日期之前。
public boolean after(Date when)  // 检查当前日期是否在指定日期之后
```

```java
public int compareTo(Date anotherDate)  // 比较两个日期的顺序
```

```java
public boolean equals(Object obj) // 检查当前日期是否与指定对象相等。
```

```java
public class DateDemo {
    public static void main(String[] args) {
        Date date = new Date();  // 创建一个Date类对象，获取系统此时此刻的时间
        System.out.println(date);

        Date date1 = new Date(1687965904532L);

        long time = date.getTime(); // 获取毫秒值
        System.out.println(time);
        System.out.println(System.currentTimeMillis());  // 获取当前时间的毫秒值
        // 将Date日期对象转换为字符串表示形式
        System.out.println(date.toString());  // Wed Jun 28 23:31:32 CST 2023

        boolean flag = date.before(date1);  // 检查当前日期是否在指定日期之前
        System.out.println(flag);  // false 
        boolean flag2 = date.after(date1);  // 检查当前日期是否在指定日期之后
        System.out.println(flag2);  // true
        // 比较两个日期的顺序
        System.out.println(date.compareTo(date1));  // 1：表示当前日期在指定日期之后
        // 检查当前日期是否与指定对象相等
        System.out.println(date.equals(date1));  // false

        // ————————————————————————————————————————

        // java.sql.Date 只有一个可以的构造器 public Date(long date)
        java.sql.Date date2 = new java.sql.Date(1687965904538L);  // 创建一个基于指定时间戳的Date实例
        System.out.println(date2.getTime());
        System.out.println(date2.toString());  // 2023-06-28
    }
}
```

### SimpleDateFormat类

​	 `SimpleDateFormat`类是Java中用于格式化和解析日期和时间的类。它位于`java.text`包中，并提供了一种简单的方式来定义日期和时间的格式，是一个**不与语言环境有关的方式来格式化和解析日期的具体类**

-   可以进行格式化：日期 --> 文本 
-   可以进行解析：文本 --> 日期 

**构造器：** 

```java
public SimpleDateFormat() // 默认的模式和语言环境创建对象 
// 一般情况下，我们都使用下面这个构造器
    
public SimpleDateFormat(String pattern)  // 使用指定的模式字符串创建一个SimpleDateFormat对象
```

`SimpleDateFormat`类使用一种模式字符串来定义日期和时间的格式。模式字符串由特定的字符组成，每个字符代表一种日期或时间的元素，例如年份、月份、日等。常用的模式字符包括：

-   `y`：年份
-   `M`：月份
-   `d`：日期
-   `H`：小时（24小时制）
-   `h`：小时（12小时制）
-   `m`：分钟
-   `s`：秒钟
-   `S`：毫秒

例如，使用`"yyyy-MM-dd HH:mm:ss"`作为模式字符串，可以将日期格式化为类似于`"2022-01-01 12:30:45"`的字符串。

需要注意的是，`SimpleDateFormat`类**不是线程安全的**，因此在多线程环境中使用时需要进行同步处理。另外，它也不支持解析所有可能的日期和时间格式，因此在解析时需要注意输入的字符串是否符合指定的模式。

**格式化：** 

public String format(Date date)：方法格式化时间对象 date 

```java
public final String format(Date date)  // 将指定的日期对象格式化为字符串
```

```java
public void applyPattern(String pattern)  // 应用新的模式字符串来更新日期格式
```

**解析：** 

```java
public Date parse(String source)  // 将指定的字符串解析为日期对象    
```

```java
public void setLenient(boolean lenient)  // 设置解析过程是否宽松，即是否允许解析不严格匹配的日期
```

```java
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
/**
 * 用于日期时间的格式化与解析
 */
public class SimpleDateFormatDemo1 {
    public static void main(String[] args) {
        // 1.获取日期对象
        Date date = new Date();
        System.out.println(date);  // Thu Jun 29 12:01:33 CST 2023

        // todo 格式化  日期 --> 文本
        // 2.格式化日期对象（使用默认的格式化方式）
        SimpleDateFormat sdf = new SimpleDateFormat();

        String strDate = sdf.format(date);  // 将指定的日期对象格式化为字符串
        System.out.println(strDate);  // 23-6-29 下午12:01

        // 2.格式化日期对象（需要指定最终格式化的形式）
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd HH-mm:ss EEE a");

        String strDate2 = sdf2.format(date);
        System.out.println(strDate2);  // 2023-06-29 12-01:33 星期四 下午

        System.out.println("-------------------------------");
        // todo 解析  文本 --> 日期
        try {
            // 使用默认的方式解析
            Date date2 = sdf.parse("23-6-25 下午11:49");
            System.out.println(date2);  // Sun Jun 25 23:49:00 CST 2023

            // 使用自己指定的格式解析
            Date date3 = sdf2.parse("2023-06-28 23-49:10 星期三 下午");
            System.out.println(date3);  // Wed Jun 28 23:49:10 CST 2023

        } catch (ParseException e) {
            e.printStackTrace();
        }

        // todo 应用新的模式字符串来更新日期格式
        // 更新之前
        String strDate3 = sdf.format(date);
        System.out.println(strDate3);  // 23-6-29 下午12:01
        sdf.applyPattern("yyyy-MM-dd HH-mm:ss");
        // 更新之后
        String strDate4 = sdf.format(date);
        System.out.println(strDate4);  // 2023-06-29 12-01:33
    }
}
```


### Calendar类（日历）

​	Date 类的 API 大部分被废弃了，替换为 Calendar。 

​	`Calendar`类是Java中用于操作日期和时间的类。它位于`java.util`包中，并提供了一种与日期和时间相关的功能，如获取年、月、日、小时、分钟、秒等。

​	`Calendar`类是一个抽象类，不能直接实例化，但可以通过`Calendar.getInstance()`方法获取一个`Calendar`对象的实例。

```java
// Since:JDK1.1
public static Calendar getInstance()
```

​	一个 Calendar 的实例是系统时间的抽象表示，可以修改或获取 YEAR、MONTH、DAY*OF*WEEK、HOUR*OF*DAY 、MINUTE、SECOND 等 日历字段对应的时间值。 

**常用方法**：

```java
public int get(int field)  // 获取指定字段的值，如`Calendar.YEAR`获取年份，`Calendar.MONTH`获取月份，`Calendar.DAY_OF_MONTH`获取日期等。
```

```java
public void set(int field, int value)  // 设置指定字段的值。
```

```java
abstract public void add(int field, int amount)  // 将指定字段的值增加或减少指定的数量
```

```java
public final Date getTime()  // 将Calendar对象转换为Date对象。
```

```java
public final void setTime(Date date)  // 使用指定的 Date 对象重置 Calendar的时间 
```

```java
public long getTimeInMillis()  // 获取表示	Calendar对象的时间戳（以毫秒为单位）
```

​	`Calendar`类提供了对日期和时间的灵活操作，可以进行日期的计算、比较、格式化等。它也可以用于获取当前日期和时间，以及进行日期的加减运算。

​	需要注意的是，`Calendar`类的月份是从0开始的，即0表示一月，11表示十二月。另外，`Calendar`类也**不是线程安全的**，因此在多线程环境中使用时需要进行同步处理。推荐使用`java.time`包中的新日期和时间API，如`LocalDate`、`LocalTime`和`LocalDateTime`，它们提供了更简洁、易用和线程安全的日期和时间操作方式。

```java
/**
 * 实例化：由于Calendar是一个抽象类，所需我们需要创建其子类GregorianCalendar 实例。
 * 我们也可以使用Calendar提供的静态方法getInstance()进行实例化。
 */
public class CalendarDemo {
    public static void main(String[] args) {
        // 获取实例
        Calendar calendar = Calendar.getInstance();
        //System.out.println(calendar);

        // 获取日历中的某个字段信息
        System.out.println(calendar.get(Calendar.MONTH) + 1);  // 6
        System.out.println(calendar.get(Calendar.DAY_OF_YEAR));  // 180

        // 修改日历的某个字段
        calendar.set(Calendar.MONTH, 7);
        System.out.println(calendar.get(Calendar.MONTH) + 1);  // 8

        // 为某个字段增加/减少指定的值
        calendar.add(Calendar.MONTH, 2);
        System.out.println("增加2个月后为：" + (calendar.get(Calendar.MONTH) + 1));  // 增加2个月后为：10

        // 拿到当前日期时间对象：即将Calendar转换为Date
        System.out.println(calendar.getTime());  // Sun Oct 29 12:23:00 CST 2023

        // 使用指定的 Date 对象重置 Calendar的时间
        Date date = new Date();
        calendar.setTime(date);
        System.out.println("当前月份：" + (calendar.get(Calendar.MONTH) + 1));  // 当前月份：6

        // 拿到当前时间对象的时间戳
        System.out.println(calendar.getTimeInMillis());  // 1688012580763
    }
}
```

 注意：

​	**获取月份时：一月是 0，二月是 1，以此类推，12 月是 11 ，因此获取以后要 +1**

​	**获取星期时：周日是 1，周二是 2 ， 。。。。周六是7**   





## JDK8的API

​	如果我们可以跟别人说：“我们在 1502643933071 见面，别晚了！”那么就再简单不过了。但是我们希望时间与昼夜和四季有关，于是事情就变复杂了。JDK 1.0 中包含了一个 java.util.Date 类，但是它的大多数方法已经在 JDK 1.1 引入Calendar 类之后被弃用了。而 Calendar 并不比 Date 好多少。它们面临的问题是： 

-    可变性：像日期和时间这样的类应该是不可变的。 
-    偏移性：Date 中的年份是从 1900 开始的，而月份都从 0 开始。 
-    格式化：格式化只对 Date 有用，Calendar 则不行。 
-    此外，它们也不是线程安全的；不能处理闰秒等。

>    闰秒，是指为保持协调世界时接近于世界时时刻，由国际计量局统一规定在年底或年中（也可能在季末）对协调世界时增加或减少 1秒的调整。由于地球自转的不均匀性和长期变慢性（主要由潮汐摩擦引起的），会使世界时（民用时）和原子时之间相差超过到±0.9秒时，就把协调世界时向前拨 1 秒（负闰秒，最后一分钟为 59 秒）或向后拨 1 秒（正闰秒，最后一分钟为 61 秒）； 闰秒一般加在公历年末或公历六月末。 
>
>   目前，全球已经进行了 27 次闰秒，均为正闰秒。 



总结：*对日期和时间的操作一直是* *Java* *程序员最痛苦的地方之一*。 

第三次引入的 API 是成功的，并且 Java 8 中引入的 java.time API 已经纠正了过去的缺陷，将来很长一段时间内它都会为我们服务。 

Java 8 以一个新的开始为 Java 创建优秀的 API。新的日期时间 API 包含： 

-   *java.time* – 包含值对象的基础包 
-    *java.time.chrono* – 提供对不同的日历系统的访问。 
-    *java.time.format* – 格式化和解析时间和日期 
-    *java.time.temporal* – 包括底层框架和扩展特性 
-    *java.time.zone* – 包含时区支持的类 

说明：新的 java.time 中包含了所有关于时钟（Clock），本地日期（LocalDate）、本地时间（LocalTime）、本地日期时间（LocalDateTime）、时区（ZonedDateTime）和持续时间（Duration）的类。 

尽管有 68 个新的公开类型，但是大多数开发者只会用到基础包和 format 包，大概占总数的三分之一。

### 本地日期时间LocalDate、LocalTime、LocalDateTime

`LocalDate`、`LocalTime`和`LocalDateTime`是Java 8引入的日期和时间API，位于`java.time`包中。它们提供了更简洁、易用和**线程安全**的日期和时间操作方式。

-   `LocalDate`：用于表示日期，包含年、月、日信息。可以通过`LocalDate.now()`方法获取当前日期，也可以使用`of()`方法指定年、月、日创建一个`LocalDate`对象。例如：

    ```java
    LocalDate now = LocalDate.now(); // 获取当前日期
    LocalDate date = LocalDate.of(2022, 1, 1); // 创建指定日期
    ```

-   `LocalTime`：用于表示时间，包含时、分、秒、纳秒信息。可以通过`LocalTime.now()`方法获取当前时间，也可以使用`of()`方法指定时、分、秒创建一个`LocalTime`对象。例如：

    ```java
    LocalTime now = LocalTime.now(); // 获取当前时间
    LocalTime time = LocalTime.of(12, 30, 0); // 创建指定时间
    ```

-   `LocalDateTime`：用于表示日期和时间，包含年、月、日、时、分、秒、纳秒信息。可以通过`LocalDateTime.now()`方法获取当前日期和时间，也可以使用`of()`方法指定年、月、日、时、分、秒创建一个`LocalDateTime`对象。例如：

    ```java
    LocalDateTime now = LocalDateTime.now(); // 获取当前日期和时间
    LocalDateTime dateTime = LocalDateTime.of(2022, 1, 1, 12, 30, 0); // 创建指定日期和时间
    ```

​	这些类提供了丰富的方法来操作日期和时间，如获取年、月、日、时、分、秒等信息，进行日期和时间的计算、比较、格式化等操作。它们也是不可变的，每个操作都会返回一个新的对象，不会修改原有对象。

​	与`Calendar`类相比，`LocalDate`、`LocalTime`和`LocalDateTime`提供了更简洁、易用和线程安全的API，推荐在新的Java项目中使用。

**常用方法**

```java
now() / now(ZoneId zone)   // 静态方法，根据当前时间创建对象/指定时区的对象  
```

```java
of(xx,xx,xx,xx,xx,xxx)  // 静态方法，根据指定日期/时间创建对象 
```

```java
getDayOfMonth()/getDayOfYear()  // 获得月份天数(1-31) /获得年份天数(1-366)  
```

```java
getDayOfWeek()  // 获得星期几(返回一个 DayOfWeek 枚举值) 
```

```java
getMonth()  // 获得月份, 返回一个 Month 枚举值 
```

```
getMonthValue() / getYear()   // 获得月份(1-12) /获得年份 
```

```
getHours()/getMinute()/getSecond()   // 获得当前对象对应的小时、分钟、秒 
```

```java
withDayOfMonth()/withDayOfYear()/withMonth()/withYear()  //  将月份天数、年份天数、月份、年份修改为指定的值并返回新的对象  
```

```java
with(TemporalAdjuster t)   // 将当前日期时间设置为校对器指定的日期时间 
```

```java
plusDays(), plusWeeks(), plusMonths(), plusYears(),plusHours()  //  向当前对象添加几天、几周、几个月、几年、几小时方法 
```

```java
minusMonths() /  minusWeeks()/minusDays()/minusYears()/minusHours()  // 从当前对象减去几月、几周、几天、几年、几小时 
```

```
plus(TemporalAmount t)/minus(TemporalAmount t)  // 添加或减少一个 Duration 或 Period 
```

```
isBefore()/isAfter()  // 比较两个 LocalDate 
```

```java
isLeapYear()   // 判断是否是闰年（在 LocalDate 类中声明） 
```

```java
format(DateTimeFormatter t)   // 格式化本地日期、时间，返回一个字符串 
```

```
parse(Charsequence text)   // 将指定格式的字符串解析为日期、时间
```

例如：

```java
/**
 * LocalDate类
 */
public class Demo01LocalDate {
    public static void main(String[] args) {
        // todo now(): 获取当前日期对应的实例
        LocalDate nowDate = LocalDate.now();
        System.out.println("今天的日期:" + nowDate);  // 今天的日期:2023-06-29

        int year = nowDate.getYear();
        System.out.println("year:" + year);  // year:2023
        int month = nowDate.getMonthValue();
        System.out.println("month:" + month);  // month:6
        // 当年的第几天
        int dayOfYear = nowDate.getDayOfYear();
        System.out.println("dayOfYear:" + dayOfYear);  // dayOfYear:180
        // 星期
        DayOfWeek week = nowDate.getDayOfWeek();  // 枚举值
        System.out.println("week:" + week);  // week:THURSDAY
        System.out.println("week:" + week.getValue());  // week:4
        // 月份
        Month monthValue = nowDate.getMonth();  // 枚举值
        System.out.println("monthValue:" + monthValue);  // monthValue:JUNE

        // todo of(): 获取指定日期的对应实例
        LocalDate localDate = LocalDate.of(2018, 7, 1);
        System.out.println(localDate);  // 2018-07-01
    }
}
```

```java
/**
 * LocalTime类
 */
public class Demo02LocalTime {
    public static void main(String[] args) {
        // todo now(): 获取当前时间对应的实例
        LocalTime nowTime = LocalTime.now();
        System.out.println("今天的时间:"+nowTime);

        int hour = nowTime.getHour();  // 时
        System.out.println("hour:"+hour);  // hour

        int minute = nowTime.getMinute();  // 分
        System.out.println("minute:"+minute);  // minute

        int second = nowTime.getSecond();
        System.out.println("second:"+second);

        System.out.println("===============");
        // todo of(): 获取指定时间的对应实例
        System.out.println(LocalTime.of(8, 20));  // 时分
        System.out.println(LocalTime.of(8, 20,30));  //时分秒
        System.out.println(LocalTime.of(8, 20,30,150));  //时分秒 纳秒
    }
}
```

```java
/**
    LocalDateTime类 (可以将其看为是 LocalDate LocalTime 的组合)
    调用public LocalDate toLocalDate() 转为LocalDate对象
    调用public LocalTime toLocalTime() 转为LocalTime对象
 */
public class Demo03LocalDateTime {
    public static void main(String[] args) {
        // todo now(): 获取当前日期时间对应的实例
        LocalDateTime nowDateTime = LocalDateTime.now();
        System.out.println("今天是:"+nowDateTime);

        System.out.println(nowDateTime.getYear());  // 年
        System.out.println(nowDateTime.getMonthValue());  // 月
        System.out.println(nowDateTime.getDayOfMonth());  // 日
        System.out.println(nowDateTime.getHour());  // 时
        System.out.println(nowDateTime.getMinute());  // 分
        System.out.println(nowDateTime.getSecond());  // 秒
        System.out.println(nowDateTime.getNano());  // 纳秒

        System.out.println("===============");
        // 日：当年的第几天
        System.out.println("dayOfYear:"+nowDateTime.getDayOfYear());
        System.out.println("===============");
        // 星期
        DayOfWeek week = nowDateTime.getDayOfWeek();  // 枚举值
        System.out.println("week:"+week);
        System.out.println("week:"+week.getValue());
        System.out.println("===============");
        // 月份
        Month month = nowDateTime.getMonth();  // 枚举值
        System.out.println("month:"+month);
        System.out.println("monthValue:"+month.getValue());
        System.out.println("===============");

        // todo of(): 获取指定日期时间的对应实例
        LocalDateTime localDateTime = LocalDateTime.of(2018, 7, 1, 12, 35, 0);
        

        // todo 将LocalDateTime 转为 LocalDate
        LocalDate localDate = nowDateTime.toLocalDate();
        System.out.println(localDate);

        // todo 将LocalDateTime 转为 LocalDate
        LocalTime localTime = nowDateTime.toLocalTime();
        System.out.println(localTime);
    }
}
```

```java
/**
 * 注意：Local 类都是不可变类型
 */
public class Demo04UpdateLocal {
    public static void main(String[] args) {
        // todo 不可变对象，每次修改产生一个新对象
        LocalTime nowTime = LocalTime.now();
        System.out.println(nowTime);  // 当前时间
        System.out.println(nowTime.minusHours(1));  // 一小时前
        System.out.println(nowTime.minusMinutes(1));  // 一分钟前
        System.out.println(nowTime.minusSeconds(1));  // 一秒前
        System.out.println(nowTime.minusNanos(1));  // 一纳秒前

        System.out.println("===================");
        System.out.println(nowTime.plusHours(1));  // 一小时后
        System.out.println(nowTime.plusMinutes(1));  // 一分钟后
        System.out.println(nowTime.plusSeconds(1));  // 一秒后
        System.out.println(nowTime.plusNanos(1));  // 一纳秒后

        System.out.println("===================");
        LocalDate myDate = LocalDate.of(2021, 5, 5);
        LocalDate nowDate = LocalDate.now();

        //  public boolean equals(Object obj)
        System.out.println("今天是2021-05-05吗？"+nowDate.equals(myDate));
        //  public boolean isAfter(ChronoLocalDate other)
        System.out.println(myDate+"是否在"+ nowDate+ "之后?"+myDate.isAfter(nowDate));
        // public boolean isBefore(ChronoLocalDate other)
        System.out.println(myDate+"是否在"+ nowDate+ "之前?"+myDate.isBefore(nowDate));

        System.out.println("===================");
        // 判断今天是否是你生日
        LocalDate myBirthDay = LocalDate.of(2002,06,25);
        // 获取今天日期
        LocalDate today = LocalDate.now();

/*        public static MonthDay of(int month, int dayOfMonth) {
            return of(Month.of(month), dayOfMonth);
        }*/
        // 接收日月
        MonthDay birMd = MonthDay.of(myBirthDay.getMonthValue(),myBirthDay.getDayOfMonth());
        MonthDay todayMd = MonthDay.from(today);

        // 判断
        System.out.println("今天是你的生日吗？"+todayMd.equals(birMd));
    }
}
```

### 瞬时Instant

​	`Instant`是Java 8中引入的日期和时间API中的一个类，位于`java.time`包中。它用于表示时间戳，时间戳是指格林威治时间 1970 年 01 月 01 日 00 时 00 分 00 秒(北京时间1970 年 01 月 01 日 08 时 00 分 00 秒)起至现在的总秒数。

​	中国大陆、中国香港、中国澳门、中国台湾、蒙古国、新加坡、马来西亚、菲律宾、西澳大利亚州的时间与 UTC 的时差均为+8，也就是UTC+8

​	**`Instant`类是不可变的，每个操作都会返回一个新的对象，不会修改原有对象**。它提供了精确的时间戳表示，适用于需要处理时间戳的场景，如计算时间间隔、比较时间先后等。

**常用方法**

实例化方法

```java
public static Instant now()  // 静态方法，返回默认 UTC 时区的 Instant 类的对象方法
```

```java
public static Instant ofEpochMilli(long epochMilli) // 静态方法，返回在 1970-01-01 00:00:00 基础上加上指定毫秒数之后的 Instant 类的对象 
```

常用方法

```java
public OffsetDateTime atOffset(ZoneOffset offset)  // 结合即时的偏移来创建一个 OffsetDateTime 
```

```java
public long toEpochMilli()  // 返回 1970-01-01 00:00:00 到当前时间的毫秒数，即为时间戳 
    
public long getEpochSecond()  // 获取时间戳的秒数
public int getNano()  // 获取时间戳的纳秒数     
```

```java
/**
 * 获取时间戳 Instant类由一个静态工厂方法now()可以返回当前时间戳
 * 时间戳包含 日期和时间，与java.util.Date很类似，事实上Instant就是类似jdk8以前的Date
 * Instant 和 Date 可以相互转换
 */
public class Demo05Instant {
    public static void main(String[] args) {
        // todo now(): 得到Instant时间戳对象
        Instant instant = Instant.now();
        System.out.println(instant);  // 2023-06-29T06:10:06.009Z

        // 获取北京时间
        OffsetDateTime instant1 = instant.atOffset(ZoneOffset.ofHours(8));
        System.out.println(instant1);  // 2023-06-29T06:10:06.009+08:00

        System.out.println(instant.atZone(ZoneId.systemDefault()));  // 2023-06-29T14:10:06.009+08:00[Asia/Shanghai]

        // 返回在 1970-01-01 00:00:00 基础上加上指定毫秒数之后的 Instant 类的对象
        Instant instant2 = Instant.ofEpochMilli(24123123122L);
        System.out.println(instant2);  // 1970-10-07T04:52:03.122Z

        // 返回 1970-01-01 00:00:00 到当前时间的毫秒数，即为时间戳
        long milli = instant.toEpochMilli();  // 类似于 Date的 getTime()
        System.out.println(milli);  // 1688019006009

        // Instant ==> Date
        Date date = Date.from(instant);
        System.out.println(date);  // Thu Jun 29 14:10:06 CST 2023
        // Date ==> Instant
        Instant instant3 = date.toInstant();
        System.out.println(instant3);  // 2023-06-29T06:10:06.009Z
    }
}
```

###  **日期时间格式化 DateTimeFormatter** 

​	`DateTimeFormatter`是Java 8中引入的日期和时间API中的一个类，位于`java.time.format`包中。它用于将日期、时间和时间戳格式化为字符串，或将字符串解析为日期、时间和时间戳。

该类提供了三种格式化方法： 

-   预定义的标准格式。如：ISO*LOCAL*DATE*TIME、ISO*LOCAL*DATE、* *ISOLOCAL_TIME* 

-   地化相关的格式。如：ofLocalizedDate(FormatStyle.LONG) 


```java
// 本地化相关的格式。如：ofLocalizedDateTime() 
// FormatStyle.MEDIUM / FormatStyle.SHORT :适用于LocalDateTime

//本地化相关的格式。如：ofLocalizedDate() 
// FormatStyle.FULL / FormatStyle.LONG / FormatStyle.MEDIUM / FormatStyle.SHORT :适用于LocalDate
```

-   自定义的格式。如：ofPattern(“yyyy-MM-dd hh:mm:ss”) 

**常用方法**

实例化DateTimeFormatter

```java
ofPattern(String pattern)  // 静态方法，返回一个指定字符串格式的DateTimeFormatter方法
```

格式化：日期、时间 ===> 字符串

```java
format()  // 格式化一个日期、时间，返回字符串 
```

解析：字符串 ===> 日期、时间

```java
parse()  // 将指定格式的字符序列解析为一个日期、时间 
// 可以使用LocalDate、LocalDateTime、LocalTime、ZonedDateTime的静态 parse 方法来解析字符串中的日期和时间
```

```java
/**
 * 类似于SimpleDateFormat
 * 在jdk8中引入的一个全限的日期和时间格式器 DateTimeFormatter
 * 注意： 正反都能调用format()方法
 */
public class Demo06DateTimeFormatter {
    public static void main(String[] args) {
        LocalDateTime nowLocalDateTime = LocalDateTime.now();
        System.out.println("现在的时间:"+nowLocalDateTime); // 2022-06-08T13:20:09.816571500

        // todo 格式化：日期、时间 ===> 字符串
        // 引入 格式化器
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        // 正反都能调用format()方法
        // 正向格式化
        String nowLocalDateTimeStr = dtf.format(nowLocalDateTime);
        System.out.println(nowLocalDateTimeStr);  // 2022-06-08 13:20:09

        // 逆向格式化
        String nowLocalDateTimeStr2 = nowLocalDateTime.format(dtf);
        System.out.println(nowLocalDateTimeStr);  // 2022-06-08 13:20:09

        System.out.println("===================");
        // todo 解析：字符串 ===> 日期、时间
        // 解析字符串时间
        DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        String dateStr = "2019-11-11 11:11:11";
        // 解析字符串时间成为本地时间对象
        LocalDateTime localDateTime = LocalDateTime.parse(dateStr, dtf2);
        System.out.println(localDateTime);  // 2019-11-11T11:11:11
    }
}
```

### 指定时区日期时间ZondId 和 ZonedDateTime

-   ZoneId：该类中包含了所有的时区信息，一个时区的 ID，如 Europe/Paris

-   ZonedDateTime：一个在 ISO-8601 日历系统时区的日期时间，如 2007-12-03T10:15:30+01:00 Europe/Paris。 

​	其中每个时区都对应着 ID，地区 ID 都为“{区域}/{城市}”的格式，例如： Asia/Shanghai 等 

-   常见时区 ID： 

    Asia/Shanghai 

    UTC 

    America/New_York 

-   可以通过 ZondId 获取所有可用的时区 ID：

```java
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Set;

public class TestZone {
    @Test
    public void test01() {
        //需要知道一些时区的id
        //Set<String>是一个集合，容器
        Set<String> availableZoneIds = ZoneId.getAvailableZoneIds();
        //快捷模板iter
        for (String availableZoneId : availableZoneIds) {
            System.out.println(availableZoneId);
        }
    }

    @Test
    public void test02(){
        ZonedDateTime t1 = ZonedDateTime.now();
        System.out.println(t1);

        ZonedDateTime t2 = ZonedDateTime.now(ZoneId.of("America/New_York"));
        System.out.println(t2);
    }
}
```

### 持续日期/时间：Period 和 Duration

-   持续时间：Duration，用于计算两个“时间”间隔 
-   日期间隔：Period，用于计算两个“日期”间隔

`Duration`是Java 8中引入的日期和时间API中的一个类，位于`java.time`包中。它用于表示一段时间的持续时间，可以精确到纳秒级别。

`Duration`类提供了一些常用的方法来操作持续时间，例如：

-   `ofDays(long days)`：创建一个持续时间，表示指定的天数。
-   `ofHours(long hours)`：创建一个持续时间，表示指定的小时数。
-   `ofMinutes(long minutes)`：创建一个持续时间，表示指定的分钟数。
-   `ofSeconds(long seconds)`：创建一个持续时间，表示指定的秒数。
-   `ofMillis(long millis)`：创建一个持续时间，表示指定的毫秒数。
-   `ofNanos(long nanos)`：创建一个持续时间，表示指定的纳秒数。

`Duration`类还提供了一些方法来进行持续时间的计算和操作，例如：

-   `plus(Duration duration)`：将指定的持续时间添加到当前持续时间。
-   `minus(Duration duration)`：从当前持续时间中减去指定的持续时间。
-   `multipliedBy(long multiplicand)`：将当前持续时间乘以指定的倍数。
-   `dividedBy(long divisor)`：将当前持续时间除以指定的除数。
-   `toDays()`：将持续时间转换为天数。
-   `toHours()`：将持续时间转换为小时数。
-   `toMinutes()`：将持续时间转换为分钟数。
-   `toSeconds()`：将持续时间转换为秒数。
-   `toMillis()`：将持续时间转换为毫秒数。
-   `toNanos()`：将持续时间转换为纳秒数。

```java
/**
 * 在jdk8中 ，计算时间间隔差异 Duration
 * 提供了使用基于时间的值测量时间量的方法
 * 用于LocalDateTime之间的比较 也可以用于Instant之间比较
 */
public class Demo08Duration {
    public static void main(String[] args) {
        LocalDateTime today = LocalDateTime.now();
        System.out.println(today);  // 2022-06-08T13:44:04.337595100

        LocalDateTime birthDate = LocalDateTime.of(1999, 01, 01,11,11,11);
        System.out.println(birthDate);  // 1999-01-01T11:11:11

        Duration duration = Duration.between(birthDate, today);  // 第二个参数减第一个
        System.out.println(duration);  // P23Y5M7D  PT205418H32M53.3375951S

        // 两者之差
        System.out.println(duration.toDays());  // 两个时间相差的天数
        System.out.println(duration.toHours());  // 两个时间相差的小时
        System.out.println(duration.toMinutes());  // 两个时间相差的分钟数
       // System.out.println(duration.toSeconds());  // 两个时间相差的秒数
        System.out.println(duration.toMillis());  // 两个时间相差的毫秒数
        System.out.println(duration.toNanos());  // 两个时间相差的纳秒数

    }
}
```



### Clock

​	Clock：使用时区提供对当前即时、日期和时间的访问的时钟。 

​	`Clock`是Java 8中引入的日期和时间API中的一个类，位于`java.time`包中。它用于获取当前的日期、时间和时区信息。

`Clock`类提供了以下功能：

-   获取当前的日期和时间：可以使用`Clock.systemDefaultZone()`方法获取当前默认时区下的`Clock`对象，然后使用`instant()`方法获取当前的时间戳，使用`zone()`方法获取当前的时区，使用`millis()`方法获取当前的毫秒数。例如：

    ```java
    Clock clock = Clock.systemDefaultZone();
    Instant instant = clock.instant();
    ZoneId zone = clock.getZone();
    long millis = clock.millis();
    ```

-   获取指定时区的日期和时间：可以使用`Clock.system()`方法指定一个时区创建`Clock`对象，然后使用相同的方法获取日期、时间和时区信息。例如：

    ```java
    Clock clock = Clock.system(ZoneId.of("America/New_York"));
    Instant instant = clock.instant();
    ZoneId zone = clock.getZone();
    long millis = clock.millis();
    ```

-   自定义`Clock`对象：可以使用`Clock.fixed()`方法创建一个固定的`Clock`对象，用于模拟特定的日期和时间。需要提供一个固定的时间戳和时区。例如：

    ```java
    Instant fixedInstant = Instant.parse("2022-01-01T00:00:00Z");
    ZoneId zone = ZoneId.systemDefault();
    Clock clock = Clock.fixed(fixedInstant, zone);
    ```

`Clock`类还提供了其他一些方法，如`withZone()`用于指定时区、`tick()`用于创建一个以固定间隔前进的`Clock`对象等，以满足不同的需求。

### TemporalAdjuster

​	`TemporalAdjuster`是Java 8中引入的日期和时间API中的一个接口，位于`java.time.temporal`包中。它用于对日期和时间进行调整，例如将日期调整为下一个工作日、将时间调整为下一个小时等。

​	`TemporalAdjuster`接口定义了一个`adjustInto()`方法，接受一个`Temporal`对象作为参数，并返回一个调整后的`Temporal`对象。`Temporal`是日期和时间API中的一个通用接口，包括`LocalDate`、`LocalTime`、`LocalDateTime`等。

`TemporalAdjuster`接口提供了一些静态方法来创建常用的调整器，例如：

-   `next(DayOfWeek dayOfWeek)`：返回下一个指定的星期几。
-   `previous(DayOfWeek dayOfWeek)`：返回上一个指定的星期几。
-   `firstDayOfMonth()`：返回当月的第一天。
-   `lastDayOfMonth()`：返回当月的最后一天。
-   `firstDayOfNextMonth()`：返回下个月的第一天。
-   `firstInMonth(DayOfWeek dayOfWeek)`：返回当月的第一个指定星期几。
-   `lastInMonth(DayOfWeek dayOfWeek)`：返回当月的最后一个指定星期几。

使用`TemporalAdjuster`可以方便地对日期和时间进行调整，例如：

```java
LocalDate date = LocalDate.now();
LocalDate nextMonday = date.with(TemporalAdjusters.next(DayOfWeek.MONDAY));
LocalDate lastDayOfMonth = date.with(TemporalAdjusters.lastDayOfMonth()
```



### **与传统日期处理的转换**

| **类**                                                       | **To** **遗留类**                     | **From** **遗留类**         |
| ------------------------------------------------------------ | ------------------------------------- | --------------------------- |
| **java.time.Instant与<br>java.util.Date**                    | Date.from(instant)                    | date.toInstant()            |
| **java.time.Instant与java.sql.Timestamp**                    | Timestamp.from(instant)               | timestamp.toInstant()       |
| **java.time.ZonedDateTime与java.util.GregorianCalendar**     | GregorianCalendar.from(zonedDateTime) | cal.toZonedDateTime()       |
| **java.time.LocalDate与<br>java.sql.Time**                   | Date.valueOf(localDate)               | date.toLocalDate()          |
| **java.time.LocalTime与java.sql.Time**                       | Date.valueOf(localDate)               | date.toLocalTime()          |
| **java.time.LocalDateTime与java.sql.Timestamp**              | Timestamp.valueOf(localDateTime)      | timestamp.toLocalDateTime() |
| **java.time.ZoneId与java.util.TimeZone**                     | Timezone.getTimeZone(id)              | timeZone.toZoneId()         |
| **java.time.format.DateTimeFormatter与java.text.DateFormat** | formatter.toFormat()                  | 无                          |