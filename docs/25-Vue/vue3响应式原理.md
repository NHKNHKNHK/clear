# vue3响应式原理

>   想学习vue3的响应式原理的前提：掌握js原型链、vue3中ref、reactive、effect的使用

>   本题要点：代理Proxy

参考：https://juejin.cn/post/7444067625191391284

代理（proxy）是vue3框架中reactive实现响应式的基本原理。

什么是响应式，就是当数据更新的时候页面能够随时做出反应，而不需要刷新。

在vue3中，想要让数据做到这一点，通常使用reactive或ref去实现。那也就是说如果我们能够手写一个reactive或者ref的话，所谓的响应式原理也就不在话下了

所以我们下面手戳一下reactive出来

这里先看一下vue3中的响应式是如何使用的

```vue
<template>
  <div>
    <p>{{ state.count }}</p>
    <button @click="() => state.count++">add</button>
  </div>
</template>
<script setup>
import { reactive, watch } from "vue";

const state = reactive({
  count: 0,
});
</script>
```

在这段代码中，state就是一个响应式的对象，其中的count作为state的一个键值对，自然也有响应式的特性。当我们点击button的时候，count不仅会自增，同时还会刷新页面显示的数据。

**数据响应式**

1、**类型判断**

下面我们自定义了一个reactive函数。

既然前面也提到过大多数人都是通过reactive去将引用类型的值转为响应式，那么这里的第一步自然就是进行类型判断，如果不是引用类型的话直接返回原值，也没必要进行下一步了。

```js
export function reactive(target) {
  //   判断是否是引用类型，源码也是这么用的，若为原始类型，则直接返回
  if (typeof target !== "object" || target === null) {
    return target;
  }
 }
```

2、**防止重复代理**

接下来，还有一个大家可能不会特别在意的地方，那就是重复代理的行为，例如：

```vue
<script setup>
import { reactive, watch } from "vue";

const state = reactive({
  count: 0
})
const state = reactive({
  count: 0
})
</script>
```

正常人肯定不会这样子写代码，并且你这样子写vscode也会给你提示错误。

但就像上面的类型判断，本着“防呆”的设计理念，我们同样要处理这种行为。

我们可以创建一个对象，把对象名作为键，true作为值，然后一旦被代理就将这个键值对存进对象，实不相瞒，我最开始就是这么想的。

但是这样一来会存在三个很大的问题

-   1、首先对象里面查找键值对是一种非常消耗性能的行为（如果你了解for-in和for-of区别这一点很容易理解）
-   2、其次，一旦创建对象，那么就会一直存在，哪怕我们的代码从始至终都没有用到过这个对象。（作为一个框架的设计者，我们是要为了每一丁点的内存做考虑的）
-   3、最后，一旦我们真的遇到了重复代理的问题，我们怎么拿到被代理过的对象，因为很明显的一点就是响应式对象和源对象不是同一个东西，我们不能把源对象当做响应式对象返回，而是要返回代理过的对象。

所以，这里最好的解决方法还是用**weakmap**去储存被代理过的对象，因为一旦weakmap没有被用到，那么整个weakmap都会被垃圾回收机制处理掉，不仅降低了内存占用，同时作为map类型的值，查找起来也是非常快捷的，可以说是两全其美了。

不仅如此，weakmap和map类型的值一样，都能够把对象作为键名。这样一来刚刚提到的三个问题就通通迎刃而解了。最后，整理一下，将创建响应式的部分单拎出去写。

代码如下：

```js
import { mutableHandlers } from "./baseHandle.js";

// 用weakMap 存储已经被代理的对象
const reactiveMap = new WeakMap();

export function reactive(target) {
  //   判断是否是引用类型，源码也是这么用的，若为原始类型，则直接返回
  if (typeof target !== "object" || target === null) {
    return target;
  }
  //该对象是否已经被代理，如果是则不重复代理行为
  if (reactiveMap.has(target)) {
    return reactiveMap.get(target);
  }
  //该对象未被代理，则先代理随后存入weakmap
  // 将target 转为响应式对象
  return createReactiveObject(target, reactiveMap, mutableHandlers);
}
```

