# 组件实例的三大核心属性
- 三大核心属性：props、state、refs

- 三大核心属性都只有类式组件才有，函数式组件没有，因为函数式组件this指向undefined

- 因为babel编译后，默认开启严格模式，所有函数式组件this指向undefined

- 函数式组件没有this，所以无法使用this.props、this.state、this.refs
   - 函数式组件可以通过接收参数的方式接收props，但是无法使用this.props
- 但是react引入了Hooks，函数式组件可以使用Hooks的方式使用三大核心属性。如：useState

## state
### 理解
- state是组件对象最重要的属性，值是对象（可以定义多组k-v）
- 组件被称为“状态机”，通过更新组件的state来更新对应的页面（重新渲染组件）
### 强烈注意！！！
- （类）组件中render方法的this指向的是组件实例对象
- （类）组件中自定义的方法的this指向的undefined
  - 可以通过bind，改变this指向
  - 或者使用箭头函数
- 数据状态state，不能直接修改或更新，必须使用setState方法更新

## props

- 读取某个属性值

```js
this.props.属性名
```

- 对props中的属性值进行类型限制和必要性限制

第一种方式（React v15.5开始已弃用）

```js
Person.propTypes = {
  name: React.PropTypes.string.isRequired,
  age: React.PropTypes.number
}
```

第二种方式（使用prop-types库进行限制，需要引入）

```js
Person.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number
}
```

- 扩展属性：将对象中所有的属性通过props传递

``` js
const person = { name: 'zhangsan', age: 18 }

<Person {...person} />
```

- 默认属性值

```js
Proson.defaultProps = { 
  name: 'zhangsan'
  age: 18
}
```

- 类式组件的构造器

```js
constructor(props){   
  super(props)
  // 初始化状态对象
  this.state = {isHot:true, wind:'微风'} // this指向组件实例
  
  this.change = this.changeWeather.bind(this) // 改变changeWeather方法的this指向，并生成一个新方法放在this上
}
```

注意：类式组件的构造器主要就是完成以上两个操作，但是都有替代方案，一般不写构造器

## refs

在 React 中，ref 是一种用于**直接访问 DOM 元素或组件实例**的机制。通常情况下，React 推荐通过状态（`state`）和属性（`props`）实现组件交互，但在某些场景下（如操作 DOM、获取元素尺寸、控制焦点等），需要直接访问底层 DOM 或组件实例，这时就需要用到 `ref`。

**ref 的核心作用**

- 访问 DOM 元素（如输入框、按钮等）的原生属性或方法（如 focus()、scrollIntoView()）。
- 获取自定义组件的实例（仅类组件，函数组件默认无实例）。
- 避免通过 document.getElementById() 等原生 DOM 方法操作 DOM，保持 React 对 DOM 的统一管理。

**创建 ref 的方式**

- 字符串形式的ref（已过时）
- 回调函数形式的ref
- createRef
- useRef（函数式组件）

::: warning
！！！ 切勿过渡使用ref
:::

### 字符串形式的ref <Badge type="danger" text="已过时" />
  
- 1.在jsx中的标签中绑定`ref`属性，可以获取到当前DOM节点
- 2.获取到DOM节点会保存在组件实例的`refs`属性上
- 3.可以通过 this.refs.refName 获取到DOM节点
    
例如：

```jsx
class MyComponent extends React.Component {

  showData1 = () => {
    const { input1 } = this.refs
    alert(input1.value)
  }
  showData2 = () => {
    const { input2 } = this.refs
    alert(input2.value)
  }

  render(){
    return (
      <div>
        {/* 通过字符串形式的ref获取DOM节点，并且以k-v的形式收集到组件实例的refs属性上 */}
        <input ref="input1" type="text" placeholder="点击按钮提示数据"/>
        <button onClick={this.showData1}  className="margin">点击提示输入内容</button>
        <input ref="input2" onBlur={this.showData2} type="text" placeholder="失去焦点提示数据"/>
      </div>
    )
  }
}
```

:::tip 类比
在Vue中也通过`ref`属性获取 DOM节点|组件实例
:::

:::warning
！！！这种方式以过时！！！推荐使用`createRef()`
:::

### 回调函数形式的ref

- 1.在jsx中的标签中绑定`ref`属性，并提供`回调函数`
- 2.react会向回调函数中传入当前的DOM节点
- 3.可以将DOM节点保存在组件实例上

```jsx
class MyComponent extends React.Component {

  showData1 = () => {
    console.log(this)
    alert(this.input1.value)

  }
  showData2 = () => {
    alert(this.input2.value)
  }

  render(){
    return (
      <div>
        {/* 通过ref属性的回调函数形式，获取DOM节点，并且写入到组件实例的input1属性上 */}
        <input ref={(currentNode) => {this.input1 = currentNode}} type="text" placeholder="点击按钮提示数据"/>
        <button onClick={this.showData1}  className="margin">点击提示输入内容</button>
        <input ref={c => this.input2 = c} onBlur={this.showData2} type="text" placeholder="失去焦点提示数据"/>
      </div>
    )
  }
}
```

