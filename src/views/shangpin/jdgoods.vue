<template>
  <div class="jdgoods">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>京东商品池</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>京东商品池</h1>
    <div class="tab">
      <div class="tabitem">
        <p
          @click="changeList(item.status,index)"
          :class="isactive==index? 'active': ''"
          v-for="(item,index) in session"
          :key="index"
        >{{item.name}}({{item.amount}})</p>
      </div>
      <!-- <div class="update">
        <el-button type="danger" size="medium" :disabled="disable" @click="updateData">数据刷新</el-button>
      </div>-->
    </div>
    <!-- 搜索 -->
    <div class="search2">
      <el-form :inline="true" class="demo-form-inline" ref="formInline">
        <el-form-item label="商品名称">
          <el-input v-model="shopname" placeholder="请输入店铺名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="goodsCategorye" placeholder="请选择" clearable>
            <el-option
              v-for="item in poolList"
              :key="item.page_num"
              :label="item.name"
              :value="item.page_num"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣数">
          <el-select v-model="discountValue" placeholder="请选择" clearable>
            <el-option
              v-for="item in discountList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin-right:15px;" @click="getsearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="photo_management">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: fit-content;"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800', height:'63px' }"
      >
        <el-table-column type="selection" align="center" width="40"></el-table-column>
        <el-table-column align="center" prop="sku" label="商品sku ID" width="120"></el-table-column>
        <el-table-column align="center" prop="title" label="商品信息" width="480">
          <template slot-scope="{row}">
            <div class="goodsinfo">
              <img :src="row.image_path" />
              <span>{{row.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_pool_name" label="商品分类" width="160"></el-table-column>
        <el-table-column align="center" prop="jd_price" label="京东价（¥）" width="120"></el-table-column>
        <el-table-column align="center" prop="rebate" label="折扣数" width="100"></el-table-column>
        <el-table-column align="center" prop="price" label="协议价（¥）" width="120"></el-table-column>
        <el-table-column align="center" prop="goods_inner_status" label="商品状态" width="120">
          <template slot-scope="{row}">
            <span v-show="row.state==0" style="color:red">未上架</span>
            <span v-show="row.state==1">已上架</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="operation" label="操作" width="180">
          <template slot-scope="{row}">
            <el-link type="primary" class="el_link" @click="todetail(row)">查看</el-link>
            <el-link
              type="primary"
              class="el_link"
              @click="open(row)"
              v-show="row.goods_inner_status==-1&&row.state==1"
            >添加至平台</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="addbtn">
      <el-button type="primary" icon="el-icon-plus" style="margin-right:15px;" @click="putaway">批量上架</el-button>
    </div>
    <div class="block" style="height:30px;width:700px;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total,sizes,prev,pager,next,jumper"
        :page-sizes="[10, 20, 30]"
        :page-size="size"
        :total="total*1"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  data() {
    return {
      type: 1,
      isactive: 0,
      page: 1,
      size: 10,
      goodsCategorye: "", //商品分类
      shopname: "",
      session: [],
      poolList: [], //商品分类
      total: "",
      listLoading: false,
      tableData: [{ id: "6" }],
      rowIds: [], //批量选择
      nid: "", //批量选择ID
      //折扣数
      discountValue: "",
      discountList: [
        { lable: "0-1", value: "0-1" },
        { lable: "1-2", value: "1-2" },
        { lable: "2-3", value: "2-3" },
        { lable: "3-4", value: "3-4" },
        { lable: "4-5", value: "4-5" },
        { lable: "5-6", value: "5-6" },
        { lable: "6-7", value: "6-7" },
        { lable: "7-8", value: "7-8" },
        { lable: "8-9", value: "8-9" },
        { lable: "9-10", value: "9-10" }
      ],
      disable: false
    };
  },
  created() {
    this.categorye();
    this.poolAmount();
    this.goodsList(1);
    // this.disable = Cookies.get("timeout") || false;
  },
  // watch: {
  //   goodsCategorye() {
  //     console.log(this.goodsCategorye);
  //   }
  // },
  methods: {
    changeList(type, num) {
      this.isactive = num;
      if (type != this.type) {
        this.type = type;
        this.goodsList(1);
      }
    },
    resetForm() {
      this.shopname = "";
      this.goodsCategorye = "";
      this.discountValue = "";
    },
    getsearch() {
      // console.log("搜索");
      this.goodsList(1);
    },
    //京东商品数量 /backend/JdGoods/poolAmount
    poolAmount() {
      this.$axios({
        method: "GET",
        url: "/backend/JdGoods/poolAmount",
        params: {}
      }).then(res => {
        if (res.data.status == 1) {
          this.session = res.data.data;
          // console.log(res.data.data,'商品数量');
        }
      });
    },
    //京东商品分类 /backend/JdGoods/poolList
    categorye() {
      this.$axios({
        method: "GET",
        url: "/backend/JdGoods/poolList",
        params: {}
      }).then(res => {
        if (res.data.status == 1) {
          this.poolList = res.data.data;
        }
      });
    },
    //京东商品列表 /backend/JdGoods/goodsList
    goodsList(page) {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/JdGoods/goodsList",
        params: {
          name: this.shopname,
          pool_page_num: this.goodsCategorye ? this.goodsCategorye : "0",
          goods_status: this.type,
          goods_rebate: this.discountValue,
          page: page,
          size: this.size
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.listLoading = false;
          // console.log(res.data, "商品列表");
          this.tableData = res.data.data.data;
          this.total = res.data.data.total;
        }
      });
    },
    //京东商品上架 /backend/JdGoods/goodsAdd
    goodsAdd(id, idx, num) {
      // console.log(row);
      this.$axios({
        method: "POST",
        url: "/backend/JdGoods/goodsAdd",
        data: {
          sku: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.goodsList(this.page);
          if (idx == num) {
            this.$message.success(res.data.msg);
          }
          this.rowIds = [];
        } else {
          if (idx == num) {
            this.$message.error(res.data.msg);
          }
        }
      });
    },
    //打开弹窗 单个上架
    open(row) {
      this.$confirm("您是否上架该商品？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.goodsAdd(row.sku, 0, 0);
      });
    },
    //批量上架
    putaway() {
      this.$confirm("您是否上架该商品？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.rowIds.length > 0) {
          let a = 0;
          this.rowIds.forEach(item => {
            a++;
            this.goodsAdd(item, this.rowIds.length, a);
          });
        } else {
          this.$message.success("必须选择商品");
        }
        // this.goodsAdd(row);
      });
    },
    //京东数据更新 /backend/JdGoods/goodsPriceUpdate
    // goodsPriceUpdate() {
    //   this.$axios({
    //     method: "POST",
    //     url: "/backend/JdGoods/goodsPriceUpdate",
    //     data: {}
    //   }).then(res => {
    //     if (res.data.status == 1) {
    //       this.$message.success(res.data.msg);
    //       this.poolAmount();
    //       this.categorye();
    //       this.goodsList();
    //     } else {
    //       this.$message.error(res.data.msg);
    //     }
    //   });
    // },
    // 分页
    handleCurrentChange(val) {
      this.page = val;
      this.goodsList(val);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val;
      this.goodsList(1);
    },
    handleSelectionChange(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.sku);
        // this.nid = this.rowIds.join(","); // 把数组转换成字符串
      });
      // console.log(this.rowIds);
      // return this.nid;
    },
    //京东商品详情
    todetail(row) {
      this.$router.push({
        path: "./jdgoodDetail",
        query: { id: row.sku }
      });
    },
    //京东数据刷新
    updateData() {
      this.disable = true;
      var millisecond = new Date().getTime();
      var expiresTime = new Date(millisecond + 60 * 1000 * 60 * 2);
      Cookies.set("timeout", "true", { expires: expiresTime });
      this.goodsPriceUpdate();
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
.tab {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 40px;
  margin-top: 20px;
  .update {
    display: flex;
    margin-left: 300px;
  }
  .tabitem {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: fit-content;
    height: 40px;
    p {
      width: 120px;
      height: 34px;
      border: 1px solid rgba(153, 153, 153, 1);
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      line-height: 34px;
      color: rgba(102, 102, 102, 1);
      letter-spacing: 1px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 20px;
      &:hover {
        background: #4371e8;
        color: rgba(255, 255, 255, 1);
        border: none;
      }
    }
    .active {
      background: #4371e8;
      color: rgba(255, 255, 255, 1);
      border: none;
    }
  }
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
    margin-right: 60px;
  }
}
.photo_management {
  margin-top: 35px;
  margin-bottom: 10px;
  width: fit-content;
  max-height: 715px;
  // max-height: 663px;
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
  .goodsinfo {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
      border-radius: 3px;
      margin-right: 15px;
    }
    span {
      font-size: 13px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      text-align: left;
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
</style>
