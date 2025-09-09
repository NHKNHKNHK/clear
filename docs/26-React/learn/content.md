# Context【跨组件通信方式】

## 如何使用Context

- 1、`createContext`方法创建一个上下文对象
- 2、在顶层组件 通过`Provider`组件提供数据
- 3、在底层组件中，消费数据
  - 方式一：`static contextType = XxxContext`（仅适用于类组件）
  - 方式二：`Consumer`组件消费数据（适用于函数式组件、类组件）
  - 方式三：`useContext(XxxContext)`（仅适用于函数组件）

示例

```jsx
// 1.createContext方法创建一个上下文对象
const SchoolInfoContext = React.createContext()

// 2.顶层组件 通过Provider组件提供数据
export default class A extends Component {

  state = { school: '清华大学', address: '北京' }

  render() {
    return (
      <div id="a">
        ...
        <SchoolInfoContext.Provider value={{ ...this.state }}>
          <B />
        </SchoolInfoContext.Provider>
      </div>
    )
  }
}


// 3.底层组件中，消费数据
// 类组件中使用static contextType = XxxContext
class C extends Component {

  // 3.声明接收的context对象
  static contextType = SchoolInfoContext
  render() {
    const { school, address } = this.context
    return (
      <div id="c">
        ...
      </div>
    )
  }
}
// 函数式组件、类组件中使用Consumer组件消费数据
function C() {
  return (
    <div id="c">
      {/* 3.声明接收的context对象
        通过 <xxxContext.Consumer> 消费数据，此种方法适用于 类组件 和 函数组件
      */}
      <SchoolInfoContext.Consumer>
        {
          // value => { ... } 其中value就是context中的数据
          ({ school, address }) => {
            return ...
          } 
        }
      </SchoolInfoContext.Consumer>
    </div>
  )
}
// 函数组件中使用useContext(XxxContext)
function C() {
  // 3.声明接收的context对象
  // 底层组件中通过 `useContext` 钩子函数获取消费数据 此种方法仅适用于 函数组件
  const schoolInfo = useContext(SchoolInfoContext)

  return (
    <div id="c">
      ...
    </div>
  )
}
```

## 使用Context之前的考虑

## API

## Class.contextType

## Content.Consumer


## Context.displayName

## useContext

## 动态Context


## 消费多个Context


## 注意事项


