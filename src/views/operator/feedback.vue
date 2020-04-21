<!--
 * @Description: 意见反馈
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 11:31:14
 -->
<template>
  <div id="activityList">
    <el-dialog class="duodialog" title="基本信息" :visible.sync="outerVisible">
      <el-row :gutter="gutterVal">
        <el-col :span="4">
          <div class="grid-content bg-purple">状态</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">{{this.info.status_value}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="gutterVal">
        <el-col :span="4">
          <div class="grid-content bg-purple">User ID</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">{{this.info.user_uid}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="gutterVal">
        <el-col :span="4">
          <div class="grid-content bg-purple">手机号</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">{{this.info.contact_mobile}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="gutterVal">
        <el-col :span="4">
          <div class="grid-content bg-purple">联系人姓名</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">{{this.info.contact_name}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="gutterVal">
        <el-col :span="4">
          <div class="grid-content bg-purple">反馈时间</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">{{this.info.create_time}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="gutterVal">
        <el-col :span="4">
          <div class="grid-content bg-purple">反馈类型</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">{{this.info.feedback_type}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="gutterVal">
        <el-col :span="4">
          <div class="grid-content bg-purple">反馈内容</div>
        </el-col>
        <el-col :span="20">
          <div class="grid-content bg-purple-light">{{this.info.problem_desc}}</div>
        </el-col>
      </el-row>
      <el-dialog
        class="duodialog"
        title="提示"
        :visible.sync="innerVisible"
        width="30%"
        append-to-body
      >
        <span>确认标记已处理?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">标记已处理</el-button>
      </div>
    </el-dialog>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './feedback' }">运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>意见反馈</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 启动禁用 -->
    <el-row class="setStatusRow">
      <el-button @click="handleDispose()" icon="el-icon-s-flag" type="primary">标记已处理</el-button>
      <el-button @click="delInfo()" icon="el-icon-delete">批量删除</el-button>
    </el-row>
    <!-- 搜索表单 -->
    <div class="clearfix" id="form_menu">
      <!-- 活动ID -->
      <div class="form_item">
        <span>User ID</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.user_uid"></el-input>
      </div>
      <div class="form_item">
        <span>手机号</span>
        <el-input
          clearable
          placeholder="请输入"
          style="width:215px;"
          v-model="listQuery.contact_mobile"
        ></el-input>
      </div>
      <div class="form_item">
        <span>联系人姓名</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.contact_name"></el-input>
      </div>
      <!-- 评价状态 -->
      <div class="form_item">
        <span>状态</span>
        <el-select placeholder="请选择" v-model="listQuery.status">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in selectlist"
          ></el-option>
        </el-select>
      </div>
      <!-- 评价时间 -->
      <div class="form_item">
        <span>评价时间</span>
        <el-date-picker
          @change="getTime"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          v-model="dateStr"
          value-format="timestamp"
        ></el-date-picker>
      </div>
      <!-- 搜索 重置 -->
      <div class="form_item" style="margin-left: -15px;">
        <el-button @click="getSearch" style="background-color:#4371E8;width:75px;" type="primary">搜索</el-button>
        <el-button @click="clearlistQuery" style="margin-left:30px;width:75px;">重置</el-button>
      </div>
    </div>

    <!-- 列表 -->
    <div id="actList">
      <el-table
        :data="list"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800'}"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        v-loading="listLoading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="序号" prop="id" width="80"></el-table-column>
        <el-table-column align="center" label="User ID" prop="user_id" width="100"></el-table-column>
        <el-table-column align="center" label="手机号" prop="contact_mobile" width="100"></el-table-column>
        <el-table-column align="center" label="联系人姓名" prop="contact_name" width="150"></el-table-column>
        <el-table-column
          align="center"
          label="反馈内容"
          prop="problem_desc"
          show-overflow-tooltip
          width="200"
        ></el-table-column>
        <el-table-column align="center" label="反馈类型" prop="feedback_type" width="100"></el-table-column>
        <el-table-column align="center" sortable label="反馈时间" prop="create_time" width="180"></el-table-column>
        <el-table-column align="center" label="处理时间" prop="handle_time" width="180"></el-table-column>
        <el-table-column align="center" label="状态" prop="status_value" width="180"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <div>
              <el-link @click="showDialog(row.id)" class="el_link" type="primary">查看</el-link>
              <el-link
                v-show="!row.status"
                type="primary"
                class="el_link"
                @click="handleDispose(row.id)"
              >标记已处理</el-link>
              <el-link type="danger" class="el_link" @click="delInfo(row.id)">删除</el-link>
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
  </div>
