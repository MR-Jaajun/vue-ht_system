<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>抽佣比例</el-breadcrumb-item>
      <el-breadcrumb-item>按商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>分类管理</h1>
    <!-- <div class="search2">
      <el-form :inline="true" class="demo-form-inline" ref="formInline">
        <el-form-item label="分类ID">
          <el-input v-model="cid" placeholder="请输入分类ID" clearable></el-input>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="name" placeholder="请输入分类名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-right:15px;" @click="getsearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>-->
    <!-- 列表 -->
    <div class="photo_management">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        default-expand-all
        tooltip-effect="dark"
        style="width: fit-content;"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800', height:'63px' }"
        row-key="id"
        lazy
        :indent="25"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column align="left" prop="id" label="分类ID" width="150"></el-table-column>
        <el-table-column align="center" prop="jd_title" label="后端类目名称" width="180"></el-table-column>
        <el-table-column align="center" prop="title" label="前端类目名称" width="180"></el-table-column>
        <el-table-column align="center" label="图片" width="150">
          <template slot-scope="{row}">
            <img :src="row.cover" style="width:50px;height:50px;" />
            <!-- <span v-show="!row.cocer">/</span> -->
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_amount" label="商品数量" width="100"></el-table-column>
        <!-- <el-table-column align="center" prop="chouyong_rato" label="商城抽佣（%）" width="150"></el-table-column> -->
        <el-table-column align="center" prop="sort" label="排序" width="80"></el-table-column>
        <el-table-column align="center" prop="operation" label="操作" width="200">
          <template slot-scope="{row}">
            <el-link type="primary" class="el_link" @click="opendia2(row)">编辑</el-link>
            <el-link type="danger" class="el_link" @click="open(row.id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="block" style="height:30px;width:700px;">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="total,prev,pager,next,jumper"
        :total="total*1"
      ></el-pagination>
    </div>-->
    <!-- 编辑弹窗 -->
    <!-- 编辑 一级时候的弹窗 -->
    <div class="edit_dia">
      <el-dialog
        title="编辑"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        width="500px"
        custom-class="dialog"
      >
        <el-form label-position="left">
          <el-form-item label="后端分类名称:">
            <span>{{jd_title}}</span>
          </el-form-item>
          <el-form-item label="前端分类名称:">
            <el-input v-model="title" autocomplete="off" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="排序数值：">
            <el-input v-model="sort_num" autocomplete="off" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">修 改</el-button>
          <!-- <el-button type="primary" @click="submit" v-show="!is_add">确 认</el-button> -->
        </div>
      </el-dialog>
    </div>
    <!-- 编辑 二级时候的弹窗 -->
    <div class="edit_dia">
      <el-dialog
        title="编辑"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible2"
        width="500px"
        custom-class="dialog"
      >
        <el-form label-position="left">
          <el-form-item label="后端分类名称:">
            <span>{{jd_title}}</span>
          </el-form-item>
          <el-form-item label="前端分类名称:">
            <el-input v-model="title" autocomplete="off" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="排序数值：">
            <el-input v-model="sort_num" autocomplete="off" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="分类图片：">
            <!-- <img :src="imgurl" style="width:64px;height:64px;margin-right:20px" v-show="imgurl" /> -->
            <el-upload
              v-show="imgurl? 0:1"
              action
              list-type="picture-card"
              :on-change="onChange"
              :class="{hide1:hideUpload}"
              :on-remove="handleRemove"
              :auto-upload="false"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="imgurl? '':dialogImageUrl" />
            </el-dialog>
            <div class="del" v-show="imgurl? 1:0">
              <img :src="imgurl" class="imgs" />
              <p class="bg"></p>
              <i class="el-icon-delete" @click="delimg"></i>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel2">取 消</el-button>
          <el-button type="primary" @click="submit">修 改</el-button>
          <!-- <el-button type="primary" @click="submit" v-show="!is_add">确 认</el-button> -->
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getBase64, getsrc } from "../../utils/base64.js";

