# 说一下 vue 父子组件的生命周期

## 单组件生命周期

beforeCreate，created，beforeMount，beforeMounted，beforeUpdate，updated，beforeDestroy，destroyed

## 父子组件生命周期关系

- 创建： 父 created --> 子 created --> 子 mounted --> 父 mounted
- 更新： 父 beforeUpdate --> 子 beforeUpdate --> 子 updated --> 父 updated
- 销毁： 父 beforeDestryy --> 子 beforeDestryy --> 子 destroyed --> 父 destroyed