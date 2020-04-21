<!--
 * @Description: 分销文章管理
 * @LastEditors: duo
 * @LastEditTime: 2019-10-15 10:31:48
 -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './article' }">分销管理</el-breadcrumb-item>
      <el-breadcrumb-item>分销文章</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 列表 -->
    <div id="actList" style="margin-top:30px">
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
            <el-button @click="toInfo(row)" type="text">编辑</el-button>
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
      time: '',//日期组件展示用
      dialogVisible: false, //弹框
      listQuery: {//请求接口参数
        page: 1, //页码
        size: 20, //每页数据
      },
      selectlist: [{//下拉
        value: "1",
        label: '客服中心外卖模块'
      }]

      // 特定页面

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
          url: '/backend/Distribution/articleList',
          params: {}
        }).then(res => {
          resolve(res);
          this.listLoading = false
          this.list = res.data.data
          // this.total = res.data.data.total
        })
      })
    },
    /**去详情页 */
    toInfo(row) {
      let titletxt = row ? "编辑" : "新增"
      this.$router.push({ name: 'articleInfo', params: { row, titletxt } })
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
      }
      this.time = '' //有时间组件填
      this.getList()
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
  }
};
</script>