<!--
 * @Description: icon
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 17:09:06
 --> 
<template>
  <div class="icon-wapper">
    <section class="icon-section">系统管理/icon管理</section>
    <!-- 新增icon弹窗 -->
    <div class="dia" v-if="centerDialogVisible">
      <el-dialog
        :visible.sync="centerDialogVisible"
        width="574px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="cancel"
        :destroy-on-close="true"
      >
        <span class="dialog_span">
          模块类型
          <el-select style="margin-left:10px;" v-model="module2" clearable placeholder="请选择模块">
            <el-option
              v-for="item in moduleList2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
        <span class="dialog_span">
          icon名称
          <el-input class="icon_dialog_input" v-model="input1" placeholder="请输入内容"></el-input>
        </span>
        <span class="dialog_span">
          排序数值
          <el-input class="icon_dialog_input" v-model="input2" placeholder="请输入内容"></el-input>
        </span>
        <div class="discount_p">
          <el-upload
            v-show="imgurl? 0:1"
            action
            list-type="picture-card"
            :on-change="onChange"
            :class="{hide:hideUpload}"
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
            <i class="el-icon-delete" @click="del"></i>
          </div>
        </div>
        <span class="icon_ava_text2">上传一张icon图标，像素36*36px</span>
        <span class="dialog_span">
          跳转品类
          <!-- <el-input class="icon_dialog_input" v-model="input3" placeholder="请输入内容"></el-input> -->
          <el-cascader
            :placeholder="shop_category"
            :props="{value:'id',label:'category_title',children:'children'}"
            :options="manageList"
            v-model="c_title"
            @change="handleChange"
          ></el-cascader>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addicon(true)">取 消</el-button>
          <el-button type="primary" @click="submit">提 交</el-button>
        </span>
      </el-dialog>
    </div>
    <!--  -->
    <div class="icon-bth">
      <el-button type="primary" icon="el-icon-plus" @click="addicon(false)">新增</el-button>
      <el-button type icon="el-icon-circle-close" @click="open3(2,nid,'您是否禁用')">禁用</el-button>
      <el-button type icon="el-icon-circle-check" @click="open3(1,nid,'您是否启用')">启用</el-button>
    </div>
    <el-row class="admin-input">
      <div class="inputdiv">
        <span class="span">icon ID</span>
        <el-input v-model="iconID" class="input-control" placeholder="请输入内容"></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">icon名称</span>
        <el-input v-model="iconname" class="input-control" placeholder="请输入内容"></el-input>
      </div>
      <div class="inputdiv">
        <span class="span" style="margin-right:20px;">模块</span>
        <el-select v-model="module" clearable placeholder="请选择模块">
          <el-option
            v-for="item in moduleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </el-row>
    <el-row class="admin-input2">
      <div class="inputdiv">
        <span class="span" style="margin-right:15px">状态</span>
        <el-select v-model="actStatus" clearable placeholder="请选择状态">
          <el-option
            v-for="item in actStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="inputdiv" style="margin-left:60px;">
        <el-button type="primary" @click="getsearch">搜索</el-button>
        <el-button type @click="clear">重置</el-button>
      </div>
    </el-row>
    <section class="icon-table">
      <el-table
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :data="tableData"
        style="width:1150px"
        :header-cell-style="{background:'#ccc',color:'#333', font: '800', height:'63px' }"
      >
        <el-table-column type="selection" align="center" width="100"></el-table-column>
        <el-table-column prop="id" label="图标ID" width="150" align="center"></el-table-column>
        <el-table-column prop="title" label="icon名称" width="150" align="center"></el-table-column>
        <el-table-column prop="module_type" label="icon图标" width="150" align="center"></el-table-column>
        <el-table-column label="头像" width="100" align="center">
          <template slot-scope="{row}">
            <img :src="row.cover" width="40" height="40" class="head_pic" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序数值" width="200" align="center"></el-table-column>
        <el-table-column prop="status_value" align="center" label="状态" width="100"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="{row}">
            <div>
              <el-link type="primary" class="el_link" @click="geticonDetail(row.id)">查看</el-link>
              <el-link
                @click="open2(1,row.id,'您是否启用')"
                type="danger"
                class="el_link"
                style="margin:0 10px;"
                v-show="row.status_value=='禁用'"
              >启用</el-link>
              <el-link
                @click="open2(2,row.id,'您是否禁用')"
                type="danger"
                class="el_link"
                style="margin:0 10px;"
                v-show="row.status_value=='启用'"
              >禁用</el-link>
              <el-link type="danger" class="el_link" @click="open(row.id)">删除</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:30px;"
        background
        @current-change="handleCurrentChange"
        :page-sizes="[10, 15, 20]"
        :page-size="10"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total*1"
      ></el-pagination>
    </section>
  </div>
