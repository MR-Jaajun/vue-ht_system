<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-24 20:53:45
 * @LastEditors: jun
 * @LastEditTime: 2019-11-21 11:40:59
 -->
<template>
  <div class="agency-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>商城售后订单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="search">
      <el-form class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="order_bn" clearable placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="商家名称">
          <el-input v-model="shop_title" clearable placeholder="请输入商家名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="mobile" clearable placeholder="请输入用户手机号"></el-input>
        </el-form-item>
        <el-form-item label="售后状态">
          <el-select v-model="sale_status" clearable placeholder="请选择订单状态">
            <el-option
              v-for="item in sale_status_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="售后类型">
          <el-select v-model="sale_classify" clearable placeholder="请选择配送类型">
            <el-option
              v-for="item in sale_classify_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间">
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
          <el-button type="primary" plain @click="getsearch">搜索</el-button>
          <el-button type="primary" plain style="margin-left:10px;" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <section class="table">
      <el-table
        border
        ref="multipleTable"
        :data="tableData"
        style="width: 1624px"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column prop="refund_bn" label="售后单号" align="center" width="150"></el-table-column>
        <el-table-column prop="order_bn" label="原订单号" align="center" width="150"></el-table-column>
        <el-table-column prop="shop_title" label="商家名称" align="center" width="150"></el-table-column>
        <el-table-column prop="mobile" label="用户手机号" align="center" width="110"></el-table-column>
        <el-table-column prop="order_price" sortable label="退款金额" align="center" width="100"></el-table-column>
        <el-table-column prop="refund_type" label="售后类型" align="center" width="110">
          <template slot-scope="{row}">
            <span v-show="row.refund_type==2">退货退款</span>
            <span v-show="row.refund_type==1">仅退款</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="售后状态" align="center" width="120">
          <template slot-scope="{row}">
            <span v-show="row.status==1">申请中</span>
            <span v-show="row.status==2">商家拒绝</span>
            <span v-show="row.status==3">商家同意</span>
            <span v-show="row.status==4">用户取消</span>
            <span v-show="row.status==5">用户发货</span>
            <span v-show="row.status==6">退货确认</span>
            <span v-show="row.status==7">拒绝收货</span>
            <span v-show="row.status==8">退货系统关闭</span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="售后原因" align="center" width="150"></el-table-column>
        <el-table-column prop="content" label="商家拒绝原因" align="center" width="200"></el-table-column>
        <el-table-column prop="create_time" sortable label="申请时间" align="center" width="150"></el-table-column>
        <el-table-column prop="update_time" sortable label="更新时间" width="150" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-link type="primary" size="small" @click="todetail(row)">查看</el-link>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- page-size每页显示条目个数 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total*1"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: "", //总页数
      tableData: [],
      shop_title:"",
      order_bn: "", //订单号
      custom_uid: "", //用户ID
      mobile: "", //用户手机
      time_val: "", //下单时间
      create_time: "", //时间戳
      sale_status: "", //售后状态
      sale_status_list: [
        { label: "申请", value: 1 },
        { label: "商家拒绝", value: 2 },
        { label: "商家同意", value: 3 },
        { label: "用户取消", value: 4 },
        { label: "用户发货", value: 5 },
        { label: "收货确认", value: 6 },
        { label: "拒绝收货", value: 7 },
        { label: "退货系统关闭", value: 8 }
      ],
      sale_classify: "", //售后类型
      sale_classify_list: [
        { label: "仅退款", value: 1 },
        { label: "退货退款", value: 2 }
      ],

      sizes: 10
    };
  },
  watch: {
    sale_classify() {
      console.log(this.sale_classify);
    }
  },
  created() {
    this.getSaleAfterList();
  },
  methods: {
    //选择时间
    getTime(val) {
      if (val) {
        let startTime = val[0] / 1000;
        let endTime = val[1] / 1000;
        this.create_time = startTime + "-" + endTime;
      }
    },
    //售后订单列表 /backend/TakeoutOrder/refundList
    getSaleAfterList(page) {
      this.$axios({
        method: "GET",
        url: "/backend/Order/mallRefundList",
        params: {
          shop_name: this.shop_title,
          refund_bn: this.order_bn,
          mobile: this.mobile,
          refund_type: this.sale_classify,
          create_time: this.create_time,
          refund_status: this.sale_status,
          size: this.sizes,
          page: page
        }
      }).then(res => {
        this.total = res.data.data.total;
        this.tableData = res.data.data.data;
        // this.total = this.tableData.length;
        console.log(res);
      });
    },
    getsearch() {
      this.tableData = [];
      this.getSaleAfterList(1);
    },
    //跳转查看
    todetail(row) {
      this.$store.commit("set_id", row.id);
      this.$router.push({
        name: "mallRefundDetail",
        params: { order_id: row.id }
      });
    },
    /**重置 **/
    clear() {
      this.order_bn = "";
      this.custom_uid = "";
      this.mobile = "";
      this.sale_status = "";
      this.order_status = "";
      this.time_val = "";
      this.sale_classify = "";
      this.create_time = "";
      this.shop_title = "";
    },
    //页码操作
    handleSizeChange(val) {
      // this.clear()
      if (val > this.total) {
        this.sizes = 14;
      } else {
        this.sizes = val;
      }
      this.getSaleAfterList(1);
    },
    handleCurrentChange(val) {
      // this.clear();
      this.getSaleAfterList(val);
    }
  }
};
</script>

<style lang="scss" scoped>
.agency-wapper {
  .sh1 {
    margin-top: 20px;
    display: flex;
    height: 40px;
  }
  .search {
    margin-top: 40px;
    // width: 1000px;
  }
  .table {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .block {
    margin-top: 30px;
    height: 30px;
    width: 700px;
  }
}
</style>
<style lang="scss">
.search {
  .el-form {
    justify-content: flex-start;
    display: flex;
    flex-wrap: wrap;
    width: 1200px;
  }
  .el-form-item {
    display: flex;
    align-items: center;
    margin-right: 35px;
    .el-form-item__label {
      width: 100px;
      text-align: left;
    }
    .el-input {
      width: 180px;
    }
    .el-date-editor {
      width: 380px;
    }
  }
}
.table .el-link {
  margin: 0 5px;
  font-size: 14px;
}
</style>
