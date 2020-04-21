<!--
 * @Description: 编辑分销等级
 * @Author: jun
 * @Date: 2019-10-15 18:50:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-06 12:38:36
 -->
<template>
  <div class="editDistribution">
    <section>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>分销管理</el-breadcrumb-item>
        <el-breadcrumb-item>分销员管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑分销等级</el-breadcrumb-item>
      </el-breadcrumb>
    </section>
    <h1>编辑分销等级</h1>
    <div class="set">
      <!-- 等级信息 -->
      <div class="level_info common">
        <h2>
          等级信息
          <i></i>
        </h2>
        <div class="common2">
          <el-form ref="ruleForm" label-width="150px" label-position="left">
            <el-form-item label="等级名称：" required>
              <el-input v-model="level_name" clearable></el-input>
              <el-checkbox
                v-model="checked"
                @change="change"
                style="margin-left:80px;"
              >设为默认等级(当选择默认等级时，用户注册登录即获得该等级)</el-checkbox>
            </el-form-item>
            <el-form-item label="等级权重：" required>
              <el-input v-model="level_weight" clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 佣金比例设置 -->
      <div class="com_info common">
        <h2>
          佣金比例设置
          <i></i>
        </h2>
        <div class="common2">
          <el-form ref="ruleForm" label-width="150px" label-position="left">
            <el-form-item label="一级佣金比例：" required>
              <el-input v-model="first_brokerage_scale" clearable></el-input>
              <span class="pre">%</span>
            </el-form-item>
            <el-form-item label="二级佣金比例：" required>
              <el-input v-model="second_brokerage_scale" clearable></el-input>
              <span class="pre">%</span>
            </el-form-item>
            <el-form-item label="升级到此等级奖励：" required>
              <el-input v-model="promotion_award" clearable></el-input>
              <span class="pre">元</span>
            </el-form-item>
          </el-form>
          <li>发放到会员账户余额</li>
        </div>
      </div>
    </div>
    <!-- 升级规则 -->
    <div class="upgrade" v-show="rank_id !=2">
      <div class="up_rule common">
        <h2>
          升级规则
          <i></i>
        </h2>
        <div style="display:flex;margin:-10px 0 15px 0;">
          <el-button @click="addrule" type="primary" size="mini" icon="el-icon-plus">添 加</el-button>
        </div>
        <!-- 遍历 -->
        <div class="inputs" v-for="(item,i) in ruleList" :key="i" v-show="ruleList">
          <el-form ref="form" label-width="130px" label-position="left">
            <el-form-item label>
              <span>直接邀请</span>
              <el-input v-model="item.direct"></el-input>
              <span>个以上直属用户下载注册</span>
            </el-form-item>
            <el-form-item label>
              <span>间接邀请</span>
              <el-input v-model="item.indirect"></el-input>
              <span>个以上用户下载注册</span>
            </el-form-item>
            <el-form-item label>
              <span>累计获得结算佣金满</span>
              <el-input v-model="item.brokerage_total"></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label>
              <span>累计在小哥消费满</span>
              <el-input v-model="item.expense_total"></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label>
              <span>累计在小哥充值小哥豆满</span>
              <el-input v-model="item.recharge_total"></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item label>
              <span>累计在小哥消费满</span>
              <el-input v-model="item.expense_nums"></el-input>
              <span>笔</span>
            </el-form-item>
            <el-link @click="del(i)" :underline="false" icon="el-icon-close" class="delbtn"></el-link>
          </el-form>
        </div>
        <div style="font-size: 16px;line-height: 1.5;color:#666666;">
          <span style="font-weight:bold;font-size: 18px;color:#333333">升级规则的设置：</span>
          <div>1、各等级之间的升级条件，需要遵循从低到高的数量设置。</div>
          <div>2、当分销员满足多个升级条件，默认升级到条件最高等级。</div>
          <div>3、当设为默认等级时，升级规则不可填写数据，全为空表示不自动升级。</div>
        </div>
      </div>
    </div>
    <!-- 确定 返回上一页 -->
    <div class="btn">
      <el-button type="primary" @click="postMemberRank">确 定</el-button>
      <el-button style="margin-left:40px;" @click="backdown">返回上一页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rank_id: "",
      //等级设置
      checked: "",
      is_default: "",
      level_name: "",
      level_weight: "",
      first_brokerage_scale: "",
      second_brokerage_scale: "",
      promotion_award: "",
      //升级规则
      ruleList: [
        // {
        //   direct: "",
        //   indirect: "",
        //   brokerage: "",
        //   xiaoge: "",
        //   bean: "",
        //   count: ""
        // }
      ]
    };
  },
  created() {
    this.rank_id = this.$route.params.rank_id;
    this.rankDetail();
    this.checked = this.is_default == 0 ? false : true; //是否默认
  },
  watch: {
    ruleList() {
      console.log(this.ruleList);
    }
  },

  methods: {
    //分销等级详情 /backend/Distribution/rankDetail
    rankDetail() {
      this.$axios({
        method: "GET",
        url: "/backend/Distribution/rankDetail",
        params: {
          rank_id: this.rank_id
        }
      }).then(res => {
        console.log(res);
        this.first_brokerage_scale = res.data.data.first_brokerage_scale;
        this.second_brokerage_scale = res.data.data.second_brokerage_scale;
        this.promotion_award = res.data.data.promotion_award;
        this.level_weight = res.data.data.rank_level;
        this.level_name = res.data.data.rank_title;
        this.is_default = res.data.data.is_default;
        //判断是否有升级规则的数组
        if (res.data.data.condition) {
          this.ruleList = res.data.data.condition;
        }
      });
    },
    //编辑分销等级 /backend/Distribution/postMemberRank
    postMemberRank() {
      let str = JSON.stringify(this.ruleList);
      console.log(str);
      // console.log(this.ruleList);
      this.$axios({
        method: "POST",
        url: "/backend/Distribution/postMemberRank",
        data: {
          rank_id: this.rank_id,
          rank_title: this.level_name,
          first_brokerage_scale: this.first_brokerage_scale,
          second_brokerage_scale: this.second_brokerage_scale,
          promotion_award: this.promotion_award,
          condition: str,
          is_default: this.is_default,
          rank_level: this.level_weight
        }
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.rankDetail();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //添加规则
    addrule() {
      console.log(this.ruleList.length);
      if (this.ruleList.length < 6) {
        let levelRule = {
          direct: "",
          indirect: "",
          brokerage: "",
          xiaoge: "",
          bean: "",
          count: ""
        };
        this.ruleList.push(levelRule);
      } else {
        this.$message.error("最多只能添加六个规则！");
      }
    },
    del(index) {
      this.ruleList.splice(index, 1);
    },
    //是否默认
    change(val) {
      val ? (this.is_default = 1) : (this.is_default = 0);
      console.log(val, this.is_default);
    },
    //返回上一页
    backdown() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.editDistribution {
  h1 {
    margin-top: 10px;
    width: 139px;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    margin: 10px 0 30px 0;
    letter-spacing: 1px;
  }
  .set {
    width: 956px;
    // height: 548px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
  }
  .upgrade {
    margin-top: 40px;
    width: 1361px;
    // height: 502px;
    overflow: hidden;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
  }
  .common {
    background: rgba(255, 255, 255, 1);
    // border: 1px solid rgba(241, 241, 241, 1);
    // box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    // border-radius: 4px;
    padding: 30px;
    box-sizing: border-box;
    li {
      margin: 25px 0;
      width: 126px;
      height: 19px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 19px;
      color: rgba(102, 102, 102, 1);
    }
    .common2 {
      .el-input {
        width: 248px;
      }
      .pre {
        margin-left: 9px;
        vertical-align: middle;
        font-size: 16px;
        width: 14px;
        height: 21px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        line-height: 21px;
        color: rgba(51, 51, 51, 1);
      }
    }
    h2 {
      // width: 91px;
      height: 29px;
      font-size: 20px;
      font-weight: bold;
      line-height: 29px;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 1px;
      margin-bottom: 26px;
      i {
        display: block;
        width: 34px;
        height: 2px;
        background: rgba(67, 113, 232, 1);
        border-radius: 1px;
        margin-top: 1px;
      }
    }
  }
  .btn {
    width: 1261px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 60px 0 20px 0;
  }
}
</style>
<style lang="scss">
.inputs {
  width: 400px;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  float: left;
  margin-right: 30px;
  margin-bottom: 30px;
  position: relative;
  .delbtn {
    position: absolute;
    right: 8px;
    top: 8px;

    // width: 20px;
    // height: 20px;
  }
  span {
    color: #333;
    font-size: 14px;
    letter-spacing: 1px;
  }
  .el-input {
    width: 80px;
    margin: 0 8px;
  }
  .el-form {
    .el-checkbox {
      margin-bottom: 18px;
      display: flex;
      align-items: center;
    }
    .el-checkbox__label {
      // line-height: 50px;
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
  .el-form-item__content {
    margin-left: 0 !important;
    display: flex;
    justify-content: flex-start;
  }
}
</style>