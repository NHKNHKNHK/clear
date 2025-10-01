# Java常用类-数学相关

## Math类

​	在Java中，`Math` 类是一个包含用于执行数学运算的方法的 `final` 类。它提供了一系列静态方法，可以用于执行常见的数学操作，如取整、取绝对值、求平方根、求幂、求三角函数等。

注意：

​	`java.lang.Math` 类包含用于执行基本数学运算的方法，如初等指数、对数、平方根和三角函数。类似这样的工具类，其**所有方法均为静态方法，并且不会创建对象**，调用起来非常简单。 

### **常用方法**

```java
public static int abs(int a)  // 返回 int 值的绝对值
public static double abs(double a)  // 返回 double 值的绝对值
...    
```

示例

```java
// 取绝对值
System.out.println(Math.abs(10));  // 10
System.out.println(Math.abs(-12.3));  // 12.3
```

```java
public static double ceil(double a)  // 返回大于等于参数的最小的整数(向上取整)
```

示例

```java
// 向上取整
System.out.println(Math.ceil(4.3));  // 5.0
System.out.println(Math.ceil(4.1211));  // 5.0
```

```java
public static double floor(double a)  // 返回小于等于参数最大的整数(向下取整)
```

示例

```java
// 向下取整
System.out.println(Math.floor(4.3));  // 4.0
System.out.println(Math.floor(4.1211));  // 4.0
```

```java
public static long round(double a)  // 返回最接近参数的 long。(相当于四舍五入方法)  
```

示例

```java
// 四舍五入
// todo 技巧  floor(x + 0.5)
System.out.println(Math.round(4.334));  // 4
System.out.println(Math.round(4.57));  // 5
System.out.println(Math.round(-12.3));  // -12
System.out.println(Math.round(-12.6));  // -13
System.out.println(Math.round(-12.5));  // -12
```

```java
public static double pow(double a,double b)  // 返回 a 的 b 幂次方法 
```

示例

```java
// 取指数次方
System.out.println(Math.pow(4,0.5));  // 2.0
```

```java
public static double sqrt(double a)  // 返回 a 的平方根 
```

示例

```java
// 取平方根
System.out.println(Math.sqrt(4));  // 2.0
```

```java
public static double random()  // 返回[0,1)的随机值 
```

示例

```java
// 产生0-1的随机数（包前不包后）
System.out.println(Math.random());

// 扩展 取3-9之前的随机整数  加减法 (0 - 6) + 3
int data = (int) (Math.random()) * 7 + 3;
System.out.println(data);
```

```java
public static final double PI  // 返回圆周率 
```

示例

```java
 // 圆周率
 System.out.println(Math.PI);  // 3.141592653589793
```

```java
public static double max(double x, double y)  // 返回 x,y 中的最大值 
```

示例

```java
// 取大
System.out.println(Math.max(3,4));  // 4
```

```java
public static double min(double x, double y)  // 返回 x,y 中的最小值 
```

示例

```java
// 取小
System.out.println(Math.min(3,4));  // 3
```

```java
public static double sin(double a)  // sin
public static double cos(double a)  // tan
public static double tan(double a)  // sin
...
```

## java.math 包

### BigInteger  

Integer 类作为 int 的包装类，能存储的最大整型值为 2^31-1，Long 类也是有限的，最大为 2^63-1。如果要表示再大的整数，不管是基本数据类型还是他们的包装类都无能为力，更不用说进行运算了。 

java.math 包的 BigInteger 可以**表示不可变的任意精度的整数**。BigInteger 提供所有Java 的基本整数操作符的对应物，并提供 java.lang.Math 的所有相关方法。

另外，BigInteger 还提供以下运算：模算术、GCD 计算、质数测试、素数生成、位操作以及一些其他操作。 

#### **构造器** 

```java
public BigInteger(String val)  // 根据字符串构建 BigInteger 对象 
public BigInteger(byte[] val)  
....    
```