#### 回调函数形式中回调执行次数

关于回调refs的说明：
- 如果refs回调函数是以内联函数的形式定义，在【更新过程中】它会被执行两次，第一次传入参数null，第二次传入参数DOM节点
- 这是因为在每次渲染时创建一个新的函数实例，所以React清空旧的ref并且设置新的（意思是每次调用render函数时，都会创建新的函数，第一次调用回调函数是为了清空旧的ref）
- 可以通过将ref中的回调函数定义在class中，避免执行两次
    
但是大多情况下它是无关紧要，所以直接写内联回调函数即可

```jsx
class MyComponent extends React.Component {
  state = {count: 0}
  showData1 = () => {
    alert(this.input1.value)
  }

  // 回调函数：为了将input元素保存到this.input1中
  saveInput = (c) => {
    console.log('回调执行', c)
    this.input1 = c
  }
  render(){
    return (
      <div>
        {/* 回调函数以内联函数的形式定义，在更新过程中，会执行两次，第一次传入参数null，第二次传入参数DOM节点 */}
        {/* <input ref={(c) => {console.log('回调执行', c);this.input1 = c}} type="text" placeholder="点击按钮提示数据"/> */}
        
        <input ref={this.saveInput} type="text" placeholder="点击按钮提示数据"/>
        <button onClick={this.showData1}  className="margin">点击提示输入内容</button>
        <h2>count：{this.state.count}</h2>
        <button onClick={() => this.setState({count: this.state.count+1})}>count++以触发更新</button>
      </div>
    )
  }
}
```


### React.createRef()

在类组件中，使用 `React.createRef()` 创建 ref，并通过 `this.refs` 访问（或直接通过实例属性访问）

```jsx
class MyComponent extends React.Component {
  /* 
    React.createRef() 调用后会返回一个容器，该容器可以存储被ref所标识的节点（该容器是“专人专用”，即里面只能存储一个节点）
    可以通过current属性获取到该节点
  */
  input1 = React.createRef()

  focusInput = () => {
    // console.log('this', this.input1.current)
    // 原生DOM聚焦
    this.input1.current.focus()
    
  }
  render(){
    return (
      <div>
        <input ref={this.input1} type="text" />
        <input onClick={this.focusInput} type="button" value="点击聚焦到input输入框"/>
      </div>
    )
  }
}
```


### 函数组件中：useRef

在函数组件中，使用 React 提供的 `useRef` Hook 创建 ref。useRef 返回一个**可变的 ref 对象**，其 `.current` 属性会指向绑定的 DOM 元素或组件实例。

特点：

- ref 对象在组件整个生命周期内保持不变（不会因重渲染而重置）。
- 更新 `.current` 属性不会触发组件重新渲染（与 setState 不同）

```jsx
import { useRef } from 'react';

function InputComponent() {
  // 创建 ref 对象，初始值为 null
  const inputRef = useRef(null);

  const handleFocus = () => {
    // 通过 .current 访问 DOM 元素，调用原生 focus() 方法
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>聚焦输入框</button>
    </div>
  );
}
```

### forwardRef ref转发（高级用法）

:::tip
暴露子组件DOM节点，转发给父组件
:::

当需要将父组件的 ref 传递到子组件内部的 DOM 元素时，需使用 `React.forwardRef` 转发 `ref`（尤其适用于函数组件）。

示例：父组件获取子组件内部的输入框

```jsx
import { useRef, forwardRef } from 'react';

// 子组件：通过 forwardRef 接收父组件传递的 ref
const ChildInput = forwardRef((props, ref) => {
  // 暴露DOM给父组件
  return <input ref={ref} type="text" />;
});

// 父组件
function ParentComponent() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current.focus(); // 聚焦子组件内部的输入框
  };

  return (
    <div>
      <ChildInput ref={inputRef} />
      <button onClick={handleFocus}>聚焦子组件输入框</button>
    </div>
  );
}
```

### useImperativeHandle 暴露组件方法

:::tip
暴露子组件内部方法，如果我们并不想暴露子组件中的DOM而是想暴露子组件内部的方法，可以使用`useImperativeHandle`
:::

默认情况下，`ref` 转发只能获取子组件的 DOM 元素。若需让父组件调用子组件的自定义方法，可结合 `useImperativeHandle` 自定义暴露给父组件的接口。

```jsx
import { useRef, forwardRef, useImperativeHandle } from 'react';

// 子组件
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  // 自定义暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.value = '';
    }
  }));

  return <input ref={inputRef} type="text" />;
});

// 父组件
function Parent() {
  const customInputRef = useRef(null);

  return (
    <div>
      <CustomInput ref={customInputRef} />
      <button onClick={() => customInputRef.current.focus()}>聚焦</button>
      <button onClick={() => customInputRef.current.clear()}>清空</button>
    </div>
  );
}
```
