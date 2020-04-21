<!--
 * @Description: 配送列表
 * @LastEditors: Roc
 * @LastEditTime: 2020-03-20 11:46:25
 -->
<template>
  <div class="pagelist" id="dispatch">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './dispatch' }">运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>配送费列表</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>设置全国统一配送费</h1>
    <div style id="dispatchInfo">
      <el-card class="box-card">
        <el-form ref="form" :rules="rules" :model="form" label-width="130px" label-position="left">
          <el-form-item label="标准配送范围">
            <span>在</span>
            <el-input v-model="form.delivery_scope"></el-input>
            <span>公里以内，标准配送费</span>
            <el-input v-model="form.delivery_price"></el-input>
            <span>元。</span>
          </el-form-item>
          <el-form-item label="超过配送范围计价">
            <span>每超1公里，增加配送费</span>
            <el-input v-model="form.delivery_exceed_price"></el-input>
            <span>元。</span>
          </el-form-item>
          <el-form-item label="最大配送范围">
            <el-input v-model="form.delivery_max_scope"></el-input>
            <span>公里。</span>
          </el-form-item>

          <div v-for="(item,index) in nightTime" :key="index">
            <el-form-item :label="'夜间加价时间段'+(index+1)">
              <el-time-select
                @change="getTimehorizon(1)"
                placeholder="起始时间"
                v-model="item.start_time"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00',
                }"
              ></el-time-select>
              <el-time-select
                @change="getTimehorizon(2)"
                placeholder="结束时间"
                v-model="item.end_time"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00',
                }"
              ></el-time-select>
            </el-form-item>
            <el-form-item label="设置服务费">
              <span>夜间标准配送费</span>
              <el-input v-model="item.delivery_price"></el-input>
              <span>元。</span>
            </el-form-item>
          </div>

          <el-row>
            <el-button
              v-if="nightTime.length <= 1"
              type="primary"
              @click="setNight(1)"
              style="margin-bottom:20px"
            >添加夜间服务费</el-button>
            <el-button
              v-if="nightTime.length > 1"
              type="danger"
              @click="setNight(0)"
              style="margin-bottom:20px"
            >删除夜间服务费</el-button>
          </el-row>

          <div style="font-size: 14px;line-height: 1.5;">
            规则说明：
            <div>1.实际配送距离在标准配送范围距离内，实际配送费=标准配送费</div>
            <div>2.实际配送距离大于配送范围距离</div>
            <div>配送费=（实际配送距离－配送范围距离）*每超过1公里增加配送费＋标准配送费</div>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')" style="margin-top:10px">保存</el-button>
            <!-- <el-button>取消</el-button> -->
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <h1>配送费列表</h1>
    <el-row class="table_top_btn">
      <el-button @click="getSearch" type="primary">搜索</el-button>
      <el-button @click="clearlistQuery">重置</el-button>
      <el-button @click="toInfo()" icon="el-icon-plus" type="primary">新增</el-button>
    </el-row>
    <div class="clearfix">
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
      <!-- 类型(1省，2市，3区) -->
      <div class="form_item">
        <span>类型</span>
        <el-select placeholder="请选择" v-model="listQuery.area_type">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in searchtype"
          ></el-option>
        </el-select>
      </div>
      <!-- 状态(1已启用，2已禁用) -->
      <div class="form_item">
        <span>评价类型</span>
        <el-select placeholder="请选择" v-model="listQuery.status">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in searchstatus"
          ></el-option>
        </el-select>
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
        <el-table-column prop="id" label="序号" width="153" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="area" label="区域" align="center"></el-table-column>
        <el-table-column prop="area_type" label="类型" width="153" align="center"></el-table-column>
        <el-table-column sortable prop="update_time" label="设置时间" width="200" align="center"></el-table-column>
        <el-table-column prop="status_value" label="状态" width="153" align="center"></el-table-column>
        <el-table-column width="200" align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-button @click="toInfo(row)" type="text">编辑</el-button>
              <el-button
                @click="handallEnable(row.status, row.id)"
                type="text"
              >{{row.status==2?'启用':'禁用'}}</el-button>
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

    <!-- 返回 -->
    <!-- <el-button plain @click="backdown">返回上一页</el-button> -->
  </div>
