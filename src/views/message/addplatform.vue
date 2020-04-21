<!--
 * @Description: 新增消息
 * @LastEditors: duo
 * @LastEditTime: 2019-10-12 10:23:02
 -->
 <template>
  <div class="setwidth" id="addplatform">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './platform' }">消息管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './platform' }">消息列表</el-breadcrumb-item>
      <el-breadcrumb-item>新增消息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="推送方式">
        <el-select v-model="form.publish_type" placeholder="请选择">
          <el-option label="通知栏推送" value="1"></el-option>
          <el-option label="APP内消息中心推送" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息标题">
        <el-input v-model="form.message_title"></el-input>
      </el-form-item>
      <el-form-item label="副标题">
        <el-input v-model="form.subhead"></el-input>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="form.message_url" placeholder="请必须输入链接，如：http://www.baidu.com"></el-input>
      </el-form-item>
      <el-form-item label="图文详情">
        <quill-editor
          ref="textarea"
          v-model="form.message_content"
          class="myQuillEditor"
          :options="editorOption"
        />
        <!-- <el-button type="primary" @click="submit">提交</el-button> -->
      </el-form-item>
      <el-form-item label="推送对象">
        <el-radio-group v-model="form.target" @change="checkRadio">
          <el-radio :label="1">全部会员</el-radio>
          <el-radio :label="2">代理商</el-radio>
          <el-radio :label="3">商户</el-radio>
          <el-radio :label="4">骑手</el-radio>
          <el-radio :label="5">小哥粉</el-radio>
          <el-radio :label="6">小哥</el-radio>
          <el-radio :label="7">小V哥</el-radio>
          <el-radio :label="8">V哥</el-radio>
          <el-radio :label="9">特定用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推送的时间">
        <el-radio-group v-model="form.publish_time_type">
          <el-radio :label="1">立即推送</el-radio>
          <el-radio :label="2">
            <el-date-picker
              @change="setTime"
              v-model="date1"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00"
              value-format="timestamp"
            ></el-date-picker>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即提交</el-button>
        <el-button @click="backdown">返回上一页</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
 
 

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      content: '',
      editorOption: {},

      form: {
        publish_type: '', //推送类型(1通知栏推送，2APP内消息中心推送)
        message_title: '', //标题
        subhead: '', //副标题
        message_url: '', //链接
        message_content: '', //图文详情
        target: 1,//推送对象（1全部会员，2代理商，3商户，4骑手，5小哥粉，6小哥，7小V哥，8V哥，9特定用户）
        publish_time_type: 1, //推送时间类型
        specify_user: '', //指定用户（1,2,3,特定用户时必填）
        publish_time: '',  //推送时间（指定时间时必填）
      },

      radio: 1, //推送时间类型

      date1: '',
    }
  },
  created() {
    if (this.$store.state.addplatformList.publish_type) {
      this.date1 = this.$store.state.addplatformList.publish_time
      this.form = this.$store.state.addplatformList
    }
    if (this.$store.state.useidsStr) {
      this.form.specify_user = this.$store.state.useidsStr
    } else {
      this.form.target = 1
    }
  },
  methods: {
    /**选中特定用户弹窗提示跳转 */
    checkRadio(val) {
      if (!this.form.publish_type) {
        this.$message("先选择推送方式")
        this.form.target = 1
      } else {
        if (val === 9) {
          this.$confirm(`确定去选特定用户吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.form.publish_time = this.date1
            // this.form.message_content = this.$refs.textarea.value
            this.$store.state.addplatformList = this.form
            // set_addplatformList
            // console.log(this.$store.state.addplatformList)
            this.$router.push({ name: 'diyplatform', params: {} })
          }).catch(() => {
            this.form.target = 1
          });
        }
      }
    },

    /**用户选中时间即选中时间类型 */
    setTime(val) {
      this.form.publish_time_type = 2
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
            // this.$message.success(res.data.msg)
            resolve(res);
            // this.getList().then(() => {
            //   this.$message.success(res.data.msg)
            // });
          } else {
            this.listLoading = false
            this.$message(res.data.msg)
          }
        });
      });
    },
    onSubmit() {
      // console.log(this.form)
      this.form.message_content = this.$refs.textarea.value
      this.form.publish_time = this.date1 / 1000
      this.post('/backend/Message/postMessage', this.form).then(() => {
        this.$store.state.addplatformList = ''
        this.$store.state.useidsStr = ''
        this.$confirm(`添加消息成功，是否返回上一页`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.$router.go(-1);
        })
      })
    },
    /**返回上一页 */
    backdown() {
      this.$store.state.addplatformList = ''
      this.$store.state.useidsStr = ''
      this.$router.go(-1);
    },
  }
}
</script>

<style lang="scss" scoped>
.setwidth {
  width: 1000px;
}
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
<style lang="scss">
#addplatform {
  .line {
    text-align: center;
  }
  .el-date-editor {
    width: 220px;
  }
  .ql-editor {
    height: 350px;
  }
  // .el-radio:first-child {
  //   margin-bottom: 10px;
  // }
}
</style>