<template>
  <div>
    <a-form layout="inline">
      <a-form-item label="请输入标题">
        <a-input placeholder="请输入标题" v-model="queryParam.title" />
      </a-form-item>

      <a-form-item label="选择分类">
        <a-select v-model="queryParam.categoryId" style=" min-width: 300px;">
          <a-select-option :value="item.id" v-for="item in categorys" :key="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button @click="openLatexPanel">输入公式</a-button>
        <!-- <a-button @click="insert('myValue')">11 </a-button> -->
      </a-form-item>
      <a-form-item>
        <a-button @click="()=>attachmentUploadVisible=true">上传附件</a-button>
        <!-- <a-button @click="insert('myValue')">11 </a-button> -->
      </a-form-item>
    </a-form>

    <mavon-editor
      v-model="queryParam.originalContent"
      ref="md"
      style="min-height: 600px;z-index: 1;"
      @imgAdd="imgAdd"
      @imgDel="imgDel"
    />
    <div class="article-bottom">
      <div class="article-option">
        <a-button type="primary" @click="save">保存</a-button>
        <a-button type="primary" @click="preview">预览</a-button>
        <a-button type="primary" @click="showDrawer">打开发布面板</a-button>
        <a-button type="primary" @click="openAttachement">附件库</a-button>
      </div>
    </div>

    <a-modal title="添加公式" v-model="latexVisible" @ok="saveLatexSvg">
      <div v-html="latexForamt"></div>
      <!-- <img src="http://localhost:8080/user/latex/svg?latex=d = \sqrt{(A_0-B_0)^2+(A_1-B_1)^2}" alt="" srcset=""> -->
      <a-textarea
        v-model="latexContent"
        placeholder="Controlled autosize"
        :autoSize="{ minRows: 3, maxRows: 5 }"
      />
    </a-modal>

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
        <!-- 
          <a-form-item label="选择模板">
            <a-select style="width: 100%" v-model="queryParam.templateName">
              <a-select-option
                :value="item.enName"
                v-for="item in templates"
                :key="item.id"
              >{{item.name}}</a-select-option>
            </a-select>
        </a-form-item>-->

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
          <a-select style="width: 100%" v-model="queryParam.categoryId">
            <a-select-option :value="item.id" v-for="item in categorys" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="摘要">
          <a-textarea v-model="queryParam.summary"></a-textarea>
        </a-form-item>

        <a-form-item>
          <a-upload-dragger
            name="file"
            :multiple="true"
            :action="upload"
            @change="uploadPic"
            :headers="headers"
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
          <a-input v-model="queryParam.picPath"></a-input>
        </a-form-item>
        <!-- 
          <a-form-item label="是否需要静态化">
            <a-radio-group v-model="queryParam.haveHtml" defaultValue="1">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
        </a-form-item>-->

        <a-form-item>
          <a-button @click="submit">发布</a-button>
        </a-form-item>
      </a-form>
    </a-drawer>

    <a-drawer
      title="附件库"
      placement="right"
      :closable="false"
      @close="()=>{attachemnetVisible=false}"
      :visible="attachemnetVisible"
      width="30rem"
    >
      <a-list :grid="{ gutter: 16, column: 2 }" :dataSource="attachments">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-card :title="item.fileKey">
            <img :src="item.path" width="100%" height="100px" />
            <a href="javascript:;" @click="addToTextarea(item)">详情</a>
          </a-card>
        </a-list-item>
      </a-list>
      <a-button @click="nextPage(-1)">上一页</a-button>
      <a-button @click="nextPage(1)">下一页</a-button>
    </a-drawer>

    <a-modal title="附件上传" v-model="attachmentUploadVisible">
      <a-upload-dragger
        name="file"
        :multiple="true"
        :action="upload"
        @change="uploadAttachment"
        :headers="headers"
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
    </a-modal>

    <a-modal title="附件详情" v-model="attachmentVisible">
      <a-form v-if="attachmentDetails">
        <a-form-item label="路径">
          <a-input v-model="attachmentDetails.path"></a-input>
        </a-form-item>
        <a-form-item label="ThumbPath" v-show="handlePictureType(attachmentVisible)">
          <a-input v-model="attachmentDetails.thumbPath"></a-input>
        </a-form-item>
        <div v-if="handleVideoType(attachmentDetails)">
          <video :src="attachmentDetails.path" controls style="width:100%"></video>
        </div>
        <div v-if="handlePictureType(attachmentDetails)">
          <img :src="attachmentDetails.path" controls style="width:100%" />
        </div>
        <div v-if="handleMusicType(attachmentDetails)">
          <audio :src="attachmentDetails.path" controls style="width:100%"></audio>
        </div>
      </a-form>
    </a-modal>
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
import attachmentApi from "@/api/attachment.js";
import preview from "@/api/preview.js";
import latexApi from "@/api/latex.js";

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
        categoryId: null,
        templateName: null,
        title: "",
        viewName: "",
        summary: "",
        status: "PUBLISHED",
        pathPic: "",
        userId: 1
      },
      pagination: {
        page: 0,
        size: 10,
        sort: null
      },
      img_file: {},
      visible: false,
      tags: [],
      selectedTagNames: [],
      selectedTagIds: [],
      categorys: [],
      selectCategoryIds: [],
      templates: [],
      isUpdate: false,
      articleId: null,
      latexVisible: false,
      latexContent: "",
      latexForamt: "",
      attachemnetVisible: false,
      attachments: [],
      attachmentVisible: false,
      attachmentDetails: null,
      attachmentUploadVisible: false
    };
  },
  watch: {
    latexContent(value) {
      this.getLatexSvg(value);
      // console.log(value);
    }
  },
  created() {
    this.loadcategory();
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
      return attachmentApi.upload();
    },
    headers() {
      var token = localStorage.getItem("Authorization");
      return {
        Authorization: "Bearer " + token
      };
    }
  },
  beforeRouteEnter(to, from, next) {
    // Get post id from query
    const articleId = to.query.articleId;

    next(vm => {
      if (articleId) {
        vm.articleId = articleId;
        articleApi.findById(articleId).then(response => {
          const article = response.data.data;
          vm.queryParam = article;

          // console.log(article);
          // vm.queryParam.originalContent = article.originalContent; // 输入的markdown
          // vm.queryParam.haveHtml= article.haveHtml
          // vm.queryParam.templateName = article.templateName;
          // vm.queryParam.title = article.title;
          // vm.queryParam.viewName = article.viewName;
          // vm.queryParam.summary = article.summary;
          // vm.queryParam.status = article.status;
          // vm.queryParam.picPath = article.picPath;
          //     tagIds: []
          // categoryIds: []
          vm.isUpdate = true;
        });
      }
    });
  },
  methods: {
    imgAdd(pos, $file) {
      var formdata = new FormData();
      formdata.append("file", $file);
      this.img_file[pos] = $file;
      uploadApi.upload(formdata).then(response => {
        // console.log(response.data.data.path);
        this.$refs.md.$img2Url(pos, response.data.data.thumbPath);
      });
    },
    imgDel() {},
    // 提交
    submit() {
      if (!this.queryParam.categoryId) {
        this.$notification["error"]({
          message: "文章类别不能为空!!"
        });
        return;
      }
      if (!this.queryParam.title) {
        this.$notification["error"]({
          message: "文章标题不能为空!!"
        });
        return;
      }
      if (!this.queryParam.originalContent) {
        this.$notification["error"]({
          message: "文章内容不能为空!!"
        });
        return;
      }
      if (!this.queryParam.userId) {
        this.$notification["error"]({
          message: "文章用户不能为空!!"
        });
        return;
      }
      if (this.isUpdate) {
        articleApi
          .update(this.$route.query.articleId, this.queryParam)
          .then(response => {
            // console.log(response);
            this.$notification["success"]({
              message: "更新成功:" + response.data.message
            });
            this.$router.push("/article/list");
            // this.$router.push("/article/list");
          });
      } else {
        // console.log(this.queryParam);
        articleApi.create(this.queryParam).then(response => {
          // console.log(response);
          this.$notification["success"]({
            message: "成功创建文章" + response.data.message
          });
          this.$router.push("/article/list");
        });
      }
    },
    save() {
      if (!this.queryParam.categoryId) {
        this.$notification["error"]({
          message: "文章类别不能为空!!"
        });
        return;
      }
      if (!this.queryParam.title) {
        this.$notification["error"]({
          message: "文章标题不能为空!!"
        });
        return;
      }
      if (!this.queryParam.originalContent) {
        this.$notification["error"]({
          message: "文章内容不能为空!!"
        });
        return;
      }
      if (!this.queryParam.userId) {
        this.$notification["error"]({
          message: "文章用户不能为空!!"
        });
        return;
      }
      if (this.isUpdate) {
        articleApi
          .updateArticle(this.articleId, this.queryParam)
          .then(response => {
            this.articleId = response.data.data.id;
            this.$notification["success"]({
              message: "更新文章成功:" + response.data.message
            });
          });
      } else {
        articleApi.saveArticle(this.queryParam).then(response => {
          this.articleId = response.data.data.id;
          this.isUpdate = true;
          this.$notification["success"]({
            message: "保存文章" + response.data.message
          });
        });
      }
    },
    uploadAttachment(info) {
      const status = info.file.status;
      if (status === "done") {
        let attachementRes = info.file.response.data;
        let resHtml = "";
        if (this.handleMusicType(attachementRes)) {
          resHtml =
            "<audio src='" + attachementRes.path + "' controls></audio>";
        } else if (this.handleVideoType(attachementRes)) {
          resHtml =
            "<video src='" + attachementRes.path + "' controls></video>";
        } else if (this.handlePictureType(attachementRes)) {
          resHtml = "<img src='" + attachementRes.thumbPath + "' />";
        } else {
          resHtml =
            "<a href='" +
            attachementRes.path +
            "' download='file+" +
            new Date() +
            "'>点击下载</a>";
        }
        // console.log(attachementRes)
        // console.log(resHtml)
        this.insert(resHtml);
        this.attachmentUploadVisible = false;
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    uploadPic(info) {
      const status = info.file.status;
      // if (status !== "uploading") {
      //   // console.log(info.file, info.fileList);
      // }
      if (status === "done") {
        this.queryParam.picPath = info.file.response.data.thumbPath;
        // console.log(info.file.response.data.path);
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    showDrawer() {
      this.loadTags();
      // this.loadcategory();
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
        // console.log( this.queryParam.tagIds)
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
    nextPage(num) {
      this.pagination.page = this.pagination.page + num;
      // console.log(this.pagination);
      attachmentApi.list(this.pagination).then(resp => {
        // console.log(resp);
        this.attachments = resp.data.data.content;
      });
    },
    loadAttachment() {
      attachmentApi.list(this.pagination).then(resp => {
        // console.log(resp);
        this.attachments = resp.data.data.content;
      });
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
        this.categorys = response.data.data;
      });
    },
    loadTempalte() {
      templateApi.findByType("ARTICLE").then(response => {
        this.templates = response.data.data;
        // console.log(response);
      });
    },
    preview() {
      if (!this.queryParam.categoryId) {
        this.$notification["error"]({
          message: "文章类别不能为空!!"
        });
        return;
      }
      if (!this.queryParam.title) {
        this.$notification["error"]({
          message: "文章标题不能为空!!"
        });
        return;
      }
      if (!this.queryParam.originalContent) {
        this.$notification["error"]({
          message: "文章内容不能为空!!"
        });
        return;
      }

      if (!this.articleId) {
        articleApi.saveArticle(this.queryParam).then(response => {
          this.articleId = response.data.data.id;
          // console.log(this.articleId);
          this.$notification["success"]({
            message: "预览之前保存文章" + response.data.message
          });
          window.open(preview.Online("article", this.articleId), "_blank");

          // this.$router.push("/article/list");
        });
      } else {
        window.open(preview.Online("article", this.articleId), "_blank");
      }
    },
    openLatexPanel() {
      this.latexVisible = true;
    },
    async insert(myValue) {
      // const myField = document.querySelector('#textarea');
      const myField = this.$refs.md;
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        this.queryParam.originalContent =
          myField.value.substring(0, startPos) +
          myValue +
          myField.value.substring(endPos, myField.value.length);
        await this.$nextTick(); // 这句是重点, 圈起来
        myField.focus();
        myField.setSelectionRange(
          endPos + myValue.length,
          endPos + myValue.length
        );
      } else {
        this.queryParam.originalContent += myValue;
      }
    },
    getLatexSvg(latex) {
      latexApi.preview(latex).then(resp => {
        this.latexForamt = resp.data;
      });
    },
    saveLatexSvg() {
      if (!this.latexContent) {
        return;
      }
      latexApi.save(this.latexContent).then(resp => {
        if (resp.data.message) {
          this.insert("![](/latex/" + resp.data.message + ")");
        }
        this.latexVisible = false;
      });
    },
    openAttachement() {
      this.attachemnetVisible = true;
      this.loadAttachment();
    },
    addToTextarea(item) {
      this.attachmentVisible = true;
      // console.log(item);
      this.attachmentDetails = item;
    },
    handlePictureType(attachment) {
      var mediaType = attachment.mediaType;
      // 判断文件类型
      if (mediaType) {
        var prefix = mediaType.split("/")[0];

        if (prefix === "image") {
          // 是图片
          return true;
        } else {
          // 非图片
          return false;
        }
      }
      // 没有获取到文件返回false
      return false;
    },
    handleMusicType(attachment) {
      var mediaType = attachment.mediaType;
      // 判断文件类型
      if (mediaType) {
        var prefix = mediaType.split("/")[0];

        if (prefix === "audio") {
          // 是音乐
          return true;
        } else {
          // 非图片
          return false;
        }
      }
      // 没有获取到文件返回false
      return false;
    },
    handleVideoType(attachment) {
      var mediaType = attachment.mediaType;
      // 判断文件类型
      if (mediaType) {
        var prefix = mediaType.split("/")[0];

        if (prefix === "video") {
          // 是音乐
          return true;
        } else {
          // 非图片
          return false;
        }
      }
      // 没有获取到文件返回false
      return false;
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