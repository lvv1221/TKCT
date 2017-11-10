// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import utils from './utils'
import config from './assets/config/env-conf.json'

Vue.config.productionTip = false

Vue.prototype.UTILS = utils
Vue.prototype.CONFIG = config

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
