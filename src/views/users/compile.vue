<!--
 * @Description: 
 * @LastEditors: jun
 * @LastEditTime: 2019-11-25 18:50:37
 -->
<template>
  <div class="compile-wepper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>商户列表</el-breadcrumb-item>
      <el-breadcrumb-item>新增编辑商家</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>新增商家编辑</h1>
    <div class="input_div">
      <ul>
        <li>
          <span>账号</span>
          <el-input class="input" v-model="account" placeholder="请输入内容" clearable></el-input>
          <el-button
            style="margin-left:10px;"
            maxlength="11"
            type="primary"
            size="small"
            @click="opendialog"
          >请选择</el-button>
        </li>
        <li>
          <span>经营地址</span>
          <el-input class="input" v-model="shop_address" placeholder="请输入内容" clearable></el-input>
        </li>
        <li>
          <span>商家名称</span>
          <el-input class="input" v-model="shop_name" placeholder="请输入内容" clearable></el-input>
        </li>
        <li>
          <span>经营品类</span>
          <el-input class="input" v-model="category" placeholder="请输入内容" clearable></el-input>
          <el-button style="margin-left:10px;" type="primary" size="small" @click="opendialog2">请选择</el-button>
        </li>
        <li>
          <span>联系电话</span>
          <el-input class="input" v-model="moblie" maxlength="11" placeholder="请输入内容" clearable></el-input>
        </li>
        <li>
          <span>联系人</span>
          <el-input class="input" v-model="contact" placeholder="请输入内容" clearable></el-input>
        </li>
        <li>
          <span>所在地区</span>
          <el-select
            style="margin-right:20px "
            v-model="sheng"
            @change="choseProvince"
            placeholder="省级地区"
          >
            <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
          <el-select style="margin-right:20px" v-model="shi" @change="choseCity" placeholder="市级地区">
            <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
          <el-select
            style="margin-right:20px "
            v-model="qu"
            @change="choseBlock"
            placeholder="区级地区"
          >
            <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </li>
        <li>
          <span>详细地址</span>
          <el-input class="input" v-model="detail_address" placeholder="请输入内容"></el-input>
          <el-button style="margin-left:10px;" type="primary" size="small" @click="openMap">请选择</el-button>
        </li>
      </ul>
    </div>
    <div class="upload">
      <div class="left">
        <el-form :model="form" label-position="left" :label-width="formLabelWidth">
          <el-form-item label="商家logo/门脸图">
            <el-upload
              action
              list-type="picture-card"
              :on-change="onChange"
              :class="{hide1:hideUpload}"
              :on-remove="handleRemove"
              :auto-upload="false"
              :limit="2"
              accept=".jpg, .png"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="photo_url" />
            </el-dialog>
            <p class="tips">上传图片比例是1:1的等比大小，参考尺寸123*123像素。</p>
          </el-form-item>
          <el-form-item label="店内环境图">
            <el-upload
              action
              list-type="picture-card"
              :on-change="onChange2"
              :class="{hide2:hideUpload2}"
              :on-remove="handleRemove2"
              :auto-upload="false"
              :limit="1"
              accept=".jpg, .png"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible2">
              <img width="100%" :src="photo_url2" />
            </el-dialog>
            <p class="tips">上传图片比例是1:1的等比大小，参考尺寸123*123像素。</p>
          </el-form-item>
          <el-form-item label="法人姓名" prop="name">
            <el-input v-model="legal" placeholder="请输入法人姓名"></el-input>
          </el-form-item>
          <el-form-item label="法人手机号" prop="name">
            <el-input v-model="legal_mobile" maxlength="11" placeholder="请输入法人手机号"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <el-form :model="form" label-position="left" :label-width="formLabelWidth">
          <el-form-item label="身份证照片">
            <el-upload
              action
              list-type="picture-card"
              :on-change="onChange3"
              :class="{hide3:hideUpload3}"
              :on-remove="handleRemove3"
              :auto-upload="false"
              :limit="2"
              accept=".jpg, .png"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible3">
              <img width="100%" :src="photo_url3" />
            </el-dialog>
            <p class="tips">上传图片比例是6:5的等比大小，参考尺寸183*156像素。</p>
          </el-form-item>
          <el-form-item label="经营许可证">
            <el-upload
              action
              list-type="picture-card"
              :on-change="onChange4"
              :class="{hide4:hideUpload4}"
              :on-remove="handleRemove4"
              :auto-upload="false"
              :limit="1"
              accept=".jpg, .png"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible4">
              <img width="100%" :src="photo_url4" />
            </el-dialog>
            <p class="tips">上传图片比例是6:5的等比大小，参考尺寸183*156像素。</p>
          </el-form-item>
          <el-form-item label="身份证号码" prop="name">
            <el-input v-model="idcard" placeholder="请输入身份证照片"></el-input>
          </el-form-item>
          <el-form-item label="营业执照" prop="name">
            <el-upload
              action
              list-type="picture-card"
              :on-change="onChange5"
              :class="{hide5:hideUpload5}"
              :on-remove="handleRemove5"
              :auto-upload="false"
              :limit="1"
              accept=".jpg, .png"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible5">
              <img width="100%" :src="photo_url5" />
            </el-dialog>
          </el-form-item>
        </el-form>
        <div class="dispatching">
          <h2>合作方案</h2>
          <el-radio-group v-model="radio">
            <el-radio :label="1">小哥配送</el-radio>
            <el-radio :label="2">商家自配送</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <!-- 备注信息 -->
    <div class="note">
      <p class="p1">备注信息</p>
      <p class="p2">
        <span>备注</span>
        <span>无</span>
      </p>
    </div>
    <!-- 按钮 -->
    <div class="btn">
      <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>
    <!-- 账号弹窗 -->
    <div>
      <el-dialog
        :visible.sync="dialogTableVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :show-close="false"
      >
        <div class="search">
          <el-form class="demo-form-inline">
            <el-form-item label="用户ID">
              <el-input v-model="d_id" placeholder="请输入用户ID"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="d_moblie" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="d_name" placeholder="请输入昵称"></el-input>
            </el-form-item>
            <el-form-item label="会员等级">
              <el-select v-model="d_level" placeholder="请选择等级">
                <el-option
                  v-for="item in d_level_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="邀请码">
              <el-input v-model="d_code" placeholder="请输入邀请码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getvip(1)">搜索</el-button>
              <el-button style="margin-left:10px;" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-table
          highlight-current-row
          :data="gridData"
          @open="getvip(1)"
          @current-change="handleSelectionChange"
          :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
        >
          <el-table-column type="index" align="center" width="50"></el-table-column>
          <el-table-column property="custom_uid" align="center" label="用户ID" width="150"></el-table-column>
          <el-table-column property="mobile" align="center" label="手机号" width="150"></el-table-column>
          <el-table-column property="gender" align="center" label="性别" width="100"></el-table-column>
          <el-table-column property="name" align="center" label="昵称" width="180"></el-table-column>
          <el-table-column property="initve" align="center" label="邀请码"></el-table-column>
          <el-table-column property="level" align="center" label="会员等级" width="120"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="ok">确 定</el-button>
        </span>
        <!-- 分页 -->
        <div style="height:30px;width:700px;margin-top:20px;">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="total,prev,pager,next,jumper"
            :total="totals*1"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
    <!-- 经营品类 -->
    <div>
      <el-dialog
        class="dia"
        :visible.sync="dialogTableVisible2"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        @close="close2"
      >
        <div class="search">
          <el-form class="demo-form-inline">
            <el-form-item label="商品分类名称">
              <el-input v-model="category_title" placeholder="请输入商品分类名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getmanageList(1)">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- @selection-change="handleSelectionChange" -->
        <el-table
          ref="multipleTable"
          highlight-current-row
          :data="manageList"
          tooltip-effect="dark"
          :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800', height:'63px' }"
          row-key="id"
          lazy
          @current-change="handleSelectionChange2"
          :indent="25"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <!-- <el-table-column type="selection" width="50"></el-table-column> -->
          <el-table-column align="center" prop="id" label="分类ID" width="130"></el-table-column>
          <el-table-column align="center" prop="category_title" label="分类名称" width="150"></el-table-column>
          <el-table-column
            align="center"
            prop="shop_nums"
            label="商家数量"
            width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="xiaoge_rate" label="小哥专送抽佣(%)" width="120"></el-table-column>
          <el-table-column align="center" prop="shop_onself_rate" label="商家配送抽佣(%)" width="130"></el-table-column>
          <el-table-column align="center" prop="shop_mall_rate" label="商家抽佣(%)" width="110"></el-table-column>
          <el-table-column align="center" prop="group_buy_rate" label="团购抽佣(%)" width="120"></el-table-column>
          <el-table-column align="center" prop="to_shop_rate" label="到店付(%)" width="120"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="close2">取 消</el-button>
          <el-button type="primary" @click="ok2">确 定</el-button>
        </span>
        <!-- 分页 -->
        <div style="height:30px;width:700px;margin-top:20px;">
          <el-pagination
            background
            @current-change="handleCurrentChange2"
            layout="total,prev,pager,next,jumper"
            :total="totals2*1"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
    <!-- 地图 -->
    <div>
      <el-dialog
        :destroy-on-close="true"
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
  </div>
