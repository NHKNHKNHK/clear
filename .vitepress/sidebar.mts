
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
        { text: '基础篇23', link: '/basic/index' },
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
        { text: '如何在Java中调用外部可执行程序或系统命令', link: '/01-Java基础/如何在Java中调用外部可执行程序或系统命令？' },
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

}