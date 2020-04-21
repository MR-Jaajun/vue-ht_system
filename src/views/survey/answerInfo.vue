<!--
* @Description: 订单列表
* @Author: duo
* @Date: 2019-10-22 11:44:28
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 11:32:02
-->
<template>
  <div class="duoBox">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './survey' }">调查问卷</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './survey' }">问卷列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './surveyInfo' }">问卷详情</el-breadcrumb-item>
      <el-breadcrumb-item>用户答案</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 问题详情 -->
    <div class="issueInfo">
      <div class="oneItem" v-for="(item,index) of info" :key="index">
        <!-- 单选 -->
        <template v-if="item.type==1">
          <el-row class="titleTxt">{{item.problem_title}}</el-row>
          <el-radio-group v-model="item.problem_answer.answer_id">
            <el-radio
              disabled
              :label="i.id"
              v-for="i of item.problem_option"
              :key="i.id"
            >{{i.answer_title}}</el-radio>
          </el-radio-group>
          <!-- <el-radio
            v-model="item.problem_answer.answer_id"
            v-for="i of item.problem_option"
            :key="i.id"
          >{{i.answer_title}}</el-radio>-->
        </template>
        <!-- 多行文本 -->
        <template v-if="item.type == 4">
          <el-row class="titleTxt">{{item.problem_title}}</el-row>
          <el-row class="titleTxt">
            <el-input
              :disabled="true"
              type="textarea"
              :rows="3"
              v-model="item.problem_answer.answer_title"
            ></el-input>
          </el-row>
        </template>
        <!-- 单行文本 -->
        <template v-if="item.type == 3">
          <el-row class="titleTxt">{{item.problem_title}}</el-row>
          <el-row class="titleTxt">
            <el-input :disabled="true" v-model="item.problem_answer.answer_title"></el-input>
          </el-row>
          <!-- <el-input v-model="item.problem_answer.answer_title"></el-input> -->
        </template>
      </div>
    </div>
    <!-- <el-dialog class="duodialog" title="驳回原因" :visible.sync="dialogVisible" @closed="closedFun">
     <el-form :model="form" :rules="rules" ref="form">
       <el-form-item label="驳回原因" prop="denied_reason" :label-width="formLabelWidth">
         <el-input
           type="textarea"
           autosize
           placeholder="请输入内容"
           v-model="form.denied_reason"
           autocomplete="off"
           autofocus
         ></el-input>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="submitForm()">确 定</el-button>
     </div>
    </el-dialog>-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 列表公共
      total: 0,
      listLoading: true, //loading图标
      list: [], //表格列表
      info: {}, //详情

    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    /**获取详情 */
    getInfo() {
      this.$axios({
        method: 'GET',
        url: '/backend/Questionnaire/answerInfo',
        params: { research_volume_client_id: this.$route.params.id || 12 }
      }).then(res => {
        this.info = res.data.data
        console.log(22, this.info)
      })
    },
    /**去详情页 */
    toInfo(id) {
      // let titletxt = row ? "编辑" : "新增"
      this.$router.push({ name: 'answerInfo', params: { id } })
    },
    /**根据条件搜索 */
    getSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000
      let endTime = val[1] / 1000
      this.listQuery.create_time = startTime + '-' + endTime
    },
    /**重置 */
    clearlistQuery() {
      this.listQuery = {
        page: 1, //页码
        size: 20, //每页数据
        status: 0
      }
      this.time = '' //有时间组件填
      this.getList()
    },
    /**通过驳回;
     * 状态(1审核中，2通过3驳回)；*/
    handallEnable(status, id) {
      if (status == 2) {//当前是禁用状态，触发启动接口
        this.postTip("/backend/Distribution/passWithdraw", { withdraw_ids: id })
      }
      else {
        this.dialogVisible = true
        this.form.withdraw_ids = id
      }
    },
    /**dialog隐藏清空表单 */
    closedFun() {
      if (!this.dialogVisible) {
        this.$refs['form'].resetFields();
      }
    },
    /**提交驳回 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.postTip('/backend/Distribution/forbiddenWithdraw', this.form).then(() => {
            this.dialogVisible = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
};
</script>
<style lang="scss">
@import "../../styles/duo.scss";
</style>



<style lang="scss" scoped>
.issueInfo {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .oneItem {
    margin-top: 30px;
    width: 33%;
    // line-height: 2;
    input {
      width: 70%;
      margin-top: 10px;
    }
  }
}
</style>
<style lang="scss">
.oneItem {
  input,
  textarea {
    width: 80%;
    margin-top: 10px;
  }
}
</style>
