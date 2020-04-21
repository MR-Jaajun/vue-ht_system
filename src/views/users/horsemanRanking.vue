

<template>
  <div class="ranking">
    <section>
      <el-breadcrumb separator="/">
         <el-breadcrumb-item :to="{ path: './horseman' }">骑手列表</el-breadcrumb-item>
        <el-breadcrumb-item>骑手排行榜</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <h1>骑手排行榜</h1>
    <div class="admin-input">
      <div class="inputdiv">
        <span class="span">骑手ID</span>
        <el-input v-model="userid" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">手机号</span>
        <el-input v-model="mobile" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">月份</span>
        <el-date-picker
          v-model="time_value"
          type="month"
          placeholder="选择月"
          format="yyyy 年 MM 月"
          @change="change"
          value-format="yyyy-MM"
        ></el-date-picker>
      </div>
    </div>
    <div class="admin-input2">
      <div class="inputdiv">
        <span class="span">骑手类型</span>
        <el-select v-model="vip" class="input-control" clearable placeholder="请选择">
          <el-option
            v-for="(item ,index) in vipList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
      <div class="inputdiv">
        <span class="span">账号状态</span>
        <el-select class="input-control" v-model="status" clearable placeholder="请选择状态">
          <el-option
            v-for="(item ,index)  in StatusList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="admin-input2">
      <div class="inputdiv">
        <span class="span">所在地区</span>
        <el-select v-model="sheng" @change="choseProvince" clearable placeholder="省级地区">
          <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="shi" @change="choseCity" clearable placeholder="市级地区">
          <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="qu" @change="choseBlock" clearable placeholder="区级地区">
          <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="inputdiv">
        <el-button type="primary" @click="gettable()">搜索</el-button>
        <el-button type @click="clear">重置</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <section class="vip-table" style="width:1556px;">
      <el-table
        v-loading="loading"
        border="true"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
        <el-table-column prop="rider_id" label="骑手ID" align="center" width="100"></el-table-column>
        <el-table-column prop="contact_information" label="手机号" align="center" width="100"></el-table-column>
        <el-table-column prop="contacts" label="姓名" align="center" width="100"></el-table-column>
        <el-table-column prop="position_type" label="骑手类型" align="center" width="100"></el-table-column>
        <el-table-column prop="site_title" label="工作地点" align="center" width="100"></el-table-column>
        <el-table-column prop="delivery_order_amount" label="单量" sortable align="center" width="100"></el-table-column>
        <el-table-column prop="user_satisfaction" label="顾客满意率" align="center" width="100"></el-table-column>
        <el-table-column prop="delivery_average_time" align="center" label="平均配送时长" width="100"></el-table-column>
        <el-table-column prop="update_time" align="center" sortable label="最近登录时间" width="180"></el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="账号状态"
          width="100"
          :style="{color:status==禁用?'red':''}"
        ></el-table-column>
      </el-table>
      <!-- page-size每页显示条目个数-->
      <div class="pagination-container" style="margin-top:30px;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-size="listQuery.size"
          layout="total, sizes, prev, pager, next, jumper"
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
      loading: false,
      tableData: [],
      total: "",
      userid: "", //用户id
      mobile: "", //手机号
      time_value: "", //显示时间
      vip: "",
      vipList: [{ value: "1", label: "启用" }, { value: "0", label: "禁用" }],
      status: "",
      StatusList: [
        { value: "1", label: "专职" },
        { value: "2", label: "众包" }
      ],
      listQuery: {
        page: 1,
        size: 10
      },
      /****** 加载地点数据********/
      mapJson: "./json/map.json",
      province: "",
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: [],
      block: ""
    };
  },
  created() {
    this.getCityData();
    this.gettable();
  },
  methods: {
    change(val) {
      console.log(this.time_value, "显示时间");
    },
    //重置
    clear() {
      this.userid = "";
      this.mobile = "";
      this.vip = "";
      this.time_value = "";
      this.status = "";
      this.gettime = "";
      this.sheng = "";
      this.shi = "";
      this.qu = "";
    },

    // 搜索获取列表
    gettable() {
      this.loading = true;
      this.$post("/backend/Rider/riderRank", {
        rider_id: this.userid,
        log_time: this.time_value,
        position_type: this.vip,
        mobile: this.mobile,
        status: this.status,
        province: this.sheng,
        city: this.shi,
        area: this.qu,
        size: this.listQuery.size,
        page: this.listQuery.page
      }).then(res => {
        if (res.data.code == 200) {
          this.loading = false;
          this.tableData = [];
          this.total = res.data.data.total;
          this.tableData = res.data.data.data;
          console.log(res.data.data.data, "1");
        }
      });
    },
    //页码操作
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.gettable();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.gettable();
      this.listQuery.page = 1;
    },

    /**********************加载地点数据*******************************************/
    // 加载china地点数据，三级
    getCityData: function() {
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
    choseProvince: function(e) {
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shi1 = this.province[index2].children;
          this.shi = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.qu = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
          this.sheng = this.province[index2].value;
          console.log("选省", this.sheng);
          console.log("选省", this.E);
        }
      }
    },
    // 选市
    choseCity: function(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shi = this.city[index3].value;
          console.log("选市", this.shi);
          console.log("选市", this.E);
        }
      }
      if (!this.shi) {
        this.qu = "";
      }
    },
    // 选区
    choseBlock: function(e) {
      this.E = e;
      for (var i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.qu = this.qu1[i].value;
          console.log("选区", this.qu, this.sheng + this.shi + this.qu);
        }
      }
      console.log("选区22", this.E);
    }
    /******************************************************* */
  }
};
</script>
<style lang="scss" scoped>
.ranking {
  h1 {
    margin-top: 10px;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  .admin-bth {
    display: flex;
    align-items: center;
    z-index: 100;
    margin-top: 30px;
  }
  .admin-input {
    width: 1450px;
    height: 50px;
    display: flex;
    margin: 20px 0;
    .inputdiv {
      height: 50px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-right: 90px;
      .span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: rgba(22, 23, 55, 1);
        display: inline-block;
        margin-right: 20px;
      }
      .input-control {
        width: 248px;
        height: 34px;
        border-radius: 2px;
      }
    }
  }
  .admin-input2 {
    width: 1450px;
    display: flex;
    align-items: center;
    height: 50px;
    margin: 20px 0;
    .inputdiv {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 50px;
      margin-right: 60px;
      .span {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: rgba(22, 23, 55, 1);
        display: inline-block;
        margin-right: 15px;
      }
      .input-control {
        width: 248px;
        height: 34px;
        border-radius: 2px;
      }
      .el-select {
        display: inline-block;
        position: relative;
        margin-right: 10px;
      }
    }
  }
}
</style>
