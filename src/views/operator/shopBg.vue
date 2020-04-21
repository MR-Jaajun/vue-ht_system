<!--
 * @Description: 店铺背景列表
 * @Author: duo
 * @Date: 2019-09-30 10:30:53
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 12:24:47
 -->
<template>
  <div id="activityList">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './shopBg' }">运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>店铺背景图</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card" style="margin-top:20px;">
      <div slot="header">
        <span class="section_title">店铺默认背景图</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">保存</el-button> -->
      </div>
      <el-row class="text item">建议比例：12:5</el-row>
      <el-row class="text item">建议尺寸：750*320像素</el-row>
      <el-row class="text item">
        <el-col :span="4">上传图片：</el-col>
        <el-col v-if="isShowdefImg" :span="10">
          <img :src="this.defImg" alt style="width:146px; height:146px" />
        </el-col>
        <el-col :span="10">
          <el-upload
            ref="upload"
            action
            list-type="picture-card"
            :on-change="onChange"
            :class="{hide:hideUpload}"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :auto-upload="false"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-col>
      </el-row>
      <!-- <el-card :body-style="{ padding: '0px' }">
        <img
          src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
          class="image"
        />
      </el-card>-->
    </el-card>

    <div class="section_title" style="margin-top:40px;">店铺背景图审核列表</div>

    <!-- 新增删除 -->
    <!-- <el-row class="setStatusRow">
      <el-button @click="showDialog()" icon="el-icon-plus" type="primary">新增</el-button>
      <el-button @click="delInfo()" icon="el-icon-delete" type="primary">批量删除</el-button>
    </el-row>-->
    <!-- 搜索表单 -->
    <div class="clearfix" id="form_menu">
      <!-- 银行卡ID -->
      <div class="form_item">
        <span>店铺ID</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.shop_id"></el-input>
      </div>
      <!-- 银行卡名称 -->
      <div class="form_item">
        <span>店铺名称</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.shop_title"></el-input>
      </div>
      <!-- 评价时间 -->
      <div class="form_item">
        <span>地区</span>
        <el-row style="display:flex">
          <el-select
            clearable
            v-model="sheng"
            @change="choseProvince"
            placeholder="省级地区"
            no-data-text="请选择省份"
          >
            <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
          <el-select
            style="margin:0 10px;"
            v-model="shi"
            @change="choseCity"
            placeholder="市级地区"
            no-data-text="请选择城市"
            clearable
          >
            <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
          <el-select
            clearable
            no-data-text="请选择区"
            v-model="qu"
            @change="choseBlock"
            placeholder="区级地区"
          >
            <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-row>
      </div>
      <!-- 搜索 重置 -->
      <div class="form_item">
        <el-button @click="getSearch" style="width:75px;" type="primary">搜索</el-button>
        <el-button @click="clearlistQuery" style="margin-left:30px;width:75px;">重置</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div id="actList">
      <el-table
        :data="list"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800'}"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        v-loading="listLoading"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column align="center" label="店铺ID" prop="shop_id" width="80"></el-table-column>
        <el-table-column align="center" label="店铺名称" prop="shop_title" width="150"></el-table-column>
        <el-table-column align="center" label="店铺分类" prop="category_value" width="150"></el-table-column>
        <el-table-column align="center" label="店铺地址" prop="address" width="200"></el-table-column>
        <el-table-column align="center" label="店铺背景色图片" prop="image_url" width="300">
          <template slot-scope="{row}">
            <img :src="row.image_url" alt />
          </template>
        </el-table-column>
        <el-table-column align="center" label="申请时间" prop="create_time" sortable width="200"></el-table-column>
        <el-table-column align="center" label="审核状态" prop="status_value" width="150"></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-link @click="showDialog(row)" class="el_link" type="primary">预览图片</el-link>
              <template>
                <el-link type="danger" class="el_link" @click="delInfo(row.id)">通过</el-link>
                <el-link type="danger" class="el_link" @click="delInfo(row.id)">驳回</el-link>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-row class="setPage">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[20, 50, 100]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-row>

    <el-dialog center :visible.sync="dialogVisible">
      <span slot="footer" class="dialog-footer">
        <img :src="thisImg" alt />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios"
