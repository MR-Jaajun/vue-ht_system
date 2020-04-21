<!--
 * @Description: 经营品类管理
 * @LastEditors: Roc
 * @LastEditTime: 2019-11-25 19:27:00
 -->
<template>
  <!-- 经营品类管理 -->
  <div calss="cetegroy">
    <div class="search">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: './categroy' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>经营品类管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="addbtn">
        <el-button type="primary" icon="el-icon-plus" style="margin-right:15px;" @click="opendia">新增</el-button>
        <el-button plain icon="el-icon-delete" @click="open(nid)">删除</el-button>
      </div>
      <!-- 新增弹窗 -->
      <div class="dias" v-if="dialogFormVisible">
        <el-dialog
          title="新增&编辑"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          :visible.sync="dialogFormVisible"
          width="600px"
          custom-class="dialog"
          @close="cancel"
        >
          <el-form label-position="left" :label-width="formLabelWidth">
            <el-form-item label="分类名称：">
              <el-input v-model="class_name" autocomplete="off" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="请选择上级分类：">
              <el-select v-model="class_id" placeholder="请选择" clearable @change="changepid">
                <el-option
                  v-for="item in optionsssss"
                  :key="item.category_id"
                  :label="item.category_title"
                  :value="item.category_id"
                ></el-option>
              </el-select>
              <!-- <el-cascader
              v-model="op"
              :options="optionsssss"
              :props="{ checkStrictly : true,value:'category_id',label:'category_title'}"
              @change="handleChange"
              clearable
              ></el-cascader>-->
            </el-form-item>
            <el-form-item label="分类标签：">
              <el-select
                v-model="class_label"
                placeholder="请选择"
                clearable
                :disabled="is_ban"
                @change="chooseModule"
              >
                <el-option label="外卖" value="1"></el-option>
                <el-option label="商城" value="2"></el-option>
                <el-option label="团购" value="3"></el-option>
              </el-select>
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
            <el-form-item label="排序数字：">
              <el-input v-model="sort" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="小哥专送抽佣比例：">
              <el-input v-model="xiaoge_rate" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="商家自配送抽佣比例：">
              <el-input v-model="shop_onself_rate" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="商城抽佣比例：">
              <el-input v-model="shop_mall_rate" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="团购抽佣比例：">
              <el-input v-model="group_buy_rate" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="到店付抽佣比例：">
              <el-input v-model="to_shop_rate" autocomplete="off" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit" v-show="!isset">添 加</el-button>
            <el-button type="primary" @click="submit" v-show="isset">确 认</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="search2">
        <el-form :inline="true" class="demo-form-inline" ref="formInline">
          <el-form-item label="分类ID">
            <el-input v-model="cid" placeholder="请输入分类ID" clearable></el-input>
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="name" placeholder="请输入分类名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="status" placeholder="请选择状态" clearable>
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-right:15px;" @click="getsearch">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 经营品类管理 -->
    <div class="Category_management">
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
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
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" prop="id" label="分类ID" width="130"></el-table-column>
        <el-table-column align="center" prop="category_title" label="分类名称" width="150"></el-table-column>
        <el-table-column
          align="center"
          prop="shop_nums"
          label="商家数量"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" label="图片" width="80">
          <template slot-scope="{row}">
            <img :src="row.cover" style="width:50px;height:50px" alt="暂无图片" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="xiaoge_rate" label="小哥专送抽佣(%)" width="120"></el-table-column>
        <el-table-column align="center" prop="shop_onself_rate" label="商家配送抽佣(%)" width="130"></el-table-column>
        <el-table-column align="center" prop="shop_mall_rate" label="商家抽佣(%)" width="120"></el-table-column>
        <el-table-column align="center" prop="group_buy_rate" label="团购抽佣(%)" width="120"></el-table-column>
        <el-table-column align="center" prop="to_shop_rate" label="到店付(%)" width="120"></el-table-column>
        <el-table-column align="center" prop="status_value" label="状态" width="120"></el-table-column>
        <el-table-column align="center" prop="sort" label="排序" width="80"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-link type="danger" class="el_link" @click="open(row.id)">删除</el-link>
            <el-link type="primary" class="el_link" @click="opendia2(row,true,row.pid)">编辑</el-link>
            <el-link type="primary" class="el_link" @click="opendia">添加子分类</el-link>
            <el-link
              type="primary"
              class="el_link"
              v-show="row.status == 0"
              @click="open2(row.id,row.status,'您将启用')"
            >启用</el-link>
            <el-link
              type="danger"
              class="el_link"
              v-show="row.status == 1"
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
    <!-- 返回按钮 -->
    <!-- <div id="backlist" @click="backList">
      <el-button plain>返回活动主题列表</el-button>
    </div>-->
  </div>
