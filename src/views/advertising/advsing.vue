<!--
 * @Description: 广告管理
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 11:29:09
 -->
<template>
  <div class="pagelist platform">
    <el-dialog class="duodialog" title="广告物料" :visible.sync="dialogVisible">
      <el-form :model="form" ref="form" :rules="rules" label-width="120px">
        <el-form-item label="广告类型" prop="banner_type">
          <el-radio-group v-model="form.banner_type" size="small">
            <!-- <el-radio
              v-for="item in typelist"
              :key="item.value"
              :label="item.label"
              border
            >{{item.value}}平台</el-radio>-->
            <el-radio label="1" border>平台</el-radio>
            <el-radio label="2" border>商家</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="广告标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="排序数值" prop="sort">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>
        <el-form-item label="跳转类型" prop="jump_type">
          <el-select placeholder="请选择" v-model="form.jump_type">
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in jump_typeList"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="isshowurl" label="外部链接" prop="jump_url">
          <el-input v-model="form.jump_url"></el-input>
        </el-form-item>
        <el-form-item v-show="isshowtiao" label="跳转ID" prop="jump_id">
          <el-input v-model="form.jump_id"></el-input>
        </el-form-item>
        <el-form-item label="有效期">
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
        <!-- :class="{hide:hideUpload}" -->
        <el-form-item label="广告图片">
          <el-upload
            ref="upload"
            action
            list-type="picture-card"
            :on-change="onChange"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :auto-upload="false"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-row class="tiprow">上传图片最佳尺寸为710*212像素，比例17:5其它尺寸会影响页面效果，格式为png，jpg，jpeg，上传图片的大小不超过2M</el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 列表 -->
    <div id="actList">
      <h1>APP首页banner</h1>
      <el-table
        :data="apphomelist"
        border
        :header-cell-style="{color:'#333', fontWeight: '800'}"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        v-loading="listLoading1"
      >
        <el-table-column
          show-overflow-tooltip
          prop="banner_nums"
          label="广告位数量"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column prop="being" label="在线使用中数量" width="200" align="center"></el-table-column>
        <el-table-column prop="waiting" label="排期数量" width="200" align="center"></el-table-column>
        <el-table-column prop="address" label="地区" width="650" align="center">
          <template slot="header">
            <el-row style="display:flex">
              地区
              <el-select
                clearable
                v-model="sheng"
                @change="choseProvince1"
                placeholder="省级地区"
                no-data-text="请选择省份"
              >
                <el-option
                  v-for="item in province"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                style="margin:0 10px;"
                v-model="shi"
                :disabled="isSelectDisabled1"
                @change="choseCity1"
                placeholder="市级地区"
                no-data-text="请选择城市"
                clearable
              >
                <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-button @click="toList(1)" type="text">查看广告列表</el-button>
              <el-button @click="showDialog(row,1)" type="text">投放广告</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <h1>外卖首页banner</h1>
      <el-table
        :data="takeoutlist"
        border
        :header-cell-style="{color:'#333', fontWeight: '800'}"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        v-loading="listLoading2"
      >
        <el-table-column
          show-overflow-tooltip
          prop="banner_nums"
          label="广告位数量"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column prop="being" label="在线使用中数量" width="200" align="center"></el-table-column>
        <el-table-column prop="waiting" label="排期数量" width="200" align="center"></el-table-column>
        <el-table-column prop="address" label="地区" width="650" align="center">
          <template slot="header">
            <el-row style="display:flex">
              地区
              <el-select
                clearable
                v-model="shenga"
                @change="choseProvince2"
                placeholder="省级地区"
                no-data-text="请选择省份"
              >
                <el-option
                  v-for="item in province"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                style="margin:0 10px;"
                v-model="shia"
                @change="choseCity2"
                placeholder="市级地区"
                no-data-text="请选择城市"
                clearable
              >
                <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
              <el-select
                clearable
                no-data-text="请选择区"
                v-model="qua"
                @change="choseBlock2"
                placeholder="区级地区"
              >
                <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-button @click="toList(2)" type="text">查看广告列表</el-button>
              <el-button @click="showDialog(row, 2)" type="text">投放广告</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <h1>团购首页banner</h1>
      <el-table
        :data="grouplist"
        border
        :header-cell-style="{color:'#333', fontWeight: '800'}"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        v-loading="listLoading3"
      >
        <el-table-column
          show-overflow-tooltip
          prop="banner_nums"
          label="广告位数量"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column prop="being" label="在线使用中数量" width="200" align="center"></el-table-column>
        <el-table-column prop="waiting" label="排期数量" width="200" align="center"></el-table-column>
        <el-table-column prop="address" label="地区" width="650" align="center">
          <template slot="header">
            <el-row>
              地区
              <el-select
                clearable
                v-model="shengb"
                @change="choseProvince3"
                placeholder="省级地区"
                no-data-text="请选择省份"
              >
                <el-option
                  v-for="item in province"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                style="margin:0 10px;"
                v-model="shib"
                @change="choseCity3"
                placeholder="市级地区"
                no-data-text="请选择城市"
                clearable
              >
                <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
              <el-select
                clearable
                no-data-text="请选择区"
                v-model="qub"
                @change="choseBlock3"
                placeholder="区级地区"
              >
                <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
              </el-select>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-button @click="toList(4)" type="text">查看广告列表</el-button>
              <el-button @click="showDialog(row,4)" type="text">投放广告</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <h1>商城首页banner</h1>
      <el-table
        :data="shoplist"
        border
        :header-cell-style="{color:'#333', fontWeight: '800'}"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        v-loading="listLoading4"
      >
        <el-table-column
          show-overflow-tooltip
          prop="banner_nums"
          label="广告位数量"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column prop="being" label="在线使用中数量" width="200" align="center"></el-table-column>
        <el-table-column prop="waiting" label="排期数量" width="200" align="center"></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-button @click="toList(3)" type="text">查看广告列表</el-button>
              <el-button @click="showDialog(row,3)" type="text">投放广告</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <h1>京东优选首页banner</h1>
      <el-table
        :data="jdList"
        border
        :header-cell-style="{color:'#333', fontWeight: '800'}"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        v-loading="listLoading6"
      >
        <el-table-column
          show-overflow-tooltip
          prop="banner_nums"
          label="广告位数量"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column prop="being" label="在线使用中数量" width="200" align="center"></el-table-column>
        <el-table-column prop="waiting" label="排期数量" width="200" align="center"></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-button @click="toList(6)" type="text">查看广告列表</el-button>
              <el-button @click="showDialog(row,6)" type="text">投放广告</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { timestampToTime } from "../../utils/util.js";
