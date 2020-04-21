<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>广告管理</el-breadcrumb-item>
      <el-breadcrumb-item v-show="type==1">推荐专区（外卖）</el-breadcrumb-item>
      <el-breadcrumb-item v-show="type==2">推荐专区（商城）</el-breadcrumb-item>
      <el-breadcrumb-item v-show="type==3">推荐专区（团购）</el-breadcrumb-item>
      <el-breadcrumb-item v-show="type==4">首页广告</el-breadcrumb-item>
      <el-breadcrumb-item>广告详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>广告详情</h1>
    <div class="detail common">
      <h2>基本信息</h2>
      <div class="common2">
        <li>
          <span>审核状态：</span>
          <span v-show="advstatus==0" style="color:#F85A5A">待支付</span>
          <span v-show="advstatus==1" style="color:#F85A5A">待审核</span>
          <span v-show="advstatus==2" style="color:#F85A5A">审核通过</span>
          <span v-show="advstatus==-1" style="color:#F85A5A">已驳回</span>
        </li>
        <li>
          <span>广告状态：</span>
          <span v-show="advert_status==1">待开始</span>
          <span v-show="advert_status==2">已结束</span>
          <span v-show="advert_status==3">进行中</span>
          <span v-show="advert_status!=1&&advert_status!=2&&advert_status!=3">--</span>
        </li>
        <li>
          <span>退款状态：</span>
          <span v-show="refund_status==0" style="color:#F85A5A">未申请</span>
          <span v-show="refund_status==1" style="color:#F85A5A">申请中</span>
          <span v-show="refund_status==2" style="color:#F85A5A">同意</span>
          <span v-show="refund_status==3" style="color:#F85A5A">拒绝</span>
          <span v-show="refund_status!=0&&refund_status!=1&&refund_status!=2&&refund_status!=3">--</span>
        </li>
        <li>
          <span>店铺名称：</span>
          <span>{{shop_title}}</span>
        </li>
        <li>
          <span>店铺经营品类：</span>
          <span>{{shop_category}}</span>
        </li>
        <li>
          <span>订单编号：</span>
          <span>{{orderID}}</span>
        </li>
        <li>
          <span>订单创建时间：</span>
          <span>{{create_time}}</span>
        </li>
        <li v-show="apply_time">
          <span>重新提交申请时间：</span>
          <span>{{apply_time}}</span>
        </li>
        <li v-show="advstatus==-1">
          <span>驳回原因：</span>
          <span>{{reject_reason}}</span>
        </li>
        <li>
          <span>购买天数：</span>
          <span>{{day_count}}</span>
        </li>
        <li>
          <span>广告时间：</span>
          <div class="advtime">
            <span v-for="(item,i) in advert_time" :key="i">{{item.advert_day}}</span>
          </div>
        </li>
        <li>
          <span>支付方式：</span>
          <span>{{pay_type_name?pay_type_name:'--'}}</span>
        </li>
        <li>
          <span>实付金额：</span>
          <span>{{pay_fee}}</span>
        </li>
        <li>
          <span>上架商品：</span>
          <span v-show="goods_data.length==0">无</span>
        </li>
        <div class="goods" v-for="(item,i) in goods_data" :key="i">
          <a :href="item.goods_image" target="_bank" style="display:flex">
            <img :src="item.goods_image" />
          </a>
          <div class="price">
            <p class="p1">{{item.goods_title}}</p>
            <p class="p2">￥{{item.goods_sale_price}}</p>
          </div>
          <div class="edit" v-show="advstatus==1||advstatus==2">
            <i class="el-icon-edit" @click="editGoods(item.goods_id)"></i>
          </div>
        </div>
        <li style="margin-top: 30px;">
          <span style="width:fit-content">上传广告封面图</span>
          <span style="color:#999;font-size:16px;">(点击图片可修改上传封面图)</span>
        </li>
        <div v-show="type==4" class="faceimg" @click="openFaceinfo">
          <img :src="face_img" />
        </div>
      </div>
    </div>

    <!--  审核条件  v-show="advstatus==1"-->
    <section class="sdiv2" v-show="advstatus==1">
      <span class="s1">审核情况</span>
      <el-radio-group v-model="radio" @change="pass_refuse">
        <el-radio :label="1">审核通过</el-radio>
        <el-radio :label="2">驳回申请</el-radio>
      </el-radio-group>
      <p v-show="advstatus==-1">审核被驳回</p>
      <p v-show="advstatus==2">审核通过</p>
      <!-- <p v-show="status2==0">资料待完善</p> -->
    </section>
    <div class="re_input" v-if="radio==2">
      <el-input v-model="re_input" placeholder="请输入驳回理由" clearable></el-input>
    </div>
    <!-- 退款 -->
    <section class="sdiv2" v-show="advstatus==-1&&refund_status==1">
      <span class="s1">审核情况</span>
      <el-radio-group v-model="radio2" @change="pass_refuse2">
        <el-radio :label="1">同意退款</el-radio>
        <el-radio :label="2">拒绝退款</el-radio>
      </el-radio-group>
    </section>
    <div class="re_input" v-if="radio2==2">
      <el-input v-model="re_input2" placeholder="请输入拒绝原因" clearable></el-input>
    </div>
    <!-- 按钮 -->
    <div class="btn">
      <el-button
        v-show="advstatus==1"
        type="primary"
        :disabled="radio!=1&&radio!=2"
        style="margin-right:20px;"
        @click="submit"
      >提 交</el-button>
      <el-button
        v-show="advstatus==-1&&refund_status==1"
        type="primary"
        :disabled="radio2!=1&&radio2!=2"
        style="margin-right:20px;"
        @click="submit2"
      >提 交</el-button>
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>

    <!-- 编辑弹窗 -->
    <div class="dias" v-if="dialogFormVisible">
      <el-dialog
        title="查看&编辑商品信息"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        width="fit-content"
        custom-class="dialog"
        @close="cancel"
      >
        <div class="goodsinfo">
          <li>
            <span>商品名称：</span>
            <span>{{goods_title}}</span>
          </li>
          <li>
            <span>商品分类：</span>
            <span>{{goods_category}}</span>
          </li>
          <li>
            <span>商品主图:</span>
            <span style="color:#9A9797;font-size: 12px;">图片需要大于600×450像素，最多可上传10张照片，第一张为商品主图</span>
          </li>
          <li class="uploadimg">
            <el-upload
              v-show="imgurl? 0:1"
              action
              list-type="picture-card"
              :on-change="onChange"
              :class="{hide1:hideUpload}"
              :on-remove="handleRemove"
              :auto-upload="false"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="imgurl? '':dialogImageUrl" />
            </el-dialog>
            <div class="del" v-show="imgurl? 1:0">
              <img :src="imgurl" class="imgs" />
              <p class="bg"></p>
              <i class="el-icon-delete" @click="delimg"></i>
            </div>
          </li>
          <li style="border:none">
            <span>特别说明:</span>
            <span>{{goods_desc?goods_desc:'无'}}</span>
          </li>
          <!-- <li style="padding-top:0">
            <span style="width:485px; ">{{goods_desc?goods_desc:'无'}}</span>
          </li>-->
          <li style="border:none;font-weight:bold;">
            <span style="color:#333">售卖信息</span>
          </li>
          <li>
            <span>参与拼团</span>
            <span>{{goods_pink==0?'否':'是'}}</span>
            <!-- <el-switch :value="goods_pink==0?false:true" disabled></el-switch> -->
          </li>
          <li style=" align-items: flex-start">
            <span>商品规格：</span>
            <div class="size">
              <div class="sizelist" v-for="(item,i) in goods_sku_list" :key="i">
                <span style="font-weight: bold;color:#333">￥{{item.sku_sale_price}}</span>
                <span>规格：{{item.sku_title}}</span>
                <span>库存：{{item.sku_stock}}</span>
              </div>
            </div>
          </li>
          <li>
            <span>商品单位：</span>
            <span>份</span>
          </li>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="savegoods">保 存</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 编辑封面图 -->
    <div class="dias2" v-show="dialogfaceimg">
      <el-dialog
        title="修改广告封面图片"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :visible.sync="dialogfaceimg"
        width="fit-content"
        custom-class="dialog"
        @close="cancel2"
      >
        <el-upload
          action
          list-type="picture-card"
          :on-change="onChange2"
          :class="{hide2:hideUpload2}"
          :on-remove="handleRemove2"
          :auto-upload="false"
          :limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible2">
          <img width="100%" :src="dialogImageUrl2" />
        </el-dialog>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel2">取 消</el-button>
          <el-button type="primary" @click="saveface">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getBase64, getsrc } from "../../utils/base64.js";
