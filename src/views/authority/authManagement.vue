<!--
 * @Description: 
 * @Author: Roc
 * @Date: 2019-09-22 15:09:29
 * @LastEditors: Roc
 * @LastEditTime: 2019-10-30 14:05:39
 -->
<template>
  <div class="roledetails-wepper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>骑手站长后台权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>骑手站长后台权限管理</h1>
    <div class="divform">
      <!-- <h2>
        骑手站长后台权限管理
        <i></i>
      </h2>-->
      <section class="treebox">
        <div class="treediv">
          <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            :default-checked-keys="arrData"
            ref="tree"
            empty-text
            highlight-current
            :props="defaultProps"
          ></el-tree>
        </div>
      </section>
    </div>
    <div>
      <el-button class="el-h4" type="text" @click="centerDialogVisible = true">
        备注信息
        <el-link class="link" icon="el-icon-edit"></el-link>
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
          <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <p class="p_div">
      <span>备注</span>
      <span>无</span>
    </p>
    <h5 class="h5_btn">
      <el-button type="primary" @click="tjclick">提交</el-button>
      <!-- <el-button plain @click="backdown">返回上一页</el-button> -->
    </h5>
  </div>
</template>
<script>
export default {
  data() {
    return {
      postid: "",
      dialogVisible: false,
      centerDialogVisible: false,
      ruleForm: {
        name: "",
        region: ""
      },
      textarea: "",
      arrData: [],
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
    this.getdataed();
  },
  methods: {
    // 返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //拿到节点数据
    getdataed() {
      this.$axios({
        method: "GET",
        url: "/backend/AuthManagement/contractorPermissionList"
      })
        .then(res => {
          this.DefaultRoleInfo();
          let getdata = res.data.data;
          getdata.forEach(item => {
            let item_in = item;
            item.children = item_in.list;
            delete item.list;
            this.data.unshift(item);
          });
        })
    },
    //权限回显
    DefaultRoleInfo() {
      this.$axios({
        method: "GET",
        url: "/backend/AuthManagement/contractorDefaultRoleInfo"
      }).then(response => {
        console.log(response.data.data, "限回");
        this.arrData = response.data.data;
      });
    },

    tjclick() {
      this.getCheckedNodes();
      let TID = this.postid;
      console.log(TID);
      this.$axios({
        method: "POST",
        url: "/backend/AuthManagement/contractorDefaultRole",
        data: {
          name: this.ruleForm.name,
          remark: this.ruleForm.region,
          per_list: TID
        }
      }).then(res => {
        this.$message({
          message: res.data.msg,
          type: "success"
        });
      });
    },

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
      console.log(arr);
      this.postid = arr;
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
    height: 29px;
    font-size: 22px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 29px;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 30px;
  }
  .divform {
    padding: 20px 13px;
    // width: 972px;
    // height: 312px;
    // background: rgba(255, 255, 255, 1);
    // border: 1px solid rgba(241, 241, 241, 1);
    // box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.1);

    h2 {
      // width: 91px;
      height: 29px;
      font-size: 22px;
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
  .p_div {
    margin-top: 30px;
    width: 158px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
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

