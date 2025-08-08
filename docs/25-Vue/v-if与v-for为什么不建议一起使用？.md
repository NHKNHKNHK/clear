# v-if 与 v-for 为什么不建议一起使用？

>   **优先级问题：v-for 优先于 v-if**
>
>   
>
>   Vue 在解析模板时，**v-for 的优先级高于 v-if**。这意味着：
>
>   -   **无论条件是否满足**，`v-for` 都会先遍历所有元素。
>   -   只有在遍历完成后，`v-if` 才会对每个元素进行条件判断

v-for 和 v-if 不要在同一个标签中使用，因为解析时先解析 v-for 再解析 v-if（v-for 指令比 v-if 优先级高）

如果遇到需要同时使用时可以考虑写成计算属性的方式。（有两种情况下会尝试这种组合）如下：

**（1）过滤列表的项**

```vue
<!--  例如，如果你尝试使用 v-if 标记过滤列表 -->
<!-- 每次渲染遍历所有users，为每个user执行user.isActive判断 -->
<ul>
    <li v-for="user in users" v-if="user.isActive" :key="user.id">
      {{ user.name }}
    </li>
</ul>



<!-- 这可以使用在初始列表上使用计算属性预过滤来避免。 -->
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive);
  }
}
<!-- 只遍历需要渲染的元素 -->
<li v-for="user in activeUsers" :key="user.id">
  {{ user.name }}
</li>
```

**（2）避免渲染应该被隐藏的列表**

```vue
<!-- 例如，你想根据条件检查用户是否显示还是隐藏 -->
<ul>
    <li
        v-for="user in users"
        v-if="shouldShowUsers"
        :key="user.id"
    >
        {{ user.name }}
    <li>
</ul>


<!-- 可以移动条件到父级避免对每一个用户检查 -->
<!-- 推荐：先判断条件，再决定是否渲染整个列表 -->
<ul v-if="shouldShowUsers">
  <li v-for="user in users" :key="user.id">
    {{ user.name }}
  </li>
</ul>
```

## **为什么官方不建议？**

-   **性能损耗**：即使元素被 `v-if` 隐藏，`v-for` 仍会遍历和创建虚拟 DOM 节点。
-   **逻辑混乱**：混合使用可能导致代码意图不清晰（例如，条件是针对列表整体还是单个项？）。
-   **维护风险**：后续修改时容易忽略优先级问题，导致意外行为。

**总结**

-   **避免在同一元素上混用 v-for 和 v-if**。
-   **优先使用计算属性过滤数据**，或通过父元素控制列表是否渲染

-   遵循这些原则可以提高 Vue 应用的性能和可维护性。

