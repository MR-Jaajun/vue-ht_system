
<template>
  <div class="container">
    <div class="search-box">
      <!-- <el-amap vid="amapDemo" :center="mapCenter" :zoom="12" class="amap-demo"> -->
      <input v-model="searchKey" type="search" id="search" style="width:450px;" />
      <button @click="searchByHand">搜索</button>
      <div class="tip-box" id="searchTip">
        <li
          class="res_list"
          v-for="(item,i) in tipList"
          :key="i"
          @click="getValue(item.district,item.name?item.name:item.formatted_address,item.location)"
        >{{item.district?item.district:''}}{{item.name?item.name:item.formatted_address}}</li>
      </div>
      <!-- <div class="results"></div> -->
    </div>
    <!--
        amap-manager： 地图管理对象
        vid：地图容器节点的ID
        zooms： 地图显示的缩放级别范围，在PC上，默认范围[3,18]，取值范围[3-18]；在移动设备上，默认范围[3-19]，取值范围[3-19]
        center： 地图中心点坐标值
        plugin：地图使用的插件
        events： 事件
    -->
    <!-- <el-amap-search-box
      class="search-box"
      :search-option="searchOption"
      :on-search-result="onSearchResult"
    ></el-amap-search-box>-->

    <el-amap
      class="amap-box"
      :amap-manager="amapManager"
      :vid="'amap-vue'"
      :zoom="zoom"
      :plugin="plugin"
      :center="center"
      :events="events"
    >
      <!-- 标记 -->

      <el-amap-marker
        :icon="icon"
        class="editStyle"
        v-for="(marker, index) in markers"
        :position="marker"
        :key="index"
      ></el-amap-marker>
      <el-amap-marker
        v-for="(marker2, index) in markers2"
        :position="marker2"
        :key="'xiaoge'+index"
      ></el-amap-marker>
    </el-amap>
  </div>
</template>



