/*
 * @Description: 页面路由
 * @Author: jun
 * @Date: 2019-08-19 17:48:58
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-25 15:32:14
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import layout from './views/layout/layout.vue';
import home from './views/home/Index.vue'; // 首页
import system from './views/system/Index.vue'; // 系统管理
import users from './views/users/Index.vue'; //用户管理
import orders from './views/orders/Index.vue'; //订单管理
import distribution from './views/distribution/Index.vue'; //分销管理
import activitys from './views/activitys/Index.vue'; //优惠专区
import shangpin from './views/shangpin/Index.vue'; //商品管理
import operator from './views/operator/Index.vue'; // 运营管理
import advertising from './views/advertising/Index.vue'; // 广告管理
import finance from './views/finance/Index.vue'; // 财务管理
import article from './views/article/Index.vue'; //文章管理
import message from './views/message/Index.vue'; //消息管理
import logistics from './views/logistics/Index.vue'; //物流管理
import authority from './views/authority/Index.vue'; //权限管理
import survey from './views/survey/Index.vue'; //调查问卷
import activityArea from "./views/activityArea/Index.vue" //活动专区
import extract from "./views/extract/Index.vue" //抽拥管理
NProgress.configure({
  showSpinner: false,
});

Vue.use(VueRouter);

let router = new VueRouter({
  mode: 'hash',
  scrollBehavior(to, from, savedPosition) {
    return {
      x: 0,
      y: 0,
    };
  },

  routes: [{
      path: '/',
      component: layout,
      meta: {
        requireAuth: true,
      },
      children: [{
          props: true,
          meta: {
            mtype: 'A',
            show: '1'
          },
          name: 'home',
          path: 'home',
          component: home,
        },
        {
          props: true,
          meta: {
            mtype: 'A',
            show: '1'
          },
          name: 'history',
          path: 'history',
          component: () => import('./views/home/history.vue'), //首页历史数据
        },
        {
          /**系统管理**/
          props: true,
          meta: {
            mtype: '2',
            mpath: 'systemsetting/adminsusers',
            mt: 'A',
          },
          path: 'system',
          name: 'SystemSetting',
          component: system,
          children: [{
              props: true,
              meta: {
                mtype: '2',
                mt: 'B',
              },
              path: 'admin',
              name: 'systemsetting/adminsusers',
              component: () => import('./views/system/admin.vue'), //管理员管理
            },
            {
              props: true,
              meta: {
                mtype: '2',
              },
              path: 'admindetails',
              name: 'admindetails',
              component: () => import('./views/system/admindetails.vue'), //管理员管理详情
            },
            {
              props: true,
              meta: {
                mtype: '2',
              },
              path: 'editAdmin',
              name: 'editAdmin',
              component: () => import('./views/system/editAdmin'), //编辑管理员管理详情
            },
            {
              props: true,
              meta: {
                mtype: '2',
                mt: 'B',
              },
              path: 'role',
              name: 'role/rolelist',
              component: () => import('./views/system/role.vue'), //角色管理
            },
            {
              props: true,
              meta: {
                mtype: '2',
              },
              path: 'roledetails',
              name: 'roledetails',
              component: () => import('./views/system/roledetails.vue'), //角色管理详情
            },
            {
              props: true,
              meta: {
                mtype: '2',
              },
              path: 'editrole',
              name: 'editrole',
              component: () => import('./views/system/editrole.vue'), //角色管理详情
            },
            {
              props: true,
              meta: {
                mtype: '2',
                mt: 'B',
              },
              path: 'parameter',
              name: 'paramsetting/baseinfo',
              component: () => import('./views/system/parameter.vue'), //参数管理
            },
            {
              props: true,
              meta: {
                mtype: '2',
                mt: 'B',
              },
              path: 'icon',
              name: 'operation/iconlist',
              component: () => import('./views/system/icon.vue'), //icon管理
            },
            {
              props: true,
              meta: {
                mtype: '2',
                mt: 'B',
              },
              path: 'app',
              name: 'version/versionlist',
              component: () => import('./views/system/app.vue'), //app管理
            },
            {
              props: true,
              meta: {
                mtype: '2',
              },
              path: 'version',
              name: 'version',
              component: () => import('./views/system/version.vue'), //编辑版本
            },
            {
              props: true,
              meta: {
                mtype: '2',
                mt: 'B',
              },
              path: 'addversion',
              name: 'addV',
              component: () => import('./views/system/addVersion.vue'), //编辑版本
            },
            {
              props: true,
              meta: {
                mtype: '2',
                mt: 'B',
              },
              path: 'opeator',
              name: 'systemsetting/adminlogs',
              component: () => import('./views/system/opeator.vue'), //操作日志管理
            },
          ],
        },
        {
          // 用户管理
          meta: {
            mtype: '5',
            mpath: 'customuser/member',
            mt: 'A',
          },
          path: 'users',
          name: 'CustomUserValidate',
          component: users,
          children: [{
              props: true,
              meta: {
                mtype: '5',
                mt: 'B',
              },
              path: 'vip',
              name: 'customuser/member',
              component: () => import('./views/users/vip.vue'), //会员列表
            },
            {
              props: true,
              meta: {
                mtype: '5',
              },
              path: 'vipdetails',
              name: 'vipdetails',
              component: () => import('./views/users/vipdetails.vue'), //会员列表详情
            },
            {
              props: true,
              meta: {
                mtype: '5',
              },
              path: 'vipgrade',
              name: 'vipgrade',
              component: () => import('./views/users/vipgrade.vue'), //会员等级
            },
            {
              props: true,
              meta: {
                mtype: '5',
                mt: 'B',
              },
              path: 'horseman',
              name: 'rider/getriderlist',
              component: () => import('./views/users/horseman.vue'), //骑手列表
            },
            {
              props: true,
              meta: {
                mtype: '5',
              },
              path: 'lookriderDetail',
              name: 'lookriderDetail',
              component: () => import('./views/users/lookriderDetail.vue'), //骑手信息
            },
            {
              props: true,
              meta: {
                mtype: '5',
                mt: 'B',
              },
              path: 'commercial',
              name: 'merchant/merchantlist',
              component: () => import('./views/users/commercial.vue'), //商户列表
            },
            {
              props: true,
              meta: {
                mtype: '5',
              },
              path: 'map',
              name: 'map',
              component: () => import('./views/users/map.vue'), //地图
            },
            {
              props: true,
              meta: {
                mtype: '5',
              },
              path: 'comdetails',
              name: 'comdetails',
              component: () => import('./views/users/comdetails.vue'), //商户详情
            },
            {
              props: true,
              meta: {
                mtype: '5',
                mt: 'B',
              },
              path: 'auditList',
              name: 'merchant/shopmodulelist',
              component: () => import('./views/users/auditList.vue'), //商户模块审核列表
            },
            {
              props: true,
              meta: {
                mtype: '5',
              },
              path: 'auditDetail',
              name: 'auditDetail',
              component: () => import('./views/users/auditDetail.vue'), //商户模块审核详情
            },
            {
              props: true,
              meta: {
                mtype: '5',
              },
              path: 'compile',
              name: 'compile',
              component: () => import('./views/users/compile.vue'), //新增商家编辑
            },
            {
              props: true,
              meta: {
                mtype: '5',
                mt: 'B',
              },
              path: 'agency',
              name: 'agent/getagents',
              component: () => import('./views/users/agency.vue'), //代理商列表
            },
            {
              props: true,
              meta: {
                mtype: '5',
              },
              path: 'addAgency',
              name: 'addAgency',
              component: () => import('./views/users/addAgency.vue'), //新增商家编辑
            },
            {
              props: true,
              meta: {
                mtype: '5',
              },
              path: 'agencydetails',
              name: 'agencydetails',
              component: () => import('./views/users/agencydetails.vue'), //代理商详情
            },
            {
              props: true,
              meta: {
                mtype: '5',
                mt: 'B',
              },
              path: 'stand',
              name: 'rider/getridercontractors',
              component: () => import('./views/users/stand.vue'), //骑手承包商
            },
            {
              props: true,
              meta: {
                mtype: '5',
              },
              path: 'standDetail',
              name: 'standDetail',
              component: () => import('./views/users/lookstandDetail.vue'), //骑手承包商详情
            },
            {
              props: true,
              meta: {
                mtype: '5',
              },
              path: 'addstand',
              name: 'addstand',
              component: () => import('./views/users/addstand.vue'), //骑手承包商详情
            },
            {
              props: true,
              meta: {
                mtype: '5',
                mt: 'B',
              },
              path: 'merchantQrList',
              name: "merchant/merchantQrList",
              component: () => import('./views/users/merchant.vue'), //二维码申请
            },
            {
              props: true,
              meta: {
                mtype: '5',
              },
              path: 'merchantDetail',
              name: 'merchantDetail',
              component: () => import('./views/users/merchantDetail.vue'), //二维码申请
            },
            {
              props: true,
              meta: {
                mtype: '5',
                mt: 'B',
              },
              path: 'ranking',
              name: 'horsemanRanking',
              component: () => import('./views/users/horsemanRanking.vue'), //骑手排行榜
            },
          ],
        },
        {
          // 订单管理
          props: true,
          meta: {
            mtype: '10',
            mpath: 'order/takeoutorderlist',
            mt: 'A',
          },
          path: 'orders',
          name: 'Order',
          component: orders,
          children: [{
              props: true,
              meta: {
                mtype: '10',
                mt: 'B',
              },
              path: 'order',
              name: 'order/takeoutorderlist',
              component: () => import('./views/orders/order.vue'), //外卖订单
            },
            {
              props: true,
              meta: {
                mtype: '10',
              },
              path: 'orderDetail',
              name: 'orderDetail',
              component: () => import('./views/orders/orderDetail.vue'), //外卖售后订单详情
            },
            {
              props: true,
              meta: {
                mtype: '10',
                mt: 'B',
              },
              path: 'afterSale',
              name: 'order/takeoutrefundlist',
              component: () => import('./views/orders/afterSale.vue'), //外卖售后订单
            },
            {
              props: true,
              meta: {
                mtype: '10',
              },
              path: 'afterSaledetails',
              name: 'afterSaledetails',
              component: () => import('./views/orders/afterSaledetails.vue'), //外卖售后订单详情
            },
            {
              props: true,
              meta: {
                mtype: '10',
                mt: 'B',
              },
              path: 'sendOrders',
              name: 'order/mallorderlist',
              component: () => import('./views/orders/sendOrders.vue'), //商城订单
            },
            {
              props: true,
              meta: {
                mtype: '10',
              },
              path: 'mallOrderDetail',
              name: 'mallOrderDetail',
              component: () => import('./views/orders/mallOrderDetail.vue'), //商城订单详情
            },
            {
              props: true,
              meta: {
                mtype: '10',
                mt: 'B',
              },
              path: 'mallRefundList',
              name: 'order/mallrefundlist',
              component: () => import('./views/orders/mallRefundList.vue'), //商城售后订单
            },
            {
              props: true,
              meta: {
                mtype: '10',
              },
              path: 'mallRefundDetail',
              name: 'mallRefundDetail',
              component: () => import('./views/orders/mallRefundDetail.vue'), //商城售后订单
            },
            {
              props: true,
              meta: {
                mtype: '10',
                mt: 'B',
              },
              path: 'bulk',
              name: 'order/grouporderlist',
              component: () => import('./views/orders/bulk.vue'), //团购订单
            },
            {
              props: true,
              meta: {
                mtype: '10',
                mt: 'B',
              },
              path: 'groupPurchaseInfo',
              name: 'order/grouporderdetail',
              component: () => import('./views/orders/groupPurchaseInfo.vue'), //团购售后订单
            },
            {
              props: true,
              meta: {
                mtype: '10',
                mt: 'B',
              },
              path: 'toShopPay',
              name: 'Order/payOrderList',
              component: () => import('./views/orders/toShopPay.vue'), //到店付订单
            },
            {
              props: true,
              meta: {
                mtype: '10',
              },
              path: 'toShopPaydetail',
              name: 'Order/payOrderDetail',
              component: () => import('./views/orders/toShopPaydetail.vue'), //到店付订单详情
            },
            {
              props: true,
              meta: {
                mtype: '10',
                mt: 'B',
              },
              path: 'dealerList',
              name: 'JdOrde/mallOrderList',
              component: () => import('./views/orders/dealerList.vue'), //自营订单
            },
            {
              props: true,
              meta: {
                mtype: '10',
                mt: 'B',
              },
              path: 'dealerDetail',
              name: 'dealerDetail',
              component: () => import('./views/orders/dealerDetail.vue'), //自营订单详情
            },
            {
              props: true,
              meta: {
                mtype: '10',
                mt: 'B',
              },
              path: 'dealerAfter',
              name: 'JdOrde/mallRefundList',
              component: () => import('./views/orders/dealerAfter.vue'), //自营售后订单
            },
            {
              props: true,
              meta: {
                mtype: '10',
              },
              path: 'delerAfterDetail',
              name: 'delerAfterDetail',
              component: () => import('./views/orders/delerAfterDetail.vue'), //自营售后订单详情
            }
          ],
        },
        {
          // 分销管理
          props: true,
          meta: {
            mtype: '19',
            mpath: 'distribution/distributionkanban',
            mt: 'A',
          },
          path: 'distribution',
          name: 'Distribution',
          component: distribution,
          children: [{
              props: true,
              meta: {
                mtype: '19',
                mt: 'B',
              },
              path: 'statistics',
              name: 'distribution/distributionkanban',
              component: () => import('./views/distribution/statistics.vue'), //分销数据统计
            },
            {
              props: true,
              meta: {
                mtype: '19',
                mt: 'B',
              },
              path: 'charts',
              name: 'distribution/userbrotrend',
              component: () => import('./views/distribution/charts.vue'), //分销走势图
            },
            {
              props: true,
              meta: {
                mtype: '19',
                mt: 'B',
              },
              path: 'allocation',
              name: 'distribution/dismember',
              component: () => import('./views/distribution/allocation.vue'), //分销员管理
            },
            {
              props: true,
              meta: {
                mtype: '19',
              },
              path: 'allocationDetail',
              name: 'allocationDetail',
              component: () => import('./views/distribution/allocationDetail.vue'), //分销员详情
            },
            {
              props: true,
              meta: {
                mtype: '19',
              },
              path: 'grade',
              name: 'grade',
              component: () => import('./views/distribution/grade.vue'), //分销员等级
            },
            {
              props: true,
              meta: {
                mtype: '19',
                mt: 'B',
              },
              path: 'hierarchy',
              name: 'distribution/memberranklist',
              component: () => import('./views/distribution/hierarchy.vue'), //分销等级设置
            },
            {
              props: true,
              meta: {
                mtype: '19',
              },
              path: 'editDistribution',
              name: 'editDistribution',
              component: () => import('./views/distribution/editDistribution.vue'), //分销等级设置编辑
            },
            {
              props: true,
              meta: {
                mtype: '19',
                mt: 'B',
              },
              path: 'commission',
              name: 'distribution/withdrawlist',
              component: () => import('./views/distribution/commission.vue'), //佣金提现管理
            },
            {
              props: true,
              meta: {
                mtype: '19',
              },
              path: 'commissionInfo',
              name: 'commissionInfo',
              component: () => import('./views/distribution/commissionInfo.vue'), //佣金提现管理
            },
            {
              props: true,
              meta: {
                mtype: '19',
                mt: 'B',
              },
              path: 'article',
              name: 'distribution/articlelist',
              component: () => import('./views/distribution/article.vue'), //分销文章管理
            },
            {
              props: true,
              meta: {
                mtype: '19',
              },
              path: 'articleInfo',
              name: 'articleInfo',
              component: () => import('./views/distribution/articleInfo.vue'), //分销文章管理
            },
          ],
        },
        {
          // 活动管理
          props: true,
          meta: {
            mtype: '14',
            mpath: 'activity/activitylist',
            mt: 'A',
          },
          path: 'activitys',
          name: 'Activity',
          component: activitys,
          children: [{
              props: true,
              meta: {
                mtype: '14',
                mt: 'B',
              },
              path: 'acti',
              name: 'activity/activitylist',
              component: () => import('./views/activitys/acti.vue'), //活动主题列表
            },
            {
              props: true,
              meta: {
                mtype: '14',
                mt: 'B',
              },
              path: 'recommend',
              name: 'promotion/recommendgoodslist',
              component: () => import('./views/activitys/recommend.vue'), //推荐专区
            },
            {
              props: true,
              meta: {
                mtype: '14',
                mt: 'B',
              },
              path: 'seckill',
              name: 'seckill/seckillverifylist',
              component: () => import('./views/activitys/seckill.vue'), //秒杀审核列表
            },
            {
              props: true,
              meta: {
                mtype: '14',
              },
              path: 'seckillInfo',
              name: 'seckillInfo',
              component: () => import('./views/activitys/seckillInfo.vue'), //秒杀审核详情
            },
            {
              props: true,
              meta: {
                mtype: '14',
                mt: 'B',
              },
              path: 'limit',
              name: 'seckill/seckilllist',
              component: () => import('./views/activitys/limit.vue'), //限时活动列表
            },
            {
              props: true,
              meta: {
                mtype: '14',
              },
              path: 'limitEdit',
              name: 'limitEdit',
              component: () => import('./views/activitys/limitEdit.vue'), //新增编辑活动
            },
            {
              props: true,
              meta: {
                mtype: '14',
              },
              path: 'limitInfo',
              name: 'limitInfo',
              component: () => import('./views/activitys/limitInfo.vue'), //查看活动详情
            },
            {
              props: true,
              meta: {
                mtype: '14',
              },
              path: 'seckillMerchant',
              name: 'seckillMerchant',
              component: () => import('./views/activitys/seckillMerchant.vue'), //限时活动商家详情
            },
            {
              props: true,
              meta: {
                mtype: '14',
              },
              path: 'limitSetSort',
              name: 'limitSetSort',
              component: () => import('./views/activitys/limitSetSort.vue'), //活动商品设置排序
            },
            {
              props: true,
              meta: {
                mtype: '14',
              },
              path: 'addsell',
              name: 'addsell',
              component: () => import('./views/activitys/addsell.vue'), //添加商家
            },
            {
              props: true,
              meta: {
                mtype: '14',
              },
              path: 'addact',
              name: 'addact',
              component: () => import('./views/activitys/addact.vue'), //添加活动
            },
            {
              props: true,
              meta: {
                mtype: '14',
              },
              path: 'lookact',
              name: 'lookact',
              component: () => import('./views/activitys/lookact.vue'), //查看活动
            },
          ],
        },
        {
          // 商品管理
          props: true,
          meta: {
            mtype: '6',
            mpath: 'merchant/shopcategoryall',
            mt: 'A',
          },
          path: 'shangpin',
          name: 'Merchant',
          component: shangpin,
          children: [{
              props: true,
              meta: {
                mtype: '6',
                mt: 'B',
              },
              path: 'categroy',
              name: 'merchant/shopcategoryall',
              component: () => import('./views/shangpin/categroy.vue'), //经营品类管理
            },
            {
              props: true,
              meta: {
                mtype: '6',
                mt: 'B',
              },
              path: 'mapdepot',
              name: 'merchant/goodsImageCateList',
              component: () => import('./views/shangpin/mapdepot.vue'), //图库分类管理
            },
            {
              props: true,
              meta: {
                mtype: '6',
                mt: 'B',
              },
              path: 'shangpindepot',
              name: 'merchant/goodsimagelist',
              component: () => import('./views/shangpin/shangpindepot.vue'), //商品图库管理
            },
            {
              props: true,
              meta: {
                mtype: '6',
                mt: 'B',
              },
              path: 'label',
              name: 'merchant/storegoodslist',
              component: () => import('./views/shangpin/label.vue'), //商品管理  原（菜品）
            },
            {
              props: true,
              meta: {
                mtype: '6',
              },
              path: 'labelDetail',
              name: 'labelDetail',
              component: () => import('./views/shangpin/labeldetail.vue'), //商品管理  原（菜品）
            },
            {
              props: true,
              meta: {
                mtype: '6',
                mt: 'B',
              },
              path: 'goods',
              name: 'merchant/goodscategorylist',
              component: () => import('./views/shangpin/goods.vue'), //商品分类管理
            },
            {
              props: true,
              meta: {
                mtype: '6',
                mt: 'B',
              },
              path: 'stocks',
              name: 'merchant/getstoregoodses',
              component: () => import('./views/shangpin/stocks.vue'), //商品库管理
            },
            {
              props: true,
              meta: {
                mtype: '6',
              },
              path: 'addgoods',
              name: 'addgoods',
              component: () => import('./views/shangpin/addgoods.vue'), //新增商品
            },
            {
              props: true,
              meta: {
                mtype: '6',
                mt: 'B',
              },
              path: 'autotrophy',
              name: 'JdGoods/goodsList',
              component: () => import('./views/shangpin/autotrophy.vue'), //自营商品
            },
            {
              props: true,
              meta: {
                mtype: '6',
              },
              path: 'autotrophyDetail',
              name: 'autotrophyDetail',
              component: () => import('./views/shangpin/autotrophyDetail.vue'), //自营商品详情
            },
            {
              props: true,
              meta: {
                mtype: '6',
                mt: 'B',
              },
              path: 'jdgoods',
              name: 'JdGoods/ptGoodsList',
              component: () => import('./views/shangpin/jdgoods.vue'), //京东商品
            },
            {
              props: true,
              meta: {
                mtype: '6',
              },
              path: 'jdgoodDetail',
              name: 'jdgoodDetail',
              component: () => import('./views/shangpin/jdgoodDetail.vue'), //京东商品详情
            }
          ]
        },
        {
          // 运营管理
          props: true,
          meta: {
            mtype: '9',
            mpath: 'operation/comments',
            mt: 'A',
          },
          path: 'operator',
          name: 'Operation',
          component: operator,
          children: [{
              props: true,
              meta: {
                mtype: '9',
                mt: 'B',
              },
              path: 'evaluation',
              name: 'operation/comments',
              component: () => import('./views/operator/evaluation.vue'), //评价列表
            },
            {
              props: true,
              meta: {
                mtype: '9',
                mt: 'B',
              },
              path: 'agility',
              name: 'operation/getsensitives',
              component: () => import('./views/operator/agility.vue'), //敏感词管理
            },
            {
              props: true,
              meta: {
                mtype: '9',
                mt: 'B',
              },
              path: 'dispatch',
              name: 'operation/getdeliveries',
              component: () => import('./views/operator/dispatch.vue'), //配送列表
            },
            {
              props: true,
              meta: {
                mtype: '9',
              },
              path: 'dispatchinfo',
              name: 'dispatchinfo',
              component: () => import('./views/operator/dispatchinfo.vue'), //配送列表
            },
            {
              props: true,
              meta: {
                mtype: '9',
                mt: 'B',
              },
              path: 'cooperation',
              name: 'Cooperation/cooperationList',
              component: () => import('./views/operator/cooperationList.vue'), //合作共赢
            },
            {
              props: true,
              meta: {
                mtype: '9',
              },
              path: 'cooperationinfo',
              name: 'cooperationinfo',
              component: () => import('./views/operator/cooperationinfo.vue'), //合作共赢详情
            },


            {
              props: true,
              meta: {
                mtype: '9',
                mt: 'B',
              },
              path: 'feedback',
              name: 'operation/feedbacklist',
              component: () => import('./views/operator/feedback.vue'), //意见反馈
            },
            {
              props: true,
              meta: {
                mtype: '9',
                mt: 'B',
              },
              path: 'bankcard',
              name: 'operation/bankbglist',
              component: () => import('./views/operator/banckcard.vue'), //银行卡背景色
            },
            {
              props: true,
              meta: {
                mtype: '9',
              },
              path: 'commentinfo',
              name: 'commentinfo',
              component: () => import('./views/operator/commentinfo.vue'), //查看评价详情
            },
            {
              props: true,
              meta: {
                mtype: '9',
                mt: 'B',
              },
              path: 'site',
              name: 'rider/getsites',
              component: () => import('./views/operator/site.vue'), //站点列表
            },
            {
              props: true,
              meta: {
                mtype: '9',
              },
              path: 'siteinfo',
              name: 'siteinfo',
              component: () => import('./views/operator/siteinfo.vue'), //站点详情
            },
            {
              props: true,
              meta: {
                mtype: '9',
                mt: 'B',
              },
              path: 'shopBg',
              name: 'merchant/shopbglist',
              component: () => import('./views/operator/shopBg.vue'), //店铺背景图
            },
            {
              props: true,
              meta: {
                mtype: '9',
                mt: 'B',
              },
              path: 'jdevaluation',
              name: 'JdOrder/comment',
              component: () => import('./views/operator/jdevaluation.vue'), //自营评价列表
            },
            {
              props: true,
              meta: {
                mtype: '9',
              },
              path: 'jdevaluationInfo',
              name: 'jdevaluationInfo',
              component: () => import('./views/operator/jdevaluationInfo.vue'), //自营评价详情
            },
          ],
        },
        {
          // 广告管理
          props: true,
          meta: {
            mtype: '269',
            mpath: 'operation/bannerlist',
            mt: 'A',
          },
          path: 'advertising',
          name: 'CommonBanner',
          component: advertising,
          children: [{
              props: true,
              meta: {
                mtype: '269',
                mt: 'B',
              },
              path: 'advsing',
              name: "operation/bannerlist",
              component: () => import('./views/advertising/advsing.vue'), //banner管理
            },
            {
              props: true,
              meta: {
                mtype: '269',
                mt: 'B',
              },
              path: 'mallIndex',
              name: "advert/advertListone",
              component: () => import('./views/advertising/mallIndex.vue'), //推荐专区 （商城）
            },
            {
              props: true,
              meta: {
                mtype: '269',
                mt: 'B',
              },
              path: 'groupIndex',
              name: "advert/advertListtwo",
              component: () => import('./views/advertising/groupIndex.vue'), //推荐专区 （团购）
            },
            {
              props: true,
              meta: {
                mtype: '269',
                mt: 'B',
              },
              path: 'takeoutIndex',
              name: "advert/advertListthree",
              component: () => import('./views/advertising/takeIndex.vue'), //推荐专区 （外卖）
            },
            {
              props: true,
              meta: {
                mtype: '269',
                mt: 'B',
              },
              path: 'advertisingindex',
              name: "advert/advertListfour",
              component: () => import('./views/advertising/index_advertising.vue'), //首页广告
            },
            {
              props: true,
              meta: {
                mtype: '269',
              },
              path: 'advsingList',
              name: 'advsingList',
              component: () => import('./views/advertising/advsingList.vue'), //广告列表
            },
            {
              props: true,
              meta: {
                mtype: '269',
              },
              path: 'advsingEdit',
              name: 'advsingEdit',
              component: () => import('./views/advertising/advsingEdit.vue'), //投放广告
            },
            {
              props: true,
              meta: {
                mtype: '269',
              },
              path: 'advDetail',
              name: 'advDetail',
              component: () => import('./views/advertising/advDetail.vue'), //广告详情
            }
          ],
        },
        {
          // 财务管理
          props: true,
          meta: {
            mtype: '270',
            mpath: 'financial',
            mt: 'A',
          },
          path: 'finance',
          name: 'Finance',
          component: finance,
          children: [{
              props: true,
              meta: {
                mtype: '270',
                mt: 'B',
              },
              path: 'financial',
              name: 'FinanceManage/financeStatistic',
              component: () => import('./views/finance/financial.vue'), //财务数据统计
            },
            {
              props: true,
              meta: {
                mtype: '270',
                mt: 'B',
              },
              path: 'flow',
              name: 'FinanceManage/financeList',
              component: () => import('./views/finance/flow.vue'), //财务流水
            },
          ],
        },
        {
          // 文章管理
          props: true,
          meta: {
            mtype: '17',
            mpath: 'article/systemarticlelist',
            mt: 'A',
          },
          path: 'article',
          name: 'Article',
          component: article,
          children: [{
              props: true,
              meta: {
                mtype: '17',
                mt: 'B',
              },
              path: 'atrclexitong',
              name: 'article/systemarticlelist',
              component: () => import('./views/article/atrclexitong.vue'), //系统文章管理
            },
            {
              props: true,
              meta: {
                mtype: '17',
              },
              path: 'atrclexitongedit',
              name: 'atrclexitongedit',
              component: () => import('./views/article/atrclexitongedit.vue'), //编辑系统文章
            },
            {
              props: true,
              meta: {
                mtype: '17',
                mt: 'B',
              },
              path: 'customer',
              name: 'article/serverarticlelist',
              component: () => import('./views/article/customer.vue'), //客服中心文章列表
            },
            {
              props: true,
              meta: {
                mtype: '17',
              },
              path: 'customeredit',
              name: 'customeredit',
              component: () => import('./views/article/customeredit.vue'), //编辑客服中心文章
            },
            {
              props: true,
              meta: {
                mtype: '17',
                mt: 'B',
              },
              path: 'businessList',
              name: 'article/shoprulearticlelist',
              component: () => import('./views/article/businessList.vue'), //商户管理规范列表
            },
            {
              props: true,
              meta: {
                mtype: '17',
              },
              path: 'businessEdit',
              name: 'businessEdit',
              component: () => import('./views/article/businessEdit.vue'), //新增编辑商户管理规范文章
            },
            {
              props: true,
              meta: {
                mtype: '17',
                mt: 'B',
              },
              path: 'shopArticlesList',
              name: 'article/shoparticlelist',
              component: () => import('./views/article/shopArticlesList.vue'), //商户文章管理
            },
            {
              props: true,
              meta: {
                mtype: '17',
              },
              path: 'shopArticlesEdit',
              name: 'shopArticlesEdit',
              component: () => import('./views/article/shopArticlesEdit.vue'), //新增编辑商户文章管理
            },
            {
              props: true,
              meta: {
                mtype: '17',
                mt: 'B',
              },
              path: 'ridingHelpList',
              name: 'article/riderarticlelist',
              component: () => import('./views/article/ridingHelpList.vue'), //骑手填写资料帮助列表
            },
            {
              props: true,
              meta: {
                mtype: '17',
              },
              path: 'ridingHelpEdit',
              name: 'ridingHelpEdit',
              component: () => import('./views/article/ridingHelpEdit.vue'), //新增编辑骑手填写资料帮助
            },
            {
              props: true,
              meta: {
                mtype: '17',
                mt: 'B',
              },
              path: 'ridingStudyList',
              name: 'article/riderstudyarticlelist',
              component: () => import('./views/article/ridingStudyList.vue'), //骑手填写资料帮助列表
            },
            {
              props: true,
              meta: {
                mtype: '17',
              },
              path: 'ridingStudyEdit',
              name: 'ridingStudyEdit',
              component: () => import('./views/article/ridingStudyEdit.vue'), //新增编辑骑手填写资料帮助
            },
            {
              props: true,
              meta: {
                mtype: '17',
              },
              path: 'win',
              name: 'win',
              component: () => import('./views/article/win.vue'), //合作共赢
            },
          ],
        },
        {
          // 消息管理
          props: true,
          meta: {
            mtype: '11',
            mpath: 'platform',
            mt: 'A',
          },
          path: 'message',
          name: 'Message',
          component: message,
          children: [{
              props: true,
              meta: {
                mtype: '11',
              },
              path: 'addplatform',
              name: 'addplatform',
              component: () => import('./views/message/addplatform.vue'), //新增平台消息
            },
            {
              props: true,
              meta: {
                mtype: '11',
              },
              path: 'diyplatform',
              name: 'diyplatform',
              component: () => import('./views/message/diyplatform.vue'), //选特定用户
            },
            {
              props: true,
              meta: {
                mtype: '11',
                mt: 'B',
              },
              path: 'platform',
              name: 'message/getmessages',
              component: () => import('./views/message/platform.vue'), //平台消息管理
            },
            {
              props: true,
              meta: {
                mtype: '11',
              },
              path: 'tomsg',
              name: 'tomsg',
              component: () => import('./views/message/tomsg.vue'), //查看消息
            }
          ],
        },
        {
          // 权限管理
          props: true,
          meta: {
            mtype: '15',
            mpath: 'authmanagement/agentdefaultrole',
            mt: 'A',
          },
          path: 'authority',
          name: 'AuthManagement',
          component: authority,
          children: [{
              props: true,
              meta: {
                mtype: '15',
                mt: 'B',
              },
              path: 'permission',
              name: 'authmanagement/agentdefaultrole',
              component: () => import('./views/authority/permission.vue'), //代理商
            },
            {
              props: true,
              meta: {
                mtype: '15',
                mt: 'B',
              },
              path: 'authManagement',
              name: 'authmanagement/contractordefaultrole',
              component: () => import('./views/authority/authManagement.vue'), //骑手站长
            },
          ],
        },
        {
          // 物流管理
          props: true,
          meta: {
            mtype: '271',
            mpath: 'operation/logisticslist',
            mt: 'A',
          },
          path: 'logistics',
          name: 'Logistics',
          component: logistics,
          children: [{
              props: true,
              meta: {
                mtype: '271',
                mt: 'B',
              },
              path: 'fedex',
              name: 'operation/logisticslist',
              component: () => import('./views/logistics/fedex.vue'), //物流列表
            },
            {
              props: true,
              meta: {
                mtype: '271',
                mt: 'B',
              },
              path: 'BusinessCoupon',
              name: 'BusinessCoupon',
              component: () => import('./views/logistics/BusinessCoupon.vue'), //商家优惠券使用情况
            },
            {
              props: true,
              meta: {
                mtype: '271',
                mt: 'B',
              },
              path: 'firstOrder',
              name: 'firstOrder',
              component: () => import('./views/logistics/firstOrder.vue'), //首单减免使用情况
            },
            {
              props: true,
              meta: {
                mtype: '271',
                mt: 'B',
              },
              path: 'SetBusinessCoupons',
              name: 'SetBusinessCoupons',
              component: () => import('./views/logistics/SetBusinessCoupons.vue'), //设置商家优惠券
            },

          ],
        },
        {
          // 调查问卷
          props: true,
          meta: {
            mtype: '275',
            mt: 'A',
          },
          path: 'survey',
          name: 'Questionnaire',
          component: survey,
          children: [{
            props: true,
            meta: {
              mtype: '275',
              mt: 'B',
            },
            path: 'survey',
            name: 'Questionnaire/questionnaireList',
            component: () => import('./views/survey/survey.vue'),
          }, {
            props: true,
            meta: {
              mtype: '275',
            },
            path: 'surveyInfo',
            name: 'surveyInfo',
            component: () => import('./views/survey/surveyInfo.vue'),
          }, {
            props: true,
            meta: {
              mtype: '275',
            },
            path: 'answerInfo',
            name: 'answerInfo',
            component: () => import('./views/survey/answerInfo.vue'),
          }, ],
        },
        {
          //活动专区views/activityArea/Index.vue
          props: true,
          meta: {
            mtype: '297',
            mt: 'A',
          },
          path: 'activityArea',
          name: '活动专区',
          component: activityArea,
          children: [{
              props: true,
              meta: {
                mtype: '297',
                mt: 'B',
              },
              path: 'specialSale',
              name: 'JdPromotion/saleGoodsList',
              component: () => import('./views/activityArea/specialSale.vue'), //特卖专区
            },
            {
              props: true,
              meta: {
                mtype: '297',
              },
              path: 'specialDetail',
              name: 'specialDetail',
              component: () => import('./views/activityArea/specialDetail.vue'), ////特卖专区详情
            },
            {
              props: true,
              meta: {
                mtype: '297',
                mt: 'B',
              },
              path: 'hotSale',
              name: 'JdPromotion/hotGoodsList',
              component: () => import('./views/activityArea/hotSale.vue'), //热销榜专区
            },
            {
              props: true,
              meta: {
                mtype: '297',
              },
              path: 'hotDetail',
              name: 'hotDetail',
              component: () => import('./views/activityArea/hotDetail.vue'), //热销榜专区详情
            },
            {
              props: true,
              meta: {
                mtype: '297',
                mt: 'B',
              },
              path: 'seckillSale',
              name: 'JdPromotion/seckillGoodsList',
              component: () => import('./views/activityArea/seckillSale.vue'), //秒杀专区
            },
            {
              props: true,
              meta: {
                mtype: '297',
                mt: 'B',
              },
              path: 'groupSale',
              name: 'JdPromotion/pinkGoodsList',
              component: () => import('./views/activityArea/groupSale.vue'), //拼团专区
            },
            {
              props: true,
              meta: {
                mtype: '297',
              },
              path: 'groupDetail',
              name: 'groupDetail',
              component: () => import('./views/activityArea/groupDetail.vue'), //拼团专区详情
            },
            {
              props: true,
              meta: {
                mtype: '297'
              },
              path: 'setSeckillGoods',
              name: 'setSeckillGoods',
              component: () => import('./views/activityArea/setSeckillGoods.vue'), //设置秒杀活动商品
            },
            {
              props: true,
              meta: {
                mtype: '297',
                mt: 'B',
              },
              path: 'actgoodsdetail',
              name: 'actgoodsdetail',
              component: () => import('./views/activityArea/actgoodsdetail.vue'), //查看秒杀活动商品详情
            },
            {
              props: true,
              meta: {
                mtype: '297',
                mt: 'B',
              },
              path: 'actDetail',
              name: 'actDetail',
              component: () => import('./views/activityArea/actDetail.vue'), //查看活动详情
            },
            {
              props: true,
              meta: {
                mtype: '297',
              },
              path: 'addseckill',
              name: 'addseckill',
              component: () => import('./views/activityArea/addseckill.vue'), //添加活动
            },
            {
              props: true,
              meta: {
                mtype: '297',
              },
              path: 'editseckill',
              name: 'editseckill',
              component: () => import('./views/activityArea/editseckill.vue'), //编辑活动
            },
          ],
        },
        {
          //抽佣管理
          meta: {
            mtype: '295',
            mt: 'A',
          },
          path: 'extract',
          name: '抽佣管理',
          component: extract,
          children: [{
              props: true,
              meta: {
                mtype: '295',
                mt: 'B',
              },
              path: 'setExtract',
              name: 'JdCommission/setData',
              component: () => import('./views/extract/setExtract.vue'),
            },
            {
              props: true,
              meta: {
                mtype: '295',
                mt: 'B',
              },
              path: 'setGoods',
              name: 'JdCommission/cateData',
              component: () => import('./views/extract/setGoods.vue'),
            }
          ],
        },
      ],
    },
    {
      name: 'login',
      path: '/login',
      props: true,
      meta: {
        mtype: 'A',
      },
      component: () => import('./views/login/login.vue'),
    },
    {
      path: '*',
      redirect: '/login'
    }
  ],
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start();
  const token = sessionStorage.getItem("token")
  // console.log(token, '全局前置守卫')
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (token) { // 判断当前的token是否存在
      next();
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    next();
  }
})

// 全局后置守卫
router.afterEach((to, from) => {
  // 完成 NProgress.done()
  NProgress.done();
});

export default router;
