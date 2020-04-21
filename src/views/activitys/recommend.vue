<!--
 * @Description: 推荐专区
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-23 15:46:12
 -->

<template>
  <div class="commercial-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>推荐专区</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="commercial-bth">
      <el-button type="primary" icon="el-icon-plus" @click="opendialog">新增</el-button>
      <el-button type icon="el-icon-delete" @click="open(nid)">删除</el-button>
    </div>
    <!-- 新增的弹窗表格 -->
    <div class="dia">
      <el-dialog
        @close="clear"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        title="添加商品"
        :visible.sync="dialogTableVisible"
      >
        <div class="search">
          <el-form class="demo-form-inline">
            <el-form-item label="商品名称">
              <el-input v-model="goods_name2" clearable placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item label="店铺名称">
              <el-input v-model="shop_name2" clearable placeholder="店铺名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchGoods(1)">搜索</el-button>
              <el-button style="margin-left:10px;" @click="resetForm2">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          v-loading="listLoading2"
          :data="gridData"
          @selection-change="handleSelectionChange2"
          :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px',fontSize:'14px' }"
        >
          <el-table-column type="selection" align="center" width="50"></el-table-column>
          <el-table-column align="center" property="goods_title" label="商品名称" width="150"></el-table-column>
          <el-table-column align="center" property="goods_category_title" label="商品分类" width="200"></el-table-column>
          <el-table-column align="center" property="shop_title" label="所属店铺" width="150"></el-table-column>
          <el-table-column align="center" property="goods_cover_image" label="商品图片" width="80">
            <template slot-scope="{row}">
              <img :src="row.goods_cover_image" style="width:53px;height:53px;" />
            </template>
          </el-table-column>
          <el-table-column align="center" property="goods_sale_price" label="原价" width="80"></el-table-column>
          <el-table-column align="center" property="goods_market_price" label="活动价" width="80"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="{row}">
              <el-link type="primary" @click="recommendGoodsAdd(row.goods_id)">添加</el-link>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-top:20px;"
          @click="addAll(nid2)"
        >添加商品</el-button>
        <!-- 分页 -->
        <div class="block" style="height:30px;width:700px;margin-top:30px;">
          <el-pagination
            background
            @current-change="handleCurrentChange2"
            layout="total,prev,pager,next,jumper"
            :total="total2*1"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
    <div class="search">
      <el-form class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="goods_name" clearable placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="选择地区">
          <el-select
            clearable
            v-model="sheng"
            @change="choseProvince"
            placeholder="省级地区"
            no-data-text="请选择代理商类型"
          >
            <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
          <el-select
            style="margin:0 10px"
            v-model="shi"
            @change="choseCity"
            placeholder="市级地区"
            no-data-text="请选择省份"
            clearable
          >
            <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
          <el-select
            clearable
            no-data-text="请选择城市"
            v-model="qu"
            @change="choseBlock"
            placeholder="区级地区"
          >
            <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺名称">
          <el-input v-model="shop_name" clearable placeholder="请输入用户手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getsearch(1)">搜索</el-button>
          <el-button style="margin-left:10px;" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <section class="vip-table">
      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column prop="goods_title" label="商品名称" align="center" width="100"></el-table-column>
        <el-table-column prop="goods_category_title" label="商品分类" align="center" width="150"></el-table-column>
        <el-table-column prop="shop_title" label="店铺名称" align="center" width="100"></el-table-column>
        <el-table-column prop="shop_location" label="所属地区" align="center" width="300"></el-table-column>
        <el-table-column prop="goods_cover_image" label="商品图片" align="center" width="100">
          <template slot-scope="{row}">
            <img :src="row.goods_cover_image" alt="商品图片" style="width:53px;height:53px;" />
          </template>
        </el-table-column>
        <el-table-column prop="goods_market_price" label="原价" align="center" width="80"></el-table-column>
        <el-table-column prop="goods_sale_price" label="活动价" width="80" align="center"></el-table-column>
        <el-table-column prop="sort" align="center" label="排序" width="100">
          <template slot-scope="{row}">
            <el-input v-model="row.sort" @blur="recommendGoodsSort(row.recommend_id,row.sort)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="{row}">
            <el-link type="danger" @click="open(row.recommend_id)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style="height:30px;width:700px;margin-top:40px;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total,prev,pager,next,jumper"
          :total="total*1"
        ></el-pagination>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      listLoading: false,
      goods_name: "", //商品名称
      shop_name: "", //店铺名称
      tableData: [],
      total: "", //总数据
      rowIds: [], //批量选择
      nid: "", //批量选择ID
      sort_num: "",
      /****** 加载地点数据********/
      mapJson: "./json/map.json",
      province: [],
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",
      block: "",

      //弹窗表格
      dialogTableVisible: false,
      listLoading2: false,
      total2: "",
      gridData: [],
      goods_name2: "",
      shop_name2: "",
      rowIds2: [], //批量选择
      nid2: "" //批量选择ID
    };
  },
  created() {
    this.gettable(1);
    this.getCityData();
  },
  methods: {
    opendialog() {
      this.dialogTableVisible = true;
      this.searchGoods(1);
    },
    //关闭弹窗
    clear() {
      console.log("454545");
      this.rowIds2 = [];
      this.shop_name2 = "";
      this.goods_name2 = "";
    },
    //获取商品列表 /backend/Promotion/searchGoods
    searchGoods(page) {
      this.listLoading2 = true;
      this.$axios({
        method: "GET",
        url: "/backend/Promotion/searchGoods",
        params: {
          search_goods_title: this.goods_name2,
          search_shop_title: this.shop_name2,
          page: page,
          size: 8
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.listLoading2 = false;
          console.log(res.data.data, "1");
          this.total2 = res.data.data.total;
          this.gridData = res.data.data.data;
        } else {
          alert(res.data.msg);
        }
      });
    },
    //添加商品 /backend/Promotion/recommendGoodsAdd
    recommendGoodsAdd(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Promotion/recommendGoodsAdd",
        data: {
          goods_ids: id
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.gettable(1);
          this.searchGoods(1);
          this.$message.success(res.data.msg);
          this.rowIds2 = [];
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //批量添加
    addAll(ids) {
      if (this.nid2) {
        this.recommendGoodsAdd(ids);
      } else {
        this.$message.error("请选择您所需添加的商品");
      }
    },
    //列表
    gettable(page) {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Promotion/recommendGoodsList",
        params: {
          search_goods_title: this.goods_name,
          //   search_shop_location: this.address,
          search_shop_title: this.shop_name,
          page: page,
          size: 10
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.listLoading = false;
          console.log(res.data.data, "1");
          this.total = res.data.data.total;
          this.tableData = res.data.data.data;
        } else {
          alert(res.data.msg);
        }
      });
    },
    //重置
    resetForm() {
      this.goods_name = "";
      this.shop_name = "";
      this.sheng = "";
      this.shi = "";
      this.qu = "";
    },
    resetForm2() {
      this.goods_name2 = "";
      this.shop_name2 = "";
    },
    //搜索
    getsearch() {
      this.gettable(1);
    },
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.gettable(val);
    },
    //分页
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`);
      this.searchGoods(val);
    },
    //批量选择
    handleSelectionChange(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.recommend_id);
      });
      this.nid = this.rowIds.join(","); // 把数组转换成字符串
      // return this.nid;
    },
    //批量选择
    handleSelectionChange2(val) {
      this.rowIds2 = [];
      val.forEach(item => {
        this.rowIds2.push(item.goods_id);
      });
      this.nid2 = this.rowIds2.join(","); // 把数组转换成字符串
      // return this.nid;
      console.log(this.nid2);
    },
    //排序 /backend/Promotion/recommendGoodsSort
    recommendGoodsSort(id, num) {
      this.$axios({
        method: "POST",
        url: "/backend/Promotion/recommendGoodsSort",
        data: {
          recommend_id: id,
          sort: num
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.gettable(1);
        } else {
          this.$message.error(res.data.msg);
          this.gettable(1);
        }
      });
    },

    //弹窗
    open(id) {
      if (id) {
        this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.del(id);
        });
      } else {
        this.$message.error("请选择您将要删除的商品");
      }
    },
    //删除 /backend/Promotion/recommendGoodsDelete
    del(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Promotion/recommendGoodsDelete",
        data: {
          recommend_ids: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.gettable(1);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    /**********************加载地点数据*******************************************/
    // 加载china地点数据，三级
    getCityData() {
      var that = this;
      axios
        .get(this.mapJson)
        .then(function(response) {
          if (response.status == 200) {
            var data = response.data;
            that.province = [];
            that.city = [];
            that.block = [];
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {
                //省
                that.province.push({
                  id: item,
                  value: data[item],
                  children: []
                });
              } else if (item.match(/00$/)) {
                //市
                that.city.push({ id: item, value: data[item], children: [] });
              } else {
                //区
                that.block.push({ id: item, value: data[item] });
              }
            }
            // 分类市级
            for (var index in that.province) {
              for (var index1 in that.city) {
                if (
                  that.province[index].id.slice(0, 2) ===
                  that.city[index1].id.slice(0, 2)
                ) {
                  that.province[index].children.push(that.city[index1]);
                }
              }
            }
            // 分类区级
            for (var item1 in that.city) {
              for (var item2 in that.block) {
                if (
                  that.block[item2].id.slice(0, 4) ===
                  that.city[item1].id.slice(0, 4)
                ) {
                  that.city[item1].children.push(that.block[item2]);
                }
              }
            }
          } else {
            console.log(response.status);
          }
        })
        .catch(function(error) {
          console.log(typeof +error);
        });
    },
    // 选省
    choseProvince(e) {
      this.shi = "";
      this.qu = "";
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shi1 = this.province[index2].children;
          this.shi = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.qu = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
          this.sheng = this.province[index2].value + "-";
          console.log("选省", this.sheng);
          // console.log("选省", this.E);
        }
      }
    },
    // 选市
    choseCity(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shi = this.city[index3].value + "-";
          console.log("选市", this.shi);
          // console.log("选市", this.E);
        }
      }
    },
    // 选区
    choseBlock(e) {
      this.E = e;
      for (var i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.qu = this.qu1[i].value;
          console.log("选区", this.qu, this.sheng + this.shi + this.qu);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.commercial-wapper {
  h1 {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
  }
  .commercial-bth {
    display: flex;
    margin: 30px 0;
  }

  .admin-input {
    height: 60px;
    display: flex;
    .inputdiv {
      margin-right: 90px;
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
    height: 60px;
    display: flex;
    .inputdiv {
      margin-right: 90px;
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
  .vip-table {
    position: relative;
    top: 60px;
  }
}
</style>

<style lang="scss">
.commercial-wapper {
  .search {
    .el-form {
      justify-content: flex-start;
      display: flex;
      flex-wrap: wrap;
      width: 1200px;
    }
    .el-form-item {
      display: flex;
      align-items: center;
      margin-right: 35px;
      .el-form-item__label {
        width: 100px;
        text-align: left;
      }
      .el-input {
        width: 180px;
      }
      .el-date-editor {
        width: 380px;
      }
    }
  }
  .dia {
    .el-dialog {
      width: fit-content;
      .el-dialog__header {
        display: flex;
        .el-dialog__title {
          font-size: 20px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 26px;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
}
</style>
