<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-25 18:35:46
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 14:57:18
 -->
<template>
  <div class="admin_wap">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>物流管理</el-breadcrumb-item>
      <el-breadcrumb-item>配送管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="admin-bth">
      <el-button type="primary" plain icon="el-icon-view" @click="handallCode">启用</el-button>
      <el-button type="primary" plain icon="el-icon-circle-close" @click="handallStatus">禁用</el-button>
    </div>
    <div class="admin-input2">
      <div class="inputdiv2">
        <span class="span">物流公司名称/物流公司编号</span>
        <el-input v-model="order_val" class="input-control" placeholder="请输入内容"></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">状态</span>
        <el-select v-model="status_type" clearable placeholder="请选择">
          <el-option
            v-for="(item ,index) in typeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="inputdiv2">
        <el-button type="primary" @click="gettable">搜索</el-button>
        <el-button type @click="clear">重置</el-button>
      </div>
    </div>
    <section class="table_div">
      <el-table
        v-loading="listLoading"
        :data="tableData"
        @selection-change="selectAll"
        style="width:1608px"
        :header-cell-style="{background:'#EAEBEF',color:'#333', fontWeight: '800',
        height:'63px' }"
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>
        <el-table-column prop="logistics_name" align="center" label="物流公司名称" width="100"></el-table-column>
        <el-table-column prop="logistics_com" align="center" label="物流公司编号" width="130"></el-table-column>
        <el-table-column prop="sort" align="center" label="排序" width="100">
          <template slot-scope="{row}">
            <el-input v-model="row.sort" @blur="blurSort(row.id,row.sort)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="contact_information" align="center" label="状态" width="100">
          <template slot-scope="{row}">
            <span v-text="row.status_value=='启用'?'启用':'未启用'" type="text"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="{row}">
            <el-button
              v-if="row.status=='1'"
              type="text"
              style="color:red"
              @click="handleStatus(row)"
            >禁用</el-button>
            <el-button v-if="row.status=='0'" type="text" @click="handCode(row)">启用</el-button>
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
      rowIds: null,
      nid: "",
      order_val: "", //物流公司名称
      status_type: "", //状态
      value: "",
      listQuery: {
        page: 1,
        size: 10
      },
      tableData: [],
      typeList: [
        {
          value: "1",
          label: "启用"
        },
        {
          value: "0",
          label: "未启用"
        }
      ]
    };
  },

  created() {
    this.gettable();
  },
  methods: {
    //重置
    clear() {
      (this.order_val = ""), (this.status_type = "");
    },
    // 搜索获取列表
    gettable() {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Operation/logisticsList",
        params: {
          logistics_name: this.order_val,
          status: this.status_type,
          size: this.listQuery.size,
          page: this.listQuery.page
        }
      }).then(res => {
        if (res.status == 200) {
          this.listLoading = false;
          this.tableData = [];
          console.log(res.data.data);
          this.total = res.data.data.total;
          this.tableData = res.data.data.data;
        }
      });
    },
    /**排序 */
    blurSort(id, num) {
      this.$axios({
        method: "POST",
        url: "/backend/Operation/logisticsSort",
        data: {
          logistics_ids: id,
          sort: num
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.gettable();
        } else {
          this.$message.error(res.data.msg);
          this.gettable();
        }
      });
    },
    // 用户全选checkbox时触发该事件
    selectAll(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
      });
      this.nid = this.rowIds.join(","); /****把数组转换成字符串*****/
      return this.nid;
    },
    //全选启用
    handallCode() {
      this.$axios({
        method: "POST",
        url: "/backend/Operation/logisticsUsing",
        data: {
          logistics_ids: this.nid
        }
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: "success"
        });
        this.gettable();
      });
    },
    //全选禁用
    handallStatus() {
      this.$axios({
        method: "POST",
        url: "/backend/Operation/logisticsForbidden",
        data: {
          logistics_ids: this.nid
        }
      }).then(res => {
        this.$message.success(res.data.msg);
        this.gettable();
      });
    },
    //单选禁用
    handleStatus(row) {
      this.$axios({
        method: "POST",
        url: "/backend/Operation/logisticsForbidden",
        data: {
          logistics_ids: row.id
        }
      }).then(res => {
        this.$message.success(res.data.msg);
        this.gettable();
      });
    },
    //单选启用
    handCode(row) {
      this.$axios({
        method: "POST",
        url: "/backend/Operation/logisticsUsing",
        data: {
          logistics_ids: row.id
        }
      }).then(res => {
        this.$message.success(res.data.msg);
        this.gettable();
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
.admin_wap {
  .h1 {
    margin-top: 21px;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  .admin-bth {
    display: flex;
    margin-top: 20px;
  }
  .admin-input {
    display: flex;
    height: 34px;
    margin-top: 20px;
    align-items: center;
    .inputdiv {
      margin-right: 90px;
      display: flex;
      height: 34px;
      flex-direction: row;
      justify-content: center;
      .span {
        display: inline-block;
        width: 68px;
        margin-right: 25px;
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
      height: 34px;
      margin-right: 90px;
      display: flex;
      justify-content: center;
      .span {
        display: inline-block;
        width: 208px;
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
    .inputdiv {
      margin-right: 90px;
      display: flex;
      height: 34px;
      flex-direction: row;
      justify-content: center;
      .span {
        display: inline-block;
        width: 35px;
        margin-right: 25px;
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
  .table_div {
    margin-top: 20px;
  }
}
</style>

