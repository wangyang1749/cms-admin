<template>
 <div>

    <a-table :columns="columns" :dataSource="article" :pagination="false" :rowKey="article => article.id">
    <!-- <a slot="name" slot-scope="text" href="javascript:;">{{text}}</a>

    <span slot="customTitle">
      <a-icon type="smile-o" />Name
    </span>-->
    <span slot="categories" slot-scope="categories">
      <a-tag
        v-for="category in categories"
        :color="category==='loser' ? 'volcano' : (category.length > 5 ? 'geekblue' : 'green')"
        :key="category"
      >{{category.name}}</a-tag>
    </span>
    <span slot="tags" slot-scope="tags">
      <a-tag
        v-for="tag in tags"
        :color="tag==='loser' ? 'volcano' : (tag.length > 5 ? 'geekblue' : 'green')"
        :key="tag"
      >{{tag.name}}</a-tag>
    </span>

    <span slot="action" slot-scope="">
      
      <a href="javascript:;">编辑</a>
      <a-divider type="vertical" />
      <a href="javascript:;" >设置</a>
    </span>
  </a-table>
     <div class="page-wrapper">
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
 </div>

</template>
<script>
const columns = [
  // {
  //   dataIndex: "name",
  //   key: "name",
  //   slots: { title: "customTitle" },
  //   scopedSlots: { customRender: "name" }
  // },
  {
    title: "标题",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status"
  },
  {
    title: "分类",
    dataIndex: "categories",
    key: "categories",
    scopedSlots: { customRender: "categories" }
  },
  {
    title: "标签",
    key: "tags",
    dataIndex: "tags",
    scopedSlots: { customRender: "tags" }
  },
  {
    title: "评论",
    dataIndex: "commentNum",
    key: "commentNum"
  },
  {
    title: "访问",
    dataIndex: "visits",
    key: "visits"
  },
  {
    title: "发布时间",
    dataIndex: "createDate",
    key: "createDate"
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];



const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"]
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"]
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"]
  }
];
import ArticleApi from "@/api/article.js";
export default {
  data() {
    return {
      pagination: {
        page: 1,
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
      data,
      columns,
      article: []
    };
  },
  created() {
    this.loadArticle();
  },
  methods: {
    loadArticle() {
      this.queryParam.page = this.pagination.page - 1;
      this.queryParam.size = this.pagination.size;
      this.queryParam.sort = this.pagination.sort;
      ArticleApi.query(this.queryParam).then(response => {
        console.log(response);
        this.article = response.data.data.content;
        this.pagination.total = response.data.data.totalElements;
        // this.postsLoading = false;
      });
    },handlePaginationChange(page, pageSize){
      // console.log("111")
      // this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page
      this.pagination.size = pageSize
      this.loadArticle()
    },
  }
};
</script>
