## 响应式为什么要从 Object.defineProperty 换成 Proxy？

响应式系统是现代框架的核心特性。

无论是 Vue 还是 React，它们都需要实现一个基本功能：**当数据变化时，自动更新相关的视图**。

用通俗的话说，就是要在数据被读取或修改时"插一脚"，去执行一些额外的操作（比如界面刷新、计算属性重新计算等）。

```js
// 读取属性时
obj.a; // 需要知道这个属性被读取了

// 修改属性时
obj.a = 3; // 需要知道这个属性被修改了
```

但原生 JavaScript 对象不会告诉我们这些操作的发生。那么，尤雨溪是如何实现这种"插一脚"的能力的呢？

## Vue 2 的响应式方案

**Vue 2 的"插一脚"方案 - Object.defineProperty**

### 基本实现原理

Vue 2 使用的是 ES5 的 `Object.defineProperty` API。这个 API 允许我们定义或修改对象的属性，并为其添加 getter 和 setter。

>   mdn：[【Object.defineProperty()】](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

```js
const obj = { a: 1 };

let v = obj.a;
Object.defineProperty(obj, 'a', {
  get() {
    console.log('读取 a'); // 插一脚：知道属性被读取了
    return v;
  },
  set(val) {
    console.log('更新 a'); // 插一脚：知道属性被修改了
    v = val;
  }
});

obj.a;     // 输出"读取 a"
obj.a = 3; // 输出"更新 a"
```

### 完整对象监听

为了让整个对象可响应，Vue 2 需要遍历对象的所有属性：

```js
function observe(obj) {
  for (const k in obj) {
    let v = obj[k];
    Object.defineProperty(obj, k, {
      get() {
        console.log('读取', k);
        return v;
      },
      set(val) {
        console.log('更新', k);
        v = val;
      }
    });
  }
}
```

### 处理嵌套对象

对于嵌套对象，还需要递归地进行观察：

```js
function _isObject(v) {
  return typeof v === 'object' && v !== null;
}

function observe(obj) {
  for (const k in obj) {
    let v = obj[k];
    if (_isObject(v)) {
      observe(v); // 递归处理嵌套对象
    }
    Object.defineProperty(obj, k, {
      get() {
        console.log('读取', k);
        return v;
      },
      set(val) {
        console.log('更新', k);
        v = val;
      }
    });
  }
}
```

### Vue 2 方案的两大缺陷

缺陷一：效率问题

在这种模式下，他就必须要去遍历这个对象里边的每一个属性...这是第一个缺陷：必须遍历对象的所有属性，对于大型对象或深层嵌套对象，这会带来性能开销。

缺陷二：新增属性问题

无法检测到对象属性的添加或删除：

```js
obj.d = 2; // 这个操作不会被监听到
```

因为一开始遍历的时候没有这个属性，后续添加的属性不会被自动观察。

>   这一点在vue2官方文档也提到了：https://v2.cn.vuejs.org/v2/guide/reactivity.html#%E5%AF%B9%E4%BA%8E%E5%AF%B9%E8%B1%A1


## Vue 3 的响应式方案

**Vue 3 的"插一脚"方案 - Proxy**

### 基本实现原理

Vue 3 使用 ES6 的 Proxy 来重构响应式系统。Proxy 可以拦截整个对象的操作，而不是单个属性。

```js
const obj = { a: 1 };

const proxy = new Proxy(obj, {
  get(target, k) {
    console.log('读取', k); // 插一脚
    return target[k];
  },
  set(target, k, val) {
    if (target[k] === val) return true;
    console.log('更新', k); // 插一脚
    target[k] = val;
    return true;
  }
});

proxy.a;     // 输出"读取 a"
proxy.a = 3; // 输出"更新 a"
proxy.d;     // 输出"读取 d" - 连不存在的属性也能监听到！
```

### 完整实现

```js
function _isObject(v) {
  return typeof v === 'object' && v !== null;
}

function reactive(obj) {
  const proxy = new Proxy(obj, {
    get(target, k) {
      console.log('读取', k);
      const v = target[k];
      if (_isObject(v)) {
        return reactive(v); // 惰性递归
      }
      return v;
    },
    set(target, k, val) {
      if (target[k] === val) return true;
      console.log('更新', k);
      target[k] = val;
      return true;
    }
  });
  return proxy;
}
```

### Proxy 的优势

1、无需初始化遍历：直接代理整个对象，不需要初始化时遍历所有属性

2、全面拦截：可以检测到所有属性的访问和修改，包括新增属性

3、性能更好：采用惰性处理，只在属性被访问时才进行响应式处理

4、更自然的开发体验：不需要特殊 API 处理数组和新增属性

**proxy 它解决了什么问题？两个问题。**

第一个问题不需要深度遍历了，因为它不再监听属性了，而是监听的什么？整个对象。

同时也由于它监听了整个对象，就解决了第二个问题：能监听这个对象的所有操作，包括你去读写一些不存在的属性，都能监听到。"

## 原理对比

| | Object.defineProperty | Proxy |
|---------|-----------------------|-------|
| 拦截方式 | 属性级别            | 对象级别   |
| 新增属性检测 | 不支持 | 支持 |
| 性能 | 初始化时需要遍历 | 按需处理 |
| 深层嵌套处理 | 初始化时递归处理 | 访问时递归处理 |

## 源码实现差异

Vue 2 实现：

-   在 src/core/observer 目录下
-   初始化时递归遍历整个对象
-   需要特殊处理数组方法

Vue 3 实现：

-   独立的 @vue/reactivity 包
-   使用 Proxy 实现基础响应式
-   惰性处理嵌套对象
-   更简洁的 API 设计

## 总结

从 Object.defineProperty 到 Proxy 的转变，不仅是 API 的升级，更是前端框架设计理念的进步。Vue 3 的响应式系统通过 Proxy 实现了更高效、更全面的数据监听

