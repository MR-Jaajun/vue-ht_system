/*
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2019-11-18 11:45:11
 */
// 仓库的 a 模块

export default {
  namespaced: true,
  state: {
    a1: 'A模块'
  },

  getters: {

  },

  mutations: {
    chgName (state, payLoad) {
      state.name = payLoad.name;
    }
    
  },

  actions: {

  }
}
