
# Java IO

## 1 java.io.File 类

-   一个 **File 对象**代表硬盘或网络中可能存在的**一个文件或者文件目录**（俗称文件夹），与平台无关。

-   File类主要是Java为操作文件而设计的相关类

    -   操作如：新建、删除、重命名文件和目录
    -   但 **File 不能访问文件内容本身**。如果需要访问文件内容本身，则需要使用输入/输出流。 

-   File 对象**可以作为参数传递给流的构造器**。 

-   File类的包名为`java.io`，其实现了`Serializable`, `Comparable`两大接口

    -   ```java
        public class File
            implements Serializable, Comparable<File>
        ```

-   File类它是 文件 和 目录路径名 的抽象表示。想要在 Java 程序中表示一个真实存在的文件或目录，那么必须有一个 File 对象

    -   但是Java 程序中的**一个 File 对象，可能没有一个真实存在的文件或目录**。 

### 构造器 

```java
// 以 pathname 为路径创建 File 对象（创建的对象可以是文件，也可以是文件夹）
// 可以是绝对路径或者相对路径，如果 pathname 是相对路径，则默认的当前路径在系统属性 user.dir 中存储。
public File(String pathname)
```

```java
// 以 parent 为父路径，child 为子路径创建 File 对象。child可以是文件，也可以是文件夹
public File(String parent, String child)
```

```java
// 根据一个父 File 对象和子文件路径创建 File 对象 
public File(File parent, String child)
```

```java
// 根据给定的URI创建一个File对象。在Java中，可以使用java.net.URI类来表示URI
public File(URI uri)
```

关于路径： 

-    **绝对路径：**从盘符开始的路径，这是一个完整的路径。 
-    **相对路径：**相对于 项目目录 的路径，这是一个便捷的路径，开发中经常使用。 
    -   IDEA 中，**main** 中的文件的**相对路径，是相对于当前工程**
    -   IDEA 中，**单元测试**方法中的文件的**相对路径，是相对于当前module** 

注意：

如下一个方法，主要是用于确定当前操作系统的路径分隔符，如下

```java
// File.separator 与系统相关的默认分隔符号
public static final String separator
// 因为在Linux中，路径分隔符为 /   
//	在Windows中，路径分隔符为 \
```

例如：

```java
public class FileDemo1 {
    public static void main(String[] args) {
        // todo public File(String pathname)
        // todo 创建File对象：使用绝对路径
        // 创建File对象 (创建的对象可以是文件，也可以是文件夹)
        File file1 = new File("C:/Users/没事我很好/IdeaProjects/test_1/src/com/file_io/text.txt");  // 绝对路径
        System.out.println(file1);  // C:\Users\没事我很好\IdeaProjects\test_1\src\com\file_io\text.txt
        // File.separator 与系统相关的默认分隔符号：方便代码在Windows、Linux等不同普通之间切换的兼容性
        File file2 = new File("C:" + File.separator + "Users" + File.separator + "没事我很好" + File.separator
                + "IdeaProjects" + File.separator + "test_1" + File.separator + "src" + File.separator + "com" + File.separator
                + "file_io" + File.separator + "text.txt");
        System.out.println(file2);  // C:\Users\没事我很好\IdeaProjects\test_1\src\com\file_io\text.txt
          
        // todo 创建File对象：使用相对路径
        // 注意：在idea中，main方法的相对路径是相对于工程
        File file3 = new File("src/com/file_io/text.txt");
        // 获取绝对路径
        System.out.println(file3.getAbsolutePath());  // C:\Users\没事我很好\IdeaProjects\test_1\src\com\file_io\text.txt

        
        // todo public File(String parent, String child) 通过父路径和子路径字符串创建File对象
        // 创建File对象，在 parent 路径下，创建 child，child可以是文件，也可以是路径
        File file4 = new File("src/com/file_io/","text2.txt");
        File file5 = new File("src/com/file_io/","test");
        System.out.println(file4.getAbsolutePath());  // C:\Users\没事我很好\IdeaProjects\test_1\src\com\file_io\text2.txt
        System.out.println(file5.getAbsolutePath());  // C:\Users\没事我很好\IdeaProjects\test_1\src\com\file_io\test

        
        // todo
        // 创建File对象，根据一个父 File 对象和子文件路径创建 File 对象
        File file6 = new File(file5,"file1.txt");
        System.out.println(file6.getAbsolutePath());  // C:\Users\没事我很好\IdeaProjects\test_1\src\com\file_io\test\file1.txt
    }
}
```

注意： 

-   无论该路径下是否存在文件或者目录，都不影响 File 对象的创建。 


-   window 的路径分隔符使用“\”，而 Java 程序中的“\”表示转义字符，所以在 Windows 中表示路径，需要用“\”。或者直接使用“/”也可以，Java 程序支持将“/”当成平台无关的路径分隔符。或者直接使用**File.separator 常量值表示**。比如： 

```java
File file2 = new File("d:" + File.separator + "test" + File.separator + "info.txt"); 
```

-   当构造路径是绝对路径时，那么 getPath 和 getAbsolutePath 结果一样
-   当构造路径是相对路径时，那么 getAbsolutePath 的路径 = user.dir的路径 + 构造路径 

### 常用方法

#### 获取文件和目录基本信息 

```java
public String getName()  // 获取 文件 或 目录 的名称
// 该方法只返回文件或目录的名称，不包括路径信息    
```

```java
public String getPath()  // 获取文件或目录的路径 
    
// 该方法返回的路径可能是绝对路径或相对路径，具体取决于创建 File 对象时指定的路径。  
// 如果定义时使用的是相对路径，那就返回相对路径，定义的是绝对路径，那就返回绝对路径 
// 如果您需要获取文件的绝对路径，请使用 getAbsolutePath() 方法      
```

```java
public String getAbsolutePath()  // 获取文件或目录的绝对路径 
```

```java
public File getAbsoluteFile()  // 获取绝对路径表示的文件 
```

```java
public String getParent()  // 用于获取文件或目录的父目录路径。若无，返回 null 
    
// 如果需要获取文件的绝对路径的父目录路径，请使用 getParentFile().getAbsolutePath() 方法    
```

```java
public long length()  // 获取文件长度（即：字节数）。不能获取目录的长度
```

```java
public long lastModified()  // 获取最后一次的修改时间，毫秒值如果 File 对象代表的文件或目录存在，则 File 对象实例初始化时，就会用硬盘中对应文件或目录的属性信息（例如，时间、类型等）为File 对象的属性赋值，否则除了路径和名称，File 对象的其他属性将会保留默认值。 
```

例如：

```java
// 查看文件和目录的基本信息
public class FileDemo2 {
    public static void main(String[] args) {
        File file1 = new File("src/com/file_io/test/text.txt");
        File file2 = new File("src/com/file_io/test");

        // 获取文件 或 目录名称
        System.out.println(file1.getName());  // text.txt
        System.out.println(file2.getName());  // test

        // 获取文件 或 目录路径
        // todo 如果定义时使用的是相对路径，那就返回相对路径，定义的是绝对路径，那就返回绝对路径
        System.out.println(file1.getPath());  // src\com\file_io\test\text.txt
        System.out.println(file2.getPath());  // src\com\file_io\test

        // 获取文件 或 目录的绝对路径
        System.out.println(file1.getAbsolutePath());  // C:\Users\没事我很好\IdeaProjects\test_1\src\com\file_io\test\text.txt

        // 获取上层文件目录路径，若无，则返回 null
        System.out.println(file1.getParent());  // src\com\file_io\test

        // 返回当前文件的字节数大小
        System.out.println(file1.length());  // 0

        // 获取文件最终修改的时间（时间戳）
        long time = file1.lastModified();
        System.out.println(time);  // 1688463060599
        // 将得到的时间戳格式为我们想看到的时间格式
        System.out.println(new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(time));  // 2023/07/04 17:31:00
    }
}
```

注意：

-   当构造路径是绝对路径时，那么 getPath 和 getAbsolutePath 结果一样
-   当构造路径是相对路径时，那么 getAbsolutePath 的路径 = user.dir的路径 + 构造路径 

#### 列出目录的下一级

```java
public String[] list()  // 返回一个 String 数组，表示该 File 目录中的所有子文件或目录
    
public String[] list(FilenameFilter filter)  // 获取目录中满足指定过滤器条件的文件和目录的名称的 String 数组
```

```java
// 返回一个 File 对象数组，表示该 File 目录中的所有的子文件或目录。
public File[] listFiles()   
    
// 获取目录中满足指定过滤器条件的文件和目录的 File 对象数组    
public File[] listFiles(FileFilter filter)  

// 获取目录中满足指定过滤器条件的文件和目录的 File 对象数组。    
public File[] listFiles(FilenameFilter filter)  
```

相关接口：

```java
package java.io;

@FunctionalInterface
public interface FilenameFilter {
    boolean accept(File dir, String name);
}
```

```java
package java.io;

@FunctionalInterface
public interface FileFilter {
    boolean accept(File pathname);
}
```

例如：

```java
// 测试列出目录的下一级
public class FileDemo3 {
    public static void main(String[] args) {
        File file = new File("src/com/file_io/test");
        // 列出目录的下一级
        String[] list = file.list();
        System.out.println(Arrays.toString(list));  // [text.txt]
        // 返回 .txt 结尾的文件或目录
        String[] list2 = file.list(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return name.endsWith(".txt");
            }
        });
        System.out.println(Arrays.toString(list2));  // [text.txt]


        File[] files = file.listFiles();
        System.out.println(Arrays.toString(files));  // [src\com\file_io\test\text.txt]
        // 只返回大于1M的文件
        File[] files2 = file.listFiles(new FileFilter() {
            @Override
            public boolean accept(File pathname) {
                // 只返回文件大小大于 1MB 的文件
                return pathname.isFile() && pathname.length() > 1024 * 1024;
            }
        });
        System.out.println(Arrays.toString(files2));  // []
        File[] files3 = file.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                // 返回 .txt 结尾的文件或目录
                return name.endsWith(".txt");
            }
        });
        System.out.println(Arrays.toString(files3));  // [src\com\file_io\test\text.txt]
    }
}
```

#### File 类的重命名功能  

```java
public boolean renameTo(File dest)  // 将当前文件或目录重命名为指定的目标文件或目录。 
    
// 该方法只能用于将文件或目录重命名为指定的目标文件或目录，不能用于移动文件或目录的位置。如果需要移动文件或目录的位置，可以使用 
    	Files.move(Path source, Path target, CopyOption... options) 方法    
```

例如：

```java
public class FileDemo4 {
    public static void main(String[] args) {
        File file = new File("src/com/file_io/test/text.txt");
        System.out.println(file.getName());  // text.txt
        // 重命名文件
        boolean flag = file.renameTo(new File("src/com/file_io/test/test2.txt"));
        System.out.println(flag ? "文件名修改成功" : "文件名修改失败");  // 文件名修改成功
        System.out.println(file.getName());  // text.txt

        // 定义一个 File对象 （不存在）
        File file2 = new File("src/com/file_io/no.txt");
        // 重命名一个不存在的文件
        boolean flag2 = file2.renameTo(new File("src/com/file_io/no2.txt"));
        System.out.println(flag2);  // false
    }
}
```

#### 判断功能的方法 

```java
public boolean exists()  // 用于检查文件或目录是否存在 
```

```java
public boolean isDirectory()  // 检查当前 File 对象是否表示一个目录
```

