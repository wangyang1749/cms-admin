<template>
  <div>
    <div>
      <mavon-editor
        v-model="queryParam.originalContent"
        ref="md"
        @change="change"
        style="min-height: 600px;z-index: 1;"
      />
      <div class="article-bottom">
        <div class="article-option">
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
          <a-form-item label="页面路径">
            <a-input placeholder="请输入页面路径" v-model="queryParam.viewName" />
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
        templateId: "",
        title: "",
        viewName: "",
        status: "PUBLISHED"
      },
      visible: false,
      templates: [],
      isUpdate: false
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
          // vm.queryParam.haveHtml= article.haveHtml
          // vm.queryParam.templateId = article.templateId;
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
      if (!this.queryParam.templateId) {
        this.$notification["error"]({
          message: "请至少选择一个模板!!"
        });
        return;
      }
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
            message: "添加成功"+response.data.message 
          });
        });
      }
      this.$router.push({ name: "PageList" });
    },
    showDrawer() {
      this.loadTempalte();
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    handleChange(value) {
      this.queryParam.templateId = value;
    },
    loadTempalte() {
      templateApi.findByType("SHEET").then(response => {
        this.templates = response.data.data;
        // console.log(response);
      });
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