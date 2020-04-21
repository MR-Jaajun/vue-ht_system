<!--
 * @Description: 新增骑手承包商
 * @LastEditors: jun
 * @LastEditTime: 2019-10-30 10:40:54
 -->
<template>
  <div class="addAgency">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item to="./stand">骑手承包商列表</el-breadcrumb-item>
      <el-breadcrumb-item to="./addstand">新增编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>新增骑手承包商</h1>
    <div class="info">
      <h2>基本信息</h2>
      <li>
        <span>骑手承包商姓名</span>
        <el-input placeholder="请输入代理商姓名" v-model="agent_name" clearable></el-input>
      </li>

      <li>
        <span>联系电话</span>
        <el-input placeholder="请输入联系电话" v-model="contacts_mobile" clearable></el-input>
      </li>
      <li>
        <span>账号</span>
        <el-input placeholder="请输入联系电话" v-model="custom_account" disabled></el-input>
        <el-button
          style="margin-left:10px;"
          type="primary"
          size="small"
          @click="dialogTableVisible = true"
        >请选择</el-button>
      </li>
      <li>
        <span>联系人</span>
        <el-input placeholder="请输入联系人" v-model="contacts" clearable></el-input>
      </li>
      <li>
        <span>所在地区</span>
        <el-select
          clearable
          v-model="sheng"
          @change="choseProvince"
          placeholder="省级地区"
          no-data-text="请选择代理商类型"
        >
          <el-option v-for="item in province" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
        <el-select
          style="margin:0 10px"
          v-model="shi"
          @change="choseCity"
          placeholder="市级地区"
          no-data-text="请选择省份"
          clearable
        >
          <el-option v-for="item in shi1" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
        <el-select
          clearable
          no-data-text="请选择城市"
          v-model="qu"
          @change="choseBlock"
          placeholder="区级地区"
        >
          <el-option v-for="item in qu1" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </li>
      <li>
        <span>站点</span>
        <el-input placeholder="请输入联系电话" v-model="site" disabled></el-input>
        <el-button
          style="margin-left:10px;"
          type="primary"
          size="small"
          @click="dialogTableVisible2 = true"
        >请选择</el-button>
      </li>
      <li>
        <span>承包商身份证号码</span>
        <el-input placeholder="请输入身份证号码" v-model="idcard_num" clearable></el-input>
      </li>
      <li class="uploadimg">
        <span>承包商身份证照片</span>
        <el-upload
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
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" />
        </el-dialog>
        <el-upload
          action
          list-type="picture-card"
          :on-change="onChange2"
          :class="{hide2:hideUpload2}"
          :on-remove="handleRemove2"
          :before-upload="beforeAvatarUpload2"
          :auto-upload="false"
          :limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible2">
          <img width="100%" :src="dialogImageUrl2" />
        </el-dialog>
      </li>
      <li style="margin-bottom:0;height:25px;">
        <span></span>
        <p>建议尺寸：上传图片比例是8:6的等比大小，参考尺寸172*108像素。</p>
      </li>
    </div>
    <!-- 备注信息 -->
    <div class="note">
      <p class="p1" @click="openNote">
        备注信息
        <el-link icon="el-icon-edit" @click="openNote"></el-link>
      </p>
      <el-dialog
        title="备注"
        :visible.sync="centerDialogVisible"
        width="450px"
        @close="clearTextarea"
        left
      >
        <textarea cols="30" rows="10" class="input-el" v-model="textarea"></textarea>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="memberRemark">确 定</el-button>
        </span>
      </el-dialog>
      <p class="p2">
        <span>备注</span>
        <span>{{textarea2?textarea2:'无'}}</span>
      </p>
    </div>
    <!-- 按钮 -->
    <div class="btn">
      <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
      <el-button plain @click="backdown">返回上一页</el-button>
    </div>
    <!--  -->
    <!-- 账号弹窗 -->
    <el-dialog
      :visible.sync="dialogTableVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="search">
        <el-form class="demo-form-inline">
          <el-form-item label="用户ID">
            <el-input v-model="d_id" placeholder="请输入用户ID"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="d_moblie" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="d_name" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="会员等级">
            <el-select v-model="d_level" placeholder="请选择等级">
              <el-option
                v-for="item in d_level_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邀请码">
            <el-input v-model="d_code" placeholder="请输入邀请码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getvip(1)">搜索</el-button>
            <el-button style="margin-left:10px;" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        highlight-current-row
        :data="gridData"
        @open="getvip(1)"
        @current-change="handleSelectionChange"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column type="index" align="center" width="50"></el-table-column>
        <el-table-column property="custom_uid" align="center" label="用户ID" width="150"></el-table-column>
        <el-table-column property="mobile" align="center" label="手机号" width="150"></el-table-column>
        <el-table-column property="gender" align="center" label="性别" width="100"></el-table-column>
        <el-table-column property="name" align="center" label="昵称" width="180"></el-table-column>
        <el-table-column property="initve" align="center" label="邀请码"></el-table-column>
        <el-table-column property="level" align="center" label="会员等级" width="120"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
      <!-- 分页 -->
      <div style="height:30px;width:700px;margin-top:20px;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="total,prev,pager,next,jumper"
          :total="totals*1"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- 站点弹窗 -->
    <el-dialog
      :visible.sync="dialogTableVisible2"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-table
        :data="siteList"
        @open="getSiteList(1)"
        @selection-change="handleSelectionChange2"
        :header-cell-style="{background:'#EAEBEF',color:'#333',  fontWeight: '900', height:'63px' }"
      >
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column property="id" align="center" label="站点ID" width="150"></el-table-column>
        <el-table-column property="addRess" align="center" label="地区" width="180"></el-table-column>
        <el-table-column property="site_title" align="center" label="站点名称" width="100" ref="title"></el-table-column>
        <el-table-column property="desc" align="center" label="站点范围" width="250"></el-table-column>
        <el-table-column property="create_time" align="center" label="创建时间"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close2">取 消</el-button>
        <el-button type="primary" @click="ok2">确 定</el-button>
      </span>
      <!-- 分页 -->
      <div style="height:30px;width:700px;margin-top:20px;">
        <el-pagination
          background
          @current-change="handleCurrentChange2"
          layout="total,prev,pager,next,jumper"
          :total="totals2*1"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBase64 } from "../../utils/base64.js";
