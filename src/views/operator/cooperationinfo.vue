<template>
  <div class="cooperationinfo_wapper">
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>运营管理</el-breadcrumb-item>
        <el-breadcrumb-item>合作共赢</el-breadcrumb-item>
        <el-breadcrumb-item>查看详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="h1">查看详情</div>
    <div class="main_box clearfix">
      <div class="main_div_left">
        <h2 class="h2">
          基本信息
          <i></i>
        </h2>
        <li>
          <span>状态</span>
          <p v-text="objlist.status=='1'?'已处理':'待处理'" type="text"></p>
        </li>
        <li>
          <span>联系人</span>
          <p>{{objlist.contacts}}</p>
        </li>
        <li>
          <span>手机号</span>
          <p>{{objlist.contact_information}}</p>
        </li>
        <li>
          <span>合作项目</span>
          <p v-show="objlist.cooperation_type=='1'">骑手</p>
          <p v-show="objlist.cooperation_type=='2'">商家</p>
          <p v-show="objlist.cooperation_type=='3'">代理商</p>
          <p v-show="objlist.cooperation_type=='3'">骑手承包商</p>
        </li>
        <li>
          <span>申请时间</span>
          <p>{{objlist.create_time}}</p>
        </li>
      </div>
      <div class="main_div_right">
        <h2 class="h2">
          合作项目
          <i></i>
        </h2>
        <li>
          <span>意向工作城市</span>
          <p>{{objlist.city}}</p>
        </li>
        <li>
          <span>省份</span>
          <p>{{objlist.province}}省</p>
        </li>
        <li>
          <span>意向工作类型</span>
          <p v-show="objlist.work_type=='0'"></p>
          <p v-show="objlist.work_type=='1'">专职骑手</p>
          <p v-show="objlist.work_type=='2'">兼职骑手</p>
        </li>
        <li>
          <span>代理区域</span>
          <p>{{objlist.area}}</p>
        </li>
      </div>
    </div>
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
      <textarea cols="30" rows="10" class="input-el" v-model="remark"></textarea>

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
      <el-button plain type="primary" @click="backdown">返回上一页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      centerDialogVisible: false,
      remark: "",
      objlist: {},
      cooperation_id: "",
      textarea2: ""
    };
  },

  created() {
    this.cooperation_id = this.$route.query.id;
    this.getdata();
  },
  methods: {
    // 获取信息
    getdata() {
      this.$axios({
        method: "GET",
        url: "/backend/Cooperation/cooperationInfo",
        params: {
          cooperation_id: this.cooperation_id
        }
      }).then(res => {
        console.log(res.data.data);
        this.objlist = res.data.data;
      });
    },
    /***备注***/
    memberRemark() {
      this.$axios({
        method: "POST",
        url: "/backend/Cooperation/cooperationEdit",
        data: {
          cooperation_ids: this.cooperation_id,
          remark: this.remark
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.centerDialogVisible = false;
          this.textarea2 = this.remark;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 返回上一页
    backdown() {
      this.$router.go(-1);
    }
  }
};
</script>



<style lang="scss" scoped>
.cooperationinfo_wapper {
  height: 1080px;
  .h1 {
    margin-top: 20px;
    display: flex;
    height: 26px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 26px;
    color: rgba(51, 51, 51, 1);
  }
  .main_box {
    width: 100%;
    .main_div_left {
      margin-top: 20px;
      padding: 24px 30px;
      width: 346px;
      height: 292px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(241, 241, 241, 1);
      box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
      border-radius: 4px;
      .h2 {
        height: 26px;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 26px;
        color: rgba(51, 51, 51, 1);
        i {
          display: block;
          width: 34px;
          height: 2px;
          background: rgba(67, 113, 232, 1);
          border-radius: 1px;
          margin-top: 1px;
        }
      }
      li {
        width: 300px;
        height: 42px;
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
        }
        p {
          display: inline-block;
          height: 42px;
        }
      }
    }
    .main_div_right {
      width: 271px;
      // height: 308px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(241, 241, 241, 1);
      box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
      border-radius: 4px;
      margin-top: 20px;
      padding: 28px 30px;
      .h2 {
        height: 26px;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 26px;
        color: rgba(51, 51, 51, 1);
        i {
          display: block;
          width: 34px;
          height: 2px;
          background: rgba(67, 113, 232, 1);
          border-radius: 1px;
          margin-top: 1px;
        }
      }
      li {
        width: 300px;
        height: 42px;
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
    }
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
  .input-el {
    width: 400px;
    height: 180px;
  }
  .btn {
    margin-top: 20px;
    display: flex;
  }
}
</style>
<style lang="scss" >
.cooperationinfo_wapper {
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
    // width: 400px;
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
