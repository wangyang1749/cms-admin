<template>
  <div>
    <a-table :columns="columns" :dataSource="article" :pagination="false" :rowKey="(article) => article.id" size="small"
      class="table" :scroll="{ x: 2500 }">
      <template slot="title">
        <a-input-search placeholder="input search text" style="width: 200px" v-model="queryParam.keyword"
          @search="onSearch" />
        <a-select @change="onSearchCategory()" style="width: 10%">
          <a-select-option :value="item.id" v-for="item in categorys" :key="item.id">{{ item.name }}</a-select-option>
        </a-select>
        <a-button @click="updateAll(false)">生成所有文章HTML</a-button>
        <a-button @click="updateAll(true)">生成所有文章HTML更新文章内容</a-button>
        <a-button @click="addGoods(false)">添加商品</a-button>
        <a-select style="width: 10%" @change="(value) => { this.queryParam.lang = value; this.loadArticle() }"
          :value=this.queryParam.lang>
          <a-select-option :value="item" v-for="item in langs" :key="item">{{ item }}</a-select-option>
          <!-- <a-select-option value="EN" >英文</a-select-option> -->
        </a-select>
      </template>
      <div slot="title_" slot-scope="title_, record">
        <a href="javascript:;" @click="preview(record.id)">{{ title_ }}</a>
      </div>

      <div slot="viewName" slot-scope="viewName, record">
        <a href="javascript:;" @click="openHtml(record)">{{ viewName }}</a>
      </div>

      <div slot="commentNum" slot-scope="commentNum, record">
        <a href="javascript:;" @click="commentList(record.id)">{{
          commentNum
        }}</a>
      </div>
      <div slot="openComment" slot-scope="openComment, record">
        <a-switch defaultChecked @change="onChangeComment(record.id)" v-model="record.openComment" />
      </div>

      <!-- <div slot="haveHtml" slot-scope="haveHtml,record">
          <a-switch defaultChecked @change="onChangeHtml(record.id)" v-model="record.haveHtml" />
        </div> -->

      <div slot="top" slot-scope="top, record">
        <a-switch defaultChecked @change="sendOrCancelTop(record.id)" v-model="record.top" />
      </div>

      <div slot="isDivision" slot-scope="isDivision, record">
        <a-switch defaultChecked @change="divisionOkOrCancel(record.id)" v-model="record.isDivision" />
      </div>

      <div slot="categoryId" slot-scope="categoryId, record">
        <a-select style="width: 100%" v-model="record.categoryId" @change="selectCategory(record.id, $event)">
          <a-select-option :value="item.id" v-for="item in categorys" :key="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <!-- <span slot="haveHtml" slot-scope="haveHtml,record">
          <a href="javascript:;" @click="openHtml(record)">{{haveHtml}}</a>
        </span>-->

      <!-- <span slot="category" slot-scope="category">
          <a-tag :color="'geekblue'" v-if="category">{{category.name}}</a-tag>
        </span>-->
      <span slot="tags" slot-scope="tags">
        <a-tag v-for="tag in tags" :color="'green'" :key="tag.id">{{
          tag.name
        }}</a-tag>
      </span>

      <span slot="action" slot-scope="text, record">
        <!-- <a href="javascript:;">Invite 一 {{record.name}}</a>
          <a-divider type="vertical" />-->
        <a href="javascript:;" @click="generateHtml(record.id)">生成HTML</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="handleEditClick(record)">编辑</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="createArticleLanguage(record.id)">复制英文</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="articleSettings(record.id)">设置</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="deleteArticleById(record.id)">删除文章</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="publisher(record.id)">提交到搜索引擎</a>
        <!-- <a href="javascript:;" class="ant-dropdown-link">
          More actions
          <a-icon type="down" />
          </a>-->
      </span>
      <template slot="footer">
        <div class="page-wrapper" :style="{ textAlign: 'right' }">
          <a-pagination class="pagination" :current="pagination.page" :total="pagination.total"
            :defaultPageSize="pagination.size" :pageSizeOptions="['1', '2', '5', '10', '20', '50', '100']" showSizeChanger
            @showSizeChange="handlePaginationChange" @change="handlePaginationChange" />
        </div>
      </template>
    </a-table>

    <a-drawer title="添加商品" placement="right" :closable="true" :visible="addOrUpdateVisible" width="700"
      @close="() => addOrUpdateVisible = false">
      <a-form-model :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-model-item label="title">
          <a-input v-model="form.title" />
        </a-form-model-item>
        <a-form-model-item label="originalContent">
          <a-input v-model="form.originalContent" type="textarea" />
        </a-form-model-item>

        <a-form-model-item label="类别">
          <a-select v-model="form.categoryId" placeholder="请选择类别">
            <a-select-option :value="item.id" v-for="item in categorys" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 14, offset: 1 }">
          <a-button type="primary" @click="onSubmit">
            Create
          </a-button>
        </a-form-model-item>
      </a-form-model>

    </a-drawer>
  </div>
