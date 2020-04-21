
<template>
  <div class="act-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>活动专区</el-breadcrumb-item>
      <el-breadcrumb-item>秒杀专区</el-breadcrumb-item>
      <el-breadcrumb-item>查看活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>查看活动详情</h1>
    <div class="form_div">
      <h2>
        活动基本信息
        <i class="XI"></i>
      </h2>
      <p class="form_p">
        <span>*活动状态：</span>
        <span>{{seckill_row.status_value}}</span>
      </p>
      <p class="form_p">
        <span>*活动名称:</span>
        <span>{{seckill_row.activity_title}}</span>
      </p>
      <p class="form_p">
        <span>*活动开始时间:</span>
        <span>{{seckill_row.activity_start_time}}</span>
      </p>
      <p class="form_p">
        <span>*活动结束时间:</span>
        <span>{{seckill_row.activity_end_time}}</span>
      </p>
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
            <el-button @click="dialogTable(row.id)" type="primary" round>查看设置商品</el-button>
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
    <!--设置商品弹窗 -->
    <el-dialog title :show-close="true" :visible.sync="dialogTableVisible">
      <el-form inline="true" :model="formInline" ref="formInline">
        <el-form-item label="商品名称" prop="name">
          <el-input class="dialog_ipnt" v-model="formInline.name" placeholder="请输入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="商品分类" prop="type">
          <el-input class="dialog_ipnt" v-model="formInline.type" placeholder="请输入"></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" style="margin-right:15px;" @click="serach">搜索</el-button>
          <el-button @click="resetForm('formInline')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dialogData"
        style="width: fit-content"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
        @selection-change="selectAll"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column align="center" prop="goods_id" label="商品ID" width="120"></el-table-column>
        <el-table-column align="center" label="商品图片" width="80">
          <template slot-scope="{row}">
            <img :src="row.goods_image" style="width:50px;height:50px" alt="暂无图片" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_name" label="商品名称" width="300"></el-table-column>
        <el-table-column align="center" prop="goods_cate_name" label="商品分类" width="200"></el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="京东价（¥）" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.jd_price}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="折扣数" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.jd_rebate}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="协议价(¥)" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.jd_treaty_price}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goods_sku_data" label="上架价格(¥)" width="90">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sku_sale_price}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="goods_sku_data" label="排序" width="100">
          <template slot-scope="{row}">
            <p v-for="(item, index) in row.goods_sku_data" :key="index">{{item.sort}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="130">
          <template slot-scope="{row}">
            <el-input v-model="row.rebate" @blur="price(row.rebate, row.goods_id)" />
          </template>
        </el-table-column>-->
      </el-table>
      <div style="margin-top: 20px;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dtotal*1"
        ></el-pagination>
      </div>

      <!--<div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">关闭</el-button>
     <el-button type="primary" @click="gobind">确 定</el-button>
      </div>-->
    </el-dialog>

    <!-- 返回 -->
    <el-button type="primary" plain @click="backdown">返回上一页</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogTableVisible: false,
      seckill_row: null,
      tableData: [],
      seckill_id: "",
      //弹窗表格
      dialogData: [],
      formInline: {
        name: ""
      },
      //手动分页
      page: 1,
      size: 5
    };
  },
  created() {
    this.seckill_id = this.$route.query.row.id;
    this.seckill_row = this.$route.query.row;
  },
  mounted() {
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
      this.$get("/backend/JdPromotion/secKillDetail", {
        seckill_id: this.seckill_id
      }).then(res => {
        if (res.data.status == 1) {
          this.tableData = [];
          if (res.data.data.seckillScene) {
            this.tableData = res.data.data.seckillScene;
            this.total = this.tableData.length;
          }
        }
      });
    },
    setDia(id) {
      console.log(id);
    },
    //弹窗input重置
    resetForm(forName) {
      this.$refs[forName].resetFields();
      this.gridData = [];
    },
    //获取弹窗设置商品table数据
    dialogTable(id) {
      this.dialogTableVisible = true;
      this.$get("/backend/JdPromotion/secKillGoodsList", {
        seckill_scene_id: id,
        page: this.page,
        size: this.size
      }).then(res => {
        this.dialogData = [];
        this.dtotal = res.data.data.total;
        var arrdata = res.data.data.data;
        arrdata.map(a => {
          a.rebate = "请设置折扣";
        });
        this.dialogData = arrdata;
        console.log(arrdata, "table数据000000");
      });
    },

    //页码操作
    handleSizeChange(val) {
      this.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTable();
      this.page = 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.act-wapper {
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
    height: 281px;
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
    }
    .form_p {
      display: flex;
      margin-top: 30px;
      justify-content: flex-start;
      height: 20px;
      span:nth-child(1) {
        width: 150px;
      }
      span {
        height: 20px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: rgba(51, 51, 51, 1);
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
.act-wapper{

.el-form .el-form-item {
  /* display: -webkit-box; */
  // display: -ms-flexbox;
  /* display: flex; */
  // -webkit-box-pack: start;
  // -ms-flex-pack: start;
  justify-content: flex-start;
  height: 0.5rem;
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

