<!--
 * @Description: 商品库管理
 * @LastEditors: jun
 * @LastEditTime: 2019-10-11 10:13:21
 -->
import Vue from 'vue';

<template>
  <!--  商品库管理 -->
  <div id="stock">
    <div id="search">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: './categroy' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品库管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="addbtn">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-right:15px;"
          @click="toNewgoods"
        >新增</el-button>
        <el-button plain icon="el-icon-delete">批量删除</el-button>
      </div>
      <!-- 搜索 -->
      <div class="search">
        <el-form :inline="true" class="demo-form-inline" ref="formInline">
          <el-form-item label="商品ID">
            <el-input v-model="goods_id" placeholder="请输入分类ID" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- <el-input v-model="formInline.name" placeholder="请输入分类名称"></el-input> -->
            <el-select v-model="goods_category_id" placeholder="请选择" clearable>
              <el-option v-for="item in option" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="status" placeholder="请选择状态" clearable>
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="goods_title" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-right:15px;" @click="getsearch">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 商品库管理 -->
    <div id="stock_management">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width:100%;"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800', height:'63px' }"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" prop="id" label="商品ID" width="150"></el-table-column>
        <el-table-column align="center" prop="goods_title" label="商品名称" width="150"></el-table-column>
        <el-table-column align="center" prop="goods_category_id" label="商品分类" width="200"></el-table-column>
        <el-table-column align="center" prop="cover_image" label="商品图片" width="150">
          <template slot-scope="{row}">
            <img :src="row.cover" style="background:#ccc;width:50px;height:50px;" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="characteristic" label="商品简介" width="180"></el-table-column>
        <el-table-column align="center" prop="stock_amount" label="库存" width="100"></el-table-column>
        <el-table-column align="center" prop="status" label="状态" width="100"></el-table-column>
        <el-table-column align="center" prop="operation" label="操作" width="350">
          <template slot-scope="{row}">
            <el-link type="danger" class="el_link" @click="open(row.id,'此操作将删除该商品',0)">删除</el-link>
            <el-link type="primary" class="el_link">编辑</el-link>
            <el-link
              type="danger"
              v-show="row.status=='启用'"
              class="el_link"
              @click="open(row.id,'此操作将禁用该商品',2)"
            >禁用</el-link>
            <el-link
              type="primary"
              v-show="row.status=='禁用'"
              class="el_link"
              @click="open(row.id,'此操作将启用该商品',1)"
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 15, 20]"
          :page-size="10"
          layout="total,sizes,prev,pager,next,jumper"
          :total="total*1"
        ></el-pagination>
    </div>
  </div>
</template>


<script>
// import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      total: "",
      sizes:10,
      imageUrl: "",
      // dialogImageUrl: "", //图片路径
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      ////***////
      goods_id: "",
      goods_category_id: "",
      goods_title: "",
      status: "",

      //搜索下拉
      option: [],

      //列表
      tableData: [],
      //选中后的数据添加
      multipleSelection: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "100px",
      rowIds: [],
      nid: ""
    };
  },
  created() {
    this.getStoreGoodses(1);
    this.storeGoodsCategory();
  },
  methods: {
    getsearch() {
      this.getStoreGoodses(1);
    },

    //获取商品库分类 /backend/Merchant/storeGoodsCategory
    storeGoodsCategory() {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/storeGoodsCategory"
      }).then(res => {
        console.log(res);
        this.option = res.data.data;
      });
    },
    //商品库列表   /backend/Merchant/getStoreGoodses
    getStoreGoodses(page) {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/getStoreGoodses",
        params: {
          goods_id: this.goods_id,
          goods_category_id: this.goods_category_id,
          goods_title: this.goods_title,
          status: this.status,
          page: page,
          size: this.sizes
        }
      }).then(res => {
        console.log(res);
        this.total = res.data.data.total;
        this.tableData = res.data.data.data;
      });
    },
    //跳转到新增或者编辑页面
    toNewgoods() {
      this.$router.push({ path: "./addgoods" });
    },
    //重置
    resetForm() {
      this.goods_id = "";
      this.goods_category_id = "";
      this.status = "";
      this.goods_title = "";
    },

    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getStoreGoodses(val);
    },
    handleSizeChange(val) {
      this.sizes = val;
      console.log(`每页 ${val} 条`);
      this.getStoreGoodses(1);
    },
    //返回
    backList() {
      this.$router.go(-1);
    },

    //启用 /backend/Merchant/storeGoodsUsing goods_id
    storeGoodsUsing(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/storeGoodsUsing",
        data: {
          goods_id: id
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.getStoreGoodses(1);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //禁用 /backend/Merchant/storeGoodsForbidden  goods_id
    storeGoodsForbidden(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/storeGoodsForbidden",
        data: {
          goods_id: id
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.getStoreGoodses(1);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    open(id, txt, fun) {
      if (id) {
        this.$confirm(txt + ",是否继续", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          //删除
          if (fun == 0) {
            this.storeGoodsDel(id);
          }
          //启用
          if (fun == 1) {
            this.storeGoodsUsing(id);
          }
          //禁用
          if (fun == 2) {
            this.storeGoodsForbidden(id);
          }
        });
      } else {
        this.$message.error("请选择您将要" + txt + "的商品");
      }
    },
    //删除 /backend/Merchant/storeGoodsDel goods_ids
    storeGoodsDel(id) {
      console.log(id);
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/storeGoodsDel",
        data: {
          goods_ids: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.getStoreGoodses(1);
        } else {
          this.$message.error(res.data.msg);
        }
      });
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
    //批量删除
    delAll() {
      if (this.nid) {
        this.storeGoodsDel(this.nid);
      } else {
        this.$message.error("请选择您所删除的商品ID");
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
  width: 1400px;
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
    flex-wrap: wrap;
    width: 1400px;
  }
  .el-form-item {
    display: flex;
    align-items: center;
    margin-right: 90px;
  }
  .el-form-item:nth-child(3) .el-form-item__label {
    width: 52px;
  }
  .el-form-item__label {
    width: 80px;
    text-align: left;
  }
}

//列表
#stock_management {
  margin-top: 35px;
  margin-bottom: 34px;
  width: 1432px;
  max-height: 663px;
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
