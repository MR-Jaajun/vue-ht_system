<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-23 17:23:48
 * @LastEditors: Roc
 * @LastEditTime: 2019-11-01 17:49:18
 -->
<template>
  <div class="roledetails-wepper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>角色管理详情</h1>
    <h2>基本信息</h2>
    <div class="divform">
      <el-form ref="ruleForm" label-width="90px" :model="ruleForm" class="divform">
        <el-form-item
          label="角色名称"
          prop="name"
          :rules="[ { required: true,  message: '*最多10个字符', trigger: 'blur'  }]"
        >
          <el-input class="input" v-model="ruleForm.name" placeholder="请输入角色" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="region">
          <el-input class="input" v-model="ruleForm.region" placeholder="请输入备注" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <section class="treebox">
        <p class="nav_title">权限菜单</p>
        <div class="treediv">
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :default-checked-keys="arrdata"
            ref="tree"
            empty-text
            highlight-current
            :props="defaultProps"
          ></el-tree>
        </div>
      </section>
    </div>

    <h5 class="h5_btn">
      <el-button type="primary" @click="tjclick">提交</el-button>
      <el-button plain @click="backdown">返回上一页</el-button>
    </h5>
  </div>
</template>
<script>
export default {
  data() {
    return {
      arrdata: [],
      editid: "",
      postid: "",
      // dialogVisible: false,
      // centerDialogVisible: false,
      ruleForm: {
        name: "",
        region: ""
      },
      data: [
        // {
        //   id: 1,
        //   label: "系统管理",
        //   children: [
        //     {
        //       id: 2,
        //       label: "管理员管理"
        //     },
        //     {
        //       id: 3,
        //       label: "角色管理"
        //     },
        //     {
        //       id: 4,
        //       label: "参数设置"
        //     },
        //     {
        //       id: 5,
        //       label: "APP版本管理"
        //     }
        //   ]
        // }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  beforeCreate() {},
  created() {
    this.editid = this.$route.params.roleID;
    this.getdataed();
  },
  mounted() {},
  methods: {
    // 返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //角色信息
    roledata() {
      let that = this;
      this.$axios({
        method: "GET",
        url: "/backend/Role/getRole",
        params: {
          role_id: that.editid
        }
      }).then(res => {
        console.log(res.data.data, that.editid);
        this.ruleForm.name = res.data.data.name;
        this.ruleForm.region = res.data.data.remark;
        this.arrdata = res.data.data.per_list;
      });
    },

    //拿到节点数据
    getdataed() {
      this.$axios({
        method: "GET",
        url: "/backend/Role/Permissions"
      }).then(res => {
        this.roledata();
        let getdata = res.data.data;
        getdata.forEach(item => {
          let item_in = item;
          item.children = item_in.list;
          delete item.list;
          this.data.unshift(item);
        });
      });
    },
    //提交
    tjclick() {
      this.getCheckedNodes();
      let TID = this.postid;
      this.$axios({
        method: "POST",
        url: "/backend/Role/postRole",
        data: {
          name: this.ruleForm.name,
          remark: this.ruleForm.region,
          per_list: TID,
          role_id: this.editid
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.$router.push({ name: "role/rolelist" });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //获取节点id
    getCheckedNodes() {
      var rad = "";
      var ridsa = this.$refs.tree.getCheckedKeys().join(","); // 获取当前的选中的数据[数组] -id, 把数组转换成字符串
      var ridsb = this.$refs.tree.getCheckedNodes(); // 获取当前的选中的数据{对象}
      ridsb.forEach(ids => {
        //获取选中的所有的父级id
        rad += "," + ids.pid;
      });
      rad = rad.substr(1); // 删除字符串前面的','
      // var rids = rad + "," + ridsa;
      var rids = ridsa;
      var arr = rids.split(","); //  把字符串转换成数组
      arr = [...new Set(arr)]; // 数组去重
      // rids = arr.join(","); // 把数组转换成字符串
      this.postid = arr;
      console.log(arr, "节点id");
    }
    // resetChecked() {
    //   this.$refs.tree.setCheckedKeys([]);
    // }
  }
};
</script>
<style lang="scss" scoped>
.roledetails-wepper {
  h1 {
    margin-top: 10px;
    width: 136px;
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 38px;
  }
  h2 {
    width: 83px;
    height: 26px;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 26px;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 29px;
  }
  .divform {
    display: flex;
    flex-direction: column;
    .input {
      width: 248px;
      height: 34px;
      border-radius: 2px;
      margin-bottom: 25px;
    }
  }
  .treebox {
    width: 1570px;
    margin-left: 100px;
    position: relative;
    .nav_title {
      position: absolute;
      top: 0px;
      left: -102px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 21px;
      color: rgba(51, 51, 51, 1);
    }
    .treediv {
      display: inline-block;
      margin-right: 120px;
      margin-bottom: 45px;
    }
  }
  .input-el {
    width: 400px;
    height: 180px;
  }
  .link {
    position: relative;
    top: -2px;
    left: 10px;
  }
  .h5_btn {
    position: relative;
    top: 10px;
  }
  .el-h4 {
    position: relative;
    top: 20px;
  }
}
</style>
<style lang="scss">
.el-form-item__label {
  text-align: left;
  vertical-align: middle;
  font-size: 16px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.el-form-item__error {
  color: #f56c6c;
  font-size: 0.12rem;
  line-height: 1;
  position: relative;
  top: -20px;
  left: 0;
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
  height: 180px;
}
.el-dialog__footer {
  padding: 10px 20px 20px;
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
}
.el-dialog__title {
  line-height: 0.24rem;
  font-size: 0.18rem;
  color: #303133;
  position: absolute;
  top: 20px;
}
</style>
