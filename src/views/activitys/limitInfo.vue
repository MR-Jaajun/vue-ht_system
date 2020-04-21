<!--
 * @Description: 查看秒杀活动详情
 * @Author: duo
 * @Date: 2019-09-26 14:37:46

 -->
<template>
  <div class="limitInfo-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>限时秒杀管理</el-breadcrumb-item>
      <el-breadcrumb-item>限时秒杀列表</el-breadcrumb-item>
      <el-breadcrumb-item>查看活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>查看活动详情</h1>
    <div class="form_div">
      <h2>
        活动基本信息
        <i>(*为必填项或必选项)</i>
        <i class="XI"></i>
      </h2>
      <el-form ref="form">
        <el-form-item label="活动名称" required>
          <el-input type="text" :disabled="true" v-model="name" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="活动开始时间" required>
          <el-form-item>
            <el-date-picker
              v-model="date1"
              :disabled="true"
              type="date"
              value-format="timestamp"
              format="yyyy年MM月dd日 HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="活动结束时间" required>
          <el-form-item>
            <el-date-picker
              v-model="date2"
              :disabled="true"
              type="date"
              value-format="timestamp"
              format="yyyy年MM月dd日 HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_div">
      <el-form>
        <el-form-item label="活动时间段" required></el-form-item>
      </el-form>
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="scene_title" label="时间段名称" align="center" width="147"></el-table-column>
        <el-table-column prop="scene_start_time" label="开始时间" align="center" width="147"></el-table-column>
        <el-table-column prop="scene_end_time" label="结束时间" align="center" width="147"></el-table-column>
        <el-table-column prop="goods_limit_amount" label="限制商品数量" align="center" width="148"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button @click="lookdetails(row.id)" type="primary" round>查看设置商品</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <div class="block" style="height:30px;width:700px;margin-top:40px;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total,sizes,prev,pager,next,jumper"
          :total="total*1"
        ></el-pagination>
      </div>-->
    </div>
    <!--查看弹窗表格 -->
    <div class="dia">
      <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        title="查看设置商品"
        :visible.sync="dialogTableVisible"
      >
        <div class="search">
          <el-form class="demo-form-inline">
            <el-form-item label="商家名称/商品名称">
              <el-input v-model="goods_name2" clearable placeholder="商家名称/商品名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getsearch">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          v-loading="listLoading2"
          :data="gridData"
          :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px',fontSize:'14px' }"
        >
          <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
          <el-table-column align="center" prop="shop_title" label="商家名称" width="150"></el-table-column>
          <el-table-column align="center" prop="goods_title" label="商品名称" width="150"></el-table-column>
          <el-table-column align="center" prop="category_value" label="商品分类" width="140"></el-table-column>
          <el-table-column align="center" label="商品图片" width="80">
            <template slot-scope="{row}">
              <img :src="row.cover_image" style="width:53px;height:53px;" />
            </template>
          </el-table-column>
          <el-table-column prop="sku_title" label="商品规格" align="center" width="80"></el-table-column>
          <el-table-column prop="market_price" label="原价" align="center" width="80"></el-table-column>
          <el-table-column prop="sale_price" label="销售价" align="center" width="100"></el-table-column>
          <el-table-column prop="seckill_price" label="限时抢购价" align="center" width="100"></el-table-column>
          <el-table-column prop="stock_amount" label="库存" align="center" width="80"></el-table-column>
          <el-table-column prop="seckill_stock_amount" label="活动库存" align="center" width="100"></el-table-column>
          <el-table-column prop="sort" label="排序" align="center" width="80"></el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="block" style="height:30px;width:700px;margin-top:30px;">
          <el-pagination
            background
            @current-change="handleCurrentChange2"
            layout="total,prev,pager,next,jumper"
            :total="total2*1"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
    <!-- 返回 -->
    <el-button type="primary" plain @click="backdown">返回上一页</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      seckill_id: "",
      name: "",
      date1: "",
      date2: "",
      total: "",
      //弹窗表格
      dialogTableVisible: false,
      listLoading2: false,
      total2: "",
      goods_name2: "",
      gridData: [],
      scene_id: "",
      status: "",
      //手动分页
        page: 1,
        limit: 5
      }
    
  },
  created() {
    this.seckill_id = this.$route.query.row.id;
    this.seckillDetail();
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
      // sessionStorage.removeItem("orderID");
    },
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
          this.tableData = [];
          if (res.data.data.seckillScene) {
            this.tableData = res.data.data.seckillScene;
            this.total = this.tableData.length;
          }
          if (res.data.data.seckill.activity_start_time) {
            this.date1 = res.data.data.seckill.activity_start_time * 1000;
          }
          if (res.data.data.seckill.activity_end_time) {
            this.date2 = res.data.data.seckill.activity_end_time * 1000;
          }
          if (res.data.data.seckill.activity_title) {
            this.name = res.data.data.seckill.activity_title;
          }
        }
      });
    },
    getsearch() {
      this.goodsList(this.scene_id, 1);
    },
    // 商品列表
    goodsList(id, page) {
      this.listLoading2 = true;
      this.$axios({
        method: "GET",
        url: "/backend/Seckill/seckillGoodsList",
        params: {
          scene_id: id,
          name: this.goods_name2,
          page: page,
          status:1,
          size: 10
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.listLoading2 = false;
          this.total2 = res.data.data.total;
          this.gridData = res.data.data.data;
          console.log(res.data.data.data[0].cover_image, "66666");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleCurrentChange(val) {
      // this.tableData=[];
      console.log(`当前页: ${val}`);
    },

    //分页
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`);
      this.goodsList(this.scene_id, val);
    },
    lookdetails(id) {
      this.scene_id = id;
      this.dialogTableVisible = true;
      this.goodsList(id, 1);
    }
  }
};
</script>
<style lang="scss">
@import "../../styles/duo.scss";
</style>

<style lang="scss" scoped>
.limitInfo-wapper {
  h1 {
    margin: 10px 0 35px 0;
    height: 29px;
    font-size: 22px;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  .form_div {
    width: 536px;
    // height: 261px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 30px;
    margin-bottom: 40px;
    h2 {
      height: 29px;
      font-size: 22px;
      font-weight: bold;
      line-height: 29px;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 1px;
      margin-bottom: 26px;
      i:nth-child(1) {
        height: 29px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 29px;
        color: rgba(102, 102, 102, 1);
      }
    }
  }
  .table_div {
    width: 846px;
    // height: 478px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 30px;
  }
}
</style>
<style lang="scss">
.limitInfo-wapper {
  .el-form {
    padding-right: 140px;
    .el-form-item {
      display: flex;
      justify-content: flex-start;
      // line-height: 50px;
      height: 50px;
      .el-form-item__label {
        width: 110px;
      }
    }
  }

.dia .el-dialog {
  width: 1230px;
}
.dia .el-dialog .el-dialog__header {
  display: flex;
}
.dia .el-dialog .el-dialog__header .el-dialog__title {
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 26px;
  color: rgba(51, 51, 51, 1);
}
.dia .el-dialog .search .el-form-item__label {
  width: 155px;
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
  letter-spacing: 1px;
}
}
</style>