```java
public boolean isFile()  // 检查当前 File 对象是否表示一个文件
```

```java
public boolean canRead()  // 判断是否可读 
```

```java
public boolean canWrite()  // 判断是否可写 
```

```java
public boolean isHidden()  // 判断是否隐藏 
```

例如：

```java
// 测试判断功能相关方法
public class FileDemo5 {
    public static void main(String[] args) {
        File file1 = new File("src/com/file_io/test/text.txt");
        File file2 = new File("src/com/file_io/test");

        // 判断当前抽象路径名表示的file是否存在
        System.out.println(file1.exists());  // true
        File file3 = new File("d:\\ss.txr");
        System.out.println(file3.exists());  // false

        // 判断当前抽象路径名表示的file是否是文件夹
        System.out.println(file1.isDirectory());  // false
        System.out.println(file2.isDirectory());  // true

        // 判断当前抽象路径名表示的file是否是文件
        System.out.println(file1.isFile());  // true
        System.out.println(file2.isFile());  // false

        // 判断是否可读
        System.out.println(file1.canRead());  // true
        System.out.println(file2.canRead());  // true

        // 判断是否可写
        System.out.println(file1.canWrite());  // true
        System.out.println(file2.canWrite());  // true

        // 判断是否隐藏
        System.out.println(file1.isHidden());  // false
        System.out.println(file2.isHidden());  // false
    }
}
```

#### 创建、删除功能

```java
public boolean createNewFile() throws IOException  // 创建文件。若文件存在，则不创建，返回 false。  

// 静态方法，用于创建一个临时文件
//	prefix：临时文件名的前缀。
//	suffix：临时文件名的后缀 
public static File createTempFile(String prefix, String suffix)
        throws IOException

// 静态方法，用于在指定目录中创建一个临时文件
// 	prefix：临时文件名的前缀。
//	suffix：临时文件名的后缀。
//	directory：指定的目录，用于存放临时文件
public static File createTempFile(String prefix, String suffix,File directory)
    	throws IOException
```

```java
// 创建文件目录。如果此文件目录存在，就不创建了。 
// 如果此文件目录的上层目录不存在，也不创建。 
public boolean mkdir()

// 创建文件目录。如果上层文件目录不存在，一并创建（递归创建）。    
public boolean mkdirs()
```

```java
// 删除文件或者文件夹 
// 删除注意事项：
//	Java 中的删除不走回收站，删除直接就从操作系统中消失了
// 	只能删除空目录
public boolean delete()	// 不能判别文件夹不存在、或文件夹不为空导致的删除失败

// 用于在虚拟机终止时删除文件或目录
// 无法保证文件或目录会被成功删除，因为在终止过程中可能会发生异常或其他问题。    
public void deleteOnExit()  // 不能判别文件夹不存在、或文件夹不为空导致的删除失败    

// 注意：deleteOnExit() 方法只会在虚拟机终止时尝试删除文件或目录。如果您需要立即删除文件或目录，可以使用 delete() 方法    
// 不建议使用  deleteOnExit()，因为删除成功与否都没有返回值
    
    
// NIO
Files.delete(Path path) // 返回值 void			// 推荐使用
//	   因为文件夹不存在导致删除失败  ==> NoSuchFileException
//	   因为文件夹不为空导致删除失败  ==> DurectoryNotEmptyException
Files.deleteIfExists(Path path)	 // 返回值 boolean
//	   因为文件夹不存在导致删除失败  ==> false
//	   因为文件夹不为空导致删除失败  ==> DurectoryNotEmptyException 
```

说明：

​	**以上四个方法都只能删除空目录**

例如：

```java
package com.file_io;

import java.io.File;
import java.io.IOException;

// 测试创建、删除文件或目录
public class FileDemo6 {
    public static void main(String[] args) {
        // todo 创建目录
        File file1 = new File("src/com/file_io/dire");
        boolean flag1 = file1.mkdir();
        System.out.println(flag1);  // true
        // todo 创建多级目录
        File file2 = new File("src/com/file_io/dire2/haha");
        boolean flag2 = file2.mkdirs();
        System.out.println(flag2);  // ture
        // todo 删除目录(只能删除空目录)
        file1.delete();
        System.out.println(file2.delete());

        // todo 创建文件
        File file3 = new File("src/com/file_io/file1.txt");
        try {
            boolean flag3 = file3.createNewFile();
            System.out.println(flag3);
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        // todo 删除文件
        file3.delete();
    }
}
```

### demo

#### 递归遍历目录

```java
    public static void main(String[] args) throws IOException {
        File file1 = new File("D:\\clear\\");
        getAllFile(file1);
    }

    /**
     * 递归遍历所有文件
     * @param file
     */
    public static void getAllFile(File file){
        File[] files = file.listFiles();
        // 判断files是否为空
        if (files == null){
            return;
        }
        // 遍历
        for (File f: files) {
            if(f.isDirectory()){  // 如果f是文件夹，递归调用
                getAllFile(f);
            } else {
                System.out.println(f.getAbsolutePath());
            }
        }
    }
```

>   输出
>
>   D:\clear\333\text3.txt
>   D:\clear\333\text4.txt
>   D:\clear\text.txt
>   D:\clear\text2.txt
>   D:\clear\text3.txt
>   D:\clear\text4.txt	

#### 递归删除目录

```java
 public static void main(String[] args) throws IOException {
        File file1 = new File("D:\\clear\\");
        deleteAllFile(file1);
    }

    /**
     * 递归删除所有文件
     * @param file
     */
    public static void deleteAllFile(File file){
        File[] files = file.listFiles();
        // 判断files是否为空
        if (files == null){
            return;
        }
        // 遍历
        for (File f: files) {
            if(f.isDirectory()){  // 如果f是文件夹，递归调用
                deleteAllFile(f);
            } else {
                System.out.println("删除:"+f.getAbsolutePath());
                f.delete();
            }
            f.delete();
        }
    }
```

```
删除:D:\clear\333\text3.txt
删除:D:\clear\333\text4.txt
删除:D:\clear\text.txt
删除:D:\clear\text2.txt
删除:D:\clear\text3.txt
删除:D:\clear\text4.txt 
```

## 2 IO流

### 2.1 IO 流原理及流的分类  

#### Java IO 原理

-   Java 程序中，对于数据的输入/输出操作以 流(stream) 的方式进行，可以看做是一种数据的流动。

-   I/O 流中的 I/O 是 *Input/Output* 的缩写， I/O 技术是非常实用的技术，用于处理设备之间的数据传输。如读/写文件，网络通讯等。 
    -   输入 *input*：读取外部数据（磁盘、光盘等存储设备的数据）到程序（内存）中。 （外部 ==>内存）
    -   输出 *output*：将程序（内存）数据输出到磁盘、光盘等存储设备中。（内存 ==> 外部）

#### 流的分类

`java.io` 包下提供了各种“流”类和接口，用以获取不同种类的数据，并通过标准的方法输入或输出数据。 

按数据的流向不同分为：**输入流**和**输出流**。 

-   **输入流** ：把数据从其他设备上读取到内存中的流。 
    -   以 InputStream、Reader 结尾 
-    **输出流** ：把数据从内存中写出到其他设备上的流。 
    -   以 OutputStream、Writer 结尾 

按操作数据单位的不同分为：**字节流（8bit）**和**字符流（16bit）**。

-   **字节流** ：以字节为单位，读写数据的流。 
    -   以 InputStream、OutputStream 结尾 
-    **字符流** ：以字符为单位，读写数据的流。 
    -   以 Reader、Writer 结尾 

根据 IO 流的角色不同分为：**节点流**和**处理流**。 

-   **节点流**：直接从数据源或目的地读写数据 
-   **处理流**：不直接连接到数据源或目的地，而是“连接”在已存在的流（节点流或处理流）之上，通过对数据的处理为程序提供更为强大的读写功能。 

#### 流的 API

-   Java 的 IO 流共涉及 40 多个类，实际上非常规则，都是从如下 4 个抽象基类派生的。

| （抽象基类、超类） | 输入流      | 输出流       |
| ------------------ | ----------- | ------------ |
| 字节流             | InputStream | OutputStream |
| 字符流             | Reader      | Writer       |

由这四个类派生出来的子类名称都是以其父类名作为子类名后缀。

| 分类       | 字节输入流           | 字节输出流            | 字符输入流        | 字符输出流         |
| ---------- | -------------------- | --------------------- | ----------------- | ------------------ |
| 抽象基类   | InputStream          | OutputStream          | Reader            | Writer             |
| 访问文件   | FileInputStream      | FileOutputStream      | FileReader        | FileWriter         |
| 访问数组   | ByteArrayInputStream | ByteArrayOutputStream | CharArrayReader   | CharArrayWriter    |
| 访问管道   | PipedInputStream     | PipedOutputStream     | PipedReader       | PipedWriter        |
| 访问字符串 |                      |                       | StringRedaer      | StringWriter       |
| **缓冲流** | BufferedInputStream  | BufferedOutputStream  | BufferedReader    | BufferedWriter     |
| 转换流     |                      |                       | InputStreamReader | OutputStreamWriter |
| 对象流     | ObjectInputStream    | ObjectOutputStream    |                   |                    |
|            | FilterInputStream    | FilterOutputStream    | FilterReader      | FilterWriter       |
| 打印流     |                      | PrintStream           |                   | PrintWriter        |
| 推回输入流 | PushbackInputStream  |                       | PushbackReader    |                    |
| 特殊流     | DataInputStream      | DataOutputStream      |                   |                    |

**常用的节点流：** 

-   文件流： FileInputStream、FileOutputStrean、FileReader、FileWriter  

-   字节/字符数组流： ByteArrayInputStream、ByteArrayOutputStream、CharArrayReader、CharArrayWriter  
    -   对数组进行处理的节点流（对应的不再是文件，而是内存中的一个数组）。 

**常用处理流：** 

-   缓冲流：BufferedInputStream、BufferedOutputStream、BufferedReader、BufferedWriter 
    -   作用：增加缓冲功能，避免频繁读写硬盘，进而提升读写效率。 
-   转换流：InputStreamReader、OutputStreamReader 
    -   作用：实现字节流和字符流之间的转换。 
-   对象流：ObjectInputStream、ObjectOutputStream 
    -   作用：提供直接读写 Java 对象功能 

#### IO流应用场景

-   纯文本文件	优先使用字节流
-   图片、视频、音频等二进制文件		优先使用字符流
-   不确定的文件类型	优先使用字节流（万能流）

### 2.2 节点流(文件流)之一：FileReader\FileWriter 

#### Reader 与 Writer

​	Java 提供一些字符流类，以字符为单位读写数据，专门用于处理文本文件。不能操作图片，视频等非文本文件。 

常见的文本文件有如下的格式：.txt、.java、.c、.cpp、.py 等 

注意：.doc、.xls、.ppt 这些都不是文本文件。 

##### 字符输入流：Reader  

`java.io.Reader` 抽象类是表示用于读取字符流的所有类的父类（超类），可以读取字符信息到内存中。

它定义了字符输入流的基本共性功能方法。 

```java
// 从输入流读取一个字符。 虽然读取了一个字符，但是会自动提升为 int 类型。返回该字符的 Unicode 编码值。
// 如果已经到达流末尾了，则返回 -1 
public int read() throws IOException
```

