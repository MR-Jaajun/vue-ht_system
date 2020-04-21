<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-11-11 14:07:07
 -->
<template>
  <div class="ver-wepper">
    <h1 class="ver-h1">系统管理/APP版本管理/编辑版本</h1>
    <h2 class="ver-h2">编辑版本</h2>
    <div class="file-wepper">
      <h3>基本信息</h3>
      <li>
        <span class="span">APP名称</span>
        <el-select v-model="app_name" clearable @change="choseProvider" class="li-input">
          <el-option
            v-for="(item ,index) in appList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </li>
      <li>
        <span class="span">系统</span>
        <el-input placeholder="请输入内容" class="li-input" v-model="system" :disabled="true"></el-input>
      </li>
      <li>
        <span class="span">版本号</span>
        <el-input placeholder="请输入内容" clearable class="li-input" v-model="version_no"></el-input>
      </li>
      <li>
        <span class="span">内部版本号</span>
        <el-input placeholder="请输入内容" clearable class="li-input" v-model="inner_version"></el-input>
      </li>
      <li>
        <span class="span">版本状态</span>
        <el-select v-model="status" class="li-input" clearable @change="chooseStutus">
          <el-option
            v-for="(item ,index) in vList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </li>
      <li>
        <span class="span">版本描述</span>
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6}"
          placeholder="请输入内容"
          v-model="app_des"
          resize="horizontal"
        ></el-input>
      </li>
      <h5 class="h5">
        <span class="span">下载地址</span>
        <el-input type="text" class="input" v-model="app_url" />
        <el-upload
          action
          class="upload-demo"
          :on-change="onChange"
          :on-remove="handleRemove"
          multiple
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button class="le-btn" slot="trigger" size="small" type="primary">上传文件</el-button>
        </el-upload>
      </h5>
    </div>
    <div class="h5_btn">
      <el-button type="primary" plain @click="tjClick">提交</el-button>
      <el-button type="primary" plain @click="backdown">返回上一页</el-button>
    </div>
  </div>
</template>

<script>
import { getBase64 } from "@/utils/base64.js";
export default {
  data() {
    return {
      Base64File: null,
      appData: null,
      system: "",
      app_id: "",
      version_no: "", //版本号
      status: "", //版本状态
      app_name: "", //APP名称
      app_des: "", //版本描述
      app_url: "", //下载地址
      inner_version: "", //内部版本号
      appList: [
        {
          value: "小哥商城",
          label: "小哥商城"
        },
        {
          value: "小哥骑手",
          label: "小哥骑手"
        },
        {
          value: "小哥开店宝",
          label: "小哥开店宝"
        }
      ],
      status: "",
      status1: "",
      vList: [
        {
          value: 1,
          label: "最新版本"
        },
        {
          value: 2,
          label: "强制升级"
        },
        {
          value: 3,
          label: "提示升级"
        },
        {
          value: 4,
          label: "不提示升级"
        }
      ]
    };
  },
  created() {
    this.appData = this.$route.params.app_v; //
    this.app_name = this.$route.params.app_v.app_name; //名称
    this.system = this.$route.params.app_v.system; //系统名称
    this.version_no = this.$route.params.app_v.version_no; //系统号
    this.status = this.$route.params.app_v.status; //版本状态
    this.app_des = this.$route.params.app_v.app_des; //版本描述
    this.app_url = this.$route.params.app_v.app_url; //版本地址
    this.app_id = this.$route.params.app_v.id;
    this.inner_version = this.$route.params.app_v.inner_version;
    if (this.status == "最新版本") {
      this.status1 = 1;
    }
    if (this.status == "强制升级") {
      this.status1 = 2;
    }
    if (this.status == "提示升级") {
      this.status1 = 3;
    }
    if (this.status == "不提示升级") {
      this.status1 = 4;
    }
    // this.status_type = this.appData.status;
    // this.app_name = this.appData.app_name;
    // this.textarea2 = this.appData.app_des;
    // this.app_url = this.appData.app_url;
    console.log(this.status1);
  },

  methods: {
    /**返回上一页 */
    backdown() {
      this.$router.go(-1);
    },
    choseProvider(val) {
      this.app_name = val;
      console.log(val, "val");
    },
    chooseStutus(val) {
      this.status1 = val;
    },

    handleRemove(file, fileList) {
      console.log(file, fileList, "1");
    },

    // handleExceed(files, fileList) {
    //   this.$message.warning(
    //     `当前限制选择 1 个文件，本次选择了 ${
    //       files.length
    //     } 个文件，共选择了 ${files.length + fileList.length} 个文件`
    //   );
    // },
    //选择图片后触发的事件
    onChange(file, fileList) {
      getBase64(file.raw).then(res => {
        if (res) {
          this.$axios({
            method: "post",
            url: "/backend/Version/uploadFile",
            data: {
              file: res
            }
          }).then(res => {
            // let that = this;
            if (res.data.status == 1) {
              // this.app_url = "";
              console.log(res.data.data.url);
              this.$message.success(res.data.msg);
              this.app_url = res.data.data.url;
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }else{
          
        }
      });
    },
    tjClick() {
      this.$axios({
        method: "POST",
        url: "/backend/Version/postVersion",
        data: {
          app_name: this.app_name,
          system: this.system,
          version_no: this.version_no,
          inner_version: this.inner_version,
          status: this.status1,
          app_des: this.app_des,
          app_url: this.app_url,
          app_id: this.app_id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.backdown();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.ver-wepper {
  .ver-h1 {
    width: 257px;
    height: 21px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 21px;
    color: rgba(102, 102, 102, 1);
  }
  .ver-h2 {
    margin-top: 10px;
    margin-bottom: 30px;
    width: 92px;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
  }
  .file-wepper {
    width: 600px;
    // height: 528px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
    border-radius: 4px;
    padding: 30px;
    h3 {
      width: 83px;
      height: 26px;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 26px;
      color: rgba(51, 51, 51, 1);
    }
    li {
      width: 392px;
      height: 34px;
      box-sizing: border-box;
      margin-top: 30px;
      margin-bottom: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      .span {
        display: inline-block;
        margin-right: 40px;
        width: 80px;
        height: 21px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: rgba(51, 51, 51, 1);
      }
      .li-input {
        width: 225px;
      }
    }
    // .h4 {
    //   display: flex;
    //   justify-content: center;
    //   .span {
    //     font-size: 16px;
    //     font-family: Microsoft YaHei;
    //     font-weight: 400;
    //     color: rgba(51, 51, 51, 1);
    //     display: inline-block;
    //     margin-right: 40px;
    //     vertical-align: top;
    //   }
    //   .h4-input {
    //     height: 141px;
    //   }
    // }
    .h5 {
      width: 540px;
      height: 34px;
      box-sizing: border-box;
      margin-top: 30px;
      margin-bottom: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      .le-btn {
        position: relative;
        top: -30px;
        left: 20px;
      }
      .span {
        width: 80px;
        height: 21px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 21px;
        color: rgba(51, 51, 51, 1);
        display: inline-block;
        margin-right: 40px;
        vertical-align: top;
      }
      .input {
        width: 300px;
        height: 30px;
      }
    }
  }
}
</style>
<style lang="scss">
.file-wepper {
  .el-textarea {
    width: 225px;
    max-width: 393px;

    .el-textarea__inner {
      min-width: 225px;
      max-width: 393px;
    }
  }
}
</style>