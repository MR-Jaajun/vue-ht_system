<!--
 * @Description: 编辑分销文章
 * @LastEditors: duo
 * @LastEditTime: 2019-10-15 09:25:41
 -->
 <template>
  <div class="setwidth" id="duoform">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: './article' }">分销管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: './article' }">分销文章</el-breadcrumb-item>
      <el-breadcrumb-item>{{this.params.titletxt}}分销文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="文章位置">{{this.params.row.position_value}}</el-form-item>
      <el-form-item label="文章名称">
        <el-input clearable placeholder="请输入" style="width:215px;" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="图文详情">
        <quill-editor
          ref="myQuillEditor"
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
      form: {}, //里面属性默认用接口返回
      //下拉
      selectlist: [{
        value: 1,
        label: '客服中心外卖模块'
      }],
    }
  },
  created() {
    this.params = this.$route.params;
    if (this.params.row) {
      this.form.article_id = this.params.row.id
      this.getInfo()
    }
  },
  mounted() {
    this.$nextTick(function () {
      document.querySelector(".ql-editor").style.height = document.body.clientHeight - 380 + 'px';
      console.log('当前组件高度', this.$el.clientHeight)
    })
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
            // this.getList()
          } else {
            this.$message(res.data.msg)
          }
          this.listLoading = false
        });
      });
    },
    /**获取详情*/
    getInfo() {
      return new Promise((resolve, reject) => {
        this.$axios({
          method: 'GET',
          url: '/backend/Distribution/articleDetail',
          params: { article_id: this.form.article_id }
        }).then(res => {
          resolve(res);
          this.form = res.data.data
          // console.log('返回的详情:', this.form)
        })
      })
    },
    /**提交按钮 */
    onSubmit() {
      // console.log('提交前的form：', this.form)
      this.post('/backend/Distribution/editArticle', {
        article_id: this.form.id,
        title: this.form.title,
        content: this.form.content
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
  //整个详情页宽度
  width: 80%;
}
.el-breadcrumb {
  //面包屑
  margin-bottom: 20px;
}
</style>
<style lang="scss">
#duoform {
  .ql-editor {
    //设置编辑器
    min-height: 500px;
  }
}
</style>