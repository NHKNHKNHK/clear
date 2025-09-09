# Context【跨组件通信方式】

## 如何使用Context

- 1、`createContext`方法创建一个上下文对象
- 2、在顶层组件 通过`Provider`组件提供数据
- 3、在底层组件中，消费数据
  - 方式一：`static contextType = XxxContext`（仅适用于类组件）
  - 方式二：`Consumer`组件消费数据（适用于函数式组件、类组件）
  - 方式三：`useContext(XxxContext)`（仅适用于函数组件）

### 创建上下文对象

```jsx
// 1.createContext方法创建一个上下文对象
const SchoolInfoContext = React.createContext()

export default class A extends Component {

  state = { school: '清华大学', address: '北京' }

  render() {
    return (
      <div id="a">
        ...
        {/* 2.顶层组件 通过Provider组件提供数据 */}
        <SchoolInfoContext.Provider value={{ ...this.state }}>
          <B />
        </SchoolInfoContext.Provider>
      </div>
    )
  }
}

class B extends Component {

  render() {
    console.log('B', this)
    const { school, address } = this.context
    return (
      <div id="b">
        <h2>我是B组件</h2>
        <C />
      </div>
    )
  }
}
```

### 底层组件中消费数据

:::tip 说明
- 可以在子组件中通过context接收父组件传递的数据，但没必要，直接props即可
- context更多是用于跨层级传递数据（祖 ==> 孙）
:::


#### 方式一：`static contextType = XxxContext`（仅适用于类组件）

```jsx
// 3.底层组件中，消费数据
// 类组件中使用static contextType = XxxContext
class C extends Component {

  // 3.声明接收的context对象
  static contextType = SchoolInfoContext
  render() {
    const { school, address } = this.context
    return (
      <div id="c">
        <h2>我是C组件</h2>
        <h2>从A组件中接收到的学校信息，学校：{school}，地址：{address}</h2>
      </div>
    )
  }
}
```

#### 方式二：`Consumer`组件消费数据（适用于函数式组件、类组件）

```jsx
// 函数式组件、类组件中使用Consumer组件消费数据
function C() {
  return (
    <div id="c">
      {/* 
        3.声明接收的context对象
        通过 <xxxContext.Consumer> 消费数据，此种方法适用于 类组件 和 函数组件
      */}
      <SchoolInfoContext.Consumer>
        {
          // value => { ... } 其中value就是context中的数据
          ({ school, address }) => {
                return (
                  <div id="c">
                    <h2>我是C组件</h2>
                    <h2>从A组件中接收到的学校信息，学校：{school}，地址：{address}</h2>
                  </div>
                )
          } 
        }
      </SchoolInfoContext.Consumer>
    </div>
  )
}
```

#### 方式三：`useContext(XxxContext)`（仅适用于函数组件）

如果消费者是函数式组件，可以使用`useContext(XxxContext)`

```jsx
// 函数组件中使用useContext(XxxContext)
function C() {
  // 3.声明接收的context对象
  // 底层组件中通过 `useContext` 钩子函数获取消费数据 此种方法仅适用于 函数组件
  const schoolInfo = useContext(SchoolInfoContext)

  return (
    <div id="c">
        <h2>我是C组件</h2>
        <h2>从A组件中接收到的学校信息，学校：{school}，地址：{address}</h2>
    </div>
  )
}
```



## 使用Context之前的考虑

在使用 Context 之前，需要明确其适用场景，避免滥用：

- 适用场景：跨多个层级的组件需要共享数据（如主题、用户信息、权限等），避免 "props drilling"（props 层层传递）问题。
- 不适用场景：
  - 仅跨 1-2 层的组件通信（直接用 props 更简单）
  - 频繁变化的数据（可能导致过多组件重渲染）
  - 需要复杂状态逻辑（建议结合 useReducer 或状态管理库）
- 权衡：Context 会使组件复用性降低（依赖特定 Context），且可能增加调试难度（数据流向不如 props 直观）。

## API

### `createContext(defaultValue)`

- 作用：创建一个 Context 对象，用于跨组件共享数据。

- `defaultValue`：仅在组件未被对应 Provider 包裹时生效，且不会因 Provider 的 value 变化而更新。

```jsx
// 当组件没有被Provider包裹时，默认使用"light"
const ThemeContext = React.createContext("light");
```

### `Context.Provider`

- 作用：提供 Context 数据的 "生产者"，所有后代组件可消费其数据。

- 核心属性：value（要共享的数据，可是任意类型）。

- 特点：
  - 一个 Provider 可包裹多个组件，数据会传递给所有后代消费者。
  - 多个 Provider 可嵌套，内层 Provider 会覆盖外层同名 Context 的数据。

