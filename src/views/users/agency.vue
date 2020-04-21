<!--
 * @Description: 
 * @LastEditors: jun
 * @LastEditTime: 2019-10-10 15:47:06
 -->
<template>
  <div class="agency-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>代理商列表</el-breadcrumb-item>
    </el-breadcrumb>
    <section class="sh1">
      <el-button type="primary" icon="el-icon-plus" @click="toAddagency">新增</el-button>
    </section>
    <div class="div_input">
      <li>
        <span>代理商ID</span>
        <el-input class="input" v-model="id" placeholder="请输入内容"></el-input>
      </li>
      <li>
        <span>代理商账号</span>
        <el-input class="input" v-model="mobile" placeholder="请输入内容"></el-input>
      </li>
      <li>
        <span>代理商姓名</span>
        <el-input class="input" v-model="agent_name" placeholder="请输入内容"></el-input>
      </li>
    </div>
    <div class="div_input2">
      <li>
        <span>代理商类型</span>
        <el-select class="input" v-model="agent_type" placeholder="请选择" clearable>
          <el-option
            v-for="item in agentList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </li>
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
        <el-select class="input" v-model="mstatus" placeholder="请选择" clearable>
          <el-option
            v-for="item in mstatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </li>
      <li style="justify-content: flex-start">
        <el-button type="primary" plain @click="getsearch">搜索</el-button>
        <el-button type="primary" plain @click="clear">重置</el-button>
      </li>
    </div>
    <section class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width:1530px"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column prop="id" label="代理商ID" align="center" width="100"></el-table-column>
        <el-table-column prop="contacts_mobile" label="代理商账号" align="center" width="100"></el-table-column>
        <el-table-column prop="agent_name" label="代理商姓名" align="center" width="150"></el-table-column>
        <el-table-column prop="gender" label="性别" align="center" width="100"></el-table-column>
        <el-table-column prop="agent_type" label="代理商类型" align="center" width="100"></el-table-column>
        <el-table-column prop="addRess" label="地区" align="center" width="200"></el-table-column>
        <el-table-column
          prop="verify_time"
          sortable="custom"
          label="审核时间"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column prop="verify_status" label="审核状态" width="100" align="center"></el-table-column>
        <el-table-column
          prop="last_login_time"
          sortable="custom"
          label="最近登录时间"
          width="200"
          align="center"
        ></el-table-column>
        <el-table-column prop="status" align="center" label="状态" width="80"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <el-button @click="godetailsdata(row.id)" type="text" size="small">查看</el-button>
            <el-button
              type="text"
              size="small"
              @click="open(row.id,1,'您确定通过审核')"
              v-show="row.verify_status =='待审核'"
            >通过</el-button>
            <el-button
              style="color:red"
              type="text"
              size="small"
              @click="open(row.id,2,'您确定驳回该申请')"
              v-show="row.verify_status =='待审核'"
            >驳回</el-button>
            <el-button
              style="color:red"
              type="text"
              size="small"
              @click="open(row.id,3,'您确定撤销')"
              v-show="row.verify_status =='审核通过' && row.status == '已启用'"
            >撤销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style="height:30px;width:700px;">
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
      total: "",
      id: "", //'代理商ID'
      mobile: "", //代理商账号
      agent_name: "", //代理商姓名
      agent_type: "", //代理商类型
      agentList: [
        { label: "省代", value: 1 },
        { label: "市代", value: 2 },
        { label: "区代", value: 3 }
      ],
      verify_status: "", //审核状态
      verifyList: [
        { label: "待审核", value: 0 },
        { label: "审核通过", value: 1 },
        { label: "驳回申请", value: 2 }
      ],
      mstatus: "", //账号状态
      mstatusList: [
        // { label: "冻结", value: 0 },
        { label: "已启用", value: 1 },
        { label: "已撤销", value: 2 }
      ],
      tableData: []
      // address: ""
    };
  },
  created() {
    this.getAgents();
  },
  methods: {
    //跳转到新增代理商
    toAddagency() {
      this.$router.push({ name: "addAgency" });
    },
    //重置
    clear() {
      this.id = "";
      this.mobile = "";
      this.agent_name = "";
      this.agent_type = "";
      this.verify_status = "";
      this.mstatus = "";
    },
    //代理商列表
    getAgents(page) {
      this.tableData = [];
      this.$axios({
        method: "GET",
        url: "/backend/Agent/getAgents",
        params: {
          id: this.id,
          contacts_mobile: this.mobile,
          agent_name: this.agent_name,
          agent_type: this.agent_type,
          verify_status: this.verify_status,
          status: this.mstatus,
          page: page,
          size: 10
        }
      }).then(res => {
        // this.tableData = [];
        this.total = res.data.data.total;
        let arr = res.data.data.data;
        arr.forEach(item => {
          item.addRess = `${item.province} ${item.city} ${item.area}`;
          this.tableData.push(item);
        });
        console.log(this.tableData);
        // this.$message.success(res.data.msg);
      });
    },
    // 分页
    handleCurrentChange(val) {
      // this.clear()
      console.log(`当前页: ${val}`);
      this.getAgents(val);
    },
    //查看詳情
    godetailsdata(id) {
      sessionStorage.setItem("agent_id", id);
      this.$router.push({ name: "agencydetails", params: { agent_id: id } });
    },
    //搜索
    getsearch() {
      this.getAgents(1);
    },
    open(id, type,txt) {
      this.$confirm(txt+",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (type == 1) {
          this.past(id);
        }
        if (type == 2) {
          this.reject(id);
        }
        if (type == 3) {
          this.revocation(id);
        }
      });
    },
    //通过 /backend/Agent/passAgent
    past(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Agent/passAgent",
        data: {
          agent_id: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.getAgents(1);
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //驳回 /backend/Agent/refuseAgent
    reject(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Agent/refuseAgent",
        data: {
          agent_id: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.getAgents(1);
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //撤销 /backend/Agent/cancelAgent
    revocation(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Agent/cancelAgent",
        data: {
          agent_id: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.getAgents(1);
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
.agency-wapper {
  .sh1 {
    margin: 20px 0;
    display: flex;
    // height: 40px;
  }
  .div_input {
    width: 1080px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    li {
      display: flex;
      justify-content: space-around;
      flex-direction: row;
      width: 348px;
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
      }
    }
  }
  .div_input2 {
    width: 1428px;
    display: flex;
    margin-top: 30px;
    justify-content: space-around;
    flex-direction: row;
    li {
      display: flex;
      justify-content: space-around;
      flex-direction: row;
      width: 348px;
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
      }
    }
  }
  .table {
    margin-top: 30px;
  }
}
</style>
