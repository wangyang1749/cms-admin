<template>
  <div>
    <a-row>
      <a-col :span="4">
        <a-form-item label="语言">
          <a-select style="width: 100%" @change="(value) => { this.queryParam.lang = value; this.loadSheet() }"
            :value=this.queryParam.lang>
            <a-select-option :value="item" v-for="item in langs" :key="item">{{ item }}</a-select-option>
            <!-- <a-select-option value="EN" >英文</a-select-option> -->
          </a-select>
        </a-form-item>

      </a-col>
      <a-col :span="20">
        <a-table :pagination="false" :columns="columns" :dataSource="data" :rowKey="data => data.id">
          <div slot="existNav" slot-scope="existNav,record">
            <a-switch defaultChecked @change="onChangeNav(record.id)" v-model="record.existNav" />
          </div>
          <div slot="categoryId" slot-scope="categoryId, record">
            <a-select style="width: 100%" v-model="record.categoryId" @change="selectCategory(record.id, $event)">
              <a-select-option :key="0">没有分类</a-select-option>
              <a-select-option :value="item.id" v-for="item in categorys" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div>
          <span slot="action" slot-scope="text, record">

            <a href="javascript:;" @click="edit(record.id)">编辑</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click="createSheetLanguage(record.id)">复制英文</a>
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
            <div class="page-wrapper" :style="{ textAlign: 'right' }">
              <a-pagination class="pagination" :current="pagination.page" :total="pagination.total"
                :defaultPageSize="pagination.size" :pageSizeOptions="['1', '2', '5', '10', '20', '50', '100']"
                showSizeChanger @showSizeChange="handlePaginationChange" @change="handlePaginationChange" />
            </div>
          </template>
        </a-table>
      </a-col>
    </a-row>



  </div>
</template>

<script>
import sheetApi from "@/api/sheet.js";
import preview from "@/api/preview.js";
import categoryApi from "@/api/category.js";
import contentAPI from "@/api/content.js";
import enumApi from "@/api/enum.js";

const columns = [
  { title: "Title", dataIndex: "title", key: "title" },
  {
    title: "页面的名称",
    dataIndex: "viewName",
    key: "viewName"
  }, {
    title: "语言",
    dataIndex: "lang",
    key: "lang",

  }, {
    title: "模板",
    dataIndex: "templateName",
    key: "templateName"
  },
  {
    title: "分类",
    dataIndex: "categoryId",
    key: "categoryId",
    scopedSlots: { customRender: "categoryId" },
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
      categorys: [],
      data: [],
      columns,
      langs: [],
    };
  },
  created() {
    this.loadSheet();
    this.loadcategory()
    enumApi.list("Lang").then((resp) => {
      // console.log(resp.data.data);
      this.langs = resp.data.data;
    });
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
    }, createSheetLanguage(id) {
      sheetApi.createSheetLanguage(id).then(resp => {
        // console.log(resp)
        this.$notification["success"]({
          message: resp.message
        });
        this.loadSheet()
      })
    },
    loadcategory() {
      // console.log("loadcategory");
      categoryApi.list().then((response) => {
        // console.log(response);
        this.categorys = response.data.data;
      });
    }, selectCategory(value, select) {
      // console.log(value,select)
      contentAPI.updateCategory(value, select).then((response) => {
        // console.log(response);
        this.$notification["success"]({
          message: "操作" + response.data.message,
        });
        this.loadArticle();
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

<style></style>