3、**响应式数据**

前面铺垫了这么多，终于到了最重要的时刻。接下来的目标就很明确了，只需要把createReactiveObject函数写出来就ok。

这就不得不回到我们刚刚讲到的proxy了。可以看到，在官方文档中，proxy可以接受两个参数，分别是被代理的对象和代理的方法。而在代理的方法中有足足13种。

同时，文档中也明确提出了proxy只能代理引用类型的值，这也就回答了我们最开始提到的问题——“为什么不能单用一个reactive”。考虑到代理函数可能会有很多，所以我们将代理方法再次拎出去写

首先来一个最简单也是最常用的“查”，文档中也写明了，get接受三个参数，第一个是源对象，第二个是对象的键名，第三个的作用我们待会再说。

首先我们需要知道的是一旦对象被proxy代理成响应式对象，那么只要对数据进行了操作而代理方法中有对应的函数，那就一定会被触发。
例如，我们就写一个最简单的console.log

```js
function createrGetter() {
  return function get(target, key, receive) {
    // target是被代理的对象，key是访问的属性，receive是proxy对象
    console.log("target has been checked");
   return "对不起，你是个好人"
  };
}
```

不过绝大多数情况下，我们还是会返回原本的值的。

因此代码如下：

```js
function createrGetter() {
  return function get(target, key, receive) {
    // target是被代理的对象，key是访问的属性，receive是proxy对象
    console.log("target has been checked");
    return "对不起，你是个好人"
  };
}
```

这样一来，关于“查”我们就能够明白了。同理，写一个“改”不过就是照猫画虎。区别在于“改”接受四个参数，多出来的那个是修改的值。

```js
function createrSetter() {
  return function set(target, key, vaule, receive) {
    // target是被代理的对象，key是访问的属性， value就是修改的值,receive是proxy对象
     console.log("target has been set,the " + key + " is" + value);
    target[key] = value;
    const res = Reflect.set(target, key, value, receive);
    return res;
  };
}
```

在这里，可能发现我返回的res不是常用的读值方法，而是用了一个Reflect。

其实这个东西和对象是一模一样的，和proxy一同被打造出来，目的在于解决一些对象方法的不足之处

这样，之前的createReactiveObject就能写出来了

```js
function createReactiveObject(target, proxyMap, proxyHandlers) {
  //第二个参数的作用就是当target被增删改查或者判断时会触发的函数
  const proxy = new Proxy(target, proxyHandlers);
  //此时proxy就是被代理的对象，将其存入weakmap
  proxyMap.set(target, proxy);

  return proxy;
}


```

如此一来，当我再次点击button的时候，就能看到count变化了，这可以说十分有趣，更有趣的是，浏览器显示的count稳如老狗，完全不鸟你点到飞起的鼠标。这就涉及到响应式的第二个关键点——更新显示。

4、**依赖收集和触发**

在谈及更新视图之前，我们还需要仔细聊聊非常重要的一个问题——依赖收集和触发。什么叫依赖呢，我们来看看下面这段代码

```vue
<template>
  <div>
    <p>{{ state.count }}</p>
    <p>{{ num }}</p>
    <button @click="() => state.count++">add</button>
  </div>
</template>

<script setup>
// import { reactive } from "./reactivity/reactive.js";
import { reactive, watch, computed } from "vue";

const state = reactive({
  count: 0,
});

const num = computed(() => state.count * 2);

watch(
  () => state.count,
  (newValue, oldValue) => {
    console.log("watch", newValue, oldValue);
  });
</script>

```

很显然，我们点击button之后虽然只会导致count的值发生变更，但是num也会随之变化并且刷新视图，并且watch中的打印也需要执行，就像是多米诺骨牌，那么在我们return res之前，需要触发被修改属性的每一个副作用函数，这就叫依赖触发，而在这之前，当然得记录下来我们修改的值还在哪些地方被用到了，这一过程就是依赖收集。

