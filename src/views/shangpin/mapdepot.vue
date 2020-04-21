<!--
 * @Description: 暂时没有接口
 * @LastEditors: Roc
 * @LastEditTime: 2020-02-24 11:29:33
 -->

<template>
  <!--  图库分类管理 -->
  <div id="mapdepot">
    <div class="searchs">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: './categroy' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>图库分类管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="addbtn">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-right:15px;"
          @click="opendia2('',0)"
        >新增</el-button>
        <el-button plain icon="el-icon-delete" @click="open(nid)">删除</el-button>
      </div>
      <!-- 新增弹窗 -->
      <el-dialog
        @close="cancel"
        title="新增&编辑"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        width="574px"
        custom-class="dialog"
      >
        <el-form :model="form" label-position="left" :label-width="formLabelWidth">
          <el-form-item label="分类名称：">
            <el-input v-model="form.name" autocomplete="off" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="请选择上级分类：">
            <div class="block">
              <el-cascader
                v-model="op2"
                :options="optionssss"
                :props="{ checkStrictly : true,value:'id',label:'title',children:'children'}"
                @change="handleChange2"
                clearable
                :placeholder="form.titles"
              ></el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="排序数字：">
            <el-input v-model="form.sort" autocomplete="off" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" v-show="!isset" @click="addnew">添 加</el-button>
          <el-button type="primary" v-show="isset" @click="addnew2">修 改</el-button>
        </div>
      </el-dialog>
      <!-- <div class="search">
        <el-form :inline="true" class="demo-form-inline" ref="formInline">
          <el-form-item label="分类ID">
            <el-input v-model="id" placeholder="请输入分类ID"></el-input>
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="name" placeholder="请输入分类名称"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="status" placeholder="请选择状态">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getsearch" style="margin-right:15px;">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div> -->
    </div>

    <!-- 图库分类管理 -->
    <div id="photo_management">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width:100%;"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800', height:'63px' }"
        @selection-change="handleSelectionChange"
        row-key="id"
        lazy
        :indent="25"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column align="center" prop="id" label="分类ID" width="130"></el-table-column>
        <el-table-column align="center" prop="title" label="分类名称" width="150"></el-table-column>
        <el-table-column align="center" prop="status" label="状态" width="130">
          <template slot-scope="{row}">
            <span v-show="row.status==1">启 用</span>
            <span v-show="row.status==0" style="color:red">禁 用</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sort" label="排序" width="130"></el-table-column>
        <el-table-column align="center" prop="operation" label="操作" width="400">
          <template slot-scope="{row}">
            <el-link type="danger" class="el_link" @click="open(row.id)">删除</el-link>
            <el-link type="primary" class="el_link" @click="opendia2(row,1)">编辑</el-link>
            <el-link type="primary" class="el_link" @click="opendia2(row,0)">添加子分类</el-link>
            <el-link
              type="danger"
              v-show="row.status==1"
              class="el_link"
              @click="open2(row.id,row.status,'您将禁用')"
            >禁用</el-link>
            <el-link
              type="primary"
              v-show="row.status==0"
              class="el_link"
              @click="open2(row.id,row.status,'您将启用')"
            >启用</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <!-- <div class="block" style="height:30px;width:700px;"> -->
      <!-- <span class="demonstration">完整功能</span> -->
      <!-- <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="total,prev,pager,next,jumper"
        :total="100"
      ></el-pagination> -->
    <!-- </div> -->
  </div>
</template>


