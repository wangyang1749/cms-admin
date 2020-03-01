<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="template"
      :pagination="false"
      :rowKey="template => template.id"
    >
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="handleEditClick(record)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="handleShowPostSettings(record)">设置</a>
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
    title: "模板名称",
    dataIndex: "name",
    key: "name"
  },
  

  {
    title: "模板描述",
    key: "description",
    dataIndex: "description"
  },
  {
    title: "模板类型",
    dataIndex: "type",
    key: "type"
  },
 {
    title: "视图路径",
    dataIndex: "path",
    key: "path"
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


import TemplateApi from "@/api/template.js";
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
      article: [],
      template: []
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
      TemplateApi.list(this.queryParam).then(response => {
        this.template = response.data.data.content;
        this.pagination.total = response.data.data.totalElements;
        //console.log(response);
      });
    },
    handlePaginationChange(page, pageSize) {
      // console.log("111")
      // this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page;
      this.pagination.size = pageSize;
      this.loadArticle();
    },
    // handleEditClick(template) {
    //   console.log(template);
    // },
    // handleShowPostSettings(template) {
    //   console.log(template);
    // }
  }
};
</script>
