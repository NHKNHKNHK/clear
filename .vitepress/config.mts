import { defineConfig } from 'vitepress'
import nav from './nav.mjs'
import sidebar from './sidebar.mjs'
import UnoCSS from 'unocss/vite'
// 代码组icon
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
// markmap
import { vitepressPluginLegend } from 'vitepress-plugin-legend'
// drawio
import withDrawio from '@dhlx/vitepress-plugin-drawio'

const base = process.env.GITHUB_ACTIONS === 'true' ? '/clear/' : '/'

// https://vitepress.dev/reference/site-config
export default withDrawio(defineConfig({
  base: base,
  // =====================
  // 站点级选项
  // =====================
  lang: 'zh-CN',
  title: "Site of Clear",
  description: "包含前后端的技术栈",
  head: [['link', { rel: 'icon', href: `${base}favicon.ico` }]], // 页签图标
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
    // logo: '/favicon.ico', // logo public下的图片路径
    logo: {
      light: '/svg/react-light.svg',
      dark: '/svg/react-dark.svg',
      alt: 'logo'
    },

    // siteTitle: false, // 隐藏左上角站点标题

    sidebarMenuLabel: '菜单', // 小尺寸屏幕侧边栏顶部菜单名称
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换浅色模式',
    darkModeSwitchTitle: '切换暗黑模式',

    // aside 右侧边栏
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
    // 注意：多侧边栏配置时， sidebar 为对象，每个 key 为一个侧边栏的路径，
    //      key 的值为 /basic/、/basic、basic 都可以，但是建议以 /basic/ 为 key
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
          svg: '<svg t="1754557884043" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6474" width="200" height="200"><path d="M512 0c282.784 0 512 229.216 512 512s-229.216 512-512 512S0 794.784 0 512 229.216 0 512 0z m189.952 752l11.2-108.224c-31.904 9.536-100.928 16.128-147.712 16.128-134.464 0-205.728-47.296-195.328-146.304 11.584-110.688 113.152-145.696 232.64-145.696 54.784 0 122.432 8.8 151.296 18.336L768 272.704C724.544 262.24 678.272 256 599.584 256c-203.2 0-388.704 94.88-406.4 263.488C178.336 660.96 303.584 768 535.616 768c80.672 0 138.464-6.432 166.336-16z" fill="#CE000D" p-id="6475"></path></svg>',
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
      copyright: `Copyright © 2024-${new Date().getFullYear()} <a href="https://gitee.com/ninghongkang">经典老哥</a>`
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

    image: {
      lazyLoading: true // 懒加载图片，默认禁用
    },


    config(md) {
      md.use(groupIconMdPlugin) //代码组图标
      // 将组件插入到文档的h1标题后
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options);
        if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`;
        return htmlResult;
      }

      // markmap 
      vitepressPluginLegend(md, {
        markmap: { showToolbar: true }, // 显示脑图工具栏
        mermaid: true // 启用 Mermaid
      })
    },
  },

  vite: {
    plugins: [
      UnoCSS(),
      groupIconVitePlugin({  //代码组图标
        // 以下配置的效果是在 代码组中不书写文件也可以有图标显示
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
      }),
    ],
    ssr: {

    },

  },


}), {
  // default page
  // set default width， default： 100%
  width: "100%",
  // set default height，default： 600px
  height: "600px",
  // start page 0
  page: 0,
  // set page title
  // dark mode，default： auto, options： light, dark, auto
  "darkMode": "auto",

  // enable toolbar resize，default： false
  resize: true,

  // enable toolbar change pages，default： false
  pages: true,
  // enable toolbar zoom，default： false
  zoom: true,

  // enable toolbar layers，default： false
  layers: true,

  // enable toolbar lightbox，default： false
  lightbox: true,

  // set highlight color，default： #0000FF
  highlight: "#0000ff",

  // set transparent background，default： false
  transparent: true,
})
