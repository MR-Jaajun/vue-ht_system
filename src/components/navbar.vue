<!--
 * @Description: 
 * @Author: jun
 * @Date: 2019-08-19 17:48:58
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-10 10:03:47
 -->
<template>
  <div class="haer_wapper">
    <ul class="header-nav" v-if="type == 'A'">
      <li v-show="show_type=='1'" class="f-li">欢迎来到小哥商城后台系统！</li>
    </ul>
    <ul class="nav-ul" v-else>
      <router-link
        style="cursor: pointer;"
        active-class="active"
        tag="li"
        v-for="item in itemList"
        :key="item.name"
        :to="{name:item.per_path }"
        @click.native="clear"
      >
        <p v-show="num !='1'">{{ item.name }}</p>
      </router-link>
    </ul>

    <!-- 顶部右边点击部分 -->
    <rightmenu></rightmenu>
  </div>
</template>
<script>
import rightmenu from "./rightmenu.vue";
export default {
  components: {
    rightmenu
  },
  data() {
    return {
      show_type: "",
      num: "",
      id: "",
      type: "",
      itemList: []
      // listarr: [
      //   [
      //     //系统管理
      //     { title: "管理员管理", name: "admin" },
      //     { title: "角色管理", name: "role" },
      //     { title: "参数管理", name: "parameter" },
      //     { title: "icon管理", name: "icon" },
      //     { title: "APP版本管理", name: "app" },
      //     { title: "操作日志", name: "opeator" }
      //   ],
      //   [
      //     //用户管理
      //     { title: "会员列表", name: "vip" },
      //     { title: "骑手列表", name: "horseman" },
      //     { title: "商户列表", name: "commercial" },
      //     { title: "商户模块审核列表", name: "auditList" },
      //     { title: "代理商列表", name: "agency" },
      //     { title: "骑手承包商", name: "stand" }
      //   ],
      //   [
      //     //订单管理
      //     { title: "外卖订单", name: "order" },
      //     { title: "外卖售后订单", name: "afterSale" },
      //     { title: "商城订单", name: "sendOrders" },
      //     { title: "商城售后订单", name: "mallRefundList" },
      //     { title: "团购订单", name: "bulk" }
      //     // { title: "团购售后订单", name: "purchase" }
      //   ],
      //   [
      //     //分销管理
      //     { title: "分销数据统计", name: "statistics" },
      //     { title: "分销走势图", name: "charts" },
      //     { title: "分销员管理", name: "allocation" },
      //     { title: "分销等级设置", name: "hierarchy" },
      //     { title: "佣金提现管理", name: "commission" },
      //     { title: "分销文章管理", name: "article" }
      //   ],
      //   [
      //     //优惠专区
      //     { title: "优惠专区", name: "acti" },
      //     { title: "推荐专区", name: "recommend" },
      //     { title: "秒杀审核列表", name: "seckill" },
      //     { title: "秒杀活动列表", name: "limit" }
      //   ],
      //   [
      //     //商品管理
      //     { title: "经营品类管理", name: "categroy" },
      //     { title: "图库分类管理", name: "mapdepot" },
      //     { title: "商品图库管理", name: "shangpindepot" },
      //     { title: "商品管理", name: "label" },
      //     { title: "商品分类管理", name: "goods" },
      //     { title: "商品库管理", name: "stocks" }
      //   ],
      //   [
      //     //运营管理
      //     { title: "评价列表", name: "evaluation" },
      //     { title: "敏感词管理", name: "agility" },
      //     { title: "站点管理", name: "site" },
      //     { title: "配送列表", name: "dispatch" },
      //     // { title: "合作共赢", name: "cooperation" },
      //     { title: "意见反馈", name: "feedback" },
      //     { title: "银行卡背景色", name: "bankcard" },
      //     { title: "店铺背景图", name: "shopBg" }
      //   ],
      //   [
      //     //广告管理
      //     { title: "广告管理", name: "advsing" }
      //   ],
      //   [
      //     //财务管理
      //     { title: "财务数据统计", name: "financial" },
      //     { title: "财务流水", name: "flow" }
      //   ],
      //   [
      //     //文章管理
      //     { title: "系统文章管理", name: "atrclexitong" },
      //     { title: "客服中心文章", name: "customer" },
      //     { title: "商户管理规范", name: "businessList" },
      //     { title: "商户文章管理", name: "shopArticlesList" },
      //     { title: "骑手填写帮助", name: "ridingHelpList" },
      //     { title: "骑手在线学习", name: "ridingStudyList" },
      //     { title: "合作共赢", name: "win" }
      //   ],
      //   [
      //     //消息管理
      //     { title: "平台消息管理", name: "platform" }
      //   ],
      //   [
      //     //权限管理
      //     { title: "代理商后台权限管理", name: "permission" },
      //     { title: "骑手站长后台权限管理", name: "authManagement" }
      //   ],
      //   [
      //     //物流管理
      //     { title: "配送管理", name: "fedex" }
      //   ]
      // ]
    };
  },
  watch: {
    $route() {
      this.getNav();
    }
  },

  created() {
    this.getNav();
  },
  methods: {
    getNav() {
      var objkeys = Object.keys(this.$route.meta);
      this.num = objkeys.length;
      this.show_type = this.$route.meta.show;
      this.type = this.$route.meta.mtype;
      this.$axios({
        method: "get",
        url: "/backend/Role/getChildPermission",
        params: {
          per_id: this.type
        }
      }).then(res => {
        // console.log(res, "信息");
        this.itemList = res.data.data;
        this.id = this.itemList[0].per_path;
        if (this.$route.meta.mt == "A") {
          this.$router.push({ name: this.id });
        }
      });
    },
    clear() {
      // console.log(sdfsfsdf)
      sessionStorage.removeItem("pages");
    }
  }
};
</script>
<style lang="scss" scoped>
.haer_wapper {
  z-index: 5000;
  position: fixed;
  top: 0;
  left: 278px;
  background-color: #323243;
  height: 68px;
  width: 1642px;
  box-shadow: 0px 3px 28px rgba(50, 50, 67, 0.57);
  border-radius: 16px 0px 0px 16px;
  .header-nav {
    float: left;
    width: 1379px;
    height: 68px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .f-li {
      margin: 18px 0;
      width: 344px;
      height: 31px;
      font-size: 24px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 31px;
      color: rgba(210, 223, 255, 1);
    }
  }
  .nav-ul {
    float: left;
    width: 1379px;
    height: 68px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    li {
      margin: 14px 0;
      // width: 225px;
      padding: 20px;
      height: 40px;
      border-radius: 21px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      // letter-spacing:1px;
      p {
        line-height: 21px;
        height: 21px;
        font-size: 16px;
      }
    }
    .active {
      background: #4371e8;
      color: white;
      // font-weight: bolder;
    }
  }
}
</style>
