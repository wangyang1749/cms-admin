<template>
  <div>
    <!-- <a-button @click="() => (attachmentUploadVisible = true)"
      >上传附件</a-button
    > -->

    <!-- <form action="http://localhost:8080/api/template/upload" method="post"  enctype="multipart/form-data">  
        <p>选择文件:<input type="file" name="file"></p>
        <p>选择文件:<input type="file" name="file"></p>
        <p><input type="submit" value="提交"></p>
    </form>   -->
    <a-row>
      <a-col :span="4">
        <a-form-item label="语言">
          <a-select style="width: 100%" @change="(value) => { this.queryParam.lang = value; this.loadTemplate() }"
            :value=this.queryParam.lang>
            <a-select-option :value="item" v-for="item in langs" :key="item">{{ item }}</a-select-option>
            <!-- <a-select-option value="EN" >英文</a-select-option> -->
          </a-select>
        </a-form-item>

        <a-form-item label="模板类型">
          <a-select style="width: 100%" @change="selectTemplateType($event)">
            <a-select-option value="" key="">全部</a-select-option>
            <a-select-option :value="item" v-for="item in templateType" :key="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="模板返回数据">
          <a-select style="width: 100%" @change="selectTemplateData($event)">
            <a-select-option value="" key="">全部</a-select-option>
            <a-select-option :value="item" v-for="item in templateData" :key="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>

      </a-col>
      <a-col :span="20">

        <a-upload name="file" :multiple="true" :action="upload" @change="uploadAttachment" :headers="headers">
          <a-button> <a-icon type="upload" /> 安装模板 </a-button>
        </a-upload>
        <a-button @click="updateAllTemplate">更新所有模板</a-button>
        <a-button @click="fetchComponents">从文件中获取模板</a-button>
        <!-- <a-button @click="createAllLanguage">创建所有语言模板</a-button> -->

        <!-- <a-select @change="setLang">
      <a-select-option :value="item" v-for="item in langs" :key="item.id">{{ item }}</a-select-option>
    </a-select> -->

        <a-table @expand="expand" :columns="columns" :dataSource="template" :pagination="false"
          :rowKey="(template) => template.id">
          <div slot="status" slot-scope="status, record">
            <a-switch defaultChecked @change="onChangeStatus(record.id)" v-model="record.tree" />
          </div>


          <div slot="name" slot-scope="name, record">
            <a href="javascript:;" @click="preview(record.id)">{{ name }}</a>
          </div>

          <span slot="action" slot-scope="record">
            <a href="javascript:;" @click="createTemplateLanguage(record.id)">复制英文</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click="deleteById(record.id)">删除</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click="edit(record.id)">编辑</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click="showSetting(record)">设置</a>
          </span>


          <template #expandedRowRender>
            <a-table :columns="innerColumns" :data-source="innerData" :pagination="false"
              :rowKey="(template) => template.id">
              <div slot="name" slot-scope="name, record">
                <a href="javascript:;" @click="preview(record.id)">{{ name }}</a>
              </div>

              <span slot="action" slot-scope="record">
                <a href="javascript:;" @click="createTemplateLanguage(record.id)">复制英文</a>
                <a-divider type="vertical" />
                <a href="javascript:;" @click="deleteById(record.id)">删除</a>
                <a-divider type="vertical" />
                <a href="javascript:;" @click="edit(record.id)">编辑</a>
                <!-- <a-divider type="vertical" /> -->
                <!-- <a href="javascript:;" @click="showSetting(record)">设置</a> -->
              </span>

            </a-table>
          </template>

        </a-table>
        <div class="page-wrapper" :style="{ textAlign: 'right' }">
          <a-pagination class="pagination" :current="pagination.page" :total="pagination.total"
            :defaultPageSize="pagination.size" :pageSizeOptions="['1', '2', '5', '10', '20', '50', '100']" showSizeChanger
            @showSizeChange="handlePaginationChange" @change="handlePaginationChange" />
        </div>
      </a-col>
    </a-row>




    <!-- <a-modal title="附件上传" v-model="attachmentUploadVisible">
      <a-upload-dragger
        name="file"
        :multiple="true"
        :action="upload"
        @change="uploadAttachment"
        :headers="headers"
        :withCredentials="true"
      >
        <p class="ant-upload-drag-icon">
          <img :src="queryParam.picPath" width="100%" alt srcset />
        </p>
        <p class="ant-upload-text">Click or drag file to this area to upload</p>
        <p class="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </a-upload-dragger>
    </a-modal> -->




    <a-drawer title="子模板列表" placement="right" :closable="true" :visible="templateDrawer" @close="() => {
      templateDrawer = false;
    }
      " width="40rem">

      <a-form-item label="选择子类模板(templateChild)">
        <a-select style="width: 100%">
          <a-select-option :value="item.enName" v-for="item in templatesChildListAll" :key="item.id">{{ item.name
          }}-{{ item.templateValue }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-input v-model="templateEnName" min="1" :max="10"></a-input>
      <a-button @click="addChildTemplate">添加子模板</a-button>


      <a-list bordered :dataSource="templatesChild">
        <a-list-item slot="renderItem" slot-scope="item">

          <a slot="actions" @click="removeChildTemplate(item.id)">删除子模板</a>
          {{ item.name }}-{{ item.enName }}

        </a-list-item>
      </a-list>


    </a-drawer>
  </div>
</template>
<script>

const columns = [
  {
    title: "模板名称",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "语言",
    dataIndex: "lang",
    key: "lang",

  },
  {
    title: "英文名称",
    key: "enName",
    dataIndex: "enName",
  },
  {
    title: "模板类型",
    dataIndex: "templateType",
    key: "templateType",
  }, {
    title: "模板类型",
    dataIndex: "templateData",
    key: "templateData",
  },
  {
    title: "视图路径",
    dataIndex: "templateValue",
    key: "templateValue",
  },
  // {
  //   title: "是否使用Tree",
  //   dataIndex: "status",
  //   key: "status",
  //   scopedSlots: { customRender: "status" },
  // },
  // {
  //   title: "创建时间",
  //   dataIndex: "createDate",
  //   key: "createDate",
  // },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
const innerColumns = [
  {
    title: "模板名称",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "name" },
  },

  {
    title: "英文名称",
    key: "enName",
    dataIndex: "enName",
  },
  {
    title: "模板类型",
    dataIndex: "templateType",
    key: "templateType",
  }, {
    title: "模板类型",
    dataIndex: "templateData",
    key: "templateData",
  },
  {
    title: "视图路径",
    dataIndex: "templateValue",
    key: "templateValue",
  },
  // {
  //   title: "是否使用Tree",
  //   dataIndex: "status",
  //   key: "status",
  //   scopedSlots: { customRender: "status" },
  // },
  // {
  //   title: "创建时间",
  //   dataIndex: "createDate",
  //   key: "createDate",
  // },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];
import preview from "@/api/preview.js";
import TemplateApi from "@/api/template.js";
import enumApi from "@/api/enum.js";
export default {
  data() {
    return {
      pagination: {
        page: 1,
        size: 100,
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
      columns,
      innerColumns,
      article: [],
      template: [],
      attachmentUploadVisible: false,
      templateDrawer: false,
      templateEnName: "",
      record: undefined,
      templatesChild: [],
      templatesChildListAll: [],
      langs: [],
      lang: undefined,
      templateType: [],
      templateData: [],
      innerData: [],

    };
  },
  computed: {
    headers() {
      var token = localStorage.getItem("Authorization");
      return {
        Authorization: "Bearer " + token,
      };
    },
  },
  mounted() {
    this.loadTemplate();
    this.loadTemplateType()
    this.loadTemplateData()
    enumApi.list("Lang").then((resp) => {
      // console.log(resp.data.data);
      this.langs = resp.data.data;
    });
    TemplateApi.findByType("CATEGORY").then((response) => {
      this.templatesChildListAll = response.data.data;
    });
  },
  methods: {
    loadTemplate() {
      this.queryParam.page = this.pagination.page - 1;
      this.queryParam.size = this.pagination.size;
      this.queryParam.sort = this.pagination.sort;
      // if(lang){

      // }
      TemplateApi.list(this.queryParam, this.lang).then((response) => {
        this.template = response.data.data.content;
        this.pagination.total = response.data.data.totalElements;
        // console.log(response);
      });
    }, loadTemplateType() {
      enumApi.list("TemplateType").then((resp) => {
        // console.log(resp.data.data);
        this.templateType = resp.data.data;
      });
    }, expand(expanded, record) {
      if (expanded) {
        TemplateApi.findByChild(record.id).then(resp => {
          this.innerData = resp.data.data
        })
        // console.log(record)
      }

    }, loadTemplateData() {
      enumApi.list("TemplateData").then((resp) => {
        // console.log(resp.data.data);
        this.templateData = resp.data.data;
      });
    }, selectTemplateType(value) {

      if (value != "") {
        this.queryParam.templateType = value
      } else {
        // console.log(value)
        delete this.queryParam["templateType"]
      }


      this.loadTemplate()
    }, selectTemplateData(value) {
      if (value != "") {
        this.queryParam.templateData = value
      } else {
        // console.log(value)
        delete this.queryParam["templateData"]
      }

      this.loadTemplate()
    }, loadLang() {
      enumApi.list("Lang").then(resp => {
        this.langs = resp.data.data

      })
    }, createTemplateLanguage(id) {
      TemplateApi.createTemplateLanguage(id).then(resp => {
        // console.log(resp)
        this.$notification["success"]({
          message: resp.message
        });
        this.loadTemplate()
      })
    }, setLang(value) {
      this.lang = value
      // console.log(value)
      this.loadTemplate()
    }, fetchComponents() {
      TemplateApi.fetchComponents("").then(resp => {
        // console.log(resp)
        this.loadTemplate();
        this.$notification["success"]({
          message: resp.data.message,
        });
      })
    }, createAllLanguage() {
      TemplateApi.createAllLanguage("").then(resp => {
        // console.log(resp)
        this.loadTemplate();
        this.$notification["success"]({
          message: resp.data.message,
        });
      })

    }, addChildTemplate() {
      TemplateApi.addChild(this.record.id, this.templateEnName).then(resp => {
        this.$notification["success"]({
          message: resp.data.message,
        });
        this.loadTemplateChild(this.record.id)
      })
    }, loadTemplateChild(id) {
      TemplateApi.findByChild(id).then(resp => {
        this.templatesChild = resp.data.data
      })
    },
    removeChildTemplate(id) {
      TemplateApi.removeChildTemplate(this.record.id, id).then(resp => {
        // console.log(resp)
        this.$notification["success"]({
          message: resp.data.message,
        });
        this.loadTemplateChild(this.record.id)
      })
    },
    updateAllTemplate() {
      TemplateApi.updateAllTemplate().then(resp => {
        this.$notification["success"]({
          message: "操作" + resp.data.message,
        });
      })
    },
    handlePaginationChange(page, pageSize) {
      // console.log("111")
      // this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page;
      this.pagination.size = pageSize;
      this.loadTemplate();
    },
    onChangeStatus(id) {
      // console.log(id)
      TemplateApi.tree(id).then((resp) => {
        this.$notification["success"]({
          message: "操作" + resp.data.message,
        });
      });
    }, showSetting(record) {
      this.templateDrawer = true
      this.record = record
      this.loadTemplateChild(record.id)
    },
    edit(id) {
      this.$router.push({
        name: "TemplateCreate",
        query: { id: id },
      });
      // templatePageApi.findDetailsById(id).then(resp => {
      //   console.log(resp);
      // });
    },
    deleteById(value) {
      TemplateApi.deleteById(value).then((response) => {
        //  console.log(response);
        this.$notification["success"]({
          message: response.data.message,
        });
        this.loadTemplate();
      });
    },
    upload() {
      return TemplateApi.upload();
    },
    uploadAttachment(info) {
      // if (info.file.status !== "uploading") {
      //   console.log(info.file, info.fileList);
      // }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully`);
        // console.log(info.file.response)
      } else if (info.file.status === "error") {
        this.$message.error(
          `${info.file.response.message} file upload failed.`
        );
        // console.log(info.file.response.message)
      }
      this.loadTemplate();
    },
    preview(value) {
      // console.log(value.templateValue)
      // window.open(preview.Html(value), "_blank");
      window.open(preview.Online("template", value), "_blank");
    },
    // handleEditClick(template) {
    //   console.log(template);
    // },
    // handleShowPostSettings(template) {
    //   console.log(template);
    // }
  },
};
</script>
