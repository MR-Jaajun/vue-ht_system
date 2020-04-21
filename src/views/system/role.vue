<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 14:54:25
 -->
<template>
  <div class="role-wapper">
    <section class="role-section">系统管理/角色管理</section>
    <div class="role-bth">
      <el-button type="primary" plain icon="el-icon-plus" @click="getroledetails">新增</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="alldelete">删除</el-button>
    </div>
    <div class="role-input">
      <div class="text-box">
        <p>
          <span class="span">角色名称</span>
          <el-input v-model="username" class="input-control" placeholder="请输入内容"></el-input>
        </p>
        <p>
          <el-button type="primary" plain @click="gettable">搜索</el-button>
          <el-button type="primary" plain @click="clear">重置</el-button>
        </p>
      </div>
    </div>
    <section class="role-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        align="center"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '900', height:'63px' }"
        @selection-change="selectAll"
      >
        <el-table-column type="selection" align="center" width="100"></el-table-column>
        <el-table-column fixed prop="id" align="center" label="角色ID" width="100"></el-table-column>
        <el-table-column prop="name" label="角色" align="center" width="100"></el-table-column>
        <el-table-column prop="remark" align="center" label="备注" width="200"></el-table-column>

        <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="onEditrole(scope.row)">编辑</el-button>
            <el-button
              type="text"
              style="color:red"
              @click="onDeleterole(scope.row,scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      total:"",
      rowIds: [],
      listQuery: {
        page: 1,
        size: 10
      },
      username: "",
      listQuery: {
        page: 1,
        size: 10
      },
      tableData: []
    };
  },

  created() {
    this.gettable();
  },

  methods: {
    getroledetails() {
      this.$router.push({ path: "./roledetails" });
    },
    onEditrole(row) {
      this.$router.push({ name: "editrole", params: { roleID: row.id } });
    },
    // 删除数据
    onDeleterole(row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let paraid = row.id;
          console.log(paraid);
          this.$axios({
            method: "POST",
            url: "/backend/Role/delRole",
            data: {
              role_ids: paraid
            }
          }).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.gettable();
          });
        })
        .catch(() => {});
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
            url: "/backend/Role/delRole",
            data: {
              role_ids: this.nid
            }
          }).then(res => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.gettable();
          });
        })
        .catch(() => {});
    },
    //重置
    clear() {
      this.username = "";
    },
    // 获取列表
    gettable() {
      this.$axios({
        method: "GET",
        url: "/backend/Role/roleList",
        params: {
          role_name: this.username,
          size: this.listQuery.size,
          page: this.listQuery.page
        }
      })
        .then(res => {
          if (res.status == 200) {
            this.total = res.data.data.total; 
            this.tableData = res.data.data.data;
          }
        })
        .catch(error => {
          console.log(error, "error");
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


<style lang="scss" scoped>
.role-wapper {
  .role-section {
    width: 183px;
    height: 24px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
  }
  .role-bth {
    position: relative;
    top: -50px;
    z-index: 100;
  }
  .role-input {
    width: 1080px;
    position: relative;
    top: -90px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .text-box {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      .span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
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
}
.role-table {
  position: relative;
  top: -60px;
  width: 800px;
}
</style>

