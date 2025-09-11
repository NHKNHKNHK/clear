# Vue3组件通信方式

不管是vue2还是vue3，组件通信方式很重要，不管是项目还是面试都是经常用到的知识点。

## Vue2|3组件通信方式

- `props`：可以实现父子组件、子父组件、甚至兄弟组件通信

- `自定义事件 $emit`：可以实现子父组件通信

- `全局事件总线 $bus`：可以实现任意组件通信

- `pubsub`：发布订阅模式实现任意组件通信

- `vuex`：集中式状态管理容器，实现任意组件通信

- `ref`：父组件获取子组件实例VC，获取子组件的响应式数据以及方法

- `slot`：插槽(默认插槽、具名插槽、作用域插槽)实现父子组件通信........

:::tip 说明
vue中的通信方式很多，因此实际工作中，很少使用 `pubsub`

在vue3中，`vuex`用的比较少，用的比较多的是`pinia`
:::

:::tip 类比
React中没有插槽的概念， 但是可以基于`props`实现默认插槽、具名插槽的功能

React中没有`自定义事件$emit`，但是可以通过`props`传递子传父
:::

## props

`props`可以实现父子组件通信，在vue3中我们可以通过`defineProps`获取父组件传递的数据。

且在组件内部不需要引`defineProps`方法可以直接使用！（因为它是一个宏函数）

**父组件给子组件传递数据**

```vue
<Child info="我爱祖国" :money="money"></Child>
```

**子组件获取父组件传递数据（方式1）**

```js
let props = defineProps({
  info: {
   type: String,  // 接受的数据类型
   default: '默认参数', // 接受默认数据
  },
  money: {
   type: Number,
   default: 0
}})
```

**子组件获取父组件传递数据（方式2）**

```js
let props = defineProps(["info",'money']);
```

子组件获取到`props`数据就可以在模板中使用了，但是切记`props`是只读的(只能读取，不能修改，不管是Vue2、Vue3中都是)

:::tip

- `props`在模板中可以直接使用,可以省略前面的`props.`
- 但是在script中需要使用到解构赋值 或带上`props.`

```js
const {info, money} = props
```

:::

## 自定义事件

在vue框架中事件分为两种

- 原生DOM事件：可以让用户与网页进行交互，比如`click`、`dbclick`、`change`、`mouseenter`、`mouseleave`....
- 自定义事件：可以实现子组件给父组件传递数据

### 原生DOM事件

代码如下:

```vue
<pre @click="handler">
    我是祖国的老花骨朵
</pre>
```

当前代码级给pre标签绑定原生DOM事件点击事件，默认会给事件回调注入`event`事件对象。

当然点击事件想注入多个参数可以按照如下操作。但是切记注入的事件对象务必叫做`$event`

```vue
<div @click="handler1(1, 2, 3, $event)">我要传递多个参数</div>
```

:::tip

- 在vue3中，`click`、`dbclick`、`change`(这类原生DOM事件)，不管是在标签、自定义标签上(组件标签)都是原生DOM事件。

- 在vue2中却不是这样的，组件标签在的称为自定义事件,可以通过`.native`修饰符变为原生DOM事件

:::

### 自定义事件

自定义事件实现子组件给父组件传递数据，大致流程：

- 1.在父组件内部给子组件绑定自定义事件
- 2.在子组件内部通过`$emit`触发自定义事件，完成传递数据
- 3.在父组件内部通过自定义事件的回调接收数据

比如在父组件内部给子组件(Event2)绑定一个自定义事件

```vue
<Event2  @xxx="handler3"></Event2>
```

在Event2子组件内部触发这个自定义事件

```vue
<template>
  <div>
    <h1>我是子组件2</h1>
    <button @click="handler">点击我触发xxx自定义事件</button>
  </div>
</template>

<script setup lang="ts">
  let $emit = defineEmits(["xxx"]);

  const handler = () => {
    $emit("xxx", "法拉利", "茅台");  // 传递数据
  };
</script>
```

我们会发现在script标签内部,使用了`defineEmits`方法，此方法是vue3提供的宏函数,不需要引入直接使用。

