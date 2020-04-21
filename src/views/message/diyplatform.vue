<!--
 * @Description: 选择特定用户
 * @LastEditors: duo
 * @LastEditTime: 2019-10-12 11:15:16
 -->
<template>
  <div class="pagelist" id="dispatchUser">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './platform' }">消息管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './addplatform' }">新增消息详情</el-breadcrumb-item>
      <el-breadcrumb-item>选择特定用户</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="clearfix">
      <div class="form_item">
        <span>用户ID</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.id"></el-input>
      </div>
      <div class="form_item">
        <span>昵称</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.id"></el-input>
      </div>
      <div class="form_item">
        <span>手机号</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.mobile"></el-input>
      </div>
      <div class="form_item">
        <span>会员等级</span>
        <el-select placeholder="请选择" v-model="listQuery.vip_level">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in vipList"
          ></el-option>
        </el-select>
      </div>
      <div class="form_item">
        <span>邀请码</span>
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="listQuery.invite_code"></el-input>
      </div>
    </div>

    <el-row class="table_top_btn">
      <el-button @click="getSearch" type="primary">搜索</el-button>
      <el-button @click="clearlistQuery">重置</el-button>
    </el-row>

    <!-- 列表 -->
    <div class="userList">
      <el-table
        :data="list"
        :header-cell-style="{background:'#ccc', color:'#333', fontWeight: '800'}"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        v-loading="listLoading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="用户 ID" width="153" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" label="手机号" width="153" align="center"></el-table-column>
        <el-table-column prop="gender_title" label="性别" width="153" align="center"></el-table-column>
        <el-table-column prop="nick_name" label="昵称" width="203" align="center"></el-table-column>
        <el-table-column prop="invite_code" label="邀请码" width="250" align="center"></el-table-column>
        <el-table-column prop="vip_level_title" label="会员等级" width="250" align="center"></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <el-button :disabled="row.istrue" @click="addUser(row)" type="text">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-button @click="addUser()" type="primary">批量添加</el-button>
      </el-row>
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

    <!-- 列表 -->
    <div class="userList" style="margin-top:30px;">
      <el-table
        :data="userlist"
        :header-cell-style="{background:'#ccc', color:'#333', fontWeight: '800'}"
        ref="multipleTable"
        style="width:100%;"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="用户 ID" width="153" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mobile" label="手机号" width="153" align="center"></el-table-column>
        <el-table-column prop="gender_title" label="性别" width="153" align="center"></el-table-column>
        <el-table-column prop="nick_name" label="昵称" width="203" align="center"></el-table-column>
        <el-table-column prop="invite_code" label="邀请码" width="250" align="center"></el-table-column>
        <el-table-column prop="vip_level_title" label="会员等级" width="250" align="center"></el-table-column>
        <el-table-column align="center" label="操作" prop="operation">
          <template slot-scope="{row}">
            <el-button @click="deleteUser(row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-button @click="deleteUser()" type="primary">批量删除</el-button>
      </el-row>
    </div>
    <!-- <el-row class="setPage">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 50, 100]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-row>-->

    <!-- 返回 -->
    <div class="submitRow" style="display:flex;">
      <el-button type="primary" @click="onSubmit">确认提交</el-button>
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>
  </div>