export default {
  data() {
    return {
      total: 1,
      listLoading: false,
      // cid: "",
      // name: "",
      dialogFormVisible: false,
      dialogFormVisible2: false,
      first_brokerage_scale: "",
      second_brokerage_scale: "",
      tableData: [],
      //
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      imgurl: "",
      dialogImageUrl: "",
      photo_url: "",
      img: "",
      //编辑
      c_id: "",
      is_show: 0,
      jd_title: "",
      title: "",
      sort_num: "",
      chouyong: ""
    };
  },
  created() {
    this.cateData();
  },
  methods: {
    // getsearch() {
    //   console.log("搜索");
    // },
    // resetForm() {
    //   this.cid = "";
    //   this.name = "";
    // },
    //商品分类获取  /backend/JdCommission/cateData
    cateData() {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/JdCommission/cateData",
        params: {}
      }).then(res => {
        console.log(res, "分类设置");
        if (res.data.status == 1) {
          this.listLoading = false;
          this.tableData = res.data.data;
        }
      });
    },
    // // 分页
    // handleCurrentChange(val) {
    //   // this.tableData = [];
    //   console.log(`当前页: ${val}`);
    // },
    cancel() {
      this.dialogFormVisible = false;
      this.jd_title = "";
      this.title = "";
      this.sort_num = "";
    },
    cancel2() {
      this.dialogFormVisible2 = false;
      this.jd_title = "";
      this.title = "";
      this.sort_num = "";
      this.chouyong = "";
      this.imgurl = "";
    },
    //删除弹窗
    open(id) {
      this.$confirm("您是否删除该折扣, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.cateDel(id);
      });
    },
    //商品分类删除 /backend/JdCommission/cateDel
    cateDel(id) {
      this.$axios({
        method: "POST",
        url: "/backend/JdCommission/cateDel",
        data: {
          id: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.cateData();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //编辑弹窗
    opendia2(row) {
      console.log(row);
      this.c_id = row.id;
      this.jd_title = row.jd_title;
      this.title = row.title;
      this.sort_num = row.sort;
      if (row.catClass == "0") {
        this.dialogFormVisible = true;
      } else {
        this.dialogFormVisible2 = true;
        this.chouyong_rato = row.chouyong_rato ? row.chouyong_rato : "";
        this.imgurl = row.cover ? row.cover : "";
      }
    },
    //修改 商品分类设置 /backend/JdCommission/cateSet
    submit() {
      this.$axios({
        method: "POST",
        url: "/backend/JdCommission/cateSet",
        data: {
          id: this.c_id,
          title: this.title,
          sort: this.sort_num,
          cover: this.dialogFormVisible2
            ? this.img
              ? this.img
              : this.imgurl
            : null
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.dialogFormVisible = false;
          this.dialogFormVisible2 = false;
          this.cateData();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    submit2() {},
    //删除图片出发的事件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.hideUpload = fileList.length >= this.limitCount;
    },
    //选择图片后触发的事件
    onChange(file, fileList) {
      console.log(fileList);
      fileList.forEach(item => {
        getBase64(item.raw).then(res => {
          this.$axios({
            method: "POST",
            url: "/backend/SystemSetting/uploadAvatar",
            data: {
              image: res
            }
          }).then(res => {
            console.log(res.data.data);
            this.img = res.data.data.url;
          });
        });
      });
      this.dialogImageUrl = file.url;
      this.hideUpload = fileList.length >= this.limitCount;
    },
    //删除编辑图片
    delimg() {
      this.imgurl = "";
      this.img = "";
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
.search2 {
  margin-top: 30px;
  .el-form {
    justify-content: flex-start;
    display: flex;
    align-content: center;
  }
  .el-form-item {
    display: flex;
    align-items: center;
    margin-right: 90px;
  }
}
//列表
.photo_management {
  margin-top: 35px;
  margin-bottom: 34px;
  width: fit-content;
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
</style>
<style lang="scss">
.edit_dia {
  //弹窗
  .dialog {
    .del:hover i {
      display: block;
    }
    .del:hover .bg {
      display: block;
    }
    .del {
      position: relative;
      display: flex;
      width: 100px;
      height: 100px;
      .imgs {
        width: 100px;
        height: 100px;
        border: 1px solid #dddbdb;
        border-radius: 5px;
      }
      .bg {
        width: 100px;
        height: 100px;
        position: absolute;
        top: 0;
        left: 0;
        background: #606266;
        z-index: 2;
        display: none;
        opacity: 0.5;
      }
      i {
        display: none;
        cursor: pointer;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        color: #fff;
        z-index: 3;
      }
    }
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
    // .dis_num {
    //   display: flex;
    //   .el-input {
    //     width: 80px;
    //     // margin-right: 20px;
    //     .el-input__inner {
    //       width: 80px;
    //     }
    //   }
    // }
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
      width: 100px;
      height: 100px;
      border: 1px solid #dddbdb;
    }
    // 图片宽高
    .el-upload--picture-card {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
    .el-icon-plus {
      font-size: 0.2rem;
    }
    .hide1 {
      height: 64px;
    }
    //超过限制数量添加类命
    .hide1 .el-upload {
      display: none;
    }
  }
}
</style>