<!--
 * @Description: 广告管理
 * @LastEditors: duo
 * @LastEditTime: 2019-10-14 11:08:40
 -->
<template>
  <div class="pagelist platform">
    <el-dialog title="广告物料" :visible.sync="dialogVisible">
      <el-form :model="form" ref="form" label-width="120px">
        <el-form-item label="广告类型：" prop="banner_type">{{form.banner_type==1?'平台':'商家'}}</el-form-item>
        <el-form-item label="广告标题：" prop="title">
          {{form.title}}
          <!-- <el-input v-model="form.title"></el-input> -->
        </el-form-item>
        <el-form-item label="排序数值：" prop="sort">
          {{form.sort}}
          <!-- <el-input v-model="form.sort"></el-input> -->
        </el-form-item>
        <el-form-item label="外部链接：" prop="jump_url">
          {{form.jump_url}}
          <!-- <el-input v-model="form.jump_url"></el-input> -->
        </el-form-item>
        <el-form-item label="有效期：">
          <el-date-picker
            @change="getTime"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="datetimerange"
            v-model="time"
            value-format="timestamp"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="广告图片：">
          <el-upload
            ref="upload"
            action
            list-type="picture-card"
            :on-change="onChange"
            :class="{hide:true}"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :auto-upload="false"
            :limit="1"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-row class="tiprow">上传图片最佳尺寸为710*212像素，比例17:5其它尺寸会影响页面效果，格式为png，jpg，jpeg，上传图片的大小不超过2M</el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <!-- <el-button v-show="isSee" type="primary" @click="submitForm('form')">确 定</el-button> -->
      </div>
    </el-dialog>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './advsing' }">广告管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <el-row>
      <el-button @click="toInfo()" icon="el-icon-plus" type="primary">新增</el-button>
    </el-row>-->
    <div class="clearfix" style="margin-bottom:20px;">
      <div class="form_item">
        <span>广告ID</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.id"></el-input>
      </div>
      <div class="form_item">
        <span>广告标题</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.title"></el-input>
      </div>
      <div class="form_item">
        <span>状态</span>
        <el-select placeholder="请选择" v-model="listQuery.status">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in selectlist"
          ></el-option>
        </el-select>
      </div>
      <div class="form_item" v-show="isShowSelect">
        <span>地区</span>
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
          class="setMarg"
          v-model="shi"
          @change="choseCity"
          placeholder="市级地区"
          no-data-text="请选择城市"
          clearable
        >
          <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
        <!-- 异常，设置显示隐藏 -->
        <el-select
          clearable
          no-data-text="请选择区"
          v-model="qu"
          @change="choseBlock"
          placeholder="区级地区"
          v-show="isshowqu"
        >
          <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </div>

      <!-- 推送时间 -->
      <!-- <div class="form_item">
        <span>更新时间</span>
        <el-date-picker
          @change="getTime"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          v-model="time"
          value-format="timestamp"
        ></el-date-picker>
      </div>-->
      <div class="form_item">
        <el-button @click="getSearch" type="primary">搜索</el-button>
        <el-button @click="clearlistQuery">重置</el-button>
      </div>
    </div>

    <!-- 列表 -->
    <div id="actList">
      <el-table
        :data="list"
        border
        :header-cell-style="{color:'#333', fontWeight: '800'}"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        v-loading="listLoading"
      >
        <el-table-column show-overflow-tooltip prop="id" label="广告ID" align="center" width="80"></el-table-column>
        <el-table-column prop="title" label="广告标题" width="150" align="center"></el-table-column>
        <el-table-column prop="module_type_value" label="广告位" width="150" align="center"></el-table-column>
        <el-table-column sortable prop="active_start_time" label="开始时间" width="200" align="center"></el-table-column>
        <el-table-column sortable prop="active_end_time" label="结束时间" width="200" align="center"></el-table-column>
        <el-table-column prop="address" label="地区" width="150" align="center"></el-table-column>
        <el-table-column prop="banner_type_value" label="广告类型" width="150" align="center"></el-table-column>
        <el-table-column prop="sort" label="排序数值" width="150" align="center"></el-table-column>
        <el-table-column prop="status_value" label="状态" width="150" align="center"></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-button @click="showDialog(row)" type="text">查看</el-button>
              <!-- <el-button @click="showDialog(row)" type="text">{{row.status==4?'编辑':'查看'}}</el-button> -->
              <el-button @click="deleteOne(row)" type="text">{{row.status_value == 1?'取消':'删除'}}</el-button>
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
        :current-page="page"
        :page-sizes="[20, 50, 100]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-row>
  </div>