</template>

<script>
// import { utildata } from '../../utils/utildata'
export default {
  data() {
    return {
      gutterVal: 1,
      listLoading: true, //loading图标
      list: [], //表格列表
      multipleSelection: '', //列表选中字符串
      dateStr: '', //展示给用户看的时间段
      total: 0, //总数据数
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 20, //每页数据
        user_uid: '', //订单号
        contact_mobile: '', //手机号
        contact_name: '', //手联系人
        status: '', //状态（0未处理，1已处理）
        create_time: '', //反馈时间
      },
      outerVisible: false,
      innerVisible: false,
      selectlist: [
        {
          value: 0,
          label: "未处理"
        },
        {
          value: 1,
          label: "已处理"
        }
      ],
      info: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**公共post */
    post(url, data, tip = "确定操作吗?") {
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
            // resolve(res);//弹框就放这里，无论成功失败都隐藏弹框
            if (res.data.code == 200) {
              resolve(res);
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
          method: 'GET',
          url: '/backend/Operation/feedbackList',
          params: this.listQuery
        }).then(res => {
          resolve(res);
          this.listLoading = false
          this.list = res.data.data.data
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
        user_uid: '', //订单号
        contact_mobile: '', //手机号
        contact_name: '', //手联系人
        status: '', //状态（0未处理，1已处理）
        create_time: '', //反馈时间
      }
      this.dateStr = '' //有时间控件必填
      this.getList()
    },
    /**弹窗 */
    showDialog(id) {
      this.outerVisible = true
      //   this.dialogVisible = true
      this.$axios({
        method: 'GET',
        url: '/backend/Operation/feedbackDetail',
        params: { feedback_ids: id }
      }).then(res => {
        this.listLoading = false
        this.info = res.data.data
        // this.total = res.data.data.total
        console.log(this.info)
      })
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000
      let endTime = val[1] / 1000
      this.listQuery.create_time = startTime + '-' + endTime
    },
    /**查看详情 */
    toCommentInfo(id) {
      this.$router.push({
        name: 'commentinfo',
        params: {
          comment_id: id,
          comment_type: this.listQuery.comment_type
        }
      })
    },
    /**获取多选的id数组 */
    handleSelectionChange(val) {
      let valArr = []
      for (let i of val) {
        valArr.push(i.id)
      }
      this.multipleSelection = valArr.join(',');
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

    /**标记已处理， 多选和单选*/
    handleDispose(id) {
      if (!id && !this.multipleSelection) {//多选且没选中
        this.$message('请选中内容')
      } else {
        this.post('/backend/Operation/feedbakcStatus', {
          feedback_ids: id ? id : this.multipleSelection,
        }, '确认标记已处理？')
      }
    },

    /**启用禁用; 状态(1启用，2禁用)； 有id是单独操作，否则批量操作*/
    handallEnable(status, id) {
      let _url, txt;
      if (status == 2) {//当前是禁用状态，触发启动接口
        txt = "启动"
        _url = "/backend/Operation/usingComment"
      }
      else {
        txt = "禁用"
        _url = "/backend/Operation/forbiddenComment"
      }
      this.$confirm(`确定${txt}选中内容？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.post(_url, {
          comment_ids: id ? id : this.multipleSelection,
          comment_type: this.listQuery.comment_type
        })
      })
    },
    /**删除或批量删除， 有id则单选，否则多选*/
    delInfo(id) {
      if (!id && !this.multipleSelection) {//多选且没选中
        this.$message('请选中内容')
      } else {
        this.post('/backend/Operation/feedbackDel', {
          feedback_ids: id ? id : this.multipleSelection,
        }, '确认删除选中内容？')
      }
    },
  }
}
</script>

<style lang="scss">
@import "../../styles/duo.scss";
</style>
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

// 面包屑行高优化，不然顶部被遮挡
// .el-breadcrumb {
//   line-height: 1.5;
// }

.setStatusRow {
  display: flex;
  margin: 24px 0;
}
.setPage {
  margin: 20px 0;
}
</style>
