<!--
 * @Description: 分销数据统计
 * @Author: jun
 * @Date: 2019-08-19 17:48:58
 * @LastEditors: duo
 * @LastEditTime: 2019-10-22 17:18:08
 -->
<template>
  <div class="statistics">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>分销管理</el-breadcrumb-item>
      <el-breadcrumb-item>分销数据统计</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 分销看板 -->
    <div class="board">
      <h2>
        <span class="span"></span>分销看板
      </h2>
      <div class="today">
        <el-table
          :data="today"
          border
          style="width: 841px"
          :header-cell-style="{color:'#333', height:'66px',fontSize:'14px' }"
        >
          <el-table-column prop="dis_orders" label="今日分销订单数" width="168" align="center"></el-table-column>
          <el-table-column prop="deposit_fee" label="产生总佣金" width="168" align="center"></el-table-column>
          <el-table-column prop="total_fee" label="剩余总佣金" width="168" align="center"></el-table-column>
          <el-table-column prop="finish_fee" label="今日分销金额" width="168" align="center"></el-table-column>
          <el-table-column prop="overplus_bro" label="今日已发放佣金" width="168" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="yesterday">
        <el-table
          :data="yesterday"
          border
          style="width: 841px"
          :header-cell-style="{color:'#333', height:'66px',fontSize:'14px' }"
        >
          <el-table-column prop="dis_orders" label="昨日分销订单数" width="168" align="center"></el-table-column>
          <el-table-column prop="deposit_fee" label="产生总佣金" width="168" align="center"></el-table-column>
          <el-table-column prop="total_fee" label="剩余总佣金" width="168" align="center"></el-table-column>
          <el-table-column prop="finish_fee" label="昨日分销金额" width="168" align="center"></el-table-column>
          <el-table-column prop="overplus_bro" label="昨日已发放佣金" width="168" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="total">
        <el-table
          :data="totals"
          border
          style="width: 1345px"
          :header-cell-style="{color:'#333', height:'66px',fontSize:'14px' }"
        >
          <el-table-column prop="dis_user_count" label="当前分销员总数" width="168" align="center"></el-table-column>
          <el-table-column
            prop="yesterday_dis_user_count"
            label="昨日新增分销员总数"
            width="168"
            align="center"
          ></el-table-column>
          <el-table-column prop="deposit_fee" label="累计产生总佣金" width="168" align="center"></el-table-column>
          <el-table-column prop="finish_fee" label="累计已发放佣金" width="168" align="center"></el-table-column>
          <el-table-column prop="total_sediment" label="累计沉淀佣金" width="168" align="center"></el-table-column>
          <el-table-column prop="user_terrace" label="累计用户消费5%佣金" width="168" align="center"></el-table-column>
          <el-table-column prop="rider_terrace" label="累计骑手配送费5%佣金" width="168" align="center"></el-table-column>
          <el-table-column prop="total_fee" label="累计剩余总佣金" width="168" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 佣金数据 -->
    <div class="commission">
      <h2 style="margin-bottom:20px;">
        <span class="span"></span>佣金数据
      </h2>
      <!-- 用户消费佣金统计数据 -->
      <div class="userData" style="margin-bottom:35px;">
        <h2 style="font-size:18px;margin-left:30px;">
          用户消费佣金统计数据
          <i></i>
        </h2>
        <div class="userData1">
          <div class="search">
            <span>请选择时间</span>
            <el-date-picker
              v-model="time1"
              @change="getTime1"
              type="daterange"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <el-button @click="getSearch(1)" type="primary" style="margin-left:20px;">搜 索</el-button>
          </div>
          <el-table
            :data="list1"
            border
            style="width: 811px"
            :header-cell-style="{color:'#333', height:'56px',fontSize:'14px' }"
            v-loading="listLoading1"
          >
            <el-table-column prop="type" label="类型" width="162" align="center"></el-table-column>
            <el-table-column prop="finish_fee" label="发放佣金（元)" width="162" align="center"></el-table-column>
            <el-table-column prop="sediment" label="沉淀佣金（元)" width="162" align="center"></el-table-column>
            <el-table-column prop="total_finish_fee" label="累计发放佣金（元)" width="162" align="center"></el-table-column>
            <el-table-column prop="total_sediment" label="累计沉淀佣金（元)" width="162" align="center"></el-table-column>
          </el-table>
          <div class="title">{{this.thisMonth1}}佣金数据统计</div>
        </div>
        <!-- 间隔线 -->
        <div class="border"></div>
        <div class="userData">
          <div class="userData1">
            <div class="search">
              <!-- <span>请选择时间</span> -->
              <div class="choosetime">
                <el-select
                  clearable
                  v-model="listQuery.province"
                  @change="choseProvince"
                  placeholder="省级地区"
                  no-data-text="请选择省份"
                >
                  <el-option
                    v-for="item in province"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select
                  style="margin:0 10px"
                  v-model="listQuery.city"
                  @change="choseCity"
                  placeholder="市级地区"
                  no-data-text="请选择城市"
                  clearable
                >
                  <el-option
                    v-for="item in shi1"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select
                  clearable
                  no-data-text="请选择区"
                  v-model="listQuery.area"
                  @change="choseBlock"
                  placeholder="区级地区"
                >
                  <el-option
                    v-for="item in qu1"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <el-date-picker
                v-model="time2"
                @change="getTime2"
                type="daterange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <el-button @click="getSearch(2)" type="primary" style="margin-left:20px;">搜 索</el-button>
            </div>
            <el-table
              :data="list2"
              border
              style="width: 973px"
              :header-cell-style="{color:'#333', height:'56px',fontSize:'14px' }"
              v-loading="listLoading2"
            >
              <el-table-column prop="area" label="地区" width="162" align="center"></el-table-column>
              <el-table-column prop="type" label="类型" width="162" align="center"></el-table-column>
              <el-table-column prop="price" label="发放佣金（元)" width="162" align="center"></el-table-column>
              <el-table-column prop="sediment" label="沉淀佣金（元)" width="162" align="center"></el-table-column>
              <el-table-column prop="total_price" label="累计发放佣金（元)" width="162" align="center"></el-table-column>
              <el-table-column prop="total_sediment" label="累计沉淀佣金（元)" width="162" align="center"></el-table-column>
            </el-table>
            <div class="title" style="width: 973px">{{this.thisMonth2}}佣金数据统计</div>
          </div>
        </div>
      </div>
      <!-- 配送费佣金统计数据 -->
      <div id="getoffsetTop" class="userData" style="margin-bottom:35px;">
        <h2 style="font-size:18px;margin-left:30px;">
          配送费佣金统计数据
          <i></i>
        </h2>
        <div class="userData1">
          <div class="search">
            <span>请选择时间</span>
            <el-date-picker
              v-model="time3"
              @change="getTime3"
              type="daterange"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
            <el-button @click="getSearch(3)" type="primary" style="margin-left:20px;">搜 索</el-button>
          </div>
          <el-table
            :data="list3"
            border
            style="width: 811px"
            :header-cell-style="{color:'#333', height:'56px',fontSize:'14px' }"
            v-loading="listLoading3"
          >
            <el-table-column prop="type" label="类型" width="162" align="center"></el-table-column>
            <el-table-column prop="finish_fee" label="发放佣金（元)" width="162" align="center"></el-table-column>
            <el-table-column prop="sediment" label="沉淀佣金（元)" width="162" align="center"></el-table-column>
            <el-table-column prop="total_finish_fee" label="累计发放佣金（元)" width="162" align="center"></el-table-column>
            <el-table-column prop="total_sediment" label="累计沉淀佣金（元)" width="162" align="center"></el-table-column>
          </el-table>
          <div class="title">{{this.thisMonth3}}佣金数据统计</div>
        </div>
        <!-- 间隔线 -->
        <div class="border"></div>
        <div class="userData">
          <div class="userData1">
            <div class="search">
              <!-- <span>请选择时间</span> -->
              <div class="choosetime">
                <el-select
                  clearable
                  v-model="listQuery2.province"
                  @change="choseProvince2"
                  placeholder="省级地区"
                  no-data-text="请选择代理商类型"
                >
                  <el-option
                    v-for="item in province"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select
                  style="margin:0 10px"
                  v-model="listQuery2.city"
                  @change="choseCity2"
                  placeholder="市级地区"
                  no-data-text="请选择省份"
                  clearable
                >
                  <el-option
                    v-for="item in shi1"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select
                  clearable
                  no-data-text="请选择城市"
                  v-model="listQuery2.area"
                  @change="choseBlock2"
                  placeholder="区级地区"
                >
                  <el-option
                    v-for="item in qu1"
                    :key="item.id"
                    :label="item.value"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <el-date-picker
                v-model="time4"
                @change="getTime4"
                type="daterange"
                value-format="timestamp"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <el-button @click="getSearch(4)" type="primary" style="margin-left:20px;">搜 索</el-button>
            </div>
            <el-table
              :data="list4"
              border
              style="width: 973px"
              :header-cell-style="{color:'#333', height:'56px',fontSize:'14px' }"
              v-loading="listLoading4"
            >
              <el-table-column prop="dis_orders" label="地区" width="162" align="center"></el-table-column>
              <el-table-column prop="dis_orders" label="类型" width="162" align="center"></el-table-column>
              <el-table-column prop="deposit_fee" label="发放佣金（元)" width="162" align="center"></el-table-column>
              <el-table-column prop="total_fee" label="沉淀佣金（元)" width="162" align="center"></el-table-column>
              <el-table-column prop="finish_fee" label="累计发放佣金（元)" width="162" align="center"></el-table-column>
              <el-table-column prop="overplus_bro" label="累计沉淀佣金（元)" width="162" align="center"></el-table-column>
            </el-table>
            <div class="title" style="width: 973px">{{this.thisMonth4}}佣金数据统计</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var _ = require('lodash');
