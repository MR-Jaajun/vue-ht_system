  <!-- 活动专区 /  专区 -->
<template>
  <div class="gruopSale2">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: './seckillSale' }">活动专区</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './seckillSale' }">秒杀列表</el-breadcrumb-item>
      <el-breadcrumb-item>设置秒杀商品</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>设置秒杀商品</h1>
    <div class="addbtn">
      <el-button type="primary" plain icon="el-icon-plus" @click="adddialog">添加秒杀商品</el-button>
    </div>
    <!-- 添加商品弹窗  -->
    <div class="dia">
      <el-dialog title :show-close="true" :visible.sync="dialogTableVisible" @close="resetForm">
        <el-form :inline="true" :model="formInline" ref="formInline">
          <el-form-item label="商品名称" prop="name">
            <el-input class="dialog_ipnt" v-model="formInline.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="category">
            <el-cascader
              :placeholder="shop_category2"
              v-model="option_val2"
              :options="options2"
              :props="{ checkStrictly : true,value:'id',label:'title',children:'children'}"
              @change="handleChange2"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="折扣数" prop="discountValue">
            <el-select v-model="formInline.discountValue" placeholder="请选择" clearable>
              <el-option
                v-for="item in discountList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-right:15px;" @click="serachDialog()">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="div_row_input">
          <el-table
            v-loading="loading2"
            :data="dialogData"
            style="width: fit-content"
            :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
            @selection-change="selectAll"
          >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column align="center" prop="goods_id" label="商品ID" width="100"></el-table-column>
            <el-table-column align="center" label="商品图片" width="80">
              <template slot-scope="{row}">
                <img :src="row.goods_image" style="width:50px;height:50px" alt="暂无图片" />
              </template>
            </el-table-column>
            <el-table-column align="center" prop="goods_name" label="商品名称" width="290">
              <template slot-scope="{row}">
                <span style="text-align:left">{{row.goods_name}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="goods_cate_name" label="商品分类" width="200"></el-table-column>
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
            <el-table-column align="center" prop="goods_sku_data" label="上架价格(¥)" width="90">
              <template slot-scope="{row}">
                <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sku_sale_price}}</p>
              </template>
            </el-table-column>
            <el-table-column label="活动库存" align="center" width="100">
              <!-- @blur="price(item.sku_seckill_stock,0,row.goods_id)" -->
              <template slot-scope="{row}">
                <el-input placeholder="请输入库存" v-model="row.good_stock" />
              </template>
            </el-table-column>
            <el-table-column label="设置折扣" align="center" width="100">
              <!-- @blur="price(row.rebate,1,row.goods_id)"-->
              <template slot-scope="{row}">
                <el-select v-model="row.rebate" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in discount_list"
                    :key="item.discount"
                    :label="item.discount"
                    :value="item.discount"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 20px;">
          <el-pagination
            background
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="page"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dtotal*1"
          ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" plain @click="price">确定添加</el-button>
          <el-button @click="dialogTableVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 搜索  -->
    <el-row class="row-input">
      <div class="inputdiv">
        <span class="span">商品名称</span>
        <el-input v-model="goodsName" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">商品分类</span>
        <el-cascader
          :placeholder="shop_category"
          v-model="option_val"
          :options="options"
          :props="{ checkStrictly : true,value:'id',label:'title',children:'children'}"
          @change="handleChange"
          clearable
        ></el-cascader>
      </div>
      <!-- <div class="inputdiv">
        <span class="span">折扣数：</span>
        <el-select v-model="discountValue2" placeholder="请选择" clearable>
          <el-option
            v-for="item in discountList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>-->
      <div class="inputdiv">
        <el-button type="primary" @click="getTable">搜索</el-button>
        <el-button type @click="clearClick">重置</el-button>
      </div>
    </el-row>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: fit-content"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
        @selection-change="selectAll"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" prop="goods_id" label="商品ID" width="120"></el-table-column>
        <!-- <el-table-column align="center" label="商品图片" width="80">
          <template slot-scope="{row}">
            <img :src="row.goods_image" style="width:50px;height:50px" alt="暂无图片" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_name" label="商品名称" width="300"></el-table-column>-->
        <el-table-column align="center" label="商品信息" width="480">
          <template slot-scope="{row}">
            <div class="goodsinfo">
              <img :src="row.goods_image" />
              <span style="text-align:left">{{row.goods_name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_cate_name" label="商品分类" width="200"></el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="京东价（¥）" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.jd_price}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="折扣数" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.promotion_discount}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="协议价(¥)" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.jd_treaty_price}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="上架价格(¥)" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sku_sale_price}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="秒杀价（¥）" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sku_seckill_price}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="活动库存" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sku_seckill_stock}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="goods_sku_data" label="排序" width="100">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sort}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="{row}">
            <el-link type="primary" class="el_link" @click="goDetail(row.goods_id)">查看</el-link>
            <el-link type="danger" class="el_link" @click="confirm(row.goods_id,'是否确认删除？')">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="addbtn">
      <el-button type="primary" plain icon="el-icon-delete" @click="confirm(str_id,'是否确认删除？')">批量删除</el-button>
    </div>
    <div style="height:30px;width:700px;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total*1"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getBase64 } from "../../utils/base64.js";
import { getClass } from "@/utils/util.js";
export default {
  data() {
    return {
      loading: false,
      loading2: false,
      discountList: require("@/utils/rebate"),
      formInline: {
        name: "",
        category: "",
        discountValue: ""
      },
      poolList: [], //商品分类数组
      seckill_id: "",
      dialogData: [],
      tableData: [],
      dtotal: "",
      total: "",
      page: 1,
      size: 5,
      page1: 1,
      size1: 5,
      rowIds: [],
      str_id: "",
      goodsName: "",
      category: "",
      discountValue2: "",
      dialogImageUrl: "",
      disabled: false,
      dialogTableVisible: false,
      seckill_discount: "", //价格
      seckill_stock: [],
      discount_list: [],
      //
      shop_category: "请选择",
      option_val: "",
      options: [],
      shop_category2: "请选择",
      option_val2: "",
      options2: []
    };
  },

  created() {
    this.seckill_scene_id = this.$route.query.seckill_scene_id;
    this.cateData();
  },
  mounted() {
    this.getTable();
  },
  methods: {
    handleChange(value) {
      var arrs = [];
      console.log(value);
      value.forEach(item => {
        arrs.push(item);
      });
      this.option_val = arrs.join(";"); // 把数组转换成字符串
      return this.option_val;
    },
    handleChange2(value) {
      var arrs = [];
      console.log(value);
      value.forEach(item => {
        arrs.push(item);
      });
      this.option_val2 = arrs.join(";"); // 把数组转换成字符串
      return this.option_val2;
    },
    //商品分类获取  /backend/JdCommission/cateData
    cateData() {
      this.$axios({
        method: "GET",
        url: "/backend/JdCommission/cateData",
        params: {}
      }).then(res => {
        console.log(res.data.data, "分类设置");
        if (res.data.status == 1) {
          this.options = res.data.data;
          this.options2 = res.data.data;
        }
      });
    },
    //添加商品
    adddialog() {
      this.dialogTableVisible = true;
      this.page1 = 1;
      this.dialogTable();
    },
    //弹窗操作
    changeInput(x, type, id) {
      if (type == 0) {
        var a = id + "-" + x;
        this.seckill_stock.push(a);
        var b = this.seckill_stock.join(",");
        console.log(b, "this.seckill_stock");
      }
      if (type == 1) {
        this.seckill_discount = id + "-" + x;
      }
    },

    //添加商品弹窗搜索
    serachDialog() {
      this.dialogTable();
    },
    //弹窗input重置
    resetForm() {
      // console.log("弹窗input重置");
      this.formInline.category = "";
      this.formInline.name = "";
      this.formInline.discountValue = "";
      this.option_val2 = "";
      this.shop_category2 = "请选择";
    },
    //活动专区折扣获取 /backend/JdCommission/discountActList
    discountActList() {
      this.$axios({
        method: "GET",
        url: "/backend/JdCommission/discountActList",
        params: {}
      }).then(res => {
        if (res.data.status == 1) {
          console.log(res.data, "活动折扣");
          this.discount_list = res.data.data;
        }
      });
    },
    //获取添加商品table数据
    dialogTable() {
      this.loading2 = true;
      this.$get("/backend/JdPromotion/searchGoods", {
        search_goods_title: this.formInline.name,
        search_goods_cate_id: this.option_val2,
        goods_rebate: this.formInline.discountValue,
        goods_promotion: 3,
        page: this.page1,
        size: this.size1
      }).then(res => {
        this.loading2 = false;
        this.dialogData = [];
        this.dtotal = res.data.data.total;
        var arrdata = res.data.data.data;
        arrdata.map(item => {
          item.good_stock = "";
        });
        this.dialogData = arrdata;
        this.discountActList();
        console.log(arrdata, "table数据000000");
      });
    },
    //价格设置
    price() {
      var arrs = [];
      var new_arr = JSON.parse(JSON.stringify(this.dialogData));
      // console.log(this.dialogData, "打印一下");
      new_arr.forEach((item, i) => {
        if (this.rowIds.indexOf(item.goods_id) != -1) {
          arrs.push(item);
        }
      });
      let discount_str = "";
      let stock_str = "";
      if (arrs.length > 0) {
        let seckill_discount = [];
        let seckill_stock = [];
        arrs.forEach(item => {
          if (item.rebate) {
            var a = item.goods_id + "-" + item.rebate;
            seckill_discount.push(a);
            if (item.good_stock) {
              var b = item.goods_id + "-" + item.good_stock;
              seckill_stock.push(b);
            } else {
              this.$message.error("请设置库存");
              return;
            }
          } else {
            this.$message.error("请设置折扣");
            return;
          }
        });
        discount_str = seckill_discount.join(",");
        stock_str = seckill_stock.join(",");
        if (discount_str && stock_str) {
          this.$post("/backend/JdPromotion/secKillGoodsAdd", {
            seckill_scene_id: this.seckill_scene_id,
            seckill_discount: discount_str,
            seckill_stock: stock_str
          }).then(res => {
            if (res.data.status == 1) {
              this.$message.success(res.data.msg);
              this.dialogTableVisible = false;
              this.getTable();
              this.dialogTable();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          this.$message.error("有商品未填写折扣或库存");
        }
      } else {
        this.$message.error("请勾选你所要添加的商品");
      }
      // console.log(arrs);
    },
    // 查看
    goDetail(id) {
      this.$router.push({
        path: "./actgoodsdetail",
        query: { id: id, seckill_scene_id: this.seckill_scene_id }
      });
    },

    //获取table数据
    getTable() {
      this.loading = true;
      this.$get("/backend/JdPromotion/secKillGoodsList", {
        seckill_scene_id: this.seckill_scene_id,
        page: this.page,
        size: this.size
      }).then(res => {
        this.loading = false;
        var data = res.data.data;
        this.total = data.total;
        var arrdata = data.data.map(v => {
          delete v.create_time;
          // console.log(v, "table数据9999999");
        });
        this.tableData = data.data;
        // console.log(arrdata, "table数据7777");
      });
    },
    //删除的弹窗
    confirm(id, txt) {
      this.$confirm(txt, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.putaway(id);
      });
    },
    ///backend/JdPromotion/pinkGoodsDelete
    putaway(id) {
      this.$post("/backend/JdPromotion/secKillGoodsDelete", {
        seckill_scene_id: this.seckill_scene_id,
        goods_ids: id
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.getTable();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //分类搜索
    changeList(type, index) {
      this.isactive = index;
      this.type = type;
    },
    //重置
    clearClick() {
      this.goodsName = "";
      this.category = "";
      this.option_val = "";
      this.shop_category = "";
    },
    // 用户全选checkbox时触发该事件
    selectAll(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.goods_id);
      });
      this.str_id = this.rowIds.join(","); // 把数组转换成字符串
      console.log(this.str_id);
      return this.str_id;
    },
    //页码操作
    handleSizeChange(val) {
      this.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTable();
      this.page = 1;
    },
    //弹窗页码操作
    handleSizeChange1(val) {
      this.size1 = val;
      this.dialogTable();
    },
    handleCurrentChange1(val) {
      this.page1 = val;
      this.dialogTable();
      // this.page1 = 1;
    }
  }
};
</script>
<style lang="scss">
.gruopSale2 {
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
  .StatusRow {
    width: 750px;
    height: 264px;
    padding: 20px 20px 0 20px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.16);
    margin-top: 20px;
    .div_Upload {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      &:nth-child(2) {
        margin-top: 20px;
        .avatar-uploader {
          font-size: 12px;
          border-radius: 2px;
          margin-right: 200px;
          background: rgba(242, 242, 242, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #409eff;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
        }
      }
      span:nth-child(1) {
        width: 187px;
        height: 18px;
        font-size: 15px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 18px;
        color: rgba(51, 51, 51, 1);
        letter-spacing: 1px;
      }
      span:nth-child(2) {
        height: 36px;
        font-size: 13px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: rgba(102, 102, 102, 1);
      }
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
}
</style>
<style lang="scss">
.gruopSale2 {
  .dia {
    .el-dialog {
      width: fit-content !important;
    }
    .dialog_ipnt {
      width: 100px;
    }
  }
}
.gruopSale2 {
  .div_row_input {
    // position: relative;
    .el-input--small .el-input__inner {
      // width: 75px;
      // height: 20px;
      // line-height: 20px;
      text-align: center;
    }

    .div_row_input {
      position: relative;
      .el-input--small .el-input__inner {
        margin-bottom: 5px;
        text-align: center;
      }
      // .dialog-footer {
      //   position: absolute;
      //   bottom: -20px;
      //   right: 0;
      // }
    }
  }
}
.gruopSale2 {
  .dia {
    .div_row_input {
      position: relative;
      .el-input--small .el-input__inner {
        // width: 75px;
        height: 20px;
        line-height: 20px;
        text-align: center;
      }
      // .dialog-footer {
      //   position: absolute;
      //   bottom: -20px;
      //   right: 0;
      // }
    }
  }
}
</style>
