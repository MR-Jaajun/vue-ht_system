<template>
  <div class="zydetail">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>自营售后订单</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>售后订单详情</h1>
    <div class="afterinfo common">
      <h2>
        订单信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>售后订单号</span>
          <span>{{mallDetail.order_bn}}</span>
        </li>
        <li>
          <span>原订单号</span>
          <span>{{mallDetail.id}}</span>
        </li>
        <li>
          <span>订单状态</span>
          <span class="orderstatus" v-show="mallDetail.order_status==-1">已取消</span>
          <span class="orderstatus" v-show="mallDetail.order_status==2">待发货</span>
          <span class="orderstatus" v-show="mallDetail.order_status==1">未支付</span>
          <span class="orderstatus" v-show="mallDetail.order_status==3">待收货</span>
          <span class="orderstatus" v-show="mallDetail.order_status==5">已完成</span>
        </li>
        <li>
          <span>售后类型</span>
          <span class="orderstatus" v-show="refund_type==1">仅退款</span>
          <span class="orderstatus" v-show="refund_type==2">退货退款</span>
          <span class="orderstatus" v-show="refund_type==3">换货</span>
        </li>
        <li>
          <span>售后状态</span>
          <span
            style="font-size: 16px;color:#333"
            v-for="(item,i) in statusList"
            :key="i"
            v-show="mallDetail.refund_status==item.value"
          >{{item.label}}</span>
        </li>
        <li>
          <span>退款金额</span>
          <span>￥{{mallDetail.pay_fee}} 元</span>
        </li>
        <li v-show="mallDetail.refund_reason">
          <span>售后原因</span>
          <span>{{mallDetail.refund_reason}}</span>
        </li>
        <li v-show="imgUrl">
          <span>售后图片</span>
          <!-- v-for="(item,i) in imgUrl" :src="item" :key="i"  -->
          <img v-for="(item,i) in imgUrl" :src="item" :key="i" />
        </li>
      </div>
    </div>
    <!-- 订单信息 -->
    <div class="after_shopinfo common">
      <h2>
        订单信息
        <i></i>
      </h2>
      <el-table
        :data="tableData"
        border
        style="width: fit-content"
        :header-cell-style="{color:'#666', height:'63px',fontSize:'16px'}"
      >
        <el-table-column prop="id" label="原订单号" width="147" align="center"></el-table-column>
        <el-table-column prop="order_type" label="订单类型" width="147" align="center">
          <template slot-scope="{row}">
            <span v-show="row.order_type==0">普通订单</span>
            <span v-show="row.order_type==1">拼团订单</span>
            <span v-show="row.order_type==2">秒杀订单</span>
          </template>
        </el-table-column>
        <el-table-column prop="sale_price" label="订单状态" align="center" width="147">
          <template slot-scope="{row}">
            <span v-show="row.order_status==-1">已取消</span>
            <span v-show="row.order_status==2">待发货</span>
            <span v-show="row.order_status==1">未支付</span>
            <span v-show="row.order_status==3">待收货</span>
            <span v-show="row.order_status==5">已完成</span>
          </template>
        </el-table-column>
        <el-table-column prop="goods_fee" label="商品金额（元）" align="center" width="147"></el-table-column>
        <el-table-column prop="delivery_fee" label="运费（元）" align="center" width="147"></el-table-column>
        <el-table-column prop="total_fee" label="订单金额（元）" align="center" width="147"></el-table-column>
        <el-table-column prop="pay_fee" label="实付金额（元）" align="center" width="147"></el-table-column>
      </el-table>
    </div>
    <!-- 用户信息 -->
    <div class="userinfo common">
      <h2>
        用户信息
        <i></i>
      </h2>
      <el-table
        :data="tableData"
        border
        style="width:fit-content"
        :header-cell-style="{color:'#666', height:'60px',fontSize:'16px'}"
      >
        <el-table-column prop="receiver_name" label="收货人姓名" width="147" align="center"></el-table-column>
        <!-- <el-table-column prop="goods_title" label="昵称" width="147" align="center"></el-table-column> -->
        <el-table-column prop="receiver_mobile" label="手机号" align="center" width="147"></el-table-column>
        <el-table-column prop="goods_num" label="收货地址" align="center" width="300">
          <template slot-scope="{row}">
            <span>{{row.receiver_province}}</span>
            <span>{{row.receiver_city}}</span>
            <span>{{row.receiver_area}}</span>
            <span>{{row.receiver_address}}</span>
          </template>
        </el-table-column>
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
        :data="goodslist"
        show-summary
        style="width: 100%"
        :header-cell-style="{color:'#333', height:'63px',fontSize:'16px',fontWeight:'800',background:'#EAEBEF' }"
      >
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column prop="goods_title" label="商品名称" width="147" align="center"></el-table-column>
        <el-table-column prop="sku_title" label="商品规格" width="147" align="center"></el-table-column>
        <el-table-column prop="sale_price" label="单价(元)" align="center" width="147"></el-table-column>
        <el-table-column prop="goods_num" label="数量" align="center"></el-table-column>
        <el-table-column prop="total" label="小计(元)" align="center" width="147"></el-table-column>
      </el-table>
    </div>
    <!-- 编辑 普通商品抽佣比例设置 -->
    <div class="edit_dia">
      <el-dialog
        title="填写退款金额"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        width="500px"
        custom-class="dialog"
        :close="cancel"
      >
        <span>填写退款金额：</span>
        <el-input v-model="re_money" autocomplete="off" placeholder="单位：元"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 认</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 操作按钮 -->
    <div class="btn">
      <el-button type="primary" v-show="refund_status==1" @click="open3">同意退款</el-button>
      <el-button v-show="refund_status==1" @click="open">拒绝退款</el-button>
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order_ids: "",
      /*售后信息*/
      refund_record: [],
      create_time: "",
      refund_bn: "",
      order_price: "",
      status: "",
      reason: "",
      statusList: [
        { label: "无", value: 0 },
        { label: "申请中", value: 1 },
        { label: "商家拒绝", value: 2 },
        { label: "商家同意", value: 3 },
        { label: "用户取消", value: 4 }
      ],
      imgUrl: [],
      goodslist: [],
      mallDetail: "",
      tableData: [],
      pay_fee: "",
      refund_type: "", //售后类型
      refund_status: "",
      dialogFormVisible: false,
      re_money: ""
    };
  },
  created() {
    this.order_ids = this.$route.query.orderID;
    this.mallRefundDetail();
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //售后详情 /backend/JdOrder/mallRefundDetail
    mallRefundDetail() {
      this.$axios({
        method: "GET",
        url: "/backend/JdOrder/mallRefundDetail",
        params: {
          order_id: this.order_ids
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.tableData = [];
          const { data } = res.data;
          console.log(data, "售后详情");
          this.mallDetail = data;
          this.refund_status = data.refund_status;
          this.pay_fee = data.pay_fee;
          //售后图片
          this.imgUrl = data.refund_img;
          //计算价格
          data.goods.forEach(item => {
            item.total = (item.sale_price * item.goods_num).toFixed(2);
          });
          this.goodslist = data.goods;
          if (data.refund_record) {
            this.refund_type = data.refund_record[0].refund_type;
          }

          this.tableData.push(data);
          // console.log(this.tabledata);
        }
      });
    },
    //拒绝操作
    open() {
      this.$confirm("您是否拒绝该订单退款, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.refund(this.order_ids, 2, null);
      });
    },
    //同意退款 且输入退款金额
    open3() {
      this.dialogFormVisible = true;
    },
    submit() {
      if (this.re_money) {
        if (this.pay_fee >= this.re_money) {
          this.refund(this.order_ids, 1, this.re_money);
        } else {
          this.$message.error("退款金额不能大于订单金额");
        }
      } else {
        this.$message.error("退款金额不能为空");
      }
    },
    //退款 /backend/JdOrder/dealOrderRefund
    refund(id, type, money) {
      this.$axios({
        method: "POST",
        url: "/backend/JdOrder/dealOrderRefund",
        data: {
          order_id: id,
          type: type,
          money: money
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.mallRefundDetail();
          this.$message.success(res.data.msg);
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    cancel() {
      this.re_money = "";
      this.dialogFormVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin-top: 10px;
  width: fit-content;
  height: 29px;
  font-size: 22px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 29px;
  color: rgba(51, 51, 51, 1);
}
.zydetail {
  .common {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
  }
  .common2 li {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    line-height: 21px;
    img {
      width: 110px;
      height: 105px;
      background: #ccc;
      margin-right: 20px;
      border-radius: 4px;
    }
  }
  .common2 li span:nth-child(1) {
    width: 102px;
    text-align: left;
    color: #666;
    font-size: 16px;
    margin-right: 20px;
  }
  .common2 li span:nth-child(2) {
    color: #333;
    font-size: 16px;
  }
  .common2 li .orderstatus {
    color: #333;
    font-size: 16px;
  }
  h2 {
    // width: 91px;
    height: 29px;
    font-size: 20px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
    margin-bottom: 20px;
    i {
      display: block;
      width: 34px;
      height: 2px;
      background: rgba(67, 113, 232, 1);
      border-radius: 1px;
      margin-top: 1px;
    }
  }
  .afterinfo {
    // width: 1079px;
    width: fit-content;
    // height: 548px;
    margin-top: 40px;
  }
  .after_shopinfo {
    width: fit-content;
    // height: 212px;
    margin-top: 40px;
  }
  .userinfo {
    width: fit-content;
    margin-top: 40px;
  }
  //商品信息
  .goodsinfo {
    width: fit-content;
    // height: 504px;
    border-radius: 4px;
    margin: 40px 0;
    padding: 20px 20px 20px 0;
  }
  .btn {
    display: flex;
    margin-bottom: 30px;
  }
}
</style>
<style lang="scss">
.goodsinfo .el-table {
  border: 1px solid #ccc;
}
.btn .el-button {
  margin-right: 12px;
}
</style>