</template>

<script>
import axios from "axios";
import { getBase64, getsrc } from "../../utils/base64.js";
// import {getCityData} from "../../utils/address.js"
import Map from "./map.vue";
import { isArray } from "util";

export default {
  data() {
    return {
      //弹窗
      totals: "",
      totals2: "",
      gridData: [],
      dialogTableVisible: false,
      custom_account: "", //账号
      manageList: [],
      category_title: "",
      dialogTableVisible2: false,
      nid: "",
      rowIds: [],
      //弹窗搜索
      d_id: "",
      d_moblie: "",
      d_name: "",
      d_code: "",
      d_level: "",
      d_level_list: [
        { value: 0, label: "小哥粉" },
        { value: 1, label: "小哥" },
        { value: 2, label: "小V哥" },
        { value: 3, label: "V哥" }
      ],
      //
      account: "",
      shop_address: "",
      shop_name: "",
      category: "",
      moblie: "",
      contact: "",
      detail_address: "",
      /****** 加载地点数据********/
      mapJson: "./json/map.json",
      province: "",
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: [],
      block: "",
      /****** 其它data********/
      radio: 1,
      value: [],
      option: [],
      imageUrl: "",
      //
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      img1: "",
      //
      dialogVisible2: false,
      hideUpload2: false,
      img2: "",
      //
      dialogVisible3: false,
      hideUpload3: false,
      limitCount3: 2,
      imgarr3: [],
      //
      dialogVisible4: false,
      hideUpload4: false,
      img4: "",
      //
      dialogVisible5: false,
      hideUpload5: false,
      img5: "",
      formLabelWidth: "130px",
      //商店信息
      form: {
        classify_photo: ""
      },
      legal: "",
      legal_mobile: "",
      idcard: "",
      license: "",
      photo_url: "",
      photo_url2: "",
      photo_url3: "",
      photo_url4: "",
      photo_url5: "",
      //存放图片
      imgarr: [],
      lon: "",
      lat: "",
      //地图
      innerVisible: false,
      lon1: "",
      lat1: ""
    };
  },
  components: {
    Map
  },
  watch: {},
  created() {
    this.getCityData();
  },
  computed: {
    mapInfo: function() {
      return this.$store.state;
    }
  },
  methods: {
    openMap() {
      this.innerVisible = true;
      this.$store.commit("getMapData4", true);
      // this.lon = "";
      // this.lat = "";
    },
    //关闭地图控件
    cancelMap() {
      this.innerVisible = false;
      this.$store.commit("getMapData4", false);
      // this.lon = this.lon1;
      // this.lat = this.lat1;
    },
    //确认地图
    getMapData() {
      this.sheng = this.mapInfo.mapdata2.province;
      if (isArray(this.mapInfo.mapdata2.city)) {
        this.shi = this.mapInfo.mapdata2.province;
      } else {
        this.shi = this.mapInfo.mapdata2.city;
      }
      // this.qu = this.mapInfo.mapdata2.district;
      this.lon = this.mapInfo.mapdata.lng; //经度
      this.lat = this.mapInfo.mapdata.lat; //纬度
      // let arr = this.mapInfo.mapdata3.split("区");
      //正则替换  把 '街道' 和 '镇' 替换城 qu
      let str = this.mapInfo.mapdata3.replace(/(街道)|(镇)/, "区");
      let arr = str.split("区");
      if (arr.length <= 2) {
        arr.splice(0, 1);
        this.detail_address = arr[0];
      } else {
        arr.splice(0, 2);
        this.detail_address = arr.join("");
        // console.log(this.re_address, "22222323232323232");
      }
      // this.detail_add = this.mapInfo.mapdata3.split('区');
      this.innerVisible = false;
    },
    //重置
    resetForm() {
      this.d_id = "";
      this.d_moblie = "";
      this.d_name = "";
      this.d_code = "";
      this.d_level = "";
    },
    //取消
    close() {
      this.dialogTableVisible = false;
      if (!this.custom_account) {
        // this.uid = "";
        this.account = "";
      }
    },
    close2() {
      this.dialogTableVisible2 = false;
      this.nid2 = "";
      this.category2 = "";
      this.manageList = [];
    },
    ok2() {
      this.dialogTableVisible2 = false;
      this.nid = this.nid2;
      this.category = this.category2;
    },
    //批量选择
    handleSelectionChange2(currentRow, oldCurrentRow) {
      console.log(currentRow);
      // this.nid = currentRow.id;
      // this.category = currentRow.category_title;
      this.nid2 = currentRow.id;
      this.category2 = currentRow.category_title;
    },
    ok() {
      this.dialogTableVisible = false;
      // this.custom_uid = this.uid;
      this.custom_account = this.account;
    },
    //// 搜索获取列表
    getvip(page) {
      // this.dialogTableVisible = true;
      this.$axios({
        method: "GET",
        url: "/backend/CustomUser/member",
        params: {
          id: this.d_id,
          mobile: this.d_moblie,
          vip_level: this.d_level,
          invite_code: this.d_code,
          nick_name: this.d_name,
          size: 10,
          page: page
        }
      }).then(res => {
        this.gridData = [];
        console.log(res, "1");
        this.totals = res.data.data.total;
        let userdata = res.data.data.data;
        userdata.forEach(item => {
          const { user_info_data } = item;
          const {
            gender_title,
            invite_code,
            vip_level_title,
            nick_name
          } = user_info_data;
          item.gender = gender_title;
          item.initve = invite_code;
          item.level = vip_level_title;
          item.name = nick_name;
          item.is_show = item.status_title;
          this.gridData.push(item);
        });
        console.log(this.gridData);
      });
    },
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getvip(val);
    },
    //批量选择
    handleSelectionChange(currentRow, oldCurrentRow) {
      console.log(currentRow.mobile);
      console.log(currentRow.custom_uid);
      this.uid = currentRow.custom_uid;
      this.account = currentRow.mobile;
    },
    opendialog() {
      // console.log(this.img1);
      this.dialogTableVisible = true;
      this.getvip();
    },

    opendialog2() {
      // console.log(this.img1);
      this.dialogTableVisible2 = true;
      this.getmanageList(1);
    },
    getmanageList(page) {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/shopCategoryList",
        params: {
          category_title: this.category_title,
          page: page,
          size: 10
        }
      }).then(res => {
        this.totals2 = res.data.data.total;
        console.log(res.data.data);
        this.manageList = res.data.data.data;
      });
    },
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`);
      this.getmanageList(val);
    },
    getlongitude(e) {
      if (this.sheng && this.shi && this.qu && this.detail_address) {
        axios
          .get("https://restapi.amap.com/v3/geocode/geo?parameters", {
            params: {
              key: "0b1d2d29e777f34081720f95df640092",
              address: this.sheng + this.shi + this.qu + this.detail_address
            }
          })
          .then(response => {
            let str = response.data.geocodes[0].location;
            let temp = str.split(",");
            this.lon = temp[0]; //经度
            this.lat = temp[1]; //纬度
            // console.log(temp[0]);
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        this.$message.error("请完善地址");
      }
    },
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    // 提交 /backend/Merchant/shopAdd
    onSubmit() {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/shopAdd",
        data: {
          contacts: this.contact,
          category_id: this.nid,
          contact_information: this.moblie,
          leal_person: this.legal,
          mobile: this.legal_mobile,
          business_license_image: this.img5,
          licence_other_image: this.img4,
          idcard_no: this.idcard,
          idcard_face_image: this.imgarr3[0],
          idcard_back_image: this.imgarr3[1],
          shop_title: this.shop_name,
          shop_cover_image: this.img1,
          shop_bg_image: this.img2,
          province: this.sheng,
          city: this.shi,
          area: this.qu,
          address: this.detail_address,
          business_address: this.shop_address,
          longitude: this.lon,
          latitude: this.lat,
          delivery_service: this.radio
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.$message.success("提交成功");
          // this.$router.push({ name: "" });
          this.$router.go(-1);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //限制图片大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024;
      if (isLt2M > 2) {
        // this.$message.error('上传头像图片大小不能超过 2MB!');
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    //删除图片出发的事件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.hideUpload = fileList.length >= this.limitCount;
    },
    handleRemove2(file, fileList) {
      console.log(file, fileList);
      this.hideUpload2 = fileList.length >= this.limitCount;
    },
    handleRemove3(file, fileList) {
      console.log(file, fileList);
      this.hideUpload3 = fileList.length >= this.limitCount3;
    },
    handleRemove4(file, fileList) {
      console.log(file, fileList);
      this.hideUpload4 = fileList.length >= this.limitCount;
    },
    handleRemove5(file, fileList) {
      console.log(file, fileList);
      this.hideUpload5 = fileList.length >= this.limitCount;
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
            this.img1 = res.data.data.url;
          });
        });
      });
      this.photo_url = file.url;
      this.hideUpload = fileList.length >= this.limitCount;
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
            this.img2 = res.data.data.url;
          });
        });
      });
      this.photo_url2 = file.url;
      this.hideUpload2 = fileList.length >= this.limitCount;
    },
    onChange3(file, fileList) {
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
            this.imgarr3.push(res.data.data.url);
          });
        });
      });
      this.photo_url3 = file.url;
      this.hideUpload3 = fileList.length >= this.limitCount3;
    },
    onChange4(file, fileList) {
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
            this.img4 = res.data.data.url;
          });
        });
      });
      this.photo_url4 = file.url;
      this.hideUpload4 = fileList.length >= this.limitCount;
    },
    onChange5(file, fileList) {
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
            this.img5 = res.data.data.url;
          });
        });
      });
      this.photo_url5 = file.url;
      this.hideUpload5 = fileList.length >= this.limitCount;
    },

    /**********************加载地点数据*******************************************/
    // 加载china地点数据，三级
    getCityData: function() {
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
    choseProvince: function(e) {
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shi1 = this.province[index2].children;
          this.shi = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.qu = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
          this.sheng = this.province[index2].value;
          console.log("选省", this.sheng);
          console.log("选省", this.E);
        }
      }
    },
    // 选市
    choseCity: function(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shi = this.city[index3].value;
          console.log("选市", this.shi);
          console.log("选市", this.E);
        }
      }
      if (!this.shi) {
        this.qu = "";
      }
    },
    // 选区
    choseBlock: function(e) {
      this.E = e;
      for (var i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.qu = this.qu1[i].value;
          console.log("选区", this.qu, this.sheng + this.shi + this.qu);
        }
      }
      console.log("选区", this.E);
    }

    /******************************************************* */
  }
};
</script>



<style lang="scss" scoped>
.compile-wepper {
  h1 {
    margin-top: 10px;
    width: 139px;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 30px;
  }
  h2 {
    width: 126px;
    height: 26px;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 26px;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 30px;
  }
  .input_div {
    // width: 800px;
    width: fit-content;
    // height: 500px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    box-sizing: border-box;
    border-radius: 4px;
    padding: 20px;
    ul {
      flex: 1;
      display: flex;
      flex-direction: column;
      li {
        // width: 348px;
        height: 60px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: rgba(51, 51, 51, 1);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        span {
          margin-right: 20px;
          width: 100px;
        }
        .input {
          width: 240px;
          height: 34px;
          border-radius: 2px;
        }
      }
    }
  }

  h3 {
    line-height: 60px;
    height: 60px;
    margin-left: 40px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 21px;
    color: rgba(51, 51, 51, 1);
    line-height: 70px;
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
  .btn {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 50px;
  }
}
</style>
<style lang="scss">
.dia .el-dialog {
  width: 1020px;
}
//上传图片
.upload {
  margin-top: 40px;
  display: flex;
  width: 1276px;
  // height: 545px;
  border: 1px solid rgba(241, 241, 241, 1);
  box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
  border-radius: 4px;
  .left,
  .right {
    width: 50%;
    height: 100%;
  }
  .left {
    padding: 40px 0 0 30px;
    //提示
    .tips {
      margin-top: 15px;
      font-size: 14px;
      font-weight: 400;
      line-height: 19px;
      color: rgba(102, 102, 102, 1);
    }
    .el-form-item {
      margin-bottom: 30px;
      .el-input,
      .el-input__inner {
        width: 248px;
      }
      .el-upload-list__item {
        width: 64px;
        height: 64px;
        border: 1px solid #dddbdb;
      }
      .el-form-item__label {
        font-size: 0.16rem;
      }
      // 图片宽高
      .el-upload--picture-card {
        width: 64px;
        height: 64px;
        line-height: 65px;
      }
      .el-icon-plus {
        font-size: 0.2rem;
      }
      .hide1 {
        width: 64px;
        height: 64px;
      }
      .hide2 {
        width: 64px;
        height: 64px;
      }
      //超过限制数量添加类命
      .hide1 .el-upload {
        display: none;
      }
      .hide2 .el-upload {
        display: none;
      }
    }
  }
  .right {
    padding: 40px 0 0 30px;
    //提示
    .tips {
      margin-top: 15px;
      font-size: 14px;
      font-weight: 400;
      line-height: 19px;
      color: rgba(102, 102, 102, 1);
    }
    .el-form-item {
      margin-bottom: 30px;
      .el-input,
      .el-input__inner {
        width: 248px;
      }
      .el-upload-list__item {
        width: 80px;
        height: 80px;
        border: 1px solid #dddbdb;
      }
      .el-form-item__label {
        font-size: 0.16rem;
      }
      // 图片宽高
      .el-upload--picture-card {
        width: 80px;
        height: 80px;
        line-height: 81px;
      }
      .el-icon-plus {
        font-size: 0.2rem;
      }
      // .hide3 {
      //   width: 80px;
      //   height: 80px;
      // }
      .hide4 {
        width: 80px;
        height: 80px;
      }
      .hide5 {
        width: 80px;
        height: 80px;
      }
      //超过限制数量添加类命
      .hide3 .el-upload {
        display: none;
      }
      .hide4 .el-upload {
        display: none;
      }
      .hide5 .el-upload {
        display: none;
      }
    }
    //选择配送方式
    .dispatching {
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      h2 {
        height: 30px;
        font-size: 16px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        margin-right: 20px;
        margin-bottom: 0;
      }
    }
  }
}
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
</style>