import axios from "axios";
export default {
  data() {
    return {
      /****** 加载地点数据********/
      mapJson: "./json/map.json",
      province: [],
      sheng: "",
      shi: "",
      shi1: [],
      qu: "",
      qu1: [],
      city: "",
      block: "",
      //
      agent_name: "", //代理商姓名
      contacts: "", //联系人
      contacts_mobile: "", //联系电话
      custom_uid: "", //商户ID
      uid: "",
      custom_account: "", //账号
      account: "",
      idcard_num: "", //身份证
      // agent_type: "", //代理商类型
      // options: [
      //   { label: "省代", value: 1 },
      //   { label: "市代", value: 2 },
      //   { label: "区代", value: 3 }
      // ],
      img1: "",
      dialogImageUrl: "", //图片路径
      dialogVisible: false, //是否显示
      hideUpload: false, //是否显示图标
      limitCount: 1, //最大数量
      img2: "",
      dialogImageUrl2: "", //图片路径
      dialogVisible2: false, //是否显示
      hideUpload2: false, //是否显示图标
      limitCount2: 1, //最大数量
      dialogTableVisible: false, //弹窗开关
      gridData: [],
      totals: "", //页数
      //弹窗搜索
      d_id: "",
      d_moblie: "",
      d_name: "",
      d_code: "",
      d_level: "",
      d_level_list: [
        { value: 0, label: "小哥粉" },
        { value: 1, label: "小哥" },
        { value: 2, label: "小V哥" },
        { value: 3, label: "V哥" }
      ],
      site: "", //选择站点
      siteList: [], //站点列表
      //选择站点弹窗
      dialogTableVisible2: false,
      rowIds: [],
      nid: "",
      totals2: "",
      sitelist: [],
      siteval: "",
      textarea: "",
      textarea2: "",
      centerDialogVisible: false
    };
  },
  watch: {
    img1() {
      console.log(this.img1);
    },
    img2() {
      console.log(this.img2);
    },
    shi() {
      if (!this.shi) {
        this.qu1 = "";
        this.qu = "";
      }
    },
    sheng() {
      if (!this.sheng) {
        this.qi1 = "";
        this.shi1 = "";
      }
    }
  },
  created() {
    this.getvip(1);
    this.getCityData();
  },
  methods: {
    //重置
    resetForm() {
      this.d_id = "";
      this.d_moblie = "";
      this.d_name = "";
      this.d_code = "";
      this.d_level = "";
    },
    //取消
    close() {
      this.dialogTableVisible = false;
      if (!this.custom_account) {
        this.uid = "";
        this.account = "";
      }
    },
    close2() {
      this.dialogTableVisible2 = false;
      // this.siteval = "";
    },
    //批量选择
    handleSelectionChange2(val) {
      // console.log(val);
      this.rowIds = [];
      this.sitelist = [];
      val.forEach(item => {
        this.rowIds.push(item.id);
        this.sitelist.push(item.site_title);
      });
      this.nid = this.rowIds.join(","); // 把数组转换成字符串
      this.siteval = this.sitelist.join(","); // 把数组转换成字符串
      console.log(this.siteval);
    },
    ok() {
      this.dialogTableVisible = false;
      this.custom_uid = this.uid;
      this.custom_account = this.account;
    },
    ok2() {
      this.dialogTableVisible2 = false;
      this.site = this.siteval;
    },

    //返回上一页
    backdown() {
      this.$router.go(-1);
    },
    // 提交 /backend/Rider/postRiderContractor
    onSubmit() {
      //  this.$router.push({ path: "./stand" });
      this.$axios({
        method: "POST",
        url: "/backend/Rider/postRiderContractor",
        data: {
          custom_uid: this.custom_uid,
          custom_account: this.custom_account,
          real_name: this.agent_name,
          contacts: this.contacts,
          contact_mobile: this.contacts_mobile,
          province: this.sheng,
          city: this.shi,
          area: this.qu,
          idcard_num: this.idcard_num,
          idcard_face_image: this.img1,
          idcard_back_image: this.img2,
          delivery_site_ids: this.rowIds,
          remark: this.textarea2
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.$message.success("提交成功");
          this.$router.push({ path: "./stand" });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //清除备注信息
    clearTextarea() {
      this.textarea = "";
    },
    openNote() {
      this.textarea = this.textarea2;
      this.centerDialogVisible = true;
    },
    //修改备注
    memberRemark() {
      this.textarea2 = this.textarea;
      this.centerDialogVisible = false;
      // this.$axios({
      //   method: "POST",
      //   url: "/backend/Rider/editRemark",
      //   data: {
      //     rider_id: this.rider_contractor_id,
      //     remark: this.textarea,
      //     edit_type: 3
      //   }
      // }).then(res => {
      //   if (res.data.status == 1) {
      //     this.centerDialogVisible = false;
      //     this.gedetail();
      //     console.log(res);
      //     this.textarea2 = this.textarea;
      //     this.$message.success(res.data.msg);
      //   } else {
      //     this.$message.error(res.data.msg);
      //   }
      // });
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
    beforeAvatarUpload2(file) {
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
    handleRemove2(file, fileList) {
      console.log(file, fileList);
      this.hideUpload2 = fileList.length >= this.limitCount2;
    },
    //选择图片后触发的事件
    // /backend/SystemSetting/uploadAvatar

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
          this.img1 = res.data.data.url;
        });
      });
      this.dialogImageUrl = file.url;
      this.hideUpload = fileList.length >= this.limitCount;
    },
    onChange2(file, fileList) {
      getBase64(file.raw).then(res => {
        this.$axios({
          method: "POST",
          url: "/backend/SystemSetting/uploadAvatar",
          data: {
            image: res
          }
        }).then(res => {
          console.log(res.data.data);
          this.img2 = res.data.data.url;
        });
      });
      this.dialogImageUrl2 = file.url;
      this.hideUpload2 = fileList.length >= this.limitCount2;
    },
    /**********************加载地点数据*******************************************/
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
                that.city.push({ id: item, value: data[item], children: [] });
              } else {
                //区
                that.block.push({ id: item, value: data[item] });
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
        .catch(function(error) {
          console.log(typeof +error);
        });
    },
    // 选省
    choseProvince(e) {
      this.shi = "";
      this.qu = "";
      for (var index2 in this.province) {
        if (e === this.province[index2].id) {
          this.shi1 = this.province[index2].children;
          this.shi = this.province[index2].children[0].value;
          this.qu1 = this.province[index2].children[0].children;
          this.qu = this.province[index2].children[0].children[0].value;
          this.E = this.qu1[0].id;
          this.sheng = this.province[index2].value;
          console.log("选省", this.sheng);
          // console.log("选省", this.E);
        }
      }
      this.getSiteList(1);
    },
    // 选市
    choseCity(e) {
      for (var index3 in this.city) {
        if (e === this.city[index3].id) {
          this.qu1 = this.city[index3].children;
          this.qu = this.city[index3].children[0].value;
          this.E = this.qu1[0].id;
          this.shi = this.city[index3].value;
          console.log("选市", this.shi);
          // console.log("选市", this.E);
        }
      }
      this.getSiteList(1);
      if (!this.shi) {
        this.qu = "";
      }
    },
    // 选区
    choseBlock(e) {
      this.E = e;
      for (var i = 0; i < this.qu1.length; i++) {
        if (e === this.qu1[i].id) {
          this.qu = this.qu1[i].value;
          console.log("选区", this.qu, this.sheng + this.shi + this.qu);
        }
      }
      this.getSiteList(1);
    },
    /******************************************************* */
    //获取站点列表
    getSiteList(page) {
      //代理区
      if (this.sheng && this.shi && this.qu) {
        this.$axios({
          method: "GET",
          url: "/backend/Rider/selectSite",
          params: {
            province: this.sheng,
            city: this.shi,
            area: this.qu,
            size: 10,
            page: page
          }
        }).then(res => {
          if (res.data.code == 200) {
            console.log(res);
            if (res.data.data.total) {
              this.totals2 = res.data.data.total;
            }

            let arr = res.data.data.data;
            arr.map(item => {
              item.addRess = item.province + item.city + item.area;
            });
            this.siteList = arr;
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } else {
        this.siteList = [];
      }
    },
    //// 搜索获取列表
    getvip(page) {
      // this.dialogTableVisible = true;
      this.$axios({
        method: "GET",
        url: "/backend/CustomUser/member",
        params: {
          id: this.d_id,
          mobile: this.d_moblie,
          vip_level: this.d_level,
          invite_code: this.d_code,
          nick_name: this.d_name,
          size: 10,
          page: page
        }
      }).then(res => {
        this.gridData = [];
        console.log(res, "1");
        this.totals = res.data.data.total;
        let userdata = res.data.data.data;
        userdata.forEach(item => {
          const { user_info_data } = item;
          const {
            gender_title,
            invite_code,
            vip_level_title,
            nick_name
          } = user_info_data;
          item.gender = gender_title;
          item.initve = invite_code;
          item.level = vip_level_title;
          item.name = nick_name;
          item.is_show = item.status_title;
          this.gridData.push(item);
        });
        console.log(this.gridData);
      });
    },
    //分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getvip(val);
    },
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`);
      this.getSiteList(val);
    },
    //批量选择
    handleSelectionChange(currentRow, oldCurrentRow) {
      console.log(currentRow.mobile);
      console.log(currentRow.custom_uid);
      this.uid = currentRow.custom_uid;
      this.account = currentRow.mobile;
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  margin-top: 10px;
  //   width: 115px;
  height: 29px;
  font-size: 22px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 29px;
  color: rgba(51, 51, 51, 1);
}
.info {
  width: 1000px;
  height: 579px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(241, 241, 241, 1);
  box-shadow: 0px 1px 14px rgba(79, 79, 185, 0.13);
  border-radius: 4px;
  margin-top: 35px;
  padding: 30px;
  h2 {
    height: 28px;
    line-height: 28px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    letter-spacing: 1px;
    margin-bottom: 30px;
  }
  .uploadimg {
    align-items: flex-start;
    height: 100px;
  }
  li {
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    span {
      font-family: Microsoft YaHei;
      font-weight: 400;
      width: 137px;
      height: 21px;
      font-size: 16px;
      color: rgba(51, 51, 51, 1);
      letter-spacing: 1px;
      text-align: left;
      margin-right: 20px;
    }
    p {
      // width: 464px;
      height: 19px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
  }
}
.note {
  .input-el {
    width: 400px;
    height: 180px;
  }
  font-weight: bold;
  font-size: 18px;
  padding-left: 10px;
  margin: 30px 0 40px 0;
  p {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 20px;
  }
  span {
    font-size: 16px;
    font-weight: 400;
    font-family: Microsoft YaHei;
    color: rgba(102, 102, 102, 1);
    margin-right: 50px;
  }
}
.btn {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 50px;
}
</style>


<style lang="scss">
.el-input {
  width: 248px;
}
.uploadimg {
  .el-upload {
    margin-right: 20px;
  }
  // 添加图片宽高
  .el-upload-list__item {
    width: 100px;
    height: 100px;
    border: 1px solid #dddbdb;
    margin-right: 20px;
  }
  // 图片宽高
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 50%;
  }
  //超过限制数量添加类命
  .hide .el-upload {
    display: none;
  }
  .hide2 .el-upload {
    display: none;
  }
}
.btn .el-button {
  margin-right: 20px;
}
.addAgency .el-dialog__footer {
  height: 60px;
  position: relative;
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    margin-right: 0 !important;
    // position: absolute;
    // // height: 50px;
    // right: 20px;
    // display: flex;
  }
}
.search {
  .el-form {
    justify-content: flex-start;
    display: flex;
    flex-wrap: wrap;
    width: 800px;
  }
  .el-form-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    .el-input {
      width: 180px;
    }
  }
}
</style>
