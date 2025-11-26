const basePath = '/hadoop/'
const learnPath = '/hadoop/learn/'

export default [
  {
    text: '《Hadoop简明教程》',
    collapsed: false,
    items: [
      { text: 'HDFS产出背景及定义', link: learnPath + 'HDFS产出背景及定义' },
      { text: 'Hadoop四高', link: learnPath + 'Hadoop四高' },
      { text: 'HDFS优缺点', link: learnPath + 'HDFS优缺点' },
      { text: 'Hadoop组成', link: learnPath + 'Hadoop组成' },
      { text: 'Hadoop架构', link: learnPath + 'Hadoop架构' },
      { text: 'Hadoop特征优点', link: learnPath + 'Hadoop特征优点' },
      { text: 'Hadoop2、3新特性', link: learnPath + 'Hadoop2、3新特性' },
      { text: 'HDFS入门及shell命令', link: learnPath + 'HDFS入门及shell命令' },
      { text: 'Hadoop常用命令', link: learnPath + 'Hadoop常用命令' },
      { text: 'HDFS NameNode安全模式', link: learnPath + 'HDFS_NameNode安全模式' },
      { text: 'HDFS读写流程', link: learnPath + 'HDFS读写流程' },
      { text: 'HDFS动态节点管理', link: learnPath + 'HDFS动态节点管理' },
      { text: 'JavaAPI操作HDFS', link: learnPath + 'JavaAPI操作HDFS' },
      { text: 'Hadoop序列化机制', link: learnPath + 'Hadoop序列化机制' },
      { text: 'MapReduce入门', link: learnPath + 'MapReduce入门' },
      { text: '第一个MR程序——WordCount', link: learnPath + '第一个MR程序——WordCount' },
      { text: 'MR程序运行模式', link: learnPath + 'MR程序运行模式' },
      { text: 'MR Partition分区', link: learnPath + 'MR_Partition分区' },
      { text: 'MR Combiner规约', link: learnPath + 'MR_Combiner规约' },
      { text: 'MapReduce编程指南', link: learnPath + 'MapReduce编程指南' },
      { text: 'MR 并行度机制', link: learnPath + 'MR_并行度机制' },
      { text: '美国新冠疫情COVID-19统计-MR', link: learnPath + '美国新冠疫情COVID-19统计-MR' },



      { text: '集群安装JDK(普通用户)', link: learnPath + '集群安装JDK(普通用户)' },
      { text: 'SSH免密登录(普通用户)', link: learnPath + 'SSH免密登录(普通用户)' },
      { text: 'xsync集群分发脚本(普通用户)', link: learnPath + 'xsync集群分发脚本(普通用户)' },
      { text: 'Hadoop集群部署(普通用户)', link: learnPath + 'Hadoop集群部署(普通用户)' },
      { text: 'Hadoop集群部署(root用户)', link: learnPath + 'Hadoop集群部署(root用户)' },
      { text: '为什么Hadoop集群推荐使用普通用户', link: learnPath + '为什么Hadoop集群推荐使用普通用户' },




    ],
  },
  {
    text: 'Hadoop',
    collapsed: false,
    items: [
      { text: '什么是Hadoop', link: basePath + 'index' },
      { text: 'HDFS文件块大小', link: basePath + 'HDFS文件块大小' },
      { text: 'HDFS小文件的危害', link: basePath + 'HDFS小文件的危害' },
      { text: 'HDFS小文件怎么解决', link: basePath + 'HDFS小文件怎么解决' },
      { text: 'Hadoop常用端口号、常用配置', link: basePath + 'Hadoop常用端口号、常用配置' },
    ],
  }
]