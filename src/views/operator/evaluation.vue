<!--
 * @Description: 评论列表
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-12 16:03:59
 -->
<template>
  <div id="activityList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './evaluation' }">运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>评价列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 启动禁用 -->
    <el-row class="setStatusRow">
      <el-button @click="handallEnable(2)" icon="el-icon-view" type="primary">批量启用</el-button>
      <el-button @click="handallEnable(1)" icon="el-icon-circle-close">批量禁用</el-button>
    </el-row>
    <!-- 搜索表单 -->
    <div class="clearfix" id="form_menu">
      <!-- 活动ID -->
      <div class="form_item">
        <span>订单号</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.order_bn"></el-input>
      </div>
      <div class="form_item">
        <span>手机号</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.mobile"></el-input>
      </div>
      <div class="form_item">
        <span>商家名称</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.shop_title"></el-input>
      </div>
      <!-- 评价类型 -->
      <div class="form_item">
        <span>评价类型</span>
        <el-select placeholder="请选择" v-model="listQuery.comment_type">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in commentTypeList"
          ></el-option>
        </el-select>
      </div>
      <!-- 评价星级 -->
      <div class="form_item">
        <span>评价星级</span>
        <el-select placeholder="请选择" v-model="listQuery.composite_evaluate_score">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in commentGradeList"
          ></el-option>
        </el-select>
      </div>
      <!-- 评价状态 -->
      <div class="form_item">
        <span>状态</span>
        <el-select placeholder="请选择" v-model="listQuery.status">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in commentStatusList"
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
        <el-table-column align="center" label="评价ID" prop="id" width="80"></el-table-column>
        <el-table-column align="center" label="手机号" prop="mobile" width="180"></el-table-column>
        <el-table-column align="center" label="订单号" prop="order_bn" width="200"></el-table-column>
        <el-table-column
          align="center"
          label="商店名称"
          prop="shop_title"
          show-overflow-tooltip
          width="200"
        ></el-table-column>
        <el-table-column align="center" label="评价类型" prop="module_value" width="180"></el-table-column>
        <el-table-column align="center" label="评价星级" prop="composite_evaluate_score" width="180"></el-table-column>
        <el-table-column align="center" label="评价时间" prop="create_time" width="180"></el-table-column>
        <el-table-column align="center" label="状态" prop="status_value" width="180"></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-link @click="toCommentInfo(row.id)" class="el_link" type="primary">查看</el-link>
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
      listLoading: true, //loading图标
      list: [], //表格列表
      multipleSelection: "", //列表选中字符串
      dateStr: "", //展示给用户看的时间段
      total: 0, //总数据数
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 20, //每页数据
        order_bn: "", //订单号
        mobile: "", //手机号
        shop_title: "", //商店名称
        comment_type: "1", //订单类型(1外卖，2商城，3团购)
        status: "", //状态(1已启用，2已禁用)
        create_time: "", //创建时间
        composite_evaluate_score: "" //评分
      },
      commentTypeList: [
        {
          //评价类型列表
          value: "1",
          label: "外卖"
        },
        {
          value: "2",
          label: "商城"
        },
        {
          value: "3",
          label: "团购"
        },
        {
          value: "4",
          label: "京东优选"
        }
      ],
      commentStatusList: [
        {
          //状态列表
          value: "1",
          label: "启动"
        },
        {
          value: "2",
          label: "禁用"
        }
      ],
      commentGradeList: [
        {
          //评价星级列表
          value: "1",
          label: "一星"
        },
        {
          value: "2",
          label: "二星"
        },
        {
          value: "3",
          label: "三星"
        },
        {
          value: "4",
          label: "四星"
        },
        {
          value: "5",
          label: "五星"
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
          url: "/backend/Operation/comments",
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
    /**重置 */
    clearlistQuery() {
      this.listQuery = {
        page: 1, //页码
        size: 20, //每页数据
        order_bn: "", //订单号
        mobile: "", //手机号
        shop_title: "", //商店名称
        comment_type: "1", //订单类型(1外卖，2商城，3团购)
        status: "", //状态(1已启用，2已禁用)
        create_time: "", //创建时间
        composite_evaluate_score: "" //评分
      };
      this.dateStr = "";
      this.getList();
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.listQuery.create_time = startTime + "-" + endTime;
    },
    /**查看详情 */
    toCommentInfo(id) {
      this.$router.push({
        path: "./commentinfo",
        query: { comment_id: id, comment_type: this.listQuery.comment_type }
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
        this.post("/backend/Operation/delComment", {
          comment_id: id,
          comment_type: this.listQuery.comment_type
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
    },
    /**启用禁用; 状态(1启用，2禁用)； 有id是单独操作，否则批量操作*/
    handallEnable(status, id) {
      let _url, txt;
      if (status == 2) {
        //当前是禁用状态，触发启动接口
        txt = "启动";
        _url = "/backend/Operation/usingComment";
      } else {
        txt = "禁用";
        _url = "/backend/Operation/forbiddenComment";
      }
      this.$confirm(`确定${txt}选中内容？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.post(_url, {
          comment_ids: id ? id : this.multipleSelection,
          comment_type: this.listQuery.comment_type
        });
      });
    }
  }
};
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