var thisMonthVar1,thisMonthVar2,thisMonthVar3,thisMonthVar4;
import axios from "axios";
export default {
  data() {
    return {
      // 列表公共
      page: 1,
      size: 20,
      total: 0,
      listLoading1: true, //loading图标
      listLoading2: true, //loading图标
      listLoading3: true, //loading图标
      listLoading4: true, //loading图标
      list1: [], //表格列表
      list2: [], //表格列表
      list3: [], //表格列表
      list4: [], //表格列表
      info: {}, //详情
      multipleSelection: '', //列表选中字符串
      dialogVisible: false, //弹框
      today: [],
      yesterday: [],
      totals: [],
      user: [],
      listQuery: {//请求接口参数
        create_time: '',
        province: '',
        city: '',
        area: '',
      },
      listQuery2: {//请求接口参数
        create_time: '',
        province: '',
        city: '',
        area: '',
      },
      // 时间控件
      time1: "",
      time2: "",
      time3: "",
      time4: "",
      create_time1: '',
      create_time2: '',
      //////////
      //省市区
      province: [],
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",
      /////////

      thisMonth1: '',
      thisMonth2: '',
      thisMonth3: '',
      thisMonth4: ''
    };
  },
  created() {
    var date = new Date() //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear()
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    this.thisMonth1 = Y + '年' + M + '月份'
    this.thisMonth2 = Y + '年' + M + '月份'
    this.thisMonth3 = Y + '年' + M + '月份'
    this.thisMonth4 = Y + '年' + M + '月份'

    this.getCityData();
    this.getDistributionKanBan();
    this.getUserSpendBro();
    this.getUserSpendBroForArea();
  },
  mounted() {
    window.addEventListener('scroll', this.getScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.getScroll);
  },
  methods: {
    timestampToTime(row, column) {
      var date = new Date(row*1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear()
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
      return Y + '年' + M + '月份'
    },
    /**分销看板 */
    getDistributionKanBan() {
      this.$axios({
        method: 'GET',
        url: '/backend/Distribution/distributionKanBan',
        params: {}
      }).then(res => {
        this.today.push(res.data.data.today_dis_info)
        this.yesterday.push(res.data.data.yesterday_dis_info)
        this.totals.push(res.data.data.total_dis_info)
      })
    },
    /**用户消费佣金统计数据 */
    getUserSpendBro() {
      this.listLoading1 = true
      this.$axios({
        method: 'GET',
        url: '/backend/Distribution/userSpendBro',
        params: { create_time: this.create_time1 }
      }).then(res => {
        this.listLoading1 = false
        res.data.data.area.type = '区代'
        res.data.data.city.type = '市代'
        res.data.data.province.type = '省代'
        res.data.data.terrace.type = '用户消费平台5%'
        res.data.data.user.type = '会员'
        for (let i in res.data.data) {
          this.list1.push(res.data.data[i])
        }
      })
    },
    /**按地区统计用户消费佣金 */
    getUserSpendBroForArea() {
      this.listLoading2 = true
      this.$axios({
        method: 'GET',
        url: '/backend/Distribution/userSpendBroForArea',
        params: this.listQuery
      }).then(res => {
        this.listLoading2 = false
        this.list2 = res.data.data
      })
    },
    /**配送费佣金统计数据 */
    getDeliveryBro() {
      this.listLoading3 = true
      this.$axios({
        method: 'GET',
        url: '/backend/Distribution/deliveryBro',
        params: { create_time: this.create_time2 }
      }).then(res => {
        this.listLoading3 = false
        res.data.data.area.type = '区代'
        res.data.data.city.type = '市代'
        res.data.data.rider_recommend.type = '骑手引荐人'
        res.data.data.terrace.type = '骑手配送费平台5%'
        res.data.data.rider.type = '骑手承包商'
        for (let i in res.data.data) {
          this.list3.push(res.data.data[i])
        }
      })
    },
    /**按地区统计配送费佣金 */
    getDeliveryBroForArea() {
      this.listLoading4 = true
      this.$axios({
        method: 'GET',
        url: '/backend/Distribution/deliveryBroForArea',
        params: this.listQuery2
      }).then(res => {
        this.listLoading4 = false
        this.list4 = res.data.data
      })
    },

    /**选择时间*/
    getTime1(val) {
      this.create_time1 = val[0] / 1000 + '-' + val[1] / 1000
      let time0 = this.timestampToTime(val[0] / 1000)
      let time1 = this.timestampToTime(val[1] / 1000)
      thisMonthVar1 = time0 + '~' + time1
    },
    getTime2(val) {
      this.listQuery.create_time = val[0] / 1000 + '-' + val[1] / 1000
      let time0 = this.timestampToTime(val[0] / 1000)
      let time1 = this.timestampToTime(val[1] / 1000)
      thisMonthVar2 = time0 + '~' + time1
    },
    getTime3(val) {
      this.create_time2 = val[0] / 1000 + '-' + val[1] / 1000
      let time0 = this.timestampToTime(val[0] / 1000)
      let time1 = this.timestampToTime(val[1] / 1000)
      thisMonthVar3 = time0 + '~' + time1
    },
    getTime4(val) {
      this.listQuery2.create_time = val[0] / 1000 + '-' + val[1] / 1000
      let time0 = this.timestampToTime(val[0] / 1000)
      let time1 = this.timestampToTime(val[1] / 1000)
      thisMonthVar4 = time0 + '~' + time1
    },

    /**限制操作频率的函数 */
    getAfter: _.throttle(function () {
      if (!this.list3.length && !this.list4.length) {
        this.getDeliveryBro()
        this.getDeliveryBroForArea()
      }
    }, 10000, { trailing: false }),

    /**监听滚动*/
    getScroll() {
      let height = window.innerHeight;
      let indexNumTop = document.getElementById("getoffsetTop").offsetTop;
      this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (!!document.documentElement.scrollTop && document.documentElement.scrollTop >= indexNumTop - height) {
        this.getAfter()
      }
    },

    /**根据条件搜索 */
    getSearch(e) {
      this[`list${e}`] = []//把原数据清除，再获取新数据
      switch (e) {
        case 1:
          this.thisMonth1 = thisMonthVar1
          this.getUserSpendBro()
          break;
        case 2:
          this.thisMonth2 = thisMonthVar2
          this.getUserSpendBroForArea()
          break;
        case 3:
          this.thisMonth3 = thisMonthVar3
          this.getDeliveryBro()
          break;
        case 4:
          this.thisMonth4 = thisMonthVar4
          this.getDeliveryBroForArea()
          break;
      }
    },
    // 省市区    **************************//
    getCityData() {
      var that = this;
      var url = "./json/map.json";
      axios
        .get(url)
        .then(function (response) {
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
                that.city.push({
                  id: item,
                  value: data[item],
                  children: []
                });
              } else {
                //区
                that.block.push({
                  id: item,
                  value: data[item]
                });
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
        .catch(function (error) {
          console.log(typeof +error);
        });
    },
    // 选省
    choseProvince(e) {
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shi1 = this.province[index2].children;
          this.listQuery.city = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.listQuery.area = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
          this.listQuery.province = this.province[index2].value;
        }
      }
    },
    // 选市
    choseCity(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.listQuery.area = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.listQuery.city = this.city[index3].value;
        }
      }
    },
    // 选区
    choseBlock(e) {
      this.E = e;
      for (var i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.listQuery.area = this.qu1[i].value;
        }
      }
    },
    // 选省
    choseProvince2(e) {
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shi1 = this.province[index2].children;
          this.listQuery2.city = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.listQuery2.area = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
          this.listQuery2.province = this.province[index2].value;
        }
      }
    },
    // 选市
    choseCity2(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.listQuery2.area = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.listQuery2.city = this.city[index3].value;
        }
      }
    },
    // 选区
    choseBlock2(e) {
      this.E = e;
      for (var i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.listQuery2.area = this.qu1[i].value;
        }
      }
    }
    //******************************************** */
  }
};
</script>



