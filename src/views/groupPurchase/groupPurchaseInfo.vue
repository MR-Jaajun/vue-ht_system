<!--
 * @Description: 团购详情
 * @Author: duo
 * @Date: 2019-10-08 10:42:37
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 11:30:16
 -->
<template>
  <div class="orderdetail">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './groupPurchaseList' }">团购管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './groupPurchaseList' }">团购列表</el-breadcrumb-item>
      <el-breadcrumb-item>团购详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 弹框 -->
    <el-dialog class="duodialog" title="退款详情" :visible.sync="dialogVisible" width="30%">
      <el-row :gutter="gutterVal">
        <el-col :span="4">
          <div class="grid-content bg-purple">时间</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">{{info.create_time}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="gutterVal">
        <el-col :span="4">
          <div class="grid-content bg-purple">金额</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">{{info.order_price}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="gutterVal">
        <el-col :span="4">
          <div class="grid-content bg-purple">路径</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">{{refundPay.name}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="gutterVal">
        <el-col :span="4">
          <div class="grid-content bg-purple">原因</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">{{info.reason}}</div>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 订单信息 -->
    <div class="u_r">
      <div class="noteinfo common" style="margin-top:40px">
        <h2>
          订单信息
          <i></i>
        </h2>
        <div class="common2">
          <li>
            <span>订单号</span>
            <span>{{list.order_bn}}</span>
          </li>
          <li>
            <span>订单类型</span>
            <span>{{list.order_type|selectTypeFilter}}</span>
          </li>
          <li>
            <span>订单状态</span>
            <span>{{list.order_status|selectStatusFilter}}</span>
          </li>
          <li>
            <span>订单金额</span>
            <span>{{list.total_fee}}</span>
          </li>
          <li>
            <span>实付金额</span>
            <span>{{list|actuallyPaid}}</span>
          </li>
          <!-- </div> -->
        </div>
        <!-- 商品信息 -->
        <!-- <div class="orderinfo common">
      <h2>
        用户信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>用户姓名</span>
          <span>{{list.order_bn}}</span>
        </li>
        <li>
          <span>昵称</span>
          <span>{{list.order_type|selectTypeFilter}}</span>
        </li>
        <li>
          <span>订单状态</span>
          <span>{{list.order_status|selectStatusFilter}}</span>
        </li>
        <li>
          <span>订单金额</span>
          <span>{{list.total_fee}}</span>
        </li>
        </div>-->
        <!-- <el-table
        :data="list.goods_info.list"
        border
        show-summary
        style="width: 100%"
        :header-cell-style="{color:'#666', height:'63px', fontSize:'16px' }"
      >
        <el-table-column prop="num" label="序号" width="153" align="center"></el-table-column>
        <el-table-column prop="goods_title" label="商品名称" width="200" align="center"></el-table-column>
        <el-table-column prop="goods_num" label="数量" width="153" align="center"></el-table-column>
        <el-table-column prop="sale_price" label="单价" width="153" align="center"></el-table-column>
        <el-table-column prop="single_total" label="小计" width="153" sortable align="center"></el-table-column>
        </el-table>-->
      </div>
      <div class="noteinfo common" style="margin-top:40px">
        <h2>
          商家店铺信息
          <i></i>
        </h2>
        <div class="common2">
          <li>
            <span>店铺ID</span>
            <span>{{list.province}}{{list.city}}{{list.area}}{{list.address}}</span>
          </li>
          <li>
            <span>联系人</span>
            <span>{{list.contacts}}</span>
          </li>
          <li>
            <span>店铺名称</span>
            <span>{{list.shop_title}}</span>
          </li>
          <li>
            <span>店铺地址</span>
            <span>{{list.receiver_mobile}}</span>
          </li>
        </div>
      </div>
    </div>
    <div class="u_r">
      <div class="noteinfo common">
        <h2>
          用户信息
          <i></i>
        </h2>
        <div class="common2">
          <li>
            <span>用户姓名</span>
            <span>{{list.nick_name}}</span>
          </li>
          <li>
            <span>昵称</span>
            <span>{{list.nick_name}}</span>
          </li>
          <li>
            <span>用户ID</span>
            <span>{{list.custom_uid}}</span>
          </li>
          <li>
            <span>手机号</span>
            <span>{{list.receiver_mobile}}</span>
          </li>
          <li>
            <span>会员等级</span>
            <span v-show="list.vip_level==0">小哥粉</span>
            <span v-show="list.vip_level==1">小哥</span>
            <span v-show="list.vip_level==2">小V哥</span>
            <span v-show="list.vip_level==3">V哥</span>
          </li>
        </div>
      </div>
      <div class="noteinfo common" v-if="0">
        <h2>
          {{list.pink_member.is_leader == 1?'团长':'团员'}}信息
          <i></i>
        </h2>
        <div class="common2">
          <li>
            <span>用户姓名</span>
            <span>{{list.nick_name}}</span>
          </li>
          <li>
            <span>昵称</span>
            <span>{{list.nick_name}}</span>
          </li>
          <li>
            <span>用户ID</span>
            <span>{{list.custom_uid}}</span>
          </li>
          <li>
            <span>手机号</span>
            <span>{{list.receiver_mobile}}</span>
          </li>
          <li>
            <span>会员等级</span>
            <span v-show="list.vip_level==0">小哥粉</span>
            <span v-show="list.vip_level==1">小哥</span>
            <span v-show="list.vip_level==2">小V哥</span>
            <span v-show="list.vip_level==3">V哥</span>
          </li>
        </div>
      </div>
    </div>

    <div class="u_r">
      <div class="noteinfo common" v-if="list.order_status>1">
        <h2>
          支付信息
          <i></i>
        </h2>
        <div class="common2">
          <li>
            <span>支付流水号</span>
            <span>{{pay.payment_id}}</span>
          </li>
          <li>
            <span>支付方式</span>
            <span>{{pay.pay_name}}</span>
          </li>
          <li>
            <span>支付金额</span>
            <span>{{pay.payment}}</span>
          </li>
        </div>
      </div>
      <div class="noteinfo common">
        <h2>
          使用规则
          <i></i>
        </h2>
        <div class="common2">
          <li>
            <span>使用期限</span>
            <span>{{list.start_date}} - {{list.end_date}}</span>
          </li>
          <li>
            <span>使用时间</span>
            <span>{{goods_data.available_time}}</span>
          </li>
          <li>
            <span>预约情况</span>
            <span>{{goods_data.booking}}</span>
          </li>
          <li>
            <span>其它规则</span>
            <span>{{goods_data.desc}}</span>
          </li>
        </div>
      </div>
    </div>

    <div class="noteinfo common" style="width:800px;">
      <h2>
        商品信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>商品名称</span>
          <span>{{list.order_title}}</span>
        </li>
        <li>
          <span>数量</span>
          <span>{{list.goods_num}}</span>
        </li>
      </div>
      <el-table
        :data="goods"
        border
        style="width: 100%"
        :header-cell-style="{color:'#666', height:'63px', fontSize:'16px' }"
      >
        <el-table-column prop="order_goods_id" label="序号" width="153" align="center"></el-table-column>
        <el-table-column prop="verify_code" label="劵码" width="200" align="center"></el-table-column>
        <el-table-column prop="sale_price" label="价格(元)" width="153" align="center"></el-table-column>
        <el-table-column prop="market_price" label="
