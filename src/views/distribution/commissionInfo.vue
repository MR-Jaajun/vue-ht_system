<!--
 * @Description: 提现管理规则设置
 * @Author: duo
 * @Date: 2019-10-15 19:08:51
 * @LastEditors: duo
 * @LastEditTime: 2019-10-29 10:37:57
 -->
<template>
  <div class="pageinfo">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './commission' }">分销管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './commission' }">佣金提现</el-breadcrumb-item>
      <el-breadcrumb-item>提现管理规则设置</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- <h1>{{this.params.titletxt}}区域配送费</h1> -->
    <div class="duoinfo_body">
      <div class="di_fl">
        <el-card class="box-card">
          <h2>
            返佣方式设置
            <i></i>
          </h2>
          <el-form ref="form" :rules="rules" :model="form" label-position="left">
            <el-form-item>返佣方式：满足下面条件后，实时自动返佣</el-form-item>
            <el-form-item>
              <span>外卖&团购订单完成</span>
              <el-input v-model="form.withdraw_way.takeout_and_group"></el-input>
              <span>小时后自动返佣</span>
              <span class="smalltxt">设置为0表示立返</span>
            </el-form-item>
            <el-form-item>
              <span>商城订单完成</span>
              <el-input v-model="form.withdraw_way.mall"></el-input>
              <span>天后自动返佣</span>
              <span class="smalltxt">设置为0表示立返</span>
            </el-form-item>
            <el-form-item>
              <span>其他订单完成</span>
              <el-input v-model="form.withdraw_way.other"></el-input>
              <span>天后自动返佣</span>
              <span class="smalltxt">设置为0表示立返</span>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="box-card">
          <h2>
            提现时间设置
            <i></i>
          </h2>
          <el-form ref="form" :rules="rules" :model="form" label-position="left">
            <el-form-item>
              <el-radio
                v-for="item in timeRadioList"
                :key="item.value"
                v-model="form.withdraw_time.anytime"
                :label="item.label"
              >{{item.value}}</el-radio>
              <div v-show="!form.withdraw_time.anytime">
                <el-checkbox-group v-model="form.withdraw_time.specially_time.week">
                  <el-checkbox
                    v-for="item in checkList"
                    :key="item.value"
                    :label="item.label"
                  >{{item.value}}</el-checkbox>
                </el-checkbox-group>时间
                <el-time-select
                  @change="getTimehorizon"
                  placeholder="起始时间"
                  v-model="startTime"
                  :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00',
                }"
                ></el-time-select>
                <el-time-select
                  @change="getTimehorizon"
                  placeholder="结束时间"
                  v-model="endTime"
                  :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00',
                  minTime: startTime
                }"
                ></el-time-select>
              </div>
              <div></div>
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <el-card class="box-card">
        <h2>
          提现基本设置
          <i></i>
        </h2>
        <el-form ref="form" :rules="rules" :model="form" label-position="left">
          <el-form-item>
            <span class="boldtxt">用户手续费设置</span>
            <span>提现金额</span>
            <el-input v-model="form.withdraw_base_rules.user_poundage"></el-input>
            <span>%</span>
            <span class="smalltxt">用户提现手续费按照提现金额百分比 ，设置为0表示佣金提现时平台不收手续费</span>
          </el-form-item>

          <el-form-item>
            <span class="boldtxt">骑手&商户手续费设置</span>
            <span>每笔</span>
            <el-input v-model="form.withdraw_base_rules.rider_or_shop_poundage"></el-input>
            <span>元</span>
            <span class="smalltxt">骑手&商户提现手续费按照笔数 ，设置为0表示佣金提现时平台不收手续费</span>
          </el-form-item>

          <el-form-item>
            <span>每天最多提现</span>
            <el-input v-model="form.withdraw_base_rules.withdraw_max_nums"></el-input>
            <span>次</span>
            <span class="smalltxt">设置为0表示不能提现</span>
          </el-form-item>
          <el-form-item>
            <span>最小提现金额</span>
            <el-input v-model="form.withdraw_base_rules.withdraw_min_amount"></el-input>
            <span>元</span>
            <span class="smalltxt">设置为0表示只要用户账户余额不为0时都可以提现</span>
          </el-form-item>
          <el-form-item>
            <span>最高提现金额</span>
            <el-input v-model="form.withdraw_base_rules.withdraw_max_amount"></el-input>
            <span>元</span>
            <span class="smalltxt">设置为0表示不能提现</span>
          </el-form-item>
          <el-form-item>
            <span>提现审核范围：提现金额≥</span>
            <el-input v-model="form.withdraw_base_rules.withdraw_verify"></el-input>
            <span>元</span>
            <span class="smalltxt">设置为0表示用户每次提现，后台都需要审核</span>
          </el-form-item>

          <el-form-item>
            <el-radio v-model="form.withdraw_base_rules.true_time" :label="1">任意时间</el-radio>
            <el-radio v-model="form.withdraw_base_rules.true_time" :label="0">
              <el-input
                :disabled="form.withdraw_base_rules.true_time?true:false"
                v-model="form.withdraw_base_rules.time_delay"
              ></el-input>工作日
            </el-radio>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 返回 -->
    <el-row class="elrow_matop">
      <el-button plain @click="backdown">返回上一页</el-button>
      <el-button type="primary" @click="submitForm('form')">保存设置</el-button>
    </el-row>
  </div>