</template>
<script>
const columns = [
  {
    title: "标题",
    dataIndex: "title",
    key: "title",
    // fixed: "left",

    scopedSlots: { customRender: "title_" },
  }, {
    title: "语言",
    dataIndex: "lang",
    key: "lang",

  },
  {
    title: "视图名称",
    dataIndex: "viewName",
    key: "viewName",
    scopedSlots: { customRender: "viewName" },
  },
  {
    title: "Article模板",
    dataIndex: "templateName",
    key: "templateName",
  },
  {
    title: "分类",
    dataIndex: "categoryId",
    key: "categoryId",
    scopedSlots: { customRender: "categoryId" },
  },
  {
    title: "标签",
    key: "tags",
    dataIndex: "tags",
    scopedSlots: { customRender: "tags" },
  },

  {
    title: "访问",
    dataIndex: "visits",
    key: "visits",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "评论",
    dataIndex: "commentNum",
    key: "commentNum",
    scopedSlots: { customRender: "commentNum" },
  },
  {
    title: "是否开启评论",
    dataIndex: "openComment",
    key: "openComment",
    scopedSlots: { customRender: "openComment" },
  },
  // {
  //   title: "是否生成HTML",
  //   dataIndex: "haveHtml",
  //   key: "haveHtml",
  //   scopedSlots: { customRender: "haveHtml" }
  // },
  {
    title: "是否置顶",
    dataIndex: "top",
    key: "top",
    scopedSlots: { customRender: "top" },
  }, {
    title: "是否是分割",
    dataIndex: "isDivision",
    key: "isDivision",
    scopedSlots: { customRender: "isDivision" },
  },
  {
    title: "发布时间",
    dataIndex: "createDate",
    key: "createDate",
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    //   width: 200,
    scopedSlots: { customRender: "action" },
  },
];
import commentApi from "@/api/comment.js";
import GoodsApi from "@/api/goods.js";
import preview from "@/api/preview.js";
import categoryApi from "@/api/category.js";
import enumApi from "@/api/enum.js";

