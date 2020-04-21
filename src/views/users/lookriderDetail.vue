<!--
 * @Description: 
 * @Author: jun
 * @Date: 2019-09-10 10:55:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-11 16:59:30
 -->
<template>
  <div class="riderdetails-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item to="./horseman">骑手列表</el-breadcrumb-item>
      <el-breadcrumb-item>查看基本信息</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>查看基本信息</h1>
    <!-- 信息 -->
    <div class="account common">
      <h2>
        账户信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>启用状态</span>
          <span>{{account_status}}</span>
        </li>
        <li>
          <span>注册时间</span>
          <span>{{create_time}}</span>
        </li>
        <li v-show="status==1">
          <span>缴纳保证金</span>
          <span>{{deposit}}/{{deposit_status}}</span>
        </li>
        <li>
          <span>申请时间</span>
          <span>{{update_time}}</span>
        </li>
        <li>
          <span>最近登录时间</span>
          <span>{{last_login_time}}</span>
        </li>
        <li v-show="status==1">
          <span>累计派单</span>
          <span>{{rider_order_count}}</span>
        </li>
      </div>
    </div>
    <div class="basic common">
      <h2>
        基本信息
        <i></i>
        <span class="el-icon-edit" v-show="ischange" @click="setinfo"></span>
      </h2>
      <div class="common2">
        <li>
          <span>用户ID</span>
          <span>{{custom_uid}}</span>
        </li>
        <li>
          <span>手机号</span>
          <span>{{contact_information}}</span>
        </li>
        <li>
          <span>姓名</span>
          <span>{{contacts}}</span>
        </li>
        <li>
          <span>性别</span>
          <span>{{gender}}</span>
        </li>
        <li>
          <span>工作地点</span>
          <span>{{a}} {{b}} {{c}} {{site_title}}</span>
        </li>
        <li>
          <span>头像</span>
          <img :src="avatar" />
        </li>
        <li>
          <span>员工类型</span>
          <span>{{position_type_value}}</span>
        </li>
        <li>
          <span>送餐时间</span>
          <span>{{delivery_time}}</span>
        </li>
      </div>
    </div>
    <div class="attestation common">
      <h2>
        认证信息
        <i></i>
        <span class="el-icon-edit" v-show="ischange" @click="set_idcarImg"></span>
      </h2>
      <div class="common2">
        <li>
          <span>身份正反面照片</span>
          <img :src="idcard_face_image" class="imgsrc" alt="身份正面照片" />
          <img :src="idcard_back_image" class="imgsrc" alt="身份反面照片" />
        </li>
        <li>
          <span>手持身份证正面照</span>
          <img :src="idcard_hand_image" class="imgsrc" alt="手持身份证正面照" />
        </li>
      </div>
    </div>

    <div class="sdiv2">
      <span class="s1">审核状态</span>
      <el-radio-group v-model="radio" @change="changes" v-show="status==0">
        <el-radio :label="1">审核通过</el-radio>
        <el-radio :label="2">驳回申请</el-radio>
      </el-radio-group>
      <p v-show="status==1">审核通过</p>
      <p v-show="status==-1">审核被驳回</p>
    </div>

    <!-- 备注信息 -->
    <div class="note">
      <p class="p1" @click="centerDialogVisible = true">
        备注信息
        <el-link icon="el-icon-edit" @click="centerDialogVisible = true"></el-link>
      </p>
      <el-dialog
        title="备注"
        :visible.sync="centerDialogVisible"
        width="450px"
        @close="clearTextarea"
        left
      >
        <textarea cols="30" rows="10" class="input-el" v-model="textarea"></textarea>

        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="memberRemark">确 定</el-button>
        </span>
      </el-dialog>
      <p class="p2">
        <span>备注</span>
        <span>{{textarea2?textarea2:'无'}}</span>
      </p>
    </div>

    <!-- 按钮 -->
    <div class="btn">
      <el-button
        type="primary"
        style="margin-right:20px;"
        @click="auditRider"
        v-show="status ==0"
      >提交</el-button>
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>

    <!-- 基本信息修改 -->
    <div class="dialog_basic">
      <el-dialog
        title="修改骑手基本信息"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogFormVisible"
        @close="cancel"
      >
        <div class="common2">
          <li>
            <span>手机号</span>
            <el-input v-model="contact_information2" placeholder="请输入内容"></el-input>
          </li>
          <li>
            <span>姓名</span>
            <el-input v-model="contacts2" placeholder="请输入内容"></el-input>
          </li>
          <!-- <li>
            <span>性别</span>
            <el-input v-model="input3" placeholder="请输入内容"></el-input>
          </li>-->
          <li class="workaddress">
            <span>工作地点</span>
            <el-select
              clearable
              v-model="sheng"
              @change="choseProvince"
              placeholder="省级地区"
              no-data-text="请选择省份"
            >
              <el-option
                v-for="item in province"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              style="margin:0 10px;"
              v-model="shi"
              @change="choseCity"
              placeholder="市级地区"
              no-data-text="请选择城市"
              clearable
            >
              <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
            <el-select
              clearable
              no-data-text="请选择区"
              v-model="qu"
              @change="choseBlock"
              placeholder="区级地区"
            >
              <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </li>
          <li>
            <span>站点</span>
            <el-select v-model="site" placeholder="请选择" @change="changeSite">
              <el-option
                v-for="item in site_list"
                :key="item.id"
                :label="item.site_title"
                :value="item.id"
              ></el-option>
            </el-select>
          </li>
          <li>
            <span>头像</span>
            <img :src="avatar2" class="photo" alt="暂无头像" />
            <el-upload
              action
              list-type="picture-card"
              :on-change="onChange"
              :class="{hide:hideUpload}"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
              <p class="txt">上传需修改照片</p>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" />
            </el-dialog>
          </li>
          <li>
            <span>员工类型</span>
            <el-select v-model="position_type_value2" placeholder="请选择" @change="changetype">
              <el-option
                v-for="item in position_type_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li v-show="position_type2==2">
            <span>送餐时间</span>
            <el-select v-model="delivery_time2" placeholder="请选择" @change="changetime">
              <el-option
                v-for="item in delivery_time_list"
                :key="item.id"
                :label="item.val"
                :value="item.id"
              ></el-option>
            </el-select>
          </li>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改身份证 -->
    <div class="dialog_basic">
      <el-dialog
        title="认证信息"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="cancel2"
        :visible.sync="dialogFormVisible2"
      >
        <div class="common2">
          <li>
            <span>身份正面</span>
            <!-- 正面 -->
            <img :src="idcard_face_image" class="photo" />
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
          </li>
          <!-- 反面 -->
          <li>
            <span>身份反面</span>
            <img :src="idcard_back_image" class="photo" />
            <el-upload
              action
              list-type="picture-card"
              :on-change="onChange3"
              :class="{hide3:hideUpload3}"
              :on-remove="handleRemove3"
              :auto-upload="false"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible3">
              <img width="100%" :src="dialogImageUrl3" />
            </el-dialog>
          </li>
          <!-- 手持 -->
          <li>
            <span>手持身份证正面照</span>
            <img :src="idcard_hand_image" class="photo" />
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
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel2">取 消</el-button>
          <el-button type="primary" @click="save2">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import { getBase64 } from "../../utils/base64.js";
