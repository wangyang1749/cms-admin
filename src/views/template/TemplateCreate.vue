<template>
  <div>
    <span>模板名称:</span>
    <a-input style="width: 20%" v-model="queryParam.name"></a-input>
    <span>路径:</span>
    <a-input style="width: 20%" v-model="queryParam.path"></a-input>
    <span>视图名称:</span>
    <a-input style="width: 20%" v-model="queryParam.viewName"></a-input>
    <span>数据名称</span>
    <a-input style="width: 20%" v-model="queryParam.dataName"></a-input>
    <!-- <a-select style="width: 120px" v-model="queryParam.type">
      <a-select-option value="0">文档</a-select-option>
      <a-select-option value="1">首页</a-select-option>
      <a-select-option value="2">分类页</a-select-option>
      <a-select-option value="3">其它</a-select-option>
    </a-select>-->
    <a-button @click="submit">提交</a-button>
    <a-textarea
      v-model="queryParam.templateValue"
      placeholder="Autosize height based on content lines"
      autosize
    />
  </div>
</template>

<script>
// import TemplateApi from "@/api/template.js";
import templatePageApi from "@/api/templatePage.js";

export default {
  data() {
    return {
      queryParam: {
        name: "",
        viewName: "",
        templateValue: "",
        path: "components",
        dataName: ""
      },
      id: null,
      isUpdate: false
    };
  },
  beforeRouteEnter(to, from, next) {
    const id = to.query.id;

    next(vm => {
      if (id) {
        vm.id = id;
        templatePageApi.findDetailsById(id).then(resp => {
          // console.log(resp);
          vm.queryParam = resp.data.data;
          vm.isUpdate = true;
        });
        // articleApi.findById(articleId).then(response => {
        //   const article = response.data.data;
        //   vm.queryParam = article;
        // });
      }
    });
  },
  methods: {
    handleChange() {
      //console.log(`selected ${value}`);
    },
    submit() {
      if (this.isUpdate) {
        templatePageApi.update(this.id, this.queryParam).then(resp => {
          this.$notification["success"]({
            message: "更新模板[" + resp.data.data.name + "]成功"
          });
        });
      } else {
        templatePageApi.add(this.queryParam).then(resp => {
          this.$notification["success"]({
            message: "添加模板[" + resp.data.data.name + "]成功"
          });
        });
      }
    }
  }
 
};
</script>

<style>
</style>