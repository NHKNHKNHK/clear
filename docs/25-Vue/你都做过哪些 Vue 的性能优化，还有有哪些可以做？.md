# 你都做过哪些 Vue 的性能优化，还有有哪些可以做？

## 编码阶段

- 不要在模板里面写过多表达式
- 尽量减少 data 中的数据，data 中的数据都会增加getter 和 setter，会收集对应的watcher
- 不需要响应式的数据不要放到 data 中（可以用 Object.freeze() 冻结数据）
- 对象层级不要过深，否则性能就会差
- computed 和 watch 区分使用场景
- v-if 和 v-for 不能连用
- 如果需要使用 v-for 给每项元素绑定事件时使用事件代理
- SPA 页面采用 keep-alive 缓存组件
- 频繁切换的使用 v-show，不频繁切换的使用 v-if
- v-for 遍历必须加 key，key 最好是 id 值，且避免同时使用 v-if
- 使用路由懒加载、异步组件
- 防抖、节流运用
- 第三方模块按需导入
- 大数据列表和表格性能优化 - 虚拟列表/虚拟表格
- 图片懒加载

## 搜索引擎 SEO 优化

- 预渲染
-服务端渲染 SSR，nuxt.js

## 打包优化

- 压缩代码
- Tree Shaking / Scope Hoisting
- 使用 CDN 加载第三方模块
- 多线程打包 happypack
- splitChunks 抽离公共文件
- sourceMap 优化

## 用户体验

- 骨架屏
- PWA 渐进式 Web 应用，使用多种技术来增强 web app 的功能，让网页应用呈现和原生应用相似的体验。