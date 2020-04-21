<!--
 * @Description: 敏感词管理
 * @LastEditors: duo
 * @LastEditTime: 2019-09-30 16:04:34
 -->
<template>
  <div id="activityList" class="pagelist">
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <el-row class="rowCenter">
        <el-col :span="5">敏感词：</el-col>
        <el-col>
          <el-input v-model="input" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row class="rowCenter">
        <el-col :span="5">启用状态：</el-col>
        <el-col>
          <el-radio v-model="radio" label="1" border size="small">启用</el-radio>
          <el-radio v-model="radio" label="2" border size="small">禁用</el-radio>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './agility' }">运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>敏感词管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 启动禁用 -->
    <el-row class="table_top_btn">
      <el-button @click="showDialog()" icon="el-icon-plus" type="primary">新增</el-button>
      <el-button @click="handallEnable(2)">批量启用</el-button>
      <el-button @click="handallEnable(1)">批量禁用</el-button>
    </el-row>
    <!-- 搜索表单 -->
    <div class="clearfix" id="form_menu">
      <!-- 活动ID -->
      <div class="form_item">
        <span>敏感词ID</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.sensitive_id"></el-input>
      </div>
      <div class="form_item">
        <span>敏感词</span>
        <el-input
          clearable
          placeholder="请输入"
          style="width:215px;"
          v-model="listQuery.sensitive_word"
        ></el-input>
      </div>
      <!-- 评价状态 -->
      <div class="form_item">
        <span>状态</span>
        <el-select placeholder="请选择" v-model="listQuery.status">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in statusList"
          ></el-option>
        </el-select>
      </div>
      <el-row class="form_item">
        <!-- 更新时间 -->
        <div class="flex_center">
          <span>更新时间</span>
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
        <div class="flex_center" style="margin-left:60px">
          <el-button
            @click="getSearch"
            style="background-color:#4371E8;width:75px;"
            type="primary"
          >搜索</el-button>
          <el-button @click="clearlistQuery" style="margin-left:30px;width:75px;">重置</el-button>
        </div>
      </el-row>
    </div>

    <!-- 表格 -->
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
        <el-table-column align="center" label="敏感词ID" prop="id" width="80"></el-table-column>
        <el-table-column align="center" label="敏感词" prop="sensitive_word" width="180"></el-table-column>
        <el-table-column align="center" label="更新时间" prop="update_time" width="180"></el-table-column>
        <el-table-column align="center" label="状态" prop="status_value" width="180"></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-link @click="showDialog(row)" class="el_link" type="primary">编辑</el-link>
              <el-link
                type="primary"
                class="el_link"
                @click="handallEnable(row.status, row.id)"
              >{{row.status==2?'启用':'禁用'}}</el-link>
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
      editid: "", //弹出框编辑id
      input: "", //弹出框输入内容
      radio: "1", //弹出框单选
      dialogVisible: false,
      listLoading: true, //loading图标
      list: [], //表格列表
      multipleSelection: "", //列表选中字符串
      dateStr: "", //展示给用户看的时间段
      total: 0, //总数据数
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 20, //每页数据
        sensitive_id: "", //敏感词ID
        sensitive_word: "", //敏感词
        status: "", //状态(1已启用，2已禁用)
        update_time: "" //更新时间
      },
      statusList: [
        {
          //状态列表
          value: "1",
          label: "启用"
        },
        {
          value: "2",
          label: "禁用"
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
    /**获取列表 */
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true;
        this.$axios({
          method: "GET",
          url: "/backend/Operation/getSensitives",
          params: this.listQuery
        }).then(res => {
          resolve(res);
          this.listLoading = false;
          this.list = res.data.data.data;
          this.total = res.data.data.total;
        });
      });
    },
    /**根据条件搜索 */
    getSearch() {
      this.listQuery.page = 1;
      this.getList();
    },
    /**显示弹框 */
    showDialog(row) {
      this.dialogVisible = true;
      if (row) {
        this.editid = row.id;
        this.input = row.sensitive_word;
      } else {
        this.editid = "";
        this.input = "";
      }
    },
    /**重置 */
    clearlistQuery() {
      this.listQuery = {
        page: 1, //页码
        size: 20, //每页数据
        sensitive_id: "", //敏感词ID
        sensitive_word: "", //敏感词
        status: "", //状态(1已启用，2已禁用)
        update_time: "" //更新时间
      };
      this.dateStr = "";
      this.getList();
    },
    /**新增或编辑一条信息 */
    setInfo() {
      this.post("/backend/Operation/postSensitiveWords", {
        word_id: this.editid,
        status: this.radio,
        sensitive_word: this.input
      }).then(() => {
        this.dialogVisible = false;
      });
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.listQuery.update_time = startTime + "-" + endTime;
    },
    /**查看详情 */
    toInfo(id) {
      this.$router.push({
        name: "commentinfo",
        params: { comment_id: id, comment_type: this.listQuery.comment_type }
      });
    },
    /**获取多选的id数组 */
    handleSelectionChange(val) {
      let valArr = [];
      for (let i of val) {
        valArr.push(i.id);
      }
      this.multipleSelection = valArr.join(",");
    },
    /**删除一个 */
    delInfo(id) {
      this.$confirm(`确定删除选中内容？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.post("/backend/Operation/delSensitive", { word_id: id });
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
    },
    /**启用禁用; 状态(1启用，2禁用)； 有id是单独操作，否则批量操作*/
    handallEnable(status, id) {
      let _url, txt;
      if (status == 2) {
        //当前是禁用状态，触发启动接口
        txt = "启动";
        _url = "/backend/Operation/wordsUsing";
      } else {
        txt = "禁用";
        _url = "/backend/Operation/wordsForbidden";
      }
      this.$confirm(`确定${txt}选中内容？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.post(_url, { sensitive_id: id ? id : this.multipleSelection });
      });
    }
  }
};
</script>
<style lang="scss">
@import "../../styles/duo.scss";
</style>

<style lang="scss" scoped>
// .clearfix {
//     visibility: hidden;
//     display: block;
//     font-size: 0;
//     content: " ";
//     clear: both;
//     height: 0;
// }
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
    // width: 70px;
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
.rowCenter {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>
