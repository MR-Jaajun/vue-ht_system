<template>
  <div class="autotrophyDetail">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>活动专区</el-breadcrumb-item>
      <el-breadcrumb-item>秒杀专区</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!--设置弹窗  -->
    <el-dialog title="提示" :visible.sync="dialogFormVisible" custom-class="dialog">
      <p class="dialog_p" v-show="type==1">请设置上架价格，上架价格要大于协议价！</p>
      <div class="dialog_input">
        <span class="span" v-show="type==1">上架价格：</span>
        <span style="width:100px" v-show="type==0">副标题：</span>
        <el-input v-model="set" placeholder="请输入内容" clearable></el-input>
      </div>
      <div slot="title" class="header-title">
        <span v-show="title">{{ title }}</span>
        <span></span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-show="type==0" type="primary" @click="setConfirm(0) ">确 定0</el-button>
        <el-button v-show="type==1" type="primary" @click="setConfirm(1) ">确 定1</el-button>
      </div>
    </el-dialog>
    <div class="goods">
      <!-- 基本信息 -->
      <div class="info" style="border-bottom:0">
        <div class="title">基本信息</div>
        <div class="infos">
          <div class="basic_info">
            <span>商品状态：</span>
            <span
              :style="{color:base_info.goods_inner_status==-1?'#F85353':'#333333'}"
            >{{base_info.goods_inner_status==-1?'未上架':'已上架'}}</span>
          </div>
          <div class="basic_info">
            <span>商品名称：</span>
            <span>{{base_info.goods_name}}</span>
          </div>
          <div class="basic_info">
            <span>副标题：</span>
            <span>{{base_info.goods_subtitle}}</span>
            <img src="../../assets/img/icon_bianji.png" @click="setTitle('编辑商品副标题','0')" />
          </div>
          <div class="basic_info">
            <span>商品分类：</span>
            <span>{{base_info.goods_cate_name}}</span>
          </div>
          <div class="basic_info" style="flex-direction: column;">
            <span style="margin-bottom:19px;">主图：</span>
            <div class="main_img">
              <a
                :href="item"
                target="_blank"
                v-for="(item,i) in base_info.goods_image"
                :key="i"
                v-show="isarr"
              >
                <img :src="item" />
              </a>
              <a :href="base_info.goods_image" target="_blank" v-show="!isarr">
                <img :src="base_info.goods_image" />
              </a>
            </div>
          </div>
          <div class="basic_info" style="flex-direction: column;">
            <span style="margin-bottom:20px;">附图：</span>
            <div class="main_img">
              <img v-for="(item,i) in base_info.goods_cover_image" :key="i" :src="item" />
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
            <div class="txt" v-html="detailed_info.goods_shouhou">{{detailed_info.goods_shouhou}}</div>
          </div>
        </div>
      </div>
      <!-- 售卖信息 -->
      <div class="info3">
        <div class="title">售卖信息</div>
        <div class="infos3">
          <!--商品规格  -->
          <div class="info3_div" v-for="(item, index) in sale_info.goods_sku_data" :key="index">
            <div class="info3_div_title">商品规格：{{item.sku_title}}</div>
            <div class="info3_div_right">
              <div class="ginfo">
                <div class="price">
                  <span>京东价：</span>
                  <span>{{item.jd_price}}</span>
                </div>
                <div class="price">
                  <span>协议价：</span>
                  <span>{{item.jd_treaty_price}}</span>
                </div>
                <div class="price">
                  <span>上架价格：</span>
                  <span>
                    {{item.sku_sale_price}}
                    <!-- <img
                    src="../../assets/img/icon_bianji.png"
                    @click="setTitle('提示','1',item.id)"
                    />-->
                  </span>
                </div>
                <div class="price">
                  <span>秒杀价：</span>
                  <span>{{item.sku_seckill_price}}</span>
                </div>
              </div>
              <div class="ginfo">
                <div class="price">
                  <span>秒杀折扣：</span>
                  <span>{{item.promotion_discount}}</span>
                </div>
                <div class="price">
                  <span>库存量：</span>
                  <span style="color:#333333">{{item.sku_sales}}</span>
                </div>
                <div class="price">
                  <span>基础销量：</span>
                  <span style="color:#333333"></span>
                </div>
                <div class="price">
                  <span>实际销量：</span>
                  <span style="color:#333333"></span>
                </div>
              </div>
            </div>
          </div>
          <!-- 规格-->
          <section class="sizetitle">
            <div class="detail">
              <div class="s_title">产品规格：</div>
              <div class="s_detail"></div>
            </div>
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
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      set: "",
      type: "",
      goods_subtitle: "",
      title: "",
      isarr: true,
      goods_id: null,
      base_info: "",
      detailed_info: "",
      sale_info: "",
      dialogFormVisible: false,
      goods_sku_ids: ""
    };
  },
  created() {
    this.goods_id = this.$route.query.id;
    this.seckill_scene_id = this.$route.query.seckill_scene_id;
  },
  mounted() {
    this.details();
  },
  methods: {
    //设置
    setTitle(txt, type, id) {
      if (type == 1) {
        this.goods_sku_ids = id;
      }
      this.dialogFormVisible = true;
      this.title = txt;
      this.type = type;
    },
    //弹窗确定
    setConfirm(type) {
      // 副标题设置/backend/JdGoods/ptGoodsSubtitle
      if (type == 0) {
        this.$post("/backend/JdGoods/ptGoodsSubtitle", {
          goods_id: this.goods_id,
          goods_subtitle: this.set
        }).then(res => {
          if (res.data.status == 1) {
            this.$message.success(res.data.msg);
            this.details();
            this.set = "";
          } else {
            this.$message.error("设置失败");
          }
        });
      }
      if (type == 1) {
        this.$post("/backend/JdGoods/ptGoodsSkuPrice", {
          goods_id: this.goods_id,
          goods_sku_ids: this.goods_sku_ids,
          goods_sku_prices: this.set
        }).then(res => {
          if (res.data.status == 1) {
            this.$message.success(res.data.msg);
            this.details();
            this.set = "";
          } else {
            this.$message.error("设置失败");
          }
        });
      }
    },
    // 获取秒杀商品详情
    details() {
      this.$get("/backend/JdPromotion/secKillGoodsInfo", {
        seckill_scene_id: this.seckill_scene_id,
        seckill_goods_id: this.goods_id
      }).then(res => {
        const { base_info, detailed_info, sale_info } = res.data.data;
        if (typeof base_info.goods_image == "string") {
          this.isarr = false;
        } else {
          this.isarr = true;
        }
        this.base_info = base_info;
        this.detailed_info = detailed_info;
        this.sale_info = sale_info;
        console.log(this.sale_info, "this.sale_info");
      });
    },
    //返回上一页
    backdown() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.goods {
  // min-width: 1500px;
  margin-top: 20px;
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
          font-size: 16px;
          font-weight: 400;
          line-height: 30px;
        }
        .main_img {
          display: flex;
          justify-content: flex-start;
          img {
            width: 110px;
            height: 105px;
            border-radius: 4px;
            background: #ccc;
            margin-right: 10px;
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
    display: flex;
    max-width: 1247px;
    border: 1px solid rgba(204, 204, 204, 1);
    border-bottom: 0;
    .title {
      display: flex;
      width: 244px;
      font-size: 22px;
      justify-content: center;
      // margin-top: 15%;
      align-items: center;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 1px;
      border-bottom: 1px solid #cccccc;
    }
    .infos3 {
      display: flex;
      flex: 1;
      font-size: 16px;
      padding: 0;
      flex-direction: column;
      border-left: 1px solid rgba(204, 204, 204, 1);
      .info3_div {
        display: flex;
        height: 90px;
        .info3_div_title {
          width: 250px;
          border-right: 1px solid #ccc;
          border-bottom: 1px solid #cccccc;
          line-height: 90px;
          color: #333333;
          font-weight: bold;
          padding-left: 28px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .info3_div_right {
          .ginfo {
            display: flex;
            width: 750px;
            flex: 1;
            height: 50%;
            align-items: center;
            padding: 5px 0 5px 28px;
            border-bottom: 1px solid #cccccc;
            .price {
              display: flex;
              margin-right: 50px;
              // .price_span{
              //   text-align: center;
              //   line-height: 27px;
              // }
              span {
                &:nth-child(1) {
                  color: #333333;
                  font-weight: bold;
                }
                &:nth-child(2) {
                  color: #f32727;
                  font-weight: 400;
                  display: flex;
                  justify-content: center;
                  align-content: center;
                  img {
                    margin-left: 10px;
                    width: 18px;
                    height: 17px;
                  }
                }
              }
            }
          }
        }
      }
      .sizetitle {
        color: #333333;
        font-weight: bold;
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
}

.btn {
  display: flex;
  margin: 40px 0 40px 0;
}
</style>
<style lang="scss">
.info_table {
  tr {
    height: 45px;
    border-bottom: 1px solid #ccc;
    &:nth-child(2) {
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
    //   // border-bottom: 0;
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
.autotrophyDetail {
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
  .header-title {
    line-height: 0.24rem;
    font-size: 0.18rem;
    color: #303133;
    position: absolute;
    top: 0.2rem;
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
</style>