</template>



<script>
name: "icon";
import axios from "axios";
import { getBase64 } from "../../utils/base64.js";
export default {
  data() {
    return {
      imgurl: "",
      input1: "",
      input2: "",
      input3: "",
      centerDialogVisible: false,
      dialogVisible: false,
      dialogImageUrl: "",
      limitCount: 1,
      hideUpload: false,
      dialogTableVisible: false,
      iconnumer: "", //排序数值
      iconname: "", //icon名称
      iconID: "", //iconID
      actStatus: "", //状态
      actStatusList: [
        { label: "已禁用", value: 0 },
        { label: "已启用", value: 1 }
      ],
      module: "",
      moduleList: [
        { label: "外卖", value: 2 },
        { label: "商城", value: 3 },
        { label: "团购", value: 4 }
      ],
      module2: "",
      moduleList2: [
        { label: "首页", value: 1 },
        { label: "外卖", value: 2 },
        { label: "商城", value: 3 },
        { label: "团购", value: 4 }
      ],
      icon_id: "", //
      value: "",
      on: "1",
      img: "",
      rowIds: [],
      nid: "",
      tableData: [],
      total: "",
      loading: false,
      manageList: [],
      c_title: "",
      category_id2: "",
      shop_category: "请选择跳转的经营品类",
      category_id: ""
    };
  },
  watch: {
    // multipleSelection() {
    //   console.log(this.multipleSelection + "666");
    // }
  },
  created() {
    this.geticonList(1);
  },

  methods: {
    getmanageList(page) {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/shopCategoryList",
        params: {
          category_title: "",
          page: page,
          size: 500
        }
      }).then(res => {
        console.log(res.data.data);
        this.manageList = res.data.data.data;
      });
    },
    handleChange(value) {
      console.log(value);
      this.category_id2 = value[value.length - 1];
    },
    //批量选择
    handleSelectionChange(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
      });
      this.nid = this.rowIds.join(","); // 把数组转换成字符串
      console.log(this.nid);
      // return this.nid;
    },
    //重置
    clear() {
      this.iconID = "";
      this.actStatus = "";
      this.iconname = "";
      this.module = "";
    },
    cancel() {
      this.imgurl = "";
      this.img = "";
      this.input1 = "";
      this.input2 = "";
      this.input3 = "";
      this.module2 = "";
      this.c_title = "";
      this.shop_category = "请选择跳转的经营品类";
      this.category_id2 = "";
      this.manageList = [];
    },
    //页码操作
    handleCurrentChange(val) {
      // this.clear();
      console.log(val, "va2");
      this.geticonList(val);
    },
    //编辑提交
    submit() {
      this.$axios({
        method: "POST",
        url: "/backend/Operation/postIcon",
        data: {
          module_type: this.module2,
          title: this.input1,
          cover: this.img,
          sort: this.input2,
          // jump_type: this.module2,
          jump_id: this.category_id2,
          icon_id: this.icon_id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.addicon(false);
          this.hideUpload = true;
          this.geticonList(1);
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //查看详情
    geticonDetail(id) {
      this.addicon(false);
      this.icon_id = id;
      this.dialogImageUrl = "";
      // this.centerDialogVisible = true;
      this.$axios({
        method: "GET",
        url: "/backend/Operation/iconDetail",
        params: {
          icon_id: id
        }
      }).then(res => {
        console.log(res.data.data);
        this.img = res.data.data.cover;
        this.imgurl = res.data.data.cover;
        this.input1 = res.data.data.title;
        this.input2 = res.data.data.sort;
        this.module2 = res.data.data.module_type;
        this.category_id2 = res.data.data.jump_id;
        this.manageList.forEach(item => {
          if (item.id == res.data.data.jump_id) {
            this.shop_category = item.category_title;
          }
        });
        // this.input3 = res.data.data.jump_id;
      });
    },
    //搜索 存在bug
    getsearch() {
      this.geticonList(1);
      // this.$message.success("搜索存在bug");
    },
    //icon列表 /backend/Operation/iconList
    geticonList(page) {
      this.loading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Operation/iconList",
        params: {
          id: this.iconID,
          title: this.iconname,
          module_type: this.module,
          status: this.actStatus,
          page: page,
          size: 10
        }
      }).then(res => {
        this.loading = false;
        // console.log(res.data.data.data);
        this.total = res.data.data.total;
        this.tableData = res.data.data.data;
        console.log(res);
        // this.$message.success(res.data.msg);
      });
    },
    open(id) {
      this.$confirm("您将要删除此条数据,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delIcon(id);
      });
    },
    //删除图标
    delIcon(id) {
      // this.centerDialogVisible = true;
      this.$axios({
        method: "POST",
        url: "/backend/Operation/iconDel",
        data: {
          icon_id: id
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.geticonList(1);
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }

        // this.$message.success("删除成功");
      });
    },
    //禁用图标
    banIcon(id) {
      // this.centerDialogVisible = true;
      this.$axios({
        method: "POST",
        url: "backend/Operation/iconForbidden",
        data: {
          icon_ids: id
        }
      }).then(res => {
        console.log(res);
        this.geticonList(1);
        // this.$message.success("禁用成功");
      });
    },
    //批量禁用图标
    banAllIcon(id) {
      // this.centerDialogVisible = true;
      if (this.nid) {
        this.banIcon(id);
      } else {
        this.$message.error("请选择禁用的选项");
      }
    },
    //启用图标
    useIcon(id) {
      // this.centerDialogVisible = true;
      this.$axios({
        method: "POST",
        url: "/backend/Operation/iconUsing",
        data: {
          icon_ids: id
        }
      }).then(res => {
        console.log(res);
        this.geticonList(1);
        // this.$message.success("启用成功");
      });
    },
    //批量启用图标
    useAllIcon(id) {
      if (this.nid) {
        this.useIcon(this.nid);
      } else {
        this.$message.error("请选择启用的选项");
      }
    },
    open2(type, id, txt) {
      this.$confirm(txt + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (type == 1) {
          this.useIcon(id);
        } else {
          this.banIcon(id);
        }
      });
    },
    open3(type, id, txt) {
      this.$confirm(txt + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (type == 1) {
          this.useAllIcon(id);
        } else {
          this.banAllIcon(id);
        }
      });
    },
    //新增 每次弹窗先清空一次数据
    addicon(bool) {
      // this.hideUpload = true;
      this.centerDialogVisible = !bool;
      this.imgurl = "";
      this.input1 = "";
      this.input2 = "";
      this.module2 = "";
      this.dialogImageUrl = "";
      this.img = "";
      this.input3 = "";
      this.c_title = "";
      this.hideUpload = false;
      if (bool) {
        this.manageList = [];
        this.shop_category = "请选择跳转的经营品类";
      }
      this.getmanageList(1);
    },
    handleChange(value) {
      console.log(value);
      this.category_id2 = value[value.length - 1];
    },
    //删除编辑图片
    del() {
      this.imgurl = "";
      this.img = "";
    },
    // //限制图片大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024;
      if (isLt2M > 2) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 删除图片出发的事件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.dialogImageUrl = "";
      this.hideUpload = fileList.length >= this.limitCount;
      console.log(this.hideUpload);
    },
    //点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      console.log(file.url);
    },
    //选择图片后触发的事件
    onChange(file, fileList) {
      this.dialogImageUrl = file.url;
      this.hideUpload = fileList.length >= this.limitCount;
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
    }
    // console.log(file, "大小");
    // let that = this;
    // let width = 0;
    // let height = 0;
    // let _URL = window.URL || window.webkitURL;
    // let img = new Image();
    // img.onload = function() {
    //   if (img.width <= 100 && img.height <= 100) {
    //   } else {
    //     that.$message.error("上传头像图片宽高不能超过100px");
    //   }
    // };
    // img.src = file.url;
  }
};
</script>


