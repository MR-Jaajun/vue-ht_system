<!--
 * @Description: 
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-14 10:52:28
 -->
<template>
  <div class="agency-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>骑手承包商</el-breadcrumb-item>
    </el-breadcrumb>
    <section class="sh1">
      <el-button type="primary" icon="el-icon-plus" @click="toaddstand">新增</el-button>
    </section>
    <div class="div_input">
      <li>
        <span>承包商ID</span>
        <el-input class="input" v-model="id" placeholder="请输入内容"></el-input>
      </li>
      <li>
        <span>账号</span>
        <el-input class="input" v-model="user_mobile" placeholder="请输入内容"></el-input>
      </li>
      <li>
        <span>承包商姓名</span>
        <el-input class="input" v-model="agent_name" placeholder="请输入内容"></el-input>
      </li>
    </div>
    <div class="div_input2 .clearfix">
      <li>
        <span>审核状态</span>
        <el-select class="input" v-model="verify_status" placeholder="请选择" clearable>
          <el-option
            v-for="item in verifyList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </li>
      <li>
        <span>账号状态</span>
        <el-select class="input" v-model="m_status" placeholder="请选择" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </li>
      <li style="justify-content: flex-start">
        <el-button type="primary" plain @click="getStandList">搜索</el-button>
        <el-button type="primary" plain @click="clear">重置</el-button>
      </li>
    </div>
    <section class="table">
      <el-table
        :data="tableData"
        style="width: 1260px"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <!-- <el-table-column type="selection" align="center" width="50"></el-table-column> -->
        <el-table-column prop="id" label="承包商ID" align="center" width="100"></el-table-column>
        <el-table-column prop="custom_account" label="账号" align="center" width="100"></el-table-column>
        <el-table-column prop="real_name" label=" 联系人" align="center" width="120"></el-table-column>
        <el-table-column prop="gender" label="性别" align="center" width="50"></el-table-column>
        <el-table-column prop="delivery_site_id" label="站点" align="center" width="80"></el-table-column>
        <el-table-column
          prop="verify_time"
          sortable="custom"
          label="审核时间"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column prop="verify_status_value" label="审核状态" width="100" align="center"></el-table-column>
        <el-table-column
          prop="last_login_time"
          sortable="custom"
          label="最后登录时间"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column prop="status_value" label="状态" width="100" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="getRider(row.id)">查看</el-button>
            <el-button
              @click="open(row.id,1,'您将通过该审核')"
              type="text"
              size="small"
              v-show="row.verify_status==0 && row.verify_status !=2"
            >通过</el-button>
            <el-button
              @click="open(row.id,2,'您将驳回该审核')"
              style="color:red"
              type="text"
              size="small"
              v-show="row.verify_status==0 && row.verify_status !=2"
            >驳回</el-button>
            <el-button
              @click="open(row.id,3,'您将撤销该审核')"
              style="color:red"
              type="text"
              size="small"
              v-show="row.verify_status==1 && row.status == 1"
            >撤销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style="height:30px;width:700px;margin-top:30px;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total,prev,pager,next,jumper"
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
      rowIds: [],
      nid: "",
      total: "",
      id: "", //承包商ID
      user_mobile: "", //账号
      agent_name: "", //承包商姓名
      verify_status: "", //审核状态
      verifyList: [
        { label: "审核中", value: 0 },
        { label: "通过申请", value: 1 },
        { label: "驳回申请", value: 2 }
      ],
      m_status: "", //账号状态
      options: [{ label: "已启用", value: 1 }, { label: "已撤销", value: 2 }],
      tableData: [],
      str: ""
    };
  },
  created() {
    this.getStandList(1);
  },
  methods: {
    //跳转到新增骑手承包商
    toaddstand() {
      this.$router.push({ name: "addstand" });
    },
    //骑手承包商列表
    getStandList(page) {
      this.$axios({
        method: "GET",
        url: "/backend/Rider/getRiderContractors",
        params: {
          id: this.id,
          custom_account: this.user_mobile,
          real_name: this.agent_name,
          verify_status: this.verify_status,
          status: this.m_status,
          page: page,
          size: 10
        }
      }).then(res => {
        this.total = res.data.data.total;
        this.tableData = res.data.data.data;
        console.log(res.data.data);
      });
    },
    //搜索
    getsearch() {
      this.getStandList(1);
    },
    //重置
    clear() {
      this.id = "";
      this.user_mobile = "";
      this.agent_name = "";
      this.verify_status = "";
      this.m_status = "";
    },
    //批量选择
    handleSelectionChange(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
        this.nid = this.rowIds.join(","); // 把数组转换成字符串
      });
      console.log(this.nid);
      return this.nid;
    },
    //撤销 /backend/Rider/cancelRiderContractor
    cancelRider(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Rider/cancelRiderContractor",
        data: {
          rider_contractor_id: id
        }
      }).then(res => {
        // console.log(res.data.msg);
        if (res.data.status == 1) {
          this.getStandList(1);
          this.$message.success("撤销成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //驳回 /backend/Rider/refuseRiderContractor
    refuseRider(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Rider/refuseRiderContractor",
        data: {
          rider_contractor_id: id
        }
      }).then(res => {
        console.log(res.data.msg);
        if (res.data.status == 1) {
          this.getStandList(1);
          this.$message.success("驳回成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //通过 /backend/Rider/passRiderContractor
    passRider(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Rider/passRiderContractor",
        data: {
          rider_contractor_id: id
        }
      }).then(res => {
        console.log(res.data.msg);
        if (res.data.status == 1) {
          this.getStandList(1);
          this.$message.success("通过成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    open(id, type, txt) {
      this.$confirm(txt + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (type == 1) {
          this.passRider(id);
        }
        if (type == 2) {
          this.refuseRider(id);
        }
        if (type == 3) {
          this.cancelRider(id);
        }
      });
    },
    //查看骑手承包商信息 /backend/Rider/getRiderContractor
    getRider(id) {
      sessionStorage.setItem("rider_contractor_id", id);
      this.$router.push({
        name: "standDetail",
        params: { rider_contractor_id: id }
      });
    },

    //页码操作
    handleCurrentChange(val) {
      // this.clear();
      console.log(val, "va2");
      this.getStandList(val);
    }
  }
};
</script>
<style lang="scss" scoped>
.agency-wapper {
  .sh1 {
    margin: 20px 0;
    display: flex;
    // height: 40px;
  }
  .div_input {
    // width: 1080px;
    display: flex;
    justify-content: flex-start;
    // flex-direction: row;
    li {
      display: flex;
      justify-content: space-around;
      flex-direction: row;
      // width: 348px;
      margin-right: 90px;
      height: 34px;
      line-height: 34px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      .input {
        width: 248px;
        height: 34px;
        border-radius: 2px;
        margin-left: 20px;
      }
    }
  }
  .div_input2 {
    width: 1428px;
    justify-content: flex-start;
    flex-direction: row;
    margin-top: 30px;
    display: flex;
    li {
      display: flex;
      justify-content: flex-start;
      flex-direction: row;
      // width: 348px;
      margin-right: 90px;
      height: 34px;
      line-height: 34px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      color: rgba(51, 51, 51, 1);
      // margin-right: 35px;
      .input {
        width: 248px;
        height: 34px;
        border-radius: 2px;
        margin-left: 20px;
      }
    }
  }
  .table {
    margin-top: 30px;
  }
}
</style>