</template>


<script>
import { getBase64, getsrc } from "../../utils/base64.js";
export default {
  data() {
    return {
      isset: false, //是否编辑
      //
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      imgurl: "",
      dialogImageUrl: "",
      photo_url: "",
      //
      listLoading: false,
      total: "",
      cid: "",
      name: "",
      status: "",
      rowIds: [],
      nid: "",
      //弹出框表单
      class_value: "",
      class_name: "", //分类名称
      sort: "", //商家数量
      op: [],
      img: "", //
      class_id: "", //分类ID
      class_id2: "", //分类ID2
      xiaoge_rate: "", //小哥抽佣
      shop_onself_rate: "", //商家配送抽佣
      shop_mall_rate: "", //商家抽佣
      group_buy_rate: "", //团队抽佣
      to_shop_rate: "",
      goods_image_id: "",
      //下拉数组
      optionProps: {
        value: "category_id",
        label: "category_title",
        children: "chlidren"
      },
      optionsssss: [],
      //列表数组
      tableData: [],
      //选中后的数据添加
      multipleSelection: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "180px",
      //分类标签
      class_label: "",
      class_label2: "",
      is_ban: false
    };
  },
  watch: {
    class_id2() {
      console.log(this.class_id2);
    }
  },

  created() {
    this.getmanageList(1);
  },
  methods: {
    //获取经营类目
    opendia(row) {
      this.hideUpload = false;
      this.isset = false;
      this.dialogFormVisible = true;
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/shopCategoryOne",
        params: {}
      }).then(res => {
        console.log(res.data.data);
        this.optionsssss = res.data.data;
        if (row) {
          this.optionsssss.map(item => {
            if (item.category_id == row.pid) {
              this.class_id = item.category_title;
              // console.log(item.category_title);
            }
          });
        }
      });
    },
    opendia2(row, bool, ids) {
      console.log(row);
      this.class_id2 = ids;
      this.opendia(row);
      this.dialogFormVisible = true;
      this.isset = bool;
      this.class_name = row.category_title;
      this.imgurl = row.cover;
      this.img = row.cover;
      this.category_id = row.id;
      //如果是二级分类,拿不到上一级的分类
      this.sort = row.sort;
      this.xiaoge_rate = row.xiaoge_rate;
      this.shop_onself_rate = row.shop_onself_rate;
      this.shop_mall_rate = row.shop_mall_rate;
      this.group_buy_rate = row.group_buy_rate;
      this.to_shop_rate = row.to_shop_rate;
      //商品模块
      if (row.shop_module == 1) {
        this.class_label = "外卖";
      } else if (row.shop_module == 2) {
        this.class_label = "商城";
      } else if (row.shop_module == 3) {
        this.class_label = "团购";
      } else {
        this.class_label = "请选择";
      }

      this.class_label2 = row.shop_module;
      // this.hideUpload = false;
      // this.op = this.optionsssss[0];
    },
    chooseModule(val) {
      this.class_label = val;
      this.class_label2 = val;
    },
    // 编辑
    addnew2() {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/shopCategoryEdit",
        data: {
          category_id: this.category_id,
          category_title: this.class_name,
          shop_module: this.class_label2,
          cover: this.img,
          pid: this.class_id2,
          sort: this.sort,
          xiaoge_rate: this.xiaoge_rate,
          shop_onself_rate: this.shop_onself_rate,
          shop_mall_rate: this.shop_mall_rate,
          group_buy_rate: this.group_buy_rate,
          to_shop_rate: this.to_shop_rate
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.dialogFormVisible = false;
          this.getmanageList(1);
          this.$message.success(res.data.msg);
        }
      });
    },
    getsearch() {
      this.getmanageList(1);
    },
    //获取列表
    getmanageList(page) {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/shopCategoryList",
        params: {
          id: this.cid,
          status: this.status,
          category_title: this.name,
          page: page,
          size: 10
        }
      }).then(res => {
        this.listLoading = false;
        this.total = res.data.data.total;
        this.tableData = res.data.data.data;
        // console.log(res.data.data.data[0].shop_nums)
        // console.log(res.data.data,'为啥没数量');
      });
    },
    //获取ID
    handleChange(value) {
      console.log(value);
      this.class_id = value[value.length - 1];
      this.class_id2 = value[value.length - 1];
      // this.class_value = value[value.length - 1];
    },
    //添加
    addnew() {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/shopCategoryAdd",
        data: {
          category_title: this.class_name,
          shop_module: this.class_label,
          cover: this.img,
          pid: this.class_id,
          sort: this.sort,
          xiaoge_rate: this.xiaoge_rate,
          shop_onself_rate: this.shop_onself_rate,
          shop_mall_rate: this.shop_mall_rate,
          group_buy_rate: this.group_buy_rate,
          to_shop_rate: this.to_shop_rate
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.dialogFormVisible = false;
          this.getmanageList(1);
          this.$message.success(res.data.msg);
          this.cancel();
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
    //取消 cancel
    cancel() {
      this.dialogFormVisible = false;
      this.op = [];
      this.class_name = "";
      this.sort = "";
      this.class_id = "";
      this.class_id2 = "";
      this.img = "";
      this.imgurl = "";
      this.xiaoge_rate = "";
      this.shop_onself_rate = "";
      this.shop_mall_rate = "";
      this.group_buy_rate = "";
      this.to_shop_rate = "";
      this.hideUpload = true;
      this.class_label = "";
      this.is_ban = false;
    },
    //重置
    resetForm() {
      this.status = "";
      this.cid = "";
      this.name = "";
    },
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
    },
    // 分页
    handleCurrentChange(val) {
      this.tableData = [];
      console.log(`当前页: ${val}`);
      this.getmanageList(val);
    },
    //返回
    backList() {
      this.$router.go(-1);
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
        url: "/backend/Merchant/shopCategoryDelete",
        data: {
          category_ids: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.getmanageList(1);
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
    //启用 /backend/Merchant/shopCategoryEnable status=0
    //禁用 /backend/Merchant/shopCategoryFreeze stauts=1
    operation(id, status) {
      if (status == 0) {
        this.Enable_Freeze(id, "/backend/Merchant/shopCategoryEnable");
      }
      if (status == 1) {
        this.Enable_Freeze(id, "/backend/Merchant/shopCategoryFreeze");
      }
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
          this.getmanageList(1);
        } else {
          this.$message.error(res.data.msg);
        }
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
    //changepid
    changepid(val) {
      console.log(val);
      if (val == 0) {
        this.is_ban = false;
        this.class_label = "";
      } else {
        this.is_ban = true;
      }
      if (!this.isset) {
        this.class_id = val;
      }
      if (this.isset) {
        this.class_id2 = val;
        // this.addnew2();
      }
    }
  }
};
</script>

<style lang="scss" scode>
html.body {
  font-family: Microsoft YaHei;
}
.search {
  width: 1624px;
  overflow: hidden;
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
      width: 64px;
      height: 64px;
      .imgs {
        width: 64px;
        height: 64px;
        border: 1px solid #dddbdb;
        border-radius: 5px;
      }
      .bg {
        width: 64px;
        height: 64px;
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
    // height: 450px;
    // .el-dialog__footer {
    //   margin-top: 90px;
    // }
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
      display: flex;
      padding: 30px 56px 5px 56px;
      .el-input {
        width: 200px;
      }
      .el-input__inner {
        width: 200px;
      }
      .el-form-item__label {
        color: #333;
      }
      .el-upload-list__item {
        width: 64px;
        height: 64px;
        border: 1px solid #dddbdb;
      }
      .el-form-item__content {
        display: flex;
        margin-left: 0 !important;
      }
      .el-form-item__label {
        font-size: 0.16rem;
      }
      // 图片宽高
      .el-upload--picture-card {
        width: 64px;
        height: 64px;
        line-height: 65px;
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
}

.addbtn {
  //   width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 80px;
}
.search2 {
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
.Category_management {
  margin-top: 35px;
  margin-bottom: 34px;
  width: 1630px;
  max-height: 780px;
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
