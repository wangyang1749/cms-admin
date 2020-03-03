<template>
  <div>
    <hr />
    <a-button type="primary" @click="append({key:0})">添加顶级菜单</a-button>
    <a-tree v-if="categorys.length" showLine defaultExpandAll :treeData="categorys">
      <template slot="custom" slot-scope="item">
        <a href="javascript:;" @click="preview(item)">{{item.title}}</a> |
        <a href="javascript:;" @click="openHtml(item)">点击查看HTML</a> |
        <span>{{item.haveHtml}}</span>
        <a-button type="primary" class="but_type" style="right:200px;" @click="()=> append(item)">新增</a-button>
        <a-button type="primary" class="but_type" style="right:120px;" @click="()=> edit(item)">编辑</a-button>
        <a-button type="primary" class="but_type" @click="(e)=> remove(item)">删除</a-button>
      </template>
    </a-tree>

    <a-modal title="添加分类" v-model="visible" @ok="handleOk">
      <a-form layout="horizontal">
        <a-form-item label="视图的名称" help="不输入.默认生成">
          <a-input v-model="categoryParam.viewName"></a-input>
        </a-form-item>
        <a-form-item label="分类名称">
          <a-input v-model="categoryParam.name"></a-input>
        </a-form-item>

        <a-form-item label="选择分类信息模板">
          <a-select style="width: 100%" v-model="categoryParam.templateId">
            <a-select-option :value="item.id" v-for="item in templates" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="分类的描述">
          <a-textarea v-model="categoryParam.description"></a-textarea>
        </a-form-item>
        <a-form-item>
          <a-upload-dragger
            name="file"
            :multiple="true"
            :action="upload"
            @change="handleChange"
            :withCredentials="true"
          >
            <p class="ant-upload-drag-icon">
              <!-- <a-icon type="inbox" /> -->
              <img :src="categoryParam.picPath" width="100%" alt srcset />
            </p>
            <p class="ant-upload-text">Click or drag file to this area to upload</p>
            <p
              class="ant-upload-hint"
            >Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
          </a-upload-dragger>
          <a-input placeholder="直接粘贴图片路径" v-model="categoryParam.picPath"></a-input>
        </a-form-item>

        <a-form-item>
          <a-input v-model="categoryParam.order"></a-input>
        </a-form-item>

        <a-form-item label="是否需要静态化">
          <a-radio-group v-model="categoryParam.haveHtml" defaultValue="1">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- <input type="file" ref="file" />
    <a-button @click="uploadTest">upload</a-button>-->
  </div>
</template>

<script>
import categoryApi from "@/api/category.js";
import templateApi from "@/api/template.js";
import preview from "@/api/preview.js";
// import uploadApi from "@/api/upload.js";
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "123" }),
      categorys: [],
      categorysSource: [],
      value: "",
      templates: [],
      isUpdate: false,
      updateId: "",
      visible: false,
      categoryParam: {
        order:'',
        parentId: "",
        name: "",
        templateId: 2,
        viewName: "",
        description: "",
        haveHtml: 0,
        picPath: ""
      }
    };
  },
  created() {
    this.loadcategory();
  },
  computed: {
    categoryIdMap() {
      const categoryIdMap = {};
      this.categorysSource.forEach(category => {
        categoryIdMap[category.id] = category;
      });
      return categoryIdMap;
    },
    upload() {
      return categoryApi.upload();
    }
  },
  methods: {
    // uploadTest() {
    //   console.log(this.$refs.file.files[0]);
    //   var formData = new FormData();
    //   formData.append("file", this.$refs.file.files[0]);
    //   uploadApi.upload(formData).then(response => {
    //     console.log(response);
    //   });
    // },
    //加载模板
    loadTempalte() {
      templateApi.findByType("CATEGORY_INFO").then(response => {
        this.templates = response.data.data;
      });
    },
    loadcategory() {
      // console.log("loadcategory");
      categoryApi.list().then(response => {
        //console.log(response);
        this.categorysSource = response.data.data;
        this.categorys = categoryApi.concreteTree(response.data.data);
      });
    },
    handleChange(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        this.categoryParam.picPath = info.file.response.data.path;
        // console.log(info.file.response.data.path);
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    handleOk() {
      this.categorys = [];
      if (!this.categoryParam.name) {
        this.$notification["error"]({
          message: "分类标题不能为空!!"
        });
        return;
      }
      if (this.isUpdate) {
        categoryApi.update(this.updateId, this.categoryParam).then(response => {
          this.$notification["success"]({
            message: "成功更新数据:" + response.data.data.name
          });
        });
      } else {
        categoryApi.add(this.categoryParam).then(response => {
          this.$notification["success"]({
            message: "成功添加:" + response.data.data.name
          });
        });
      }
      this.loadcategory();
      this.visible = false;
    },
    append(data) {
      this.loadTempalte();
      this.isUpdate = false;

      this.categoryParam.parentId = data.key;
      this.visible = true;
    },
    edit(data) {
      this.loadTempalte();
      this.isUpdate = true;
      this.updateId = data.key;
      categoryApi.findById(data.key).then(response => {
        //   console.log(response);
        this.categoryParam = response.data.data;
        this.categoryParam.haveHtml = 0;
        this.visible = true;
      });
    },
    remove(value) {
      // console.log(value.key);
      categoryApi.deleteById(value.key).then(response => {
        this.$notification["success"]({
          message: response.data.message
        });
        this.loadcategory();
      });
    },
    preview(value) {
      window.open(preview.Online("category", value.key), "_blank");
    },

    openHtml(value) {
      if (this.categoryIdMap[value.key].haveHtml) {
        window.open(
          preview.Html(
            this.categoryIdMap[value.key].path +
              "/" +
              this.categoryIdMap[value.key].viewName
          ),
          "_blank"
        );
      } else {
        this.$message.error("该分类没有生成HTML");
      }
    },
    onClose() {
      this.articleVisible = false;
    }
  }
};
</script>
<style>
.but_type {
  float: right;
  position: absolute;
  right: 40px;
}
</style>