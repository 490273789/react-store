# pnpm monorepo

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
