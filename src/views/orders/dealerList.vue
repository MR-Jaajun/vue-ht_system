<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2020-02-20 14:54:09
 -->
<template>
  <div class="divList">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>自营订单</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>自营订单管理</h1>
    <div class="search">
      <el-form class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="order_bn" clearable placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="goods_name" clearable placeholder="请输入商家名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="用户手机号">
          <el-input v-model="mobile" clearable placeholder="请输入用户手机号"></el-input>
        </el-form-item>-->
        <el-form-item label="收货人姓名">
          <el-input v-model="receive_name" clearable placeholder="请输入收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="收货人手机号">
          <el-input v-model="receive_mobile" clearable placeholder="请输入收货人手机号"></el-input>
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
          <el-button type="primary" plain @click="getsearch">搜索</el-button>
          <el-button plain style="margin-left:10px;" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <section class="table">
      <el-table
        border
        v-loading="listLoading"
        :data="tableData"
        style="width: fit-content"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column prop="id" label="京东订单号" align="center" width="100"></el-table-column>
        <el-table-column prop="order_bn" label="订单号" align="center" width="100"></el-table-column>
        <el-table-column prop="shop_title" label="商品信息" align="center" width="330">
          <template slot-scope="{row}">
            <div class="goodsinfo" v-for="(item,i) in row.goods_info" :key="i">
              <img :src="item.cover_image" />
              <div class="ginfo">
                <div class="info1">
                  <span class="info_title">{{item.goods_title}}</span>
                  <span>{{item.sale_price}}</span>
                </div>
                <div class="info1">
                  <span>{{item.sku_title}}</span>
                  <span>×{{item.goods_num}}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="custom_uid" label="用户ID" align="center" width="100"></el-table-column>
        <el-table-column prop="mobile" label="用户手机号" align="center" width="100"></el-table-column>
        <el-table-column prop="nick_name" label="收货人姓名" align="center" width="120"></el-table-column>
        <el-table-column prop="receiver_mobile" label="收货人手机号" align="center" width="100"></el-table-column>
        <el-table-column prop="total_fee" sortable label="订单金额" align="center" width="100"></el-table-column>
        <el-table-column prop="total_fee" sortable label="实付金额" align="center" width="100"></el-table-column>
        <el-table-column prop="order_status" label="订单状态" align="center" width="100">
          <template slot-scope="{row}">
            <span v-show="row.order_status==1">待付款</span>
            <span v-show="row.order_status==2">待发货</span>
            <span v-show="row.order_status==3">待收货</span>
            <span v-show="row.order_status==4">待评价</span>
            <span v-show="row.order_status==5">已完成</span>
            <span v-show="row.order_status==-1">已取消</span>
            <span v-show="row.order_status==8">拼团中</span>
            <span v-show="row.order_status==9">拼团失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_type" label="订单类型" align="center" width="80">
          <template slot-scope="{row}">
            <span v-show="row.order_type==1">拼团</span>
            <span v-show="row.order_type==0">普通</span>
            <span v-show="row.order_type==2">秒杀</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" sortable label="下单时间" align="center" width="180"></el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="todetail(row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- page-size每页显示条目个数 -->
    <div class="paseSize" style="margin-top:30px;">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :total="total*1"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listLoading: false,
      ids: "",
      tableData: [],
      total: "",
      goods_name: "",
      order_bn: "", //订单号
      mobile: "", //用户手机
      receive_name: "", //收货人
      receive_mobile: "", //收货人手机
      order_status: "", //订单状态
      order_status_list: [
        { label: "待付款", value: 1 },
        { label: "待发货", value: 2 },
        { label: "待收货", value: 3 },
        { label: "待评价", value: 4 },
        { label: "已完成", value: 5 },
        { label: "已取消", value: -1 },
        { label: "拼团中", value: 8 },
        { label: "拼团失败", value: 9 }
      ],
      create_time: "", //时间戳
      time_val: "", //选择时间
      pick_type: "", //订单类型
      pick_list: [
        { label: "普通", value: 0 },
        { label: "拼团", value: 1 },
        { label: "秒杀", value: 2 }
      ],
      sizes: 10,
      page: 1
    };
  },
  watch: {
    order_status() {
      console.log(this.order_status);
    }
  },
  created() {
    this.getOrderList(1);
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
    //订单列表 /backend/jd_order/mallOrderList
    getOrderList(page) {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/jd_order/mallOrderList",
        params: {
          good_name: this.goods_name,
          order_bn: this.order_bn,
          mobile: this.mobile,
          receive_name: this.receive_name,
          receive_mobile: this.receive_mobile,
          status: this.order_status,
          create_time: this.create_time,
          pick_type: this.pick_type,
          size: this.sizes,
          page: page
        }
      }).then(res => {
        if (res.data.status == 1) {
          console.log(res.data.data, "订单列表");
          this.listLoading = false;
          this.total = res.data.data.total;
          this.tableData = res.data.data.data;
        }
      });
    },
    //搜索
    getsearch() {
      this.tableData = [];
      this.getOrderList(1);
    },
    /**重置 **/
    clear() {
      this.order_bn = "";
      this.mobile = "";
      this.receive_name = "";
      this.receive_mobile = "";
      this.order_status = "";
      this.time_val = "";
      this.pick_type = "";
      this.create_time = "";
      this.shop_title = "";
    },
    //页码操作
    handleCurrentChange(val) {
      this.page = val;
      this.getOrderList(val);
    },
    //跳转到订单详情
    todetail(id) {
      this.$router.push({ path: "./dealerDetail", query: { orderID: id } });
    }
  }
};
</script>
<style lang="scss" scoped>
.divList {
  h1 {
    margin-top: 10px;
    margin-bottom: 30px;
    width: fit-content;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  .search {
    margin-top: 20px;
    width: fit-content;
  }
  .table {
    margin-top: 30px;
    .goodsinfo {
      display: flex;
      align-items: center;
      margin: 12px 0px;
      min-height: 50px;
      img {
        width: 50px;
        height: 50px;
        // background: #ccc;
        margin-right: 10px;
      }
      .ginfo {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 50px;
        width: 320px;
        .info1 {
          text-align: left;
          height: 50%;
          display: flex;
          justify-content: space-between;
          color: #333;
          .info_title {
            width: 200px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .block {
    margin-top: 30px;
    height: 30px;
    width: 700px;
  }
}
</style>

<style lang="scss">
.divList {
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
</style>