export default {
  data() {
    return {
      type: null,
      orderID: null,
      radio: "",
      radio2: "",
      advDetail: null,
      advstatus: null, //审核状态
      advert_status: null, //广告状态
      refund_status: null, //退款状态
      shop_title: null,
      shop_category: null,
      create_time: null,
      day_count: null,
      pay_type_name: null,
      pay_fee: null,
      adv_time: null,
      goods_data: [],
      re_input: "", //审核
      re_input2: "", //退款
      reject_reason: null,
      dialogFormVisible: false,
      value1: true,
      //
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      imgurl: "",
      dialogImageUrl: "",
      photo_url: "",
      dialogVisible2: false, //是否显示
      hideUpload2: false, //是否显示图标
      limitCount2: 1, //最大数量
      dialogImageUrl2: "",

      //商品信息
      goods_pink: null,
      goods_category: null,
      goods_title: null,
      goods_unit: null,
      goods_cover_image: null,
      goods_desc: null,
      goods_sku_list: null,
      goods_id: "",
      goods_detail_image: null,
      //封面图
      face_img: null,
      dialogfaceimg: false,
      faceImg: ""
    };
  },

  created() {
    this.orderID = this.$route.query.orderID;
    this.type = this.$route.query.type;
    this.advertDetail();
  },
  watch: {
    faceImg() {
      console.log(this.faceImg);
    }
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //审核
    pass_refuse(val) {
      console.log(val);
    },
    //退款
    pass_refuse2(val) {
      console.log(val);
    },
    //广告申请详情 /backend/Advert/advertDetail
    advertDetail() {
      this.$axios({
        method: "GET",
        url: "/backend/Advert/advertDetail",
        params: {
          apply_id: this.orderID
        }
      }).then(res => {
        if (res.data.status == 1) {
          console.log(res.data, "详情");
          this.advDetail = res.data.data;
          this.advstatus = res.data.data.status;
          this.advert_status = res.data.data.advert_status;
          this.refund_status = res.data.data.refund_status;
          this.shop_title = res.data.data.shop_title;
          this.shop_category = res.data.data.shop_category;
          this.create_time = res.data.data.create_time;
          this.day_count = res.data.data.day_count;
          this.pay_type_name = res.data.data.pay_type_name;
          this.pay_fee = res.data.data.pay_fee;
          this.reject_reason = res.data.data.reject_reason;
          this.goods_data = res.data.data.goods_data; //上架商品
          this.apply_time = res.data.data.apply_time; //重新申请时间
          this.advert_time = res.data.data.advert_time; //广告时间
          this.face_img = res.data.data.image;
          // console.log(this.goods_data);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //提交
    submit() {
      if (this.radio == 1) {
        this.advertApproval(this.orderID, 1, null);
      }
      if (this.radio == 2) {
        if (this.re_input) {
          this.advertApproval(this.orderID, 2, this.re_input);
        } else {
          this.$message.error("请填写驳回理由!!");
        }
      }
    },
    //审批广告申请 /backend/Advert/advertApproval
    advertApproval(id, type, reason) {
      this.$axios({
        method: "POST",
        url: "/backend/Advert/advertApproval",
        data: {
          apply_id: id,
          approval_type: type,
          reject_reason: reason
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.advertDetail();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    // 拒绝退款
    submit2() {
      if (this.radio2 == 1) {
        this.reject_advert(this.orderID, "/backend/Advert/advertRefund", null);
      }
      if (this.radio2 == 2) {
        if (this.re_input2) {
          this.reject_advert(
            this.orderID,
            "/backend/Advert/rejectRefund",
            this.re_input2
          );
        } else {
          this.$message.error("请填写拒绝原因!!");
        }
      }
    },
    //广告同意退款 /backend/Advert/advertRefund    广告拒绝退款 /backend/Advert/rejectRefund
    reject_advert(id, url, reason) {
      this.$axios({
        method: "POST",
        url: url,
        data: {
          apply_id: id,
          reject_reason: reason
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.advertDetail(1);
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //编辑商品
    editGoods(gid) {
      // console.log("编辑商品弹窗");
      this.dialogFormVisible = true;
      this.goods_id = gid;
      //广告商品详情 /backend/Advert/advertGoodsInfo
      this.$axios({
        method: "GET",
        url: "/backend/Advert/advertGoodsInfo",
        params: {
          apply_id: this.orderID,
          goods_id: gid
        }
      }).then(res => {
        if (res.data.status == 1) {
          console.log(res.data.data, "sssssssssssssss");
          this.goods_pink = res.data.data.goods_pink;
          this.goods_category = res.data.data.goods_category;
          this.goods_title = res.data.data.goods_title;
          this.goods_cover_image = res.data.data.goods_cover_image;
          this.goods_desc = res.data.data.goods_desc;
          this.goods_sku_list = res.data.data.goods_sku_list;
          this.goods_detail_image = res.data.data.goods_detail_image;
          this.imgurl = res.data.data.goods_cover_image[0];
        }
      });
    },
    cancel() {
      this.dialogFormVisible = false;
      this.goods_id = "";
      // this.imgurl = "";
      this.img = "";
    },
    //选择图片后触发的事件
    onChange(file, fileList) {
      console.log(fileList);
      fileList.forEach(item => {
        getBase64(item.raw).then(res => {
          this.$axios({
            method: "POST",
            url: "/backend/SystemSetting/uploadAvatar",
            data: {
              image: res
            }
          }).then(res => {
            console.log(res.data.data);
            this.img = res.data.data.url;
          });
        });
      });
      this.dialogImageUrl = file.url;
      this.hideUpload = fileList.length >= this.limitCount;
    },
    //删除图片出发的事件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.hideUpload = fileList.length >= this.limitCount;
    },
    //删除编辑图片
    delimg() {
      this.imgurl = "";
      this.img = "";
    },
    onChange2(file, fileList) {
      console.log(fileList);
      fileList.forEach(item => {
        getBase64(item.raw).then(res => {
          this.$axios({
            method: "POST",
            url: "/backend/SystemSetting/uploadAvatar",
            data: {
              image: res
            }
          }).then(res => {
            console.log(res.data.data);
            this.faceImg = res.data.data.url;
          });
        });
      });
      this.dialogImageUrl2 = file.url;
      this.hideUpload2 = fileList.length >= this.limitCount2;
    },
    //删除图片出发的事件
    handleRemove2(file, fileList) {
      console.log(file, fileList);
      this.hideUpload2 = fileList.length >= this.limitCount2;
    },
    //修改广告商品 /backend/Advert/advertGoodsEdit
    savegoods() {
      let str = this.goods_detail_image.join(",");
      this.$axios({
        method: "POST",
        url: "/backend/Advert/advertGoodsEdit",
        params: {
          apply_id: this.orderID,
          goods_id: this.goods_id,
          goods_cover_image: this.img ? this.img : this.imgurl,
          goods_detail_image: str
        }
      }).then(res => {
        if (res.data.status == 1) {
          // console.log(res.data.data, "");
          this.advertDetail();
          this.dialogFormVisible = false;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //修改封面图
    openFaceinfo() {
      if (this.advstatus == 1) {
        this.dialogfaceimg = true;
        this.hideUpload2 = false;
      }else{
        this.$message.error("审核通过和被驳回不能修改")
      }
    },
    cancel2() {
      this.dialogfaceimg = false;
      this.dialogImageUrl2 = "";
      this.faceImg = "";
    },
    //广告申请修改 /backend/Advert/advertEdit
    saveface() {
      if (this.faceImg) {
        this.$axios({
          method: "POST",
          url: "/backend/Advert/advertEdit",
          data: {
            apply_id: this.orderID,
            image: this.faceImg
          }
        }).then(res => {
          if (res.data.status == 1) {
            this.advertDetail();
            this.dialogfaceimg = false;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } else {
        this.$message.error("请选择修改图片");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin-top: 10px;
  height: 29px;
  font-size: 22px;
  font-family: Microsoft YaHei;
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
  .faceimg {
    width: fit-content;
    cursor: pointer;

    img {
      width: 340px;
      height: 90px;
      border-radius: 4px;
    }
  }
  h2 {
    width: 135px;
    height: 29px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
    margin-bottom: 14px;
  }
  .common2 li {
    font-size: 16px;
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-bottom: 20px;
    line-height: 21px;
  }
  .common2 li span:nth-child(1) {
    width: 155px;
    text-align: left;
    color: #333;
    font-size: 16px;
    letter-spacing: 1px;
    margin-right: 20px;
  }
  .common2 li span:nth-child(2) {
    color: #333;
    font-size: 16px;
  }
  .common2 .advtime {
    display: flex;
    flex-direction: column;
    span {
      margin-bottom: 4px;
    }
  }
  .common2 .goods {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    height: 76px;
    margin-bottom: 20px;
    img {
      width: 76px;
      height: 76px;
      border-radius: 4px;
      background: #ccc;
      margin-right: 10px;
    }
    .price {
      height: 60px;
      width: fit-content;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .p1 {
        font-size: 12px;
        color: #666;
        min-width: 220px;
        line-height: 18px;
      }
      .p2 {
        width: fit-content;
        font-size: 14px;
        color: #fb2c2c;
        // margin-top: 20px;
      }
    }
    .edit {
      font-size: 18px;
      i {
        cursor: pointer;
        color: #4371e8;
      }
    }
  }
}

.detail {
  width: 570px;
  //   height: 675px;
  margin-top: 28px;
}
.sdiv2 {
  padding-left: 10px;
  background: #ffffff;
  width: 345px;
  border: 1px solid rgba(241, 241, 241, 1);
  box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
  margin-top: 30px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .s1 {
    height: 24px;
    font-size: 18px;
    line-height: 24px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    margin-right: 20px;
  }
  p {
    margin-left: 50px;
    height: 16px;
    font-size: 16px;
    color: #666;
  }
}
.re_input {
  display: flex;
  margin-top: 20px;
  width: 250px;
  span {
    font-size: 16px;
    color: #333;
    margin-left: 10px;
  }
}
.btn {
  // width: 300px;
  margin: 50px 0 20px 0;
  display: flex;
  align-items: center;
}
</style>



<style lang="scss" >
.dias {
  .dialog {
    .el-dialog__header {
      position: relative;
      height: 70px;
      .el-dialog__title {
        font-weight: bold;
        letter-spacing: 1px;
        position: absolute;
        top: 32px;
        left: 30px;
        font-size: 18px;
      }
    }
    .el-dialog__body {
      padding: 10px 30px 5px 30px;
      i {
        font-size: 16px;
        margin-right: 10px;
        // color: #333;
      }
      .gruop {
        display: flex;
        margin-bottom: 12px;
        span {
          margin-right: 12px;
        }
        .el-input {
          width: 80px;
          margin-right: 10px;
        }
        .el-input__inner {
          width: 80px;
        }
      }
      .el-input {
        width: 248px;
        margin-right: 10px;
      }
      .el-input__inner {
        width: 248px;
      }
      .el-form-item__label {
        color: #333;
      }

      .el-form-item__content {
        display: flex;
        flex-wrap: wrap;
        // align-items: center;
      }
      .el-form-item__label {
        font-size: 0.16rem;
      }
      .uploadimg {
        .del:hover i {
          display: block;
        }
        .del:hover .bg {
          display: block;
        }
        .del {
          position: relative;
          width: 76px;
          height: 76px;
          .imgs {
            width: 76px;
            height: 76px;
            border: 1px solid #dddbdb;
            border-radius: 5px;
          }
          .bg {
            width: 76px;
            height: 76px;
            position: absolute;
            top: 0;
            left: 0;
            background: #606266;
            z-index: 2;
            display: none;
            opacity: 0.5;
          }
          i {
            display: none;
            cursor: pointer;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            color: #fff;
            z-index: 3;
          }
        }
        .el-upload-list__item {
          width: 76px;
          height: 76px;
          border: 1px solid #dddbdb;
        }
        // 图片宽高
        .el-upload--picture-card {
          width: 76px;
          height: 76px;
          line-height: 76px;
        }
        .el-icon-plus {
          font-size: 0.2rem;
        }
        // .hide1 {
        //   height: 64px;
        // }
        //超过限制数量添加类命
        .hide1 .el-upload {
          display: none;
        }
      }
    }
    .goodsinfo {
      li {
        // height: 35px;

        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #ece9e9;
        img {
          width: 76px;
          height: 76px;
          border-radius: 4px;
          background: #ccc;
        }
        // line-height: 35px;
        span {
          color: #666666;
          letter-spacing: 1px;
          font-size: 14px;
          &:nth-child(1) {
            width: 80px;
          }
          &:nth-child(2) {
            // width: 80px;
            line-height: 16px;
          }
        }
        .size {
          .sizelist {
            display: flex;
            flex-direction: column;
            margin-bottom: 12px;
            span {
              margin-bottom: 4px;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.dias2 {
  .dialog {
    .el-dialog__header {
      position: relative;
      height: 70px;
      .el-dialog__title {
        font-weight: bold;
        letter-spacing: 1px;
        position: absolute;
        top: 32px;
        left: 30px;
        font-size: 18px;
      }
    }
    .el-dialog__body {
      padding: 10px 30px 5px 30px;
      i {
        font-size: 16px;
        margin-right: 10px;
        // color: #333;
      }
      .el-form-item__label {
        color: #333;
      }

      .el-form-item__content {
        display: flex;
        flex-wrap: wrap;
        // align-items: center;
      }
      .el-form-item__label {
        font-size: 0.16rem;
      }
      .el-upload-list__item {
        width: 340px;
        height: 90px;
        border: 1px solid #dddbdb;
      }
      // 图片宽高
      .el-upload--picture-card {
        width: 340px;
        height: 90px;
        line-height: 90px;
      }
      .el-icon-plus {
        font-size: 0.2rem;
      }
      //超过限制数量添加类命
      .hide2 .el-upload {
        display: none;
      }
    }
  }
}
</style>
