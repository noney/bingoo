'use strict'

const shelljs = require('shelljs/global');
const fs = require('fs')
const path = require('path')

/**
 * 获取用户所在目录
 */
exports.USER_DIR = pwd().stdout;
/**
 * 获取项目根目录
 */
exports.PROJECT_DIR = path.resolve(__dirname, '../');
/**
 * 模板目录
 */
exports.TEMPLATES_DIR = path.resolve(__dirname, '../temps');
/**
 * dll目录
 */
exports.DLL_DIR = `${this.USER_DIR}/dll`;
/**
 * bingoo 配置文件路径
 */
exports.bingoo_PATH = `${this.USER_DIR}/bingoo.config.js`;
/**
 * [是否为项目目录]
 * @return {[type]} [description]
 */
exports.isRoot = () => {
	return fs.existsSync(this.bingoo_PATH);
}