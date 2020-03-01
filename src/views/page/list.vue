<template>
  <div>
    <a-table :pagination="false" :columns="columns" :dataSource="data" :rowKey="data => data.id">
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
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
export default {
  data() {
    return {
      data: [],
      columns
    };
  },
  created() {
    this.loadPage();
  },
  methods: {
    loadPage() {
      sheetApi.list().then(response => {
        // this.data = response.data.data.content
        this.data = response.data.data.content;
      //  console.log(response.data.data.content);
      });
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
        this.loadPage();
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
          message: "页面生成成功!!"+response.data.message
        });
        // console.log(response);
      });
    }
  }
};
</script>

<style>
</style>