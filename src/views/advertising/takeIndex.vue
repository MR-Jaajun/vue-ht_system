<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>广告管理</el-breadcrumb-item>
      <el-breadcrumb-item>推荐专区（外卖）</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>推荐专区（外卖）审核列表</h1>
    <!-- 广告信息 -->
    <div class="edit">
      <div class="title">
        <h2>编辑广告计费</h2>
        <i class="el-icon-edit" @click="opendia"></i>
      </div>
      <div class="list">
        <div>
          <span style="margin-right:20px;">广告位数量：</span>
          <span>{{adv_num}} 个</span>
        </div>
        <div>
          <span style="margin-right:38px;">按天计费：</span>
          <span>{{adv_price}} 元</span>
        </div>
        <div>
          <span style="margin-right:38px;">套餐组合：</span>
          <span>{{adv_com}}</span>
        </div>
      </div>
    </div>
    <!-- 搜索条件 -->
    <div class="search">
      <div class="search_list">
        <span>订单编号</span>
        <el-input v-model="orderID" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="search_list">
        <span>审核状态</span>
        <el-select v-model="status" placeholder="请选择" clearable>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="search_list">
        <span>广告状态</span>
        <el-select v-model="status2" placeholder="请选择" clearable>
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="search_list">
        <span>店铺名称</span>
        <el-input v-model="shop_name" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="search_list">
        <span>退款状态</span>
        <el-select v-model="status3" placeholder="请选择" clearable>
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="search_list">
        <span>审核时间</span>
        <el-date-picker
          clearable
          v-model="time_val"
          value-format="timestamp"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getTime"
        ></el-date-picker>
      </div>
      <div class="search_list">
        <span>选择地区</span>
        <el-select
          clearable
          v-model="sheng"
          @change="choseProvince"
          placeholder="省级地区"
          no-data-text="请选择代理商类型"
        >
          <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
        <el-select
          style="margin:0 10px"
          v-model="shi"
          @change="choseCity"
          placeholder="市级地区"
          no-data-text="请选择省份"
          clearable
        >
          <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
        <el-select
          clearable
          no-data-text="请选择城市"
          v-model="qu"
          @change="choseBlock"
          placeholder="区级地区"
        >
          <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="search_list">
        <el-button type="primary" @click="getsearch" size="small">搜索</el-button>
        <el-button plain @click="clear" size="small" style="margin-left:30px;">重置</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <section class="vip-table" style=" width: fit-content;">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'62px' }"
      >
        <el-table-column prop="id" label="订单编号" align="center" width="120"></el-table-column>
        <el-table-column prop="shop_title" label="店铺名称" align="center" width="160"></el-table-column>
        <el-table-column prop="pay_fee" label="订单金额" align="center" width="120"></el-table-column>
        <el-table-column prop="day_count" label="购买天数" align="center" width="80"></el-table-column>
        <el-table-column prop="create_time" label="订单创建时间" align="center" width="150"></el-table-column>
        <el-table-column prop="update_time" label="重新提交申请" align="center" width="150"></el-table-column>
        <el-table-column prop="day_count" label="广告时间" align="center" width="150">
          <template slot-scope="{row}">
            <div v-for="(item,i) in row.advert_time" :key="i">{{item.advert_day}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="show_type" label="设为城市展示" align="center" width="100">
          <template slot-scope="{row}">
            <el-switch :value="row.show_type==0?false:true" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="广告排序" align="center" width="80"></el-table-column>
        <el-table-column prop="status" label="审核状态" align="center" width="100">
          <template slot-scope="{row}">
            <span v-show="row.status==1">待审核</span>
            <span v-show="row.status==2">审核通过</span>
            <span v-show="row.status==-1">被驳回</span>
          </template>
        </el-table-column>
        <el-table-column prop="refund_status" label="退款状态" align="center" width="100">
          <template slot-scope="{row}">
            <span v-show="row.refund_status==1">申请中</span>
            <span v-show="row.refund_status==2">同意</span>
            <span v-show="row.refund_status==3">拒绝</span>
            <span v-show="row.refund_status==0">未申请</span>
          </template>
        </el-table-column>
        <el-table-column prop="advert_status" label="广告状态" align="center" width="100">
          <template slot-scope="{row}">
            <span v-show="row.status==1">待开始</span>
            <span v-show="row.status==2">已结束</span>
            <span v-show="row.status==3">进行中</span>
            <span v-show="row.status!=1&&row.status!=2&&row.status!=3">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="todetail(row.id)">查看</el-button>
            <el-button
              type="text"
              size="small"
              v-show="row.status ==1"
              @click="open(row.id,1,'您将通过该申请')"
            >通过</el-button>
            <el-button
              type="text"
              size="small"
              v-show="row.status ==1"
              style="color:red"
              @click="open2(row.id,2)"
            >驳回</el-button>
            <el-button
              type="text"
              size="small"
              v-show="row.status ==-1 && row.refund_status==1"
              @click="open3(row.id)"
            >同意退款</el-button>
            <!-- <el-button
              type="text"
              size="small"
              v-show="row.status ==-1 && row.refund_status==1"
              style="color:red"
            >拒绝退款</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 分页 -->
    <div class="pagination-container" style="margin-top:30px;">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="total,prev,pager,next,jumper"
        :total="total*1"
      ></el-pagination>
    </div>

    <!-- 新增弹窗 -->
    <div class="dias" v-if="dialogFormVisible">
      <el-dialog
        title="编辑广告计费"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        width="574px"
        custom-class="dialog"
        @close="cancel"
      >
        <el-form label-position="left" :label-width="formLabelWidth">
          <el-form-item label="广告位数量：">
            <el-input v-model="setnum" autocomplete="off" placeholder="请输入" maxlength="9"></el-input>
            <i>元</i>
          </el-form-item>
          <el-form-item label="按天计算：">
            <el-input v-model="setprice" autocomplete="off" placeholder="请输入" maxlength="9"></el-input>
            <i>元</i>
          </el-form-item>

          <el-form-item label="优惠组合：">
            <div class="gruop" v-for="(item,i) in discount" :key="i">
              <el-input v-model="item.day" autocomplete="off" placeholder="请输入" maxlength="9"></el-input>
              <i>天</i>
              <el-input v-model="item.price" autocomplete="off" placeholder="请输入" maxlength="9"></el-input>
              <i>元</i>
            </div>
          </el-form-item>
          <el-form-item label>
            <div>
              <div>
                <el-button size="mini" @click="del_discount">删 除</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  style="margin-left:20px;"
                  @click="add_discount"
                >添 加</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      setnum: "",
      setprice: "",
      discount: [{ day: "", price: "" }],
      //广告信息
      adv_num: "",
      adv_price: "",
      adv_com: "",
      adv_disconut: "",
      //列表数据
      tableData: [{ custom_uid: 111 }],
      loading: false,
      total: "",
      // page: 1,
      input: "",
      orderID: "",
      shop_name: "",
      //审核状态
      status: null,
      options: [
        { label: "待审核", value: 1 },
        { label: "审核通过", value: 2 },
        { label: "被驳回", value: -1 }
      ],
      //广告状态
      status2: null,
      options2: [
        { label: "待开始", value: 1 },
        { label: "已结束", value: 2 },
        { label: "进行中", value: 3 }
      ],
      //支付状态状态
      status3: null,
      options3: [
        { label: "未申请", value: 0 },
        { label: "申请中", value: 1 },
        { label: "同意", value: 2 },
        { label: "拒绝", value: 3 }
      ],
      create_time: "",
      time_val: "",
      dialogFormVisible: false,
      num: "",
      price: "",
      formLabelWidth: "120px",
      //省市区
      mapJson: "./json/map.json",
      province: [],
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",
      block: ""
    };
  },
  watch: {
    shi() {
      if (!this.shi) {
        this.qu1 = "";
        this.qu = "";
      }
    },
    sheng() {
      if (!this.sheng) {
        this.qi1 = "";
        this.shi1 = "";
      }
    }
  },
  created() {
    this.getCityData();
    this.advertList(1);
    this.getRule();
  },
  methods: {
    todetail(id) {
      this.$router.push({
        path: "./advDetail",
        query: { orderID: id, type: 1 }
      });
    },
    //获取广告规则  /backend/Advert/getRule
    getRule() {
      this.$axios({
        method: "GET",
        url: "/backend/Advert/getRule",
        params: {
          site_type: 1,
          module: 1
        }
      }).then(res => {
        console.log(res.data.data, "广告规则");
        this.adv_num = res.data.data.daily_amount;
        this.adv_price = res.data.data.daily_price;
        this.adv_disconut = res.data.data.package_price;
        let arr = [];
        res.data.data.package_price.forEach(item => {
          arr.push(item.price + "元/" + item.day + "天");
        });
        this.adv_com = arr.join("、");
      });
    },
    advertList(page) {
      this.loading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Advert/advertListthree",
        params: {
          module: "1",
          advert_id: this.orderID,
          advert_status: this.status2,
          apply_time: this.create_time,
          apply_status: this.status,
          refund_status: this.status3,
          shop_title: this.shop_name,
          shop_province: this.sheng,
          shop_city: this.shi,
          shop_area: this.qu,
          page: page,
          size: 10
        }
      }).then(res => {
        let date = new Date(20200107);
        let time = date.getTime();
        console.log(time);
        console.log(date);
        if (res.data.status == 1) {
          this.loading = false;
          console.log(res, "广告列表");
          this.total = res.data.data.total;
          this.tableData = res.data.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    getsearch() {
      this.advertList(1);
    },
    clear() {
      this.shop_name = null;
      this.orderID = null;
      this.create_time = "";
      this.time_val = "";
      this.status = null;
      this.status2 = null;
      this.status3 = null;
      this.sheng = null;
      this.shi = null;
      this.qu = null;
    },
    //选择时间
    getTime(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.create_time = startTime + "-" + endTime;
      console.log(this.create_time);
    },
    //分页
    handleCurrentChange(val) {
      // this.clear();
      console.log(val);
      this.advertList(val);
    },
    opendia() {
      this.dialogFormVisible = true;
      this.setnum = this.adv_num;
      this.setprice = this.adv_price;
      if (this.adv_disconut.length < 1) {
        this.discount = [{ day: "", price: "" }];
      } else {
        this.discount = this.adv_disconut;
      }
    },
    cancel() {
      this.dialogFormVisible = false;
      this.setnum = "";
      this.setprice = "";
      this.discount = "";
    },
    add_discount() {
      let obj = { day: "", price: "" };
      if (this.discount.length < 8) {
        this.discount.push(obj);
      } else {
        this.$message.error("不能超过8个");
      }
    },
    del_discount() {
      if (this.discount.length > 1) {
        this.discount.pop();
      } else {
        this.$message.error("不能再删了");
      }
    },
    //编辑广告规则  /backend/Advert/ruleMake
    submit() {
      let arr = [];
      this.adv_disconut.forEach(item => {
        arr.push(item.price + "-" + item.day);
      });
      let str = arr.join(",");
      this.$axios({
        method: "POST",
        url: "/backend/Advert/ruleMake",
        data: {
          site_type: 1,
          module: 1,
          daily_amount: this.setnum,
          daily_price: this.setprice,
          package_price: str
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.dialogFormVisible = false;
          this.getRule();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //通过 1 驳回 2
    open(id, type, txt) {
      this.$confirm(txt + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.advertApproval(id, type, null);
      });
    },
    //下架的弹窗
    open2(id, type) {
      console.log(id, type);
      this.$prompt("请输入驳回内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        console.log(value);
        this.system_off_desc = value;
        if (value.trim()) {
          let str = value.trim();
          this.advertApproval(id, type, str);
        } else {
          this.$message.error("请输入驳回内容");
        }
      });
    },
    //审批广告申请 /backend/Advert/advertApproval
    advertApproval(id, type, reason) {
      this.$axios({
        method: "POST",
        url: "/backend/Advert/advertApproval",
        data: {
          apply_id: id,
          approval_type: type,
          reject_reason: reason
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.advertList(1);
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    open3(id) {
      this.$confirm("您将同意该订单退款,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.reject_advert(id, "/backend/Advert/advertRefund", null);
      });
    },
    //广告同意退款 /backend/Advert/advertRefund    广告拒绝退款 /backend/Advert/rejectRefund
    reject_advert(id, url, reason) {
      this.$axios({
        method: "POST",
        url: url,
        data: {
          apply_id: id,
          reject_reason: reason
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.advertList(1);
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    /**********************加载地点数据*******************************************/
    // 加载china地点数据，三级
    getCityData() {
      var that = this;
      axios
        .get(this.mapJson)
        .then(function(response) {
          if (response.status == 200) {
            var data = response.data;
            that.province = [];
            that.city = [];
            that.block = [];
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {
                //省
                that.province.push({
                  id: item,
                  value: data[item],
                  children: []
                });
              } else if (item.match(/00$/)) {
                //市
                that.city.push({ id: item, value: data[item], children: [] });
              } else {
                //区
                that.block.push({ id: item, value: data[item] });
              }
            }
            // 分类市级
            for (var index in that.province) {
              for (var index1 in that.city) {
                if (
                  that.province[index].id.slice(0, 2) ===
                  that.city[index1].id.slice(0, 2)
                ) {
                  that.province[index].children.push(that.city[index1]);
                }
              }
            }
            // 分类区级
            for (var item1 in that.city) {
              for (var item2 in that.block) {
                if (
                  that.block[item2].id.slice(0, 4) ===
                  that.city[item1].id.slice(0, 4)
                ) {
                  that.city[item1].children.push(that.block[item2]);
                }
              }
            }
          } else {
            console.log(response.status);
          }
        })
        .catch(function(error) {
          console.log(typeof +error);
        });
    },
    // 选省
    choseProvince(e) {
      this.shi = "";
      this.qu = "";
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shi1 = this.province[index2].children;
          this.shi = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.qu = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
          this.sheng = this.province[index2].value;
          console.log("选省", this.sheng);
          // console.log("选省", this.E);
        }
      }
      this.getSiteList(1);
    },
    // 选市
    choseCity(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shi = this.city[index3].value;
          console.log("选市", this.shi);
          // console.log("选市", this.E);
        }
      }
      this.getSiteList(1);
      if (!this.shi) {
        this.qu = "";
      }
    },
    // 选区
    choseBlock(e) {
      this.E = e;
      for (var i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.qu = this.qu1[i].value;
          console.log("选区", this.qu, this.sheng + this.shi + this.qu);
        }
      }
      this.getSiteList(1);
    }
    /******************************************************* */
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin-top: 10px;
  height: 29px;
  font-size: 22px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 29px;
  color: rgba(51, 51, 51, 1);
}
.edit {
  margin-top: 28px;
  width: 441px;
  // height: 180px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  padding: 15px 16px;
  box-sizing: border-box;
  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 18px;
    h2 {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 2px;
      margin-right: 15px;
    }
    i {
      font-size: 18px;
      cursor: pointer;
    }
    i:hover {
      color: rgba(67, 113, 232, 1);
    }
  }
  .list {
    div {
      display: flex;
      margin-bottom: 18px;
      span {
        font-size: 18px;
        color: rgba(51, 51, 51, 1);
        letter-spacing: 1px;
      }
    }
  }
}
.search {
  margin-top: 40px;
  width: 1550px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  .search_list {
    margin: 0 100px 20px 0;
    // width: 300px;
    display: flex;
    align-items: center;
    // justify-content: flex-start;
    span {
      min-width: 100px;
      font-size: 16px;
      color: rgba(51, 51, 51, 1);
    }
  }
}
.vip-table {
  border: 1px solid #f2f2f2;
  border-bottom: none;
}
</style>

<style lang="scss">
.dias {
  .dialog {
    .el-dialog__header {
      position: relative;
      height: 70px;
      .el-dialog__title {
        font-weight: bold;
        letter-spacing: 1px;
        position: absolute;
        top: 32px;
        left: 56px;
        font-size: 20px;
      }
    }
    .el-dialog__body {
      padding: 30px 56px 5px 56px;
      i {
        font-size: 16px;
        margin-right: 10px;
        // color: #333;
      }
      .gruop {
        display: flex;
        margin-bottom: 12px;
        span {
          margin-right: 12px;
        }
        .el-input {
          width: 80px;
          margin-right: 10px;
        }
        .el-input__inner {
          width: 80px;
        }
      }
      .el-input {
        width: 248px;
        margin-right: 10px;
      }
      .el-input__inner {
        width: 248px;
      }
      .el-form-item__label {
        color: #333;
      }

      .el-form-item__content {
        display: flex;
        flex-wrap: wrap;
        // align-items: center;
      }
      .el-form-item__label {
        font-size: 0.16rem;
      }
    }
  }
}
</style>