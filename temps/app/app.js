/**
 * 框架
 */
import Vue from 'vue'
import 'zepto'

/**
 * vuex store
 */
import store from './store'

/**
 *  根组件
 */
import App from './App'

/**
 *  start
 */
new Vue({
	el: '#mountRoot',
	store,
	components: { App }
})