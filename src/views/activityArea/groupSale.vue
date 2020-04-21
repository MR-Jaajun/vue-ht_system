  <!-- 活动专区 /  拼团专区 -->
<template>
  <div class="gruopSale">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>活动专区</el-breadcrumb-item>
      <el-breadcrumb-item>拼团专区</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>拼团专区</h1>
    <div class="StatusRow">
      <div class="div_Upload">
        <span>拼团专区背景图：</span>
        <span>
          上传图片最佳尺寸为710*212像素，比例17:5其它尺寸会影响页面效果，
          格式为png，jpg，jpeg，上传图片的大小不超过2M
        </span>
      </div>
      <div class="div_Upload">
        <span>上传图片：</span>
        <img
          v-show="isShowdefImg"
          :src="defImg"
          alt
          style="width:146px; height:146px;margin-right:20px;border-radius:4px"
        />
        <span>
          <el-upload
            class="avatar-uploader"
            action
            list-type="picture-card"
            :on-change="onChange"
            :on-remove="handleRemove"
            :auto-upload="false"
            :limit="1"
            accept=".jpg, .png"
          >
            <i class="el-icon-circle-plus-outline avatar-uploader-icon"></i>
          </el-upload>
        </span>
      </div>
    </div>
    <div class="addbtn">
      <el-button type="primary" plain icon="el-icon-plus" @click="adddialog">添加拼团商品</el-button>
    </div>
    <!-- 添加拼团商品弹窗  -->
    <div class="dia">
      <el-dialog title :show-close="true" :visible.sync="dialogTableVisible">
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
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dialogData"
          v-loading="loading2"
          style="width: fit-content"
          :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
          @selection-change="selectAll"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
        >
          <!-- <el-table-column type="selection" width="50"></el-table-column> -->
          <el-table-column align="center" prop="goods_id" label="商品ID" width="120"></el-table-column>
          <el-table-column align="center" label="商品图片" width="80">
            <template slot-scope="{row}">
              <img :src="row.goods_image" style="width:50px;height:50px" alt="暂无图片" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="goods_name" label="商品名称" width="300">
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
          <el-table-column align="center" prop="goods_sku_data" label="排序" width="100">
            <template slot-scope="{row}">
              <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sort}}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="130">
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
      <div class="inputdiv">
        <el-button type="primary" @click="getTable">搜索</el-button>
        <el-button type @click="clearClick">重置</el-button>
      </div>
    </el-row>
    <div class="table">
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: fit-content"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
        @selection-change="selectAll"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" prop="goods_id" label="商品ID" width="120"></el-table-column>
        <el-table-column align="center" label="商品图片" width="80">
          <template slot-scope="{row}">
            <img :src="row.goods_image" style="width:50px;height:50px" alt="暂无图片" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_name" label="商品名称" width="300">
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
        <el-table-column align="center" prop="goods_sku_data" label="库存" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sku_sales}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="goods_sku_data" label="拼团折扣" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sku_sale_price}}</p>
          </template>
        </el-table-column>-->
        <el-table-column align="center" prop="goods_sku_data" label="拼团价（¥）" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sku_pink_price}}</p>
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
      defImg: "", //默认背景图
      isShowdefImg: true, //是否显示默认背景图
      discountList: require("@/utils/rebate"),
      formInline: {
        name: "",
        category: "",
        discountValue: ""
      },
      poolList: [], //商品分类数组
      dialogData: [],
      tableData: [],
      dtotal: "",
      total: "",
      page: 1,
      size: 5,
      page1: 1,
      size1: 5,
      str_id: "",
      goodsName: "",
      category: "",
      dialogImageUrl: "",
      disabled: false,
      dialogTableVisible: false,
      goods_id: "",
      goods_pink_discount: "",
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
    this.getTable();
    this.getBackImage();
    this.cateData();
  },
  mounted() {},
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
    //商品分类 /backend/JdGoods/poolList
    // categorye() {
    //   this.$get("/backend/JdGoods/poolList").then(res => {
    //     if (res.data.status == 1) {
    //       this.poolList = res.data.data;
    //     }
    //   });
    // },
    //活动背景获取/backend/JdPromotion/getBackImage
    getBackImage() {
      this.$get("/backend/JdPromotion/getBackImage", {
        image_type: 1
      }).then(res => {
        if (res.data.status == 1) {
          this.defImg = res.data.data.back_image;
        }
      });
    },
    //添加商品
    adddialog() {
      this.dialogTableVisible = true;
      this.dialogTable();
      this.page1 = 1;
    },
    //弹窗操作
    changeInput(a, id) {
      // console.log(a, id);
      // this.goods_id = id;
      // this.goods_pink_discount = a;
    },

    //确定添加
    price() {
      var arrs = [];
      var new_arr = JSON.parse(JSON.stringify(this.dialogData));
      // console.log(this.dialogData, "打印一下");
      new_arr.forEach(item => {
        if (item.rebate) {
          arrs.push(item);
        }
      });
      if (arrs.length > 0) {
        arrs.forEach((item, i) => {
          this.$post("/backend/JdPromotion/pinkGoodsAdd", {
            goods_ids: item.goods_id,
            goods_pink_discount: item.goods_id + "-" + item.rebate
          }).then(res => {
            if (res.data.status == 1) {
              // console.log(a, arrs.length);
              this.dialogTableVisible = false;
              if (i == arrs.length - 1) {
                this.$message.success(res.data.msg);
                this.getTable();
                this.dialogTable();
              }
            } else {
              if (i == arrs.length - 1) {
                this.$message.error(res.data.msg);
              }
            }
          });
        });
      } else {
        this.$message.error("您还没有填写折扣");
      }
    },

    //添加商品弹窗搜索
    serachDialog() {
      this.dialogTable();
    },
    //弹窗input重置
    resetForm() {
      console.log("弹窗input重置");
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
          // console.log(res.data, "活动折扣");
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
        goods_promotion: 4,
        page: this.page1,
        size: this.size1
      }).then(res => {
        this.loading = false;
        this.dialogData = [];
        this.loading2 = false;
        this.dtotal = res.data.data.total;
        var arrdata = res.data.data.data;
        this.dialogData = arrdata;
        this.discountActList();
        // console.log(arrdata, "table数据000000");
      });
    },

    // 查看
    goDetail(id) {
      this.$router.push({ path: "./groupDetail", query: { id: id } });
    },
    //删除图片出发的事件
    handleRemove(file, fileList) {
      console.log(file, fileList, "handleRemove");
    },
    //选择图片后触发的事件
    onChange(file, fileList) {
      getBase64(file.raw).then(res => {
        this.Base64imgurl = res;
        return this.Base64imgurl;
      });
      this.isShowdefImg = false;
      let that = this;
      let width = 0;
      let height = 0;
      let _URL = window.URL || window.webkitURL;
      let img = new Image();
      img.onload = function() {
        if (img.width <= 710 && img.height <= 212) {
          that
            .$post("/backend/SystemSetting/uploadAvatar", {
              image: that.Base64imgurl
            })
            .then(res => {
              console.log(res.data.data.url, "url");
              that.defImg = res.data.data.url;
              that
                .$post("/backend/JdPromotion/addBackImage", {
                  image_type: 1,
                  back_image: res.data.data.url
                })
                .then(res => {
                  that.$message.success(res.data.msg);
                });
            });
        } else {
          that.$message.error("上传失败请重新上传");
          var divCard = document.getElementsByClassName("el-upload-list__item");
          console.log(oLi, divCard);
          var oLi = getByClass(divCard, "li");
          for (var i = 0; i < oLi.length; i++) {
            oLi[i].style.display = "none";
          }
        }
      };
      img.src = file.url;
    },
    //获取table数据
    getTable() {
      this.loading = true;
      this.$get("/backend/JdPromotion/pinkGoodsList", {
        search_goods_cate_id: this.option_val,
        search_goods_title: this.goodsName,
        page: this.page,
        size: this.size
      }).then(res => {
        this.loading = false;
        this.tableData = [];
        const { data } = res.data;
        this.total = data.total;
        this.tableData = data.data;
        console.log(data, "table数据7777");
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
      // if (status == 0) {
      //   var ids = id;
      // }
      // if (status == 1) {
      //   var ids = this.str_id;
      // }
      this.$post("/backend/JdPromotion/pinkGoodsDelete", {
        goods_ids: id
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.getTable();
          this.str_id = "";
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
.addbtn {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 80px;
}
</style>
<style lang="scss">
.dia {
  .el-dialog {
    width: fit-content;
  }
}
.dialog_ipnt {
  width: 100px;
}
</style>
