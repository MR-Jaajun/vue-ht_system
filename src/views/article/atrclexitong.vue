<!--
 * @Description: 系统文章管理
 * @LastEditors: jun
 * @LastEditTime: 2019-11-20 18:23:51
 -->
<template>
  <div class="pagelist">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './atrclexitong' }">文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>系统文章列表</el-breadcrumb-item>
    </el-breadcrumb>

    
    <div class="clearfix" style="margin-bottom:20px;">
      <div class="form_item">
        <span>文章名称</span>
        <el-input
          clearable
          placeholder="请输入"
          style="width:215px;"
          v-model="listQuery.title"
        ></el-input>
      </div>
      <div class="form_item">
        <span>文章位置</span>
        <el-select placeholder="请选择" v-model="listQuery.position_type">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in selectlist"
          ></el-option>
        </el-select>
      </div>
      <!-- 推送时间 -->
      <div class="form_item">
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
      </div>
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
        <el-table-column show-overflow-tooltip prop="id" label="文章ID" align="center" width="200"></el-table-column>
        <el-table-column prop="title" label="文章名称" width="200" align="center"></el-table-column>
        <el-table-column prop="position_value" label="文章位置" width="200" align="center"></el-table-column>
        <el-table-column sortable prop="update_time" label="更新时间" width="250" align="center"></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-button @click="toInfo(row)" type="text">编辑</el-button>
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
import { timestampToTime } from "../../utils/util.js";
export default {
  data() {
    return {
      // 列表公共
      total: 0,
      listLoading: true, //loading图标
      list: [], //表格列表
      info: {}, //详情
      multipleSelection: '', //列表选中字符串
      time: '',//日期组件展示用
      dialogVisible: false, //弹框

      // 特定页面
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 20, //每页数据
        id:'',
        title:'',
        update_time:'',
        position_type:'',//文章位置（1、用户端，2商户端，3、骑手端，4、合作共赢）
      },
      //推送方式
      selectlist: [{
        value: "1",
        label: '用户端'
      }, {
        value: "2",
        label: '商户端'
      }, {
        value: "3",
        label: '骑手端'
      }, {
        value: "4",
        label: '合作共赢'
      }],
      
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**获取列表 */
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.$axios({
          method: 'GET',
          url: '/backend/Article/systemArticleList',
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
      console.log(id)
      this.dialogVisible = true
      this.$axios({
        method: 'GET',
        url: '/backend/Message/getMessage',
        params: { message_id: id }
      }).then(res => {
        this.info = res.data.data
      })
    },
    /**去详情页 */
    toInfo(row) {
      // let titletxt = row ? "编辑" : "新增"
      this.$router.push({ name: 'atrclexitongedit', params: {row: row} })
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
          let data;
          if (formName == 'dynamicValidateForm') {
            data = this.dynamicValidateForm.domains
          } else {
            for (let i in this.form) {
              this.form[i] = parseInt(this.form[i])
            }
            data = this.form
          }
          this.post('/backend/Operation/postGlobal', data)
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
      this.listQuery.page = 1
      this.getList()
    },
    /**重置 */
    clearlistQuery() {
      this.listQuery = {
        page: 1, //页码
        size: 20, //每页数据
        title:'',
        update_time:'',
        position_type:'',//文章位置（1、用户端，2商户端，3、骑手端，4、合作共赢）
      }
      this.time = '' //有时间组件填
      this.getList()
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000
      let endTime = val[1] / 1000
      this.listQuery.update_time = startTime + '-' + endTime
    },

    /**删除 */
    deleteOne(id) {
      this.$confirm(`确定删除选中内容？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'POST',
          url: '/backend/Message/delMessage',
          data: {
            message_id: id
          }
        }).then(res => {
          this.getList()
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
  }
};
</script>

<style lang="scss" scoped>
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
</style>
