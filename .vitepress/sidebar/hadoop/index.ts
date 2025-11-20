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



      { text: 'Hadoop序列化机制', link: learnPath + 'Hadoop序列化机制' },

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