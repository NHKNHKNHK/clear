# 什么是BIO、NIO、AIO

BIO、NIO 和 AIO 是 Java 中用于处理输入输出（I/O）操作的三种不同模型。它们分别代表阻塞 I/O、非阻塞 I/O 和异步 I/O

|          | BIO                                                          | NIO                                                          | AIO                                                          |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 概念     | Blocking I/O（阻塞式I/O），它就是传统的IO                    | Non-blocking I/O（非阻塞式I/O），也成为New I/O               | Asynchronous I/O（异步I/O）                                  |
| 技术     | 基于流模型                                                   | 基于缓冲区和通道                                             | 基于事件回调机制                                             |
| 应用场景 | 适用于连接数较少且每个连接的数据量较大的场景                 | 适用于连接数较多且每个连接的数据量较小的场景                 | 适用于高并发、低延迟的场景，如高性能服务器                   |
| 特点     | 1）当客户端发起一个I/O操作请求时，服务器端会阻塞，知道I/O操作完成<br>2）仅支持从输入流中读取数据，将数据写入输出流<br>3）每个连接都需要一个独立的线程来处理 | 1）客户端发起I/O操作请求后，服务器端不会阻塞，可以继续处理其他任务<br/>2）使用通道（Channel）和缓冲区（Buffer）进行数据读写<br/>3）支持选择器（Selector），可以监听多个通道的事件 | 1）客户端发起I/O操作请求后，服务器端立即返回，继续处理其他任务<br/>2）I/O操作完成后，操作系统会通知服务器端程序<br/>3）AIO的工作机制基于事件和回调机制，这种机制使得线程可以在I/O操作完成时通过回调机制继续执行其他任务，不需要轮询检查I/O操作的状态 |

## **BIO（Blocking I/O）**

**特点**

-   **阻塞**：每个 I/O 操作都会阻塞当前线程，直到操作完成。
-   **一对一连接**：每个连接都需要一个独立的线程来处理请求。
-   **简单易用**：代码编写简单直观，适合小规模并发场景。

**工作原理**

当客户端发起请求时，服务器会为每个请求分配一个线程，并且该线程会一直阻塞，直到数据读取或写入完成。这种方式在高并发场景下会导致大量线程占用资源，从而影响性能

```java
ServerSocket serverSocket = new ServerSocket(8080);
while (true) {
    Socket socket = serverSocket.accept(); // 阻塞等待连接
    new Thread(() -> {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true)) {
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                if ("bye".equals(inputLine)) break;
                out.println("Echo: " + inputLine);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }).start();
}
```

## **NIO（Non-blocking I/O）**

**特点**

-   **非阻塞**：I/O 操作不会阻塞线程，可以立即返回结果或状态。
-   **多路复用**：通过选择器（Selector）管理多个通道（Channel），一个线程可以处理多个连接。
-   **高性能**：适合高并发场景，减少线程数量，提高系统吞吐量。

**工作原理**

NIO 使用选择器（Selector）来监听多个通道的状态变化（如可读、可写）。当某个通道准备好进行 I/O 操作时，选择器会通知相应的线程进行处理。这种方式避免了为每个连接创建独立线程，从而提高了系统的并发处理能力。

```java
Selector selector = Selector.open();
ServerSocketChannel serverChannel = ServerSocketChannel.open();
serverChannel.configureBlocking(false);
serverChannel.socket().bind(new InetSocketAddress(8080));
serverChannel.register(selector, SelectionKey.OP_ACCEPT);

while (true) {
    selector.select();
    Set<SelectionKey> selectedKeys = selector.selectedKeys();
    Iterator<SelectionKey> iterator = selectedKeys.iterator();

    while (iterator.hasNext()) {
        SelectionKey key = iterator.next();
        iterator.remove();

        if (key.isAcceptable()) {
            // 处理新连接
            ServerSocketChannel serverChannel = (ServerSocketChannel) key.channel();
            SocketChannel clientChannel = serverChannel.accept();
            clientChannel.configureBlocking(false);
            clientChannel.register(selector, SelectionKey.OP_READ);
        } else if (key.isReadable()) {
            // 处理读操作
            SocketChannel clientChannel = (SocketChannel) key.channel();
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            int bytesRead = clientChannel.read(buffer);
            if (bytesRead == -1) {
                clientChannel.close();
            } else {
                buffer.flip();
                System.out.println("Received: " + new String(buffer.array(), 0, bytesRead));
                buffer.clear();
            }
        }
    }
}
```

## **AIO（Asynchronous I/O）**

**特点**

-   **异步**：I/O 操作是完全异步的，调用方法后立即返回，实际的 I/O 操作由操作系统完成。
-   **事件驱动**：通过回调函数或 Future 对象获取操作结果。
-   **高效**：适合高并发场景，进一步减少了线程的使用，提高了响应速度。

**工作原理**

AIO 使用异步通道（AsynchronousChannel），当发起 I/O 操作时，线程不会被阻塞，而是继续执行其他任务。当 I/O 操作完成时，操作系统会通知应用程序，应用程序可以通过回调函数或 Future 对象获取结果。

```java
AsynchronousServerSocketChannel serverChannel = AsynchronousServerSocketChannel.open();
serverChannel.bind(new InetSocketAddress(8080));

serverChannel.accept(null, new CompletionHandler<AsynchronousSocketChannel, Void>() {
    @Override
    public void completed(AsynchronousSocketChannel clientChannel, Void attachment) {
        // 处理新连接
        serverChannel.accept(null, this); // 继续接受新的连接
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        clientChannel.read(buffer, buffer, new CompletionHandler<Integer, ByteBuffer>() {
            @Override
            public void completed(Integer result, ByteBuffer attachment) {
                if (result == -1) {
                    clientChannel.close();
                } else {
                    attachment.flip();
                    System.out.println("Received: " + new String(attachment.array(), 0, result));
                    attachment.clear();
                }
            }

            @Override
            public void failed(Throwable exc, ByteBuffer attachment) {
                exc.printStackTrace();
            }
        });
    }

    @Override
    public void failed(Throwable exc, Void attachment) {
        exc.printStackTrace();
    }
});
```

