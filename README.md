# 依赖介绍

## scripts

- "typecheck:ci": "pnpm -r --parallel run typecheck",
  - -r 代表命令将递归地在所有子包中执行
  - --parallel 代表所有子包中的 typecheck 命令将并行执行，而不是依次执行。
- "build:jotai": "rollup -c --package jotai",
  - -c 用来指定 Rollup 打包时所使用的配置文件，默认使用当前目录下名为 rollup.config.js 的文件作为配置文件
  - --package 用来动态控制打包哪个包，在 rollup.config.js 中可以正确根据不同的参数来控制打包哪个包
- "test": "jest --passWithNoTests --config jest.config.ts"
  - --passWithNoTests 避免当没有任何测试项时报错
  - --config 指定 Jest 的配置文件。

## plugins

- rollup-plugin-dts：用于处理 TypeScript 的类型声明文件（\*.d.ts）。
- @rollup/plugin-node-resolve：用于帮助 Rollup 解析第三方模块的导入。在 JavaScript 中，当你使用 import 语句导入模块时，需要一个机制来定位和加载这些模块。
- @rollup/plugin-babel：用于集成 Babel 编译器到 Rollup 打包过程。
- @rollup/plugin-commonjs：主要作用是将 CommonJS 模块转换为 ES6 模块。这个插件对于处理那些以 CommonJS 格式编写的第三方模块（通常是在 Node.js 环境中使用的模块）非常有用。

## babel

- babelrc: false：告诉 Babel 不要使用任何外部的.babelrc配置文件，从而避免配置冲突。
- ignore: ['/node_modules/']：指定了 Babel 应该忽略的文件路径，通常情况下 node_modules 目录包含第三方库，这些库通常已经被编译，不需要 Babel 再次编译。
- presets：Babel 预设的集合，用于告诉 Babel 使用哪些特性。其中：@babel/preset-env 会根据你的目标环境（比如特定版本的浏览器或Node.js）自动决定哪些 JavaScript 新特性需要被转换，哪些可以保留。这意味着它可以避免不必要的转换，使得最终的代码更加精简和高效。
  - loose: true：这个选项会启用“宽松”模式，生成的代码会更简洁、更快
  - modules: false：这个选项阻止 Babel 将 ES6 模块语法转换为其他模块类型（如 CommonJS），这里会交由 Rollup 来处理。
- plugins：定义了一组 Babel 插件，用于转换特定的 JavaScript 特性或语法。其中：
  - @babel/plugin-transform-react-jsx：这个插件用于转换 JSX 语法（通常用于 React）。runtime: 'automatic'选项自动导入必要的 JSX 转换而不需要手动导入 React。
  - @babel/plugin-transform-typescript：这个插件添加了对 TypeScript 的支持。isTSX: true指定插件应该支持 TSX 文件（TypeScript 中的 JSX）。

# package.json介绍

- name 包名，要有唯一性
- private 用来避免包被意外地发布到 npm 公共仓库中，这里在我们 Monorepo 项目根目录下配置避免意外发布：
- version：表示该项目包的版本号，格式为 major.minor.patch，其中：

  - major（主版本号）：做了向后不兼容的 API 更改时，需要增加主版本号。
  - minor（次版本号）：添加了新的功能并且向后兼容，需要增加次版本号。
  - patch（修订号）：做了向后兼容的问题修正时，例如 bug 修复或者小的改进，需要增加修订号。
  - 如果某个版本改动较大，通常会再区分：
    - Alpha（阿尔法）：表示该版本处于早期开发阶段，可能包含尚未完全测试或实现的新功能。Alpha 版本主要用于内部测试。
    - Beta（贝塔）：通常用于更广泛的测试，包括外部开发者和早期采用者。
    - RC（Release Candidate，发行候选）：表示该版本是候选的最终发布版本，通常在此版本之后不会添加新功能，只会修复发现的任何关键错误。

- license：用于指定包的许可证类型，用来告诉别人可以做什么或者不能做什么与你源代码相关的事情。通常开源库所使用的都是 MIT 许可证，MIT 是一种开放源代码许可证，它允许广泛地自由使用、修改和再分发软件，但作者不会对软件的性能、适用性或任何潜在的缺陷提供任何形式的保证或担保，如果软件出现问题或导致损失，作者或分发者不承担任何责任。

