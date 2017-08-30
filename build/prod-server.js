"use strict"

const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackDevMiddleware = require("webpack-dev-middleware");
const dir = require('../config/dir');
const bingooConfig = require(`${dir.bingoo_PATH}`);

let config = require('./webpack.prod');
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

// export
module.exports = function(port) {
  let app = express();
  // log
  app.use(morgan('dev'));
  // static
  app.use(express.static(`${dir.USER_DIR}/dll`));
  app.use(express.static(`${dir.USER_DIR}/output`));
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
    echo(chalk.green(`Listening at http://localhost:${port}`), chalk.red(`访问页面格式, [http://localhost:${port}/index.html]`));
  });
}