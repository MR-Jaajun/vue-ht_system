<!--
 * @Description: 
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 14:56:48
 -->
<template>
  <div id="activityList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>运营管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './cooperation' }">合作共赢</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 新增删除 -->
    <el-row class="setStatusRow">
      <el-button @click="itemEdit()" plain type="primary">标记已处理</el-button>
      <el-button @click="delInfo()" icon="el-icon-delete" plain type="primary">批量删除</el-button>
    </el-row>
    <!-- 搜索表单 -->
    <div class="clearfix" id="form_menu">
      <div class="form_item_box">
        <div class="form_item">
          <span>联系人</span>
          <el-input clearable placeholder="请输入" style="width:215px;" v-model="contacts"></el-input>
        </div>
        <div class="form_item">
          <span>手机号</span>
          <el-input clearable placeholder="请输入" style="width:215px;" v-model="mobile"></el-input>
        </div>
        <div class="form_item">
          <span>申请时间</span>
          <el-date-picker
            value-format="timestamp"
            style="margin-left:15px"
            v-model="time_value"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getTime"
          ></el-date-picker>
        </div>
      </div>
      <div class="form_item_box">
        <div class="form_item">
          <span class="span">合作项目</span>
          <el-select style="width:215px;" v-model="cooperation_type" clearable placeholder="请选择状态">
            <el-option
              v-for="(item ,index)  in cooperationList"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </div>
        <div class="form_item">
          <span class="span">状态</span>
          <el-select style="width:215px;" v-model="status" clearable placeholder="请选择状态">
            <el-option
              v-for="(item ,index)  in statusList"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </div>
        <div class="form_item" style="margin-left: -15px;">
          <el-button @click="getList()" plain type="primary">搜索</el-button>
          <el-button @click="clear()" plain type="primary">重置</el-button>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div id="actList">
      <el-table
        :data="list"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800'}"
        @selection-change="selectAll"
        style="width:100%;"
        tooltip-effect="dark"
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column align="center" label="手机号" prop="contact_information" width="200"></el-table-column>
        <el-table-column align="center" label="联系人" prop="contacts" width="200"></el-table-column>
        <el-table-column align="center" label="合作项目" prop="cooperation_type" width="200">
          <template slot-scope="{row}">
            <span v-show="row.cooperation_type=='1'" type="text">骑手</span>
            <span v-show="row.cooperation_type=='2'" type="text">商家入驻</span>
            <span v-show="row.cooperation_type=='3'" type="text">代理商</span>
            <span v-show="row.cooperation_type=='4'" type="text">骑手承包商</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="申请时间"
          prop="create_time"
          show-overflow-tooltip
          width="200"
        ></el-table-column>
        <el-table-column align="center" label="状态" prop="status" width="180">
          <template slot-scope="{row}">
            <span v-text="row.status=='1'?'已处理':'待处理'" type="text"></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-link @click="toInfo(row.id)" class="el_link" type="primary">查看</el-link>
              <el-link
                v-show="row.status=='0'"
                @click="itemEdit(row.id)"
                class="el_link"
                type="primary"
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
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total*1"
      ></el-pagination>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time_value: "",
      statusList: [
        {
          value: "0",
          label: "待处理"
        },
        {
          value: "1",
          label: "已处理"
        }
      ],
      cooperationList: [
        {
          value: "1",
          label: "骑手"
        },
        {
          value: "2",
          label: "商家入驻"
        },
        {
          value: "3",
          label: "代理商"
        },
        {
          value: "4",
          label: "骑手承包商"
        }
      ],
      listLoading: true, //loading图标
      list: [], //表格列表
      nid: "", //列表选中字符串
      dateStr: "", //展示给用户看的时间段
      total: 0, //总数据数
      listQuery: {
        page: 1, //页码
        size: 10 //每页数据
      },
      status: "",
      id: "", //用户id
      mobile: "", //手机号
      timeStr: "",
      contacts: "", //联系人
      cooperation_type: "" //合作项目
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**获取列表 */
    getList() {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Cooperation/cooperationList",
        params: {
          status: this.status || "2",
          contacts: this.contacts,
          contact_information: this.mobile,
          cooperation_type: this.cooperation_type,
          add_date: this.timeStr,
          size: this.listQuery.size,
          page: this.listQuery.page
        }
      }).then(res => {
        this.listLoading = false;
        this.list = res.data.data.data;
        this.total = res.data.data.total;
      });
    },
    /**重置 */
    clear() {
      (this.status = ""),
        (this.contacts = ""),
        (this.mobile = ""),
        (this.cooperation_type = ""),
        (this.time_value = "");
    },

    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.timeStr = startTime + "-" + endTime;
    },
    /**查看详情 */
    toInfo(id) {
      this.$router.push({ path: "./cooperationinfo", query: { id: id } });
    },
    // 用户全选checkbox时触发该事件
    selectAll(val) {
      let valueArr = [];
      val.forEach(item => {
        valueArr.push(item.id);
      });
      this.nid = valueArr.join(","); // 把数组转换成字符串
      return this.nid;
    },

    /**删除或批量删除， 有id则单选，否则多选*/
    delInfo(id) {
      var that = this;
      if (!id && !this.nid) {
        //多选且没选中
        this.$message("请选中内容");
      } else {
        this.$confirm(`确定删除选中内容？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          that
            .$axios({
              method: "GET",
              url: "/backend/Cooperation/cooperationEdit",
              params: {
                cooperation_ids: id ? id : this.nid,
                status: "2"
              }
            })
            .then(res => {
              if (res.data.status == "1") {
                that.$message.success(res.data.msg);
                this.getList();
              }
            });
        });
      }
    },
    /**批量操作， 有id则单选，否则多选*/
    itemEdit(id) {
      if (!id && !this.nid) {
        this.$message("请选中内容");
      } else {
        this.$axios({
          method: "GET",
          url: "/backend/Cooperation/cooperationEdit",
          params: {
            cooperation_ids: id ? id : this.nid,
            status: "1"
          }
        }).then(res => {
          if (res.data.status == "1") {
            this.$message.success(res.data.msg);
            this.getList();
          }
        });
      }
    },

    //页码操作
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
      this.listQuery.page = 1;
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
  display: flex;
  flex-wrap: wrap;
}
.form_item_box {
  .form_item {
    // width: 300px;
    float: left;
    margin: 0 92px 15px 0;
    display: flex;
    justify-content: center;
    span {
      width: 70px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      margin-right: 15px;
      display: inline-block;
      color: rgba(51, 51, 51, 1);
    }
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
