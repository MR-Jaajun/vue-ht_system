<!--
 * @Description: 骑手列表
 * @Description: 
 * @Author: jun
 * @Date: 2019-08-19 17:48:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-14 10:55:26
 -->
<template>
  <div class="admin-wapper">
    <section>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>骑手列表</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <div class="admin-bth">
      <el-button type="primary" plain icon="el-icon-view" @click="open(nid,1,'您将启用全部骑手')">启用</el-button>
      <el-button type="primary" plain icon="el-icon-circle-close" @click="open(nid,2,'您将禁用全部骑手')">禁用</el-button>
      <el-button type="primary" @click="toranking">查看骑手排行榜</el-button>
    </div>
    <div class="admin-input">
      <div class="inputdiv">
        <span class="span">用户ID</span>
        <el-input v-model="userid" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">手机号</span>
        <el-input
          v-model="mobile"
          ref="refinput"
          class="input-control"
          placeholder="请输入内容"
          clearable
        ></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">最近登录时间</span>
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
    </div>
    <div class="admin-input2">
      <div class="inputdiv">
        <span class="span">骑手类型</span>
        <el-select v-model="vip" class="input-control" clearable placeholder="请选择">
          <el-option
            v-for="(item ,index) in vipList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
      <div class="inputdiv">
        <span class="span">账号状态</span>
        <el-select class="input-control" v-model="vipStatus" clearable placeholder="请选择状态">
          <el-option
            v-for="(item ,index)  in actStatusList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
      <div class="inputdiv">
        <el-button type="primary" @click="gettable(1)">搜索</el-button>
        <el-button type @click="clear">重置</el-button>
      </div>
    </div>
    <section class="vip-table" style="width:1556px;">
      <el-table
        v-loading="loading"
        border
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column prop="custom_uid" label="用户ID" align="center" width="100"></el-table-column>
        <el-table-column prop="contact_information" label="手机号" align="center" width="100"></el-table-column>
        <el-table-column prop="contacts" label="姓名" align="center" width="100"></el-table-column>
        <el-table-column prop="gender" label="性别" align="center" width="100"></el-table-column>

        <el-table-column prop="position_type" label="骑手类型" align="center" width="100"></el-table-column>
        <el-table-column prop="deposit_status" label="保证金" align="center" width="100"></el-table-column>
        <el-table-column prop="address" label="工作地点" align="center" width="100"></el-table-column>
        <el-table-column prop="create_time" align="center" label="申请时间" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="verify_status_value" align="center" label="审核状态" width="80"></el-table-column>
        <el-table-column prop="verify_time" align="center" label="审核时间" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.verify_time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="last_login_time" align="center" label="最近登录时间" width="100"></el-table-column>
        <el-table-column prop="status_value" align="center" label="账号状态" width="100">
          <template slot-scope="{row}">
            <span :style="{color:row.status==0?'red':''}">{{row.status_value}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="lookdetail(row.id,0)">查看</el-button>
            <el-button
              type="text"
              size="small"
              @click="lookdetail(row.id,1)"
              v-show="row.verify_status_value!='驳回申请'"
            >编辑</el-button>
            <el-button
              v-show="row.status==0 && row.verify_status_value!='驳回申请'"
              size="mini"
              type="text"
              @click="open(row.id,3,'您将启用该骑手')"
            >启用</el-button>
            <el-button
              size="mini"
              v-show="row.status==1 && row.verify_status_value=='通过'"
              style="color:red"
              type="text"
              @click="open(row.id,4,'您将禁用该骑手')"
            >禁用</el-button>
            <el-button
              size="mini"
              v-show="row.verify_status_value=='审核中'"
              type="text"
              @click="open(row.id,5,'您将通过审核该骑手的申请')"
            >通过</el-button>
            <el-button
              size="mini"
              v-show="row.verify_status_value=='审核中'"
              style="color:red"
              type="text"
              @click="open(row.id,6,'您将通过驳回该骑手的申请')"
            >驳回申请</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看 |编辑|禁用 | 通过| 驳回申请 -->
      <!-- page-size每页显示条目个数 -->
      <div class="pagination-container" style="margin-top:30px;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total,sizes,prev,pager,next,jumper"
          :total="total*1"
        ></el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      loading: false,
      dialogTableVisible: false,
      idFlag: false,
      loading: true,
      rowIds: [],
      nid: "",
      time_value: "", //开始时间结束时间插件
      gettime: "", //时间措
      typecolor: "",
      multipleSelection: [], //多选数据存放
      userid: "", //用户id
      mobile: "", //手机号
      vipStatus: "", //账号状态
      vip: "", //骑手类型
      total: "", //总数据
      updataParameters: {},
      custom_uid: "",
      //状态
      actStatusList: [
        { value: "0", label: "已禁用" },
        { value: "1", label: "已启用" }
      ],
      vipList: [{ value: "1", label: "专职" }, { value: "2", label: "兼职" }],
      tableData: [],

      sizes: 10
    };
  },

  created() {
    this.gettable(1);
  },
  watch: {
    // gettime(){
    //   console.log(this.gettime)
    // }
  },
  methods: {
    toranking() {
      this.$router.push({
        name: "horsemanRanking"
      });
    },
    //跳转
    lookdetail(id, boolen) {
      sessionStorage.setItem("rider", id);
      sessionStorage.setItem("r_change", boolen);
      this.$router.push({
        name: "lookriderDetail",
        params: { rider: id, ischange: boolen }
      });
    },
    //时间转换
    change(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.gettime = startTime + "-" + endTime;
    },
    //重置
    clear() {
      this.userid = "";
      this.mobile = "";
      this.vip = "";
      this.time_value = "";
      this.Macode = "";
      this.vipStatus = "";
      this.gettime = "";
    },
    // 搜索获取列表
    gettable(page) {
      this.loading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Rider/getRiderList",
        params: {
          custom_uid: this.userid,
          contact_information: this.mobile,
          position_type: this.vip,
          last_login_time: this.gettime,
          status: this.vipStatus,
          size: this.sizes,
          page: page
        }
      }).then(res => {
        if (res.status == 200) {
          this.loading = false;
          this.tableData = [];
          //  console.log(res, "1");
          this.total = res.data.data.total;
          this.tableData = res.data.data.data;
          console.log(res.data.data.data, "1");
        }
      });
    },

    //页码操作
    handleCurrentChange(val) {
      // this.clear();
      console.log(val, "va2");
      this.gettable(val);
    },
    // handleSizeChange(val) {
    //   this.sizes = val;
    //   console.log(`每页 ${val} 条`);
    //   this.gettable(1);
    // },
    //批量选择
    handleSelectionChange(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
      });
      this.nid = this.rowIds.join(","); // 把数组转换成字符串
      console.log(this.nid);
      return this.nid;
    },
    open(id, type, txt) {
      this.$confirm(txt + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (type == 1) {
          this.handallCode(id);
        }
        if (type == 2) {
          this.handallStatus(id);
        }
        if (type == 3) {
          this.handCode(id);
        }
        if (type == 4) {
          this.handleStatus(id);
        }
        if (type == 5) {
          this.passRider(id);
        }
        if (type == 6) {
          this.refuseRider(id);
        }
      });
    },
    //全选禁用
    handallStatus(nid) {
      if (nid) {
        this.handleStatus(nid);
      } else {
        this.$message.error("请选择需要禁用的骑手");
      }
    },

    //全选启用
    handallCode(nid) {
      if (nid) {
        this.handCode(nid);
      } else {
        this.$message.error("请选择需要启用的骑手");
      }
    },

    //单选禁用 /backend/Rider/forbiddenRider
    handleStatus(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Rider/forbiddenRider",
        data: {
          rider_id: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.gettable(1);
          this.nid = "";
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //单选启用 /backend/Rider/usingRider
    handCode(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Rider/usingRider",
        data: {
          rider_id: id
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.gettable(1);
          this.nid = "";
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //审核 /backend/Rider/passRider
    passRider(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Rider/passRider",
        data: {
          rider_id: id
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.gettable(1);
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //驳回 /backend/Rider/refuseRider
    refuseRider(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Rider/refuseRider",
        data: {
          rider_id: id
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.gettable(1);
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.admin-wapper {
  .admin-bth {
    display: flex;
    align-items: center;
    z-index: 100;
    margin-top: 30px;
  }
  .admin-input {
    width: 1450px;
    height: 50px;
    display: flex;
    margin: 20px 0;
    .inputdiv {
      height: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-right: 90px;
      .span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: rgba(22, 23, 55, 1);
        display: inline-block;
        margin-right: 20px;
      }
      .input-control {
        width: 248px;
        height: 34px;
        border-radius: 2px;
      }
    }
  }
  .admin-input2 {
    width: 1450px;
    display: flex;
    align-items: center;
    height: 50px;
    margin: 20px 0;
    // position: relative;
    // top: -30px;
    .inputdiv {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 50px;
      margin-right: 90px;
      .span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: rgba(22, 23, 55, 1);
        display: inline-block;
        margin-right: 20px;
      }
      .input-control {
        width: 248px;
        height: 34px;
        border-radius: 2px;
      }
    }
  }
  .dialog_ipnt {
    width: 100px;
  }
}
</style>




<style lang="scss" >
.el-dialog {
  width: 65%;
}
// .el-form {
//   justify-content: space-around;
//   display: flex;
//   flex-direction: row;
// }
// .el-form-item {
//   display: flex;
//   align-items: center;
// }
</style>
