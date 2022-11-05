<template>
  <div>
    <a-button @click="addMenu">添加菜单</a-button>
    <div v-for="item in literatures" :key="item.id">
      {{item.id}}---{{item.title}}--{{item.url}}--{{item.key}}
      <a href="javascript:;" @click="deleteLiteratures(item)">删除</a>
      <a href="javascript:;" @click="edit(item)">更新</a>
    </div>

    <a-modal title="添加分类" v-model="visible" @ok="handleOk">
      <a-form>
        <a-form-item label="文献标题">
          <a-input v-model="queryParam.title"></a-input>
        </a-form-item>
        <a-form-item label="url">
          <a-input v-model="queryParam.url"></a-input>
        </a-form-item>
         <a-form-item label="key">
          <a-input v-model="queryParam.key"></a-input>
        </a-form-item>
        <!-- <a-form-item label="菜单的路径">
          <a-input v-model="queryParam.urlName"></a-input>
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import literatureApi from "@/api/literature.js";
export default {
  data() {
    return {
      literatures: [],
      visible: false,
      isUpdate: true,
      updateId: "",
      queryParam: {
        title: "",
        url: "",
        key: "",
        parentId: "",
        status: true,
        target: "_blank"
      }
    };
  },
  created() {
    this.loadLiterature();
  },
  methods: {
    loadLiterature() {
      // console.log("loadMenu")
      literatureApi.list().then(response => {
        this.literatures = response.data.data.content;
        // console.log(response);
      });
    },
    addMenu() {
      this.isUpdate = false;
      this.visible = true;
    },
    edit(value) {
      this.isUpdate = true;
      this.visible = true;
      this.updateId = value.id;
      literatureApi.findById(value.id).then(response => {
        this.queryParam = response.data.data;
        // console.log(response);
      });
    },
    deleteLiteratures(value) {
      // console.log(value);
      literatureApi.delete(value.id).then(response => {
        this.$notification["success"]({
          message: response.data.message
        });
        this.loadLiterature();
      });
    },
    // updateMenu(value) {
    //   // console.log(value);
    //   menuApi.update(value.id, this.queryParam).then(response => {
    //     // this.menus = response.data.data;

    //     this.$notification["success"]({
    //       message: response.data.message
    //     });
    //     //  console.log(response);
    //   });
    // },
    handleOk() {
      if (this.isUpdate) {
        literatureApi.update(this.updateId, this.queryParam).then(response => {
          this.$notification["success"]({
            message: response.data.message
          });
          this.loadLiterature();
          this.visible = false;
        });
      } else {
        literatureApi.add(this.queryParam).then(response => {
          this.$notification["success"]({
            message: response.data.message
          });
          this.loadLiterature();
          this.visible = false;
        });
      }
    }
  }
};
</script>

<style>
</style>