在上面的代码中，无论是computed还是watch，其中的函数都是依赖函数，而关键的相同点都在于读取了state.count的值，这样一来我们只需要在get函数中做一些处理就能够很好地去收集state.count的依赖函数了。

**依赖收集**

首先定义两个变量，targetMap用于存储每个变量以及所拥有的副作用函数，而activeEffect则是具体的副作用函数，初始值为null

```js
const targetMap = new WeakMap();
let activeEffect = null;//得是一个副作用函数
```

接下来就是看某个键值对是否被读取从而绑定了某个副作用函数，如果有的话就存入targetMap，我们可以用一个名为track的函数做到这一点

```js
export function track(target, key) {
  // 判断target是否收集过该属性
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    // 初次读取到值，新建map存入targetMap
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let deps = depsMap.get(key)

  if (!deps) {
    // 该属性没做过依赖收集
    // 设置为set避免重复收集
    deps = new Set()
  }

  if (!deps.has(activeEffect) && activeEffect) {
    // 存入一个effect函数
    deps.add(activeEffect)
  }
  depsMap.set(key, deps)
}
```

首先我们需要清楚地知道是哪个对象的哪个键被读取，所以二者需要作为形参传入。

接下来声明depsMap，并尝试从targetMap中找到目前读取的键的值，如果depsMap存在的话
的话就说明target收集过依赖，就可以在对应的值中直接存入目前键的依赖，如果没有的话就需要新建一个map类型的值并存入targetMap。

随后声明deps并尝试赋值为depsMap中key对应的值。这里和上一步的逻辑基本相同，如果deps存在的话就说明targ[key]已经收集过依赖函数了，如果不存在，就新建set类型，作为targ[key]的值存入。这里之所以用set类型，就是set类型的元素都是唯一的，这就可以再次避免重复收集依赖函数吗，并且set类型不论是读取还是写入都更高效。

这样一来，track的任务就完成了，其目的就在于将响应式对象的键值对所有的依赖函数收集起来，等待这个键值对被触发的时候，再去一一触发里面的依赖函数。为了避免各位看官老爷被一堆deps，又是weakMap又是map又是set绕晕了，下面是整个depsMap的结构示意图

```
targetMap:
  state -> {
    count -> [effect1, effect2]
    name -> []
  }
```

既然收集好了所有的依赖函数，那么就等着触发了。什么时候触发？相信各位已经有了很明确的答案了：set。那么接下来我们再定义一个名为trigger的函数，用于触发一个键值对身上所有的依赖函数

```js
export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const deps = depsMap.get(key)

  if (!deps) return

  deps.forEach(effect => {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect()
    }
  })
}
```

和track一样，都需要将具体的对象和键名传入，确保我们不会乱触发。接下来，在targetMap中查找有没有target对象所对应的值，有的话就说明这个对象做过依赖收集，没有的话就可以直接寄了

当然，只是对象做过还完全不够，当我们能读到target对象所对应的值（注意是一个map类型）之后，应该再去看看键是否也存在对应的值，没有的话同样是GG，如果有的话那就好办了，通过forEach循环一遍，统统调用掉就好了。但是各位可以看到我在这里“画蛇添足”地去额外使用了一个名为effect的函数。这里给大家简单讲讲effect这个东西

>   effect是在vue3中允许使用的一个函数，他接收两个参数，第一个是回调函数，第二个是对象，对象中有两个键，分别为lazy，值为true或false。还有一个为scheduler，值为函数，而这个参数就是调度函数，当lazy为false的时候，回调函数会在vue实例创建的时候就被触发，否则只有在对应的值发生修改才会触发。而调度函数一旦被执行，则回调函数不会再被触发。

