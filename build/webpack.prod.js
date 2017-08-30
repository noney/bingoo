"use strict"

const path = require('path');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const dir = require('../config/dir.js');
const CommonConfig = require('./webpack.base.js');
const ExtractTextPlugin = new require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const bingooConfig = require(`${dir.bingoo_PATH}`);
const OUTPUT_DIR = `${dir.USER_DIR}/${bingooConfig.outputName}`;

// publicPath
CommonConfig.output.publicPath = 'static/';
// output filename
CommonConfig.output.filename = '[name].[hash].js';
// css happypack
CommonConfig.module.rules.push({
  test: /\.vue$/,
  use: {
    loader: 'vue-loader'
  }
});
// 压缩
if (bingooConfig.zip !== false) {
  CommonConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true,
        warnings: false
      },
      comments: false
    })
  );
}
/**
 * [config htmls]
 */
let htmls = [];
bingooConfig.app.map((v) => {
    htmls.push(new HtmlWebpackPlugin({
      filename: path.join(OUTPUT_DIR, `/${v}.html`),
      template: path.join(dir.USER_DIR, `/app/${v}/${v}.html`),
      chunks: ['bundle', v],
      chunksSortMode: 'dependency',
      minify: { removeComments: true, collapseWhitespace: true },
      inject: true
    }));
});
/**
 * [config Merge]
 */
module.exports = Merge(CommonConfig, {
  devtool: false,
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    // pro
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    // 提取css
    new ExtractTextPlugin("../[name].[contenthash].css"),
    // 编译css
    new webpack.LoaderOptionsPlugin({
      test:/\.vue$/,
      options: {  
         vue: {
            loaders: {  
               css: ExtractTextPlugin.extract({  
               fallback:'vue-style-loader',   
               use: [{
                  loader: 'css-loader',
                  options: {
                    minimize: true
                  }
               }],  
               publicPath:"static/",
             })
           }
         }  
      }  
    }),
    ...htmls
  ]
})