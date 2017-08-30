'use static'

module.exports = {
    // root组件列表
    app: [
        'index'
    ],
    // dll
    dll: [
        './node_modules/vue/dist/vue.esm.js',
        './node_modules/es6-promise/dist/es6-promise.auto.js',
        'vuex',
        'zepto'
    ],
    // 别名
    alias: {

    },
    // output目录
    outputName: 'output',
    // 是否启用热更新
    hot: false,
    // webpack打包分析
    analyzer: false,
}