<!--
* @Description: 订单列表
* @Author: duo
* @Date: 2019-10-22 11:44:28
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 11:32:38
-->
<template>
  <div class="duoBox">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './survey' }">调查问卷</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './survey' }">问卷列表</el-breadcrumb-item>
      <el-breadcrumb-item>问卷详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 问题详情 -->
    <div class="issueInfo">
      <div class="oneItem" v-for="(item,index) of info" :key="index">
        <template v-if="item.type==1">
          <el-row class="titleTxt">{{item.problem_title}}</el-row>
          <el-row
            class="narTxt"
            :label="i.answer_title"
            v-for="i of item.problem_option"
            :key="i.id"
          >{{i.ratio}} - {{i.answer_title}}</el-row>
        </template>
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
        <el-table-column prop="id" label="序号" align="center" width="60"></el-table-column>
        <el-table-column prop="client_ip" label="用户IP" align="center"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="300" align="center"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <div>
              <el-button @click="toInfo(row.id)" type="text">查看用户答案</el-button>
            </div>
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
        :page-sizes="[20, 50, 100]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-row>
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
      listQuery: {
        //请求接口参数
        page: 1, //页码
        size: 20, //每页数据
        questionnaire_id: this.$route.params.id || 1
      }
    };
  },
  created() {
    this.getList();
    this.getInfo();
  },
  methods: {
    /**获取列表 */
    getList() {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Questionnaire/answerList",
        params: this.listQuery
      }).then(res => {
        this.listLoading = false;
        this.list = res.data.data.data;
        this.total = res.data.data.total;
        // console.log(11, this.info)
      });
    },
    /**获取列表 */
    getInfo() {
      this.$axios({
        method: "GET",
        url: "/backend/Questionnaire/questionnaireInfo",
        params: { questionnaire_id: this.$route.params.id || 1 }
      }).then(res => {
        // console.log(res.data.data)
        res.data.data.forEach(item => {
          item.problem_option.forEach((item2, i, arr) => {
            //字符串截取
            arr[1].answer_title = arr[1].answer_title.substr(0, 3);
          });
        });
        this.info = res.data.data;
      });
    },
    /**去详情页 */
    toInfo(id) {
      // let titletxt = row ? "编辑" : "新增"
      this.$router.push({ name: "answerInfo", params: { id } });
    },
    /**根据条件搜索 */
    getSearch() {
      this.listQuery.page = 1;
      this.getList();
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.listQuery.create_time = startTime + "-" + endTime;
    },
    /**重置 */
    clearlistQuery() {
      this.listQuery = {
        page: 1, //页码
        size: 20, //每页数据
        status: 0
      };
      this.time = ""; //有时间组件填
      this.getList();
    },
    /**通过驳回;
     * 状态(1审核中，2通过3驳回)；*/
    handallEnable(status, id) {
      if (status == 2) {
        //当前是禁用状态，触发启动接口
        this.postTip("/backend/Distribution/passWithdraw", {
          withdraw_ids: id
        });
      } else {
        this.dialogVisible = true;
        this.form.withdraw_ids = id;
      }
    },
    /**dialog隐藏清空表单 */
    closedFun() {
      if (!this.dialogVisible) {
        this.$refs["form"].resetFields();
      }
    },
    /**提交驳回 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.postTip(
            "/backend/Distribution/forbiddenWithdraw",
            this.form
          ).then(() => {
            this.dialogVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
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
.issueInfo {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .oneItem {
    margin-top: 30px;
    width: 33%;
    line-height: 2;
    .narTxt {
      font-size: 15px;
    }
  }
}
</style>
