<!--
 * @Description: 测试
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: duo
 * @LastEditTime: 2019-10-17 21:55:16
 -->
<template>
  <!-- 商品折扣设置 -->
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>抽佣比例</el-breadcrumb-item>
      <el-breadcrumb-item>商品折扣设置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <h1>折扣设置</h1> -->

    <!-- 普通商品抽佣比例设置 -->
    <div class="goodsinfo">
      <h2 style="margin-bottom: 20px;">
        普通商品抽佣比例设置
        <i></i>
      </h2>
      <section class="admin-table">
        <el-table
          v-loading="loading"
          :data="tableData2"
          border
          style="width: 800px"
          :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '900', height:'63px' }"
        >
          <el-table-column type="index" align="center" width="180" label="序号"></el-table-column>
          <el-table-column prop="discount_range" label="京东折扣" align="center" width="200"></el-table-column>
          <el-table-column prop="discount_ratio" label="折扣抽佣比例（%）" align="center" width="200"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-link type="primary" @click="opendia3(row)">编辑</el-link>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
    <!-- 折扣商品抽佣比例设置 -->
    <div class="goodsinfo">
      <h2>
        折扣商品抽佣比例设置
        <i></i>
      </h2>
      <div class="addbtn">
        <el-button plain icon="el-icon-plus" @click="opendia">新增折扣</el-button>
      </div>
      <section class="admin-table">
        <el-table
          v-loading="loading2"
          :data="tableData"
          border
          style="width: 800px"
          :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '900', height:'63px' }"
        >
          <el-table-column type="index" align="center" width="180" label="序号"></el-table-column>
          <el-table-column prop="discount" label="折扣数（折）" align="center" width="200"></el-table-column>
          <el-table-column prop="discount_ratio" label="折扣抽佣比例（%）" align="center" width="200"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-link type="primary" @click="opendia2(row)">编辑</el-link>
              <el-link type="danger" @click="open(row.id)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
    <!-- 编辑时候的弹窗 -->
    <div class="edit_dia">
      <el-dialog
        :title="is_add?'编辑':'新增'"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        width="500px"
        custom-class="dialog"
        :close="cancel"
      >
        <el-form label-position="left">
          <el-form-item label="折扣数：">
            <div class="dis_num">
              <el-input v-model="first_scale" autocomplete="off" placeholder="请输入"></el-input>
              <span style="margin-left:10px;">折</span>
            </div>
          </el-form-item>
          <el-form-item label="折扣抽佣比例：">
            <el-input v-model="second_scale" autocomplete="off" placeholder="单位：%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit" v-show="is_add">修 改</el-button>
          <el-button type="primary" @click="submit" v-show="!is_add">确 认</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 编辑 普通商品抽佣比例设置 -->
    <div class="edit_dia">
      <el-dialog
        title="编辑"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible2"
        width="500px"
        custom-class="dialog"
        :close="cancel2"
      >
        <el-form label-position="left">
          <el-form-item label="折扣数：">
            <div class="dis_num">
              <span>{{discount_num}}</span>
            </div>
          </el-form-item>
          <el-form-item label="折扣抽佣比例：">
            <el-input v-model="pt_scale" autocomplete="off" placeholder="单位：%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel2">取 消</el-button>
          <el-button type="primary" @click="submit2">确 认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      loading2: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      is_add: false,
      first_scale: "",
      second_scale: "",
      discount_num: "",
      pt_scale: "",
      discount_id: "",
      tableData: [], //折扣商品抽佣比例设置
      tableData2: [] //普通商品抽佣比例设置
    };
  },
  created() {
    this.discountList();
    this.discountOrList();
  },
  methods: {
    //商品折扣获取 /backend/Commission/discountList
    discountList() {
      this.loading2 = true;
      this.$axios({
        method: "GET",
        url: "/backend/JdCommission/discountList",
        params: {}
      }).then(res => {
        console.log(res.data.data, "折扣");
        if (res.data.status == 1) {
          this.loading2 = false;
          this.tableData = res.data.data;
        }
      });
    },
    open(id) {
      this.$confirm("您是否删除该折扣, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.discountDel(id);
      });
    },
    //活动专区折扣删除 /backend/JdCommission/discountDel
    discountDel(id) {
      this.$axios({
        method: "POST",
        url: "/backend/JdCommission/discountDel",
        data: {
          discount_id: id
        }
      }).then(res => {
        console.log(res.data.data, "折扣");
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.discountList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    cancel() {
      this.dialogFormVisible = false;
      this.first_scale = "";
      this.second_scale = "";
    },
    //新增
    opendia() {
      this.is_add = false;
      this.dialogFormVisible = true;
    },
    //编辑
    opendia2(row) {
      this.is_add = true;
      this.dialogFormVisible = true;
      //分割字符串
      this.first_scale = row.discount;
      this.second_scale = row.discount_ratio;
    },
    //商品折扣设置 /backend/JdCommission/discountSet
    discountSet() {
      this.$axios({
        method: "POST",
        url: "/backend/JdCommission/discountSet",
        data: {
          discount: this.first_scale,
          discount_ratio: this.second_scale
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.discountList();
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(error=>{
        console.log(error)
      });
    },
    //点击确认
    submit() {
      //判断非空
      if (this.first_scale) {
        if (this.second_scale) {
          this.discountSet();
        } else {
          this.$message.error("抽佣比例不能为空");
        }
      } else {
        this.$message.error("折扣不能为空");
      }
    },
    //普通商品折扣获取 /backend/JdCommission/discountOrList
    discountOrList() {
      this.loading = true;
      this.$axios({
        method: "GET",
        url: "/backend/JdCommission/discountOrList",
        params: {}
      }).then(res => {
        if (res.data.status == 1) {
          this.loading = false;
          this.tableData2 = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //新增
    opendia3(row) {
      this.dialogFormVisible2 = true;
      console.log(row);
      this.discount_num = row.discount_range;
      this.discount_id = row.id;
      this.pt_scale = row.discount_ratio;
    },
    //普通商品折扣设置 /backend/JdCommission/discountOrSet
    submit2() {
      if (this.pt_scale) {
        this.$axios({
          method: "POST",
          url: "/backend/JdCommission/discountOrSet",
          data: {
            discount_id: this.discount_id,
            discount_ratio: this.pt_scale
          }
        }).then(res => {
          if (res.data.status == 1) {
            this.$message.success(res.data.msg);
            this.discountOrList();
            this.cancel2();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } else {
        this.$message.error("折扣比例不能为空");
      }
    },
    cancel2() {
      this.dialogFormVisible2 = false;
      this.pt_scale = "";
      this.discount_id = "";
    }
  }
};
</script>
<style lang="scss" scoped>
h1 {
  margin-top: 10px;
  width: fit-content;
  height: 29px;
  font-size: 22px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 29px;
  color: rgba(51, 51, 51, 1);
}
.addbtn {
  //   width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
}
.goodsinfo {
  width: fit-content;
  margin-top: 20px;
  margin-bottom: 50px;

  h2 {
    // width: 91px;
    height: 29px;
    font-size: 20px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
    // margin-bottom: 20px;
    i {
      display: block;
      width: 34px;
      height: 2px;
      background: rgba(67, 113, 232, 1);
      border-radius: 1px;
      margin-top: 1px;
    }
  }
  .admin-table {
    width: fit-content;
  }
}
</style>

<style lang="scss">
.goodsinfo {
  .el-link--inner {
    margin: 0 10px;
  }
}
.edit_dia {
  //弹窗
  .dialog {
    .el-dialog__header {
      position: relative;
      // display: flex;
      height: 70px;
      .el-dialog__title {
        position: absolute;
        top: 32px;
        left: 30px;
        font-size: 22px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
  .el-dialog__body {
    padding: 30px 30px 5px 30px;
    .dis_num {
      display: flex;
      .el-input {
        width: 80px;
        // margin-right: 20px;
        .el-input__inner {
          width: 80px;
        }
      }
    }
    .el-input {
      width: 190px;
    }
    .el-input__inner {
      width: 190px;
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
