<template>
  <div>

    <a-form layout="horizontal">
      <a-form-item label="模板名称">
        <a-input style="width: 20%" v-model="queryParam.name"></a-input>
      </a-form-item>
      <a-form-item label="HTML模板路径">
        <a-input style="width: 20%" v-model="queryParam.path"></a-input>
      </a-form-item>
      <a-form-item label="HTML视图名称">
        <a-input style="width: 20%" v-model="queryParam.viewName"></a-input>
      </a-form-item>
      <a-form-item label="数据来源">
        <a-input style="width: 20%" v-model="queryParam.dataName"></a-input>
      </a-form-item>
      <a-form-item label="模板HTML文件">
        <a-textarea v-model="queryParam.templateValue" placeholder="Autosize height based on content lines" autosize />
      </a-form-item>
      <a-button @click="submit">提交</a-button>
    </a-form>
   

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
        dataName: "",
        parse:false,
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
          this.$router.push("/template/staticList");
        });
      } else {
        templatePageApi.add(this.queryParam).then(resp => {
          this.$notification["success"]({
            message: "添加模板[" + resp.data.data.name + "]成功"
          });
          this.$router.push("/template/staticList");
        });
      }
    }
  }

};
</script>

<style>

</style>