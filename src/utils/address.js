/*
 * @Description: 
 * @LastEditors  : Roc
 * @LastEditTime : 2020-01-10 15:05:04
 */
// 加载china地点数据，三级
import axios from "axios";
export function getCityData() {
  return new Promise((resolve, reject) => {
    axios.get('./json/map.json')
      .then(response => {
        var data = response.data;
        var province = [];
        var city = [];
        var block = [];
        // 省市区数据分类
        for (var item in data) {
          if (item.match(/0000$/)) {
            //省
            province.push({
              id: item,
              value: data[item],
              children: []
            });
          } else if (item.match(/00$/)) {
            //市
            city.push({
              id: item,
              value: data[item],
              children: []
            });
          } else {
            //区
            block.push({
              id: item,
              value: data[item]
            });
          }
        }
        // 分类市级
        for (var index in province) {
          for (var index1 in city) {
            if (
              province[index].id.slice(0, 2) ===
              city[index1].id.slice(0, 2)
            ) {
              province[index].children.push(city[index1]);
            }
          }
        }
        // 分类区级
        for (var item1 in city) {
          for (var item2 in block) {
            if (
              block[item2].id.slice(0, 4) ===
              city[item1].id.slice(0, 4)
            ) {
              city[item1].children.push(block[item2]);
            }
          }
        }
        resolve(response);
      })
      .catch(error => {
        reject(err)
        console.log(error);
        console.log(typeof + error);
      });
  })
}
// 选省
export function choseProvince(e) {
  for (var index2 in this.province) {
    if (e === this.province[index2].id) {
      this.shi1 = this.province[index2].children;
      this.shi = this.province[index2].children[0].value;
      this.qu1 = this.province[index2].children[0].children;
      this.qu = this.province[index2].children[0].children[0].value;
      this.E = this.qu1[0].id;
      // this.sheng = this.province[index2].value;
      // console.log("选省", this.sheng);
      console.log("选省", this.E)
    }
  }
}
// 选市
export function choseCity(e) {
  for (var index3 in this.city) {
    if (e === this.city[index3].id) {
      this.qu1 = this.city[index3].children;
      this.qu = this.city[index3].children[0].value;
      this.E = this.qu1[0].id;
      // this.shi = this.city[index3].value;
      // console.log("选市", this.shi);
      console.log("选市", this.E)
    }
  }
}
// 选区
export function choseBlock(e) {
  this.E = e;
  for (var i = 0; i < this.qu1.length; i++) {
    if (e === this.qu1[i].id) {
      this.qu = this.qu1[i].value;
      // console.log("选区", this.qu, this.sheng + this.shi + this.qu);
    }
  }
  console.log("选区", this.E)
}


