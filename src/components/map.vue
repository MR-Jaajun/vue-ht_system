<!--
 * @Description: 
 * @Author: jun
 * @Date: 2019-10-18 19:08:43
 * @LastEditors: jun
 * @LastEditTime: 2019-11-25 16:06:51
 -->
<template>
  <div id="app">
    <!-- <h3 class="title">{{ msg }}</h3>
    <div class="amap-wrapper">
      <el-amap class="amap-box" :vid="'amap-vue'"></el-amap>
    </div>
    <el-amap vid="amapDemo" :zoom="zoom" :center="center">
      <el-amap-marker v-for="(marker,i)in markers" :position="marker.position" :key="i"></el-amap-marker>
    </el-amap>-->
  </div>
</template>



  <style>
.amap-demo {
  height: 300px;
  width: 300px;
}
</style>

  <script>
// NPM 方式
// import { AMapManager } from 'vue-amap';
// CDN 方式
// import VueAMap from "vue-amap";
// let amapManager = new VueAMap.AMapManager();
// export default {
//   data: function() {
//     return {
//       msg:'地图',
//       zoom: 12,
//       center: [121.59996, 31.197646],
//       amapManager,
//       events: {
//         init(o) {
//           let marker = new AMap.Marker({
//             position: [121.59996, 31.197646]
//           });

//           marker.setMap(o);
//         }
//       }
//     };
//   },

//   methods: {
//     add() {
//       let o = amapManager.getMap();
//       let marker = new AMap.Marker({
//         position: [121.59996, 31.177646]
//       });

//       marker.setMap(o);
//     }
//   }
// };
</script>