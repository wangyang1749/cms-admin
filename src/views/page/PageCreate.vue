<template>
  <div>
    <div>
      <a-input placeholder="请输入标题" v-model="queryParam.title" />
      <a-switch v-model="queryParam.isSource" @change="onChange" />

      <mavon-editor
        v-model="queryParam.originalContent"
        ref="md"
        @change="change"
        style="min-height: 600px; z-index: 1"
        @imgAdd="imgAdd"
        @imgDel="imgDel"
      />
      <!-- <a-form-item label="输入CSS">
        <a-input type="textarea" v-model="queryParam.cssContent"></a-input>
      </a-form-item>

      <a-form-item label="输入JS">
        <a-input type="textarea" v-model="queryParam.jsContent"></a-input>
      </a-form-item> -->

      <div class="article-bottom">
        <div class="article-option">
          <a-button type="primary" @click="save">保存</a-button>
          <a-button type="primary" @click="preview">预览</a-button>
          <a-button type="primary" @click="showDrawer">打开发布面板</a-button>
          <a-button type="primary" @click="openAttachement">附件库</a-button>
        </div>
      </div>

      <a-drawer
        title="创建或跟新页面"
        placement="right"
        :closable="false"
        @close="onClose"
        :visible="visible"
        width="30rem"
      >
        <a-form-item label="页面名称">
          <a-input v-model="queryParam.title"></a-input>
        </a-form-item>
        <a-form-item label="资源" v-if="template">
          <a-textarea v-model="template.resource" />
        </a-form-item>
        <a-form>
          <a-form-item label="视图路径">
            <a-input
              placeholder="请输入视图路径"
              v-model="queryParam.viewName"
            />
          </a-form-item>

          <a-form-item label="选择模板">
            <a-select
              style="width: 100%"
              v-model="queryParam.templateName"
              @change="handleChange"
            >
              <a-select-option
                :value="item.enName"
                v-for="item in templates"
                :key="item.id"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-button @click="submit">发布</a-button>
          </a-form-item>
        </a-form>
      </a-drawer>

      <a-drawer
        title="附件库"
        placement="right"
        :closable="false"
        @close="
          () => {
            attachemnetVisible = false;
          }
        "
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

      <a-modal title="附件详情" v-model="attachmentDetailsFlag">
        <a-form v-if="attachmentDetails">
          <a-form-item label="路径">
            <a-input v-model="attachmentDetails.path"></a-input>
          </a-form-item>
          <a-form-item
            label="ThumbPath"
            v-show="handlePictureType(attachmentDetails)"
          >
            <a-input v-model="attachmentDetails.thumbPath"></a-input>
          </a-form-item>
          <div v-if="handleVideoType(attachmentDetails)">
            <video
              :src="attachmentDetails.path"
              controls
              style="width: 100%"
            ></video>
          </div>
          <div v-if="handlePictureType(attachmentDetails)">
            <img :src="attachmentDetails.path" controls style="width: 100%" />
          </div>
          <div v-if="handleMusicType(attachmentDetails)">
            <audio
              :src="attachmentDetails.path"
              controls
              style="width: 100%"
            ></audio>
          </div>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import templateApi from "@/api/template.js";
// import templateApi from "@/api/template.js";
import preview from "@/api/preview.js";
import uploadApi from "@/api/upload.js";
import attachmentApi from "@/api/attachment.js";

import sheetApi from "@/api/sheet.js";
import dynamicLoad from "@/utils/dynamicLoad.js";