`defineEmits`方法执行，传递一个数组，数组元素即为将来组件需要触发的自定义事件类型，此方法执行会返回一个`$emit`方法用于触发自定义事件。

当点击按钮的时候，事件回调内部调用`$emit`方法去触发自定义事件，第一个参数为触发事件类型，第二个、三个、N个参数即为传递给父组件的数据。

需要注意的是，代码如下

```vue
<Event2  @xxx="handler3" @click="handler"></Event2>
```

正常说组件标签书写`@click`应该为原生DOM事件，但是如果子组件内部通过defineEmits定义就变为自定义事件了

```js
let $emit = defineEmits(["xxx",'click']);
```

## 全局事件总线

全局事件总线可以实现**任意组件通信**，在Vue2中可以根据`VM`与`VC`关系推出全局事件总线。

但是在Vue3中没有Vue构造函数，也就没有`Vue.prototype`，且组合式API写法没有`this`

那么在Vue3想实现全局事件的总线功能就有点不现实啦，如果想在Vue3中使用全局事件总线功能

可以使用插件mitt实现。

> mitt:官网地址:https://www.npmjs.com/package/mitt

全局事件总线实现任意组件通信思路：

- 引入mitt插件
- 调用mitt方法，方法执行会返回bus对象
- `on`方法绑定事件
- `off`方法解绑事件
- `emit`方法触发事件(提供数据)

**引入mitt插件，创建bus对象**

```js
import mitt from 'mitt'

const emitter = mitt()
console.log(emitter)

export default emitter
```

**调用`on`方法绑定事件**

```vue
<template>
  <div class="child1">
    <h3>我是子组件1:曹植</h3>
    <div>兄弟给我的车：{{ data }}</div>
  </div>
</template>

<script setup lang="ts">
// 引入$bus对象
import $bus from '../../bus'
import { onMounted, onUnmounted, ref } from 'vue'

const data = ref('')

// 组件挂载完毕的时候,当前组件绑定一个事件,接受将来兄弟组件传递的数据
onMounted(() => {
  //第一个参数:即为事件类型  第二个参数:即为事件回调
  $bus.on('car', (car) => {
    console.log(car)
    data.value = car as string
  })
})

// 组件卸载前，移除绑定的事件
onUnmounted(() => {
  $bus.off('car')
})
</script>
```

**调用`emit`方法触发事件**

```vue
<template>
  <div class="child1">
    <h3>我是子组件2:曹丕</h3>
    <button @click="handle">点我兄弟一辆车</button>
  </div>
</template>

<script setup lang="ts">
// 引入$bus对象
import $bus from '../../bus'

const handle = () => {
  $bus.emit('car', '保时捷')
}
</script>
```

## v-model

`v-model`指令可是收集表单数据(数据双向绑定)，除此之外它也可以实现父子组件数据同步。

**实现父子组件数据同步**

如下代码：相当于给组件Child传递一个`props(modelValue)`与绑定一个自定义事件`update:modelValue`

```vue
<Child v-model="msg"></Child>



<!-- v-model其实是个语法糖，它相对于如下 -->
<Child :modelValue="msg" @update:modelValue="handler"></Child>
<!-- 
  :modelValue="msg" 实现父传子
  @update:modelValue="handler" 实现子传父
-->
```

:::tip
v-model的底层本质：`:modelValue`（props） + `@update:modelValue`（自定义事件）
:::

### 多个 v-model 绑定

在Vue3中一个组件可以通过使用多个v-model，让父子组件多个数据同步

如下代码相当于给组件Child传递两个props分别是`pageNo`与`pageSize`，以及绑定两个自定义事件`update:pageNo`与`update:pageSize`实现父子数据同步

```vue
<Child v-model:pageNo="msg" v-model:pageSize="msg1"></Child>
```

### defineModel

从 Vue 3.4 开始，推荐的实现方式是使用`defineModel()`

`defineModel()`返回的值是一个 ref。它可以像其他 ref 一样被访问以及修改，不过它能起到在父组件和当前变量之间的双向绑定的作用

它的 `.value` 和父组件的 `v-model` 的值同步

当它被子组件变更了，会触发父组件绑定的值一起更新

**父组件**

```vue
<Child v-model="money"></Child>
```

**子组件中使用**

