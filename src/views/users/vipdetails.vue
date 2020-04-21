<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2019-10-15 18:25:34
 -->
<template>
  <div class="vipdetails-wapper">
    <h1>用户管理/会员列表/查看会员详情</h1>
    <h2>查看会员详情</h2>
    <div class="msgdiv">
      <div class="msgbox">
        <p class="p-title">账户信息</p>
        <li class="p-li">
          <span>启用状态</span>
          <p style="color:red" v-show="user_status==0">禁 用</p>
          <p v-show="user_status==1">启 用</p>
        </li>
        <li class="p-li">
          <span>注册时间</span>
          <p>{{create_time}}</p>
        </li>
        <li class="p-li">
          <span>最近登录时间</span>
          <p>{{update_time}}</p>
        </li>
        <li class="p-li">
          <span>累计消费</span>
          <p>{{consumption_amount}}</p>
        </li>
        <li class="p-li">
          <span>累计获得佣金</span>
          <p>{{commission_amount}}</p>
        </li>
        <li class="p-li">
          <span>账户余额</span>
          <p>{{user_info_data.balance_amount}}</p>
        </li>
        <li class="p-li">
          <span>小哥豆</span>
          <p>{{user_info_data.bean_amount}}</p>
        </li>
        <li class="p-li">
          <span>信用值</span>
          <p>{{user_info_data.credit_score}}</p>
        </li>
      </div>
      <div class="msgbox">
        <p class="p-title">基本信息</p>
        <li class="p-li">
          <span>用户ID</span>
          <p>{{user_info_data.id}}</p>
        </li>
        <li class="p-li">
          <span>手机号</span>
          <p>{{mobile}}</p>
        </li>
        <li class="p-li">
          <span>邀请码</span>
          <p>{{user_info_data.invite_code}}</p>
        </li>
        <li class="p-li">
          <span>昵称</span>
          <p>{{user_info_data.nick_name}}</p>
        </li>
        <li class="p-li">
          <span>会员等级</span>
          <p>{{user_info_data.vip_level_title}}</p>
        </li>
        <li class="li_img">
          <span class="li_span1">头像</span>
          <span class="li_span2">
            <img :src="user_info_data.avatar" alt="用户头像" />
          </span>
        </li>
        <li class="p-li">
          <span>性别</span>
          <p>{{user_info_data.gender_title}}</p>
        </li>
        <li class="p-li">
          <span>地区</span>
          <p>{{user_info_data.province}}{{user_info_data.city}}{{user_info_data.district}}</p>
        </li>
      </div>
      <!-- <div class="msgbox">
        <p class="p-title">我的团队列表</p>
        <li class="p-li">
          <span>一级团队人数</span>
          <p>已启用</p>
        </li>
        <li class="p-li">
          <span>二级团队人数</span>
          <p>2019-12-23 19:45</p>
        </li>
        <li class="p-li">
          <span>推荐商家入驻</span>
          <p>2019-12-23 19:45</p>
        </li>
      </div>-->
    </div>
    <div class="sxmsg">
      <div>
        <h3>上级信息</h3>
        <el-table :data="superior" border style="width: 1554px ">
          <el-table-column align="center" prop="id" label="用户ID" width="147"></el-table-column>
          <el-table-column align="center" prop="mobile" label="手机号" width="147"></el-table-column>
          <el-table-column align="center" prop="gender_title" label="性别" width="100"></el-table-column>
          <el-table-column align="center" prop="invite_code" label="邀请码" width="100"></el-table-column>
          <el-table-column align="center" prop="vip_level_title" label="会员等级" width="147"></el-table-column>
          <el-table-column align="center" prop="zhixi_amount" label="直推" width="120"></el-table-column>
          <el-table-column align="center" prop="interval_amount" label="间推" width="120"></el-table-column>
          <el-table-column align="center" prop="shop_amount" label="推荐商家" width="120"></el-table-column>
          <el-table-column align="center" prop="create_time" label="注册时间" width="150"></el-table-column>
          <el-table-column align="center" prop="last_login_time" label="最近登录时间" width="150"></el-table-column>
          <el-table-column align="center" prop="status_title" label="状态" width="81"></el-table-column>
          <el-table-column align="center" prop="name" label="操作">
            <template slot-scope="{row}">
              <el-link type="primary" style="margin-right:10px" @click="godetailsdata(row.id)">查看</el-link>
              <el-link type="danger" v-show="row.status==1" @click="open(row.id,0,'您是否禁用')">禁用</el-link>
              <el-link type="primary" v-show="row.status==0" @click="open(row.id,1,'您是否启用')">启用</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <h3>下级信息</h3>
        <el-table :data="sup" border style="width: 589px">
          <el-table-column label="团队人数" width="147" align="center">
            <template slot-scope="{row}">
              <span v-html="row.zhixi_amount+row.interval_amount+row.shop_amount"></span>
            </template>
          </el-table-column>
          <el-table-column prop="zhixi_amount" label="直推" width="147" align="center"></el-table-column>
          <el-table-column prop="interval_amount" label="间推" width="147" align="center"></el-table-column>
          <el-table-column prop="shop_amount" label="推荐商家" width="147" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <section class="vip-table">
      <el-table
        v-loading="loading"
        :data="son"
        style="width: 100%"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <!-- <el-table-column type="selection" align="center" width="50"></el-table-column> -->
        <el-table-column prop="custom_uid" label="用户ID" align="center" width="100"></el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center" width="100"></el-table-column>
        <el-table-column prop="gender_title" label="性别" align="center" width="80"></el-table-column>
        <el-table-column prop="invite_code" label="邀请码" align="center" width="100"></el-table-column>
        <el-table-column
          prop="create_time"
          sortable="custom"
          align="center"
          label="注册时间"
          width="200"
        ></el-table-column>
        <el-table-column prop="last_login_time" label="最近登录时间" align="center" width="200"></el-table-column>
        <el-table-column prop="recommend_type" align="center" label="类型" width="180">
          <template slot="header">
            <el-row style="display:flex;width:160px;">
              <el-select v-model="value" placeholder="类型" clearable @change="change">
                <el-option v-for="item in type" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="vip_level_title" label="会员等级" align="center" width="180">
          <template slot="header">
            <el-row style="display:flex;width:160px;">
              <el-select v-model="vip" placeholder="会员等级" clearable @change="change2">
                <el-option
                  v-for="item in vipList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="status_title" align="center" label="全部状态" width="180">
          <template slot="header">
            <el-row style="display:flex;width:160px;">
              <el-select v-model="status" placeholder="全部状态" clearable @change="change3">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <el-link type="primary" style="margin-right:10px" @click="godetailsdata(row.id)">查看</el-link>
            <el-link type="danger" v-show="row.status==1" @click="open(row.id,0,'您是否禁用')">禁用</el-link>
            <el-link type="primary" v-show="row.status==0" @click="open(row.id,1,'您是否启用')">启用</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style="margin-top:30px;height:30px;width:700px;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total,prev,pager,next,jumper"
          :total="total*1"
        ></el-pagination>
      </div>
    </section>

    <el-button type="text" @click="centerDialogVisible = true">
      备注信息
      <el-link icon="el-icon-edit"></el-link>
    </el-button>
    <el-dialog
      title="备注"
      :visible.sync="centerDialogVisible"
      width="450px"
      left
      :show-close="false"
    >
      <textarea cols="30" rows="10" class="input-el" v-model="textarea"></textarea>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="memberRemark">确 定</el-button>
      </span>
    </el-dialog>
    <h5>
      <i>备注</i>
      <i>{{textarea2?textarea2:'无'}}</i>
    </h5>
    <div class="divbtn">
      <el-button type="primary" @click="open(sid,0,'您是否禁用')">禁用</el-button>
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sid: "",
      textarea: "",
      textarea2: "",
      tovipdata: "",
      total: "",
      centerDialogVisible: false,
      tableData: [],
      superior: [],
      sup: [], //下级信息
      son: [],
      loading: false,
      value: "",
      type: [
        { id: 5, value: "类型" },
        { id: 1, value: "直推" },
        { id: 2, value: "间推" },
        { id: 3, value: "推荐商家" }
      ],
      vip: "",
      vipList: [
        { id: 5, value: "会员等级" },
        { id: 4, value: "小哥粉" },
        { id: 1, value: "小哥" },
        { id: 2, value: "小V哥" },
        { id: 3, value: "V哥" }
      ],
      status: "",
      statusList: [
        { id: 5, value: "全部状态" },
        { id: 2, value: "禁用" },
        { id: 1, value: "启用" }
      ],
      //账户信息
      user_status: "",
      create_time: "",
      update_time: "",
      consumption_amount: "", //消费总额
      commission_amount: "", //佣金总额
      balance_amount: "", //余额
      //基本信息
      mobile: "",
      user_info_data: {},
      //上级信息
      uperior_info_data: {}
    };
  },

  created() {
    this.sid = this.$route.query.sId;
    this.getdata();
    this.memberChildren(1);
  },

  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //会员详情
    getdata() {
      this.$axios({
        method: "GET",
        url: "/backend/CustomUser/memberDetail",
        params: {
          custom_uid: this.sid
        }
      }).then(res => {
        if (res.data.status == 1) {
          let obj = {
            zhixi_amount: res.data.data.zhixi_amount,
            interval_amount: res.data.data.interval_amount,
            shop_amount: res.data.data.shop_amount
          };
          this.sup.push(obj);
          this.tableData.push(res.data.data);
          const { data } = res.data;
          // console.log(data.uperior_info_data, "res");
          if (JSON.stringify(data.uperior_info_data) == "{}") {
            this.superior = [];
          } else {
            this.superior.push(data.uperior_info_data);
          }
          //账户信息
          this.user_status = data.status;
          this.create_time = data.create_time;
          this.update_time = data.update_time;
          this.consumption_amount = data.consumption_amount;
          this.commission_amount = data.commission_amount;
          this.balance_amount = data.user_info_data.balance_amount;
          this.mobile = data.mobile;
          //基本信息
          this.user_info_data = data.user_info_data;
          //上级信息
          this.uperior_info_data = data.uperior_info_data;
          //   console.log(this.tableData);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //会员下家 /backend/CustomUser/memberChildren
    memberChildren(page) {
      this.loading = true;
      this.$axios({
        method: "GET",
        url: "/backend/CustomUser/memberChildren",
        params: {
          custom_uid: this.sid,
          search_invite: this.value,
          search_level: this.vip,
          search_status: this.status,
          page: page,
          size: 10
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.loading = false;
          this.son = res.data.data.data;
          this.total = res.data.data.total;
        }
      });
    },
    change(val) {
      console.log(val);
      if (val == 5) {
        this.value = "";
      } else {
        this.value = val;
      }
      this.memberChildren(1);
    },
    change2(val) {
      console.log(val);
      if (val == 5) {
        this.vip = "";
      } else {
        this.vip = val;
      }
      this.memberChildren(1);
    },
    change3(val) {
      console.log(val);
      if (val == 5) {
        this.status = "";
      } else {
        this.status = val;
      }
      this.memberChildren(1);
    },
    open(id, type, txt) {
      this.$confirm(txt + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (type == 1) {
          this.handCode(id);
        } else {
          this.handleStatus(id);
        }
      });
    },
    //单选启用
    handCode(id) {
      this.$axios({
        method: "POST",
        url: "/backend/CustomUser/memberEnable",
        data: {
          custom_uids: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.superior = [];
          this.sup = [];
          this.getdata();
          this.memberChildren();
          //   row.status = 0;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //单选禁用
    handleStatus(id) {
      this.$axios({
        method: "POST",
        url: "/backend/CustomUser/memberForbidden",
        data: {
          custom_uids: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.superior = [];
          //   this.tableData = [];
          this.sup = [];
          this.getdata();
          this.memberChildren();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //分页
    handleCurrentChange(val) {
      this.memberChildren(val);
    },
    //会员备注 /backend/CustomUser/memberRemark
    memberRemark() {
      this.$axios({
        method: "POST",
        url: "/backend/CustomUser/memberRemark",
        data: {
          custom_uid: this.sid,
          remark: this.textarea
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.centerDialogVisible = false;
          console.log(res);
          this.textarea2 = this.textarea;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //查看
    godetailsdata(id) {
      console.log(id);
      this.sid = id;
      this.tableData = [];
      this.superior = [];
      this.sup = [];
      this.getdata();
    },
    memberRemarkCencle() {},
    //多选
    handleSelectionChange() {}
  }
};
</script>



<style lang="scss" scoped>
.el-table .cell,
.el-table th div {
  //   padding-right: 100px;
  //   padding-left: 100px;
  line-height: 0;
}
.el-row {
  display: flex;
  justify-content: center;
  // margin-top: 20px;
}
.vipdetails-wapper {
  h1 {
    width: 225px;
    height: 19px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 19px;
    color: rgba(102, 102, 102, 1);
    margin-bottom: 10px;
  }
  h2 {
    width: 139px;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 30px;
  }
  .msgdiv {
    width: 1000px;
    height: 500px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 24px 30px;
    margin-bottom: 40px;
    .msgbox:nth-child(2) {
      margin: 0 155px;
    }
    .msgbox {
      float: left;
      width: 300px;
      .p-title {
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 26px;
        color: rgba(51, 51, 51, 1);
      }
      .p-li {
        width: 300px;
        // height: 42px;
        line-height: 42px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        span {
          display: inline-block;
          width: 100px;
          height: 42px;
          text-align: left;
          margin-right: 40px;
        }
        p {
          display: inline-block;
          height: 42px;
        }
      }
      .li_img {
        width: 100%;
        font-size: 16px;
        height: 100px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        .li_span1 {
          display: inline-block;
          width: 100px;
          vertical-align: top;
          text-align: left;
          margin-right: 40px;
        }
        .li_span2 {
          display: inline-flex;
          flex-direction: column;
          text-align: center;
          margin-right: 10px;
          img {
            width: 102px;
            height: 68px;
            background: rgba(204, 204, 204, 1);
          }
        }
      }
    }
  }
  .sxmsg {
    padding: 24px 30px;
    width: 1617px;
    height: 442px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 40px;
    div {
      margin-bottom: 35px;
      h3 {
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 26px;
        margin-bottom: 30px;
      }
    }
  }
  .input-el {
    width: 400px;
    height: 180px;
  }
  h5 {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 21px;
    color: rgba(102, 102, 102, 1);
    i {
      margin-right: 100px;
    }
  }
  .divbtn {
    margin-bottom: 50px;
  }
}
</style> 
<style lang="scss" >
.vipdetails-wapper {
  .el-dialog {
    position: relative;
    margin: 0 auto 50px;
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 400px;
    height: 300px;
  }
  .el-dialog__header {
    width: 400px;
    height: 20px;
  }
  .el-dialog__body {
    padding: 30px 20px;
    color: #606266;
    font-size: 0.14rem;
    word-break: break-all;
    width: 400px;
    height: 280px;
  }
  .el-dialog__footer {
    padding: 10px 20px 20px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    top: -130px;
  }
  .el-dialog__title {
    line-height: 0.24rem;
    font-size: 0.18rem;
    color: #303133;
    position: absolute;
    top: 20px;
  }
}
</style>




