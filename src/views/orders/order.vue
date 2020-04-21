<!--
 * @Description: 
 * @LastEditors: jun
 * @LastEditTime: 2019-11-21 11:37:44
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
        <el-form-item label="收货人姓名">
          <el-input v-model="receive_name" clearable placeholder="请输入收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="order_status" clearable placeholder="请选择订单状态">
            <el-option
              v-for="item in order_status_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送员姓名">
          <el-input v-model="rider_name" placeholder="请输入配送员姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="收货人手机号">
          <el-input v-model="receive_mobile" clearable placeholder="请输入收货人手机号"></el-input>
        </el-form-item>
        <el-form-item label="配送类型">
          <el-select v-model="delivery_service" clearable placeholder="请选择配送类型">
            <el-option
              v-for="item in delivery_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="pick_type" clearable placeholder="请选择订单类型">
            <el-option
              v-for="item in pick_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
        ref="multipleTable"
        :data="tableData"
        style="width: 1624px"
 
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column prop="order_bn" label="订单号" align="center" width="140"></el-table-column>
        <el-table-column prop="shop_title" label="商家名称" align="center" width="150"></el-table-column>
        <el-table-column prop="custom_uid" label="用户ID" align="center" width="100"></el-table-column>
        <el-table-column prop="mobile" label="用户手机号" align="center" width="100"></el-table-column>
        <el-table-column prop="receiver_name" label="收货人姓名" align="center" width="100"></el-table-column>
        <el-table-column prop="receiver_mobile" label="收货人手机号" align="center" width="100"></el-table-column>
        <el-table-column prop="total_fee" sortable label="订单金额" align="center" width="100"></el-table-column>
        <el-table-column prop="total_fee" sortable label="实付金额" align="center" width="100"></el-table-column>
        <el-table-column prop="rider_name" label="配送员姓名" align="center" width="100"></el-table-column>
        <el-table-column prop="delivery_service" label="配送类型" align="center" width="100">
          <template slot-scope="{row}">
            <span v-show="row.delivery_service==1">商家自配送</span>
            <span v-show="row.delivery_service==2">小哥配送</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_status" label="订单状态" align="center" width="100">
          <template slot-scope="{row}">
            <span v-show="row.order_status==1">待付款</span>
            <span v-show="row.order_status==2">商家待接单</span>
            <span v-show="row.order_status==3">配送中</span>
            <span v-show="row.order_status==4">待评价</span>
            <span v-show="row.order_status==5">已完成</span>
            <span v-show="row.order_status==-1">已取消</span>
            <span v-show="row.order_status==8">待到店</span>
            <span v-show="row.order_status==9">商家已接单</span>
          </template>
        </el-table-column>
        <el-table-column prop="self_pick" label="订单类型" align="center" width="80">
          <template slot-scope="{row}">
            <span v-show="row.self_pick==1">自取</span>
            <span v-show="row.self_pick==0">配送</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" sortable label="下单时间" align="center" width="180"></el-table-column>
        <el-table-column prop="update_time" sortable label="更新时间" width="180" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="todetail(row.id)">查看</el-button>
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
// import { constants } from "crypto";
export default {
  data() {
    return {
      ids: "",
      tableData: [],
      total: "",
      sizes: 10,
      shop_title: "",
      order_bn: "", //订单号
      custom_uid: "", //用户ID
      mobile: "", //用户手机
      receive_name: "", //收货人
      receive_mobile: "", //收货人手机
      order_status: "", //订单状态
      order_status_list: [
        { label: "待付款", value: 1 },
        { label: "商家待接单", value: 2 },
        { label: "配送中", value: 3 },
        { label: "待评价", value: 4 },
        { label: "已完成", value: 5 },
        { label: "已取消", value: -1 },
        { label: "待到店", value: 8 },
        { label: "商家已接单", value: 9 }
      ],
      create_time: "", //时间戳
      time_val: "", //选择时间
      rider_name: "",
      delivery_service: "", //配送类型
      delivery_list: [
        { label: "商家自配送", value: 1 },
        { label: "小哥配送", value: 2 }
      ],
      pick_type: "", //订单类型
      pick_list: [{ label: "自取", value: 1 }, { label: "配送", value: 0 }]
    };
  },
  watch: {
    delivery_service() {
      console.log(this.delivery_service);
    }
  },
  created() {
    this.getOrderList();
  },
  methods: {
    clear() {
      this.create_time = "";
      this.order_bn = "";
      this.custom_uid = "";
      this.mobile = "";
      this.receive_name = "";
      this.order_status = "";
      this.rider_name = "";
      this.receive_mobile = "";
      this.delivery_service = "";
      this.pick_type = "";
      this.time_val = "";
      this.shop_title = "";
    },
    //选择时间
    getTime(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.create_time = startTime + "-" + endTime;
    },
    //订单列表 /backend/TakeoutOrder/orderList
    getOrderList(page) {
      this.$axios({
        method: "GET",
        url: "/backend/Order/takeoutOrderList",
        params: {
          shop_name: this.shop_title,
          order_bn: this.order_bn,
          custom_uid: this.custom_uid,
          mobile: this.mobile,
          receive_name: this.receive_name,
          receive_mobile: this.receive_mobile,
          order_status: this.order_status,
          create_time: this.create_time,
          rider_name: this.rider_name,
          delivery_service: this.delivery_service,
          pick_type: this.pick_type,
          page: page,
          size: this.sizes
        }
      }).then(res => {
        this.total = res.data.data.total;
        console.log(res.data.data);
        this.tableData = res.data.data.data;
      });
    },
    //搜索
    getsearch() {
      this.tableData = [];
      this.getOrderList(1);
    },
    //分页
    handleCurrentChange(val) {
      // this.clear();
      console.log(val);
      this.getOrderList(val);
    },
    handleSizeChange(val) {
      this.sizes = val;
      console.log(`每页 ${val} 条`);
      this.getOrderList(1);
    },
    //跳转到订单详情
    todetail(id) {
      // this.ids = id;
      // sessionStorage.setItem("orderID", id);
      this.$router.push({ path: "./orderDetail", query: { orderID: id } });
      // console.log(id)
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
</style>
