/*
 * @Description:
 * @LastEditors: Roc
 * @LastEditTime: 2020-02-27 10:30:06
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store/store';
import axios from '@/utils/axios';

import {
  get,
  post
} from "@/utils/axios.js";
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'nprogress/nprogress.css';
import '@/styles/index.scss';
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: '37a6abf236f84f06631f9a17eb7b759d',
  plugin: [
    "AMap.Scale",
    "AMap.OverView",
    "AMap.ToolBar",
    "AMap.MapType",
    "AMap.Geolocation",
    "AMapUI.loadUI",
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.PolyEditor",
    "AMap.CircleEditor",

  ],
  v: '1.4.4',
  uiVersion: '1.0'
});

Vue.prototype.$axios = axios;
Vue.prototype.$get = get;
Vue.prototype.$post = post;
// Vue.prototype.$cookies = Cookies;

Vue.use(Element, {
  size: 'small',
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
