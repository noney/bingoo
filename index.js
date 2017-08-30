#!/usr/bin/env node

"use static"

const yargs = require('yargs');
const fs = require('fs');
const pkgJson = require('./package.json');
const shelljs = require('shelljs/global');
const portfinder = require('portfinder');
const chalk = require('chalk');
const comStr = 'bingoo';
const comExec = require('./comExec.js');

yargs
/**
 * [创建新项目]
 */
.command('init', '创建新项目', (yargs) => {
    // echo("创建新项目 start");
    yargs.option('n', {
	    alias: "name",
	  	demand: true,
	  	default: 'bingoo-new-project',
	  	type: 'string',
	    description: "新项目文件夹名"   	
    })
  }, (argv) => {
    if (argv.name === '') {
    	echo('请指定项目文件夹名');
    	return false;
    }
    comExec.init(argv.name);
  })
/**
 * [创建vue组件]
 */
.command('create', '创建vue组件', (yargs) => {
    yargs
	    .option('a', {
		    alias: "app",
		  	demand: true,
		  	default: false,
		  	type: 'string',
		    description: "创建vue root组件"   	
	    })
	    .option('c', {
		    alias: "child",
		  	demand: true,
		  	default: false,
		  	type: 'string',
		    description: "创建vue child组件"   	
	    })
  }, (argv) => {
    // 是否项目根目录
    if (!isRoot()) {
      echo(chalk.red('请在项目根目录执行命令'));
      return false;
    }
  	if (!argv.a && !argv.c) {
  		echo(chalk.red('请指定vue组件类型 [-a -c]'));
  		return false;
  	} else {
  		if (argv.a) {
        comExec.createCom('app', argv.a);
      } else {
        comExec.createCom('components', argv.c);
  		}
  	}
  })
/**
 * [dll]
 */
.command('dll', '创建dll', (yargs) => {
  }, (argv) => {
    // 是否项目根目录
    if (!isRoot()) {
      echo(chalk.red('请在项目根目录执行命令'));
      return false;
    }
    comExec.dll();
  })
/**
 * [启动webpack服务]
 */
.command('server', '启动webpack服务', (yargs) => {
    yargs
      .option('p', {
  	    alias: "port",
  	  	demand: true,
  	  	default: false,
  	  	type: 'string',
  	    description: "指定端口"   	
      })
      .option('e', {
        alias: "env",
        demand: true,
        default: 'dev',
        type: 'string',
        description: "指定端口"     
      })
  }, (argv) => {
    // 是否项目根目录
    if (!isRoot()) {
      echo(chalk.red('请在项目根目录执行命令'));
      return false;
    }
    let env = argv.env === 'prod' ? 'prod' : 'dev';
    if (argv.port) {
    	comExec.server(argv.port, env);
    } else {
    	portfinder.getPortPromise()
    		.then((port) => {
          comExec.server(port, env);
    		}).
    		catch((err) => {
    			echo(chalk.red('获取端口失败, 请自己通过-p设置'));
    		})
    }
  })
/**
 * [构建webpack服务]
 */
.command('build', '构建项目', (yargs) => {
  }, (argv) => {
    // 是否项目根目录
    if (!isRoot()) {
      echo(chalk.red('请在项目根目录执行命令'));
      return false;
    }
    comExec.build();
  })
  .option('v', {
    alias: 'version',
    describe: '显示版本号'
  })
.usage(`Usage: ${comStr} [command] [options]`)
.example(`${comStr} init -n bingoo-new-project, 创建新项目`)
.help('h')
.alias('h', 'help')
.argv;
/**
 * [show version]
 */
if (yargs.argv.version) {
	echo(pkgJson.version)
	return false;
};
/**
 * [show help]
 */
if (!yargs.argv._.length) {
	yargs.showHelp();
}
/**
 * [isRoot 是否项目根目录]
 * @return {Boolean} [description]
 */
function isRoot() {
  return fs.existsSync(`${pwd().stdout}/bingoo.config.js`);
}