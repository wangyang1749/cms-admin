<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="界面" key="1">
        <a-table
          :columns="columns"
          :dataSource="channels"
          :pagination="false"
          :rowKey="channel => channel.id"
          size="small"
          class="table"
          :scroll="{ x: 1500 }"
        >
          <template slot="title">
            <a-button type="primary" @click="addInput">添加栏目</a-button>
            <a-button @click="updateAll(false)">生成所有栏目HTML</a-button>
            <a-button @click="updateAll(true)">生成所有栏目HTML更新模板</a-button>
          </template>

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

          <div slot="existNav" slot-scope="existNav,record">
            <a-switch defaultChecked @change="onChangeNav(record.id)" v-model="record.existNav" />
          </div>

          <span slot="action" slot-scope="text, record">
            <a href="javascript:;" @click="generateHtml(record.id)">生成HTML</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click="()=> showSheet(record)">查看文章</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click="()=> edit(record.id)">编辑</a>
            <a-divider type="vertical" />
            <a href="javascript:;" @click="(e)=> remove(record.id)">删除</a>
          </span>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="使用说明" key="2" forceRender>
        <p style="padding:2rem">
          栏目管理存在的作用, 对于一个知识需要多个页面展示.
          <br />界面展示, 左侧是该栏目的所有文章,不采用分页, 右边是文章详情.
          <br />左侧的文章列表是单独生成的, 这个预览的只是一组文章列表.
          <br />每次添加文章回去维护这个列表.
          <br />这所有文章中添加这个列表, 从而实现动态展示文章, 不用每次生成所有文章(跟新栏目的文章列表).
          <br />
        </p>
      </a-tab-pane>
    </a-tabs>

    <a-modal title="添加栏目" v-model="visible" @ok="addOrUpdateChannel">
      <a-form layout="horizontal">
        <a-form-item label="视图的名称" help="不输入.默认生成">
          <a-input v-model="channelParam.viewName"></a-input>
        </a-form-item>
        <a-form-item label="栏目名称">
          <a-input v-model="channelParam.name"></a-input>
        </a-form-item>

        <a-form-item label="选择栏目列表的模板">
          <a-select style="width: 100%" v-model="channelParam.templateName">
            <a-select-option
              :value="item.enName"
              v-for="item in channelTemplates"
              :key="item.id"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择文章显示的模板">
          <a-select style="width: 100%" v-model="channelParam.articleTemplateName">
            <a-select-option
              :value="item.enName"
              v-for="item in channelSheetTemplate"
              :key="item.id"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="栏目的排序">
          <a-input v-model="channelParam.order"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal title="更新第一篇文章" v-model="visibleSheet" @ok="UpdateFirstSheetName">
      <a-form-item label="选择文章显示的模板">
        <a-select style="width: 100%" v-model="selectSheet">
          <a-select-option
            :value="item.viewName"
            v-for="item in articles"
            :key="item.viewName"
          >{{item.title}}</a-select-option>
        </a-select>
      </a-form-item>
    </a-modal>
  </div>
</template>

