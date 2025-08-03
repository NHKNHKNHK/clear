import { defineConfig } from 'vitepress'
import nav from './nav.mjs'
import sidebar from './sidebar.mjs'
// 代码组icon
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'


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
      },
      {
        icon: {
          // iconfont图标
          svg: '<svg t="1754036798043" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5322" width="200" height="200"><path d="M533.941 419.264c14.71-1.621 37.291-3.264 68.352-3.264 51.872 0 93.803 9.152 119.776 28.416 23.339 17.952 38.859 47.008 34.56 89.13-3.978 39.19-24.042 66.635-53.312 83.595C676.544 633.152 642.837 640 592.107 640c-29.888 0-58.422-1.643-80.107-4.896l21.941-215.84z m42.87 172.939c4.981 0.992 11.562 1.973 24.533 1.973 51.883 0 88.47-25.877 92.16-62.24 5.333-52.555-27.125-70.944-81.803-70.624-7.072 0-16.917 0-22.133 0.97L576.8 592.214h0.01z m223.498-164.704c210.955-39.872 229.163 31.776 222.646 95.189L1010.656 640h-66.944l11.21-106.987c2.422-23.562 17.505-69.653-55.338-67.914-25.184 0.608-37.707 4.064-37.707 4.064s-2.186 28.469-4.832 49.514L844.32 640h-65.653l13.024-119.573" fill="#231916" p-id="5323"></path><path d="M226.635 632.683c-12.374 4.341-38.038 7.317-73.91 7.317C49.6 640-6.048 590.933 0.523 526.09c7.893-77.28 90.336-120.757 180.618-120.757 34.976 0 55.552 2.859 74.859 7.638l-6.208 52.064c-12.821-4.384-42.89-8.406-67.232-8.406-53.141 0-98.25 16.043-103.424 66.763-4.608 45.355 27.061 67.04 86.816 67.04 20.8 0 51.477-3.019 65.653-7.37l-4.992 49.6 0.022 0.02z" fill="#C92027" p-id="5324"></path><path d="M272.715 580.021c19.285 6.763 59.488 13.504 92 13.504 35.029 0 54.528-9.333 56.096-23.797 1.418-13.205-12.928-14.987-52.491-24.01-54.667-12.897-89.547-32.843-86.133-64.705C286.176 443.99 337.685 416 416.725 416c38.56 0 75.915 2.613 95.275 8.715l-6.656 46.666c-12.565-4.202-60.672-10.037-93.205-10.037-32.992 0-50.07 9.973-51.254 20.917-1.493 13.846 15.659 14.486 58.528 25.451 58.027 14.155 83.403 34.09 80.086 64.992C495.605 609.109 449.259 640 356.715 640c-38.528 0-71.744-6.763-90.048-13.525l6.048-46.454z" fill="#231916" p-id="5325"></path></svg>',
        },
        link: 'https://blog.csdn.net/weixin_56058578?type=blog',
      }
    ],
    // =====================
    // 页脚     当侧边栏可见时，不会显示页脚
    // =====================
    footer: {
      // 版权前显示的信息
      message: 'Released under the MIT License.',
      // 实际的版权文本
      copyright: `Copyright © 2025-${new Date().getFullYear()} <a href="https://gitee.com/ninghongkang">经典老哥</a>`
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

  srcDir: './docs',

  markdown: {
    lineNumbers: true, // 显示代码行号
    // container: {
    //   infoLabel: '信息',
    //   tipLabel: '提示',
    //   warningLabel: '警告',
    //   dangerLabel: '危险',
    //   detailsLabel: '详细信息'
    // }
    config(md) {
      md.use(groupIconMdPlugin) //代码组图标
    },
  },

  vite: {
    plugins: [
      groupIconVitePlugin({  //代码组图标
        // 以下配置的效果是在 代码组中不书写文件名页可以有图标显示
        customIcon: {
          mts: "vscode-icons:file-type-typescript",
          cts: "vscode-icons:file-type-typescript",
          ts: "vscode-icons:file-type-typescript",
          tsx: "vscode-icons:file-type-typescript",
          mjs: "vscode-icons:file-type-js",
          cjs: "vscode-icons:file-type-js",
          json: "vscode-icons:file-type-json",
          js: "vscode-icons:file-type-js",
          jsx: "vscode-icons:file-type-js",
          md: "vscode-icons:file-type-markdown",
          py: "vscode-icons:file-type-python",
          ico: "vscode-icons:file-type-favicon",
          html: "vscode-icons:file-type-html",
          css: "vscode-icons:file-type-css",
          scss: "vscode-icons:file-type-scss",
          yml: "vscode-icons:file-type-light-yaml",
          yaml: "vscode-icons:file-type-light-yaml",
          php: "vscode-icons:file-type-php",
          java: "vscode-icons:file-type-java",
          scala: "vscode-icons:file-type-scala",
          vue: "vscode-icons:file-type-vue",
        },
      })
    ],
  },


})
