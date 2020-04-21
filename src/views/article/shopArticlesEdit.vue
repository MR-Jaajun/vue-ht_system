<!--
 * @Description: 新增编辑商户文章
 * @LastEditors: duo
 * @LastEditTime: 2019-10-12 11:44:15
 -->
 <template>
  <div class="setwidth" id="addplatform">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './shopArticlesList' }">商户文章管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './shopArticlesList' }">商户文章列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{this.params.titletxt}}商户文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="文章位置">
        <el-select placeholder="请选择" v-model="form.position_type">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in selectlist"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章名称">
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="图文详情">
        <quill-editor
          ref="textarea"
          v-model="form.content"
          class="myQuillEditor"
          :options="editorOption"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="backdown">返回上一页</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
 
 

<script>
import { quillEditor, Quill } from 'vue-quill-editor'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Quill.register('modules/ImageExtend', ImageExtend)
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      // 公用
      /**上页的参数 */
      params: '',
      editorOption: {
        modules: {
          ImageExtend: {
            loading: true,
            name: 'image',
            action: 'https://apitest.xgscheng.com/backend/SystemSetting/uploadAvatar',
            response: (res) => {
              return res.data.url
            },
            headers: (xhr) => {
              xhr.setRequestHeader('token', sessionStorage.getItem("token"))
            },  // 可选参数 设置请求头部
          },
          toolbar: {
            container: container,
            handlers: {
              'image': function () {
                QuillWatch.emit(this.quill.id)
              }
            }
          }
        }
      },

      form: {
        // article_id: '',
        // position_type: '',
        // title: '',
        // content: '',
      },

      //文章位置(1、客服中心外卖模块，2、客服中心团购模块，3、客服中心商城模块，4、客服中心到店付，5、商户管理规范，6、商户填写资料帮助，7、商户帮助中心问题，8、骑手填写资料帮助，9、代理公共事务处理，10、代理骑手新人须知，11、代理骑手安全须知，12、代理骑手软件操作，13、代理骑手业务须知，14、代理骑手行为规范)
      selectlist: [{
        value: 6,
        label: '商户填写资料帮助'
      }, {
        value: 7,
        label: '商户帮助中心问题'
      }]
    }
  },
  created() {
    this.params = this.$route.params;
    if (this.params.row) {
      this.form.article_id = this.$route.params.row.id
      this.getInfo()
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
    /**获取列表 */
    getInfo() {
      return new Promise((resolve, reject) => {
        // this.listLoading = true
        this.$axios({
          method: 'GET',
          url: '/backend/Article/articleDetail',
          params: { article_id: this.form.article_id }
        }).then(res => {
          // resolve(res);
          // this.listLoading = false
          this.form = res.data.data
          this.form.article_id = this.form.id
          delete this.form.id
          // this.total = res.data.data.total
          console.log('返回的详情:', this.form)
        })
      })
    },
    /**提交按钮 */
    onSubmit() {
      console.log('提交前的form：', this.form)
      this.post('/backend/Article/serviceArticle', this.form).then(() => {
        this.$confirm(`保存成功，是否返回上一页`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.$router.go(-1);
        })
      })
    },

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