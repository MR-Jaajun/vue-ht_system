<!--
 * @Description: 新增消息
 * @LastEditors: duo
 * @LastEditTime: 2019-10-29 09:58:25
 -->
 <template>
  <div class="setwidth" id="addplatform">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './atrclexitong' }">文章管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './atrclexitong' }">系统文章列表</el-breadcrumb-item>
      <el-breadcrumb-item>编辑系统文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="文章位置">{{this.params.position_value}}</el-form-item>
      <el-form-item label="文章名称">{{this.params.title}}</el-form-item>
      <el-form-item label="URL链接">
        <el-input v-model="form.url" placeholder="请输入" ></el-input>
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

      form: {},
      article_id:''
    }
  },
  created() {
    this.params = this.$route.params.row;
    // console.log('this.params', this.params)
    this.article_id = this.$route.params.row.id
    this.getInfo()
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
          url: '/backend/Article/systemArticleDetail',
          params: { article_id: this.article_id }
        }).then(res => {
          // resolve(res);
          // this.listLoading = false
          this.form = res.data.data
          // this.form.article_id = this.form.id
          // delete this.form.id
          // this.total = res.data.data.total
          console.log('返回的详情:', this.form)
        })
      })
    },
    /**提交按钮 */
    onSubmit() {
      console.log(this.form)
      this.post('/backend/Article/systemArticleEdit', {
        article_id: this.article_id,//现在是id因为获取详情时，article_id变成id
        url: this.form.url,
        content: this.form.content,
      }).then(() => {
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