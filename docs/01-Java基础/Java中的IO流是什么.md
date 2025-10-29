# Java中的IO流是什么

java 中的 I/O 流（Input/Output Streams）是用于处理输入和输出操作的抽象概念。它们提供了读取和写入数据的功能，可以与文件、网络连接、内存缓冲区等进行交互。

Java 的 I/O 流主要分为两大类：**字节流（Byte Streams）和字符流（Character Streams）。**

此外，还有专门用于对象序列化的**对象流**。

**字节流（Byte Streams）**

-   定义：处理原始的二进制数据，以字节为单位进行读写。
-   常用类
    -   `InputStream`和 `OutputStream` 是所有字节流的顶级抽象类。
    -   `FileInputStream` 和 `FileOutputStream`：用于文件的读写。
    -   `ByteArrayInputStream` 和 `ByteArrayOutputStream`：用于内存中的字节数组读写
    -   `BufferedInputStream` 和 `BufferedOutputStream`：带缓冲功能的字节流，提高读写效率
    -   `DataInputStream` 和 `DataOutputStream`：支持基本数据类型的读写。

**字符流（Character Streams）**

-   定义：处理字符数据，以字符为单位进行读写，通常用于文本文件的处理。

-   常用类
    -   `Reader` 和 `Writer` 是所有字符流的顶级抽象类。
    -   `FileReader` 和 `FileWriter`：用于文件的字符读写。
    -   `StringReader` 和 `StringWriter`：用于字符串的读写。
    -   `BufferedReader` 和 `BufferedWriter`：带缓冲功能的字符流，提高读写效率。
    -   `PrintWriter`：提供格式化输出功能。

**对象流（Object Streams）**

-   定义：用于序列化和反序列化 Java 对象，将对象保存到文件或从文件中恢复对象。

-   常用类
    -   `ObjectInputStream` 和 `ObjectOutputStream`：用于对象的序列化和反序列化
