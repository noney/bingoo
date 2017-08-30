'use static'

const shelljs = require('shelljs/global');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const spawn = require('child_process').spawn;
const chalk = require('chalk');
let dir = null;

module.exports = {
	init(fn) {
		if (fs.existsSync(fn)) {
			echo(`${fn} 文件夹已存在, 请重新指定`);
		} else {
			echo(chalk.green('开始创建新项目'));
			fs.mkdirSync(fn);
			process.chdir(fn);
			dir = require('./config/dir.js');
			// 配置文件
			let ni_config = spawn('cp', ['-Rf', `${dir.PROJECT_DIR}/temps/config/`, './'], { stdio: 'inherit', cwd: `${dir.USER_DIR}`});
	    	echo(chalk.green('正在复制配置文件'));
		    ni_config.on('close', (code) => {
		    	// yarn install
				let ni_yarn = spawn('yarn', { stdio: 'inherit', cwd: `${dir.USER_DIR}`});
				ni_yarn.on('close', (code) => {
			        echo(chalk.green('依赖包安装完成'));
				});
				// create root com
				fs.mkdirSync(`${dir.USER_DIR}/app`);
				this.createCom('app', 'index');
				// create child com
				fs.mkdirSync(`${dir.USER_DIR}/components`);
				this.createCom('components', 'index');
		    });
		}
	},
	createCom(type, name) {
		name = name.toLowerCase();
		// 是否已存在
		if(fs.existsSync(`${dir.USER_DIR}/${type}/${name}`)){
			console.log(chalk.red('已存在同名根组件，不能重复创建'))
			return false;
		}
		// 创建组件文件夹
		fs.mkdirSync(`${dir.USER_DIR}/${type}/${name}`);
		// 创建组件
		fs.readdirSync(`${dir.PROJECT_DIR}/temps/${type}/`).map((v) => {
			let str = fs.readFileSync(`${dir.PROJECT_DIR}/temps/${type}/${v}`).toString().replace(/com-name/g, name);
			fs.writeFileSync(`${dir.USER_DIR}/${type}/${name}/${v.replace(type, name)}`, str.replace(/comname/g, name.replace(/-/g, '')), 'utf8');
		});
		echo(chalk.green(`${name}${type === 'app' ? '根' : '子'}组件创建完成`));
	},
	dll() {
		dir = require('./config/dir.js');
		const dllConfig = require('./build/dll.config.js');
	    if (fs.existsSync(dir.DLL_DIR)) rm('-rf', dir.DLL_DIR);
	    fs.mkdirSync(dir.DLL_DIR);
	    echo(chalk.green('dll 开始构建'));
	    webpack(dllConfig).run((err, stats) => {
	        // loader.end('*')
	        if (err) {
	        	echo(chalk.red(err));
	        	process.exit();
	        }
	        echo(chalk.blue('[build] ', stats.toString({
	            chunks: false,
	            colors: true
	        })));
	        echo(chalk.green('dll构建完成'));
	        process.exit(0);
	    })
	},
	server(port, env) {
		require(`./build/${env}-server.js`)(port);
	},
	build() {
		dir = require('./config/dir.js');
		const bingooConfig = require(`${dir.bingoo_PATH}`);
		const prodConfig = require('./build/webpack.prod.js');
		const compiler = webpack(prodConfig);
		const ProgressPlugin = require('webpack/lib/ProgressPlugin');
		let outputPath = `${dir.USER_DIR}/${bingooConfig.outputName}`;
	    if (fs.existsSync(outputPath)) rm('-rf', outputPath);
	    fs.mkdirSync(outputPath);
	    // output
	    compiler.apply(new ProgressPlugin(function(percentage, msg) {
	        console.log(chalk.green(`已构建${chalk.red(Math.floor(percentage*100) + '%')} ${msg}`));
	    }));
	    compiler.run((err, stats) => {
	        if (err) {
	        	echo(chalk.red(err));
	        	process.exit();
	        } else {
		        echo(chalk.blue('[build] ', stats.toString({
		            chunks: false,
		            colors: true
		        })));
	            console.log(chalk.green('构建完成'));
	            process.exit(0)
	        }
	    })
	}
}