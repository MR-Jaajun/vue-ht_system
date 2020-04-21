<!--
 * @Description: 银行卡背景列表
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 11:30:39
 -->
<template>
  <div id="activityList">
    <!-- 弹窗 -->
    <el-dialog class="duodialog" :visible.sync="dialogVisible" width="30%">
      <el-row class="rowCenter">
        <el-col :span="8">银行卡名称：</el-col>
        <el-col>
          <el-input v-model="setQuery.bank_name" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row class="rowCenter">
        <el-col :span="8">请上传图片：</el-col>
        <el-col>
          <li class="uploadimg">
            <el-upload
              ref="upload"
              action
              list-type="picture-card"
              :on-change="onChange"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :auto-upload="false"
              :class="{hide:hideUpload}"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <p style="margin-top:10px">上传图片比例是12:5的等比大小，参考尺寸710*304像素</p>
          </li>
          <!-- <el-input v-model="setQuery.site_title" placeholder="请输入内容"></el-input> -->
        </el-col>
      </el-row>
      <el-row class="rowCenter">
        <el-col :span="8">是否设为默认：</el-col>
        <el-col>
          <el-radio v-model="radio" label="1" border size="small">是</el-radio>
          <el-radio v-model="radio" label="0" border size="small">否</el-radio>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './banckcard' }">运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>银行卡背景</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 新增删除 -->
    <el-row class="setStatusRow">
      <el-button @click="showDialog()" icon="el-icon-plus" type="primary">新增</el-button>
      <el-button @click="delInfo()" icon="el-icon-delete" type="primary">批量删除</el-button>
    </el-row>
    <!-- 搜索表单 -->
    <div class="clearfix" id="form_menu">
      <!-- 银行卡ID -->
      <div class="form_item">
        <span>银行卡ID</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.bank_bg_id"></el-input>
      </div>
      <!-- 银行卡名称 -->
      <div class="form_item">
        <span>银行卡名称</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.bank_name"></el-input>
      </div>
      <!-- 评价时间 -->
      <div class="form_item">
        <span>评价时间</span>
        <el-date-picker
          @change="getTime"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          v-model="dateStr"
          value-format="timestamp"
        ></el-date-picker>
      </div>
      <!-- 搜索 重置 -->
      <div class="form_item" style="margin-left: -15px;">
        <el-button @click="getSearch" style="background-color:#4371E8;width:75px;" type="primary">搜索</el-button>
        <el-button @click="clearlistQuery" style="margin-left:30px;width:75px;">重置</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div id="actList">
      <el-table
        :data="list"
        :header-cell-style="{background:'#ccc',color:'#333', fontWeight: '800'}"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        v-loading="listLoading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="银行卡ID" prop="id" width="80"></el-table-column>
        <el-table-column align="center" label="银行卡名称" prop="bank_name" width="200"></el-table-column>
        <el-table-column align="center" label="背景色图片" prop="image_url" width="300">
          <template slot-scope="{row}">
            <img :src="row.image_url" alt />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="添加时间"
          prop="create_time"
          show-overflow-tooltip
          width="200"
        ></el-table-column>
        <el-table-column align="center" label="是否为默认" prop="is_default_value" width="200"></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-link @click="showDialog(row)" class="el_link" type="primary">编辑</el-link>
              <el-link
                :disabled="row.is_default?true:false"
                @click="setDefault(row.id)"
                class="el_link"
                type="primary"
              >设为默认</el-link>
              <el-link type="danger" class="el_link" @click="delInfo(row.id)">删除</el-link>
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
  </div>
</template>

<script>
import axios from "axios"
import { getBase64 } from "../../utils/base64.js";
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
        bank_bg_id: '', //ID(传入则编辑)
        bank_name: '', //银行名称
        create_time: '' //添加时间
      },

      img1: "",
      dialogImageUrl: "", //图片路径
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      dialogImageUrl2: "", //图片路径
      dialogVisible2: false, //是否显示
    }
  },
  created() {
    this.getList()
  },
  computed: {},
  filters: {
    statusFilter(status) {
      if (status) return
    }
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.setQuery = {
          bank_bg_id: '', //ID(传入则编辑)
          bank_name: '', //银行名称
          image_url: '', //背景图片
          is_default: '1' //是否默认(0否，1是)
        }
        this.hideUpload = false
        setTimeout(() => {
          this.$refs.upload.clearFiles();
        }, 100)
      }
      // console.log(this.dialogVisible)
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
          resolve(res);
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
          url: '/backend/Operation/bankBgList',
          params: this.listQuery
        }).then(res => {
          resolve(res);
          this.listLoading = false
          this.list = res.data.data.data
          this.total = res.data.data.total
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
      if (row) {
        this.setQuery = {
          bank_bg_id: row.id, //ID(传入则编辑)
          bank_name: row.bank_name, //银行名称
          image_url: row.image_url, //背景图片
          is_default: '1' //是否默认(0否，1是)
        }
      } else {
        this.setQuery = {
          bank_bg_id: '', //ID(传入则编辑)
          bank_name: '', //银行名称
          image_url: '', //背景图片
          is_default: '1' //是否默认(0否，1是)
        }
      }
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
        bank_bg_id: '',
        bank_name: '',
        create_time: ''
      }
      this.dateStr = '' //有时间组件必填
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
          console.log(res.data.data);
          this.setQuery.image_url = res.data.data.url;
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
  }
}
</script>
<style lang="scss">
@import "../../styles/duo.scss";
</style>
<style lang="scss" scoped>
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
    width: 70px;
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
</style>
