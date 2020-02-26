<template>
  <div>
    <hr />
    <a-button type="primary" @click="append({key:0})">添加顶级菜单</a-button>
    <a-tree v-if="categorys.length" showLine defaultExpandAll :treeData="categorys">
      <template slot="custom" slot-scope="item">
        <a href="javascript:;" @click="preview(item)">{{item.title}}</a> |
        <a href="javascript:;" @click="findArticle(item)">点击查看</a>
        <a-button type="primary" class="but_type" style="right:200px;" @click="()=> append(item)">新增</a-button>
        <a-button type="primary" class="but_type" style="right:120px;" @click="()=> edit(item)">编辑</a-button>
        <a-button type="primary" class="but_type" @click="(e)=> remove(item)">删除</a-button>
      </template>
    </a-tree>

    <a-modal title="添加分类" v-model="visible" @ok="handleOk">
      <a-form layout="horizontal">
        <a-form-item label="视图的名称" help="不输入.默认生成">
          <a-input v-model="categoryParam.viewName"></a-input>
        </a-form-item>
        <a-form-item label="分类名称">
          <a-input v-model="categoryParam.name"></a-input>
        </a-form-item>

        <a-form-item label="选择模板">
          <a-select style="width: 100%" v-model="categoryParam.templateId">
            <a-select-option :value="item.id" v-for="item in templates" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="描述">
          <a-textarea v-model="categoryParam.description"></a-textarea>
        </a-form-item>
        <a-form-item label="是否需要静态化">
          <a-radio-group v-model="categoryParam.haveHtml" defaultValue="1">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-drawer
      title="查看分类目录下文章"
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="articleVisible"
      width="30rem"
    >
      <a-form>
        <a-form-item label="分类名称">
          <span>{{articles.name}}</span>
        </a-form-item>

        <a-form-item label="静态文件路径">
          <span>{{articles.viewName}}</span>
        </a-form-item>

        <a-form-item label="描述">
          <span>{{articles.description}}</span>
        </a-form-item>
      </a-form>
      <p v-for="item in articles.articleVOList" :key="item.id">{{item.title}}</p>
    </a-drawer>
  </div>
</template>

<script>
import categoryApi from "@/api/category.js";
import templateApi from "@/api/template.js";
import preview from "@/api/preview.js";
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "123" }),
      categorys: [],
      value: "",
      articleVisible: false,
      templates: [],
      isUpdate: false,
      updateId: "",
      visible: false,
      articles: [],
      categoryParam: {
        parentId: "",
        name: "",
        templateId: 2,
        viewName: "",
        description: "",
        haveHtml: 0
      }
    };
  },
  created() {
    this.loadcategory();
  },
  methods: {
    loadTempalte() {
      templateApi.findByType("CATEGORY").then(response => {
        this.templates = response.data.data;
      });
    },

    loadcategory() {
      categoryApi.list().then(response => {
        this.categorys = categoryApi.concreteTree(response.data.data);
      });
    },
    handleOk() {
      if (!this.categoryParam.name) {
        this.$notification["error"]({
          message: "分类标题不能为空!!"
        });
        return;
      }
      if (this.isUpdate) {
        categoryApi.update(this.updateId, this.categoryParam).then(response => {
          this.$notification["success"]({
            message: "成功更新数据:" + response.data.data.name
          });
        });
      } else {
        categoryApi.add(this.categoryParam).then(response => {
          this.$notification["success"]({
            message: "成功添加:" + response.data.data.name
          });
        });
        this.loadcategory();
      }

      this.visible = false;
    },
    append(data) {
      this.loadTempalte();
      this.isUpdate = false;

      this.categoryParam.parentId = data.key;
      this.visible = true;
    },
    edit(data) {
      this.loadTempalte();
      this.isUpdate = true;
      this.updateId = data.key;
      categoryApi.findById(data.key).then(response => {
        console.log(response);
        console.log(response.data.data.templateId);
        this.categoryParam = response.data.data;
        this.categoryParam.haveHtml = 0;
        this.visible = true;
      });
    },
    remove(data) {
      console.log(data);
    },
    preview(value) {
      window.open(preview.Online("category", value.key), "_blank");
    },
    findArticle(value) {
      this.articleVisible = true;
      categoryApi.findByCategoryDetail(value.key).then(response => {
        const category = response.data.data;
        console.log(category);
        this.articles = category
        if (category.articleVOList.length == 0) {
          this.$notification["success"]({
            message: "该分类目录下没有文章"
          });
        } else {
          this.$notification["success"]({
            message:
              "该分类目录下有文章[" + category.articleVOList.length + "]篇"
          });
        }
        // console.log(response)
      });
    },
    onClose() {
      this.articleVisible = false;
    }
  }
};
</script>
<style>
.but_type {
  float: right;
  position: absolute;
  right: 40px;
}
</style>