<!--
 * @Description: 商品管理
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-14 11:34:52
 -->
<template>
  <!-- 商品管理 原菜品管理 -->
  <div id="label">
    <div id="search">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: './categroy' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="addbtn">
        <el-button plain icon="el-icon-circle-close" @click="systemALL">违规下架</el-button>
      </div>
      <!-- 搜索 -->
      <div class="search">
        <el-form :inline="true" class="demo-form-inline" ref="formInline">
          <el-form-item label="店铺名称">
            <el-input v-model="shop_title" placeholder="请输入店铺名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="goods_title" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="模块">
            <el-select v-model="type" placeholder="请输入商品类型" clearable @change="changes">
              <el-option label="外卖" value="1"></el-option>
              <el-option label="商城" value="2"></el-option>
              <el-option label="团购" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品状态">
            <el-select v-model="status" placeholder="请选择状态" clearable>
              <el-option label="已上架" value="1"></el-option>
              <el-option label="已下架" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经营品类">
            <el-cascader
              :placeholder="shop_category"
              :props="{value:'id',label:'category_title',children:'children'}"
              :options="manageList"
              v-model="c_title"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-right:15px;" @click="getsearch">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 商品管理 -->
    <div id="goods_management">
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width:100%;"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800', height:'63px' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" prop="id" label="商品ID" width="80"></el-table-column>
        <el-table-column align="center" prop="goods_title" label="商品名称" width="150"></el-table-column>
        <el-table-column align="center" prop="shop_title" label="店铺名称" width="200"></el-table-column>
        <el-table-column align="center" prop="category_value" label="经营品类" width="200"></el-table-column>
        <el-table-column align="center" prop="sale_price" label="价格(￥)" width="120"></el-table-column>
        <el-table-column align="center" prop="stock_amount" label="库存" width="180"></el-table-column>
        <el-table-column align="center" prop="internal_sale_amount" label="月销量" width="120">
          <template slot-scope="{row}">
            <el-input
              v-model="row.internal_sale_amount"
              maxlength="8"
              @blur="setSales(row.id,row.internal_sale_amount)"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="system_off" label="状态" width="120">
          <template slot-scope="{row}">
            <span v-show="row.system_off==0">已上架</span>
            <span v-show="row.system_off==1" style="color:red">已下架</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operation" label="操作" width="300">
          <template slot-scope="{row}">
            <el-link type="primary" class="el_link" @click="todetail(row.id,row.module_type)">查看</el-link>
            <el-link
              type="danger"
              v-show="row.status_value == '已下架'"
              @click="open2(row.id,row.module_type)"
              class="el_link"
            >删除</el-link>
            <el-link
              type="danger"
              @click="open(row.id,row.module_type)"
              class="el_link"
              v-show="row.status_value != '已下架'"
            >违规下架</el-link>
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
import { type } from "os";
export default {
  data() {
    return {
      listLoading: false,
      total: "",
      sizes: 10,
      shop_title: "",
      goods_title: "",
      status: "",
      type: "外卖",
      types: 1, //商品类型
      tableData: [],
      rowIds: [],
      nid: "",
      system_off_desc: "",
      module_type: "", //商品模块(批量下架用)
      shop_category: "请选择",
      manageList: [],
      c_title: ""
    };
  },
  created() {
    this.getmanageList(1);
    //获取经营品类
    this.getManageList(1);
  },
  methods: {
    //获取经营品类
    getManageList(page) {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/shopCategoryList",
        params: {
          category_title: "",
          page: page,
          size: 500
        }
      }).then(res => {
        console.log(res.data.data, "ssssss");
        let obj = { id: "0", category_title: "全部" };
        res.data.data.data.unshift(obj);
        this.manageList = res.data.data.data;
      });
    },
    handleChange(value) {
      console.log(value);
      if (value[value.length - 1] == 0) {
        this.category_id2 = "";
      } else {
        this.category_id2 = value[value.length - 1];
      }
    },
    changes(val) {
      console.log(val);
      this.types = val;
    },
    //下架的弹窗
    open(id, type) {
      console.log(id, type);
      this.$prompt("请输入违规内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        console.log(value);
        this.system_off_desc = value;
        if (value.trim()) {
          this.systemOff(id, type, value);
        } else {
          this.$message.error("请输入违规内容");
        }
      });
    },
    //删除的弹窗
    open2(id, type) {
      // console.log(id, type);
      this.$confirm("你确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.del(id, type);
      });
    },
    getsearch() {
      this.tableData = [];
      this.getmanageList(1);
    },
    //获取列表
    getmanageList(page) {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/storeGoodsList",
        params: {
          shop_title: this.shop_title,
          goods_title: this.goods_title,
          status: this.status,
          module_type: this.types,
          page: page,
          size: this.sizes,
          category_id: this.category_id2
        }
      }).then(res => {
        this.listLoading = false;
        this.total = res.data.data.total;
        this.tableData = res.data.data.data;
        // console.log(res.data.data);
      });
    },
    setSales(id, num) {
      //设置商品内部销量  /backend/Merchant/storeGoodsSaleSet
      if (num >= 0) {
        this.$axios({
          method: "POST",
          url: "/backend/Merchant/storeGoodsSaleSet",
          data: {
            goods_id: id,
            goods_num: num
          }
        }).then(res => {
          if (res.data.status == 1) {
            this.getmanageList(1);
            // this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
            this.getmanageList(1);
          }
        });
      } else {
        this.$message.error("设置数量格式错误");
        this.getmanageList(1);
      }
    },
    //跳转到详情
    todetail(id, type) {
      let arr = { gid: id, gtype: type };
      sessionStorage.setItem("ginfo", JSON.stringify(arr));
      this.$router.push({
        path: "./labelDetail",
        query: { goods_id: id, module_type: type }
      });
    },
    //重置
    resetForm() {
      this.status = "";
      this.shop_title = "";
      this.goods_title = "";
      this.type = "";
      this.category_id2 = "";
      this.shop_category = "请选择";
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val);
    },
    // 分页
    handleCurrentChange(val) {
      // this.resetForm();
      console.log(`当前页: ${val}`);
      this.getmanageList(val);
    },
    handleSizeChange(val) {
      this.sizes = val;
      console.log(`每页 ${val} 条`);
      this.getmanageList(1);
    },
    //批量选择
    handleSelectionChange(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
        this.module_type = item.module_type;
      });
      this.nid = this.rowIds.join(","); // 把数组转换成字符串
      // console.log(this.nid);
      console.log(this.module_type);
    },
    // 删除 /backend/Merchant/goodsDel
    del(id, tpye) {
      console.log(id);
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/goodsDel",
        data: {
          goods_id: id,
          module_type: type
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
    //下架
    systemOff(id, tpye, systemoff) {
      console.log(id);
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/systemOff",
        data: {
          goods_ids: id,
          module_type: type,
          system_off_desc: systemoff
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
    // 批量下架
    systemALL() {
      if (this.nid) {
        this.open(this.nid, this.module_type);
      } else {
        this.$message.error("请勾选分类ID");
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
  width: 1300px;
  .el-form {
    // width: 800px;
    justify-content: flex-start;
    display: flex;
    flex-wrap: wrap;
  }
  .el-form-item {
    display: flex;
    align-items: center;
    margin-right: 90px;
  }
}
//列表
#goods_management {
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