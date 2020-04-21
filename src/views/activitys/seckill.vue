<!--
 * @Description: 秒杀活动审核列表
 * @Author: duo
 * @Date: 2019-09-26 09:52:53
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 11:25:53
 -->

<template>
  <div class="commercial-wapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: './seckill' }">活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动审核列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dialog class="duodialog" title="备注" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" :model="form" ref="form">
        <el-form-item prop="desc" label="驳回原因" :label-width="formLabelWidth">
          <el-input v-model="form.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="ispastHandle({},2)">确 定</el-button>
      </div>
    </el-dialog>

    <div class="search" style="margin-top:30px">
      <el-form class="demo-form-inline">
        <el-form-item label="活动名称">
          <el-input v-model="listQuery.activity_title" clearable placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="店铺名称">
          <el-input v-model="listQuery.shop_title" clearable placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            @change="getTime"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            v-model="time"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="请选择" v-model="listQuery.status">
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in selectlist"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getsearch(1)">搜索</el-button>
          <el-button style="margin-left:10px;" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <section class="vip-table">
      <!-- @selection-change="handleSelectionChange" -->
      <el-table
        :data="tableData"
        v-loading="listLoading"
        style="width: 100%"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <!-- <el-table-column type="selection" align="center" width="50"></el-table-column> -->
        <el-table-column prop="id" label="序号" align="center" width="100"></el-table-column>
        <el-table-column prop="activity_title" label="活动名称" align="center" width="150"></el-table-column>
        <el-table-column prop="shop_title" label="店铺名称" align="center" width="150"></el-table-column>
        <el-table-column prop="activity_time" label="活动时间" align="center" width="300"></el-table-column>
        <el-table-column prop="aplly_scene" label="申请时间段" align="center" width="400"></el-table-column>
        <el-table-column prop="aplly_goods" label="申请商品总数量" align="center" width="150"></el-table-column>
        <el-table-column prop="status_value" align="center" label="状态" width="150"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-link type="primary" @click="toInfo(row)">查看</el-link>&nbsp;
            <el-link v-show="row.status==2" type="primary" @click="ispastHandle(row,1)">通过</el-link>&nbsp;
            <el-link v-show="row.status==2" type="danger" @click="showDialog(row)">驳回</el-link>
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
        ></el-pagination>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      listLoading: false,
      goods_name: "", //商品名称
      shop_name: "", //店铺名称
      tableData: [],
      total: "", //总数据
      rowIds: [], //批量选择
      nid: "", //批量选择ID

      //表单
      dialogFormVisible: false,
      log_id: 0,
      form: {
        desc: ""
      },
      formLabelWidth: "120px",
      rules: {
        desc: [{ required: true, message: "请填写驳回原因", trigger: "blur" }]
      },

      //页面参数
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 20, //每页数据
        activity_title: "",
        shop_title: "",
        activity_time: "",
        status: "" //活动状态(1进行中，2待开始，3已取消,4已结束)
      },
      time: "",
      //状态 //1已通过，-1未通过，2审核中 0待审核
      selectlist: [
        { value: 1, label: "已通过" },
        { value: -1, label: "未通过" },
        { value: 2, label: "审核中" }
      ]
    };
  },
  created() {
    this.gettable(1);
  },
  watch: {
    // gettime() {
    //   console.log(this.gettime);
    // }
  },
  methods: {
    /**公共post */
    post2(url, data, tip = "确定操作吗?") {
      return new Promise((resolve, reject) => {
        this.$confirm(tip, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.listLoading = true;
          this.$axios({
            method: "POST",
            url,
            data
          }).then(res => {
            // resolve(res);//弹框就放这里，无论成功失败都隐藏弹框
            if (res.data.code == 200) {
              resolve(res);
              this.$message.success(res.data.msg);
              this.gettable().then(() => {
                this.listLoading = false;
              });
            } else {
              this.listLoading = false;
              this.$message(res.data.msg);
            }
          });
        });
      });
    },
    /**公共post */
    post(url, data) {
      return new Promise((resolve, reject) => {
        this.listLoading = true;
        this.$axios({
          method: "POST",
          url,
          data
        }).then(res => {
          resolve(res);
          if (res.data.code == 200) {
            this.gettable().then(() => {
              this.$message.success(res.data.msg);
            });
          } else {
            this.listLoading = false;
            this.$message(res.data.msg);
          }
        });
      });
    },
    //列表
    gettable(page) {
      this.listLoading = true;
      this.$axios({
        method: "GET",
        url: "/backend/Seckill/seckillVerifyList",
        params: this.listQuery
      }).then(res => {
        console.log(res);
        if (res.data.status == 1) {
          this.listLoading = false;
          console.log(res.data.data, "1");
          this.total = res.data.data.total;
          this.tableData = res.data.data.data;
        } else {
          alert(res.msg);
        }
      });
    },
    /**去详情页 */
    toInfo(row) {
      // console.log(row)
      this.$router.push({ path: "./seckillInfo", query: { id: row.id } });
    },
    /**弹窗 */
    showDialog(row) {
      this.dialogFormVisible = true;
      this.log_id = row.id;
    },

    /**通过或驳回 */
    ispastHandle(row, num) {
      let url;
      if (num == 1) {
        url = "/backend/Seckill/passSeckill";
        this.post2(url, { log_id: row.id });
      } else {
        this.$refs["form"].validate(valid => {
          if (valid) {
            url = "/backend/Seckill/forbiddenSeckill";
            this.post(url, {
              log_id: this.log_id,
              remark: this.form.desc
            }).then(() => {
              this.log_id = 0;
              this.dialogFormVisible = false;
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    //重置
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      // this.listQuery = {
      //   page: 1, //页码
      //   size: 20, //每页数据
      //   activity_title: '',
      //   shop_title: '',
      //   activity_time: '',
      //   status: '',//活动状态(1进行中，2待开始，3已取消,4已结束)
      // }
      // this.gettable(1);
    },
    //搜索
    getsearch() {
      this.gettable(1);
    },
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.gettable(val);
    },
    //批量选择
    handleSelectionChange(val) {
      this.rowIds = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
      });
      this.nid = this.rowIds.join(","); // 把数组转换成字符串
      // return this.nid;
    },
    open(id) {
      if (id) {
        this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.del(id);
        });
      } else {
        this.$message.error("请选择您将要删除的商品");
      }
    },
    //删除 /backend/Promotion/recommendGoodsDelete
    del(id) {
      this.$axios({
        method: "POST",
        url: "/backend/Promotion/recommendGoodsDelete",
        data: {
          recommend_ids: id
        }
      }).then(res => {
        if (res.data.status == 1) {
          this.$message.success(res.data.msg);
          this.gettable(1);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.listQuery.activity_time = startTime + "-" + endTime;
    }
  }
};
</script>

<style lang="scss">
@import "../../styles/duo.scss";
</style>

<style lang="scss" scoped>
.commercial-wapper {
  h1 {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
  }
  .admin-input {
    display: flex;
    height: 34px;
    margin-top: 20px;
    align-items: center;
    .inputdiv {
      margin-right: 90px;
      display: flex;
      height: 34px;
      flex-direction: row;
      justify-content: center;
      .span {
        display: inline-block;
        width: 68px;
        margin-right: 30px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 34px;
        color: rgba(22, 23, 55, 1);
      }
      .input-control {
        width: 248px;
        height: 34px;
        padding: 0 20px;
        border-radius: 2px;
      }
    }
  }
  .admin-input2 {
    display: flex;
    justify-content: flex-start;
    height: 34px;
    align-items: center;
    margin: 30px 0;
    .inputdiv2 {
      height: 34px;
      margin-right: 90px;
      display: flex;
      justify-content: center;
      .span {
        display: inline-block;
        width: 68px;
        margin-right: 30px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 34px;
        color: rgba(22, 23, 55, 1);
      }
      .input-control {
        width: 248px;
        height: 34px;
        padding: 0 20px;
        border-radius: 2px;
      }
    }
  }
  // .vip-table {
  //   position: relative;
  //   top: 60px;
  // }
}
</style>

<style lang="scss">
.search {
  .el-form {
    justify-content: flex-start;
    display: flex;
    flex-wrap: wrap;
    width: 1500px;
  }
  .el-form-item {
    display: flex;
    align-items: center;
    margin-right: 35px;
    .el-form-item__label {
      // width: 100px;
      text-align: left;
    }
    .el-input {
      width: 180px;
    }
    .el-date-editor {
      width: 380px;
    }
  }
}
</style>

