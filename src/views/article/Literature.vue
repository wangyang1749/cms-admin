<template>
  <div>
    <a-button @click="importData">导入</a-button>
    <a-button @click="generateHtml">HTML</a-button>
    <a-button @click="addMenu">添加菜单</a-button>
    <a-button type="primary" icon="cloud-upload" @click="() => (uploadVisible = true)">上传</a-button>

    <!-- <div v-for="item in literatures" :key="item.id">
      {{ item.id }}---{{ item.title }}--{{ item.url }}--{{ item.key }}
      <a href="javascript:;" @click="deleteLiteratures(item)">删除</a>
      <a href="javascript:;" @click="edit(item)">更新</a>
    </div> -->

    <a-table :pagination="false" :columns="columns" :dataSource="literatures" :rowKey="data => data.id">
      <!-- <div slot="existNav" slot-scope="existNav,record">
        <a-switch defaultChecked @change="onChangeNav(record.id)" v-model="record.existNav" />
      </div> -->
      <!-- <div slot="title_" slot-scope="title_">
        <a href="javascript:;">{{ title_ }}</a>
      </div> -->
      <div slot="title_" slot-scope="title_, record">
        <a href="javascript:;" @click="preview(record.id)">{{ title_ }}</a>
      </div>

      <div slot="viewName" slot-scope="viewName, record">
        <a href="javascript:;" @click="openHtml(record)">{{ viewName }}</a>
      </div>
      <div slot="categoryId" slot-scope="categoryId, record">
        <a-select style="width: 100%" v-model="record.categoryId" @change="selectCategory(record.id, $event)">
          <a-select-option :value="item.id" v-for="item in categorys" :key="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>

      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="generateHtml(record.id)">生成HTML</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="edit(record)">更新</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="deleteLiteratures(record)">删除</a>
        <a-divider type="vertical" />
        <!-- <a href="javascript:;" @click="deleteById(record.id)">删除</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="preview(record.id)">预览</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="openHtml(record)">查看HTML</a> -->
      </span>

      <template slot="footer">
        <div class="page-wrapper" :style="{ textAlign: 'right' }">
          <a-pagination class="pagination" :current="pagination.page" :total="pagination.total"
            :defaultPageSize="pagination.size" :pageSizeOptions="['1', '2', '5', '10', '20', '50', '100']" showSizeChanger
            @showSizeChange="handlePaginationChange" @change="handlePaginationChange" />
        </div>
      </template>
    </a-table>




    <a-modal title="上传文献" v-model="uploadVisible" :afterClose="onUploadClose" destroyOnClose>
      <a-upload-dragger name="file" :multiple="true" :action="upload" @change="uploadPic" :headers="headers"
        :withCredentials="true">
        <p class="ant-upload-drag-icon">
          <!-- <a-icon type="inbox" /> -->
          <img :src="literature.picPath" width="100%" alt srcset />
        </p>
        <p class="ant-upload-text">Click or drag file to this area to upload</p>
        <p class="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </a-upload-dragger>
    </a-modal>
    <a-modal title="添加分类" v-model="visible" @ok="handleOk">
      <a-form>
        <a-form-item label="文献标题">
          <a-input v-model="literature.title"></a-input>
        </a-form-item>
        <a-form-item label="url">
          <a-input v-model="literature.url"></a-input>
        </a-form-item>
        <a-form-item label="key">
          <a-input v-model="literature.key"></a-input>
        </a-form-item>
        <a-form-item label="originalContent">
          <a-textarea v-model="literature.originalContent"></a-textarea>
        </a-form-item>
        <!-- <a-form-item label="菜单的路径">
          <a-input v-model="literature.urlName"></a-input>
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import literatureApi from "@/api/literature.js";
import attachmentApi from "@/api/attachment.js";
import preview from "@/api/preview.js";
import categoryApi from "@/api/category.js";
import contentAPI from "@/api/content.js";
const columns = [
  { title: "id", dataIndex: "id", key: "id" },

  { title: "Key", dataIndex: "key", key: "key" },
  {
    title: "分类",
    dataIndex: "categoryId",
    key: "categoryId",
    scopedSlots: { customRender: "categoryId" },
  },
  { title: "Title", dataIndex: "title", key: "title", scopedSlots: { customRender: "title_" } }, {
    title: "视图名称",
    dataIndex: "viewName",
    key: "viewName",
    scopedSlots: { customRender: "viewName" },
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
      literatures: [],
      visible: false,
      isUpdate: true,
      updateId: "",
      columns,
      pagination: {
        page: 0,
        size: 5,
        sort: null
      },
      literature: {},
      queryParam: {
        title: "",
        url: "",
        key: "",
        parentId: "",
        status: true,
        target: "_blank",
      },
      uploadVisible: false,
      categorys: [],
    };
  },
  created() {
    this.loadLiterature();
    this.loadcategory()
  },
  computed: {
    upload() {
      return attachmentApi.uploadBib();
    },
    headers() {
      var token = localStorage.getItem("Authorization");
      return {
        Authorization: "Bearer " + token,
      };
    },
  },
  methods: {
    loadLiterature() {
      this.queryParam.page = this.pagination.page - 1;
      this.queryParam.size = this.pagination.size;
      this.queryParam.sort = this.pagination.sort;
      // console.log("loadMenu")
      literatureApi.list(this.queryParam).then((response) => {
        this.literatures = response.data.data.content;
        this.pagination.total = response.data.data.totalElements;
        // console.log(response);
      });
    }, loadcategory() {
      // console.log("loadcategory");
      categoryApi.list().then((response) => {
        // console.log(response);
        this.categorys = response.data.data;
      });
    }, selectCategory(value, select) {
      contentAPI.updateCategory(value, select).then((response) => {
        // console.log(response);
        this.$notification["success"]({
          message: "操作" + response.data.message,
        });
        this.loadLiterature();
      });
    }, generateHtml(id) {
      contentAPI.generateHtml(id).then((response) => {
        this.$notification["success"]({
          message: "成功生成" + response.data.data.title + "的HTML",
        });
      });
    }, handlePaginationChange(page, pageSize) {
      // console.log("111")
      // this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page;
      this.pagination.size = pageSize;
      this.loadLiterature();
    },
    addMenu() {
      this.isUpdate = false;
      this.visible = true;
    },
    uploadPic(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        // this.literature.picPath = info.file.response.data.path;
        // console.log(info.file.response.data.path);
        this.loadLiterature();
        this.uploadVisible = false;
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    }, onUploadClose() {

    },
    edit(value) {
      this.isUpdate = true;
      this.visible = true;
      this.updateId = value.id;
      literatureApi.findById(value.id).then((response) => {
        this.literature = response.data.data;
        // console.log(response);
      });
    },
    deleteLiteratures(value) {
      // console.log(value);
      literatureApi.delete(value.id).then((response) => {
        this.$notification["success"]({
          message: response.data.message,
        });
        this.loadLiterature();
      });
    }, importData() {
      literatureApi.import().then(resp => {
        // console.log(resp)
        this.$message.success(resp.data.message);
        this.loadLiterature()
      })
    },

    preview(id) {
      window.open(preview.Online("content", id), "_blank");
      // window.location.href='https://www.baidu.com/'
    },    openHtml(value) {
      window.open(preview.Html(value.path + "/" + value.viewName), "_blank");
      // if (value.haveHtml) {

      // } else {
      //   this.$message.error("该文章没有生成HTML");
      // }
    },
    // updateMenu(value) {
    //   // console.log(value);
    //   menuApi.update(value.id, this.literature).then(response => {
    //     // this.menus = response.data.data;

    //     this.$notification["success"]({
    //       message: response.data.message
    //     });
    //     //  console.log(response);
    //   });
    // },
    handleOk() {
      if (this.isUpdate) {
        literatureApi
          .update(this.updateId, this.literature)
          .then((response) => {
            this.$notification["success"]({
              message: response.data.message,
            });
            this.loadLiterature();
            this.visible = false;
          });
      } else {
        literatureApi.add(this.literature).then((response) => {
          this.$notification["success"]({
            message: response.data.message,
          });
          this.loadLiterature();
          this.visible = false;
        });
      }
    },
  },
};
</script>

<style></style>