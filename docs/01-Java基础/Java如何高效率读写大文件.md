# Java如何高效率读写大文件

-   **使用缓冲流和文件流**：简单易用，适合大多数常规文件操作，特别是当需要逐行处理时
-   **使用Files工具类的方法**：提供了便捷的 API，代码简洁，适用于不需要复杂逻辑的文件操作。
-   **使用NIO的FileChannel和Buffer**：性能最优，适合处理非常大的文件或需要更高性能的场景，特别是在多线程环境下。

**使用缓冲流和文件流**

通过使用 BufferedInputStream 和 BufferedOutputStream 来提高读写效率。这些缓冲流可以在底层文件流上添加一层缓冲区，**减少 I/O 操作的次数**，从而提高性能。

关键点：

-   **缓冲区大小**：可以根据实际需求调整缓冲区大小（如 8KB 或更大），以平衡内存占用和 I/O 性能。
-   **自动关闭资源**：使用 try-with-resources 语法确保资源被正确关闭。

```java
import java.io.*;

public class BufferedStreamExample {
    public static void main(String[] args) {
        String inputFilePath = "large_input.txt";
        String outputFilePath = "large_output.txt";

        try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream(inputFilePath));
             BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(outputFilePath))) {

            byte[] buffer = new byte[8192]; // 8KB 缓冲区
            int bytesRead;

            while ((bytesRead = bis.read(buffer)) != -1) {
                bos.write(buffer, 0, bytesRead);
            }

            System.out.println("File copied successfully using buffered streams.");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## **使用 Files 工具类的方法**

Java 7 引入了 `java.nio.file.Files` 类，提供了许多便捷的方法来处理文件操作，包括读取和写入大文件。这些方法通常更简洁，并且内部已经优化了性能

关键点：

-   **批量操作**：Files.copy 方法可以一次性复制整个文件，适用于不需要逐行处理的情况。

-   **逐行处理**：如果需要逐行处理文件内容，可以使用 `Files.newBufferedReader `和 `Files.newBufferedWriter`，结合 `BufferedReader `和 `BufferedWriter` 提高效率。

```java
import java.nio.file.*;
import java.io.IOException;

public class FilesExample {
    public static void main(String[] args) {
        Path inputPath = Paths.get("large_input.txt");
        Path outputPath = Paths.get("large_output.txt");

        try {
            // 复制文件内容
            Files.copy(inputPath, outputPath, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("File copied successfully using Files.copy.");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

// 或者逐行读取并写入
public class FilesLineByLineExample {
    public static void main(String[] args) {
        Path inputPath = Paths.get("large_input.txt");
        Path outputPath = Paths.get("large_output.txt");

        try (BufferedReader reader = Files.newBufferedReader(inputPath);
             BufferedWriter writer = Files.newBufferedWriter(outputPath)) {

            String line;
            while ((line = reader.readLine()) != null) {
                writer.write(line);
                writer.newLine();
            }

            System.out.println("File processed line by line successfully.");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## **使用 NIO 的 FileChannel 和 Buffer**

NIO（New Input/Output）提供了非阻塞 I/O 操作和更高效的缓冲机制，特别适合处理大文件。FileChannel 可以直接与操作系统交互，提供更高的性能。

关键点：

-   直接缓冲区：使用 ByteBuffer.allocateDirect 创建直接缓冲区，可以直接映射到本地内存，减少数据拷贝次-数。

-   非阻塞 I/O：FileChannel 支持非阻塞操作，适合多线程环境下的高性能 I/O。

-   批量传输：通过 transferTo 和 transferFrom 方法可以更高效地传输大文件，减少手动管理缓冲区的需求。

```java
import java.nio.file.*;
import java.nio.channels.*;
import java.nio.ByteBuffer;

public class FileChannelExample {
    public static void main(String[] args) {
        Path inputPath = Paths.get("large_input.txt");
        Path outputPath = Paths.get("large_output.txt");

        try (FileChannel sourceChannel = FileChannel.open(inputPath, StandardOpenOption.READ);
             FileChannel destChannel = FileChannel.open(outputPath, StandardOpenOption.CREATE, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING)) {

            ByteBuffer buffer = ByteBuffer.allocateDirect(8192); // 直接缓冲区
            long bytesTransferred = 0;
            long fileSize = sourceChannel.size();

            while (bytesTransferred < fileSize) {
                buffer.clear(); // 清空缓冲区准备读取
                int bytesRead = sourceChannel.read(buffer);

                if (bytesRead == -1) break; // 文件结束

                buffer.flip(); // 切换为写模式
                destChannel.write(buffer);
                bytesTransferred += bytesRead;
            }

            System.out.println("File copied successfully using FileChannel.");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```


