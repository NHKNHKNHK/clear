# Junit单元测试



演示：

```java
/*
    业务方法
 */
public class UserService {
    public String loginName(String loginName, String passWord) {
        if ("admin".equals(loginName) && "123456".equals(passWord)){
            return "登录成功";
        } else {
            return "账号或密码有问题!";
        }
    }

    public void selectNames(){
        System.out.println(10/0);  // 模拟业务出错
        System.out.println("查询全部用户名称成功");
    }
}
```



```java
import org.junit.*;

/**
    测试类
    注意：
        1.必须是公开的，无参数，无返回值
        2.测试方法必须使用@Test注解标记
 */

public class TestUserService {

    // 修饰实例方法
    @Before
    public void before() {
        System.out.println("--before执行一次--");
    }

    @After
    public void alter() {
        System.out.println("--alter执行一次--");
    }

    // 修饰静态方法方法
    @BeforeClass
    public static void beforeClass() {
        System.out.println("--beforeClass执行一次--");
    }

    @AfterClass
    public static void alterClass() {
        System.out.println("--alterClass执行一次--");
    }


    @Test
    public void testLoginName(){
        UserService userService = new UserService();
        String rs = userService.loginName("admin","123456");

        // 进行预期结果的正确性测试：断言
        Assert.assertEquals("你的功能业务可能出现问题","登录成功",rs);
    }

    @Test
    public void testSelectNames(){
        UserService userService = new UserService();
        userService.selectNames();
    }
}
```

