<!--
 * @Description: 商品分类
 * @LastEditors: jun
 * @LastEditTime: 2019-10-11 10:12:51
 -->
<template>
  <!-- 商品分类管理 -->
  <div id="label">
    <div id="search">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: './categroy' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="addbtn">
        <div class="addbtn">
          <el-button
            type="primary"
            icon="el-icon-plus"
            style="margin-right:15px;"
            @click="opendia"
          >新增</el-button>
          <el-button plain icon="el-icon-delete" @click="delAll">删除</el-button>
        </div>
      </div>
      <!-- 搜索 -->
      <div class="search">
        <el-form :inline="true" class="demo-form-inline" ref="formInline">
          <el-form-item label="分类ID">
            <el-input v-model="id" placeholder="请输入分类ID" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品分类名称">
            <el-input v-model="title" placeholder="请输入商品分类名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="status" placeholder="请选择状态" clearable>
              <el-option label="已启用" value="1"></el-option>
              <el-option label="已禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-right:15px;" @click="getsearch">搜索</el-button>
            <el-button @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 新增弹窗 -->
    <!-- 新增弹窗 -->
    <el-dialog
      title="新增&编辑"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      :visible.sync="dialogFormVisible"
      width="574px"
      custom-class="dialog"
    >
      <el-form label-position="left" label-width="140px">
        <el-form-item label="分类名称:">
          <el-input v-model="class_name" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="请选择上级分类：">
          <div class="block">
            <el-cascader
              v-model="op"
              :options="optionsssss"
              :props="{ checkStrictly : true,value:'id',label:'title',children:'children'}"
              @change="handleChange"
              clearable
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="排序数字:">
          <el-input v-model="sort" autocomplete="off" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit" v-show="!isset">添 加</el-button>
        <el-button type="primary" @click="submit" v-show="isset">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 商品管理 -->
    <div id="label_management">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width:100%;"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800', height:'63px' }"
        @selection-change="handleSelectionChange"
        row-key="id"
        lazy
        :indent="25"
        :tree-props="{children: 'children'}"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" prop="id" label="分类ID" width="150"></el-table-column>
        <el-table-column align="center" prop="title" label="分类名称" width="180"></el-table-column>
        <el-table-column align="center" prop="status_value" label="状态" width="100"></el-table-column>
        <el-table-column align="center" prop="sort" label="排序" width="100"></el-table-column>
        <el-table-column align="center" prop="operation" label="操作">
          <template slot-scope="{row}">
            <el-link type="danger" class="el_link" @click="open(row.id)">删除</el-link>
            <el-link type="primary" class="el_link" @click="opendia2(row)">编辑</el-link>
            <el-link
              type="danger"
              class="el_link"
              v-show="row.status==1"
              @click="operation(row.id,row.status)"
            >禁用</el-link>
            <el-link
              type="primary"
              class="el_link"
              v-show="row.status==0"
              @click="operation(row.id,row.status)"
            >启用</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block" style="height:30px;width:700px;">
      <!-- <span class="demonstration">完整功能</span> -->
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="total,prev,pager,next,jumper"
        :total="total*1"
      ></el-pagination>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      isset: false,
      total: "",
      id: "",
      title: "",
      status: "",
      tableData: [],
      rowIds: [],
      nid: "",
      //弹窗
      dialogFormVisible: false,
      ids: "",
      class_id: "",
      class_id2: "",
      sort: "",
      class_name: "",
      op: [],
      //下拉数组
      optionProps: {
        value: "category_id",
        label: "category_title",
        children: "chlidren"
      },
      optionsssss: []
    };
  },
  created() {
    this.goodsCategoryList(1);
  },
  watch: {
    optionsssss() {
      console.log(this.optionsssss);
    }
  },
  methods: {
    clear() {
      this.id = "";
      this.title = "";
      this.status = "";
    },
    //获取经营类目
    opendia(row) {
      this.isset = false;
      this.dialogFormVisible = true;
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/goodsCategorySuper",
        params: {}
      }).then(res => {
        // console.log(res.data.data);
        this.optionsssss = res.data.data;
        this.optionsssss.map(item => {
          if (item.pid == row.pid) {
            this.class_id = item.title;
            // console.log(item.title);
          }
        });
      });
    },
    opendia2(row) {
      console.log(row);
      this.opendia(row);
      this.dialogFormVisible = true;
      this.isset = true;
      // this.class_id =row.;
      this.class_id2 = row.pid;
      this.sort = row.sort;
      this.class_name = row.title;
      this.ids = row.id;
    },
    //商品上级分类 /backend/Merchant/goodsCategorySuper
    // goodsImageCateSuper() {
    //   this.$axios({
    //     method: "GET",
    //     url: "/backend/Merchant/goodsCategorySuper",
    //     params: {}
    //   }).then(res => {
    //     console.log(res);
    //     this.optionsssss = res.data.data;
    //   });
    // },
    // opendia() {
    //   this.dialogFormVisible = true;
    //   this.goodsImageCateSuper();
    // },

    // //商品上级分类
    handleChange(value) {
      console.log(value);
      this.class_id = value[value.length - 1];
      this.class_id2 = value[value.length - 1];
    },
    //添加
    addnew() {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/goodsCategoryAdd",
        data: {
          title: this.class_name,
          pid: this.class_id,
          sort: this.sort
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.dialogFormVisible = false;
          this.goodsCategoryList(1);
          this.$message.success(res.data.msg);
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //编辑
    addnew2() {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/goodsCategoryEdit",
        data: {
          category_id: this.ids,
          title: this.class_name,
          pid: this.class_id2,
          sort: this.sort
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.dialogFormVisible = false;
          this.goodsCategoryList(1);
          this.$message.success(res.data.msg);
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //提交
    submit() {
      if (!this.isset) {
        this.addnew();
      }
      if (this.isset) {
        this.addnew2();
      }
    },
    // //取消 cancel
    cancel() {
      this.dialogFormVisible = false;
      this.op = [];
      this.class_name = "";
      this.sort = "";
      this.class_id = "";
    },
    //删除
    open(id) {
      this.$confirm("您是否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.del(id);
      });
    },
    getsearch() {
      this.goodsCategoryList(1);
    },
    // /backend/Merchant/goodsCategoryList
    goodsCategoryList(page) {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/goodsCategoryList",
        params: {
          id: this.id,
          title: this.title,
          status: this.status,
          page: page,
          size: 10
        }
      }).then(res => {
        console.log(res);
        this.total = res.data.data.total;
        this.tableData = res.data.data.data;
      });
    },
    //重置
    resetForm(forName) {
      this.id = "";
      this.title = "";
      this.status = "";
    },
    //多选
    handleSelectionChange(val) {
      // this.multipleSelection = val;
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
      });
      this.nid = this.rowIds.join(","); // 把数组转换成字符串
      console.log(this.nid);
    },
    // 分页
    handleCurrentChange(val) {
      // this.clear();/
      console.log(`当前页: ${val}`);
      this.goodsCategoryList(val);
    },
    //删除 /backend/Merchant/goodsCategoryEnable
    del(id) {
      console.log(id);
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/goodsCategoryDelete",
        data: {
          category_ids: id
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.goodsCategoryList(1);
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //批量删除
    delAll() {
      if (this.nid) {
        this.open(this.nid);
      } else {
        this.$message.error("请勾选分类ID");
      }
    },
    //启用禁用
    open2(id, url, txt) {
      this.$confirm(txt, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.Enable_Freeze(id, url);
      });
    },
    Enable_Freeze(id, url) {
      this.$axios({
        method: "POST",
        url: url,
        data: {
          category_id: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.error(res.data.msg);
          this.goodsCategoryList(1);
        }
        if (res.data.status == 0) {
          this.$message.error(res.data.msg);
        }
      });
    },
    operation(id, status) {
      if (status == 0) {
        this.open2(id, "/backend/Merchant/goodsCategoryEnable", "您是否启用");
      }
      if (status == 1) {
        this.open2(id, "/backend/Merchant/goodsCategoryFreeze", "您是否禁用");
      }
    }
  }
};
</script>


