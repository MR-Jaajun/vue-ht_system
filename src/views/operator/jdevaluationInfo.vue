<!--
 * @Description: 评价详情
 * @Author: jun
 * @Date: 2019-10-28 09:24:57
 * @LastEditors: Roc
 * @LastEditTime: 2020-02-19 16:08:59
 -->
<template>
  <div class="appraiseDetail">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>商城模块</el-breadcrumb-item>
      <el-breadcrumb-item>评价列表</el-breadcrumb-item>
      <el-breadcrumb-item>评价详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>评价详情</h1>
    <!-- 订单信息 -->
    <div class="order_info common">
      <h2>
        订单信息
        <i></i>
      </h2>
      <div style="margin-top:20px;">
        <li>
          <span class="list_title">订单号</span>
          <p>{{order_bn}}</p>
        </li>
        <li>
          <span class="list_title">状态</span>
          <p>{{is_reply==1?'已回复':'未回复'}}</p>
        </li>
      </div>
    </div>
    <!-- 商品信息 -->
    <div class="goods_info common">
      <h2>
        商品信息
        <i></i>
      </h2>
      <div style="margin-top:20px;">
        <el-table
          :data="goods_list"
          style="width:fit-content"
          show-summary
          highlight-current-row
          :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800', height:'62px',fontSize:'14px' }"
        >
          <el-table-column type="index" align="center" width="80" label="序号"></el-table-column>
          <el-table-column align="center" label="商品图片" width="120">
            <template slot-scope="{row}">
              <img :src="row.goods_image" style="width:80px;height:80px" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="goods_title" label="商品名称" width="100"></el-table-column>
          <el-table-column align="center" prop="sku_title" label="商品规格" width="250"></el-table-column>
          <el-table-column align="center" prop="sale_price" label="单价(元)" width="120"></el-table-column>
          <el-table-column align="center" prop="goods_num" label="数量" width="120"></el-table-column>
          <el-table-column align="center" prop="subtotal_amount" label="小计" width="120"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 用户信息 -->
    <div class="user_info common">
      <h2>
        订单信息
        <i></i>
      </h2>
      <div style="margin-top:20px;">
        <li>
          <span class="list_title">手机号</span>
          <p>{{mobile}}</p>
        </li>
        <li>
          <span class="list_title">昵称</span>
          <p>{{nick_name}}</p>
        </li>
      </div>
    </div>
    <!-- 评价详情 -->
    <div class="detail common">
      <h2>
        评价详情
        <i></i>
      </h2>
      <div style="margin-top:20px;">
        <li>
          <span class="list_title">评价时间</span>
          <p>{{create_time}}</p>
        </li>
        <li>
          <span class="list_title">评价星级</span>
          <div class="pingfen">
            <p>
              <span>商品</span>
              <el-rate
                v-model="describe_evaluate_score"
                disabled
                disabled-void-color="#ccc"
                :colors="['#5B83EB', '#5B83EB', '#5B83EB']"
                score-template="{describe_evaluate_score}"
              ></el-rate>
            </p>
            <p>
              <span>物流</span>
              <el-rate
                v-model="logistics_evaluate_score"
                disabled
                disabled-void-color="#ccc"
                :colors="['#5B83EB', '#5B83EB', '#5B83EB']"
                score-template="{logistics_evaluate_score}"
              ></el-rate>
            </p>
            <p>
              <span>服务</span>
              <el-rate
                v-model="service_evaluate_score"
                disabled
                disabled-void-color="#ccc"
                :colors="['#5B83EB', '#5B83EB', '#5B83EB']"
                score-template="{service_evaluate_score}"
              ></el-rate>
            </p>
          </div>
        </li>
        <li>
          <span class="list_title">评价内容</span>
          <p>{{comment_content}}</p>
        </li>
        <li v-show="image_list.length>0">
          <span class="list_title">评价图片</span>
          <p>
            <img v-for="(item,i) in image_list" :key="i" :src="item" />
          </p>
        </li>
        <li v-show="add_reply_time">
          <span class="list_title">追加评价时间</span>
          <p>{{add_reply_time}}</p>
        </li>
        <li v-show="add_reply_content">
          <span class="list_title">追加评价内容</span>
          <p>{{add_reply_content}}</p>
        </li>
      </div>
    </div>
    <!-- 商家回复内容 -->
    <div class="content common" v-show="reply_content">
      <h2>
        商家回复内容
        <i></i>
      </h2>
      <div class="contents">{{reply_content}}</div>
    </div>
    <!-- 按钮 -->
    <div class="btn">
      <el-button type="primary" v-show="is_reply==0" @click="open">回 复</el-button>
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      comment_id: "",
      nick_name: "",
      mobile: "",
      comment_content: "",
      create_time: "",
      reply_content: "",
      goods_list: [],
      is_reply: "",
      order_bn: "",
      image_list: [],
      logistics_evaluate_score: null, //物流
      service_evaluate_score: null, //服务
      describe_evaluate_score: null, //描述
      add_reply_time: "",
      add_reply_content: "",
      reply_content: ""
    };
  },
  created() {
    // this.comment_id = this.$route.query.comment_id;
    // this.commentDetail();
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //评论详情 /apishop/MallPersonal/commentDetail
    commentDetail() {
      this.$axios({
        method: "POST",
        url: "/apishop/MallPersonal/commentDetail",
        data: {
          comment_id: this.comment_id
        }
      }).then(res => {
        if (res.data.status == 1) {
          console.log(res.data.data, "评价详情");
          this.goods_list = res.data.data.goods_list;
          this.nick_name = res.data.data.nick_name;
          this.mobile = res.data.data.mobile;
          this.create_time = res.data.data.create_time;
          this.is_reply = res.data.data.is_reply;
          this.order_bn = res.data.data.order_bn;
          let arr = res.data.data.image_list.slice(0, 3);
          res.data.data.image_list.forEach((item, i, arr) => {
            if (i <= 2) {
              this.image_list.push(item);
            }
            return this.image_list;
          });
          this.reply_content = res.data.data.reply_content;
          this.comment_content = res.data.data.comment_content;
          this.reply_content = res.data.data.reply_content;
          this.service_evaluate_score = parseInt(
            res.data.data.service_evaluate_score
          );
          this.logistics_evaluate_score = parseInt(
            res.data.data.logistics_evaluate_score
          );
          this.describe_evaluate_score = parseInt(
            res.data.data.describe_evaluate_score
          );
       }
      });
    },
    //回复评论 /apishop/MallPersonal/replyComment
    reply(id, con) {
      this.$axios({
        method: "POST",
        url: "/apishop/MallPersonal/replyComment",
        data: {
          comment_id: id,
          content: con
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.commentDetail();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    open() {
      this.$prompt("请输入回复内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: "您没有输入内容"
      }).then(({ value }) => {
        if (value) {
          let str = value.trim();
          this.reply(this.comment_id, str);
        }
      });
    }
    // arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    //   if (rowIndex % 1 === 0) {
    //     if (columnIndex === 0) {
    //       return [1, 2];
    //     } else if (columnIndex === 1) {
    //       return [0, 0];
    //     }
    //   }
    // }
  }
};
</script>


<style lang="scss" scoped>
.appraiseDetail {
  font-family: Microsoft YaHei;
  h1 {
    height: 29px;
    font-size: 22px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
    margin: 14px 0 30px 0;
    width: fit-content;
  }
  h2 {
    //   width: 125px;
    height: 26px;
    font-size: 20px;
    font-weight: bold;
    line-height: 26px;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
    i {
      display: block;
      margin-top: 1px;
      width: 34px;
      height: 2px;
      background: rgba(67, 113, 232, 1);
    }
  }
  .common {
    padding: 20px 20px 30px 30px;
    border-radius: 4px;
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    background: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    li {
      display: flex;
      // height: 40px;
      justify-content: flex-start;
      // align-items: center;
      .pingfen p {
        display: flex;
        span {
          margin-right: 10px;
        }
      }
      span {
        font-size: 16px;
        font-weight: 400;
        line-height: 21px;
        color: rgba(51, 51, 51, 1);
        letter-spacing: 1px;
      }
      p {
        // width: fit-content;
        font-size: 16px;
        font-weight: 400;
        line-height: 21px;
        min-height: 40px;
        color: rgba(51, 51, 51, 1);
        letter-spacing: 1px;
        img {
          width: 60px;
          height: 40px;
          margin-right: 20px;
        }
      }
      .list_title {
        width: 110px;
        height: 21px;
        font-size: 16px;
        //   font-weight: bold;
        line-height: 21px;
        color: rgba(102, 102, 102, 1);
        letter-spacing: 1px;
      }
    }
  }
  .order_info {
    width: 300px;
    height: 161px;
  }
  .goods_info {
    margin-top: 40px;
    width: 1000px;
    //     height: 500px;
  }
  .user_info {
    margin-top: 40px;
    width: 300px;
    height: 161px;
  }
  .detail {
    margin-top: 40px;
    width: 426px;
    // height: 479px;
  }
  .content {
    margin-top: 40px;
    width: 483px;
    .contents {
      margin-top: 20px;
      font-size: 16px;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 1px;
    }
  }
  .btn {
    display: flex;
    width: fit-content;
    margin: 40px 0 20px 0;
  }
}
</style>
