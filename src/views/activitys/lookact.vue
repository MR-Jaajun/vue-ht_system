<!--
 * @Description: 
 * @Author: jun
 * @Date: 2019-09-06 18:57:07
 * @LastEditors: jun
 * @LastEditTime: 2019-10-09 17:07:49
 -->
<template>
  <div id="addact">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './acti' }">优惠专区</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './acti' }">活动主题列表</el-breadcrumb-item>
      <el-breadcrumb-item>查看活动主题</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="act_title">创建活动主题</div>
    <!-- 创建活动表单 -->
    <div id="addactform">
      <div class="title">创建活动主题</div>
      <div class="el_form">
        <el-form ref="form" :model="form" label-width="120px" label-position="left">
          <!-- 名称 -->
          <el-form-item label="活动名称：" required>
            <el-input
              v-model="form.activity_title"
              placeholder="请输入活动名称（少于20字）"
              maxlength="20"
              show-word-limit
              :disabled="ischange == 0"
            ></el-input>
          </el-form-item>
          <!-- 名额 -->
          <el-form-item label="活动名额：" required>
            <el-input :disabled="ischange == 0" v-model="form.activity_quota_num" placeholder="请填写活动名额"></el-input>
          </el-form-item>
          <!-- 活动开始时间 -->
          <el-form-item label="活动开始时间：" required>
            <el-date-picker
              v-model="form.activity_start_time"
              :disabled="ischange == 0"
              type="datetime"
              prefix-icon="el-icon-date"
              placeholder="选择活动开始时间"
            ></el-date-picker>
          </el-form-item>
          <!-- 活动结束时间 -->
          <el-form-item label="活动结束时间：" required>
            <el-date-picker
            :disabled="ischange == 0"
              v-model="form.activity_end_time"
              type="datetime"
              prefix-icon="el-icon-date"
              placeholder="选择活动结束时间"
            ></el-date-picker>
          </el-form-item>
          <!--  请编辑文案 -->
          <el-form-item label="请编辑文案：" required>
            <textarea cols="30" rows="10" :disabled="ischange == 0" v-model="form.activity_content"></textarea>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="btn">
            <el-button type="primary" v-if="ischange != 0" @click="onSubmit" style="margin-right:50px;">立即创建</el-button>
            <el-button @click="backdown">返回上一页</el-button>
          </el-form-item>
          <!-- 上传图片 -->
          <div class="upload">
            <p>
              <span style="color:#F85353;margin-right:3px;">*</span>
              <span>上传图片：</span>
            </p>
            <div class="right">
              <h2>请上传二张图片</h2>
              <h2>提示:一张优惠专区图,一张活动主题背景图</h2>
              <!-- 优惠专区 -->
              <div class="discount_p">
                <h3>优惠专区图片：</h3>
                <img :src="img1" class="imgs"/>
              </div>
              <!-- 主题背景 -->
              <div class="discount_p">
                <h3>主题背景图片：</h3>
                <img :src="img2" class="imgs"/>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      act_id: "",
      ischange:"",
      form: {
        value1: "",
        activity_title: "",
        activity_quota_num: "",
        activity_start_time: "",
        activity_end_time: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      dialogImageUrl: "", //图片路径
      img1:"",
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      dialogImageUrl2: "", //图片路径
      img2:"",
      dialogVisible2: false, //是否显示
      hideUpload2: false, //是否显示图标
      limitCount2: 1 //最大数量
    };
  },
  created() {
    this.act_id = this.$route.params.actID;
    this.ischange = this.$route.params.ischange;

    this.getinfo();
  },
  methods: {
    //信息渲染
    getinfo() {
      //活动详情
      this.$axios({
        methods: "GET",
        url: "/backend/Activity/activityDetail",
        params: {
          activity_id: this.act_id
        }
      }).then(res => {
        console.log(res.data.data);
        this.form = res.data.data;
        this.form.activity_start_time = res.data.data.activity_start_time *1000
        this.form.activity_end_time = res.data.data.activity_end_time *1000
        this.img1 = res.data.data.activity_cover_image;
        this.img2 = res.data.data.activity_bg_image;
      });
    },
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    onSubmit() {
      console.log(this.dialogImageUrl);
    },
    //限制图片大小
    // beforeAvatarUpload(file) {
    //   const isLt2M = file.size / 1024 / 1024;
    //   if (isLt2M > 2) {
    //     // this.$message.error('上传头像图片大小不能超过 2MB!');
    //     this.$message.error("上传图片大小不能超过 2MB!");
    //   }
    //   return isLt2M;
    // },
    // beforeAvatarUpload2(file) {
    //   const isLt2M = file.size / 1024 / 1024;
    //   if (isLt2M > 2) {
    //     // this.$message.error('上传头像图片大小不能超过 2MB!');
    //     this.$message.error("上传图片大小不能超过 2MB!");
    //   }
    //   return isLt2M;
    // },
    //删除图片出发的事件
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    //   this.hideUpload = fileList.length >= this.limitCount;
    // },
    // handleRemove2(file, fileList) {
    //   console.log(file, fileList);
    //   this.hideUpload2 = fileList.length >= this.limitCount2;
    // },
    //选择图片后触发的事件
    // /backend/SystemSetting/uploadAvatar
    // onChange(file, fileList) {
    //   this.$axios({
    //     method:"POST",
    //     url:"/backend/SystemSetting/uploadAvatar",
    //     data:{
    //       image:file.url
    //     }
    //   }).then(res=>{
    //     console.log(res)
    //   })
      // console.log(file.url);
    //   this.dialogImageUrl = file.url;
    //   this.hideUpload = fileList.length >= this.limitCount;
    // },

    // onChange2(file, fileList) {
    //   this.dialogImageUrl2 = file.url;
    //   this.hideUpload2 = fileList.length >= this.limitCount2;
    //   console.log(file.size);
    // }
  }
};
</script>



