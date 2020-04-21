<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-17 19:53:15
 * @LastEditors  : Roc
 * @LastEditTime : 2020-01-10 18:05:15
 -->
<template>
  <div class="linkage">
    <el-select v-model="sheng" @change="choseProvince" clearable placeholder="省级地区">
      <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
    </el-select>
    <el-select v-model="shi" @change="choseCity" clearable placeholder="市级地区">
      <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
    </el-select>
    <el-select v-model="qu" @change="choseBlock" clearable placeholder="区级地区">
      <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
    </el-select>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      mapJson: "./json/map.json",
      province: "",
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",
      block: "",
      tp: this.props
    };
  },
  props: ["content"],
  watch: {
      props() {
      console.log(this.props);
    }
  },
  created: function() {
    this.getCityData();
  },
  mounted: function() {
    console.log(this.props);
  },
  methods: {
    // 加载china地点数据，三级
    getCityData: function() {
      var that = this;
      axios
        .get(this.mapJson)
        .then(function(response) {
          if (response.status == 200) {
            var data = response.data;
            that.province = [];
            that.city = [];
            that.block = [];
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {
                //省
                that.province.push({
                  id: item,
                  value: data[item],
                  children: []
                });
              } else if (item.match(/00$/)) {
                //市
                that.city.push({ id: item, value: data[item], children: [] });
              } else {
                //区
                that.block.push({ id: item, value: data[item] });
              }
            }
            // 分类市级
            for (var index in that.province) {
              for (var index1 in that.city) {
                if (
                  that.province[index].id.slice(0, 2) ===
                  that.city[index1].id.slice(0, 2)
                ) {
                  that.province[index].children.push(that.city[index1]);
                }
              }
            }
            // 分类区级
            for (var item1 in that.city) {
              for (var item2 in that.block) {
                if (
                  that.block[item2].id.slice(0, 4) ===
                  that.city[item1].id.slice(0, 4)
                ) {
                  that.city[item1].children.push(that.block[item2]);
                }
              }
            }
          } else {
            console.log(response.status);
          }
        })
        .catch(function(error) {
          console.log(typeof +error);
        });
    },
    // 选省
    choseProvince: function(e) {
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shi1 = this.province[index2].children;
          this.shi = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.qu = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
          this.sheng = this.province[index2].value;
          this.$emit("valueBySon", this.sheng);
          sessionStorage.setItem("sheng", this.sheng);
        }
      }
    },
    // 选市
    choseCity: function(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shi = this.city[index3].value;
          sessionStorage.setItem("shi", this.shi);
        }
      }
    },
    // 选区
    choseBlock: function(e) {
      this.E = e;
      for (var i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.qu = this.qu1[i].value;
          // console.log("选区", this.qu, this.sheng + this.shi + this.qu);
          sessionStorage.setItem("qu", this.qu);
        }
      }
      // console.log("选区", this.qu);
    }
  }
};
</script>

<style lang="scss" scoped>
.linkage {
  display: inline-block;
}
</style>

