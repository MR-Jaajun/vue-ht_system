<!--
 * @Description: 
 * @LastEditors: jun
 * @LastEditTime: 2019-11-26 19:27:15
 -->
<template>
  <div class="comdeetails-wepper">
    <section>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>二维码列表</el-breadcrumb-item>
        <el-breadcrumb-item>商家详情</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <h1>商家详情</h1>
    <!-- 基本信息 -->
    <div class="account common">
      <h2>
        基本信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>状态</span>
          <span>{{freeze==0?'正常':'冻结'}}</span>
        </li>
        <li>
          <span>商户ID</span>
          <span>{{shop_id}}</span>
        </li>
        <li>
          <span>联系人</span>
          <span>{{contacts}}</span>
        </li>
        <li>
          <span>手机号</span>
          <span>{{contact_information}}</span>
        </li>
        <li>
          <span>推荐人ID</span>
          <span>{{custom_pid}}</span>
        </li>
        <li>
          <span>申请时间</span>
          <span>{{apply_time}}</span>
        </li>
        <li>
          <span>注册时间</span>
          <span>{{register_time}}</span>
        </li>
        <li>
          <span>最近登录时间</span>
          <span>{{last_login_time}}</span>
        </li>
        <li>
          <span>申请模块</span>
          <span v-show="module_bohui">{{module_bohui}}</span>
          <span v-show="module_shenhe">{{module_shenhe}}</span>
          <span v-show="module_tongguo">{{module_tongguo}}</span>
        </li>
      </div>
    </div>
    <!-- 店铺资料信息 -->
    <section class="dianpuxin common">
      <h2>
        店铺资料信息
        <i></i>
        <span @click="archiveEdit" class="el-icon-edit" style="right:-10px;" v-show="ischange==1"></span>
      </h2>
      <div class="common2">
        <li>
          <span>联系人</span>
          <span>{{info_contacts}}</span>
        </li>
        <li>
          <span>联系电话</span>
          <span>{{info_contact_information}}</span>
        </li>
        <li>
          <span>法人姓名</span>
          <span>{{leal_person}}</span>
        </li>
        <li>
          <span>身份证号</span>
          <span>{{idcard_no}}</span>
        </li>
        <li>
          <span>法人身份证照片</span>
          <a :href="idcard_face_image" target="_bank">
            <img :src="idcard_face_image" alt="正面" class="img" />
          </a>
          <a :href="idcard_back_image" target="_bank">
            <img :src="idcard_back_image" alt="反面" class="img" />
          </a>
        </li>
        <li>
          <span>手机号</span>
          <span>{{mobile}}</span>
        </li>
        <li>
          <span>店铺名称</span>
          <span>{{shop_title}}</span>
        </li>
        <li>
          <span>经营品类</span>
          <span>{{shop_category}}</span>
        </li>
        <li>
          <span>店铺地址</span>
          <span>{{info_province}}{{info_city}}{{info_area}}{{info_address}}</span>
        </li>
        <li>
          <span>门脸图</span>
          <a :href="shop_cover_image" target="_bank">
            <img :src="shop_cover_image" class="img" />
          </a>
        </li>
        <li>
          <span>店内环境图</span>
          <a :href="shop_bg_image" target="_bank">
            <img :src="shop_bg_image" class="img" />
          </a>
        </li>
        <!-- <li v-show="shop_takeout_setting">
          <span>合作方案</span>
          <span v-show="delivery_service==0">无</span>
          <span v-show="delivery_service==1">商家配送</span>
          <span v-show="delivery_service==2">小哥配送</span>
        </li>-->
        <li>
          <p>
            <span style="font-size:18px;font-weight:bold;">小哥默认抽佣比例：</span>
            <span>小哥专送抽佣比例&nbsp;&nbsp;&nbsp; {{xiaoge_rate}}%</span>
            <span>商家自配送抽佣比例&nbsp;&nbsp;&nbsp;{{shop_onself_rate}}%</span>
            <span>商城抽佣比例&nbsp;&nbsp;&nbsp; {{shop_mall_rate}}%</span>
            <span>团购抽佣比例&nbsp;&nbsp;&nbsp; {{group_buy_rate}}%</span>
            <span>到店付抽佣比例&nbsp;&nbsp;&nbsp; {{to_shop_rate}}%</span>
          </p>
          <p>
            <span style="font-size:18px;font-weight:bold;">
              商户专属抽佣比例：
              <i @click="shopRateEdit" class="el-icon-edit" v-show="ischange==1"></i>
            </span>
            <span>小哥专送抽佣比例&nbsp;&nbsp;&nbsp; {{xiaoge_rate2}}%</span>
            <span>商家自配送抽佣比例&nbsp;&nbsp;&nbsp;{{shop_onself_rate2}}%</span>
            <span>商城抽佣比例&nbsp;&nbsp;&nbsp; {{shop_mall_rate2}}%</span>
            <span>团购抽佣比例&nbsp;&nbsp;&nbsp; {{group_buy_rate2}}%</span>
            <span>到店付抽佣比例&nbsp;&nbsp;&nbsp; {{to_shop_rate2}}%</span>
          </p>
        </li>
        <!-- <li style="align-items: center;margin-top:20px">
          <span style="font-size:18px;font-weight:bold;color:#333333;">权限设置</span>
          <el-checkbox-group v-model="checkList" @change="changes">
            <el-checkbox
              v-for="(item,i) in disable_checkList"
              :key="i"
              :disabled="item.display1"
              :label="item.label"
            >{{item.value}}</el-checkbox>
          </el-checkbox-group>
        </li>-->
        <!-- <li style="align-items: center;margin-top:20px">
          <span style="font-size:18px;font-weight:bold;color:#333333;">选择站点</span>
          <span style="margin-right:30px;">{{site}}</span>
          <el-button @click="getsearch" type="primary" size="mini">请选择</el-button>
        </li>-->
      </div>
    </section>

    <!-- 基本信息修改 -->
    <div class="dialog_basic dialog_basic2">
      <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        title="修改基本信息修改"
        :visible.sync="dialogFormVisible"
        @close="cancel"
      >
        <div class="common2">
          <li>
            <span>联系人</span>
            <el-input v-model="re_contacts" placeholder="请输入联系人"></el-input>
          </li>
          <li>
            <span>联系电话</span>
            <el-input v-model="re_contact_information" placeholder="请输入联系电话"></el-input>
          </li>
          <li>
            <span>法人姓名</span>
            <el-input v-model="re_leal_person" placeholder="请输入法人姓名"></el-input>
          </li>
          <li>
            <span>身份证号</span>
            <el-input v-model="re_leal_person_idcard" placeholder="请输入法人姓名"></el-input>
          </li>
          <li>
            <span>
              身份证正面
              <i style="color:#333;font-size:14px;">(右侧为您所要上传的照片)</i>
            </span>
            <img :src="idcard_face_image" class="photo" />
            <el-upload
              action
              list-type="picture-card"
              :on-change="onChange"
              :class="{hide:hideUpload}"
              :on-remove="handleRemove"
              :auto-upload="false"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" />
            </el-dialog>
            <!-- <img :src="idcard_back_image" class="photo" /> -->
          </li>
          <li>
            <span>
              身份证反面
              <i style="color:#333;font-size:14px;">(右侧为您所要上传的照片)</i>
            </span>
            <img :src="idcard_back_image" class="photo" />
            <el-upload
              action
              list-type="picture-card"
              :on-change="onChange6"
              :class="{hide:hideUpload6}"
              :on-remove="handleRemove6"
              :auto-upload="false"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible6">
              <img width="100%" :src="dialogImageUrl6" />
            </el-dialog>
          </li>
          <li>
            <span>手机号</span>
            <el-input v-model="re_mobile" placeholder="请输入手机号"></el-input>
          </li>
          <li>
            <span>店铺名称</span>
            <el-input v-model="re_shop_title" placeholder="请输入店铺名称"></el-input>
          </li>
          <li class="category">
            <span>经营品类</span>
            <el-cascader
              :placeholder="shop_category"
              :props="{value:'id',label:'category_title',children:'children'}"
              :options="manageList"
              v-model="c_title"
              @change="handleChange"
            ></el-cascader>
          </li>
          <li class="ssq">
            <span>店铺所在地区</span>
            <p style="display:flex;flex-direction:row;justify-content: space-between;">
              <!-- <el-input @blur="zhuanhuan" v-model="pro" placeholder="省" clearable></el-input>
              <el-input @blur="zhuanhuan" v-model="cit" placeholder="市" clearable></el-input>
              <el-input @blur="zhuanhuan" v-model="are" placeholder="区" clearable></el-input>-->
              <el-select
                clearable
                v-model="sheng_s"
                @change="choseProvince_s"
                placeholder="省级地区"
                no-data-text="省级地区"
              >
                <el-option
                  v-for="item in province_s"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                style="margin:0 10px"
                v-model="shi_s"
                @change="choseCity_s"
                placeholder="市级地区"
                no-data-text="请选择省份"
                clearable
              >
                <el-option
                  v-for="item in shi1_s"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                clearable
                no-data-text="请选择城市"
                v-model="qu_s"
                @change="choseBlock_s"
                placeholder="区级地区"
              >
                <el-option
                  v-for="item in qu1_s"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
            </p>
          </li>
          <!-- <li>
            <span>市</span>
            <el-input @blur="zhuanhuan" v-model="cit" placeholder="市"></el-input>
          </li>
          <li>
            <span>区</span>
            <el-input @blur="zhuanhuan" v-model="are" placeholder="区"></el-input>
          </li>-->
          <li>
            <span>店铺详细地址</span>
            <el-input v-model="re_address" placeholder="详细地址"></el-input>
            <el-button style="margin-left:20px;" type="primary" @click="openMap">请选择</el-button>
          </li>
          <div>
            <el-dialog
              class="dia_map"
              title="修改地址"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              :visible.sync="innerVisible"
              append-to-body
              @close="cancelMap"
            >
              <div class="maps">
                <!-- 引入组件 -->
                <Map></Map>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelMap">取 消</el-button>
                <el-button type="primary" @click="getMapData">确 定</el-button>
              </div>
            </el-dialog>
          </div>
          <li>
            <span>
              门脸图
              <i style="color:#333;font-size:14px;">(右侧为您所要上传的照片)</i>
            </span>
            <img :src="shop_cover_image" class="photo" />
            <el-upload
              action
              list-type="picture-card"
              :on-change="onChange4"
              :class="{hide4:hideUpload4}"
              :on-remove="handleRemove4"
              :auto-upload="false"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible4">
              <img width="100%" :src="dialogImageUrl4" />
            </el-dialog>
          </li>
          <li>
            <span>
              店内环境图
              <i style="color:#333;font-size:14px;">(右侧为您所要上传的照片)</i>
            </span>
            <img :src="shop_bg_image" class="photo" />
            <el-upload
              action
              list-type="picture-card"
              :on-change="onChange5"
              :class="{hide5:hideUpload5}"
              :on-remove="handleRemove5"
              :auto-upload="false"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible5">
              <img width="100%" :src="dialogImageUrl5" />
            </el-dialog>
          </li>
          <li>
            <span>合作方案</span>
            <el-radio-group v-model="cooperation" @change="cooperations">
              <el-radio :label="1">商家配送</el-radio>
              <el-radio :label="2">小哥配送</el-radio>
              <!-- <el-radio :label="0">无</el-radio> -->
            </el-radio-group>
          </li>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 修改抽佣比例 -->
    <div class="dialog_basic dialog_basic1">
      <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        title="修改抽佣比例"
        :visible.sync="dialogFormVisible3"
        @close="cancel3"
      >
        <div class="common2 common3">
          <li>
            <span>小哥专送抽佣比例</span>
            <el-input v-model="input" placeholder="请输入内容"></el-input>
          </li>
          <li>
            <span>商家自配送抽佣比例</span>
            <el-input v-model="input2" placeholder="请输入内容"></el-input>
          </li>
          <li>
            <span>商城抽佣比例</span>
            <el-input v-model="input3" placeholder="请输入内容"></el-input>
          </li>
          <li>
            <span>团购抽佣比例</span>
            <el-input v-model="input4" placeholder="请输入内容"></el-input>
          </li>
          <li>
            <span>到店付抽佣比例</span>
            <el-input v-model="input5" placeholder="请输入内容"></el-input>
          </li>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel3">取 消</el-button>
          <el-button type="primary" @click="save3">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 材料信息 条件-->
    <section class="sdiv2">
      <span class="s1">审核状态</span>
      <el-radio-group v-model="radio" @change="pass_refuse2" v-show="status1==2">
        <el-radio :label="2">审核通过</el-radio>
        <el-radio :label="1">驳回申请</el-radio>
      </el-radio-group>
      <p v-show="status1==1">审核通过</p>
      <p v-show="status1==-1">审核被驳回</p>
      <p v-show="status1==0">资料待完善</p>
      <p v-show="status1==2"></p>
    </section>
    <div class="re_input" v-if="ischanges==1&&radio==1">
      <el-input v-model="re_input" placeholder="请输入驳回理由" clearable></el-input>
    </div>
    <div class="refuse_info" v-show="reject_reason">
      驳回申请原因:
      <span>{{reject_reason}}</span>
    </div>

    <!-- 按钮 -->
    <div class="btn">
      <el-button
        v-show="status1==2"
        @click="onsubmit"
        type="primary"
        style="margin-right:20px;"
        :disabled="radio!=1&&radio!=2"
      >提 交</el-button>
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>

    <!-- 地址 -->
  </div>
