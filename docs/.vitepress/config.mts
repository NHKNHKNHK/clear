import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // =====================
  // 站点级选项
  // =====================
  title: "Clear的个人博客",
  description: "包含前后端的技术栈",
  themeConfig: {
    // =====================
    // 主题级选项
    // =====================
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '后端', link: '/01-Java基础/Java基础.md' },
      { text: '前端', link: '/markdown-examples' },
      { text: 'AI', link: '/markdown-examples' },
      { text: '大数据', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
