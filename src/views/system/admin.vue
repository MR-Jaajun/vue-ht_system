<!--
 * @Description: 
 * @LastEditors: Roc
 * @LastEditTime: 2019-11-12 18:38:36
 -->
<template>
  <div class="admin-wapper">
    <section class="admin-section">系统管理/管理员管理</section>
    <div class="admin-bth">
      <el-button type="primary" plain icon="el-icon-plus" @click="addAdmin">新增</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="alldelete">删除</el-button>
    </div>
    <div class="div_input">
      <li>
        <span class="span">账号</span>
        <el-input class="input-control" v-model="username" placeholder="请输入内容"></el-input>
      </li>
      <li>
        <span class="span">姓名</span>
        <el-input class="input-control" v-model="name" placeholder="请输入内容"></el-input>
      </li>
      <li>
        <span class="span">角色</span>
        <el-select class="input-control" v-model="role_id" clearable placeholder="请选择">
          <el-option
            v-for="(item ,index) in roleList"
            :key="index"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </li>
    </div>
    <div class="div_input2">
      <li>
        <span class="span">创建时间</span>
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
      </li>
      <li>
        <span class="span">状态</span>
        <el-select class="input-control" v-model="Status" clearable placeholder="请选择状态">
          <el-option
            v-for="item in actStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </li>
      <li style="justify-content: flex-start">
        <el-button type="primary" plain @click="gettable">搜索</el-button>
        <el-button type="primary" plain @click="clear">重置</el-button>
      </li>
    </div>

    <section class="admin-table">
      <el-table
        :data="tableData"
        style="width: 1200px"
        @selection-change="selectAll"
        v-loading="loading"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '900', height:'63px' }"
      >
        <el-table-column type="selection" align="center" width="100"></el-table-column>
        <el-table-column prop="id" label="管理员ID" align="center" width="100"></el-table-column>
        <el-table-column prop="user_name" label="账号" align="center" width="100"></el-table-column>
        <el-table-column prop="real_name" label="姓名" align="center" width="100"></el-table-column>
        <el-table-column prop="name" label="角色" align="center" width="100"></el-table-column>
        <el-table-column prop="mobile_phone" label="手机号" align="center" width="200"></el-table-column>
        <el-table-column prop="create_time" align="center" label="创建时间" width="200"></el-table-column>
        <el-table-column align="center" label="状态" width="100">
          <template slot-scope="{row}">
            <span v-if="row.status=='1'" type="text">已启用</span>
            <span v-if="row.status=='2'" type="text" style="color:red">已禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="{row}">
            <el-button @click="goAdmin(row.id)" type="text" size="small">编辑</el-button>
            <el-button v-if="row.status =='2'" size="mini" type="text" @click="handCode(row)">启用</el-button>
            <el-button
              size="mini"
              v-if="row.status =='1'"
              style="color:red"
              type="text"
              @click="handleStatus(row)"
            >禁用</el-button>
            <el-button @click="govipgrade(row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- page-size每页显示条目个数 -->
    <div class="pagination-container" style="margin-top:30px;">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      nid: "",
      rowIds: [],
      total: "", //总页码
      role_id: "", //角色
      name: "", //姓名
      value: "",
      time_value: null, //创建时间
      gettime: "",
      username: "", //账号
      Status: "", //状态
      //状态
      actStatusList: [
        {
          value: "0",
          label: "已禁用"
        },
        {
          value: "1",
          label: "已启用"
        }
      ],
      roleList: [
        {
          id: 9,
          name: "产品经理"
        }
      ],
      listQuery: {
        page: 1,
        size: 10
      },
      tableData: []
    };
  },

  created() {
    this.gettable();
    this.getRolesdata();
  },

  methods: {
    /**获取角色名称 */
    getRolesdata() {
      this.$axios({
        method: "GET",
        url: "/backend/SystemSetting/getRoles "
      }).then(res => {
        this.roleList = res.data.data;
      });
    },
    change(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.gettime = startTime + "-" + endTime;
    },
    addAdmin() {
      this.$router.push({ path: "./admindetails" });
    },
    goAdmin(id) {
      this.$router.push({ path: "./editAdmin", query: { id: id } });
    },
    //重置
    clear() {
      this.username = this.name = this.roledata = this.time_value = this.Status =
        "";
    },
    // 获取列表
    gettable() {
      this.loading = true;
      this.$axios({
        method: "GET",
        url: "/backend/SystemSetting/adminsUsers",
        params: {
          user_name: this.username,
          real_name: this.name,
          role: this.role_id,
          create_time: this.gettime,
          status: this.Status,
          size: this.listQuery.size,
          page: this.listQuery.page
        }
      })
        .then(res => {
          if (res.data.status == 1) {
            this.loading = false;
            // console.log(res, "1");
            this.total = res.data.data.total;
            this.tableData = res.data.data.data;
          } else {
            this.$message.error(error.data.msg);
          }
        })
        .catch(error => {
          this.$message.error(error.data.msg);
        });
    },
    //单行删除
    govipgrade(row) {
      this.$confirm("确认删除吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.$axios({
            method: "POST",
            url: "/backend/SystemSetting/delAdminUser",
            data: {
              admin_ids: row.id
            }
          }).then(res => {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.gettable();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    //单选禁用
    handleStatus(row) {
      this.$axios({
        method: "POST",
        url: "/backend/SystemSetting/adminForbidden",
        data: {
          admin_id: row.id
        }
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: "success"
        });
      });
      row.status = 2;
    },
    //单选启用
    handCode(row) {
      this.$axios({
        method: "POST",
        url: "/backend/SystemSetting/adminUsing",
        data: {
          admin_id: row.id
        }
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: "success"
        });
        row.status = 1;
      });
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
    //用户全选删除
    alldelete() {
      this.$confirm("确认删除吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          console.log(this.nid);
          this.$axios({
            method: "POST",
            url: "/backend/SystemSetting/delAdminUser",
            data: {
              admin_ids: this.nid
            }
          }).then(res => {
            // console.log(删除成功);
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.gettable();
          });
        })
        .catch(() => {});
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
<style lang="scss" scoped>
.admin-wapper {
  .admin-section {
    width: 183px;
    height: 24px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
  }
  .admin-bth {
    display: flex;
    margin-top: 20px;
  }
  .div_input {
    display: flex;
    align-items: center;
    height: 50px;
    margin: 20px 0;
    li {
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
  .div_input2 {
    display: flex;
    align-items: center;
    height: 50px;
    margin: 20px 0;
    li {
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
  .admin-table {
    margin-top: 30px;
  }
}
</style>
