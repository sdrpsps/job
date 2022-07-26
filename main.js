import App from './App'

// #ifndef VUE3
import Vue from 'vue'

// uView
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

// 全局mixins，用于实现setData等功能';
import Mixin from './polyfill/mixins';
Vue.mixin(Mixin);
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);

import store from '@/store';

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif