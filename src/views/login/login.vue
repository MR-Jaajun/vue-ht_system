<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: jun
 * @LastEditTime: 2019-11-20 18:59:49
 -->
<template>
  <div class="login-wapper">
    <div class="left-img"></div>
    <div class="mz-login">
      <div class="logo">
        <img src="../../assets/img/touxiang.png" />
      </div>
      <p class="title">小哥商城后台系统</p>
      <div class="login-form">
        <div class="form-group">
          <div class="span-img">
            <img src="../../assets/img/icon_zhanghu.png" />
            <span>账户</span>
          </div>
          <input placeholder="请输入账户" class="input-control" type="text" v-model="username" />
        </div>
        <div class="form-group">
          <div class="span-img">
            <img src="../../assets/img/icon_mima.png" />
            <span>密码</span>
          </div>
          <input placeholder="请输入密码" class="input-control" type="password" v-model="password" />
        </div>
        <div class="submit login-btn" @click="handleLogin">
          <span>登 录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },

  created() {
    var that = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13) {
        that.enterSearchMember();
      }
    };
  },

  methods: {
    handleLogin() {
      let mdpwd = md5(this.password);
      // this.$store.commit("set_username", this.username);
      // this.$store.commit("set_pwd", mdpwd);
      sessionStorage.setItem("set_username", this.username);
      sessionStorage.setItem("set_pwd", mdpwd);
      console.log(mdpwd, "md");
      this.$axios({
        method: "post",
        url: "/backend/Login/Login",
        //  url: "/mini",
        data: {
          username: this.username,
          pwd: mdpwd
        }
      }).then(res => {
        if (res.data.status == 1) {
          console.log(res.data.data, "登录");
          //剔除首页
          let arr = res.data.data.permission;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === 285) {
              arr.splice(i, 1);
            }
          }
          let permissionArr = JSON.stringify(arr);
          // this.$store.commit("set_token", res.data.data.token);
          this.$store.commit("set_nav", arr);
          sessionStorage.setItem("token", res.data.data.token);
          sessionStorage.setItem("suid", res.data.data.uid);
          sessionStorage.setItem("user_name", res.data.data.user_name);
          sessionStorage.setItem("avatar", res.data.data.avatar);
          sessionStorage.setItem("permission", permissionArr);
          // 跳转页面 - 这里是固定的跳转
          this.$router.push({ name: "home" });
          this.enterSearchMember = null;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    enterSearchMember() {
      this.handleLogin();
    }
  }
};
</script>

<style lang="scss" scoped>
.login-wapper {
  width: 1920px;
  height: 100%;
  background: url(../../assets/img/beijng.png) no-repeat;
  background-size: cover;
  border-radius: 2px;
  padding: 226px 348px;
  display: flex;
  justify-content: center;
  .left-img {
    width: 628px;
    height: 628px;
    background: url(../../assets/img/tupian.png) no-repeat;
    background-size: 100% 100%;
    display: inline-block;
  }

  .mz-login {
    width: 595px;
    height: 628px;
    background: #fff;
    padding: 0 78px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    .logo {
      width: 210px;
      height: 210px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      top: 30px;
    }
    .title {
      width: 257px;
      height: 40px;
      text-align: center;
      font-size: 30px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 40px;
      color: rgba(67, 113, 232, 1);
      position: relative;
      bottom: 5px;
    }

    .form-group {
      width: 372px;
      height: 40px;
      font-size: 20px;
      margin: 38px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .span-img {
        width: 85px;
        height: 25px;
        display: flex;
        font-size: 20px;
        justify-content: space-between;
        align-items: center;
      }
      .input-control {
        height: 15px;
        margin-left: 19px;
        line-height: 15px;
        padding: 19px 10px;
        width: 100%;
        font-size: 15px;
        color: #191a1b;
        border: 1px solid rgba(226, 226, 226, 1);
      }
    }

    .submit {
      cursor: pointer;
      width: 372px;
      background: rgba(67, 113, 232, 1);
      border-radius: 4px;
      line-height: 42px;
      font-size: 16px;
      text-align: center;
      background-color: #4371e8;
      height: 42px;
      color: #fff;
      border: none;
    }
  }
}
</style>
