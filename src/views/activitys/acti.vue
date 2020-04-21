<!--
 * @Description: 优惠活动
 * @Author: jun
 * @Date: 2019-08-19 17:48:58
 * @LastEditors: jun
 * @LastEditTime: 2019-10-15 14:57:01
 -->
<template>
  <div id="activityList">
    <!-- <div class="discount">优惠专区/活动主题列表</div> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './acti' }">优惠专区</el-breadcrumb-item>
      <el-breadcrumb-item>活动主题列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="act_title">活动主题列表</div>
    <div class="addbtn">
      <el-button
        type="primary"
        size="medium"
        icon="el-icon-plus"
        class="creat_btn"
        @click="ToaddActivitys"
      >创建活动</el-button>
    </div>
    <!-- 搜索表单 -->
    <div id="form_menu">
      <!-- 活动ID -->
      <div class="form_item">
        <span>活动ID</span>
        <el-input v-model="actID" placeholder="请输入ID" clearable style="width:215px;"></el-input>
      </div>
      <!-- 活动名称 -->
      <div class="form_item">
        <span>活动名称</span>
        <el-select v-model="actName" clearable placeholder="请选择活动名称">
          <el-option v-for="item in actNameList" :key="item" :value="item"></el-option>
        </el-select>
      </div>
      <!-- 活动时间 -->
      <div class="form_item">
        <span class="demonstration">活动时间</span>
        <el-date-picker
          value-format="timestamp"
          v-model="time_val"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getTime"
        ></el-date-picker>
      </div>

      <!-- 活动状态 -->
      <div class="form_item">
        <span>活动状态</span>
        <el-select v-model="actStatus" clearable placeholder="请选择活动状态" @change="change">
          <el-option
            v-for="item in actStatusList"
            :key="item.id"
            :value="item.id"
            :label="item.value"
          ></el-option>
        </el-select>
      </div>
      <!-- 搜索 重置 -->
      <div class="form_item">
        <el-button type="primary" style="background-color:#4371E8;width:75px;" @click="getsearch">搜索</el-button>
        <el-button plain style="margin-left:30px;width:75px;" @click="clear">重置</el-button>
      </div>
    </div>

    <!-- 活动列表 -->
    <div id="actList">
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="actList"
        tooltip-effect="dark"
        style="width:100%;"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800', height:'63px' }"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="50"></el-table-column> -->
        <el-table-column align="center" prop="id" label="活动ID" width="120"></el-table-column>
        <el-table-column align="center" prop="activity_title" label="活动名称" width="150"></el-table-column>
        <el-table-column
          align="center"
          prop="activity_time"
          label="活动时间"
          width="350"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="activity_quota_num" label="系统设定商家数量" width="155"></el-table-column>
        <el-table-column align="center" prop="shops" label="已参加活动商家数量" width="155"></el-table-column>
        <el-table-column align="center" prop="status_value" label="活动状态" width="155"></el-table-column>
        <el-table-column align="center" prop="is_deleted" label="是否已参加此活动" width="155"></el-table-column>
        <el-table-column align="center" prop="operation" label="操作">
          <template slot-scope="{row}">
            <div>
              <el-link type="primary" class="el_link" @click="toSellList(row.id)">查看</el-link>
              <el-link
                type="primary"
                class="el_link"
                @click="toShopList(row.id)"
                v-show="row.status_value=='待开始'|| row.status_value=='进行中'"
              >添加&取消商家</el-link>
              <el-link
                type="danger"
                class="el_link"
                @click="open(row.id)"
                v-show="row.status_value=='待开始' || row.status_value=='进行中'"
              >取消</el-link>
              <!-- <el-link
                type="primary"
                class="el_link"
                v-show="row.status_value=='已取消' || row.status_value=='已结束'"
              >编辑</el-link>-->
              <el-link
                @click="open2(row.id)"
                type="danger"
                class="el_link"
                v-show="row.status_value=='已取消' || row.status_value=='已结束'"
              >删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listLoading: true, //loading图标
      actList: [],
      actID: "", //活动ID
      actName: "", //活动名称,
      time_val: "", //选择时间
      actStatus: "", //活动状态
      times: "",
      //活动名称
      actNameList: [],
      //活动状态
      // actStatusList: ["进行中", "已结束", "已下架", "已取消"],
      actStatusList: [
        { id: 2, value: "进行中" },
        { id: 3, value: "已结束" },
        { id: 1, value: "待开始" },
        { id: 4, value: "已取消" }
      ],
      //选中后的数据添加
      multipleSelection: []
    };
  },
  created() {
    this.getActList();
    this.getsearch();
  },
  methods: {
    // 活动列表渲染
    getActList() {
      this.listLoading = true;
      this.$axios({
        method: "POST",
        url: "/backend/Activity/activityList",
        params: {
          id: this.actID,
          activity_title: this.actName,
          status: this.actStatus,
          activity_time: this.times,
          page: "1",
          size: "10"
        }
      }).then(res => {
        this.listLoading = false;
        // console.log(res.data.data.data);
        this.actList = res.data.data.data;
        let arr = [];
        this.actList.forEach(item => {
          arr.push(item.activity_title);
        });
        //去重
        let arr1 = [];
        arr1 = arr.filter(function(item) {
          return arr1.includes(item) ? "" : arr1.push(item);
        });
        this.actNameList = arr1;
      });
    },
    //搜索
    getsearch() {
      this.listLoading = true;
      this.$axios({
        method: "POST",
        url: "/backend/Activity/activityList",
        params: {
          id: this.actID,
          activity_title: this.actName,
          status: this.actStatus,
          activity_time: this.times,
          page: "1",
          size: "10"
        }
      }).then(res => {
        this.listLoading = false;
        this.actList = res.data.data.data;
      });
    },
    //删除
    delact(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Activity/activityDel",
        data: {
          activity_id: id
        }
      }).then(res => {
        this.getsearch();
      });
    },
    //删除的弹窗
    open2(id) {
      // console.log(id, type);
      this.$confirm("你确定删除该活动吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delact(id);
      });
    },
    //取消活动
    cancelAct(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Activity/cancelActivity",
        data: {
          activity_id: id
        }
      }).then(res => {
        this.getsearch();
      });
    },
    //取消的弹窗
    open(id) {
      // console.log(id, type);
      this.$confirm("你确定取消该活动吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.cancelAct(id);
      });
    },

    //选择时间
    getTime(val) {
      if (val) {
        let startTime = val[0] / 1000;
        let endTime = val[1] / 1000;
        this.times = startTime + "-" + endTime;
      }
    },
    //选择活动名称
    change(val) {
      this.actStatus = val;
    },
    //查看活动详情
    toSellList(id) {
      this.$router.push({
        name: "lookact",
        params: { actID: id, ischange: 0 }
      });
    },
    //重置
    clear() {
      this.actID = "";
      this.actName = "";
      this.actStatus = "";
      this.time_val = "";
    },
    //跳转创建活动
    ToaddActivitys() {
      this.$router.push({ path: "./addact" });
    },
    //跳转到商家列表
    toShopList(id) {
      this.$router.push({
        name: "addsell",
        params: { actID: id }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    }
  },
  watch: {
    // actID() {
    //   console.log(this.actID);
    // },
    // time_val() {
    //   console.log(this.time_val);
    // },
    // actName() {
    //   console.log(this.actName);
    // },
    // actStatus() {
    //   console.log(this.actStatus);
    // }
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
  height: 150px;
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
  max-height: 663px;
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
</style>
