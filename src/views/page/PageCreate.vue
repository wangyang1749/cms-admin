<template>
  <div>
    <div>
      <a-input placeholder="请输入标题" v-model="queryParam.title" />
      <mavon-editor
        v-model="queryParam.originalContent"
        ref="md"
        @change="change"
        style="min-height: 600px;z-index: 1;"
      />

      <a-form-item label="输入CSS">
        <a-input type="textarea" v-model="queryParam.cssContent"></a-input>
      </a-form-item>

      <a-form-item label="输入JS">
        <a-input type="textarea" v-model="queryParam.jsContent"></a-input>
      </a-form-item>

      <div class="article-bottom">
        <div class="article-option">
          <a-button type="primary" @click="save">保存</a-button>
          <a-button type="primary" @click="preview">预览</a-button>
          <a-button type="primary" @click="showDrawer">打开发布面板</a-button>
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
        <a-form>
          <a-form-item label="视图路径">
            <a-input placeholder="请输入视图路径" v-model="queryParam.viewName" />
          </a-form-item>

          <a-form-item label="选择模板">
            <a-select style="width: 100%" v-model="queryParam.templateName">
              <a-select-option
                :value="item.enName"
                v-for="item in templates"
                :key="item.id"
              >{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-button @click="submit">发布</a-button>
          </a-form-item>
        </a-form>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import templateApi from "@/api/template.js";
// import templateApi from "@/api/template.js";
import preview from "@/api/preview.js";

import sheetApi from "@/api/sheet.js";
export default {
  // 注册
  components: {
    mavonEditor
  },
  data() {
    return {
      queryParam: {
        originalContent: "", // 输入的markdown
        templateName: "",
        title: "",
        viewName: "",
        status: "PUBLISHED",
        cssContent: "",
        jsContent: ""
      },
      visible: false,
      templates: [],
      isUpdate: false,
      sheetId:null
    };
  },
  beforeRouteEnter(to, from, next) {
    // Get post id from query
    const articleId = to.query.sheetId;
    next(vm => {
      if (articleId) {
        sheetApi.findById(articleId).then(response => {
          const article = response.data.data;
          // console.log(article);
          vm.queryParam.originalContent = article.originalContent; // 输入的markdown
          vm.queryParam.haveHtml = article.haveHtml;
          vm.sheetId = article.id;
          vm.queryParam.templateName = article.templateName;
          vm.queryParam.cssContent = article.cssContent;
          vm.queryParam.jsContent = article.jsContent;
          vm.queryParam.title = article.title;
          vm.queryParam.viewName = article.viewName;
          vm.queryParam.status = article.status;
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
          .then(response => {
            // console.log(response);

            this.$notification["success"]({
              message: "更新成功:" + response.data.message
            });

            this.$router.push({ name: "PageList" });
          });
      } else {
        // console.log(this.queryParam);
        sheetApi.create(this.queryParam).then(response => {
          // console.log(response);
          this.$notification["success"]({
            message: "添加成功" + response.data.message
          });
          this.$router.push({ name: "PageList" });
        });
      }
    },
    showDrawer() {
      this.loadTemplate();
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    handleChange(value) {
      this.queryParam.channelId = value;
    },
    loadTemplate() {
      templateApi.findByType("SHEET").then(response => {
        this.templates = response.data.data;
        // console.log(response);
      });
    },
    preview() {
    //  console.log(this.sheetId);
      if (!this.sheetId) {
    
        sheetApi.saveSheet(this.queryParam).then(response => {
          this.sheetId = response.data.data.id;
          
          this.$notification["success"]({
            message: "预览之前保存文章" + response.data.message
          });

      //          console.log(this.sheetId)
      // console.log(this.queryParam)
          window.open(preview.Online("sheet", this.sheetId), "_blank");

          // this.$router.push("/article/list");
        });
      } else {
        window.open(preview.Online("sheet", this.sheetId), "_blank");
      }
    },save() {
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
        sheetApi
          .modifySheet(this.sheetId, this.queryParam)
          .then(response => {
            this.sheetId = response.data.data.id;
            this.$notification["success"]({
              message: "更新页面成功:" + response.data.message
            });
          });
      } else {
        sheetApi.saveSheet(this.queryParam).then(response => {
          this.sheetId = response.data.data.id;
          this.isUpdate = true;
          this.$notification["success"]({
            message: "保存页面" + response.data.message
          });
        });
      }
    },
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