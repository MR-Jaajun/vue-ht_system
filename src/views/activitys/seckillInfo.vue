<!--
 * @Description: 秒杀审核详情
 * @Author: duo
 * @Date: 2019-09-26 16:02:37
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 12:26:30
 -->
<template>
  <div class="limitInfo-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>限时秒杀管理</el-breadcrumb-item>
      <el-breadcrumb-item>秒杀审核列表</el-breadcrumb-item>
      <el-breadcrumb-item>查看商家详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>查看商家详情</h1>
    <div class="store common">
      <h2>
        店铺基本信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>店铺名称</span>
          <span>{{shop_title}}</span>
        </li>
        <li>
          <span>经营品类</span>
          <span>{{category_value}}</span>
        </li>
        <li>
          <span>手机号</span>
          <span>{{contact_information}}</span>
        </li>
      </div>
    </div>
    <div class="act_info common">
      <h2>
        申请活动信息
        <i></i>
      </h2>
      <div class="common2">
        <li>
          <span>审核时间</span>
          <span>{{create_time}}</span>
        </li>
        <li>
          <span>活动名称</span>
          <span>{{activity_title}}</span>
        </li>
        <li>
          <span>活动时间段</span>
          <span>{{activity_time}}</span>
        </li>
        <li>
          <span>场次时间段</span>
          <span>{{apply_scene_times}}</span>
        </li>
        <li>
          <span>申请商品总数量</span>
          <span>{{aplly_goods}}</span>
        </li>
      </div>
    </div>
    <div class="table_div">
      <el-table
        border
        :data="scene_list"
        :header-cell-style="{color:'#333', height:'63px' }"
        style="width: 100%"
      >
        <el-table-column prop="scene_title" label="时间段名称" align="center" width="147"></el-table-column>
        <el-table-column prop="scene_times" label="场次时间段" align="center" width="147"></el-table-column>
        <el-table-column
          v-show="status!=1"
          prop="scene_verify_goods"
          label="已审核通过商品（个）"
          align="center"
          width="147"
        ></el-table-column>
        <el-table-column prop="goods_limit_amount" label="场次时间段限制商品(个)" align="center" width="150"></el-table-column>
        <el-table-column prop="seckill_scene_apply_goods" label="申请商品数量" align="center" width="148"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" round @click="lookdetails(row)">查看商品详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 资质 审核条件 -->
    <section class="sdiv2">
      <span class="s1">审核状态</span>
      <el-radio-group v-model="radio" @change="pass_refuse">
        <el-radio :label="1" :disabled="status == -1">审核通过</el-radio>
        <el-radio :label="-1" :disabled="status == 1">驳回申请</el-radio>
        <!-- <el-radio :label="1" :disabled="radio !=1">审核中</el-radio> -->
      </el-radio-group>
    </section>
    <div class="re_input" v-show="radio==-1">
      驳回原因：
      <!-- <el-input v-model="re_input2" placeholder="请输入驳回理由" clearable></el-input> -->
      <span>{{remark}}</span>
    </div>
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
          style="width:fit-content"
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
      shop_id: "",
      radio: "",
      re_input2: "",
      system_off_desc: "",
      scene_list: [],
      log_id: "",
      status: "",
      remark: "",
      goods_name2: "",
      total2: "",
      listLoading2: false,
      gridData: [],
      scene_id: "",
      dialogTableVisible: false,
      //店铺信息
      shop_title: "",
      category_value: "",
      contact_information: "",
      //申请信息
      apply_scene_times: "", //场次时间段
      create_time: "", //审核时间
      activity_title: "", //活动标题
      activity_time: "", //活动时间
      aplly_goods: "" //申请数量
    };
  },
  created() {
    this.log_id = this.$route.query.id;
    this.getdetail();
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //通过或者驳回
    pass_refuse(value) {
      console.log(value);
      if (value == 1) {
        this.open();
      }
      if (value == -1) {
        this.open2();
      }
    },
    //通过
    open() {
      this.$confirm("是否通过审核, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //触发接口
          this.passSeckill();
        })
        .catch(() => {
          this.radio = "";
        });
    },
    //驳回
    open2() {
      // console.log(id);
      this.$prompt("驳回理由", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          console.log(value);
          this.system_off_desc = value;
          if (value) {
            this.forbiddenSeckill();
            //触发接口
          } else {
            this.$message.error("你没有填写驳回信息");
            this.radio = "";
          }
        })
        .catch(() => {
          this.radio = "";
        });
    },
    //详情 /backend/Seckill/seckillVerifyDetail
    getdetail() {
      this.$axios({
        method: "GET",
        url: "/backend/Seckill/seckillVerifyDetail",
        params: {
          log_id: this.log_id
        }
      }).then(res => {
        if (res.data.status == 1) {
          console.log(res.data.data);
          const { obj } = res.data.data;
          this.shop_id = res.data.data.shop_id;
          this.status = res.data.data.status;
          this.radio = res.data.data.status;
          //商品信息
          this.scene_list = res.data.data.scene_list;
          //店铺信息
          this.shop_title = res.data.data.shop_title;
          this.category_value = res.data.data.category_value;
          this.contact_information = res.data.data.contact_information;
          //申请信息
          this.create_time = res.data.data.create_time;
          this.activity_title = res.data.data.activity_title;
          this.activity_time = res.data.data.activity_time;
          this.aplly_goods = res.data.data.aplly_goods;
          this.apply_scene_times = res.data.data.apply_scene_times;
          this.tableData = res.data.data.seckill_goods_info;
          this.remark = res.data.data.remark;
        }
      });
    },
    //通过 /backend/Seckill/passSeckill
    passSeckill() {
      this.$axios({
        method: "POST",
        url: "/backend/Seckill/passSeckill",
        data: {
          log_id: this.log_id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.getdetail();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //驳回 /backend/Seckill/forbiddenSeckill
    forbiddenSeckill() {
      this.$axios({
        method: "POST",
        url: "/backend/Seckill/forbiddenSeckill",
        data: {
          log_id: this.log_id,
          remark: this.system_off_desc
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.getdetail();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    getsearch() {
      this.goodsList(this.scene_id, 1);
    },
    //查看商品详情
    lookdetails(row) {
      this.scene_id = row.scene_id;
      this.dialogTableVisible = true;
      this.goodsList(row.scene_id, 1);
    },
    // 商品列表
    goodsList(id, page) {
      this.listLoading2 = true;
      this.$axios({
        method: "GET",
        url: "/backend/Seckill/seckillGoodsList",
        params: {
          shop_id: this.shop_id,
          scene_id: id,
          name: this.goods_name2,
          seckill_log_id: this.log_id,
          page: page,
          status: this.status,
          size: 10
        }
      }).then(res => {
        // console.log(res);
        if (res.data.status == 1) {
          this.listLoading2 = false;
          console.log(res.data.data);
          this.total2 = res.data.data.total;
          this.gridData = res.data.data.data;
          console.log(res.data.data.data[0].cover_image, "66666");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //分页
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`);
      // this.goodsList(this.scene_id, val);
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
    span {
      cursor: pointer;
      font-size: 18px;
      color: #4371e8;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      color: #4371e8;
    }
    i {
      display: block;
      width: 34px;
      height: 2px;
      background: rgba(67, 113, 232, 1);
      border-radius: 1px;
      margin-top: 1px;
    }
  }
  .common2 li {
    font-size: 16px;
    display: flex;
    //
    flex-direction: row;
    margin-bottom: 20px;
    line-height: 21px;
  }
  .common2 li span:nth-child(1) {
    width: 115px;
    text-align: left;
    color: #666;
    font-size: 16px;
    margin-right: 20px;
  }
  .common2 li span:nth-child(2) {
    color: #333;
    width: 340px;
    font-size: 16px;
  }
  .common {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 20px;
  }
  .store {
    width: 414px;
    margin-bottom: 40px;
  }
  .act_info {
    width: 502px;
    margin-bottom: 40px;
  }
  .table_div {
    width: 960px;
    // height: 478px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 30px;
  }
  .sdiv2 {
    padding: 0 20px 0 10px;
    background: #ffffff;
    width: fit-content;
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    margin-top: 30px;
    height: 43px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .s1 {
      height: 24px;
      font-size: 18px;
      line-height: 24px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin-right: 20px;
    }
  }
  .re_input {
    font-size: 16px;
    color: #333;
    width: fit-content;
    padding-left: 10px;
    margin-top: 15px;
  }
}
</style>
<style lang="scss">
.dia {
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
}
.dia .el-dialog {
  width: fit-content;
  // width: 800px;
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
</style>