import { getBase64 } from "../../utils/base64.js";
export default {
  data() {
    return {
      // 列表公共
      page: 1,
      size: 20,
      total: 0,
      listLoading1: false, //loading图标
      listLoading2: false, //loading图标
      listLoading3: false, //loading图标
      listLoading4: false, //loading图标
      listLoading6: false, //loading图标
      list: [], //表格列表
      info: {}, //详情
      multipleSelection: "", //列表选中字符串
      time: "", //日期组件展示用
      dialogVisible: false, //弹框

      form: {
        module_type: "", //模块类型(1APP首页banner，2外卖首页banner，3商城首页banner，4团购首页banner)
        banner_type: "", //广告类型(1平台，2商家)
        title: "",
        sort: "",
        jump_url: "",
        jump_id: "",
        jump_type: "",
        active_start_time: "",
        active_end_time: "",
        cover: "",
        banner_id: "",
        province: "",
        city: "",
        area: ""
      },
      rules: {
        banner_type: [
          { required: true, message: "请选择广告类型", trigger: "change" }
        ],
        title: [{ required: true, message: "请输入广告标题", trigger: "blur" }]
        // date1: [
        //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        // ],
        // date2: [
        //   { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        // ],
        // type: [
        //   { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        // ],
        // resource: [
        //   { required: true, message: '请选择活动资源', trigger: 'change' }
        // ],
        // desc: [
        //   { required: true, message: '请填写活动形式', trigger: 'blur' }
        // ]
      },

      // 特定页面
      apphomelist: [],
      takeoutlist: [],
      shoplist: [],
      grouplist: [],
      jdList: [],
      //请求接口参数
      /**APP首页banner参数 */
      listQuery1: {
        module_type: 1,
        province: "",
        city: "",
        area: ""
      },
      /**外卖首页banner参数 */
      listQuery2: {
        module_type: 2,
        province: "",
        city: "",
        area: ""
      },
      /**商城首页banner参数 */
      listQuery3: {
        module_type: 3,
        province: "",
        city: "",
        area: ""
      },
      /**团购首页banner参数 */
      listQuery4: {
        module_type: 4,
        province: "",
        city: "",
        area: ""
      },
      /**京东优选首页banner参数 */
      listQuery6: {
        module_type: 6,
        province: "",
        city: "",
        area: ""
      },
      /**跳转类型 1商城商品详情，2代金券详情，3套餐详情，4外卖店铺详情，5商城店铺详情，6团购店铺详情，7地址链接 */
      jump_typeList: [
        {
          value: "1",
          label: "商城商品详情"
        },
        {
          value: "2",
          label: "代金券详情"
        },
        {
          value: "3",
          label: "套餐详情"
        },
        {
          value: "4",
          label: "外卖店铺详情"
        },
        {
          value: "5",
          label: "商城店铺详情"
        },
        {
          value: "6",
          label: "团购店铺详情"
        },
        {
          value: "7",
          label: "地址链接"
        },
          {
          value: "8",
          label: "小哥自营商品详情"
        }
      ],

      //省市区
      mapJson: "./json/map.json",
      province: [],
      sheng: "",
      shenga: "",
      shengb: "",
      shi: "",
      shia: "",
      shib: "",
      shi1: [],
      // shi1: [],
      qua: "",
      qub: "",
      qu1: [],
      city: "",

      isSelectDisabled1: false,
      isSelectDisabled2: false,
      isSelectDisabled3: false,

      // img1: "",
      dialogImageUrl: "", //图片路径
      // dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      // dialogImageUrl2: "", //图片路径
      // dialogVisible2: false, //是否显示
      //广告类型(1平台，2商家)
      // selectlist: [{
      //   value: 1,
      //   label: '平台'
      // }, {
      //   value: 2,
      //   label: '商家'
      // }]

      isshowtiao: false,
      isshowurl: false
    };
  },
  created() {
    this.getList1();
    this.getList2();
    this.getList3();
    this.getList4();
    this.getList6();
    this.getCityData();
  },
  watch: {
    "form.jump_type"() {
      if (this.form.jump_type == "7") {
        this.isshowurl = true;
        this.isshowtiao = false;
      } else {
        this.isshowtiao = true;
        this.isshowurl = false;
      }
    },
    dialogVisible() {
      if (!this.dialogVisible) {
        this.form = {
          module_type: "", //模块类型(1APP首页banner，2外卖首页banner，3商城首页banner，4团购首页banner，5京东)
          banner_type: "", //广告类型(1平台，2商家)
          title: "",
          sort: "",
          jump_url: "",
          jump_id: "",
          jump_type: "",
          active_start_time: "",
          active_end_time: "",
          cover: "",
          banner_id: "",
          province: "",
          city: "",
          area: ""
        };
        this.time = "";
        setTimeout(() => {
          this.$refs.upload.clearFiles();
        }, 100);
      }
      // console.log(this.dialogVisible)
    },
    hideUpload() {
      console.log(11, this.hideUpload);
    }
  },
  methods: {
    /**选择时间*/
    getTime(val) {
      // let startTime = val[0] / 1000
      // let endTime = val[1] / 1000
      this.form.active_start_time = val[0] / 1000;
      this.form.active_end_time = val[1] / 1000;
      // this.listQuery.update_time = startTime + '-' + endTime
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
          this.form.cover = res.data.data.url;
        });
      });
      this.dialogImageUrl = file.url;
      this.hideUpload = fileList.length >= this.limitCount;
    },
    //限制图片大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024;
      if (isLt2M > 2) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },

    /**获取列表 */
    getList1() {
      return new Promise((resolve, reject) => {
        this.listLoading1 = true;
        this.$axios({
          method: "GET",
          url: "/backend/Operation/bannerCount",
          params: this.listQuery1
        }).then(res => {
          resolve(res);
          this.listLoading1 = false;
          this.apphomelist = [];
          this.apphomelist.push(res.data.data);
          // this.total = res.data.data.total
        });
      });
    },
    getList2() {
      return new Promise((resolve, reject) => {
        this.listLoading2 = true;
        this.$axios({
          method: "GET",
          url: "/backend/Operation/bannerCount",
          params: this.listQuery2
        }).then(res => {
          resolve(res);
          this.listLoading2 = false;
          this.takeoutlist = [];
          this.takeoutlist.push(res.data.data);
          // this.total = res.data.data.total
        });
      });
    },
    getList3() {
      return new Promise((resolve, reject) => {
        this.listLoading3 = true;
        this.$axios({
          method: "GET",
          url: "/backend/Operation/bannerCount",
          params: this.listQuery3
        }).then(res => {
          resolve(res);
          this.listLoading3 = false;
          this.grouplist = [];
          this.grouplist.push(res.data.data);
          console.log("this.grouplist", this.grouplist);
          // this.total = res.data.data.total
        });
      });
    },
    getList4() {
      return new Promise((resolve, reject) => {
        this.listLoading4 = true;
        this.$axios({
          method: "GET",
          url: "/backend/Operation/bannerCount",
          params: this.listQuery4
        }).then(res => {
          resolve(res);
          this.listLoading4 = false;
          this.shoplist = [];
          this.shoplist.push(res.data.data);
          // this.total = res.data.data.total
        });
      });
    },
    getList6() {
      return new Promise((resolve, reject) => {
        this.listLoading5 = true;
        this.$axios({
          method: "GET",
          url: "/backend/Operation/bannerCount",
          params: this.listQuery6
        }).then(res => {
          resolve(res);
          this.listLoading6 = false;
          this.jdList = [];
          this.jdList.push(res.data.data);
          // this.total = res.data.data.total
        });
      });
    },
    /**查看详情 */
    // getInfo(id) {
    //   console.log(id)
    //   this.dialogVisible = true
    //   this.$axios({
    //     method: 'GET',
    //     url: '/backend/Article/serviceArticle',
    //     params: { message_id: id }
    //   }).then(res => {
    //     this.info = res.data.data
    //   })
    // },

    /**去列表页 */
    toList(module_type_p) {
      // console.log(row)
      let region = {};
      switch (module_type_p) {
        case 1:
          region = this.listQuery1;
          break;
        case 2:
          region = this.listQuery2;
          break;
        case 3:
          region = this.listQuery3;
          break;
        case 4:
          region = this.listQuery4;
          break;
        case 6:
          region = this.listQuery6;
          break;
        default:
          console.log("错误，没有参数");
      }
      this.$router.push({
        name: "advsingList",
        params: { module_type_p, region }
      });
    },
    /**弹窗 */
    showDialog(row, module_type_id) {
      switch (module_type_id) {
        case 1:
          this.form.province = this.sheng;
          this.form.city = this.shi;
          break;
        case 2:
          this.form.province = this.shenga;
          this.form.city = this.shia;
          this.form.area = this.qua;
          break;
        case 3:
          this.form.province = this.shengb;
          this.form.city = this.shib;
          this.form.area = this.qub;
          break;
        default:
          console.log("showDialog没有module_type_id参数");
      }
      this.dialogVisible = true;
      // this.hideUpload = false
      this.form.module_type = module_type_id;
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
            this.$message.success(res.data.msg);
            this.getList1();
            this.getList2();
            this.getList3();
            this.getList4();
            this.getList5();
          } else {
            this.listLoading = false;
            this.$message(res.data.msg);
          }
        });
      });
    },
    //编辑投放广告
    submitForm(formName) {
      // console.log(this.form)
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form);
          this.post("/backend/Operation/setBanner", this.form).then(() => {
            this.dialogVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      console.log(formName);
      this.dialogVisible = false;
    },
    // 异常：用watch监控dialog隐藏就触发this.$refs[formName].resetFields();this.$refs.upload.clearFiles();

    /**启用禁用; 状态(1启用，2禁用)； 有id是单独操作，否则批量操作*/
    handallEnable(status, id) {
      let _url, txt;
      if (status == 2) {
        //当前是禁用状态，触发启动接口
        txt = "启动";
        _url = "/backend/Operation/deliveryUsing ";
      } else {
        txt = "禁用";
        _url = "/backend/Operation/deliveryForbidden";
      }
      this.$confirm(`确定${txt}选中内容？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.post(_url, { delivery_id: id });
      });
    },
    // 加载china地点数据，三级
    getCityData() {
      var that = this;
      axios
        .get(this.mapJson)
        .then(function(response) {
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
            // this.province.unshift("全国")
          } else {
            console.log(response.status);
          }
          that.province.unshift({ id: 1, value: "全国" });
        })
        .catch(function(error) {
          console.log(typeof +error);
        });
    },
    // 选省
    choseProvince1(e) {
      // console.log(e)
      if (e == 1) {
        this.isSelectDisabled1 = true;
      } else {
        this.isSelectDisabled1 = false;
        for (var index2 in this.province) {
          if (e === this.province[index2].id) {
            this.shi1 = this.province[index2].children;
            this.shi = "";
            // this.shi = this.province[index2].children[0].value;
            // this.setQuery.city = this.province[index2].children[0].value;
            this.qu1 = this.province[index2].children[0].children;
            // this.qu = this.province[index2].children[0].children[0].value;
            // this.setQuery.area = this.province[index2].children[0].children[0].value;
            this.E = this.qu1[0].id;
            this.sheng = this.province[index2].value;
            // this.setQuery.province = this.province[index2].value;
            console.log("选省", this.sheng);
            console.log("选省", this.E);
          }
        }
      }
    },
    // 选市
    choseCity1(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          // this.setQuery.area = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shi = this.city[index3].value;
          // this.setQuery.city = this.city[index3].value;
          console.log("选市", this.shi);
          console.log("选市", this.E);
        }
      }
      this.listQuery1.province = this.sheng;
      this.listQuery1.city = this.shi;
      console.log(this.listQuery1);
      if (this.listQuery1.city) {
        this.getList1();
      }
    },
    // 选省
    choseProvince2(e) {
      // console.log(e)
      if (e == 1) {
        this.isSelectDisabled1 = true;
      } else {
        this.isSelectDisabled1 = false;
        for (var index2 in this.province) {
          if (e === this.province[index2].id) {
            this.shi1 = this.province[index2].children;
            // this.shia = ''
            this.shia = this.province[index2].children[0].value;
            // this.setQuery.city = this.province[index2].children[0].value;
            this.qu1 = this.province[index2].children[0].children;
            // this.qua = this.province[index2].children[0].children[0].value;
            // this.setQuery.area = this.province[index2].children[0].children[0].value;
            this.E = this.qu1[0].id;
            this.shenga = this.province[index2].value;
            // this.setQuery.province = this.province[index2].value;
            console.log("选省", this.sheng);
            console.log("选省", this.E);
          }
        }
      }
    },
    // 选市
    choseCity2(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qua = "";
          // this.qua = this.city[index3].children[0].value;
          // this.setQuery.area = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shia = this.city[index3].value;
          // this.setQuery.city = this.city[index3].value;
          console.log("选市", this.shi);
          console.log("选市", this.E);
        }
      }
      this.listQuery2.province = this.shenga;
      this.listQuery2.city = this.shia;
      this.listQuery2.area = this.qua;
    },
    // 选区
    choseBlock2(e) {
      this.E = e;
      for (var i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.qua = this.qu1[i].value;
        }
      }
      this.listQuery2.province = this.shenga;
      this.listQuery2.city = this.shia;
      this.listQuery2.area = this.qua;
      if (this.listQuery2.area) {
        this.getList2();
      }
      console.log("选区", this.E);
    },
    // 选省
    choseProvince3(e) {
      // console.log(e)
      if (e == 1) {
        this.isSelectDisabled1 = true;
      } else {
        this.isSelectDisabled1 = false;
        for (var index2 in this.province) {
          if (e === this.province[index2].id) {
            this.shi1 = this.province[index2].children;
            // this.shib = ''
            this.shib = this.province[index2].children[0].value;
            // this.setQuery.city = this.province[index2].children[0].value;
            this.qu1 = this.province[index2].children[0].children;
            // this.qub = this.province[index2].children[0].children[0].value;
            // this.setQuery.area = this.province[index2].children[0].children[0].value;
            this.E = this.qu1[0].id;
            this.shengb = this.province[index2].value;
            // this.setQuery.province = this.province[index2].value;
            console.log("选省", this.sheng);
            console.log("选省", this.E);
          }
        }
      }
    },
    // 选市
    choseCity3(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qub = "";
          // this.qub = this.city[index3].children[0].value;
          // this.setQuery.area = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shib = this.city[index3].value;
          // this.setQuery.city = this.city[index3].value;
          console.log("选市", this.shi);
          console.log("选市", this.E);
        }
      }
      this.listQuery3.province = this.shengb.toString();
      this.listQuery3.city = this.shib;
      this.listQuery3.area = this.qub;
      // this.getList3()
    },
    // 选区
    choseBlock3(e) {
      this.E = e;
      for (var i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.qub = this.qu1[i].value;
          // this.setQuery.area = this.qu1[i].value;
          console.log("选区", this.qu, this.sheng + this.shi + this.qu);
        }
      }
      this.listQuery3.province = this.shengb;
      this.listQuery3.city = this.shib;
      this.listQuery3.area = this.qub;
      if (this.listQuery3.area) {
        this.getList3();
      }

      console.log("选区", this.E);
    }
  }
};
</script>
<style lang="scss">
@import "../../styles/duo.scss";
</style>
<style lang="scss" scoped>
.el-radio {
  margin-right: 10px;
}
.el-table .cell,
.el-table th div {
  padding-right: 0;
}
.el-row {
  display: flex;
  justify-content: center;
  // margin-top: 20px;
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
  .el-table th div {
    padding: 0;
    .el-select--small {
      margin-left: 10px;
      width: 150px;
    }
  }
  .el-dialog {
    width: 40%;
    .el-input--small {
      width: 90%;
    }
  }
  //超过限制数量添加类命
  .hide .el-upload {
    display: none;
  }
}
</style>
