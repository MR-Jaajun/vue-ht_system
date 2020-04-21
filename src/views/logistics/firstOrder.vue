<template>
  <div class="firstOrder">
    <section>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>运营管理</el-breadcrumb-item>
        <el-breadcrumb-item>首单满减优惠券使用记录</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <h1>首单满减优惠券使用记录</h1>
    <!-- 搜索 -->
    <div class="search">
      <el-form class="demo-form-inline">
        <el-form-item label="用户账号">
          <el-input v-model="user" clearable placeholder="请输入"></el-input>
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
    <section class="table">
      <el-table
        v-loading="listLoading"
        border
        ref="multipleTable"
        :data="tableData"
        style="width: fit-content"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
        <el-table-column prop="jd_order_id" label="订单号" align="center" width="150"></el-table-column>
        <el-table-column prop="jd_order_id" label="用户昵称" align="center" width="180"></el-table-column>
        <el-table-column prop="jd_order_id" label="账号" align="center" width="150"></el-table-column>
        <el-table-column prop="jd_order_id" label="优惠面额" align="center" width="180"></el-table-column>
        <el-table-column prop="jd_order_id" label="使用时间" align="center" width="200"></el-table-column>
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
      total: "",
      listLoading: false,
      tableData: [],
      user: "",
      time_val: "",
      create_time: ""
    };
  },
  methods: {
    getsearch() {},
    clear() {
      this.user = "";
      this.create_time = "";
      this.time_val = "";
    },
    //页码操作
    handleCurrentChange(val) {},
    //选择时间
    getTime(val) {
      if (val) {
        let startTime = val[0] / 1000;
        let endTime = val[1] / 1000;
        this.create_time = startTime + "-" + endTime;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.firstOrder {
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
    margin: 40px 0;
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
  .table {
    margin-bottom: 30px;
  }
}
</style>