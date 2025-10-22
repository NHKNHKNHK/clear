import javaSidebar from './sidebar/java/index'
import springSidebar from './sidebar/spring/index'
import vueSidebar from './sidebar/vue/index'
import esSidebar from './sidebar/es/index'
import springMvcSidebar from './sidebar/springmvc/index'
import springBootSidebar from './sidebar/springboot/index'
import ormSidebar from './sidebar/orm/index'
import mysqlSidebar from './sidebar/mysql/index'

export default {
  '/01-Java基础/': [
    javaSidebar,
    {
      text: 'Java基础',
      collapsed: false, // 折叠 默认展开，初始页面加载时折叠设置为true
      items: [
        { text: 'index', link: '/01-Java基础/' },
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
  '/02-Java集合篇/': [
    {
      text: 'Java集合',
      collapsed: false,
      items: [
        { text: '导航', link: '/02-Java集合篇/index' },
        { text: '集合篇', link: '/02-Java集合篇/Java集合篇' },
        { text: '数组和链表在Java中的区别？', link: '/02-Java集合篇/数组和链表在Java中的区别？' },
        { text: 'Java中有哪些集合类？概述Java集合体系？', link: '/02-Java集合篇/Java中有哪些集合类？概述Java集合体系？' },
        { text: 'List、Set、Map之间的区别是什么？', link: '/02-Java集合篇/List、Set、Map之间的区别是什么？' },
        { text: 'Collection和Collections的区别？', link: '/02-Java集合篇/Collection和Collections的区别？' },
        { text: '为什么Map接口不继承Collection接口？', link: '/02-Java集合篇/为什么Map接口不继承Collection接口？' },
        { text: 'Arrays.asList() 方法把数组转换成集合', link: '/02-Java集合篇/Arrays.asList() 方法把数组转换成集合' },
        { text: 'List和Array之间如何互相转换？', link: '/02-Java集合篇/List和Array之间如何互相转换？' },
        { text: '集合遍历时remove或add操作注意事项？', link: '/02-Java集合篇/集合遍历时remove或add操作注意事项？' },
        { text: 'Comparable 和 Comparator的区别', link: '/02-Java集合篇/Comparable和Comparator的区别' },
        { text: 'Iterable接口与Iterator接口', link: '/02-Java集合篇/Iterable接口与Iterator接口' },
        { text: 'Enumeration和Iterator接口的区别？', link: '/02-Java集合篇/Enumeration和Iterator接口的区别？' },
        { text: '什么是fail-fast机制（快速失败）？', link: '/02-Java集合篇/什么是fail-fast机制（快速失败）？' },
        { text: '什么是fail-safe机制（副本机制）？', link: '/02-Java集合篇/什么是fail-safe机制（副本机制）？' },
        { text: 'fail-fast和fail-safe有什么区别？', link: '/02-Java集合篇/fail-fast和fail-safe有什么区别？' },
        { text: '如何确保函数不能修改集合？', link: '/02-Java集合篇/如何确保函数不能修改集合？' },
        { text: '哪些集合支持对元素的随机访问？', link: '/02-Java集合篇/哪些集合支持对元素的随机访问？' },
        { text: 'foreach于普通for循环的区别？', link: '/02-Java集合篇/foreach于普通for循环的区别？' },
        { text: 'foreach和迭代器有什么关系？', link: '/02-Java集合篇/foreach和迭代器有什么关系？' },
        { text: 'List遍历有那几种遍历方式？', link: '/02-Java集合篇/List遍历有那几种遍历方式？' },
        { text: '什么是Java中的Copy-On-Write？', link: '/02-Java集合篇/什么是Java中的Copy-On-Write？' },
        { text: '常用的并发集合有哪些？', link: '/02-Java集合篇/常用的并发集合有哪些？' },
        { text: 'CopyOnWriteArrayList和Collections.synchronization有什么区别？分别有什么优缺点？', link: '/02-Java集合篇/CopyOnWriteArrayList和Collections.synchronization有什么区别？分别有什么优缺点？' },
      ]
    },
    {
      text: 'List',
      collapsed: false,
      items: [
        { text: '请你介绍以下常见的List实现类', link: '/02-Java集合篇/List/请你介绍以下常见的List实现类' },
        { text: 'ArrayList 与 Vector 的区别？', link: '/02-Java集合篇/List/ArrayList 与 Vector 的区别？' },
        { text: 'ArrayList初始容量是多少？', link: '/02-Java集合篇/List/ArrayList初始容量是多少？' },
        { text: 'ArrayList是如何扩容的？（扩容机制）', link: '/02-Java集合篇/List/ArrayList是如何扩容的？' },
        { text: 'ArrayList第二次扩容时容量大小？', link: '/02-Java集合篇/List/ArrayList第二次扩容时容量大小？' },
        { text: 'ArrayList的添加与删除元素为什么慢？', link: '/02-Java集合篇/List/ArrayList的添加与删除元素为什么慢？' },
        { text: 'ArrayList是线程安全的吗？', link: '/02-Java集合篇/List/ArrayList是线程安全的吗？' },
        { text: 'ArrayList如何保证线程安全？', link: '/02-Java集合篇/List/ArrayList如何保证线程安全？' },
        { text: 'ArrayList可以插入null吗？为什么？', link: '/02-Java集合篇/List/ArrayList可以插入null吗？为什么？' },
        { text: 'ArrayList和LinkedList有什么区别？', link: '/02-Java集合篇/List/ArrayList和LinkedList有什么区别？' },
        { text: 'LinkedList 真的比 ArrayList 添加元素快吗？', link: '/02-Java集合篇/List/LinkedList 真的比 ArrayList 添加元素快吗？' },
        { text: '栈和队列有什么区别？', link: '/02-Java集合篇/List/栈和队列有什么区别？' },
        { text: '什么是阻塞队列？', link: '/02-Java集合篇/List/什么是阻塞队列？' },
        { text: '如何手写一个生产者与消费者队列？', link: '/02-Java集合篇/List/如何手写一个生产者与消费者队列？' },
        { text: '编程实现删除List集合中的元素，有几种方式？', link: '/02-Java集合篇/List/编程实现删除List集合中的元素，有几种方式？' },
      ]
    },
    {
      text: 'Set',
      collapsed: false,
      items: [
        { text: 'Java中Set有哪些常见实现类？', link: '/02-Java集合篇/Set/Java中Set有哪些常见实现类？' },
        { text: 'HashSet 中添加元素的过程？', link: '/02-Java集合篇/Set/HashSet 中添加元素的过程？' },
        { text: 'HashSet如何实现线程安全？', link: '/02-Java集合篇/Set/HashSet如何实现线程安全？' },
        { text: 'HashSet、LinkedHashSet、TreeSet的区别？', link: '/02-Java集合篇/Set/HashSet、LinkedHashSet、TreeSet的区别？' },


        { text: 'HashSet和HashMap的区别是什么？', link: '/02-Java集合篇/Set/HashSet和HashMap的区别是什么？' },
        { text: 'HashSet是如何保证元素唯一性的？', link: '/02-Java集合篇/Set/HashSet是如何保证元素唯一性的？' },
        { text: '为什么HashSet的add方法是常量时间复杂度？', link: '/02-Java集合篇/Set/为什么HashSet的add方法是常量时间复杂度？' },
      ]
    },
    {
      text: 'Map',
      collapsed: false,
      items: [
        { text: 'Java中Map有哪些常见实现类？', link: '/02-Java集合篇/Map/Java中Map有那些常见实现类？' },
        { text: 'Hashtable 与 HashMap的区别？', link: '/02-Java集合篇/Map/Hashtable 与 HashMap的区别？' },
        { text: 'HashMap和Hashtable的区别？', link: '/02-Java集合篇/Map/Hashtable 与 HashMap的区别？' },
        { text: 'HashMap、LinkedHashMap、TreeMap与Hashtable的区别？', link: '/02-Java集合篇/Map/HashMap、LinkedHashMap、TreeMap与Hashtable的区别？' },
        { text: '什么是IdentityHashMap？', link: '/02-Java集合篇/Map/什么是IdentityHashMap？' },
        { text: '什么是WeakHashMap？', link: '/02-Java集合篇/Map/什么是WeakHashMap？' },
        { text: 'HashMap是怎么计算hashCode的？（HashMap是怎么确定key存储在数组上的索引位置的？）', link: '/02-Java集合篇/Map/HashMap是怎么计算hashCode的？（HashMap是怎么确定key存储在数组上的索引位置的？）' },
        { text: 'HashMap为什么要使用扰动函数？', link: '/02-Java集合篇/Map/HashMap为什么要使用扰动函数？' },
        { text: '为什么HashMap扩容时采用2^n倍（2的幂次）？', link: '/02-Java集合篇/Map/为什么HashMap扩容时采用2^n倍（2的幂次）？' },
        { text: 'HashMap的默认容器到底是多大？', link: '/02-Java集合篇/Map/HashMap的默认容器到底是多大？' },
        { text: 'HashMap的主要参数都有哪些？', link: '/02-Java集合篇/Map/HashMap的主要参数都有哪些？' },
        { text: '解决hash碰撞的方法？', link: '/02-Java集合篇/Map/解决hash碰撞的方法？' },
        { text: '为什么HashMap的默认负载因子是0.75？', link: '/02-Java集合篇/Map/为什么HashMap的默认负载因子是0.75？' },
        { text: '重新调整HashMap大小存在什么问题吗？', link: '/02-Java集合篇/Map/重新调整HashMap大小存在什么问题吗？' },
        { text: 'HashMap扩容机制？', link: '/02-Java集合篇/Map/HashMap扩容机制？' },
        { text: 'JDK1.7中HashMap的实现？', link: '/02-Java集合篇/Map/JDK1.7中HashMap的实现？' },
        { text: 'JDK1.8中HashMap的实现？', link: '/02-Java集合篇/Map/JDK1.8中HashMap的实现？' },
        { text: 'JDK8的HashMap的put过程？', link: '/02-Java集合篇/Map/JDK8的HashMap的put过程？' },
        { text: '为什么String, Integer这样的wrapper类适合作为键？', link: '/02-Java集合篇/Map/为什么String, Integer这样的wrapper类适合作为键？' },
        { text: '为什么JDK8对HashMap进行了红黑树改动？', link: '/02-Java集合篇/Map/为什么JDK8对HashMap进行了红黑树改动？' },
        { text: 'JDK8对HashMap进行了哪些改动，除了红黑树？', link: '/02-Java集合篇/Map/JDK8对HashMap进行了哪些改动，除了红黑树？' },
        { text: '为什么HashMap多线程会进入死循环？', link: '/02-Java集合篇/Map/为什么HashMap多线程会进入死循环？' },
        { text: '使用HashMap时，有哪些提升性能的技巧？', link: '/02-Java集合篇/Map/使用HashMap时，有哪些提升性能的技巧？' },
        { text: 'LinkedHashMap是如何保证有序性的？', link: '/02-Java集合篇/Map/LinkedHashMap是如何保证有序性的？' },
        { text: 'LinkedHashMap为什么能用来做LRUCache？', link: '/02-Java集合篇/Map/LinkedHashMap为什么能用来做LRUCache？' },
        { text: 'JDK7中ConcurrentHashMap的实现？', link: '/02-Java集合篇/Map/JDK7中ConcurrentHashMap的实现？' },
        { text: 'JDK8中ConcurrentHashMap的实现？', link: '/02-Java集合篇/Map/JDK8中ConcurrentHashMap的实现？' },
        { text: 'ConcurrentHashMap在JDK7和8之间的区别？', link: '/02-Java集合篇/Map/ConcurrentHashMap在JDK7和8之间的区别？' },
        { text: 'ConcurrentHashMap的get方法是否需要加锁？', link: '/02-Java集合篇/Map/ConcurrentHashMap的get方法是否需要加锁？' },
        { text: '为什么ConcurrentHashMap的k-v都不能为null？', link: '/02-Java集合篇/Map/为什么ConcurrentHashMap的k-v都不能为null？' },
        { text: 'ConcurrentHashMap底层具体实现你知道吗？实现原理？', link: '/02-Java集合篇/Map/ConcurrentHashMap底层具体实现你知道吗？实现原理？' },
        { text: '你遇到过ConrrentModificationException异常吗？', link: '/02-Java集合篇/Map/你遇到过ConrrentModificationException异常吗？' },
      ]
    }
  ],
  '/03-JVM篇/': [
    {
      text: 'JVM',
      items: [
        { text: '导航', link: '/03-JVM篇/' },
        { text: 'Java是如何实现跨平台的？', link: '/03-JVM篇/Java是如何实现跨平台的？' },
        { text: '说说对象的创建过程？', link: '/03-JVM篇/说说对象的创建过程？' },
        { text: '如何判断对象的存活？解释强引用、软引用、弱引用和虚引用？', link: '/03-JVM篇/如何判断对象的存活？解释强引用、软引用、弱引用和虚引用？' },
        { text: 'JVM的内存结构？', link: '/03-JVM篇/JVM的内存结构？' },
        { text: 'JVM的内存区域是如何划分的？', link: '/03-JVM篇/JVM的内存区域是如何划分的？' },
        { text: 'Java中的堆和栈的区别是什么？', link: '/03-JVM篇/Java中的堆和栈的区别是什么？' },
        { text: '堆里的分区怎么划分？', link: '/03-JVM篇/堆里的分区怎么划分？' },
        { text: '什么是Java中的直接内存？', link: '/03-JVM篇/什么是Java中的直接内存？' },
        { text: '编译执行和解释执行的区别是什么？JVM使用哪种方式？', link: '/03-JVM篇/编译执行和解释执行的区别是什么？JVM使用哪种方式？' },
        { text: '什么是Java中的常量池？', link: '/03-JVM篇/什么是Java中的常量池？' },
        { text: '什么是JVM垃圾回收的concurrent-mode-failure？产生它的真正原因是什么？', link: '/03-JVM篇/什么是JVM垃圾回收的concurrent-mode-failure？产生它的真正原因是什么？' },
        { text: 'JVM的TLAB是什么？', link: '/03-JVM篇/JVM的TLAB是什么？' },
        { text: '怎么分析OOM内存溢出？', link: '/03-JVM篇/怎么分析OOM内存溢出？' },
        { text: '你了解Java中的类加载器吗？', link: '/03-JVM篇/你了解Java中的类加载器吗？' },
        { text: '什么是Java中的JIT（Just-In-Time）？', link: '/03-JVM篇/什么是Java中的JIT（Just-In-Time）？' },
        { text: '什么是Java中的AOT（Ahead-Of-Time）？', link: '/03-JVM篇/什么是Java中的AOT（Ahead-Of-Time）？' },
        { text: '你了解Java中的逃逸分析吗？', link: '/03-JVM篇/你了解Java中的逃逸分析吗？' },
        { text: 'Java中常见的垃圾收集器有哪些？', link: '/03-JVM篇/Java中常见的垃圾收集器有哪些？' },
        { text: '什么是双亲委派？', link: '/03-JVM篇/什么是双亲委派？' },
        { text: '什么是指令重排？', link: '/03-JVM篇/什么是指令重排？' },
        { text: 'JVM怎么判断一个对象可以被回收？', link: '/03-JVM篇/JVM怎么判断一个对象可以被回收？' },
        { text: '如何判断对象是否是垃圾？不同垃圾回收方法的区别？', link: '/03-JVM篇/如何判断对象是否是垃圾？不同垃圾回收方法的区别？' },
        { text: '为什么Java的垃圾收集器将堆分为老年代和新生代？', link: '/03-JVM篇/为什么Java的垃圾收集器将堆分为老年代和新生代？' },
        { text: '为什么Java8移除了永久代（PermGen）并引入元空间（Metaspace）？', link: '/03-JVM篇/为什么Java8移除了永久代（PermGen）并引入元空间（Metaspace）？' },
        { text: 'G1垃圾收集的特点？为什么低延迟？', link: '/03-JVM篇/G1垃圾收集的特点？为什么低延迟？' },
        { text: 'G1垃圾回收流程？', link: '/03-JVM篇/G1垃圾回收流程？' },
        { text: 'CMS垃圾回收流程？', link: '/03-JVM篇/CMS垃圾回收流程？' },
        { text: '你了解Java的ZGC吗？', link: '/03-JVM篇/你了解Java的ZGC吗？' },
        { text: '为什么初始标记和重新标记需要STW（Stop-The-World）？', link: '/03-JVM篇/为什么初始标记和重新标记需要STW（Stop-The-World）？' },
        { text: '除了GC还有其他场景用安全点吗？', link: '/03-JVM篇/除了GC还有其他场景用安全点吗？' },
        { text: 'CMS的垃圾回收过程，为什么需要分四步？', link: '/03-JVM篇/CMS的垃圾回收过程，为什么需要分四步？' },
        { text: 'JVM垃圾回收调优的两个主要目标是什么？', link: '/03-JVM篇/JVM垃圾回收调优的两个主要目标是什么？' },
        { text: '如何对Java的垃圾回收进行调优？', link: '/03-JVM篇/如何对Java的垃圾回收进行调优？' },
        { text: '常用的JVM配置参数有哪些？', link: '/03-JVM篇/常用的JVM配置参数有哪些？' },
        { text: '如何在Java中进行内存泄露分析？', link: '/03-JVM篇/如何在Java中进行内存泄露分析？' },
        { text: '你常用哪些工具来分析JVM性能？', link: '/03-JVM篇/你常用哪些工具来分析JVM性能？' },
        { text: 'Java中的CMS垃圾收集器的写屏障如何维护卡表和增量更新？', link: '/03-JVM篇/Java中的CMS垃圾收集器的写屏障如何维护卡表和增量更新？' },
        { text: '什么是Java中的logging-write-barrier？', link: '/03-JVM篇/什么是Java中的logging-write-barrier？' },
        { text: '为什么G1垃圾收集器不维护年轻代到老年代的记忆集？', link: '/03-JVM篇/为什么G1垃圾收集器不维护年轻代到老年代的记忆集？' },
        { text: 'CMS和G1垃圾收集器如何维持并发的正确性？', link: '/03-JVM篇/CMS和G1垃圾收集器如何维持并发的正确性？' },
        { text: 'CMS和G1垃圾收集器在记忆集的维护上有什么不同？', link: '/03-JVM篇/CMS和G1垃圾收集器在记忆集的维护上有什么不同？' },
        { text: 'JVM新生代回收如何避免全堆扫描？', link: '/03-JVM篇/JVM新生代回收如何避免全堆扫描？' },
        { text: '为什么Java中某些新生代和老年代的垃圾收集器不能组合使用？比如ParNew和Parallel-Old', link: '/03-JVM篇/为什么Java中某些新生代和老年代的垃圾收集器不能组合使用？比如ParNew和Parallel-Old' },
        { text: '为什么Java中CMS垃圾收集器在发生Concurrent-Mode-Failure时的Full-GC是单线程的？', link: '/03-JVM篇/为什么Java中CMS垃圾收集器在发生Concurrent-Mode-Failure时的Full-GC是单线程的？' },
        { text: '什么是Java的PLAB？', link: '/03-JVM篇/什么是Java的PLAB？' },
        { text: '什么条件会触发Java的yong-GC?', link: '/03-JVM篇/什么条件会触发Java的yong-GC?' },
        { text: '什么条件会触发Java的Full-GC?', link: '/03-JVM篇/什么条件会触发Java的Full-GC?' },
        { text: 'Java中有哪些垃圾回收算法？', link: '/03-JVM篇/Java中有哪些垃圾回收算法？' },
        { text: '什么是三色标记算法？', link: '/03-JVM篇/什么是三色标记算法？' },
        { text: 'Java中yong-GC、old-GC、Full-GC、mixed-GC的区别？', link: '/03-JVM篇/Java中yong-GC、old-GC、Full-GC、mixed-GC的区别？' },
        { text: '为什么Java新生代被划分为S0、S1、Eden区？', link: '/03-JVM篇/为什么Java新生代被划分为S0、S1、Eden区？' },
      ]
    },
  ],
  '/04-Java并发篇/': [
    {
      text: '线程基础',
      collapsed: false,
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

        { text: '终止线程的四种方式', link: '/04-Java并发篇/终止线程的四种方式' },
        { text: '启动一个线程用start还是run？', link: '/04-Java并发篇/启动一个线程用start还是run？' },
        { text: '为什么启动线程不直接调用run()，而调用start()？', link: '/04-Java并发篇/为什么启动线程不直接调用run()，而调用start()？' },
        { text: '两次调用start方法会怎么样？', link: '/04-Java并发篇/两次调用start方法会怎么样？' },
        { text: '如何优雅的终止一个线程？', link: '/04-Java并发篇/如何优雅的终止一个线程？' },
        { text: 'Java多线程的生命周期是什么', link: '/04-Java并发篇/Java多线程的生命周期是什么' },
        { text: '创建线程的底层原理？', link: '/04-Java并发篇/创建线程的底层原理？' },
        { text: '怎么理解线程分组？编程实现一个线程分组的例子？', link: '/04-Java并发篇/怎么理解线程分组？编程实现一个线程分组的例子？' },
        { text: '线程的状态有哪几种？', link: '/04-Java并发篇/线程的状态有哪几种？' },
        { text: 'JDK1.5之前线程的五种状态', link: '/04-Java并发篇/JDK1.5之前线程的五种状态' },
        { text: 'JDK1.5之后线程的五种状态', link: '/04-Java并发篇/JDK1.5之后线程的五种状态' },
        { text: '线程的生命周期在Java中是如何定义的？', link: '/04-Java并发篇/线程的生命周期在Java中是如何定义的？' },
        { text: 'Java的线程的优先级是什么？有什么用？', link: '/04-Java并发篇/Java的线程的优先级是什么？有什么用？' },
        { text: 'join方法有什么用？什么原理？', link: '/04-Java并发篇/join方法有什么用？什么原理？' },


        { text: 'sleep和wait的主要区别？', link: '/04-Java并发篇/sleep和wait的主要区别？' },
        { text: 'sleep和wait、yield方法有什么区别？', link: '/04-Java并发篇/sleep和wait、yield方法有什么区别？' },
        { text: 'Thread.sleep(0)有意义吗？有什么用？', link: '/04-Java并发篇/Thread.sleep(0)有意义吗？有什么用？' },
        { text: '怎么理解Java中的线程中断（interrupt）？', link: '/04-Java并发篇/怎么理解Java中的线程中断（interrupt）？' },
        { text: '为什么多线程执行时，需要catch InterruptedException异常，catch里面写啥', link: '/04-Java并发篇/为什么多线程执行时，需要catch InterruptedException异常，catch里面写啥' },
        { text: 'interrupt的标志位是否会回归到原有标记', link: '/04-Java并发篇/interrupt的标志位是否会回归到原有标记' },
        { text: 'interrupt和stop有什么区别？', link: '/04-Java并发篇/interrupt和stop有什么区别？' },
        { text: '为什么推荐使用 interrupt() 而不是 stop()？', link: '/04-Java并发篇/为什么推荐使用 interrupt() 而不是 stop()？' },
        { text: '如何判断代码是不是有线程安全问题？如何解决', link: '/04-Java并发篇/如何判断代码是不是有线程安全问题？如何解决' },
        { text: 'wait和notify的虚假唤醒的产生原因及如何解决', link: '/04-Java并发篇/wait和notify的虚假唤醒的产生原因及如何解决' },
        { text: '怎么理解wait、notify、notifyAll方法？', link: '/04-Java并发篇/怎么理解wait、notify、notifyAll方法？' },

      ]
    },
    {
      text: '线程池',
      collapsed: false,
      items: [
        { text: '为什么不建议使用Executors来创建线程池？', link: '/04-Java并发篇/为什么不建议使用Executors来创建线程池？' },
        { text: '线程池相关的常用API？', link: '/04-Java并发篇/线程池相关的常用API？' },
        { text: 'BlockingQueue是什么？', link: '/04-Java并发篇/BlockingQueue是什么？' },
        { text: 'ArrayBlockingQueue 与 LinkedBlockingQueue区别', link: '/04-Java并发篇/ArrayBlockingQueue与LinkedBlockingQueue区别' },
        { text: '介绍一下常用的Java的线程池？', link: '/04-Java并发篇/介绍一下常用的Java的线程池？' },
        { text: 'Java线程池的原理', link: '/04-Java并发篇/Java线程池的原理' },
        { text: '使用线程池的好处', link: '/04-Java并发篇/使用线程池的好处' },
        { text: '线程池的生命周期', link: '/04-Java并发篇/线程池的生命周期' },
        { text: '线程池的核心构造参数有哪些？', link: '/04-Java并发篇/线程池的核心构造参数有哪些？' },
        { text: '如何重构一个线程工厂', link: '/04-Java并发篇/如何重构一个线程工厂' },
        { text: '线程池的拒绝策略有哪些？', link: '/04-Java并发篇/线程池的拒绝策略有哪些？' },
          { text: '重写线程组的意义', link: '/04-Java并发篇/重写线程组的意义' },
          { text: '线程池的shutDown和shutDownNow的区别', link: '/04-Java并发篇/线程池的shutDown和shutDownNow的区别' },
          { text: 'shutdownNow返回的任务列表是干什么的？', link: '/04-Java并发篇/shutdownNow返回的任务列表是干什么的？' },
          { text: '多次调用shutDown或shutDownNow 会怎么样？', link: '/04-Java并发篇/多次调用shutDown或shutDownNow 会怎么样？' },
          { text: '利用线程池批量删除数据，数据量突然增大怎么办？', link: '/04-Java并发篇/利用线程池批量删除数据，数据量突然增大怎么办？' },
          { text: 'Java中有哪些队列？', link: '/04-Java并发篇/Java中有哪些队列？' },
          { text: '阻塞队列原理？', link: '/04-Java并发篇/阻塞队列原理？' },

      ]
    },
    {
      text: '锁',
      collapsed: false,
      items: [
        { text: '如何优化Java中的锁？', link: '/04-Java并发篇/如何优化Java中的锁？' },

      ]
    },
    {
      text: '并发工具',
      collapsed: false,
      items: [
        { text: '什么是Java的Semaphore？', link: '/04-Java并发篇/什么是Java的Semaphore？' },
        { text: '什么是Java的CycliBarrier？', link: '/04-Java并发篇/什么是Java的CycliBarrier？' },
        { text: '什么是Java的CountDownLatch？countdownLatch用法', link: '/04-Java并发篇/什么是Java的CountDownLatch？countdownLatch用法' },
        { text: '什么是Java的CyclicBarrier？CyclicBarrier用法？', link: '/04-Java并发篇/什么是Java的CyclicBarrier？CyclicBarrier用法？' },
        { text: '什么是Java的StampedLock？', link: '/04-Java并发篇/什么是Java的StampedLock？' },
        { text: '什么是FutureTask？', link: '/04-Java并发篇/什么是FutureTask？' },
        { text: '什么是Java的CompletableFuture？', link: '/04-Java并发篇/什么是Java的CompletableFuture？' },

      ]
    },
    {
      text: '实战',
      collapsed: false,
      items: [
        { text: '怎么让3个线程按顺序执行？', link: '/04-Java并发篇/怎么让3个线程按顺序执行？' },
      ]
    },
    {
      text: 'Java并发篇',
      items: [


        { text: '线程间的通信方式？', link: '/04-Java并发篇/线程间的通信方式？' },
        { text: 'JVM的线程调度是什么？', link: '/04-Java并发篇/JVM的线程调度是什么？' },
        { text: '引起CPU进行上下文切换的原因', link: '/04-Java并发篇/引起CPU进行上下文切换的原因' },
        { text: '线程什么时候主动放弃CPU', link: '/04-Java并发篇/线程什么时候主动放弃CPU' },
        { text: '什么是LockSupport类？Park和unPark的使用', link: '/04-Java并发篇/什么是LockSupport类？Park和unPark的使用' },
        { text: 'LockSupport的park/unpark为什么可以突破wait/notify的原有调用顺序？', link: '/04-Java并发篇/LockSupport的park、unpark为什么可以突破wait、notify的原有调用顺序？' },
        { text: 'LockSupport的park/unpark为什么唤醒两次后阻塞两次，但最终结果还是会阻塞线程？', link: '/04-Java并发篇/LockSupport的park、unpark为什么唤醒两次后阻塞两次，但最终结果还是会阻塞线程？' },


        { text: '死锁的发生原因？怎么避免？', link: '/04-Java并发篇/死锁的发生原因？怎么避免？' },
        { text: '排除死锁的方式有哪些？', link: '/04-Java并发篇/排除死锁的方式有哪些？' },
        { text: '什么是协程？Java支持协程吗？', link: '/04-Java并发篇/什么是协程？Java支持协程吗？' },
        { text: '什么是Java中的线程同步？', link: '/04-Java并发篇/什么是Java中的线程同步？' },
        { text: '什么是Java中的ABA问题？', link: '/04-Java并发篇/什么是Java中的ABA问题？' },
        { text: 'Java内存模型（JMM）？', link: '/04-Java并发篇/Java内存模型（JMM）？' },
        { text: '线程的安全三大特性', link: '/04-Java并发篇/线程的安全三大特性' },
        { text: 'JMM规范下，三大特性？ ', link: '/04-Java并发篇/JMM规范下，三大特性？ ' },
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
        { text: '谈谈你对AQS的理解？', link: '/04-Java并发篇/谈谈你对AQS的理解' },
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


        { text: '什么是Java的ForkJoinPool？', link: '/04-Java并发篇/什么是Java的ForkJoinPool？' },
        { text: '乐观锁如果通过数据库实现，并发情况下，数据库如何保证一致', link: '/04-Java并发篇/乐观锁如果通过数据库实现，并发情况下，数据库如何保证一致' },
        { text: '一道题搞懂所有锁', link: '/04-Java并发篇/一道题搞懂所有锁' },


      ]
    },
    {
      text: '实战',
      collapsed: false,
      items: [
        { text: '如何控制同时只有两个线程访问', link: '/04-Java并发篇/如何控制同时只有两个线程访问' },
      ]
    },
  ],
  '/05-Spring/': springSidebar,
  '/06-SpringMVC/': springMvcSidebar,
  '/07-SpringBoot/': springBootSidebar,
  '/08-SpringCloud、微服务/': [
    {
      text: '微服务',
      collapsed: false,
      items: [
        { text: '导读', link: '/08-SpringCloud、微服务/' },
        { text: '什么是单体应用架构？', link: '/08-SpringCloud、微服务/什么是单体应用架构？' },
        { text: '什么是垂直应用架构？', link: '/08-SpringCloud、微服务/什么是垂直应用架构？' },
        { text: '什么是SOA应用架构？', link: '/08-SpringCloud、微服务/什么是SOA应用架构？' },
        { text: '什么是微服务？你是怎么理解微服务的？', link: '/08-SpringCloud、微服务/什么是微服务？你是怎么理解微服务的？' },
        { text: '单体应用、SOA、微服务架构有什么区别？', link: '/08-SpringCloud、微服务/单体应用、SOA、微服务架构有什么区别？' },
        { text: '微服务架构中有哪些核心概念？', link: '/08-SpringCloud、微服务/微服务架构中有哪些核心概念？' },
        { text: '微服务能解决哪些问题呢？', link: '/08-SpringCloud、微服务/微服务能解决哪些问题呢？' },
        { text: '微服务带来的挑战？', link: '/08-SpringCloud、微服务/微服务带来的挑战？' },
        { text: '微服务之间的通信方式？微服务之间如何交互？', link: '/08-SpringCloud、微服务/微服务之间的通信方式？微服务之间如何交互？' },
        { text: '微服务体系如何传递用户信息？', link: '/08-SpringCloud、微服务/微服务体系如何传递用户信息？' },
        { text: '分布式和微服务的区别？', link: '/08-SpringCloud、微服务/分布式和微服务的区别？' },
        { text: '现在流行的微服务框架？', link: '/08-SpringCloud、微服务/现在流行的微服务框架？' },
        { text: '微服务架构是如何运行的？', link: '/08-SpringCloud、微服务/微服务架构是如何运行的？' },
      ]
    },
    {
      text: 'SpringCloud',
      collapsed: false,
      items: [
        { text: 'SpringCloud是什么？', link: '/08-SpringCloud、微服务/SpringCloud是什么？' },
        { text: 'SpringCloud的组成（架构）？', link: '/08-SpringCloud、微服务/SpringCloud的组成（架构）？' },
        { text: 'SpringCloud有哪些核心组件？', link: '/08-SpringCloud、微服务/SpringCloud有哪些核心组件？' },
        { text: 'SpringCloud Alibaba的组成？', link: '/08-SpringCloud、微服务/SpringCloud Alibaba的组成？' },
        { text: 'SpringCloud的优缺点？', link: '/08-SpringCloud、微服务/SpringCloud的优缺点？' },
        { text: 'SpringCloud与SpringBoot之间的区别（关系）？', link: '/08-SpringCloud、微服务/SpringCloud与SpringBoot之间的区别（关系）？' },
        { text: 'Spring、SpringBoot、SpringCloud之间的关系？', link: '/08-SpringCloud、微服务/Spring、SpringBoot、SpringCloud之间的关系？' },
        { text: 'SpringCloud版本该如何选择？', link: '/08-SpringCloud、微服务/SpringCloud版本该如何选择？' },
        { text: '什么是Nacos？', link: '/08-SpringCloud、微服务/什么是Nacos？' },
        { text: 'Nacos有哪些特性？', link: '/08-SpringCloud、微服务/Nacos有哪些特性？' },
        { text: 'Nacos两大组件分别是什么？', link: '/08-SpringCloud、微服务/Nacos两大组件分别是什么？' },
        { text: '什么是配置中心？有哪些常见配置中心？', link: '/08-SpringCloud、微服务/什么是配置中心？有哪些常见配置中心？' },
        { text: '什么是Nacos配置中心？', link: '/08-SpringCloud、微服务/什么是Nacos配置中心？' },
        { text: 'Nacos配置中心实现原理？', link: '/08-SpringCloud、微服务/Nacos配置中心实现原理？' },
        { text: '什么是Nacos的领域模型？', link: '/08-SpringCloud、微服务/什么是Nacos的领域模型？' },
        { text: '什么是Nacos Server集群？', link: '/08-SpringCloud、微服务/什么是Nacos Server集群？' },
        { text: 'Nacos Server集群该如何搭建？', link: '/08-SpringCloud、微服务/Nacos Server集群该如何搭建？' },
        { text: '什么是服务端负载均衡？', link: '/08-SpringCloud、微服务/什么是服务端负载均衡？' },
        { text: '什么是客户端负载均衡？', link: '/08-SpringCloud、微服务/什么是客户端负载均衡？' },
        { text: '为什么需要服务注册发现？', link: '/08-SpringCloud、微服务/为什么需要服务注册发现？' },
        { text: '为什么需要在微服务中使用链路跟踪？SpringCloud可以选择哪些微服务链路跟踪方案？', link: '/08-SpringCloud、微服务/为什么需要在微服务中使用链路跟踪？SpringCloud可以选择哪些微服务链路跟踪方案？' },
        { text: 'SpringCloud Config是什么', link: '/08-SpringCloud、微服务/SpringCloud Config是什么' },
        { text: '你们的服务是怎么做日志收集的？', link: '/08-SpringCloud、微服务/你们的服务是怎么做日志收集的？' },
        { text: '什么情况下需要使用分布式事务，有哪些解决方案？', link: '/08-SpringCloud、微服务/什么情况下需要使用分布式事务，有哪些解决方案？' },
        { text: '什么是seata？谈谈你的理解？', link: '/08-SpringCloud、微服务/什么是seata？谈谈你的理解？' },
        { text: 'seata支持哪些模式的分布式事务？', link: '/08-SpringCloud、微服务/seata支持哪些模式的分布式事务？' },
        { text: 'seata的实现原理？', link: '/08-SpringCloud、微服务/seata的实现原理？' },
        { text: 'SpringCloud有哪些注册中心？', link: '/08-SpringCloud、微服务/SpringCloud有哪些注册中心？' },
        { text: 'seata的事务执行流程？', link: '/08-SpringCloud、微服务/seata的事务执行流程？' },
        { text: 'seata的事务回滚是怎么实现的？', link: '/08-SpringCloud、微服务/seata的事务回滚是怎么实现的？' },
        { text: '什么Eureka？', link: '/08-SpringCloud、微服务/什么Eureka？' },
        { text: 'Eureka的实现原理？', link: '/08-SpringCloud、微服务/Eureka的实现原理？' },
        { text: 'Eureka的自我保护模式是什么？', link: '/08-SpringCloud、微服务/Eureka的自我保护模式是什么？' },
        { text: 'Eureka的高可用是怎么实现的？', link: '/08-SpringCloud、微服务/Eureka的高可用是怎么实现的？' },
        { text: 'SpringCloud是如何实现服务注册的？', link: '/08-SpringCloud、微服务/SpringCloud是如何实现服务注册的？' },
        { text: 'Eureka和Zookeeper的区别？', link: '/08-SpringCloud、微服务/Eureka和Zookeeper的区别？' },
        { text: 'Consul是什么？', link: '/08-SpringCloud、微服务/Consul是什么？' },
        { text: 'Eureka、Zookeeper、Consul的区别？', link: '/08-SpringCloud、微服务/Eureka、Zookeeper、Consul的区别？' },
        { text: 'Nacos的服务注册表结构是什么样的？', link: '/08-SpringCloud、微服务/Nacos的服务注册表结构是什么样的？' },
        { text: 'Nacos中的Namespace是什么？如何使用它来组织和管理微服务？', link: '/08-SpringCloud、微服务/Nacos中的Namespace是什么？如何使用它来组织和管理微服务？' },
        { text: '为什么需要负载均衡？', link: '/08-SpringCloud、微服务/为什么需要负载均衡？' },
        { text: '在SpringCloud中怎么使用服务的负载均衡？', link: '/08-SpringCloud、微服务/在SpringCloud中怎么使用服务的负载均衡？' },
        { text: '负载均衡的实现方式有哪些？', link: '/08-SpringCloud、微服务/负载均衡的实现方式有哪些？' },
        { text: '负载均衡有什么策略？', link: '/08-SpringCloud、微服务/负载均衡有什么策略？' },
        { text: 'Ribbon和Nginx的区别？', link: '/08-SpringCloud、微服务/Ribbon和Nginx的区别？' },
        { text: 'Http和RPC的区别？', link: '/08-SpringCloud、微服务/Http和RPC的区别？' },
        { text: 'Ribbon和Feign调用服务的区别是什么？', link: '/08-SpringCloud、微服务/Ribbon和Feign调用服务的区别是什么？' },
        { text: '什么是Feign（Spring Cloud Netflix Feign）？', link: '/08-SpringCloud、微服务/什么是Feign（Spring Cloud Netflix Feign）？' },
        { text: '什么是OpenFeign？', link: '/08-SpringCloud、微服务/什么是OpenFeign？' },
        { text: '如何配置OpenFeign？', link: '/08-SpringCloud、微服务/如何配置OpenFeign？' },
        { text: 'Feign和OpenFeign的区别？', link: '/08-SpringCloud、微服务/Feign和OpenFeign的区别？' },
        { text: 'Feign和Dubbo的区别？rpc vs http,为什么rpc快？', link: '/08-SpringCloud、微服务/Feign和Dubbo的区别？rpc vs http,为什么rpc快？' },
        { text: 'Feign是如何实现负载均衡的？', link: '/08-SpringCloud、微服务/Feign是如何实现负载均衡的？' },
        { text: '为什么Feign第一次调用耗时很长？', link: '/08-SpringCloud、微服务/为什么Feign第一次调用耗时很长？' },
        { text: '为什么OpenFeign第一次调用耗时很长？', link: '/08-SpringCloud、微服务/为什么OpenFeign第一次调用耗时很长？' },
        { text: 'OpenFeign的拦截器是做什么的？', link: '/08-SpringCloud、微服务/OpenFeign的拦截器是做什么的？' },
        { text: 'OpenFeign最佳实践？', link: '/08-SpringCloud、微服务/OpenFeign最佳实践？' },
        { text: 'RPC层为什么建议防腐？', link: '/08-SpringCloud、微服务/RPC层为什么建议防腐？' },
        { text: '不用OpenFeign还能怎么调用微服务？', link: '/08-SpringCloud、微服务/不用OpenFeign还能怎么调用微服务？' },
        { text: '什么是断路器？为什么需要断路器？', link: '/08-SpringCloud、微服务/什么是断路器？为什么需要断路器？' },
        { text: '什么是Hystrix？', link: '/08-SpringCloud、微服务/什么是Hystrix？' },
        { text: '微服务雪崩是什么？', link: '/08-SpringCloud、微服务/微服务雪崩是什么？' },
        { text: '什么是服务降级？', link: '/08-SpringCloud、微服务/什么是服务降级？' },
        { text: '什么是服务熔断？', link: '/08-SpringCloud、微服务/什么是服务熔断？' },
        { text: '什么是服务限流？', link: '/08-SpringCloud、微服务/什么是服务限流？' },
        { text: '什么是降级熔断？为什么需要熔断降级？', link: '/08-SpringCloud、微服务/什么是降级熔断？为什么需要熔断降级？' },
        { text: '熔断降级有哪些方案？', link: '/08-SpringCloud、微服务/熔断降级有哪些方案？' },
        { text: 'Hystrix是怎么实现服务容错的？', link: '/08-SpringCloud、微服务/Hystrix是怎么实现服务容错的？' },
        { text: '什么是Sentinel？', link: '/08-SpringCloud、微服务/什么是Sentinel？' },
        { text: 'Sentinel中的两个核心概念？', link: '/08-SpringCloud、微服务/Sentinel中的两个核心概念？' },
        { text: 'Sentinel的应用场景？', link: '/08-SpringCloud、微服务/Sentinel的应用场景？' },
        { text: 'Sentinel的熔断策略有哪些？', link: '/08-SpringCloud、微服务/Sentinel的熔断策略有哪些？' },
        { text: 'Sentinel的熔断规则如何定义？', link: '/08-SpringCloud、微服务/Sentinel的熔断规则如何定义？' },
        { text: 'Sentinel的熔断降级状态有哪些？', link: '/08-SpringCloud、微服务/Sentinel的熔断降级状态有哪些？' },
        { text: 'Sentinel是怎么实现限流的？', link: '/08-SpringCloud、微服务/Sentinel是怎么实现限流的？' },
        { text: 'Sentinel如何实现热点参数降流？', link: '/08-SpringCloud、微服务/Sentinel如何实现热点参数降流？' },
        { text: 'Sentinel与Hystrix的区别？', link: '/08-SpringCloud、微服务/Sentinel与Hystrix的区别？' },
        { text: 'Sentinel是怎么实现集群限流的？', link: '/08-SpringCloud、微服务/Sentinel是怎么实现集群限流的？' },
        { text: '什么是服务网络？', link: '/08-SpringCloud、微服务/什么是服务网络？' },
        { text: '什么是灰度发布、金丝雀部署以及蓝绿部署？', link: '/08-SpringCloud、微服务/什么是灰度发布、金丝雀部署以及蓝绿部署？' },
        { text: '说说什么是API网关？它有什么作用？', link: '/08-SpringCloud、微服务/说说什么是API网关？它有什么作用？' },
        { text: '什么是微服务网关？为什么需要服务网关？', link: '/08-SpringCloud、微服务/什么是微服务网关？为什么需要服务网关？' },
        { text: 'SpringCloud可以选择哪些API网关？', link: '/08-SpringCloud、微服务/SpringCloud可以选择哪些API网关？' },
        { text: '什么是SpringCloud Zuul？', link: '/08-SpringCloud、微服务/什么是SpringCloud Zuul？' },
        { text: '什么是SpringCloud Gateway？', link: '/08-SpringCloud、微服务/什么是SpringCloud Gateway？' },
        { text: 'SpringCloud Gateway的工作流程？', link: '/08-SpringCloud、微服务/SpringCloud Gateway的工作流程？' },
        { text: 'SpringCloud Gateway路由如何配置？', link: '/08-SpringCloud、微服务/SpringCloud Gateway路由如何配置？' },
        { text: 'SpringCloud Gateway过滤器如何实现？', link: '/08-SpringCloud、微服务/SpringCloud Gateway过滤器如何实现？' },
        { text: '说说SpringCloud Gateway核心概念？', link: '/08-SpringCloud、微服务/说说SpringCloud Gateway核心概念？' },
        { text: 'SpringCloud Gateway如何整合Sentinel？', link: '/08-SpringCloud、微服务/SpringCloud Gateway如何整合Sentinel？' },
        { text: 'SpringCloud Gateway如何处理跨域请求？', link: '/08-SpringCloud、微服务/SpringCloud Gateway如何处理跨域请求？' },
        { text: '你的项目为什么使用SpringCloud Gateway作为网关？', link: '/08-SpringCloud、微服务/你的项目为什么使用SpringCloud Gateway作为网关？' },
        { text: 'SpringCloud Gateway与Zuul的区别？', link: '/08-SpringCloud、微服务/SpringCloud Gateway与Zuul的区别？' },
        { text: 'SpringCloud Gateway与Dubbo的区别？', link: '/08-SpringCloud、微服务/SpringCloud Gateway与Dubbo的区别？' },
        { text: '什么是令牌桶算法？工作原理是什么？使用它有什么优点和注意事项？', link: '/08-SpringCloud、微服务/什么是令牌桶算法？工作原理是什么？使用它有什么优点和注意事项？' },



        { text: 'Dubbo的负载均衡是如何实现的？服务端挂了怎么避免被调用到？', link: '/08-SpringCloud、微服务/Dubbo的负载均衡是如何实现的？服务端挂了怎么避免被调用到？' },
      ]
    },
  ],
  '/09-MySQL/': [
      ...mysqlSidebar
  ],
  '/10-Redis/': [
    {
      text: '基础',
      collapsed: false,
      items: [
        { text: 'Redis', link: '/10-Redis/' },
        { text: '什么是Redis？', link: '/10-Redis/什么是Redis？' },
        { text: 'Redis相比memcached有哪些优势？', link: '/10-Redis/Redis相比memcached有哪些优势？' },
        { text: 'Redis和memached的区别？', link: '/10-Redis/Redis和memached的区别？' },
        { text: 'Redis为什么那么快？', link: '/10-Redis/Redis为什么那么快？' },
        { text: 'Redis有哪些优点？', link: '/10-Redis/Redis有哪些优点？' },
        { text: 'Redis常见五大数据类型？', link: '/10-Redis/Redis常见五大数据类型？' },
        { text: 'Redis的高级数据类型有哪些？', link: '/10-Redis/Redis的高级数据类型有哪些？' },
        { text: 'Redis的一般使用场景？', link: '/10-Redis/Redis的一般使用场景？' },
        { text: 'Redis常用类型的应用场景？', link: '/10-Redis/Redis常用类型的应用场景？' },
        { text: 'Redis是单线程还是多线程？', link: '/10-Redis/Redis是单线程还是多线程？' },
        { text: 'Redis 为什么单线程还这么快？', link: '/10-Redis/Redis 为什么单线程还这么快？' },
        { text: 'Redis为什么要设计成单线程？6.0不是变成多线程了吗？', link: '/10-Redis/Redis为什么要设计成单线程？6.0不是变成多线程了吗？' },
        { text: 'Redis存在线程安全吗？为什么？', link: '/10-Redis/Redis存在线程安全吗？为什么？' },
        { text: 'Redis的list类型常见的命令？', link: '/10-Redis/Redis的list类型常见的命令？' },
        { text: 'Redis的Geo类型？', link: '/10-Redis/Redis的Geo类型？' },
        { text: 'Redis的Bitmap类型？', link: '/10-Redis/Redis的Bitmap类型？' },
        { text: 'Redis的HyperLogLog类型？', link: '/10-Redis/Redis的HyperLogLog类型？' },

        { text: 'Redis的setnx和setex的区别？', link: '/10-Redis/Redis的setnx和setex的区别？' },
        { text: 'Redis的内存淘汰策略？', link: '/10-Redis/Redis的内存淘汰策略？' },
        { text: 'Redis的过期策略？', link: '/10-Redis/Redis的过期策略？' },
        { text: 'redis key的过期时间和永久有效分别怎么设置？', link: '/10-Redis/redis key的过期时间和永久有效分别怎么设置？' },
        { text: '删除key的命令会阻塞redis吗？', link: '/10-Redis/删除key的命令会阻塞redis吗？' },
        { text: 'Redis什么情况下会变慢？', link: '/10-Redis/Redis什么情况下会变慢？' },
        { text: 'redis常见性能问题和解决方案？', link: '/10-Redis/redis常见性能问题和解决方案？' },
        { text: 'redis回收进程如何工作的？', link: '/10-Redis/redis回收进程如何工作的？' },

      ]
    },
    {
      text: '持久化',
      collapsed: false,
      items: [
        { text: 'Redis的持久化机制？', link: '/10-Redis/Redis的持久化机制？' },
        { text: 'rdb的优势与劣势？', link: '/10-Redis/rdb的优势与劣势？' },
        { text: 'aof的优势和劣势？', link: '/10-Redis/aof的优势和劣势？' },
        { text: 'RDB和AOF的实现原理？以及优缺点？', link: '/10-Redis/RDB和AOF的实现原理？以及优缺点？' },
        { text: 'Redis生成rdb的时候，是如何处理正常请求的？', link: '/10-Redis/Redis生成rdb的时候，是如何处理正常请求的？' },
      ]
    },
    {
      text: '本地缓存',
      collapsed: false,
      items: [
        { text: '本地缓存与分布式缓存的区别？', link: '/10-Redis/本地缓存与分布式缓存的区别？' },
        { text: '如何实现本地缓存？', link: '/10-Redis/local-cache/如何实现本地缓存？' },
        { text: 'Caffeine的缓存驱逐策略（过期策略）', link: '/10-Redis/Caffeine的缓存驱逐策略（过期策略）' },
      ],
    },
    {
      text: '分布式',
      collapsed: false,
      items: [
        { text: '怎么保证Redis的高并发高可用', link: '/10-Redis/怎么保证Redis的高并发高可用' },
        { text: 'Redis的Cluster模式和Sentinel模式的区别是什么？', link: '/10-Redis/Redis的Cluster模式和Sentinel模式的区别是什么？' },
        { text: 'Redis主从有哪几种常见的拓扑结构？', link: '/10-Redis/Redis主从有哪几种常见的拓扑结构？' },
        { text: 'redis主从复制的核心原理？', link: '/10-Redis/redis主从复制的核心原理？' },
        { text: 'redis的同步机制是什么', link: '/10-Redis/redis的同步机制是什么' },
        { text: 'Redis的从服务器的作用？', link: '/10-Redis/Redis的从服务器的作用？' },
        { text: 'Redis的复制延迟有哪些可能的原因？', link: '/10-Redis/Redis的复制延迟有哪些可能的原因？' },
        { text: 'Redis集群脑裂？', link: '/10-Redis/Redis集群脑裂？' },
        { text: 'redis哨兵机制？', link: '/10-Redis/redis哨兵机制？' },
        { text: '部署三主三从redis集群', link: '/10-Redis/docs/docker中部署三主三从redis集群' },
      ]
    },
    {
      text: '场景',
      collapsed: true,
      items: [
        { text: '如果Redis扛不住了怎么办？', link: '/10-Redis/如果Redis扛不住了怎么办？' },
        { text: '什么情况下会出现数据库和缓存不一致的问题？', link: '/10-Redis/什么情况下会出现数据库和缓存不一致的问题？' },
        { text: 'Redis和MySQL如何保证数据一致性？', link: '/10-Redis/Redis和MySQL如何保证数据一致性？' },
        { text: '如何解决Redis和数据库的一致性问题？', link: '/10-Redis/如何解决Redis和数据库的一致性问题？' },
        { text: '为什么需要延迟双删，两次删除的原因是什么？', link: '/10-Redis/为什么需要延迟双删，两次删除的原因是什么？' },
        { text: '有了第二次删除，第一次还有意义吗？', link: '/10-Redis/有了第二次删除，第一次还有意义吗？' },
        { text: '什么是缓存穿透？', link: '/10-Redis/什么是缓存穿透？' },
        { text: '什么是缓存击穿？（热点key）', link: '/10-Redis/什么是缓存击穿？（热点key）' },
        { text: '什么是缓存雪崩？', link: '/10-Redis/什么是缓存雪崩？' },
        { text: '缓存击穿、雪崩、穿透的区别？', link: '/10-Redis/缓存击穿、雪崩、穿透的区别？' },
        { text: '如果有大量的key需要设置同一时间过期，一般需要注意什么？', link: '/10-Redis/如果有大量的key需要设置同一时间过期，一般需要注意什么？' },
        { text: 'Redis key过期了，为什么内存没释放？', link: '/10-Redis/Redis key过期了，为什么内存没释放？' },
        { text: 'redis的内存用完了会发生什么？', link: '/10-Redis/redis的内存用完了会发生什么？' },
        { text: 'Redis生成全局唯一ID', link: '/10-Redis/Redis生成全局唯一IDs' },
        { text: '什么是分布式锁？分布式锁的特点？', link: '/10-Redis/什么是分布式锁？分布式锁的特点？' },
        { text: '如何实现分布式锁？', link: '/10-Redis/如何实现分布式锁？' },
        { text: '为什么Redis实现分布式锁不合适？还是有很多公司在用？', link: '/10-Redis/为什么Redis实现分布式锁不合适？还是有很多公司在用？' },
        { text: 'jedis与redisson对比有什么优缺点？', link: '/10-Redis/jedis与redisson对比有什么优缺点？' },
        { text: 'Redis实现分布式锁有什么问题吗？', link: '/10-Redis/Redis实现分布式锁有什么问题吗？' },
        { text: '看门狗机制的原理是什么？', link: '/10-Redis/看门狗机制的原理是什么？' },
        { text: '分布式锁在未执行完逻辑之前就过期了怎么办？', link: '/10-Redis/分布式锁在未执行完逻辑之前就过期了怎么办？' },
        { text: '看门狗一直续期，那客户端挂了怎么办？', link: '/10-Redis/看门狗一直续期，那客户端挂了怎么办？' },
        { text: '看门狗解锁失败，会不会导致一直续期下去？', link: '/10-Redis/看门狗解锁失败，会不会导致一直续期下去？' },
        { text: 'Redis的red lock？', link: '/10-Redis/Redis的red lock？' },
        { text: 'redlock的分布式锁是什么？', link: '/10-Redis/redlock的分布式锁是什么？' },
        { text: 'Redis如何实现延时队列', link: '/10-Redis/Redis如何实现延时队列' },
        { text: '如何基于Redisson实现一个延迟队列', link: '/10-Redis/如何基于Redisson实现一个延迟队列' },
        { text: '什么是redis bigKey？如何解决？', link: '/10-Redis/什么是redis bigKey？如何解决？' },
        { text: '如何解决热点key？', link: '/10-Redis/如何解决热点key？' },
        { text: '如何快速实现一个布隆过滤器？', link: '/10-Redis/如何快速实现一个布隆过滤器？' },
        { text: '如何快速实现一个排行榜？', link: '/10-Redis/如何快速实现一个排行榜？' },
        { text: '如何用Redis统计海量UV？', link: '/10-Redis/如何用Redis统计海量UV？' },
        { text: '如何使用Redis记录用户连续登录多少天？', link: '/10-Redis/如何使用Redis记录用户连续登录多少天？' },
        { text: '什么情况下redis哨兵模式会产生数据丢失', link: '/10-Redis/什么情况下redis哨兵模式会产生数据丢失' },

      ]
    },
    {
      text: '进阶',
      collapsed: true,
      items: [
        { text: 'RedisKeyValue设计原则有哪些？', link: '/10-Redis/RedisKeyValue设计原则有哪些？' },
        { text: '为什么EMBSTR的阈值是44？为什么以前是39？', link: '/10-Redis/为什么EMBSTR的阈值是44？为什么以前是39？' },
        { text: 'Redis可以实现事务吗？', link: '/10-Redis/Redis可以实现事务吗？' },
        { text: 'Redis 事务三特性？', link: '/10-Redis/Redis 事务三特性？' },
        { text: 'Redis事务保证原子性吗，支持回滚吗？', link: '/10-Redis/Redis事务保证原子性吗，支持回滚吗？' },
        { text: 'Redis的事务和关系型数据库有何不同？', link: '/10-Redis/Redis的事务和关系型数据库有何不同？' },
        { text: 'Redis的lua脚本？', link: '/10-Redis/Redis的lua脚本？' },
        { text: 'Redis中如何实现队列和栈的功能？', link: '/10-Redis/Redis中如何实现队列和栈的功能？' },
        { text: '简述Redis的Ziplist和Quicklist？', link: '/10-Redis/简述Redis的Ziplist和Quicklist？' },
        { text: '什么是Redis的ListPack？', link: '/10-Redis/什么是Redis的ListPack？' },
        { text: 'Redis的内存碎片化是什么？如何解决？', link: '/10-Redis/Redis的内存碎片化是什么？如何解决？' },
        { text: 'Redis字符串的值最大能存多少？', link: '/10-Redis/Redis字符串的值最大能存多少？' },
        { text: 'Redis为什么不复用c语言的字符串？', link: '/10-Redis/Redis为什么不复用c语言的字符串？' },
        { text: '什么是Redis的ListPack？', link: '/10-Redis/什么是Redis的ListPack？' },
        { text: '什么是Redis的ListPack？', link: '/10-Redis/什么是Redis的ListPack？' },
        { text: 'Redis的发布订阅功能？', link: '/10-Redis/Redis的发布订阅功能？' },
        { text: '什么是redis哈希槽的概念？', link: '/10-Redis/什么是redis哈希槽的概念？' },
        { text: '使用Redis集群时，通过key如何定位到对应节点？', link: '/10-Redis/使用Redis集群时，通过key如何定位到对应节点？' },
        { text: '为什么Redis集群的最大槽数是16384个？', link: '/10-Redis/为什么Redis集群的最大槽数是16384个？' },
        { text: 'Redis中的管道有什么用', link: '/10-Redis/Redis中的管道有什么用' },
        { text: 'Redis的pipeline？', link: '/10-Redis/Redis的pipeline？' },
        { text: '原生批处理命令(mset、mget)与Pipeline的区别？', link: '/10-Redis/原生批处理命令(mset、mget)与Pipeline的区别？' },
        { text: '什么是Redis跳表？', link: '/10-Redis/什么是Redis跳表？' },
      ]
    }
  ],
  '/11-ORM/': ormSidebar,
  '/12-分布式/': [
    {
      text: '分布式',
      items: [
        { text: '分布式', link: '/12-分布式/index' },
        { text: '使用分布式调度框架该考虑哪些问题？', link: '/12-分布式/使用分布式调度框架该考虑哪些问题？' },
      ]
    }
  ],
  '/13-Zookeeper/': [
    {
      text: 'Zookeeper简明教程',
      items: [
        { text: 'ZooKeeper快速入门', link: '/13-Zookeeper/learn/01-ZooKeeper快速入门' },
        { text: 'zookeeper节点动态上下线案例', link: '/13-Zookeeper/learn/zookeeper节点动态上下线案例' },
      ]
    },
    {
      text: 'Zookeeper',
      items: [
        { text: 'Zookeeper', link: '/13-Zookeeper/index' },
        { text: '谈谈你对Zookeeper的理解？', link: '/13-Zookeeper/谈谈你对Zookeeper的理解？' },
        { text: 'Zookeeper的Leader选举机制？', link: '/13-Zookeeper/Zookeeper的Leader选举机制？' },
        { text: 'Zookeeper如何实现分布式锁？', link: '/13-Zookeeper/Zookeeper如何实现分布式锁？' },
      ]
    }
  ],
  '/14-ElasticSearch/': esSidebar,
  '/15-MQ/': [
    {
      text: '消息队列',
      items: [
        { text: '导读', link: '/15-MQ/common/index' },
        { text: '消息队列消息没有消费成功怎么办？', link: '/15-MQ/common/消息队列消息没有消费成功怎么办？' },

      ]
    },
    {
      text: 'RocketMQ',
      items: [
        { text: '如何提升RocketMQ顺序消费性能？', link: '/15-MQ/RocketMQ/' },
      ]

    },
    {
      text: 'Kafka',
      items: [
        { text: 'Kafka如何保证消息不丢、重复发了怎么办？', link: '/15-MQ/Kafka/' },
        { text: 'Kafka为什么会出现重复消费？如何解决？', link: '/15-MQ/Kafka/Kafka为什么会出现重复消费？如何解决？' },
        { text: 'Kafka消息重复消费的原因', link: '/15-MQ/Kafka/Kafka消息重复消费的原因' },
        { text: '解决Kafka消息重复消费的方案', link: '/15-MQ/Kafka/解决Kafka消息重复消费的方案' },
      ],
    },
    {
      text: 'Kafka简明教程',
      items: [
        { text: 'Kafka', link: '/15-MQ/Kafka/learn/01-kafka' },
        { text: 'Kafka监控工具', link: '/15-MQ/Kafka/learn/02-Kafka监控工具' },
        { text: 'Kafka 常用API操作', link: '/15-MQ/Kafka/learn/03-Kafka 常用API操作' },
        { text: 'Kafak整合Flume', link: '/15-MQ/Kafka/learn/Kafak整合Flume' },
        { text: '04-KafkaUtils.createDirectStream的消费者LocationStrategies', link: '/15-MQ/Kafka/learn/04-KafkaUtils.createDirectStream的消费者LocationStrategies' },

      ],
    },
    {
      text: 'RabbitMQ',
      items: [
        { text: '导读', link: '/15-MQ/RabbitMQ/' },
      ]
    },
  ],
  '/16-MongoDB/': [
    {
      text: 'MongoDB',
      items: [
        { text: '导读', link: '/16-MongoDB/' },
        { text: '什么是MongoDB', link: '/16-MongoDB/什么是MongoDB' },
        { text: 'RDBMS与MongoDB对比', link: '/16-MongoDB/RDBMS与MongoDB对比' },
        { text: 'MongoDB体系结构（核心概念）', link: '/16-MongoDB/MongoDB体系结构（核心概念）' },
        { text: 'MongoDB数据模型', link: '/16-MongoDB/MongoDB数据模型' },
      ]
    },
  ],
  '/17-backend-what/': [
    {
      text: '常识题',
      collapsed: false,
      items: [
        { text: '导读', link: '/17-backend-what/index' },
        { text: 'QPS、TPS、RT、吞吐量这些高并发性能指标？', link: '/17-backend-what/basic/QPS、TPS、RT、吞吐量这些高并发性能指标？' },
      ]
    },
    {
      text: '问题排除',
      collapsed: false,
      items: [
        { text: 'CPU飙高系统反应慢怎么排查？', link: '/17-backend-what/问题排除/CPU飙高系统反应慢怎么排查？' },
        { text: '怎么分析JVM当前的内存占用情况？OOM后怎么分析？', link: '/17-backend-what/问题排除/怎么分析JVM当前的内存占用情况？OOM后怎么分析？' },
      ]
    },
    {
      text: '场景题',
      collapsed: false,
      items: [
        { text: '如何避免超预期的高并发压力压垮系统？', link: '/17-backend-what/场景题/如何避免超预期的高并发压力压垮系统？' },
      ]
    },
    {
      text: '设计题',
      collapsed: false,
      items: [
        { text: '让你实现一个订单超时取消，怎么设计？', link: '/17-backend-what/design/让你实现一个订单超时取消，怎么设计？' },
        { text: '定时任务扫表的方案有什么缺点？', link: '/17-backend-what/design/定时任务扫表的方案有什么缺点？' },
        { text: '单点登录（SSO）的设计与实现？', link: '/17-backend-what/design/单点登录（SSO）的设计与实现？' },
      ]
    },
    {
      text: '性能优化',
      collapsed: false,
      items: [
        { text: '性能优化', link: '/17-backend-what/性能优化/' },
      ]
    },

  ],
  '/18-Git/': [
    {
      text: 'Git',
      items: [
        { text: '导读', link: '/18-Git/' },
        { text: 'git commit规范', link: '/18-Git/git commit规范' },
      ]
    },
  ],
  '/19-Linux/': [
    {
      text: 'Linux',
      items: [
        { text: '导读', link: '/19-Linux/' },
      ]
    },
    {
      text: '遇到的问题',
      items: [
        { text: '上传文件到Linux文件名乱码', link: '/19-Linux/上传文件到Linux文件名乱码' },
      ]
    }
  ],
  '/20-operating-system/': [
    {
      text: '操作系统',
      items: [
        { text: '导读', link: '/20-operating-system/' },
      ]

    },
  ],
  '/21-computer-network/': [
    {
      text: '计算机网络',
      items: [
        { text: '导读', link: '/21-computer-network/' },
      ]
    },
  ],

  '/22-data-structure/': [
    {
      text: '数据结构',
      items: [
        { text: '导读', link: '/22-data-structure/' },
      ]
    },
    {
      text: '常见算法题',
      items: [
        { text: '常见算法题', link: '/22-data-structure/' },
      ]
    },
  ],


  '/23-设计模式/': [
    {
      text: '设计模式',
      items: [
        { text: '导读', link: '/23-设计模式/' },
        { text: '单例模式中的双重检查锁为什么要检查两次？', link: '/23-设计模式/单例模式中的双重检查锁为什么要检查两次？' },
      ]
    }

  ],
  '/24-前端基础/': [
    {
      text: '前端基础',
      items: [
        { text: '导读', link: '/2-前端基础/' },
      ]
    },

  ],
  '/25-Vue/': vueSidebar,
  '/26-React/': [
    {
      text: 'React简明教程',
      collapsed: false,
      items: [
        { text: '无状态组件与有状态组件', link: '/26-React/learn/react-compoents-status' },
        { text: 'React组件通信', link: '/26-React/learn/component-communication' },
        { text: '错误边界', link: '/26-React/learn/error-boundary' },
        { text: 'Context', link: '/26-React/learn/content' },
        { text: '组件实例的三大核心属性', link: '/26-React/learn/component-props、state、refs' },
      ],
    },
    {
      text: 'React',
      collapsed: false,
      items: [
        { text: '导读', link: '/26-React/' },
        { text: 'React生命周期', link: '/26-React/life-cycle' },
        { text: '你在项目中是如何进行错误监控的', link: '/26-React/你在项目中是如何进行错误监控的' },
        { text: 'react-why-hooks', link: '/26-React/react-why-hooks' },
      ],
    },
  ],
  '/27-JavaScript/': [
    {
      text: 'JavaScript简明教程',
      collapsed: false,
      items: [
        { text: 'es6 class', link: '/27-JavaScript/learn/es6-class' },
      ]
    },
    {
      text: 'JavaScript',
      items: [
        { text: '导读', link: '/27-JavaScript/' },
        { text: 'JavaScript中==与===有什么区别？', link: '/27-JavaScript/JavaScript中==与===有什么区别？' },
        { text: 'JavaScript中for...in和for...of的区别是什么？', link: '/27-JavaScript/JavaScript中for...in和for...of的区别是什么？' },
        { text: 'JavaScript中splice和slice函数会改变原数组吗？', link: '/27-JavaScript/JavaScript中splice和slice函数会改变原数组吗？' },
        { text: '为什么需要将es6转换为es5', link: '/27-JavaScript/为什么需要将es6转换为es5' },
        { text: 'import和export的区别？', link: '/27-JavaScript/import和export的区别？' },
        { text: 'js原型链', link: '/27-JavaScript/js原型链' },
        { text: '对象原型', link: '/27-JavaScript/对象原型' },
      ],
    },
    {
      'DOM API': [
        { text: '不会冒泡的事件有哪些？', link: '/27-JavaScript/不会冒泡的事件有哪些？' },
        { text: '如何判断网页元素是否达到可视区域？', link: '/27-JavaScript/如何判断网页元素是否达到可视区域？' },
        { text: 'mouseEnter 和 mouseOver 有什么区别？', link: '/27-JavaScript/mouseEnter 和 mouseOver 有什么区别？' },
      ],
    }
  ],
  '/29-HTML/': [
    {
      text: 'HTML',
      items: [
        { text: '导读', link: '/29-HTML/' },
      ],
    },
  ],
  '/28-NodeJS/': [
    {
      text: 'NodeJS',
      items: [
        { text: '导读', link: '/28-NodeJS/' },
      ],
    },
  ],
  '/30-CSS/': [
    {
      text: 'CSS',
      items: [
        { text: '导读', link: '/30-CSS/' },
        { text: '如何使用css实现一个三角形？', link: '/30-CSS/如何使用css实现一个三角形？' },
        { text: '常见的css布局单位有哪些？', link: '/30-CSS/常见的css布局单位有哪些？' },
        { text: '说说px、em、rem的区别及其使用场景？', link: '/30-CSS/说说px、em、rem的区别及其使用场景？' },
        { text: '如何实现元素的水平垂直居中？', link: '/30-CSS/如何实现元素的水平垂直居中？' },
        { text: '说说margin和padding的使用场景？', link: '/30-CSS/说说margin和padding的使用场景？' },
        { text: '什么是margin合并、塌陷？', link: '/30-CSS/什么是margin合并、塌陷？' },
        { text: '什么是margin重叠问题？如何解决？', link: '/30-CSS/什么是margin重叠问题？如何解决？' },
        { text: '为什么需要清除浮动？清除的方式有哪些？', link: '/30-CSS/为什么需要清除浮动？清除的方式有哪些？' },
        { text: '使用clear属性清除浮动原理？', link: '/30-CSS/使用clear属性清除浮动原理？' },
        { text: '固定定位的参考点？', link: '/30-CSS/固定定位的参考点？' },
        { text: 'overflow: hidden 、 display: none、visibility: hidden 有什么区别 ？', link: '/30-CSS/overflow hidden 、 display none、visibility hidden 有什么区别 ？' },
      ],
    },
  ],

  '/31-front-what/': [
    {
      text: '常识题',
      collapsed: false,
      items: [
        { text: '导读', link: '/31-front-what/' },
        { text: '如何禁止别人调式前端页面代码？', link: '/31-front-what/如何禁止别人调式前端页面代码？' },
        { text: 'xhr与fetch', link: '/31-front-what/xhr与fetch' },
      ]
    },
    {
      text: '问题排除',
      collapsed: false,
      items: [
        { text: '更新中', link: '/31-front-what/' },
      ]
    },
    {
      text: '场景题',
      collapsed: false,
      items: [
        { text: '更新中', link: '/31-front-what/' },
      ]
    },
    {
      text: '性能优化',
      collapsed: false,
      items: [
        { text: '性能优化', link: '/17-backend-what/性能优化/' },
      ]
    },
  ],
  '/32-small-program/': [
    {
      text: '小程序',
      items: [
        { text: '导读', link: '/32-small-program/' },
      ]
    }
  ],
  '/33-webpack/': [
    {
      text: 'WebPack',
      items: [
        { text: '什么是Webpack', link: '/33-webpack/what-webpack' },
        { text: '为什么需要打包工具', link: '/33-webpack/why-build' },
        { text: 'Webpack 的五大核心概念', link: '/33-webpack/Webpack 的五大核心概念' },
        { text: 'Webpack中Loader和Plugin是什么，有什么区别', link: '/33-webpack/Webpack中Loader和Plugin是什么，有什么区别' },
        { text: 'Webpack常用的插件有哪些', link: '/33-webpack/Webpack常用的插件有哪些' },
        { text: 'Webpack的核心原理是什么', link: '/33-webpack/Webpack的核心原理是什么' },
        { text: 'Vite和Webpack在热更新上有什么区别', link: '/33-webpack/Vite和Webpack在热更新上有什么区别' },
      ]
    }
  ],
  '/nginx/': [
    {
      text: 'Nginx',
      items: [
        { text: '导读', link: '/nginx/' },
        { text: '通过 yum 方式安装 Nginx', link: '/nginx/install-nginx' },
        { text: 'Nginx的常用命令？', link: '/nginx/Nginx的常用命令？' },
        { text: 'Nginx 配置文件解读', link: '/nginx/nginx-config' },
        { text: '单服务器如何部署多个网站？', link: '/nginx/multi-deploy' },
        { text: 'Nginx配置Gzip压缩', link: '/nginx/nginx-gzip' },
        { text: 'Nginx如何实现跨域访问？', link: '/nginx/Nginx如何实现跨域访问？' },
      ]
    }
  ],
  '/34-Hadoop/': [
    {
      text: 'Hadoop',
      items: [
        { text: '什么是Hadoop', link: '/34-Hadoop/什么是Hadoop' },
        { text: 'Hadoop架构', link: '/34-Hadoop/Hadoop架构' },
        { text: 'Hadoop常用端口号、配置', link: '/34-Hadoop/Hadoop常用端口号、配置' },
        { text: 'HDFS文件块大小', link: '/34-Hadoop/HDFS文件块大小' },
        { text: 'HDFS小文件的危害', link: '/34-Hadoop/HDFS小文件的危害' },
        { text: 'HDFS小文件怎么解决', link: '/34-Hadoop/HDFS小文件怎么解决' },
      ]
    }
  ],
  '/hbase/': [
    {
      text: 'HBase',
      items: [
        { text: '导读', link: '/hbase/' },
      ]
    },
    {
      text: 'HBase简明教程',
      items: [
        { text: 'HBase引入简介', link: '/hbase/learn/00-HBase引入简介' },
        { text: 'HBase部署安装', link: '/hbase/learn/01-HBase部署安装' },
        { text: 'HBase参数文件', link: '/hbase/learn/02-HBase参数文件' },
        { text: 'HBase数据模型', link: '/hbase/learn/03-HBase数据模型' },
        { text: 'Hbase Shell', link: '/hbase/learn/04-Hbase Shell' },
        { text: 'HBase Java API操作', link: '/hbase/learn/05-HBase Java API操作' },
        { text: 'HBase Java API演示', link: '/hbase/learn/06-HBase Java API演示' },
        { text: 'HBase必坑指南', link: '/hbase/learn/HBase必坑指南' },
        { text: 'HBase整合Phoenix', link: '/hbase/learn/HBase整合Phoenix' },
      ]
    }
  ],

  '/37-Spark/': [
    {
      text: 'Spark',
      items: [
        { text: '导读', link: '/37-Spark/' },
      ]
    },
    {
      text: 'Spark简明教程',
      collapsed: true,
      items: [
        { text: 'Spark简介', link: '/37-Spark/learn/00-Spark简介' },
        { text: 'Spark环境部署', link: '/37-Spark/learn/01-Spark环境部署' },
        { text: '打包代码与依赖', link: '/37-Spark/learn/02-打包代码与依赖' },
        { text: 'Spark 程序编写流程', link: '/37-Spark/learn/Spark 程序编写流程' },

        { text: '第一个Spark程序WordCount', link: '/37-Spark/learn/03-第一个Spark程序WordCount' },
        { text: '监控页面及圆周率PI运行', link: '/37-Spark/learn/04-监控页面及圆周率PI运行' },
        { text: 'RDD五大特性', link: '/37-Spark/learn/05-RDD五大特性' },
        { text: 'RDD的创建', link: '/37-Spark/learn/06-RDD的创建' },

        { text: '向Spark传递函数', link: '/37-Spark/learn/07-向Spark传递函数' },
        { text: 'Spark常用RDD-Java', link: '/37-Spark/learn/08-Spark常用RDD-Java' },
        { text: 'Spark常用RDD-Scala', link: '/37-Spark/learn/08-Spark常用RDD-Scala' },
        { text: '在不同的RDD类型间转换', link: '/37-Spark/learn/09-在不同的RDD类型间转换' },
        { text: 'SparkRDD比较', link: '/37-Spark/learn/10-SparkRDD比较' },
        { text: 'RDD序列化', link: '/37-Spark/learn/11-RDD序列化' },
        { text: 'RDD的依赖关系', link: '/37-Spark/learn/12-RDD的依赖关系' },
        { text: '数据分区', link: '/37-Spark/learn/13-数据分区' },
        { text: 'RDD持久化(缓存)', link: '/37-Spark/learn/13-RDD持久化(缓存)' },
        { text: '累加器与广播变量', link: '/37-Spark/learn/14-累加器与广播变量' },
        { text: 'Spark内核调度', link: '/37-Spark/learn/14-Spark内核调度' },
        { text: 'Spark提交应用', link: '/37-Spark/learn/15-spark提交应用' },
        { text: 'RDD并行度与分区', link: '/37-Spark/learn/16-分区数与并行度' },
        { text: 'RDD的并行度调优', link: '/37-Spark/learn/17-RDD的并行度调优' },
        { text: '数据的读取与保存', link: '/37-Spark/learn/19-数据的读取与保存' },
        { text: '基于Spark SQL的WordCount', link: '/37-Spark/learn/26-基于Spark SQL的WordCount' },
        { text: 'Dataset 与 DataFrame', link: '/37-Spark/learn/27-Dataset 与 DataFrame' },
        { text: 'SparkSQL电影评分案例', link: '/37-Spark/learn/28-SparkSQL电影评分案例' },
        { text: '自定义UDF函数', link: '/37-Spark/learn/29-自定义UDF函数' },
        { text: 'SparkStreaming', link: '/37-Spark/learn/30-SparkStreaming' },
        { text: '基于Spark Streaming的WordCount', link: '/37-Spark/learn/31-基于Spark Streaming的WordCount' },
        { text: 'Spark Streaming的组件介绍', link: '/37-Spark/learn/32-Spark Streaming的组件介绍' },
        { text: 'DStream', link: '/37-Spark/learn/33-DStream' },
        { text: 'DStream基础输入源', link: '/37-Spark/learn/34-DStream基础输入源' },
        { text: 'SparkStreaming集成Kafka分区', link: '/37-Spark/learn/35-SparkStreaming集成Kafka' },
        { text: 'Anaconda On Linux', link: '/37-Spark/learn/Anaconda On Linux' },
        { text: 'Anaconda与PySpark安装', link: '/37-Spark/learn/Anaconda与PySpark安装' },
        { text: '开发常见问题', link: '/37-Spark/learn/开发常见问题' },
      ]
    },
    {
      text: '案例',
      items: [
        { text: 'spark影评分析案例', link: '/37-Spark/spark影评分析案例' },
      ]
    }
  ],
  '/36-Hive/': [
    {
      text: 'Hive',
      items: [
        { text: '导读', link: '/36-Hive/' },
      ]
    }
  ],

  '/38-Flink/': [
    {
      text: 'Flink',
      items: [
        { text: '导读', link: '/38-Flink/' },
      ]
    }
  ],

  '/39-Scala/': [
    {
      text: '其他',
      collapsed: true,
      items: [
        { text: 'Scala环境部署（Windows）', link: '/39-Scala/01-Scala-dev-deploy' },

      ]
    },
    {
      text: 'Scala简明教程',
      collapsed: false,
      items: [
        { text: '导读', link: '/39-Scala/' },
        { text: 'Scala变量与数据类型', link: '/39-Scala/02-Scala变量与数据类型' },
        { text: 'Scala算术运算符', link: '/39-Scala/03-Scala算术运算符' },
        { text: 'Scala流程控制', link: '/39-Scala/04-Scala流程控制' },
        { text: 'Scala函数式编程', link: '/39-Scala/05-Scala函数式编程' },
        { text: 'Scala面向对象', link: '/39-Scala/06-Scala面向对象' },
        { text: 'Scala集合', link: '/39-Scala/07-Scala集合' },
        { text: '模式匹配', link: '/39-Scala/08-模式匹配' },
        { text: '异常体系', link: '/39-Scala/09-异常体系' },
        { text: '隐式转换', link: '/39-Scala/10-隐式转换' },
        { text: '泛型', link: '/39-Scala/11-泛型' },
        { text: '正则表达式', link: '/39-Scala/12-正则表达式' },
      ]
    },
    {
      text: '基础',
      items: [
        { text: 'tuple._1与tuple._1()的区别', link: '/39-Scala/tuple._1与tuple._1()的区别' },
      ]
    }
  ],

  '/40-data-sync/': [
    {
      text: '数据同步',
      items: [
        { text: '导读', link: '/40-data-sync/' },
      ]
    }
  ],

  '/Docker/': [
    {
      text: 'Docker',
      items: [
        { text: '导读', link: '/Docker/' },
        { text: 'Docker基础', link: '/Docker/01-docker基础' },
        { text: 'Docker network', link: '/Docker/04-docker network' },
        { text: 'Dockerfile', link: '/Docker/02-Dockerfile' },
        { text: 'Dockerfile部署Tomcat', link: '/Docker/03-Dockerfile部署Tomcat' },
        { text: 'Docker中部署redis集群', link: '/Docker/05-docker中部署redis集群' },
        { text: 'Portainer安装', link: '/Docker/05-Portainer安装' },
        { text: 'Docker compose容器编排', link: '/Docker/06-Docker compose容器编排' },
        { text: 'Docker容器监控CIG', link: '/Docker/06-Docker容器监控CIG' },
        { text: 'Docker容器固定IP', link: '/Docker/07-docker容器固定IP' },
        { text: 'Docker搭建Hadoop、spark', link: '/Docker/08-Docker搭建Hadoop、spark' },
        { text: 'Docker上部署hbase', link: '/Docker/09-docker上部署hbase' },
        { text: 'Docker上部署kafka', link: '/Docker/10-docker上部署kafka' },
        { text: 'Docker中部署主从复制MySQL', link: '/Docker/12-docker中部署主从复制MySQL' },
        { text: 'Docker私有仓库', link: '/Docker/14-Docker私有仓库' },
        { text: 'Docker部署ElasticSearch、Kibana', link: '/Docker/15-Docker部署ElasticSearch、Kibana' },
      ]
    }
  ],
  '/Python/': [
    {
      text: 'Python',
      items: [
        { text: '导读', link: '/Python/' },
      ]
    }
  ],

  // ============================
  '/50-啃书-《Java8实战》/': [
    {
      text: '《Java8实战》',
      items: [
        { text: '将函数参数化进行传递', link: '/50-啃书-《Java8实战》/01-将函数参数化进行传递' },
        { text: 'Lambda表达式', link: '/50-啃书-《Java8实战》/02-Lambda表达式' },
        { text: 'Stream流', link: '/50-啃书-《Java8实战》/03-Stream流' },
        { text: 'Optional取代null', link: '/50-啃书-《Java8实战》/Optional取代null' },
      ]
    }
  ],
  '/51-啃书-《effective java》/': [
    {
      text: '《effective java》',
      items: [
        { text: '考虑使用静态方法代替构造方法', link: '/51-啃书-《effective java》/01-考虑使用静态方法代替构造方法' },
      ]
    }
  ],

}