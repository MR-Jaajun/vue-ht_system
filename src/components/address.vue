<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2020-02-01 18:38:26
 * @LastEditors  : Roc
 * @LastEditTime : 2020-02-01 19:34:26
 -->
<template>
  <div id="app">
    <el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleChange"></el-cascader>
  </div>
</template>


<script>
import { regionData } from "element-china-area-data";

export default {
  data() {
    return {
      options: regionData,
      selectedOptions: []
    };
  },

  methods: {
    handleChange(value) {
      console.log(value);
    }
  }
};
</script>
