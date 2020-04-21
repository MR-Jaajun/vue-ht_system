<!--
 * @Description: 分销走势图
 * @Author: Roc
 * @Date: 2019-10-10 14:22:55
 * @LastEditors: Roc
 * @LastEditTime: 2019-11-26 19:01:21
 -->
<template>
  <div class="statistics">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>分销管理</el-breadcrumb-item>
      <el-breadcrumb-item>分销走势图</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 筛选 -->
    <el-row class="setStatusRow">
      <el-button
        size="medium"
        @click="getInfo(item.label,item.value)"
        v-for="(item,index) in selectlist"
        :key="index"
        :class="isactive==item.label? 'active': ''"
      >{{item.label}}</el-button>
      <div class="flex_center">
        <span>请选择时间</span>
        <el-date-picker
          size="medium"
          clearable
          @change="getInfo2"
          format="yyyy 年 MM 月 dd 日"
          v-model="search_month"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <!-- <el-button plain type="primary" @click="goHistory">查询</el-button> -->
    </el-row>

    <!-- 分销数据 -->
    <section class="chart-container" style="margin-top:30px;">
      <h2>分销走势</h2>
      <el-row>
        <el-col :span="12">
          <div id="myChart" style="width: 1300px;height:500px"></div>
        </el-col>
      </el-row>
    </section>
    <!-- 新增人数 -->
    <section class="chart-container">
      <h2>分销走势</h2>
      <el-row>
        <el-col :span="12">
          <div id="myChart2" style="width: 1300px;height:500px"></div>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