```vue
<template>
  <div class="child1">
    <h2>子组件1</h2>
    <h3>钱数:{{ modelValue }}</h3>
    <button @click="handler">父子组件数据同步（给父组件挣钱）</button>
  </div>
</template>

<script setup lang="ts">
  const modelValue = defineModel()

  const handler = () => {
    modelValue.value += 1000
  }
</script>
```

#### 多个 v-model 绑定

**父组件**

```vue
<!-- 
多个 v-model 绑定
-->
<Child2 v-model:pageNo="pageNo" v-model:pageSize="pageSize"></Child2>
```

**子组件中使用**

```vue
<script setup lang="ts">
  // vue3.4开始
  const pageNo = defineModel('pageNo')
  const pageSize = defineModel('pageSize')
  
  const pageNoChange = () => {
    pageNo.value += 3
  }
  
  const pageSizeChange = () => {
    pageSize.value += 4
  }
</script>
```

## useAttrs

在Vue3中可以利用`useAttrs`方法获取组件的属性与事件(包含：原生DOM事件或者自定义事件)

此函数功能类似于Vue2框架中`$attrs`属性与`$listeners`方法。


比如：在父组件内部使用一个子组件my-button

```vue
<my-button type="success" size="small" title='标题' @click="handler"></my-button>
```

子组件内部可以通过`useAttrs`方法获取组件属性与事件。

```vue
<script setup lang="ts">
  import {useAttrs} from 'vue';
  
  let $attrs = useAttrs();
</script>
```

因此你也发现了，它类似于`props`，可以接受父组件传递过来的属性与属性值。

:::warning 注意
如果`defineProps`接受了某一个属性，`useAttrs`方法返回的对象身上就没有相应属性与属性值。
:::

### useAttrs实现属性透传

**父组件**

```vue
<template>
  <div>
    <h1>useAttrs</h1>
    <el-button type="primary" size="small" :icon="Edit"></el-button>
    
    <!-- 自定义组件 -->
    <HintButton
      type="primary"
      size="small"
      :icon="Edit"
      title="编辑按钮"
      @click="handler"
      @xxx="handler"
    ></HintButton>
  </div>
</template>

<script setup lang="ts">
  import { Edit } from '@element-plus/icons-vue'
  import HintButton from './HintButton.vue'

  // 按钮点击的回调
  const handler = () => {
    alert(12306)
  }
</script>

<style scoped></style>
```

**子组件**

```vue{4,10-12}
<template>
  <div :title="title">
    <!-- 3.将子组件中为接收的属性与事件传递给孙组件（透传） -->
    <el-button :="$attrs" />
  </div>
</template>

<script setup lang="ts">
// 1.引入useAttrs方法:获取组件标签身上属性与事件
import { useAttrs } from 'vue'
// 此方法执行会返回一个对象
const $attrs = useAttrs()

// 2.用props接收title，在子组件中使用
let props = defineProps(['title'])

// props与useAttrs方法都可以获取父组件传递过来的属性与属性值
// 但是props接受了useAttrs方法就获取不到了
console.log('attrs', $attrs)
</script>
```

:::tip 个人理解
- Vue3中 `useAttrs` 与 `$attrs`属性 其实是一样的，都是为了透传组件身上的属性与事件（包含自定义事件）

- `useAttrs`是在setup中使用，`$attrs`属性是在template中使用

- `$attrs`属性比Vue2中的`$attrs`属性更强大，可以获取组件身上的所有属性与事件，Vue2中只能获取属性

- 它们一般都是用于父传孙，子组件中未使用`prop`、`$emit`等接收的都交由了`attrs` 
:::


## ref与$parent

ref,提及到ref可能会想到它可以获取元素的DOM或者获取子组件实例的VC。既然可以在父组件内部通过ref获取子组件实例VC，那么子组件内部的方法与响应式数据父组件可以使用的。

比如:在父组件挂载完毕获取组件实例

父组件内部代码:

```vue
<template>
  <div>
    <h1>ref与$parent</h1>
    <Son ref="son"></Son>
  </div>
</template>
<script setup lang="ts">
import Son from "./Son.vue";
import { onMounted, ref } from "vue";
const son = ref();
onMounted(() => {
  console.log(son.value);
});
</script>
```

