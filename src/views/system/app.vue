<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-11 14:58:01
 -->
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>版本管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <div class="btn">
      <el-button type="primary" icon="el-icon-plus" @click="addversion">新增版本</el-button>
    </div>-->
    <section class="vip-table">
      <el-table
        :data="tableData"
        border
        tooltip-effect="light"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '900', height:'63px' }"
        style="width: 100%"
      >
        <el-table-column type="index" align="center" label="序号" width="55"></el-table-column>
        <el-table-column prop="app_name" label="APP名称" align="center" width="100"></el-table-column>
        <el-table-column prop="version_no" label="版本号" align="center" width="100"></el-table-column>
        <el-table-column prop="inner_version" label="内部版本号" align="center" width="100"></el-table-column>
        <el-table-column prop="system" label="系统" align="center" width="100"></el-table-column>
        <el-table-column prop="status" label="版本状态" align="center" width="100"></el-table-column>
        <el-table-column
          prop="app_des"
          label="版本描述"
          filter-placement="right-top"
          show-overflow-tooltip
          align="center"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="app_url"
          label="下载地址"
          show-overflow-tooltip
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column prop="update_user" label="创建者" align="center" width="100"></el-table-column>
        <el-table-column prop="update_time" align="center" label="更新时间" width="200"></el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="{row}">
            <el-button @click="handleClick(row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- page-size每页显示条目个数 -->
      <div class="pagination-container" style="margin-top:30px;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-size="listQuery.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
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
      tableData: [],
      listQuery: {
        page: 1,
        size:10
      }
    };
  },
  created() {
    this.gettable();
  },
  mounted() {},
  methods: {
    handleClick(row) {
      console.log(row);
      this.$router.push({
        name: `version`,
        params: {
          app_v: row
        }
      });
    },
    // 获取列表
    gettable() {
      this.$axios({
        method: "GET",
        url: "/backend/Version/versionList",
        params: {
          size: this.listQuery.size,
          page: this.listQuery.page
        }
      }).then(res => {
        if (res.status == 200) {
          console.log(res.data.data.data, "获取列表");
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
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
    },
    //新增版本
    addversion() {
      this.$router.push({ path: "./addversion" });
    }
  }
};
</script>

<style lang="scss" scoped>
.vip-table {
  width: fit-content;
  margin-top: 30px;
  // margin-bottom: 30px;
}
.btn {
  display: flex;
  width: fit-content;
  margin-top: 30px;
}
</style>
