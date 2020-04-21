<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-10-14 19:51:28
 * @LastEditors: Roc
 * @LastEditTime: 2019-12-03 14:17:13
 -->
<template>
  <div>
    <div class="admindetails-wpper">
      <section class="section">系统管理/管理员管理/管理员详情</section>
      <h1 class="h1">管理员详情</h1>

      <div class="div_fom_box">
        <div class="div_left">
          <h2 class="fromtitle">基本信息</h2>
          <el-form
            :model="ruleForm1"
            ref="ruleForm1"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm1"
          >
            <el-form-item label="状态" prop="resource">
              <el-radio-group v-model="ruleForm1.resource">
                <el-radio label="1">启用</el-radio>
                <el-radio label="2">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="账号" prop="account">
              <el-input class="input" v-model="ruleForm1.account" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="登录密码">
              <el-input
                class="input"
                placeholder="请输入密码"
                v-model="ruleForm1.pass"
                show-password
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input
                class="input"
                type="password"
                v-model="ruleForm1.checkPass"
                show-password
                autocomplete="off"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="region">
              <el-select class="input" v-model="ruleForm1.region" placeholder="请选择角色">
                <el-option
                  v-for="(item,idx) in regiondata"
                  :key="idx"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="div_right">
          <el-form
            :model="ruleForm2"
            ref="ruleForm2"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm2"
          >
            <div class="h5img">
              <div class="up_div">
                <span class="up_label">头像</span>
                <div class="del" v-show="dialogImageUrl?1:0">
                  <img :src="dialogImageUrl" />
                  <div class="bg"></div>
                  <i class="el-icon-delete" @click="goimg"></i>
                </div>
                <el-upload
                  v-show="dialogImageUrl==''"
                  class="avatar-uploader"
                  :class="{hide:hideUpload}"
                  action
                  list-type="picture-card"
                  :on-change="onChange"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :before-upload="beforeAvatarUpload"
                  :auto-upload="false"
                  :limit="1"
                  accept=".jpg, .png"
                >
                  <i class="el-icon-circle-plus-outline avatar-uploader-icon"></i>
                </el-upload>
                <!-- <el-dialog :visible.sync="dialogImageUrl">
                <img width="100%" :src="dialogImageUrl" />
                </el-dialog>-->
              </div>
            </div>
            <el-form-item label="备注" prop="beizu">
              <el-input class="input" v-model="ruleForm2.beizu" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input class="input" v-model="ruleForm2.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="iphone">
              <el-input class="input" v-model="ruleForm2.iphone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱">
              <el-input class="input" v-model="ruleForm2.email" placeholder="请输入邮箱地址"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 返回 -->
      <div class="btn_div">
        <el-button type="primary" plain @click="submitForm">提交</el-button>
        <el-button type="primary" plain @click="backdown">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { getBase64 } from "../../utils/base64.js";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*字母、数字、下划线或组合，至少6位"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateresource = (rule, value, callback) => {
      if (value === "2") {
        callback(new Error("*禁用则该账户不能登录"));
      } else {
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮件不能为空"));
      }
      if (!value.includes("@")) {
        return callback(new Error("请输入正确格式的邮箱"));
      } else {
        return callback();
      }
    };
    return {
      admin_id: null,
      Base64imgurl: "",
      imgUrlsrc: "",
      regiondata: [],
      dialogImageUrl: "", //图片路径
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      ruleForm1: {
        account: "", //账号
        pass: "", // 登录密码
        checkPass: "", //确认密码
        region: "", // 角色
        resource: "", //状态
        delivery: false,
        type: []
      },
      ruleForm2: {
        name: "", //姓名
        iphone: "", //手机号
        email: "", //邮箱
        beizu: "", //备注
        delivery: false,
        type: []
      },
      rules: {
        account: [
          { message: "请输入账号", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 11个字符", trigger: "blur" }
        ],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        resource: [{ validator: validateresource, trigger: "change" }],
        email: [{ validator: checkEmail, trigger: "blur" }]
      }
    };
  },
  created() {
    this.admin_id = this.$route.query.id;
    this.getdata();
    this.getAdimData();
  },
  mounted() {},
  updated() {},
  methods: {
    /**获取管理员信息 */
    getAdimData() {
      this.$axios({
        method: "post",
        url: "/backend/SystemSetting/getUserInfo",
        data: {
          admin_id: this.admin_id
        }
      }).then(res => {
        let adminMsg = res.data.data;
        if (adminMsg.status == "1") {
          this.ruleForm1.resource = "1";
        } else {
          this.ruleForm1.resource = "2";
        }
        this.ruleForm1.account = adminMsg.user_name;
        this.ruleForm1.pass = adminMsg.password;
        this.ruleForm1.checkPass = adminMsg.pwd_confirm;
        this.ruleForm1.region = adminMsg.role;
        this.dialogImageUrl = adminMsg.avatar;
        this.ruleForm2.beizu = adminMsg.remark;
        this.ruleForm2.name = adminMsg.real_name;
        this.ruleForm2.iphone = adminMsg.mobile_phone;
        this.ruleForm2.email = adminMsg.email;
        console.log(this.dialogImageUrl, "登录");
      });
    },
    /**获取角色信息 */
    getdata() {
      this.$axios({
        method: "GET",
        url: "/backend/SystemSetting/getRoles "
      }).then(res => {
        this.regiondata = res.data.data;
      });
    },
    goimg() {
      this.dialogImageUrl = "";
    },
    // //限制图片大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024;
      if (isLt2M > 2) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    //删除图片出发的事件
    handleRemove(file, fileList) {
      this.getAdimData();
      this.hideUpload = fileList.length >= this.limitCount;
    },
    //点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
    },
    //选择图片后触发的事件
    onChange(file, fileList) {
      this.dialogImageUrl = "";
      getBase64(file.raw).then(res => {
        this.Base64imgurl = res;
        return this.Base64imgurl;
      });
      this.hideUpload = fileList.length >= this.limitCount;
      let that = this;
      let width = 0;
      let height = 0;
      let _URL = window.URL || window.webkitURL;
      let img = new Image();
      img.onload = function() {
        // if (img.width <= 100 && img.height <= 100) {
        that
          .$axios({
            method: "post",
            url: "/backend/SystemSetting/uploadAvatar",
            data: {
              image: that.Base64imgurl
            }
          })
          .then(res => {
            if (res.status == 200) this.imgUrlsrc = res.data.data.url;
            this.dialogVisible = true;
            sessionStorage.setItem("imgUrlsrc", res.data.data.url);
            return this.imgUrlsrc;
            that.$message({
              message: res.data.msg,
              type: "success"
            });
          });
        // } else {
        //   that.$message.error("上传头像图片宽高不能超过100px");
        // }
      };
      img.src = file.url;
    },
    editInfo(data) {
      this.$axios({
        method: "post",
        url: "/backend/SystemSetting/postAdminUser",
        data: data
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.$router.push({ name: "systemsetting/adminsusers" });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //提交添加管理员
    submitForm() {
      if (this.ruleForm1.checkPass && this.ruleForm1.pass) {
        let mdurl = sessionStorage.getItem("imgUrlsrc");
        if (
          this.ruleForm1.pass == "******" &&
          this.ruleForm1.checkPass == "******"
        ) {
          this.editInfo({
            user_name: this.ruleForm1.account,
            status: this.ruleForm1.resource,
            role: this.ruleForm1.region,
            real_name: this.ruleForm2.name,
            mobile_phone: this.ruleForm2.iphone,
            email: this.ruleForm2.email,
            remark: this.ruleForm2.beizu,
            avatar: mdurl || this.dialogImageUrl,
            admin_id: this.admin_id
          });
        } else {
          let mdpwd = md5(this.ruleForm1.pass);
          let mdpwd2 = md5(this.ruleForm1.checkPass);
          this.editInfo({
            user_name: this.ruleForm1.account,
            password: mdpwd,
            pwd_confirm: mdpwd2,
            status: this.ruleForm1.resource,
            role: this.ruleForm1.region,
            real_name: this.ruleForm2.name,
            mobile_phone: this.ruleForm2.iphone,
            email: this.ruleForm2.email,
            remark: this.ruleForm2.beizu,
            avatar: mdurl || this.dialogImageUrl,
            admin_id: this.admin_id
          });
        }
      } else {
        this.$message.error("密码不能为空");
      }
    },
    //返回上一页
    backdown() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.btn_div {
  display: flex;
  margin-top: 20px;
}
.avatar-uploader {
  width: 100px;
  height: 100px;
  font-size: 12px;
  border-radius: 2px;
  margin-right: 200px;
  background: rgba(242, 242, 242, 1);
  cursor: pointer;
  position: absolute;
  top: -5px;
  left: 120px;
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
.avatar {
  width: 100px;
  height: 100px;
  display: block;
  box-sizing: border-box;
}
.section {
  width: 257px;
  height: 21px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 21px;
  color: rgba(102, 102, 102, 1);
}
.h1 {
  margin-top: 10px;
  width: 114px;
  height: 29px;
  font-size: 22px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 29px;
  color: rgba(51, 51, 51, 1);
  margin-bottom: 30px;
}
.div_fom_box {
  width: 943px;
  // height: 410px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(241, 241, 241, 1);
  box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
  padding: 45px 30px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  .input {
    width: 304px;
    height: 34px;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 2px;
  }

  .fromtitle {
    width: 83px;
    height: 26px;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 40px;
  }
  .h5img {
    .up_div {
      position: relative;
      left: 110px;
      height: 120px;
      margin-bottom: 20px;
      img {
        width: 100px;
        height: 100px;
        // cursor: pointer;
      }
      .del:hover i {
        display: block;
      }
      .del:hover .bg {
        display: block;
      }
      .del {
        // margin-top: -10px;
        // display: flex;
        position: relative;
        width: 100px;
        height: 100px;
        .bg {
          width: 100px;
          height: 100px;
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
          font-size: 16px;
          transform: translateX(-50%) translateY(-50%);
          color: #fff;
          z-index: 3;
        }
      }
      .up_label {
        position: absolute;
        top: 10px;
        left: -60px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      p {
        margin-top: 10px;
        margin-bottom: 10px;
        font-size: 10px;
        font-family: Microsoft YaHei;
        font-weight: 300;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
}
</style>

<style lang="scss" >
.admindetails-wpper {
  .avatar-uploader {
    .el-form-item__label {
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 0.16rem;
      color: #333333;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    // 添加图片宽高
    .el-upload-list__item {
      width: 100px;
      height: 100px;
      border: 1px solid #dddbdb;
    }
    // 图片宽高
    .el-upload--picture-card {
      // display: none;
      width: 100px;
      height: 100px;
      line-height: 101px;
    }
  }
  .hide .el-upload {
    display: none;
  }
}
</style>
