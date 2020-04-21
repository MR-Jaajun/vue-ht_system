<!--
 * @Description: 订单详情
 * @Author: jun
 * @Date: 2019-09-12 19:39:53
 * @LastEditors: Roc
 * @LastEditTime: 2019-12-06 12:02:34
 -->

<template>
  <div class="orderdetail">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item to="./order">外卖订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>订单详情</h1>
    <!-- 订单信息 -->
    <div class="orderinfo common">
      <h2>
        订单信息
        <i></i>
      </h2>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{color:'#666', height:'63px',fontSize:'16px' }"
      >
        <el-table-column prop="order_bn" label="订单号" width="153" align="center"></el-table-column>
        <el-table-column prop="self_pick" label="订单类型" width="147" align="center">
          <template slot-scope="{row}">
            <span v-show="row.self_pick==0">配送</span>
            <span v-show="row.self_pick==1">自取</span>
          </template>
        </el-table-column>
        <el-table-column prop="delivery_service" label="配送类型" width="147" align="center">
          <template slot-scope="{row}">
            <span v-show="row.delivery_service==1">商家配送</span>
            <span v-show="row.delivery_service==2">小哥配送</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_status" label="订单状态" width="147" align="center">
          <template slot-scope="{row}">
            <span v-show="row.order_status==1">待付款</span>
            <span v-show="row.order_status==2">已支付</span>
            <span v-show="row.order_status==3">配送中</span>
            <span v-show="row.order_status==5">已完成</span>
            <span v-show="row.order_status==-1">已取消</span>
            <span v-show="row.order_status==8">待取货</span>
            <span v-show="row.order_status==9">商家已接单</span>
          </template>
        </el-table-column>
        <el-table-column prop="goods_fee" label="订单金额" width="147" align="center"></el-table-column>
        <el-table-column prop="delivery_fee" label="配送费" width="147" align="center"></el-table-column>
        <el-table-column prop="discount_fee" label="优惠金额" width="147" align="center"></el-table-column>
        <el-table-column prop="total_fee" label="实付金额" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 用户和骑手 -->
    <div class="u_r">
      <div class="userinfo common">
        <h2>
          用户信息
          <i></i>
        </h2>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :header-cell-style="{color:'#666', height:'63px',fontSize:'16px' }"
        >
          <el-table-column prop="receiver_name" label="收货人姓名" width="147" align="center"></el-table-column>
          <el-table-column prop="nick_name" label="昵称" width="147" align="center"></el-table-column>
          <el-table-column prop="custom_uid" label="用户ID" width="147" align="center"></el-table-column>
          <el-table-column prop="receiver_mobile" label="手机号" width="147" align="center"></el-table-column>
          <el-table-column prop="vip_level" label="会员等级" align="center">
            <template slot-scope="{row}">
              <span v-show="row.vip_level==0">小哥粉</span>
              <span v-show="row.vip_level==1">小哥</span>
              <span v-show="row.vip_level==2">小V哥</span>
              <span v-show="row.vip_level==3">V哥</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="disinfo common">
        <h2>
          派送信息
          <i></i>
        </h2>
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :header-cell-style="{color:'#666', height:'63px',fontSize:'16px' }"
        >
          <el-table-column prop="receiver_name" label="收货人姓名" width="147" align="center"></el-table-column>
          <el-table-column prop="receiver_mobile" label="手机号码" width="147" align="center"></el-table-column>
          <el-table-column prop="addRess" label="收货地址" width="147" align="center"></el-table-column>
          <el-table-column prop="receiver_address" label="详细地址" width="147" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 支付 -->
    <div class="pay_info common" v-show="payinfo.length">
      <h2>
        支付信息
        <i></i>
      </h2>
      <el-table
        :data="payinfo"
        border
        style="width: 100%"
        :header-cell-style="{color:'#666', height:'63px',fontSize:'16px' }"
      >
        <el-table-column prop="payment_id" label="支付流水账号" width="180" align="center"></el-table-column>
        <el-table-column prop="pay_name" label="支付方式" width="150" align="center"></el-table-column>
        <el-table-column prop="payment" label="支付金额" align="center" width="150"></el-table-column>
      </el-table>
    </div>
    <!-- 配送 -->
    <div class="distribution" v-if="self_pick==0&&delivery_service==2&&order_status>2">
      <div class="riderinfo common" v-show="rider_info.length<=1">
        <h2>
          骑手信息
          <i></i>
        </h2>
        <el-table
          :data="rider_info"
          border
          style="width: 100%"
          :header-cell-style="{color:'#666', height:'63px',fontSize:'16px' }"
        >
          <el-table-column prop="rider_name" label="骑手姓名" width="147" align="center"></el-table-column>
          <el-table-column prop="rider_mobile" label="联系电话" align="center"></el-table-column>
        </el-table>
      </div>
      <!-- v-show="rider_info.length>1" -->
      <div class="changedisinfo common" v-show="rider_info.length>1">
        <h2>
          改派信息
          <i></i>
        </h2>
        <el-table
          :data="rider_info"
          border
          style="width:100%"
          :header-cell-style="{color:'#666', height:'63px',fontSize:'16px' }"
        >
          <el-table-column prop="rider_name" label="改派人姓名" width="147" align="center"></el-table-column>
          <el-table-column prop="rider_mobile" label="联系电话" width="147" align="center"></el-table-column>
          <el-table-column prop="problem" label="报备原因" align="center" width="200"></el-table-column>
          <el-table-column prop="problem" label="报备图片" align="center" width="280">
            <template slot-scope="{row}">
              <div class="imgarr">
                <a
                  v-for="(item,i) in row.problem_imgs"
                  :href="item"
                  :key="i"
                  target="_blank"
                ><img:src="item" /></a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 备注 -->
    <div class="noteinfo common" v-show="remark || shop_remark">
      <h2>
        备注信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>买家备注</span>
          <span>{{remark}}</span>
        </li>
        <li>
          <span>商家备注</span>
          <span>{{shop_remark}}</span>
        </li>
      </div>
    </div>
    <!-- 发票 -->
    <div class="invoiceinfo common" v-show="receipt>0">
      <h2>
        发票信息
        <i></i>
      </h2>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{color:'#666', height:'63px',fontSize:'16px' }"
      >
        <el-table-column prop="date" label="类型" width="147" align="center">
          <template slot-scope="{row}">
            <span v-show="!row.receipt_tax">企业发票</span>
            <span v-show="row.receipt_tax">个人发票</span>
          </template>
        </el-table-column>
        <el-table-column prop="receipt_title" label="抬头" width="147" align="center"></el-table-column>
        <el-table-column prop="receipt_tax" label="税号" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 商家和店铺信息 -->
    <div class="shopinfo common">
      <h2>
        商家和店铺信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>店铺ID</span>
          <span>{{shop_id}}</span>
        </li>
        <li>
          <span>店铺地址</span>
          <span>{{shop_address}}</span>
        </li>
        <li>
          <span>店铺信息</span>
          <span>{{shop_title}}</span>
        </li>
        <li>
          <span>联系人手机号</span>
          <span>{{contacts}}</span>
        </li>
      </div>
    </div>
    <!-- 商品信息 -->
    <div class="goodsinfo">
      <h2>
        商品信息
        <i></i>
      </h2>
      <el-table
        highlight-current-row
        :data="goodslist"
        style="width: 100%"
        :header-cell-style="{color:'#333', height:'63px',fontSize:'16px',fontWeight:'800',background:'#EAEBEF' }"
      >
        <el-table-column type="index" label="序号" width="147" align="center"></el-table-column>
        <el-table-column prop="goods_title" label="商品" width="147" align="center"></el-table-column>
        <el-table-column prop="sale_price" label="单价(元)" align="center"></el-table-column>
        <el-table-column prop="goods_num" label="数量" align="center"></el-table-column>
        <el-table-column prop="total" label="小计(元)" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 订单进度 -->
    <div class="schedule common">
      <h2>
        订单进度
        <i></i>
      </h2>
      <div class="common2" style="float:left">
        <li>
          <span>下单时间</span>
          <span>{{create_time}}</span>
        </li>
        <li>
          <span>支付时间</span>
          <span>{{pay_date}}</span>
        </li>
        <li>
          <span>商家接单时间</span>
          <span>{{deal_date}}</span>
        </li>
        <li>
          <span>派单时间</span>
          <span>{{sendtime}}</span>
        </li>
        <li>
          <span>骑手接单时间</span>
          <span>{{receive_date}}</span>
        </li>
        <li v-show="hall_date">
          <span>骑手丢单时间</span>
          <span>{{hall_date}}</span>
        </li>
        <li v-show="hall_date">
          <span>骑手接单时间</span>
          <span>{{receive_date}}</span>
        </li>
      </div>
      <div class="common2" style="float:right">
        <li v-show="arrival_date">
          <span>骑手到店时间</span>
          <span>{{arrival_date}}</span>
        </li>
        <li v-show="pickup_date">
          <span>骑手取货时间</span>
          <span>{{pickup_date}}</span>
        </li>
        <li v-show="finish_date">
          <span>骑手送达时间</span>
          <span>{{finish_date}}</span>
        </li>
        <li v-show="finish_date">
          <span>订单完成时间</span>
          <span>{{finish_date}}</span>
        </li>
      </div>
    </div>
    <!-- 订单分佣明细-->
    <div class="centRMB">
      <h2>
        订单分佣明细
        <i></i>
      </h2>
      <div class="common3 common" style="float:left" v-if="commissionOrder">
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
      <div class="common3 common" style="float:right" v-if="commissionRider">
        <h5>配送预估收益</h5>
        <h5>
          <span>平台沉淀总金额：</span>
          <span style="color:red">{{commissionRider.total_sediment}}元</span>
        </h5>
        <div style="float:left; margin-top: 15px;">
          <li>
            <span>骑手承包商：</span>
            <span>分配金额：可分配的利润*分配比例={{commissionRider.contractor_price}}元</span>
            <span>沉淀金额：{{commissionRider.contractor_sediment}}元</span>
          </li>
          <li>
            <span>市级代理商：</span>
            <span>分配金额：可分配的利润*分配比例={{commissionRider.total_sediment}}元</span>
            <span>沉淀金额：{{commissionRider.total_sediment}}元</span>
          </li>
          <li>
            <span>区级代理商：</span>
            <span>分配金额：可分配的利润*分配比例={{commissionRider.total_sediment}}元</span>
            <span>沉淀金额：{{commissionRider.total_sediment}}元</span>
          </li>
        </div>
        <div style="float:right; margin-top: 15px;">
          <li>
            <span>骑手承引荐人：</span>
            <span>分配金额：可分配的利润*分配比例={{commissionRider.rider_recommend_price}}元</span>
            <span>沉淀金额：{{commissionRider.rider_recommend_sediment}}元</span>
          </li>
          <li>
            <span>平台抽佣金额：</span>
            <span>分配金额：可分配的利润*分配比例={{commissionRider.terrace}}元</span>
            <span>沉淀金额：{{commissionRider.terrace}}元</span>
          </li>
        </div>
      </div>
    </div>
    <!-- 返回 -->
    <el-button plain @click="backdown">返回上一页</el-button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      commissionOrder: {}, //订单预估收益（不包括配费）
      commissionRider: {}, //配送预估收益
      tableData: [],
      ids: "",
      payinfo: [],
      remark: "",
      shop_remark: "",
      receipt: "", //发票
      shop_id: "",
      shop_title: "",
      contacts: "",
      shop_address: "",
      goodslist: [], //商品信息,
      rider_info: [], //骑手信息
      self_pick: "",
      delivery_service: "",
      order_status: "",
      //订单各种事件状态
      sendtime: "", //派单时间
      create_time: "",
      pay_date: "",
      deal_date: "",
      finish_date: "",
      receive_date: "",
      hall_date: "",
      arrival_date: "",
      pickup_date: ""
    };
  },
  watch: {
    rider_info() {
      console.log(this.rider_info, "骑手信息");
    }
  },
  created() {
    // this.ids = sessionStorage.getItem("orderID");
    this.ids = this.$route.query.orderID;
    this.getOrderDetail();
    this.commissionData();
  },
  beforeDestroy() {
    sessionStorage.removeItem("orderID");
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
      sessionStorage.removeItem("orderID");
    },

    //订单详情
    getOrderDetail() {
      this.$axios({
        method: "GET",
        url: "/backend/Order/takeoutOrderDetail",
        params: {
          order_id: this.ids
        }
      }).then(res => {
        //派单时间
        //地址
        let address =
          res.data.data.receiver_province +
          res.data.data.receiver_city +
          res.data.data.receiver_area;
        this.tableData.push(res.data.data);
        this.tableData[0].addRess = address;
        console.log(this.tableData);
        //遍历

        //时间
        this.create_time = res.data.data.create_time;
        this.pay_date = res.data.data.pay_date;
        this.deal_date = res.data.data.deal_date;
        this.finish_date = res.data.data.finish_date;
        //是否显示骑手信息
        this.self_pick = res.data.data.self_pick;
        this.delivery_service = res.data.data.delivery_service;
        this.order_status = res.data.data.order_status;
        //骑手信息 订单事件状态
        this.tableData.map(item => {
          if (item.rider_info.length > 0) {
            this.rider_info.push(item.rider_info[0]);
            this.rider_info.map(item => {
              this.sendtime = item.receive_date;
              this.receive_date = item.receive_date;
              this.hall_date = item.hall_date;
              this.arrival_date = item.arrival_date;
              this.pickup_date = item.pickup_date;
              //处理报备图片
              item.problem_imgs = item.problem_img.split(",");
              // item.problem_times = item.problem_time;
            });
          }
        });
        //发票
        this.receipt = res.data.data.receipt;
        //支付信息
        if (res.data.data.pay) {
          this.payinfo = [];
          this.payinfo.push(res.data.data.pay);
        }
        //备注
        this.remark = res.data.data.remark;
        this.shop_remark = res.data.data.shop_remark;
        ////商铺信息
        this.shop_id = res.data.data.shop_id;
        this.shop_title = res.data.data.shop_title;
        this.contacts = res.data.data.contacts;
        this.shop_address = `${res.data.data.province} ${res.data.data.city} ${res.data.data.area} ${res.data.data.address}`;
        //商品信息
        this.goodslist = res.data.data.goods;
        this.goodslist.map(item => {
          item.total = (item.goods_num * item.sale_price).toFixed(2);
        });
      });
    },
    //订单分佣明细
    commissionData() {
      this.$axios({
        method: "GET",
        url: "/backend/Order/orderCommissionDetail",
        params: {
          order_id: this.ids
        }
      }).then(res => {
        if (res.data.code == "200") {
          this.commissionOrder = res.data.data.commissionOrder;
          this.commissionRider = res.data.data.commissionRider;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.orderdetail {
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
  }
  .common3 {
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
  //订单信息
  .orderinfo {
    width: 1210px;
    height: 221px;
    margin-bottom: 40px;
  }
  //   用户和骑手
  .u_r,
  .distribution {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 40px;
    .userinfo {
      width: 772px;
      height: 221px;
      margin-right: 40px;
    }
    .riderinfo {
      width: 334px;
      height: 221px;
    }
  }
  //   支付信息
  .pay_info {
    width: fit-content;
    // height: 221px;
    margin-bottom: 40px;
  }
  //配送
  .distribution {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .riderinfo {
      //   width: 626px;
      height: 221px;
      margin-right: 40px;
    }
    .changedisinfo {
      // min-width: 800px;
      // height: 221px;
      margin-right: 40px;
      .imgarr {
        display: flex;
        justify-content: space-between;
        img {
          width: 80px;
          height: 64px;
        }
      }
    }
  }
  //   备注
  .noteinfo {
    width: 423px;
    height: 158px;
    margin-bottom: 40px;
  }
  //发票
  .invoiceinfo {
    width: 484px;
    height: 221px;
    margin-bottom: 40px;
  }
  //商家信息
  .shopinfo {
    width: fit-content;
    // height: 240px;
    margin-bottom: 40px;
  }
  //商品信息
  .goodsinfo {
    width: 806px;
    // height: 504px;
    border-radius: 4px;
    margin-bottom: 40px;
    padding: 20px;
  }
  //订单进度
  .schedule {
    width: 716px;
    height: 363px;
  }
  //订单分佣明细
  .centRMB {
    margin-top: 40px;
    width: 1615px;
    height: 666px;
  }
}
</style>
<style lang="scss">
.orderdetail .el-table__row {
  color: #333;
  height: 63px;
  font-size: 14px;
}
.goodsinfo .el-table {
  border: 1px solid #ccc;
}
</style>
