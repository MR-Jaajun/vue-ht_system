<!--
 * @Description: 平台消息管理列表
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 11:27:05
 -->
<template>
    <div class="pagelist platform">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: './platform' }">消息管理</el-breadcrumb-item>
        <el-breadcrumb-item>消息列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 头部操作按钮 -->
      <el-row class="table_top_btn">
        <el-button @click="toInfo()" icon="el-icon-plus" type="primary">新增</el-button>
        <el-button @click="getSearch" type="primary">搜索</el-button>
        <el-button @click="clearlistQuery">重置</el-button>
      </el-row>
      <div class="clearfix">
        <div class="form_item">
          <span>标题</span>
          <el-input
            clearable
            placeholder="请输入"
            style="width:215px;"
            v-model="listQuery.message_title"
          ></el-input>
        </div>
        <!-- 推送类型(1通知栏推送，2APP内消息中心推送) -->
        <div class="form_item">
          <span>推送方式</span>
          <el-select placeholder="请选择" v-model="listQuery.publish_type">
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in pushList"
            ></el-option>
          </el-select>
        </div>
        <!-- 编辑时间 -->
        <div class="form_item">
          <span>编辑时间</span>
          <el-date-picker
            @change="getTime(1)"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            v-model="create_time"
            value-format="timestamp"
          ></el-date-picker>
        </div>
        <!-- 推送时间 -->
        <div class="form_item">
          <span>推送时间</span>
          <el-date-picker
            @change="getTime(0)"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            v-model="publish_time"
            value-format="timestamp"
          ></el-date-picker>
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
          <el-table-column prop="id" label="消息ID" width="153" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="message_title" label="消息标题" align="center"></el-table-column>
          <el-table-column prop="target" label="推送对象" width="200" align="center"></el-table-column>
          <el-table-column prop="publish_type" label="推送方式" width="200" align="center"></el-table-column>
          <el-table-column sortable prop="create_time" label="编辑时间" width="250" align="center"></el-table-column>
          <el-table-column sortable prop="publish_time" label="推送时间" width="250" align="center"></el-table-column>
          <el-table-column width="300" align="center" label="操作" prop="operation">
            <template slot-scope="{row}">
              <div>
                <el-button @click="getInfo(row.id)" type="text">查看</el-button>
                <el-button @click="deleteOne(row.id)" type="text" style="color:red">删除</el-button>
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
          :current-page="page"
          :page-sizes="[20, 50, 100]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-row>

      <el-dialog title="基本消息" :visible.sync="dialogVisible">
        <el-row>
          <el-col :span="3">推送方式：</el-col>
          <el-col :span="21">{{this.info.publish_type}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">推送对象：</el-col>
          <el-col :span="21">{{this.info.target}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">推送时间：</el-col>
          <el-col :span="21">{{this.info.publish_time}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">消息标题：</el-col>
          <el-col :span="21">{{this.info.message_title}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="3">图文内容：</el-col>
          <el-col :span="21" v-html="this.info.message_content"></el-col>
        </el-row>
      </el-dialog>
    </div>
</template>
<script>
import axios from "axios";
import { timestampToTime } from "../../utils/util.js";
export default {
  data() {
    return {
      // 列表公共
      page: 1,
      size: 20,
      total: 0,
      listLoading: true, //loading图标
      list: [], //表格列表
      info: {}, //详情
      multipleSelection: "", //列表选中字符串

      // 特定页面
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 20, //每页数据
        message_title: "", //标题
        publish_type: "", //推送类型(1通知栏推送，2APP内消息中心推送)
        create_time: "", //编辑时间开始
        publish_time: "" //推送时间开始
      },

      create_time: "",
      publish_time: "",

      //推送方式
      pushList: [
        {
          value: "1",
          label: "通知栏推送"
        },
        {
          value: "2",
          label: "APP内消息中心推送"
        }
      ],

      dialogVisible: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**获取列表 */
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true;
        this.$axios({
          method: "GET",
          url: "/backend/Message/getMessages",
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
      console.log(id);
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
      this.$router.push({ name: "addplatform", params: {} });
    },

    /**公共post */
    post2(url, data, tip = "确定操作吗?") {
      return new Promise((resolve, reject) => {
        this.$confirm(tip, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.listLoading = true;
          this.$axios({
            method: "POST",
            url,
            data
          }).then(res => {
            // resolve(res);//弹框就放这里，无论成功失败都隐藏弹框
            if (res.data.code == 200) {
              resolve(res);
              this.$message.success(res.data.msg);
              this.getList().then(() => {
                this.listLoading = false;
              });
            } else {
              this.listLoading = false;
              this.$message(res.data.msg);
            }
          });
        });
      });
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
        size: 20, //每页数据
        message_title: "", //标题
        publish_type: "", //推送类型(1通知栏推送，2APP内消息中心推送)
        create_time: "", //编辑时间开始
        publish_time: "" //推送时间开始
      };
      this.create_time = ""; //有时间组件必填
      this.publish_time = ""; //有时间组件必填
      this.getList();
    },
    /**选择时间*/
    getTime(val) {
      if (val) {
        this.listQuery.create_time =
          this.create_time[0] / 1000 + "-" + this.create_time[1] / 1000;
      } else {
        this.listQuery.publish_time =
          this.publish_time[0] / 1000 + "-" + this.publish_time[1] / 1000;
      }
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
      this.size = val;
      this.getList();
    },
    /**选择第几页 */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.getList();
    }
  }
};
</script>


<style lang="scss">
@import "../../styles/duo.scss";
</style>

<style lang="scss" scoped>
.box-card {
  margin-right: 20px;
}
.form_item {
  float: left;
  margin: 0 0 20px 30px;
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
