<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="article"
      :pagination="false"
      :rowKey="article => article.id"
    >
     <a slot="articleTitle" slot-scope="articleTitle, record"   href="javascript:;" @click="preview(record.id)">[{{record.id}}]-{{articleTitle}}</a>


     <span slot="haveHtml" slot-scope="haveHtml,record"  ><a href="javascript:;" @click="openHtml(record)">{{haveHtml}}</a></span>

      <span slot="categories" slot-scope="categories">
        <a-tag
          v-for="category in categories"
          :color="'geekblue'"
          :key="category.id"
        >{{category.name}}</a-tag>
      </span>
      <span slot="tags" slot-scope="tags">
        <a-tag v-for="tag in tags" :color="'green'" :key="tag.id">{{tag.name}}</a-tag>
      </span>

      <span slot="action" slot-scope="text, record">
        <!-- <a href="javascript:;">Invite 一 {{record.name}}</a>
        <a-divider type="vertical" />-->

        <a href="javascript:;" @click="handleEditClick(record)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="handleShowPostSettings(record)">设置</a>
        <!-- <a href="javascript:;" class="ant-dropdown-link">
        More actions
        <a-icon type="down" />
        </a>-->
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
  </div>
</template>
<script>
const columns = [
  {
     title: "标题",
    dataIndex: "title",
    key: "title",

    scopedSlots: { customRender: "articleTitle" }
  },
  // {
  //   title: "状态",
  //   dataIndex: "status",
  //   key: "status"
  // },
  {
    title: "分类",
    dataIndex: "categories",
    key: "categories",
    scopedSlots: { customRender: "categories" }
  },
  {
    title: "标签",
    key: "tags",
    dataIndex: "tags",
    scopedSlots: { customRender: "tags" }
  },
  {
    title: "评论",
    dataIndex: "commentNum",
    key: "commentNum"
  },
  {
    title: "访问",
    dataIndex: "visits",
    key: "visits"
  },
    {
    title: "状态",
    dataIndex: "status",
    key: "status"
  },
    {
    title: "是否生成HTML",
    dataIndex: "haveHtml",
    key: "haveHtml",
    scopedSlots: { customRender: "haveHtml" }
  },
  {
    title: "发布时间",
    dataIndex: "createDate",
    key: "createDate"
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

import ArticleApi from "@/api/article.js";
import preview from "@/api/preview.js";
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
      article: []
    };
  }, 
  created() {
    this.loadArticle();
  },
  methods: {
    loadArticle() {
      //console.log("loadArticle")
      this.queryParam.page = this.pagination.page - 1;
      this.queryParam.size = this.pagination.size;
      this.queryParam.sort = this.pagination.sort;
      ArticleApi.query(this.queryParam).then(response => {
        //console.log(response);
        this.article = response.data.data.content;
        this.pagination.total = response.data.data.totalElements;
      });
    },
    handlePaginationChange(page, pageSize) {
      // console.log("111")
      // this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page;
      this.pagination.size = pageSize;
      this.loadArticle();
    },preview(id){
      window.open(preview.Online('article',id),"_blank");
      // window.location.href='https://www.baidu.com/'
    },
    handleEditClick(article) {
      this.$router.push({ name: 'ArticleWrite', query: { articleId: article.id } })
      // console.log(article);
    },
    openHtml(value){
      if(value.haveHtml){
          window.open(preview.Html(value.path+"/"+value.viewName),"_blank");
      }
     // console.log(value)
    },
    handleShowPostSettings() {
     // console.log(article);
    }
  }
};
</script>
