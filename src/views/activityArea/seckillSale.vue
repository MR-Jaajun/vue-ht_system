<template>
  <div class="gruopSale">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>活动专区</el-breadcrumb-item>
      <el-breadcrumb-item>秒杀专区</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>秒杀专区</h1>
    <div class="StatusRow">
      <div class="div_Upload">
        <span>秒杀专区背景图：</span>
        <span>
          上传图片最佳尺寸为710*212像素，比例17:5其它尺寸会影响页面效果，
          格式为png，jpg，jpeg，上传图片的大小不超过2M
        </span>
      </div>
      <div class="div_Upload">
        <span>上传图片：</span>
        <img
          v-show="isShowdefImg"
          :src="defImg"
          alt
          style="width:146px; height:146px;margin-right:20px;border-radius:4px"
        />
        <span>
          <el-upload
            class="avatar-uploader"
            action
            list-type="picture-card"
            :on-change="onChange"
            :auto-upload="false"
            :limit="1"
            accept=".jpg, .png"
          >
            <i class="el-icon-circle-plus-outline avatar-uploader-icon"></i>
          </el-upload>
        </span>
      </div>
    </div>
    <div class="addbtn">
      <el-button type="primary" plain icon="el-icon-plus" @click="adddialog">添加活动</el-button>
    </div>
    <!-- 搜索  -->
    <el-row class="row-input">
      <div class="inputdiv">
        <span class="span">活动名称</span>
        <el-input v-model="actName" class="input-control" placeholder="请输入内容" clearable></el-input>
      </div>
      <div class="inputdiv">
        <span class="span">活动时间</span>
        <el-date-picker
          value-format="timestamp"
          style="margin-left:15px"
          v-model="time_value"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="change"
        ></el-date-picker>
      </div>
      <div class="inputdiv">
        <span class="span">状态</span>
        <el-select class="input-control" v-model="actStatus" clearable placeholder="请选择状态">
          <el-option
            v-for="(item ,index)  in actStatusList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
      <div class="inputdiv">
        <el-button type="primary" @click="getTable">搜索</el-button>
        <el-button type @click="clearClick">重置</el-button>
      </div>
    </el-row>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: fit-content"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
        @selection-change="selectAll"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column align="center" prop="activity_title" label="活动名称" width="120"></el-table-column>

        <el-table-column align="center" prop="activity_start_time" label="开始时间" width="200"></el-table-column>
        <el-table-column align="center" prop="activity_end_time" label="开始时间" width="200"></el-table-column>
        <el-table-column align="center" prop="goods_amount" label="参加商品数量" width="120"></el-table-column>
        <el-table-column align="center" prop="status_value" label="活动状态" width="120">
          <!-- <template slot-scope="{row}">
            <span v-show="row.status==1">进行中</span>
            <span v-show="row.status==2">待开始</span>
            <span v-show="row.status==3">已取消</span>
            <span v-show="row.status==4">已结束</span>
          </template>-->
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="{row}">
            <el-link
              type="primary"
              class="el_link"
              v-show="row.status_value == '待开始'"
              @click="goDetail(row)"
            >编辑</el-link>
            <el-link
              type="primary"
              class="el_link"
              v-show="row.status_value != '待开始'"
              @click="goDetail(row)"
            >查看</el-link>
            <el-link
              type="primary"
              class="el_link"
              v-show="row.status_value == '进行中'"
              @click="Cancel(row.id)"
            >取消</el-link>
            <el-link
              type="primary"
              class="el_link"
              @click="confirm(row.id,row.status_value,'是否确认删除？')"
              v-show="row.status_value != '进行中'"
            >删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:30px;width:700px;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total*1"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getBase64 } from "../../utils/base64.js";
