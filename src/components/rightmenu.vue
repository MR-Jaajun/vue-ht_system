<!--
 * @Description: 
 * @Author: jun
 * @Date: 2019-08-19 17:48:58
 * @LastEditors: Roc
 * @LastEditTime: 2019-11-22 18:07:54
 -->
<template>
  <div class="right-menu">
    <!-- 客服 -->
    <!-- 
    <el-dropdown-menu>
      <div class="item-img">
        <a href="https://kefu.easemob.com/" target="_blank">
          <img
            src="../assets/img/icon_kefu.png"
            class="item"
            style="width:43px;height:35px;cursor: pointer;margin-top:2px;"
          />
        </a>
      </div>
    </el-dropdown-menu>-->
    <el-dropdown trigger="click" placement="bottom-end">
      <div class="item-img">
        <el-badge class="item" style="cursor: pointer;">
          <a href="https://kefu.easemob.com/" target="_blank">
            <img
              src="../assets/img/icon_kefu.png"
              class="item-img"
              style="width:43px;height:35px;cursor: pointer;margin-top:2px;"
            />
          </a>
        </el-badge>
      </div>
      <el-dropdown-menu slot="dropdown" style="width:280px;"></el-dropdown-menu>
    </el-dropdown>
    <!-- 消息 -->
    <el-dropdown trigger="click" placement="bottom-end">
      <div class="item-img">
        <el-badge :value="99" class="item" style="cursor: pointer;">
          <img src="../assets/img/icon_lingdang.png" class="item-img" />
        </el-badge>
      </div>
      <el-dropdown-menu slot="dropdown" style="width:280px;">
        <el-dropdown-item class="clearfix" style="height:60px;">
          <li>您有新的商户/骑手需要审核</li>2019-12-28 12:00:00
        </el-dropdown-item>
        <el-dropdown-item class="clearfix">
          <li>您有新的商户/骑手需要审核</li>2019-12-28 12:00:00
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码弹窗 -->
    <div>
      <el-dialog
        title="修改密码"
        :visible.sync="dialogFormVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :destroy-on-close="true"
      >
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-divider></el-divider>
          <el-form-item label="原密码">
            <el-input placeholder="请输入密码" v-model="ruleForm.pwd" show-password autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input placeholder="请输入密码" v-model="ruleForm.pass" show-password autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              show-password
              autocomplete="off"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editInfo">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <el-dropdown class="avatar-container">
      <div class="avatar-wrapper" style="cursor: pointer;">
        <img :src="avatar?avatar:'../assets/img/touxiang.png'" class="user-avatar" />
        <div class="v-name">{{user_name?user_name:'小哥666'}}</div>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <el-dropdown-item>
          <el-button type="text" @click="dialogFormVisible= true" custom-class>修改密码</el-button>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <el-button type="text" @click="exit()" custom-class>退出登录</el-button>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import md5 from "js-md5";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback();
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
    return {
      suid: null,
      dialogVisible: false,
      showclose: false,
      input: "",
      url: "",
      user_name: "",
      avatar: "",
      dialogFormVisible: false,
      ruleForm: {
        pwd: "", //原密码
        pass: "", // 新密码
        checkPass: "" //确认新密码
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  created() {
    this.suid = sessionStorage.getItem("suid");
    this.user_name = sessionStorage.getItem("user_name");
    this.avatar = sessionStorage.getItem("avatar");
  },
  methods: {
    // 退出登录
    exit() {
      let that = this;
      this.$confirm("确认退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            method: "POST",
            url: "/backend/Token/loginOut",
            data: {
              uid: this.suid
            }
          }).then(res => {
            this.$router.push({ path: "/login" });
            this.$message.success(res.data.msg);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    /**修改密码 */
    editInfo() {
      let md_pwd = md5(this.ruleForm.pwd);
      let md_pass = md5(this.ruleForm.pass);
      let md_checkPass = md5(this.ruleForm.pass);
      this.$axios({
        method: "POST",
        url: "/backend/SystemSetting/editPassword",
        data: {
          password: md_pwd,
          new_pwd: md_pass,
          new_pwd_confirm: md_checkPass
        }
      }).then(res => {
        this.dialogFormVisible = false;
        if (res.data.status == 1) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.$router.push({ path: "/login" });
        } else {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dropdown-menu__item li::before {
  content: "●";
  position: absolute;
  left: 5px;
  height: 6px;
  width: 7rpx;
  color: #f95d5d;
}

.right-menu {
  float: right;
  width: 263px;
  height: 68px;
  position: relative;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .item-img {
    width: 36px;
    height: 38px;
    margin-right: 24px;
    .item {
      font-size: 12px;
      width: 14px;
      height: 16px;
      border-radius: 7px;
    }
  }

  .avatar-wrapper {
    display: flex;
    align-items: center;
    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
     background-color: #323243;
      margin-right: 15px;
    }
    .v-name {
      width: 37px;
      height: 21px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 21px;
      color: rgba(204, 204, 204, 1);
    }
  }
}
</style>

<style lang="scss">
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.right-menu .el-dialog {
  position: relative;
  margin: 0 auto 50px;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 30%;
}

.right-menu .el-form-item {
  // display: flex;
  justify-content: flex-start;
  vertical-align: middle;
  font-size: 16px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.right-menu .el-form-item__error {
  color: #f56c6c;
  font-size: 0.12rem;
  line-height: 1;
  position: relative;
  top: 10px;
  left: 0;
}
.right-menu .el-dialog__header {
  height: 20px;
}
.right-menu .el-dialog__body {
  padding: 30px 20px;
  color: #606266;
  font-size: 0.14rem;
  word-break: break-all;
}
.right-menu .el-dialog__footer {
  padding: 10px 20px 20px;
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
}
.right-menu .el-dialog__title {
  line-height: 0.24rem;
  font-size: 0.18rem;
  color: #303133;
  position: absolute;
  top: 20px;
}
.right-menu .el-input--small .el-input__inner {
  height: 32px;
  line-height: 0.32rem;
  width: 300px;
  margin-left: 30px;
}
.right-menu .el-input--small .el-input__icon {
  line-height: 0.32rem;
  margin-right: 100px;
}
</style>
