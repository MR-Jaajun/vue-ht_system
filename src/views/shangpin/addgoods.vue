<!--
 * @Description: 
 * @Author: jun
 * @Date: 2019-08-27 10:16:55
 * @LastEditors: duo
 * @LastEditTime: 2019-10-23 10:56:34
 -->
<template>
  <div>
    <div id="search">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: './categroy' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: './stocks' }">商品库管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑新增商品</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="act_title">编辑新增商品</div>
    </div>
    <div class="goods_all_info">
      <h2>基本信息</h2>
      <div class="addform">
        <el-form label-position="left" label-width="80px">
          <el-form-item label="状态">
            <el-radio-group v-model="radio3" size="small">
              <el-radio :label="1" border>启用</el-radio>
              <el-radio :label="2" border>禁用</el-radio>
            </el-radio-group>
            <!-- <el-button :type="choose1" icon="el-icon-view" @click="using">启用</el-button> -->
            <!-- <el-button :type="choose2" icon="el-icon-circle-close" @click="forbidden">禁用</el-button> -->
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="classify" placeholder="请选择" clearable @change="change">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.title"
                :value="item.id"
                @change="change"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品照片" style="height:100px;">
            <el-upload
              action
              list-type="picture-card"
              :on-change="onChange"
              :class="{hide:hideUpload}"
              :on-remove="handleRemove"
              :auto-upload="false"
              :limit="1"
              accept=".jpg, .png"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="photo_url" />
            </el-dialog>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="name" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品简介">
            <!-- <el-input v-model="formLabelAlign.goods_info"></el-input> -->
            <el-input
              type="textarea"
              maxlength="200"
              show-word-limit
              placeholder="请输入内容"
              v-model="goods_info"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="商品单位">
            <el-input v-model="unit" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品规格">
            <el-button
              type="primary"
              @click="dialogFormVisible = true"
              icon="el-icon-plus"
              style="letter-spacing:1px;"
            >添加规格</el-button>
          </el-form-item>
        </el-form>

        <!-- 添加规格弹窗 -->
        <div>
          <el-dialog
            title="商品规格设置"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            width="910px"
            custom-class="dialog"
          >
            <div class="addsize">
              <el-table :data="tableData" style="width: 100%" max-height="350">
                <el-table-column prop="num" label="规格序号" width="80" align="center"></el-table-column>
                <el-table-column label="规格名称" align="center" width="160" prop="size_info">
                  <template slot-scope="scope">
                    <el-input
                      placeholder="如温度,大小"
                      v-model="scope.row.size_info"
                      clearable
                      style="width:150px;"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="option" label="编辑规格选项" align="center" width="500">
                  <!-- 规格选项 -->
                  <template slot-scope="{row}">
                    <el-input
                      placeholder="如冷，热"
                      v-model="row.size_item1"
                      style="width:85px;margin-right:8px"
                    ></el-input>
                    <el-input
                      placeholder="如冷，热"
                      v-model="row.size_item2"
                      style="width:85px;margin-right:8px"
                    ></el-input>
                    <el-input
                      placeholder="如冷，热"
                      v-model="row.size_item3"
                      style="width:85px;margin-right:8px"
                    ></el-input>
                    <el-input
                      placeholder="如冷，热"
                      v-model="row.size_item4"
                      style="width:85px;margin-right:8px"
                    ></el-input>
                    <el-input placeholder="如冷，热" v-model="row.size_item5" style="width:85px;"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="50" align="center" fixed="right">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="deleteRow(scope.$index, tableData)"
                      type="text"
                      size="small"
                    >移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-top:25px;">
              <el-button
                type="primary"
                @click="addRow"
                icon="el-icon-plus"
                style="letter-spacing:1px;"
              >添加规格</el-button>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addsize">添 加</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <!-- 规格 -->
    <div class="size_libraby">
      <div class="checkout_item" v-for="item in sizeList" :key="item.title">
        <el-checkbox
          :indeterminate="item.isIndeterminate"
          v-model="item.checkAll"
          @change="handleCheckAllChange"
        >{{item.title}}</el-checkbox>
        <div style="margin: 6px 0;"></div>
        <el-checkbox-group v-model="item.checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in item.child" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <!-- 商品库存价格 -->
    <div class="goods_price">
      <h2>商品库存价格</h2>
      <el-radio-group v-model="radio2">
        <el-radio :label="1">统一价格</el-radio>
        <el-radio :label="2">多规格价格</el-radio>
      </el-radio-group>
    </div>
    <!-- 设置价格 -->
    <div class="price_set" v-if="radio2==1">
      <div>
        <span class="sp">设置商品库存</span>
        <span style="font-size:16px;">无限库库存</span>
        <span style="font-size:14px;color:#666;">默认</span>
      </div>
      <div>
        <span class="sp">设置商品价格</span>
        <el-input
          type="age"
          v-model="price"
          autocomplete="off"
          style="width:80px;"
          placeholder="价格"
        ></el-input>
        <span style="font-size:16px;">元</span>
      </div>
    </div>

    <!-- 多规格弹窗 -->
    <div class="more_size" style="width:551px;" v-if="radio2===2">
      <el-table
        :data="moresize"
        :span-method="objectSpanMethod"
        border
        style="width: 100%; margin-top: 20px;color:#333;font-size:14px"
        :header-cell-style="{color:'#333', fontWeight: '800', height:'80px',fontSize:'16px' }"
      >
        <el-table-column prop="id" label="规格" width="100" align="center"></el-table-column>
        <el-table-column prop="temperature" label="温度" width="150" align="center"></el-table-column>
        <el-table-column prop="count" label="库存" align="center" width="100"></el-table-column>
        <el-table-column prop="price" label="设置价格" width="200" align="center">
          <template slot-scope="scope">
            <el-input placeholder="金额" v-model="scope.row.price" clearable style="width:150px;"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 提交 -->
    <div class="sub">
      <el-button type="primary" style="margin-right:20px;">提交</el-button>
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>
  </div>
