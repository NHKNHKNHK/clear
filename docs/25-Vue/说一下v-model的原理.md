#  说一下v-model的原理

`v-model`本质上是语法糖，`v-model`在内部为不同的输入元素使用不同的属性并抛出不同的事件

- text 和 textarea 元素使用 value 属性和 input 事件
- checkbox 和 radio 使用 checked 属性和 change 事件
- select 字段将 value 作为 prop 并将 change 作为事件