但是需要注意，如果想让父组件获取子组件的数据或者方法需要通过defineExpose对外暴露,因为vue3中组件内部的数据对外“关闭的”，外部不能访问

```vue
<script setup lang="ts">
import { ref } from "vue";
//数据
let money = ref(1000);
//方法
const handler = ()=>{
}
defineExpose({
  money,
   handler
})
</script>
```

`$parent`可以获取某一个组件的父组件实例VC,因此可以使用父组件内部的数据与方法。必须子组件内部拥有一个按钮点击时候获取父组件实例，当然父组件的数据与方法需要通过defineExpose方法对外暴露

```vue
<button @click="handler($parent)">点击我获取父组件实例</button>
```

## provide与inject

**provide[提供]**

**inject[注入]**

vue3提供两个方法`provide`与`inject`,可以实现隔辈组件传递参数

组件组件提供数据:

provide方法用于提供数据，此方法执需要传递两个参数,分别提供数据的key与提供数据value

```vue
<script setup lang="ts">
import {provide} from 'vue'
provide('token','admin_token');
</script>
```

后代组件可以通过inject方法获取数据,通过key获取存储的数值

```vue
<script setup lang="ts">
import {inject} from 'vue'
let token = inject('token');
</script>
```


## pinia

> **pinia官网:https://pinia.web3doc.top/**

pinia也是集中式管理状态容器,类似于vuex。但是核心概念没有mutation、modules,使用方式参照官网

## slot

插槽：默认插槽、具名插槽、作用域插槽可以实现父子组件通信.

### 默认插槽

在子组件内部的模板中书写slot全局组件标签

```vue
<template>
  <div>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
</style>
```

在父组件内部提供结构：Todo即为子组件,在父组件内部使用的时候，在双标签内部书写结构传递给子组件

注意开发项目的时候默认插槽一般只有一个

```vue
<Todo>
  <h1>我是默认插槽填充的结构</h1>
</Todo>
```

### **具名插槽**

顾名思义，此插槽带有名字在组件内部留多个指定名字的插槽。

下面是一个子组件内部,模板中留两个插槽

```vue
<template>
  <div>
    <h1>todo</h1>
    <slot name="a"></slot>
    <slot name="b"></slot>
  </div>
</template>
<script setup lang="ts">
</script>

<style scoped>
</style>
```

父组件内部向指定的具名插槽传递结构。需要注意v-slot：可以替换为#

```vue
<template>
  <div>
    <h1>slot</h1>
    <Todo>
      <template v-slot:a>  //可以用#a替换
        <div>填入组件A部分的结构</div>
      </template>
      <template v-slot:b>//可以用#b替换
        <div>填入组件B部分的结构</div>
      </template>
    </Todo>
  </div>
</template>

<script setup lang="ts">
import Todo from "./Todo.vue";
</script>
<style scoped>
</style>
```

### **作用域插槽**

作用域插槽：可以理解为，子组件数据由父组件提供，但是子组件内部决定不了自身结构与外观(样式)

子组件Todo代码如下:

```vue
<template>
  <div>
    <h1>todo</h1>
    <ul>
     <!--组件内部遍历数组-->
      <li v-for="(item,index) in todos" :key="item.id">
         <!--作用域插槽将数据回传给父组件-->
         <slot :$row="item" :$index="index"></slot>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
defineProps(['todos']);//接受父组件传递过来的数据
</script>
<style scoped>
</style>
```

父组件内部代码如下:

```vue
<template>
  <div>
    <h1>slot</h1>
    <Todo :todos="todos">
      <template v-slot="{$row,$index}">
         <!--父组件决定子组件的结构与外观-->
         <span :style="{color:$row.done?'green':'red'}">{{$row.title}}</span>
      </template>
    </Todo>
  </div>
</template>

<script setup lang="ts">
import Todo from "./Todo.vue";
import { ref } from "vue";
//父组件内部数据
let todos = ref([
  { id: 1, title: "吃饭", done: true },
  { id: 2, title: "睡觉", done: false },
  { id: 3, title: "打豆豆", done: true },
]);
</script>
<style scoped>
</style>
```