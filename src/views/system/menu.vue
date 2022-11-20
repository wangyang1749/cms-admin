<template>
  <div>
    <a-button @click="addMenu">添加菜单</a-button>
    <a-button type="primary" @click="updateCategoryPos">更新顺序</a-button>

    <div v-if="menu.id">
      <!-- {{item.name}}---{{item.urlName}} -->
      <a href="javascript:;" @click="deleteMenu(menu)">删除</a>
      <a href="javascript:;" @click="edit(menu)">更新</a>
    </div>

       <a-tree
        class="draggable-tree"
        draggable
        block-node
        :tree-data="menus"
        :replace-fields="fieldNames"
        @dragenter="onDragEnter"
         @select="onSelect"
        @drop="onDropCategory"
      />

    <a-modal title="添加分类" v-model="visible" @ok="handleOk">
      <a-form>
        <a-form-item label="菜单名称">
          <a-input v-model="queryParam.name"></a-input>
        </a-form-item>

        <a-form-item label="菜单的路径">
          <a-input v-model="queryParam.urlName"></a-input>
        </a-form-item>

        <a-form-item label="icon">
          <a-input v-model="queryParam.icon"></a-input>
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
      menu:{},
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
      },fieldNames:{
        children: 'children',
        title: 'name',
        key:'id'
      }
    };
  },
  created() {
    this.loadMenu();
  },
  methods: {
    loadMenu() {
      // console.log("loadMenu")
      menuApi.listVoTree().then(response => {
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
      this.queryParam=this.menu;
      // menuApi.findById(value.id).then(response => {
      //   this.queryParam = response.data.data;
      //   // console.log(response);
      // });
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
    },onSelect(selectedKeys){
      // console.log(selectedKeys);
    
      menuApi.findById(selectedKeys).then(resp=>{
        this.menu=resp.data.data
        //  console.log( this.menu)
      })
     
      // this.editInput(selectedKeys)
    },updateCategoryPos(){
        menuApi.updatePos(this.menus ).then(resp=>{
          this.loadMenu();
          this.$notification["success"]({
          message: "顺序更新" + resp.data.message 
          });
        })
    },onDragEnter(){
        // console.log(info)
    },onDropCategory(info){
      
      // console.log(info);
      this.onDrop(info,"menus","children")
        //  children: 'childCategories',
        // title: 'name',
        // key:'id'
     
    },onDrop(info,name,childName){
      const dropKey = info.node.eventKey;
      const dragKey = info.dragNode.eventKey;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
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
        loop(data, dropKey, item => {
          item[childName] = item[childName] || []; // where to insert 示例添加到尾部，可以是随意位置

          item[childName].push(dragObj);
        });
      } else if (
        (info.node[childName] || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
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
      this[name]  = data;
      // console.log(this[name] )

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