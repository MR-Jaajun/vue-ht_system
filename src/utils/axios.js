/*
 * @Description:
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-02 14:11:19
 */
import axios from "axios";
import store from '../store/store'
import router from '../router'
import qs from "qs";
import {
  Message
} from 'element-ui';
import 'es6-promise';

// 配置 http 的一些的配置选项
// http.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://129.28.109.150:3000' : 'http://localhost:3000';
var instance = axios.create({
  timeout: 100000,
  isRetryRequest: false
});
//提交时开启
instance.defaults.baseURL = process.env.NODE_ENV === 'production' ? window.global_config.BASE : window.global_config.BASE_URL;
instance.defaults.headers.common['appversion'] = 'v230'
//http request 请求拦截器
instance.interceptors.request.use(config => {
  var token = sessionStorage.getItem("token");
  if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.common['token'] = token
  }
  return config;
}, err => {
  return Promise.reject(err);
});


var token = sessionStorage.getItem("token");

function gethttptoken() {
  let gtoken = token
  let suid = sessionStorage.getItem("suid");
  return axios({
    method: "post",
    url: "/backend/Token/refreshToken",
    headers: {
      token: gtoken
    },
    data: {
      uid: suid
    }
  })
}
//  response 响应拦截器
instance.interceptors.response.use(
  response => {
    if (response.data.code == '-111') {
      let config = response.config;
      sessionStorage.removeItem("token"); //清除token信息
      if (!config.isRetryRequest) {
        return gethttptoken().then(response => {
          if (response.status == 200) {
            console.log(response, "响应拦截器刷新token");
            sessionStorage.setItem("token", response.data.data.token);
            store.commit("set_token", response.data.data.token);
          }
          //修改flag
          config.isRetryRequest = true;
          var token = sessionStorage.getItem("token");
          config.headers.common['token'] = token
          config.baseURL = '';
          return axios(config);
        }).catch(err => {
          console.log("刷新token失败只能跳转到登录页重新登录")
          //刷新token失败只能跳转到登录页重新登录
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
          throw err;
        });
      }
    }
    // console.log(response, 'response')
    return response

  },
  error => {
    Message.error(error.response.data.msg)
    return Promise.reject(error.response) // 返回接口返回的错误信息
  });


export function get(url, params) {
  return new Promise((resolve, reject) => {
    instance.get(url, {
        params: params
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err)
      })
  });
}
export function post(url, params) {
  return new Promise((resolve, reject) => {
    instance.post(url, qs.stringify(params))
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  });
}

export default instance;
