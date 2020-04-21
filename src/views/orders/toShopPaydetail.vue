<!--
 * @Author: your name
 * @Date: 2019-11-08 09:51:39
 * @LastEditTime: 2019-12-12 14:47:19
 * @LastEditors: Roc
 * @Description: In User Settings Edit
 * @FilePath: \xiaoGe2_main_CMS\src\views\orders\toShopPaydetail.vue
 -->
<template>
  <!-- 到店付详情 -->
  <div class="toShopPaydetail">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>到店付订单列表</el-breadcrumb-item>
      <el-breadcrumb-item>到店付订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>到店付订单详情</h1>
    <!-- 订单详情 -->
    <div class="order_detail common">
      <h2>
        订单信息
        <i></i>
      </h2>
      <div class="table">
        <div style>
          <p>订单号</p>
          <p>{{obj.payment_id}}</p>
        </div>
        <div>
          <p>下单时间</p>
          <p>{{obj.create_time}}</p>
        </div>
        <div>
          <p>实付金额</p>
          <p>{{obj.cur_money}}</p>
        </div>
        <div>
          <p>支付流水号</p>
          <p>{{obj.trade_no?obj.trade_no:'/'}}</p>
        </div>
        <div style="border-right:1px solid #cccccc">
          <p>支付方式</p>
          <p>{{obj.pay_name}}</p>
        </div>
      </div>
    </div>
    <!-- 用户详情 -->
    <div class="user_detail common">
      <h2>
        用户信息
        <i></i>
      </h2>
      <div class="table">
        <!-- <div>
          <p>收货人姓名</p>
          <p>{{obj.contacts}}</p>
        </div>-->
        <div>
          <p>昵称</p>
          <p>{{obj.nick_name}}</p>
        </div>
        <div>
          <p>用户ID</p>
          <p>{{obj.custom_uid}}</p>
        </div>
        <div>
          <p>手机号</p>
          <p>{{obj.mobile}}</p>
        </div>
        <div style="border-right:1px solid #cccccc">
          <p>会员等级</p>
          <p v-show="obj.vip_level==1">小哥粉</p>
          <p v-show="obj.vip_level==2">小哥</p>
          <p v-show="obj.vip_level==3">小V哥</p>
          <p v-show="obj.vip_level==4">V哥</p>
        </div>
      </div>
    </div>
    <!-- 商家和店铺信息 -->
    <div class="shop_detail common">
      <h2>
        商家和店铺信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>店铺ID</span>
          <span>{{obj.shop_id}}</span>
        </li>
        <li>
          <span>联系人</span>
          <span>{{obj.contacts}}</span>
        </li>
        <li>
          <span>联系人手机号</span>
          <span>{{obj.contact_information}}</span>
        </li>
        <li>
          <span>店铺信息</span>
          <span>{{obj.shop_title}}</span>
        </li>
        <li>
          <span>店铺地址</span>
          <span>{{obj.province}}{{obj.city}}{{obj.area}}{{obj.address}}</span>
        </li>
      </div>
    </div>
    <!-- 订单分佣明细-->
    <div class="common3 common" v-if="commissionOrder.deposit_fee">
      <h5>订单预估收益（不包括配费）</h5>
      <h5>
        <span>平台沉淀总金额：</span>
        <span style="color:red">{{commissionOrder.total_sediment}}元</span>
      </h5>
      <h5>
        <span>店铺经营品类抽佣金额：</span>
        <span>订单金额*店铺抽佣比例={{commissionOrder.deposit_fee*1+ commissionOrder.revenue_price*1}}元</span>
      </h5>
      <h5>
        <span>可分配的利润：</span>
        <span>店铺抽佣金额*平台税率={{commissionOrder.deposit_fee}}元</span>
      </h5>
      <div style="float:left; margin-top: 15px; ">
        <li>
          <span>会员直推：</span>
          <span>分配金额：可分配的利润*分配比例= {{commissionOrder.first_price}}元</span>
          <span>沉淀金额：{{commissionOrder.first_sediment}}元</span>
        </li>
        <li>
          <span>省级代理商：</span>
          <span>分配金额：可分配的利润*分配比例={{commissionOrder.province_price}}元</span>
          <span>沉淀金额：{{commissionOrder.province_sediment}}元</span>
        </li>
        <li>
          <span>市级代理商：</span>
          <span>分配金额：可分配的利润*分配比例={{commissionOrder.city_price}}元</span>
          <span>沉淀金额：{{commissionOrder.city_sediment}}元</span>
        </li>
        <li>
          <span>区级代理商：</span>
          <span>分配金额：可分配的利润*分配比例={{commissionOrder.area_price}}元</span>
          <span>沉淀金额：{{commissionOrder.area_sediment}}元</span>
        </li>
      </div>
      <div style="float:right; margin-top: 15px;">
        <li>
          <span>自消费金额：</span>
          <span>分配金额：可分配的利润*分配比例={{commissionOrder.self_buy_price}}元</span>
          <span>沉淀金额：{{commissionOrder.self_buy_sediment}}元</span>
        </li>
        <li>
          <span>会员间推：</span>
          <span>分配金额：可分配的利润*分配比例={{commissionOrder.second_price}}元</span>
          <span>沉淀金额：{{commissionOrder.second_sediment}}元</span>
        </li>
        <li>
          <span>商家引荐人金额：</span>
          <span>分配金额：可分配的利润*分配比例={{commissionOrder.store_recommend_price}}元</span>
          <span>沉淀金额：{{commissionOrder.store_recommend_sediment}}元</span>
        </li>
        <li>
          <span>平台抽佣金：</span>
          <span>分配金额：可分配的利润*分配比例={{commissionOrder.terrace}}元</span>
          <span>沉淀金额：{{commissionOrder.terrace}}元</span>
        </li>
      </div>
    </div>
    <!-- 返回上一页 -->
    <div class="btn">
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      oid: "",
      obj: {},
      commissionOrder: {} //订单预估收益（不包括配费）
    };
  },
  created() {
    this.oid = this.$route.query.o_id;
    this.payOrderDetail();
    this.commissionData();
  },
  methods: {
    backdown() {
      this.$router.go(-1);
    },
    //到店订单详情 /backend/Order/payOrderDetail
    payOrderDetail() {
      this.$axios({
        method: "GET",
        url: "/backend/Order/payOrderDetail",
        params: {
          order_id: this.oid
        }
      }).then(res => {
        console.log(res);
        this.obj = res.data.data;
      });
    },
    //订单分佣明细
    commissionData() {
      this.$axios({
        method: "GET",
        url: "/backend/Order/orderPayCommissionDetail",
        params: {
          order_id: this.oid
        }
      }).then(res => {
        if (res.data.code == "200") {
          this.commissionOrder = res.data.data.commissionOrder;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.toShopPaydetail {
  h1 {
    margin: 10px 0 35px 0;
    height: 29px;
    font-size: 22px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  .common {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
  }
  .user_detail {
    width: fit-content;
    height: 221px;
    margin-bottom: 40px;
  }
  .order_detail {
    width: fit-content;
    height: 221px;
    margin-bottom: 40px;
  }
  .shop_detail {
    width: fit-content;
    //   height:280px;
  }
  .table {
    // border-right: 1px solid #cccccc;
    display: flex;
    // width: 790px;
    align-items: center;
    justify-content: flex-start;
    & > div {
      width: fit-content;
      height: 125px;
      border: 1px solid #cccccc;
      border-right: none;
      border-bottom: none;
      display: flex;
      flex-direction: column;

      p {
        width: 100%;
        height: 50%;
        min-width: 180px;
        border-bottom: 1px solid #cccccc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 400;
        padding: 15px;
        color: rgba(102, 102, 102, 1);
        &:nth-child(2) {
          font-size: 16px;
        }
      }
    }
  }
  h2 {
    // width: 91px;
    height: 29px;
    font-size: 22px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
    margin-bottom: 26px;
    i {
      display: block;
      width: 34px;
      height: 2px;
      background: rgba(67, 113, 232, 1);
      border-radius: 1px;
      margin-top: 1px;
    }
  }
  .common2 li {
    // height: 21px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 20px;
    line-height: 21px;
  }
  .common2 li span:nth-child(1) {
    width: 110px;
    text-align: left;
    color: #666;
    font-size: 16px;
    margin-right: 20px;
  }
  .common2 li span:nth-child(2) {
    color: #333;
    font-size: 16px;
    //订单信息
  }
  .btn {
    display: flex;
    margin: 40px 0;
  }
  //订单分佣明细
  .centRMB {
    margin-top: 40px;
    width: 1615px;
    height: 666px;
  }
  .common3 {
    margin-top: 20px;
    width: 765px;
    height: 522px;
    padding: 25px;
    h5 {
      height: 28px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 500;
      line-height: 28px;
      margin-bottom: 10px;
      color: rgba(16, 16, 16, 1);
    }
    li {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-bottom: 20px;
      line-height: 21px;
      & span:nth-child(1) {
        // width: 140px;
        text-align: left;
        color: #333;
        font-size: 16px;
        margin-right: 20px;
      }
      & span:nth-child(2) {
        color: #333;
        font-size: 16px;
      }
      & span:nth-child(3) {
        color: #333;
        font-size: 16px;
      }
    }
  }
}
</style>
