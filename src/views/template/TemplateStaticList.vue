<template>
  <div>
    <p>生成Html在调试模板事有用</p>
    <a-table
      :columns="columns"
      :dataSource="template"
      :pagination="false"
      :rowKey="template => template.id"
    >
      <a
        slot="templateName"
        slot-scope="templateName, record"
        href="javascript:;"
        @click="preview(record.id)"
      >[{{record.id}}]-{{templateName}}</a>

      <span slot="dataName" slot-scope="dataName, record">
        <a
          v-if="dataName=='@Article'"
          href="javascript:;"
          @click="showArticle(record.id)"
        >{{dataName}}</a>
        <span v-else>{{dataName}}</span>
      </span>

      <span slot="action" slot-scope="text, record">
            <a href="javascript:;" @click="deleteComponent(record.id)">删除</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="editComponent(record.id)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="openHtml(record)">查看Html</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="generateHtml(record)">生成Html</a>
      </span>
    </a-table>
    <div class="page-wrapper" :style="{ textAlign: 'right'}">
      <a-pagination
        class="pagination"
        :current="pagination.page"
        :total="pagination.total"
        :defaultPageSize="pagination.size"
        :pageSizeOptions="['1', '2', '5', '10', '20', '50', '100']"
        showSizeChanger
        @showSizeChange="handlePaginationChange"
        @change="handlePaginationChange"
      />
    </div>

    <a-drawer
      title="文章列表"
      placement="right"
      :closable="true"
      :visible="articleListDrawer"
      @close="()=>{articleListDrawer=false}"
      width="40rem"
    >
      <a-input v-model="articleViewName"></a-input>
      <a-button @click="addByArticleViewName">添加文章</a-button>
      <a-list bordered :dataSource="articles">
        <a-list-item slot="renderItem" slot-scope="item">
          <!-- <a slot="actions">编辑</a>
          <a slot="actions" @click="delComment(item.id)">删除</a>
          <a slot="actions">回复</a>-->
          <a slot="actions" @click="removeArticle(item.id)">从组件移除文章</a>
          <a-list-item-meta :description="item.content">
            <a slot="title" @click="openArticleHtml(item)">{{item.title}}</a>
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
    scopedSlots: { customRender: "templateName" }
  },

  {
    title: "数据来源",
    key: "dataName",
    dataIndex: "dataName",
    scopedSlots: { customRender: "dataName" }
  },

  {
    title: "视图名称",
    dataIndex: "viewName",
    key: "viewName"
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    key: "createDate"
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

import templatePageApi from "@/api/templatePage.js";
// import preview from "@/api/preview.js";
import ArticleApi from "@/api/article.js";
import componentsArticle from "@/api/ComponentsArticle.js";
export default {
  data() {
    return {
      pagination: {
        page: 1,
        size: 5,
        sort: null
      },
      queryParam: {
        page: 0,
        size: 10,
        sort: null,
        keyword: null,
        categoryId: null,
        status: null
      },
      columns,
      articles: [],
      template: [],

      componentId: null,
      articleListDrawer: false,
      articleViewName: ""
    };
  },
  created() {
    this.loadTemplate();
  },
  methods: {
    loadTemplate() {
      this.queryParam.page = this.pagination.page - 1;
      this.queryParam.size = this.pagination.size;
      this.queryParam.sort = this.pagination.sort;
      templatePageApi.list(this.queryParam).then(response => {
        this.template = response.data.data.content;
        this.pagination.total = response.data.data.totalElements;
        // console.log(response);
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
      templatePageApi.generateHtml(value.id).then(response => {
        //  console.log(response)
        this.$notification["success"]({
          message: response.data.message
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
      ArticleApi.listByComponentsId(id).then(resp => {
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
        .then(resp => {
          this.articleViewName = "";
          this.showArticle(this.componentId);
          this.$notification["success"]({
            message: "操作" + resp.data.message
          });
        });
    },
    removeArticle(id) {
      // console.log(id);
      componentsArticle.delete(this.componentId, id).then(resp => {
        this.showArticle(this.componentId);
        this.$notification["success"]({
          message: "操作" + resp.data.message
        });
      });
    },
    openArticleHtml(value) {
      window.open(preview.Html(value.path + "/" + value.viewName), "_blank");
    },
    editComponent(id) {
      this.$router.push({
        name: "ComponentsCreate",
        query: { id: id }
      });
      // templatePageApi.findDetailsById(id).then(resp => {
      //   console.log(resp);
      // });
    },deleteComponent(id){
      templatePageApi.delete(id).then(resp=>{
          this.loadTemplate()
          this.$notification["success"]({
            message: "操作" + resp.data.message
          });
          
      })
    }
  }
};
</script>
