import createBabelConfig from "./babel.config";
import resolve from "@rollup/plugin-node-resolve";
import babelPlugin from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { dts } from "rollup-plugin-dts";

const extensions = [".ts", ".tsx"];

function getBabelOptions() {
  return {
    ...createBabelConfig,
    extensions,
    babelHelpers: "bundled",
    comment: false,
  };
}
/**
 * 创建一个用于生成 TypeScript 声明文件的 Rollup 配置对象
 * @param {string} input - 输入文件路径
 * @param {string} output - 输出文件路径
 * @returns {Object} - Rollup 配置对象
 */
function createDeclarationConfig(input, output) {
  return {
    input,
    output: {
      file: output,
      format: "esm",
    },
    plugins: [dts()],
  };
}

/**
 * 创建一个用于生成 ES 模块（ESM）格式输出文件的 Rollup 配置对象
 * @param {string} input - 输入文件路径
 * @param {string} output - 输出文件路径
 * @returns {Object} - Rollup 配置对象
 */
function createESMConfig(input, output) {
  return {
    input,
    output: { file: output, format: "esm" },
    plugins: [
      resolve({ extensions }),
      commonjs(),
      babelPlugin(getBabelOptions()),
    ],
  };
}

/**
 * 创建一个用于生成 CommonJS 模块（CJS）格式输出文件的 Rollup 配置对象
 * @param {string} input - 输入文件路径
 * @param {string} output - 输出文件路径
 * @returns {Object} - Rollup 配置对象
 */
function createCommonJSConfig(input, output) {
  return {
    input,
    output: { file: output, format: "cjs" },
    plugins: [
      resolve({ extensions }),
      commonjs(),
      babelPlugin(getBabelOptions()),
    ],
  };
}

/**
 * 创建一个用于生成 UMD 模块格式输出文件的 Rollup 配置对象
 * @param {string} input - 输入文件路径
 * @param {string} output - 输出文件路径
 * @param {string} name - UMD 模块的名称
 * @returns {Object} - Rollup 配置对象
 */
function createUMDConfig(input, output, name) {
  return {
    input,
    output: { file: output, format: "umd", name },
    plugins: [
      resolve({ extensions }),
      commonjs(),
      babelPlugin(getBabelOptions()),
    ],
  };
}

export default (args) => {
  // rollup -c --package jotai
  // args.package = jotai
  const packageName = args.package;

  const input = `packages/${packageName}`;
  const output = `packages/${packageName}/dist`;

  return [
    createDeclarationConfig(`${input}/src/index.ts`, output),
    createESMConfig(`${input}/src/index.ts`, `${output}/index.mjs`),
    createCommonJSConfig(`${input}/src/index.ts`, `${output}/index.cjs.js`),
    createUMDConfig(
      `${input}/src/index.ts`,
      `${output}/index.umd.js`,
      packageName,
    ),
  ];
};
