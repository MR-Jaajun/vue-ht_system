<template>
  <div class="goodsdetail">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>京东商品池</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>查看商品</h1>
    <div class="goods">
      <!-- 基本信息 -->
      <div class="info" style="border-bottom:0">
        <div class="title">基本信息</div>
        <div class="infos">
          <div class="basic_info">
            <span>商品状态：</span>
            <span
              :style="{color:base_info.goods_jb_status==0?'#F85353':'#333333'}"
            >{{base_info.goods_jb_status==0?'未上架':'已上架'}}</span>
          </div>
          <div class="basic_info">
            <span>商品名称：</span>
            <span>{{base_info.goods_name}}</span>
          </div>
          <div class="basic_info">
            <span>商品分类：</span>
            <span>{{base_info.goods_cate_name}}</span>
          </div>
          <div class="basic_info" style="flex-direction: column;">
            <span style="margin-bottom:19px;">主图：</span>
            <div class="main_img">
              <a :href="base_info.goods_image" target="_blank">
                <img :src="base_info.goods_image" />
              </a>
            </div>
          </div>
          <!--  v-show="base_info.goods_cover_image.length>0" -->
          <div class="basic_info" style="flex-direction: column;">
            <span style="margin-bottom:20px;">附图：</span>
            <div class="main_img">
              <a
                v-for="(item,i) in base_info.goods_cover_image"
                :key="i"
                :href="item"
                target="_blank"
              >
                <img :src="item" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- 商品详情 -->
      <div class="info info2">
        <div class="title">商品详情</div>
        <div class="infos">
          <div class="basic_info">
            <span style="margin-bottom:19px;">商品详细介绍：</span>
            <div
              class="txt"
              v-html="detailed_info.goods_appintroduce"
            >{{detailed_info.goods_appintroduce}}</div>
          </div>
          <div class="basic_info" style="margin-bottom:0px;">
            <span style="margin-bottom:19px;">售后详情：</span>
            <div class="txt" v-html="detailed_info.goods_shouhou?detailed_info.goods_shouhou:'无'"></div>
          </div>
        </div>
      </div>
      <!-- 售卖信息 -->
      <div class="info info3">
        <div class="title">售卖信息</div>
        <div class="infos">
          <div class="ginfo">
            <div class="price">
              <span>京东价：</span>
              <span>￥{{sale_info.goods_jd_price}}</span>
            </div>
            <div class="price">
              <span>协议价：</span>
              <span>￥{{sale_info.goods_price}}</span>
            </div>
            <div class="price" v-show="sale_info.goods_rebate">
              <span>折扣数：</span>
              <span>{{sale_info.goods_rebate}}</span>
            </div>
          </div>
          <div class="ginfo">
            <div class="price">
              <span>库存量：</span>
              <span style="color:#333333">{{sale_info.goods_stock}}</span>
            </div>
          </div>
          <div class="ginfo">
            <div class="price">
              <span>基础销量：</span>
              <span style="color:#333333">{{sale_info.goods_base_sale}}</span>
            </div>
            <div class="price">
              <span>实际销量：</span>
              <span style="color:#333333">{{sale_info.goods_sale}}</span>
            </div>
          </div>
          <!-- 规格 -->
          <section class="ginfo sizetitle">
            <div>产品规格：</div>
          </section>
          <!-- <div class="detail">
            <div class="s_title">产区</div>
            <div class="s_detail">智利中央山谷</div>
          </div>
          <div class="detail">
            <div class="s_title">酒精度</div>
            <div class="s_detail">实物为准</div>
          </div>
          <div class="detail">
            <div class="s_title">保质期</div>
            <div class="s_detail">避光、卧放</div>
          </div>-->
          <div class="info_table" v-html="sale_info.goods_param"></div>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="btn">
      <el-button type="primary" v-show="goods_inner_status==-1&&goods_jb_status==1" @click="open">立即上架</el-button>
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isarr: true,
      sku_id: null,
      base_info: "",
      detailed_info: "",
      sale_info: "",
      goods_inner_status: ""
    };
  },
  created() {
    this.sku_id = this.$route.query.id;
    this.goodsInfo();
  },

  methods: {
    //京东商品详情 /backend/JdGoods/goodsInfo
    goodsInfo() {
      this.$axios({
        method: "GET",
        url: "/backend/JdGoods/goodsInfo",
        params: {
          sku: this.sku_id
        }
      }).then(res => {
        // console.log(res.data.data, "商品详情");
        const {
          data: { base_info, detailed_info, sale_info }
        } = res.data;
        // if (typeof base_info.goods_image == "string") {
        //   this.isarr = false;
        // } else {
        //   this.isarr = true;
        // }
        this.base_info = base_info;
        this.goods_inner_status = base_info.goods_inner_status;
        this.detailed_info = detailed_info;
        this.sale_info = sale_info;
      });
    },
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //打开弹窗
    open() {
      this.$confirm("您是否上架该商品？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.goodsAdd();
      });
    },
    //京东商品上架 /backend/JdGoods/goodsAdd
    goodsAdd() {
      this.$axios({
        method: "POST",
        url: "/backend/JdGoods/goodsAdd",
        data: {
          sku: this.sku_id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.goodsInfo();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin-top: 10px;
  margin-bottom: 28px;
  width: fit-content;
  height: 29px;
  font-size: 22px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 29px;
  color: rgba(51, 51, 51, 1);
}
.goods {
  // min-width: 1500px;
  display: flex;
  flex-direction: column;
  .info {
    max-width: 1247px;
    // height: 528px;
    border: 1px solid rgba(204, 204, 204, 1);
    .title {
      float: left;
      height: 528px;
      width: 244px;
      font-size: 22px;
      text-align: center;
      line-height: 528px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 1px;
    }
    .infos {
      min-height: 528px;
      border-left: 1px solid rgba(204, 204, 204, 1);
      width: 1001px;
      float: left;
      padding: 26px 28px;
      .basic_info {
        display: flex;
        margin-bottom: 20px;
        span {
          letter-spacing: 1px;
          &:nth-child(1) {
            color: #333333;
            font-size: 16px;
            font-weight: bold;
          }
          &:nth-child(2) {
            color: #666;
            font-size: 16px;
            font-weight: 400;
          }
        }
        .txt {
          color: #666;
          // background: #f9f9f9;
          font-size: 16px;
          font-weight: 400;
          line-height: 28px;
        }
        .main_img {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          img {
            width: 110px;
            height: 105px;
            border-radius: 4px;
            background: #ccc;
            margin-right: 10px;
            border: 1px solid #f1f1f1;
          }
        }
      }
    }
  }
  .info2 {
    // height: ;
    border-bottom: 0;
    .title {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .infos {
      // height: 362px;
      flex-direction: column;
      .basic_info {
        flex-direction: column;
        height: 100%;
      }
    }
  }
  .info3 {
    // height: 989px;
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .infos {
      font-size: 16px;
      // height: 988px;
      padding: 0;
      flex-direction: column;
      .ginfo {
        display: flex;
        height: 79px;
        align-items: center;
        padding: 0 28px;
        border-bottom: 1px solid #cccccc;
        .price {
          display: flex;
          margin-right: 130px;
          span {
            &:nth-child(1) {
              color: #333333;
              font-weight: bold;
            }
            &:nth-child(2) {
              color: #f32727;
              font-weight: 400;
            }
          }
        }
      }
      .sizetitle {
        height: 95px;
        color: #333333;
        font-weight: bold;
      }
      .detail {
        display: flex;
        height: 45px;
        border-bottom: 1px solid #ccc;
        .s_title {
          width: 150px;
          border-right: 1px solid #ccc;
          line-height: 45px;
          color: #333333;
          font-weight: bold;
          padding-left: 28px;
        }
        .s_detail {
          padding-left: 28px;
          color: #666;
          line-height: 45px;
        }
      }
    }
  }
}
.btn {
  display: flex;
  margin: 40px 0 40px 0;
}
</style>

<style lang="scss" scode>
.info_table {
  tr {
    height: 45px;
    border-bottom: 1px solid #ccc;
    // border-top: 1px solid #ccc;
    &:nth-child(2) {
      height: 0;
    }
    &:nth-child(5) {
      height: 0;
    }
    &:nth-child(8) {
      height: 0;
    }
    .tdTitle {
      width: 150px;
      height: 45px;
      text-align: left;
      padding-left: 28px;
      line-height: 45px;
      color: #333333;
      font-weight: bold;
    }
    // &:nth-last-child(1) {
    //   border-bottom: 0;
    // }
    td {
      font-size: 16px;
      line-height: 45px;
      &:nth-child(2) {
        padding-left: 28px;
        color: #666;
        border-left: 1px solid #ccc;
      }
    }
  }
}
</style>