<script>
import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap";
let amapManager = new AMapManager();
import VueAMap from "vue-amap";
// Vue.use(VueAMap);
import axios from "axios";
import { isArray } from "util";
import { async } from "q";
// let amapManager = new VueAMap.AMapManager();
export default {
  data() {
    let self = this;
    return {
      //图片样式 n
      icon: "//webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
      is_show: "",
      tipList: [], //输入提示
      location: "", //选择的经纬度
      address: null,
      searchKey: "",
      amapManager,
      markers: [],
      markers2: [],
      searchOption: {
        city: "全国",
        citylimit: true
      },
      poiPicker: null,
      center: [113.469894, 23.107105],
      zoom: 17,
      lng: 0,
      lat: 0,
      loaded: false,
      lons: "",
      lats: "",
      events: {
        init() {
          lazyAMapApiLoaderInstance.load().then(() => {
            self.initSearch();
          });
        },
        // 点击获取地址的数据
        click(e) {
          // console.log(e, "点击触发");
          self.searchKey = "";
          self.$store.commit("getMapData", e.lnglat);
          self.markers = [];
          let { lng, lat } = e.lnglat;
          // this.lons = lng;
          // this.lats = lat;
          self.lng = lng;
          self.lat = lat;
          self.center = [lng, lat];
          self.markers.push([lng, lat]);
          axios
            .get("https://restapi.amap.com/v3/geocode/regeo?parameters", {
              params: {
                key: "0b1d2d29e777f34081720f95df640092",
                location: lng + "," + lat
              }
            })
            .then(res => {
              const {
                formatted_address,
                addressComponent
              } = res.data.regeocode;
              let detail = formatted_address; //详细地址
              let sheng = addressComponent.province; //省
              let shi = addressComponent.city; //市
              let qu = addressComponent.district; //区
              // console.log(addressComponent, "详细地址2");
              console.log(formatted_address, "详细地址3");
              self.$store.commit("getMapData2", addressComponent);
              self.$store.commit("getMapData3", formatted_address);
              self.searchKey = formatted_address;
            })
            .catch(function(error) {
              // console.log(error);
            });
          // this.zhuanhuan(lng, lat);
          // 这里通过高德 SDK 完成。
          // let geocoder = new VueAMap.Geocoder({
          //   radius: 1000,
          //   extensions: "all"
          // });
          // geocoder.getAddress([lng, lat], function(status, result) {
          //   if (status === "complete" && result.info === "OK") {
          //     if (result && result.regeocode) {
          //       console.log(result.regeocode.formattedAddress, "详细地址");
          //       // self.address = result.regeocode.formattedAddress;
          //       // self.searchKey = result.regeocode.formattedAddress;
          //       // self.$nextTick();
          //     }
          //   }
          // });
        }
      },
      // 一些工具插件
      plugin: [
        {
          pName: "Geocoder",
          events: {
            init(o) {
              console.log(o.getAddress());
            }
          }
        },
        {
          // 定位
          pName: "Geolocation",
          events: {
            init(o) {
              // o是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  // 设置经度
                  self.lng = result.position.lng;
                  // 设置维度
                  self.lat = result.position.lat;
                  // 设置坐标
                  self.center = [self.lng, self.lat];
                  self.markers.push([self.lng, self.lat]);
                  // load
                  self.loaded = true;
                  // 页面渲染好后
                  self.$nextTick();
                }
              });
            }
          }
        },
        {
          // 工具栏
          pName: "ToolBar",
          events: {
            init(instance) {
              // console.log(instance);
            }
          }
        },
        {
          // 鹰眼
          pName: "OverView",
          events: {
            init(instance) {
              // console.log(instance);
            }
          }
        },
        {
          // 地图类型
          pName: "MapType",
          defaultType: 0,
          events: {
            init(instance) {
              // console.log(instance);
            }
          }
        },
        {
          // 搜索
          pName: "PlaceSearch",
          events: {
            init(instance) {
              console.log(instance);
            }
          }
        }
      ]
    };
  },
  watch: {
    searchKey() {
      // console.log(this.searchKey)
      if (!this.searchKey) {
        this.tipList = [];
      }

      // this.searchByHand();
    },
    is_show() {
      if (this.is_show == true) {
        this.markers2 = [];
        this.markers = [];
      }
    }
    // if()
  },
  computed: {
    clearMarker: function() {
      return this.$store.state.clearMarker;
    },
    f_lng: function() {
      return this.$store.state.f_longitude;
    },
    f_lat: function() {
      return this.$store.state.f_latitude;
    }
  },
  created() {
    this.is_show = this.clearMarker;
    var that = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13) {
        that.searchByHand();
      }
    };

    // this.zhuanhuan2();
  },
  mounted() {
    this.initSearch();
    // this.center = [this.f_lat, this.f_lng];
  },
  updated() {},
  methods: {
    //逆解析
    // zhuanhuan2(address) {
    //   // var that = this;
    //    axios
    //     // https://restapi.amap.com/v3/geocode/regeo?parameters
    //     .get("https://restapi.amap.com/v3/geocode/geo?parameters", {
    //       params: {
    //         key: "0b1d2d29e777f34081720f95df640092",
    //         address: address
    //       }
    //     })
    //     .then(response => {
    //        let str = response.data.geocodes[0].location;
    //     });
    //   console.log(str);
    //   .catch(function(error) {
    //     console.log(error);
    //   });
    // },
    //经纬度
    zhuanhuan(lon, lat) {
      // var that = this;
      axios
        .get("https://restapi.amap.com/v3/geocode/regeo?parameters", {
          params: {
            key: "0b1d2d29e777f34081720f95df640092",
            address: lon + "," + lat
          }
        })
        .then(response => {
          let str = response.data.geocodes[0].location;
          let temp = str.split(",");
          this.lons = temp[0]; //经度
          this.lats = temp[1]; //纬度
          // console.log(this.lons, this.lats);
          console.log(str, "zzz");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // onSearchResult(pois) {
    //   let latSum = 0;
    //   let lngSum = 0;
    //   if (pois.length > 0) {
    //     pois.forEach(poi => {
    //       let { lng, lat } = poi;
    //       lngSum += lng;
    //       latSum += lat;
    //       this.markers.push([poi.lng, poi.lat]);
    //     });
    //     let center = {
    //       lng: lngSum / pois.length,
    //       lat: latSum / pois.length
    //     };
    //     this.center = [center.lng, center.lat];
    //   }
    // },
    initSearch() {
      let vm = this;
      let map = this.amapManager.getMap();
      AMapUI.loadUI(["misc/PoiPicker"], function(PoiPicker) {
        var poiPicker = new PoiPicker({
          input: "search",
          placeSearchOptions: {
            map: map,
            pageSize: 15
          },
          suggestContainer: "searchTip",
          searchResultsContainer: "searchTip"
        });
        vm.poiPicker = poiPicker;
        // 监听poi选中信息
        poiPicker.on("poiPicked", function(poiResult) {
          console.log(poiResult);
          let source = poiResult.source;
          let poi = poiResult.item;
          if (source !== "search") {
            poiPicker.searchByKeyword(poi.name);
          } else {
            poiPicker.clearSearchResults();
            vm.markers = [];
            let lng = poi.location.lng;
            let lat = poi.location.lat;
            let address = poi.cityname + poi.adname + poi.name;
            vm.center = [lng, lat];
            vm.markers.push([lng, lat]);
            vm.lng = lng;
            vm.lat = lat;
            vm.address = address;
            vm.searchKey = address;
          }
        });
      });
    },

    //输入提示
    searchByHand() {
      this.tipList = [];
      // this.markers.push([113.469894, 23.107105],[113.4688,23.1072]);
      //restapi.amap.com/v3/place/text?parameters 关键字搜索
      if (this.searchKey) {
        axios
          //https://restapi.amap.com/v3/assistant/inputtips?parameters

          //https://restapi.amap.com/v3/place/text?parameters
          .get("https://restapi.amap.com/v3/assistant/inputtips?parameters", {
            params: {
              key: "0b1d2d29e777f34081720f95df640092",
              keywords: this.searchKey
            }
          })
          .then(res => {
            console.log(res.data, "返回的结果");
            let str = "";
            if (res.data.tips.length < 1) {
              axios
                // https://restapi.amap.com/v3/geocode/regeo?parameters
                .get("https://restapi.amap.com/v3/geocode/geo?parameters", {
                  params: {
                    key: "0b1d2d29e777f34081720f95df640092",
                    address: this.searchKey
                  }
                })
                .then(response => {
                  str = response.data.geocodes[0].location;
                  // item.location = str;
                  console.log(response, "没数据");
                  this.tipList = response.data.geocodes;
                  // res.data.tips.name =
                });
            } else {
              res.data.tips.forEach((item, i) => {
                if (isArray(item.location)) {
                  axios
                    // https://restapi.amap.com/v3/geocode/regeo?parameters
                    .get("https://restapi.amap.com/v3/geocode/geo?parameters", {
                      params: {
                        key: "0b1d2d29e777f34081720f95df640092",
                        address: item.name
                      }
                    })
                    .then(response => {
                      str = response.data.geocodes[0].location;
                      item.location = str;
                    });
                }
                this.tipList.push(item);
              });
            }
            //处理没有返回经纬度的数据 根据文字转换经纬度

            // this.tipList.push(item);
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        this.$message.error("请输入关键词");
      }
    },
    // 点击搜索
    getValue(str, str2, loc) {
      //清空数组
      // this.markers2 = []; //参考点数组
      // this.markers = [];
      //显示附件参考点
      this.tipList.forEach(item => {
        this.markers2.push(item.location.split(","));
      });
      //关键字

      this.searchKey = str + str2;

      //传入经纬度 字符串 113.123,23.456
      this.location = loc;
      //分割字符串得到数组
      this.center = loc.split(",");
      console.log(this.center);
      //点击的标记点
      // this.markers.push(loc.split(","));
      //清除搜索提示
      this.tipList = [];
    }
  }
};
</script>


<style>
.container {
  /* margin-top: 300px; */
  width: 1000px;
  height: 700px;
  position: absolute;
  /* left: 50%; */
  /* top: 50%; */
  /* transform: translate3d(-50%, -50%, 0); */
  border: 1px solid #999;
}
.search-box {
  display: flex;
  position: absolute;
  z-index: 5;
  width: 70%;
  left: 50%;
  transform: translateX(-50%);
  top: 10px;
  height: 30px;
}

.search-box input {
  float: left;
  width: 80%;
  height: 100%;
  border: 1px solid #30ccc1;
  padding: 0 8px;
  outline: none;
}
.search-box button {
  float: left;
  width: 20%;
  height: 100%;
  background: #30ccc1;
  border: 1px solid #30ccc1;
  color: #fff;
  outline: none;
}
.tip-box {
  width: 100%;
  max-height: 260px;
  position: absolute;
  top: 30px;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 2px;
}
/* .results {
  width: 390px;
  height: 100%;
  border: 2px solid #cccccc;
  padding: 0 10px;
  box-sizing: border-box;
} */
.res_list {
  height: 35px;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  font-weight: 400;
  text-align: left;
  line-height: 30px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}
.res_list:hover {
  background: #f1f1f1;
}
</style>
<style lang="scss">
// 地图的样式
.dia_map {
  .el-dialog {
    width: 1040px;
    min-height: 500px;
    .el-dialog__header {
      display: flex !important;
    }
    .el-dialog__body {
      height: 700px;
    }
  }
}
// .search-box .amap-markers .amap-marker .amap-icon img {
//   width: 19px !important;
//   height: 33px !important;
// }
</style>