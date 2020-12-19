<template>
  <div>
    <a-button type="primary" @click="append">添加分类</a-button>
    <a-button @click="updateAll(false)">生成所有分类HTML</a-button>
    <a-button @click="updateAll(true)">生成所有分类HTML更新模板</a-button>
    <!-- <a-tabs defaultActiveKey="-1" @change="tabCallback"> -->
    <!-- <a-tab-pane :tab="itemTab.name" :key="itemTab.enName" v-for="itemTab in templates"> -->
    <a-table
      :columns="columns"
      :dataSource="categorys"
      :pagination="false"
      :rowKey="category => category.id"
      size="small"
      class="table"
      :scroll="{ x: 1500 }"
    >
      <a
        slot="name"
        slot-scope="name, record"
        href="javascript:;"
        @click="preview(record.id)"
      >{{name}}</a>
      <a
        slot="viewName"
        slot-scope="viewName, record"
        href="javascript:;"
        @click="openHtml(record)"
      >{{viewName}}</a>

      <a
        slot="firstArticle"
        slot-scope="firstArticle, record"
        href="javascript:;"
        @click="openHtmlFirstArticle(record)"
      >{{firstArticle}}</a>

      <div slot="recommend" slot-scope="recommend,record">
        <a-switch defaultChecked @change="onChange(record.id)" v-model="record.recommend" />
      </div>

      <div slot="existNav" slot-scope="existNav,record">
        <a-switch defaultChecked @change="onChangeNav(record.id)" v-model="record.existNav" />
      </div>

      <div slot="haveHtml" slot-scope="haveHtml,record">
        <a-switch defaultChecked @change="onChangeHtml(record.id)" v-model="record.haveHtml" />
      </div>
      <span slot="action" slot-scope="text, record">
        <!-- <a href="javascript:;">Invite 一 {{record.name}}</a>
        <a-divider type="vertical" />-->

        <!-- <a href="javascript:;" @click="preview(record.id)">在线预览</a> -->
        <!-- <a-divider type="vertical" />
        <a href="javascript:;" @click="openHtml(record)">预览Html</a>-->
        <a-divider type="vertical" />
        <a href="javascript:;" @click="articleListShow(record.id)">查看文章</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="generateHtml(record.id)">生成HTML</a>

        <a-divider type="vertical" />
        <a href="javascript:;" @click="()=> edit(record.id)">编辑</a>

        <a-divider type="vertical" />
        <a href="javascript:;" @click="(e)=> remove(record.id)">删除分类</a>
        <!-- <a href="javascript:;" class="ant-dropdown-link">
        More actions
        <a-icon type="down" />
        </a>-->
      </span>
    </a-table>
    <!-- </a-tab-pane> -->

    <!-- <a-tab-pane tab="使用说明" ></a-tab-pane> -->
    <!-- </a-tabs> -->

    <a-modal title="添加分类" v-model="visible" @ok="handleOk">
      <a-form-item label="一页文章数量">
        <a-input-number id="inputNumber" v-model="categoryParam.articleListSize" />
      </a-form-item>
      <a-switch defaultChecked v-model="categoryParam.desc" />

      <a-form layout="horizontal">
        <a-form-item label="视图的名称" help="不输入.默认生成">
          <a-input v-model="categoryParam.viewName"></a-input>
        </a-form-item>
        <a-form-item label="分类名称">
          <a-input v-model="categoryParam.name"></a-input>
        </a-form-item>

        <a-form-item label="选择分类信息模板">
          <a-select style="width: 100%" v-model="categoryParam.templateName">
            <a-select-option
              :value="item.enName"
              v-for="item in templates"
              :key="item.id"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="选择文章显示的模板">
          <a-select style="width: 100%" v-model="categoryParam.articleTemplateName">
            <a-select-option
              :value="item.enName"
              v-for="item in articleTemplate"
              :key="item.enName"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="分类的描述">
          <a-textarea v-model="categoryParam.description"></a-textarea>
        </a-form-item>
        <a-form-item>
          <a-upload-dragger
            name="file"
            :multiple="true"
            :action="upload"
            @change="handleChange"
            :headers="headers"
            :withCredentials="true"
          >
            <p class="ant-upload-drag-icon">
              <!-- <a-icon type="inbox" /> -->
              <img :src="categoryParam.picPath" width="100%" alt srcset />
            </p>
            <p class="ant-upload-text"></p>
            <p
              class="ant-upload-hint"
            >Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
          </a-upload-dragger>
          <a-input placeholder="直接粘贴图片路径" v-model="categoryParam.picPath"></a-input>
        </a-form-item>

        <a-form-item label="父ID">
          <a-select style="width: 100%" v-model="categoryParam.parentId">
            <a-select-option
              :value="item.id"
              v-for="item in categorys"
              :key="item.id"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>


        <a-form-item label="排序">
          <a-input v-model="categoryParam.order"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-drawer
      title="文章列表"
      placement="right"
      :closable="true"
      :visible="articleListDrawer"
      @close="()=>{articleListDrawer=false}"
      width="40rem"
    >
      <!-- <a-button type="primary" @click="updateArticleOrder">提交排序结果</a-button> -->
      <a-list bordered :dataSource="articles">
        <a-list-item slot="renderItem" slot-scope="item">
          <!-- <a slot="actions">编辑</a>
          <a slot="actions" @click="delComment(item.id)">删除</a>
          <a slot="actions">回复</a>-->
          <a-input-number slot="actions" v-model="item.order" />
          <a slot="actions" @click="updateArticleOrder(item.id,item.order)">更新文章Order</a>
          <a-list-item-meta :description="item.content">
            <a slot="title">{{item.title}}</a>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-drawer>
  </div>