import { getBase64 } from "@/utils/base64.js";
export default {
  data() {
    return {
      // 弹出框内容
      dialogVisible: false, //弹出框
      radio: '1',
      setQuery: {
        bank_bg_id: '', //ID(传入则编辑)
        bank_name: '', //银行名称
        image_url: '', //背景图片
        is_default: '1' //是否默认(0否，1是)
      },

      listLoading: true, //loading图标
      list: [], //表格列表
      multipleSelection: '', //列表选中字符串
      dateStr: '', //展示给用户看的时间段
      total: 0, //总数据数
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 20, //每页数据
        shop_id: '',
        shop_title: '',
        province: '',
        city: '',
        area: ''
      },

      thisImg: '', //放大的图

      img1: "",
      dialogImageUrl: "", //图片路径
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      dialogImageUrl2: "", //图片路径
      dialogVisible2: false, //是否显示

      //省市区
      mapJson: "./json/map.json",
      province: [],
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",

      defImg: '',//默认店铺背景图
      isShowdefImg: true,//是否显示默认店铺背景图

    }
  },
  created() {
    this.getList()
    this.getCityData()
  },
  computed: {},
  filters: {
    statusFilter(status) {
      if (status) return
    }
  },
  methods: {
    /**公共post */
    post(url, data) {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.$axios({
          method: "POST",
          url,
          data,
        }).then(res => {
          resolve(res);//弹框就放这里，无论成功失败都隐藏弹框
          if (res.data.code == 200) {
            this.getList().then(() => {
              this.$message.success(res.data.msg)
            });
          } else {
            this.listLoading = false
            this.$message(res.data.msg)
          }
        });
      });
    },
    /**获取列表 */
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.$axios({
          method: 'GET',
          url: '/backend/Merchant/shopBgList',
          params: this.listQuery
        }).then(res => {
          resolve(res);
          this.listLoading = false
          this.list = res.data.data.data
          this.total = res.data.data.total
        })
        this.$axios({
          method: 'GET',
          url: '/backend/Merchant/getDefaultImage',
          params: {}
        }).then(res => {
          this.listLoading = false
          resolve(res);
          // console.log(11,res.data.data)
          this.defImg = res.data.data
        })
      })
    },
    /**新增或编辑一条信息 */
    setInfo() {
      this.setQuery.is_default = this.radio
      console.log(this.setQuery)
      this.post('/backend/Operation/bankBgAdd', this.setQuery).then(() => {
        this.dialogVisible = false
      })
    },
    /**显示弹框 */
    showDialog(row) {
      this.dialogVisible = true
      this.thisImg = row.image_url
      // if (row) {
      //   this.setQuery = {
      //     bank_bg_id: row.id, //ID(传入则编辑)
      //     bank_name: row.bank_name, //银行名称
      //     image_url: row.image_url, //背景图片
      //     is_default: '1' //是否默认(0否，1是)
      //   }
      // } else {
      //   this.setQuery = {
      //     bank_bg_id: '', //ID(传入则编辑)
      //     bank_name: '', //银行名称
      //     image_url: '', //背景图片
      //     is_default: '1' //是否默认(0否，1是)
      //   }
      // }
    },
    /**根据条件搜索 */
    getSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    /**重置 */
    clearlistQuery() {
      this.listQuery = {
        page: 1, //页码
        size: 20, //每页数据
        shop_id: '',
        shop_title: '',
        province: '',
        city: '',
        area: ''
      }
      // this.dateStr = '' //有时间组件必填
      this.sheng = ''
      this.shi = ''
      this.qu = ''
      this.getList()
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000
      let endTime = val[1] / 1000
      this.listQuery.create_time = startTime + '-' + endTime
    },
    /**查看详情 */
    toInfo(id) {
      this.$router.push({ name: 'siteinfo', params: { id: id } })
    },
    /**获取多选的id数组 */
    handleSelectionChange(val) {
      let valArr = []
      for (let i of val) {
        valArr.push(i.id)
      }
      this.multipleSelection = valArr.join(',');
    },
    /**删除或批量删除， 有id则单选，否则多选*/
    delInfo(id) {
      if (!id && !this.multipleSelection) {//多选且没选中
        this.$message('请选中内容')
      } else {
        this.$confirm(`确定删除选中内容？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.setQuery.image_url
          this.post('/backend/Operation/bankBgDel', {
            bank_bg_ids: id ? id : this.multipleSelection,
          })
        })
      }
    },
    /**设为默认*/
    setDefault(id) {
      this.$confirm(`确定设置选中内容为默认？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.post('/backend/Operation/bankBgSetDefault', {
          bank_bg_id: id
        })
      })
    },
    /**选择每页多少条 */
    handleSizeChange(val) {
      console.log(`多少条: ${val}`)
      this.listQuery.size = val
      this.getList()
    },
    /**选择第几页 */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.listQuery.page = val
      this.getList()
    },

    //删除图片触发的事件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.hideUpload = fileList.length >= this.limitCount;
    },
    //选择图片后触发的事件
    onChange(file, fileList) {
      getBase64(file.raw).then(res => {
        this.$axios({
          method: "POST",
          url: "/backend/SystemSetting/uploadAvatar",
          data: {
            image: res
          }
        }).then(res => {
          // console.log(111,res.data.data);
          // this.setQuery.image_url = res.data.data.url;
          //放接口请求
          this.post('/backend/Merchant/defaultImage', { bg_image: res.data.data.url }).then(()=>{
            this.isShowdefImg = false
          })
        });
      });
      this.dialogImageUrl = file.url;
      this.hideUpload = fileList.length >= this.limitCount;
    },
    //限制图片大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024;
      if (isLt2M > 2) {
        // this.$message.error('上传头像图片大小不能超过 2MB!');
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    // 加载china地点数据，三级
    getCityData() {
      var that = this;
      axios
        .get(this.mapJson)
        .then(function (response) {
          if (response.status == 200) {
            var data = response.data;
            that.province = [];
            that.city = [];
            that.block = [];
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {
                //省
                that.province.push({
                  id: item,
                  value: data[item],
                  children: []
                });
              } else if (item.match(/00$/)) {
                //市
                that.city.push({
                  id: item,
                  value: data[item],
                  children: []
                });
              } else {
                //区
                that.block.push({
                  id: item,
                  value: data[item]
                });
              }
            }
            // 分类市级
            for (var index in that.province) {
              for (var index1 in that.city) {
                if (
                  that.province[index].id.slice(0, 2) ===
                  that.city[index1].id.slice(0, 2)
                ) {
                  that.province[index].children.push(that.city[index1]);
                }
              }
            }
            // 分类区级
            for (var item1 in that.city) {
              for (var item2 in that.block) {
                if (
                  that.block[item2].id.slice(0, 4) ===
                  that.city[item1].id.slice(0, 4)
                ) {
                  that.city[item1].children.push(that.block[item2]);
                }
              }
            }
          } else {
            console.log(response.status);
          }
        })
        .catch(function (error) {
          console.log(typeof + error);
        });
    },
    // 选省
    choseProvince(e) {
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shi1 = this.province[index2].children;
          this.shi = this.province[index2].children[0].value;
          this.setQuery.city = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.qu = this.province[index2].children[0].children[0].value;
          this.setQuery.area = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
          this.sheng = this.province[index2].value;
          this.listQuery.province = this.sheng
          this.listQuery.city = this.shi;
          this.listQuery.area = this.qu;
        }
      }
      console.log("选", this.sheng + this.shi + this.qu);
    },
    // 选市
    choseCity(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          this.setQuery.area = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shi = this.city[index3].value;
          this.listQuery.city = this.city[index3].value;
          this.listQuery.area = this.qu;
        }
      }
      console.log("选", this.sheng + this.shi + this.qu);
    },
    // 选区
    choseBlock(e) {
      this.E = e;
      for (var i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.qu = this.qu1[i].value;
          this.listQuery.area = this.qu1[i].value;
        }
      }
      console.log("选", this.sheng + this.shi + this.qu);
    }
  }
}
</script>
<style lang="scss">
@import "../../styles/duo.scss";
</style>
<style lang="scss" scoped>
// 一个区域的title
.section_title {
  font-size: 16px;
  display: flex;
  font-weight: bold;
}