import { getClass } from "@/utils/util.js";
export default {
  data() {
    return {
      defImg: "", //默认背景图
      isShowdefImg: true, //是否显示默认背景图
      formInline: {
        name: "",
        name: ""
      },
      time_value: "", //开始时间结束时间插件
      gettime: "",
      dialogData: [],
      tableData: [],
      dtotal: "",
      total: "",
      page: 1,
      size: 5,
      str_id: "",
      actName: "",
      actStatus: "",
      dialogImageUrl: "",
      disabled: false,
      dialogTableVisible: false,
      //状态
      actStatusList: [
        { value: "1", label: "进行中" },
        { value: "2", label: "待开始" },
        { value: "3", label: "已取消" },
        { value: "4", label: "已结束" }
      ]
    };
  },

  created() {
    this.getBackImage();
  },
  mounted() {
    this.getTable();
  },
  methods: {
    change(val) {
      let startTime = val[0] / 1000;
      let endTime = val[1] / 1000;
      this.gettime = startTime + "-" + endTime;
    },
    //活动背景获取/backend/JdPromotion/getBackImage
    getBackImage() {
      this.$get("/backend/JdPromotion/getBackImage", {
        image_type: 2
      }).then(res => {
        if (res.data.status == 1) {
          this.defImg = res.data.data.back_image;
        }
      });
    },
    //添加商品
    adddialog() {
      this.$router.push({ path: "./addseckill" });
    },
    //添加商品弹窗搜索
    Search() {},
    //获取添加商品table数据
    dialogTable() {
      this.$get("/backend/JdGoods/ptGoodsList", {
        goods_status: 2,
        page: this.page,
        size: this.size
      }).then(res => {
        this.loading = false;
        this.dialogData = [];
        const { data } = res.data;
        this.dtotal = data.total;
        this.dialogData = data.data;
        console.log(data, "table数据");
      });
    },
    //查看
    goDetail(row) {
      if (row.status_value == "待开始") {
        this.$router.push({
          path: "./editseckill",
          query: { row: row.id }
        });
      } else {
        this.$router.push({
          path: "./actDetail",
          query: { row: row }
        });
      }
    },
    //弹窗input重置
    resetForm(forName) {
      this.$refs[forName].resetFields();
      this.gridData = [];
    },
    //获取秒杀活动列表table数据
    getTable() {
      this.$post("/backend/JdPromotion/secKillList ", {
        activity_title: this.actName,
        activity_time: this.gettime,
        status: this.actStatus,
        page: this.page,
        size: this.size
      }).then(res => {
        if (res.data.status == 1) {
          this.tableData = [];
          const { data } = res.data;
          this.total = data.total;
          this.tableData = data.data;
          console.log(data, "table数据7777");
        }else{
          this.$message.error(res.data.msg)
        }
      });
    },
    // //删除的弹窗
    confirm(id, status, txt) {
      this.$confirm(txt, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$post("/backend/JdPromotion/secKillDel", {
          seckill_id: id
        }).then(res => {
          this.$message.success(res.data.msg);
          this.getTable();
        });
      });
    },
    //取消
    Cancel(id) {
      this.$post("/backend/JdPromotion/secKillCancel", {
        seckill_id: id
      }).then(res => {
        this.$message.success(res.data.msg);
        this.getTable();
      });
    },

    //分类搜索
    changeList(type, index) {
      this.isactive = index;
      this.type = type;
    },
    //重置
    clearClick() {
      this.skuID = "";
      this.goodsType = "";
    },
    // 用户全选checkbox时触发该事件
    selectAll(val) {
      var rowIds = [];
      val.forEach(item => {
        rowIds.push(item.goods_id);
        this.str_id = rowIds.join(","); // 把数组转换成字符串
      });
      console.log(this.str_id);
      return this.str_id;
    },
    //选择图片后触发的事件
    onChange(file, fileList) {
      getBase64(file.raw).then(res => {
        this.Base64imgurl = res;
        return this.Base64imgurl;
      });
      this.isShowdefImg = false;
      let that = this;
      let width = 0;
      let height = 0;
      let _URL = window.URL || window.webkitURL;
      let img = new Image();
      img.onload = function() {
        if (img.width <= 710 && img.height <= 212) {
          that
            .$post("/backend/SystemSetting/uploadAvatar", {
              image: that.Base64imgurl
            })
            .then(res => {
              console.log(res.data.data.url, "url");
              that.defImg = res.data.data.url;
              that
                .$post("/backend/JdPromotion/addBackImage", {
                  image_type: 2,
                  back_image: res.data.data.url
                })
                .then(res => {
                  that.$message.success(res.data.msg);
                });
            });
        } else {
          that.$message.error("上传失败请重新上传");
          var divCard = document.getElementsByClassName("el-upload-list__item");
          console.log(oLi, divCard);
          var oLi = getByClass(divCard, "li");
          for (var i = 0; i < oLi.length; i++) {
            oLi[i].style.display = "none";
          }
        }
      };
      img.src = file.url;
    },
    //页码操作
    handleSizeChange(val) {
      this.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTable();
      this.page = 1;
    }
  }
};
</script>
<style lang="scss" scoped>
h1 {
  margin-top: 10px;
  width: fit-content;
  height: 29px;
  font-size: 22px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 29px;
  color: rgba(51, 51, 51, 1);
}
.StatusRow {
  width: 750px;
  height: 264px;
  padding: 20px 20px 0 20px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.16);
  margin-top: 20px;
  .div_Upload {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &:nth-child(2) {
      margin-top: 20px;
      .avatar-uploader {
        font-size: 12px;
        border-radius: 2px;
        margin-right: 200px;
        // background: rgba(242, 242, 242, 1);
        cursor: pointer;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
      }
    }
    span:nth-child(1) {
      width: 187px;
      height: 18px;
      font-size: 15px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 18px;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 1px;
    }
    span:nth-child(2) {
      height: 36px;
      font-size: 13px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 20px;
      color: rgba(102, 102, 102, 1);
    }
  }
}
.row-input {
  width: 1650px;
  display: flex;
  align-items: center;
  height: 50px;
  margin: 20px 0;
  .inputdiv {
    margin-right: 90px;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .span {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 21px;
      color: rgba(22, 23, 55, 1);
      display: inline-block;
      margin-right: 20px;
    }
    .input-control {
      width: 248px;
      height: 34px;
      border-radius: 2px;
    }
  }
}
.table {
  margin-top: 35px;
  margin-bottom: 20px;
  width: fit-content;
  max-height: 663px;
  overflow-y: auto;
  border: 1px solid rgba(204, 204, 204, 1);
  .el_link {
    // border-right: 1px solid;
    height: 16px;
    margin: 0 5px;
  }
}
.addbtn {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 80px;
}
</style>
<style lang="scss">
// .gruopSale {
//   .el-icon-delete{
//     display: none;
//   }
// }
.dialog_ipnt {
  width: 100px;
}
</style>





