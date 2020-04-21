<!--
 * @Description: 团购列表
 * @Author: duo
 * @Date: 2019-10-08 10:35:03
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 12:26:19
 -->
<template>
  <div class="pagelist platform">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './bulk' }">团购管理</el-breadcrumb-item>
      <el-breadcrumb-item>团购列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="clearfix duoSearchList">
      <div class="form_item">
        <span>订单号</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.order_bn"></el-input>
      </div>
      <div class="form_item">
        <span>用户手机号</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.mobile"></el-input>
      </div>
      <div class="form_item">
        <span>商家名称</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.shop_name"></el-input>
      </div>
      <div class="form_item">
        <span>订单类型</span>
        <el-select placeholder="请选择" v-model="listQuery.type">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in selectList"
          ></el-option>
        </el-select>
      </div>
      <div class="form_item">
        <span>订单状态</span>
        <el-select placeholder="请选择" v-model="listQuery.status">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in selectStatus"
          ></el-option>
        </el-select>
      </div>
      <!-- 推送时间 -->
      <!-- <div class="form_item">
        <span>更新时间</span>
        <el-date-picker
          @change="getTime"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          v-model="time"
          value-format="timestamp"
        ></el-date-picker>
      </div>-->
      <div class="form_item">
        <el-button @click="getSearch" type="primary">搜索</el-button>
        <el-button @click="clearlistQuery">重置</el-button>
      </div>
    </div>

    <!-- 列表 -->
    <div id="actList">
      <el-table
        :data="list"
        border
        :header-cell-style="{color:'#333', fontWeight: '800'}"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        v-loading="listLoading"
      >
        <el-table-column
          show-overflow-tooltip
          prop="order_bn"
          label="订单号"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column prop="mobile" label="用户手机号" width="150" align="center"></el-table-column>
        <el-table-column prop="shop_title" label="商家名称" width="150" align="center"></el-table-column>
        <el-table-column prop="order_title" label="商品名称" width="150" align="center"></el-table-column>
        <el-table-column sortable prop="total_fee" label="订单金额" width="120" align="center"></el-table-column>
        <el-table-column sortable prop="total_fee" label="实付金额" width="120" align="center">
          <template slot-scope="{row}">{{ row|actuallyPaid }}</template>
        </el-table-column>
        <el-table-column prop="order_status" label="订单状态" width="150" align="center">
          <template slot-scope="{row}">{{ row.order_status|selectStatusFilter }}</template>
        </el-table-column>
        <el-table-column prop="order_type" label="订单类型" width="150" align="center">
          <template slot-scope="{row}">{{ row.is_pink|selectTypeFilter }}</template>
        </el-table-column>
        <el-table-column sortable prop="create_time" label="下单时间" width="150" align="center"></el-table-column>
        <el-table-column sortable prop="pay_time" label="付款时间" width="150" align="center"></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <el-button @click="toInfo(row)" type="text">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row class="setPage">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10, 50, 100]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
