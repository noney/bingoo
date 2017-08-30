"use strict"

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const Merge = require('webpack-merge');
const dir = require('../config/dir.js');
const ExtractTextPlugin = new require('extract-text-webpack-plugin');
const CommonConfig = require('./webpack.base.js');
const bingooConfig = require(`${dir.bingoo_PATH}`);
const OUTPUT_DIR = `${dir.USER_DIR}/${bingooConfig.outputName}`;

// css happypack
CommonConfig.module.rules.push({
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    loaders: {
      js: 'happypack/loader?id=js' // 将loader换成happypack
    }
  }
});
/**
 * [add hot]
 * @param  {[type]} bingooConfig.hot [description]
 * @return {[type]}                 [description]
 */
if(bingooConfig.hot){
    let polyfill = 'eventsource-polyfill';
    let devClient = `${dir.PROJECT_DIR}/bin/build/dev-client`;
    Object.keys(CommonConfig.entry).forEach(function (name, i) {
        let extras = i === 0 ? [polyfill, devClient] : [devClient]
        CommonConfig.entry[name] = extras.concat(CommonConfig.entry[name])
    });
}
/**
 * [config Merge]
 */
module.exports = Merge(CommonConfig, {
  // devtool: '#cheap-module-eval-source-map',
  cache: true,
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
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
               publicPath:"/", 
             })
           }
         }  
      }  
    }),
  ],
  devServer: {
    port: 3008,
    host: 'localhost',
    historyApiFallback: true,
    noInfo: false,
    stats: 'minimal',
    publicPath: '/'
  }
})