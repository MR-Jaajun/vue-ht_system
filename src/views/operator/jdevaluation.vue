<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-10-12 19:13:57
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-10 10:05:44
 -->
<template>
  <div class="appraise">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>商城模块</el-breadcrumb-item>
      <el-breadcrumb-item>评价列表</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>评价管理</h1>
    <div class="search">
      <el-form>
        <el-form-item label="订单号">
          <el-input v-model="mobile" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="mobile" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="goods" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="评级星级">
          <el-select v-model="star" placeholder="请输入" @change="changeStar" clearable>
            <el-option label="全部" value="0"></el-option>
            <el-option label="好评" value="1"></el-option>
            <el-option label="中评" value="2"></el-option>
            <el-option label="差评" value="3"></el-option>
            <el-option label="未回复" value="4"></el-option>
            <el-option label="未回复的差评" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="status" placeholder="请输入" @change="changeStatus" clearable>
            <el-option label="已回复" value="1"></el-option>
            <el-option label="未回复" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论时间">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeTime"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getsearch">搜 索</el-button>
          <el-button @click="clear">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <section class="shop-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width:100%"
        highlight-current-row
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800', height:'62px',fontSize:'14px' }"
      >
        <el-table-column type="index" align="center" width="150" label="序号"></el-table-column>
        <el-table-column align="center" prop="coupon_title" label="商品信息" width="280">
          <template slot-scope="{row}">
            <div>
              <div class="fl_cen">
                <img :src="row.goods_image" alt />
                <div class="con">
                  <div class="two">
                    <span>{{row.goods_title}}</span>
                    <span>x{{row.goods_num}}</span>
                  </div>
                  <div class="two">
                    <span class="color">{{row.sku_title}}</span>
                    <span>x{{row.sale_price}}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="nick_name" label="用户昵称" width="180"></el-table-column>
        <el-table-column align="center" prop="mobile" label="手机号" width="120"></el-table-column>
        <el-table-column align="center" prop="evaluate_level" label="评价星级" width="100">
          <template slot-scope="{row}">
            <span v-show="row.evaluate_level==1">好评</span>
            <span v-show="row.evaluate_level==2">中评</span>
            <span v-show="row.evaluate_level==3">差评</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="comment_content" label="评价内容" width="200"></el-table-column>
        <el-table-column align="center" prop="create_time" label="评价时间" width="180"></el-table-column>
        <el-table-column align="center" label="状态" width="100">
          <template slot-scope="{row}">
            <span>{{row.reply_content?'已回复':'未回复'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="操作">
          <template slot-scope="{row}">
            <el-link
              type="primary"
              :underline="false"
              class="el_link"
              @click="todetail(row.comment_id)"
            >查看</el-link>
            <el-link
              type="danger"
              :underline="false"
              v-show="row.reply_content?false:true"
              class="el_link"
              @click="open(row.comment_id)"
            >回复</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="margin-top: 25px;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, jumper"
          :total="total*1"
        ></el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      total: "",
      ordernum: "",
      mobile: "",
      goods: "",
      status: "",
      star: '',
      time: "",
      gettime: ""
    };
  },
  created() {
    this.commentList(1);
  },
  methods: {
    //重置
    clear() {
      // this.ordernum = "";
      this.mobile = "";
      // this.goods = "";
      this.status = "";
      this.star = "";
      this.time = "";
      this.gettime = "";
      // this.$router.push({ path: "./appraiseDetail" });
      //  this.$router.push({ path: './appraiseDetail', query: { aid: 'private' }})
    },
    getsearch() {
      this.commentList(1);
    },
    changeStatus(value) {
      console.log(value);
      this.status = value;
    },
    changeStar(value) {
      console.log(value);
      this.star = value;
    },
    changeTime(value) {
      if (value) {
        let time1 = value[0] / 1000;
        let time2 = value[1] / 1000;
        this.gettime = time1 + "," + time2;
      } else {
        this.gettime = "";
      }
      console.log(value[0] / 1000, value[1] / 1000);
    },
    //评价列表  /apishop/MallPersonal/commentList
    commentList(page) {
      this.loading = true;
      this.$axios({
        method: "POST",
        url: "/apishop/MallPersonal/commentList",
        data: {
          comment_type: this.star ? this.star : 0,
          keyword: this.mobile,
          page_no: page,
          page_size: 10,
          comment_time: this.gettime,
          comment_status: this.status
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.loading = false;
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          console.log(res, "评价列表");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //分页
    handleCurrentChange(val) {
      this.commentList(1);
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
          this.commentList(1);
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    open(id) {
      this.$prompt("请输入回复内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: "您没有输入内容"
      }).then(({ value }) => {
        if (value) {
          let str = value.trim();
          this.reply(id, str);
        }
      });
    },
    todetail(id) {
      this.$router.push({
        path: "./appraiseDetail",
        query: { comment_id: id }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.appraise {
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
  .search {
    margin: 26px 0 30px 0;
    .el-form {
      display: flex;
      // width: 1500px;
      width: fit-content;
      align-items: center;
      flex-wrap: wrap;
      .el-form-item {
        margin-right: 50px;
        display: flex;
        align-items: center;
      }
    }
  }
  .shop-table {
    width: fit-content;
    .el-link {
      margin: 0 5px;
    }
    .fl_cen {
      display: flex;
      align-items: center;
      > img {
        width: 64px;
        height: 64px;
        margin-right: 10px;
      }
      .two {
        display: flex;
        justify-content: space-between;
      }
      .con {
        height: 64px;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
      .color {
        color: #4371e8;
      }
    }
  }
}
</style>
