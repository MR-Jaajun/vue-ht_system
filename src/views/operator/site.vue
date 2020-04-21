<!--
 * @Description: 站点管理列表
 * @LastEditors: duo
 * @LastEditTime: 2019-10-09 18:38:23
 -->
<template>
  <div id="activityList">
    <!-- 弹窗 -->
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <el-row class="rowCenter">
        <el-col :span="5">请选择地区：</el-col>
        <el-col :span="19" style="display:flex">
          <el-select
            clearable
            v-model="setQuery.province"
            @change="choseProvince"
            placeholder="省级地区"
            no-data-text="请选择省份"
          >
            <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
          <el-select
            style="margin:0 10px;"
            v-model="setQuery.city"
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
            v-model="setQuery.area"
            @change="choseBlock"
            placeholder="区级地区"
          >
            <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="rowCenter">
        <el-col :span="5">站点名称：</el-col>
        <el-col>
          <el-input v-model="setQuery.site_title" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <el-row class="rowCenter">
        <el-col :span="5">站点范围：</el-col>
        <el-col>
          <el-input v-model="setQuery.desc" placeholder="请输入内容"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './site' }">运营管理</el-breadcrumb-item>
      <el-breadcrumb-item>站点列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 新增删除 -->
    <el-row class="setStatusRow">
      <el-button @click="showDialog()" icon="el-icon-plus" type="primary">新增</el-button>
      <el-button @click="delInfo()" type="primary">批量删除</el-button>
    </el-row>
    <!-- 搜索表单 -->
    <div class="clearfix" id="form_menu">
      <!-- 活动ID -->
      <div class="form_item">
        <span>站点ID</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.id"></el-input>
      </div>
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
      <div class="form_item">
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
        <el-table-column align="center" label="站点ID" prop="id" width="80"></el-table-column>
        <el-table-column align="center" label="站点名称" prop="site_title" width="200"></el-table-column>
        <el-table-column align="center" label="地区" prop="address" width="300"></el-table-column>
        <el-table-column align="center" label="站点范围" prop="desc" width="200"></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="create_time"
          show-overflow-tooltip
          width="200"
        ></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <div>
              <el-link @click="toInfo(row.id)" class="el_link" type="primary">查看</el-link>
              <el-link @click="showDialog(row)" class="el_link" type="primary">编辑</el-link>
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
        :page-sizes="[10, 50, 100]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-row>
  </div>
</template>

<script>
import axios from "axios"
export default {
  data() {
    return {
      // 弹出框内容
      dialogVisible: false, //弹出框
      editid: '', //弹出框编辑id
      inputName: '',
      inputScope: '',
      listLoading: true, //loading图标
      list: [], //表格列表
      multipleSelection: '', //列表选中字符串
      dateStr: '', //展示给用户看的时间段
      total: 0, //总数据数
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 10, //每页数据
        id: '', //站点id
        province: '',
        city: '',
        area: '',
        create_time: ''
      },
      //弹出框参数
      setQuery: {
        id: '', //站点id
        province: '',
        city: '',
        area: '',
        site_title: '',
        desc: ''
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
    }
  },
  created() {
    this.getList()
    this.getCityData()
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
          url: '/backend/Rider/getSites',
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
      this.sheng = "",
        this.shi = "",
        this.qu = "",
        this.post('/backend/Rider/postSite', this.setQuery).then(() => {
          this.dialogVisible = false
        })
    },
    /**显示弹框 */
    showDialog(row) {
      this.dialogVisible = true
      if (row) {
        this.setQuery = {
          site_id: row.id, //站点id
          province: row.province,
          city: row.city,
          area: row.area,
          site_title: row.site_title,
          desc: row.desc
        }
      } else {
        this.setQuery = {
          id: '', //站点id
          province: '',
          city: '',
          area: '',
          site_title: '',
          desc: ''
        }
      }
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
        size: 10, //每页数据
        id: '', //站点id
        province: '',
        city: '',
        area: '',
        create_time: ''
      }
      this.dateStr = ''
      this.sheng = "";
      this.shi = "";
      this.qu = "";
      this.getList()
    },
    /**选择时间*/
    getTime(val) {
      let startTime = val[0] / 1000
      let endTime = val[1] / 1000
      this.listQuery.create_time = startTime + '-' + endTime
    },
    /**去详情页 */
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
          this.post('/backend/Rider/siteDel', {
            site_ids: id ? id : this.multipleSelection,
          })
        })
      }
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
}
</script>
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
</style>
<style lang="scss">
.el-select {
  margin-right: 10px;
}
</style>
