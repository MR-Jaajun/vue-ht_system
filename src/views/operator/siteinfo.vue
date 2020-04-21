<!--
 * @Description: 站点详情
 * @LastEditors: duo
 * @LastEditTime: 2019-10-21 17:13:57
 -->
<template>
  <div class="orderdetail">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './site' }">运营管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './site' }">站点列表</el-breadcrumb-item>
      <el-breadcrumb-item>站点详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>站点详情</h1>

    <div class="u_r">
      <div style="margin-right:30px">
        <h2>
          站点基本信息
          <i></i>
        </h2>
        <div class="noteinfo common">
          <div class="common2">
            <li>
              <span>站点ID</span>
              <span>{{list.id}}</span>
            </li>
            <li>
              <span>站点名称</span>
              <span>{{list.province}}{{list.city}}{{list.area}}</span>
            </li>
            <li>
              <span>评价类型</span>
              <span>{{list.site_title}}</span>
            </li>
            <li>
              <span>站点范围</span>
              <span>{{list.desc}}</span>
            </li>
          </div>
        </div>
      </div>
      <div style="margin-right:30px">
        <h2>
          骑手承包商信息
          <i></i>
        </h2>
        <div class="noteinfo common">
          <div class="common2">
            <li>
              <span>骑手承包商姓名</span>
              <span>{{list.contractor_info.real_name}}</span>
            </li>
            <li>
              <span>骑手承包商账号</span>
              <span>{{list.contractor_info.custom_account}}</span>
            </li>
            <li>
              <span>联系人姓名</span>
              <span>{{list.contractor_info.contacts}}</span>
            </li>
            <li>
              <span>联系电话</span>
              <span>{{list.contractor_info.contacts_mobile}}</span>
            </li>
          </div>
        </div>
      </div>
      <div>
        <h2>
          骑手信息
          <i></i>
        </h2>
        <div class="noteinfo common">
          <div class="common2">
            <li>
              <span>骑手总人数</span>
              <span>{{list.rider_info.rider_count}}</span>
            </li>
            <li>
              <span>专职</span>
              <span>{{list.rider_info.full_time}}</span>
            </li>
            <li>
              <span>兼职</span>
              <span>{{list.rider_info.part_time}}</span>
            </li>
          </div>
        </div>
      </div>
    </div>

    <div class="orderinfo common">
      <h2>
        骑手列表
        <i></i>
      </h2>
      <el-table :data="list.rider_list.data" border style="width: 100%">
        <el-table-column prop="id" label="骑手ID" width="153" align="center"></el-table-column>
        <el-table-column prop="contact_information" label="手机号" width="200" align="center"></el-table-column>
        <el-table-column prop="contacts" label="姓名" width="153" align="center"></el-table-column>
        <el-table-column prop="gender" label="性别" width="153" align="center"></el-table-column>
        <el-table-column prop="position_type" label="骑手类型" width="153" align="center"></el-table-column>
        <el-table-column prop="rider_order_count" label="派单数" width="153" align="center"></el-table-column>
        <el-table-column
          sortable
          prop="final_time"
          :formatter="timestampToTime"
          label="最近登录时间"
          align="center"
        ></el-table-column>
      </el-table>
      <el-row class="setPage">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[20, 50, 100]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-row>
    </div>

    <!-- 返回 -->
    <el-button plain @click="backdown">返回上一页</el-button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      params: {},
      list: {},
      page: 1,
      size: 20,
      total: ''
    };
  },
  created() {
    this.params = this.$route.params;
    this.getInfo();
  },
  methods: {
    // 时间戳转换成时间
    timestampToTime(row, column) {
      var date = new Date(row.final_time) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var h = date.getHours() + ':'
      var m = date.getMinutes() + ':'
      var s = date.getSeconds()
      return Y + M + D + h + m + s
    },

    //返回上一页
    backdown() {
      this.$router.go(-1);
    },

    //订单详情
    getInfo() {
      this.$axios({
        method: "GET",
        url: "/backend/Rider/siteInfo",
        params: {
          site_id: this.params.id||2,
          page: this.page,
          size: this.size
        }
      }).then(res => {
        this.list = res.data.data
        this.total = res.data.data.rider_list.total
      });
    },
    /**选择每页多少条 */
    handleSizeChange(val) {
      console.log(`多少条: ${val}`)
      this.size = val
      this.getInfo()
    },
    /**选择第几页 */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getInfo()
    },
  }
};
</script>

<style lang="scss" scoped>
.orderdetail {
  h1 {
    margin: 10px 0 35px 0;
    height: 29px;
    font-size: 22px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  .common {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
    margin-right: 15px;
  }
  .common2 li {
    height: 21px;
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    line-height: 21px;
  }
  .common2 li span:nth-child(1) {
    width: 120px;
    text-align: left;
    color: #666;
    font-size: 16px;
    margin-right: 20px;
  }
  .common2 li span:nth-child(2) {
    color: #333;
    font-size: 16px;
  }
  h2 {
    // width: 91px;
    height: 29px;
    font-size: 22px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
    margin-bottom: 26px;
    i {
      display: block;
      width: 34px;
      height: 2px;
      background: rgba(67, 113, 232, 1);
      border-radius: 1px;
      margin-top: 1px;
    }
  }
  //商品信息
  .orderinfo {
    // width: 855px;
    // height: 221px;
    margin-bottom: 40px;
  }
  //   用户和骑手
  .u_r,
  .distribution {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 40px;

    .userinfo {
      width: 772px;
      height: 221px;
      margin-right: 40px;
    }
    .riderinfo {
      width: 334px;
      height: 221px;
    }
  }
  //   支付信息
  .pay_info {
    width: 523px;
    height: 221px;
    margin-bottom: 40px;
  }
  //配送
  .distribution {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .riderinfo {
      //   width: 626px;
      height: 221px;
      margin-right: 40px;
    }
    .changedisinfo {
      width: 480px;
      height: 221px;
      margin-right: 40px;
    }
  }
  //   订单信息
  .noteinfo {
    width: 440px;
    margin-bottom: 40px;
  }
  //发票
  .invoiceinfo {
    width: 484px;
    height: 221px;
    margin-bottom: 40px;
  }
  //商家信息
  .shopinfo {
    width: 380px;
    height: 240px;
    margin-bottom: 40px;
  }
  //商品信息
  .goodsinfo {
    width: 806px;
    // height: 504px;
    border-radius: 4px;
    margin-bottom: 40px;
    padding: 20px;
  }
  //订单进度
  .schedule {
    width: 716px;
    height: 363px;
  }
}

.forImg {
  img {
    width: 80px;
    height: 80px;
    margin: 10px 6px 0 0;
  }
}
.smallTitle {
  font-weight: 800;
}
</style>
<style lang="scss">
.orderdetail .el-table__row {
  color: #333;
  // height: 63px;
  font-size: 14px;
}
.goodsinfo .el-table {
  border: 1px solid #ccc;
}
// 一个区域的title
.section_title {
  font-size: 16px;
  display: flex;
  font-weight: bold;
}
</style>