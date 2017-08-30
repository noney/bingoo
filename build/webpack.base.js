"use strict"

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const dir = require('../config/dir.js');
const bingooConfig = require(`${dir.bingoo_PATH}`);
const OUTPUT_DIR = `${dir.USER_DIR}/${bingooConfig.outputName}`;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const os = require('os');
const HappyPack  = require('happypack');
const happThreadPool = HappyPack.ThreadPool({size: os.cpus().length}); // 采用多进程，进程数由CPU核数决定
/**
 * [config entry vendor]
 */
let entry = {};
/**
 * [config entry]
 */
let htmls = [];
bingooConfig.app.map((v) => {
    entry[v] = path.join(dir.USER_DIR, `/app/${v}/${v}.js`);
});
/**
 * [config alias]
 */
let alias = {
    app: `${dir.USER_DIR}/app`,
    components: `${dir.USER_DIR}/components`,
    grainTool: `${dir.PROJECT_DIR}/src/dir`,
    'vue$': `${dir.USER_DIR}/node_modules/vue/dist/vue.esm.js`
};
for(let key of Object.keys(bingooConfig.alias)){
    alias[key] = `${dir.USER_DIR}/${bingooConfig.alias[key]}`
}
// 是否存在dll map
if(!fs.existsSync(`${dir.USER_DIR}/dll/vendor-manifest.json`)) {
  echo(chalk.red('请先项目根目录执行\`bingoo dll\`生成dll文件'));
  process.exit();
}
/**
 * [config plugins]
 */
let plugins = [
  new webpack.DllReferencePlugin({
    context: dir.USER_DIR,
    manifest: require(`${dir.USER_DIR}/dll/vendor-manifest.json`),
  }),
  /* 抽取出所有通用的部分 */
  new webpack.optimize.CommonsChunkPlugin({
    name: 'bundle',      // 需要注意的是，chunk的name不能相同！！！
    filename: 'bundle.js',
    // names: ['common'],
    minChunks: Math.ceil(bingooConfig.app.length / 2),
  }),
  /* 插入Dll文件 */
  new AddAssetHtmlPlugin({ filepath: require.resolve(`${dir.USER_DIR}/dll/vendor.dll.js`), includeSourcemap: false }),
  /* 使用happypack */
  new HappyPack({
    id: 'js',
    // cache: true,
    loaders: ['babel-loader?cacheDirectory=true'],
    threadPool: happThreadPool
  })
];
/**
 * webpack打包分析
 */
if (bingooConfig.analyzer) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8889,
      reportFilename: 'report.html',
      statsFilename: 'stats.json'
    })
  )
}
/**
 * [config]
 */
module.exports = {
  entry,

  output: {
    path: path.join(OUTPUT_DIR, '/static'),
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    publicPath: '/',
    sourceMapFilename: '[name].map',
  },

  resolve: {
    alias,
    extensions: ['.vue', '.js', '.json'],
    modules: [`${dir.PROJECT_DIR}/node_modules`, `${dir.USER_DIR}/node_modules`]
  },

  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: '[name].[ext]?[hash:7]'
            }
          }
        ]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.js$/,
        loader: ['happypack/loader?id=js'],
        include: [`${dir.USER_DIR}/app`, `${dir.USER_DIR}/clientApi`, `${dir.USER_DIR}/components`, `${dir.USER_DIR}/tool`]
      }
    ]
  },
  plugins
}