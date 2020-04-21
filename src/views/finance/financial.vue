<!--
 * @Description: 财务数据统计
 * @LastEditors: jun
 * @LastEditTime: 2019-11-25 16:50:08
 -->
<template>
  <div class="pageinfo">
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

    <div class="contents">
      <!-- 图标 -->
      <section class="chart-container">
        <el-row>
          <el-col :span="12">
            <div id="chartPie" style="width:100%; height:600px;"></div>
          </el-col>
        </el-row>
      </section>
      <!-- 数据 -->
      <div class="duoinfo_body">
        <el-card class="box-card">
          <h2>
            平台财务流水数据统计
            <i></i>
          </h2>
          <el-row>
            订单收入:
            <span style="color:red">{{info.order_total_fee}}</span>
          </el-row>
          <el-row>
            售后退款:
            <span>{{info.refund_total_fee}}</span>
          </el-row>
          <el-row>
            商家提现:
            <span>{{info.shop_deposit_cash}}</span>
          </el-row>
          <el-row>
            用户佣金提现:
            <span>{{info.user_deposit_cash}}</span>
          </el-row>
          <el-row>
            充值小哥豆:
            <span>{{info.bean_amount}}</span>
          </el-row>
          <el-row>
            骑手提现:
            <span>{{info.rider_deposit_cash}}</span>
          </el-row>
          <el-row>
            保证金:
            <span>{{info.rider_deposit}}</span>
          </el-row>
          <el-row>
            奖金:
            <span>{{info.bonus_amount}}</span>
          </el-row>
          <!-- <div v-for="o in this.info" :key="o" class="text item">{{o}}</div> -->
          <el-row>单位：元</el-row>
        </el-card>
      </div>
    </div>
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
      // 详情页公共
      listLoading: true, //loading图标
      info: {}, //详情
      time: "", //日期组件展示用，重置时要清空
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
          label: "本月"
        },
        {
          value: "4",
          label: "上月"
        }
      ],
      // chartPie: "",
      // starttime: "",
      // endtime: "",
      detailTime: "",
      search_month: "",
      search_month2: "",
      isactive: "本周",
      tpye: "",
      order_total_fee: "", //订单收入
      refund_total_fee: "", //售后退款
      shop_deposit_cash: "", //商家提现
      user_deposit_cash: "", //用户佣金提现
      bean_amount: "", //充值小哥豆
      rider_deposit_cash: "", //骑手提现
      rider_deposit: "", //保证金
      bonus_amount: "" //奖金
    };
  },
  watch: {},
  created() {
    this.getdata(1);
    // this.drawCharts();
  },
  //
  updated() {
    this.drawCharts();
  },

  methods: {
    //点击按钮
    getInfo(item, index) {
      // this.type = index;
      this.type = 0;
      this.search_month = "";
      this.search_month2 = "";
      this.isactive = item;
      // // console.log(value)
      this.getdata(index);
    },
    //选择日期时间段
    getInfo2(val) {
      console.log(val);
      if (val) {
        this.type = 1;
        let a = moment(val[0]).format("YYYY-MM-DD");
        let b = moment(val[1]).format("YYYY-MM-DD");
        this.detailTime = a + "—" + b;
        let star = val[0] / 1000;
        let end = val[1] / 1000;
        this.search_month2 = star + "-" + end;
        this.getdata(5);
        console.log(this.search_month2);
      }
    },
    getdata(index) {
      if (index == 5) {
        this.isactive = "";
      }
      this.$axios({
        method: "GET",
        url: "/backend/FinanceManage/financeStatistic",
        params: {
          search_type: index,
          search_month: this.search_month2
        }
      }).then(res => {
        this.info = res.data.data;
        this.order_total_fee = res.data.data.order_total_fee;
        this.refund_total_fee = res.data.data.refund_total_fee;
        this.shop_deposit_cash = res.data.data.shop_deposit_cash;
        this.user_deposit_cash = res.data.data.user_deposit_cash;
        this.bean_amount = res.data.data.bean_amount;
        this.rider_deposit_cash = res.data.data.rider_deposit_cash;
        this.rider_deposit = res.data.data.rider_deposit;
        this.bonus_amount = res.data.data.bonus_amount;
      });
    },

    //图表@
    drawPieChart() {
      this.chartPie = echarts.init(document.getElementById("chartPie"));
      this.chartPie.setOption({
        title: {
          subtext:
            this.type == 1
              ? `${this.detailTime} 财务扇形统计图`
              : `${this.isactive}财务扇形统计图`,
          x: "center",
          bottom: 80,
          textStyle: {
            fontSize: 24,
            fontWeight: "bolder",
            color: "#333"
          },
          subtextStyle: {
            fontSize: 16,
            color: "#333"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          // orient: "vertical",
          bottom: 5,
          itemWidth: 20, // 设置图例图形的宽
          left: "center",
          data: [
            "订单收入",
            "售后退款",
            "商家提现",
            "用户佣金提现",
            "充值小哥豆",
            "骑手提现",
            "保证金",
            "奖金"
          ]
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: "70%",
            avoidLabelOverlap: true,
            minAngle: 5,
            center: ["50%", "45%"],

            data: [
              { value: this.order_total_fee, name: "订单收入" },
              { value: this.refund_total_fee, name: "售后退款" },
              { value: this.shop_deposit_cash, name: "商家提现" },
              { value: this.user_deposit_cash, name: "用户佣金提现" },
              { value: this.bean_amount, name: "充值小哥豆" },
              { value: this.rider_deposit_cash, name: "骑手提现" },
              { value: this.rider_deposit, name: "保证金" },
              { value: this.bonus_amount, name: "奖金" }
            ],
            // label: { normal: { show: true, position: "outer" } },

            label: {
              normal: {
                formatter(v) {
                  let text = v.name;
                  return text.length < 4
                    ? text
                    : `${text.slice(0, 4)}\n${text.slice(4)}`;
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },true);
    },
    drawCharts() {
      this.drawPieChart();
    }
  }
};
</script>

<style lang="scss" scoped>
.setStatusRow {
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
.contents {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
<style lang="scss">
.pageinfo {
  .chart-container {
    width: 800px;
    // width: fit-content;
    // float: left;
    .el-col {
      width: 75%;
    }
    canvas {
      // width: 500px !important;
    }
  }
  .el-col {
    padding: 30px 20px;
  }
}
</style>