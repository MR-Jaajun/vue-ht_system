<!--
 * @Description: 

 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 14:54:00
 -->
<template>
  <div class="admin-wapper">
    <section>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员列表</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <div class="admin-bth">
      <el-button type="primary" icon="el-icon-view" @click="handallCode">启用</el-button>
      <el-button plain icon="el-icon-circle-close" @click="handallStatus">禁用</el-button>
    </div>
    <div class="admin-input">
      <div class="inputdiv">
        <span class="span">用户ID</span>
        <el-input v-model="userid" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">手机号</span>
        <el-input v-model="mobile" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">注册时间</span>
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
        <span class="span">会员等级</span>
        <el-select v-model="vip" class="input-control" clearable placeholder="请选择会员等级">
          <el-option
            v-for="(item ,index) in vipList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
      <div class="inputdiv">
        <span class="span">邀请码</span>
        <el-input v-model="Macode" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">状态</span>
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
        <el-button type="primary" @click="gettable">搜索</el-button>
        <el-button type @click="clear">重置</el-button>
      </div>
    </div>
    <section class="vip-table">
      <el-table
        border
        v-loading="loading"
        :data="tableData"
        style="width: fit-content"
        @selection-change="selectAll"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column prop="custom_uid" label="用户ID" align="center" width="100"></el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center" width="100"></el-table-column>
        <el-table-column prop="gender" label="性别" align="center" width="70"></el-table-column>
        <el-table-column prop="initve" label="邀请码" align="center" width="80"></el-table-column>
        <el-table-column prop="level" label="会员等级" align="center" width="80"></el-table-column>
        <el-table-column prop="credit_score" label="信用值" align="center" width="80"></el-table-column>
        <el-table-column prop="zhixi_amount" sortable align="center" label="直推" width="80"></el-table-column>
        <el-table-column prop="interval_amount" align="center" sortable label="间推" width="80"></el-table-column>
        <el-table-column prop="shop_amount" align="center" label="推荐商家" width="80"></el-table-column>
        <el-table-column prop="invite_limit" align="center" label="最大直推人数" width="100"></el-table-column>
        <el-table-column prop="create_time" sortable align="center" label="注册时间" width="180"></el-table-column>
        <el-table-column prop="last_login_time" align="center" label="最近登录时间" width="180"></el-table-column>
        <el-table-column align="center" label="状态" width="80">
          <template slot-scope="{row}">
            <span v-if="row.status=='0'" size="mini" type="text" style="color:red">已禁用</span>
            <span v-if="row.status=='1'" size="mini" type="text">已启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="{row}">
            <el-button @click="godetailsdata(row)" type="text" size="small">查看</el-button>
            <el-button v-if="row.status =='0'" size="mini" type="text" @click="handCode(row)">启用</el-button>
            <el-button
              size="mini"
              v-if="row.status =='1'"
              style="color:red"
              type="text"
              @click="handleStatus(row)"
            >禁用</el-button>
            <el-button @click="govipgrade(row)" type="text" size="small">会员等级调整</el-button>
            <!-- <el-button
              v-if="row.user_info_data.pid =='0'"
              @click="gobaindtable(row)"
              type="text"
              size="small"
            >绑定上级</el-button>-->
            <el-button type="text" size="small" @click="setMax(row)">最大直推人数</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 设置最大推荐人数 -->
      <div class="dias">
        <el-dialog
          title="修改最大直推人数"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          :visible.sync="dialogFormVisible"
          width="400px"
          custom-class="dialog"
          @close="cancelMax"
        >
          <el-form label-position="left">
            <el-form-item label="最大直推人数：">
              <el-input
                v-model="max_people"
                maxlength="4"
                autocomplete="off"
                placeholder="请输入最大直推人数"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelMax">取 消</el-button>
            <el-button type="primary" @click="saveMax">修 改</el-button>
          </div>
        </el-dialog>
      </div>
      <!--绑定上级弹窗  -->
      <!-- <el-dialog title :show-close="false" :visible.sync="dialogTableVisible">
        <el-form inline="true" :model="formInline" ref="formInline">
          <el-form-item label="用户ID" prop="id">
            <el-input class="dialog_ipnt" v-model="formInline.id" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="邀请码" prop="code">
            <el-input class="dialog_ipnt" v-model="formInline.code" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input class="dialog_ipnt" v-model="formInline.mobile" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-right:15px;" @click="goshangjisearch">搜索</el-button>
            <el-button @click="resetForm('formInline')">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="gridData">
          <el-table-column property="custom_uid" label="用户ID" align="center" width="100"></el-table-column>
          <el-table-column property="mobile" label="手机号" align="center" width="100"></el-table-column>
          <el-table-column property="gender" label="性别" align="center" width="100"></el-table-column>
          <el-table-column property="initve" label="邀请码" align="center" width="100"></el-table-column>
          <el-table-column property="level" label="会员等级" align="center" width="100"></el-table-column>
          <el-table-column property="zhixi_amount" align="center" label="直推" width="100"></el-table-column>
          <el-table-column property="interval_amount" label="间推" width="100"></el-table-column>
          <el-table-column property="shop_amount" align="center" label="推荐商家" width="80"></el-table-column>
          <el-table-column property="create_time" align="center" label="注册时间" width="200"></el-table-column>
          <el-table-column property="last_login_time" align="center" label="最近登录时间" width="200"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="gobind(gridData)">确 定</el-button>
        </div>
      </el-dialog>-->

      <!-- page-size每页显示条目个数 -->
      <div class="pagination-container" style="margin-top:30px;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10, 20, 50, 100]"
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
      formInline: {
        id: "",
        code: "",
        mobile: ""
      },
      nid: "",
      dialogTableVisible: false,
      idFlag: false,
      loading: true,
      rowIds: null,
      time_value: "", //开始时间结束时间插件
      gettime: "",
      typecolor: "",
      multipleSelection: [], //多选数据存放
      userid: "", //用户id
      mobile: "", //手机号
      Macode: "", //邀请码
      vipStatus: "", //状态
      vip: "", //会员等级
      total: "", //总数据
      gridData: [], //弹窗数据
      updataParameters: {},
      custom_uid: "",
      //状态
      actStatusList: [
        { value: "0", label: "已禁用" },
        { value: "1", label: "已启用" }
      ],
      vipList: [
        { value: "0", label: "小哥粉" },
        { value: "1", label: "小哥" },
        { value: "2", label: "小V哥" },
        { value: "3", label: "V哥" }
      ],
      tableData: [],
      listQuery: {
        page: 1,
        size: 10
      },
      //设置最大推荐人数
      dialogFormVisible: false,
      max_people: "",
      max_custom_uid: ""
    };
  },

  created() {
    this.gettable();
  },

  methods: {
    //修改最大推荐人数
    setMax(row) {
      this.dialogFormVisible = true;
      this.max_custom_uid = row.custom_uid;
      this.max_people = row.user_info_data.invite_limit;
    },
    cancelMax() {
      this.dialogFormVisible = false;
      this.max_people = "";
      this.max_custom_uid = "";
    },
    saveMax() {
      // /backend/CustomUser/memberLimit
      if (this.max_people >= 0) {
        this.$axios({
          method: "POST",
          url: "/backend/CustomUser/memberLimit",
          data: {
            custom_uid: this.max_custom_uid,
            number: this.max_people
          }
        }).then(res => {
          console.log(res);
          if (res.data.status == 1) {
            this.cancelMax();
            this.gettable();
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } else {
        this.$message.error("直推人数不能小于0");
      }
    },
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
    gettable() {
      this.loading = true;
      this.$axios({
        method: "GET",
        url: "/backend/CustomUser/member",
        params: {
          id: this.userid,
          mobile: this.mobile,
          vip_level: this.vip,
          register_time: this.gettime,
          invite_code: this.Macode,
          status: this.vipStatus,
          size: this.listQuery.size,
          page: this.listQuery.page
        }
      }).then(res => {
        if (res.status == 200) {
          this.loading = false;
          this.tableData = [];
          // console.log(res, "1");
          this.total = res.data.data.total;
          let userdata = res.data.data.data;
          userdata.forEach(item => {
            const { user_info_data } = item;
            const {
              gender_title,
              invite_code,
              vip_level_title,
              invite_limit,
              credit_score
            } = user_info_data;
            item.credit_score = credit_score;
            item.invite_limit = invite_limit;
            item.gender = gender_title;
            item.initve = invite_code;
            item.level = vip_level_title;
            item.is_show = item.status_title;
            this.tableData.push(item);
          });
        }
      });
    },
    //查看详情
    godetailsdata(row) {
      let rowid = row.id;
      this.$router.push({
        path: './vipdetails',
        query: {
          sId: rowid
        }
      });
    },
    //会员等级调整
    govipgrade(row) {
      let rowid = row.id;
      this.$router.push({
        name: `vipgrade`,
        params: {
          shop_id: rowid
        }
      });
    },

    //绑定上级搜索
    goshangjisearch() {
      if (
        this.formInline.id ||
        this.formInline.mobile ||
        this.formInline.code
      ) {
        this.$axios({
          method: "GET",
          url: "/backend/CustomUser/member",
          params: {
            id: this.formInline.id,
            mobile: this.formInline.mobile,
            vip_level: this.vip,
            register_time: this.gettime,
            invite_code: this.formInline.code,
            status: this.vipStatus,
            size: this.listQuery.size,
            page: this.listQuery.page
          }
        }).then(res => {
          this.gridData = [];
          // console.log(res, "1");
          let userdata = res.data.data.data;
          userdata.forEach(item => {
            const { user_info_data } = item;
            const {
              gender_title,
              invite_code,
              vip_level_title
            } = user_info_data;
            item.gender = gender_title;
            item.initve = invite_code;
            item.level = vip_level_title;
            item.is_show = item.status_title;
            this.gridData.push(item);
          });
        });
      }
    },

    //弹窗input重置
    resetForm(forName) {
      this.$refs[forName].resetFields();
      this.gridData = [];
    },
    //打开上级弹窗
    gobaindtable(row) {
      this.custom_uid = row.id;
      this.dialogTableVisible = true;
      // return  this.custom_uid
    },
    //确认绑定
    gobind(row) {
      let superior_uid = row[0].id;
      console.log(row[0].id, "确认绑定");
      this.dialogTableVisible = false;
      this.$axios({
        method: "POST",
        url: "/backend/CustomUser/bindSuperior",
        data: {
          custom_uid: this.custom_uid,
          superior_uid
        }
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: "success"
        });
      });
      this.gettable();
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
    },
    // 用户全选checkbox时触发该事件
    selectAll(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
      });
      this.nid = this.rowIds.join(","); // 把数组转换成字符串
      return this.nid;
    },
    //全选禁用
    handallStatus() {
      this.$axios({
        method: "POST",
        url: "/backend/CustomUser/memberForbidden",
        data: {
          custom_uids: this.nid
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.gettable();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
        this.nid = "";
      });
    },

    //全选启用
    handallCode() {
      this.$axios({
        method: "POST",
        url: "/backend/CustomUser/memberEnable",
        data: {
          custom_uids: this.nid
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.gettable();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
        this.nid = "";
      });
    },
    handleSelectionChange(val) {
      console.log(val, "val");
      this.multipleSelection = val;
    },
    //单选禁用
    handleStatus(row) {
      this.$axios({
        method: "POST",
        url: "/backend/CustomUser/memberForbidden",
        data: {
          custom_uids: row.id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.gettable();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
        this.nid = "";
      });
      // row.status = 0;
    },
    //单选启用
    handCode(row) {
      this.$axios({
        method: "POST",
        url: "/backend/CustomUser/memberEnable",
        data: {
          custom_uids: row.id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.gettable();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
        this.nid = "";
      });
      // row.status = 1;
    }
  }
};
</script>


<style lang="scss" scoped>
.admin-wapper {
  .admin-bth {
    z-index: 100;
    display: flex;
    align-items: center;
    z-index: 100;
    margin-top: 30px;
  }
  .admin-input {
    width: 1450px;
    display: flex;
    align-items: center;
    height: 50px;
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
    .inputdiv {
      margin-right: 90px;
      height: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
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
// .el-dialog {
//   width: 65%;
// }
.dias {
  .el-dialog {
    .el-dialog__header {
      display: flex;
      .el-dialog__title {
        font-size: 16px;
      }
    }
    .el-dialog__body {
      .el-input {
        width: 200px;
      }
    }
    .el-dialog__footer {
      display: flex;
      justify-content: flex-end;
      .dialog-footer {
        display: flex;
      }
    }
  }
}
</style>
