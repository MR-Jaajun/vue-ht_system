<!--
 * @Description: 
 * @LastEditors: jun
 * @LastEditTime: 2019-11-26 15:27:42
 -->
<template>
  <div class="commercial-wapper">
    <!-- <h1>用户管理/商户列表</h1> -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>商户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="commercial-bth">
      <el-button type="primary" icon="el-icon-view" @click="open(nid,1,'您将启用全部商户')">启用</el-button>
      <el-button type icon="el-icon-circle-close" @click="open(nid,2,'您将禁用全部骑手商户')">禁用</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="toAdd">新增</el-button>
    </div>

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
        <span class="span" style="margin-right: 15px;">账号状态</span>
        <el-select v-model="c_freeze" clearable placeholder="请选择状态">
          <el-option label="全部" value="0"></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="冻结" value="2"></el-option>
        </el-select>
      </div>
      <div class="inputdiv">
        <span class="span" style="margin-right: 15px;">申请时间</span>
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
        <span class="span">账号</span>
        <el-input v-model="mobile" class="input-control" placeholder="请输入内容" clearable></el-input>
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
        <span class="span" style="margin-right: 15px;">经营品类</span>
        <el-cascader
          :placeholder="shop_category"
          :props="{value:'id',label:'category_title',children:'children'}"
          :options="manageList"
          v-model="c_title"
          @change="handleChange"
          clearable
        ></el-cascader>
      </div>

      <div class="inputdiv">
        <el-button type="primary" @click="getsearch">搜索</el-button>
        <el-button style="margin-left:10px;" type @click="clear">重置</el-button>
      </div>
    </div>
    <section class="vip-table">
      <el-table
        v-loading="listLoading"
        :data="tableData"
        style="width: fit-content"
        @selection-change="handleSelectionChange"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column type="selection" align="center" width="40"></el-table-column>
        <el-table-column prop="id" label="商家ID" align="center" width="70"></el-table-column>
        <el-table-column prop="contacts" label=" 联系人" align="center" width="100"></el-table-column>
        <el-table-column prop="user_mobile" label="账号" align="center" width="100"></el-table-column>custom_pid
        <el-table-column prop="custom_pid" label="推荐人ID" align="center" width="75">
          <template slot-scope="{row}">
            <span>{{row.custom_pid?row.custom_pid:""}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="shop_title" label="商家名称" align="center" width="160"></el-table-column>
        <el-table-column prop="shop_category" label="商家分类" align="center" width="130"></el-table-column>
        <!-- <el-table-column prop="shop_category" label="开通模块" align="center" width="100">
          <template slot-scope="{row}">
            <span></span>
          </template>
        </el-table-column>-->
        <el-table-column prop="address" label="所在地区" align="center" width="180"></el-table-column>
        <el-table-column prop="create_time" sortable align="center" label="申请时间" width="170">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status_title" label="审核状态" width="80" align="center"></el-table-column>
        <el-table-column prop="shop_audit_time" sortable label="审核时间" width="175" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.update_time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="营业状态" width="75">
          <template slot-scope="{row}">
            <span>{{row.aaa?row.shop_close:'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="freeze_title" align="center" label="账号状态" width="75">
          <template slot-scope="{row}">
            <span :style="{color:row.freeze_title=='已禁用'?'red':''}">{{row.freeze_title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="190">
          <template slot-scope="{row}">
            <el-link type="primary" size="small" @click="todetail(row.id,0)">查看</el-link>
            <el-link
              type="danger"
              v-show="row.status_title=='驳回申请'?false:true"
              size="small"
              @click="todetail(row.id,1)"
            >编辑</el-link>
            <el-link
              size="mini"
              v-show="row.freeze_title=='已启用'"
              type="primary"
              @click="open(row.id,4,'您将禁用该商户')"
            >禁用</el-link>
            <el-link
              size="mini"
              v-show="row.freeze_title=='已禁用'"
              type="primary"
              @click="open(row.id,3,'您将启用该商户')"
            >启用</el-link>
            <!-- <el-link
              size="mini"
              v-show="row.status_title=='待审核'"
              type="primary"
              @click="handCode(row.id)"
            >通过</el-link>
            <el-link
              size="mini"
              v-show="row.status_title=='待审核'"
              type="danger"
              @click="handCode(row.id)"
            >驳回</el-link>-->
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
          :current-page="page*1"
        ></el-pagination>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listLoading: false,
      mobile: "", //账号
      name: "", //联系人
      shopname: "", //商家名称
      value: "",
      value_time: "", //注册时间
      shopid: "", //商家ID
      actStatusList: [
        { value: 1, label: "通过审核" },
        { value: 2, label: "待审核" },
        { value: -1, label: "驳回申请" }
      ],
      status: "", //状态
      tableData: [],
      total: "", //总数据
      rowIds: [], //批量选择
      nid: "", //批量选择ID
      gettime: "",
      page: 1,
      // xid:'',
      category_id: "",
      c_freeze: "",
      c_title: "",
      shop_category: "请选择",
      manageList: []
    };
  },
  created() {
    this.page = sessionStorage.getItem("pages") || 1;
    this.gettable(this.page);
    //获取经营品类
    this.getManageList(1);
    // this.handleCurrentChange(this.page);
  },
  watch: {},
  methods: {
    //获取经营品类
    getManageList(page) {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/shopCategoryList",
        params: {
          category_title: "",
          page: page,
          size: 500
        }
      }).then(res => {
        console.log(res.data.data, "ssssss");
        let obj = { id: "0", category_title: "全部" };
        res.data.data.data.unshift(obj);
        this.manageList = res.data.data.data;
      });
    },
    handleChange(value) {
      console.log(value);
      if (value[value.length - 1] == 0) {
        this.category_id = "";
      } else {
        this.category_id = value[value.length - 1];
      }
    },
    clear() {
      this.shopid = "";
      this.name = "";
      this.value_time = "";
      this.shopname = "";
      this.mobile = "";
      this.status = "";
      this.gettime = "";
      this.c_freeze = "";
      this.category_id = "";
      this.c_title = "";
      this.shop_category = "请选择";
    },
    //跳转到详情
    todetail(id, ischange) {
      let arr = { shopid: id, ischange: ischange };
      sessionStorage.setItem("aaa", JSON.stringify(arr));
      sessionStorage.setItem("pages", this.page);
      this.$router.push({
        name: "comdetails",
        params: { shopid: id, change: ischange }
      });
    },
    //跳转到新增
    toAdd() {
      this.$router.push({ name: "compile" });
    },
    //时间转换
    change(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.gettime = startTime + "-" + endTime;
    },
    //列表
    gettable(page) {
      this.page = page;
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/merchantList",
        params: {
          id: this.shopid,
          contacts: this.name,
          mobile: this.mobile,
          shop_title: this.shopname,
          register_time: this.gettime,
          category_id: this.category_id,
          freeze: this.c_freeze,
          status: this.status,
          page: page,
          size: 10
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.listLoading = false;
          // let datas = res.data.data.data;
          let arr = res.data.data.data;
          //判断是否未外卖模块
          arr.forEach(item => {
            item.aaa = false;
            item.shop_audit_module.forEach(item2 => {
              if (item2 == 1) {
                item.aaa = true;
              }
            });
          });
          // console.log(res.data.data, "1");
          this.total = res.data.data.total;
          this.tableData = arr;
        } else {
          alert(res.msg);
        }
      });
    },
    //搜索
    getsearch() {
      this.gettable(1);
    },
    //分页
    handleCurrentChange(val) {
      // this.clear();
      console.log(`当前页: ${val}`);
      this.gettable(val);
      // this.page = val;
    },
    // godetailsdata(row) {
    //   let rowid = row.id;
    //   this.$router.push({
    //     name: `comdetails`,
    //     params: {
    //       shop_id: rowid
    //     }
    //   });
    //批量选择
    handleSelectionChange(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
        this.nid = this.rowIds.join(","); // 把数组转换成字符串
      });
      console.log(this.nid);
      // return this.nid;
    },
    //单个禁用
    handleStatus(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/merchantFreeze",
        data: {
          shop_ids: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.gettable(1);
          this.nid = "";
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //单选启用
    handCode(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Merchant/merchantEnable",
        data: {
          shop_ids: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.gettable(1);
          this.nid = "";
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //全选启用
    handallCode(nid) {
      if (nid) {
        this.handCode(nid);
      } else {
        this.$message.error("请选择需要启用的骑手");
      }
    },
    //全选禁用
    handallStatus(nid) {
      if (nid) {
        this.handleStatus(nid);
      } else {
        this.$message.error("请选择需要禁用的骑手");
      }
    },
    open(id, type, txt) {
      this.$confirm(txt + ",是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (type == 1) {
          this.handallCode(id);
        }
        if (type == 2) {
          this.handallStatus(id);
        }
        if (type == 3) {
          this.handCode(id);
        }
        if (type == 4) {
          this.handleStatus(id);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.commercial-wapper {
  .el-link {
    margin: 0 5px;
  }
  h1 {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
  }
  .commercial-bth {
    display: flex;
    align-items: center;
    margin: 24px 0 30px 0;
    // position: absolute;
    // top: -30px;
  }

  .admin-input {
    height: 60px;
    display: flex;
    .inputdiv {
      margin-right: 40px;
      display: flex;
      align-items: center;
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
    // height: 60px;
    width: 1500px;
    display: flex;
    flex-wrap: wrap;
    .inputdiv {
      margin-right: 40px;
      margin-bottom: 15px;
      display: flex;
      // flex-wrap: wrap;
      align-items: center;
      .span {
        // width: fit-content;
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
    // position: relative;
    // top: 60px;
    margin-top: 30px;
  }
}
</style>

