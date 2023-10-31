<template>
  <div>
    <a-row>
      <a-col :span="4">
        <a-button @click="fetchComponents">从文件中获取模板</a-button>
        <a-button @click="installLanguage">安装语言模板</a-button>
        <a-button @click="createAllLanguage">创建所有语言模板</a-button>
        <a-form-item label="语言">
          <a-select style="width: 100%" @change="(value) => { this.queryParam.lang = value; this.loadTemplate() }"
            :value=this.queryParam.lang>
            <a-select-option :value="item" v-for="item in langs" :key="item">{{ item }}</a-select-option>
            <!-- <a-select-option value="EN" >英文</a-select-option> -->
          </a-select>
        </a-form-item>

      </a-col>
      <a-col :span="20">
        <a-table :columns="columns" :dataSource="template" :pagination="false" :rowKey="(template) => template.id">
          <a slot="templateName" slot-scope="templateName, record" href="javascript:;" @click="preview(record.id)">[{{
            record.id }}]-{{ templateName }}</a>

          <span slot="dataName" slot-scope="dataName, record">
            <a v-if="dataName == '@Article'" href="javascript:;" @click="showArticle(record.id)">{{ dataName }}</a>
            <a v-else-if="dataName == '@Category'" href="javascript:;" @click="showCategory(record.id)">{{ dataName }}</a>
            <a v-else-if="dataName == '@CategoryArticle'" href="javascript:;" @click="showCategory(record.id)">{{ dataName
            }}</a>
            <a v-else-if="dataName == '@CategoryChild'" href="javascript:;" @click="showCategory(record.id)">{{ dataName
            }}</a>
            <a v-else-if="dataName == dataName.search('@CategoryArticlePage') != -1" href="javascript:;"
              @click="showCategory(record.id)">{{ dataName }}</a>
            <a v-else-if="dataName.search('@CategoryArticleSize') != -1" href="javascript:;"
              @click="showCategory(record.id)">{{ dataName }}</a>
            <span v-else>{{ dataName }}</span>
          </span>

          <span slot="action" slot-scope="text, record">

            <a href="javascript:;" @click="createComponentsLanguage(record.id)">复制英文</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click="deleteComponent(record.id)">删除</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click="editComponent(record.id)">编辑</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click="openHtml(record)">查看Html</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click="generateHtml(record)">生成Html</a>
          </span>
        </a-table>
        <div class="page-wrapper" :style="{ textAlign: 'right' }">
          <a-pagination class="pagination" :current="pagination.page" :total="pagination.total"
            :defaultPageSize="pagination.size" :pageSizeOptions="['1', '2', '5', '10', '20', '50', '100']" showSizeChanger
            @showSizeChange="handlePaginationChange" @change="handlePaginationChange" />
        </div>
      </a-col>
    </a-row>


    <a-drawer title="分类列表" placement="right" :closable="true" :visible="categoryListDrawer" @close="() => {
      categoryListDrawer = false;
    }
      " width="40rem">
      <a-input v-model="categoryViewName" min="1" :max="10"></a-input>
      <a-button @click="addByCategoryViewName">添加分类</a-button>
      <a-button @click="addAllCategory">添加所有父分类</a-button>

      <a-list bordered :dataSource="articles">
        <a-list-item slot="renderItem" slot-scope="item">
          <!-- <a slot="actions">编辑</a>
          <a slot="actions" @click="delComment(item.id)">删除</a>
          <a slot="actions">回复</a>-->

          <a slot="actions" @click="
            updateCategoryInComponentOrder(
              item.id,
              item.categoryInComponentOrder
            )
            ">更新顺序</a>
          <a slot="actions" @click="removeCategory(item.id)">从组件移除分类</a>

          <a-list-item-meta>
            <a slot="title" @click="openCategoryHtml(item)">{{ item.name }}</a>
            <a-input-number slot="title" v-model="item.categoryInComponentOrder"></a-input-number>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-drawer>
    <a-drawer title="文章列表" placement="right" :closable="true" :visible="articleListDrawer" @close="() => {
      articleListDrawer = false;
    }
      " width="40rem">
      <a-input v-model="articleViewName" min="1" :max="10"></a-input>
      <a-button @click="addByArticleViewName">添加文章</a-button>

      <a-list bordered :dataSource="articles">
        <a-list-item slot="renderItem" slot-scope="item">
          <!-- <a slot="actions">编辑</a>
          <a slot="actions" @click="delComment(item.id)">删除</a>
          <a slot="actions">回复</a>-->

          <a slot="actions" @click="
            updateArticleInComponentOrder(
              item.id,
              item.articleInComponentOrder
            )
            ">更新顺序</a>
          <a slot="actions" @click="removeArticle(item.id)">从组件移除文章</a>

          <a-list-item-meta>
            <a slot="title" @click="openArticleHtml(item)">{{ item.title }}</a>
            <a-input-number slot="title" v-model="item.articleInComponentOrder"></a-input-number>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-drawer>
  </div>
