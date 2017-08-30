"use strict"

const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackDevMiddleware = require("webpack-dev-middleware");
const dir = require('../config/dir');
const bingooConfig = require(`${dir.bingoo_PATH}`);

let config = require('./webpack.dev');
// webpack output log format
let defaultStatsOptions = {
  colors: true,
  hash: false,
  timings: true,
  chunks: false,
  chunkModules: false,
  modules: false,
  children: true,
  version: true,
  cached: false,
  cachedAssets: false,
  reasons: false,
  source: false,
  errorDetails: false
};
/**
 * [genScipt 生成script]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function genScipt(arr) {
  let str = '';
  arr.forEach(function(v) {
    str+= `<script src="/${v}.js"></script>`;
  });
  return str;
}

// export
module.exports = function(port) {
  let app = express();
  // log
  app.use(morgan('dev'));
  // static
  app.use(express.static(`${dir.USER_DIR}/dll`));
  // res html
  app.use(function(req, res, next) {
    console.log(req.originalUrl);
    if (req.originalUrl === '/') req.originalUrl = '/app/index/index.html';
    let regexp = req.originalUrl.match(/\/app\/([a-z-]+)\/([a-z-]+)\.html/);
    if (regexp instanceof Array && regexp[1] === regexp[2] && bingooConfig.app.indexOf(regexp[2]) !== -1) {
      let str = fs.readFileSync(`${dir.USER_DIR}${regexp[0]}`).toString();
      str = str.replace('</body>', `${genScipt(['vendor.dll', 'bundle' ,regexp[2]])}</body>`);
      res.send(str);
    }
    next();
  });
  // compiler
  let compiler = webpack(config);
  // output
  require('./output-log.js')(compiler);
  // dev-middle
  app.use(webpackDevMiddleware(compiler, {
    publicPath: "/",
    // lazy: true,
    stats: defaultStatsOptions
  }));
  app.listen(port, function (err) {
    if (err) {
      echo(chalk.red(err));
      process.exit();
    }
    echo(chalk.green(`Listening at http://localhost:${port}`), chalk.red(`访问页面格式, [http://localhost:${port}/app/index/index.html]`));
  });
}