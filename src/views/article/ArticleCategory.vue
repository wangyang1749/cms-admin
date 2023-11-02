<template>
  <div>
    <a-button type="primary" @click="initEdit">添加分类</a-button>
    <a-button @click="updateAll(false)">生成所有分类HTML</a-button>
    <a-button @click="updateAll(true)">生成所有分类HTML更新模板</a-button>
    <a-button type="primary" @click="updateCategoryPos">更新顺序</a-button>

    <!-- <a-tabs defaultActiveKey="-1" @change="tabCallback"> -->
    <!-- <a-tab-pane :tab="itemTab.name" :key="itemTab.enName" v-for="itemTab in templates"> -->
    <!-- <a-table
      :columns="columns"
      :dataSource="categorys"
      :pagination="false"
      :rowKey="category => category.id"
      size="small"
      class="table"
      :scroll="{ x: 1500 }"
    >
      <a
        slot="name"
        slot-scope="name, record"
        href="javascript:;"
        @click="preview(record.id)"
      >{{name}}</a>
      <a
        slot="viewName"
        slot-scope="viewName, record"
        href="javascript:;"
        @click="openHtml(record)"
      >{{viewName}}</a>

      <a
        slot="firstArticle"
        slot-scope="firstArticle, record"
        href="javascript:;"
        @click="openHtmlFirstArticle(record)"
      >{{firstArticle}}</a>

      <div slot="recommend" slot-scope="recommend,record">
        <a-switch defaultChecked @change="onChange(record.id)" v-model="record.recommend" />
      </div>

      <div slot="existNav" slot-scope="existNav,record">
        <a-switch defaultChecked @change="onChangeNav(record.id)" v-model="record.existNav" />
      </div>

      <div slot="haveHtml" slot-scope="haveHtml,record">
        <a-switch defaultChecked @change="onChangeHtml(record.id)" v-model="record.haveHtml" />
      </div>
      <span slot="action" slot-scope="text, record">
     
        <a-divider type="vertical" />
        <a href="javascript:;" @click="articleListShow(record.id)">查看文章</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="generateHtml(record.id)">生成HTML</a>

        <a-divider type="vertical" />
        <a href="javascript:;" @click="()=> edit(record.id)">编辑</a>

        <a-divider type="vertical" />
        <a href="javascript:;" @click="(e)=> remove(record.id)">删除分类</a>
     
      </span>
    </a-table> -->
    <!-- </a-tab-pane> -->

    <!-- <a-tab-pane tab="使用说明" ></a-tab-pane> -->
    <!-- </a-tabs> -->
    <a-drawer title="添加分类模板" placement="right" :closable="true" :visible="categoryTemplateListDrawer" @close="() => {
      categoryTemplateListDrawer = false;
    }
      " width="40rem">

      <a-form-item label="templatesCategory">
        <!-- <a href="">{{categoryTemplate(categoryParam.templateName)}}</a> -->
        <a-select style="width: 100%" v-model="selectCategoryTemplate">
          <a-select-option :value="item.id" v-for="item in templatesCategory" :key="item.id">{{ item.name
          }}-{{ item.templateValue }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="templatesCategoryList">
        <!-- <a href="">{{categoryTemplate(categoryParam.templateName)}}</a> -->
        <a-select style="width: 100%" v-model="selectCategoryTemplate">
          <a-select-option :value="item.id" v-for="item in templatesCategoryList" :key="item.id">{{ item.name
          }}-{{ item.templateValue }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="templatesArticleList">
        <!-- <a href="">{{categoryTemplate(categoryParam.templateName)}}</a> -->
        <a-select style="width: 100%" v-model="selectCategoryTemplate">
          <a-select-option :value="item.id" v-for="item in templatesArticleList" :key="item.id">{{ item.name
          }}-{{ item.templateValue }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-button @click="addTemplate()">添加</a-button>




    </a-drawer>


    <a-drawer title="文章列表" placement="right" :closable="true" :visible="articleListDrawer" @close="() => {
      articleListDrawer = false;
    }
      " width="40rem">
      <a-button type="primary" @click="updateArticlePos">更新文章顺序</a-button>
      <a-tree class="draggable-tree" draggable block-node :tree-data="articles" :replace-fields="articleFieldNames"
        @drop="onDropArticle" />
      <!-- <a-list bordered :dataSource="articles">
        <a-list-item slot="renderItem" slot-scope="item">

          <a-input-number slot="actions" v-model="item.order" />
          <a slot="actions" @click="updateArticleOrder(item.id,item.order)">更新文章Order</a>
          <a-list-item-meta :description="item.content">
            <a slot="title">{{item.title}}</a>
          </a-list-item-meta>
        </a-list-item>
      </a-list> -->
    </a-drawer>

    <a-row>
      <a-col :span="8">
        <a-select style="width: 100%" @change="(value) => { this.lang = value; this.loadcategory() }" :value=this.lang>
          <a-select-option :value="item" v-for="item in langs" :key="item">{{ item }}</a-select-option>
          <!-- <a-select-option value="EN" >英文</a-select-option> -->
        </a-select>

        <a-tree class="draggable-tree" draggable block-node :tree-data="categorys" :replace-fields="fieldNames"
          @dragenter="onDragEnter" @select="onSelect" @drop="onDropCategory" />
        <!-- @select="onSelect" -->
        <!-- :replace-fields="fieldNames" -->
      </a-col>
      <a-col :span="16">

        <div v-if="isUpdate">
          <a-button @click="preview(updateId)">预览</a-button>
          <a-button @click="openHtml()">查看Html</a-button>
          <a-button @click="remove(updateId)">删除分类</a-button>
          <a-button @click="articleListShow(updateId)">查看文章</a-button>
          <a-button @click="generateHtml(updateId)">生成HTML</a-button>
          <a-button @click="generateArticlesByCategoryId(updateId)">生成文章HTML</a-button>
          <a-button type="primary" @click="createCategoryLanguage(updateId)">创建英文分类</a-button>
          <a-button @click="addTemplateInput(updateId)">添加分类模板</a-button>




          是否推荐首页
          <a-switch defaultChecked @change="onChange(updateId)" v-model="categoryParam.recommend" />

          是否添加到导航
          <a-switch defaultChecked @change="onChangeNav(updateId)" v-model="categoryParam.existNav" />
          是否生成Html
          <a-switch defaultChecked @change="onChangeHtml(updateId)" v-model="categoryParam.haveHtml" />

          <!-- <a-switch defaultChecked @change="onChange(this.updateId)" /> -->

          <hr />
        </div>

        <!-- <a-input v-model:value="value" placeholder="Basic usage" /> -->

        <!-- <a-modal title="添加分类" v-model="visible" @ok="handleOk"> -->

        <ul>
          <li v-for="item in categoryTemplates" :key="item.id">
            {{ item.id }}--{{ item.name }}--{{ item.enName }}--{{ item.templateValue }}--{{ item.templateType }}--
            <a-button @click="delCategoryTemplate(item.id)">删除</a-button> <a-button @click="categoryTemplatePreview(updateId, item.id)">预览</a-button>
          </li>
        </ul>

        <a-form-item label="一页文章数量">
          <a-input-number id="inputNumber" v-model="categoryParam.articleListSize" />
        </a-form-item>

        <a-form-item label="isArticleDocLink">
          <a-switch defaultChecked v-model="categoryParam.isArticleDocLink" />
        </a-form-item>

        <a-form-item label="网络类型">
          <a-select style="width: 100%" v-model="categoryParam.networkType">
            <a-select-option :value="item" v-for="item in networkType" :key="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>


        <!-- <a-form-item label="isDisplayNetwork">
          <a-switch defaultChecked v-model="categoryParam.isDisplayNetwork" />
        </a-form-item> -->
        <a-form-item label="desc">
          <a-switch defaultChecked v-model="categoryParam.isDesc" />
        </a-form-item>
        <a-form-item label="articleUseViewName">
          <a-switch defaultChecked v-model="categoryParam.articleUseViewName" />
        </a-form-item>
        <a-form-item label="isRecursive">
          <a-switch defaultChecked v-model="categoryParam.isRecursive" />
        </a-form-item>

        <a-form-item label="isDivision是否是分割">
          <a-switch defaultChecked v-model="categoryParam.isDivision" />
        </a-form-item>


        <a-form layout="horizontal">
          <a-form-item label="视图路径" help="不输入.默认生成">
            <a-input v-model="categoryParam.path"></a-input>
          </a-form-item>
          <a-form-item label="视图的名称" help="不输入.默认生成">
            <a-input v-model="categoryParam.viewName"></a-input>
          </a-form-item>
          <a-form-item label="分类名称">
            <a-input v-model="categoryParam.name"></a-input>
          </a-form-item>
          <a-form-item label="icon">
            <a-input v-model="categoryParam.icon"></a-input>
          </a-form-item>



          <a-form-item label="选择管理员">
            <a-select style="width: 100%" v-model="categoryParam.userId">
              <a-select-option :value="item.id" v-for="item in users" :key="item.id">{{ item.username }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="选择推荐文章的标签">
            <a-select allowClear mode="tags" style="width: 100%" @blur="handleBlur" placeholder="Tags Mode"
              v-model="selectedTagNames">
              <a-select-option v-for="item in tags" :key="item.id + ''" :value="item.id + ''">{{ item.id }}-{{ item.name
              }}</a-select-option>
            </a-select>
          </a-form-item>




          <a-form-item label="选择文章显示的模板">
            <a-select style="width: 100%" v-model="categoryParam.articleTemplateName">
              <a-select-option :value="item.enName" v-for="item in articleTemplate" :key="item.enName">{{ item.name
              }}-{{ item.templateValue }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="分类推荐模板选择">
            <a-select style="width: 100%" v-model="categoryParam.recommendTemplateName">
              <a-select-option :value="item.enName" v-for="item in recommendTemplate" :key="item.id">{{ item.name
              }}-{{ item.templateValue }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="分类的描述">
            <a-textarea v-model="categoryParam.description"></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-upload-dragger name="file" :multiple="true" :action="upload" @change="handleChange" :headers="headers"
              :withCredentials="true">
              <p class="ant-upload-drag-icon">
                <!-- <a-icon type="inbox" /> -->
                <img :src="categoryParam.picPath" width="100%" alt srcset />
              </p>
              <p class="ant-upload-text"></p>
              <p class="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other band files
              </p>
            </a-upload-dragger>
            <a-input placeholder="直接粘贴图片路径" v-model="categoryParam.picPath"></a-input>
            <a-input placeholder="直接粘贴图片路径" v-model="categoryParam.picThumbPath"></a-input>
          </a-form-item>

          <a-form-item label="父ID">
            <a-select style="width: 100%" v-model="categoryParam.parentId">
              <a-select-option :value="item.id" v-for="item in categorys" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="排序">
            <a-input v-model="categoryParam.order"></a-input>
          </a-form-item>
        </a-form>
        <a-button @click="handleOk">确认</a-button>
        <!-- </a-modal> -->
      </a-col>
    </a-row>
  </div>
</template>

<script>
const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    // fixed: "left",
    scopedSlots: { customRender: "name" },
  },
  {
    title: "视图名称",
    dataIndex: "viewName",
    key: "viewName",
    scopedSlots: { customRender: "viewName" },
  },
  {
    title: "category模板",
    dataIndex: "templateName",
    key: "templateName",
  },
  {
    title: "文章模板",
    dataIndex: "articleTemplateName",
    key: "articleTemplateName",
  },
  {
    title: "是否推荐首页",
    dataIndex: "recommend",
    key: "recommend",
    scopedSlots: { customRender: "recommend" },
  },
  {
    title: "是否添加到导航",
    dataIndex: "existNav",
    key: "existNav",
    scopedSlots: { customRender: "existNav" },
  },
  {
    title: "是否生成Html",
    dataIndex: "haveHtml",
    key: "haveHtml",
    scopedSlots: { customRender: "haveHtml" },
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    scopedSlots: { customRender: "action" },
  },
];
import axios from "axios";
import categoryApi from "@/api/category.js";
import templateApi from "@/api/template.js";
import preview from "@/api/preview.js";
// import uploadApi from "@/api/upload.js";
import attachmentApi from "@/api/attachment.js";
import ArticleApi from "@/api/article.js";
import tagsApi from "@/api/tags.js";
import contentAPI from "@/api/content.js";
import userApi from "@/api/user.js";
import enumApi from "@/api/enum.js";
// // import {  ref } from 'vue';
// const x = 3;
// const y = 2;
// const z = 1;
// const genData = [];

// const generateData = (_level, _preKey, _tns) => {
//   const preKey = _preKey || '0';
//   const tns = _tns || genData;
//   const children = [];

//   for (let i = 0; i < x; i++) {
//     const key = `${preKey}-${i}`;
//     tns.push({
//       title: key,
//       key,
//     });

//     if (i < y) {
//       children.push(key);
//     }
//   }

//   if (_level < 0) {
//     return tns;
//   }

//   const level = _level - 1;
//   children.forEach((key, index) => {
//     tns[index].children = [];
//     return generateData(level, key, tns[index].children);
//   });
// };

// generateData(z);
export default {
  data() {
    return {
      columns: columns,
      form: this.$form.createForm(this, { name: "123" }),
      categorys: [],
      parentCategory: [],
      articles: [],
      // gData:[],
      // value: "",
      templatesCategory: [],
      templatesCategoryList: [],
      templatesArticleList: [],
      articleTemplate: [],
      recommendTemplate: [],
      isUpdate: false,
      updateId: null,
      visible: false,
      currentTabId: null,
      articleListDrawer: false,
      categoryId: null,
      tags: [],
      categoryParam: {
        order: 0,
        name: "",
        templateName: "",
        viewName: "",
        description: "",
        picPath: "",
        recommendTemplateName: "",
        articleTemplateName: "",
        firstArticle: "",
        articleListSize: 10,
        icon: "",
        isDesc: true,
        parentId: 0,
        picThumbPath: "",
        tagIds: []
      },
      selectedTagNames: [],
      fieldNames: {
        children: "children",
        title: "name",
        key: "id",
      },
      articleFieldNames: {
        children: "children",
        title: "title",
        key: "id",
      },
      users: [],
      networkType: [],
      langs: [],
      lang: 'ZH',
      categoryTemplateListDrawer: false,
      selectCategoryTemplate: undefined,
      categoryTemplates: []
    };
  },
  created() {
    this.loadcategory();
    // this.gData = genData;
    // console.log(genData)
    this.initEdit();
    this.loadTags();
    // console.log(this.categorys )
    enumApi.list("NetworkType").then((resp) => {
      // console.log(resp.data.data);
      this.networkType = resp.data.data;
    });
    enumApi.list("Lang").then((resp) => {
      // console.log(resp.data.data);
      this.langs = resp.data.data;
    });

  },
  computed: {
    tagIdMap() {
      const tagIdMap = {};
      //获得tags的id map
      this.tags.forEach((tag) => {
        tagIdMap[tag.id] = tag;
      });
      return tagIdMap;
    },
    tagNameMap() {
      const tagNameMap = {};
      //获得tags的 name map
      this.tags.forEach((tag) => {
        tagNameMap[tag.id + ""] = tag;
      });

      return tagNameMap;
    },
    upload() {
      return attachmentApi.upload();
    },
    headers() {
      var token = localStorage.getItem("Authorization");
      return {
        Authorization: "Bearer " + token,
      };
    },
  },
  methods: {
    loadTempalte() {
      templateApi.findByType("CATEGORY").then((response) => {
        this.templatesCategory = response.data.data;
      });
      templateApi.findByType("CATEGORY_LIST").then((response) => {
        this.templatesCategoryList = response.data.data;
      });
      templateApi.findByType("ARTICLE_LIST").then((response) => {
        this.templatesArticleList = response.data.data;
      });
    }, loadCategoryTemplates(id) {
      categoryApi.listTemplateByCategoryId(id).then(resp => {
        this.categoryTemplates = resp.data.data;

      })
    },
    loadrecommendTemplate() {
      templateApi.findByType("ARTICLE_LIST").then((response) => {
        this.recommendTemplate = response.data.data;
      });
    }, createCategoryLanguage(updateId) {
      categoryApi.createCategoryLanguage(updateId).then(resp => {
        // console.log(resp)
        this.$notification["success"]({
          message: resp.message
        });
        this.loadcategory()
      })
    },
    loadTags(callback) {
      tagsApi.list().then((response) => {
        this.tags = response.data.data;
        if (callback) {
          callback();
        }
        // console.log(response.data.data);
      });
    },
    loadArticleTempalte() {
      templateApi.findByType("ARTICLE").then((response) => {
        this.articleTemplate = response.data.data;
        // console.log(response);
      });
    },
    handleBlur() {
      const tagNamesToCreate = this.selectedTagNames.filter(
        (tagName) => !this.tagNameMap[tagName]
      );
      // console.log(tagNamesToCreate);
      // console.log(tagNamesToCreate.length);
      if (tagNamesToCreate.length != 0) {
        this.categoryParam.tagIds = this.selectedTagNames.map(
          (tagName) => this.tagNameMap[tagName].id
        );
        // console.log( this.categoryParam.tagIds)
        // If empty
        return;
      }
      const createPromises = tagNamesToCreate.map((tagName) =>
        tagsApi.createWithName(tagName)
      );
      axios.all(createPromises).then(
        axios.spread(() => {
          this.loadTags(() => {
            this.categoryParam.tagIds = this.selectedTagNames.map(
              (tagName) => this.tagNameMap[tagName].id
            );
          });
        })
      );
    },
    loadcategory() {
      // categoryApi.pageBy(templateEnName).then(resp => {
      //   console.log(resp.data.data.content);
      //   this.categorys = resp.data.data.content;
      // });

      categoryApi.listVoTree(this.lang).then((resp) => {
        // console.log(resp.data.data);
        this.categorys = resp.data.data;
      });
      // console.log("loadcategory");
      // categoryApi.listByParent(id).then(response => {
      //   // console.log(response);
      //   this.categorys = response.data.data;
      // });
    },
    loadParentCategory() {
      templateApi.findByType("CATEGORY").then((response) => {
        this.templates = response.data.data;
        this.loadcategory(this.templates[0].enName);
        // console.log(this.templates);
      });
    },
    loadArticle(id) {
      contentAPI.listVoTree(id).then((response) => {
        // console.log(response);
        this.articles = response.data.data;
      });
      // console.log(id)
    },
    articleListShow(id) {
      // console.log(id)
      this.categoryId = id;
      // console.log(id);
      this.loadArticle(id);
      this.articleListDrawer = true;
    }, addTemplateInput(id) {
      this.categoryId = id;
      this.loadTempalte()

      this.categoryTemplateListDrawer = true;
    }, addTemplate() {
      categoryApi.addTemplates(this.categoryId, this.selectCategoryTemplate).then((resp) => {
        // console.log(resp.data.data);
        this.$notification["success"]({
          message: resp.message
        });
        this.loadCategoryTemplates()
      });
    }, delCategoryTemplate(id) {
      categoryApi.delCategoryTemplate(this.categoryId, id).then(resp => {
        // console.log(resp)
        this.$notification["success"]({
          message: resp.message
        });
        this.loadCategoryTemplates()
      })
    },
    // updateArticleOrder(id, order) {
    //   // console.log(id+"-"+order)
    //   ArticleApi.updateOrderBy(id, order).then(resp => {
    //     this.$notification["success"]({
    //       message: "成功更改文章" + resp.data.data.title + "的顺序!"
    //     });
    //     this.loadArticle(this.categoryId);
    //   });
    // },
    handleChange(info) {
      const status = info.file.status;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        this.categoryParam.picPath = info.file.response.data.path;
        this.categoryParam.picThumbPath = info.file.response.data.thumbPath;
        // console.log(info.file.response.data.path);
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },

    handleOk() {
      // console.log(this.selectedTagNames)
      // console.log(this.categoryParam)
      if (!this.categoryParam.name) {
        this.$notification["error"]({
          message: "分类标题不能为空!!",
        });
        return;
      }
      if (this.isUpdate) {
        // this.desc=1
        // console.log(this.categoryParam);
        categoryApi
          .update(this.updateId, this.categoryParam)
          .then((response) => {
            // console.log(this.categoryParam)
            this.$notification["success"]({
              message: "成功更新数据:" + response.data.data.name,
            });
            this.loadcategory();
          });
      } else {
        categoryApi.add(this.categoryParam).then((response) => {
          this.$notification["success"]({
            message: "成功添加:" + response.data.data.name,
          });
          this.loadcategory();
        });
      }

      this.visible = false;
    },
    initEdit() {

      this.loadArticleTempalte();
      this.loadrecommendTemplate()
      this.categoryParam = {};
      this.loadUser();
      this.isUpdate = false;
      this.visible = true;
    }, loadUser() {
      userApi.listAll().then(resp => {
        this.users = resp.data.data
      })
    },
    edit(id) {
      // this.loadTempalte();
      // // this.loadArticle(id);

      // this.loadArticleTempalte();
      this.loadCategoryTemplates(id)
      categoryApi.findById(id).then((response) => {
        this.isUpdate = true;

        this.updateId = id;
        this.categoryParam = response.data.data;
        this.selectedTagNames = response.data.data.tags.map(
          (item) => item.id + ""
        );
        // console.log(this.categoryParam);
        // this.categoryParam.haveHtml = 0;
        this.visible = true;
      });
    },
    onChange(item) {
      // console.log(item);
      categoryApi.recommendOrCancel(item).then((response) => {
        if (response.data.data.recommend) {
          this.$notification["success"]({
            message: "分类" + response.data.data.name + "成功在首页推荐!!",
          });
        } else {
          this.$notification["success"]({
            message: "分类" + response.data.data.name + "已经从首页取消推荐!!",
          });
        }
      });
    },
    onChangeNav(id) {
      // console.log(id);
      categoryApi.addOrRemoveToMenu(id).then((response) => {
        if (response.data.data.existNav) {
          this.$notification["success"]({
            message: "成功添加" + response.data.data.name + "到导航!!",
          });
        } else {
          this.$notification["success"]({
            message: "成功移除" + response.data.data.name + "到导航!!",
          });
        }
      });
    },
    onChangeHtml(id) {
      // console.log(id);
      categoryApi.haveHtml(id).then((response) => {
        const data = response.data.data;
        if (data.haveHtml) {
          this.$notification["success"]({
            message: "成功生成" + data.name + "Html",
          });
        } else {
          this.$notification["success"]({
            message: "成功移除" + data.name + "Html",
          });
        }
        this.loadcategory();
      });
    },
    remove(value) {
      // console.log(value.key);
      categoryApi.deleteById(value).then((response) => {
        this.$notification["success"]({
          message: response.data.message,
        });
        this.loadcategory(this.currentTabId);
      });
    },
    preview(value) {
      window.open(preview.Online("category", value), "_blank");
    },

    openHtml() {
      window.open(
        preview.Html(
          this.categoryParam.path + "/" + this.categoryParam.viewName
        ),
        "_blank"
      );

      // if (this.categoryParam.value.haveHtml) {
      // } else {
      //   this.$message.error("该分类没有生成HTML");
      // }
    },categoryTemplatePreview(updateId, templateId){
      // console.log(templateId);
      window.open(preview.categoryTemplatePreview(updateId, templateId))
    },
    openHtmlFirstArticle(value) {
      if (value.haveHtml) {
        window.open(
          preview.Html(
            value.path + "/" + value.viewName + "/" + value.firstArticle
          ),
          "_blank"
        );
      } else {
        this.$message.error("该分类没有生成HTML");
      }
    },
    onClose() {
      this.articleVisible = false;
    },
    generateHtml(id) {
      categoryApi.generateHtml(id).then((response) => {
        this.$notification["success"]({
          message: "成功生成" + response.data.data.name + "的HTML",
        });
      });
    }, generateArticlesByCategoryId(id) {
      ArticleApi.generateArticlesByCategoryId(id).then((response) => {
        this.$notification["success"]({
          message: response.data.data.message,
        });
      });
    },
    onSelect(selectedKeys) {
      // console.log(selectedKeys);
      // console.log(info)
      this.edit(selectedKeys);
    },
    onDragEnter() {
      // console.log(info)
    },
    updateCategoryPos() {
      categoryApi.updatePos(this.categorys).then((resp) => {
        this.loadcategory();

        this.initEdit();
        this.$notification["success"]({
          message: "顺序更新" + resp.data.message,
        });
      });
    },
    updateArticlePos() {
      contentAPI.updatePos(this.categoryId, this.articles).then((resp) => {
        this.$notification["success"]({
          message: "顺序更新" + resp.data.message,
        });
        this.generateHtml(this.updateId);
      });
    },
    onDropArticle(info) {
      // console.log(info);
      this.onDrop(info, "articles", "children");
    },
    onDropCategory(info) {
      // console.log(info);
      this.onDrop(info, "categorys", "children");
      //  children: 'childCategories',
      // title: 'name',
      // key:'id'
    },
    onDrop(info, name, childName) {
      const dropKey = info.node.eventKey;
      const dragKey = info.dragNode.eventKey;
      const dropPos = info.node.pos.split("-");
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const loop = (data, id, callback) => {
        data.forEach((item, index, arr) => {
          if (item.id === id) {
            return callback(item, index, arr);
          }

          if (item[childName]) {
            return loop(item[childName], id, callback);
          }
        });
      };
      // console.log(this.categorys)
      const data = [...this[name]]; // Find dragObject

      let dragObj = {};
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item) => {
          item[childName] = item[childName] || []; // where to insert 示例添加到尾部，可以是随意位置

          item[childName].push(dragObj);
        });
      } else if (
        (info.node[childName] || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item) => {
          item[childName] = item[childName] || []; // where to insert 示例添加到尾部，可以是随意位置

          item[childName].unshift(dragObj);
        });
      } else {
        let ar = [];
        let i = 0;
        loop(data, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });

        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      this[name] = data;
      // console.log(this[name] )
    },
    updateAll(more) {
      var _this = this;
      this.$confirm({
        title: "你确定生成所有栏目HTML?",
        content: "Some descriptions",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          // console.log("aaaaaaaaaaa")
          // console.log(_this.currentTabId)
          if (more) {
            categoryApi.updateAll({ more: true }).then((response) => {
              _this.$notification["success"]({
                message:
                  "成功生成栏目Id为:" + response.data.data + "的HTML页面",
              });
              _this.loadcategory(_this.currentTabId);
            });
          } else {
            categoryApi.updateAll().then((response) => {
              _this.$notification["success"]({
                message:
                  "成功生成栏目Id为:" + response.data.data + "的HTML页面",
              });
              _this.loadcategory(_this.currentTabId);
            });
          }
        },
        onCancel() {
          // console.log("Cancel");
        },
      });
    },
  },
};
</script>
<style>
.but_type {
  float: right;
  position: absolute;
  right: 40px;
}
</style>