<style lang="scss" scoped>
.icon-wapper {
  .icon-section {
    width: 183px;
    height: 24px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
  }
  .icon-bth {
    // position: absolute;
    // top: -30px;
    z-index: 100;
    display: flex;
    margin-top: 20px;
  }
  .admin-input {
    width: 1280px;
    display: flex;
    z-index: 90;
    .inputdiv {
      margin-right: 90px;
      margin: 20px 0 10px 0;
      // display: flex;
      // justify-content: flex-start;
      // align-items: center;
      .span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: rgba(22, 23, 55, 1);
        display: inline-block;
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
    width: 1280px;
    display: flex;

    .inputdiv {
      width: fit-content;
      margin-right: 90px;
      margin: 15px 0 30px 0;
      .span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: rgba(22, 23, 55, 1);
        display: inline-block;
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
.icon-table {
  position: relative;
}
.dialog_span {
  margin-top: 30px;
  display: block;
  .el-cascader {
    margin-left: 10px;
  }
  .icon_dialog_input {
    width: 215px;
    height: 34px;
    // border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 2px;
    margin-left: 10px;
  }
  // .dialog_span2 {
}

.icon_ava_text2 {
  position: relative;
  left: 60px;
  top: 10px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 19px;
  color: rgba(102, 102, 102, 1);
}
</style>
<style lang="scss">
.icon-wapper {
  .el-dialog__header {
    height: 2px;
    padding: 0;
  }
  .el-dialog__body {
    padding: 0 20px 30px 20px;
    color: #606266;
    font-size: 0.14rem;
    word-break: break-all;
    width: 400px;
    height: 180px;
    position: relative;
  }
  .avatar-uploader {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 20px 0 0 69px;
    .el-upload {
      // border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      top: 10px;
      left: 66px;
      width: 93px;
      height: 78px;
      line-height: 78px;
      text-align: center;
      .icon_ava_text {
        font-size: 10px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 17px;
        color: rgba(102, 102, 102, 1);
        display: block;
        position: absolute;
        top: 50px;
        left: 23px;
      }
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
}
</style>

<style lang="scss">
.icon-wapper {
  .dia .el-dialog {
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
    }
    height: 450px;
    .dialog_span {
      .el-input__inner {
        // width: 248px;
        &::placeholder {
          color: #666;
        }

        &::-webkit-input-placeholder {
          /* WebKit browsers 适配谷歌 */
          color: #666;
        }

        &:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 适配火狐 */
          color: #666;
        }

        &::-moz-placeholder {
          /* Mozilla Firefox 19+ 适配火狐 */
          color: #666;
        }

        &:-ms-input-placeholder {
          /* Internet Explorer 10+  适配ie*/
          color: #666;
        }
      }
    }
    .el-dialog__footer {
      margin-top: 90px;
    }
  }
  .discount_p {
    margin-top: 20px;
    margin-left: 69px;
    .imgs {
      width: 100px;
      height: 100px;
      border: 1px solid #dddbdb;
      border-radius: 5px;
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
    //超过限制数量添加类命
    .hide .el-upload {
      display: none;
    }
  }
}
</style>