```vue
<template>
  <div>
    <p>{{ obj.age }}</p>
    <p>{{ obj.name }}</p>
    <button @click="() => obj.age++">add</button>
    <button @click="() => obj.sex = '女'">change sex</button>
  </div>
</template>

<script setup>
import { reactive, watchEffect, computed, effect, watch, ref } from 'vue'
// import { reactive } from './reactivity/reactive';

const obj = reactive({
  name: "zhangsan",
  age: 18,
  sex: "男"
})

function foo() {
  console.log('this is foo');
  console.log("scheduler");

}
effect(() => {
  console.log(obj.age);
},
  {
    lazy: true,
    scheduler: foo
    //调度函数，一旦生效，则副作用函数不再执行

  })

</script>
```

这里我将lazy设置为true，说明不会再创建vue实例就被触发，而effect中输出了obj.age，也就是说我点击change sex按钮的时候，是不会打印任何东西的

通常，effect有以下几个用处

-   视图更新：当响应式数据变化时，自动更新视图。
-   计算属性：基于响应式数据计算派生数据。
-   副作用管理：处理副作用操作，如网络请求、日志记录等。

所以我们才会大费周章介绍effect，目的就在于视图更新，以及检查是否有调度函数需要处理

```js
export function effect(fn, options = {}) {
  const effectFn = () => {
    try {
      activeEffect = effectFn
      return fn()
    } finally {
      activeEffect = null
    }
  }
  if (!options.lazy) {
    effectFn()
  }

  effectFn.scheduler = options.scheduler

  return effectFn
}
```

effect 函数接受一个函数 fn 和一个可选的对象 options 作为参数。这个函数的作用是包装传入的副作用函数，并返回一个新的函数 effectFn。

在 effectFn 内部，activeEffect 被设置为当前的 effectFn，这样在 track 函数被调用时，就知道哪个副作用函数正在执行。然后执行传入的副作用函数 fn 并返回其结果。

如果 options.lazy 不为真，则立即执行副作用函数并返回结果。否则，只返回 effectFn 本身而不立即执行，这意味着用户需要显式地调用返回的函数来触发副作用。

最后，再回到刚刚的trigger函数中。这就解释了为什么不能直接调用掉set中的所有函数，而是要检查调度函数，最后再去执行effect函数。

ref

在讲明白ref将数据变为响应式原理之前，我们先看看在vue中他是如何使用的

```js
<template>
  <div> </div>
</template>

<script setup>
const name = '浦东彭于晏'
const refName = ref(name)
const obj = {
  name: '南昌吴彦祖',
  age: 22
}
const refObj = ref(obj)
console.log(refName);
console.log(refObj);

</script>
```

在代码中我们可以看到，如果我们试图将包装过后的数据直接拿来使用

运行代码，在浏览器控制台可以发现

不管原来的数据是引用类型还是原始类型，我们能拿到的并不是原数据，而是被包裹了一层奇奇怪怪的东西，只有在后面接上.value之后才能拿到“原来的”数据。

如果我们展开这个“奇奇怪怪”的东西，会发现上面除了我们给的数据，还有一个名为__v_isRef和_rawValue的键值对，_rawValue很好理解，就是被加工前的数据，而__v_isRef正是ref响应式的标签。代表这个值已经是响应式了。

**原始类型**

在大致了解的ref的用法之后，我们就可以开始聊聊ref的响应式原理了

我们通过手写一个ref函数的方式，来更清楚的了解vue框架底层是如何实现的

```js
function createRef(value) {
 }
```

 刚刚也提到__v_isRef是ref响应式的标签，而在reactive中我们也讲到过关于避免重复代理的问题。所以这里我们就可以用__v_isRef去做一个判断

```js
function createRef(value) {
    // 将value变为响应式，同样需要判断是否已经是响应式数据
    if (value.__v_isRef) {
        return value
    }

    return new RefImpl(value)
}
```

RefImpl相信大家也能看出来，首字母大写是一个构造函数。在构造的过程中，首先就是打上__v_isRef的标签用于声明这个值已经是响应式了。随后就是_value赋值。这也正是为什么我们需要通过._value才能看到数据。