门市价(元)" width="153" align="center"></el-table-column>
        <el-table-column prop="status" label="商品状态" align="center">
          <template slot-scope="{row}">
            <!-- {{ row.status|filterA }} -->
            <span v-show="row.status==-1">代金券</span>
            <span v-show="row.status==1">未支付</span>
            <span v-show="row.status==2">待消费</span>
            <span v-show="row.status==3">已完成</span>
            <el-link type="primary" v-show="row.status==4" @click="showDialog(row.order_goods_id)">已退款</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 返回 -->
    <el-button plain @click="backdown">返回上一页</el-button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      gutterVal: 1,
      dialogVisible: false,
      info:[],
      
      tableData: [],
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

      params: {},
      list: {},
      pay: {},
      refundPay: {},
      goods_data: {},
      goods: [],
      appendCommentPic: [],
      commentInfoTitle: '',

    };
  },
  watch: {
    rider_info() {
      console.log(this.rider_info);
    }
  },
  filters: {
    filterA(status) {
      const statusMap = {
        '-1': '代金券',
        1: '未支付',
        2: '待消费',
        3: '已完成',
        4: '已退款'
      }
      return statusMap[status]
    },
    selectTypeFilter(status) {
      const statusMap = {
        1: '代金券',
        2: '套餐'
      }
      return statusMap[status]
    },
    selectStatusFilter(status) {
      const statusMap = {
        '-1': '已取消',
        1: '未支付',
        2: '待消费',
        3: '已完成',
        4: '已退款',
      }
      return statusMap[status]
    },
    actuallyPaid: function (row) {
      if (row.order_status == 1)
        return 0
      else
        return row.total_fee
    }
  },
  created() {
    this.params = this.$route.params;
    console.log(this.params)
    this.getInfo();
  },
  computed: {
    // isshowleaderView: function(){
    //   if(Object.keys(this.list.pink_member).length==1)
    //     return true
    //   else
    //     return false
    // }
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },

    //订单详情
    getInfo() {
      // console.log(this.params)
      this.$axios({
        method: "GET",
        url: "/backend/Order/groupOrderDetail",
        params: {
          // order_id: this.params.row.id,
          order_id: 844,
        }
      }).then(res => {
        this.list = res.data.data
        this.pay = res.data.data.pay
        this.goods_data = res.data.data.goods_data
        // console.log('this.list', this.list)

        for (let i of res.data.data.goods) {
          i.market_price = res.data.data.market_price
          i.sale_price = res.data.data.sale_price
        }
        this.goods = res.data.data.goods
      });
    },
    /**弹窗 */
    showDialog(id) {
      console.log('id', id)
      this.dialogVisible = true
      this.$axios({
        method: 'GET',
        url: '/backend/Order/orderRefundDetail',
        params: { order_id: this.list.id, order_goods_id:id }
      }).then(res => {
        // this.listLoading = false
        this.info = res.data.data.list[0]
        this.refundPay = res.data.data.pay
        console.log('this.refundPay', this.refundPay)
        // this.total = res.data.data.total
        // console.log('this.info', this.info)
      })
    },
  }
};
</script>
<style lang="scss">
@import "../../styles/duo.scss";
</style>

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
    margin-right: 30px;
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
  //商品信息
  .orderinfo {
    width: 855px;
    // height: 221px;
    margin-bottom: 40px;
  }
  //   用户和骑手
  .u_r,
  .distribution {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    // margin-bottom: 30px;

    .userinfo {
      width: 772px;
      height: 221px;
      margin-right: 30px;
    }
    .riderinfo {
      width: 334px;
      height: 221px;
    }
  }
  //   支付信息
  .pay_info {
    width: 523px;
    height: 221px;
    margin-bottom: 30px;
  }
  //配送
  .distribution {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .riderinfo {
      //   width: 626px;
      height: 221px;
      margin-right: 30px;
    }
    .changedisinfo {
      width: 480px;
      height: 221px;
      margin-right: 30px;
    }
  }
  //   订单信息
  .noteinfo {
    width: 500px;
    margin-bottom: 30px;
  }
  //发票
  .invoiceinfo {
    width: 484px;
    height: 221px;
    margin-bottom: 30px;
  }
  //商家信息
  .shopinfo {
    width: 380px;
    height: 240px;
    margin-bottom: 30px;
  }
  //商品信息
  .goodsinfo {
    width: 806px;
    // height: 504px;
    border-radius: 4px;
    margin-bottom: 30px;
    padding: 20px;
  }
  //订单进度
  .schedule {
    width: 716px;
    height: 363px;
  }
}

.forImg {
  img {
    width: 80px;
    height: 80px;
    margin: 10px 6px 0 0;
  }
}
.smallTitle {
  font-weight: 800;
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
