<template>
  <div>
      <span>模板名称:</span>
    <a-input style="width: 20%" v-model="data.name"></a-input>
    <span>视图名称:</span>
    <a-input style="width: 20%" v-model="data.viewName"></a-input>
    <a-select style="width: 120px"  v-model="data.type">
      <a-select-option value="0" >文档</a-select-option>
      <a-select-option value="1">首页</a-select-option>
      <a-select-option value="2">分类页</a-select-option>
      <a-select-option value="3">其它</a-select-option>
    </a-select>
    <a-button @click="submit">提交</a-button>
    <a-textarea
    v-model="data.htmlText"
      placeholder="Autosize height based on content lines"
      :style="{height:'30rem'}"
      autosize
    />
  </div>
</template>

<script>
import TemplateApi from "@/api/template.js";

export default {
    data(){
        return {
            data:{
                type:'',
                viewName:'',
                htmlText:'',
                name:''
            }
        }
    }, methods: {
      handleChange() {
        //console.log(`selected ${value}`);
      },submit(){
          //console.log(this.data)
          TemplateApi.create(this.data).then(()=>{
              //console.log(response)
          })
      }
    },
};
</script>

<style>
</style>