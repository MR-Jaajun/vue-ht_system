/*
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2020-02-27 10:26:29
 */

import Vue from 'vue';
import Vuex from 'vuex';
import createVuexAlong from "vuex-along";
import axios from 'axios';
import a from './modules/a';
// import b from './modules/b';
// import c from './modules/c';

Vue.use(Vuex)
const store = () => new Vuex.Store({
  state: {
    objnav: [],
    mapdata: "",
    mapdata2: "",
    mapdata3: "",
    clearMarker: "",
    f_longitude: "",
    f_latitude: ""
  },

  getters: {
    token(state) {
      return state.token
    },
    objnav(state) {
      return state.objnav
    },
    id(state) {
      return state.id
    },
  },

  mutations: {
    // set_token: (state, token) => {
    //   state.token = token;
    // },
    // set_id: (state, id) => {
    //   state.id = id
    // },
    set_nav: (state, payload) => {
      state.objnav = payload
    },
    getMapData: (state, payload) => {
      state.mapdata = payload
    },
    getMapData2: (state, payload) => {
      state.mapdata2 = payload
    },
    getMapData3: (state, payload) => {
      state.mapdata3 = payload
    },
    getMapData4: (state, payload) => {
      state.clearMarker = payload
    },
    f_lng: (state, payload) => {
      state.f_longitude = payload
    },
    f_lat: (state, payload) => {
      state.f_latitude = payload
    },
    // set_username: (state, payload) => {
    //   state.username = payload;
    // },
    // set_pwd: (state, payload) => {
    //   state.pwd = payload;
    // }
  },
  actions: {
    /** 获取导航数剧 */
    getData({ commit, state, getters }) {
      axios({
        method: "post",
        url: "/backend/Login/Login",
        data: {
          username: sessionStorage.getItem("set_username"),
          pwd: sessionStorage.getItem("set_pwd")
        }
      }).then(res => {
        if (res.data.status == 1) {
          commit("set_nav", res.data.data.permission);
        }
      });
    },
  },
  plugins: [createVuexAlong({
    name: "hello-vuex-along",
    local: {
      list: ["ma", 'mapdata', 'mapdata2', 'mapdata3', 'clearMarker'],
      isFilter: true
    },
    session: {
      list: ["ma.a1"]
    }
  })],


  modules: {
    ma: a,
    //     mb: b,
    //     mc: c
  }
})
export default store