</template>

<script>
const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    // fixed: "left",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "视图名称",
    dataIndex: "viewName",
    key: "viewName",
    scopedSlots: { customRender: "viewName" }
  },

  {
    title: "category模板",
    dataIndex: "templateName",
    key: "templateName"
  },
  {
    title: "文章模板",
    dataIndex: "articleTemplateName",
    key: "articleTemplateName"
  },
  {
    title: "是否推荐首页",
    dataIndex: "recommend",
    key: "recommend",
    scopedSlots: { customRender: "recommend" }
  },
  {
    title: "是否添加到导航",
    dataIndex: "existNav",
    key: "existNav",
    scopedSlots: { customRender: "existNav" }
  },
  {
    title: "是否生成Html",
    dataIndex: "haveHtml",
    key: "haveHtml",
    scopedSlots: { customRender: "haveHtml" }
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    scopedSlots: { customRender: "action" }
  }
];
import categoryApi from "@/api/category.js";
import templateApi from "@/api/template.js";
import preview from "@/api/preview.js";
// import uploadApi from "@/api/upload.js";
import attachmentApi from "@/api/attachment.js";
import ArticleApi from "@/api/article.js";
export default {
  data() {
    return {
      columns: columns,
      form: this.$form.createForm(this, { name: "123" }),
      categorys: [],
      parentCategory: [],
      articles: [],
      // value: "",
      templates: [],
      articleTemplate: [],
      isUpdate: false,
      updateId: null,
      visible: false,
      currentTabId: null,
      articleListDrawer: false,
      categoryId: null,
      categoryParam: {
        order: 0,
        name: "",
        templateName: "",
        viewName: "",
        description: "",
        picPath: "",
        articleTemplateName: "",
        firstArticle: "",
        articleListSize: 10,
        desc: true,
        parentId: 0
      }
    };
  },
  created() {
    this.loadcategory();
  },
  computed: {
    upload() {
      return attachmentApi.upload();
    },
    headers() {
      var token = localStorage.getItem("jwtToken");
      return {
        Authorization: "Bearer " + token
      };
    }
  },
  methods: {
    loadTempalte() {
      templateApi.findByType("CATEGORY").then(response => {
        this.templates = response.data.data;
      });
    },
    loadArticleTempalte() {
      templateApi.findByType("ARTICLE").then(response => {
        this.articleTemplate = response.data.data;
        // console.log(response);
      });
    },
    loadcategory() {
      // categoryApi.pageBy(templateEnName).then(resp => {
      //   console.log(resp.data.data.content);
      //   this.categorys = resp.data.data.content;
      // });
      categoryApi.listTree().then(resp => {
        // console.log(resp.data.data);
        this.categorys = resp.data.data;
      });
      // console.log("loadcategory");
      // categoryApi.listByParent(id).then(response => {
      //   // console.log(response);
      //   this.categorys = response.data.data;
      // });
    },
    loadParentCategory() {
      templateApi.findByType("CATEGORY").then(response => {
        this.templates = response.data.data;
        this.loadcategory(this.templates[0].enName);
        // console.log(this.templates);
      });
    },
    loadArticle(id) {
      ArticleApi.pageDtoBy(id).then(response => {
        // console.log(response);
        this.articles = response.data.data.content;
      });
      // console.log(id)
    },
    articleListShow(id) {
      this.categoryId = id;
      // console.log(id);
      this.loadArticle(id);
      this.articleListDrawer = true;
    },
    updateArticleOrder(id, order) {
      // console.log(id+"-"+order)
      ArticleApi.updateOrderBy(id, order).then(resp => {
        this.$notification["success"]({
          message: "成功更改文章" + resp.data.data.title + "的顺序!"
        });
        this.loadArticle(this.categoryId);
      });
    },
    handleChange(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        this.categoryParam.picPath = info.file.response.data.path;
        // console.log(info.file.response.data.path);
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },

    handleOk() {
      // console.log(this.categoryParam)
      if (!this.categoryParam.name) {
        this.$notification["error"]({
          message: "分类标题不能为空!!"
        });
        return;
      }
      if (this.isUpdate) {
        // this.desc=1
        // console.log(this.categoryParam);
        categoryApi.update(this.updateId, this.categoryParam).then(response => {
          this.$notification["success"]({
            message: "成功更新数据:" + response.data.data.name
          });
           this.loadcategory();
        });
      } else {
        categoryApi.add(this.categoryParam).then(response => {
          this.$notification["success"]({
            message: "成功添加:" + response.data.data.name
          });
           this.loadcategory();
        });
      }

      this.visible = false;
    },
    append() {
      this.loadTempalte();
      this.loadArticleTempalte();

      this.isUpdate = false;
      this.visible = true;
    },

    edit(id) {
      this.loadTempalte();
      // this.loadArticle(id);

      this.loadArticleTempalte();
      this.isUpdate = true;

      this.updateId = id;
      categoryApi.findById(id).then(response => {
        this.categoryParam = response.data.data;
        // console.log(this.categoryParam);
        // this.categoryParam.haveHtml = 0;
        this.visible = true;
      });
    },
    onChange(item) {
      // console.log(item);
      categoryApi.recommendOrCancel(item).then(response => {
        if (response.data.data.recommend) {
          this.$notification["success"]({
            message: "分类" + response.data.data.name + "成功在首页推荐!!"
          });
        } else {
          this.$notification["success"]({
            message: "分类" + response.data.data.name + "已经从首页取消推荐!!"
          });
        }
      });
    },
    onChangeNav(id) {
      // console.log(id);
      categoryApi.addOrRemoveToMenu(id).then(response => {
        if (response.data.data.existNav) {
          this.$notification["success"]({
            message: "成功添加" + response.data.data.name + "到导航!!"
          });
        } else {
          this.$notification["success"]({
            message: "成功移除" + response.data.data.name + "到导航!!"
          });
        }
      });
    },
    onChangeHtml(id) {
      // console.log(id);
      categoryApi.haveHtml(id).then(response => {
        const data = response.data.data;
        if (data.haveHtml) {
          this.$notification["success"]({
            message: "成功生成" + data.name + "Html"
          });
        } else {
          this.$notification["success"]({
            message: "成功移除" + data.name + "Html"
          });
        }
        this.loadcategory();
      });
    },
    remove(value) {
      // console.log(value.key);
      categoryApi.deleteById(value).then(response => {
        this.$notification["success"]({
          message: response.data.message
        });
        this.loadcategory(this.currentTabId);
      });
    },
    preview(value) {
      window.open(preview.Online("category", value), "_blank");
    },

    openHtml(value) {
      if (value.haveHtml) {
        window.open(preview.Html(value.path + "/" + value.viewName), "_blank");
      } else {
        this.$message.error("该分类没有生成HTML");
      }
    },
    openHtmlFirstArticle(value) {
      if (value.haveHtml) {
        window.open(
          preview.Html(
            value.path + "/" + value.viewName + "/" + value.firstArticle
          ),
          "_blank"
        );
      } else {
        this.$message.error("该分类没有生成HTML");
      }
    },
    onClose() {
      this.articleVisible = false;
    },
    generateHtml(id) {
      categoryApi.generateHtml(id).then(response => {
        this.$notification["success"]({
          message: "成功生成" + response.data.data.name + "的HTML"
        });
      });
    },
    updateAll(more) {
      var _this = this;
      this.$confirm({
        title: "你确定生成所有栏目HTML?",
        content: "Some descriptions",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          // console.log(_this.currentTabId)
          if (more) {
            categoryApi.updateAll({ more: true }).then(response => {
              _this.$notification["success"]({
                message: "成功生成栏目Id为:" + response.data.data + "的HTML页面"
              });
              _this.loadcategory(_this.currentTabId);
            });
          } else {
            categoryApi.updateAll().then(response => {
              _this.$notification["success"]({
                message: "成功生成栏目Id为:" + response.data.data + "的HTML页面"
              });
              _this.loadcategory(_this.currentTabId);
            });
          }
        },
        onCancel() {
          // console.log("Cancel");
        }
      });
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