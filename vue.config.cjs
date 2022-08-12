const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const threadLoader = require('thread-loader')

threadLoader.warmup(
  {
    // pool options, like passed to loader options
    // must match loader options to boot the correct pool
  },
  [
    // modules to load
    // can be any module, i. e.
    'esbuild-loader',
    'vue-loader'
  ]
)

module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.module
        .rule('vue')
        .use('cache-loader')
        .loader('cache-loader')
        .end()
        .use('thread-loader')
        .loader('thread-loader')
        .end()
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
          options.compilerOptions.preserveWhitespace = true
          return options
        })
        .end()

      config.module
        .rule('js')
        .use('thread-loader')
        .loader('thread-loader')
        .end()
        .use('esbuild-loader')
        .loader('esbuild-loader')
        .options({
          loader: 'js',
          target: 'es2022'
        })
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
      config.plugin('speed').use(SpeedMeasurePlugin)
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.module
        .rule('vue')
        .use('thread-loader')
        .loader('thread-loader')
        .end()
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
          options.compilerOptions.preserveWhitespace = true
          return options
        })
        .end()

      config.module
        .rule('js')
        .use('thread-loader')
        .loader('thread-loader')
        .end()
        .use('esbuild-loader')
        .loader('esbuild-loader')
        .options({
          loader: 'js',
          target: 'es2022'
        })

      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
