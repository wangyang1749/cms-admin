<template>
  <div>
    <span>模板名称:</span>
    <a-form-item label="选择分类">
      <a-select style="width: 100%" v-model="queryParam.templateType">
        <a-select-option
          :value="item"
          v-for="item in templateType"
          :key="item"
          >{{ item }}</a-select-option
        >
      </a-select>
    </a-form-item>

    <a-input style="width: 20%" v-model="queryParam.name"></a-input>
    <a-input style="width: 20%" v-model="queryParam.enName"></a-input>
    <a-input style="width: 20%" v-model="queryParam.templateValue"></a-input>

    <span>模板类型:{{ queryParam.templateType }}</span>

    <!-- <a-select style="width: 120px" v-model="queryParam.type">
      <a-select-option value="0">文档</a-select-option>
      <a-select-option value="1">首页</a-select-option>
      <a-select-option value="2">分类页</a-select-option>
      <a-select-option value="3">其它</a-select-option>
    </a-select>-->
    <a-button @click="submit">提交</a-button>
    <a-textarea
      v-model="queryParam.templateContent"
      placeholder="Autosize height based on content lines"
      autosize
    />
  </div>
</template>

<script>
// import TemplateApi from "@/api/template.js";
import templateApi from "@/api/template.js";
import enumApi from "@/api/enum.js";

export default {
  data() {
    return {
      queryParam: {
        name: "",
        viewName: "",
        templateValue: "",
        path: "components",
        dataName: "",
        templateType: undefined,
        templateContent:""
      },
      id: null,
      isUpdate: false,
      templateType: [],
    };
  },
  mounted() {
    enumApi.list("TemplateType").then((resp) => {
      // console.log(resp.data.data);
      this.templateType = resp.data.data;
    });
  },
  beforeRouteEnter(to, from, next) {
    const id = to.query.id;

    next((vm) => {
      if (id) {
        vm.id = id;
        templateApi.findDetailsById(id).then((resp) => {
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
        templateApi.update(this.id, this.queryParam).then((resp) => {
          this.$notification["success"]({
            message: "更新模板[" + resp.data.data.name + "]成功",
          });
        });
      } else {
          console.log(this.queryParam)
        templateApi.add(this.queryParam).then((resp) => {
          this.$notification["success"]({
            message: "添加模板[" + resp.data.data.name + "]成功",
          });
        });
      }
    },
  },
};
</script>

<style>
</style>