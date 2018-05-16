'use strict'
// const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const glob = require('globby')

const env = require('../config/prod.env')

// CSS入口配置
/*
var CSS_PATH = {
  css: {
    pattern: ['./src/!**!/[^_]*.less', '!./src/old/!**!/!*.less'],
    src: path.join(__dirname, 'src'),
    dst: path.resolve(__dirname, 'static/build/webpack'),
  }
}
// 遍历除所有需要打包的CSS文件路径
function getCSSEntries(config) {
  var fileList = glob.sync(config.pattern)
  return fileList.reduce(function (previous, current) {
    var filePath = path.parse(path.relative(config.src, current))
    var withoutSuffix = path.join(filePath.dir, filePath.name)
    previous[withoutSuffix] = path.resolve(__dirname, current)
    return previous
  }, {})
}
 */

const webpackConfig = merge(baseWebpackConfig, {
  entry: {
    index: './src/main.js'
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.plug.productionSourceMap,
      extract: true,
      usePostCSS: false
    })
  },
  devtool: config.plug.productionSourceMap ? config.plug.devtool : false,
  output: {
    path: config.plug.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[id].js'),
    library: 'todayVuePlugIn',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  target: 'node-webkit',
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // new UglifyJsPlugin({
    //  uglifyOptions: {
    //    compress: {
    //      warnings: false
    //    }
    //  },
    //  sourceMap: false,
    //  parallel: true
    // }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.plug.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    })
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    /*    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }), */
    // keep module.id stable when vendor modules does not change
    /*
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
     */
    /* new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }), */

    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    /*    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }), */
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    /* new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }), */

    // copy custom static assets
    /*    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.plug.assetsSubDirectory,
        ignore: ['.*']
      }
    ]) */
  ]
})

if (config.plug.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
