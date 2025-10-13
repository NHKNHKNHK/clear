const basePath = '/14-ElasticSearch/'
const learnPath = '/14-ElasticSearch/learn/'


export default [
  {
    text: 'ElasticSearch',
    collapsed: true,
    items: [
      { text: 'ES', link: '/index' },
      { text: 'ES检索比较快的原因，为什么MySQL不行？', link: +basePath + 'ES检索比较快的原因，为什么MySQL不行？' },
    ]
  },
  {
    text: 'ElasticSearch简明教程',
    collapsed: true,
    items: [
      { text: 'Docker部署ElasticSearch、Kibana', link: learnPath + 'Docker部署ElasticSearch、Kibana' },
      { text: 'ElasticSearch是什么', link: learnPath + 'what-es' },
      { text: 'Window上安装ElasticSearch', link: learnPath + 'window-install-es' },
      { text: 'RESTful API基本操作', link: learnPath + 'restful-api-basic' },
      { text: 'JavaAPI操作ElasticSearch', link: learnPath + 'JavaAPI操作ElasticSearch' },
      { text: 'SpringBoot整合ES7-自定义Bean版', link: learnPath + 'SpringBoot整合ES7-自定义Bean版' },
      { text: 'SpringBoot整合ES7-ElasticsearchRestTemplate', link: learnPath + 'SpringBoot整合ES7-ElasticsearchRestTemplate' },
      { text: 'Linux部署ES(单节点、集群)', link: learnPath + 'Linux部署ES(单节点、集群)' },
      { text: 'Linux部署ES集群(改进版)', link: learnPath + 'Linux部署ES集群(改进版)' },
      { text: 'ES整合SparkStreaming', link: learnPath + 'ES整合SparkStreaming' },
    ]
  }
]