<style lang="scss" scoped>
.statistics {
  .board {
    padding: 25px 0 0 30px;
    margin-top: 36px;
    width: 1464px;
    height: 553px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    margin-bottom: 50px;
    .today {
      margin-top: 20px;
    }
    .yesterday {
      margin-top: 30px;
    }
    .total {
      margin-top: 30px;
    }
  }
  .commission {
    .userData {
      padding-top: 25px;
      padding-right: 30px;
      // margin-bottom: 35px;
      width: 1127px;
      // height: 972px;
      box-sizing: border-box;
      // background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(241, 241, 241, 1);
      box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
      border-radius: 4px;
      .border {
        width: 1127px;
        height: 0px;
        border: 5px solid rgba(238, 238, 238, 1);
      }
      .userData1 {
        margin: 25px 0 34px 30px;
        // border-bottom: 6px solid rgba(238, 238, 238, 1);
        .title {
          width: 810px;
          text-align: center;
          margin-top: 15px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          color: rgba(102, 102, 102, 1);
          letter-spacing: 1px;
        }
        .search {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 34px;
          margin-bottom: 23px;
          .choosetime {
            margin-right: 100px;
            height: 33px;
            display: flex;
            // .el-input__inner {
            //   width: 125px;
            // }
          }
          span {
            margin-right: 20px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            color: rgba(51, 51, 51, 1);
            letter-spacing: 1px;
          }
        }
      }
    }
  }
  h2 {
    // width: 200px;
    height: 25px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 25px;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
    i {
      display: block;
      width: 34px;
      height: 2px;
      background: rgba(67, 113, 232, 1);
      border-radius: 1px;
      margin-top: 1px;
    }
    .span {
      margin-right: 5px;
      display: block;
      height: 25px;
      width: 2px;
      background: #4371e8;
      float: left;
    }
  }
}
</style>

<style lang="scss">
.search {
  .choosetime {
    .el-input__inner {
      width: 125px;
    }
  }
}
</style>