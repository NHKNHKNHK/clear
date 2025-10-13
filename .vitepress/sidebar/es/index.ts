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
      { text: 'Docker部署ElasticSearch、Kibana', link: learnPath + '00-Docker部署ElasticSearch、Kibana' },
      { text: 'ElasticSearch是什么', link: learnPath + 'what-es' },
      { text: 'Window上安装ElasticSearch', link: learnPath + 'window-install-es' },
      { text: 'RESTful API基本操作', link: learnPath + 'restful-api-basic' },
      { text: 'JavaAPI操作ElasticSearch', link: learnPath + 'JavaAPI操作ElasticSearch' },
    ]
  }
]