import { timestampToTime } from "../../utils/util.js";
export default {
  data() {
    return {
      // 列表公共
      // page: 1,
      // size: 10,
      total: 0,
      listLoading: true, //loading图标
      list: [], //表格列表
      info: {}, //详情
      multipleSelection: "", //列表选中字符串
      time: "", //日期组件展示用
      dialogVisible: false, //弹框

      // 特定页面
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 10, //每页数据
        order_bn: "",
        mobile: "",
        shop_name: "",
        status: "",
        type: ""
      },
      //订单类型：0普通订单、1拼团订单
      selectList: [
        {
          value: "0",
          label: "普通订单"
        },
        {
          value: "1",
          label: "拼团订单"
        }
      ],
      //订单状态-1=已取消、1=未支付、2=待消费、4=已退款、6=待评价、5=已完成、8=拼团中、9=拼团失败
      selectStatus: [
        {
          value: "-1",
          label: "已取消"
        },
        {
          value: "1",
          label: "未支付"
        },
        {
          value: "2",
          label: "待消费"
        },
        {
          value: "4",
          label: "已退款"
        },
        {
          value: "5",
          label: "已完成"
        },
        {
          value: "6",
          label: "待评价"
        },
        {
          value: "8",
          label: "拼团中"
        },
        {
          value: "9",
          label: "拼团失败"
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  computed: {},
  filters: {
    selectTypeFilter(status) {
      //订单类型
      const statusMap = {
        0: "拼团订单",
        1: "普通订单"
      };
      return statusMap[status];
    },

    selectStatusFilter(status) {
      //订单状态
      const statusMap = {
        "-1": "已取消",
        1: "未支付",
        2: "待消费",
        3: "已完成",
        4: "已退款"
      };
      return statusMap[status];
    },

    actuallyPaid: function(row) {
      //实付金额
      if (row.order_status == 1) return 0;
      else return row.total_fee;
    }
  },
  methods: {
    /**获取列表 */
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true;
        this.$axios({
          method: "GET",
          url: "/backend/Order/groupOrderList",
          params: this.listQuery
        }).then(res => {
          resolve(res);
          this.listLoading = false;
          this.list = res.data.data.data;
          this.total = res.data.data.total;
        });
      });
    },
    /**查看详情 */
    getInfo(id) {
      this.dialogVisible = true;
      this.$axios({
        method: "GET",
        url: "/backend/Message/getMessage",
        params: { message_id: id }
      }).then(res => {
        this.info = res.data.data;
      });
    },
    /**去详情页 */
    toInfo(row) {
      // let titletxt = row ? "编辑" : "新增"
      this.$router.push({  name: "order/grouporderdetail", query: { orderID: row.id } });
    },

    /**公共post */
    post(url, data) {
      return new Promise((resolve, reject) => {
        this.listLoading = true;
        this.$axios({
          method: "POST",
          url,
          data
        }).then(res => {
          resolve(res);
          if (res.data.code == 200) {
            this.getList().then(() => {
              this.$message.success(res.data.msg);
            });
          } else {
            this.listLoading = false;
            this.$message(res.data.msg);
          }
        });
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data;
          if (formName == "dynamicValidateForm") {
            data = this.dynamicValidateForm.domains;
          } else {
            for (let i in this.form) {
              this.form[i] = parseInt(this.form[i]);
            }
            data = this.form;
          }
          this.post("/backend/Operation/postGlobal", data);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /**启用禁用; 状态(1启用，2禁用)； 有id是单独操作，否则批量操作*/
    handallEnable(status, id) {
      let _url, txt;
      if (status == 2) {
        //当前是禁用状态，触发启动接口
        txt = "启动";
        _url = "/backend/Operation/deliveryUsing ";
      } else {
        txt = "禁用";
        _url = "/backend/Operation/deliveryForbidden";
      }
      this.$confirm(`确定${txt}选中内容？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.post(_url, { delivery_id: id });
      });
    },
    /**根据条件搜索 */
    getSearch() {
      this.listQuery.page = 1;
      this.getList();
    },
    /**重置 */
    clearlistQuery() {
      this.listQuery = {
        page: 1, //页码
        size: 10, //每页数据
        order_bn: "",
        mobile: "",
        shop_name: "",
        status: "",
        type: ""
      };
      // this.time = '' //有时间组件填
      this.getList();
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.listQuery.update_time = startTime + "-" + endTime;
    },

    /**删除 */
    deleteOne(id) {
      this.$confirm(`确定删除选中内容？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method: "POST",
          url: "/backend/Message/delMessage",
          data: {
            message_id: id
          }
        }).then(res => {
          this.getList();
        });
      });
    },
    /**选择每页多少条 */
    handleSizeChange(val) {
      console.log(`多少条: ${val}`);
      this.listQuery.size = val;
      this.getList();
    },
    /**选择第几页 */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.listQuery.page = val;
      this.getList();
    }
  }
};
</script>
<style lang="scss">
@import "../../styles/duo.scss";
</style>
<style lang="scss" scoped>
.form_item {
  float: left;
  margin: 20px 30px 0 0;
  display: flex;
  &:first-child {
    margin-left: 0;
  }
  span {
    margin-right: 15px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
}
</style>
<style lang="scss">
//有弹框时用
.platform {
  .el-dialog__header {
    display: flex;
  }
  .el-dialog__body {
    font-size: 16px;
    line-height: 2.5;
  }
}
</style>
