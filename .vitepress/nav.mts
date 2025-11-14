export default [
  { text: '首页', link: '/' },
  {
    text: '后端',  // 该部分的标题（可省略）
    items: [
      { text: 'Java基础', link: '/01-Java基础' },
      { text: 'Java集合', link: '/02-Java集合篇' },
      { text: 'JVM篇', link: '/03-JVM篇' },
      { text: 'Java并发篇', link: '/04-Java并发篇' },
      { text: 'Spring', link: '/05-Spring' },
      { text: 'SpringMVC', link: '/06-SpringMVC' },
      { text: 'SpringBoot', link: '/07-SpringBoot' },
      { text: 'SpringCloud、微服务', link: '/08-SpringCloud、微服务' },
      { text: '分布式', link: '/12-分布式' },

      { text: 'ORM', link: '/11-ORM' },

      { text: '问题排除、场景题、性能优化', link: '/17-backend-what' },
      { text: 'Git', link: '/18-Git' },
      { text: 'Linux', link: '/19-Linux' },
      { text: '操作系统', link: '20-operating-system' },
      { text: '计算机网络', link: '/21-computer-network' },
      { text: '数据结构', link: '/22-data-structure' },
      { text: '设计模式', link: '/23-设计模式' },
    ]
  },
  {
    text: '前端',
    items: [
      { text: '前端基础', link: '/24-前端基础' },
      { text: 'HTML', link: '/29-HTML' },
      { text: 'CSS', link: '/30-CSS' },
      { text: 'JavaScript', link: '/27-JavaScript' },
      { text: 'Vue', link: '/25-Vue' },
      { text: 'React', link: '/26-React' },
      { text: '小程序', link: '/32-small-program' },
      { text: 'NodeJS', link: '/28-NodeJS' },
      { text: 'Nginx', link: '/nginx' },
      { text: '前端性能优化、场景、bug', link: '/31-front-what' },
      { text: 'WebPack', link: '/33-webpack/what-webpack' },
    ]
  },
  {
    text: '中间件',
    items: [
      { text: 'MySQL', link: '/09-MySQL' },
      { text: 'Redis', link: '/10-Redis' },
      { text: 'Zookeeper', link: '/13-Zookeeper' },
      { text: 'ElasticSearch', link: '/14-ElasticSearch' },
      {
        text: '消息队列',
        items: [
          { text: 'RocketMQ', link: '/15-MQ/RocketMQ' },
          { text: 'Kafka', link: '/15-MQ/Kafka' },
          { text: 'RabbitMQ', link: '/15-MQ/RabbitMQ' },
        ]
      },
      { text: 'MongoDB', link: '/16-MongoDB' },
    ]
  },
  {
    text: 'BigData',
    items: [
      { text: 'Hadoop', link: '/34-Hadoop/什么是Hadoop' },
      { text: 'HBase', link: '/hbase' },
      { text: 'Spark', link: '/37-Spark' },
      { text: 'Hive', link: '/36-Hive' },
      { text: 'Flink', link: '/38-Flink' },
      { text: 'Scala', link: '/39-Scala' },
      { text: '数据同步', link: '/40-data-sync' },
    ]
  },
  {
    text: '其他',
    items: [
      { text: '参考与鸣谢', link: '/thankYou' },
      { text: 'VitePress Markdown语法扩展', link: '/markdown-examples' },
      { text: 'Docker', link: '/Docker' },
      { text: 'Python', link: '/Python' },
      { text: '其他', link: '/other/wx/wx-play/index' },
      {
        text: '书籍阅读记录',
        items: [
          { text: '《Java8实战》', link: '/50-啃书-《Java8实战》/01-将函数参数化进行传递' },
          { text: '《effective java》', link: '/51-啃书-《effective java》/01-考虑使用静态方法代替构造方法' },
        ],
      }
    ]
  }
]