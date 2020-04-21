<!--
 * @Description: 商品详情
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-14 15:38:22
 -->
<template>
  <div class="labeldetails-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item to="./label">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>商品详情</h1>
    <!-- 商城模块 -->
    <div class="labelinfo common" v-show="gtype == 2">
      <h2>
        商品基本信息(商城）
        <i></i>
      </h2>
      <div class="common2 common3">
        <li>
          <span>店铺名称：</span>
          <span>{{shop_info.shop_title}}</span>
        </li>
        <li>
          <span>商品名称：</span>
          <span>{{goods_info.goods_title}}</span>
        </li>
        <li>
          <span>商品分类：</span>
          <span>{{goods_info.category_value}}</span>
        </li>
        <li>
          <span>商品ID：</span>
          <span>{{goods_info.id}}</span>
        </li>
        <li>
          <span>商品单位：</span>
          <span>{{goods_info.unit}}</span>
        </li>
        <li>
          <span>商品规格：</span>
          <el-table
            border
            :data="attr_values"
            :header-cell-style="{color:'#333', height:'63px' }"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
            <el-table-column prop="sku_title" label="规格" align="center"></el-table-column>
            <el-table-column prop="sku_market_price" label="原价(元)" align="center" width="100"></el-table-column>
            <el-table-column prop="sku_sale_price" label="销售价(元)" align="center" width="100"></el-table-column>
            <el-table-column prop="sku_pink_price" label="团购价(元)" align="center" width="100">
              <template slot-scope="{row}">
                <span style="font-size:12px;">{{row.sku_pink_price?row.sku_pink_price:'/'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sku_stock" label="库存" align="center" width="100"></el-table-column>
          </el-table>
          <!-- <div style="display:flex;flex-direction: column">
            <p
              style="color:#333;font-size:16px;margin-bottom:5px;"
              v-for="(item,i) in arr2"
              :key="i"
            >{{item}}</p>
          </div>-->
        </li>
        <li>
          <span>商品库存：</span>
          <span>{{goods_info.stock_amount}}</span>
        </li>
        <li>
          <span>商品价格(¥)：</span>
          <span>{{goods_info.sale_price}}</span>
        </li>
        <!-- <li>
          <span>商品活动价格(¥)：</span>
          <span>{{}}</span>
        </li>-->
        <li>
          <span>商品拼团/限时抢购价格(¥)：</span>
          <span>{{goods_info.pink_price}}</span>
        </li>
        <li>
          <span>商品状态：</span>
          <span>{{goods_info.status_value}}</span>
        </li>
        <li v-if="goods_info.system_off == 1">
          <span>下架原因：</span>
          <span>{{goods_info.system_off_desc}}</span>
        </li>
        <li style="height:84px;margin-bottom: 30px;">
          <span>商品图片：</span>
          <p>
            <a :href="item" target="_blank" v-for="(item,i) in imgarr" :key="i">
              <img :src="item" />
            </a>
          </p>
        </li>
        <li style="height:84px;">
          <span>商品详情：</span>
          <p>
            <a :href="item" target="_blank" v-for="(item,i) in imgdetailarr" :key="i">
              <img :src="item" />
            </a>
          </p>
        </li>
      </div>
    </div>
    <!-- 外卖模块 -->
    <div class="waimaiinfo common" v-show="gtype == 1">
      <h2>
        商品基本信息(外卖)
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>店铺名称：</span>
          <span>{{shop_info.shop_title}}</span>
        </li>
        <li>
          <span>商品名称：</span>
          <span>{{goods_info.goods_title}}</span>
        </li>
        <li>
          <span>商品分类：</span>
          <span>{{goods_info.category_value}}</span>
        </li>
        <li>
          <span>商品ID：</span>
          <span>{{goods_info.id}}</span>
        </li>
        <li>
          <span>商品单位：</span>
          <span>{{goods_info.unit}}</span>
        </li>
        <li>
          <span>商品规格：</span>
          <!-- <div style="display:flex;flex-direction: column">
            <p
              style="color:#333;font-size:16px;margin-bottom:5px;"
              v-for="(item,i) in arr2"
              :key="i"
            >{{item}}</p>
          </div>-->
          <el-table
            border
            :data="attr_values"
            :header-cell-style="{color:'#333', height:'40px' }"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
            <el-table-column prop="sku_title" label="规格" align="center"></el-table-column>
            <el-table-column label="价格(元)" align="center" width="100">
              <template slot-scope="{row}">
                <span
                  style="font-size:12px;margin-right:0"
                >{{goods_type==1?row.sku_sale_price:row.sku_market_price}}</span>
              </template>
            </el-table-column>
            <el-table-column label="折扣价(元)" align="center" width="100">
              <template slot-scope="{row}">
                <span
                  style="font-size:12px;margin-right:0"
                >{{goods_type==1?row.sku_market_price:row.sku_sale_price}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sku_stock" label="库存" align="center" width="100">
              <template slot-scope="{row}">
                <span
                  style="font-size:12px;margin-right:0"
                >{{row.sku_stock=='-9999'?'无限库存':row.sku_stock}}</span>
              </template>
            </el-table-column>
          </el-table>
        </li>
        <li>
          <span>商品库存：</span>
          <span>{{goods_info.stock_amount}}</span>
        </li>
        <li>
          <span>商品价格(¥)：</span>
          <span>{{goods_info.sale_price}}</span>
        </li>
        <li>
          <span>商品状态：</span>
          <span>{{goods_info.status_value}}</span>
        </li>
        <li v-if="goods_info.system_off == 1">
          <span>下架原因：</span>
          <span>{{goods_info.system_off_desc}}</span>
        </li>
        <li style="height:84px">
          <span>商品图片：</span>
          <p>
            <a :href="item" target="_blank" v-for="(item,i) in imgarr" :key="i">
              <img :src="item" />
            </a>
          </p>
        </li>
      </div>
    </div>
    <!-- 团购模块 -->
    <div class="waimaiinfo common" v-show="gtype == 3">
      <h2>
        商品基本信息(团购)
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>店铺名称：</span>
          <span>{{shop_info.shop_title}}</span>
        </li>
        <li>
          <span>商品名称：</span>
          <span>{{goods_info.goods_title}}</span>
        </li>
        <!-- <li>
          <span>商品分类：</span>
          <span>{{goods_info.category_value}}</span>
        </li>-->
        <li>
          <span>商品ID：</span>
          <span>{{goods_info.id}}</span>
        </li>
        <!-- <li>
          <span>商品单位：</span>
          <span>{{goods_info.unit}}</span>
        </li>-->
        <li>
          <span>门市价:</span>
          <span>{{goods_info.market_price}} 元</span>
        </li>
        <li>
          <span>单购价：</span>
          <span>{{goods_info.sale_price}} 元</span>
        </li>
        <li>
          <span>团购价：</span>
          <span>{{goods_info.pink_price}} 元</span>
        </li>
        <!-- <li>
          <span>商品规格：</span>
          <span>{{}}</span>
        </li>-->
        <li>
          <span>商品库存：</span>
          <span>{{goods_info.stock_amount}}</span>
        </li>
        <li>
          <span>商品状态：</span>
          <span>{{goods_info.status_value}}</span>
        </li>
        <li v-if="goods_info.system_off == 1">
          <span>下架原因：</span>
          <span>{{goods_info.system_off_desc}}</span>
        </li>
        <li style="height:84px" v-show="imgdetailarr.length>0">
          <span>商品图片：</span>
          <p>
            <a :href="item" target="_blank" v-for="(item,i) in imgdetailarr" :key="i">
              <img :src="item" />
            </a>
          </p>
        </li>
      </div>
    </div>
    <!-- 返回上一页 -->
    <el-button plain @click="backdown">返回上一页</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id_type: {},
      ids: "",
      gtype: "",
      goods_info: "",
      shop_info: "",
      imgarr: [], //商品图片
      imgdetailarr: [], //商品详情图片(大图)
      attr_values: [
        { title: "颜色", child: ["红", "蓝", "黑"] },
        { title: "温度", child: ["冷", "热", "温"] },
        { title: "份量", child: ["小", "中", "大"] }
      ],
      specification: "",
      arr2: "",
      attr_values: [],
      //是否为折扣商品
      goods_type: ""
    };
  },
  created() {
    this.id_type = JSON.parse(sessionStorage.getItem("ginfo"));
    // this.ids = JSON.parse(sessionStorage.getItem("ginfo")).gid;
    // this.gtype = JSON.parse(sessionStorage.getItem("ginfo")).gtype;
    this.ids = this.$route.query.goods_id;
    this.gtype = this.$route.query.module_type;
    this.getinfo();
    // this.attr();
  },
  watch: {
    // b() {
    //   console.log(this.b);
    // }
  },
  methods: {
    //商品规格
    // attr() {
    //   let arr1 = [];
    //   // let arr2 = [];
    //   this.attr_values.forEach((item, i, arr) => {
    //     arr1.push(item.title, "(");
    //     item.child.forEach((size, s, arrs) => {
    //       arr1.push(size, "、");
    //       // console.log(arr1);
    //     });
    //     arr1.pop();
    //     arr1.push(")" + ",");
    //   });

    //   this.specification = arr1.join("").slice(0, -1);
    //   // arr2.push(this.a)
    //   this.arr2 = this.specification.split(",");
    //   console.log(this.arr2);
    // },
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //详情信息
    getinfo() {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/storeGoodsDetail",
        params: {
          goods_id: this.id_type.gid,
          module_type: this.id_type.gtype
        }
      }).then(res => {
        //商品详情图片
        if (res.data.data.detail_image) {
          this.imgdetailarr = res.data.data.detail_image.slice(0, 3);
        }
        //商品图片
        if (res.data.data.cover_image) {
          this.imgarr = res.data.data.cover_image.slice(0, 3);
        }
        //商品规格
        if (res.data.data.attr_values) {
          this.attr_values = res.data.data.attr_values;
        }
        this.shop_info = res.data.data.shop_info;
        this.goods_info = res.data.data;
        //是否为折扣商品
        this.goods_type = res.data.data.goods_type;
        // console.log(this.attr_values, "返回的商品规格");
        // console.log(this.imgdetailarr,'商品详情图片');
        // console.log(this.imgarr,'商品');

        // this.attr_values = res.data.data.attr_values;
        // let arr = [];
        // res.data.data.attr_values.forEach(item => {
        //   arr.push(item.key, "(", item.value , ")", ",");
        //   //  arr.push("("+item.value+","+")")
        // });
        // this.attr_values = arr.join("").slice(0, -1);
        // console.log(res.data.data);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.labeldetails-wapper {
  h1 {
    margin: 10px 0 35px 0;
    height: 29px;
    font-size: 22px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  .common {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
  }
  .common2 li {
    // height: 21px;
    // width: 500px;
    width: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 20px;
    line-height: 21px;
    span {
      color: #333;
      font-size: 16px;
    }
    p {
      overflow: hidden;
      // width: 412px;
      img {
        width: 84px;
        height: 84px;
        background: #ccc;
        margin-right: 20px;
        // margin-bottom: 20px;
        border-radius: 2px;
      }
    }
  }
  .common2 li span:nth-child(1) {
    width: 110px;
    text-align: left;
    color: #666;
    font-size: 16px;
    margin-right: 20px;
  }
  .common3 li span:nth-child(1) {
    width: 140px;
    text-align: left;
    color: #666;
    font-size: 16px;
    margin-right: 20px;
  }

  h2 {
    // width: 91px;
    height: 29px;
    font-size: 22px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
    margin-bottom: 26px;
    i {
      display: block;
      width: 34px;
      height: 2px;
      background: rgba(67, 113, 232, 1);
      border-radius: 1px;
      margin-top: 1px;
    }
  }
  .labelinfo {
    width: fit-content;
    min-height: 679px;
  }
  .waimaiinfo {
    // width: 480px;
    min-width: 480px;
    // max-width: 600px;
    width: fit-content;
    min-height: 546px;
  }
}
</style>

