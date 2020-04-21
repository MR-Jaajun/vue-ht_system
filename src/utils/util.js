/*
 * @Description: 公共方法
 * @LastEditors: Roc
 * @LastEditTime: 2020-02-27 15:43:42
 */

// 时间戳转换成时
export function timestampToTime(row) {
  var date = new Date(row) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  var h = date.getHours() + ':'
  var m = date.getMinutes() + ':'
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}

// 数组对象返回删除的对象
export function deleteItem(item, val) {
  let arr = item; //原数组
  let obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].desc == val) {
      // arr2.push(item[i]); //被删除的元素以新数组输出
      obj.data = item[i]
      arr.splice(i, 1);
    }

  }
  return obj;
}
export function getClass(oParent, clsName) {
  var oParents = document.getElementsByClassName(oParent);
  var boxArr = new Array();
  var oElements = oParents.getElementsByTagName('*');
  for (let i = 0; i < oElements.length; i++) {
    var classNameArr = oElements[i].className.split(/\s+/);
    for (let j = 0; j < classNameArr.length; j++) {
      if (classNameArr[j] === clsName) {
        boxArr.push(oElements[i]);
      }
    }

  }
  console.log(boxArr)
  return boxArr;

}
//设置cookie
export function setCookie(c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};