import axios from "axios";
export default {
  data() {
    return {
      //身份证信息弹出层
      dialogFormVisible2: false,
      idcard: "",
      // 基本信息弹出层
      dialogFormVisible: false,
      contact_information2: "",
      contacts2: "",
      site: "", //站点
      site_list: [],
      position_type2: "",
      avatar2: "",
      delivery_time2: "",
      position_type_value2: "",
      a: "",
      b: "",
      c: "",
      position_type_list: [
        { value: "1", label: "专职" },
        { value: "2", label: "兼职" }
      ],
      delivery_time_list: [],
      //省市区
      mapJson: "./json/map.json",
      province: [],
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",
      //上传图片
      img1: "",
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
      //
      ischange: "", //是否能编辑
      radio: 1,
      rider_ids: "",
      /*账号状态*/
      account_status: "",
      create_time: "",
      update_time: "",
      last_login_time: "",
      rider_order_count: "",
      deposit: "",
      deposit_status: "",
      /*用户信息*/
      custom_uid: "",
      contact_information: "",
      contacts: "",
      gender: "",
      address: "",
      position_type: "",
      position_type_value: "",
      avatar: "",
      delivery_time: "",
      site_title: "",
      /*身份证信息*/
      idcard_face_image: "",
      idcard_back_image: "",
      idcard_hand_image: "",
      status: "",
      delivery_site_id: "",
      delivery_time_id: "",
      //备注信息
      centerDialogVisible: false,
      textarea: "",
      textarea2: ""
    };
  },
  created() {
    this.rider_ids = sessionStorage.getItem("rider");
    this.ischange = sessionStorage.getItem("r_change");
    // this.ischange = this.$route.params.ischange || 0;
    // this.rider_ids = this.$route.params.rider;
    this.getDetail();
    // this.getCityData();
  },
  watch: {
    position_type2() {
      console.log(this.position_type2);
      this.getDeliveryTime();
    },
    img2() {
      console.log(this.img2);
    }
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //获取详情信息 /backend/Rider/getRider
    getDetail() {
      this.$axios({
        method: "GET",
        url: "/backend/Rider/getRider",
        params: {
          // rider_id: this.rider_ids
          rider_id: this.rider_ids
        }
      }).then(res => {
        console.log(res);
        let obj = res.data.data;
        //账户信息
        this.create_time = obj.create_time;
        this.update_time = obj.update_time;
        this.account_status = obj.account_status;
        this.last_login_time = obj.last_login_time;
        this.rider_order_count = obj.rider_order_count;
        this.deposit = obj.deposit;
        this.deposit_status = obj.deposit_status;
        //用户信息
        this.avatar = obj.avatar;
        this.gender = obj.gender;
        // this.address = `${obj.province} ${obj.city} ${obj.area} ${obj.site_title}`;
        this.a = obj.province;
        this.b = obj.city;
        this.c = obj.area;
        this.site_title = obj.site_title;
        // this.address = obj.address;
        this.contacts = obj.contacts;
        this.custom_uid = obj.custom_uid;
        this.position_type = obj.position_type;
        this.position_type_value = obj.position_type_value;
        this.delivery_time = obj.delivery_time;
        this.contact_information = obj.contact_information;
        //备注信息
        this.textarea2 = obj.remark;
        //认证信息
        this.idcard_face_image = obj.idcard_face_image;
        this.idcard_back_image = obj.idcard_back_image;
        this.idcard_hand_image = obj.idcard_hand_image;
        //审核状态
        this.status = obj.status;
        //站点
        this.delivery_site_id = obj.delivery_site_id;
        this.delivery_time_id = obj.delivery_time_id;
      });
    },
    changes(val) {
      if (val == 1) {
        this.open(val, "您是否通过该骑手");
      }
      if (val == 2) {
        this.open(val, "您是否驳回该骑手");
      }
    },
    open(val, txt) {
      this.$confirm(txt + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.radio = val;
        })
        .catch(() => {
          this.radio = "";
        });
    },
    //审核 /backend/Rider/passRider 驳回  /backend/Rider/refuseRider
    pass_and_refuse(url) {
      if (this.radio) {
        this.$axios({
          method: "POST",
          url: url,
          data: {
            rider_id: this.rider_ids
          }
        }).then(res => {
          console.log(res);
          this.$message.success(res.data.msg);
        });
      } else {
        this.$message.error("请选择通过或者驳回");
      }
    },
    auditRider() {
      if (this.radio == 1) {
        this.pass_and_refuse("/backend/Rider/passRider");
      }
      if (this.radio == 2) {
        this.pass_and_refuse("/backend/Rider/refuseRider");
      }
    },
    setinfo() {
      this.dialogFormVisible = true;
      this.getCityData(); //省市区
      this.choseProvince();
      this.choseCity();
      this.choseBlock();
      this.contact_information2 = this.contact_information;
      this.contacts2 = this.contacts;
      this.sheng = this.a;
      this.shi = this.b;
      this.qu = this.c;
      this.site = this.site_title;
      this.avatar2 = this.avatar;
      this.position_type2 = this.position_type * 1;
      this.position_type_value2 = this.position_type_value;
      console.log(this.position_type_value, 555);
      this.delivery_time2 = this.delivery_time;
      if (this.position_type2 == 2) {
        this.getDeliveryTime(); //配送时间
      }
      if (this.sheng && this.shi && this.qu) {
        this.getDeliverySite(this.sheng, this.shi, this.qu);
      }
    },
    //清除备注信息
    clearTextarea() {
      this.textarea = "";
    },
    //修改备注
    memberRemark() {
      this.$axios({
        method: "POST",
        url: "/backend/Rider/editRemark",
        data: {
          rider_id: this.rider_ids,
          remark: this.textarea,
          edit_type: 1
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.centerDialogVisible = false;
          console.log(res);
          this.textarea2 = this.textarea;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //保存信息 /backend/Rider/editRiderBase
    save() {
      if (!this.img1) {
        this.img1 = this.avatar2;
      }
      this.getsave();
    },
    // clearImg(){
    //   this.img2 = "";
    //   this.img3 = "";
    //   this.img4 = "";
    // }
    // /backend/Rider/editRiderImage
    save2() {
      this.dialogFormVisible2 = false;
      // this.$router.push({ name: "lookriderDetail" });
      this.$axios({
        method: "POST",
        url: "/backend/Rider/editRiderImage",
        data: {
          rider_id: this.rider_ids,
          idcard_face_image: this.img2,
          idcard_back_image: this.img3,
          idcard_hand_image: this.img4
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.dialogFormVisible2 = false;
          this.getDetail();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
        // this.$router.push({name:"lookriderDetail"});
      });
    },
    getsave() {
      this.$axios({
        method: "POST",
        url: "/backend/Rider/editRiderBase",
        data: {
          rider_id: this.rider_ids,
          avatar: this.img1,
          position_type: this.position_type2,
          delivery_site_id: this.delivery_site_id,
          delivery_time_id:
            this.position_type2 == 2 ? this.delivery_time_id : "",
          province: this.sheng,
          city: this.shi,
          area: this.qu,
          contacts: this.contacts2,
          contact_mobile: this.contact_information2
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.getDetail();
          this.dialogFormVisible = false;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //取消
    cancel() {
      this.dialogFormVisible = false;
      this.rider_id = "";
      this.avatar2 = "";
      this.position_type_value2 = "";
      this.position_type2 = "";
      this.site = "";
      this.delivery_time_id = "";
      this.sheng = "";
      this.shi = "";
      this.qu = "";
      this.contacts2 = "";
      this.contact_information2 = "";
    },
    cancel2() {
      this.dialogFormVisible2 = false;
      this.img2 = "";
      this.img3 = "";
      this.img4 = "";
    },
    //选择站点
    changeSite() {
      this.delivery_site_id = this.site;
    },
    //员工类型
    changetype(val) {
      console.log(val);
      this.position_type2 = this.position_type_value2;
    },
    //选择时间
    changetime() {
      this.delivery_time_id = this.delivery_time2;
    },
    set_idcarImg() {
      this.dialogFormVisible2 = true;
      this.img2 = this.idcard_face_image;
      this.img3 = this.idcard_back_image;
      this.img4 = this.idcard_hand_image;
    },
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
          this.sheng = this.province[index2].value;
          console.log("选省", this.sheng);
          // console.log("选省", this.E);
        }
      }
      if (this.sheng && this.shi && this.qu) {
        this.getDeliverySite(this.sheng, this.shi, this.qu);
      }
    },
    // 选市
    choseCity(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shi = this.city[index3].value;
          console.log("选市", this.shi);
          // console.log("选市", this.E);
        }
      }
      if (!this.shi) {
        this.qu = "";
      }
      if (this.sheng && this.shi && this.qu) {
        this.getDeliverySite(this.sheng, this.shi, this.qu);
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
      if (!this.shi) {
        this.qu = "";
      }
      if (this.sheng && this.shi && this.qu) {
        this.getDeliverySite(this.sheng, this.shi, this.qu);
      }
    },

    //获取配送时间 /backend/ParamSetting/getDeliveryTime
    getDeliveryTime() {
      this.$axios({
        method: "GET",
        url: "/backend/ParamSetting/getDeliveryTime"
      }).then(res => {
        console.log(res);
        this.delivery_time_list = res.data.data;
        this.delivery_time_list.map(item => {
          item.val = `${item.title}  ${item.value}`;
        });
      });
    },
    // 获取站点 /backend/Rider/getDeliverySite
    getDeliverySite(a, b, c) {
      this.$axios({
        method: "GET",
        url: "/backend/Rider/getDeliverySite",
        params: {
          province: a,
          city: b,
          area: c
        }
      }).then(res => {
        console.log(res);
        this.site_list = res.data.data;
        this.site = res.data.data[0].site_title;
      });
    },
    /*******************************************/

    //删除图片出发的事件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.hideUpload = fileList.length >= this.limitCount;
    },
    handleRemove2(file, fileList) {
      console.log(file, fileList);
      this.hideUpload2 = fileList.length >= this.limitCount2;
    },
    handleRemove3(file, fileList) {
      console.log(file, fileList);
      this.hideUpload3 = fileList.length >= this.limitCount3;
    },
    handleRemove4(file, fileList) {
      console.log(file, fileList);
      this.hideUpload4 = fileList.length >= this.limitCount4;
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
    beforeAvatarUpload2(file) {
      const isLt2M = file.size / 1024 / 1024;
      if (isLt2M > 2) {
        // this.$message.error('上传头像图片大小不能超过 2MB!');
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    beforeAvatarUpload3(file) {
      const isLt2M = file.size / 1024 / 1024;
      if (isLt2M > 2) {
        // this.$message.error('上传头像图片大小不能超过 2MB!');
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
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
          this.img1 = res.data.data.url;
        });
      });
      this.dialogImageUrl = file.url;
      this.hideUpload = fileList.length >= this.limitCount;
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
      console.log(this.img2);
      this.dialogImageUrl2 = file.url;
      this.hideUpload2 = fileList.length >= this.limitCount2;
    },
    onChange3(file, fileList) {
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
    }
  }
};
</script>
 
<style lang="scss" scoped>
.riderdetails-wapper {
  h1 {
    margin: 10px 0 34px 0;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  h2 {
    width: 110px;
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
    flex-direction: row;
    margin-bottom: 20px;
    line-height: 21px;
    img {
      width: 116px;
      height: 116px;
      // background: #ccc;
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
  .common2 li span:nth-child(1) {
    width: 102px;
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
    width: 356px;
    // height: 252px;
    margin-bottom: 40px;
  }
  .basic {
    width: 530px;
    height: 514px;
    margin-bottom: 40px;
  }
  .attestation {
    width: 583px;
    // height: 369px;
    .imgsrc {
      width: 172px;
      height: 108px;
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
    font-weight: bold;
    font-size: 18px;
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
    // width: 300px;
    display: flex;
    align-items: center;
  }
}
</style>
<style lang="scss">
.note {
  .input-el {
    width: 400px;
    height: 180px;
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
    margin-right: 0 !important;
  }
}
.dialog_basic {
  .el-input {
    width: 248px;
  }
  .el-input__inner {
    width: 248px;
  }
  .el-dialog {
    width: 570px;
    // height: 668px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    .el-upload {
      margin-right: 20px;
      // display: flex;
      // flex-direction: column;
      // align-items: center;
      // justify-content: center;
      position: relative;
      .txt {
        position: absolute;
        top: 25px;
        right: 40px;
        height: 20px;
      }
    }
    // 添加图片宽高
    .el-upload-list__item {
      width: 172px;
      height: 108px;
      border: 1px solid #dddbdb;
      margin-right: 20px;
    }
    // 图片宽高
    .el-upload--picture-card {
      width: 172px;
      height: 108px;
      line-height: 108px;
    }
    //超过限制数量添加类命
    .hide .el-upload {
      display: none;
    }
    .hide2 .el-upload {
      display: none;
    }
    .hide3 .el-upload {
      display: none;
    }
    .hide4 .el-upload {
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
</style>