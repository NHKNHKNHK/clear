const basePath = '/11-ORM/Mybatis/';


const mybatisSidebar = [
  {
    text: '基础',
    collapsed: false,
    items: [
      { text: 'Mybatis', link: '/11-ORM/' },
      { text: 'MyBatis 特性', link: '/11-ORM/Mybatis/MyBatis 特性' },
      { text: 'Myabtis优缺点？', link: '/11-ORM/Mybatis/Myabtis优缺点？' },
      { text: 'Mybatis与jdbc编程相比有什么优势？', link: '/11-ORM/Mybatis/Mybatis与jdbc编程相比有什么优势？' },
      { text: 'JDBC有哪些不足？Mybaits是如何解决的？', link: '/11-ORM/Mybatis/JDBC有哪些不足？Mybaits是如何解决的？' },

      { text: 'MyBatis的Xml映射文件中，都有哪些常见标签？', link: '/11-ORM/Mybatis/MyBatis的Xml映射文件中，都有哪些常见标签？' },
      { text: 'Mybatis的Xml映射文件中，不同的Xml映射文件，id是否可以重复？', link: '/11-ORM/Mybatis/Mybatis的Xml映射文件中，不同的Xml映射文件，id是否可以重复？' },

      { text: 'Mybatis 使用的时候 mapper 为什么也是接口形式的？', link: '/11-ORM/Mybatis/Mybatis 使用的时候 mapper 为什么也是接口形式的？' },
      { text: '使用 MyBatis 的 mapper 接口调用时有哪些要求？', link: '/11-ORM/Mybatis/使用 MyBatis 的 mapper 接口调用时有哪些要求？' },
      { text: 'Mybaits写个xml映射文件，在写给DAO接口就能执行，这是什么原理？', link: '/11-ORM/Mybatis/Mybaits写个xml映射文件，在写给DAO接口就能执行，这是什么原理？' },

      { text: 'Mybaits如何实现数据库类型和Java类型的转换？', link: '/11-ORM/Mybatis/Mybaits如何实现数据库类型和Java类型的转换？' },
      { text: 'Mybatis是否可以映射Enum枚举类？', link: '/11-ORM/Mybatis/Mybatis是否可以映射Enum枚举类？' },
      { text: 'Mybatis是如何将sql执行结果封装为目标对象？都有哪些映射形式？', link: '/11-ORM/Mybatis/Mybatis是如何将sql执行结果封装为目标对象？都有哪些映射形式？' },
      { text: '模糊查询like语句该怎么写？', link: '/11-ORM/Mybatis/模糊查询like语句该怎么写？' },

      { text: 'mybatis的paramtertype为什么可以写简称？', link: '/11-ORM/Mybatis/mybatis的paramtertype为什么可以写简称？' },

      { text: 'MySQL的 where 1=1会不会影响性能？', link: '/11-ORM/Mybatis/MySQL的 where 1=1会不会影响性能？' },

      { text: '简述Mybaits的插件运行原理，以及如何编写一个插件？', link: '/11-ORM/Mybatis/简述Mybaits的插件运行原理，以及如何编写一个插件？' },
      { text: 'Mybatis是如何进行分页的？', link: '/11-ORM/Mybatis/Mybatis是如何进行分页的？' },
      { text: 'Mybatis分页的原理和分页插件的原理？', link: '/11-ORM/Mybatis/Mybatis分页的原理和分页插件的原理？' },
      { text: '对于公共字段你是怎么处理的？', link: '/11-ORM/Mybatis/对于公共字段你是怎么处理的？' },

      { text: 'Mybaits自带的连接池有了解过吗？都有什么？', link: '/11-ORM/Mybatis/Mybaits自带的连接池有了解过吗？都有什么？' },
      { text: 'Mybatis修改字段类型引发的bug', link: '/11-ORM/Mybatis/Mybatis修改字段类型引发的bug' },

    ],

  },
  {
    text: '实战',
    collapsed: false,
    items: [
      { text: 'Mybatis实战', link: '/11-ORM/Mybatis/Mybatis实战' },
      // 实体类属性名和表中的字段名不一样
      { text: '当实体类中的属性名和表中的字段名不一样 ，怎么办？', link: '/11-ORM/Mybatis/当实体类中的属性名和表中的字段名不一样 ，怎么办？' },
      // lick语句如何写
      // id如何生成后返回
      // 如果将执行结果封装为对象
      // 是否可以映射枚举类型
      // 一级缓存和二级缓存的使用
      { text: '说说Mybatis的缓存机制？', link: '/11-ORM/Mybatis/说说Mybatis的缓存机制？' },
      { text: 'Mybatis的一级缓存', link: '/11-ORM/Mybatis/Mybatis的一级缓存' },
      { text: 'Mybatis的二级缓存', link: '/11-ORM/Mybatis/Mybatis的二级缓存' },
      { text: 'Springboot中Mybatis缓存如何配置方案？', link: '/11-ORM/Mybatis/Springboot中mybatis缓存如何配置方案？' },
    ]
  },
  {
    text: '原理',
    collapsed: false,
    items: [
      // 如何防止SQL注入
      // 有哪些executor执行器
      // 是否支持延迟加载 原理
      // 常见设计模式
      // #和$区别
      { text: '#{}和${}的区别？', link: '/11-ORM/Mybatis/{}和${}的区别？' },
      { text: '如何避免 sql 注入？', link: '/11-ORM/Mybatis/如何避免 sql 注入？' },
      { text: 'mybatis和数据库交互的原理？', link: '/11-ORM/Mybatis/mybatis和数据库交互的原理？' },
      { text: 'Mybaits执行原理？', link: '/11-ORM/Mybatis/Mybaits执行原理？' },
      { text: 'Mybatis中常见的设计模式有哪些？', link: '/11-ORM/Mybatis/Mybatis中常见的设计模式有哪些？' },
      { text: 'Mybatis都有哪些Executor执行器？它们之间的区别是什么？', link: '/11-ORM/Mybatis/Mybatis都有哪些Executor执行器？它们之间的区别是什么？' },
      { text: 'Mybatis的动态SQL是如何实现的？', link: '/11-ORM/Mybatis/Mybatis的动态SQL是如何实现的？' },
      { text: 'Mybaits动态SQL有什么用？执行原理？有哪些动态SQL？', link: '/11-ORM/Mybatis/Mybaits动态SQL有什么用？执行原理？有哪些动态SQL？' },
      { text: 'Mybatis是如何实现延迟加载的？', link: '/11-ORM/Mybatis/Mybatis是如何实现延迟加载的？' },
      { text: 'Mybaits是否支持延迟加载？它的实现原理？', link: '/11-ORM/Mybatis/Mybaits是否支持延迟加载？它的实现原理？' },
    ]
  },
]

export default mybatisSidebar;