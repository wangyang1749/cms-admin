<template>
  <div>
    <div>
      <a-input placeholder="请输入标题" v-model="queryParam.title" />
      <mavon-editor
        v-model="queryParam.originalContent"
        ref="md"
        @change="change"
        style="min-height: 600px;z-index: 1;"
        @imgAdd="imgAdd"
        @imgDel="imgDel"
      />
      <div class="article-bottom">
        <div class="article-option">
          <a-button type="primary" @click="showDrawer">打开发布面板</a-button>
        </div>
      </div>

      <a-drawer
        title="发布文章"
        placement="right"
        :closable="false"
        @close="onClose"
        :visible="visible"
        width="30rem"
      >
        <a-form>
          <a-form-item label="静态页面视图的名称" help="不写,默认自动生成">
            <a-input placeholder="请输入视图名称" v-model="queryParam.viewName" />
          </a-form-item>

          <a-form-item label="选择模板">
            <a-select style="width: 100%" v-model="queryParam.templateId">
              <a-select-option
                :value="item.id"
                v-for="item in templates"
                :key="item.id"
              >{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="选择标签">
            <a-select
              allowClear
              mode="tags"
              style="width: 100%"
              @blur="handleBlur"
              placeholder="Tags Mode"
              v-model="selectedTagNames"
            >
              <a-select-option
                v-for="item in tags"
                :key="item.id+''"
                :value="item.name"
              >{{item.id}}-{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="选择分类">
            <a-tree
              checkable
              :defaultExpandAll="true"
              :checkedKeys="queryParam.categoryIds"
              @check="onCheck"
              :treeData="categorys"
            />
          </a-form-item>

          <a-form-item label="摘要">
            <a-textarea v-model="queryParam.summary">

            </a-textarea>
          </a-form-item>


          <a-form-item>
            <a-upload-dragger
              name="file"
              :multiple="true"
              :action="upload"
              @change="uploadPic"
              :withCredentials="true"
            >
              <p class="ant-upload-drag-icon">
                <!-- <a-icon type="inbox" /> -->
                <img :src="queryParam.picPath" width="100%" alt srcset />
              </p>
              <p class="ant-upload-text">Click or drag file to this area to upload</p>
              <p
                class="ant-upload-hint"
              >Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
            </a-upload-dragger>
          </a-form-item>

          <a-form-item label="是否需要静态化">
            <a-radio-group v-model="queryParam.haveHtml" defaultValue="1">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item>
            <a-button @click="submit">发布</a-button>
            <a-button @click="save">保存</a-button>
          </a-form-item>
        </a-form>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import tagsApi from "@/api/tags.js";
import categoryApi from "@/api/category.js";
import templateApi from "@/api/template.js";
import axios from "axios";
import articleApi from "@/api/article.js";
import uploadApi from "@/api/upload.js";
export default {
  // 注册
  components: {
    mavonEditor
  },
  data() {
    return {
      queryParam: {
        originalContent: "", // 输入的markdown
        tagIds: [],
        categoryIds: [],
        haveHtml: 0,
        templateId: "",
        title: "",
        viewName: "",
        summary: "",
        status: "PUBLISHED",
        pathPic:""
      },
      img_file: {},
      visible: false,
      tags: [],
      selectedTagNames: [],
      selectedTagIds: [],
      categorys: [],
      selectCategoryIds: [],
      templates: [],
      isUpdate: false
    };
  },
  computed: {
    tagIdMap() {
      const tagIdMap = {};
      //获得tags的id map
      this.tags.forEach(tag => {
        tagIdMap[tag.id] = tag;
      });
      return tagIdMap;
    },
    tagNameMap() {
      const tagNameMap = {};
      //获得tags的 name map
      this.tags.forEach(tag => {
        tagNameMap[tag.name] = tag;
      });

      return tagNameMap;
    },
    upload() {
      return categoryApi.upload();
    }
  },
  watch: {
    // tags(newValue) {
    //   // 解决tags未赋上值就使用导致的取值报错问题
    //   if (newValue) {
    //     if (this.selectedTagIds.length != 0) {
    //       this.selectedTagNames = this.selectedTagIds.map(
    //         tagId => this.tagIdMap[tagId].name
    //       );
    //     }
    //   }
    // }
  },
  beforeRouteEnter(to, from, next) {
    // Get post id from query
    const articleId = to.query.articleId;
    next(vm => {
      if (articleId) {
        articleApi.findById(articleId).then(response => {
          const article = response.data.data;
          // console.log(article);
          vm.queryParam.originalContent = article.originalContent; // 输入的markdown
          // vm.queryParam.haveHtml= article.haveHtml
          // vm.queryParam.templateId = article.templateId;
          vm.queryParam.title = article.title;
          vm.queryParam.viewName = article.viewName;
          vm.queryParam.summary = article.summary;
          vm.queryParam.status = article.status;
          vm.queryParam.picPath = article.picPath
          //     tagIds: []
          // categoryIds: []
          vm.isUpdate = true;
        });
      }
    });
  },
  methods: {
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.queryParam.formatContent = render;
      // console.log(value)
    },
    imgAdd(pos, $file) {
      var formdata = new FormData();
      formdata.append("file", $file);
      this.img_file[pos] = $file;
      uploadApi.upload(formdata).then(response => {
        console.log(response.data.data.path);
        this.$refs.md.$img2Url(pos, response.data.data.path);
      });
    },
    imgDel() {},
    // 提交
    submit() {
      if (!this.queryParam.title) {
        this.$notification["error"]({
          message: "文章标题不能为空!!"
        });
        return;
      }
      if (!this.queryParam.templateId) {
        this.$notification["error"]({
          message: "请至少选择一个模板!!"
        });
        return;
      }
      if (this.isUpdate) {
        articleApi
          .update(this.$route.query.articleId, this.queryParam)
          .then(response => {
            // console.log(response);
            const data = response.data.data;
            if (data.haveHtml) {
              this.$notification["success"]({
                message:
                  "更新成功:" +
                  response.data.message +
                  "更新html页面" +
                  data.viewName
              });
            } else {
              this.$notification["success"]({
                message:
                  "更新成功:" + response.data.message + "没有生成html页面"
              });
            }

            // this.$router.push("/article/list");
          });
      } else {
        // console.log(this.queryParam);
        articleApi.create(this.queryParam).then(response => {
          // console.log(response);
          const data = response.data.data;
          if (data.haveHtml) {
            this.$notification["success"]({
              message:
                response.data.message + "成功生成html页面" + data.viewName
            });
          } else {
            this.$notification["success"]({
              message: response.data.message + "没有生成html页面"
            });
          }
        });
      }
      this.$router.push("/article/list");
    },
    save() {},
    uploadPic(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        this.queryParam.picPath = info.file.response.data.path;
        console.log(info.file.response.data.path);
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    showDrawer() {
      this.loadTags();
      this.loadcategory();
      this.loadTempalte();
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    /**获得tagsid */
    handleBlur() {
      const tagNamesToCreate = this.selectedTagNames.filter(
        tagName => !this.tagNameMap[tagName]
      );
      // console.log(tagNamesToCreate);
      // console.log(tagNamesToCreate.length);
      if (tagNamesToCreate.length == 0) {
        this.queryParam.tagIds = this.selectedTagNames.map(
          tagName => this.tagNameMap[tagName].id
        );
        // If empty
        return;
      }
      const createPromises = tagNamesToCreate.map(tagName =>
        tagsApi.createWithName(tagName)
      );
      axios.all(createPromises).then(
        axios.spread(() => {
          this.loadTags(() => {
            this.queryParam.tagIds = this.selectedTagNames.map(
              tagName => this.tagNameMap[tagName].id
            );
          });
        })
      );
    },
    handleChange(value) {
      this.queryParam.templateId = value;
      // console.log(value);
    },
    loadTags(callback) {
      tagsApi.list().then(response => {
        this.tags = response.data.data;
        if (callback) {
          callback();
        }
        // console.log(response.data.data);
      });
    },
    loadcategory() {
      categoryApi.list().then(response => {
        this.categorys = categoryApi.concreteTree(response.data.data);
      });
    },
    loadTempalte() {
      templateApi.findByType("ARTICLE").then(response => {
        this.templates = response.data.data;
        // console.log(response);
      });
    },
    onCheck(checkedKeys, e) {
      // console.log("onCheck", checkedKeys);
      // console.log("e::", e);
      // this.categoryIds = checkedKeys;
      this.queryParam.categoryIds = e.checkedNodes
        .filter(node => {
          return node.data.props.isLeaf;
        })
        .map(node => node.key);

      // console.log(this.queryParam.categoryIds);
    }
  }
};
</script>

<style>
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4rem;
  background: #fff;
  z-index: 5;
}
.article-option {
  float: right;
  position: relative;
  top: 1rem;
  right: 2rem;
}
</style>