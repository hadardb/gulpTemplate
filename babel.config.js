/*
 * @Author: Haojin Sun
 * @Date: 2019-12-04 13:31:15
 * @LastEditors: Haojin Sun
 * @LastEditTime: 2019-12-06 14:33:17
 */
const presets = [
  [
    "@babel/env",
    {
      modules:'amd',
      targets: {
        ie: "9",
        firefox: "60",
        chrome: "53",
        safari: "11.1",
      },
      // useBuiltIns: "usage",    // usage 引用polyfills文件  去支持ES6+  但是会有require问题
      // corejs: 3,

    },
  ],
];
const plugins = [
  "@babel/plugin-transform-property-mutators", //get() set()
  // es6
  "@babel/plugin-transform-destructuring", // 解构
  "@babel/plugin-transform-arrow-functions", // 箭头函数
  "@babel/plugin-transform-block-scoped-functions",  // 区块范围  函数
  "@babel/plugin-transform-block-scoping", // 区块范围   变量
  "@babel/plugin-transform-classes",    //类
  "@babel/plugin-transform-computed-properties", // 支持对象属性名进行计算
  "@babel/plugin-transform-for-of",   // for of
  "@babel/plugin-transform-function-name", // 支持箭头函数赋值
  "@babel/plugin-transform-instanceof", // instanceof 方法
  "@babel/plugin-transform-object-super", // super
  "@babel/plugin-transform-parameters", // 支持在函数变量中进行解构 默认值 等操纵
  "@babel/plugin-transform-shorthand-properties", // 支持对象属性简化赋值
  "@babel/plugin-transform-spread", // 数组解构
  "@babel/plugin-transform-sticky-regex", // /o+/y 这种正则写法
  "@babel/plugin-transform-template-literals", // ES6 字符串``
  "@babel/plugin-transform-typeof-symbol", // symbol 类型
  // es7
  "@babel/plugin-transform-exponentiation-operator", // 支持幂运算符
  // es8
  "@babel/plugin-transform-async-to-generator", // async
  //es9
  "@babel/plugin-proposal-object-rest-spread",  // 解构剩余对象
  "@babel/plugin-transform-modules-umd"    // 有define等commonjs问题的时候 引这个包 改modules模式
]
module.exports = {
  presets,
  plugins
};

//./node_modules/.bin/babel src --out-dir lib