#### **常用方法** 

```java
// 静态方法，建议使用
public static BigInteger valueOf(long val)  // 将一个long值构建成 BigInteger 对象 
```

```java
public BigInteger abs()  // 返回此 BigInteger 的绝对值的 BigInteger
```

```java
public BigInteger add(BigInteger val)  // 返回其值为 (this + val) 的 BigInteger 
```

```java
public BigInteger subtract(BigInteger val)  // 返回其值为 (this - val) 的 BigInteger 
```

```java
public BigInteger multiply(BigInteger val)  // 返回其值为 (this * val) 的 BigInteger 
```

```java
public BigInteger divide(BigInteger val)  // 返回其值为 (this / val) 的 BigInteger。整数相除只保留整数部分。 
```

```java
public BigInteger remainder(BigInteger val)  // 返回其值为 (this % val) 的 BigInteger。
public BigInteger mod(BigInteger m)  // 求余，底层调用的就是 remainder(BigInteger val)
```

```java
public BigInteger[] divideAndRemainder(BigInteger val)  // 返回包含 (this / val) 后跟 (this % val) 的两个 BigInteger 的数组。 
```

```java
public BigInteger pow(int exponent) // 返回其值为 (this^exponent) 的 BigInteger。
```

```java
public int compareTo(BigInteger val)  // 将当前 BigInteger 对象与指定的 BigInteger 对象进行比较，返回一个整数表示它们的相对大小关系。
```

```java
public boolean equals(Object x)  // 判断当前 BigInteger 对象是否与指定的对象相等。
```

```java
public String toString()  // 将当前 BigInteger 对象转换为字符串表示
```

#### 示例

```java
import java.math.BigInteger;

public class BigIntegerDemo {
    public static void main(String[] args) {
        // long bigNum = 123456789123456789123456789L; 报错

        BigInteger b1 = new BigInteger("12345678912345678912345678");
        BigInteger b2 = new BigInteger("78923456789123456789123456789");
        //System.out.println("**和：**" + (b1+b2));  //错误的，无法直接使用进行求和

        System.out.println("和：" + b1.add(b2));
        System.out.println("减：" + b1.subtract(b2));
        System.out.println("乘：" + b1.multiply(b2));
        System.out.println("除：" + b2.divide(b1));
        System.out.println("余：" + b2.remainder(b1));
        System.out.println("余：" + b2.mod(b1));

        System.out.println(b1.compareTo(b2));  // 比较 b1 b2 的大小
        System.out.println(b1.equals(b2));  // 判断当前 BigInteger 对象是否与指定的对象相等
        System.out.println(b1.toString());  // 将当前 BigInteger 对象转换为字符串表示

    }
}
```



### BigDecimal  

​	一般的 Float 类和 Double 类可以用来做科学计算或工程计算，但在**商业计算中，要求数字精度比较高，故用到 java.math.BigDecimal 类。** 

BigDecimal 类支持**不可变的、任意精度**的有符号十进制定点数。 

#### **构造器** 

```java
public BigDecimal(double val) 
public BigDecimal(String val)  // 推荐•常用方法 
```

#### **常用方法**

```java
public BigDecimal add(BigDecimal augend)  // 加
```

```java
public BigDecimal subtract(BigDecimal subtrahend)   // 减
```

```java
public BigDecimal multiply(BigDecimal multiplicand)  // 乘
```

```java
public BigDecimal divide(BigDecimal divisor, int scale, int roundingMode)  // 除数
// 参数说明
// scale 指明保留几位小数
// roundingMode 指明舍入模式
     RoundingMode.HALF_UP 四舍五入
     RoundingMode.UP  向上加1
     RoundingMode.DOWN  直接舍弃	
```

```java
public double doubleValue()  // 将 BigDecimal 对象 转换为 double值
```

#### 示例

