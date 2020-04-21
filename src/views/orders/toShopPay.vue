<!--
 * @Author: your name
 * @Date: 2019-11-08 09:51:01
 * @LastEditTime: 2019-11-21 11:41:38
 * @LastEditors: jun
 * @Description: In User Settings Edit
 * @FilePath: \xiaoGe2_main_CMS\src\views\orders\toShopPay.vue
 -->


<template>
  <!-- 到店付订单 -->
  <div class="toShopPay">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>到店付订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="search">
      <el-form class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="order_bn" clearable placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input v-model="mobile" clearable placeholder="请输入用户手机号"></el-input>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            value-format="timestamp"
            v-model="time_val"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getsearch">搜索</el-button>
          <el-button style="margin-left:10px;" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <section class="table">
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="tableData"
        style="fit-content"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column prop="payment_id" label="订单号" align="center" width="200"></el-table-column>
        <el-table-column prop="mobile" label="用户手机号" align="center" width="150"></el-table-column>
        <el-table-column prop="shop_title" label="店铺名称" align="center" width="200"></el-table-column>
        <el-table-column label="店铺地址" align="center" width="200">
          <template slot-scope="{row}">
            <span>{{row.province}}{{row.city}}{{row.area}}{{row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cur_money" label="付款金额" align="center" width="150"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" align="center" width="180" sortable></el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="todetail(row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total,prev,pager,next,jumper"
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
      order_bn: "",
      mobile: "",
      time_val: "",
      create_time: "",
      tableData: [],
      total: ""
    };
  },
  created() {
    this.payOrderList(1);
  },
  methods: {
    //选择时间
    getTime(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.create_time = startTime + "-" + endTime;
    },
    clear() {
      this.create_time = "";
      this.order_bn = "";
      this.mobile = "";
      this.time_val = "";
    },
    //到店订单列表 /backend/Order/payOrderList
    payOrderList(page) {
      this.loading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Order/payOrderList",
        params: {
          order_bn: this.order_bn,
          mobile: this.mobile,
          create_time: this.create_time,
          page: page,
          size: 10
        }
      }).then(res => {
        console.log(res.data.data.data);
        if (res.data.status == 1) {
          this.loading = false;
          this.total = res.data.data.total;
          this.tableData = res.data.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //搜索
    getsearch() {
      //   this.tableData = [];
      this.payOrderList(1);
    },
    //分页
    handleCurrentChange(val) {
      // this.clear();
      console.log(val);
      this.payOrderList(val);
    },
    //跳转到订单详情
    todetail(id) {
      // this.ids = id;
      this.$router.push({ path: "./toShopPaydetail", query: { o_id: id } });
      // console.log(id)
    }
  }
};
</script>

<style lang="scss" scoped>
.toShopPay {
  .search {
    margin-top: 40px;
    // width: fit-content;
    .el-form {
      justify-content: flex-start;
      //   flex-direction: row;
      align-items: center;
      display: flex;
      // flex-wrap: wrap;
    }
    .el-form-item {
      display: flex;
      align-items: center;
      margin-right: 35px;
      width: fit-content;
    }
  }
  .table {
    margin-top: 30px;
    width: fit-content;
  }
  .block {
    margin-top: 30px;
    height: 30px;
    width: 700px;
  }
}
</style>
<style lang="scss">
// .search {
//   .el-form {
//     justify-content: flex-start;
//     flex-direction: row;
//     display: flex;
//     // flex-wrap: wrap;
//   }
//   .el-form-item {
//     display: flex;
//     align-items: center;
//     margin-right: 35px;
//     width: 200px;
//     .el-form-item__content {
//       width: fit-content;
//     }
//     .el-form-item__label {
//       width: 100px;
//       text-align: left;
//       .el-input {
//         width: fit-content;
//       }
//       .el-input__inner {
//         width: fit-content;
//       }
//     }

//     .el-date-editor {
//       width: 380px;
//     }
//   }
// }
