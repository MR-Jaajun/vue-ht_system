<!--
* @Description: 订单列表
* @Author: duo
* @Date: 2019-10-22 11:44:28
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 11:32:26
-->
<template>
  <div class="duoBox">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './survey' }">调查问卷</el-breadcrumb-item>
      <el-breadcrumb-item >问卷列表</el-breadcrumb-item>
    </el-breadcrumb>

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
        <el-table-column prop="title" label="问卷名称" align="center"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="300" align="center"></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-button @click="toInfo(row.id)" type="text">查看问题详情</el-button>
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
      multipleSelection: '', //列表多选
      time: '',//日期组件展示用，重置时要清空
      dialogVisible: false, //弹框
      listQuery: {//请求接口参数
        page: 1, //页码
        size: 20, //每页数据
      },
      selectlist: [{//状态(1审核中，2通过3驳回)
        value: "1",
        label: '审核中'
      }, {
        value: "2",
        label: '通过'
      }, {
        value: "3",
        label: '驳回'
      }],

      // 特定页面
      form: {
        withdraw_ids: '',
        denied_reason: ''
      },
      rules: {
        denied_reason: [
          { required: true, message: '请填写驳回原因', trigger: 'blur' }
        ]
      },

      formLabelWidth: '120px',
      denied_reason: '',

    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**公共post */
    postTip(url, data, tip = "确定操作吗?") {
      return new Promise((resolve, reject) => {
        this.$confirm(tip, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.listLoading = true
          this.$axios({
            method: "POST",
            url,
            data,
          }).then(res => {
            resolve(res);//弹框就放这里，无论成功失败都隐藏弹框
            if (res.data.code == 200) {
              this.$message.success(res.data.msg)
              this.getList().then(() => {
                this.listLoading = false
              });
            } else {
              this.listLoading = false
              this.$message(res.data.msg)
            }
          });
        });
      });
    },
    /**获取列表 */
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.$axios({
          method: 'POST',
          url: '/backend/Questionnaire/questionnaireList',
          params: this.listQuery
        }).then(res => {
          resolve(res);
          this.listLoading = false
          this.list = res.data.data.data
          this.total = res.data.data.total
        })
      })
    },
    /**去详情页 */
    toInfo(id) {
      // let titletxt = row ? "编辑" : "新增"
      this.$router.push({ name: 'surveyInfo', params: { id } })
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
#actList {
  margin-top: 20px;
}
</style>
