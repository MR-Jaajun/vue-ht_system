<!--
 * @Description: 查看商家详情
 * @Author: Roc
 * @Date: 2019-09-26 19:14:00
 * @LastEditors: Roc
 * @LastEditTime: 2019-09-26 19:16:20
 -->
<template>
  <div class="limitInfo-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>秒杀审核列表</el-breadcrumb-item>
      <el-breadcrumb-item>查看商家详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>查看商家详情</h1>
    <div class="form_div">
      <h2>
        活动基本信息
        <i>(*为必填项或必选项)</i>
        <i class="XI"></i>
      </h2>
      <el-form ref="form" :model="form">
        <el-form-item label="活动名称" required>
          <el-input
            type="text"
            placeholder="请输入内容"
            v-model="ruleForm.name"
            maxlength="20"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="活动开始时间" required>
          <el-form-item prop="date1">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.date1"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="活动结束时间" required>
          <el-form-item prop="date1">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.date2"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_div">
      <el-form>
        <el-form-item label="活动时间段" required></el-form-item>
      </el-form>
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="custom_uid" label="时间段名称" align="center" width="147"></el-table-column>
        <el-table-column prop="mobile" label="开始时间" align="center" width="147"></el-table-column>
        <el-table-column prop="gender" label="结束时间" align="center" width="147"></el-table-column>
        <el-table-column prop="initve" label="限制商品数量" align="center" width="148"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button @click="lookdetails(row)" type="primary" round>查看设置商品</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 返回 -->
    <el-button type="primary" plain @click="backdown">返回上一页</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        date1: "",
        date2: ""
      }
    };
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
      sessionStorage.removeItem("orderID");
    },
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>
</script>

<style lang="scss" scoped>
.limitInfo-wapper {
  h1 {
    margin: 10px 0 35px 0;
    height: 29px;
    font-size: 22px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  .form_div {
    width: 536px;
    height: 261px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 30px;
    margin-bottom: 40px;
    h2 {
      height: 29px;
      font-size: 22px;
      font-weight: bold;
      line-height: 29px;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 1px;
      margin-bottom: 26px;
      i:nth-child(1) {
        height: 29px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 29px;
        color: rgba(102, 102, 102, 1);
      }
    }
    .el-form {
      padding-right: 140px;
      .el-form-item {
        display: flex;
        justify-content: space-between;
        line-height: 50px;
      }
    }
  }
  .table_div {
    width: 846px;
    height: 478px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 30px;
  }
}
</style>

