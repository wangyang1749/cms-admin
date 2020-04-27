<template>
  <div>
    <a-row>
      <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }" :dataSource="tags">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-tag color="green" @click="openArticle(item)">{{item.name}}</a-tag>
          <!-- <a-card :title="item.name">{{item.description}}</a-card> -->
        </a-list-item>
      </a-list>
    </a-row>

    <a-drawer
      title="标签下文章"
      placement="right"
      :closable="false"
      @close="()=>{visible=false}"
      :visible="visible"
      width="30rem"
    >
      <a-list :dataSource="articles">
        <a-list-item slot="renderItem" slot-scope="item">
          {{ item.title }}
        </a-list-item>
  
      
      </a-list>
    </a-drawer>
  </div>
</template>

<script>
import tagsApi from "@/api/tags.js";
import articleAPi from "@/api/article.js";
export default {
  data() {
    return {
      tags: [],
      visible: false,
      articles: []
    };
  },
  created() {
    this.loadTags();
  },
  methods: {
    loadTags() {
      tagsApi.list().then(resp => {
        console.log(resp);
        this.tags = resp.data.data;
      });
    },
    openArticle(item) {
      this.visible = true;
      console.log(item);
      articleAPi.pageByTagId(item.id).then(resp => {
        console.log(resp);
        this.articles = resp.data.data.content;
      });
    }
  }
};
</script>

<style>
</style>