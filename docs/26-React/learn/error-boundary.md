# 错误边界（组件）

在 React 中，错误边界（Error Boundary）是一种特殊的组件，用于捕获并处理其子组件树中发生的 JavaScript 错误，防止错误扩散导致整个应用崩溃，同时可以展示友好的错误提示 UI。

> 个人理解是类似于微服务中的降级策略，该错误边界会捕获错误，并渲染一个降级 UI，而不是渲染子组件的 crashed 状态。

## 错误边界的核心作用

- 捕获子组件渲染、生命周期方法、构造函数中产生的同步错误
- 记录错误信息（如发送到日志服务）
- 显示备用 UI 替代崩溃的组件树

## 实现原理

错误边界通过两个特殊的 React 生命周期方法实现错误处理：

- `static getDerivedStateFromError(error)`：静态方法，用于在发生错误后更新组件状态，返回新的状态对象以触发备用 UI 渲染

- `componentDidCatch(error, errorInfo)`：实例方法，用于记录错误信息（如日志上报，因为用户一旦在客户端关闭浏览器，我们无法知道错误）

:::warning 注意

错误边界无法捕获以下场景中产生的错误：

- 事件处理（需自行 try/catch）
- 异步代码（如 `setTimeout` 、`Promise` 或 `requestAnimationFrame` 回调函数）
- 服务端渲染
- 错误边界组件自身抛出的错误

:::

## 示例

错误边界组件

```jsx
/**
 * 错误边界组件（通用组件）
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    // 初始化状态，默认无错误
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  // 静态方法：捕获错误后更新状态
  static getDerivedStateFromError(error) {
    // 更新状态，下一次渲染将显示降级后的UI
    return { hasError: true, error }
  }

  // 实例方法：记录错误信息，比如发送到服务器等操作
  componentDidCatch(error, errorInfo) {
    // 可以将错误发送到日志服务
    console.error('错误边界捕获到错误:', error, errorInfo)
    // 保存错误详情
    this.setState({ errorInfo })
  }

  // 重置错误状态的方法
  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  };

  render() {
    // 如果有错误，显示备用UI
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>发生了错误</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.resetError}>尝试恢复</button>

        </div>
      )
    }

    // 无错误时，渲染子组件
    return this.props.children
  }
}

export default ErrorBoundary
```

使用错误边界组件包裹可能发生错误的子组件

```jsx
function App() {

  return (
    <div>
      <h1>我的应用</h1>
      {/* 包裹可能出错的组件 */}
      <ErrorBoundary>
        <RiskyComponent></RiskyComponent> {/* 这个组件可能会抛出错误 */}
      </ErrorBoundary>

      {/* 其他不受影响的组件 */}
      <div>错误后面的其他组件</div>
    </div>
  )
}

export default App
```

也可以自定义错误提示 UI

```jsx
function App() {

  return (
    <div>
      <h1>我的应用</h1>
      {/* 包裹可能出错的组件 */}
      <ErrorBoundary fallback={
        <div>
          <h3>抱歉，这里出了点问题</h3>
          <button onClick={() => window.location.reload()}>刷新页面</button>
        </div>
      }>
        <RiskyComponent></RiskyComponent> {/* 这个组件可能会抛出错误 */}
      </ErrorBoundary>

      {/* 其他不受影响的组件 */}
      <div>错误后面的其他组件</div>
    </div>
  )
}

export default App
```
