<!--
 * @Description: 设置商品排序
 * @Author: duo
 * @Date: 2019-09-26 14:37:46
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 12:22:23
 -->
<template>
  <div class="commercial-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>活动专区</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>设置商品顺序</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>设置商品顺序</h1>
    <!-- 时间段 -->
    <div class="time">
      <div
        @click="changeList(item.id,index)"
        class="time_item"
        :class="isActive==index? 'active': ''"
        v-for="(item,index) in session"
        :key="index"
      >{{item.scene_title}}</div>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <span>商家名称/商品名称</span>
      <el-input v-model="name"></el-input>
      <el-button type="primary" @click="getsearch">搜索</el-button>
    </div>
    <!-- 列表 -->
    <div class="goodslist">
      <h2>商品列表(99)</h2>
      <section class="goods-table">
        <el-table
          :data="tableData"
          v-loading="listLoading"
          :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
        >
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column prop="shop_title" label="商品名称" align="center" width="150"></el-table-column>
          <el-table-column prop="cover_image" label="商品图片" align="center" width="100">
            <template slot-scope="{row}">
              <img :src="row.cover_image" alt="商品图片" style="width:53px;height:53px;" />
            </template>
          </el-table-column>
          <el-table-column prop="sale_price" label="原价" align="center" width="80"></el-table-column>
          <el-table-column prop="seckill_price" label="限时抢购价" width="100" align="center"></el-table-column>

          <el-table-column prop="stock_amount" label="库存" align="center" width="100"></el-table-column>
          <el-table-column prop="stock" label="活动库存" align="center" width="100"></el-table-column>

          <el-table-column prop="sort" align="center" label="排序" width="100">
            <template slot-scope="{row}">
              <el-input v-model="row.sort" @blur="recommendGoodsSort(row.id,row.sort)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="{row}">
              <el-link type="primary" @click="toInfo(row)">查看</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block" style="height:30px;width:700px;margin-top:40px;">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="total,prev,pager,next,jumper"
            :total="total*1"
          ></el-pagination>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      session: [], // 活动场次
      seckill_id: "", //活动标ID
      change_id: "", //默认显示
      name: "", //搜索
      tableData: [], //商品列表
      listLoading: false,
      total: "", //页码
      isActive: false //高亮显示
    };
  },
  created() {
    this.seckill_id = this.$route.params.row.id;
    this.seckillDetail();
    // this.goodsList(this.change_id, 1);
  },
  methods: {
    //活动详情 /backend/Seckill/seckillDetail
    seckillDetail() {
      this.$axios({
        method: "GET",
        url: "/backend/Seckill/seckillDetail",
        params: {
          seckill_id: this.seckill_id
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.session = res.data.data.seckillScene;
          let arr = res.data.data.seckillScene;
          this.goodsList(arr[0].id, 1);
        }
      });
    },

    //切换商品列表 /backend/Seckill/seckillGoodsList
    changeList(id, num) {
      console.log(num);
      this.isActive = num;
      //   for(let i = 0;i<this.session.length;i++){
      //       if(num == i){

      //           this.isActive = true;
      //           break;
      //       }
      //   }
      this.change_id = id;
      this.goodsList(id, 1);
    },
    // 商品列表
    goodsList(id, page) {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Seckill/seckillGoodsList",
        params: {
          scene_id: id,
          name: this.name,
          page: page,
          size: 10,
          status: 1
        }
      }).then(res => {
        // console.log(res);
        if (res.data.status == 1) {
          this.listLoading = false;
          this.total = res.data.data.total;
          this.tableData = res.data.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    /**去详情页 */
    toInfo(row) {
      this.$router.push({ name: "seckillInfo", params: { row } });
    },
    //秒杀活动商品排序 /backend/Seckill/setSeckillGoodsSort
    recommendGoodsSort(id, num) {
      this.$axios({
        method: "POST",
        url: "/backend/Seckill/setSeckillGoodsSort",
        data: {
          seckill_goods_id: id,
          sort: num
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.goodsList(this.change_id, 1);
        } else {
          this.$message.error(res.data.msg);
          this.goodsList(this.change_id, 1);
        }
      });
    },
    //搜索
    getsearch() {
      this.goodsList(this.change_id, 1);
    },
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      //   this.gettable(val);
      this.goodsList(this.change_id, val);
    }
  }
};
</script>


<style lang="scss" scoped>
.commercial-wapper {
  h1 {
    margin: 10px 0 35px 0;
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
  }
  //时间段
  .time {
    width: 1090px;
    // height: 51px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    // border-left: 1px solid rgba(204, 204, 204, 1);
    .time_item {
      width: 135px;
      height: 51px;
      border: 1px solid rgba(204, 204, 204, 1);
      //   border-left: none;
      text-align: center;
      line-height: 51px;
      font-size: 18px;
      color: #333333;
      margin-top: 10px;
      //   margin-right: 5px;
    }
    .active {
      background: rgba(82, 118, 231, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
  .search {
    margin-top: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 32px;
    span {
      font-size: 16px;
      font-weight: 400;
      line-height: 21px;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 1px;
    }
  }
  .goodslist {
    margin-top: 34px;
    h2 {
      height: 26px;
      font-size: 20px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 1px;
      margin-bottom: 20px;
    }
    .goods-table {
      width: 880px;
    }
  }
}
</style>
<style lang="scss">
@import "../../styles/duo.scss";
</style>
<style lang="scss">
.search {
  .el-input {
    width: 248px;
    height: 32px;
    border-radius: 2px;
    margin: 0 60px 0 25px;
  }
}
</style>