</template>
<script>
import preview from "@/api/preview.js";
const columns = [
  {
    title: "模板名称",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "templateName" },
  }, {
    title: "语言",
    dataIndex: "lang",
    key: "lang",

  },
  // {
  //   title: "模板名称",
  //   dataIndex: "enName",
  //   key: "enName",
  // },
  {
    title: "数据来源",
    key: "dataName",
    dataIndex: "dataName",
    scopedSlots: { customRender: "dataName" },
  },

  {
    title: "视图名称",
    dataIndex: "viewName",
    key: "viewName",
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    key: "createDate",
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
import categoryApi from "@/api/category.js";

import templatePageApi from "@/api/templatePage.js";
// import preview from "@/api/preview.js";
import ContentApi from "@/api/content.js";
import componentsArticle from "@/api/ComponentsArticle.js";
import componentsCategory from "@/api/ComponentsCategory.js";
import enumApi from "@/api/enum.js";
export default {
  data() {
    return {
      pagination: {
        page: 1,
        size: 1000,
        sort: null,
      },
      queryParam: {
        page: 0,
        size: 10,
        sort: null,
        keyword: null,
        categoryId: null,
        status: null,
        lang: 'ZH'
      },
      columns,
      articles: [],
      template: [],
      articleInComponentOrder: 3,
      componentId: null,
      articleListDrawer: false,
      categoryListDrawer: false,
      articleViewName: "",
      categoryViewName: "",
      langs: []

    };
  },
  created() {
    this.loadTemplate();
    enumApi.list("Lang").then((resp) => {
      // console.log(resp.data.data);
      this.langs = resp.data.data;
    });
  },
  methods: {
    loadTemplate() {
      this.queryParam.page = this.pagination.page - 1;
      this.queryParam.size = this.pagination.size;
      this.queryParam.sort = this.pagination.sort;

      templatePageApi.list(this.queryParam).then((response) => {
        this.template = response.data.data.content;
        this.pagination.total = response.data.data.totalElements;
        // console.log(response);
      });
    }, fetchComponents() {
      templatePageApi.fetchComponents("").then(resp => {
        // console.log(resp)
        this.loadTemplate();
        this.$notification["success"]({
          message: resp.data.message,
        });
      })
    }, createComponentsLanguage(id) {
      templatePageApi.createComponentsLanguage(id).then(resp => {
        // console.log(resp)
        this.$notification["success"]({
          message: resp.message
        });
        this.loadTemplate()
      })


    }, installLanguage() {
      templatePageApi.installLanguage("").then(resp => {
        // console.log(resp)
        this.loadTemplate();
        this.$notification["success"]({
          message: resp.data.message,
        });
      })
    }, createAllLanguage() {
      templatePageApi.createAllLanguage("").then(resp => {
        // console.log(resp)
        this.loadTemplate();
        this.$notification["success"]({
          message: resp.data.message,
        });
      })
    },
    updateArticleInComponentOrder(id, order) {
      ContentApi.updateArticleInComponentOrder(id, order).then((resp) => {
        this.$notification["success"]({
          message: resp.data.message,
        });
      });
    }, updateCategoryInComponentOrder(id, order) {
      categoryApi.updateCategoryInComponentOrder(id, order).then((resp) => {
        this.$notification["success"]({
          message: resp.data.message,
        });
      });
    },
    handlePaginationChange(page, pageSize) {
      // console.log("111")
      // this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page;
      this.pagination.size = pageSize;
      this.loadTemplate();
    },
    preview(value) {
      window.open(preview.Online("component", value), "_blank");
      // console.log(value);
    },
    generateHtml(value) {
      // console.log(value.id)
      templatePageApi.generateHtml(value.id).then((response) => {
        //  console.log(response)
        this.$notification["success"]({
          message: response.data.message,
        });
      });
    },
    openHtml(value) {
      //  console.log(value)
      window.open(preview.Html(value.path + "/" + value.viewName), "_blank");
    },
    showArticle(id) {
      // console.log(id);
      this.componentId = id;
      this.articleListDrawer = true;
      ContentApi.listByComponentsId(id).then((resp) => {
        // console.log(resp);
        this.articles = resp.data.data;
      });
    },
    showCategory(id) {
      this.componentId = id;
      this.categoryListDrawer = true;
      categoryApi.listByComponentsId(id).then((resp) => {
        // console.log(resp);
        this.articles = resp.data.data;
      });
    },
    addByArticleViewName() {
      if (this.articleViewName == "") {
        this.$message.error("视图不能为空");
        return;
      }
      componentsArticle
        .addByArticleViewName(this.componentId, this.articleViewName)
        .then((resp) => {
          this.articleViewName = "";
          this.showArticle(this.componentId);
          this.$notification["success"]({
            message: "操作" + resp.data.message,
          });
        });
    },
    addByCategoryViewName() {
      if (this.categoryViewName == "") {
        this.$message.error("视图不能为空");
        return;
      }
      componentsCategory
        .addByCategoryViewName(this.componentId, this.categoryViewName)
        .then((resp) => {
          this.categoryViewName = "";
          this.showCategory(this.componentId);
          this.$notification["success"]({
            message: "操作" + resp.data.message,
          });
        });
    }, addAllCategory() {
      componentsCategory
        .addAllCategory(this.componentId)
        .then((resp) => {
          this.categoryViewName = "";
          this.showCategory(this.componentId);
          this.$notification["success"]({
            message: "操作" + resp.data.message,
          });
        });
    },
    removeArticle(id) {
      // console.log(id);
      componentsArticle.delete(this.componentId, id).then((resp) => {
        this.showArticle(this.componentId);
        this.$notification["success"]({
          message: "操作" + resp.data.message,
        });
      });
    }, removeCategory(id) {
      // console.log(id);
      componentsCategory.delete(this.componentId, id).then((resp) => {
        this.showCategory(this.componentId);
        this.$notification["success"]({
          message: "操作" + resp.data.message,
        });
      });
    },
    openArticleHtml(value) {
      window.open(preview.Html(value.path + "/" + value.viewName), "_blank");
    },
    openCategoryHtml(value) {
      window.open(preview.Html(value.path + "/" + value.viewName), "_blank");
    },
    editComponent(id) {
      this.$router.push({
        name: "ComponentsCreate",
        query: { id: id },
      });
      // templatePageApi.findDetailsById(id).then(resp => {
      //   console.log(resp);
      // });
    },
    deleteComponent(id) {
      templatePageApi.delete(id).then((resp) => {
        this.loadTemplate();
        this.$notification["success"]({
          message: "操作" + resp.data.message,
        });
      });
    },
  },
};
</script>
