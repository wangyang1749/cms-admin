<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="阿里云OSS" key="1">
        <a-form>
          <a-form-item
            style="width:50%"
            :label="item.name"
            :key="item.id"
            v-for=" item in optionsOss"
          >
            <a-input v-model="item.value"></a-input>
          </a-form-item>
          <a-form-item>
            <a-button @click="addOss">提交</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane tab="上传目的地" key="2" forceRender></a-tab-pane>
      <a-tab-pane tab="文章操作" key="3" forceRender>
        <a-form>
          <a-form-item
            style="width:50%"
            :label="item.name"
            :key="item.id"
            v-for=" item in optionsArticle"
          >
            <a-input-number id="inputNumber" v-if="(item)=>{isNaN(item.value)}" :min="10"  v-model="item.value"/>

            <a-input v-model="item.value" v-else></a-input>
          </a-form-item>
          <a-form-item>
            <a-button @click="changeArticlePageSize">提交</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import optionApi from "@/api/option.js";
export default {
  data() {
    return {
      options: [],
      selectArticlePageSize:null
    };
  },
  created() {
    this.loadOptions();
  },
  computed: {
    optionsOss() {
      let optionsOss = [];
      this.options.forEach(option => {
        if (option.groupId == 0) {
          optionsOss.push(option);
        }
      });
      return optionsOss;
    },
    optionsArticle() {
      let optionsArticle = [];
      this.options.forEach(option => {
        if (option.groupId == 1) {
          optionsArticle.push(option);
        }
      });
      return optionsArticle;
    }
  },
  methods: {
    loadOptions() {
      optionApi.list().then(response => {
        this.options = response.data.data;
        // console.log(this.options);
      });
    },changeArticlePageSize(){
      optionApi.save(this.optionsArticle).then(response => {
        this.$notification["success"]({
          message: response.data.message + "更改成功"
        });
        // console.log(response);
      });
      // console.log( this.optionsArticle)
    },addOss(){
      optionApi.save(this.optionsOss).then(response => {
        this.$notification["success"]({
          message: response.data.message + "更改成功"
        });
        // console.log(response);
      });
    }
  }
};
</script>

<style>
</style>