<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      isset: false, //是否编辑
      listLoading: false,
      total: "",
      id: "",
      name: "",
      status: "",
      rowIds: [],
      nid: "",
      optionsssss: [],
      optionssss: [],
      class_name: "",
      op2: [],
      form: {
        name: "",
        sort: "",
        classify: "",
        titles: ""
      },
      // titles: "",
      category_id: "",
      class_name: "",
      tableData: [],
      rowIds: [],
      nid: "",
      //选中后的数据添加
      multipleSelection: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "140px"
    };
  },
  computed: {
    // ...mapState(["a"])
  },
  created() {
    this.goodsImageList();
    this.goodsImageCateSuper();
  },
  methods: {
    // ...mapMutations(["asdf"]),
    // onSubmit() {
    //   this.asdf("123");
    // },
    // onSubmit() {
    //   //   console.log("submit!");
    //   this.$store.commit("con", a);
    // },

    // 获取图片分类
    goodsImageCateSuper() {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/goodsImageAllCate",
        params: {
          // type: 1
        }
      }).then(res => {
        console.log(res,'ssss');
        this.optionssss = res.data.data;
        this.optionsssss = res.data.data;
        // this.optionsssss.map(item => {
        //   if (item.category_id == row.pid) {
        //     this.class_id = item.title;
        //     console.log(item.title);
        //   }
        // });
      });
    },
    handleChange2(value) {
      console.log(value);
      this.class_name = value[value.length - 1];
      // this.class_id = value[value.length - 1];
      // this.class_id2 = value[value.length - 1];
    },
    cancel() {
      this.form.name = "";
      this.class_name = "";
      this.form.sort = "";
      this.isset = true;
      this.form.titles = "";
    },
    // opendia(row) {
    //   // this.isset = false;
    //   this.dialogFormVisible = true;
    //   this.$axios({
    //     method: "GET",
    //     url: "/backend/Merchant/goodsImageAllCate",
    //     params: {}
    //   }).then(res => {
    //     console.log(res.data.data);
    //     this.optionssss = res.data.data;
    //     if (row) {
    //       this.optionssss.map(item => {
    //         if (item.id == row.pid) {
    //           this.class_id = item.title;
    //           console.log(item.title);
    //         }
    //       });
    //     }
    //   });
    // },
    opendia2(row, bool) {
      console.log(row);
      this.dialogFormVisible = true;
      if (bool == 1) {
        // this.opendia(row)
        this.form.sort = row.sort;
        this.form.name = row.title;
        this.form.titles = row.title;
        this.category_id = row.id;
      }
      if (row) {
        this.class_name = row.pid;
      }
      this.isset = bool;
      // this.goodsImageCateSuper();
    },
    //添加
    addnew() {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/goodsImageCateAdd",
        data: {
          title: this.form.name,
          pid: this.class_name,
          sort: this.form.sort
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.dialogFormVisible = false;
          this.$message.success(res.data.msg);
          this.goodsImageList();
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
        url: "/backend/Merchant/goodsImageCateEdit",
        data: {
          category_id: this.category_id,
          title: this.form.name,
          pid: this.class_name,
          sort: this.form.sort
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.dialogFormVisible = false;
          this.$message.success(res.data.msg);
          this.goodsImageList();
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    getsearch() {
      this.goodsImageList();
    },
    //图库分类  /backend/Merchant/goodsImageList
    goodsImageList() {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/goodsImageCateList",
        params: {
          // type:1
        }
      }).then(res => {
        console.log(res,'分类');
        this.listLoading = false;
        // this.total = res.data.data.total;
        this.tableData = res.data.data;
        console.log(res)
      });
    },
    //下拉联动
    handleChange(value) {
      console.log(value);
      // console.log(this.form)
    },
    //重置
    resetForm(forName) {
      this.id = "";
      this.status = "";
      this.name = "";
      // this.$refs[forName].resetFields();
    },
    //批量选择
    handleSelectionChange(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
      });
      this.nid = this.rowIds.join(","); // 把数组转换成字符串
      console.log(this.nid);
      return this.nid;
    },
    //删除 /backend/Merchant/shopCategoryDelete
    del(id) {
      console.log(id);
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/goodsImageCateDelete",
        data: {
          category_ids: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.goodsImageList();
        }
        if (res.data.status == 0) {
          this.$message.error(res.data.msg);
        }
        console.log(res);
      });
    },
    //批量删除
    delALL(nid) {
      if (nid) {
        this.del(nid);
      } else {
        this.$message.error("请勾选分类ID");
      }
    },
    open(id) {
      this.$confirm("您是否删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.del(id);
      });
    },

    //启用禁用的弹窗
    open2(id, status, txt) {
      // console.log(id, type);
      this.$confirm(txt + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.operation(id, status);
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
          this.$message.success(res.data.msg);
          this.goodsImageList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //启用 /backend/Merchant/shopCategoryEnable status=0
    //禁用 /backend/Merchant/shopCategoryFreeze stauts=1
    operation(id, status) {
      console.log("00000000000000000000000")
      if (status == 0) {
        this.Enable_Freeze(id, "/backend/Merchant/goodsImageCateEnable");
      }
      if (status == 1) {
        this.Enable_Freeze(id, "/backend/Merchant/goodsImageCateFreeze");
      }
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`, "后台没有做分页啊。。搜索也没做");
    },
    //返回
    backList() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss">
html.body {
  font-family: Microsoft YaHei;
}
.searchs {
  width: 1624px;
  overflow: hidden;
  //弹窗
  .dialog {
    // width: 500px;
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
  .dialog1 {
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

//列表
#photo_management {
  margin-top: 35px;
  margin-bottom: 34px;
  width: 992px;
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
