const basePath = '/01-Java基础/learn/'


export default [
  {
    text: 'Vue简明教程',
    collapsed: false,
    items: [
      { text: 'Vue组件通信', link: '/25-Vue/learn/component-communication' },
      {
        text: '辅助',
        collapsed: false,
        items: [
          { text: 'useTemplateRef', link: '/25-Vue/learn/useTemplateRef' },
        ]
      },
    ],
  },
  {
    text: '基础',
    collapsed: false,
    items: [
      { text: '导读', link: '/25-Vue/' },
      { text: '什么是双向绑定？', link: '/25-Vue/什么是双向绑定？' },
      { text: '如何理解 Vue 的单向数据流？', link: '/25-Vue/如何理解 Vue 的单向数据流？' },
      { text: '谈谈你对 SPA 单页面模式的理解，优缺点？', link: '/25-Vue/谈谈你对 SPA 单页面模式的理解，优缺点？' },
      { text: '什么是 MVVM，特征，实现思路，解决了什么问题？', link: '/25-Vue/什么是 MVVM，特征，实现思路，解决了什么问题？' },
      { text: 'Vue 什么特性表示出 MVVM 特性？', link: '/25-Vue/Vue 什么特性表示出 MVVM 特性？' },
      { text: 'computed和watch的区别（源码上）？', link: '/25-Vue/computed和watch的区别（源码上）？' },
      { text: 'nextTick的原理（底层实现）及使用场景？', link: '/25-Vue/nextTick的原理（底层实现）及使用场景？' },
      { text: '为什么vue2不能监听数组下标的变化？', link: '/25-Vue/为什么vue2不能监听数组下标的变化？' },
      { text: 'Vue2无法监听数组的哪些操作？如何解决？', link: '/25-Vue/Vue2无法监听数组的哪些操作？如何解决？' },
      { text: 'Vue中computed和data里面的值有什么区别吗？具体原理实现有什么区别？', link: '/25-Vue/Vue中computed和data里面的值有什么区别吗？具体原理实现有什么区别？' },
      { text: 'vue计算属性的函数名和data中的属性可以同名吗？为什么？', link: '/25-Vue/vue计算属性的函数名和data中的属性可以同名吗？为什么？' },
      { text: '了解 vue 的 mixin 和 extend 吗？', link: '/25-Vue/了解 vue 的 mixin 和 extend 吗？' },
      { text: '在 Vue 中，设置全局变量的方式有哪些？', link: '/25-Vue/在 Vue 中，设置全局变量的方式有哪些？' },
      { text: 'Vue data 为什么是函数，深拷贝、浅拷贝', link: '/25-Vue/Vue data 为什么是函数，深拷贝、浅拷贝' },
      { text: '谈谈你对Vue生命周期的理解？', link: '/25-Vue/谈谈你对Vue生命周期的理解？' },
      { text: 'Vue 生命周期，每个步骤发生了什么，越详细越好', link: '/25-Vue/Vue 生命周期，每个步骤发生了什么，越详细越好' },
      { text: '说一下 vue 父子组件的生命周期', link: '/25-Vue/说一下 vue 父子组件的生命周期' },
      { text: '哪些钩子中可以获取到 DOM 节点？', link: '/25-Vue/哪些钩子中可以获取到 DOM 节点？' },
      { text: 'Vue2 和 Vue3 在数据劫持方面的区别？', link: '/25-Vue/Vue2 和 Vue3 在数据劫持方面的区别？' },
      { text: '说一下 vue 如何做到样式隔离', link: '/25-Vue/说一下 vue 如何做到样式隔离' },
      { text: '你都做过哪些 Vue 的性能优化，还有有哪些可以做？', link: '/25-Vue/你都做过哪些 Vue 的性能优化，还有有哪些可以做？' },
    ],
  },
  {
    text: '指令',
    collapsed: false,
    items: [
      { text: '说一下v-model的原理', link: '/25-Vue/说一下v-model的原理' },
      { text: 'v-if和v-show有什么区别？使用场景分别是什么？', link: '/25-Vue/v-if和v-show有什么区别？使用场景分别是什么？' },
      { text: 'v-if与v-for为什么不建议一起使用？', link: '/25-Vue/v-if与v-for为什么不建议一起使用？' },
      { text: '说说对自定义指令的理解？写一个vue的自定义指令', link: '/25-Vue/说说对自定义指令的理解？写一个vue的自定义指令' },
    ],
  },
  {
    text: '响应式',
    collapsed: false,
    items: [
      { text: 'vue有了数据响应式，为什么还需要diff？', link: '/25-Vue/vue有了数据响应式，为什么还需要diff？' },
      { text: 'vue2响应式原理', link: '/25-Vue/vue2响应式原理' },
      { text: 'vue3响应式原理', link: '/25-Vue/vue3响应式原理' },
      { text: 'vue3响应式原理对比 Vue2 有啥提升，区别', link: '/25-Vue/vue3响应式原理对比 Vue2 有啥提升，区别' },
      { text: '响应式为什么要从 Object.defineProperty 换成 Proxy？', link: '/25-Vue/响应式为什么要从 Object.defineProperty 换成 Proxy？' },
    ],
  },
  {
    text: 'DOM',
    collapsed: false,
    items: [
      { text: '介绍一下 Vue 的内部运行机制', link: '/25-Vue/介绍一下 Vue 的内部运行机制' },
      { text: '说一下对你虚拟DOM的理解和原理', link: '/25-Vue/说一下对你虚拟DOM的理解和原理' },
      { text: 'Diff 算法的具体比较过程', link: '/25-Vue/Diff 算法的具体比较过程' },
      { text: 'vue diff 算法优化原理', link: '/25-Vue/vue diff 算法优化原理' },
      { text: 'React diff 算法，为什么需要 hooks？', link: '/25-Vue/React diff 算法，为什么需要 hooks？' },
      { text: '说一下在 Vue 中，for里面为什么要有这个key，结合一个排行榜场景', link: '/25-Vue/说一下在 Vue 中，for里面为什么要有这个key，结合一个排行榜场景' },
      { text: 'Vue 中 key 的作用，为什么有高效性？', link: '/25-Vue/Vue 中 key 的作用，为什么有高效性？' },
      { text: 'Vue 中 key 值为什么不能用索引', link: '/25-Vue/Vue 中 key 值为什么不能用索引' },
      { text: '实现 vue 中 template 生成虚拟 DOM', link: '/25-Vue/实现 vue 中 template 生成虚拟 DOM' },
    ],
  },
  {
    text: '组件',
    collapsed: false,
    items: [
      { text: 'Vue 组件通信的方式有哪些，如何实现？', link: '/25-Vue/Vue 组件通信的方式有哪些，如何实现？' },
      { text: '兄弟组件之前如何通信？你会考虑用哪些方法', link: '/25-Vue/兄弟组件之前如何通信？你会考虑用哪些方法' },
      { text: '在实际项目中，组件通信有哪些注意点？', link: '/25-Vue/在实际项目中，组件通信有哪些注意点？' },
      { text: '组件延迟加载的原理？', link: '/25-Vue/组件延迟加载的原理？' },
      { text: '刷新浏览器后，Vuex的数据是否存在？', link: '/25-Vue/刷新浏览器后，Vuex的数据是否存在？' },
      { text: '说一下 vuex 的原理，数据存储在哪里', link: '/25-Vue/说一下 vuex 的原理，数据存储在哪里' },
      { text: '如何封装一个弹窗组件，需要考虑哪些方面', link: '/25-Vue/如何封装一个弹窗组件，需要考虑哪些方面' },
      { text: 'Vue 组件修饰符是什么？', link: '/25-Vue/Vue 组件修饰符是什么？' },
      { text: 'keep-alive的原理和使用场景？', link: '/25-Vue/keep-alive的原理和使用场景？' },
      { text: 'Suspence 支持顶层 await？', link: '/25-Vue/Suspence 支持顶层 await？' },
    ],
  },
  {
    text: '路由',
    collapsed: false,
    items: [
      { text: '说一下 vue 的路由的原理', link: '/25-Vue/说一下 vue 的路由的原理' },
      { text: '说说 vue-router 的原理', link: '/25-Vue/说说 vue-router 的原理' },
      { text: '全局守卫的三个参数分别是什么？', link: '/25-Vue/全局守卫的三个参数分别是什么？' },
      { text: 'vue 路由 history 和 hash 两种模式的区别', link: '/25-Vue/vue 路由 history 和 hash 两种模式的区别' },
      { text: 'router 和 route 的区别', link: '/25-Vue/router 和 route 的区别' },
      { text: '主应用修改了路由，子应用如何感知到', link: '/25-Vue/主应用修改了路由，子应用如何感知到' },
      { text: '讲讲 window.history 的原理，为什么 popState 能够实现前端路由', link: '/25-Vue/讲讲 window.history 的原理，为什么 popState 能够实现前端路由' },
    ],
  },
]