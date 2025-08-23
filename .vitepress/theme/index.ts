// .vitepress/theme/index.js
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import MyLayout from './MyLayout.vue'
import Confetti from './components/Confetti.vue'
import HomeUnderline  from './components/HomeUnderline.vue'
import ArticleMetadata from "./components/ArticleMetadata.vue"
import { onMounted, watch, nextTick } from "vue"
import { useRoute } from "vitepress"
import mediumZoom from "medium-zoom" // 图片放大插件
import { inBrowser } from "vitepress";
import { NProgress } from "nprogress-v2/dist/index.js"; // 进度条组件

import './styles/style.css'
import 'virtual:group-icons.css' //代码组样式
import "nprogress-v2/dist/index.css"; // 进度条样式
import './styles/index.scss'

// 彩虹背景动画样式
let homePageStyle: HTMLStyleElement | undefined


/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  // 使用注入插槽的包装组件覆盖 Layout
  // Layout: MyLayout,
  Layout: () => {
    return h(MyLayout, null, {
      // <https://vitepress.dev/guide/extending-default-theme#layout-slots>
    })
  },

  /**
   * 增强 Vue 应用实例
   *    app: App // Vue 应用实例
   *    router: Router // VitePress 路由实例
   *    siteData: Ref<SiteData> // 站点级元数据
   */
  enhanceApp({ app, router, siteData }) {
    // 注册自定义全局组件
    app.component('MyGlobalComponent' /* ... */)
    app.component('Confetti', Confetti)
    app.component('HomeUnderline', HomeUnderline)

    app.component('ArticleMetadata', ArticleMetadata)

    // 彩虹背景动画样式
    if (typeof window !== 'undefined') {
      watch(
        () => router.route.data.relativePath,
        () => updateHomePageStyle(location.pathname === '/'), // 这里需要注意下自己的首页路径是否为 / 
        { immediate: true },
      )
    }

    // 切换路由进度条
    if (inBrowser) {
      NProgress.configure({ showSpinner: false });

      router.onBeforeRouteChange = () => {
        NProgress.start(); // 开始进度条
      };
      router.onAfterRouteChange = () => {
        NProgress.done(); // 停止进度条
      };
    }
  },


  setup() {
    const route = useRoute()
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom(".main img", { background: "var(--vp-c-bg)" }) // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    }
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  },

} satisfies Theme


/**
  先定义一个动画样式变量 homePageStyle ，类型为 HTMLStyleElement
  创建一个名为 updateHomePageStyle 的函数，函数的作用是根据传入的参数 value 来判断是否需要添加动画样式。如果 value 为真并且 homePageStyle 不存在，则创建一个新的样式元素 homePageStyle ，并设置样式内容为动画样式，使用我们之前创建的关键帧 rainbow 。然后将 homePageStyle 添加到 body 元素中。如果 value 为假，则移除样式元素
  之后使用 watch 监听 路由是否变化，如果路由变化，则执行 updateHomePageStyle 函数，在当前页面是首页的情况下，给函数传 true，否则传 false
*/
// 彩虹背景动画样式
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}

