<template>
  <div>
    <a-table :pagination="false" :columns="columns" :dataSource="data" :rowKey="data => data.id">
      <div slot="existNav" slot-scope="existNav,record">
        <a-switch defaultChecked @change="onChangeNav(record.id)" v-model="record.existNav" />
      </div>

      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="edit(record.id)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="generateHtml(record.id)">生成HTML</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="deleteById(record.id)">删除</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="preview(record.id)">预览</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="openHtml(record)">查看HTML</a>
      </span>

      <template slot="footer">
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
      </template>
    </a-table>
  </div>
</template>

<script>
import sheetApi from "@/api/sheet.js";
import preview from "@/api/preview.js";
const columns = [
  { title: "Title", dataIndex: "title", key: "title" },
  {
    title: "页面的名称",
    dataIndex: "viewName",
    key: "viewName"
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    key: "createDate"
  },
  {
    title: "是否添加到导航",
    dataIndex: "existNav",
    key: "existNav",
    scopedSlots: { customRender: "existNav" }
  },

  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
export default {
  data() {
    return {
      pagination: {
        page: 0,
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
      data: [],
      columns
    };
  },
  created() {
    this.loadSheet();
  },
  methods: {
    loadSheet() {
      this.queryParam.page = this.pagination.page - 1;
      this.queryParam.size = this.pagination.size;
      this.queryParam.sort = this.pagination.sort;
      sheetApi.list(this.queryParam).then(response => {
        this.data = response.data.data.content;
        this.pagination.total = response.data.data.totalElements;
        // console.log(response);
      });
    },
    handlePaginationChange(page, pageSize) {
      // console.log("111")
      // this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page;
      this.pagination.size = pageSize;
      this.loadSheet();
    },
    edit(value) {
      this.$router.push({
        name: "PageCreate",
        query: { sheetId: value }
      });
    },
    deleteById(value) {
      sheetApi.deleteById(value).then(response => {
        //  console.log(response);
        this.$notification["success"]({
          message: response.data.message
        });
        this.loadSheet();
      });
    },
    onChangeNav(id) {
      // console.log(id);
      sheetApi.addOrRemoveToMenu(id).then(response => {
         if (response.data.data.existNav) {
          this.$notification["success"]({
            message: "成功添加" + response.data.data.title + "到导航!!"
          });
        } else {
          this.$notification["success"]({
            message: "成功移除" + response.data.data.title + "到导航!!"
          });
        }
      });
    },
    preview(value) {
      // console.log(value);
      window.open(preview.Online("sheet", value), "_blank");
    },
    openHtml(value) {
      let url = value.viewName;
      if (value.path) {
        url = value.path + "/" + url;
      }
      window.open(preview.Html(url), "_blank");
    },
    generateHtml(id) {
      sheetApi.generateHtml(id).then(response => {
        this.$notification["success"]({
          message: "页面生成成功!!" + response.data.message
        });
        // console.log(response);
      });
    }
  }
};
</script>

<style>
</style>