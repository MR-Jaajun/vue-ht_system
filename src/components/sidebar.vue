<!--
 * @Description:
 * @Author: jun
 * @Date: 2019-08-19 17:48:58
 * @LastEditors: Roc
 * @LastEditTime: 2019-12-03 13:54:35
 -->
<template>
  <article class="sidebar">
    <el-scrollbar class="scroll">
      <div class="v-img"></div>
      <div class="v-left-wap">
        <div class="v-left">
          <router-link tag="p" to="/home" @click.native="clear" active-class="active">小哥商城后台</router-link>
          <router-link
            tag="li"
            :to="{name:item.per_des}"
            active-class="active"
            v-for="item in navDate"
            :key="item.id"
            @click.native="clear"
          >
            <img :src="item.icon" />
            {{item.name}}
          </router-link>
          <!-- <router-link tag="li" to="/users" active-class="active">
            <img src="../assets/img/icon_yonghu.png" />用户管理
          </router-link>
          <router-link tag="li" to="/orders" active-class="active">
            <img src="../assets/img/icon_dingdan.png" />订单管理
          </router-link>
          <router-link tag="li" to="/distribution" active-class="active">
            <img src="../assets/img/icon_fenxiao.png" />分销管理
          </router-link>
          <router-link tag="li" to="/activitys" active-class="active">
            <img src="../assets/img/icon_youhui.png" /> 活动管理
          </router-link>
          <router-link tag="li" to="/shangpin" active-class="active">
            <img src="../assets/img/icon_shangping.png" />商品管理
          </router-link>
          <router-link tag="li" to="/operator" active-class="active">
            <img src="../assets/img/icon_yonghu.png" />运营管理
          </router-link>
          <router-link tag="li" to="/advertising" active-class="active">
            <img src="../assets/img/icon_yonghu.png" />广告管理
          </router-link>
          <router-link tag="li" to="/finance" active-class="active">
            <img src="../assets/img/icon_caiwu.png" />财务管理
          </router-link>
          <router-link tag="li" to="/article" active-class="active">
            <img src="../assets/img/icon_wenzhang.png" />文章管理
          </router-link>
          <router-link tag="li" to="/message" active-class="active">
            <img src="../assets/img/icon_xitong.png" />消息管理
          </router-link>
          <router-link tag="li" to="/authority" active-class="active">
            <img src="../assets/img/icon_quanxian.png" />权限管理
          </router-link>
          <router-link tag="li" to="/logistics" active-class="active">
            <img src="../assets/img/icon_wuliu.png" />物流管理
          </router-link>-->
        </div>
      </div>
    </el-scrollbar>
  </article>
</template>

<script>
export default {
  data() {
    return {
      navDate: [],
      sidebarDate: [],
      navItem: null,
      obj: null
    };
  },
  computed: {
    resturantName: function() {
      return this.$store.getters.objnav;
    }
  },

  created() {
    this.navDate =
      this.resturantName || localStorage.getItem("hello-vuex-along");
    // let cat = localStorage.getItem('hello-vuex-along');
    //  console.log(this.resturantName, "一级导航this.resturantName");
    // console.log(cat, "一级导航cat");
  },
  methods: {
    clear() {
      // console.log(sdfsfsdf)
      sessionStorage.removeItem("pages");
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  background: rgba(50, 50, 67, 1);
  width: 248px;
  height: 100%;
  z-index: 5000;
  position: fixed;
  .scroll {
    width: 100%;
    height: 100%;
    overflow-x: hidden !important;
    .v-img {
      position: relative;
      background: url(../assets/img/shen.png) no-repeat;
      background-size: 100% 100%;
      width: 248px;
      height: 129px;
    }
    .v-left-wap {
      width: 248px;
      background: rgba(50, 50, 67, 1);
      box-shadow: 0px -6px 27px rgba(50, 50, 67, 0.31);
      .v-left {
        width: 248px;
        // height: 963px;
        display: flex;
        flex-direction: column;

        li {
          // padding: 0 61px;
          cursor: pointer;
          width: 248px;
          height: 55px;
          line-height: 55px;
          display: flex;
          justify-content: center;
          align-items: center;
          letter-spacing: 1px;
          font-size: 20px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ccc;
          img {
            position: relative;
            top: 1px;
            margin-right: 12px;
          }
        }
        p {
          // padding: 0 61px;
          cursor: pointer;
          width: 248px;
          height: 55px;
          line-height: 55px;
          display: flex;
          justify-content: center;
          align-items: center;
          letter-spacing: 1px;
          font-size: 20px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ccc;
          img {
            position: relative;
            top: 1px;
            margin-right: 12px;
          }
        }
        .active {
          background: #4371e8;
          color: white;
          // font-weight: bolder;
        }
      }
    }
  }
}
</style>