</template>
<script>
import axios from "axios"
import { timestampToTime } from "../../utils/util.js";
export default {
  data() {
    return {
      list: {},
      page: 1,
      size: 20,
      total: '',

      //表单
      form: {
        delivery_scope: '',
        delivery_price: '',
        delivery_exceed_price: '',
        delivery_max_scope: ''
      },

      rules: {
        dateStr: [
          { delivery_max_scope: true, message: '最大配送范围', trigger: 'blur' },
          { delivery_exceed_price: true, message: '每超1公里增加配送费', trigger: 'blur' },
          { delivery_price: true, message: '标准配送费用', trigger: 'blur' },
          { delivery_scope: true, message: '标准配送范围', trigger: 'blur' },
          { night_service_time: true, message: '夜间加价时间段', trigger: 'blur' },
          { night_service_price: true, message: '夜间服务费', trigger: 'blur' },
        ]
      },

      numberValidateForm: {
        age: ''
      },
      // 循环两个夜间时间
      dynamicValidateForm: {
        domains: [{
          value: '',
          dateStr: '', //展示给用户看的时间段
        },
        {
          value: '',
          dateStr: '', //展示给用户看的时间段
        }],
      },

      listLoading: true, //loading图标
      list: [], //表格列表
      multipleSelection: '', //列表选中字符串

      total: 0, //总数据数
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 20, //每页数据
        area: '', //区域名称
        area_type: '', //类型(1省，2市，3区)
        status: '', //状态(1已启用，2已禁用)
        province: '',
        city: '',
        area: '',
      },
      //省市区参数
      setQuery: {
        id: '', //站点id
        province: '',
        city: '',
        area: '',
      },

      //省市区
      mapJson: "./json/map.json",
      province: [],
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",

      searchtype: [{ //搜索栏的类型，类型(1省，2市，3区)
        value: '1',
        label: '省'
      }, {
        value: '2',
        label: '市'
      }, {
        value: '3',
        label: '区'
      }],
      searchstatus: [{ //搜索栏的状态，状态(1已启用，2已禁用)
        value: '1',
        label: '启动'
      }, {
        value: "2",
        label: '禁用'
      }],

      nightTime: [{ start_time: '23:00', end_time: '06:00', delivery_price: '0' }]

    };
  },
  created() {
    this.getCityData()
    this.getList();
    this.getInfo();
  },
  methods: {
    setNight(e) {
      if (e) {
        this.nightTime.push({
          delivery_price: "",
          end_time: "",
          start_time: ""
        })
      } else {
        this.nightTime.pop()
      }
    },

    getTimehorizon(val) {
      // console.log(val)
      // console.log(1,this.form)
      // console.log(2,this.form.start_time1)
      // console.log(3,this.form.end_time1)
      let timeStr = this.form.start_time1 + '-' + this.form.end_time1
      let timeArr = []
      if (val == 1) {
        timeArr.push(timeStr)
        console.log(11, timeStr)
        console.log(22, timeArr)
      }
      else {
        timeArr.push(timeStr)
        console.log(11, timeStr)
        console.log(22, timeArr)
      }

    },

    /**去详情页 */
    toInfo(row) {
      let titletxt = row ? "编辑" : "新增"
      this.$router.push({ name: 'dispatchinfo', params: { row, titletxt } })
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
          if (res.data.code == 200) {
            resolve(res);
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
          // for (let item of this.nightTime) {
          //   item.delivery_time = item.start_time + '-' + item.end_time
          //   delete item.start_time
          //   delete item.end_time
          // }
          this.form.night_service = this.nightTime
          this.post('/backend/Operation/postGlobal', this.form).then(() => {
            this.getInfo()
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /**启用禁用; 状态(1启用，2禁用)； 有id是单独操作，否则批量操作*/
    handallEnable(status, id) {
      let _url, txt;
      if (status == 2) {//当前是禁用状态，触发启动接口
        txt = "启动"
        _url = "/backend/Operation/deliveryUsing "
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
      this.listQuery.province = this.sheng
      this.listQuery.city = this.shi
      this.listQuery.area = this.qu
      this.listQuery.page = 1
      this.getList()
    },
    /**重置 */
    clearlistQuery() {
      this.listQuery = {
        page: 1, //页码
        size: 20, //每页数据
        area: '', //区域名称
        area_type: '', //类型(1省，2市，3区)
        status: '', //状态(1已启用，2已禁用)
        province: '',
        city: '',
        area: '',
      }
      this.sheng = "";
      this.shi = "";
      this.qu = "";
      this.dateStr = '' //有时间组件必填
      this.getList()
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000
      let endTime = val[1] / 1000
      this.listQuery.create_time = startTime + '-' + endTime
    },

    /**获取列表 */
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.$axios({
          method: 'GET',
          url: '/backend/Operation/getDeliveries',
          params: this.listQuery
        }).then(res => {
          resolve(res);
          this.listLoading = false
          this.list = res.data.data.data
          this.total = res.data.data.total
        })
      })
    },

    /**获取详情 */
    getInfo() {
      this.$axios({
        method: "GET",
        url: "/backend/Operation/getGlobal",
      }).then(res => {
        if (res.data.data) {
          console.log('进来',this.form)
          this.form = res.data.data
          this.nightTime = this.form.night_service
        }

        console.log('不进来',this.form)
        
        // console.log(11, this.form)
        // console.log(22, this.nightTime)
      });
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
          this.setQuery.city = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.qu = this.province[index2].children[0].children[0].value;
          this.setQuery.area = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
          this.sheng = this.province[index2].value;
          this.setQuery.province = this.province[index2].value;
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
          this.setQuery.area = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shi = this.city[index3].value;
          this.setQuery.city = this.city[index3].value;
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
          this.setQuery.area = this.qu1[i].value;
          console.log("选区", this.qu, this.sheng + this.shi + this.qu);
        }
      }
      console.log("选区", this.E)
    }
  }
};
</script>
<style lang="scss">
@import "../../styles/duo.scss";
</style>
<style lang="scss" scoped>
.box-card {
  margin-right: 20px;
}
.form_item {
  float: left;
  margin: 0 0 20px 30px;
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
// #actList {
// border: 1px solid rgba(204, 204, 204, 1);
// }
</style>
<style lang="scss">
#dispatchInfo {
  display: flex;
  .el-input {
    width: 80px;
    margin: 0 10px;
  }
  .el-date-editor {
    width: 120px;
  }
  .el-select {
    .el-input {
      width: 150px;
    }
  }
}
</style>
