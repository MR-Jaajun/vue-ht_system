<!--
 * @Description: 
 * @LastEditors: jun
 * @LastEditTime: 2019-10-21 14:37:34
 -->
<template>
  <div class="agedetails-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>骑手承包商</el-breadcrumb-item>
      <el-breadcrumb-item>骑手承包商详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>骑手承包商详情</h1>
    <section class="sdiv">
      <h2>基本信息</h2>
      <ul class="info">
        <li>
          <span>代理商姓名</span>
          <p>{{real_name}}</p>
        </li>
        <li>
          <span>手机号</span>
          <p>{{contacts_mobile}}</p>
        </li>
        <li>
          <span>代理商类型</span>
          <p v-if="agent_type==1">省代</p>
          <p v-else-if="agent_type==2">市代</p>
          <p v-else>区代</p>
        </li>
        <li>
          <span>所在地区</span>
          <p>{{address}}</p>
        </li>
        <li>
          <span>代理商身份证号码</span>
          <p>{{idcard_num}}</p>
        </li>
        <li>
          <span>代理商身份证图片</span>
          <img :src="idcard_face_image" alt="身份证正面" />
          <img :src="idcard_back_image" alt="身份证反面" />
        </li>
      </ul>
    </section>
    <section class="sdiv2">
      <span class="s1">审核状态</span>
      <el-radio-group v-model="radio" @change="changes" v-show="status==0">
        <el-radio :label="1">审核通过</el-radio>
        <el-radio :label="2">驳回申请</el-radio>
      </el-radio-group>
      <p v-show="status==1">审核通过</p>
      <p v-show="status==2">审核被驳回</p>
    </section>
    <!-- 备注信息 -->
    <div class="note">
      <p class="p1" @click="centerDialogVisible = true">
        备注信息
        <el-link icon="el-icon-edit" @click="centerDialogVisible = true"></el-link>
      </p>
      <el-dialog
        title="备注"
        :visible.sync="centerDialogVisible"
        width="450px"
        @close="clearTextarea"
        left
      >
        <textarea cols="30" rows="10" class="input-el" v-model="textarea"></textarea>

        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="memberRemark">确 定</el-button>
        </span>
      </el-dialog>
      <p class="p2">
        <span>备注</span>
        <span>{{textarea2?textarea2:'无'}}</span>
      </p>
    </div>
    <el-button primary @click="auditRider" v-show="status == 0">提 交</el-button>
    <el-button plain @click="backdown">返回上一页</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      radio: "",
      rider_contractor_id: "",
      idcard_num: "",
      real_name: "",
      address: "",
      contacts_mobile: "",
      idcard_face_image: "",
      idcard_back_image: "",
      agent_type: "",
      status: "",
      //备注信息
      centerDialogVisible: false,
      textarea: "",
      textarea2: ""
    };
  },
  watch: {
    radio() {
      console.log(this.radio);
    }
  },
  created() {
    this.rider_contractor_id = sessionStorage.getItem("rider_contractor_id");
    // this.rider_contractor_id = this.$route.params.rider_contractor_id;
    this.gedetail();
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //代理商详情
    gedetail() {
      this.$axios({
        method: "GET",
        url: "/backend/Rider/getRiderContractor",
        params: {
          rider_contractor_id: this.rider_contractor_id
        }
      }).then(res => {
        console.log(res.data.data);
        this.status = res.data.data.verify_status;
        // this.radio = res.data.data.verify_status;
        this.textarea2 = res.data.data.remark;
        this.idcard_back_image = res.data.data.idcard_back_image;
        this.idcard_face_image = res.data.data.idcard_face_image;
        // this.$message.success(res.data.msg);
        this.idcard_num = res.data.data.idcard_num;
        this.contacts_mobile = res.data.data.contacts_mobile;
        this.real_name = res.data.data.real_name;
        this.agent_type = res.data.data.agent_type;
        this.address = `${res.data.data.province} ${res.data.data.city} ${res.data.data.area}`;
      });
    },
    //清除备注信息
    clearTextarea() {
      this.textarea = "";
    },
    //修改备注
    memberRemark() {
      this.$axios({
        method: "POST",
        url: "/backend/Rider/editRemark",
        data: {
          rider_id: this.rider_contractor_id,
          remark: this.textarea,
          edit_type: 3
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.centerDialogVisible = false;
          this.gedetail();
          console.log(res);
          this.textarea2 = this.textarea;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    changes(val) {
      if (val == 1) {
        this.open(val, "您是否通过该骑手承包商");
      }
      if (val == 2) {
        this.open(val, "您是否驳回该骑手承包商");
      }
    },
    open(val, txt) {
      this.$confirm(txt + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.radio = val;
        })
        .catch(() => {
          this.radio = "";
        });
    },
    auditRider() {
      if (this.radio) {
        if (this.radio == 1) {
          this.pass_and_refuse("/backend/Rider/passRiderContractor");
        }
        if (this.radio == 2) {
          this.pass_and_refuse("/backend/Rider/refuseRiderContractor");
        }
      } else {
        this.$message.error("请选择通过或者驳回");
      }
    },
    //审核 /backend/Rider/passRiderContractor 驳回  /backend/Rider/refuseRiderContractor
    pass_and_refuse(url) {
      if (this.radio) {
        this.$axios({
          method: "POST",
          url: url,
          data: {
            rider_contractor_id: this.rider_contractor_id
          }
        }).then(res => {
          console.log(res);
          this.gedetail();
          this.$message.success(res.data.msg);
        });
      } else {
        this.$message.error(res.data.msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.agedetails-wapper {
  h1 {
    margin-top: 10px;
    // width: 115px;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  .sdiv {
    margin-top: 30px;
    padding: 28px;
    width: 565px;
    height: 446px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    box-sizing: border-box;
    h2 {
      width: 83px;
      height: 26px;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 26px;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 20px;
    }
    .info {
      display: flex;
      flex-direction: column;
      li {
        // width: 200px;
        margin: 10px 0;
        font-size: 16px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        display: flex;
        // align-items: center;
        justify-content: flex-start;
        img {
          width: 158px;
          height: 108px;
          margin-right: 10px;
          background: #cccccc;
        }
        p {
          display: inline-block;
          color: #333;
          height: 20px;
        }
        span {
          display: inline-block;
          text-align: left;
          width: 160px;
          height: 20px;
          color: #666;
        }
      }
    }
  }
  .rowel {
    width: 355px;
    height: 45px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
  }
  .sdiv2 {
    padding-left: 10px;
    background: #ffffff;
    width: 345px;
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
    p {
      margin-left: 50px;
      height: 16px;
      font-size: 16px;
      color: #666;
    }
  }
  .note {
    font-weight: bold;
    font-size: 18px;
    padding-left: 10px;
    margin-top: 30px;
    p {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 20px;
    }
    span {
      font-size: 16px;
      font-weight: 400;
      font-family: Microsoft YaHei;
      color: rgba(102, 102, 102, 1);
      margin-right: 50px;
    }
  }
}
</style>
