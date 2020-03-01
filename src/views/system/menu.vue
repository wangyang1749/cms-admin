<template>
  <div>
    <a-button @click="addMenu">添加菜单</a-button>
    <div v-for="item in menus" :key="item.id">
      {{item.name}}---{{item.urlName}}
      <a href="javascript:;" @click="deleteMenu(item)">删除</a>
      <a href="javascript:;" @click="edit(item)">更新</a>
    </div>

    <a-modal title="添加分类" v-model="visible" @ok="handleOk">
      <a-form>
        <a-form-item label="菜单名称">
          <a-input v-model="queryParam.name"></a-input>
        </a-form-item>

        <a-form-item label="菜单的路径">
          <a-input v-model="queryParam.urlName"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import menuApi from "@/api/menu.js";
export default {
  data() {
    return {
      menus: [],
      visible: false,
      isUpdate: true,
      updateId: "",
      queryParam: {
        name: "",
        urlName: "",
        icon: "",
        parentId: "",
        status: true,
        target: "_blank"
      }
    };
  },
  created() {
    this.loadMenu();
  },
  methods: {
    loadMenu() {
      // console.log("loadMenu")
      menuApi.list().then(response => {
        this.menus = response.data.data;
        //console.log(response);
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
      menuApi.findById(value.id).then(response => {
        this.queryParam = response.data.data;
        // console.log(response);
      });
    },
    deleteMenu(value) {
      // console.log(value);
      menuApi.delete(value.id).then(response => {
        this.$notification["success"]({
          message: response.data.message
        });
        this.loadMenu();
      });
    },
    updateMenu(value) {
      // console.log(value);
      menuApi.update(value.id, this.queryParam).then(response => {
        // this.menus = response.data.data;

        this.$notification["success"]({
          message: response.data.message
        });
        //  console.log(response);
      });
    },
    handleOk() {
      if (this.isUpdate) {
        menuApi.update(this.updateId, this.queryParam).then(response => {
          this.$notification["success"]({
            message: response.data.message
          });
          this.loadMenu();
          this.visible = false;
        });
      } else {
        menuApi.add(this.queryParam).then(response => {
          this.$notification["success"]({
            message: response.data.message
          });
          this.loadMenu();
          this.visible = false;
        });
      }
    }
  }
};
</script>

<style>
</style>