import { defineConfig } from 'vitepress'
import nav from './nav.mjs'
import sidebar from './sidebar.mjs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // =====================
  // 站点级选项
  // =====================
  lang: 'zh-CN',
  title: "Clear的个人博客",
  description: "包含前后端的技术栈",
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]], // 页签图标
  // lastUpdated: true, // 显示最后更新时间，会根据 git 提交记录自动生成

  themeConfig: {
    // 编辑链接配置，用于在页面底部显示编辑此页的链接
    editLink: {
      pattern: 'https://gitee.com/ninghongkang/easy-interview/tree/master/docs/:path',
      text: '在 Gitee 上编辑此页'
    },
    lastUpdated: {
      text: '上次更新',
      formatOptions: {
        dateStyle: 'short', // medium full short
        timeStyle: 'medium'
      }
    },
    // =====================
    // 主题级选项
    // =====================
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.ico', // logo public下的图片路径
    siteTitle: false, // 隐藏左上角站点标题
    sidebarMenuLabel: '菜单', // 小尺寸屏幕侧边栏顶部菜单名称
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观1',
    lightModeSwitchTitle: '切换浅色模式',
    darkModeSwitchTitle: '切换暗黑模式',
    outline: {
      label: '本页目录',
      level: 'deep', // 要显示的标题级别，`'deep'` 与 `[2, 6]` 相同，将显示从 `<h2>` 到 `<h6>` 的所有标题
    },


    // =====================
    // 导航栏
    // =====================
    nav: nav,

    // =====================
    // 侧边栏
    // =====================
    sidebar: sidebar,

    // 社交链接，将会显示在导航栏右侧
    socialLinks: [
      {
        icon: {
          // iconfont图标
          svg: '<svg t="1753969891263" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4448" width="200" height="200"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="#C71D23" p-id="4449"></path></svg>'
        },
        link: 'https://gitee.com/ninghongkang',
      }
    ],
    // =====================
    // 页脚     当侧边栏可见时，不会显示页脚
    // =====================
    footer: {
      // 版权前显示的信息
      message: 'Released under the MIT License.',
      // 实际的版权文本
      copyright: `Copyright © 2025-${new Date().getFullYear()} <a href="https://gitee.com/ninghongkang">程序员clear</a>`
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    // =====================
    // 本地搜索
    // =====================
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    }
  },


  markdown: {
    lineNumbers: true, // 显示代码行号
    // container: {
    //   infoLabel: '信息',
    //   tipLabel: '提示',
    //   warningLabel: '警告',
    //   dangerLabel: '危险',
    //   detailsLabel: '详细信息'
    // }
  }


})
