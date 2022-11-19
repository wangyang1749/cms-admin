<template>
  <div>
    <a-button @click="importData">导入</a-button>

    <a-tree
      class="draggable-tree"
      draggable
      block-node
      :tree-data="collection"
      :replace-fields="fieldNames"
      @select="onSelect"
    />
    <!-- @dragenter="onDragEnter"
       
        @drop="onDropCategory" -->
    <!-- <div v-for="item in collection" :key="item.id">
        {{item.name}}---{{item.key}}--{{item.parentKey}}---{{item.id}}---{{item.parentId}}
      </div> -->
  </div>
</template>

<script>
import collectionApi from "@/api/collection.js";
import preview from "@/api/preview.js";

export default {
  data() {
    return {
      collection: [],
      fieldNames: {
        children: "children",
        title: "name",
        key: "id",
      },
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      collectionApi.list().then((resp) => {
        // console.log(resp);
        this.collection = resp.data.data;
      });
    },
    importData() {
      collectionApi.import().then((resp) => {
        // console.log(resp);
        this.$message.success(resp.data.message);
        this.loadData();
      });
    },
    onSelect(value) {
      // console.log(value)
      window.open(preview.Online("literatureList", value), "_blank");
    },
  },
};
</script>

<style>
</style>