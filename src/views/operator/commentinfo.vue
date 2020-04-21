<!--
 * @Description: 评价详情
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-12 15:37:18
 -->
<template>
  <div class="orderdetail">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './evaluation' }">运营管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './evaluation' }">评价列表</el-breadcrumb-item>
      <el-breadcrumb-item>评价详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>评价详情</h1>
    <!-- 订单信息 -->
    <div class="noteinfo common">
      <h2>
        订单信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>状态</span>
          <span>{{order_info.status}}</span>
        </li>
        <li>
          <span>订单号</span>
          <span>{{order_info.order_bn}}</span>
        </li>
        <li>
          <span>评价类型</span>
          <span>{{order_info.comment_type_value}}</span>
        </li>
      </div>
    </div>
    <!-- 商品信息 -->
    <div class="orderinfo common">
      <h2>
        商品信息
        <i></i>
      </h2>
      <el-table
        :data="goods_info.list"
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
      </el-table>
    </div>

    <div class="u_r">
      <!-- 店铺信息 -->
      <div class="noteinfo common">
        <h2>
          店铺信息
          <i></i>
        </h2>
        <div class="common2">
          <li>
            <span>店铺名称</span>
            <span>{{shop_info.shop_id}}</span>
          </li>
          <li>
            <span>店铺ID</span>
            <span>{{shop_info.shop_name}}</span>
          </li>
          <li>
            <span>店铺综合评分</span>
            <span>{{shop_info.shop_score}}</span>
          </li>
        </div>
      </div>
      <!-- 用户信息 -->
      <div class="noteinfo common">
        <h2>
          用户信息
          <i></i>
        </h2>
        <div class="common2">
          <li>
            <span>UserID</span>
            <span>{{custom_info.custom_id}}</span>
          </li>
          <li>
            <span>昵称</span>
            <span>{{custom_info.custom_name}}</span>
          </li>
          <li>
            <span>手机号</span>
            <span>{{custom_info.custom_mobile}}</span>
          </li>
        </div>
      </div>
      <!-- 骑手信息 -->
      <div class="noteinfo common">
        <h2>
          骑手信息
          <i></i>
        </h2>
        <div class="common2">
          <li>
            <span>配送员姓名</span>
            <span>{{rider_info.rider_name}}</span>
          </li>
          <li>
            <span>配送员ID</span>
            <span>{{rider_info.rider_id}}</span>
          </li>
          <li>
            <span>手机号</span>
            <span>{{rider_info.rider_mobile}}</span>
          </li>
        </div>
      </div>
    </div>

    <!-- 评价详情（外卖） -->

    <h2>
      评价详情（{{this.commentInfoTitle}}）
      <i></i>
    </h2>
    <div class="u_r">
      <div class="noteinfo common">
        <div class="common2">
          <li>
            <span class="smallTitle">用户评价</span>
          </li>
          <li>
            <span>评论时间</span>
            <span>{{comment_info.create_time}}</span>
          </li>
          <li style="margin-bottom: 56px;">
            <span>评论星数</span>
            <span>
              <el-row>商家：{{comment_info.shop_evaluate_score}}</el-row>
              <el-row>口味：{{comment_info.flavor_evaluate}}</el-row>
              <el-row>包装：{{comment_info.pack_evaluate}}</el-row>
            </span>
          </li>
          <li style="margin-bottom: 120px;">
            <span>评论内容</span>
            <span class="forImg">
              {{comment_info.comment_content}}
              <el-row v-for="item in commentPic" :key="item.id">
                <img :src="item.image_path" />
              </el-row>
            </span>
          </li>
          <li>
            <span>追加评价时间</span>
            <span>{{comment_info.append_create_time}}</span>
          </li>
          <li>
            <span>追加评价内容</span>
            <span>{{comment_info.append_content}}</span>
            <span class="forImg">
              {{comment_info.append_image}}
              <el-row v-for="item in commentShopPic" :key="item.id">
                <img :src="item.image_path" />
              </el-row>
            </span>
          </li>
        </div>
      </div>

      <div class="noteinfo common">
        <div class="common2">
          <li>
            <span class="smallTitle">商家评价</span>
          </li>
          <li>
            <span>评论时间</span>
            <span>{{comment_info.create_time}}</span>
          </li>
          <li style="margin-bottom: 56px;">
            <span>评论星数</span>
            <span>{{comment_info.shop_evaluate_score}}</span>
          </li>
          <li style="margin-bottom: 120px;">
            <span>评论内容</span>
            <span class="forImg">{{comment_info.comment_content}}</span>
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
      rider_info: {},
      order_info: {},
      goods_info: {},
      shop_info:{},
      custom_info: {},
      comment_info: {},
      commentPic: [],
      appendCommentPic: [],
      commentInfoTitle: ""
    };
  },
  watch: {
    rider_info() {
      console.log(this.rider_info);
    }
  },
  created() {
    this.params = this.$route.query;
    this.getInfo();
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },

    //订单详情
    getInfo() {
      this.$axios({
        method: "GET",
        url: "/backend/Operation/comment",
        params: {
          // comment_id: 16,
          comment_id: this.params.comment_id,
          // comment_type: 1
          comment_type: this.params.comment_type
        }
      }).then(res => {
        console.log(111, res.data.data);
        if (!Array.isArray(res.data.data)) {
          this.list = res.data.data;
          this.shop_info = res.data.data.shop_info;
          this.rider_info = res.data.data.rider_info;
          this.order_info = res.data.data.order_info;
          this.goods_info = res.data.data.goods_info;
          this.custom_info = res.data.data.custom_info;
          this.comment_info = res.data.data.comment_info;
          this.commentPic = res.data.data.comment_info.image_info;
          this.commentShopPic = res.data.data.comment_info.append_image;
          this.commentInfoTitle = res.data.data.order_info.comment_type_value;
        } else {
          this.$message.error("没有评论");
        }

        //派单时间
        //地址
        // let address =
        //   res.data.data.receiver_province +
        //   res.data.data.receiver_city +
        //   res.data.data.receiver_area;
        // this.tableData.push(res.data.data);
        // this.tableData[0].addRess = address;
        // console.log(this.tableData);
        // //遍历
        // this.tableData.map(item => {
        //   //时间
        //   this.create_time = item.create_time;
        //   this.pay_date = item.pay_date;
        //   this.deal_date = item.deal_date;
        //   this.finish_date = item.finish_date;
        //   //是否显示骑手信息
        //   this.self_pick = item.self_pick;
        //   this.delivery_service = item.delivery_service;
        //   this.order_status = item.order_status;
        //   //骑手信息 订单事件状态
        //   if (item.rider_info.length > 0) {
        //     this.rider_info.push(item.rider_info[0]);
        //     this.rider_info.map(item => {
        //       this.sendtime = item.receive_date;
        //       this.receive_date = item.receive_date;
        //       this.hall_date = item.hall_date;
        //       this.arrival_date = item.arrival_date;
        //       this.pickup_date = item.pickup_date;
        //     });
        //   }
        //   //发票
        //   this.receipt = item.receipt;
        //   this.payinfo.push(item.pay);
        //   //备注
        //   this.remark = item.remark;
        //   this.shop_remark = item.shop_remark;
        //   ////商铺信息
        //   this.shop_id = item.shop_id;
        //   this.shop_title = item.shop_title;
        //   this.contacts = item.contacts;
        //   this.shop_address = `${item.province} ${item.city} ${item.area}`;
        //   //商品信息
        //   this.goodslist = item.goods;
        //   this.goodslist.map(item => {
        //     item.total = (item.goods_num * item.sale_price).toFixed(2);
        //   });
        // });
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
    margin-right: 15px;
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
    width: 523px;
    height: 221px;
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
      width: 480px;
      height: 221px;
      margin-right: 40px;
    }
  }
  //   订单信息
  .noteinfo {
    width: 440px;
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
    width: 380px;
    height: 240px;
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
