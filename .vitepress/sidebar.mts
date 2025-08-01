
export default [
  {
    text: 'Java',
    collapsed: true, // 折叠 默认展开，初始页面加载时折叠设置为true
    items: [
      { text: 'Java基础', link: '/01-Java基础/Java基础' },
      { text: 'Java集合', link: '/02-Java集合篇/Java集合篇' },
    ]
  },
  {
    text: 'JVM',
    items: [
      { text: 'JVM', link: '/03-JVM篇/JVM篇' },
    ]
  },
  {
    text: 'Java并发',
    collapsed: true, // 折叠 默认展开，初始页面加载时折叠设置为true
    items: [
      { text: 'Java并发', link: '/04-Java并发/Java并发' },
    ]
  },
  {
    text: 'Spring',
    items: [
      { text: 'Spring', link: '/05-Spring/Spring篇' },
    ]
  },
  {
    text: 'SpringMVC',
    items: [
      { text: 'SpringMVC', link: '/06-SpringMVC/SpringMVC篇' },
    ]
  },
  {
    text: 'SpringBoot',
    items: [
      { text: 'SpringBoot', link: '/07-SpringBoot/SpringBoot篇' },
      { text: '什么是SpringBoot？', link: '/07-SpringBoot/什么是SpringBoot' },
      { text: 'SpringBoot自动装配原理', link: '/07-SpringBoot/SpringBoot自动装配原理' }
    ]
  },
  {
    text: '后端',
    items: [
      { text: 'Markdown Examples', link: '/markdown-examples' },
      { text: 'Runtime API Examples', link: '/api-examples' }
    ]
  },
  {
    text: 'MySQL',
    items: [
      { text: 'MySQL事务的四大特性', link: '/09-MySQL/MySQL事务的四大特性' },
      { text: 'B树和B+树的区别', link: '/09-MySQL/B树和B+树的区别' },
    ]
  },
]