</template>


<script>
import { getBase64 } from "../../utils/base64.js";
import axios from "axios";
// const cityOptions = ["小", "中", "大"];
export default {
  data() {
    return {
      //价格
      price: "",
      //复选框
      // a: [
      //   {
      //     checkAll: false,
      //     checkedCities: ["大份", "中份"],
      //     cities: ["大份", "中份", "小份"],
      //     isIndeterminate: true
      //   }
      // ],
      // cityOptions: ["小", "中", "大"],
      // cityOptions:["小", "中", "大"],
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: true,
      //单选
      radio: 1,
      radio2: "",
      // choose1: "", //启用
      // choose2: "", //禁用
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      dialogFormVisible: false,
      options: [],
      sizeList: [
        {
          title: "份量",
          checkedCities: [],
          isIndeterminate: false,
          checkAll: false,
          child: ["小", "中", "大"]
        },
        {
          title: "温度",
          checkedCities: [],
          isIndeterminate: false,
          checkAll: false,
          child: ["热", "温", "冰"]
        }
      ],
      //多规格列表
      moresize: [
        {
          id: "小份",
          temperature: "常温",
          count: "无限库存",
          price: ""
        },
        {
          id: "小份",
          temperature: "冷",
          count: "无限库存",
          price: ""
        },
        {
          id: "小份",
          temperature: "热",
          count: "无限库存",
          price: ""
        },
        {
          id: "中份",
          temperature: "常温",
          count: "无限库存",
          price: ""
        },
        {
          id: "中份",
          temperature: "冷",
          count: "无限库存",
          price: ""
        },
        {
          id: "中份",
          temperature: "常温",
          count: "无限库存",
          price: ""
        }
      ],
      //添加规格列表
      tableData: [
        {
          num: 1,
          size_info: "",
          size_item1: "",
          size_item2: "",
          size_item3: "",
          size_item4: "",
          size_item5: ""
        }
      ],
      name: "", //名称
      unit: "", //单位
      goods_info: "", //商品简介
      photo_url: "", //商品图片路径
      classify: "", //商品分类
      radio3: 1,
      img: ""
    };
  },
  watch: {
    radio2() {
      console.log("选中" + this.radio2); //要写的方法,
    },
    radio3() {
      console.log("选中" + this.radio3); //要写的方法,
    }
  },
  created() {
    this.storeGoodsCategory();
  },
  methods: {
    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    //获取商品库分类 /backend/Merchant/storeGoodsCategory
    storeGoodsCategory() {
      this.$axios({
        method: "GET",
        url: "/backend/Merchant/storeGoodsCategory"
      }).then(res => {
        console.log(res);
        this.options = res.data.data;
      });
    },
    change(value) {
      console.log(value);
      this.classify = value;
    },
    //全选
    handleCheckAllChange(val) {
      // console.log(this.sizeList, "全选");
      this.sizeList.forEach((item, index) => {
        if (item.checkAll == true) {
          item.checkedCities = item.child;
        } else {
          item.checkedCities = [];
        }
        item.isIndeterminate = false;
      });
    },
    handleCheckedCitiesChange(value) {
      // console.log(value, "复选", value.length);
      this.sizeList.forEach((item, index) => {
        item.checkAll = item.checkedCities.length === item.child.length;
        item.isIndeterminate =
          item.checkedCities.length > 0 &&
          item.checkedCities.length < item.child.length;
      });
      // this.checkAll = checkedCount === this.sizeList[0].child.length;
      // this.isIndeterminate =
      //   checkedCount > 0 && checkedCount < this.sizeList[0].child.length;
    },
    handleChange(value) {
      console.log(value);
      // console.log(this.form)
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
    //删除图片出发的事件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.hideUpload = fileList.length >= this.limitCount;
    },
    //选择图片后触发的事件
    onChange(file, fileList) {
      fileList.forEach(item => {
        getBase64(item.raw).then(res => {
          this.$axios({
            method: "POST",
            url: "/backend/SystemSetting/uploadAvatar",
            data: {
              image: res
            }
          }).then(res => {
            console.log(res.data.data);
            this.img = res.data.data.url;
          });
        });
      });
      this.photo_url = file.url;
      this.hideUpload = fileList.length >= this.limitCount;
      console.log(file.size);
    },
    //移除
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    //添加
    addRow() {
      var len = this.tableData.length;
      console.log(len);
      var newobj = {
        num: len + 1,
        size_info: "",
        size_item1: "",
        size_item2: "",
        size_item3: "",
        size_item4: "",
        size_item5: ""
      };
      this.tableData.push(newobj);
    },
    addsize() {
      console.log(this.tableData);
      // let child = [];
      // this.tableData.forEach(item => {
      //   let obj = {
      //     title: item.size_info,
      //     checkedCities: [],
      //     isIndeterminate: false,
      //     checkAll: false,
      //     child: [
      //       item.size_item1,
      //       item.size_item2,
      //       item.size_item3,
      //       item.size_item4,
      //       item.size_item5
      //     ]
      //   };
      //   if (item.size_info) {
      //     if (
      //       item.size_item1 ||
      //       item.size_item2 ||
      //       item.size_item3 ||
      //       item.size_item4 ||
      //       item.size_item5
      //     ) {
      //       this.sizeList.push(obj);
      //     } else {
      //       this.$message.info("请填写规格选项");
      //     }
      //   } else {
      //     this.$message.info("请填写规格名称");
      //   }
      // });
    },

    //多规格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>


<style lang="scss">
html.body {
  font-family: Microsoft YaHei;
}
#search {
  width: 1402px;
  overflow: hidden;
}
.act_title {
  margin-top: 15px;
  font-size: 22px;
  color: rgba(51, 51, 51, 1);
  font-weight: bold;
}

.goods_all_info {
  margin-top: 30px;
  height: 640px;
  width: 606px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(241, 241, 241, 1);
  box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
  border-radius: 4px;
  padding: 30px 30px 0 30px;
  h2 {
    margin-bottom: 28px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
  //文本框长度
  .el-input {
    width: 343px;
  }
  .el-form-item {
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .el-form-item__content {
      margin-left: 0 !important;
    }
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
  .el-textarea__inner {
    width: 450px;
    height: 120px;
    resize: none;
  }
  //弹窗
  .dialog {
    .el-dialog__header {
      position: relative;
      height: 50px;
      .el-dialog__title {
        position: absolute;
        font-weight: bold;
        top: 32px;
        left: 56px;
        font-size: 22px;
        color: rgba(51, 51, 51, 1);
        letter-spacing: 1px;
      }
    }
    .el-dialog__body {
      padding: 30px 50px 5px 50px;
      .el-input {
        width: 150px;
      }
      .el-form-item__label {
        color: #333;
      }
    }
  }
}
// 规格库
.size_libraby {
  width: 606px;
  display: flex;
  flex-direction: column;
  padding: 30px;
  // height: 100px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(241, 241, 241, 1);
  box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
  border-radius: 4px;
  .checkout_item {
    height: 80px;
    display: flex;
    flex-direction: column;
  }
}
//商品库存价格
.goods_price {
  margin: 30px 0;
  width: 606px;
  padding-left: 25px;
  display: flex;
  justify-content: flex-start;
  h2 {
    font-size: 18px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    margin-right: 20px;
  }
}
.price_set {
  width: 340px;
  height: 121px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(241, 241, 241, 1);
  box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
  border-radius: 4px;
  div {
    height: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    span {
      color: #333;
      font-size: 14px;
    }
    .sp {
      font-weight: bold;
      font-size: 18px;
    }
  }
}
.sub {
  margin: 30px 0 50px;
  display: flex;
}
</style>