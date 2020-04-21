<!--
 * @Description: 
 * @Author: jun
 * @Date: 2019-08-19 17:48:58
 * @LastEditors: jun
 * @LastEditTime: 2019-11-21 11:39:35
 -->
<template>
  <div class="agency-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>外卖订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="search">
      <el-form class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="order_bn" clearable placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="商家名称">
          <el-input v-model="shop_title" clearable placeholder="请输入商家名称"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="custom_uid" clearable placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号">
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
          <el-button type="primary" @click="getsearch">搜索</el-button>
          <el-button style="margin-left:10px;" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <section class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 1624px"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column prop="refund_bn" label="售后单号" align="center" width="150"></el-table-column>
        <el-table-column prop="order_bn" label="原订单号" align="center" width="150"></el-table-column>
        <el-table-column prop="shop_title" label="商家名称" align="center" width="120"></el-table-column>
        <el-table-column prop="mobile" label="用户手机号" align="center" width="120"></el-table-column>
        <el-table-column prop="order_price" sortable label="退款金额" align="center" width="100"></el-table-column>
        <el-table-column prop="order_status" label="售后类型" align="center" width="110">
          <template slot-scope="{row}">
            <span v-show="row.order_status==-1">取消订单</span>
            <span v-show="row.order_status!=-1">申请退款</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="售后状态" align="center" width="110">
          <template slot-scope="{row}">
            <span v-show="row.status==1">申请中</span>
            <span v-show="row.status==2">商家拒绝</span>
            <span v-show="row.status==3">商家同意</span>
            <span v-show="row.status==4">用户取消</span>
            <span v-show="row.status==5">申请平台</span>
            <span v-show="row.status==6">平台同意</span>
            <span v-show="row.status==7">平台拒绝</span>
            <span v-show="row.status==8">用户申请平台后取消</span>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="售后原因" align="center" width="150"></el-table-column>
        <el-table-column prop="content" label="商家拒绝原因" align="center" width="190"></el-table-column>
        <el-table-column prop="create_time" sortable label="申请时间" align="center" width="135"></el-table-column>
        <el-table-column prop="update_time" sortable label="更新时间" width="135" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-link type="primary" size="small" @click="todetail(row.id)">查看</el-link>
            <el-link type="primary" size="small" @click="open(row.id,1)" v-show="row.status == 5">同意</el-link>
            <el-link type="danger" size="small" @click="open2(row.id,2)" v-show="row.status == 5">拒绝</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 15, 20]"
          :page-size="10"
          layout="total,sizes,prev,pager,next,jumper"
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
      total: "", //总页数
      sizes: 10,
      tableData: [],
      shop_title: "",
      order_bn: "", //订单号
      custom_uid: "", //用户ID
      mobile: "", //用户手机
      time_val: "", //下单时间
      create_time: "", //时间戳
      sale_status: "", //售后状态
      sale_status_list: [
        { label: "申请中", value: 1 },
        { label: "商家拒绝", value: 2 },
        { label: "商家同意", value: 3 },
        { label: "用户取消", value: 4 },
        { label: "申请平台", value: 5 },
        { label: "平台同意", value: 6 },
        { label: "平台拒绝", value: 7 },
        { label: "用户申请平台后取消", value: 8 }
      ],
      sale_classify: "", //售后类型
      sale_classify_list: [
        { label: "取消订单", value: -1 },
        { label: "申请退款", value: 1 }
      ]
    };
  },
  watch: {
    create_time() {
      console.log(this.create_time);
    }
  },
  created() {
    this.getSaleAfterList(1);
  },
  methods: {
    clear() {
      this.order_bn = "";
      this.custom_uid = "";
      this.mobile = "";
      this.sale_status = "";
      this.sale_classify = "";
      this.time_val = "";
      this.create_time = "";
      this.shop_title = "";
    },
    //选择时间
    getTime(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.create_time = startTime + "-" + endTime;
    },
    //售后订单列表 /backend/TakeoutOrder/refundList
    getSaleAfterList(page) {
      this.$axios({
        method: "GET",
        url: "/backend/Order/takeoutRefundList",
        params: {
          shop_name: this.shop_title,
          order_bn: this.order_bn,
          custom_uid: this.custom_uid,
          mobile: this.mobile,
          refund_status: this.sale_status,
          create_time: this.create_time,
          status: this.sale_classify,
          page: page,
          size: this.sizes
        }
      }).then(res => {
        this.total = res.data.data.total;
        this.tableData = res.data.data.data;
        console.log(res);
      });
    },
    getsearch() {
      this.getSaleAfterList(1);
    },
    //分页
    handleCurrentChange(val) {
      // this.clear();
      this.getSaleAfterList(val);
    },
    handleSizeChange(val) {
      this.sizes = val;
      console.log(`每页 ${val} 条`);
      this.getSaleAfterList(1);
    },
    //同意或者拒绝 /backend/Order/dealTakeoutOrderRefund
    agreeORrefuse(oid, type, con) {
      this.$axios({
        method: "POST",
        url: "/backend/Order/dealTakeoutOrderRefund",
        params: {
          order_id: oid,
          type: type,
          content: con
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.getSaleAfterList(1);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //
    open(id, type) {
      this.$confirm("您确认退款给该用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.agreeORrefuse(id, type, "同意");
      });
    },
    open2(id, type) {
      console.log(id, type);
      this.$prompt("请输入拒绝原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        console.log(value);
        this.system_off_desc = value;
        if (value.trim()) {
          this.agreeORrefuse(id, type, value);
        } else {
          this.$message.error("请输入拒绝原因");
        }
      });
    },
    //跳转查看
    todetail(id) {
      this.$router.push({ name: "afterSaledetails", params: { order_id: id } });
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
  }
  .block {
    margin-top: 30px;
    height: 30px;
    width: 700px;
  }
}
</style>
<style lang="scss">
.agency-wapper {
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
}
.table .el-link {
  margin: 0 5px;
  font-size: 14px;
}
</style>
