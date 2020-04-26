<template>
  <div>
    <p>
      生成Html在调试模板事有用
    </p>
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

      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="handleEditClick(record)">编辑</a>
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
    dataIndex: "dataName"
  },
  {
    title: "数据参数",
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

import templatePageApi from "@/api/templatePage.js";
// import preview from "@/api/preview.js";

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
      window.open(preview.Online('component',value), "_blank");
     // console.log(value);
    },generateHtml(value){
     // console.log(value.id)
        templatePageApi.generateHtml(value.id).then(response => {
        //  console.log(response)
          this.$notification["success"]({
            message: response.data.message
          });
        })
    },openHtml(value){
    //  console.log(value)
      window.open(preview.Html(value.path+"/"+value.viewName),"_blank");
    }
  }
};
</script>
