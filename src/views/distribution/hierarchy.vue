<!--
 * @Description: 分销等级列表
 * @Author: jun
 * @Date: 2019-08-19 17:48:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-14 11:03:55
 -->
<template>
  <div class="hierarchy">
    <section>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>分销管理</el-breadcrumb-item>
        <el-breadcrumb-item>分销等级设置</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <!-- 按钮 -->
    <div class="admin-bth">
      <el-button type="primary" @click="opendia">批量修改佣金比例</el-button>
    </div>
    <!-- 表格 -->
    <section class="vip-table">
      <el-table
        border
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 1211px"
        @selection-change="selectAll"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column prop="id" label="ID" align="center" width="100"></el-table-column>
        <el-table-column prop="rank_title" label="等级名称" align="center" width="100"></el-table-column>
        <el-table-column prop="rank_level" label="等级权重" align="center" width="100"></el-table-column>
        <el-table-column prop="rank_nums" label="分销员人数" align="center" width="100"></el-table-column>
        <el-table-column prop="first_brokerage_scale" label="一级佣金" align="center" width="100"></el-table-column>
        <el-table-column prop="second_brokerage_scale" label="二级佣金" align="center" width="100"></el-table-column>
        <el-table-column prop="promotion_award" label="等级奖励" align="center" width="100"></el-table-column>
        <el-table-column prop="rank_condition" label="自动升级条件" align="center" width="350"></el-table-column>
        <el-table-column prop="zhixi_amount" label="操作" align="center" width="100">
          <template slot-scope="{row}">
            <el-link type="primary" @click="edit(row)">编辑</el-link>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 编辑弹窗 -->
    <!-- 新增弹窗 -->
    <el-dialog
      title="批量修改佣金比例"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      width="500px"
      custom-class="dialog"
    >
      <el-form label-position="left">
        <el-form-item label="一级佣金比例：">
          <el-input v-model="first_brokerage_scale" autocomplete="off" placeholder="请输入%"></el-input>
        </el-form-item>
        <el-form-item label="二级佣金比例：">
          <el-input v-model="second_brokerage_scale" autocomplete="off" placeholder="请输入%"></el-input>
        </el-form-item>
        <el-form-item label="升级到此等级奖励：">
          <el-input v-model="promotion_award" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">修 改</el-button>
        <!-- <el-button type="primary" @click="submit">确 认</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      rowId: [],
      nid: "",
      rank_ids: "",
      dialogFormVisible: false,
      first_brokerage_scale: "",
      second_brokerage_scale: "",
      promotion_award: ""
    };
  },
  created() {
    this.memberRankList();
  },
  methods: {
    //分销等级列表 /backend/Distribution/memberRankList
    memberRankList() {
      this.$axios({
        method: "GET",
        url: "/backend/Distribution/memberRankList",
        params: {}
      }).then(res => {
        console.log(res, "5555555");
        if (res.data.status == 1) {
          this.tableData = res.data.data;
        }
      });
    },
    //新增弹窗
    opendia() {
      if (this.nid) {
        console.log(this.nid);
        this.dialogFormVisible = true;
      } else {
        this.open();
      }
    },
    //提示弹窗
    open() {
      this.$alert("您还没有勾选等级，勾选等级再做此操作", "提示", {
        confirmButtonText: "确定",
        type: "warning",
        callback: action => {
          console.log("去勾选啊，兄弟");
        }
      });
    },
    //提交
    submit() {
      this.editBrokerage();
    },
    //取消
    cancel() {
      this.dialogFormVisible = false;
      // this.nid = "";
      this.toggleSelection();
      this.first_brokerage_scale = "";
      this.second_brokerage_scale = "";
      this.promotion_award = "";
    },
    //批量编辑 /backend/Distribution/editBrokerage
    editBrokerage() {
      this.$axios({
        method: "POST",
        url: "/backend/Distribution/editBrokerage",
        data: {
          rank_ids: this.nid,
          first_brokerage_scale: this.first_brokerage_scale,
          second_brokerage_scale: this.second_brokerage_scale,
          promotion_award: this.promotion_award
        }
      }).then(res => {
        if (res.data.status == 1) {
          console.log(res);
          this.cancel();

          this.dialogFormVisible = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //单个编辑
    edit(row) {
      // this.dialogFormVisible = true;
      // console.log(row);
      // this.nid = row.id;
      // this.first_brokerage_scale = row.first_brokerage_scale;
      // this.second_brokerage_scale = row.second_brokerage_scale;
      // this.promotion_award = row.promotion_award;
      // this.toggleSelection();

      this.$router.push({
        name: "editDistribution",
        params: { rank_id: row.id }
      });
    },
    //批量选择
    selectAll(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
      });
      this.nid = this.rowIds.join(","); // 把数组转换成字符串
      console.log(this.nid);
      return this.nid;
    },
    //清空多选
    toggleSelection(rows) {
      // console.log(rows) 无rows
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-bth {
  display: flex;
  width: 500px;
  margin: 30px 0;
}
</style>

<style lang="scss">
.hierarchy {
  //弹窗
  .dialog {
    .el-dialog__header {
      position: relative;
      // display: flex;
      height: 70px;
      .el-dialog__title {
        position: absolute;
        top: 32px;
        left: 53px;
        font-size: 22px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
  .el-dialog__body {
    padding: 30px 50px 5px 50px;
    .el-input {
      width: 248px;
    }
    .el-input__inner {
      width: 248px;
    }
    .el-form-item__label {
      color: #333;
      // margin-right: 20px;
      width: 140px;
    }
    .el-upload-list__item {
      width: 64px;
      height: 64px;
      border: 1px solid #dddbdb;
    }
  }
}
</style>