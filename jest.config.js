export default {
  projects: [
    "<rootDir>/packages/zustand",
    "<rootDir>/packages/jotai",
    "<rootDir>/packages/valtio",
    "<rootDir>/packages/react-query",
  ], // Jest 会同时处理 projects 中指定的所有项目
};
// projects 选项允许你同时运行多个不同项目中的测试，非常适合在 Monorepo 结构中使用。
