<!--
 * @Description: 
 * @Author: jun
 * @Date: 2019-08-29 14:08:09
 * @LastEditors: jun
 * @LastEditTime: 2019-10-18 16:30:49
 -->
<template>
  <div class="vipgrade-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
      <el-breadcrumb-item>会员等级调整</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>会员等级调整</h1>
    <section class="main">
      <div class="left_div common">
        <h2>账户信息</h2>
        <div class="common2">
          <li>
            <span>启用状态</span>
            <span v-if="status==1">启用</span>
            <span style="color:red" v-if="status==0">禁用</span>
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
            <span>累计消费</span>
            <span>{{consumption_amount}}</span>
          </li>
          <li>
            <span>累计获得佣金</span>
            <span>{{rebate_amount}}</span>
          </li>
          <li>
            <span>账户余额</span>
            <span>{{balance_amount}}</span>
          </li>
        </div>
      </div>
      <div class="center_div common">
        <h2>基本信息</h2>
        <div class="common2">
          <li>
            <span>用户ID</span>
            <span>{{custom_uid}}</span>
          </li>
          <li>
            <span>手机号</span>
            <span>{{custom_mobile}}</span>
          </li>
          <li>
            <span>邀请码</span>
            <span>{{custom_invite_code}}</span>
          </li>
          <li>
            <span>昵称</span>
            <span>{{custom_nick_name}}</span>
          </li>
          <li>
            <span>会员等级</span>
            <span>{{custom_vip_level_name}}</span>
          </li>
          <li style="height:76px">
            <span>头像</span>
            <img :src="custom_avatar" alt="用户头像" />
          </li>
          <li>
            <span>性别</span>
            <span v-show="custom_gender==0">保密</span>
            <span v-show="custom_gender==1">男</span>
            <span v-show="custom_gender==2">女</span>
          </li>
          <li>
            <span>地区</span>
            <span>{{address}}</span>
          </li>
        </div>
      </div>
    </section>
    <h1>等级调整</h1>
    <section class="sdiv2">
      <span class="s1">请选择会员升级等级</span>
      <el-radio-group v-model="radio1" @change="change">
        <el-radio :label="0" border>小哥粉</el-radio>        
        <el-radio :label="1" border>小哥</el-radio>
        <el-radio :label="2" border>小V哥</el-radio>
        <el-radio :label="3" border>V哥</el-radio>
      </el-radio-group>
    </section>
    <div class="divbtn">
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sid: "",
      radio1: "",
      //
      status: "",
      register_time: "",
      last_login_time: "",
      consumption_amount: "",
      rebate_amount: "",
      balance_amount: "",
      custom_uid: "",
      custom_mobile: "",
      custom_invite_code: "",
      custom_vip_level:"",
      custom_vip_level_name: "",
      custom_nick_name: "",
      custom_invite_code: "",
      custom_gender: "",
      custom_avatar: "",
      address: ""
    };
  },
  created() {
    this.sid = this.$route.params.shop_id;
    this.memberLevelInfo();
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //会员等级详情 /backend/CustomUser/memberLevelInfo
    memberLevelInfo() {
      this.$axios({
        method: "GET",
        url: "/backend/CustomUser/memberLevelInfo",
        params: {
          custom_uid: this.sid
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.status = res.data.data.status;
          this.custom_vip_level = res.data.data.custom_vip_level;
          this.register_time = res.data.data.register_time;
          this.last_login_time = res.data.data.last_login_time;
          this.consumption_amount = res.data.data.consumption_amount;
          this.rebate_amount = res.data.data.rebate_amount;
          this.balance_amount = res.data.data.balance_amount;
          this.custom_uid = res.data.data.custom_uid;
          this.custom_mobile = res.data.data.custom_mobile;
          this.custom_invite_code = res.data.data.custom_invite_code;
          if (res.data.data.custom_vip_level == 0) {
            this.radio1 = 0;
          } else {
            this.radio1 = res.data.data.custom_vip_level;
          }
          this.custom_vip_level_name = res.data.data.custom_vip_level_name;
          this.custom_nick_name = res.data.data.custom_nick_name;
          this.custom_invite_code = res.data.data.custom_invite_code;
          this.custom_gender = res.data.data.custom_gender;
          this.custom_avatar = res.data.data.custom_avatar;
          this.address =
            res.data.data.custom_province +
            res.data.data.custom_city +
            res.data.data.custom_district;
        }
      });
    },
    //会员等级 /backend/CustomUser/memberLevelAdjust
    memberLevelAdjust(lev) {
      this.$axios({
        method: "POST",
        url: "/backend/CustomUser/memberLevelAdjust",
        data: {
          custom_uid: this.sid,
          rank_level: lev
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.radio1 = lev;
          this.memberLevelInfo();
        } else {
          this.$message.error(res.data.msg);
          this.radio1 = this.custom_vip_level;
        }
      });
    },
    open(lev, txt) {
      this.$confirm(txt + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.memberLevelAdjust(lev);
        })
        .catch(() => {
          // this.memberLevelInfonp(lev)
          if (this.status == 0) {
            this.radio1 = 0;
          } else {
            this.radio1 = this.custom_vip_level;
          }
        });
    },
    change(val) {
      console.log(val);
      if (val == 1) {
        this.open(val, "将该用户调整为小哥");
      } else if (val == 2) {
        this.open(val, "将该用户调整为小V哥");
      } else {
        this.open(val, "将该用户调整为V哥");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.vipgrade-wapper {
  h1 {
    margin-top: 10px;
    width: 139px;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    margin: 10px 0 30px 0;
  }
  .main {
    width: 1110px;
    // height: 449px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 40px;
    display: flex;
    justify-content: flex-start;

    // justify-content: space-between;
    //   align-items: center;
    .common {
      background: rgba(255, 255, 255, 1);
      padding: 20px;
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
    }
    .common2 li {
      font-size: 16px;
      display: flex;
      //
      flex-direction: row;
      margin-bottom: 20px;
      line-height: 21px;

      img {
        width: 54px;
        height: 54px;
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
      width: 250px;
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

    .left_div {
      margin-right: 200px;
      padding: 24px 0 0 32px;
    }
    .center_div {
      padding: 24px 0 0 32px;
    }
  }
  .sdiv2 {
    display: flex;
    align-items: center;
    .s1 {
      height: 24px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      line-height: 24px;
      color: rgba(51, 51, 51, 1);
      margin-right: 20px;
    }
  }
  .divbtn {
    margin-bottom: 50px;
  }
}
</style>