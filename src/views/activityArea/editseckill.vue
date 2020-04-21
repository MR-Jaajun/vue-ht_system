
<template>
  <div class="act-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>活动专区</el-breadcrumb-item>
      <el-breadcrumb-item>秒杀专区</el-breadcrumb-item>
      <el-breadcrumb-item>添加限时购活动</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>{{isedit==0?'添加限时购活动':'编辑限时购活动'}}</h1>
    <div class="form_div">
      <h2>
        活动基本信息
        <i>(*为必填项或必选项)</i>
        <i class="XI"></i>
      </h2>
      <el-form :label-position="labelPosition" label-width="150px">
        <el-form-item label="活动名称" required>
          <el-input
            class="act_title"
            type="text"
            v-model="name"
            maxlength="20"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="活动开始时间" required>
          <el-date-picker
            value-format="timestamp"
            v-model="date1"
            @change="gettime(date1,1)"
            type="date"
            placeholder="请选择年月日"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间" required>
          <el-date-picker
            value-format="timestamp"
            v-model="date2"
            @change="gettime(date2,2)"
            type="date"
            placeholder="请选择年月日"
            clearable
          ></el-date-picker>
        </el-form-item>
        <!-- <el-time-select
          placeholder="起始时间"
          v-model="startTime"
          @change="getstart"
          :picker-options="{
      start: '00:00',
      step: '01:00',
      end: '24:00'
    }"
        ></el-time-select>
        <el-time-select
          placeholder="结束时间"
          v-model="endTime"
          :picker-options="{
      start: '00:00',
      step: '01:00',
      end: '24:00',
      minTime: startTime
    }"
        ></el-time-select>-->
      </el-form>
    </div>
    <div class="table_div">
      <el-form>
        <el-form-item label="时间段设置" required></el-form-item>
        <el-button
          type="primary"
          @click="opendialog"
          style="margin-left:36px;"
          icon="el-icon-plus"
        >添加时间段</el-button>
      </el-form>
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column prop="scene_title" label="时间段名称" align="center" width="147"></el-table-column>
        <el-table-column prop="scene_start_time" label="开始时间" align="center" width="147"></el-table-column>
        <el-table-column prop="scene_end_time" label="结束时间" align="center" width="147"></el-table-column>
        <el-table-column prop="goods_limit_amount" label="限制商品数量" align="center" width="148"></el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="{row}">
            <el-link type="primary" style="margin-right:20px" @click="edit(row)">编辑</el-link>
            <el-link type="primary" style="margin-right:20px" @click="setGoods(row)">设置商品</el-link>
            <el-link type="danger" @click="open(row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dia">
      <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :title="ischange==0?'添加时间段':'编辑时间段'"
        :visible.sync="dialogTableVisible"
      >
        <el-form class="demo-form-inline" label-position="left" label-width="120px">
          <el-form-item label="时间段名称" required>
            <el-input v-model="time_name" clearable placeholder="时间段名称"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" required>
            <!-- <el-time-picker
              v-model="dia_time1"
              value-format="HH:mm:ss"
              @change="gettime(dia_time1,5)"
              placeholder="开始时间"
            ></el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间" required>
            <el-time-picker
              v-model="dia_time2"
              value-format="HH:mm:ss"
              @change="gettime(dia_time2,6)"
              placeholder="结束时间"
            ></el-time-picker>-->
            <el-time-select
              placeholder="起始时间"
              v-model="dia_time1"
              @change="gettime(dia_time1,5)"
              :picker-options="{
      start: '00:00',
      step: '01:00',
      end: '24:00',
    }"
            ></el-time-select>
          </el-form-item>
          <el-form-item label="结束时间" required>
            <el-time-select
              placeholder="结束时间"
              v-model="dia_time2"
              @change="gettime(dia_time2,6)"
              :picker-options="{
      start: '01:00',
      step: '01:00',
      end: '24:00',
      minTime: dia_time1
    }"
            ></el-time-select>
          </el-form-item>
          <el-form-item label="限制商品数量" required>
            <el-input v-model="goods_count" clearable placeholder="限制商品数量"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cencel">取 消</el-button>
          <el-button type="primary" v-show="ischange==0" @click="save">添 加</el-button>
          <el-button type="primary" v-show="ischange==1" @click="save2">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 返回 -->
    <el-button type="primary" @click="submit">提交</el-button>
    <el-button type="primary" plain style="margin-left:30px;" @click="backdown">返回上一页</el-button>
  </div>