</template>
<script>
import axios from "axios"
import { timestampToTime } from "../../utils/util.js";
import { getBase64 } from "../../utils/base64.js";
export default {
  data() {
    return {
      // 列表公共
      page: 1,
      size: 20,
      total: 0,
      listLoading: true, //loading图标
      list: [], //表格列表
      info: {}, //详情
      multipleSelection: '', //列表选中字符串
      time: [],//日期组件展示用
      dialogVisible: false, //弹框


      // 特定页面
      isShowSelect: true,//是否显示省市区下拉框
      isshowqu: true,//是否显示区选择框
      isSee: true,//是否显示弹框中的确定按钮
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 20, //每页数据
        id: '',
        title: '',
        status: '', //状态(1、进行中、2、已结束、3、已取消、4、排期中)
        module_type: '', //模块类型(1APP首页banner，2外卖首页banner，3商城首页banner，4团购首页banner)
        province: '',
        city: '',
        area: '',
      },
      //状态(1、进行中、2、已结束、3、已取消、4、排期中)
      selectlist: [{
        value: 1,
        label: '进行中'
      }, {
        value: 2,
        label: '已结束'
      }, {
        value: 3,
        label: '已取消'
      }, {
        value: 4,
        label: '排期中'
      }],

      //广告类型(1平台，2商家)
      typelist: [{
        label: 1,
        value: '平台'
      }, {
        label: 2,
        value: '商家'
      }],

      form: {
        module_type: '',//模块类型(1APP首页banner，2外卖首页banner，3商城首页banner，4团购首页banner)
        banner_type: '', //广告类型(1平台，2商家)
        title: '',
        sort: '',
        jump_url: '',
        active_start_time: '',
        active_end_time: '',
        cover: '',
        banner_id: '',
        province: '',
        city: '',
        area: '',
      },
      // rules: {
      //   banner_type: [
      //     { required: true, message: '请选择广告类型', trigger: 'change' },
      //   ],
      //   title: [
      //     { required: true, message: '请输入广告标题', trigger: 'blur' }
      //   ]
      // },
      dialogImageUrl: "", //图片路径
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量

      //省市区
      mapJson: "./json/map.json",
      province: [],
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",

      fileList: []
    };
  },
  created() {
    this.listQuery.module_type = this.$route.params.module_type_p
    this.listQuery.province = this.$route.params.region.province
    this.listQuery.city = this.$route.params.region.city
    this.listQuery.area = this.$route.params.region.area
    this.sheng = this.$route.params.region.province
    this.shi = this.$route.params.region.city
    this.qu = this.$route.params.region.area
    if (this.listQuery.module_type == 1) {
      this.isshowqu = false
    } else if (this.listQuery.module_type == 4) {
      this.isShowSelect = false
    }
    this.getList();
    this.getInfo();
    this.getCityData()
    console.log(this.listQuery.module_type)
  },
  watch: {
    dialogVisible() {
      if (!this.dialogVisible) {
        this.form = {
          module_type: '', //模块类型(1APP首页banner，2外卖首页banner，3商城首页banner，4团购首页banner)
          banner_type: '', //广告类型(1平台，2商家)
          title: '',
          sort: '',
          jump_url: '',
          active_start_time: '',
          active_end_time: '',
          cover: '',
          banner_id: '',
          province: '',
          city: '',
          area: '',
        }
        this.fileList = []
        this.time = []
        setTimeout(() => {
          this.$refs.upload.clearFiles();
        }, 100)
      }
      console.log('dialogVisible', this.dialogVisible)
    },
    time() {
      console.log(111, this.time)
    }
  },
  methods: {
    /**获取列表 */
    getList() {
      return new Promise((resolve, reject) => {
        // console.log(this.listQuery)
        this.listLoading = true
        this.$axios({
          method: 'GET',
          url: '/backend/Operation/bannerList',
          params: this.listQuery
        }).then(res => {
          resolve(res);
          this.listLoading = false
          this.list = res.data.data.data
          this.total = res.data.data.total
        })
      })
    },
    /**查看详情 */
    getInfo(id) {
      // this.post('/backend/Operation/bannerDetail', {banner_id}this.$route.params.module_type_p)
      // console.log(id)
      // this.dialogVisible = true
      // this.$axios({
      //   method: 'GET',
      //   url: '/backend/Article/serviceArticle',
      //   params: { message_id: id }
      // }).then(res => {
      //   this.info = res.data.data
      // })
    },
    /**去详情页 */
    toInfo(row) {
      let titletxt = row ? "编辑" : "新增"
      this.$router.push({ name: 'advsingEdit', params: { row, titletxt } })
    },

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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form)
          this.post('/backend/Operation/setBanner', this.form)
          // this.dialogVisible = false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      console.log(formName)
      this.dialogVisible = false
    },

    /**启用禁用; 状态(1启用，2禁用)； 有id是单独操作，否则批量操作*/
    handallEnable(status, id) {
      let _url, txt;
      if (status == 2) {//当前是禁用状态，触发启动接口
        txt = "启动"
        _url = "/backend/Operation/deliveryUsing"
      }
      else {
        txt = "禁用"
        _url = "/backend/Operation/deliveryForbidden"
      }
      this.$confirm(`确定${txt}选中内容？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.post(_url, { delivery_id: id })
      })
    },
    /**根据条件搜索 */
    getSearch() {
      //有地址写
      if (this.listQuery.module_type == 1) {
        this.listQuery.province = this.sheng
        this.listQuery.city = this.shi
      } else {
        this.listQuery.province = this.sheng
        this.listQuery.city = this.shi
        this.listQuery.area = this.qu
      }
      this.listQuery.page = 1
      this.getList()
    },
    /**重置 */
    clearlistQuery() {
      this.listQuery = {
        page: 1, //页码
        size: 20, //每页数据
        id: '',
        title: '',
        status: '',
        module_type: this.$route.params.module_type_p,
        province: '',
        city: '',
        area: '',
      }
      //有时间组件填
      // this.time = '' 

      //有地址时候填
      this.sheng = ''
      this.shi = ''
      this.qu = ''
      this.getList()
    },
    /**选择时间*/
    getTime(val) {
      // console.log()
      // let startTime = val[0] / 1000
      // let endTime = val[1] / 1000
      // this.listQuery.update_time = startTime + '-' + endTime
    },

    /**删除 */
    deleteOne(row) {//异常，做取消删除对接
      console.log(row)
      let txt = row.status_value == 1 ? '取消' : '删除'
      let _url = row.status_value == 1 ? '/backend/Operation/bannerCancel' : '/backend/Operation/bannerDel '
      this.$confirm(`确定${txt}选中内容？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'POST',
          url: _url,
          data: {
            banner_id: row.id
          }
        }).then(res => {
          this.getList()
        })
      })
    },
    /**选择每页多少条 */
    handleSizeChange(val) {
      console.log(`多少条: ${val}`)
      this.size = val
      this.getList()
    },
    /**选择第几页 */
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.getList()
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
          // this.setQuery.city = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.qu = this.province[index2].children[0].children[0].value;
          // this.setQuery.area = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
          this.sheng = this.province[index2].value;
          // this.setQuery.province = this.province[index2].value;
          console.log("选省", this.sheng);
          console.log("选省", this.E)
        }
      }
    },
    // 选市
    choseCity(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          // this.setQuery.area = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shi = this.city[index3].value;
          // this.setQuery.city = this.city[index3].value;
          console.log("选市", this.shi);
          console.log("选市", this.E)
        }
      }
    },
    // 选区
    choseBlock(e) {
      this.E = e;
      for (var i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.qu = this.qu1[i].value;
          // this.setQuery.area = this.qu1[i].value;
          console.log("选区", this.qu, this.sheng + this.shi + this.qu);
        }
      }
      console.log("选区", this.E)
    },
    //删除图片触发的事件
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.hideUpload = false;
      // this.hideUpload = fileList.length >= this.limitCount;
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
          this.form.cover = res.data.data.url;
        });
      });
      this.dialogImageUrl = file.url;
      // this.hideUpload = fileList.length >= this.limitCount;
    },
    //限制图片大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024;
      if (isLt2M > 2) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },

    /**弹窗 */
    showDialog(row) {
      this.dialogVisible = true
      let _banner_id = row.id
      this.$axios({
        method: 'GET',
        url: '/backend/Operation/bannerDetail',
        params: { banner_id: _banner_id }
      }).then(res => {
        let rowdata = res.data.data
        this.form = {
          module_type: rowdata.module_type,//模块类型(1APP首页banner，2外卖首页banner，3商城首页banner，4团购首页banner)
          banner_type: rowdata.banner_type, //广告类型(1平台，2商家)
          title: rowdata.title,
          sort: rowdata.sort,
          jump_url: rowdata.jump_url,
          active_start_time: rowdata.active_start_time,
          active_end_time: rowdata.active_end_time,
          banner_id: _banner_id
        }
        this.time.push(rowdata.active_start_time * 1000, rowdata.active_end_time * 1000)
        this.fileList.push({ name: 'default', url: rowdata.cover })
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.setMarg {
  margin: 0 8px;
}
.el-row {
  display: flex;
  margin-top: 20px;
}
.form_item {
  float: left;
  margin: 20px 30px 0 0;
  display: flex;
  &:first-child {
    margin-left: 0;
  }
  span {
    margin-right: 15px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
}
// .table_top_btn{
//   transform: translate(908px, 0)
// }
.tiprow {
  margin-top: 10px;
  line-height: 1.5;
}
</style>
<style lang="scss">
//有弹框时用
.platform {
  .el-dialog__header {
    display: flex;
  }
  .el-dialog__body {
    font-size: 16px;
    line-height: 2.5;
  }
}
.hide .el-upload {
  display: none;
}
</style>