<style lang="scss">
html.body {
  font-family: Microsoft YaHei;
}
#search {
  width: 1624px;
  overflow: hidden;
}
.addbtn {
  //   width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 80px;
}
.search {
  .el-form {
    justify-content: flex-start;
    display: flex;
  }
  .el-form-item {
    display: flex;
    align-items: center;
    margin-right: 90px;
  }
}
//商品分类列表
#label_management {
  margin-top: 35px;
  margin-bottom: 34px;
  width: 882px;
  max-height: 663px;
  overflow-y: auto;
  border: 1px solid rgba(204, 204, 204, 1);
  div .el_link:nth-last-child(1) {
    border-right: 0;
  }
  .el_link {
    // border-right: 1px solid;
    height: 16px;
    margin: 0 5px;
  }
}
.el-pagination {
  height: 30px;
}

#backlist {
  height: 40px;
  margin-top: 40px;
  position: relative;
  .el-button {
    position: absolute;
    top: 0;
  }
}
</style>

<style lang="scss">
//弹窗
.dialog {
  .el-dialog__header {
    position: relative;
    height: 70px;
    .el-dialog__title {
      position: absolute;
      top: 32px;
      left: 56px;
      font-size: 20px;
    }
  }
  .el-dialog__body {
    padding: 30px 56px 5px 56px;
    .el-input {
      width: 248px;
    }
    .el-input__inner {
      width: 248px;
    }
    .el-form-item__label {
      color: #333;
    }
  }
}
</style>