```java
public class BigDecimalDemo {
    public static void main(String[] args) {
        double a = 0.1;
        double b = 0.2;
        double c = a + b;
        System.out.println(c);  // 0.30000000000000004

        System.out.println("--------------");
        // 包装浮点型数据成为大数据对象 BigDecimal
        BigDecimal a1 = BigDecimal.valueOf(a);
        BigDecimal b1 = BigDecimal.valueOf(b);

        // 加法
        BigDecimal c1 = a1.add(b1);
        System.out.println(c1);  // 0.3
        // 减法
        BigDecimal c2 = a1.subtract(b1);
        System.out.println(c2);  // -0.1
        // 乘法
        BigDecimal c3 = a1.multiply(b1);
        System.out.println(c3);  // 0.02
        System.out.println("----------");

        // BigDecimal 只是手段，最终还是要转化为double
        double rs = c1.doubleValue();
        System.out.println(rs);  // 0.3

        System.out.println("----------------");
        // 注意事项： BigDecimal是一定要进行精度计算的
        // 包装浮点型数据成为大数据对象 BigDecimal
        BigDecimal a11 = BigDecimal.valueOf(10.0);
        BigDecimal b11 = BigDecimal.valueOf(3.0);
        //除法
        // BigDecimal c11 = a11.divide(b11);  // 3.333333333333 除不尽，会报错
        // 应该确定精确几位，舍入模式
        // 参数一：除数 参数二：保留几位小数 参数三：舍入模式
        BigDecimal c11 = a11.divide(b11, 2, RoundingMode.HALF_UP);
        System.out.println(c11);  // 3.33
    }
}
```



## java.util.Random

用于产生随机数  

### **常用方法**

```java
public boolean nextBoolean()  // 返回下一个伪随机数，它是取自此随机数生成器序列的均匀分布的 boolean 值
```

```java
public void nextBytes(byte[] bytes)  // 生成随机字节并将其置于用户提供的 byte 数组中
```

```java
public double nextDouble()  // 返回下一个伪随机数，它是取自此随机数生成器序列的、在 0.0 和 1.0 之间均匀分布的 double 值。 
```

```java
public float nextFloat()  // 返回下一个伪随机数，它是取自此随机数生成器序列的、在 0.0 和 1.0 之间均匀分布的 float 值
```

```java
synchronized public double nextGaussian()  // 返回下一个伪随机数，它是取自此随机数生成器序列的、呈高斯（“正态”）分布的 double 值，其平均值是 0.0，标准差是 1.0
```

```java
public int nextInt()  // 返回下一个伪随机数，它是此随机数生成器的序列中均匀分布的 int 值。
```

```java
public int nextInt(int bound)  // 返回一个伪随机数，它是取自此随机数生成器序列的、在 0（包括）和指定值（不包括）之间均匀分布的 int 值。 
```

```java
public long nextLong()  // 返回下一个伪随机数，它是取自此随机数生成器序列的均匀分布的 long 值。 
```

### 示例

```java
public class RandomDemo1 {
    public static void main(String[] args) {
        Random rd = new Random();

        int data = rd.nextInt(10);
        System.out.println(data);

        // 生成37-95之间的随机数
        for (int i = 0; i < 100; i++) {
            int data2 = rd.nextInt(59) + 37;
            System.out.println(data2);
        }
        
        boolean val = rd.nextBoolean();
        System.out.println(val);

    }
}
```

```java
public class RandomDemo2 {
    public static void main(String[] args) {
        // 随机生成一个1~100的整数
        Random random = new Random();
        int luckNumber = random.nextInt(100) + 1;
        Scanner sc = new Scanner(System.in);

        while (true) {
            System.out.println("请输入你猜的数字");
            int guessNumber = sc.nextInt();

            if (guessNumber > luckNumber) {
                System.out.println("你猜的数字过大了");
            } else if (guessNumber < luckNumber) {
                System.out.println("你猜的数字太小了");
            } else {
                System.out.println("恭喜你猜中了！");
                break;
            }
        }
    }
}
```