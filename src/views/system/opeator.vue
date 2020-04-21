<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2019-09-29 17:23:15
 -->
<template>
  <div class="opeator-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>操作日志</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="admin-input">
      <div class="inputdiv">
        <span class="span">账号</span>
        <el-input v-model="userID" class="input-control" placeholder="请输入内容"></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">姓名</span>
        <el-input v-model="username" class="input-control" placeholder="请输入内容"></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">角色</span>
        <el-select v-model="role_item" clearable placeholder="请选择">
          <el-option
            v-for="(item ,index) in roleList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="admin-input2">
      <div class="inputdiv2">
        <span class="demonstration span">操作时间</span>
        <el-date-picker
          value-format="timestamp"
          style="margin-left:15px"
          v-model="time_value"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="change"
        ></el-date-picker>
      </div>
      <div class="inputdiv2">
        <el-button type="primary" @click="gettable">搜索</el-button>
        <el-button type @click="clear">重置</el-button>
      </div>
    </div>
    <section class="opeator-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{background:'#ccc',color:'#333', font: '800', height:'63px' }"
      >
        <el-table-column type="selection" align="center" width="100"></el-table-column>
        <el-table-column prop="id" label="管理员ID" width="100"></el-table-column>
        <el-table-column prop="name" label="账号" width="100"></el-table-column>
        <el-table-column prop="user_name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="name" label="角色" width="100"></el-table-column>
        <el-table-column prop="mobile_phone" label="手机号" width="100"></el-table-column>
        <el-table-column prop="log_des" label="日志详情" width="100"></el-table-column>
        <el-table-column prop="action_time" label="操作时间" width="200"></el-table-column>
      </el-table>
     <!-- page-size每页显示条目个数 -->
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-size="listQuery.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total*1"
        ></el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 100,
      username: "", //姓名
      role_item: "", //角色
      time_value: "", //时间
      userID: "", //账号
      value: "",
      providerData: "",
      listQuery: {
        page: 1,
        size:10
      },
      tableData: [],
      roleList: []
    };
  },

  created() {
    this.goroledata();
    this.gettable();
  },

  methods: {
    change(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.gettime = startTime + "-" + endTime;
    },
    //获取角色信息
    goroledata() {
      this.$axios({
        method: "GET",
        url: "/backend/SystemSetting/getRoles"
      }).then(res => {
        res.data.data.map(item => {
          let resdata = item;
          resdata.value = item.id;
          resdata.label = item.name;
          delete resdata.id;
          delete resdata.name;
          this.roleList.unshift(resdata);
        });
      });
    },
    clear() {
      (this.userID = ""), (this.username = ""), (this.role_item = "");
    },
    // 搜索获取列表
    gettable() {
      this.$axios({
        method: "GET",
        url: "/backend/SystemSetting/adminLogs",
        params: {
          user_name: this.userID,
          real_name: this.username,
          role: this.role_item,
          size: this.listQuery.size,
          page: this.listQuery.page
        }
      }).then(res => {
        if (res.status == 200) {
          this.total = res.data.data.total;
          this.tableData = res.data.data.data;
        }
      });
    },
    //页码操作
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.gettable();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.gettable();
      this.listQuery.page = 1;
    }
  }
};
</script>


<style lang="scss"  scoped>
.opeator-wapper {
  .admin-input {
    width: 1380px;
    display: flex;
    height: 34px;
    margin-top: 20px;
    align-items: center;
    .inputdiv {
      margin-right: 90px;
      display: flex;
      height: 34px;
      flex-direction: row;
      justify-content: space-around;
      .span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 34px;
        color: rgba(22, 23, 55, 1);
      }
      .input-control {
        width: 248px;
        height: 34px;
        padding: 0 20px;
        border-radius: 2px;
      }
    }
  }
  .admin-input2 {
    display: flex;
    justify-content: flex-start;
    height: 34px;
    align-items: center;
    margin: 30px 0;

    .inputdiv2 {
      margin-right: 90px;
      height: 34px;
      margin-right: 90px;
      display: flex;
      justify-content: flex-start;
      .span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 34px;
        color: rgba(22, 23, 55, 1);
      }
    }
  }
}
</style>

