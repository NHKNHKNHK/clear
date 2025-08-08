# vue计算属性的函数名和data中的属性可以同名吗？为什么？

**不可以**。因为Vue会将data中是属性和计算属性都挂载到Vue实例上，如果它们同名冲突了，导致实例中的属性被覆盖，从而引发不可预知的错误。

## 扩展

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

### 示例

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
