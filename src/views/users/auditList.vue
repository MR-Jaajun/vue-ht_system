<!--
 * @Description: 店铺模块审核列表
 * @Author: jun
 * @Date: 2019-10-21 11:36:38
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-05 15:22:21
 -->
<template>
  <div class="auditList-wapper">
    <!-- <h1>用户管理/店铺模块审核列表</h1> -->
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>店铺模块审核列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="admin-input">
      <div class="inputdiv">
        <span class="span">商家ID</span>
        <el-input v-model="shopid" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">联系人</span>
        <el-input v-model="name" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="inputdiv">
        <span class="span" style="margin-right: 15px;">注册时间</span>
        <el-date-picker
          value-format="timestamp"
          style="margin-left:15px"
          v-model="value_time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="change"
        ></el-date-picker>
      </div>
    </div>
    <div class="admin-input2">
      <div class="inputdiv">
        <span class="span">商家名称</span>
        <el-input v-model="shopname" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="inputdiv">
        <span class="span" style="margin-right: 15px;">审核状态</span>
        <el-select v-model="status" clearable placeholder="请选择状态">
          <el-option
            v-for="item in actStatusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="inputdiv">
        <span class="span">账号</span>
        <el-input v-model="mobile" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>

      <div class="inputdiv">
        <el-button type="primary" @click="getsearch">搜索</el-button>
        <el-button type @click="clear">重置</el-button>
      </div>
    </div>
    <section class="vip-table">
      <el-table
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
        <el-table-column prop="shop_id" label="商家ID" align="center" width="80"></el-table-column>
        <el-table-column prop="shop_contacts" label=" 联系人" align="center" width="100"></el-table-column>
        <el-table-column prop="shop_contact_information" label="账号" align="center" width="100"></el-table-column>
        <el-table-column prop="shop_title" label="商家名称" align="center" width="170"></el-table-column>
        <el-table-column prop="shop_category_title" label="商家分类" align="center" width="100"></el-table-column>
        <el-table-column prop="address" label="所在地区" align="center" width="200">
          <template slot-scope="{row}">
            <span>{{row.shop_bg_province }} {{row.shop_bg_city}} {{row.shop_bg_area}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" align="center" label="申请模块" width="80">
          <template slot-scope="{row}">
            <span v-show="row.type == 1">外卖</span>
            <span v-show="row.type == 2">商城</span>
            <span v-show="row.type == 3">团购</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" sortable align="center" label="申请时间" width="200"></el-table-column>
        <el-table-column prop="status" label="审核状态" width="80" align="center">
          <template slot-scope="{row}">
            <!-- <span v-show="row.status == 0">待完善资料</span> -->
            <span v-show="row.status == 1">已开通</span>
            <span v-show="row.status == 2">审核中</span>
            <span v-show="row.status == -1">被驳回</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" sortable label="审核时间" width="200" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <el-link type="primary" @click="todetail(row.shop_id,0,row.shop_module_id)">查看</el-link>
            <el-link v-show="row.status!=-1" type="primary" @click="todetail(row.shop_id,1,row.shop_module_id)">编辑</el-link>
            <el-link
              v-show="row.status==2"
              type="primary"
              @click="open(row.shop_module_id,1,'同意')"
            >通过</el-link>
            <el-link v-show="row.status==2" type="danger" @click="open2(row.shop_module_id,2)">驳回</el-link>
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
export default {
  data() {
    return {
      tableData: [],
      loading: false,
      page: "",
      total: "",
      shopid: "",
      name: "",
      mobile: "",
      shopname: "",
      status: "",
      actStatusList: [
        { value: 1, label: "已开通" },
        { value: 2, label: "审核中" },
        { value: -1, label: "被驳回" }
      ],
      value_time: "",
      gettime: ""
    };
  },
  created() {
    this.gettable(1);
  },
  methods: {
    //时间转换
    change(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.gettime = startTime + "-" + endTime;
    },
    //店铺模块审核列表 /backend/Merchant/shopModuleList
    gettable(page) {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/shopModuleList",
        params: {
          search_shop_id: this.shopid,
          search_contacts: this.name,
          search_contact_information: this.mobile,
          search_shop_title: this.shopname,
          search_date: this.gettime,
          search_status: this.status,
          page: page,
          size: 10
        }
      }).then(res => {
        // console.log(res.data.data.current_page);
        if (res.data.status == 1) {
          this.listLoading = false;
          console.log(res.data.data, "1");
          this.total = res.data.data.total;
          this.tableData = res.data.data.data;
        } else {
          alert(res.data.msg);
        }
      });
    },
    getsearch() {
      this.gettable(1);
    },
    //分页
    handleCurrentChange(val) {
      // this.clear();
      this.page = val;
      console.log(`当前页: ${val}`);
      this.gettable(val);
    },
    clear() {
      this.shopid = "";
      this.name = "";
      this.value_time = "";
      this.shopname = "";
      this.mobile = "";
      this.status = "";
      this.gettime = "";
    },
    //跳转到详情
    todetail(id, ischange,mid) {
      let arr = { shopid: id, ischange: ischange ,mids:mid};
      sessionStorage.setItem("obj", JSON.stringify(arr));
    //   sessionStorage.setItem("shopid",id);
    //   sessionStorage.setItem("ischange",ischange);
      // sessionStorage.setItem("shopid",id)
      this.$router.push({
        name: "auditDetail",
        params: { shopid: id, change: ischange }
      });
    },
    //店铺模块申请审核 /backend/Merchant/shopModuleAudit
    shopModuleAudit(id, status, remark) {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/shopModuleAudit",
        data: {
          shop_module_id: id,
          audit_status: status,
          audit_remark: remark
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.gettable(res.data.current_page);
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //通过的弹窗
    open(id, status, remark) {
      this.$confirm("您是否同意, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.shopModuleAudit(id, status, remark);
      });
    },
    //驳回的弹窗
    open2(id, status) {
      this.$prompt("请输入驳回理由", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "邮箱格式不正确"
      }).then(({ value }) => {
        if (value) {
          let str = value.trim();
          this.shopModuleAudit(id, status, str);
        } else {
          this.$message.error("驳回失败,请输入驳回内容");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.auditList-wapper {
  .el-link {
    margin: 0 8px;
  }
  h1 {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 24px;
  }
  .admin-input {
    height: 60px;
    display: flex;
    .inputdiv {
      display: flex;
      align-items: center;
      margin-right: 90px;
      .span {
        margin-right: 20px;
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
        // padding: 0 20px;
        border-radius: 2px;
      }
    }
  }
  .admin-input2 {
    height: 60px;
    display: flex;
    .inputdiv {
      display: flex;
      align-items: center;
      margin-right: 90px;
      .span {
        margin-right: 20px;
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
        // padding: 0 20px;
        border-radius: 2px;
      }
    }
  }
  .vip-table {
    //   position: relative;
    //   top: 60px;
    margin-top: 35px;
  }
}
</style>