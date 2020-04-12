'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
      /**由于前端和后端不在一个端口下启动，前端的网络请求无法直接发送到后端，需要配置请求转发
       * 且需要在api.config.js中配置baseUrl,保证动态匹配开发环境和生产环境
       * proxyTable代码解释
       *  (1) '/api/**' 即前端axios所有以api开头的请求都会转发到target中的地址
       *  (2)  parhReweite:重写路径为/ ,把虚拟的这个api接口去掉，此时真正去后端请求的时候，
       *  不会加上api这个前缀了，但是前台http请求的时候，还必须加上api前缀才能匹配到这个代理，如axios.post('/api/users/logout')
       *  (3)因此为了解决(2)中的问题，在api.config.js中配置axios默认的baseUrl，且可以保证动态匹配开发环境和生产环境
       *  (4) 经过上述配置就可以像 “axios.post('/users/logout')”而无需更改服务器接口地址 直接跨域请求*/

    proxyTable: {
      '/api/**':{
            target:'http://localhost:8080',  //47.96.164.222
            changeOrigin:true,
            pathRewrite:{
              '^/api':'/'
          }

      }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST //47.96.164.222
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