export default {
  // 注册
  components: {
    mavonEditor,
  },
  data() {
    return {
      queryParam: {
        originalContent: "", // 输入的markdown
        templateName: "",
        title: "",
        viewName: "",
        status: "PUBLISHED",
        // cssContent: "",
        // jsContent: "",
        isSource: false,
      },
      visible: false,
      templates: [],
      template: undefined,
      isUpdate: false,
      sheetId: null,
      img_file: {},
      attachments: [],
      attachemnetVisible: false,
      attachmentDetailsFlag: false,
      attachmentDetails: null,
    };
  },

  beforeRouteEnter(to, from, next) {
    // Get post id from query
    const articleId = to.query.sheetId;
    next((vm) => {
      if (articleId) {
        sheetApi.findById(articleId).then((response) => {
          const article = response.data.data;
          // console.log(article);
          vm.queryParam.originalContent = article.originalContent; // 输入的markdown
          vm.queryParam.haveHtml = article.haveHtml;
          vm.sheetId = article.id;
          vm.queryParam.templateName = article.templateName;
          // vm.queryParam.cssContent = article.cssContent;
          // vm.queryParam.jsContent = article.jsContent;
          vm.queryParam.title = article.title;
          vm.queryParam.viewName = article.viewName;
          vm.queryParam.status = article.status;
          vm.queryParam.isSource = article.isSource;
          //     tagIds: []
          // categoryIds: []
          vm.isUpdate = true;
          vm.loadTemplate(article.templateName);
          // console.log(article.templateName)
        });
      }
    });
  },
  destroyed() {
    this.removejscssfile();
  },
  mounted() {
    if (!this.isUpdate) {
      this.loadTemplate();
    }
  },
  methods: {
    loadAttachment() {
      attachmentApi.list(this.pagination).then((resp) => {
        // console.log(resp);
        this.attachments = resp.data.data.content;
      });
    },
    imgAdd(pos, $file) {
      var formdata = new FormData();
      formdata.append("file", $file);
      this.img_file[pos] = $file;
      uploadApi.upload(formdata).then((response) => {
        // console.log(response.data.data.path);
        this.$refs.md.$img2Url(pos, response.data.data.thumbPath);
      });
    },
    imgDel() {},
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.queryParam.formatContent = render;
    },
    // 提交
    submit() {
      // if (!this.queryParam.channelId) {
      //   this.$notification["error"]({
      //     message: "请选择一个栏目"
      //   });
      //   return;
      // }
      if (this.isUpdate) {
        sheetApi
          .update(this.$route.query.sheetId, this.queryParam)
          .then((response) => {
            // console.log(response);

            this.$notification["success"]({
              message: "更新成功:" + response.data.message,
            });

            this.$router.push({ name: "PageList" });
          });
      } else {
        // console.log(this.queryParam);
        sheetApi.create(this.queryParam).then((response) => {
          // console.log(response);
          this.$notification["success"]({
            message: "添加成功" + response.data.message,
          });
          this.$router.push({ name: "PageList" });
        });
      }
    },
    showDrawer() {
      this.visible = true;
      // console.log(this.queryParam.templateName);
    },
    onClose() {
      this.visible = false;
    },
    removejscssfile() {
      if (this.template) {
        // this.templateCurr=undefined

        if (this.template && this.template.resource) {
          let resource = this.template.resource;
          resource = JSON.parse(resource);
          // console.log(resource);
          // console.log(resource);
          if (resource.css) {
            resource.css.forEach((item) => {
              dynamicLoad.removejscssfile(item, "css");
            });
          }
          if (resource.js) {
            resource.js.forEach((item) => {
              dynamicLoad.removejscssfile(item, "js");
            });
          }
        }
      }
    },
    handleChange(value) {
      // let items = {};
      // this.templates.forEach((item) => {
      //   // console.log(item)
      //   items[item.enName] = item;
      // });
      // // console.log(this.templates)
      // console.log(items[value]);
      // // console.log(value);
      this.removejscssfile();
      this.template = this.templates.filter((item) => item.enName == value)[0];
      if (!this.isUpdate) {
        // console.log(this.template)
        if (this.template && this.template.base) {
          this.queryParam.originalContent = this.template.base;
        }else {
          this.queryParam.originalContent=""
        }
      }

      if (this.template && this.template.resource) {
        let resource = this.template.resource;
        resource = JSON.parse(resource);
        // console.log(resource);
        if (resource.css) {
          resource.css.forEach((item) => {
            // console.log(item);
            dynamicLoad.css(dynamicLoad.addPrefix(item));
          });
        }
        if (resource.js) {
          resource.js.forEach((item) => {
            // console.log(item);
            dynamicLoad.js(dynamicLoad.addPrefix(item));
          });
        }
      }
    },
    loadTemplate(name) {
      templateApi.findByType("SHEET").then((response) => {
        this.templates = response.data.data;
        if (name) {
          this.handleChange(name);
        }

        // console.log(response);
      });
    },
    preview() {
      //  console.log(this.sheetId);
      if (!this.sheetId) {
        sheetApi.saveSheet(this.queryParam).then((response) => {
          this.sheetId = response.data.data.id;

          this.$notification["success"]({
            message: "预览之前保存文章" + response.data.message,
          });

          //          console.log(this.sheetId)
          // console.log(this.queryParam)
          window.open(preview.Online("sheet", this.sheetId), "_blank");

          // this.$router.push("/article/list");
        });
      } else {
        window.open(preview.Online("sheet", this.sheetId), "_blank");
      }
    },
    save() {
      // console.log(this.sheetId)
      // if (!this.queryParam.categoryId) {
      //   this.$notification["error"]({
      //     message: "文章类别不能为空!!"
      //   });
      //   return;
      // }
      // if (!this.queryParam.title) {
      //   this.$notification["error"]({
      //     message: "文章标题不能为空!!"
      //   });
      //   return;
      // }
      // if (!this.queryParam.originalContent) {
      //   this.$notification["error"]({
      //     message: "文章内容不能为空!!"
      //   });
      //   return;
      // }
      // if (!this.queryParam.userId) {
      //   this.$notification["error"]({
      //     message: "文章用户不能为空!!"
      //   });
      //   return;
      // }

      if (this.isUpdate) {
        sheetApi.modifySheet(this.sheetId, this.queryParam).then((response) => {
          this.sheetId = response.data.data.id;
          this.$notification["success"]({
            message: "更新页面成功:" + response.data.message,
          });
        });
      } else {
        sheetApi.saveSheet(this.queryParam).then((response) => {
          this.sheetId = response.data.data.id;
          this.isUpdate = true;
          this.$router.replace({ query: { sheetId: this.sheetId } });
          this.$notification["success"]({
            message: "保存页面" + response.data.message,
          });
        });
      }
    },
    onChange(checked) {
      // console.log(`a-switch to ${checked}`);
      this.queryParam.isSource = checked;
    },
    openAttachement() {
      this.attachemnetVisible = true;
      this.loadAttachment();
    },
    addToTextarea(item) {
      this.attachmentDetailsFlag = true;
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
    },
  },
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