</template>
<script>
import axios from "axios"
export default {
  data() {
    return {
      // 公共
      params: {},
      info: {},
      // 页面
      startTime: '',
      endTime: '',
      timeRadio: '1',
      defultRadio: '1',
      checkList: [
        { label: 1, value: '周一' },
        { label: 2, value: '周二' },
        { label: 3, value: '周三' },
        { label: 4, value: '周四' },
        { label: 5, value: '周五' },
        { label: 6, value: '周六' },
        { label: 7, value: '周日' },
      ],
      timeRadioList: [
        { label: 1, value: '任意时间' },
        { label: 0, value: '特定时间' }
      ],
      //表单
      form: {
        withdraw_way: {},
        withdraw_time: { anytime: '1', specially_time: { week: [] } },
        withdraw_base_rules: { true_time: '1' },
      },
      rules: {
        dateStr: [
          { required: true, message: '夜间配送费', trigger: 'blur' },
        ]
      },
    };
  },
  created() {
    // this.params = this.$route.params;
    this.getInfo();
  },
  mounted() {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    /**获取详情 */
    getInfo() {
      this.$axios({
        method: 'GET',
        url: '/backend/Distribution/brokeargeWithdrawRuelDetail',
        params: {}
      }).then(res => {
        this.form = res.data.data
        let strs = this.form.withdraw_time.specially_time.time.split("-")
        this.startTime = strs[0].trim()
        this.endTime = strs[1].trim()
      })
    },

    /**获得时间段字符串 */
    getTimehorizon(val) {
      this.form.withdraw_time.specially_time.time = this.startTime + '-' + this.endTime
    },
    /**公共post 成功返回后操作*/
    postAfterTip(url, data, tip) {
      return new Promise((resolve, reject) => {
        this.$axios({
          method: "POST",
          url,
          data,
        }).then(res => {
          if (res.data.code == 200) {
            this.$confirm(tip, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "success"
            }).then(() => {
              resolve(res);//用户确定后的操作
            })
          } else {
            this.$message(res.data.msg)
          }
        });
      });
    },

    /**提交事件 */
    submitForm(formName) {
      let withdraw_way = JSON.stringify(this.form.withdraw_way)
      let withdraw_time = JSON.stringify(this.form.withdraw_time)
      let withdraw_base_rules = JSON.stringify(this.form.withdraw_base_rules)
      // console.log(formjson)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postAfterTip('/backend/Distribution/brokeargeWithdrawRuel', { withdraw_way, withdraw_time, withdraw_base_rules }, '保存成功，是否返回上一页').then(() => {
            this.$router.go(-1);
          })
          // this.$axios({
          //   method: "POST",
          //   url: '/backend/Distribution/brokeargeWithdrawRuel',
          //   data: { withdraw_way, withdraw_time, withdraw_base_rules },
          // }).then(res => {
          //   this.$message.success('保存成功')
          // });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /**返回上一页 */
    backdown() {
      this.$router.go(-1);
    },
  }
};
</script>
<style lang="scss">
@import "../../styles/duo.scss";
</style>
<style lang="scss" scoped>
.box-card {
  width: fit-content;
  margin: 40px 40px 0 0;
}
.smalltxt {
  margin-left: 10px;
  font-size: 12px;
  color: #777;
}
.boldtxt {
  margin-right: 10px;
  font-weight: bold;
}
.elrow_matop {
  margin-top: 40px;
}
</style>