<script>
import channelApi from "@/api/channel.js";
import templateApi from "@/api/template.js";
import ArticleApi from "@/api/article.js";
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
    title: "第一篇文章",
    dataIndex: "firstArticle",
    key: "firstArticle"
  },
  {
    title: "Chanel模板",
    dataIndex: "templateName",
    key: "templateName"
  },
  {
    title: "sheet模板",
    dataIndex: "articleTemplateName",
    key: "articleTemplateName"
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
      fixed: "right",
    scopedSlots: { customRender: "action" }
  }
];
export default {
  data() {
    return {
      channelParam: {
        name: "",
        articleTemplateName: "",
        templateName: "",
        viewName: ""
      },
      channels: [],
      columns: columns,
      visible: false,
      channelTemplates: [],
      channelSheetTemplate: [],
      isUpdate: null,
      updateChannelId: null,
      articles: [],
      visibleSheet: false,
      selectSheet: null,
      selectChannels: null
    };
  },
  created() {
    this.loadchannelas();
  },
  methods: {
    loadChannelTempalte() {
      templateApi.findByType("ARTICLE_CHANNEL").then(response => {
        this.channelSheetTemplate = response.data.data;
        // console.log(response);
      });
    },
    loadChannelSheetTempalte() {
      templateApi.findByType("CHANNEL").then(response => {
        this.channelTemplates = response.data.data;
        // console.log(response);
      });
    },
    loadchannelas() {
      channelApi.list().then(response => {
        this.channels = response.data.data;
        // console.log(response);
      });
    },
    loadSheets(id) {
      ArticleApi.findListByCategoryId(id).then(response => {
        // console.log(response);
        this.articles = response.data.data;
      });
    },
    addInput() {
      this.isUpdate = false;
      this.loadChannelTempalte();
      this.loadChannelSheetTempalte();
      this.visible = true;
    },
    addOrUpdateChannel() {
      if (this.isUpdate) {
        channelApi
          .update(this.updateChannelId, this.channelParam)
          .then(response => {
            this.$notification["success"]({
              message: "更新成功:" + response.data.message
            });
            this.loadchannelas();
          });
      } else {
        channelApi.add(this.channelParam).then(response => {
          this.$notification["success"]({
            message: "成功添加:" + response.data.message
          });
          this.loadchannelas();
        });
      }

      this.visible = false;
    },
    edit(id) {
      this.loadChannelTempalte();
      this.loadChannelSheetTempalte();
      this.updateChannelId = id;

      this.isUpdate = true;
      channelApi.find(id).then(response => {
        this.channelParam = response.data.data;
        // console.log(response);
      });
      this.visible = true;
    },
    showSheet(value) {
      this.selectChannels = value;
      this.visibleSheet = true;
      this.loadSheets(value.id);
    },
    remove(id) {
      channelApi.delete(id).then(response => {
        this.$notification["success"]({
          message: "成功删除:" + response.data.message
        });

        this.loadchannelas();
      });
    },
    UpdateFirstSheetName() {
      // console.log(this.selectChannels);
      // console.log(this.selectSheet);
      channelApi
        .updateFirstSheet(this.selectChannels.id, this.selectSheet)
        .then(response => {
          this.$notification["success"]({
            message: "更新栏目的文章地址:" + response.data.data.firstArticle
          });
          this.loadchannelas();
        });
    },
    onChangeNav(id) {
      // console.log(id);
      channelApi.addOrRemoveToMenu(id).then(response => {
        if (response.data.data.existNav) {
          this.$notification["success"]({
            message: "成功添加" + response.data.data.name + "到导航!!"
          });
        } else {
          this.$notification["success"]({
            message: "成功移除" + response.data.data.name + "到导航!!"
          });
        }
      });
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
          if (more) {
            channelApi.updateAll({ more: true }).then(response => {
              _this.$notification["success"]({
                message: "成功生成栏目Id为:" + response.data.data + "的HTML页面"
              });
              _this.loadArticle();
            });
          } else {
            channelApi.updateAll().then(response => {
              _this.$notification["success"]({
                message: "成功生成栏目Id为:" + response.data.data + "的HTML页面"
              });
              _this.loadArticle();
            });
          }
        },
        onCancel() {
          // console.log("Cancel");
        }
      });
    },
    preview(value) {
      // console.log(value);
      window.open(preview.Online("channel", value), "_blank");
    },
    openHtml(value) {
      let url = value.viewName;
      if (value.path) {
        url = value.path + "/" + url;
      }
      window.open(preview.Html(url), "_blank");
    },
    generateHtml(id) {
      channelApi.generateHtml(id).then(response => {
        this.$notification["success"]({
          message: "成功生成" + response.data.data.name + "的HTML"
        });
      });
    }
  }
};
</script>

<style>
</style>