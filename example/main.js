// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import elementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '../static/css/theme-td/theme/index.css'
import '../static/css/theme-td/icon/iconfont.css'
import '../static/css/theme-td/index.scss'

import vuePlugIn from '../src/main'
Vue.use(elementUI)
Vue.use(vuePlugIn.tdPlugIn)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