import echarts from "echarts";
import moment from "moment";
import "moment/locale/zh-cn";
import { type } from "os";
moment.locale("zh-cn");
export default {
  data() {
    return {
      selectlist: [
        {
          value: "1",
          label: "本周"
        },
        {
          value: "2",
          label: "上周"
        },
        {
          value: "3",
          label: "上月"
        },
        {
          value: "4",
          label: "本月"
        }
      ],
      detailTime: "",
      search_month: "",
      search_month2: "",
      isactive: "本周",
      tpye: "",
      active: true,
      // myChart: "",
      // myChart2: "",
      //分销
      commission_key: [],
      total_fee: [], //产生佣金
      order_total_fee: [], //分销金额
      overplus_bro: [], //剩余佣金
      max2: "",
      choiceDate: "",
      //新增人员
      users_key: [],
      users: [],
      max: ""
      // pickerBeginDateBefore: {
      //   onPick: ({ maxDate, minDate }) => {
      //     this.choiceDate = minDate.getTime();
      //     if (maxDate) {
      //       this.choiceDate = "";
      //     }
      //   },
      //   disabledDate: time => {
      //     if (!isNull(this.choiceDate)) {
      //       const one = 30 * 24 * 3600 * 1000;
      //       const minTime = this.choiceDate - one;
      //       const maxTime = this.choiceDate + one;
      //       return time.getTime() < minTime || time.getTime() > maxTime;
      //     }
      //   }
      // }
    };
  },
  created() {
    this.getdata(1);
  },
  mounted() {
    this.myChart();
    this.myChart2();
  },
  updated() {
    this.myChart();
    this.myChart2();
  },
  methods: {
    //点击按钮
    getInfo(item, index) {
      // this.type = index;
      // if (index <= 2) {
      //   this.active = true;
      // } else {
      //   this.active = false;
      // }
      this.type = 0;
      this.search_month = "";
      this.search_month2 = "";
      this.isactive = item;
      // // console.log(value)
      this.commission_key = [];
      this.total_fee = [];
      this.order_total_fee = [];
      this.overplus_bro = [];
      this.users_key = [];
      this.users = [];
      this.getdata(index);
    },
    //选择日期时间段
    getInfo2(val) {
      console.log(val);
      if (val) {
        this.isactive = "";
        // this.active = false;
        this.type = 1;
        let a = moment(val[0]).format("YYYY-MM-DD");
        let b = moment(val[1]).format("YYYY-MM-DD");
        this.detailTime = a + "—" + b;
        let star = val[0] / 1000;
        let end = val[1] / 1000;
        this.search_month2 = star + "-" + end;
        this.getdata("");
        // console.log(this.search_month2);
      }
    },

    getdata(index) {
      if (!index) {
        this.isactive = "";
      }
      this.$axios({
        method: "GET",
        url: "/backend/Distribution/userBroTrend",
        params: {
          this_week: index,
          create_time: this.search_month2
        }
      }).then(res => {
        console.log(res);
        //新增人员
        this.users_key = res.data.data.date;
        res.data.data.users.forEach(item => {
          this.users.push(item.total_user);
        });
        let arr = JSON.parse(JSON.stringify(this.users));
        this.sorts(arr);
        this.max = arr[0];
        // console.log(max, "最大值");
        //分销金额
        this.commission_key = res.data.data.date;
        res.data.data.commission.forEach(item => {
          this.total_fee.push(item.total_fee);
          this.order_total_fee.push(item.order_total_fee);
          this.overplus_bro.push(item.overplus_bro);
        });
       
        let arr2 = JSON.parse(JSON.stringify(this.order_total_fee));
        this.sorts(arr2);
        this.max2 = arr2[0];
        this.myChart();
        this.myChart2();
        // this.showChart();
        // console.log(this.users);
      });
    },
    //数组排序
    sorts(arr) {
      arr.sort(function(a, b) {
        return b - a;
      });
    },
    //分销走势
    myChart() {
      let myChart = echarts.init(document.getElementById("myChart"));
      myChart.setOption(
        {
          title: {
            text: "订单数据统计",
            // subtext: "模拟数据",
            x: "center",
            bottom: -6,
            textStyle: {
              fontSize: 20,
              fontWeight: "500",
              color: "#000"
            }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985"
              }
            }
          },
          legend: {
            orient: "horizontal",
            data: ["分销金额", "产生佣金", "剩余佣金"],
            x: "right"
          },
          //是否下载
          // toolbox: {
          //   feature: {
          //     saveAsImage: {}
          //   }
          // },
          grid: {
            left: "6%",
            right: "4%",
            // bottom: "10%",
            bottom: "13%",
            containLabel: false
          },
          xAxis: [
            {
              // axisLabel: {
              //   rotate: 0, // 旋转角度
              //   interval: this.active ? 0 : 2 //设置X轴数据间隔几个显示一个，为0表示都显示
              // },
              axisLine: { onZero: false },
              type: "category",
              boundaryGap: false,
              data: this.commission_key
            }
          ],
          yAxis: [
            {
              min: 0,
              max: this.max2 * 1 + 300, // 设置y轴刻度的最大值
              splitNumber: 6, // 设置y轴刻度间隔个数
              type: "value"
            }
          ],
          series: [
            {
              name: "剩余佣金",
              type: "line",
              stack: "总量",
              smooth: 0.5,
              areaStyle: {},
              data: this.overplus_bro,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0.7, color: "#6384EC" }
                    // { offset: 0.66, color: "#1268E6" }
                  ])
                }
              }
            },
            {
              name: "产生佣金",
              type: "line",
              symbol: "circle",
              stack: "总量",
              areaStyle: {},
              smooth: 0.5,
              data: this.total_fee,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0.7, color: "#7265EA" }
                    // { offset: 0.66, color: "#1268E6" }
                  ])
                }
              }
            },
            {
              name: "分销金额",
              type: "line",
              stack: "总量",
              areaStyle: {},
              smooth: 0.5,
              data: this.order_total_fee,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0.7, color: "#BA8DFF" }
                    // { offset: 0.66, color: "#1268E6" }
                  ])
                }
              }
            }
          ]
          // color: ["#335EDE", "#7265EA", "#BA8DFF"]
        },
        true
      );
    },
    //新增人数
    myChart2() {
      let myChart2 = echarts.init(document.getElementById("myChart2"));
      myChart2.setOption(
        {
          title: {
            text: `${this.isactive}分销走势曲线统计图`,
            x: "center",
            bottom: -6,
            textStyle: {
              fontSize: 20,
              fontWeight: "500",
              color: "#000"
            }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985"
              }
            }
          },
          legend: {
            orient: "horizontal",
            data: ["新增分销员数"],
            x: "right"
          },
          grid: {
            left: "6%",
            right: "4%",
            bottom: "13%",
            containLabel: false
          },
          xAxis: [
            {
              // axisLabel: {
              //   rotate: 0, // 旋转角度
              //   interval: this.active ? 0 : 2 //设置X轴数据间隔几个显示一个，为0表示都显示
              // },
              axisLine: { onZero: false },
              type: "category",
              boundaryGap: false,
              data: this.users_key
            }
          ],
          yAxis: [
            {
              min: 0,
              max: this.max + 10, // 设置y轴刻度的最大值
              splitNumber: 4, // 设置y轴刻度间隔个数
              type: "value"
            }
          ],
          series: [
            {
              name: "新增分销员数",
              type: "line",
              stack: "总量",
              smooth: 0.5,
              areaStyle: {},
              data: this.users
              // lineStyle: {
              //   width: 5, // 设置线宽
              //   type: "solid" //'dotted'虚线 'solid'实线
              // }
            }
          ],
          color: ["#70A5DC"]
        },
        true
      );
    }
    // //调用图标
    // showChart() {
    //   this.myChart();
    //   this.myChart2();
    // }
  }
};
</script>
<style lang="scss" scoped>
.setStatusRow {
  margin-top: 20px;
  display: flex;
  // float: left;
  .active {
    background: #4371e8;
    color: #fff;
  }
}
.flex_center {
  margin: 0 20px 0 100px;
  span {
    margin-right: 20px;
  }
}
.box-card {
  width: fit-content;
  min-width: 480px;
  margin: 40px 40px 0 0;
  .el-row {
    font-size: 16px;
    margin-bottom: 22px;
    span {
      margin-left: 10px;
    }
    &:last-of-type {
      color: #999;
      transform: translate(0px, 18px);
      text-align: right;
    }
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.chart-container {
  margin-bottom: 100px;
  position: relative;
  h2 {
    font-size: 24px;
    font-weight: bold;
    position: absolute;
    color: #333;
    left: 30px;
    top: 10px;
  }
}
</style>
<style lang="scss">
.statistics {
  .chart-container {
    width: 800px;
    // width: fit-content;
    // float: left;
  }
  .el-col {
    padding: 30px 20px;
  }
}
</style>
