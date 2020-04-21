<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-12 14:59:11
 -->
<template>
  <div class="home-wap">
    <h1 class="home-h1">首页</h1>
    <el-row class="setStatusRow">
      <el-button
        size="medium"
        @click="dealData(item,index)"
        v-for="(item,index) in arrs"
        :key="index"
        :class="isactive==item? 'active': ''"
      >{{item}}</el-button>
      <el-button plain type="primary" @click="goHistory">按日期筛选数据</el-button>
    </el-row>
    <section class="section1">
      <h2 class="home-h2">交易数据统计</h2>
      <ul class="home-ul">
        <li class="home-ul-li">
          <p>今日总收入（元）</p>
          <p>{{dealObject.today_deal}}</p>
          <p>
            <i>较上日</i>
            <i v-show="dealObject.with_yesterday*1>=0"></i>
            <i v-show="dealObject.with_yesterday*1<0"></i>
            <i>{{dealObject.with_yesterday}}</i>
          </p>
        </li>
        <li class="home-ul-li">
          <p>昨日总收入（元）</p>
          <p>{{dealObject.yesterday_deal}}</p>
          <p>
            <i>较上日</i>
            <i v-show="dealObject.with_pre_yesterday*1>=0"></i>
            <i v-show="dealObject.with_pre_yesterday*1<0"></i>
            <i>{{dealObject.with_pre_yesterday}}</i>
          </p>
        </li>
        <li class="home-ul-li">
          <p>上月总收入（元）</p>
          <p>{{dealObject.pre_month_deal}}</p>
          <p>
            <i>较上月</i>
            <i v-show="dealObject.with_two_month_ago*1>=0"></i>
            <i v-show="dealObject.with_two_month_ago*1<0"></i>
            <i>{{dealObject.with_two_month_ago}}</i>
          </p>
        </li>
        <li class="home-ul-li" style=" padding: 25px 0 23px 0;">
          <p>历史总收入（元）</p>
          <p>{{dealObject.total_deal}}</p>
          <p>
            <i></i>
            <i style="display:none;"></i>
            <i style="display:none;"></i>
            <i></i>
          </p>
        </li>
      </ul>
    </section>
    <section class="section2">
      <div class="home-h3">订单数量统计</div>
      <ul class="home-ul2">
        <li class="home-ul2-li2">
          <p>今日交易订单数</p>
          <p>{{finish.today}}</p>
          <p>
            <i>较上日</i>
            <i v-show="finish.with_yesterday*1>=0"></i>
            <i v-show="finish.with_yesterday*1<0"></i>
            <i>{{finish.with_yesterday}}</i>
          </p>
        </li>
        <li class="home-ul2-li2">
          <p>昨日交易订单数</p>
          <p>{{finish.yesterday}}</p>
          <p>
            <i>较上日</i>
            <i v-show="finish.with_pre_yesterday*1>=0"></i>
            <i v-show="finish.with_pre_yesterday*1<0"></i>
            <i>{{finish.with_pre_yesterday}}</i>
          </p>
        </li>
        <li class="home-ul2-li2">
          <p>上月交易订单数</p>
          <p>{{finish.month}}</p>
          <p>
            <i>较上月</i>
            <i v-show="finish.with_pre_month*1>=0"></i>
            <i v-show="finish.with_pre_month*1<0"></i>
            <i>{{finish.with_pre_month}}</i>
          </p>
        </li>
        <li class="home-ul2-li2" style=" padding: 25px 0 23px 0;">
          <p>历史交易订单数</p>
          <p>{{finish.total_order}}</p>
        </li>
      </ul>
      <ul class="home-ul2">
        <li class="home-ul2-li2">
          <p>今日退款订单数</p>
          <p>{{refund.today}}</p>
          <p>
            <i>较上日</i>
            <i v-show="refund.with_yesterday*1>=0"></i>
            <i v-show="refund.with_yesterday*1<0"></i>
            <i>{{refund.with_yesterday}}</i>
          </p>
        </li>
        <li class="home-ul2-li2">
          <p>昨日退款订单数</p>
          <p>{{refund.yesterday}}</p>
          <p>
            <i>较上日</i>
            <i v-show="refund.with_pre_yesterday*1>=0"></i>
            <i v-show="refund.with_pre_yesterday*1<0"></i>
            <i>{{refund.with_pre_yesterday}}</i>
          </p>
        </li>
        <li class="home-ul2-li2">
          <p>上月退款订单数</p>
          <p>{{refund.month}}</p>
          <p>
            <i>较上月</i>
            <i v-show="refund.with_pre_month*1>=0"></i>
            <i v-show="refund.with_pre_month*1<0"></i>
            <i>{{refund.with_pre_month}}</i>
          </p>
        </li>
        <li class="home-ul2-li2">
          <p>历史退款订单数</p>
          <p>{{refund.total_order}}</p>
          <p>
            <i>较上月</i>
            <i v-show="refund.with_yesterday*1>=0"></i>
            <i v-show="refund.with_yesterday*1<0"></i>
            <i>{{refund.with_yesterday}}</i>
          </p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  // components: {
  //   mapgaode
  // },
  data() {
    return {
      isactive: false,
      dealObject: {}, //交易数据统计
      finish: {}, //交易订单数
      refund: {}, //退款订数量统计
      arrs: ["全部", "外卖", "商城", "团购", "到店付", "京东优选"]
    };
  },
  watch: {},
  created() {
    this.dealData("全部", 0);
  },
  methods: {
    dealData(item, index) {
      this.isactive = item;
      this.$axios({
        method: "GET",
        url: "/backend/HomePage/dealData",
        params: {
          order_type: index
        }
      }).then(res => {
        // console.log(res.data.data);
        this.dealObject = res.data.data;
        this.orderData(index);
      });
    },
    orderData(val) {
      this.$axios({
        method: "GET",
        url: "/backend/HomePage/orderNumCount",
        params: {
          order_type: val
        }
      }).then(res => {
        // console.log(res.data.data);
        this.refund = res.data.data.refund;
        this.finish = res.data.data.finish;
      });
    },
    goHistory() {
      this.$router.push({ path: "./history" });
    }
  }
};
</script>

<style lang="scss" scoped>
.home-wap {
  font-family: Microsoft YaHei;
  .home-h1 {
    width: 49px;
    height: 31px;
    font-size: 24px;
    font-weight: bold;
    line-height: 31px;
    color: rgba(51, 51, 51, 1);
  }
  .setStatusRow {
    display: flex;
    margin: 25px 25px 25px 0;
    // .el-button {
    //   width: 102px;
    //   height: 38px;
    //   border-radius: 4px;
    //   text-align: center;
    // }
    .active {
      background: #4371e8;
      color: #fff;
    }
    .el-button:nth-child(6) {
      width: 160px;
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
        width: 210px;
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
        padding: 8px 0 12px 0;

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
            font-size: 0;
            line-height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 7px solid #333;
            margin: 5px auto;
          }
          i:nth-child(3) {
            width: 0;
            height: 0;
            font-size: 0;
            line-height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 7px solid #333;
            margin: 7px auto;
          }
          i:nth-child(4) {
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
        width: 210px;
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
        padding: 8px 0 12px 0;

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
            font-size: 0;
            line-height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 7px solid #333;
            margin: 5px auto;
          }
          i:nth-child(3) {
            width: 0;
            height: 0;
            font-size: 0;
            line-height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 7px solid #333;
            margin: 7px auto;
          }
          i:nth-child(4) {
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
