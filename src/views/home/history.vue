<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-12 15:00:13
 -->
<template>
  <div class="home-wap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>历史数据统计</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="home-h1">历史数据统计</h1>
    <el-row class="setStatusRow">
      <el-button
        size="medium"
        @click="dealData(item,index)"
        v-for="(item,index) in arrs"
        :key="index"
        :class="isactive==item? 'active': ''"
      >{{item}}</el-button>
    </el-row>
    <el-row class="setStatusRow">
      <span style="margin-right:20px;">请选择时间</span>
      <el-date-picker
        value-format="timestamp"
        v-model="timeValue"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="changeTime"
      ></el-date-picker>
      <el-button type="primary" plain @click="getsearch" style="margin-left:20px;">查询</el-button>
    </el-row>
    <section class="section1">
      <h2 class="home-h2">交易数据统计</h2>
      <ul class="home-ul">
        <li class="home-ul-li">
          <p>{{starttime}}~{{endtime}}总收入(元)</p>
          <p>{{dealObject.interval_deal}}</p>
        </li>
        <li class="home-ul-li" style=" width: 210px; padding: 25px 0 23px 0;">
          <p>历史总收入（元)</p>
          <p>{{dealObject.total_deal}}</p>
        </li>
      </ul>
    </section>
    <section class="section2">
      <div class="home-h3">订单数量统计</div>
      <ul class="home-ul2">
        <li class="home-ul2-li2">
          <p>{{this.starttime}}~{{this.endtime}}总收入(元)</p>
          <p>{{dealObject.interval_order_count}}</p>
        </li>
        <li class="home-ul2-li2" style=" width: 210px; padding: 25px 0 23px 0;">
          <p>历史交易订单数</p>
          <p>{{dealObject.total_order_count}}</p>
        </li>
      </ul>
      <ul class="home-ul2">
        <li class="home-ul2-li2">
          <p>{{starttime}}~{{endtime}}退款订单数</p>
          <p>{{dealObject.interval_refund_count}}</p>
        </li>
        <li class="home-ul2-li2" style=" width: 210px; padding: 25px 0 23px 0;">
          <p>历史退款订单数</p>
          <p>{{dealObject.total_refund_count}}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  data() {
    return {
      isactive: false,
      dealObject: {}, //交易数据统计
      orderObject: {}, //订单数量统计
      timeValue: "",
      getTime: "",
      arrs: ["全部", "外卖", "商城", "团购", "到店付", "京东优选"],
      starttime: "", //当月开始时间
      endtime: "", //当月结束时间
      num: "",
      startTime_val: "",
      endTime_val: ""
    };
  },
  watch: {},
  created() {
    this.dealData("全部", 0);
    this.time();
  },
  methods: {
    // 获取数据
    dealData(item, index) {
      this.isactive = item;
      this.num = index;
      this.$axios({
        method: "GET",
        url: "/backend/HomePage/dealHistoryData",
        params: {
          order_type: index,
          create_time: this.getTime
        }
      }).then(res => {
        this.dealObject = res.data.data;
      });
    },
    // 时间转化时间戳
    changeTime(val) {
      console.log(val, "时间戳");
      this.startTime_val = val[0];
      this.endTime_val = val[1];
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.getTime = startTime + "-" + endTime;
    },
    //获取当前时间
    time() {
      this.starttime = moment(
        moment()
          .month(moment().month())
          .startOf("month")
      ).format("YYYY年MM月DD日");
      this.endtime = moment().format("YYYY年MM月DD日");
    },
    getsearch() {
      this.dealData(this.isactive, this.num);
      this.starttime = moment(this.startTime_val).format("YYYY年MM月DD日");
      this.endtime = moment(this.endTime_val).format("YYYY年MM月DD日");
    }
  }
};
</script>

<style lang="scss" scoped>
.home-wap {
  font-family: Microsoft YaHei;
  .home-h1 {
    // width: 49px;
    height: 31px;
    font-size: 24px;
    font-weight: bold;
    line-height: 31px;
    color: rgba(51, 51, 51, 1);
    margin-top: 10px;
  }
  .setStatusRow {
    display: flex;
    margin: 25px 25px 25px 0;
    line-height: 32px;
    .active {
      background: #4371e8;
      color: #fff;
    }
  }
  .section1 {
    display: flex;
    flex-direction: column;
    .home-h2 {
      margin-top: 20px;
      width: 128px;
      height: 26px;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 26px;
      color: rgba(51, 51, 51, 1);
    }
    .home-ul {
      .home-ul-li {
        float: left;
        width: 330px;
        height: 113px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(241, 241, 241, 1);
        box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
        opacity: 1;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        margin: 20px 20px 36px 0;
        padding: 20px 0 23px 0;

        p:nth-child(1) {
          // width: 112px;
          height: 19px;
          font-size: 14px;
          font-weight: 400;
          line-height: 19px;
          text-align: left;
          color: rgba(51, 51, 51, 1);
        }
        p:nth-child(2) {
          // width: 89px;
          height: 37px;
          font-size: 28px;
          font-weight: 400;
          line-height: 37px;
          text-align: left;
          color: rgba(51, 51, 51, 1);
        }
        p:nth-child(3) {
          // width: 92px;
          height: 19px;
          display: flex;
          i:nth-child(1) {
            // width: 42px;
            // height: 19px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 19px;
            color: rgba(102, 102, 102, 1);
          }
          i:nth-child(2) {
            width: 0;
            height: 0;
            border-width: 0 5px 7px;
            border-style: solid;
            border-color: transparent transparent #333; /*透明 透明  灰*/
            margin: 5px auto;
          }
          i:nth-child(3) {
            // width: 36px;
            // height: 19px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 19px;
            color: rgba(51, 51, 51, 1);
          }
        }
      }
    }
  }
  .section2 {
    display: flex;
    flex-direction: column;
    .home-h3 {
      width: 128px;
      height: 26px;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 26px;
      color: rgba(51, 51, 51, 1);
    }

    .home-ul2 {
      .home-ul2-li2 {
        float: left;
        width: 330px;
        height: 113px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(241, 241, 241, 1);
        box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
        opacity: 1;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        margin: 20px 20px 20px 0;
        padding: 20px 0 23px 0;

        p:nth-child(1) {
          // width: 112px;
          height: 19px;
          font-size: 14px;
          font-weight: 400;
          line-height: 19px;
          color: rgba(51, 51, 51, 1);
        }
        p:nth-child(2) {
          // width: 89px;
          height: 37px;
          font-size: 28px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 37px;
          color: rgba(51, 51, 51, 1);
        }
        p:nth-child(3) {
          // width: 92px;
          height: 19px;
          display: flex;

          i:nth-child(1) {
            // width: 42px;
            // height: 19px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 19px;
            color: rgba(102, 102, 102, 1);
          }
          i:nth-child(2) {
            width: 0;
            height: 0;
            border-width: 0 5px 7px;
            border-style: solid;
            border-color: transparent transparent #333; /*透明 透明  灰*/
            margin: 5px auto;
          }
          i:nth-child(3) {
            // width: 36px;
            // height: 19px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 19px;
            color: rgba(51, 51, 51, 1);
          }
        }
      }
    }
  }
}
</style>
