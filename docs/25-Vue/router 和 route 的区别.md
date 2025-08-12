# router 和 route 的区别

route 是路由信息对象，包括 path，params，hash，query，fullPath，matched，name 等路由信息参数。

而router 是路由实例对象，包括了路由的跳转方法，钩子函数等。

## $route 和 $router

在vue2中，$route 和 $router 都是全局对象，可以直接在组件中使用。