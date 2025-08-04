
// export default [
//   {
//     text: 'Java',
//     collapsed: true, // 折叠 默认展开，初始页面加载时折叠设置为true
//     items: [
//       { text: 'Java基础', link: '/01-Java基础/Java基础' },
//       { text: 'Java集合', link: '/02-Java集合篇/Java集合篇' },
//     ]
//   },
//   {
//     text: 'JVM',
//     items: [
//       { text: 'JVM', link: '/03-JVM篇/JVM篇' },
//     ]
//   },
//   {
//     text: 'Java并发',
//     collapsed: true, // 折叠 默认展开，初始页面加载时折叠设置为true
//     items: [
//       { text: 'Java并发', link: '/04-Java并发/Java并发' },
//     ]
//   },
//   {
//     text: 'Spring',
//     items: [
//       { text: 'Spring', link: '/05-Spring/Spring篇' },
//     ]
//   },
//   {
//     text: 'SpringMVC',
//     items: [
//       { text: 'SpringMVC', link: '/06-SpringMVC/SpringMVC篇' },
//     ]
//   },
//   {
//     text: 'SpringBoot',
//     items: [
//       { text: 'SpringBoot', link: '/07-SpringBoot/SpringBoot篇' },
//       { text: '什么是SpringBoot？', link: '/07-SpringBoot/什么是SpringBoot' },
//       { text: 'SpringBoot自动装配原理', link: '/07-SpringBoot/SpringBoot自动装配原理' }
//     ]
//   },
//   {
//     text: '后端',
//     items: [
//       { text: 'Markdown Examples', link: '/markdown-examples' },
//       { text: 'Runtime API Examples', link: '/api-examples' }
//     ]
//   },
//   {
//     text: 'MySQL',
//     items: [
//       { text: 'MySQL事务的四大特性', link: '/09-MySQL/MySQL事务的四大特性' },
//       { text: 'B树和B+树的区别', link: '/09-MySQL/B树和B+树的区别' },
//     ]
//   },
// ]

import { text } from "stream/consumers";
import { setSidebar } from "./gen_sidebar.mjs";


