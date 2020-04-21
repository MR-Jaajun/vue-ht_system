<template>
  <div class="zy_after">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>自营商品售后订单</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>售后订单管理</h1>
    <!-- 填写退款金额 -->
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
    <!-- 搜索 -->
    <div class="search">
      <el-form class="demo-form-inline">
        <el-form-item label="售后订单号">
          <el-input v-model="refund_bn" clearable placeholder="请输入售后订单号"></el-input>
        </el-form-item>
        <el-form-item label="原订单号">
          <el-input v-model="order_bn" clearable placeholder="请输入原订单号"></el-input>
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
          <el-button type="primary" @click="getsearch">搜索</el-button>
          <el-button plain style="margin-left:10px;" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <section class="table">
      <el-table
        v-loading="listLoading"
        border
        ref="multipleTable"
        :data="tableData"
        style="width: fit-content"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column prop="jd_order_id" label="京东订单号" align="center" width="120"></el-table-column>
        <el-table-column prop="refund_bn" label="售后单号" align="center" width="150"></el-table-column>
        <el-table-column prop="order_bn" label="原订单号" align="center" width="150"></el-table-column>
        <el-table-column prop="shop_title" label="售后商品信息" align="center" width="310">
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
        <el-table-column prop="receiver_name" label="收货人姓名" align="center" width="100"></el-table-column>
        <el-table-column prop="receiver_mobile" label="收货人手机号" align="center" width="100"></el-table-column>
        <el-table-column prop="pay_fee" label="售后订单金额" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{row.refund_status==3?row.pay_fee:"/"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_price" label="订单金额" align="center" width="100"></el-table-column>
        <!-- <el-table-column prop="order_price" label="订单状态" align="center" width="100"></el-table-column> -->
        <el-table-column prop="refund_type" label="售后类型" align="center" width="100">
          <template slot-scope="{row}">
            <span v-show="row.refund_type==1">仅退款</span>
            <span v-show="row.refund_type==2">退货退款</span>
            <span v-show="row.refund_type==3">换货</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="售后状态" align="center" width="100">
          <template slot-scope="{row}">
            <span v-show="row.refund_status==1" style="color:red">申请中</span>
            <span v-show="row.refund_status==2">商家拒绝</span>
            <span v-show="row.refund_status==3">商家同意</span>
            <span v-show="row.refund_status==4">已取消</span>
            <!-- <span v-show="row.status==5">用户发货</span>
            <span v-show="row.status==6">退货确认</span>
            <span v-show="row.status==7">拒绝收货</span>
            <span v-show="row.status==8">退货系统关闭</span>
            <span v-show="row.status==9">商家换货发货</span>
            <span v-show="row.status==10">确认收货</span>
            <span v-show="row.status==11">平台处理</span>-->
          </template>
        </el-table-column>
        <el-table-column prop="create_time" sortable label="下单时间" align="center" width="150"></el-table-column>
        <el-table-column prop="update_time" sortable label="付款时间" width="150" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <el-link type="primary" size="small" @click="todetail(row)">查看</el-link>
            <el-link
              type="primary"
              size="small"
              v-show="row.status==1&&row.refund_type!=3"
              @click="open3(row.id,row.order_price)"
            >同意退款</el-link>
            <el-link
              type="danger"
              size="small"
              v-show="row.status==1&&row.refund_type!=3"
              @click="open(row.id)"
            >拒绝退款</el-link>
            <el-link
              type="primary"
              size="small"
              v-show="row.status==1&&row.refund_type==3"
              @click="open2(row.id)"
            >同意换货</el-link>
            <el-link
              type="danger"
              size="small"
              v-show="row.status==1&&row.refund_type==3"
              @click="open(row.id)"
            >拒绝换货</el-link>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- page-size每页显示条目个数 -->
    <div class="pagination-container">
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
      total: "", //总页数
      tableData: [{ refund_bn: "666sssssss" }], //列表数组
      order_bn: "", //原订单号
      refund_bn: "", //售后订单号
      mobile: "", //用户手机
      time_val: "", //下单时间
      create_time: "", //时间戳
      sale_status: "", //售后状态
      sale_status_list: [
        { label: "申请中", value: 1 },
        { label: "商家拒绝", value: 2 },
        { label: "商家同意", value: 3 },
        { label: "用户取消", value: 4 },
        { label: "用户发货", value: 5 },
        { label: "收货确认", value: 6 }
      ],
      sale_classify: "", //售后类型
      sale_classify_list: [
        { label: "仅退款", value: 1 },
        { label: "退货退款", value: 2 }
      ],
      page: 1,
      sizes: 10,
      order_id: "",
      order_price: "",
      dialogFormVisible: false,
      re_money: ""
    };
  },
  created() {
    this.mallRefundList(1);
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

    /**重置 **/
    clear() {
      this.order_bn = "";
      this.refund_bn = "";
      this.custom_uid = "";
      this.mobile = "";
      this.sale_status = "";
      this.order_status = "";
      this.time_val = "";
      this.sale_classify = "";
      this.create_time = "";
      this.order = "";
    },
    //售后列表 /backend/JdOrder/mallRefundList
    mallRefundList(page) {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/JdOrder/mallRefundList",
        params: {
          refund_bn: this.refund_bn,
          order_id: this.order_bn,
          mobile: this.mobile,
          refund_status: this.sale_status,
          create_time: this.create_time,
          refund_type: this.sale_classify,
          page: page,
          size: 10
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.listLoading = false;
          console.log(res.data.data.data, "售后列表");
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
        }
      });
    },
    getsearch() {
      this.mallRefundList(1);
    },
    //页码操作
    handleCurrentChange(val) {
      this.page = val;
      this.mallRefundList(val);
    },
    //跳转到详情页
    todetail(row) {
      this.$router.push({
        path: "./delerAfterDetail",
        query: { orderID: row.id }
      });
    },
    //拒绝操作
    open(id) {
      this.$confirm("您是否拒绝该订单退款, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.refund(id, 2, null);
      });
    },
    //同意换货
    open2(id) {
      this.$confirm("您是否同意该订单换货, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.refund(id, 1, null);
      });
    },
    //同意退款 且输入退款金额
    open3(id, price) {
      this.dialogFormVisible = true;
      this.order_id = id;
      this.order_price = price;
    },
    submit() {
      if (this.re_money) {
        if (this.order_price >= this.re_money) {
          this.refund(this.order_id, 1, this.re_money);
        } else {
          this.$message.error("退款金额不能大于订单金额");
        }
      } else {
        this.$message.error("退款金额不能为空");
      }
    },
    cancel() {
      this.re_money = "";
      this.order_id = "";
      this.order_price = "";
      this.dialogFormVisible = false;
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
          this.mallRefundList(1);
          this.$message.success(res.data.msg);
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
.zy_after {
  .search {
    margin-top: 40px;
    margin-bottom: 40px;
    // width: 1000px;
  }
  .table {
    margin-top: 40px;
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
        width: 220px;
        .info1 {
          height: 50%;
          display: flex;
          justify-content: space-between;
          color: #333;
          .info_title {
            width: 180px;
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
.pagination-container {
  margin-top: 40px;
}
</style>
<style lang="scss">
.zy_after {
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
<style lang="scss">
.edit_dia {
  //弹窗
  .dialog {
    .el-dialog__header {
      position: relative;
      // display: flex;
      height: 70px;
      .el-dialog__title {
        position: absolute;
        top: 32px;
        left: 30px;
        font-size: 22px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
  .el-dialog__body {
    padding: 30px 30px 5px 30px;
    .dis_num {
      display: flex;
      .el-input {
        width: 80px;
        // margin-right: 20px;
        .el-input__inner {
          width: 80px;
        }
      }
    }
    .el-input {
      width: 190px;
    }
    .el-input__inner {
      width: 190px;
    }
    .el-form-item__label {
      color: #333;
      // margin-right: 20px;
      width: 140px;
    }
    .el-upload-list__item {
      width: 64px;
      height: 64px;
      border: 1px solid #dddbdb;
    }
  }
}
</style>