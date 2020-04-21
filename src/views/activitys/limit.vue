<!--
 * @Description: 秒杀活动列表
 * @Author: duo
 * @Date: 2019-09-26 09:52:53
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-23 15:34:44
 -->

<template>
  <div class="commercial-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: './limit' }">活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>秒杀活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="commercial-bth">
      <el-button type="primary" @click="toEdit" icon="el-icon-plus">添加活动</el-button>
    </div>

    <div class="search" style="margin-top:30px">
      <el-form class="demo-form-inline">
        <el-form-item label="活动名称">
          <el-input v-model="listQuery.activity_title" clearable placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            @change="getTime"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            v-model="time"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select placeholder="请选择" v-model="listQuery.status">
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in selectlist"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getsearch(1)">搜索</el-button>
          <el-button style="margin-left:10px;" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <section class="vip-table">
      <!-- @selection-change="handleSelectionChange" -->
      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <!-- <el-table-column type="selection" align="center" width="50"></el-table-column> -->
        <el-table-column prop="id" label="
序号" align="center" width="100"></el-table-column>
        <el-table-column prop="activity_title" label="活动名称" align="center" width="150"></el-table-column>
        <el-table-column prop="activity_start_time" label="开始时间" align="center" width="300"></el-table-column>
        <el-table-column prop="activity_end_time" label="
结束时间" align="center" width="300"></el-table-column>
        <!-- <el-table-column prop="goods_cover_image" label="参加商品数量" align="center" width="100">
          <template slot-scope="{row}">
            <img :src="row.goods_cover_image" alt="商品图片" style="width:53px;height:53px;" />
          </template>
        </el-table-column>-->
        <el-table-column prop="goods_amount" label="参加商品数量" align="center" width="150"></el-table-column>
        <el-table-column prop="shop_amount" label="参加商家数量" width="150" align="center"></el-table-column>
        <el-table-column prop="status_value" align="center" label="活动状态" width="150"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <!-- <el-link type="primary" @click="toInfo(row)">{{row.status == 1?'查看':'编辑'}}</el-link>&nbsp;| -->
            <el-link type="primary" @click="toInfo(row)">查看</el-link>&nbsp;|
            <el-link type="danger" @click="delOne(row)">{{row.status_value == '进行中'?'取消':'删除'}}</el-link>&nbsp;|
            <el-link type="primary" @click="toSetSort(row)">设置商品排序</el-link>
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
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      listLoading: false,
      goods_name: "", //商品名称
      shop_name: "", //店铺名称
      tableData: [],
      total: "", //总数据
      rowIds: [], //批量选择
      nid: "", //批量选择ID

      //页面参数
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 20, //每页数据
        activity_title: "",
        activity_time: "",
        status: "" //活动状态(1进行中，2待开始，3已取消,4已结束)
      },
      time: "",
      //状态
      selectlist: [
        {
          value: 1,
          label: "进行中"
        },
        {
          value: 2,
          label: "待开始"
        },
        {
          value: 3,
          label: "已取消"
        },
        {
          value: 4,
          label: "已结束"
        }
      ]
    };
  },
  created() {
    this.gettable(1);
  },
  watch: {
    // gettime() {
    //   console.log(this.gettime);
    // }
  },
  methods: {
    /**公共post */
    post(url, data, tip = "确定操作吗?") {
      return new Promise((resolve, reject) => {
        this.$confirm(tip, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.listLoading = true;
          this.$axios({
            method: "POST",
            url,
            data
          }).then(res => {
            if (res.data.code == 200) {
              resolve(res);
              this.$message.success(res.data.msg);
              this.gettable().then(() => {
                this.listLoading = false;
              });
            } else {
              this.listLoading = false;
              this.$message(res.data.msg);
            }
          });
        });
      });
    },
    //列表
    gettable(page) {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Seckill/seckillList",
        params: this.listQuery
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.listLoading = false;
          this.total = res.data.data.total;
          this.tableData = res.data.data.data;
        } else {
          alert(res.msg);
        }
      });
    },
    //去添加
    toEdit() {
      this.$router.push({ path: "./limitEdit" });
    },
    /**去详情页 */
    // toInfo(row = { status: 0 }) {
    toInfo(rows) {
      // let titletxt = row.status ? "编辑" : "新增" //放在头部
      // this.$router.push({ name: row.status == 1 ? 'limitInfo' : 'limitEdit', params: { row, titletxt } })//1进行中只能查看，其余可以编辑
      this.$router.push({ path: "./limitInfo", query: { row: rows } }); //1进行中只能查看，其余可以编辑
    },
    /**删除或取消活动 */
    delOne(row) {
      let url;
      if (row.status_value == "进行中") url = "/backend/Seckill/seckillCancel";
      else url = "/backend/Seckill/seckillDel";
      this.post(url, { seckill_id: row.id });
    },
    /**去排序页面 */
    toSetSort(row) {
      this.$router.push({ name: "limitSetSort", params: { row } });
      // sessionStorage.setItem('limitID', content)
    },
    //重置
    resetForm() {
      this.listQuery = {
        page: 1, //页码
        size: 20, //每页数据
        activity_title: "",
        activity_time: "",
        status: "" //活动状态(1进行中，2待开始，3已取消,4已结束)
      };
      this.gettable(1);
    },
    //搜索
    getsearch() {
      this.gettable(1);
    },
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.gettable(val);
    },
    //批量选择
    handleSelectionChange(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
      });
      this.nid = this.rowIds.join(","); // 把数组转换成字符串
      // return this.nid;
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.listQuery.activity_time = startTime + "-" + endTime;
      console.log(this.listQuery.activity_time);
    }
  }
};
</script>
<style lang="scss">
@import "../../styles/duo.scss";
</style>
<style lang="scss" scoped>
.commercial-wapper {
  h1 {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
  }
  .commercial-bth {
    display: flex;
    margin: 30px 0;
  }

  .admin-input {
    height: 60px;
    display: flex;
    .inputdiv {
      margin-right: 90px;
      .span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: rgba(22, 23, 55, 1);
        display: inline-block;
      }
      .input-control {
        width: 248px;
        height: 34px;
        padding: 0 20px;
        border-radius: 2px;
      }
    }
  }
  .admin-input2 {
    height: 60px;
    display: flex;
    .inputdiv {
      margin-right: 90px;
      .span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: rgba(22, 23, 55, 1);
        display: inline-block;
      }
      .input-control {
        width: 248px;
        height: 34px;
        padding: 0 20px;
        border-radius: 2px;
      }
    }
  }
  // .vip-table {
  //   position: relative;
  //   top: 60px;
  // }
}
</style>

<style lang="scss">
.commercial-wapper {
  .search {
    .el-form {
      justify-content: flex-start;
      display: flex;
      flex-wrap: wrap;
      width: 1500px;
    }
    .el-form-item {
      display: flex;
      align-items: center;
      margin-right: 35px;
      .el-form-item__label {
        // width: 100px;
        text-align: left;
      }
      .el-input {
        width: 180px;
      }
      .el-date-editor {
        width: 380px;
      }
    }
  }
}
</style>