- typing（或types）：指定包的主要类型声明文件的位置。
- main：当使用require()在 Node.js 中导入模块时，默认会查找main字段指定的文件。exports 的优先级高于 main。
- exports：在 Node.js 12+ 中被支持作为 main 的替代品，用于更精细地控制模块的导出，可以根据导入环境（如 CommonJS 或 ES 模块环境）提供不同的入口。

```
"exports": {
  ".": {  代表导入包名时采用下面配置来解析
    "import": {  处理 ES 模块的导入，使用 `import` 语法
      "types": "./dist/index.d.ts",  指定了 TypeScript 类型定义文件的位置
      "default": "./dist/index.mjs"
    },
    "require": {  处理 CommonJS 模块的导入，使用 `require()` 语法
      "types": "./dist/index.d.ts",
      "default": "./dist/index.cjs"
    }
  }
},
```

- module：用于指定一个软件包的 ES 模块（ECMAScript 模块）入口点。
- sideEffects：代表一个包是否包含副作用，通常来说我们需要指定为 false，这样打包时打包工具如 Webpack 可以直接删除未使用的代码，来减少项目体积。

  - 如果只有特定的文件包含副作用，例如修改全局变量：

  ```
  "sideEffects": [
  "./src/someSideEffectfulFile.js",
  "*.css"
  ]
  ```

- description：用于对项目进行简单的描述，可以让其他开发者在 npm 的搜索中发现我们的项目包。
- keywords：keywords 字段是一个字符串数组，表示这个项目包的关键词，同样可以让其他开发者在 npm 的搜索中发现我们的项目包。

  ```
  "keywords": [
  "react",
  "state",
  "manager",
  "management",
  "store"
  ],
  ```

- files：用于指定哪些文件和目录应该被包含在发布到 npm 的软件包中。这个字段可以帮助你精确控制发布的内容，确保不会将不必要或敏感的文件发布到 npm 仓库。

```
"files": [
  "src",
  "dist"
],
```

- repository：指定了项目源代码位置，例如：

```
// 其中，"type" 表示版本控制系统的类型（在这个例子中是 Git），而 "url" 是指向项目仓库的 URL。
"repository": {
  "type": "git",
  "url": "https://github.com/facebook/react.git"
}
```

- peerDependencies：当使用这个字段时代表告诉用户 “我的包需要与指定版本的某个包一起使用，但我不会直接安装这个依赖，你需要自己安装”。这个字段的作用是确保你的包能够在特定版本的依赖环境中正确工作，同时避免在项目中引入多个版本的相同依赖，例如：
  ```
  "peerDependencies": {
  "react": ">=17.0.0"
  }
  ```
- engines：指定了运行此包所需的 Node.js 和 npm（或其他包管理器）的版本，例如：

```
"engines": {
  "node": ">= 14.0.0",
  "npm": ">= 6.0.0"
}
```

- homepage：项目主页的 URL。
- bugs：报告问题的 URL 或电子邮件地址，例如：
  ```
  "bugs": {
  "url": "https://github.com/pmndrs/jotai/issues"
  }
  ```
- author：包的作者。
- contributors：贡献者列表。

```

```

```

// 查看最新版本
npm view zustand version
// 查看所有版本
npm view zustand versions

```

# pnpm monorepo

## 安装项目：

在工作区的根目录下运行 pnpm install，pnpm会安装所有子项目的依赖项。

## 添加依赖：

通常我们会将子包共享的依赖安装到根目录，例如 eslint、typescript、rollup 等等，其中 -w 代表当前命令将在整个 Workspace 的上下文中执行，例如我们安装 eslint 并将其作为整个项目的依赖项：

```

pnpm add eslint -wD

```

如果我们希望安装子包的依赖项，可以直接进入到对应的包目录下完成安装。也可以使用过滤命令 --filter：

```

pnpm --filter @my/package add zustand

```

当然也可以基于这个命令单独运行某个包下的脚本：

```

pnpm --filter @my/package run build

```

```

```

```

```
