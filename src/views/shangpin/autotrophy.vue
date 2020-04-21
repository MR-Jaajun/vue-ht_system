<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2020-02-17 17:43:57
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 14:56:22
 -->
  <!-- 自营商品 -->
<template>
  <div class="autotrophy">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>自营商品</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="top_h1">平台商品池</h1>
    <div class="tab">
      <el-row class="setStatusRow">
        <el-button
          size="medium"
          v-for="(item,index) in arrs"
          :key="index"
          :class="isactive==index? 'active': ''"
          @click="changeList(item.status,index)"
        >{{item.name}}({{item.amount}})</el-button>
      </el-row>
      <div class="update">
        <el-button type="danger" size="medium" :disabled="disables" @click="updateData">数据刷新</el-button>
      </div>
      <div class="lookupdate">
        <el-button type="primary" size="medium" @click="lookupdateList">查看更新记录</el-button>
      </div>
      <div class="lookupdate">
        <el-button type="primary" size="medium" @click="confirm2">商品下架更新</el-button>
      </div>
    </div>
    <!-- 更新记录弹窗 -->
    <div class="update_dia">
      <el-dialog
        title="更新记录"
        :show-close="true"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        v-loading="updatelistLoading"
        :visible.sync="openUpdateList"
      >
        <el-table
          :data="updateLists"
          :header-cell-style="{background:'#EAEBEF',color:'#333', fontWeight: '900', height:'63px' }"
        >
          <el-table-column property="goods_id" align="center" label="商品sku ID" width="100"></el-table-column>
          <el-table-column property="goods_title" align="center" label="商品信息" width="380"></el-table-column>
          <el-table-column property="price_op" align="center" label="原协议价（¥）" width="120"></el-table-column>
          <el-table-column property="price" align="center" label="协议价" width="120"></el-table-column>
          <el-table-column property="create_time" align="center" label="更新时间" width="180"></el-table-column>
        </el-table>
        <div style="height:30px;width:700px;margin-top:20px">
          <el-pagination
            background
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="page"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total2*1"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
    <el-row class="row-input">
      <div class="inputdiv">
        <span class="span">商品名称</span>
        <el-input v-model="goodsName" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">商品分类</span>
        <!-- <el-select v-model="category_val" placeholder="请选择" clearable>
          <el-option
            v-for="item in poolList"
            :key="item.page_num"
            :label="item.name"
            :value="item.page_num"
          ></el-option>
        </el-select>-->
        <!-- <el-input v-model="class_name" placeholder="请输入分类名称"></el-input> -->
        <el-cascader
          :placeholder="shop_category"
          v-model="option_val"
          :options="options"
          :props="{ checkStrictly : true,value:'id',label:'title',children:'children'}"
          @change="handleChange"
          clearable
        ></el-cascader>
      </div>

      <div class="inputdiv">
        <span class="span">折扣数</span>
        <el-select v-model="discountValue" placeholder="请选择" clearable>
          <el-option
            v-for="item in discountList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="inputdiv">
        <el-button type="primary" @click="getTable">搜索</el-button>
        <el-button type @click="clearClick">重置</el-button>
      </div>
    </el-row>
    <div class="table">
      <el-table
        v-loading="listLoading"
        :data="tableData"
        style="width: 1600px"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
        @selection-change="selectAll"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column align="center" prop="goods_id" label="商品ID" width="80"></el-table-column>
        <!-- <el-table-column align="center" label="商品图片" width="80">
          <template slot-scope="{row}">
            <img :src="row.goods_image" style="width:50px;height:50px" alt="暂无图片" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_name" label="商品名称" width="300"></el-table-column>-->
        <el-table-column align="center" label="商品信息" width="380">
          <template slot-scope="{row}">
            <div class="goodsinfo">
              <img :src="row.goods_image" />
              <span>{{row.goods_name}}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="goods_cate_name" label="商品分类" width="200"></el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="商品规格" width="250">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sku_title}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="京东价（¥）" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.jd_price}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="折扣数" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.jd_rebate}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="协议价(¥)" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.jd_treaty_price}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="加价百分比" width="90">
          <template slot-scope="{row}">
            <p
              v-for="(item, index) in row.goods_sku_data"
              :key="index"
            >{{item.sku_markup_price_ratio}}%</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="上架价格(¥)" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sku_sale_price}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="实际销量" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sku_sales}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品状态" width="80">
          <template slot-scope="{row}">
            <span v-show="row.goods_status==1">上架</span>
            <span v-show="row.goods_status==0" style="color:red">下架</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="{row}">
            <el-link type="primary" class="el_link" @click="goDetail(row.goods_id)">查看</el-link>
            <el-link
              type="primary"
              class="el_link"
              v-show="row.goods_status == 0"
              @click="confirm(row.goods_id,row.goods_status,'是否确认上架？')"
            >上架</el-link>
            <el-link
              type="danger"
              class="el_link"
              v-show="row.goods_status == 1"
              @click="confirm(row.goods_id,row.goods_status,'是否确认下架？')"
            >下架</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="addbtn">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        style="margin-right:15px;"
        @click="soldout(1)"
        @close="clear"
      >批量上架</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="soldout(0)">批量下架</el-button>
    </div>
    <!--批量上架弹窗  -->
    <div class="putaway">
      <el-dialog title="提示" :visible.sync="dialogFormVisible" custom-class="dialog">
        <p class="dialog_p">请设置上架价格，在协议价基础上进行加价！</p>
        <div class="dialog_input">
          <span class="span">加价百分比：</span>
          <el-input v-model="percent" placeholder="请输入1-100的整数" clearable></el-input>%
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="setPercent">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div style="height:30px;width:700px;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 20, 50, 100,500]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total*1"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import Cookies from "js-cookie";
import { timestampToTime } from "../../utils/util";
export default {
  data() {
    return {
      listLoading: false,
      status: 1,
      page: 1,
      size: 10,
      total: "",
      isactive: 0,
      poolList: [], //商品分类
      tableData: [],
      arrs: [],
      goodsName: "",
      // category_val: "",
      str_id: "",
      dialogFormVisible: false,
      percent: "", //加价百分比
      // categorye: "",
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
      shop_category: "请选择",
      option_val: "",
      options: [],
      disables: false,
      countDown: "",
      openUpdateList: false,
      updateLists: [],
      updatelistLoading: false,
      total2: "",
      page2: 1,
      size2: 10
    };
  },
  beforeCreate() {},
  created() {
    // this.getTable();
    this.disables = Cookies.get("timeout") == 1 ? true : false;
    // this.disables = false;
    this.ptGoodsAmount();
    this.categorye();
    this.cateData();
  },
  mounted() {
    // this.getTable();
  },
  methods: {
    //京东数据刷新
    updateData() {
      var millisecond = new Date().getTime(); //获取当前时间戳
      var afterTime = millisecond + 60 * 1000 * 60 * 2; //限制十分钟
      let time_val = timestampToTime(afterTime);
      this.countDown = time_val;
      // Cookies.set("timeout", 1, { expires: expiresTime });
      // Cookies.set("timeVal", time_val, { expires: expiresTime });
      this.open();
    },
    open() {
      this.$alert(this.countDown, "下次可刷新时间", {
        dangerouslyUseHTMLString: true,
        showClose: true,
        confirmButtonText: "点击刷新"
      }).then(() => {
        this.disables = true;
        var millisecond = new Date().getTime(); //获取当前时间戳
        var afterTime = millisecond + 60 * 1000 * 60 * 2; //限制十分钟
        var expiresTime = new Date(afterTime); //时间戳转换成中国标准时间
        Cookies.set("timeout", 1, { expires: expiresTime });
        this.goodsPriceUpdate();
      });
    },
    //京东数据更新 /backend/JdGoods/goodsPriceUpdate
    goodsPriceUpdate() {
      this.$axios({
        method: "POST",
        url: "/backend/JdGoods/goodsPriceUpdate",
        data: {}
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.ptGoodsAmount();
          this.cateData();
          this.getTable();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    handleChange(value) {
      var arrs = [];
      console.log(value);
      value.forEach(item => {
        arrs.push(item);
      });
      this.option_val = arrs.join(";"); // 把数组转换成字符串
      console.log(this.option_val);
      return this.option_val;
    },
    //商品分类获取  /backend/JdCommission/cateData
    cateData() {
      this.$axios({
        method: "GET",
        url: "/backend/JdCommission/cateData",
        params: {}
      }).then(res => {
        // console.log(res.data.data, "分类设置");
        if (res.data.status == 1) {
          this.options = res.data.data;
        }
      });
    },
    //搜索
    search() {
      this.getTable();
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
    //平台商品数量
    ptGoodsAmount() {
      this.$get("/backend/JdGoods/ptGoodsAmount").then(res => {
        this.arrs = res.data.data;
        this.getTable();
      });
    },
    //获取table数据
    getTable() {
      this.listLoading = true;
      this.$get("/backend/JdGoods/ptGoodsList", {
        goods_status: this.status,
        category: this.option_val,
        name: this.goodsName,
        goods_rebate: this.discountValue,
        page: this.page,
        size: this.size
      }).then(res => {
        this.listLoading = false;
        this.tableData = [];
        const { data } = res.data;
        this.total = data.total;
        // console.log(data, "table数据");
        data.data.map(item => {
          item.goods_sku_data.map(item2 => {
            item2.sku_markup_price_ratio = (
              item2.sku_markup_price_ratio * 100
            ).toFixed(1);
          });
        });
        this.tableData = data.data;
      });
    },
    //上架下架的弹窗
    confirm(id, status, txt) {
      this.$confirm(txt, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.putaway(id, status);
      });
    },

    putaway(id, status) {
      //上架
      if (status == 0) {
        this.$post("/backend/JdGoods/ptGoodsStatus", {
          goods_ids: id,
          status: 1
        }).then(res => {
          if (res.data.status == 1) {
            this.$message.success(res.data.msg);
            this.ptGoodsAmount();
            this.getTable();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
      if (status == 1) {
        this.$post("/backend/JdGoods/ptGoodsStatus", {
          goods_ids: id,
          status: 0
        }).then(res => {
          if (res.data.status == 1) {
            this.$message.success(res.data.msg);
            this.ptGoodsAmount();
            this.getTable();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    //全部,上架,下架状态切换
    changeList(status, index) {
      this.isactive = index;
      this.status = status;
      this.tableData = [];
      this.getTable();
    },
    //重置
    clearClick() {
      this.goodsName = "";
      this.goodsType = "";
      this.discountValue = "";
      this.option_val = "";
      this.shop_category = "请选择";
    },
    // 用户全选checkbox时触发该事件
    selectAll(val) {
      var rowIds = [];
      val.forEach(item => {
        rowIds.push(item.goods_id);
      });
      this.str_id = rowIds.join(","); // 把数组转换成字符串
      return this.str_id;
    },
    //平台商品批量设置价格 /backend/JdGoods/ptGoodsSkuRatioPrice
    ptGoodsSkuRatioPrice() {
      this.$post("/backend/JdGoods/ptGoodsSkuRatioPrice", {
        goods_ids: this.str_id,
        goods_sku_price_ratio: this.percent / 100
      }).then(res => {
        if (res.data.status == 1) {
          this.ptGoodsStatus(1);
          this.dialogFormVisible = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //上下架
    ptGoodsStatus(status) {
      this.$post("/backend/JdGoods/ptGoodsStatus", {
        goods_ids: this.str_id,
        status: status
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.ptGoodsAmount();
          this.getTable();
          this.str_id = "";
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //批量上下架
    soldout(status) {
      if (status == 0) {
        if (this.str_id) {
          this.confirm2(status, "你确定要批量下架商品吗？");
        } else {
          this.$message.error("商品ID不能为空");
        }
      }
      if (status == 1) {
        if (this.str_id) {
          this.dialogFormVisible = true;
          this.percent = "";
        } else {
          this.$message.error("商品ID不能为空");
        }
      }
    },
    //上架商品设置百分比
    setPercent() {
      if (this.percent >= 0) {
        this.ptGoodsSkuRatioPrice();
      } else {
        this.$message.error("百分比不能为空");
      }
    },
    clear() {
      this.percent = "";
      this.str_id = "";
      // this.category = "";
    },
    //上架下架的弹窗
    confirm2(status, txt) {
      this.$confirm(txt, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.ptGoodsStatus(status);
      });
    },
    // 查看
    goDetail(id) {
      this.$router.push({ path: "./autotrophyDetail", query: { id: id } });
    },
    //页码操作
    handleSizeChange(val) {
      console.log(val);
      this.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      // console.log(val);
      this.page = val;
      this.getTable();
      this.page = 1;
    },
    //打开更新记录弹窗
    lookupdateList() {
      this.openUpdateList = true;
      this.goodsPriceUpdateLog(1);
    },
    //页码操作
    handleSizeChange2(val) {
      console.log(val);
      this.size2 = val;
      // this.getTable();
    },
    handleCurrentChange2(val) {
      console.log(val);
      this.goodsPriceUpdateLog(val);
    },
    //京东商品协议价更新记录 /backend/JdGoods/goodsPriceUpdateLog
    goodsPriceUpdateLog(page) {
      this.updatelistLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/JdGoods/goodsPriceUpdateLog",
        params: {
          page: page,
          size: 10
        }
      }).then(res => {
        if (res.data.status == 1) {
          // console.log(res.data.data.data, "更新记录");
          this.total2 = res.data.data.total;
          this.updateLists = res.data.data.data;
          this.updatelistLoading = false;
        } else {
          this.$message(res.data.msg);
        }
      });
    },
    //京东商品下架更新
    confirm2() {
      this.$confirm('京东商品下架更新', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.goodsStateUpdate();
      });
    },
    //京东商品下架更新 /backend/JdGoods/goodsStateUpdate
    goodsStateUpdate() {
      this.$axios({
        method: "POST",
        url: "/backend/JdGoods/goodsStateUpdate"
      }).then(res => {
        if (res.data.status == 1) {
          this.ptGoodsAmount();
          this.cateData();
          this.getTable();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>
<style lang="scss" scode>
.autotrophy {
  .tab {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: fit-content;
  }
  .update {
    display: flex;
    margin-left: 100px;
  }
  .lookupdate {
    display: flex;
    margin-left: 30px;
  }
  .top_h1 {
    margin-top: 10px;
    width: fit-content;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  .setStatusRow {
    display: flex;
    width: fit-content;
    margin: 25px 25px 25px 0;
    .active {
      background: #4371e8;
      color: #fff;
    }
  }
  .row-input {
    width: 1450px;
    display: flex;
    align-items: center;
    height: 50px;
    margin: 20px 0;
    .inputdiv {
      margin-right: 90px;
      height: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: rgba(22, 23, 55, 1);
        display: inline-block;
        margin-right: 20px;
      }
      .input-control {
        width: 248px;
        height: 34px;
        border-radius: 2px;
      }
    }
  }
  .table {
    // width: 1200px;
    margin-top: 35px;
    margin-bottom: 20px;
    width: fit-content;
    max-height: 663px;
    overflow-y: auto;
    border: 1px solid rgba(204, 204, 204, 1);
    .el_link {
      // border-right: 1px solid;
      height: 16px;
      margin: 0 5px;
    }
    // .el-table .cell > p {
    //   text-align: center;
    //   width: fit-content;
    //   border-bottom: 1px solid #215a75;
    // }
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
  .addbtn {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 80px;
  }
  .dialog_p {
    width: 360px;
    height: 21px;
    font-size: 17px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 21px;
    color: rgba(102, 102, 102, 1);
    margin-bottom: 15px;
  }
  .dialog_input {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    height: 32px;
    line-height: 32px;
    .span {
      width: 160px;
    }
  }
}
</style>
<style lang="scss">
.autotrophy {
  .putaway {
    .el-dialog {
      position: relative;
      margin: 0 auto 50px;
      border-radius: 2px;
      -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: 400px;
      height: 260px;
    }
    .el-dialog__header {
      width: 400px;
      height: 20px;
    }
    .el-dialog__body {
      padding: 30px 20px;
      color: #606266;
      font-size: 0.14rem;
      word-break: break-all;
      width: 400px;
    }
    .el-dialog__footer {
      padding: 10px 20px 20px;
      text-align: right;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      position: relative;
      top: -30px;
    }
    .el-dialog__title {
      line-height: 0.24rem;
      font-size: 0.18rem;
      color: #303133;
      position: absolute;
      top: 20px;
    }
    .dialog_p {
      width: 360px;
      height: 21px;
      font-size: 17px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 21px;
      color: rgba(102, 102, 102, 1);
      margin-bottom: 15px;
    }
    .dialog_input {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      height: 32px;
      line-height: 32px;
      .span {
        width: 160px;
      }
    }
  }
  .update_dia {
    .el-dialog {
      position: relative;
      margin: 0 auto 50px;
      border-radius: 2px;
      -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      width: fit-content;
      // height: 550px;
    }
    .el-dialog__title {
      line-height: 0.24rem;
      font-size: 0.18rem;
      color: #303133;
      font-weight: bold;
      position: absolute;
      top: 20px;
    }
  }
}
</style>
