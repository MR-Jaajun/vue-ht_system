<!--
 * @Description: 
 * @Author: jun
 * @Date: 2019-08-21 19:20:13
 * @LastEditors: jun
 * @LastEditTime: 2019-10-09 19:01:16
 -->
<template>
  <div id="sellList">
    <!-- <div class="discount">优惠专区/活动主题列表/添加商家</div> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './acti' }">优惠专区</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'./acti'}">活动主题列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商家</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="act_title">添加商家</div>
    <div class="addbtn">
      <el-button
        type="primary"
        size="medium"
        icon="el-icon-plus"
        class="creat_btn"
        @click="ToaddActivitys"
      >创建活动</el-button>
    </div>

    <!-- 搜索表单 -->
    <div id="form_menu">
      <!-- 商家名称 -->
      <div class="form_item">
        <span>商家名称</span>
        <el-input v-model="title" placeholder="请输入商家名称" clearable style="width:215px;"></el-input>
      </div>
      <!-- 手机号 -->
      <div class="form_item">
        <span style="margin-right:0">手机号</span>
        <el-input v-model="tel" placeholder="请输入手机号" clearable style="width:215px;"></el-input>
      </div>
      <!-- 最近登录时间 -->
      <div class="form_item">
        <span>最近登录时间</span>
        <el-date-picker
          value-format="timestamp"
          v-model="time_val"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getTime"
        ></el-date-picker>
        <!-- <el-date-picker v-model="lasttime" @change="getTime" type="datetime" placeholder="选择日期时间"></el-date-picker> -->
      </div>

      <!-- 搜索 重置 -->
      <div class="form_item">
        <el-button type="primary" style="background-color:#4371E8;width:75px;" @click="getsearch">搜索</el-button>
        <el-button plain style="margin-left:30px;width:75px;" @click="clear">重置</el-button>
      </div>
    </div>

    <!-- 活动列表 -->
    <div id="actList">
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width:100%;"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800', height:'63px' }"
      >
        <!-- <el-table-column type="selection" width="50"></el-table-column> -->
        <el-table-column align="center" prop="id" label="商家ID" width="120"></el-table-column>
        <el-table-column align="center" prop="contacts" label="联系人" width="120"></el-table-column>
        <el-table-column
          align="center"
          prop="contact_information"
          label="手机号"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" prop="shop_title" label="商家名称" width="200"></el-table-column>
        <el-table-column align="center" prop="shop_category" label="商家分类" width="100"></el-table-column>
        <el-table-column align="center" prop="addRess" label="所在地区" width="280"></el-table-column>
        <el-table-column align="center" prop="last_login_time" label="最近登录时间" width="180"></el-table-column>
        <el-table-column align="center" prop="shop_close" label="营业状态" width="100"></el-table-column>
        <el-table-column align="center" prop="activity_status" label="是否已参加此活动" width="150"></el-table-column>
        <el-table-column align="center" prop="operation" label="操作">
          <template slot-scope="{row}">
            <div>
              <el-link
                type="primary"
                class="el_link"
                v-show="row.activity_status=='否'"
                @click="open2(row.id)"
              >设为推荐</el-link>
              <el-link
                type="danger"
                class="el_link"
                v-show="row.activity_status=='是'"
                @click="open(row.id)"
              >取消推荐</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="block" style="height:30px;width:700px;">
      <!-- <span class="demonstration">完整功能</span> -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 15, 20]"
        :page-size="10"
        layout="total,sizes,prev,pager,next,jumper"
        :total="total*1"
      ></el-pagination>
    </div>
    <!-- 返回按钮 -->
    <div id="backlist" @click="backList">
      <el-button plain>返回活动主题列表</el-button>
    </div>
  </div>
</template>