```js
class RefImpl {
    constructor(val) {
        // 响应标记，有标记的就是响应式数据
        this.__v_isRef = true
        this._value = convert(val)
    }
}
```

**新语法**

接下来的新语法是讲原始类型的值转变为响应式的关键点了。之前我们讲reactive的时候聊到了引用类型是通过proxy代理去做响应式，这里则是用class语法中的“访问器属性”去给原始类型做响应式

首先我们要知道，写在constructor外面的属性是在实例对象的隐式原型上

```js
class RefImpl {
    constructor(val) {
        // 响应标记，有标记的就是响应式数据
        this.__v_isRef = true
        this._value = convert(val)
    }

    // 这一步是在构造函数的现实原型，也就是实例对象的隐式原型上
    get value() {
       
    }

    set value(newValue) {
       
        }
    }
}
```

这里在函数前面加get的行为属于是在使用js中对象的自读取能力，这种行为就类似下面这种代码

```js
let obj = {
    name: 'zhangsan',
    age() {
        return 18;
    },
}

console.log(obj.age());
```

在很多框架中，加“_”的目的则在于将属性标记为内部使用，避免在实例化对象的时候，属性因为没有setter而导致的程序报错。

如此一来，当我们再次访问或读取这个值的时候，就能像被代理过的函数那样触发某些特定需求了。

接下来的事情，各位看过上一篇文章的读者姥爷想必已经门清了，就是在get中做依赖收集以及在set中去触发依赖函数。而之前的依赖收集函数可以直接复用。在set中，当值被修改，我们可以通过对比修改前后的值是否一致，从而选择是否修改。

```js
import { track, trigger } from "./effect.js"

class RefImpl {
    constructor(val) {
        // 响应标记，有标记的就是响应式数据
        this.__v_isRef = true
        this._value = val
    }

    // 这一步是在构造函数的现实原型，也就是实例对象的隐式原型上
    get value() {
        // 为this对象做依赖收集
        track(this, 'value')
        return this._value
    }

    set value(newValue) {
        console.log("set" + newValue);

        // 判断是否相等，相等则不触发更新
        if (newValue !== this._value) {
            // 这里不能直接复制，要看类型
            this._value = val
            // 为this对象做依赖触发
            trigger(this, 'value')
        }
    }
}
```

到这一步，ref中将原始类型变为响应式对象就完成了。但问题在于，如何通过ref将引用类型变为响应式呢？实际上，还是通过我们上次讲的reactive。这里我们优化一下代码，做一个类型判断。如果是原始类型则直接返回，否则返回reactive处理过后的对象。

```js
import { track, trigger } from "./effect.js"
import { reactive } from './reactive.js'

class RefImpl {
    constructor(val) {
        // 响应标记，有标记的就是响应式数据
        this.__v_isRef = true
        this._value = convert(val)
    }

    // 这一步是在构造函数的现实原型，也就是实例对象的隐式原型上
    get value() {
        // 为this对象做依赖收集
        track(this, 'value')
        return this._value
    }

    set value(newValue) {
        console.log("set" + newValue);

        // 判断是否相等，相等则不触发更新
        if (newValue !== this._value) {
            // 这里不能直接复制，要看类型
            this._value = convert(newValue)
            // 为this对象做依赖触发
            trigger(this, 'value')
        }
    }
}

function convert(value) {
    if (typeof value !== 'object' || value === null) {
        // 不是对象，就return value
        return value
    } else {
        return reactive(value)
    }
}
```

**总结**

其实对于vue3中到底该使用ref还是reactive一直都存在一些争议，有人偏爱reactive的简洁，不用挂个.value的拖油瓶让人神清气爽，写代码都有动力不少，而有人偏爱ref的全能，通篇都是ref。实际上对于二者来说，尤大大的建议是ref，而reactive的出现在我看来更像是一种“被迫无奈”的举动。而在实际开发中，具体使用ref还是reactive属于是个见仁见智的问题，至少在我的开发过程中，统一使用ref的情况占绝大多数。