</template>
<script>
import axios from "axios"
import { timestampToTime } from "../../utils/util.js";
export default {
  data() {
    return {
      page: 1,
      size: 20,
      total: '',

      listLoading: true, //loading图标
      list: [], //表格列表
      multipleSelection: '', //列表选中字符串

      total: 0, //总数据数
      //请求接口参数
      listQuery: {
        page: 1, //页码
        size: 10, //每页数据
        id: '',
        name: '', //昵称，接口参数还没有
        mobile: '',
        vip_level: '',
        invite_code: ''
      },
      //会员等级(用户等级:0=小哥粉、1=小哥、2=小V哥、3=V哥)
      vipList: [{
        value: "0",
        label: "小哥粉"
      },
      {
        value: "1",
        label: "小哥"
      },
      {
        value: "2",
        label: "小V哥"
      },
      {
        value: "3",
        label: "V哥"
      }],

      create_time: '',
      publish_time: '',

      //推送方式
      pushList: [{
        value: "1",
        label: '通知栏推送'
      }, {
        value: "2",
        label: 'APP内消息中心推送'
      }],

      userlist: [],
    };
  },
  created() {
    this.getList();
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
    /**添加用户; 有id是单独操作，否则批量操作*/
    addUser(row) {
      if (row) {
        this.userlist.push(row)
        this.list.forEach((element, index) => {
          if (element.id == row.id) {
            // i.istrue = true 后面优化
            this.list.splice(index, 1)
          }
        });
      } else {
        console.log('11', this.multipleSelection)
        if (!this.multipleSelection.length) {//多选且没选中
          this.$message('请选择用户')
        } else {
          this.userlist = this.userlist.concat(this.multipleSelection)
          for (let i of this.multipleSelection) {
            this.list.forEach((element, index) => {
              if (element.id == i.id) {
                // i.istrue = true 后面优化
                this.list.splice(index, 1)
              }
            });
          }
        }
      }
      // this.getList()
      // console.log(this.userlist)
    },

    /**删除 */
    deleteUser(row) {
      if (row) {
        this.userlist.forEach((element, index) => {
          if (element.id == row.id) {
            // i.istrue = true 后面优化
            this.userlist.splice(index, 1)
          }
        });
        this.list.push(row)
      } else {
        if (!this.multipleSelection.length) {//多选且没选中
          this.$message('请选择用户')
        } else {
          for (let i of this.multipleSelection) {
            this.userlist.forEach((element, index) => {
              if (element.id == i.id) {
                // i.istrue = true 后面优化
                this.userlist.splice(index, 1)
              }
            });
          }
          this.list = this.list.concat(this.multipleSelection)
        }
      }
      // this.$axios({
      //   method: 'POST',
      //   url: '/backend/Activity/activityDel',
      //   data: {
      //     activity_id: id
      //   }
      // }).then(res => {
      //   this.getsearch()
      // })
      // for (let i of this.userlist) {
      //   console.log(i)
      // }
    },

    /**去详情页 */
    toInfo(row) {
      let titletxt = row ? "编辑" : "新增"
      this.$router.push({ name: 'addplatform', params: {} })
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
        size: 10, //每页数据
        id: '',
        name: '', //昵称，接口参数还没有
        mobile: '',
        vip_level: '',
        invite_code: ''
      }
      this.dateStr = '' //有时间组件必填
      this.getList()
    },
    /**获取多选的id数组 */
    handleSelectionChange(val) {
      let valArr = []
      for (let i of val) {
        valArr.push(i)
      }
      this.multipleSelection = valArr
    },
    /**选择时间*/
    getTime(val) {
      if (val) {
        this.listQuery.create_time = this.create_time[0] / 1000 + '-' + this.create_time[1] / 1000
      }
      else {
        this.listQuery.publish_time = this.publish_time[0] / 1000 + '-' + this.publish_time[1] / 1000
      }
    },

    /**获取列表 */
    getList() {
      return new Promise((resolve, reject) => {
        this.listLoading = true
        this.$axios({
          method: 'GET',
          url: '/backend/CustomUser/member',
          params: this.listQuery
        }).then(res => {
          resolve(res);
          this.listLoading = false
          let _list = res.data.data.data
          // for (let i in _list) {
          //   for (let u of this.userlist) {
          //     if (_list[i].id == u.id) {
          //       _list[i].istrue = true
          //     }
          //   }
          // }

          for (let i of this.userlist) {
            _list.forEach((element, index) => {
              if (element.id == i.id) {
                // i.istrue = true 后面优化
                _list.splice(index, 1)
              }
            });
          }

          this.list = _list
          // this.list.splice(1,1)
          // console.log(111,this.list)
          this.total = res.data.data.total
        })
      })
    },
    /**提交指定用户 */
    onSubmit() {
      let useids = [];
      if (this.userlist.length) {
        for (let i of this.userlist) {
          useids.push(i.id)
        }
        this.$store.state.useidsStr = useids.join(',')
        console.log(this.$store.state.useidsStr)
        this.$confirm(`已添加特定用户，是否返回上一页？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.$router.go(-1);
        })
      } else {
        this.$message("未选中任何用户")
      }

    },
    /**返回上一页 */
    backdown() {
      this.$router.go(-1);
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
.box-card {
  margin-right: 20px;
}
.form_item {
  float: left;
  margin: 30px 30px 0px 0px;
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
#dispatchUser {
  .el-row {
    display: flex;
    margin-top: 20px;
  }
  .submitRow {
    display: flex;
    justify-content: center;
    margin: 10px 0 50px;
    button {
      font-size: 16px;
    }
  }
}
</style>