<script>
import { log } from "util";
export default {
  data() {
    return {
      listLoading: false,
      total: "",
      sizes: 10,
      act_id: "", //接收ID
      tel: "", //手机号
      business: "", //营业状态,
      time_val: "",
      create_time: "", //最近登录时间
      actStatus: "", //活动状态
      title: "", //商家名称
      //参加活动名称
      // actNameList: ["是", "否"],
      //营业状态
      // actStatusList: ["打烊中", "营业中"],
      //商家列表
      tableData: [],
      //选中后的数据添加
      multipleSelection: []
    };
  },
  created() {
    // window.location.reload();
    this.act_id = this.$route.params.actID;
    this.getShopList(1);
  },
  // updated(){
  //  this.getShopList();
  // },
  methods: {
    // 商家列表渲染
    getShopList(page) {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Activity/activityShopList",
        params: {
          shop_title: this.title,
          mobile: this.tel,
          last_login_time: this.create_time,
          activity_id: this.act_id,
          page: page,
          size: this.sizes
        }
      }).then(res => {
        this.listLoading = false;
        // console.log(res)
        this.tableData = [];
        this.total = res.data.data.total;
        // this.tableData = res.data.data.data;
        let arr = res.data.data.data;
        arr.map(item => {
          item.addRess = item.province + item.city + item.area;
          this.tableData.push(item);
        });
        // console.log(res.data.data.data);
      });
    },
    //点击搜索
    getsearch() {
      // this.clear();
      this.getShopList(1);
    },
    clear() {
      this.title = "";
      this.tel = "";
      this.create_time = "";
      this.time_val = "";
    },
    //设为推荐
    recommend(shopid) {
      this.$axios({
        method: "POST",
        url: "/backend/Activity/joinActivity",
        data: {
          shop_id: shopid,
          activity_id: this.act_id
        }
      }).then(res => {
        // console.log(res.data.status);
        if (res.data.status == 1) {
          // this.tableData = [];
          // this.tableData = res.data.data.data;
          this.getShopList(1);
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    //取消推荐
    cancel(shopid) {
      this.$axios({
        method: "POST",
        url: "/backend/Activity/cancelShopActivity",
        data: {
          shop_id: shopid,
          activity_id: this.act_id
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          // this.tableData = [];
          this.tableData = res.data.data.data;
          this.getShopList(1);
        }else{
          this.$message.error(res.data.msg);
        }
      });
    },
    open(shopid) {
      this.$confirm("是否取消推荐, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.cancel(shopid);
      });
    },
    open2(shopid) {
      this.$confirm("是否设为推荐, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.recommend(shopid);
      });
    },
    //返回活动主题列表
    backList() {
      this.$router.push({ path: "./acti" });
    },
    //创建活动
    ToaddActivitys() {
      this.$router.push({ path: "./addact" });
    },
    //时间转换
    getTime(val) {
      if (val) {
        let startTime = val[0] / 1000;
        let endTime = val[1] / 1000;
        this.create_time = startTime + "-" + endTime;
      }
      // this.lasttime = val / 1000;
    },

    // @size-change="handleSizeChange"
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    // },
    handleCurrentChange(val) {
      // this.clear();
      this.tableData = [];
      console.log(`当前页: ${val}`);
      this.getShopList(val);
    },
    handleSizeChange(val) {
      this.sizes = val;
      // this.clear();
      console.log(`每页 ${val} 条`);
      this.getShopList(1);
    }
  },
  watch: {}
};
</script>


<style lang="scss" scoped>
html.body {
  font-family: Microsoft YaHei;
}
.addbtn {
  //   width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 80px;
}
.act_title {
  margin-top: 15px;
  font-size: 22px;
  color: rgba(51, 51, 51, 1);
}
//创建活动按钮
.creat_btn {
  width: 123px !important;
  // margin-top: 10px;
  background: rgba(67, 113, 232, 1);
}
//搜索的内容
#form_menu {
  margin-top: 13px;
  height: 80px;
  width: 1630px;
}
.form_item {
  // width: 300px;
  float: left;
  margin: 0 92px 15px 0;
  display: flex;
  justify-content: space-between;
  span {
    text-align: left;
    width: 84px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    margin-right: 20px;
    color: rgba(51, 51, 51, 1);
  }
}

//列表
#actList {
  width: 1620px;
  max-height: 663px;
  border: 1px solid rgba(204, 204, 204, 1);
  margin-bottom: 34px;
  overflow-y: hidden;
  div .el_link:nth-last-child(1) {
    border-right: 0;
  }
  .el_link {
    // border-right: 1px solid;
    height: 16px;
    // padding: 0 8px;
  }
}
.el-pagination {
  height: 30px;
}

#backlist {
  height: 40px;
  margin-top: 40px;
  position: relative;
  .el-button {
    position: absolute;
    top: 0;
  }
}
</style>
