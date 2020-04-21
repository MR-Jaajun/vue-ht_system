/*
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:07:07
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-18 16:23:52
 */

var path = require('path')
var webpack = require('webpack')

module.exports = {
  configureWebpack: config => {
    config.plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {
            drop_console: true,
            drop_debugger: false,
            pure_funcs: ['console.log'] 
          }
        },
        sourceMap: false,
        parallel: true
      })
    )
  },
  chainWebpack: config => {
    // 设置目录别名alias
    config.resolve.alias
      .set('assets', '@/assets')
      .set('components', '@/components')
      .set('view', '@/view')
      .set('style', '@/style')
      .set('store', '@/store')
  },

  publicPath: "/",
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      })
    ]
    //   externals: {
    //      vue:'Vue',
    //      Element: "element-ui"
    //    }
  },
  lintOnSave: false,
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  }
}