<style lang="scss">
html.body {
  font-family: Microsoft YaHei;
}
#addact {
  width: 1300px;
}
.act_title {
  margin-top: 15px;
  font-size: 22px;
  color: rgba(51, 51, 51, 1);
}
#addactform {
  position: relative;
  margin-top: 35px;
  margin-right: 0;
  width: 1200px;
  height: 750px;
  border: 1px solid rgba(241, 241, 241, 1);
  box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
  border-radius: 4px;
  .title {
    margin: 30px 0 26px 30px;
    width: 125px;
    height: 20px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
  .el_form {
    margin-left: 30px;
    .el-input {
      width: 248px;
    }
    .btn {
      width: 235px;
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translateX(-50%);
      .el-form-item__content {
        margin-left: 50px !important;
      }
    }

    textarea {
      width: 480px;
      color: #606266;
      font-family: Microsoft YaHei;
      resize: vertical;
      padding: 10px;
      border-radius: 5px;
      height: 250px;
      min-height: 40px;
      max-height: 280px;
    }
  }
  .upload {
    position: absolute;
    font-size: 14px;
    width: 500px;
    height: 400px;
    // border: 1px solid #58bc58;
    top: 75px;
    right: 20px;

    p {
      height: 400px;
      width: 150px;
      float: left;
      span {
        color: #606266;
        letter-spacing: 1px;
      }
    }
    .right {
      height: 400px;
      .discount_p {
        margin-top: 25px;
        h3 {
          margin-bottom: 10px;
          color: #333;
          font-weight: 600;
          font-size: 14px;
        }
        .imgs{
          width: 100px;
          height: 100px;
          border: 1px solid #dddbdb;
          border-radius: 5px;
        }
        // 添加图片宽高
        .el-upload-list__item {
          width: 100px;
          height: 100px;
          border: 1px solid #dddbdb;
        }
        // 图片宽高
        .el-upload--picture-card {
          width: 100px;
          height: 100px;
          line-height: 101px;
        }
        //超过限制数量添加类命
        .hide .el-upload {
          display: none;
        }
        .hide2 .el-upload {
          display: none;
        }
      }
      h2 {
        color: #333;
        letter-spacing: 1px;
        display: block;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
