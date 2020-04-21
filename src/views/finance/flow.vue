<template>
  <div id="activityList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'./flow'}">财务管理</el-breadcrumb-item>
      <el-breadcrumb-item>财务流水列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索表单 -->
    <div class="clearfix" id="form_menu">
      <!-- <div class="form_item">
        <span>关联订单号</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.id"></el-input>
      </div>
      <div class="form_item">
        <span>User ID</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.id"></el-input>
      </div>
      <div class="form_item">
        <span>手机号</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.id"></el-input>
      </div>
      <div class="form_item">
        <span>流水号</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.id"></el-input>
      </div>
      <div class="form_item">
        <span>类型</span>
        <el-select placeholder="请选择" v-model="listQuery.status">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in statusList"
          ></el-option>
        </el-select>
      </div>-->
      <div class="form_item">
        <span>事由</span>
        <el-select placeholder="请选择" v-model="listQuery.finance_type">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in incidentList"
          ></el-option>
        </el-select>
      </div>
      <!-- <div class="form_item">
        <span>发生时间</span>
        <el-date-picker
          @change="getTime"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          v-model="dateStr"
          value-format="timestamp"
        ></el-date-picker>
      </div>-->
      <!-- 搜索 重置 -->
      <div class="form_item">
        <el-button @click="getSearch" style="background-color:#4371E8;width:75px;" type="primary">搜索</el-button>
        <el-button @click="clearlistQuery" style="margin-left:30px;width:75px;">重置</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div id="actList">
      <el-table
        :data="list"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800'}"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        v-loading="listLoading"
      >
        <el-table-column align="center" label="流水号" prop="serial_bn" width="150"></el-table-column>
        <el-table-column align="center" label="关联订单号" prop="order_bn" width="150"></el-table-column>
        <el-table-column align="center" label="User ID" prop="custom_uid" width="150"></el-table-column>
        <el-table-column align="center" label="手机号" prop="custom_mobile" width="150"></el-table-column>
        <el-table-column align="center" label="昵称" prop="custom_nick_name" width="150"></el-table-column>
        <el-table-column align="center" label="类型" prop="serial_type_title" width="100"></el-table-column>
        <el-table-column align="center" label="事由" prop="finance_type_title" width="150"></el-table-column>
        <el-table-column sortable align="center" label="流水金额" prop="serial_fee" width="150"></el-table-column>
        <el-table-column align="center" label="支付方式" prop="serial_pay_type" width="150"></el-table-column>
        <el-table-column align="center" label="到账方式" prop="serial_arrive_type"></el-table-column>
        <el-table-column
          sortable
          align="center"
          label="发生时间"
          prop="serial_time"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
    </div>

    <el-row class="setPage">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[20, 50, 100]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-row>
  </div>
</template>

<script>
import axios from "axios"
export default {
  data() {
    return {
      // 弹出框内容
      dialogVisible: false, //弹出框
      editid: '', //弹出框编辑id
      inputName: '',
      inputScope: '',

      listLoading: true, //loading图标
      list: [], //表格列表
      multipleSelection: '', //列表选中字符串
      dateStr: '', //展示给用户看的时间段
      total: 0, //总数据数
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 20, //每页数据
        finance_type: '1', //类型(如:1=订单收入2=售后退款3=商家提现4=用户佣金提现5=骑手提现6=充值小哥豆7=保证金8=奖金)
      },
      //类型
      statusList: [{
        value: '1',
        label: '收入'
      }, {
        value: "2",
        label: '支出'
      }],
      //事由
      incidentList: [{
        value: '1',
        label: '订单收入'
      }, {
        value: "2",
        label: '售后退款'
      }, {
        value: "3",
        label: '商家提现'
      }, {
        value: "4",
        label: '用户佣金提现'
      }, {
        value: "5",
        label: '骑手提现'
      }, {
        value: "6",
        label: '充值小哥豆'
      }, {
        value: "7",
        label: '保证金'
      }, {
        value: "8",
        label: '奖金'
      }],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 获取列表
     */
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.$axios({
          method: 'GET',
          url: '/backend/FinanceManage/financeList',
          params: this.listQuery
        }).then(res => {
          resolve(res);
          this.listLoading = false
          this.list = res.data.data.data
          console.log(res.data.data)
          this.total = res.data.data.total
        })
      })
    },
    /**根据条件搜索 */
    getSearch() {
      this.listQuery.page = 1
      this.getList()
    },

    /**重置 */
    clearlistQuery() {
      this.listQuery = {
        page: 1, //页码
        size: 20, //每页数据
        finance_type: '1', //事由
      }
      this.getList()
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000
      let endTime = val[1] / 1000
      this.listQuery.create_time = startTime + '-' + endTime
    },
    /**选择每页多少条 */
    handleSizeChange(val) {
      console.log(`多少条: ${val}`)
      this.listQuery.size = val
      this.getList()
    },
    /**选择第几页 */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.listQuery.page = val
      this.getList()
    },
  }
}
</script>
<style lang="scss" scoped>
html.body {
  font-family: Microsoft YaHei;
}
#activityList {
  width: 1642px;
  overflow: hidden;
}
.addbtn {
  //   width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 80px;
}
.act_title {
  margin-top: 15px;
  font-size: 22px;
  color: rgba(51, 51, 51, 1);
}
//创建活动按钮
.creat_btn {
  width: 123px !important;
  // margin: -10px 0 34px 0;
  // margin-top: 36px !important;
  background: rgba(67, 113, 232, 1);
}
//搜索的内容
#form_menu {
  margin-top: 13px;
  width: 1630px;
}
.form_item {
  // width: 300px;
  float: left;
  margin: 0 92px 15px 0;
  display: flex;
  justify-content: space-between;
  span {
    width: 70px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    margin-right: 15px;
    color: rgba(51, 51, 51, 1);
  }
}

//列表
#actList {
  width: 1630px;
  // max-height: 663px;
  overflow-y: auto;
  border: 1px solid rgba(204, 204, 204, 1);
  div .el_link:nth-last-child(1) {
    border-right: 0;
  }
  .el_link {
    // border-right: 1px solid;
    height: 16px;
    margin: 0 4px;
  }
}

.setStatusRow {
  display: flex;
  margin: 24px 0;
}
.setPage {
  margin: 20px 0;
}
.rowCenter {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss">
.el-row {
  > .el-select {
    margin-right: 10px;
  }
}
.el-select {
  width: 215px;
}
</style>