export default {
  data() {
    return {
      pagination: {
        page: 1,
        size: 10,
        sort: null,
      },
      queryParam: {
        page: 0,
        size: 20,
        sort: null,
        keyword: null,
        categoryId: null,
        status: null,
        lang: 'ZH'
      },
      categorys: [],
      channels: [],
      columns,
      article: [],
      commentVisible: false,
      selectRecord: null,
      comments: [],
      articleId: null,
      commentContent: "", //评论内容绑定
      visible: false,
      langs: [],
      selecetComponentsId: null,
      addOrUpdateVisible: false,
      form: {}
    };
  },
  created() {
    this.loadArticle();
    this.loadcategory();
    //console.log(this.$user)
    // console.log(this.$Golbal.baseUrl)
    enumApi.list("Lang").then((resp) => {
      // console.log(resp.data.data);
      this.langs = resp.data.data;
    });
  },
  methods: {
    formatDate(now) {
      var year = now.getFullYear(); //取得4位数的年份
      var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
      var date = now.getDate(); //返回日期月份中的天数（1到31）
      var hour = now.getHours(); //返回日期中的小时数（0到23）
      var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
      var second = now.getSeconds(); //返回日期中的秒数（0到59）
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    addGoods() {
      this.addOrUpdateVisible = true
    },
    loadArticle() {
      //console.log("loadArticle")
      this.queryParam.page = this.pagination.page - 1;
      this.queryParam.size = this.pagination.size;
      this.queryParam.sort = this.pagination.sort;
      GoodsApi.query(this.queryParam).then((response) => {
        // console.log(response);
        this.article = response.data.data.content;
        this.pagination.total = response.data.data.totalElements;
      });
    }, onSubmit() {
      GoodsApi.create(this.form).then(resp => {
        this.$notification["success"]({
          message: "操作" + response.data.message,
        });
      })
      // console.log('submit!', this.form);
    },
    loadcategory() {
      // console.log("loadcategory");
      categoryApi.list().then((response) => {
        // console.log(response);
        this.categorys = response.data.data;
      });
    }, createArticleLanguage(id) {
      GoodsApi.createArticleLanguage(id).then(resp => {
        // console.log(resp)
        this.$notification["success"]({
          message: resp.message
        });
        this.loadArticle()
      })
    },

    handlePaginationChange(page, pageSize) {
      // console.log("111")
      // this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page;
      this.pagination.size = pageSize;
      this.loadArticle();
    },
    preview(id) {
      window.open(preview.Online("goods", id), "_blank");
      // window.location.href='https://www.baidu.com/'
    },
    handleEditClick(article) {
      this.$router.push({
        name: "ArticleWrite",
        query: { articleId: article.id },
      });
      // console.log(article);
    },
    openHtml(value) {
      window.open(preview.Html(value.path + "/" + value.viewName), "_blank");
      // if (value.haveHtml) {

      // } else {
      //   this.$message.error("该文章没有生成HTML");
      // }
    },

    articleSettings() {
      this.visible = true;
    },
    selectCategory(value, select) {
      GoodsApi.updateCategory(value, select).then((response) => {
        // console.log(response);
        this.$notification["success"]({
          message: "操作" + response.data.message,
        });
        this.loadArticle();
      });
    },
    // selectChannel(value) {
    //   // console.log(value);
    //   // console.log(this.selectRecord.id);
    //   GoodsApi.addArticleToChannel(this.selectRecord.id, value).then(
    //     response => {
    //       // console.log(response);
    //       this.$notification["success"]({
    //         message: "操作" + response.data.message
    //       });
    //     }
    //   );
    // },
    deleteArticleById(id) {
      var _this = this;
      this.$confirm({
        title: "你确定删除这篇文章?",
        content: "Some descriptions",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          GoodsApi.delete(id).then((response) => {
            _this.$notification["success"]({
              message: "成功删除文章" + response.data.data.title,
            });
            _this.loadArticle();
          });
        },
        onCancel() {
          // console.log("Cancel");
        },
      });
    },
    // onChangeHtml(id) {
    //   // console.log(id);
    //   GoodsApi.haveHtml(id).then(response => {
    //     // console.log(response);
    //     this.$notification["success"]({
    //       message: "操作" + response.data.message
    //     });
    //     this.loadArticle();
    //   });
    // },
    sendOrCancelTop(id) {
      // console.log(id);
      GoodsApi.sendOrCancelTop(id).then((response) => {
        // console.log(response);
        this.$notification["success"]({
          message: "操作" + response.data.message,
        });
        this.loadArticle();
      });
    },
    onChangeComment(id) {
      GoodsApi.openOrCloseComment(id).then((response) => {
        // console.log(response);
        this.$notification["success"]({
          message: "操作" + response.data.message,
        });
        this.loadArticle();
      });
    },
    generateHtml(id) {
      GoodsApi.generateHtml(id).then((response) => {
        this.$notification["success"]({
          message: "成功生成" + response.data.data.title + "的HTML",
        });
      });
    }, publisher(id) {
      GoodsApi.publisher(id).then((response) => {
        this.$notification["success"]({
          message: "remain:" + response.data.data.remain + " success:" + response.data.data.success,
        });
      });
    },
    updateAll(more) {
      var _this = this;
      this.$confirm({
        title: "你确定生成所有文章HTML?",
        content: "Some descriptions",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk() {
          if (more) {
            GoodsApi.updateAll({ more: true }).then((response) => {
              _this.$notification["success"]({
                message: "成功生成文章Id为:" + response.data.data + "的文章",
              });
              _this.loadArticle();
            });
          } else {
            GoodsApi.updateAll().then((response) => {
              _this.$notification["success"]({
                message: "成功生成文章Id为:" + response.data.data + "的文章",
              });
              _this.loadArticle();
            });
          }
        },

        onCancel() {
          // console.log("Cancel");
        },
      });
    },
    commentList(id) {
      this.commentVisible = true;
      this.articleId = id;
      // console.log("--" + id);
      // console.log(id);
      commentApi.listByArticleId(id).then((resp) => {
        let content = resp.data.data.content;
        this.comments = content;
      });
    },
    delComment(id) {
      // console.log(id);
      commentApi.deleteById(id).then((resp) => {
        this.$notification["success"]({
          message: "成功删除评论" + resp.content,
        });
        this.commentList(this.articleId);
      });
    },
    addComment() {
      let data = {
        username: this.$user.username,
        userId: this.$user.id,
        email: this.$user.email,
        articleId: this.articleId,
        content: this.commentContent,
      };
      //console.log(data)
      commentApi.add(data).then((resp) => {
        this.$notification["success"]({
          message: "成功添加" + resp,
        });
        this.commentList(this.articleId);
      });
    },
    onSearch() {
      this.loadArticle();
    }, onSearchCategory() {

    }, divisionOkOrCancel(id) {
      GoodsApi.divisionOkOrCancel(id).then((response) => {
        // console.log(response);
        this.$notification["success"]({
          message: "操作" + response.data.message,
        });
        this.loadArticle();
      });
    }
  },
};
</script>
<style>
.table {
  background: #fff;
}
</style>
  