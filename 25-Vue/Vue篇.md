## vue计算属性的函数名和data中的属性可以同名吗？为什么？

**不可以**。因为Vue会将data中是属性和计算属性都挂载到Vue实例上，如果它们同名冲突了，导致实例中的属性被覆盖，从而引发不可预知的错误。

扩展

-   **命名冲突的本质**：在Vue中，`data`和计算属性最终都会作为Vue实例的属性存在。
    -   如果我们在data中定义了一个hello属性，又在computed中定了一个名为hello的属性，二者会产生同名冲突，Vue会警告你存在重复定义，Vue在初始化时会按照一定的顺序（如：Props、methods、computed、watch）将这些属性挂载到Vue实例上，后挂载的属性会覆盖先挂载的同名属性
-   **计算属性的优先级**：data的优先级高于computed。如果在data和computed中存在相同的属性，那么在模板中使用这些属性时，会优先使用data中的数据，因为data是直接存储的，而computed是基于data或其他属性的变化进行计算的
-   **避免命名冲突的最佳实战**：为了保持代码的清晰简介，建议在开发中遵循以下几点：
    -   **命名规范**：确保data和计算属性有不同的命名，避免命名规范
    -   **模块化管理**：将各自逻辑进行分模块管理，提高代码的可读性和可维护性
    -   **严格代码审查**：在代码审查阶段注意这些潜在的问题，及时纠正
-   **命名冲突如何提醒**：在运行环境下，Vue通常会在控制台输出警告信息，来提醒开发者存在属性冲突
-   **其他Vue中的相关属性**
    -   **methods**：与计算属性类型，methods中的方法也会挂载到Vue实例上**，同样需要避免与data和计算属性同名**
    -   **watch**：虽然数据监视器与data和计算属性有关，但他们不会直接产生命名冲突，因为watch本身不挂载属性名到Vue实例上

示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script type="text/javascript" src="../js/vue.js"></script>
</head>
<body>
  <div id="root">
    你好
    <h1>{{hello}}</h1>
  </div>
  <script>
    new Vue({
      el: '#root',
      computed: {
        hello() {
          return 'Hello World!'
        }
      },
      data() {
        return {
          hello: 'Hello Vue!'
        }
      }
    })
  </script>
</body>
</html>
```

控制台报错：

```
[Vue warn]: The computed property "hello" is already defined in data.
```



## v-if和 v-show有什么区别？使用场景分别是什么？

v-if和 v-show都是用于控制元素的显示和隐藏，但它们有本质上的区别：

-   v-show：通过控制元素的CSS display属性来显示和隐藏元素，无论是否为真，元素都会被渲染到DOM中，只是通过CSS样式来控制它的可见性、
-   v-if：通过条件判断来决定元素是否渲染。如果条件为假，元素不会渲染到DOM中

**使用场景**

-   v-show适用于需要频繁切换显示和隐藏状态的场景。因为它只是控制CSS样式，性能开销较小
-   v-if适用于在条件变化不太频繁的情况下使用，因为它每次重新渲染时都会进行完整的DOM操作，性能开销较大



**扩展**

-   **性能**
    -   v-show带来的性能开销主要体现在第一次渲染时。因为即便元素隐藏了，但它还是会占据DOM的空间和资源，不过后续的切换开销极小
    -   v-if每次状态切换都伴随着元素的创建和销毁，当条件频繁变化时，这样的操作会带来一定的性能开销。因此，在频繁切换时，不推荐使用v-if
-   **初始渲染**
    -   v-show在初次渲染时，无论条件满足与否都会将元素生成到DOM中。然后通过条件控制元素的CSS display属性来显示和隐藏元素
    -   v-if在初次渲染时会根据条件决定是否创建元素，条件为假是，元素不会生成到DOM中
-   **使用搭配**
    -   针对某些场景，可以考虑v-show和v-if的结合使用。例如：外层使用v-if进行一次性判断是否渲染内容，因为v-if可以确保根本不生成不需要的DOM元素；内层使用v-show进行频繁的显示隐藏切换
-   **过渡效果**
    -   在使用过渡效果时，v-show和v-if的行为也有所不同。v-show会触发CSS过渡效果，而v-if需要配合vue的transition组件使用

-   **开发指南**
    -   当你需要确保某个DOM元素在结构上存在，但在某些情况下需要隐藏，建议使用v-show
    -   但你确定在某些情况下完全不需要某个DOM元素时，使用v-if更合适



## 为什么vue2不能监听数组下标的变化？

## vue有了数据响应式，为什么还需要diff？

## 谈谈你对Vue生命周期的理解？