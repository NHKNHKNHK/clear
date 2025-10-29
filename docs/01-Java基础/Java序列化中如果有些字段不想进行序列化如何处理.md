# Java序列化中如果有些字段不想进行序列化如何处理

两种方案：

-   使用transient关键字来标记这些字段
-   自定义序列化方法

**使用transient关键字**

如果有些字段不想进行序列化，可以使用transient关键字来标记这些字段。被标记为transient的字段在序列化过程中会被忽略，不会被写入到序列化流中。

**自定义序列化方法**

除了使用transient关键字，还可以通过手动实现`writeObject`和`readObject`方法定制了特殊的序列化过程

```java
import java.io.*;

class User implements Serializable {

    private static final long serialVersionUID = 1L;
    
    private String username;
    private transient String password; // 不想序列化的字段

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    private void writeObject(ObjectOutputStream oos) throws IOException {
        oos.defaultWriteObject(); // 序列化非transient字段
        oos.writeObject(encryptPassword(password)); // 自定义序列化password
    }

    private void readObject(ObjectInputStream ois) throws IOException, ClassNotFoundException {
        ois.defaultReadObject(); // 反序列化非transient字段
        this.password = decryptPassword((String) ois.readObject()); // 自定义反序列化password
    }

    private String encryptPassword(String password) {
        // 简单加密示例（实际使用中请使用更安全的加密方法）
        return "encrypted_" + password;
    }

    private String decryptPassword(String encryptedPassword) {
        // 简单解密示例（实际使用中请使用更安全的解密方法）
        return encryptedPassword.replace("encrypted_", "");
    }

    @Override
    public String toString() {
        return "User{username='" + username + "', password='" + password + "'}";
    }
}

public class CustomSerializationExample {
    public static void main(String[] args) {
        User user = new User("john_doe", "secret_password");

        // 序列化
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("user.ser"))) {
            oos.writeObject(user);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 反序列化
        User deserializedUser = null;
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("user.ser"))) {
            deserializedUser = (User) ois.readObject();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }

        // 打印反序列化后的对象
        System.out.println(deserializedUser);
    }
}
```
