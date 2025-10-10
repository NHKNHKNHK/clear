# Webpack 的五大核心概念

> 参考：[一文带你读懂webpack的知识和原理，附带常见面试题！](https://juejin.cn/post/7138203576098095112?searchId=20250416172453F3A291C0E6C614446328)

## **口语化**

webpack的核心概念包括入口（entry）、输出（output）、loader、插件（plugins）和模式（mode）。一些其他版本的说法还有模块（module）或者解析（resolve），但通常官方文档里列出的是entry、output、loader、plugins、mode这五个。

## 入口（Entry）

定义 Webpack 构建的起点，Webpack 从入口文件开始递归解析依赖关系，生成依赖图（Dependency Graph）。

> Webpack 它会以一个或多个文件作为打包的入口，将我们整个项目所有文件编译成一个或多个文件输出出去。

```js
module.exports = {
  entry: './src/index.js', // 单入口（SPA）

  // 多入口（MPA）
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  }
};
```

关键点：

-   单入口适用于单页应用（SPA），多入口适用于多页应用（MPA）。
-   入口文件通常是项目的“主文件”（如 `index.js`），引入其他模块和资源

## 输出（Output）

定义打包后的文件输出位置和命名规则。

```js
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: '[name].[contenthash].js', // 输出文件名（支持占位符）
    clean: true // 自动清理旧文件（Webpack 5+）
  }
};
```

关键点：

-   `[name]` 表示入口名称（如多入口的 `app` 或 `admin`）。
-   `[contenthash]` 根据文件内容生成哈希，用于缓存优化。
-   `path` 必须使用绝对路径（通过 `path.resolve` 处理）

## 加载器（Loader）

webpack本身功能比较少，只能处理js、json资源（这是 webpack 开箱可用的自带能力），一旦遇到css等资源就会报错

**loader** 让 webpack 能够去处理其他类型的文件，（如 CSS、图片、字体等），将其转换为 Webpack 能处理的模块。

```js
module.exports = {
  module: {
    rules: [
      // 处理 CSS 文件
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'] // 从右到左执行
      },
      // 处理图片
      {
        test: /\.(png|svg|jpg)$/,
        type: 'asset/resource' // Webpack 5 内置资源模块
      }
    ]
  }
};
```

常见 Loader：

-   `babel-loader`：转译 ES6+ 语法。
-   `css-loader`：解析 CSS 的 `@import` 和 `url()`。
-   `style-loader`：将 CSS 注入 DOM。
-   `file-loader`/`url-loader`：处理文件资源（Webpack 5 推荐使用 `asset/resource`）。

## 插件（Plugins）

扩展webpack的功能，执行更广泛的任务，如打包优化、资源管理、环境变量注入等

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html' // 自动生成 HTML 并注入打包后的脚本
    }),
    new CleanWebpackPlugin() // 清理输出目录
  ]
};
```

常用插件：

-   `HtmlWebpackPlugin`：生成 HTML 文件。
-   `MiniCssExtractPlugin`：提取 CSS 为独立文件。
-   `DefinePlugin`：定义全局常量（如 `process.env.NODE_ENV`）。
-   `BundleAnalyzerPlugin`：分析打包体积。

## 模式（Mode）

作用：设置 Webpack 的构建模式（开发或生产），启用内置优化策略。

```js
module.exports = {
  mode: 'development', // 或 'production'、'none'
};
```

模式差异：

| 模式          | 特点                                              |
| :------------ | :------------------------------------------------ |
| `development` | 启用 SourceMap、不压缩代码、保留调试信息。        |
| `production`  | 自动压缩代码、优化 Tree Shaking、移除未使用代码。 |
| `none`        | 无默认优化，需手动配置。                          |

## 总结

-   **Entry**：从哪里开始打包。
-   **Output**：打包结果放在哪里。
-   **Loader**：处理非 JS 文件。
-   **Plugins**：扩展 Webpack 功能。
-   **Mode**：优化策略的开关