export default {

  'basic': [
    {
      text: '基础篇',
      items: [
        { text: '基础篇24', link: '/basic/index' },
        { text: '基础篇1', link: '/basic/basic1' },
        { text: '基础篇2', link: '/basic/basic2' }
      ]
    },
  ],
  'api': [
    {
      text: 'API 篇',
      items: [
        { text: 'API篇', link: '/api/index' },
        { text: 'API篇1', link: '/api/api1' },
        { text: 'API篇2', link: '/api/api2' }
      ]
    },
  ],
  // { text: 'Java基础', link: '/01-Java基础/Java基础' },
  '/01-Java基础/': [
    {
      text: 'Java基础',
      // collapsed: true, // 折叠 默认展开，初始页面加载时折叠设置为true
      items: [
        { text: 'index', link: '/01-Java基础/index' },
        { text: 'i++与++i的区别', link: '/01-Java基础/i++与++i的区别' },
        { text: '服务可用性几个9的含义', link: '/01-Java基础/服务可用性几个9的含义' },
        { text: 'JDK、JRE、JVM的关系', link: '/01-Java基础/JDK、JRE、JVM的关系' },
        { text: '简述Java标识符的命名规则', link: '/01-Java基础/简述Java标识符的命名规则' },
        { text: 'Java中能不能使用中文当作标识符', link: '/01-Java基础/Java中能不能使用中文当作标识符' },
        { text: '为什么在编写Java代码会遇到乱码问题', link: '/01-Java基础/为什么在编写Java代码会遇到乱码问题' },
        { text: 'Java中的常量与变量', link: '/01-Java基础/Java中的常量与变量' },
        { text: 'Java中的基本数据类型有那些', link: '/01-Java基础/Java中的基本数据类型有那些' },
        { text: 'char能存储中文吗', link: '/01-Java基础/char能存储中文吗' },
        { text: '如何理解自动类型提升', link: '/01-Java基础/如何理解自动类型提升' },
        { text: '如何理解强制类型转换', link: '/01-Java基础/如何理解强制类型转换' },
        { text: 'short s1 = 1; s1 = s1 + 1;有错吗?short s1 = 1; s1 += 1;有错吗', link: '/01-Java基础/short s1 = 1 s1 = s1 + 1 有错吗 short s1 = 1  s1 += 1' },
        { text: 'Java中有哪些访问修饰符', link: '/01-Java基础/Java中有哪些访问修饰符' },
        { text: 'private、public、protected以及不写的区别', link: '/01-Java基础/private、public、protected以及不写的区别' },
        { text: 'final关键字有什么用？', link: '/01-Java基础/final关键字有什么用' },
        { text: 'final、finally、finalize的区别', link: '/01-Java基础/final、finally、finalize的区别' },

        { text: 'if-else和switch-case的区别', link: '/01-Java基础/if-else和switch-case的区别' },
        { text: '什么是Java中的网络编程', link: '/01-Java基础/什么是Java中的网络编程' },
        { text: '&和&&、|和||的区别', link: '/01-Java基础/与和短路与、或和短路或的区别' },
        { text: '>>、>>>与<<的区别', link: '/01-Java基础/右位移、无符号右移与左位移的区别' },



        { text: 'Java三大特性是什么', link: '/01-Java基础/Java三大特性是什么' },
        { text: '什么是封装', link: '/01-Java基础/什么是封装' },
        { text: '什么是继承', link: '/01-Java基础/什么是继承' },
        { text: '什么是多态', link: '/01-Java基础/什么是多态' },
        { text: '重载和重写的区别', link: '/01-Java基础/重载和重写的区别' },
        { text: 'Java的运算符可以重载吗', link: '/01-Java基础/Java的运算符可以重载吗' },
        { text: '构造器是否可被重写', link: '/01-Java基础/构造器是否可被重写' },
        { text: '父类的静态方法能否被子类重写', link: '/01-Java基础/父类的静态方法能否被子类重写' },
        { text: 'Java中一个类可以继承多个类吗', link: '/01-Java基础/Java中一个类可以继承多个类吗' },
        { text: 'Java为什么不支持多继承', link: '/01-Java基础/Java为什么不支持多继承' },
        { text: '深拷贝和浅拷贝的区别是什么', link: '/01-Java基础/深拷贝和浅拷贝的区别是什么' },
        { text: '为什么要使用深拷贝', link: '/01-Java基础/为什么要使用深拷贝' },
        { text: '静态（类）变量和实例变量的区别', link: '/01-Java基础/静态（类）变量和实例变量的区别' },
        { text: '静态（类）方法和实例方法的区别', link: '/01-Java基础/静态（类）方法和实例方法的区别' },
        { text: '什么是Java的迭代器', link: '/01-Java基础/什么是Java的迭代器' },
        { text: '怎么判断一个链条是不是环形链表', link: '/01-Java基础/怎么判断一个链条是不是环形链表' },
        { text: '什么是接口', link: '/01-Java基础/什么是接口' },
        { text: '什么是抽象类', link: '/01-Java基础/什么是抽象类' },
        { text: '接口和抽象类有什么区别', link: '/01-Java基础/接口和抽象类有什么区别？' },
        { text: 'Java中的参数传递是按值还是按引用', link: '/01-Java基础/Java中的参数传递是按值还是按引用' },
        { text: 'Java中方法参数传值还是传引用', link: '/01-Java基础/Java中方法参数传值还是传引用' },
        { text: 'Java中的可变类与不可变类', link: '/01-Java基础/Java中的可变类与不可变类' },
        { text: 'String对象真的不可变吗', link: '/01-Java基础/String对象真的不可变吗' },
        { text: '简述Java异常的体系结构', link: '/01-Java基础/简述Java异常的体系结构' },
        { text: 'Java中Exception和Error有什么区别', link: '/01-Java基础/Java中Exception和Error有什么区别' },
        { text: '常见的Error', link: '/01-Java基础/常见的Error' },
        { text: 'Java运行时异常和编译时异常的区别是什么', link: '/01-Java基础/Java运行时异常和编译时异常的区别是什么' },
        { text: '常见的编译时异常（非运行时异常）Checked Exceptions', link: '/01-Java基础/常见的编译时异常（非运行时异常）Checked Exceptions' },
        { text: '常见的运行时异常（非受检异常）UnChecked Exceptions', link: '/01-Java基础/常见的运行时异常（非受检异常）UnChecked Exceptions' },
        { text: 'throw和throws的区别', link: '/01-Java基础/throw和throws的区别' },
        { text: '异常处理时需要注意哪些', link: '/01-Java基础/异常处理时需要注意哪些' },
        { text: 'try-catch-finally都是干啥的？try中有return时的执行流程', link: '/01-Java基础/try-catch-finally都是干啥的？try中有return时的执行流程' },
        { text: 'finally块一定会执行吗', link: '/01-Java基础/finally块一定会执行吗' },
        { text: 'Java中final、finally、finalize的区别', link: '/01-Java基础/Java中final、finally、finalize的区别' },
        { text: '什么是内部类？与普通的区别？有什么用', link: '/01-Java基础/什么是内部类？与普通的区别？有什么用' },
        { text: 'JDK8的新特性', link: '/01-Java基础/JDK8的新特性' },
        { text: 'Stream流中的map和flatMap方法的区别', link: '/01-Java基础/Stream流中的map和flatMap方法的区别' },
        { text: 'Java中包装类与基础类型的区别', link: '/01-Java基础/Java中包装类与基础类型的区别' },
        { text: '什么是自动装箱和拆箱', link: '/01-Java基础/什么是自动装箱和拆箱' },
        { text: 'int和Integer装箱是怎么实现的', link: '/01-Java基础/int和Integer装箱是怎么实现的' },
        { text: 'Integer的构造器在Java8后有变动', link: '/01-Java基础/Integer的构造器在Java8后有变动' },
        { text: 'Integer类型的数值比较', link: '/01-Java基础/Integer类型的数值比较' },
        { text: '什么是Java中的Integer缓存池', link: '/01-Java基础/什么是Java中的Integer缓存池' },
        { text: 'hashCode和equal方法是什么', link: '/01-Java基础/hashCode和equal方法是什么' },
        { text: '重写hashCode()、equals()方法的基本原则', link: '/01-Java基础/重写hashCode()、equals()方法的基本原则' },
        { text: '为什么重写equals时也需要重写hashCode', link: '/01-Java基础/为什么重写equals时也需要重写hashCode' },
        { text: 'equal 与 == 的区别', link: '/01-Java基础/equal 与 == 的区别' },
        { text: 'for循环与foreach循环的区别', link: '/01-Java基础/for循环与foreach循环的区别' },
        { text: '什么是动态代理', link: '/01-Java基础/什么是动态代理' },
        { text: 'JDK动态代理与CGLib动态代理的区别', link: '/01-Java基础/JDK动态代理与CGLib动态代理的区别' },
        { text: '什么是Java中的注解', link: '/01-Java基础/什么是Java中的注解' },
        { text: '什么是Java的反射', link: '/01-Java基础/什么是Java的反射' },
        { text: 'Java反射机制如何获取Class类的实例，Class类有哪些常用方法', link: '/01-Java基础/Java反射机制如何获取Class类的实例，Class类有哪些常用方法' },
        { text: 'Java反射机制可以访问父类的私有方法吗', link: '/01-Java基础/Java反射机制可以访问父类的私有方法吗' },
        { text: 'Java反射有没有性能影响|反射到底慢在哪里', link: '/01-Java基础/Java反射有没有性能影响、反射到底慢在哪里' },
        { text: 'Java为什么要引入模块化', link: '/01-Java基础/Java为什么要引入模块化' },
        { text: '什么是Java中的SPI机制', link: '/01-Java基础/什么是Java中的SPI机制' },
        { text: '什么是泛型？泛型有什么用', link: '/01-Java基础/什么是泛型？泛型有什么用' },
        { text: '集合使用泛型有什么优点', link: '/01-Java基础/集合使用泛型有什么优点' },
        { text: 'Java中泛型的T、R、K、V、E是什么', link: '/01-Java基础/Java中泛型的T、R、K、V、E是什么' },
        { text: '泛型中的<? extends T>和<? super T>有什么区别', link: '/01-Java基础/泛型中的extends和super有什么区别' },
        { text: '泛型的实现原理是什么', link: '/01-Java基础/泛型的实现原理是什么' },
        { text: '泛型擦除？会带来什么问题', link: '/01-Java基础/泛型擦除？会带来什么问题' },
        { text: '简述Java的类加载过程', link: '/01-Java基础/简述Java的类加载过程' },
        { text: '什么是BigDecimal？何时使用', link: '/01-Java基础/什么是BigDecimal？何时使用' },
        { text: 'BigDecimal最佳实践', link: '/01-Java基础/BigDecimal最佳实践' },
        { text: '栈和队列在Java中的区别', link: '/01-Java基础/栈和队列在Java中的区别' },
        { text: 'Java的Optional类是什么？有什么用', link: '/01-Java基础/Java的Optional类是什么？有什么用' },
        { text: 'String类可以被继承吗', link: '/01-Java基础/String类可以被继承吗' },
        { text: 'String、StringBuffer、StringBuilder、StringJoiner的区别', link: '/01-Java基础/String、StringBuffer、StringBuilder、StringJoiner的区别' },
        { text: 'String有没有长度限制', link: '/01-Java基础/String有没有长度限制' },
        { text: 'String底层实现是怎么样的', link: '/01-Java基础/String底层实现是怎么样的' },
        { text: '为什么JDK9中将String的char数组改为了byte数组', link: '/01-Java基础/为什么JDK9中将String的char数组改为了byte数组' },
        { text: 'String如何实现编码和解码', link: '/01-Java基础/String如何实现编码和解码' },
        { text: 'String字符串如何进行反转', link: '/01-Java基础/String字符串如何进行反转' },
        { text: 'String类的isEmpty和isBlank的区别', link: '/01-Java基础/String类的isEmpty和isBlank的区别' },
        { text: 'String类中的concat和+有什么区别', link: '/01-Java基础/String类中的concat和+有什么区别' },
        { text: '字符串拼接什么时候用+，什么时候不推荐用+', link: '/01-Java基础/字符串拼接什么时候用+，什么时候不推荐用+' },
        { text: 'String str = new String("hello")创建了几个对象', link: '/01-Java基础/newString' },
        { text: 'String类的intern方法有什么用', link: '/01-Java基础/String类的intern方法有什么用' },
        { text: 'Java中的I/O流是什么', link: '/01-Java基础/Java中的IO流是什么' },
        { text: 'IO中的输入流和输出流有什么区别', link: '/01-Java基础/IO中的输入流和输出流有什么区别' },
        { text: '字节流和字符流的区别', link: '/01-Java基础/字节流和字符流的区别' },
        { text: '缓冲区和缓存的区别', link: '/01-Java基础/缓冲区和缓存的区别' },
        { text: '字节流怎么转化为字符流', link: '/01-Java基础/字节流怎么转化为字符流' },
        { text: '读写文本文件时如何处理字符编码', link: '/01-Java基础/读写文本文件时如何处理字符编码' },
        { text: 'Java序列化是什么', link: '/01-Java基础/Java序列化是什么' },
        { text: '序列化ID（seriaVersionUID）的作用是什么', link: '/01-Java基础/序列化ID（seriaVersionUID）的作用是什么' },
        { text: 'Java有哪两种序列化方式', link: '/01-Java基础/Java有哪两种序列化方式' },
        { text: '静态变量能不能被序列化', link: '/01-Java基础/静态变量能不能被序列化' },
        { text: 'transient关键字有什么作用', link: '/01-Java基础/transient关键字有什么作用' },
        { text: 'ArrayList集合中的elementData数组为什么要加transient修饰', link: '/01-Java基础/ArrayList集合中的elementData数组为什么要加transient修饰' },
        { text: '序列化一个对象时，有哪些需要注意的', link: '/01-Java基础/序列化一个对象时，有哪些需要注意的' },
        { text: '序列化中@Serial注解的作用', link: '/01-Java基础/序列化中@Serial注解的作用' },
        { text: 'Java序列化中如果有些字段不想进行序列化如何处理', link: '/01-Java基础/Java序列化中如果有些字段不想进行序列化如何处理' },
        { text: '什么是BIO、NIO、AIO', link: '/01-Java基础/什么是BIO、NIO、AIO' },
        { text: 'Java如何高效率读写大文件', link: '/01-Java基础/Java如何高效率读写大文件' },
        { text: '如何比较两个文件的内容是否相等', link: '/01-Java基础/如何比较两个文件的内容是否相等' },
        { text: '如何在Java中调用外部可执行程序或系统命令', link: '/01-Java基础/如何在Java中调用外部可执行程序或系统命令' },
      ]
    },
  ],
  '/02-Java集合篇': [
    {
      text: 'Java集合',
      items: [
        { text: 'Comparable 和 Comparator的区别', link: '/02-Java集合篇/Comparable和Comparator的区别' },
        { text: 'Iterable接口与Iterator接口', link: '/02-Java集合篇/Iterable接口与Iterator接口' },
      ]
    },
    {
      text: 'List',
      item: [
        { text: '请你介绍以下常见的List实现类', link: '/02-Java集合篇/List/请你介绍以下常见的List实现类' },
        { text: 'ArrayList', link: '/02-Java集合篇/List/ArrayList 与 Vector 的区别' },
      ]
    }
  ],
  '/04-Java并发篇/': [
    {
      text: 'Java并发篇',
      items: [
        { text: '为什么要使用多线程？', link: '/04-Java并发篇/index' },
        { text: '串行、并行和并发有什么区别？', link: '/04-Java并发篇/串行、并行和并发有什么区别？' },
        { text: '程序、进程、线程？', link: '/04-Java并发篇/程序、进程、线程？' },
        { text: '进程、线程、管程、协程、虚拟线程区别？', link: '/04-Java并发篇/进程、线程、管程、协程、虚拟线程区别？' },
        { text: '线程调度？', link: '/04-Java并发篇/线程调度？' },
        { text: '并发与并行', link: '/04-Java并发篇/并发与并行' },
        { text: '用户线程与守护线程区别', link: '/04-Java并发篇/用户线程与守护线程区别' },
        { text: '线程的基本方法（Thread类的方法）', link: '/04-Java并发篇/线程的基本方法（Thread类的方法）' },
        { text: 'Thread类的特性？', link: '/04-Java并发篇/Thread类的特性？' },
        { text: 'Java创建线程的方式有哪些？', link: '/04-Java并发篇/Java创建线程的方式有哪些？' },
        { text: 'Java创建线程的几种方式有什么区别？', link: '/04-Java并发篇/Java创建线程的几种方式有什么区别？' },
        { text: '为什么不建议使用Executors来创建线程池？', link: '/04-Java并发篇/为什么不建议使用Executors来创建线程池？' },
        { text: '线程池相关的常用API？', link: '/04-Java并发篇/线程池相关的常用API？' },
        { text: 'BlockingQueue是什么？', link: '/04-Java并发篇/BlockingQueue是什么？' },
        { text: 'ArrayBlockingQueue 与 LinkedBlockingQueue区别', link: '/04-Java并发篇/ArrayBlockingQueue与LinkedBlockingQueue区别' },
        { text: '介绍一下常用的Java的线程池？', link: '/04-Java并发篇/介绍一下常用的Java的线程池？' },
        { text: 'Java线程池的原理', link: '/04-Java并发篇/Java线程池的原理' },
        { text: '使用线程池的好处', link: '/04-Java并发篇/使用线程池的好处' },
        { text: '线程池的核心构造参数有哪些？', link: '/04-Java并发篇/线程池的核心构造参数有哪些？' },
        { text: '如何重构一个线程工厂', link: '/04-Java并发篇/如何重构一个线程工厂' },
        { text: '线程池的拒绝策略有哪些？', link: '/04-Java并发篇/线程池的拒绝策略有哪些？' },
        { text: '线程池的shutDown和shutDownNow的区别', link: '/04-Java并发篇/线程池的shutDown和shutDownNow的区别' },
        { text: '多次调用shutDown或shutDownNow 会怎么样？', link: '/04-Java并发篇/多次调用shutDown或shutDownNow 会怎么样？' },
        { text: '利用线程池批量删除数据，数据量突然增大怎么办？', link: '/04-Java并发篇/利用线程池批量删除数据，数据量突然增大怎么办？' },
        { text: 'Java中有哪些队列？', link: '/04-Java并发篇/Java中有哪些队列？' },
        { text: '阻塞队列原理？', link: '/04-Java并发篇/阻塞队列原理？' },
        { text: '终止线程的四种方式', link: '/04-Java并发篇/终止线程的四种方式' },
        { text: '启动一个线程用start还是run？', link: '/04-Java并发篇/启动一个线程用start还是run？' },
        { text: '为什么启动线程不直接调用run()，而调用start()？', link: '/04-Java并发篇/为什么启动线程不直接调用run()，而调用start()？' },
        { text: '两次调用start方法会怎么样？', link: '/04-Java并发篇/两次调用start方法会怎么样？' },
        { text: 'Java多线程的生命周期是什么', link: '/04-Java并发篇/Java多线程的生命周期是什么' },
        { text: '创建线程的底层原理？', link: '/04-Java并发篇/创建线程的底层原理？' },
        { text: '怎么理解线程分组？编程实现一个线程分组的例子？', link: '/04-Java并发篇/怎么理解线程分组？编程实现一个线程分组的例子？' },
        { text: '线程的状态有哪几种？', link: '/04-Java并发篇/线程的状态有哪几种？' },
        { text: 'JDK1.5之前线程的五种状态', link: '/04-Java并发篇/JDK1.5之前线程的五种状态' },
        { text: 'JDK1.5之后线程的五种状态', link: '/04-Java并发篇/JDK1.5之后线程的五种状态' },
        { text: '线程的生命周期在Java中是如何定义的？', link: '/04-Java并发篇/线程的生命周期在Java中是如何定义的？' },
        { text: 'Java的线程的优先级是什么？有什么用？', link: '/04-Java并发篇/Java的线程的优先级是什么？有什么用？' },
        { text: 'join方法有什么用？什么原理？', link: '/04-Java并发篇/join方法有什么用？什么原理？' },
        { text: '怎么让3个线程按顺序执行？', link: '/04-Java并发篇/怎么让3个线程按顺序执行？' },
        { text: 'Java中如何控制多个线程的执行顺序？', link: '/04-Java并发篇/Java中如何控制多个线程的执行顺序？' },
        { text: '线程间的通信方式？', link: '/04-Java并发篇/线程间的通信方式？' },
        { text: 'JVM的线程调度是什么？', link: '/04-Java并发篇/JVM的线程调度是什么？' },
        { text: '引起CPU进行上下文切换的原因', link: '/04-Java并发篇/引起CPU进行上下文切换的原因' },
        { text: '线程什么时候主动放弃CPU', link: '/04-Java并发篇/线程什么时候主动放弃CPU' },
        { text: 'sleep和wait的主要区别？', link: '/04-Java并发篇/sleep和wait的主要区别？' },
        { text: 'sleep和wait、yield方法有什么区别？', link: '/04-Java并发篇/sleep和wait、yield方法有什么区别？' },
        { text: 'Thread.sleep(0)有意义吗？有什么用？', link: '/04-Java并发篇/Thread.sleep(0)有意义吗？有什么用？' },
        { text: '怎么理解Java中的线程中断（interrupt）？', link: '/04-Java并发篇/怎么理解Java中的线程中断（interrupt）？' },
        { text: '为什么多线程执行时，需要catch InterruptedException异常，catch里面写啥', link: '/04-Java并发篇/为什么多线程执行时，需要catch InterruptedException异常，catch里面写啥' },
        { text: 'interrupt的标志位是否会回归到原有标记', link: '/04-Java并发篇/interrupt的标志位是否会回归到原有标记' },
        { text: 'interrupt和stop有什么区别？', link: '/04-Java并发篇/interrupt和stop有什么区别？' },
        { text: '为什么推荐使用 interrupt() 而不是 stop()？', link: '/04-Java并发篇/为什么推荐使用 interrupt() 而不是 stop()？' },
        { text: '什么是LockSupport类？Park和unPark的使用', link: '/04-Java并发篇/什么是LockSupport类？Park和unPark的使用' },
        { text: 'LockSupport的park/unpark为什么可以突破wait/notify的原有调用顺序？', link: '/04-Java并发篇/LockSupport的park、unpark为什么可以突破wait、notify的原有调用顺序？' },
        { text: 'LockSupport的park/unpark为什么唤醒两次后阻塞两次，但最终结果还是会阻塞线程？', link: '/04-Java并发篇/LockSupport的park、unpark为什么唤醒两次后阻塞两次，但最终结果还是会阻塞线程？' },
        { text: '如何优雅的终止一个线程？', link: '/04-Java并发篇/如何优雅的终止一个线程？' },
        { text: '如何判断代码是不是有线程安全问题？如何解决', link: '/04-Java并发篇/如何判断代码是不是有线程安全问题？如何解决' },
        { text: 'wait和notify的虚假唤醒的产生原因及如何解决', link: '/04-Java并发篇/wait和notify的虚假唤醒的产生原因及如何解决' },
        { text: '怎么理解wait、notify、notifyAll方法？', link: '/04-Java并发篇/怎么理解wait、notify、notifyAll方法？' },
        { text: '死锁的发生原因？怎么避免？', link: '/04-Java并发篇/死锁的发生原因？怎么避免？' },
        { text: '排除死锁的方式有哪些？', link: '/04-Java并发篇/排除死锁的方式有哪些？' },
        { text: '什么是协程？Java支持协程吗？', link: '/04-Java并发篇/什么是协程？Java支持协程吗？' },
        { text: '什么是Java中的线程同步？', link: '/04-Java并发篇/什么是Java中的线程同步？' },
        { text: '什么是Java中的ABA问题？', link: '/04-Java并发篇/什么是Java中的ABA问题？' },   
        { text: 'Java内存模型（JMM）？', link: '/04-Java并发篇/Java内存模型（JMM）？' },
        { text: '线程的安全三大特性', link: '/04-Java并发篇/线程的安全三大特性' },
    
    
        { text: '什么是Java的happens-before规则？（JMM规范）', link: '/04-Java并发篇/什么是Java的happens-before规则？（JMM规范）' },
        { text: 'volatile关键字的作用？', link: '/04-Java并发篇/volatile关键字的作用？' },
        { text: '什么是Java中的指令重排？', link: '/04-Java并发篇/什么是Java中的指令重排？' },
        { text: '为什么指令重排能够提高性能？', link: '/04-Java并发篇/为什么指令重排能够提高性能？' },
        { text: 'volatile如何防止指令重排？', link: '/04-Java并发篇/volatile如何防止指令重排？' },
        { text: 'volatile保证线程的可见性和有序性，不保证原子性是为什么？', link: '/04-Java并发篇/volatile保证线程的可见性和有序性，不保证原子性是为什么？' },
        { text: '什么是内存屏障？', link: '/04-Java并发篇/什么是内存屏障' },
        { text: 'final关键字能否保证变量的可见性？', link: '/04-Java并发篇/final关键字能否保证变量的可见性？' },
        { text: 'Java中为什么需要使用ThreadLocal？ThreadLocal原理', link: '/04-Java并发篇/Java中为什么需要使用ThreadLocal？ThreadLocal原理' },
        { text: 'ThreadLocal有哪些使用场景？', link: '/04-Java并发篇/ThreadLocal有哪些使用场景？' },
        { text: 'ThreadLocal慎用的场景', link: '/04-Java并发篇/ThreadLocal慎用的场景' },
        { text: 'ThreadLocal最佳实践？', link: '/04-Java并发篇/ThreadLocal最佳实践？' },
        { text: 'ThreadLocal的内存泄漏问题', link: '/04-Java并发篇/ThreadLocal的内存泄漏问题' },
        { text: '如何避免ThreadLocal的内存泄漏？', link: '/04-Java并发篇/如何避免ThreadLocal的内存泄漏？' },
        { text: '使用ThreadLocal是需要用弱引用来防止内存泄露？', link: '/04-Java并发篇/使用ThreadLocal是需要用弱引用来防止内存泄露？' },
        { text: 'ThreadLocal是如何实现线程资源隔离的？', link: '/04-Java并发篇/ThreadLocal是如何实现线程资源隔离的？' },
        { text: 'Java中父子线程的共享（传递）？', link: '/04-Java并发篇/Java中父子线程的共享（传递）？' },
        { text: '什么是Java中的InheritableThreadLocal？', link: '/04-Java并发篇/什么是Java中的InheritableThreadLocal？' },
        { text: '什么是Java中的TransmittableThreadLocal？', link: '/04-Java并发篇/什么是Java中的TransmittableThreadLocal？' },
        { text: '为什么Netty不适用ThreadLocal而是自定义FastThreadLocal？', link: '/04-Java并发篇/为什么Netty不适用ThreadLocal而是自定义FastThreadLocal？' },
        { text: 'Java中线程安全是什么意思？', link: '/04-Java并发篇/Java中线程安全是什么意思？' },
        { text: '你是怎么理解线程安全问题的？', link: '/04-Java并发篇/你是怎么理解线程安全问题的？' },
        { text: 'Java中线程之间是如何通信的？', link: '/04-Java并发篇/Java中线程之间是如何通信的？' },
        { text: '谈谈你对AQS的理解？AbstractQueuedSynchronizedr', link: '/04-Java并发篇/谈谈你对AQS的理解？AbstractQueuedSynchronizedr' },
        { text: '谈谈你对CAS的理解？Compare-And-Swap', link: '/04-Java并发篇/谈谈你对CAS的理解？Compare-And-Swap' },
        { text: 'Unsafe', link: '/04-Java并发篇/Unsafe' },
        { text: 'CAS的缺点？', link: '/04-Java并发篇/CAS的缺点？' },
        { text: '说说Java中的原子类？', link: '/04-Java并发篇/说说Java中的原子类？' },
        { text: '说说JUC中的累加器？', link: '/04-Java并发篇/说说JUC中的累加器？' },
        { text: '什么是自旋锁？自旋锁的优缺点', link: '/04-Java并发篇/什么是自旋锁？自旋锁的优缺点' },
        { text: '自旋锁时间阈值', link: '/04-Java并发篇/自旋锁时间阈值' },
        { text: '什么是可重入锁（递归锁）？', link: '/04-Java并发篇/什么是可重入锁（递归锁）？' },
        { text: 'ReentrantLock和synchronized的区别？', link: '/04-Java并发篇/ReentrantLock和synchronized的区别？' },
        { text: '什么是可重入锁及使用场景？', link: '/04-Java并发篇/什么是可重入锁及使用场景？' },
        { text: '可重入锁实现原理', link: '/04-Java并发篇/可重入锁实现原理' },
        { text: '锁升级机制是怎样的', link: '/04-Java并发篇/锁升级机制是怎样的' },
        { text: '常用的锁都有哪些，适用的场景', link: '/04-Java并发篇/常用的锁都有哪些，适用的场景' },
        { text: 'Lock常用的实现类？', link: '/04-Java并发篇/Lock常用的实现类？' },
        { text: 'Locak的实现方法？', link: '/04-Java并发篇/Locak的实现方法？' },
        { text: 'ReentrantLock的实现', link: '/04-Java并发篇/ReentrantLock的实现' },
        { text: 'Semaphore信号量的使用', link: '/04-Java并发篇/Semaphore信号量的使用' },
        { text: 'Semaphore类', link: '/04-Java并发篇/Semaphore类' },
        { text: 'synchronized同步锁有哪几种方法？', link: '/04-Java并发篇/synchronized同步锁有哪几种方法？' },
        { text: '如何选择同步锁对象？如何设定同步代码访问？', link: '/04-Java并发篇/如何选择同步锁对象？如何设定同步代码访问？' },
        { text: 'Java中的synchronized是怎么实现的？（底层原理）', link: '/04-Java并发篇/Java中的synchronized是怎么实现的？（底层原理）' },
        { text: 'synchronized是可重入锁吗？它的重入实现原理？', link: '/04-Java并发篇/synchronized是可重入锁吗？它的重入实现原理？' },
        { text: 'synchronized能否被打断，什么情况下打断', link: '/04-Java并发篇/synchronized能否被打断，什么情况下打断' },
        { text: 'synchronized的不同作用范围有什么区别', link: '/04-Java并发篇/synchronized的不同作用范围有什么区别' },
        { text: '为什么wait和notify必须要在synchronized代码块使用？', link: '/04-Java并发篇/为什么wait和notify必须要在synchronized代码块使用？' },
        { text: 'Java中的synchronized轻量级锁是否会进行自旋？', link: '/04-Java并发篇/Java中的synchronized轻量级锁是否会进行自旋？' },
        { text: 'Java中的synchronized升级到重量级锁时，会发生什么？', link: '/04-Java并发篇/Java中的synchronizeds升级到重量级锁时，会发生什么？' },
        { text: '什么是Java中的锁自适应自旋？', link: '/04-Java并发篇/什么是Java中的锁自适应自旋？' },
        { text: 'lock和synchronized的区别？', link: '/04-Java并发篇/lock和synchronized的区别？' },
        { text: '线程池的异步任务执行完后，如何回调', link: '/04-Java并发篇/线程池的异步任务执行完后，如何回调' },
        { text: '你理解Java线程池原理吗？', link: '/04-Java并发篇/你理解Java线程池原理吗？' },
        { text: '你的项目中是如何使用线程池的？', link: '/04-Java并发篇/你的项目中是如何使用线程池的？' },
        { text: '如何设置Java线程池的线程数（实际工作中）？', link: '/04-Java并发篇/如何设置Java线程池的线程数（实际工作中）？' },
        { text: 'Java线程池有哪些拒绝策略？', link: '/04-Java并发篇/Java线程池有哪些拒绝策略？' },
        { text: '如何优化Java中的锁？', link: '/04-Java并发篇/如何优化Java中的锁？' },
        { text: '线程池如何知道一个线程的任务已经执行完毕了？（小米）', link: '/04-Java并发篇/线程池如何知道一个线程的任务已经执行完毕了？（小米）' },
        { text: 'Java并发库中提供了哪些线程池实现？它们有什么区别？', link: '/04-Java并发篇/Java并发库中提供了哪些线程池实现？它们有什么区别？' },
        { text: 'Java中的Delay和ScheduledThreadPool有什么区别？', link: '/04-Java并发篇/Java中的Delay和ScheduledThreadPool有什么区别？' },
        { text: '什么是Java的Timer？', link: '/04-Java并发篇/什么是Java的Timer？' },
        { text: '什么叫做阻塞队列的有界和无解？', link: '/04-Java并发篇/什么叫做阻塞队列的有界和无解？' },
        { text: 'ReadWriteLock的整体实现', link: '/04-Java并发篇/ReadWriteLock的整体实现' },
        { text: 'Lock的公平锁与非公平锁', link: '/04-Java并发篇/Lock的公平锁与非公平锁' },
        { text: '为什么会有公平锁与非公平锁的设计？为什么要默认非公平？', link: '/04-Java并发篇/为什么会有公平锁与非公平锁的设计？为什么要默认非公平？' },
        { text: '什么时候用公平锁？什么时候用非公平锁？', link: '/04-Java并发篇/什么时候用公平锁？什么时候用非公平锁？' },
        { text: '你使用过Java中哪些原子类？', link: '/04-Java并发篇/你使用过Java中哪些原子类？' },
        { text: 'AtomicInteger的实现方式及场景', link: '/04-Java并发篇/AtomicInteger的实现方式及场景' },
        { text: '你使用过Java中的累加器吗？', link: '/04-Java并发篇/你使用过Java中的累加器吗？' },
        { text: '你了解时间轮（Time Wheel）吗？他在Java中有哪些应用场景？', link: '/04-Java并发篇/你了解时间轮（Time Wheel）吗？他在Java中有哪些应用场景？' },
        { text: '你使用过哪些Java并发工具？', link: '/04-Java并发篇/你使用过哪些Java并发工具？' },
        { text: '什么是守护线程？他有什么特点？', link: '/04-Java并发篇/什么是守护线程？他有什么特点？' },
        { text: 'reentrantLock是如何实现公平锁和非公平锁？', link: '/04-Java并发篇/reentrantLock是如何实现公平锁和非公平锁？' },
        { text: 'reentrantLock的实现原理？', link: '/04-Java并发篇/reentrantLock的实现原理？' },
        { text: '你了解Java中的读写锁吗？', link: '/04-Java并发篇/你了解Java中的读写锁吗？' },
        { text: '什么是Java的Semaphore？', link: '/04-Java并发篇/什么是Java的Semaphore？' },
        { text: '什么是Java的CycliBarrier？', link: '/04-Java并发篇/什么是Java的CycliBarrier？' },
        { text: '什么是Java的CountDownLatch？countdownLatch用法', link: '/04-Java并发篇/什么是Java的CountDownLatch？countdownLatch用法' },
        { text: '什么是Java的CyclicBarrier？CyclicBarrier用法？', link: '/04-Java并发篇/什么是Java的CyclicBarrier？CyclicBarrier用法？' },
        { text: '什么是Java的StampedLock？', link: '/04-Java并发篇/什么是Java的StampedLock？' },
        { text: '什么是FutureTask？', link: '/04-Java并发篇/什么是FutureTask？' },
        { text: '什么是Java的CompletableFuture？', link: '/04-Java并发篇/什么是Java的CompletableFuture？' },
        { text: '什么是Java的ForkJoinPool？', link: '/04-Java并发篇/什么是Java的ForkJoinPool？' },
        { text: '乐观锁如果通过数据库实现，并发情况下，数据库如何保证一致', link: '/04-Java并发篇/乐观锁如果通过数据库实现，并发情况下，数据库如何保证一致' },
        { text: '一道题搞懂所有锁', link: '/04-Java并发篇/一道题搞懂所有锁' },
   
   
   
   
   
   
   
   
   
      ]
    }
  ],

}