```java
// 从输入流中读取一些字符，并将它们存储到字符数组 cbuf 中 。每次最多读取 cbuf.length 个字符。返回实际读取的字符个数。 
// 如果已经到达流末尾，没有数据可读，则返回-1
public int read(char cbuf[]) throws IOException  
```

```java
// 从输入流中读取一些字符，并将它们存储到字符数组 cbuf 中，从 cbuf[off]开始的位置存储。
// 每次最多读取 len 个字符。返回实际读取的字符个数。
// 如果已经到达流末尾，没有数据可读，则返回 -1
abstract public int read(char cbuf[], int off, int len) throws IOException
```

```java
// 关闭此流并释放与此流相关联的任何系统资源
abstract public void close() throws IOException 
```

注意：

​	**当完成流的操作时，必须调用 close()方法，释放系统资源，否则会造成内存泄漏**。 

##### 字符输出流：Writer

`java.io.Writer` 抽象类是表示用于写出字符流的所有类的超类，将指定的字符信息写出到目的地。

它定义了字节输出流的基本共性功能方法。 

```java
// 写出单个字符
public void write(int c) throws IOException
```

```java
// 写出字符数组
public void write(char cbuf[]) throws IOException
```

```java
// 写出字符数组的某一部分。off：数组的开始索引；len：写出的字符个数
abstract public void write(char cbuf[], int off, int len) throws IOException
```

```java
// 写出字符串
public void write(String str) throws IOException
```

```java
// 写出字符串的某一部分。off：字符串的开始索引；len：写出的字符个数
public void write(String str, int off, int len) throws IOException
```

```java
// 刷新该流的缓冲
abstract public void flush() throws IOException
```

```java
// 关闭此流
abstract public void close() throws IOException
```

注意：

​	**当完成流的操作时，必须调用 close()方法，释放系统资源，否则会造成内存泄漏**。

#### FileReader 与 FileWriter

##### FileReader  

```java
public class FileReader extends InputStreamReader
```

`java.io.FileReader` 类用于读取字符文件，构造时使用系统默认的字符编码和默认字节缓冲区。 

```java
// 创建一个新的 FileReader，给定要读取的文件的名称
public FileReader(String fileName) throws FileNotFoundException  
```

```java
// 创建一个新的 FileReader，给定要读取的 File 对象
public FileReader(File file) throws FileNotFoundException
```

```java
// 创建一个新的 FileReader，给定要读取的 文件描述符fd 
public FileReader(FileDescriptor fd)
```

例如：

```java
/**
 * FileReader:文件字符输入流
 * 作用：以内存为基准，把磁盘文件的数据以字符的形式读入到内存
 * 简单来说，读取文本文件内容到内存中
 *
 * 小结：
 * 字符流一个一个字符的读取文本内容输出，可以解决中文读取乱码问题
 * 字符流很适合操作文本文件内容
 * 但是：一个一个字符的读取文本内容性能较差
 */
public class FileReaderDemo1 {
    @Test
    public void test1() {
        // 目标：每次读取一个字符
        Reader fr = null;
        try {
            // 1.创建一个字符输入流管道与源文件接通
            fr = new FileReader("src/com/io/datas/data03.txt");
            // 2.使用循环读取字符
            int code;
            try {
                while ((code = fr.read()) != -1) {
                    System.out.print((char) code);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } finally {
            try {
                // 关闭相关的流资源，避免出现内存泄漏
                if (fr != null)
                    fr.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        // 小结：使用字符流每次读取一个字符不会出现乱码问题，但是性能很慢
    }

    @Test
    public void test2() {
        // 目标：每次读取一个字符数组
        Reader fr = null;
        try {
            // 1.创建一个字符输入流管道与源文件接通
            fr = new FileReader("src/com/io/datas/data03.txt");
            // 2.使用循环读取，每次读取一个字符数组的数据
            try {
                char[] cbuf = new char[1024];
                int len;  // 记录每次读取的字符数量
                while ((len = fr.read(cbuf)) != -1) {
                    System.out.print(new String(cbuf,0,len) );
                    System.out.println();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } finally {
            try {
                // 关闭相关的流资源，避免出现内存泄漏
                if (fr != null)
                    fr.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        // 小结：使用字符流每次读取一个字符不会出现乱码问题，但是性能很慢
    }
}
```

##### FileWriter

```java
public class FileWriter extends OutputStreamWriter
```

`java.io.FileWriter` 类用于写出字符到文件，构造时使用系统默认的字符编码和默认字节缓冲区。 

```java
//  创建一个新的 FileWriter，给定要读取的文件的名称。 
public FileWriter(String fileName) throws IOException 
```

```java
// 创建一个新的 FileWriter，给定要读取的 File 对象
public FileWriter(File file) throws IOException
```

```java
// 创建一个新的 FileWriter，指明是否在现有文件末尾追加内容
public FileWriter(String fileName, boolean append) throws IOException
```

```java
// 创建一个新的 FileWriter，指明是否在现有文件末尾追加内容
public FileWriter(File file, boolean append) throws IOException
```

```java
// 创建一个新的 FileWriter，给定要读取的 文件描述符fd 
public FileWriter(FileDescriptor fd)
```

例如：

```java
public class FileWriterDemo1 {
    @Test
    public void test1() {
        // 创建一个字符输出流管道与源文件接通+
        Writer fw = null;
        try {
            fw = new FileWriter(new File("src/com/io/datas/out3.txt"));  // 默认覆盖管道,(覆盖写)
            // 每次写一个字符出去
            fw.write('a');
            fw.write('b');
            fw.write('c');
            fw.flush();  // 刷新流
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (fw != null)
                    // 关闭流
                    fw.close();
            } catch (Exception exception) {
                exception.printStackTrace();
            }
        }
    }

    @Test
    public void test2() {
        Writer fw = null;
        try {
            // 追加写
            fw = new FileWriter("src/com/io/datas/out3.txt", true);
            // 每次写一个字符出去
            fw.write('a');
            fw.write('b');
            fw.write(99);  // 输入的是Unicode码
            fw.write('宁');  // 不会报错,是一个字符
            fw.write("\r\n");  // 换行

            // 每次写一个字符串出去
            fw.write("剑道万古如长夜");
            fw.write("\r\n");  // 换行

            // 将字符串一部分写出去
            String str = "剑道万古如长夜";
            fw.write(str, 2, 5);
            fw.write("\r\n");  // 换行

            // 每次写一个字符数组出去
            char[] chars = {'我', '是', '爸', '爸'};
            fw.write(chars);
            fw.write("\r\n");  // 换行

            // 将字符数组一部分写出去
            char[] chars2 = "哈哈哈,人生苦短,我用python".toCharArray();
            fw.write(chars2, 4, 13);
            fw.write("\r\n");  // 换行

            // 刷新流
            fw.flush();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // 关闭流
            try {
                if (fw != null)
                    fw.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

##### 小结  

-   因为出现流资源的调用，为了避免内存泄漏，需要使用 try-catch-finally 处理异常 


-   **对于输入流**来说，**File 类的对象必须在物理磁盘上存在**，**否则**执行就会报 `FileNotFoundException`。如果传入的是一个**目录**，则会报 `IOException` 异常。 

例如：

```java
java.io.FileNotFoundException: text.txt (系统找不到指定的文件。)
```

-   对于输出流来说，File 类的对象是可以不存在的。 
    -   如果 File 类的对象不存在，则可以在输出的过程中，自动创建 File 类的对象 
    -   如果 File 类的对象存在， 如果调用 FileWriter(File file)或 FileWriter(File file,false)，输出时会新建 File 文件覆盖已有的文件 
    -   如果调用 FileWriter(File file,true)构造器，则在现有的文件末尾追加写出内容。 

#### 关于 flush（刷新）

​	因为内置缓冲区的原因，如果 FileWriter 不关闭输出流，无法写出字符到文件中。但是关闭的流对象，是无法继续写出数据的。如果我们既想写出数据，又想继续使用流，就需要 *flush()* 方法了。 

```java
// 刷新缓冲区，流对象可以继续使用
abstract public void flush() throws IOException
```

```java
// 先刷新缓冲区，然后通知系统释放资源。流对象不可以再被使用了
abstract public void close() throws IOException
```

注意：

​	即便是 flush()方法写出了数据，操作的最后还是要调用 close 方法，释放系统资源。 


### 2.3 节点流之二：FileInputStream\FileOutputStream

如果我们读取或写出的数据是非文本文件，则 Reader、Writer 就无能为力了，必须使用字节流。 

#### InputStream 和 OutputStream

##### 字节输入流：InputStream  

`java.io.InputStream` 抽象类是表示字节输入流的所有类的超类，可以读取字节信息到内存中。

它定义了字节输入流的基本共性功能方法。 

```java
// 从输入流读取一个字节。返回读取的字节值。虽然读取了一个字节，但是会自动提升为 int 类型。
// 如果已经到达流末尾，没有数据可读，则返回-1
public abstract int read() throws IOException
```

```java
//  从输入流中读取一些字节数，并将它们存储到字节数组 b 中 。每次最多读取 b.length 个字节。
// 返回实际读取的字节个数。如果已经到达流末尾，没有数据可读，则返回-1
public int read(byte b[]) throws IOException
```

```java
// 从输入流中读取一些字节数，并将它们存储到字节数组 b 中，从 b[off]开始存储，每次最多读取 len 个字节 。 
// 返回实际读取的字节个数。如果已经到达流末尾，没有数据可读，则返回-1
public int read(byte b[], int off, int len) throws IOException
```

```java
// 关闭此输入流并释放与此流相关联的任何系统资源。 
public void close() throws IOException
```

说明：

​	close()方法，当完成流的操作时，必须调用此方法，释放系统资源。

##### **字节输出流：OutputStream**  

`java.io.OutputStream` 抽象类是表示字节输出流的所有类的超类，将指定的字节信息写出到目的地。

它定义了字节输出流的基本共性功能方法。 

```java
// 将指定的字节输出流。虽然参数为 int 类型四个字节，但是只会保留一个字节的信息写出
public abstract void write(int b) throws IOException
```

```java
// 将 b.length 字节从指定的字节数组写入此输出流。 
public void write(byte b[]) throws IOException
```

```java
// 从指定的字节数组写入 len 字节，从偏移量 off 开始输出到此输出流。  
public void write(byte b[], int off, int len) throws IOException
```

```java
// 刷新此输出流并强制任何缓冲的输出字节被写出
public void flush() throws IOException
```

```java
// 关闭此输出流并释放与此流相关联的任何系统资源。 
public void close() throws IOException
```

说明：

​	close()方法，当完成流的操作时，必须调用此方法，释放系统资源。 

#### FileInputStream 与 FileOutputStream

##### FileInputStream

`java.io.FileInputStream`是Java中用于从文件中**读取字节流**的类。它继承自InputStream类，并提供了一系列方法来读取文件中的数据。

**常用构造器**

```java
// 通过打开与实际文件的连接来创建一个FileInputStream ，该文件由文件系统中的 File 对象 file 命名
public FileInputStream(File file) throws FileNotFoundException
```

```java
// 通过打开与实际文件的连接来创建一个 FileInputStream，该文件由文件系统中的路径名 name 命名
public FileInputStream(String name) throws FileNotFoundException
```

```java
public FileInputStream(FileDescriptor fdObj)
```

**常用方法**

```java
// 从输入流中读取一个字节的数据，并返回读取的字节值。如果已到达文件末尾，则返回-1
public int read() throws IOException

// 从输入流中读取一定数量的字节，并将其存储到指定的字节数组b中。返回实际读取的字节数
public int read(byte b[]) throws IOException

