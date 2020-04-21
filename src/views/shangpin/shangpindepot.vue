<!--
 * @Description: 商品图库管理
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-06 12:03:35
 -->
import Vue from 'vue';

<template>
  <!--  商品图库管理 -->
  <div id="goods_photo">
    <div id="search">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: './categroy' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品图库管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="addbtn">
        <el-button type="primary" icon="el-icon-plus" style="margin-right:15px;" @click="opendia">新增</el-button>
        <el-button plain icon="el-icon-delete" @click="open">删除</el-button>
      </div>
      <!-- 新增弹窗 -->
      <div v-if="dialogFormVisible">
        <el-dialog
          @close="cancel"
          title="新增&编辑"
          :visible.sync="dialogFormVisible"
          :close-on-click-modal="false"
          width="574px"
          custom-class="dialog"
        >
          <el-form label-position="left" :label-width="formLabelWidth">
            <el-form-item label="图片分类：">
              <div class="block">
                <el-cascader
                  v-model="op"
                  :options="optionsssss"
                  :props="{ checkStrictly : true,value:'id',label:'title',children:'children'}"
                  @change="handleChange"
                  clearable
                  :placeholder="titles"
                ></el-cascader>
              </div>
            </el-form-item>
            <el-form-item label="图片名称">
              <el-input v-model="name" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="图片上传：">
              <!-- <img
                :src="imgurl"
                alt="图"
                style="width:100px;height:100px;;margin-right:20px;"
                v-if="imgurl"
              />-->
              <el-upload
                action
                v-show="imgurl? 0:1"
                list-type="picture-card"
                :on-change="onChange"
                :class="{hide:hideUpload}"
                :on-remove="handleRemove"
                :auto-upload="false"
                :limit="1"
                accept=".jpg, .png"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="photo_url" />
              </el-dialog>
              <div class="del" v-show="imgurl? 1:0">
                <img :src="imgurl" class="imgs" />
                <p class="bg"></p>
                <i class="el-icon-delete" @click="dels"></i>
              </div>
            </el-form-item>
            <el-form-item label="图片简介：">
              <el-input
                type="textarea"
                maxlength="30"
                show-word-limit
                placeholder="请输入内容"
                v-model="photo_info"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit" v-show="!isset">添 加</el-button>
            <el-button type="primary" @click="submit" v-show="isset">确 认</el-button>
          </div>
        </el-dialog>
      </div>

      <!-- 搜索 -->
      <div class="search">
        <el-form :inline="true" class="demo-form-inline" ref="formInline">
          <el-form-item label="图片名称">
            <el-input v-model="photo_name" placeholder="请输入分类ID"></el-input>
          </el-form-item>
          <el-form-item label="图片分类">
            <!-- <el-input v-model="class_name" placeholder="请输入分类名称"></el-input> -->
            <el-cascader
              :placeholder="shop_category"
              v-model="op2"
              :options="optionssss"
              :props="{ checkStrictly : true,value:'id',label:'title',children:'children'}"
              @change="handleChange2"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="status" placeholder="请选择状态">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getsearch" style="margin-right:15px;">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 商品图库管理 -->
    <div id="goodsphoto_management">
      <el-table
        v-loading="listLoading"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width:100%;"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800', height:'63px' }"
      >
        <el-table-column type="selection" align="center" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="title" label="图片名称" width="150"></el-table-column>
        <el-table-column align="center" prop="category_title" label="图片分类" width="250"></el-table-column>
        <el-table-column align="center" prop="image_url" label="商品图片" width="120">
          <template slot-scope="{row}">
            <img :src="row.image_url" style="width:50px;height:50px" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="desc" label="图片简介" width="250"></el-table-column>
        <el-table-column align="center" prop="status" label="状态" width="73">
          <template slot-scope="{row}">
            <!-- <span v-text="row.status==1?'启用':'禁用'"></span> -->
            <span v-show="row.status==0" style="color:red">禁用</span>
            <span v-show="row.status==1">启用</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operation" label="操作" width="350">
          <template slot-scope="{row}">
            <el-link type="danger" class="el_link" @click="open3(row.id)">删除</el-link>
            <el-link type="primary" class="el_link" @click="opendia2(row)">编辑</el-link>
            <el-link
              type="primary"
              class="el_link"
              v-show="row.status==0"
              @click="open2(row.id,row.status,'您将启用')"
            >启用</el-link>
            <el-link
              type="danger"
              class="el_link"
              v-show="row.status==1"
              @click="open2(row.id,row.status,'您将禁用')"
            >禁用</el-link>
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
import { mapState, mapMutations } from "vuex";
import { getBase64 } from "../../utils/base64.js";
export default {
  data() {
    return {
      titles: "",
      isset: false,
      listLoading: false,
      total: "",
      class_name: "",
      photo_name: "",
      status: "",
      rowIds: [],
      nid: "",
      //
      imgurl: "",
      // dialogImageUrl: "", //图片路径
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量

      //弹出框内容
      name: "", //图片名称
      photo_url: "",
      photo_info: "", //图片路径
      img: "", //返回的图片
      optionsssss: [],
      optionssss: [],
      op: [],
      shop_category:"请选择",
      op2: [],
      class_id: "",
      class_id2: "",
      //列表数组
      tableData: [],
      //选中后的数据添加
      multipleSelection: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      formLabelWidth: "100px"
    };
  },
  created() {
    this.goodsImageList(1);
    // this.goodsImageCateSuper1();
    this.goodsImageCateSuper2();
  },
  watch: {
    // img() {
    //   console.log(this.img);
    // },
    // class_id(){
    //   console.log(this.class_id);
    // },
    op() {
      console.log(this.op);
    }
  },
  methods: {
    // ...mapMutations(["asdf"]),
    // onSubmit() {
    //   this.asdf("123");
    // },
    //商品图库管理列表
    getsearch() {
      this.goodsImageList(1);
    },
    goodsImageList(page) {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/goodsImageList",
        params: {
          search_category_id: this.class_name,
          search_title: this.photo_name,
          search_status: this.status,
          page: page,
          size: 10
        }
      }).then(res => {
        console.log(res);
        this.listLoading = false;
        this.total = res.data.data.total;
        this.tableData = res.data.data.data;
      });
    },
    //获取图片分类
    goodsImageCateSuper() {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/goodsImageAllCate",
        params: {
          type: 1
        }
      }).then(res => {
        console.log(res);
        this.optionss = res.data.data;
        this.optionsssss = res.data.data;
        this.optionsssss.map(item => {
          if (item.category_id == row.pid) {
            this.class_id = item.title;
            console.log(item.title);
          }
        });
      });
    },
    //获取图片分类
    goodsImageCateSuper2() {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/goodsImageAllCate",
        params: {
          type: 1
        }
      }).then(res => {
        console.log(res.data.data, "12121");
        this.optionssss = res.data.data;
        this.optionsssss = res.data.data;
        this.optionsssss.map(item => {
          if (item.category_id == row.pid) {
            this.class_id = item.title;
            console.log(item.title);
          }
        });
      });
    },
    //打开弹窗
    opendia(row) {
      this.isset = false;
      this.dialogFormVisible = true;
      this.imgurl = "";
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/goodsImageAllCate",
        params: {
          type: 1
        }
      }).then(res => {
        console.log(res);
        this.optionsssss = res.data.data;
        if (row) {
          this.optionsssss.map(item => {
            if (item.pid == row.id) {
              this.class_id = item.title;
              console.log(item.title);
            }
          });
        }
      });
    },
    opendia2(row) {
      console.log(row);
      this.opendia(row);
      // this.hideUpload = true;
      this.dialogFormVisible = true;
      this.isset = true;
      this.name = row.title;

      this.imgurl = row.image_url;
      this.img = row.image_url;
      this.photo_info = row.desc;
      this.titles = row.category_title;
      //
      this.goods_image_id = row.id;
      this.class_id2 = row.category_id;
      this.category_title = row.category_title;
      // this.op = this.optionsssss[0];
    },
    //添加
    addnew() {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/goodsImageAdd",
        data: {
          title: this.name,
          category_id: this.class_id,
          image_url: this.img,
          desc: this.photo_info
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.dialogFormVisible = false;
          this.$message.success(res.data.msg);
          this.cancel();
          this.goodsImageList(1);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 编辑
    addnew2() {
      // if(this.imgurl)
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/goodsImageEdit",
        data: {
          goods_image_id: this.goods_image_id,
          title: this.name,
          category_id: this.class_id2,
          image_url: this.img,
          desc: this.desc
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.dialogFormVisible = false;
          this.goodsImageList(1);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //删除编辑图片
    dels() {
      this.imgurl = "";
      this.img = "";
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
    //取消 cancel
    cancel() {
      this.dialogFormVisible = false;
      this.dialogFormVisible2 = false;
      this.op = [];
      this.photo_info = "";
      this.name = "";
      this.photo_url = "";
      this.imgurl = "";
      this.img = "";
      // this.hideUpload = false;
      this.isset = false;
      this.titles = "";
      this.hideUpload = false;
    },
    //选择图片分类
    handleChange(value) {
      console.log(value);
      this.class_id = value[value.length - 1];
      this.class_id2 = value[value.length - 1];
    },
    //选择图片分类
    handleChange2(value) {
      console.log(value);
      this.class_name = value[value.length - 1];
      // this.class_id = value[value.length - 1];
      // this.class_id2 = value[value.length - 1];
    },
    //重置
    resetForm() {
      this.status = "";
      this.class_name = "";
      this.photo_name = "";
      this.shop_category = "请选择"
      this.op2 = [];
      // this.op = [''];
    },
    // 分页
    handleCurrentChange(val) {
      this.resetForm();
      console.log(`当前页: ${val}`);
      this.goodsImageList(val);
    },
    //返回
    backList() {
      this.$router.go(-1);
    },
    //删除的弹窗
    open3(id) {
      // console.log(id, type);
      this.$confirm("你确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.del(id);
      });
    },
    //删除
    del(id) {
      console.log(id);
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/goodsImageDelete",
        data: {
          goods_image_ids: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.goodsImageList(1);
        }
        if (res.data.status == 0) {
          this.$message.error(res.data.msg);
        }
        console.log(res);
      });
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
    //批量删除
    delALL() {
      if (this.nid) {
        this.del(this.nid);
      } else {
        this.$message.error("请勾选分类ID");
      }
    },
    open() {
      this.$confirm("您将删除所选的商品图库, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delALL();
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
    //启用和禁用
    operation(id, status) {
      if (status == 0) {
        this.Enable_Freeze(id, "/backend/Merchant/goodsImageEnable");
      }
      if (status == 1) {
        this.Enable_Freeze(id, "/backend/Merchant/goodsImageFreeze");
      }
    },
    Enable_Freeze(id, url) {
      this.$axios({
        method: "POST",
        url: url,
        data: {
          goods_image_id: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.goodsImageList(1);
        }
        if (res.data.status == 0) {
          this.$message.error(res.data.msg);
        }
      });
    },
    //限制图片大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024;
      if (isLt2M > 2) {
        // this.$message.error('上传头像图片大小不能超过 2MB!');
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    //删除图片出发的事件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.hideUpload = fileList.length >= this.limitCount;
    },

    //选择图片后触发的事件
    onChange(file, fileList) {
      getBase64(file.raw).then(res => {
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
      this.photo_url = file.url;
      this.hideUpload = fileList.length >= this.limitCount;
      console.log(file.size);
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
  .dialog {
    min-height: 570px;
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
      .el-input,
      .el-input__inner {
        width: 248px;
      }
      .el-form-item__content {
        display: flex;
      }
      .el-form-item__label {
        color: #333;
      }
      .el-textarea {
        width: 320px;
      }
      .el-textarea__inner {
        height: 100px;
        resize: none;
      }
      // 添加图片宽高
      .el-upload-list__item {
        width: 100px;
        height: 100px;
        border: 1px solid #dddbdb;
      }
      // 图片宽高
      .el-upload--picture-card {
        width: 100px;
        height: 100px;
        line-height: 101px;
      }
      .hide {
        height: 100px;
      }
      //超过限制数量添加类命
      .hide .el-upload {
        display: none;
      }
    }
    .del:hover i {
      display: block;
    }
    .del:hover .bg {
      display: block;
    }
    .del {
      position: relative;
      width: 100px;
      height: 100px;
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
      .imgs {
        width: 100px;
        height: 100px;
        border: 1px solid #dddbdb;
        border-radius: 5px;
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
#goodsphoto_management {
  margin-top: 35px;
  margin-bottom: 34px;
  width: 1245px;
  // min-height: 663px;
  overflow-y: auto;
  border: 1px solid rgba(204, 204, 204, 1);
  div .el_link:nth-last-child(1) {
    border-right: 0;
  }
  .el_link {
    // border-right: 1px solid;
    height: 16px;
    margin: 0 8px;
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