</template>


<script>
import { getBase64 } from "../../utils/base64.js";
import axios from "axios";
import Map from "./map.vue";
import { isArray } from "util";
export default {
  data() {
    return {
      // mapinfo: "",
      //shop_main
      is_status: "",
      freeze: "",
      custom_pid: "",
      shop_id: "",
      contacts: "",
      contact_information: "",
      apply_time: "",
      register_time: "",
      last_login_time: "",
      module_bohui: "", //申请模块数组
      module_tongguo: "", //申请模块数组
      module_shenhe: "",
      module_auth: {},
      disabled1: "",
      disabled2: "",
      disabled3: "",
      jurisdiction: "", //传入后台的数组
      checkList: [],
      // disable_checkList:[],
      disable_checkList: [
        { value: "外卖模块", label: "takeout" },
        { value: "商城模块", label: "malls" },
        { value: "团购模块", label: "group" }
      ],
      //shop_info
      info_contacts: "",
      info_contact_information: "",
      leal_person: "",
      idcard_no: "",
      mobile: "",
      shop_title: "",
      shop_category: "",
      info_province: "",
      info_city: "",
      info_area: "",
      info_address: "",
      shop_cover_image: "",
      shop_bg_image: "",
      shop_service: "",
      lon: "",
      lat: "",
      //资质信息
      business_license_image: "",
      licence_other_image: "",
      //
      reject_reason: "", //驳回的信息
      ischange: "",
      ischanges: 1,
      sid: "",
      radio: "",
      status: "",
      radio2: "",
      status1: "",
      status2: "",
      re_input: "",
      reject_reason1: "",
      re_input2: "",
      reject_reason2: "",
      //参数设置
      week: "",
      time: "",
      delivery_order_amount: "",
      delivery_service: "",
      freight_info: "",
      coupon_info: "",
      //小哥抽佣
      xiaoge_rate: "",
      shop_onself_rate: "",
      shop_mall_rate: "",
      group_buy_rate: "",
      to_shop_rate: "",
      //商家抽佣
      xiaoge_rate2: "",
      shop_onself_rate2: "",
      shop_mall_rate2: "",
      group_buy_rate2: "",
      to_shop_rate2: "",
      //
      shop_main: {}, //商家信息
      shop_archive: {}, //商家资质
      shop_info: {}, //商家信息
      shop_category_rate: {},
      shop_rebate_rate: {},
      category_id: "",
      shop_takeout_setting: "", //外卖才有
      business_time: {},

      //身份证
      idcard_face_image: "",
      idcard_back_image: "",
      id_face: "",
      id_back: "",
      //上传图片
      imgarr: [],
      dialogImageUrl: "", //图片路径
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      img2: "",
      dialogImageUrl2: "",
      dialogVisible2: false,
      hideUpload2: false,
      limitCount2: 1,
      img3: "",
      dialogImageUrl3: "",
      dialogVisible3: false,
      hideUpload3: false,
      limitCount3: 1,
      img4: "",
      dialogImageUrl4: "",
      dialogVisible4: false,
      hideUpload4: false,
      limitCount4: 1,
      img5: "",
      dialogImageUrl5: "",
      dialogVisible5: false,
      hideUpload5: false,
      limitCount5: 1,
      img6: "",
      dialogImageUrl6: "",
      dialogVisible6: false,
      hideUpload6: false,
      limitCount6: 1,
      //弹窗
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      //修改抽佣比例
      input: "",
      input2: "",
      input3: "",
      input4: "",
      input5: "",
      //修改店铺信息
      re_contacts: "",
      re_contact_information: "",
      re_leal_person: "",
      re_leal_person_idcard: "",
      re_mobile: "",
      re_shop_title: "",
      re_address: "",
      cooperation: "",
      pro: "",
      cit: "",
      are: "",
      innerVisible: false,

      //修改权限
      jurisdiction: "",
      //选择站点弹窗
      dialogTableVisible2: false,
      shop_delivery_site: [],
      //修改站点
      site: "",
      // 站点列表
      total: "",
      site_id: "",
      site_name: "",
      siteList: [],
      siteval: "",
      sitedetail: "", //站点地区
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
      //修改地址
      province_s: [],
      sheng_s: "",
      shi_s: "",
      shi1_s: [],
      qu_s: "",
      qu1_s: [],
      city_s: "",
      block_s: "",
      //
      manageList: [],
      c_title: "",
      category_id2: "",
      //经纬度
      lon1: "", //经
      lat: "", //纬
      detail_add: ""
    };
  },
  components: {
    Map
  },
  watch: {
    // lon() {
    //   console.log(this.lon, "2222");
    // },
    // lat() {
    //   console.log(this.lat, "3333");
    // },
    // detail_add() {
    //   console.log(this.detail_add, "444");
    // }
  },
  created() {
    this.sid = JSON.parse(sessionStorage.getItem("aaa")).shopid;
    this.ischange = JSON.parse(sessionStorage.getItem("aaa")).ischange;
    this.getdata();

    // this.searchSite(1);
  },
  computed: {
    mapInfo: function() {
      return this.$store.state;
    }
  },
  methods: {
    //打开地图控件
    openMap() {
      this.innerVisible = true;
      this.lon = "";
      this.lat = "";
    },
    //关闭地图控件
    cancelMap() {
      this.innerVisible = false;
      // this.lon = this.lon1;
      // this.lat = this.lat1;
    },
    //确认地图
    getMapData() {
      if (!this.lon && !this.lat) {
        // this.sheng_s = this.mapInfo.mapdata2.province;
        // if (isArray(this.mapInfo.mapdata2.city)) {
        //   this.shi_s = this.mapInfo.mapdata2.province;
        // } else {
        //   this.shi_s = this.mapInfo.mapdata2.city;
        // }
        // this.qu_s = this.mapInfo.mapdata2.district;
        this.lon = this.mapInfo.mapdata.lng; //经度
        this.lat = this.mapInfo.mapdata.lat; //纬度
        //正则替换  把 '街道' 和 '镇' 替换城 qu
        let str = this.mapInfo.mapdata3.replace(/(街道)|(镇)/, "区");
        let arr = str.split("区");
        // let arr = this.mapInfo.mapdata3.split("区");
        console.log(arr);
        if (arr.length == 1) {
          this.re_address = arr[0];
        } else if (arr.length <= 2 && arr.length > 1) {
          arr.splice(0, 1);
          this.re_address = arr[0];
        } else {
          arr.splice(0, 2);
          this.re_address = arr.join("");
          // console.log(this.re_address, "22222323232323232");
        }
        // this.detail_add = this.mapInfo.mapdata3.split('区');
        this.innerVisible = false;
      } else {
        this.$message.error("请选择地址");
      }
    },
    // changes(val){
    //   console.log(val);
    // },
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //资质信息  1
    pass_refuse(val) {
      console.log(val);
      if (val == 2) {
        this.open(val, 1);
      }
      if (val == 1) {
        this.open2(val, 1);
      }
    },
    //店铺信息 2
    pass_refuse2(val) {
      console.log(val);

      if (val == 2) {
        this.open(val);
      }
      if (val == 1) {
        this.open2(val);
      }
    },
    //通过
    open(val) {
      this.$confirm("是否通过审核, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          this.radio = val;
        })
        .catch(() => {
          this.radio = "";
        });
    },
    //驳回
    open2(val) {
      // console.log(id);
      this.$prompt("驳回理由", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(({ value }) => {
          console.log(value);

          this.radio = val;
          if (value) {
            this.re_input = value;
          } else {
            this.$message.error("你没有填写驳回信息");
            this.radio = "";
          }
        })
        .catch(() => {
          this.radio = "";
        });
    },
    //详情
    getdata() {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/merchantDetail",
        params: {
          shop_id: this.sid
        }
      }).then(res => {
        console.log(res.data.data, "1");
        //shop_main
        this.shop_main = res.data.data.shop_main;
        this.is_status = res.data.data.shop_main.status;
        this.module_auth = res.data.data.shop_main.module_auth;
        this.freeze = res.data.data.shop_main.freeze;
        this.shop_id = res.data.data.shop_main.shop_id;
        this.contacts = res.data.data.shop_main.contacts;
        this.contact_information = res.data.data.shop_main.contact_information;
        this.apply_time = res.data.data.shop_main.apply_time;
        this.register_time = res.data.data.shop_main.register_time;
        this.last_login_time = res.data.data.shop_main.last_login_time;
        this.custom_pid = res.data.data.shop_main.custom_pid;
        // this.module_bohui = res.data.data.shop_main.module_bohui;
        // this.module_tongguo = res.data.data.shop_main.module_tongguo;
        // this.module_shenhe = res.data.data.shop_main.module_shenhe;
        res.data.data.shop_main.module_tongguo.forEach((item, i, arr) => {
          if (arr.length <= 1) {
            this.module_tongguo = arr[0];
          } else {
            this.module_tongguo = arr.join(",");
          }
        });
        res.data.data.shop_main.module_shenhe.forEach((item, i, arr) => {
          if (arr.length <= 1) {
            this.module_shenhe = arr[0];
          } else {
            this.module_shenhe = arr.join(",");
          }
        });
        res.data.data.shop_main.module_bohui.forEach((item, i, arr) => {
          if (arr.length <= 1) {
            this.module_bohui = arr[0];
          } else {
            this.module_bohui = arr.join(",");
          }
        });
        //权限设置
        if (res.data.data.shop_info.module_auth) {
          // let d_checkList = [];
          let obj = res.data.data.shop_info.module_auth;
          for (let keys in obj) {
            if (obj[keys] == 1) {
              this.checkList.push(keys);
              for (let i in this.disable_checkList) {
                if (keys == this.disable_checkList[i].label) {
                  this.disable_checkList[i].display1 = true;
                }
              }
            }
          }
          // this.disable_checkList = JSON.parse(JSON.stringify(this.checkList))
          console.log(this.disable_checkList);
          let arr = [];
          this.checkList.forEach(item => {
            if (item == "takeout") {
              arr.push(1);
            }
            if (item == "malls") {
              arr.push(2);
            }
            if (item == "group") {
              arr.push(3);
            }
          });
          this.jurisdiction = arr.join(",");
          // console.log(this.jurisdiction);
        }
        res.data.data.shop_delivery_site.forEach(item => {
          if (item.id == res.data.data.shop_info.delivery_site_id) {
            this.site = item.site_title;
          }
        });
        //shop_info
        this.shop_info = res.data.data.shop_info;
        this.info_contacts = res.data.data.shop_info.contacts;
        this.info_contact_information =
          res.data.data.shop_info.contact_information;
        this.leal_person = res.data.data.shop_info.leal_person;
        this.idcard_no = res.data.data.shop_info.idcard_no;
        this.mobile = res.data.data.shop_info.mobile;
        this.shop_title = res.data.data.shop_info.shop_title;
        this.shop_category = res.data.data.shop_info.shop_category;
        this.info_province = res.data.data.shop_info.province;
        this.info_city = res.data.data.shop_info.city;
        this.info_area = res.data.data.shop_info.area;
        this.info_address = res.data.data.shop_info.address;
        this.shop_cover_image = res.data.data.shop_info.shop_cover_image;
        this.shop_bg_image = res.data.data.shop_info.shop_bg_image;
        this.idcard_face_image = res.data.data.shop_info.idcard_face_image;
        this.idcard_back_image = res.data.data.shop_info.idcard_back_image;
        this.lon1 = res.data.data.shop_info.longitude;
        this.lat1 = res.data.data.shop_info.latitude;
        this.$store.commit("f_lng", res.data.data.shop_info.longitude);
        this.$store.commit("f_lat", res.data.data.shop_info.latitude);
        // this.site = res.data.data.shop_info.delivery_site_id;
        //驳回信息
        // if (res.data.data.reject_reason) {
        // }
        // if (res.data.data.shop_main.status == -1) {
        //   this.reject_reason1 = res.data.data.reject_reason;
        // }
        if (res.data.data.shop_archive.archive_status == -1) {
          this.reject_reason = res.data.data.reject_reason;
        }
        // if (
        //   res.data.data.shop_main.status == -1 &&
        //   res.data.data.shop_archive.archive_status == -1
        // ) {
        //   let reject_reason = res.data.data.reject_reason.split("#");
        //   this.reject_reason1 = reject_reason[0];
        //   this.reject_reason2 = reject_reason[1];
        // }
        //合作方案
        // this.shop_service = res.data.data.shop_takeout_setting.shop_service;
        // this.cooperation = res.data.data.shop_takeout_setting.delivery_service;
        //资质信息
        // this.shop_archive = res.data.data.shop_archive;
        // this.business_license_image =
        //   res.data.data.shop_archive.business_license_image;
        // this.licence_other_image =
        //   res.data.data.shop_archive.licence_other_image;
        // //营业时间
        // this.shop_takeout_setting = res.data.data.shop_takeout_setting;

        // this.delivery_order_amount =
        //   res.data.data.shop_takeout_setting.delivery_order_amount;
        //配送方式
        // this.delivery_service =
        //   res.data.data.shop_takeout_setting.delivery_service;
        //
        this.freight_info = res.data.data.shop_takeout_setting.freight_info;
        this.coupon_info = res.data.data.shop_takeout_setting.coupon_info;

        //状态
        if (res.data.data.shop_main.status == 1) {
          this.radio = 2;
          this.status1 = res.data.data.shop_main.status;
        } else if (res.data.data.shop_main.status == -1) {
          // this.radio = 1;
          this.status1 = res.data.data.shop_main.status;
        } else {
          this.status1 = res.data.data.shop_main.status;
        }
        //状态
        if (res.data.data.shop_archive.archive_status == 1) {
          // this.radio2 = 2;
          this.radio2 = 2;
          this.status2 = res.data.data.shop_archive.archive_status;
        } else if (res.data.data.shop_archive.archive_status == -1) {
          // this.radio2 = 1;
          this.status2 = res.data.data.shop_archive.archive_status;
        } else {
          this.status2 = res.data.data.shop_archive.archive_status;
        }
        //小哥抽佣
        // this.shop_category_rate = res.data.data.shop_info.shop_category_rate;
        this.xiaoge_rate =
          res.data.data.shop_info.shop_category_rate.xiaoge_rate;
        this.shop_onself_rate =
          res.data.data.shop_info.shop_category_rate.shop_onself_rate;
        this.shop_mall_rate =
          res.data.data.shop_info.shop_category_rate.shop_mall_rate;
        this.group_buy_rate =
          res.data.data.shop_info.shop_category_rate.group_buy_rate;
        this.to_shop_rate =
          res.data.data.shop_info.shop_category_rate.to_shop_rate;
        this.category_id = res.data.data.shop_info.shop_category_rate.id; //经营品类id
        //店铺抽佣
        this.shop_rebate_rate = res.data.data.shop_info.shop_rebate_rate;
        this.xiaoge_rate2 =
          res.data.data.shop_info.shop_rebate_rate.xiaoge_rate;
        this.shop_onself_rate2 =
          res.data.data.shop_info.shop_rebate_rate.shop_onself_rate;
        this.shop_mall_rate2 =
          res.data.data.shop_info.shop_rebate_rate.shop_mall_rate;
        this.group_buy_rate2 =
          res.data.data.shop_info.shop_rebate_rate.group_buy_rate;
        this.to_shop_rate2 =
          res.data.data.shop_info.shop_rebate_rate.to_shop_rate;
      });
    },
    //修改权限 Cjurisdiction /backend/Merchant/archiveEdit
    changes(value) {
      let arr = [];
      console.log(value);
      value.forEach(item => {
        if (item == "malls") {
          arr.push(2);
        }
        if (item == "group") {
          arr.push(3);
        }
        if (item == "takeout") {
          arr.push(1);
        }
      });
      this.jurisdiction = arr.join(",");
      console.log(arr.join(","));

      // this.$axios({
      //   method: "POST",
      //   url: "/backend/Merchant/archiveEdit",
      //   data: {
      //     shop_id: this.sid,
      //     module_auths: this.jurisdiction
      //   }
      // }).then(res => {
      //   if (res.data.status == 1) {
      //     this.$message.success(res.data.msg);
      //   } else {
      //     this.$message.error(res.data.msg);
      //   }
      // });
    },
    //重置
    resetForm() {
      this.site_id = "";
      this.site_name = "";
      this.sheng = "";
      this.shi = "";
      this.qu = "";
    },
    getsearch() {
      this.siteList = [];
      this.searchSite(1);
    },
    //站点列表 /backend/Merchant/searchDeliverySite
    searchSite(page) {
      this.dialogTableVisible2 = true;
      this.getCityData();
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/searchDeliverySite",
        params: {
          search_site_id: this.site_id,
          search_site_title: this.site_name,
          search_site_location: `${this.sheng}${this.shi}${this.qu}`,
          page: page,
          size: 10
        }
      }).then(res => {
        console.log(res);
        this.total = res.data.data.total;
        let arr = res.data.data.data;
        arr.forEach(item => {
          item.addRess = `${item.province} ${item.city} ${item.area}`;
          this.siteList.push(item);
        });

        // this.siteList = res.data.data.data;
      });
    },
    close2() {
      this.dialogTableVisible2 = false;
      this.siteval = "";
      this.sitedetail = "";
      this.resetForm();
    },
    //批量选择
    handleSelectionChange(currentRow, oldCurrentRow) {
      console.log(currentRow);
      console.log(currentRow.id, currentRow.addRess);
      this.siteList.forEach(item => {
        // 排他,每次选择时把其他选项都清除
        if (item.id !== currentRow.id) {
          item.checked = false;
        }
      });
      this.siteval = currentRow.id;
      this.sitedetail = currentRow.site_title;
    },
    //修改站点 changeSite
    changeSite() {
      this.dialogTableVisible2 = false;
      if (this.siteval && this.sitedetail) {
        this.$axios({
          method: "POST",
          url: "/backend/Merchant/archiveEdit",
          data: {
            shop_id: this.sid,
            delivery_site_id: this.siteval
          }
        }).then(res => {
          if (res.data.status == 1) {
            this.$message.success(res.data.msg);
            // this.site = this.site;
            this.getdata();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } else {
        this.$message.error("您未选择站站点");
      }
    },
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.searchSite(val);
    },

    //驳回喝审核
    pass_and_re(remark) {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/auditApplyQrCode",
        data: {
          audit_seniority: this.radio,
          audit_material: this.radio,
          shop_id: this.sid,
          remark: remark
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.$message.success("提交审核成功");
          this.getdata();
          this.ischange = 0;
          this.ischanges = 0;
          this.radio = "";
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //提交审核 /backend/Merchant/auditApply
    onsubmit() {
      let remark = "";
      // 非空判断
      if (this.radio == 2) {
        this.pass_and_re("");
      }
      if (this.radio == 1) {
        remark = this.re_input;
        if (this.re_input) {
          this.pass_and_re(remark);
        } else {
          this.$message.error("请填写驳回理由");
        }
      }
    },

    //修改权限
    xiu() {
      //修改权限
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/archiveEdit",
        data: {
          shop_id: this.sid,
          module_auths: this.jurisdiction
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.getdata();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //打开店铺信息弹窗
    archiveEdit() {
      this.dialogFormVisible = true;
      this.getCityData_s();
      this.choseProvince_s();
      this.choseCity_s();
      this.choseBlock_s();
      // if (this.imgarr.length == 1) {
      //   this.id_face = this.imgarr[0];
      // } else if (this.imgarr.length == 2) {
      //   this.id_face = this.imgarr[0];
      //   this.id_back = this.imgarr[1];
      // }]
      this.dialogImageUrl = [];
      this.dialogImageUrl2 = "";
      this.dialogImageUrl3 = "";
      this.dialogImageUrl4 = "";
      this.dialogImageUrl5 = "";
      this.dialogImageUrl6 = "";
      this.id_back = this.idcard_back_image;
      this.id_face = this.idcard_face_image;
      this.cooperation = this.delivery_service;
      this.re_contacts = this.info_contacts;
      this.re_contact_information = this.info_contact_information;
      this.re_leal_person = this.leal_person;
      this.re_leal_person_idcard = this.idcard_no;
      this.re_mobile = this.mobile;
      this.getmanageList(1);
      this.category_id2 = this.category_id;
      this.c_title = this.shop_category;
      this.re_shop_title = this.shop_title;
      this.img4 = this.shop_cover_image;
      this.img5 = this.shop_bg_image;
      this.sheng_s = this.info_province;
      this.shi_s = this.info_city;
      this.qu_s = this.info_area;
      this.re_address = this.info_address;
      this.lon = this.lon1;
      this.lat = this.lat1;
      // this.zhuanhuan();
    },
    getmanageList(page) {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/shopCategoryList",
        params: {
          category_title: "",
          page: page,
          size: 500
        }
      }).then(res => {
        console.log(res.data.data);
        this.manageList = res.data.data.data;
      });
    },
    handleChange(value) {
      console.log(value);
      this.category_id2 = value[value.length - 1];
    },
    //经纬度
    // zhuanhuan() {
    //   // var that = this;
    //   if (this.re_address) {
    //     axios
    //       // https://restapi.amap.com/v3/geocode/regeo?parameters
    //       .get("https://restapi.amap.com/v3/geocode/geo?parameters", {
    //         params: {
    //           key: "0b1d2d29e777f34081720f95df640092",
    //           address: this.sheng_s + this.shi_s + this.qu_s + this.re_address
    //         }
    //       })
    //       .then(response => {
    //         let str = response.data.geocodes[0].location;
    //         let temp = str.split(",");
    //         this.lon = temp[0]; //经度
    //         this.lat = temp[1]; //纬度
    //         console.log(this.lon, this.lat);
    //       })
    //       .catch(function(error) {
    //         console.log(error);
    //       });
    //   } else {
    //     this.$message.error("请完善地址");
    //   }
    // },
    // 编辑资料 /backend/Merchant/archiveEdit
    save() {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/archiveEdit",
        data: {
          shop_id: this.sid,
          category_id: this.category_id2,
          contacts: this.re_contacts,
          contact_information: this.re_contact_information,
          leal_person: this.re_leal_person,
          mobile: this.re_mobile,
          idcard_no: this.re_leal_person_idcard,
          idcard_face_image: this.id_face,
          idcard_back_image: this.id_back,
          shop_title: this.re_shop_title,
          shop_cover_image: this.img4,
          shop_bg_image: this.img5,
          address: this.re_address,
          province: this.sheng_s,
          city: this.shi_s,
          area: this.qu_s,
          longitude: this.lon ? this.lon : this.lon1,
          latitude: this.lat ? this.lat : this.lat1,
          delivery_service: this.cooperation
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success("修改成功");
          this.getdata();
          this.dialogFormVisible3 = false;
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    cancel() {
      this.dialogFormVisible = false;
      this.re_contacts = "";
      this.re_contact_information = "";
      this.re_leal_person = "";
      this.re_leal_person_idcard = "";
      this.re_mobile = "";
      this.re_shop_title = "";
      this.re_address = "";
      this.shi_s = "";
      this.qu_s = "";
      this.sheng_s = "";
      this.cooperation = "";
      this.img4 = "";
      this.img5 = "";
      this.id_back = "";
      this.id_face = "";
      this.lon = "";
      this.lat = "";
    },
    cooperations(val) {
      // console.log(val)
      this.cooperation = val;
    },
    //商城抽佣比
    shopRateEdit() {
      this.dialogFormVisible3 = true;
      this.input = this.xiaoge_rate2;
      this.input2 = this.shop_onself_rate2;
      this.input3 = this.shop_mall_rate2;
      this.input4 = this.group_buy_rate2;
      this.input5 = this.to_shop_rate2;
    },
    //抽佣比例 /backend/Merchant/shopRateEdit
    save3() {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/shopRateEdit",
        data: {
          shop_id: this.sid,
          xiaoge_rate: this.input,
          shop_onself_rate: this.input2,
          shop_mall_rate: this.input3,
          group_buy_rate: this.input4,
          to_shop_rate: this.input5
        }
      }).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.$message.success("修改成功");
          this.getdata();
          this.dialogFormVisible3 = false;
          this.cancel3();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    cancel3() {
      this.dialogFormVisible3 = false;
      this.input = "";
      this.input2 = "";
      this.input3 = "";
      this.input4 = "";
      this.input5 = "";
    },
    set_idcarImg() {
      this.dialogFormVisible2 = true;
    },
    //编辑资质 /backend/Merchant/seniorityEdit
    save2() {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/seniorityEdit",
        data: {
          shop_id: this.sid,
          business_license_image: this.img2,
          licence_other_image: this.img3
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.$message.success("修改成功");
          this.getdata();
          this.dialogFormVisible2 = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    cancel2() {
      this.dialogFormVisible2 = false;
      this.img2 = "";
      this.img3 = "";
    },
    //选择图片后触发的事件
    // /backend/SystemSetting/uploadAvatar
    getimgsrc(src, img) {
      getBase64(src).then(res => {
        this.$axios({
          method: "POST",
          url: "/backend/SystemSetting/uploadAvatar",
          data: {
            image: res
          }
        }).then(res => {
          console.log(res.data.data);
          img = res.data.data.url;
        });
      });
    },
    onChange(file, fileList) {
      getBase64(file.raw).then(res => {
        this.$axios({
          method: "POST",
          url: "/backend/SystemSetting/uploadAvatar",
          data: {
            image: res
          }
        }).then(res => {
          console.log(res.data.data);
          this.id_face = res.data.data.url;
        });
      });
      this.dialogImageUrl = file.url;
      this.hideUpload = fileList.length >= this.limitCount;
    },
    onChange6(file, fileList) {
      // this.getimgsrc(file.raw, this.img2);
      getBase64(file.raw).then(res => {
        this.$axios({
          method: "POST",
          url: "/backend/SystemSetting/uploadAvatar",
          data: {
            image: res
          }
        }).then(res => {
          console.log(res.data.data);
          this.id_back = res.data.data.url;
        });
      });
      this.dialogImageUrl6 = file.url;
      this.hideUpload6 = fileList.length >= this.limitCount6;
    },
    onChange2(file, fileList) {
      // this.getimgsrc(file.raw, this.img2);
      getBase64(file.raw).then(res => {
        this.$axios({
          method: "POST",
          url: "/backend/SystemSetting/uploadAvatar",
          data: {
            image: res
          }
        }).then(res => {
          console.log(res.data.data);
          this.img2 = res.data.data.url;
        });
      });
      this.dialogImageUrl2 = file.url;
      this.hideUpload2 = fileList.length >= this.limitCount2;
    },
    onChange3(file, fileList) {
      // this.getimgsrc(file.raw, this.img3);
      getBase64(file.raw).then(res => {
        this.$axios({
          method: "POST",
          url: "/backend/SystemSetting/uploadAvatar",
          data: {
            image: res
          }
        }).then(res => {
          console.log(res.data.data);
          this.img3 = res.data.data.url;
        });
      });
      this.dialogImageUrl3 = file.url;
      this.hideUpload3 = fileList.length >= this.limitCount3;
    },
    onChange4(file, fileList) {
      // this.getimgsrc(file.raw, this.img4);
      getBase64(file.raw).then(res => {
        this.$axios({
          method: "POST",
          url: "/backend/SystemSetting/uploadAvatar",
          data: {
            image: res
          }
        }).then(res => {
          console.log(res.data.data);
          this.img4 = res.data.data.url;
        });
      });
      this.dialogImageUrl4 = file.url;
      this.hideUpload4 = fileList.length >= this.limitCount4;
    },
    onChange5(file, fileList) {
      // this.getimgsrc(file.raw, this.img5);
      getBase64(file.raw).then(res => {
        this.$axios({
          method: "POST",
          url: "/backend/SystemSetting/uploadAvatar",
          data: {
            image: res
          }
        }).then(res => {
          console.log(res.data.data);
          this.img5 = res.data.data.url;
        });
      });
      this.dialogImageUrl5 = file.url;
      this.hideUpload5 = fileList.length >= this.limitCount5;
    },
    //删除图片出发的事件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.dialogImageUrl = [];
      this.hideUpload = fileList.length >= this.limitCount;
    },
    handleRemove2(file, fileList) {
      console.log(file, fileList);
      this.dialogImageUrl2 = "";
      this.img2 = "";
      this.hideUpload2 = fileList.length >= this.limitCount2;
    },
    handleRemove3(file, fileList) {
      console.log(file, fileList);
      this.dialogImageUrl3 = "";
      this.img3 = "";
      this.hideUpload3 = fileList.length >= this.limitCount3;
    },
    handleRemove4(file, fileList) {
      console.log(file, fileList);
      this.dialogImageUrl4 = "";
      this.img4 = "";
      this.hideUpload4 = fileList.length >= this.limitCount4;
    },
    handleRemove5(file, fileList) {
      console.log(file, fileList);
      this.dialogImageUrl5 = "";
      this.img5 = "";
      this.hideUpload5 = fileList.length >= this.limitCount5;
    },
    handleRemove6(file, fileList) {
      console.log(file, fileList);
      this.dialogImageUrl6 = "";
      this.img6 = "";
      this.hideUpload5 = fileList.length >= this.limitCount6;
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
    },
    /**********************加载地点数据*******************************************/
    // 加载china地点数据，三级
    getCityData_s() {
      var that = this;
      axios
        .get(this.mapJson)
        .then(function(response) {
          if (response.status == 200) {
            var data = response.data;
            that.province_s = [];
            that.city_s = [];
            that.block_s = [];
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {
                //省
                that.province_s.push({
                  id: item,
                  value: data[item],
                  children: []
                });
              } else if (item.match(/00$/)) {
                //市
                that.city_s.push({ id: item, value: data[item], children: [] });
              } else {
                //区
                that.block_s.push({ id: item, value: data[item] });
              }
            }
            // 分类市级
            for (var index in that.province_s) {
              for (var index1 in that.city_s) {
                if (
                  that.province_s[index].id.slice(0, 2) ===
                  that.city_s[index1].id.slice(0, 2)
                ) {
                  that.province_s[index].children.push(that.city_s[index1]);
                }
              }
            }
            // 分类区级
            for (var item1 in that.city_s) {
              for (var item2 in that.block_s) {
                if (
                  that.block_s[item2].id.slice(0, 4) ===
                  that.city_s[item1].id.slice(0, 4)
                ) {
                  that.city_s[item1].children.push(that.block_s[item2]);
                }
              }
            }
            // this.choseProvince_s();
            // this.choseCity_s();
            // this.choseBlock_s();
          } else {
            console.log(response.status);
          }
        })
        .catch(function(error) {
          console.log(typeof +error);
        });
    },
    // 选省
    choseProvince_s(e) {
      this.shi_s = "";
      this.qu_s = "";
      for (var index2 in this.province_s) {
        if (e === this.province_s[index2].id) {
          this.shi1_s = this.province_s[index2].children;
          this.shi_s = this.province_s[index2].children[0].value;
          this.qu1_s = this.province_s[index2].children[0].children;
          this.qu_s = this.province_s[index2].children[0].children[0].value;
          this.E = this.qu1_s[0].id;
          this.sheng_s = this.province_s[index2].value;
          console.log("选省", this.sheng_s);
          // console.log("选省", this.E);
        }
      }
      // if (!this.sheng_s) {
      //   this.shi_s = "";
      //   this.qu_s = "";
      // }
    },
    // 选市
    choseCity_s(e) {
      for (var index3 in this.city_s) {
        if (e === this.city_s[index3].id) {
          this.qu1_s = this.city_s[index3].children;
          this.qu_s = this.city_s[index3].children[0].value;
          this.E = this.qu1_s[0].id;
          this.shi_s = this.city_s[index3].value;
          console.log("选市", this.shi_s);
          // console.log("选市", this.E);
        }
      }
      if (!this.shi_s) {
        this.qu_s = "";
      }
    },
    // 选区
    choseBlock_s(e) {
      this.E = e;
      for (var i = 0; i < this.qu1_s.length; i++) {
        if (e === this.qu1_s[i].id) {
          this.qu_s = this.qu1_s[i].value;
          console.log("选区", this.qu_s, this.sheng_s + this.shi_s + this.qu_s);
        }
      }
      if (!this.shi_s) {
        this.qu_s = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.comdeetails-wepper {
  h1 {
    margin: 10px 0 20px 0;
    width: 115px;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  h2 {
    width: 135px;
    height: 29px;
    position: relative;
    font-size: 20px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
    margin-bottom: 26px;
    span {
      cursor: pointer;
      font-size: 18px;
      color: #4371e8;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      color: #4371e8;
    }
    i {
      display: block;
      width: 34px;
      height: 2px;
      background: rgba(67, 113, 232, 1);
      border-radius: 1px;
      margin-top: 1px;
    }
  }
  .common2 li {
    font-size: 16px;
    display: flex;
    align-items: center;
    //
    flex-direction: row;
    margin-bottom: 20px;
    line-height: 21px;

    img {
      width: 116px;
      height: 116px;
      background: #ccc;
      border-radius: 2px;
    }
    .photo {
      width: 172px;
      height: 108px;
      border: 1px solid #dddbdb;
      margin-right: 20px;
    }
    .txt {
      font-size: 12px;
    }
  }
  //
  .common2 li p:nth-child(1),
  .common2 li p:nth-child(2) {
    position: relative;
    width: 330px;
    text-align: left;
    font-size: 16px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    span {
      width: 250px;
      font-size: 16px;
      line-height: 40px;
      font-family: Microsoft YaHei;
      color: rgba(51, 51, 51, 1);
    }

    i {
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 70px;
      color: #4371e8;
    }
  }
  //
  .common2 li span:nth-child(1) {
    width: 110px;
    text-align: left;
    color: #666;
    font-size: 16px;
    margin-right: 20px;
  }
  .common2 li span:nth-child(2) {
    color: #333;
    font-size: 16px;
  }
  .common {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 20px;
  }
  .account {
    width: 400px;
    // height: 416px;
    margin-bottom: 40px;
  }
  /*******************/
  .zizhi {
    margin-top: 40px;
    width: 398px;
    // height: 355px;
  }
  .dianpuxin {
    width: 780px;
    // height: 1184px;
    .img {
      height: 108px;
      width: 172px;
      margin-right: 20px;
    }
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
  .note {
    padding-left: 10px;
    margin: 30px 0 40px 0;
    p {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 20px;
    }
    span {
      font-size: 16px;
      font-weight: 400;
      font-family: Microsoft YaHei;
      color: rgba(102, 102, 102, 1);
      margin-right: 50px;
    }
  }
  .refuse_info {
    margin-top: 10px;
    // width: 105px;
    height: 19px;
    font-size: 14px;
    font-weight: bold;
    line-height: 19px;
    color: rgba(102, 102, 102, 1);
    span {
      font-size: 14px;
      font-weight: 400;
      line-height: 21px;
    }
  }
  .setting {
    width: 1041px;
    // height: 271px;
    background: none;
    border: 0;
    box-shadow: 0 0 0 #ffffff;
    margin-top: 40px;
    .common2 {
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(241, 241, 241, 1);
      box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
      border-radius: 4px;
      padding: 20px;
    }
  }
  .dialog_basic .common3 li span:nth-child(1) {
    width: 160px;
    letter-spacing: 1px;
    line-height: 32px;
  }
  .btn {
    // width: 300px;
    margin: 50px 0 20px 0;
    display: flex;
    align-items: center;
  }
}
</style>

<style lang="scss">
.re_input {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.re_input .el-input {
  width: 300px;
}
.dialog_basic2 .el-upload-list__item {
  margin-right: 20px;
}
.dialog_basic1 .el-dialog {
  height: 430px !important;
  .el-input {
    width: 200px !important;
  }
  .el-input__inner {
    width: 200px !important;
  }
}
.dialog_basic {
  .el-input {
    width: 248px;
  }
  .el-input__inner {
    width: 248px;
    &::placeholder {
      color: #666;
    }

    &::-webkit-input-placeholder {
      /* WebKit browsers 适配谷歌 */
      color: #666;
    }

    &:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 适配火狐 */
      color: #666;
    }

    &::-moz-placeholder {
      /* Mozilla Firefox 19+ 适配火狐 */
      color: #666;
    }

    &:-ms-input-placeholder {
      /* Internet Explorer 10+  适配ie*/
      color: #666;
    }
  }
  .el-dialog {
    width: 600px;
    // height: 450px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    .ssq {
      .el-input {
        width: 100px;
      }
      .el-input__inner {
        width: 100px;
        margin-right: 10px;
      }
    }
    .el-upload {
      margin-right: 20px;
      // display: flex;
      // flex-direction: column;
      // align-items: center;
      // justify-content: center;
      position: relative;
      .txt {
        position: absolute;
        top: 20px;
        right: 7px;
        height: 20px;
      }
      .el-upload-list {
        display: flex;
        justify-content: flex-start;
      }
      // 添加图片宽高
      .el-upload-list__item {
        width: 172px;
        height: 108px;
        border: 1px solid #dddbdb;
        // margin-right: 10px;
        // margin-right: 20px !important;
      }

      // 图片宽高
      .el-upload--picture-card {
        width: 172px;
        height: 108px;
        line-height: 108px;
      }
      .el-form-item__content {
        display: flex;
      }

      .hide .el-upload {
        display: none;
      }
    }
    .el-form-item__content {
      display: flex;
    }
    // 添加图片宽高
    .el-upload-list__item {
      width: 172px;
      height: 108px;
      border: 1px solid #dddbdb;
      // margin-right: 20px;
    }
    // 图片宽高
    .el-upload--picture-card {
      width: 172px;
      height: 108px;
      line-height: 108px;
    }
    //超过限制数量添加类命
    .hide {
      height: 108px;
      // margin-right: 20px !important;
    }
    .hide .el-upload {
      display: none;
    }
    .hide2 {
      width: 172px;
      height: 108px;
    }
    .hide2 .el-upload {
      display: none;
    }
    .hide3 .el-upload {
      display: none;
    }
    .hide3 {
      width: 172px;
      height: 108px;
    }
    .hide4 {
      width: 172px;
      height: 108px;
    }
    .hide4 .el-upload {
      display: none;
    }
    .hide5 {
      width: 172px;
      height: 108px;
    }
    .hide5 .el-upload {
      display: none;
    }
    .hide6 {
      width: 172px;
      height: 108px;
    }
    .hide6 .el-upload {
      display: none;
    }
    .el-dialog__header {
      letter-spacing: 1px;
      height: 50px;
      font-size: 22px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      display: flex;
      align-items: center;
    }
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
  .workaddress {
    .el-input {
      width: 120px;
    }
    .el-input__inner {
      width: 120px;
    }
  }
}
.sitedialog .el-dialog {
  width: 800px;
  .search {
    .el-form {
      justify-content: flex-start;
      display: flex;
      flex-wrap: wrap;
      width: 800px;
    }
    .el-form-item {
      display: flex;
      align-items: center;
      margin-right: 20px;
      .el-input {
        width: 180px;
      }
    }
  }
}
.sitedialog .el-dialog__body .el-table {
  width: 738px;
}
</style>


<style lang="scss">
// 地图的样式
.dia_map {
  .el-dialog {
    width: 1040px;
    min-height: 500px;
    .el-dialog__header {
      display: flex !important;
    }
    .el-dialog__body {
      height: 700px;
    }
  }
}
</style>