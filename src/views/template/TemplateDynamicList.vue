<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="template"
      :pagination="false"
      :rowKey="template => template.id"
    >

    <div slot="status" slot-scope="status,record">
        <a-switch defaultChecked @change="onChangeStatus(record.id)" v-model="record.status" />
      </div>


      <span slot="action" slot-scope="record">
        <a href="javascript:;" @click="edit(record.id)">编辑</a>
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
    title: "英文名称",
    key: "enName",
    dataIndex: "enName"
  },
  {
    title: "模板类型",
    dataIndex: "templateType",
    key: "templateType"
  },
 {
    title: "视图路径",
    dataIndex: "templateValue",
    key: "templateValue"
  },
 {
    title: "是否展示在主页",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" }
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
        this.pagination.total = response.data.data.totalElements
        // console.log(response);
      });
    },
    handlePaginationChange(page, pageSize) {
      // console.log("111")
      // this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page;
      this.pagination.size = pageSize;
      this.loadTemplate();
    },onChangeStatus(id){
      // console.log(id)
      TemplateApi.setStatus(id).then(resp=>{
         this.$notification["success"]({
          message: "操作" + resp.data.message
        });
      })
    },edit(id) {
      this.$router.push({
        name: "TemplateCreate",
        query: { id: id }
      });
      // templatePageApi.findDetailsById(id).then(resp => {
      //   console.log(resp);
      // });
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
