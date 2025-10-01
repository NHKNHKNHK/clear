
# Java编码解码

## 把字符转为字节

### 读取内存中的数据编码为字节

```java
import java.util.Arrays;

/**
 * 目标：学会自己进行文字的编码和解码，为以后可能用到的场景做准备
 */
public class CharSetDemo {
    // UTF-8：一个中文占3个字节，一个字母或数字占一个字节
    // GBK：一个中文占2个字节，一个字母或数字占一个字节
    public static void main(String[] args) throws Exception{
        String str = "你发任你发，老子java8";
        // todo 编码：使用默认的字符集
        byte[] bytes = str.getBytes();  // 默认字符集为utf-8
        System.out.println("默认编码的字符数组长度为" + bytes.length);
        System.out.println("默认编码数组为：" + Arrays.toString(bytes));
        // todo 编码：使用指定的字符集
        byte[] bytes2 = str.getBytes("GBK");  // 指定gbk编码
        System.out.println("gbk编码的字符数组长度为" + bytes2.length);
        System.out.println("gbk编码数组为：" + Arrays.toString(bytes2));

        // todo：解码 (编码前和编码后字符集一定要保持一致，否则会乱码)
        String rs = new String(bytes);
        System.out.println(rs);

        String rs2 = new String(bytes2,"GBK");
        System.out.println(rs2);
    }
}
```

结果：

```
默认编码的字符数组长度为29
默认编码数组为：[-28, -67, -96, -27, -113, -111, -28, -69, -69, -28, -67, -96, -27, -113, -111, -17, -68, -116, -24, -128, -127, -27, -83, -112, 106, 97, 118, 97, 56]
gbk编码的字符数组长度为21
gbk编码数组为：[-60, -29, -73, -94, -56, -50, -60, -29, -73, -94, -93, -84, -64, -49, -41, -45, 106, 97, 118, 97, 56]
你发任你发，老子java8
你发任你发，老子java8
```

### 读取文件中的数据编码为字节

```java
// 读取流中数据编码为字节
public class CharSetDemo2 {
    public static void main(String[] args) {
        try (Reader fr = new FileReader("src/com/charset/date02.txt");
             BufferedReader br = new BufferedReader(fr);
        ) {
            String s;
            while ((s = br.readLine()) != null) {
                System.out.println("原始数据：" + s);
                byte[] bytes = s.getBytes("UTF-8");
                System.out.println("编码后的数据: "+Arrays.toString(bytes));

            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

结果：

```java
原始数据：我爱用java
编码后的数据: [-26, -120, -111, -25, -120, -79, -25, -108, -88, 106, 97, 118, 97]
原始数据：人生苦短，我用python
编码后的数据: [-28, -70, -70, -25, -108, -97, -24, -117, -90, -25, -97, -83, -17, -68, -116, -26, -120, -111, -25, -108, -88, 112, 121, 116, 104, 111, 110]
原始数据：dd复唧唧
编码后的数据: [100, 100, -27, -92, -115, -27, -108, -89, -27, -108, -89]
```