html.body {
  font-family: Microsoft YaHei;
}
#activityList {
  width: 1642px;
  overflow: hidden;
}
.addbtn {
  //   width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 80px;
}
.act_title {
  margin-top: 15px;
  font-size: 22px;
  color: rgba(51, 51, 51, 1);
}
//创建活动按钮
.creat_btn {
  width: 123px !important;
  // margin: -10px 0 34px 0;
  // margin-top: 36px !important;
  background: rgba(67, 113, 232, 1);
}
//搜索的内容
#form_menu {
  margin-top: 13px;
  width: 1630px;
}
.form_item {
  // width: 300px;
  float: left;
  margin: 0 92px 15px 0;
  display: flex;
  justify-content: space-between;
  span {
    // width: 70px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    margin-right: 15px;
    color: rgba(51, 51, 51, 1);
  }
}

//列表
#actList {
  width: 1630px;
  // max-height: 663px;
  overflow-y: auto;
  border: 1px solid rgba(204, 204, 204, 1);
  div .el_link:nth-last-child(1) {
    border-right: 0;
  }
  .el_link {
    // border-right: 1px solid;
    height: 16px;
    margin: 0 4px;
  }
}

.setStatusRow {
  display: flex;
  margin: 24px 0;
}
.setPage {
  margin: 20px 0;
}
.rowCenter {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  &:last-of-type {
    margin-bottom: 0;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
</style>
<style lang="scss">
#activityList {
  //超过限制数量添加类命
  .hide .el-upload {
    display: none;
  }
  .el-select {
    margin-right: 10px;
  }
  .el-upload {
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .uploadimg > div {
    display: flex;
    align-items: center;
  }
  .cell img {
    width: 100px;
  }
  // .uploadimg .el-upload--picture-card{
  // width: 200px;
  // }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 480px;
    .el-card__header > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
