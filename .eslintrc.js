/*
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:07:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-12 10:56:25
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },

  globals: {
    'AMap': false,
    'AMapUI': false
  }
}