</template>

<script>
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  data() {
    return {
      seckill: {},
      seckill_id: "",
      seckill_row: null,
      isedit: 1,
      labelPosition: "right",
      tableData: [],
      t_data: [],
      name: "",
      date1: "", //活动开始时间
      date2: "", //活动结束时间

      //传给后台的时间
      activity_start_time: "", //活动开始时间
      activity_end_time: "", //活动结束时间
      //弹窗
      dialogTableVisible: false,
      time_name: "",
      goods_count: "",
      dia_time1: "",
      dia_time2: "",
      //传入的时间
      scene_start_time: "",
      scene_end_time: "",
      ischange: 0,
      editID: "",
      //数组转字符串
      str: "",
      mmp: 0,
      startTime: "",
      endTime: ""
    };
  },

  created() {
    this.seckill_id = this.$route.query.row;
    sessionStorage.setItem("seckill_id", JSON.stringify(this.seckill_id));
    this.seckillDetail();
  },
  mounted() {
    this.name = this.$route.query.row.activity_title;
    var st = this.$route.query.row.activity_start_time;
    var et = this.$route.query.row.activity_end_time;
    var st_time = new Date(st).getTime();
    var et_time = new Date(et).getTime();
    this.date1 = st_time;
    this.date2 = et_time;
    this.activity_start_time = st_time / 1000;
    this.activity_end_time = et_time / 1000;
    console.log(this.date1, "this.date1");
  },
  methods: {
    //设置商品
    setGoods(row) {
      this.$router.push({
        path: "./setSeckillGoods",
        query: { seckill_scene_id: row.id }
      });
    },
    //获取时间
    gettime(val, num) {
      if (num == 1) {
        this.activity_start_time = val / 1000;
        console.log(val);
      }
      if (num == 2) {
        this.activity_end_time = val / 1000;
        console.log(val);
      }
      // if (num == 3) {
      //   this.signup_start_time = val / 1000;
      // }
      // if (num == 4) {
      //   this.signup_end_time = val / 1000;
      // }
      if (num == 5) {
        this.scene_start_time = val;
        console.log(val);
        // console.log(val.substr(0, 2) * 1);
      }
      if (num == 6) {
        this.scene_end_time = val;
      }
    },
    //返回上一页
    backdown() {
      this.$router.go(-1);
      // sessionStorage.removeItem("orderID");
    },
    cencel() {
      this.dialogTableVisible = false;
      this.time_name = "";
      this.goods_count = "";
      this.dia_time1 = "";
      this.dia_time2 = "";
      this.scene_start_time = "";
      this.scene_end_time = "";
    },
    //打开弹窗
    opendialog() {
      this.dialogTableVisible = true;
      this.ischange = 0;
    },
    //保存
    save() {
      let obj = {};
      if (
        this.time_name &&
        this.dia_time1 &&
        this.goods_count &&
        this.dia_time2
      ) {
        obj.mmp = this.mmp++;
        obj.scene_title = this.time_name;
        obj.scene_start_time = this.scene_start_time.substr(0, 2) * 1;
        obj.scene_end_time = this.scene_end_time.substr(0, 2) * 1;
        obj.goods_limit_amount = this.goods_count;
        this.tableData.push(obj);
        this.zhuanhuan();
        console.log(this.tableData, "mmppppp999");
        this.dialogTableVisible = false;
        this.cencel();
      } else {
        this.$message.error("请完善信息");
      }
    },
    //修改
    save2() {
      let num = this.editID;
      this.tableData[num].scene_title = this.time_name;
      if (this.dia_time1 == "0:00" || this.dia_time1 == "00:00") {
        this.tableData[num].scene_start_time = 0;
      } else {
        this.tableData[num].scene_start_time = this.dia_time1.substr(0, 2) * 1;
      }
      if (this.dia_time2 == "0:00" || this.dia_time2 == "00:00") {
        this.tableData[num].scene_end_time = 0;
      } else {
        this.tableData[num].scene_end_time = this.dia_time2.substr(0, 2) * 1;
      }
      // this.tableData[num].scene_end_time = this.dia_time2.substr(0, 2) * 1;
      this.tableData[num].goods_limit_amount = this.goods_count;
      if (
        this.time_name &&
        this.dia_time1 &&
        this.dia_time2 &&
        this.tableData[num].scene_end_time >
          this.tableData[num].scene_start_time
      ) {
        this.cencel();
        this.dialogTableVisible = false;
      } else {
        this.$message.error("您填写的信息有误");
      }
    },
    //删除
    open(id) {
      this.$confirm("你确定要删除此时间段, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.del(id);
      });
    },
    del(id) {
      let idx = this.getArrayIndex(this.tableData, id);
      this.tableData.splice(idx, 1);
      this.$message.success("删除成功!");
    },
    //获取当前下标
    getArrayIndex(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) {
          return i;
        }
      }
      return -1;
    },
    //编辑
    edit(row) {
      this.editID = this.getArrayIndex(this.tableData, row);
      this.ischange = 1;
      // this.editID = row.mmp;
      console.log(row);
      this.dialogTableVisible = true;
      this.time_name = row.scene_title;
      this.goods_count = row.goods_limit_amount;
      if (row.scene_start_time == 0) {
        this.dia_time1 = "0" + 0 + ":00";
      } else if (row.scene_start_time < 10) {
        this.dia_time1 = "0" + row.scene_start_time + ":00";
      } else {
        this.dia_time1 = row.scene_start_time + ":00";
      }
      if (row.scene_end_time == 0) {
        this.dia_time2 = "0" + 0 + ":00";
      } else if (row.scene_end_time < 10) {
        this.dia_time2 = "0" + row.scene_end_time + ":00";
      } else {
        this.dia_time2 = row.scene_end_time + ":00";
      }
    },
    //数组转字符串
    zhuanhuan() {
      if (this.tableData.length > 0) {
        this.str = JSON.stringify(this.tableData);
      }
    },
    //提交 /backend/JdPromotion/secKillAdd
    submit() {
      this.zhuanhuan();
      this.$axios({
        method: "POST",
        url: "/backend/JdPromotion/secKillAdd",
        data: {
          activity_title: this.name,
          activity_start_time: this.activity_start_time,
          activity_end_time: this.activity_end_time,
          seckill_id: this.seckill_id,
          seckill_scene: this.str
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.seckillDetail();
          // this.$router.push({ path: "./seckillSale" });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //活动详情 /backend/Seckill/seckillDetail
    seckillDetail() {
      var id = sessionStorage.getItem("seckill_id");
      this.$get("/backend/JdPromotion/secKillDetail", {
        seckill_id: this.seckill_id || id
      }).then(res => {
        if (res.data.status == 1) {
          this.name = res.data.data.seckill.activity_title;
          this.date1 = res.data.data.seckill.activity_start_time * 1000;
          this.date2 = res.data.data.seckill.activity_end_time * 1000;
          console.log(res.data.data.seckillScene, "09090909");
          if (res.data.data.seckillScene) {
            var arrdata = res.data.data.seckillScene;
            arrdata.map(v => {
              delete v.create_time;
              console.log(v, "table数据9999999");
            });
            this.tableData = arrdata;
            this.t_data = res.data.data.seckillScene;
            this.total = this.tableData.length;
          }
        }
      });
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
    width: 846px;
    height: 261px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 30px;
    margin-bottom: 40px;
    .act_title {
      width: 200px;
    }
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
    width: fit-content;
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
.act-wapper {
  .el-form .el-form-item {
    /* display: -webkit-box; */
    // display: -ms-flexbox;
    /* display: flex; */
    // -webkit-box-pack: start;
    // -ms-flex-pack: start;
    justify-content: flex-start;
    height: 0.5rem;
  }
  .table_div {
    .el-form {
      margin-bottom: 20px;
      height: 32px;
      display: flex;
      justify-content: flex-start;
    }
  }
  .dia {
    .el-dialog {
      width: 500px;
      .el-dialog__header {
        display: flex;
        .el-dialog__title {
          font-size: 20px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 26px;
          color: rgba(51, 51, 51, 1);
        }
      }
      .el-dialog__footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .el-form-item__label {
        //   width: 155px;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
        letter-spacing: 1px;
      }
      .el-input {
        width: 248px;
      }
    }
  }

  .el-time-panel .el-time-panel__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>

