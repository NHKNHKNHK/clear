/**
 * @param {string} pathname pathname 值
 * @returns {SidebarItem[]} 侧边栏数组
 */
export const getSideBarList = (pathname: string) => {
  if (['/SpringBoot', '/core'].includes(pathname)) {
    return [
      {
        text: 'SpringBoot',
        items: [
          { text: 'SpringBoot', link: '/07-SpringBoot/SpringBoot篇' },
          { text: '什么是SpringBoot？', link: '/07-SpringBoot/什么是SpringBoot' },
          { text: 'SpringBoot自动装配原理', link: '/07-SpringBoot/SpringBoot自动装配原理' }
        ]
      },
      {
        text: 'API 篇',
        items: [
          { text: 'API篇', link: '/api/index' },
          { text: 'API篇1', link: '/api/api1' },
          { text: 'API篇2', link: '/api/api2' }
        ]
      },
      {
        text: '核心篇',
        items: [
          { text: '核心篇', link: '/core/index' },
          { text: '核心篇1', link: '/core/core1' },
          { text: '核心篇2', link: '/core/core2' }
        ]
      }
    ]
  }
  return [
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
}
