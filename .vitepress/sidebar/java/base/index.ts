import javaSidebar from '../learn/index'

const basePath = '/01-Java基础/'

export default [
  javaSidebar,
  {
    text: 'Java基础',
    collapsed: false, // 折叠 默认展开，初始页面加载时折叠设置为true
    items: [
      { text: 'index', link: basePath },
      { text: 'Java与C++的区别', link: basePath + 'Java与C++的区别' },
      { text: 'i++与++i的区别', link: basePath + 'i++与++i的区别' },
      { text: '服务可用性几个9的含义', link: basePath + '服务可用性几个9的含义' },
      { text: 'JDK、JRE、JVM的关系', link: basePath + 'JDK、JRE、JVM的关系' },
      { text: '简述Java标识符的命名规则', link: basePath + '简述Java标识符的命名规则' },
      { text: 'Java中能不能使用中文当作标识符', link: basePath + 'Java中能不能使用中文当作标识符' },
      { text: '为什么在编写Java代码会遇到乱码问题', link: basePath + '为什么在编写Java代码会遇到乱码问题' },
      { text: 'Java中的常量与变量', link: basePath + 'Java中的常量与变量' },
      { text: 'Java中的基本数据类型有那些', link: basePath + 'Java中的基本数据类型有那些' },
      { text: 'char能存储中文吗', link: basePath + 'char能存储中文吗' },
      { text: '如何理解自动类型提升', link: basePath + '如何理解自动类型提升' },
      { text: '如何理解强制类型转换', link: basePath + '如何理解强制类型转换' },
      { text: 'short s1 = 1; s1 = s1 + 1;有错吗?short s1 = 1; s1 += 1;有错吗', link: basePath + 'short s1 = 1 s1 = s1 + 1 有错吗 short s1 = 1  s1 += 1' },
      { text: 'Java中有哪些访问修饰符', link: basePath + 'Java中有哪些访问修饰符' },
      { text: 'private、public、protected以及不写的区别', link: basePath + 'private、public、protected以及不写的区别' },
      { text: 'final关键字有什么用', link: basePath + 'final关键字有什么用' },
      { text: 'final、finally、finalize的区别', link: basePath + 'final、finally、finalize的区别' },
      { text: 'if-else和switch-case的区别', link: basePath + 'if-else和switch-case的区别' },
      { text: '&和&&、|和||的区别', link: basePath + '与和短路与、或和短路或的区别' },
      { text: '>>、>>>与<<的区别', link: basePath + '右位移、无符号右移与左位移的区别' },
      { text: '深拷贝和浅拷贝的区别是什么', link: basePath + '深拷贝和浅拷贝的区别是什么' },
      { text: '为什么要使用深拷贝', link: basePath + '为什么要使用深拷贝' },
      { text: '静态（类）变量和实例变量的区别', link: basePath + '静态（类）变量和实例变量的区别' },
      { text: '静态（类）方法和实例方法的区别', link: basePath + '静态（类）方法和实例方法的区别' },
      { text: '什么是Java的迭代器', link: basePath + '什么是Java的迭代器' },
      { text: '怎么判断一个链表是不是环形链表', link: basePath + '怎么判断一个链表是不是环形链表' },

      { text: 'Java中方法参数传值还是传引用', link: basePath + 'Java中方法参数传值还是传引用' },
      { text: 'Java中的可变类与不可变类', link: basePath + 'Java中的可变类与不可变类' },
      { text: 'String对象真的不可变吗', link: basePath + 'String对象真的不可变吗' },
      { text: 'Stream流中的map和flatMap方法的区别', link: basePath + 'Stream流中的map和flatMap方法的区别' },
      { text: 'Stream中map、peek、forEach方法的区别', link: basePath + 'Stream中map、peek、forEach方法的区别' },
      { text: 'Java中包装类与基础类型的区别', link: basePath + 'Java中包装类与基础类型的区别' },
      { text: '什么是自动装箱和拆箱', link: basePath + '什么是自动装箱和拆箱' },
      { text: 'int和Integer装箱是怎么实现的', link: basePath + 'int和Integer装箱是怎么实现的' },
      { text: 'Integer的构造器在Java8后有变动', link: basePath + 'Integer的构造器在Java8后有变动' },
      { text: 'Integer类型的数值比较', link: basePath + 'Integer类型的数值比较' },
      { text: '什么是Java中的Integer缓存池', link: basePath + '什么是Java中的Integer缓存池' },

      { text: 'hashCode和equal方法是什么', link: basePath + 'hashCode和equal方法是什么' },
      { text: '重写hashCode()、equals()方法的基本原则', link: basePath + '重写hashCode()、equals()方法的基本原则' },
      { text: '为什么重写equals时也需要重写hashCode', link: basePath + '为什么重写equals时也需要重写hashCode' },
      { text: 'equal 与 == 的区别', link: basePath + 'equal 与 == 的区别' },
      { text: 'for循环与foreach循环的区别', link: basePath + 'for循环与foreach循环的区别' },
      { text: '什么是BigDecimal？何时使用', link: basePath + '什么是BigDecimal？何时使用' },
      { text: 'BigDecimal最佳实践', link: basePath + 'BigDecimal最佳实践' },
      { text: '栈和队列在Java中的区别', link: basePath + '栈和队列在Java中的区别' },
      { text: 'Java的Optional类是什么？有什么用', link: basePath + 'Java的Optional类是什么？有什么用' },
    ]
  },
  {
    text: 'OOP',
    collapsed: false,
    items: [
      { text: '如何理解面向对象和面向过程', link: basePath + '如何理解面向对象和面向过程' },
      { text: 'Java三大特性是什么', link: basePath + 'Java三大特性是什么' },
      { text: '什么是封装', link: basePath + '什么是封装' },
      { text: '什么是继承', link: basePath + '什么是继承' },
      { text: '什么是多态', link: basePath + '什么是多态' },
      { text: '什么是多态', link: basePath + '什么是多态' },
      { text: '重载和重写的区别', link: basePath + '重载和重写的区别' },
      { text: 'Java的运算符可以重载吗', link: basePath + 'Java的运算符可以重载吗' },
      { text: '构造器是否可被重写', link: basePath + '构造器是否可被重写' },
      { text: '父类的静态方法能否被子类重写', link: basePath + '父类的静态方法能否被子类重写' },
      { text: 'Java中一个类可以继承多个类吗', link: basePath + 'Java中一个类可以继承多个类吗' },
      { text: 'Java为什么不支持多继承', link: basePath + 'Java为什么不支持多继承' },
      { text: '什么是内部类？与普通的区别？有什么用？', link: basePath + '什么是内部类？与普通的区别？有什么用？' },
    ],
  },
  {
    text: '注解与反射',
    collapsed: false,
    items: [
      { text: '什么是Java中的注解', link: basePath + '什么是Java中的注解' },
      { text: '什么是Java的反射', link: basePath + '什么是Java的反射' },
      { text: 'Java反射机制如何获取Class类的实例，Class类有哪些常用方法', link: basePath + 'Java反射机制如何获取Class类的实例，Class类有哪些常用方法' },
      { text: 'Java反射机制可以访问父类的私有方法吗', link: basePath + 'Java反射机制可以访问父类的私有方法吗' },
      { text: 'Java反射有没有性能影响、反射到底慢在哪里', link: basePath + 'Java反射有没有性能影响、反射到底慢在哪里' },
    ]
  },
  {
    text: '抽象类与接口',
    collapsed: false,
    items: [
      { text: '什么是接口', link: basePath + '什么是接口' },
      { text: '什么是抽象类', link: basePath + '什么是抽象类' },
      { text: '接口和抽象类有什么区别', link: basePath + '接口和抽象类有什么区别' }
    ]
  },
  {
    text: 'String',
    collapsed: false,
    items: [
      { text: 'String类可以被继承吗', link: basePath + 'String类可以被继承吗' },
      { text: 'String、StringBuffer、StringBuilder、StringJoiner的区别', link: basePath + 'String、StringBuffer、StringBuilder、StringJoiner的区别' },
      { text: 'String有没有长度限制', link: basePath + 'String有没有长度限制' },
      { text: 'String底层实现是怎么样的', link: basePath + 'String底层实现是怎么样的' },
      { text: '为什么JDK9中将String的char数组改为了byte数组', link: basePath + '为什么JDK9中将String的char数组改为了byte数组' },
      { text: 'String如何实现编码和解码', link: basePath + 'String如何实现编码和解码' },
      { text: 'String字符串如何进行反转', link: basePath + 'String字符串如何进行反转' },
      { text: 'String类的isEmpty和isBlank的区别', link: basePath + 'String类的isEmpty和isBlank的区别' },
      { text: 'String类中的concat和+有什么区别', link: basePath + 'String类中的concat和+有什么区别' },
      { text: '字符串拼接什么时候用+，什么时候不推荐用+', link: basePath + '字符串拼接什么时候用+，什么时候不推荐用+' },
      { text: 'String str = new String("hello")创建了几个对象', link: basePath + 'newString' },
      { text: 'String类的intern方法有什么用', link: basePath + 'String类的intern方法有什么用' },
      { text: 'String中用到了哪些设计模式', link: basePath + 'String中用到了哪些设计模式' },
    ]
  },
  {
    text: 'IO流',
    collapsed: false,
    items: [
      { text: 'Java中的IO流是什么', link: basePath + 'Java中的IO流是什么' },
      { text: 'IO中的输入流和输出流有什么区别', link: basePath + 'IO中的输入流和输出流有什么区别' },
      { text: '字节流和字符流的区别', link: basePath + '字节流和字符流的区别' },
      { text: '缓冲区和缓存的区别', link: basePath + '缓冲区和缓存的区别' },
      { text: '字节流怎么转化为字符流', link: basePath + '字节流怎么转化为字符流' },
      { text: '读写文本文件时如何处理字符编码', link: basePath + '读写文本文件时如何处理字符编码' },

      { text: '什么是BIO、NIO、AIO', link: basePath + '什么是BIO、NIO、AIO' },
      { text: 'Java如何高效率读写大文件', link: basePath + 'Java如何高效率读写大文件' },
      { text: '如何比较两个文件的内容是否相等', link: basePath + '如何比较两个文件的内容是否相等' },
      {
        text: '序列化与反序列化',
        collapsed: false,
        items: [
          { text: 'Java序列化是什么', link: basePath + 'Java序列化是什么' },
          { text: '序列化ID（seriaVersionUID）的作用是什么', link: basePath + '序列化ID（seriaVersionUID）的作用是什么' },
          { text: 'Java有哪两种序列化方式', link: basePath + 'Java有哪两种序列化方式' },
          { text: '静态变量能不能被序列化', link: basePath + '静态变量能不能被序列化' },
          { text: 'transient关键字有什么作用', link: basePath + 'transient关键字有什么作用' },
          { text: 'ArrayList集合中的elementData数组为什么要加transient修饰', link: basePath + 'ArrayList集合中的elementData数组为什么要加transient修饰' },
          { text: '序列化一个对象时，有哪些需要注意的', link: basePath + '序列化一个对象时，有哪些需要注意的' },
          { text: '序列化中@Serial注解的作用', link: basePath + '序列化中@Serial注解的作用' },
          { text: 'Java序列化中如果有些字段不想进行序列化如何处理', link: basePath + 'Java序列化中如果有些字段不想进行序列化如何处理' },

        ]
      }
    ]
  },
  {
    text: '网络编程',
    collapsed: false,
    items: [
      { text: '什么是Java中的网络编程', link: basePath + '什么是Java中的网络编程' },
    ]
  },
  {
    text: '异常',
    collapsed: false,
    items: [
      { text: '简述Java异常的体系结构', link: basePath + '简述Java异常的体系结构' },
      { text: 'Java中Exception和Error有什么区别', link: basePath + 'Java中Exception和Error有什么区别' },
      { text: '常见的Error', link: basePath + '常见的Error' },
      { text: 'Java运行时异常和编译时异常的区别是什么', link: basePath + 'Java运行时异常和编译时异常的区别是什么' },
      { text: '常见的编译时异常（非运行时异常）Checked Exceptions', link: basePath + '常见的编译时异常（非运行时异常）Checked Exceptions' },
      { text: '常见的运行时异常（非受检异常）UnChecked Exceptions', link: basePath + '常见的运行时异常（非受检异常）UnChecked Exceptions' },
      { text: 'throw和throws的区别', link: basePath + 'throw和throws的区别' },
      { text: '异常处理时需要注意哪些', link: basePath + '异常处理时需要注意哪些' },
      { text: 'try-catch-finally都是干啥的？try中有return时的执行流程', link: basePath + 'try-catch-finally都是干啥的？try中有return时的执行流程' },
      { text: 'finally块一定会执行吗', link: basePath + 'finally块一定会执行吗' },
      { text: 'Java中final、finally、finalize的区别', link: basePath + 'Java中final、finally、finalize的区别' },
    ],
  },
  {
    text: '泛型',
    collapsed: false,
    items: [
      { text: '什么是泛型？泛型有什么用', link: basePath + '什么是泛型？泛型有什么用' },
      { text: '集合使用泛型有什么优点', link: basePath + '集合使用泛型有什么优点' },
      { text: 'Java中泛型的T、R、K、V、E是什么', link: basePath + 'Java中泛型的T、R、K、V、E是什么' },
      { text: '泛型中的<? extends T>和<? super T>有什么区别', link: basePath + '泛型中的extends和super有什么区别' },
      { text: '泛型的实现原理是什么', link: basePath + '泛型的实现原理是什么' },
      { text: '泛型擦除？会带来什么问题', link: basePath + '泛型擦除？会带来什么问题' },
    ]
  },
  {
    text: '其他',
    collapsed: false,
    items: [
      { text: 'JDK8的新特性', link: basePath + 'JDK8的新特性' },
      { text: 'Java为什么要引入模块化', link: basePath + 'Java为什么要引入模块化' },
      { text: '如何在Java中调用外部可执行程序或系统命令', link: basePath + '如何在Java中调用外部可执行程序或系统命令' },
      { text: '什么是Java中的SPI机制', link: basePath + '什么是Java中的SPI机制' },
      { text: '简述Java的类加载过程', link: basePath + '简述Java的类加载过程' },
      { text: '什么是动态代理', link: basePath + '什么是动态代理' },
      { text: 'JDK动态代理与CGLib动态代理的区别', link: basePath + 'JDK动态代理与CGLib动态代理的区别' },
    ]
  },
]