```jsx
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>
```

### `Context.Consumer`

- 作用：消费 Context 数据的 "消费者"，适用于**函数组件和类组件**。
- 特点：必须接收一个**函数作为子元素**（"function as child" 模式），该函数的参数为 Context 的 value，返回值为 JSX。

```jsx
<ThemeContext.Consumer>
  {(theme) => <div>当前主题：{theme}</div>}
</ThemeContext.Consumer>
```

### `Class.contextType`

- 作用：类组件专用的 Context 消费方式，将 Context 挂载到类的context属性上。
- 限制：
  - 一个类组件只能关联一个Context。
  - 无法消费多个 Context（需用 Consumer 替代）。

```jsx
class ThemedComponent extends React.Component {
  static contextType = ThemeContext;
  
  render() {
    return <div>主题：{this.context}</div>;
  }
}
```

### `Context.displayName`

- 作用：定义 Context 在 React DevTools 中的显示名称，便于调试。

```jsx
const ThemeContext = React.createContext("light");
ThemeContext.displayName = "ThemeContext"; // DevTools中显示为"ThemeContext"
```

### `useContext`

- 作用：函数组件专用的 Context 消费钩子（React 16.8+），返回 Context 的 value。
- 优势：比 Consumer 更简洁，避免嵌套。
- 注意：调用useContext的组件会在 Context 变化时自动重渲染。

```jsx
function ThemedComponent() {
  const theme = useContext(ThemeContext);
  return <div>主题：{theme}</div>;
}
```

## 动态Context

Context 的值可以动态更新，当 Provider 的value变化时，所有消费该 Context 的组件都会重新渲染（即使父组件未重渲染）。

示例：动态切换主题

```jsx
// 1. 创建Context
const ThemeContext = React.createContext();

// 2. 提供动态数据的Provider组件
function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState("light");

  // 切换主题的方法
  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  // value包含数据和方法
  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. 消费动态Context的组件
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button 
      style={{ background: theme === "light" ? "#fff" : "#333", color: theme === "light" ? "#333" : "#fff" }}
      onClick={toggleTheme}
    >
      当前主题：{theme}（点击切换）
    </button>
  );
}

// 使用
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}
```


## 消费多个Context

组件可以同时消费多个 Context，需注意：

- 多个 Provider 可嵌套，顺序不影响消费。
- 建议将不常变化的 Context 放在外层，减少重渲染影响。

示例：同时消费主题和用户信息

```jsx
// 创建两个Context
const ThemeContext = React.createContext();
const UserContext = React.createContext();

// 提供数据
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <UserContext.Provider value={{ name: "张三" }}>
        <Profile />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// 函数组件消费多个Context（useContext）
function Profile() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  
  return (
    <div style={{ background: theme === "dark" ? "#333" : "#fff" }}>
      <p>用户：{user.name}</p>
      <p>主题：{theme}</p>
    </div>
  );
}

// 类组件消费多个Context（需用Consumer）
class ProfileClass extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <UserContext.Consumer>
            {(user) => (
              <div style={{ background: theme === "dark" ? "#333" : "#fff" }}>
                <p>用户：{user.name}</p>
                <p>主题：{theme}</p>
              </div>
            )}
          </UserContext.Consumer>
        )}
      </ThemeContext.Consumer>
    );
  }
}
```


## 注意事项

- 性能优化：

  - Context 更新会导致所有消费组件重渲染，即使它们只使用了 Context 中的部分数据。可配合React.memo和useMemo优化：

```jsx
// 缓存Context的value，避免每次渲染创建新对象
const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

// 用memo包装消费组件，避免不必要的重渲染
const ThemedButton = React.memo(function ThemedButton() {
  // ...
});
```

- 避免在 Provider 的 value 中创建新对象：

```jsx
// 错误：每次渲染都会创建新对象，导致消费者重渲染
<ThemeContext.Provider value={{ theme: "light" }}>

// 正确：使用稳定的引用
const value = { theme: "light" }; // 或用useMemo缓存
<ThemeContext.Provider value={value}>
```

- defaultValue 的陷阱：
  - 仅当组件没有被 Provider 包裹时，defaultValue 才会生效。
  - 不要依赖 defaultValue 作为初始值（应在 Provider 中显式设置初始值）。

- Context 不是状态管理工具：
  - Context 仅解决 "数据共享" 问题，不处理 "状态逻辑"（如复杂的状态更新）。
  - 复杂场景建议结合useReducer（将 dispatch 放入 Context）或状态管理库（Redux、Zustand 等）。

- 函数组件优先使用 useContext：
  - useContext比 Consumer 更简洁，且避免嵌套地狱。
  - 类组件在需要多个 Context 时，只能使用 Consumer。
