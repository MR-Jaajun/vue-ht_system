<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-24 18:15:57
 * @LastEditors: Roc
 * @LastEditTime: 2019-12-12 14:48:33
 -->
<template>
  <div class="orderdetail">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item to="./sendOrders">自营订单</el-breadcrumb-item>
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
        <!-- <el-table-column prop="self_pick" label="订单类型" width="147" align="center">
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
        </el-table-column>-->
        <el-table-column prop="order_status" label="订单状态" width="147" align="center">
          <template slot-scope="{row}">
            <span v-show="row.order_status==1">待付款</span>
            <span v-show="row.order_status==2">待发货</span>
            <span v-show="row.order_status==3">配送中</span>
            <span v-show="row.order_status==4">待评价</span>
            <span v-show="row.order_status==5">已完成</span>
            <span v-show="row.order_status==-1">已取消</span>
          </template>
        </el-table-column>
        <el-table-column prop="goods_fee" label="订单金额" width="147" align="center"></el-table-column>
        <el-table-column prop="delivery_fee" label="配送费" width="147" align="center"></el-table-column>
        <el-table-column prop="discount_fee" label="优惠金额" width="147" align="center"></el-table-column>
        <el-table-column prop="total_fee" label="实付金额" align="center" width="147"></el-table-column>
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
          style="width: fit-content"
          :header-cell-style="{color:'#666', height:'63px',fontSize:'16px' }"
        >
          <el-table-column prop="receiver_name" label="收货人姓名" width="147" align="center"></el-table-column>
          <el-table-column prop="nick_name" label="昵称" width="147" align="center"></el-table-column>
          <el-table-column prop="custom_uid" label="用户ID" width="147" align="center"></el-table-column>
          <el-table-column prop="receiver_mobile" label="手机号" width="147" align="center"></el-table-column>
          <el-table-column prop="vip_level" label="会员等级" align="center" width="147">
            <template slot-scope="{row}">
              <span v-show="row.vip_level==0">小哥粉</span>
              <span v-show="row.vip_level==1">小哥</span>
              <span v-show="row.vip_level==2">小V哥</span>
              <span v-show="row.vip_level==3">V哥</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 团长团员信息 -->
    <!-- v-show = "pink_member" -->
    <div class="u_r" v-show="is_leader">
      <div class="userinfo common">
        <h2 v-show="is_leader==1">
          团长信息
          <i></i>
        </h2>
        <h2 v-show="is_leader==0">
          团员信息
          <i></i>
        </h2>
        <el-table
          :data="pink_member"
          border
          style="width: fit-content"
          :header-cell-style="{color:'#666', height:'63px',fontSize:'16px' }"
        >
          <el-table-column prop="receiver_name" label="收货人姓名" width="147" align="center"></el-table-column>
          <el-table-column prop="nick_name" label="昵称" width="147" align="center"></el-table-column>
          <el-table-column prop="id" label="用户ID" width="147" align="center"></el-table-column>
          <el-table-column prop="mobile" label="手机号" width="147" align="center"></el-table-column>
          <el-table-column prop="vip_level" label="会员等级" align="center" width="147">
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
          团员信息
          <i></i>
        </h2>
        <el-table
          :data="pink_member"
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
    <!-- 物流信息 -->
    <div class="goodsinfo" v-show="Logistics">
      <h2>
        物流信息
        <i></i>
      </h2>
      <div class="logistics">
        <li v-for="(item,i) in Logistics.orderTrack" :key="i">
          <span style="margin-right:30px;">{{item.msgTime}}</span>
          <span>{{item.content}}</span>
        </li>
        <div class="l_title">
          <span>信息来源：</span>
          <span style="color:#2992E2;margin-right: 30px;">京东快递</span>
          <span>运单号：{{Logistics.jdOrderId}}</span>
        </div>
      </div>
    </div>
    <!-- 配送 -->
    <!-- <div class="distribution">
      <div class="changedisinfo common">
        <h2>
          配送信息
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
    </div>-->
    <!-- 备注 -->
    <div class="noteinfo common" v-show="remark">
      <h2>
        备注信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>买家备注</span>
          <span>{{remark}}</span>
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
    <!-- 商品信息 -->
    <div class="goodsinfo">
      <h2>
        商品信息
        <i></i>
      </h2>
      <el-table
        highlight-current-row
        :show-summary="true"
        :data="goodslist"
        style="width: 100%"
        :header-cell-style="{color:'#333', height:'63px',fontSize:'16px',fontWeight:'800',background:'#EAEBEF' }"
      >
        <el-table-column type="index" prop="index" align="center" label="序号" width="100"></el-table-column>
        <el-table-column prop="goods_title" align="center" label="商品名称" width="147"></el-table-column>
        <el-table-column prop="sale_price" align="center" label="单价（元)" width="147"></el-table-column>
        <el-table-column prop="goods_num" align="center" label="数量" width="147"></el-table-column>
        <el-table-column prop="single_total" align="center" label="小计（元)" width="147"></el-table-column>
      </el-table>
    </div>
    <!-- 订单抽佣明细 -->
    <div class="goodsinfo" v-show="showCommission">
      <h2>
        订单抽佣明细
        <i></i>
      </h2>
      <div class="commission logistics">
        <div class="commission_status">
          佣金结算状态：
          <span>{{commissionOrder.status==1?'待结算':(commissionOrder.status==2?"已结算":"不结算")}}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>类型</th>
              <th>可分配金额</th>
              <th>会员直推（元）</th>
              <th>会员间推（元）</th>
              <th>自消费（元）</th>
              <th>商家引荐人（元）</th>
              <th>省代（元）</th>
              <th>市代（元）</th>
              <th>区代（元）</th>
              <th>平台抽佣（元）</th>
              <th>沉淀总金额（元）</th>
            </tr>
          </thead>
          <!-- 分配金额 -->
          <tbody>
            <tr>
              <th>分配金额</th>
              <td rowspan="2" style="display:table-cell; vertical-align:middle">{{commissionOrder.deposit_fee}}</td>
              <td>{{commissionOrder.first_price}}</td>
              <td>{{commissionOrder.second_price}}</td>
              <td>{{commissionOrder.self_buy_price}}</td>
              <td>{{commissionOrder.store_recommend_price}}</td>
              <td>{{commissionOrder.province_price}}</td>
              <td>{{commissionOrder.city_price}}</td>
              <td>{{commissionOrder.area_price}}</td>
              <td rowspan="2" style="display:table-cell; vertical-align:middle">{{commissionOrder.terrace}}</td>
              <td rowspan="2" style="display:table-cell; vertical-align:middle">{{commissionOrder.total_sediment}}</td>
            </tr>
            <!-- 沉淀金额 -->
            <tr>
              <th>沉淀金额</th>
              <!-- <td>$100</td> -->
              <td>{{commissionOrder.first_sediment}}</td>
              <td>{{commissionOrder.second_sediment}}</td>
              <td>{{commissionOrder.self_buy_sediment}}</td>
              <td>{{commissionOrder.store_recommend_sediment}}</td>
              <td>{{commissionOrder.province_sediment}}</td>
              <td>{{commissionOrder.city_sediment}}</td>
              <td>{{commissionOrder.area_sediment}}</td>
              <!-- <td>$100</td>
              <td>$100</td>-->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 返回 -->
    <el-button type="primary" plain @click="backdown">返回上一页</el-button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      commissionOrder: {}, //订单预估收益（不包括配费）
      tableData: [],
      order_id: "",
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
      pickup_date: "",
      pink_member: [], //团长和团员
      is_leader: "",
      Logistics: "", //物流信息
      showCommission: false
    };
  },
  watch: {
    payinfo() {
      console.log(this.payinfo);
    }
  },
  created() {
    this.order_id = this.$route.query.orderID;
    this.getOrderDetail();
    this.commissionData();
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
        url: "/backend/jd_order/mallOrderDetail",
        params: {
          order_id: this.order_id
        }
      }).then(res => {
        console.log(res.data.data);
        const { data } = res.data;
        //支付信息
        if (data.pay) {
          this.payinfo = [];
          this.payinfo.push(data.pay);
        }
        // 商铺信息
        // this.shop_id = data.shop_id;
        // this.shop_title = data.shop_title;
        // this.contacts = data.contacts;
        // this.shop_address = `${data.province} ${data.city} ${data.area}`;
        //商品信息
        data.goods.forEach(item => {
          item.single_total = (item.sale_price * item.goods_num).toFixed(2);
          // console.log(item,'12132132132123')
        });
        this.goodslist = data.goods;
        // let lenT = this.goodslist.length;
        //合计总额
        // var totalM = 0;

        //派单时间
        //地址
        let address =
          data.receiver_province + data.receiver_city + data.receiver_area;
        this.tableData.push(data);
        this.tableData[0].addRess = address;

        //团长和团员
        if (data.pink_member) {
          this.pink_member.push(data.pink_member);
          this.is_leader = data.pink_member.is_leader;
        }
        //发票
        this.receipt = data.receipt;
        //备注
        this.remark = data.remark;
        this.shop_remark = data.shop_remark;
        //物流信息
        if (data.Logistics.length != 0) {
          this.Logistics = data.Logistics;
        }
      });
    },
    //订单分佣明细
    commissionData() {
      this.$axios({
        method: "GET",
        url: "/backend/Order/orderCommissionDetail",
        params: {
          order_id: this.order_id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.showCommission = true;
          this.commissionOrder = res.data.data.commissionOrder;
          console.log(res.data.data, "抽佣明细");
        } else {
          this.showCommission = false;
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
    height: 21px;
    display: flex;
    flex-direction: row;
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

  h2 {
    // width: 91px;
    height: 29px;
    font-size: 22px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
    margin-bottom: 24px;
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
    width: fit-content;
    // height: 221px;
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
      width: fit-content;
      // height: 221px;
      margin-right: 40px;
    }
    .riderinfo {
      width: fit-content;
      // height: 221px;
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
      width: fit-content;
      // height: 221px;
      margin-right: 40px;
    }
    .changedisinfo {
      width: fit-content;
      // height: 221px;
      margin-right: 40px;
    }
  }
  //   备注
  .noteinfo {
    width: fit-content;
    // height: 158px;
    margin-bottom: 40px;
  }
  //发票
  .invoiceinfo {
    width: fit-content;
    // height: 221px;
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
    width: fit-content;
    // height: 504px;
    border-radius: 4px;
    margin-bottom: 40px;
    padding: 20px;
    //物流信息
    .logistics {
      width: fit-content;
      min-width: 660px;
      // height: 363px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(241, 241, 241, 1);
      box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
      border-radius: 4px;
      padding: 30px 20px;
      li {
        font-size: 18px;
        color: #333;
        margin-bottom: 22px;
      }
      .l_title {
        margin-left: 198px;
        font-size: 18px;
        color: #666;
      }
    }
    //抽佣明细
    .commission {
      font-size: 16px;
      color: #666;
      .commission_status {
        color: #333;
        font-size: 18px;
        margin-bottom: 14px;
        span {
          color: #f32727;
        }
      }
      th,
      td {
        width: 140px;
        height: 53px;
        border: 1px solid rgba(112, 112, 112, 1);
        text-align: center;
        line-height: 53px;
      }
    }
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
