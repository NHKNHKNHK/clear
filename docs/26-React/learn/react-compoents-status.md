# 无状态组件与有状态组件

:::tip

无状态组件又称为简单组件

有状态的组件又称为复杂组件

:::

## 无状态组件（函数式组件）

定义函数式组件

- 1、定义一个构造函数，并且定义返回值
- 2、这个函数的返回值就会被渲染为一个 React 元素

React 组件是常规的 JavaScript 函数，但 组件的名称必须以大写字母开头，否则它们将无法运行！


```html
<div id="root"></div>

<!-- 引入react核心库 -->
<script src="https://unpkg.com/react@16.8.0/umd/react.development.js"></script>
<!-- 引入react-dom，用于支持react操作dom -->
<script src="https://unpkg.com/react-dom@16.8.0/umd/react-dom.development.js"></script>
<!-- 引入babel，用于将jsx转为js -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<script type="text/babel"> 
  // 1.创建函数式组件
  /* 
    1.React组件其实是 返回标签的js函数
    2.React 组件必须以大写字母开头
  */
  function MyButton(){
    console.log(this) // 此处this为undefined，因为babel编译后，默认开启严格模式
    return (
      <div>
        <h2>这是一个函数式组件（适用于【简单组件】的定义）</h2>
        <button>按钮</button>
      </div>
    )
  }

  // 2.渲染组件到页面
  // ReactDOM.render(MyButton,document.getElementById('root')) // 报错，MyButton仅仅是函数名
  // ReactDOM.render(MyButton(),document.getElementById('root'))
  // ReactDOM.render(mybutton,document.getElementById('root')) //  React 组件必须以大写字母开头
  ReactDOM.render(<MyButton/>,document.getElementById('root'))

</script>
```

**ReactDOM.render函数说明**

执行了`ReactDOM.render(<MyButton/>,document.getElementById('root'))` 之后发生了什么？

1.React解析组件标签，找到了MyButton组件

2.发现组件是使用【函数】定义的，随后调用函数，将返回的虚拟DOM转为真实DOM，并插入到页面中

:::warning

函数式组件中this默认`undefined`。因此函数组件不能使用this的三大属性：state、props、refs

但是函数组件中可以使用props（通过参数形式传入）

react 16.8 之后，函数式组件中可以使用useState、useRef、useEffect等hook，使得函数式组件也能使用三大属性

- useState == state
- useRef == refs
- useEffect 模拟类组件的生命周期

:::

## 有状态组件（类式组件）

定义类式组件：[【参考】](https://react.docschina.org/reference/react/Component#defining-a-class-component)

- 1、定义组件首先要继承(extends)自 `React.Component`
- 2、Class 组件必须有一个`render()`函数，它的返回值会被渲染为一个 React 元素

```html
<div id="root"></div>

<!-- 引入react核心库 -->
<script src="https://unpkg.com/react@16.8.0/umd/react.development.js"></script>
<!-- 引入react-dom，用于支持react操作dom -->
<script src="https://unpkg.com/react-dom@16.8.0/umd/react-dom.development.js"></script>
<!-- 引入babel，用于将jsx转为js -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<script type="text/babel">
  // 1.创建类式组件
  class MyButton extends React.Component {
    // render方法是放在哪里？MyButton的原型对象上，供实例使用
    // render方法中的this 指向的是该MyButton类的实例对象|MyButton组件的实例对象
    render(){
      console.log(this)
      return (
        <div>
        <h2>这是一个类式组件（适用于【复杂组件|有状态的组件】的定义）</h2>
        <button>按钮</button>
      </div>
      )
    }
  }

  // 2.渲染组件到页面
  ReactDOM.render(<MyButton/>,document.getElementById('root'))

  /* 
    执行了 ReactDOM.render(<MyButton/>,document.getElementById('root')) 之后发生了什么？
      1.React解析组件标签，找到了MyButton组件
      2.发现组件是使用【类】定义的，随后new出来该类的实例，并通过该实例调用原型上的render方法
      3.将render返回的虚拟DOM转为真实DOM，并插入到页面中
  */
</script>
```

**ReactDOM.render函数说明**

执行了`ReactDOM.render(<MyButton/>,document.getElementById('root'))` 之后发生了什么？

- 1.React解析组件标签，找到了MyButton组件

- 2.发现组件是使用【类】定义的，随后new出来该类的实例，并通过该实例调用原型上的render方法

- 3.将render返回的虚拟DOM转为真实DOM，并插入到页面中

:::tip

类式组件this指向

- 构造器中的this指向的是该组件的`实例对象`
- render中的this指向的是该组件的`实例对象`
  - （由React维护，当我们编写如`<MyButton/>`标签时，底层大致会如const b1 = new MyButton(); b1.render()）
- 其他方法的this为`undefined`

:::

:::warning

类式组件内部不支持 Hook 函数（以 use 开头的函数，例如 useState）

Component是一个js类，是React组件的基类，类式组件仍然被 React 支持

但React18建议使用函数式组件，而不是类式组件

:::