public int read(byte b[], int off, int len) throws IOException
```

```java
// 返回输入流中可读取的字节数
public native int available() throws IOException
```

```java
// 跳过n个字节的数据，继续读取后续的数据
public native long skip(long n) throws IOException
```

```java
// 关闭输入流，释放相关资源
public void close() throws IOException
```

注意：

​	在使用FileInputStream时，需要处理可能抛出的IOException异常，并在使用完毕后关闭流资源，以确保文件的正确读取和释放资源

例如：

```java
@Test
public void test1() {
    // 创建一个文件字节输入流管道与源文件接通
    InputStream is = null;
    try {
        // todo 在单元测试中，相对路径是相对于模块
        is = new FileInputStream("src/data/再别康桥.txt");
        // 从输入流中读取一个字节的数据，并返回读取的字节值。如果已到达文件末尾，则返回-1
        // public abstract int read() throws IOException;
        int b1 = is.read();
        System.out.print((char) b1);
        int b2 = is.read();
        System.out.print((char) b2);
    } catch (FileNotFoundException e) {
        throw new RuntimeException(e);
    } catch (IOException e) {
        throw new RuntimeException(e);
    } finally {
        try {
            if (is != null)
                is.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}


// 应该使用 try-catch-finally 处理异常。这里出于方便阅读代码，使用了throws* 的方式
@Test
public void test2() throws IOException {
    // 采用循环读取
    // 性能慢
    // 无法解决中文乱码问题
    InputStream is = new FileInputStream(new File("src/data/再别康桥.txt"));
    int b;
    while ((b = is.read()) != -1) {
        System.out.print((char) b);
    }
    is.close();
}


// 目标：使用文件字节输入流每次读取一个字节数组
@Test
public void test3() throws IOException {
    // 创建一个文件字节输入流管道与源文件接通
    InputStream is = new FileInputStream("src/data/再别康桥.txt");
    // 定义一个字节数组，用于读取字节
    byte[] buffer = new byte[3];
    int len = is.read(buffer);
    System.out.println("读取了几个字节:" + len);
    // 将字节数组解码，并打印
    System.out.println(new String(buffer));
    is.close();
}


@Test
public void test4() throws IOException {
    // 创建一个文件字节输入流管道与源文件接通
    InputStream is = new FileInputStream("src/data/再别康桥.txt");
    // 定义一个字节数组，用于读取字节
    byte[] buffer = new byte[3];
    // 使用循环改进，读取每一个字节数组
    int len;
    while ((len = is.read(buffer)) != -1) {
        // 将字节数组解码，并打印
        System.out.println(new String(buffer, 0, len));
    }  // 性能慢，依旧无法解决中文乱码问题
    is.close();
}

// 使用一个文件字节流一次性读取文件的全部的字节，可以解决中文乱码问题
@Test
public void test5() throws IOException {
    File file = new File("src/data/再别康桥.txt");
    InputStream is = new FileInputStream(file);
    // 定义一个与文件大小一样的字节数组
    byte[] buffer = new byte[(int) file.length()];
    // 读取
    int len = is.read(buffer);
    System.out.println("读取了多少个字节：" + len);
    System.out.println("文件大小:" + file.length());
    System.out.println(new String(buffer));
}

// JDK9中解决FileInputStream中文乱码问题
@Test
public void test6() throws IOException {
    File file = new File("src/data/再别康桥.txt");
    InputStream is = new FileInputStream(file);

    // 官方 读取全部字节数组
    byte[] buffer = is.readAllBytes();  // 来自jdk1.9
    System.out.println(new String(buffer,0,buffer.length));
}
// 在后续会有更好的方法解决FileInputStream中文乱码问题
```

##### FileOutputStream

`java.io.FileOutputStream` 类是文件输出流，用于将数据写出到文件。 

**常用构造器**

```JAVA
// 创建文件输出流，写出由指定的 File 对象表示的文件。 
public FileOutputStream(File file) throws FileNotFoundException

// 创建文件输出流，指明是否在现有文件末尾追加内容。 
public FileOutputStream(File file, boolean append)
        throws FileNotFoundException
```

```JAVA
// 创建文件输出流，指定的名称为写出文件。 
public FileOutputStream(String name) throws FileNotFoundException

public FileOutputStream(String name, boolean append)
    throws FileNotFoundException
```

```java
public FileOutputStream(FileDescriptor fdObj)
```

**常用方法**

```java
// 将指定的字节写入输出流。b为要写入的字节值
public void write(int b) throws IOException 

// 将指定的字节数组b中的数据写入输出流
public void write(byte b[]) throws IOException

public void write(byte b[], int off, int len) throws IOException
```

```java
// 刷新输出流，将缓冲区中的数据立即写入文件
// 父类OutputStream的方法
public void flush() throws IOException
```

```java
// 关闭输出流，释放相关资源。
public void close() throws IOException
```

注意：

​	在使用FileOutputStream时，需要处理可能抛出的IOException异常，并在使用完毕后关闭流资源，以确保数据的正确写入和释放资源。

例如：

```java
@Test
public void test1() throws IOException {
    // 1.创建一个文件字节输出流管道与目标文件接通
    // todo 默认是覆盖写
    OutputStream os = new FileOutputStream("src/data/os-data.txt");
    // 2.写数据出去
    // public void write(int a) 写一个字节出去
    os.write('a');
    os.write('b');
    os.flush();  // 刷新流
    // os.close();  // 关闭流
    os.write('s');  // 关闭流后不能继续写出去

    // public void write(byte[] b) 写一个字节数组出去
    byte[] bt = {'c', 'd', 'e', 'f'};
    os.write(bt);

    // public void void write(byte[] b,int off,int len) 写一个字节数组的一部分出去
    byte[] bt2 = {'g', 'h', 'i', 'j'};
    os.write(bt2, 1, 2);
    os.close();
}
```



### 2.4 释放资源的方式

#### try-catch-finally

基本语法

```java
try{
   ...
} catch(IOException e){
    e.printStackTrace();
} finally{
    ...
    // 无论try中的代码块是否正常执行或异常终止，finally代码块中的语句一定会执行，除非JVM终止。
}
// 注：不建议在finally里写return
```

说明：

​	try-catch-finally语句一般用于在程序执行完以后，进行资源的释放操作

#### try-with-resource

JDk1.7提供的更简单的资源释放方案：try-with-resource （简化代码，提高程序的可读性，避免资源泄露问题）

​	try-with-resources 是Java中的一种语法结构，**用于自动关闭实现了AutoCloseable接口的资源**。它可以在try语句块中声明和初始化资源，并在try语句块执行完毕后自动关闭这些资源，无需手动调用close()方法

基本语法

```java
try(定义资源1; 定义资源2;...) {	// 这些资源使用完毕后，会自动调用其close方法，完成对资源的关闭
     可能出现异常的代码;
} catch(异常类名 变量名) {
     异常的处理代码;
}
```

注意：

-   try()括号中，只能放置资源对象，用完会自带关闭
-   当try语句块执行完毕后，无论是否发生异常，系统会自动调用资源的close()方法来关闭资源。如果同时有多个资源需要关闭，它们的关闭顺序与声明的顺序相反
-   自带关闭：自带调用资源对象的**close**方法关闭资源（即使出现异常也会关闭）
-   资源就是实现AutoCloseable接口的类的对象

例如：

```java
public class TryCatchResouceCopyDemo2 {
    public static void main(String[] args) {
        try (
                // 这里只能放置资源对象，用完会自带关闭
                // 自带关闭：自带调用资源对象的close方法关闭资源（即使出现异常也会关闭）
                // 1.创建字节输入流管道与原文件接通
                InputStream is = new FileInputStream("src/data/再别康桥.txt");
                // 2.创建字节输出流管道与目标文件接通
                OutputStream os = new FileOutputStream("src/data/轻轻的我走了.txt");
                // int a = 1; 会报错，因为try()里只能放置资源对象
                // 资源就是实现 AutoCloseable 接口的类的对象
        ) { // 3.定义一个字节数组转移数据
            byte[] buffer = new byte[1024];
            int len;  // 记录每次读取的字节数
            while ((len = is.read(buffer)) != -1) {
                os.write(buffer, 0, len);
            }
            System.out.println("复制完成!");
            // System.out.println(10/0);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```



### 处理流之一：缓冲流

​	缓冲流是Java中用于提高IO性能的一种流。它**通过在内存中创建缓冲区来减少实际IO操作的次数，从而提高读写数据的效率**。

Java API 提供了带缓冲功能的流类：缓冲流。 

**缓冲流要“套接”在相应的节点流之上**，根据数据操作单位可以把缓冲流分为： 

-   **字节缓冲流**：`BufferedInputStream`和`BufferedOutputStream`
    -   这两个类分别**继承自 InputStream 和 OutputStream**，它们在读取和写入数据时使用了内部缓冲区。
    -   当我们使用BufferedInputStream读取数据时，它会一次性从底层输入流中读取一块数据到缓冲区，然后逐个字节地从缓冲区中返回数据。
    -   类似地，当我们使用BufferedOutputStream写入数据时，它会先将数据写入缓冲区，当缓冲区满了或者调用了flush()方法时，才会将缓冲区中的数据一次性写入底层输出流。
-   **字符缓冲流**：`BufferedReader `和` BufferedWriter`
    -   这两个类分别**继承自Reader和Writer**，它们在读取和写入字符数据时使用了内部缓冲区
    -   BufferedReader提供了**readLine()**方法，可以**一次读取一行**文本数据，而不是逐个字符地读取
    -   BufferedWriter则提供了**write()**方法，可以**一次写入一行**文本数据。

缓冲流的基本原理：

​	在创建流对象时，内部会创建一个缓冲区数组（缺省使用 8192 个字节(8Kb)的缓冲区），通过缓冲区读写，减少系统 IO 次数，从而提高读写的效率。

#### 字节缓冲流

提高字节流的读写性能

原理：字节缓冲输入流和字节缓冲输出流都默认自带了8KB（8192byte）的缓冲池。

##### **BufferedInputStream 类**

把低级（原流）的字节输入流包装成一个高级的缓冲字节输入流，从而提高读数据的性能

```java
// 创建一个使用默认缓冲区大小的BufferedInputStream对象
public BufferedInputStream(InputStream in)
 
// 创建一个指定缓冲区大小的BufferedInputStream对象   
public BufferedInputStream(InputStream in, int size)
```

说明：

​	使用BufferedInputStream时，可以通过设置合适的缓冲区大小来平衡内存占用和读取性能。一般来说，较大的缓冲区可以提高读取性能，但会占用更多的内存，所以一般情况下我们不设置缓冲区大小，使用默认的即可

**常用方法**

```java
// 从输入流中读取一个字节，并返回读取的字节数据。如果已经到达流的末尾，则返回-1
public synchronized int read() throws IOException

// 从输入流中读取最多len个字节的数据，并将其存储在字节数组b中，从偏移量off开始存储。返回实际读取的字节数。如果已经到达流的末尾，则返回-1
public synchronized int read(byte b[], int off, int len) throws IOException
```

```java
// 在当前位置设置标记，以便后续调用reset()方法可以重新定位到该位置
public synchronized void mark(int readlimit)
    
// 将输入流的位置重置为最后一次调用mark()方法时的位置
public synchronized void reset() throws IOException
```

```java
// 关闭输入流
public void close() throws IOException 
// 注意：调用此方法时，BufferedInputStream 内包装的流也会被关闭，无需手动关闭
```

##### **BufferedOutputStream 类**

把低级（原流）的字节输出流包装成一个高级的缓冲字节输出流，从而提高写数据的性能

```java
//  创建一个新的字节型的缓冲输出流。 
public BufferedOutputStream(OutputStream out)

public BufferedOutputStream(OutputStream out, int size)
```

**常用方法**

```java
// 将指定的字节写入缓冲输出流
public synchronized void write(int b) throws IOException 

// 将指定字节数组的一部分写入缓冲输出流
public synchronized void write(byte b[], int off, int len) throws IOException 
```

```java
// 刷新缓冲输出流，将缓冲区中的数据写入底层输出流
public synchronized void flush() throws IOException
```

```java
// 关闭缓冲输出流，释放相关资源
public void close() throws IOException
```

例如：

```java
public class ByteBufferDemo1 {
    public static void main(String[] args) {
        try (
                // 1.创建字节输入流管道与原文件接通
                InputStream is = new FileInputStream("src/data/再别康桥.txt");
                // a.把原始的字节输入流包装成高级的缓冲字节输入流
                InputStream bis = new BufferedInputStream(is);
                // 2.创建字节输出流管道与目标文件接通
                OutputStream os = new FileOutputStream("C:\\Users\\admin\\Desktop\\再别康桥.txt");
                // b.把原始的字节输出流包装成高级的缓冲字节输出流
                OutputStream bos = new BufferedOutputStream(os);

        ) { // 3.定义一个字节数组转移数据
            byte[] buffer = new byte[1024];
            int len;  // 记录每次读取的字节数
            while ((len = bis.read(buffer)) != -1) {
                bos.write(buffer, 0, len);
            }
            System.out.println("复制完成!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### 字符缓冲流

原理：自带8k（8192）的字符缓冲池，可以提高字符输入输出的性能

##### **BufferedReader 类**

把低级（原流）的字符输入流包装成一个高级的缓冲字符输入流，从而提高字符输入流读字符数据的性能

```java
// 创建一个使用默认缓冲区大小的BufferedReader对象。
public BufferedReader(Reader in)

// 创建一个使用指定缓冲区大小的BufferedReader对象。    
public BufferedReader(Reader in, int sz)
```

**常用方法**

```java
// 读取单个字符并返回其 ASCII 值，如果已到达流的末尾，则返回 -1
public int read() throws IOException

// 将字符读入数组的一部分，并返回实际读取的字符数。
public int read(char cbuf[], int off, int len) throws IOException
```

```java
// 跳过指定数量的字符
public long skip(long n) throws IOException
```

```java
// 在当前位置设置标记，以便将来调用 reset() 方法时返回到该位置。
public void mark(int readAheadLimit) throws IOException

// 将流的位置重置为上次调用 mark() 方法时的位置
public void reset() throws IOException
```

```java
// 关闭缓冲输入流，释放相关资源
public void close() throws IOException
```

**新增的方法**

```java
// 读取一行文本并返回一个字符串，如果已到达流的末尾，则返回 null
public String readLine() throws IOException
```

注意：

​	如果要使用字符缓冲输入流的新增方法，则不能使用多态的方式

##### BufferedWriter 类

把低级（原流）的字符输出流包装成一个高级的缓冲字符输出流，从而提高字符输出流写数据的性能

```java
// 创建一个使用默认缓冲区大小的BufferedWriter对象。
public BufferedWriter(Writer out)

// 创建一个使用指定缓冲区大小的BufferedWriter对象。        
public BufferedWriter(Writer out, int sz)
```

**常用方法**

```java
// 将指定的字符串写入缓冲输出流
public void write(int c) throws IOException
```

```java
// 刷新缓冲输出流，将缓冲区中的数据立即写入到目标设备中
public void flush() throws IOException
```

```java
// 关闭缓冲输出流，释放相关资源
public void close() throws IOException
```

**新增的方法**

```java
// 写入一个行分隔符。根据系统的不同，行分隔符可能是 \n、\r\n 或 \r。
public void newLine() throws IOException
```

例如：

```java
/**
 * 目标：学会使用缓冲字符输入流，提高字符输入流的性能(经典代码)
 * 新增了按行读取的方法
 */
public class CharBufferReaderDemo1 {
    public static void main(String[] args) {
        try ( // 目标：每次读取一个字符数组
              // 1.创建一个字符输入流管道与源文件接通
              Reader fr = new FileReader("src/data/再别康桥.txt");
              // a.把低级的字符输入流包装成高级的缓冲字符输入流
              BufferedReader br = new BufferedReader(fr);
        ) {
            String line ;  // 记录每次读取
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

```java
/**
 * 目标：学会使用缓冲字符输出流，提高字符输出流的性能(经典代码)
 * 新增了换行的方法
 */
public class CharBufferWriterDemo1 {
    public static void main(String[] args) throws Exception {
        // 创建一个字符输出流管道与源文件接通
        // Writer fw = new FileWriter("src/out3.txt");  // 默认覆盖管道,(覆盖写)
        // 追加写
        Writer fw = new FileWriter("src/data/out3.txt", true);
        BufferedWriter bw = new BufferedWriter(fw);

        // public void write(int c) throws IOException
        // 每次写一个字符出去
        bw.write('a');
        bw.write('b');
        bw.write(99);
        bw.write('宁');  // 不会报错,是一个字符
        bw.newLine();  // 换行  bw.write("\r\n");

        // 每次写一个字符串出去
        bw.write("剑道万古如长夜");
        bw.newLine();  // 换行

        // 将字符串一部分写出去
        String str = "剑道万古如长夜";
        bw.write(str, 2, 5);
        bw.newLine();  // 换行

        // 每次写一个字符数组出去
        char[] chars = {'我', '是', '爸', '爸'};
        bw.write(chars);
        bw.newLine();  // 换行

        // 将字符数组一部分写出去
        char[] chars2 = "哈哈哈,人生苦短,我用python".toCharArray();
        bw.write(chars2, 4, 13);
        bw.newLine();  // 换行

        // 刷新流
        bw.flush();
        // 关闭流
        bw.close();
    }
}
```

```java
/**
 * 目标：完成出师表顺序的恢复，并存入另一个文件中
 */
public class BufferCharTest3 {
    public static void main(String[] args) {
        try (  // 1.创建缓冲字符输入流与源文件接通
               BufferedReader br = new BufferedReader(new FileReader("src/csb.txt"));
               // 5.定义缓冲字符输出流管道与目标文件接通
               BufferedWriter bw = new BufferedWriter(new FileWriter("src/csb_sort.txt"));
        ) {

            // 2.定义一个List集合，存储每行内容
            List<String> date = new ArrayList<>();
            // 3.定义一个循环读取文件
            String line;  // 存放每次读取行的内容
            while ((line = br.readLine()) != null) {
                date.add(line);
            }
            System.out.println(date);
            // 4.对集合中的数据进行排序
            // 自定义排序规则（按照每行前面的第一个字符排序）

            List<String> sizes = new ArrayList<>();
            Collections.addAll(sizes, "一", "二", "三", "四", "五", "六", "七", "八", "九");

            Collections.sort(date,
                    new Comparator<String>() {
                        @Override
                        public int compare(String o1, String o2) {
                            return sizes.indexOf(o1.substring(0, o1.indexOf(".")))
                                    - sizes.indexOf(o2.substring(0, o2.indexOf(".")));
                        }
                    });
            System.out.println(date);

            // 6.遍历集合中每行文章，并写出去（注意换行）
            for (String datum : date) {
                bw.write(datum);
                bw.newLine();  // 换行
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

##### 原始流与缓冲流效率对比

​	在Java中，原始流（Raw Stream）和缓冲流（Buffered Stream）是用于读写数据的两种不同的流类型。

​	原始流是最基本的流类型，用于直接读写数据。它提供了最底层的读写操作，每次读写都会直接操作底层的数据源（如文件、网络连接等）。原始流的读写操作是直接的，没有进行任何缓冲，因此每次读写都会导致实际的IO操作，效率较低。

​	**缓冲流是在原始流的基础上添加了缓冲功能的流类型**。它通过在内存中创建一个缓冲区，将数据先写入缓冲区，然后再批量地将缓冲区的数据写入底层的数据源。同样地，对于读操作，缓冲流会先将数据读入缓冲区，然后从缓冲区中读取数据。缓冲流的读写操作是批量的，减少了实际的IO操作次数，提高了读写的效率。

​	使用缓冲流可以有效地减少IO操作的次数，提高读写的效率。特别是在处理大量数据时，缓冲流的性能优势更加明显。缓冲流适用于大多数读写场景，可以用于读写文件、网络连接等。

​	在Java中，常见的缓冲流包括 BufferedInputStream、BufferedOutputStream、BufferedReader和BufferedWriter等。它们都是**基于原始流（如FileInputStream、FileOutputStream、FileReader和FileWriter等）进行封装的，提供了更高效的读写操作**。

演示：

```java
/**
 * 对比原始流与缓冲流的效率
 */
public class Test2 {
    private String SRC_PATH = "D:\\test\\CentOS-7-x86_64-Minimal-1810.iso";
    private String DEST_PATH = "D:\\test\\CentOS-7.iso";

    /**
     * 使用原始流进行文件拷贝
     *
     * @param srcPath
     * @param destPath
     */
    public static void copyFileWithFileStream(String srcPath, String destPath) {
        try (
                FileInputStream fis = new FileInputStream(new File(srcPath));
                FileOutputStream fos = new FileOutputStream(new File(destPath));
        ) {
            byte[] buffer = new byte[128];
            int len;  // 记录每次读入到 buffer 中字节的个数
            while ((len = fis.read(buffer)) != -1) {
                fos.write(buffer, 0, len);
            }
            System.out.println("拷贝完成");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 使用 FileInputStream\FileOutputStream 实现非文本文件的拷贝
    @Test
    public void test1() {
        long start = System.currentTimeMillis();
        copyFileWithFileStream(SRC_PATH, DEST_PATH);
        long end = System.currentTimeMillis();
        System.out.println("拷贝时间：" + (end - start) / 1000.0 + "s");  // 拷贝时间：25.125s
    }

    /**
     * 使用缓冲流进行文件拷贝
     * @param srcPath
     * @param destPath
     */
    public static void copyFileWithBufferedStream(String srcPath, String destPath) {
        try (
                FileInputStream fis = new FileInputStream(new File(srcPath));
                FileOutputStream fos = new FileOutputStream(new File(destPath));
                BufferedInputStream bis = new BufferedInputStream(fis);
                BufferedOutputStream bos = new BufferedOutputStream(fos);
        ) {
            byte[] buffer = new byte[128];
            int len;  // 记录每次读入到 buffer 中字节的个数
            while ((len = bis.read(buffer)) != -1) {
                bos.write(buffer, 0, len);
            }
            System.out.println("拷贝完成");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    // 使用BufferedInputStream\BufferedOuputStream 实现非文本文件的复制
    @Test
    public void test2() {
        long start = System.currentTimeMillis();
        copyFileWithBufferedStream(SRC_PATH, DEST_PATH);
        long end = System.currentTimeMillis();
        System.out.println("拷贝时间：" + (end - start) / 1000.0 + "s");  // 拷贝时间：1.593s
    }
}
```

##### 字符缓冲流特有方法

字符缓冲流的基本方法与普通字符流调用方式一致，不再阐述，我们来看它们具备的特有方法。 

BufferedReader：

```java
// 读取一行文本并返回一个字符串，如果已到达流的末尾，则返回 null
public String readLine() throws IOException
```

BufferedWriter：

```JAVA
// 写入一个行分隔符。根据系统的不同，行分隔符可能是 \n、\r\n 或 \r。
public void newLine() throws IOException
```

### 处理流之二：转换流

​	在 Java 中，转换流（Transcoder Stream）是**用于在字节流和字符流之间进行转换**的流类型。它提供了将字节流转换为字符流和将字符流转换为字节流的功能

Java中的**转换流包括两个类**

-   `InputStreamReader`：用于**将字节流转换为字符流**。它继承自`Reader`类，可以接收一个字节输入流作为参数，并将其转换为字符输入流。可以指定字符集来进行**解码**操作。
    -   字节输入流 ===> 字符输入流
-   `OutputStreamWriter`：用于**将字节流转换为字符流**。它继承自`Writer`类，可以接收一个字节输出流作为参数，并将其转换为字符输出流。可以指定字符集来进行**编码**操作。
    -   字节输出流 ===> 字符输出流

使用转换流的常见操作包括：

-   **创建转换流对象**：通过实例化`InputStreamReader`或`OutputStreamWriter`类来创建转换流对象。需要传入相应的字节流对象作为参数。
-   **指定字符集**：可以使用构造函数或`setEncoding()`方法来指定字符集。如果不指定字符集，默认使用平台的默认字符集。
-   **读取和写入数据**：使用转换流对象的`read()`和`write()`方法来读取和写入数据。`read()`方法返回一个字符或字符数组，`write()`方法接收一个字符或字符数组作为参数。
-   **关闭流**：使用`close()`方法关闭转换流对象。**关闭转换流会自动关闭底层的字节流**。

**注意：**

​	在 Java 中，字节流可以转换为字符流，而**字符流不能直接转换为字节流**。这是因为字符流是基于字节流的高级流，它提供了更方便的字符处理功能，包括字符编码和解码的功能。

​	字符流不能直接转换为字节流的原因是字符流中的字符可能包含多个字节，而字节流是以字节为单位进行读写的。因此，将字符流直接转换为字节流可能会导致字符的丢失或错误的解码。

**转换流作用：**

​	**转换流是字节与字符间的桥梁！**

#### InputStreamReader 与 OutputStreamWriter

##### 字符输入转换流：InputStreamReader

​	转换流 `java.io.InputStreamReader`，是 Reader 的子类，是**从字节流到字符流**的桥梁。它读取字节，并使用指定的字符集将其解码为字符。它的字符集可以由名称指定，也可以接受平台的默认字符集。 

解决不同编码时，字符流读取文本内容乱码的问题。

解决思路：

​	先获取文件的原始字节流，再将其按真实的字符集编码转化为字符输入流，这样字符输入流中的字符就不乱码了

**常用构造器**  

```java
// 创建一个使用默认字符集的InputStreamReader对象，将指定的字节输入流转（原始流）换为字符输入流
public InputStreamReader(InputStream in)
    
// 创建一个指定字符集的InputStreamReader对象，将指定的字节输入流转换为字符输入流    
public InputStreamReader(InputStream in, String charsetName)     	// 推荐使用
        throws UnsupportedEncodingException 
        
public InputStreamReader(InputStream in, Charset cs)  
    
public InputStreamReader(InputStream in, CharsetDecoder dec)    
```

例如：

```java
public class InputStreamReaderDemo1 {
    public static void main(String[] args) {
        try (
                // 1.得到文件的原始字节流
                // 注意：date02.txt文件编码为 GBK
                InputStream is = new FileInputStream("src\\date02.txt");
                // 2.把原始的字节输入流以指定的字符集编码（GBK）转换成字符输入流（完美解决编码问题）
                Reader isr = new InputStreamReader(is,"GBK");
                // 3.把字符输入流包装成缓冲字符输入流（提升性能）
                BufferedReader br = new BufferedReader(isr);
        ) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

##### **字符输出转换流：OutputStreamWriter** 

​	转换流 `java.io.OutputStreamWriter`，是 Writer 的子类，是**从字符流到字节流**的桥梁。使用指定的字符集将字符编码为字节。它的字符集可以由名称指定，也可以接受平台的默认字符集。 

控制写出去的字符使用什么字符集编码，两种方式：

-   使用 String 提供的getBytes 方法解决

```java
String data = "人生苦短，我用Java";
byte[] bytes = data.getBytes("GBK");
```

-   使用 字符输出转换流 OutputStreamWriter 解决

解决思路：

​	先获取字节输出流，再按照指定的字符集编码将其转化为字符输出流，之后写出去的字符就会用该字符集编码了

**常用构造器**

```java
// 创建一个使用默认字符集的OutputStreamWriter对象，将指定的字节输出流转换为字符输出流。
public OutputStreamWriter(OutputStream out)

// 创建一个使用指定字符集的OutputStreamWriter对象，将指定的字节输出流转换为字符输出流。charsetName参数是字符集的名称，例如："UTF-8"。
public OutputStreamWriter(OutputStream out, String charsetName)		// 推荐使用
        throws UnsupportedEncodingException

// 创建一个使用指定字符集的OutputStreamWriter对象，将指定的字节输出流转换为字符输出流。cs参数是Charset对象，用于指定字符集。
public OutputStreamWriter(OutputStream out, Charset cs)

// 创建一个使用指定字符编码器的OutputStreamWriter对象，将指定的字节输出流转换为字符输出流。enc参数是CharsetEncoder对象，用于指定字符编码器。
public OutputStreamWriter(OutputStream out, CharsetEncoder enc)
```

例如：

```java
public class OutputStreamWriterDemo2 {
    public static void main(String[] args) {
        try (// 1.定义一个字节输出流
             OutputStream os = new FileOutputStream("src/out04.txt");
             // 2.把原始的字节输出流以指定字符集编码（GBK）转化为字符输出流
             Writer osw = new OutputStreamWriter(os, "GBK");
             // 3.把低级的字符输出流包装成高级的缓冲字符输出流（提升性能）
             BufferedWriter bw = new BufferedWriter(osw);
        ) {
            bw.write("人生苦短，我用Java");
            bw.write("人生苦短，我用Java");
            bw.write("人生苦短，我用Java");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### **字符编码和字符集** 

​	字符编码和字符集是与字符和字节之间的转换相关的概念。

​	字符集（Character Set）是一个字符的集合，它定义了字符与数字之间的映射关系。常见的字符集有ASCII、ISO-8859-1、UTF-8等。每个字符集都有一个唯一的名称，例如UTF-8、GBK等。

​	字符编码（Character Encoding）是将字符集中的字符转换为字节的规则或算法。它定义了字符与字节之间的对应关系。字符编码将字符映射为字节序列，以便在计算机中存储和传输。常见的字符编码有ASCII、UTF-8、UTF-16等。

​	字符集和字符编码之间的关系是：字符集定义了一组字符，而字符编码定义了如何将这些字符映射为字节序列。

​	例如，字符集UTF-8定义了一组Unicode字符，而UTF-8编码规则定义了如何将这些字符转换为字节序列。在UTF-8编码中，每个字符可能由1到4个字节表示。

​	在Java中，字符编码和字符集的概念通常与`java.nio.charset`包中的`Charset`和`CharsetEncoder`相关类一起使用。`Charset`类表示字符集，`CharsetEncoder`类表示字符编码器。

​	当我们需要在字符数据和字节数据之间进行转换时，需要指定要使用的字符集或字符编码。例如，使用`OutputStreamWriter`将字符流转换为字节流时，可以指定要使用的字符集。同样，使用`InputStreamReader`将字节流转换为字符流时，也可以指定要使用的字符集。

正确的字符编码和字符集的选择非常重要，以确保字符数据在不同系统和应用程序之间的正确传输和解析。

##### **编码与解码**  

​	计算机中储存的信息都是用*二进制数*表示的，而我们在屏幕上看到的数字、英文、标点符号、汉字等字符是二进制数转换之后的结果。按照某种规则，将字符存储到计算机中，称为**编码** 。反之，将存储在计算机中的二进制数按照某种规则解析显示出来，称为**解码** 。 

**字符编码（Character Encoding）** : 就是一套自然语言的字符与二进制数之间的对应规则。 

**编码表**：生活中文字和计算机中二进制的对应规则 

**乱码的情况**：按照 A 规则存储，同样按照 A 规则解析，那么就能显示正确的文本符号。反之，按照 A 规则存储，再按照 B 规则解析，就会导致乱码现象。 

编码:字符(人能看懂的)--字节(人看不懂的) 

解码:字节(人看不懂的)-->字符(人能看懂的) 

##### 字符集  

-   **字符集 Charset**：也叫编码表。是一个系统支持的所有字符的集合，包括各国家文字、标点符号、图形符号、数字等。 
-   计算机要准确的存储和识别各种字符集符号，需要进行字符编码，一套字符集必然至少有一套字符编码。常见字符集有 ASCII 字符集、GBK 字符集、Unicode 字符集等。

可见，当指定了**编码**，它所对应的**字符集**自然就指定了，所以**编码**才是我们最终要关心的。

**ASCII 字符集** ： 

​	ASCII 码（American Standard Code for Information Interchange，美国信息交换标准代码）：上个世纪 60 年代，美国制定了一套字符编码，对英语字符与二进制位之间的关系，做了统一规定。这被称为 ASCII 码。 

​	ASCII 码用于显示现代英语，主要包括控制字符（回车键、退格、换行键等）和可显示字符（英文大小写字符、阿拉伯数字和西文符号）。 

​	基本的 ASCII 字符集，使用 7 位（bits）表示一个字符（最前面的 1 位统一规定为 0），共 *128* *个*字符。比如：空格“SPACE”是 32（二进制00100000），大写的字母 A 是 65（二进制 01000001）。 

​	缺点：不能表示所有字符。 

**ISO-8859-1 字符集**： 

​	拉丁码表，别名 Latin-1，用于显示欧洲使用的语言，包括荷兰语、德语、意大利语、葡萄牙语等

​	ISO-8859-1 使用单字节编码，兼容 ASCII 编码。 

**GBxxx 字符集**： 

​	GB 就是国标的意思，是为了*显示中文*而设计的一套字符集。 

​	**GB2312**：简体中文码表。一个小于 127 的字符的意义与原来相同，即向下兼容 ASCII 码。但两个大于 127 的字符连在一起时，就表示一个汉字，这样大约可以组合了包含 *7000* *多个简体汉字*，此外数学符号、罗马希腊的 

字母、日文的假名们都编进去了，这就是常说的"全角"字符，而原来在 127号以下的那些符号就叫"半角"字符了。 

​	**GBK**：最常用的中文码表。是在 GB2312 标准基础上的扩展规范，使用了双字节编码方案，共收录了 *21003* *个*汉字，完全兼容 GB2312 标准，同时支持*繁体汉字*以及日韩汉字等。 

​	**GB18030**：最新的中文码表。收录汉字 *70244* *个*，采用*多字节*编码，每个字可以由 1 个、2 个或 4 个字节组成。支持中国国内少数民族的文字，同时支持繁体汉字以及日韩汉字等。 

**Unicode 字符集** ： 

​	Unicode 编码为表达*任意语言的任意字符*而设计，也称为统一码、标准万国码。Unicode 将世界上所有的文字用 *2* *个字节*统一进行编码，为每个字符设定唯一的二进制编码，以满足跨语言、跨平台进行文本处理的要求。 

​	Unicode 的缺点：这里有三个问题： 

​		第一，英文字母只用一个字节表示就够了，如果用更多的字节存储是*极大的浪费*。

​		第二，如何才能*区别* *Unicode* *和* *ASCII*？计算机怎么知道两个字节表示一个符号，而不是分别表示两个符号呢？ 

​		第三，如果和 GBK 等双字节编码方式一样，用最高位是 1 或 0 表示两个字节和一个字节，就少了很多值无法用于表示字符，不够表示所有字符。 

​	Unicode 在很长一段时间内无法推广，直到互联网的出现，为解决 Unicode如何在网络上传输的问题，于是面向传输的众多 UTF（UCS TransferFormat）标准出现。具体来说，有三种编码方案，UTF-8、UTF-16 和 UTF-32。 

**UTF-8 字符集**： 

​	Unicode 是字符集，UTF-8、UTF-16、UTF-32 是三种*将数字转换到程序数* 据*的编码方案。顾名思义，UTF-8 就是每次 8 个位传输数据，而 UTF-16 就是每次 16 个位。其中，UTF-8 是在互联网上*使用最广的一种 Unicode 的实现方式。 

​	互联网工程工作小组（IETF）要求所有互联网协议都必须支持 UTF-8 编码。所以，我们开发 Web 应用，也要使用 UTF-8 编码。UTF-8 是一种变长的编码方式。它使用 1-4 个字节为每个字符编码，编码规则： 

1.  128 个 US-ASCII 字符，只需一个字节编码。 

2.  拉丁文等字符，需要二个字节编码。 

3.  大部分常用字（含中文），使用三个字节编码。 

4.  其他极少使用的 Unicode 辅助字符，使用四字节编码。 

### 处理流之三/四：数据流、对象流

#### 数据流

​	在Java中，数据流（Data Stream）是一种用于读写基本数据类型和字符串的流类型。它提供了一种方便的方式来读写数据，无论是从文件、网络还是其他数据源。

​	Java中的数据流有两种类型：`DataInputStream`和`DataOutputStream`

-   DataOutputStream：允许应用程序将基本数据类型、String 类型的变量写入输出流中 
-   DataInputStream：允许应用程序以与机器无关的方式从底层输入流中读取基本数据类型、String 类型的变量。 

##### 数据输出流：DataOutputStream

-   **允许将数据和其类型一起写出去**（使用这种流写出的数据，我们是看不懂的，也不需要看懂）

**构造器**

```java
// 创建数据输出流包装基础的字节输出流
public DataOutputStream(OutputStream out)
```

​	DataOutputStream用于向输出流中写入基本数据类型和字符串。它提供了一系列的write方法，可以写入不同类型的数据，如writeInt()、writeDouble()、writeUTF()等。

**常用方法**

```java
// 将byte类型的数据写入基础的字节输出流
public final void writeByte(int v) throws IOException

// 将int类型的数据写入基础的字节输出流
public final void writeInt(int v) throws IOException

// 将double类型的数据写入基础的字节输出流
public final void writeDouble(double v) throws IOException

// 将字符串数据以UTF-8编码成字节写入基础的字节输出流
public final void writeUTF(String str) throws IOException

// 支持写字节数组出去
public synchronized void write(int b) throws IOException
public synchronized void write(byte b[], int off, int len) throws IOException
```

例如：

```java
try (DataOutputStream dos = new DataOutputStream(new FileOutputStream("data.txt"))) {
    dos.writeInt(10);
    dos.writeDouble(3.14);
    dos.writeUTF("hello world");
    // 继续写入其他数据
} catch (IOException e) {
    e.printStackTrace();
}
```

​	使用数据流可以方便地读写基本数据类型和字符串，而不需要手动进行数据类型转换。它们是对底层字节流的包装，提供了更高级的读写功能

##### 数据输入流：DataInputStream

-   **用于读取数据输出流写出去的数据**

**构造器**

```java
// 创建数据输入流包装基础的字节输入流
public DataInputStream(InputStream in)
```

​	DataInputStream用于从输入流中读取基本数据类型和字符串。它提供了一系列的read方法，可以读取不同类型的数据，如readInt()、readDouble()、readUTF()等。

**常用方法**

```java
// 读取字节数据返回
public final byte readByte() throws IOExceptio

// 读取int类型数据返回
public final int readInt() throws IOException

// 读取double类型数据返回
public final double readDouble() throws IOException

// 读取字符串数据（UTF-8）返回
public final String readUTF() throws IOException

// 支持读字节数据出来
public final int readInt() throws IOException
public final int read(byte b[]) throws IOException
```

例如：

```java
try (DataInputStream dis = new DataInputStream(new FileInputStream("data.txt"))) {
    // 注意：读取数据的顺序要与写入数据的顺序一致
    int num = dis.readInt();
    double value = dis.readDouble();
    String str = dis.readUTF();
    // 使用读取到的数据进行后续操作
} catch (IOException e) {
    e.printStackTrace();
}
```

**数据流的弊端**

​	只支持 Java 基本数据类型和字符串的读写，而不支持其它 Java 对象的类型。而 ObjectOutputStream 和 ObjectInputStream 既支持 Java 基本数据类型的数据读写，又支持 Java 对象的读写

#### 对象流

Java对象流（Object Stream）是一种用于读写Java对象的流类型。它可以将Java对象序列化为字节流，或者将字节流反序列化为Java对象。

Java对象流有两种类型：`ObjectInputStream`和`ObjectOutputStream`

-   ObjectOutputStream（字节输出流的子类）：将 Java 基本数据类型和对象写入字节输出流中。通过在流中使用文件可以实现 Java 各种基本数据类型的数据以及对象的持久存储。 
-   ObjectInputStream（字节输入流的子类）：ObjectInputStream 对以前使用 ObjectOutputStream 写出的基本数据类型的数据和对象进行读入操作，保存在内存中。 

说明：    

​	对象流的强大之处就是可以把 Java 中的对象写入到数据源中，也能把对象从数据源中还原回来。 

##### 对象字节输出流：ObjectOutputStream

-   可以把Java对象进行序列号：把内存中的Java对象存入到文件中去

**常用构造器**

```java
// 创建对象字节输出流，包装基础的字节输出流
public ObjectOutputStream(OutputStream out) throws IOException
```

**常用方法**

```java
// 把对象写出去
public final void writeObject(Object obj) throws IOException  // 重要
// 关闭此输出流并释放与此流相关联的任何系统资源   
public void close() throws IOException    
```

```java
// 写出一个 boolean 值
public void writeBoolean(boolean val) throws IOException
// 写出一个 8 位字节 
public void writeByte(int val) throws IOException
// 写出一个 16 位的 short 值 
public void writeShort(int val)  throws IOException 
// 写出一个 16 位的 char 值 
public void writeChar(int val)  throws IOException
// 写出一个 32 位的 int 值
public void writeInt(int val)  throws IOException 
// 写出一个 64 位的 long 值
public void writeLong(long val)  throws IOException 
// 写出一个 32 位的 float 值
public void writeFloat(float val) throws IOException
// 写出一个 64 位的 double 值 
public void writeDouble(double val) throws IOException
// 将表示长度信息的两个字节写入输出流，后跟字符串 str 中每个字符的 UTF-8 修改版表示形式。根据字符的值，将字符串 str 中每个字符转换成一个字节、两个字节或三个字节的字节组。注意，将 String 作为基本数据写入流中与将它作为 Object 写入流中明显不同。 如果 str 为 null，则抛出NullPointerException。 
public void writeUTF(String str) throws IOException
```

例如：

```java
import java.io.Serializable;

/**
 * 对象如果要序列化，必须实现Serializable序列化接口：没有方法的接口称为标识接口
 *	实现序列号的类，最好显示的声明一个 serialVersionUID
 */
public class Student implements Serializable {
    private static final long serialVersionUID = 86832189L;  // 权限无所谓，主要是 static final就行
    
    private String name;
    private String loginName;  // 登录名
    // todo transient修饰的成员变量（瞬态修饰成员）不在进行序列化 
    private transient String passWord;  // 密码
    private int age;
	// 省略无参、满参构造器、get、set、toString方法
}

public class ObjectOutputStreamDemo1 {
    public static void main(String[] args) {
        // 1.创建Java对象
        Student student = new Student("张三", "zhangsan", "123456", 21);
        try (
                // 2.对象序列化:使用对象字节输出流包装字节输出流
                ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("src/obj.txt"));
        ) {
            // 3.直接调用序列化方法
            oos.writeObject(student);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

##### 对象字节输入流：ObjectInputStream

-   可以把Java对象进行反序列化：把存储在文件中的Java对象读取到内存中


**常用构造器** 

```java
// 创建对象字节输入流，包装基础的字节输入流
public ObjectInputStream(InputStream in) throws IOException
```

**常用方法**

```java
// 把存储在文件中的Java对象读取出来
public final void writeObject(Object obj) throws IOException
        
// 关闭此输入流并释放与此流相关联的任何系统资源
public void close() throws IOException
```

```java
// 读取一个 boolean 值 
public boolean readBoolean() throws IOException 
// 读取一个 8 位的字节 
public byte readByte() throws IOException
// 读取一个 16 位的 short 值 
public short readShort()  throws IOException 
// 读取一个 16 位的 char 值 
public char readChar()  throws IOException
// 读取一个 32 位的 int 值 
public int readInt()  throws IOException
// 读取一个 64 位的 long 值
public long readLong()  throws IOException 
// 读取一个 32 位的 float 值 
public float readFloat() throws IOException
// 读取一个 64 位的 double 值 
public double readDouble() throws IOException
// 读取 UTF-8 修改版格式的 String 
public String readUTF() throws IOException
```

例如：

```java
public class ObjectInputStreamDemo2 {
    public static void main(String[] args) {
        try (
                // 1.创建对象字节输入流管道包装低级的字节输入流
                ObjectInputStream is = new ObjectInputStream(new FileInputStream("src/obj.txt"));
        ) {
            // 2.调用对象字节输入流的反序列化方法
            Student s = (Student) is.readObject();
            System.out.println(s);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

在使用对象流进行对象的读写时，需要注意以下几点：

1.  要读写的对象必须实现Serializable接口，否则会抛出NotSerializableException异常。
2.  对象的类定义必须与读取时的类定义相同，否则会抛出InvalidClassException异常。
3.  静态变量和transient变量不会被序列化。

使用对象流可以方便地将Java对象序列化为字节流，或者将字节流反序列化为Java对象。它们是对底层字节流的包装，提供了更高级的读写功能。

##### 认识对象序列化机制

**1、何为对象序列化机制？** 

​	对象序列化机制允许把内存中的 Java 对象转换成平台无关的二进制流，从而允许把这种二进制流持久地保存在磁盘上，或通过网络将这种二进制流传输到另一个网络节点。当其它程序获取了这种二进制流，就可以恢复成原来的 Java对象。 

-   序列化过程：用一个字节序列可以表示一个对象，该字节序列包含该对象的类型和对象中存储的属性等信息。字节序列写出到文件之后，相当于文件中持久保存了一个对象的信息。 


-   反序列化过程：该字节序列还可以从文件中读取回来，重构对象，对它进行反序列化。对象的数据*、*对象的类型和对象中存储的数据信息，都可以用来在内存中创建对象。 


**2、序列化机制的重要性** 

序列化是 RMI（Remote Method Invoke、远程方法调用）过程的参数和返回值都必须实现的机制，而 RMI 是 JavaEE 的基础。因此序列化机制是 JavaEE 平台的基础。 

序列化的好处，在于可将任何实现了 Serializable 接口的对象转化为**字节数据**，使其在保存和传输时可被还原。

**3、实现原理** 

 序列化：用 ObjectOutputStream 类保存基本类型数据或对象的机制。方法为： 

```JAVA
public final void writeObject(Object obj) throws IOException
```

反序列化：用 ObjectInputStream 类读取基本类型数据或对象的机制。方法为：  

```JAVA
public final void writeObject(Object obj) throws IOException
```

##### 如何实现序列化机制

如果**需要让某个对象支持序列化机制**，则必须让对象所属的类及其属性是可序列化的，为了让某个类是可序列化的，**该类必须实现 `java.io.Serializable`**接口。*Serializable* 是一个**标记接口**，不实现此接口的类将不会使任何状态序列化或反序列化，会抛出 *NotSerializableException* 。 

-   如果对象的某个属性也是引用数据类型，那么如果该属性也要序列化的话，也要实现Serializable 接口 

-   该类的所有属性必须是可序列化的。如果有一个属性不需要可序列化的，则该属性必须注明是瞬态的，使用 `transient `关键字修饰。 

-   静态（**static**）变量的值不会序列化。因为静态变量的值不属于某个对象。 


##### 反序列化失败问题

**问题 1：** 

对于 JVM 可以反序列化对象，它必须是能够找到 class 文件的类。如果找不到该类的 class 文件，则抛出一个 *ClassNotFoundException* 异常。 

**问题 2：** 

当 JVM 反序列化对象时，能找到 class 文件，但是 class 文件在序列化对象之后发生了修改，那么反序列化操作也会失败，抛出一个 *InvalidClassException* 异常。发生这个异常的原因如下： 

-   该类的序列版本号与从流中读取的类描述符的版本号不匹配 

-   该类包含未知数据类型 


解决办法： 

*Serializable* 接口给需要序列化的类，提供了一个序列版本号： serialVersionUID 。凡是实现 Serializable 接口的类都应该有一个表示序列化版本标识符的静态变量： 

```JAVA
static final long serialVersionUID = 234242343243L;  // 它的值由程序员随意指定即可
```

-   serialVersionUID 用来表明类的不同版本间的兼容性。简单来说，Java 的序列化机制是通过在运行时判断类的 serialVersionUID 来验证版本一致性的。在进行反序列化时，JVM 会把传来的字节流中的 serialVersionUID 与本地相应实体类的 serialVersionUID 进行比较，如果相同就认为是一致的，可以进行反序列化，否则就会出现序列化版本不一致的异常(InvalidCastException)。 


-   如果类没有显示定义这个静态常量，它的值是 Java 运行时环境根据类的内部细节自动生成的。若类的实例变量做了修改，serialVersionUID *可能发生变化*。因此，建议显式声明。 


-   如果声明了 serialVersionUID，即使在序列化完成之后修改了类导致类重新编译，则原来的数据也能正常反序列化，只是新增的字段值是默认值而已。 


### 其他流的使用

#### 标准输入、输出流

​	在Java中，标准输入输出流是用于与控制台进行交互的流。标准输入流（System.in）用于从控制台读取输入数据，标准输出流（System.out）用于向控制台输出数据。

-   **标准输入流（System.in**）是一个InputStream对象，可以使用Scanner类或BufferedReader类来读取输入数据

```java 
import java.util.Scanner;

public class StandardInputExample {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("请输入一个整数：");
        int num = scanner.nextInt();
        System.out.println("您输入的整数是：" + num);

        System.out.print("请输入一个字符串：");
        String str = scanner.nextLine();
        System.out.println("您输入的字符串是：" + str);

        scanner.close();
    }
}
```

-   **标准输出流（System.out**，其是 OutputStream 的子类 FilterOutputStream 的子类 ）是一个PrintStream对象，可以使用System.out.println()方法将数据输出到控制台。

```java
public class StandardOutputExample {
    public static void main(String[] args) {
        int num = 10;
        String str = "Hello, World!";

        System.out.println("整数：" + num);
        System.out.println("字符串：" + str);
    }
}
```

-   重定向：通过 System 类的 setIn，setOut 方法对默认设备进行改变。 

    -   ```java
        public static void setIn(InputStream in) 
        ```

    -   ```java
        // 可以改变输出语句的打印位置
        public static void setOut(PrintStream out) 
        ```
    
    ​    

#### 打印流

​	在Java中，打印流是一种方便的输出数据的方式。它提供了一组用于将数据打印到不同输出目标的方法，如控制台、文件等

Java中的打印流主要有两个类：PrintStream（字节输出流的子类） 和 PrintWriter（字符输出流的子类）

实现将基本数据类型的数据格式转化为字符串输出。 

打印流：PrintStream 和 PrintWriter
-   提供了一系列重载的 print()和 println()方法，用于多种数据类型的输出
-   PrintStream 和 PrintWriter 的**输出不会抛出 IOException 异常** 
-   PrintStream 和 PrintWriter 有**自动 flush 功能** 
-   **PrintStream** 打印的所有字符都**使用平台的默认字符编码转换为字节**。在需要**写入字符**而不是写入字节的情况下，**应该使用 PrintWriter 类**。 
-   System.out 返回的是 PrintStream 的实例 (使用System.out对象可以获得默认的PrintStream对象，用于将数据打印到控制台)
-   使用PrintStream的构造函数可以创建一个新的PrintStream对象，用于将数据打印到文件
-   使用PrintWriter的构造函数可以创建一个新的PrintWriter对象，用于将数据打印到控制台或文件。

**常用构造器**

```java
// 创建具有指定文件且不带自动行刷新的新打印流
public PrintStream(File file) throws FileNotFoundException
```

```java
// 创建具有指定文件名称和字符集且不带自动行刷新的新打印流
public PrintStream(File file, String csn)
        throws FileNotFoundException, UnsupportedEncodingException
```

```java
// 创建新的打印流
public PrintStream(OutputStream out)
```

```java
// 创建新的打印流。 
// autoFlush 如果为 true，则每当写入 byte 数组、调用其中一个 println 方法或写入换行符或字节 ('\n') 时都会刷新输出缓冲区。 
public PrintStream(OutputStream out, boolean autoFlush)
```

```java
// 创建新的打印流
public PrintStream(OutputStream out, boolean autoFlush, String encoding)
        throws UnsupportedEncodingException
```

```java
// 创建具有指定文件名称且不带自动行刷新的新打印流
public PrintStream(String fileName) throws FileNotFoundException
```

```java
// 创建具有指定文件名称和字符集且不带自动行刷新的新打印流
public PrintStream(String fileName, String csn)
        throws FileNotFoundException, UnsupportedEncodingException
```

**常用方法**

```java
// 打印任意类型的数据出去
public void println(Xxx xxx) 
```

```java
// 可以支持写字符数据出去
public void write(int b)
public void write(byte buf[], int off, int len)
```

例如：

```java
// 目标：学会使用打印流 高效 方便写数据到文件
public class PrintDemo1 {
    public static void main(String[] args) throws Exception {
        // 1.创建一个打印流对象
        PrintStream ps = new PrintStream(new FileOutputStream("src/ps.txt",true)); // 如果要追加写，在低级管道后面加true
//        PrintWriter ps = new PrintWriter("src/ps.txt");  // 打印功能与PrintStream的使用没用区别

        ps.println(97);
        ps.println('a');
        ps.println(23.2);
        ps.println(true);
        ps.println("我是打印流输出的，我是啥就是啥");
        ps.close();
    }
}


// 目标：了解改变输出语句的位置到文件
public class PrintDemo2 {
    public static void main(String[] args) throws Exception {
        System.out.println("锦瑟无端五十玹");
        System.out.println("一玹一柱思华年");

        // 改变输出语句的位置（重定向）
        PrintStream ps = new PrintStream("src/log.txt");
        System.setOut(ps);  // 把系统打印流改成了我们自己的打印流
        // 后续的打印都输出到了文件
        System.out.println("庄生晓梦迷蝴蝶");
        System.out.println("望帝春心托杜鹃");
    }
}
```

#### PrintStream 与 PrintWriter 的区别

-   打印数据的功能是一样的，都是使用方便，性能高效
-   PrintStream 继承自字节输出流OutpuStream，因此支持写字节数据的方法
-   PrintWriter 继承自字符输出流Writer，因此支持写字符数据的方法

#### Scanner 类

​	Scanner类是Java中的一个标准类，位于`java.util`包中，用于从标准输入流（如键盘）中读取用户输入。它提供了一系列方法来读取不同类型的输入数据，如整数、浮点数、字符串等。

**常用构造方法** 

```java
// 构造一个新的 Scanner，它生成的值是从指定文件扫描的
public Scanner(File source) throws FileNotFoundException
```

```java
// 构造一个新的 Scanner，它生成的值是从指定文件扫描的。 
public Scanner(File source, String charsetName)
        throws FileNotFoundException
```

```java
// 构造一个新的 Scanner，它生成的值是从指定的输入流扫描的
public Scanner(InputStream source)
```

```java
// 构造一个新的 Scanner，它生成的值是从指定的输入流扫描的。 
public Scanner(InputStream source, String charsetName)
```

**常用方法**

-   boolean hasNextXxx()： 如果通过使用 nextXxx()方法，此扫描器输入信息中的下一个标记可以解释为默认基数中的一个 Xxx 值，则返回 true。 


-   Xxx nextXxx()： 将输入信息的下一个标记扫描为一个 Xxx 



## apache-common 包的使用

​	IO 技术开发中，代码量很大，而且代码的重复率较高，为此 Apache 软件基金会，开发了 IO 技术的工具类commonsIO，大大简化了 IO 开发。 

​	Apahce 软件基金会属于第三方，（Oracle 公司第一方，我们自己第二方，其他都是第三方）我们要使用第三方开发好的工具，需要添加 jar 包。 

​	封装了Java提供的对文件、数据进行操作的代码，对外提供更加简单的方式对文件进行操作，对数据进行读写

​	在导入 `commons-io-2.5.jar` 包之后，内部的 API 都可以使用。 

### FileUtils 类

**常用方法**

```java
// 复制文件
public static void copyFile(File srcFile, File destFile) throws IOException
```

```java
// 整个目录的复制，自动进行递归遍历 
public static void copyDirectory(File srcDir, File destDir) throws IOException
// 参数: 
 src:要复制的文件夹路径 
 dest:要将文件夹粘贴到哪里去 
```

```java
// 删除文件夹
public static void deleteDirectory(File directory) throws IOException
```

```java
// 读取文件内容，并返回一个String 
public static String readFileToString(File file, Charset encoding) throws IOException
```

```java
// 将内容 data 写入到 file 中 
public static void writeStringToFile(File file, String data, Charset encoding, boolean append) throws IOException
```

###  IOUtils 类

**常用方法**

```java
// 文件复制
public static int copy(InputStream input, OutputStream output) throws IOException
public static int copy(Reader input, Writer output) throws IOException
```

```java
// 写数据
public static void write(String data, OutputStream output, String encoding) throws IOException
```

```java
// 悄悄的释放资源，自动处理 close()方法抛出的异
public static void closeQuietly(任意流对象)
```


