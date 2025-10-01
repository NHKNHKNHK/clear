# 读取属性文件properties

## IO流方式读取

```java
// IO流方式读取Properties配置文件
@Test
public void test() {
    Properties properties = new Properties();
    try (
        // todo 注意：test中读取文件的默认路径为当前module
        FileInputStream fis = new FileInputStream("src/test.properties");
    ) {
        // 将配置文件加载到 Properties实例
        properties.load(fis);

        String name = properties.getProperty("name");
        int age = Integer.parseInt(properties.getProperty("age"));
        System.out.println(name + "  " + age);

    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

## 通过类加载器读取

```java
// 通过类加载器读取Properties配置文件
@Test
public void test2() {
    Properties properties = new Properties();
    try (
        // todo 注意：通过类加载器读取 test中读取文件的默认路径为当前module下的src
        InputStream is = ClassLoader.getSystemClassLoader()
        .getResourceAsStream("test.properties")
    ) {
        // 将配置文件加载到 Properties实例
        properties.load(is);

        String name = properties.getProperty("name");
        int age = Integer.parseInt(properties.getProperty("age"));
        System.out.println(name + "  " + age);

    } catch (FileNotFoundException e) {
        e.printStackTrace();
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

