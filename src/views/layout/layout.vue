<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2019-11-26 18:01:17
 -->
<template>
  <div class="layout">
    <Sidebar />
    <navbar />
    <div class="layout-main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Sidebar from "@/components/sidebar.vue";
import navbar from "@/components/navbar.vue";
import axios from "axios";
export default {
  components: {
    Sidebar,
    navbar
  },

  data() {
    return {
      value: "",
      toSonData: null //给子组件的值
    };
  },

  created() {
    // this.$store.dispatch('getData')
  },
  methods: {}
};
</script>


<style lang="scss"scoped>
.layout-main {
  // left: 276px;
  margin-left: 276px;
  top: 106px;
  height: 100%;
  // width: 100%;
  position: relative;
}
</style>

