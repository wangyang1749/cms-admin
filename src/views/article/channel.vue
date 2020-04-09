<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="parentCategory"
      :pagination="false"
      :rowKey="channel => channel.id"
      size="small"
      class="table"
    >
      <template slot="title">
        <a-button type="primary" @click="addInput">添加父分类</a-button>
      </template>

      <a
        slot="name"
        slot-scope="name"
        href="javascript:;"
  
      >{{name}}</a>
      <a
        slot="viewName"
        slot-scope="viewName, record"
        href="javascript:;"
        @click="openHtml(record)"
      >{{viewName}}</a>

      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="()=> edit(record.id)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="(e)=> remove(record.id)">删除</a>
      </span>
    </a-table>

    <!-- 添加父分类 -->
    <a-modal title="添加父分类" v-model="visibleParentCategory" @ok="addParentCategory">
      <a-form layout="horizontal">
        <a-form-item label="视图的名称" help="不输入.默认生成">
          <a-input v-model="categoryParam.viewName"></a-input>
        </a-form-item>
             <a-form-item label="视图路径">
          <a-input v-model="categoryParam.path"></a-input>
        </a-form-item>

        <a-form-item label="分类名称">
          <a-input v-model="categoryParam.name"></a-input>
        </a-form-item>

        <a-form-item>
          <a-input v-model="categoryParam.order"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import categoryApi from "@/api/category.js";
import preview from "@/api/preview.js";

var columns = [
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
    title: "视图路径",
    dataIndex: "path",
    key: "path",
   
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
      parentCategory: [],
      visibleParentCategory: false,

      categoryParam: {
        order: 0,
        name: "",
        templateName: "",
        viewName: "",
        description: "",
        picPath: "",
        articleTemplateName: "",
        firstArticle: "",
        parentId: 0,
        path:""
      },

      columns: columns,

      isUpdate: null,
      updateId: null
    };
  },
  created() {
    this.loadParentCategory();
  },
  methods: {
    loadParentCategory() {
      // console.log("loadcategory");
      categoryApi.listByParent(0).then(response => {
        // console.log(response);
        this.parentCategory = response.data.data;
        this.currentTabId = this.parentCategory[0].id;
      });
    },

    addParentCategory() {
      this.categoryParam.parentId = 0;
      if (this.isUpdate) {
        categoryApi.update(this.updateId, this.categoryParam).then(response => {
          this.$notification["success"]({
            message: "成功更新数据:" + response.data.data.name
          });
          this.loadParentCategory();
        });
      } else {
        categoryApi.add(this.categoryParam).then(response => {
          this.$notification["success"]({
            message: "成功添加:" + response.data.data.name
          });
          this.loadParentCategory();
        });
      }

      this.visibleParentCategory = false;
    },

    addInput() {
      this.visibleParentCategory = true;
    },

    edit(id) {
      this.isUpdate = true;
      this.visibleParentCategory = true;
      this.updateId = id;
      categoryApi.findById(id).then(response => {
        // console.log(response);
        this.categoryParam = response.data.data;
        // this.categoryParam.haveHtml = 0;
      });
    },

    remove(id) {
      categoryApi.deleteById(id).then(response => {
        this.$notification["success"]({
          message: response.data.message
        });
        this.loadParentCategory();
      });
    }
    // ,  preview(id) {
    //   console.log(id)
    // // window.open(preview.Online("article", id), "_blank");
    //   // window.location.href='https://www.baidu.com/'
    // }
    , openHtml(value) {
       window.open(preview.Html(value.path + "/" + value.viewName), "_blank");
    },
  }
};
</script>

<style>
</style>