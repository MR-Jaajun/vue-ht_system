/*
 * @Description: base64
 * @LastEditors: jun
 * @LastEditTime: 2019-10-30 21:10:38
 */
import Vue from 'vue';
import axios from "./axios.js";
Vue.use(axios);
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    let imgResult = "";
    reader.readAsDataURL(file);
    reader.onload = function () {
      imgResult = reader.result;
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.onloadend = function () {
      resolve(imgResult);
    };
  });
}
export function getsrc(src, arrs) {
  getBase64(src).then(res => {
      axios.post('/backend/SystemSetting/uploadAvatar', {
        image: res
      }).then(res => {
        console.log(res.data.data);
        if (Array.isArray(arrs)) {
          arrs.push(res.data.data.url);
        } else {
          arrs = res.data.data.url;
        }
      });
    });
  

}
