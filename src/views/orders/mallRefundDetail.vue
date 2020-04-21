<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-24 21:51:15
 * @LastEditors: jun
 * @LastEditTime: 2019-10-10 18:39:46
 -->
<template>
  <div class="afterdetails_wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>商城售后订单</el-breadcrumb-item>
      <el-breadcrumb-item>售后订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>售后订单详情</h1>
    <!-- 售后信息 -->
    <div class="afterSaleDetail">
      <div class="afterinfo common">
        <h2>
          售后信息
          <i></i>
        </h2>
        <div class="common2">
          <li>
            <span>售后订单号</span>
            <span>{{obj.refund_bn}}</span>
          </li>
          <li>
            <span>申请时间</span>
            <span>{{obj.create_time}}</span>
          </li>
          <li>
            <span>售后状态</span>
            <span
              class="li_span"
              v-for="(item,index) in statusList"
              :key="index"
              v-show="obj.status==item.value"
            >{{item.label}}</span>
          </li>
          <li>
            <span>退款金额</span>
            <span>{{obj.order_price}}</span>
          </li>
          <li>
            <span>售后原因</span>
            <span>{{obj.reason}}</span>
          </li>
          <li style="height:42px" v-show="obj.status!=3 && obj.status!=1">
            <span>平台/商家拒绝退款原因</span>
            <span>{{obj.content}}</span>
          </li>
          <li v-show="obj.img">
            <span>售后图片</span>
            <img :src="item" v-for="(item,idx) in imgUrl" :key="idx" />
          </li>
        </div>
      </div>
      <div>
        <div class="userinfo common">
          <h2>
            用户信息
            <i></i>
          </h2>
          <div class="common2">
            <li>
              <span>用户ID</span>
              <span>{{shoplist.custom_uid}}</span>
            </li>
            <li>
              <span>手机号</span>
              <span>{{receiver_mobile}}</span>
            </li>
            <li>
              <span>昵称</span>
              <span>{{receiver_name}}</span>
            </li>
          </div>
        </div>
        <div class="riderinfo common" v-show="rider_name">
          <h2>
            骑手信息
            <i></i>
          </h2>
          <div class="common2">
            <li>
              <span>手机号</span>
              <span>{{rider_mobile}}</span>
            </li>
            <li>
              <span>姓名</span>
              <span>{{rider_name}}</span>
            </li>
          </div>
        </div>
      </div>
    </div>
    <div class="storeinfo common">
      <h2>
        商家信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>店铺ID</span>
          <span>{{shoplist.shop_id}}</span>
        </li>
        <li>
          <span>店铺地址</span>
          <span>{{shoplist.area}}</span>
        </li>
        <li>
          <span>店铺信息</span>
          <span>{{shoplist.shop_title}}</span>
        </li>
        <li>
          <span>联系人</span>
          <span>{{shoplist.contacts}}</span>
        </li>
        <li>
          <span>联系人手机号</span>
          <span>{{shoplist.contact_information}}</span>
        </li>
      </div>
    </div>
    <div class="after_shopinfo common">
      <h2>
        售后商品
        <i></i>
      </h2>
      <el-table
        :data="goodslist"
        border
        style="width: 100%"
        :header-cell-style="{color:'#666', height:'63px',fontSize:'16px'}"
      >
        <el-table-column prop="goods_id" label="商品ID" width="147" align="center"></el-table-column>
        <el-table-column prop="goods_title" label="商品名称" width="147" align="center"></el-table-column>
        <el-table-column prop="sale_price" label="单价(元)" align="center"></el-table-column>
        <el-table-column prop="goods_num" label="数量" align="center"></el-table-column>
        <el-table-column prop="total" label="退款金额(元)" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 返回上一页 -->
    <el-button plain @click="backdown">返回上一页</el-button>
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
      statusList: [
        { label: "申请", value: 1 },
        { label: "商家拒绝", value: 2 },
        { label: "商家同意", value: 3 },
        { label: "用户取消", value: 4 },
        { label: "申请平台", value: 5 },
        { label: "平台同意", value: 6 },
        { label: "平台拒绝", value: 7 },
        { label: "用户申请平台后取消", value: 8 }
      ],
      reason: "",
      content: "",
      imgUrl: [],
      /*骑手 和 用户*/
      rider_name: "",
      rider_mobile: "",
      receiver_name: "",
      receiver_mobile: "",
      /*商家信息*/
      shoplist: {},
      /*商品信息*/
      goodslist: [],
      obj: {}
    };
  },
  created() {
    this.order_ids = this.$store.getters.id || this.$route.params.order_id;
    this.getAllinfo();
  },
  watch: {
    // imgUrl() {
    //   console.log(this.imgUrl);
    // }
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //售后信息
    getAllinfo() {
      this.$axios({
        method: "GET",
        url: "/backend/Order/mallRefundDetail",
        params: {
          order_id: this.order_ids
        }
      }).then(res => {
        console.log(res.data.data);
        //商品信息
        this.shoplist = res.data.data;
        this.goodslist = res.data.data.goods;
        this.goodslist.map(item => {
          if (item.goods_num && item.sale_price) {
            item.total = (item.goods_num * item.sale_price).toFixed(2);
          }
        });
        //骑手和用户信息
        this.receiver_name = res.data.data.receiver_name;
        this.receiver_mobile = res.data.data.receiver_mobile;
        this.rider_mobile = res.data.data.rider_mobile;
        this.rider_name = res.data.data.rider_name;
        //售后信息
        this.obj = res.data.data.refund_record[0];
        if (this.obj) {
          this.create_time = this.obj.create_time;
          this.refund_bn = this.obj.refund_bn;
          this.status = this.obj.status;
          this.imgUrl = this.obj.img.split(",");
          this.reason = this.obj.reason;
          this.order_price = this.obj.order_price;
          this.content = this.obj.content;
        }
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.afterdetails_wapper {
  h1 {
    margin-top: 10px;
    margin-bottom: 34px;
    height: 31px;
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 31px;
  }
  .common {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
  }
  //商家信息
  .shopinfo {
    width: 380px;
    height: 270px;
    margin: 30px 0;
  }
  .common2 li {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    line-height: 21px;
    img {
      width: 74px;
      height: 74px;
      background: #ccc;
      margin-right: 20px;
      border-radius: 2px;
    }
  }
  .common2 li span:nth-child(1) {
    width: 102px;
    text-align: left;
    color: #666;
    font-size: 16px;
    margin-right: 20px;
  }
  .li_span {
    color: #333 !important ;
    font-size: 16px !important ;
  }
  .common2 li span:nth-child(2) {
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
  .afterSaleDetail {
    height: 428px;
    display: flex;
    justify-content: flex-start;

    .afterinfo {
      float: left;
      width: 414px;
      height: 428px;
      margin-right: 128px;
    }
    .userinfo {
      width: 299px;
      height: 192px;
    }
    .riderinfo {
      width: 341px;
      height: 190px;
      margin-top: 46px;
    }
  }
  .storeinfo {
    width: 341px;
    height: 272px;
    margin-top: 40px;
  }
  .after_shopinfo {
    width: 772px;
    // height: 212px;
    margin-top: 40px;
  }
}
</style>
