<template>
  <a-tabs defaultActiveKey="1">
    <a-tab-pane tab="阿里云OSS" key="1">
      <a-form>
        <a-form-item style="width:50%" label="domain">
          <a-input v-model="optionParam.oss_ali_domain"></a-input>
        </a-form-item>
        <a-form-item style="width:50%" label="endpoint">
          <a-input v-model="optionParam.oss_ali_end_point"></a-input>
        </a-form-item>

        <a-form-item style="width:50%" label="accessKeyId">
          <a-input v-model="optionParam.oss_ali_access_key"></a-input>
        </a-form-item>

        <a-form-item style="width:50%" label="accessKeySecret">
          <a-input v-model="optionParam.oss_ali_access_secret"></a-input>
        </a-form-item>

        <a-form-item style="width:50%" label="bucketName">
          <a-input v-model="optionParam.oss_ali_bucket_name"></a-input>
        </a-form-item>

        <a-form-item style="width:50%" label="source">
          <a-input v-model="optionParam.oss_ali_source" placeholder="目录"></a-input>
        </a-form-item>

        <a-form-item style="width:50%" label="Style rule">
          <a-input v-model="optionParam.oss_ali_style_rule"></a-input>
        </a-form-item>

        <a-form-item style="width:50%" label="thumbnail">
          <a-input v-model="optionParam.oss_ali_thumbnail_style_rule"></a-input>
        </a-form-item>

        <a-button @click="save">提交</a-button>
      </a-form>
    </a-tab-pane>
    <a-tab-pane tab="上传目的地" key="2" forceRender>
      <a-form>
        <a-form-item label="选择上传位置">
          <a-select v-model="optionParam.attachment_type">
            <a-select-option value="LOCAL">本地</a-select-option>
            <a-select-option value="ALIOSS">阿里云</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button @click="selectAttachementType">保存</a-button>
        </a-form-item>
      </a-form>
    </a-tab-pane>
    <a-tab-pane tab="文章操作设置" key="3">
      <a-form>
        <a-form-item label="选择文章发布默认模板">
          <a-select style="width: 100%" v-model="optionParam.default_article_template_id">
            <a-select-option :value="item.id" v-for="item in templates" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button @click="defaultArticleTemplateId">保存</a-button>
        </a-form-item>

        <a-form-item label="生成静态文章的数目" help="实质上是分页时一页的大小, 后面的文章列表动态从数据库添加!">
          <a-input-number
            id="inputNumber"
            :min="1"
            :max="10"
            v-model="pageSize"
            @change="setPageSize"
          />
        </a-form-item>
        <a-form-item>
          <a-button>提交</a-button>
        </a-form-item>
      </a-form>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import optionApi from "@/api/option.js";
import templateApi from "@/api/template.js";
export default {
  data() {
    return {
      optionParam: {
        attachment_type: "",
        oss_ali_end_point: "",
        oss_ali_access_key: "",
        oss_ali_access_secret: "",
        oss_ali_bucket_name: "",
        oss_ali_domain: "",
        oss_ali_source: "",
        oss_ali_style_rule: "",
        oss_ali_thumbnail_style_rule: "",
        default_article_template_id: 1
      },
      templates: [],
      pageSize:0
    };
  },
  created() {
    this.loadTempalte();
    this.loadData();
  },
  methods: {
    loadData() {
      optionApi.list().then(response => {
        const options = {};
        response.data.data.forEach(option => {
          if (/^[0-9]+$/.test(option.value)) {
            options[option.key] = parseInt(option.value);
          } else {
            options[option.key] = option.value;
          }
        });

        this.optionParam = options;
        // this.aliOss=this.options
      });
    },
    loadTempalte() {
      templateApi.findByType("ARTICLE").then(response => {
        this.templates = response.data.data;
        // console.log(response);
      });
    },
    defaultArticleTemplateId() {
      var articleTemplateId = [];
      articleTemplateId.push({
        key: "default_article_template_id",
        value: this.optionParam.default_article_template_id
      });
      optionApi.save(articleTemplateId).then(response => {
        this.$notification["success"]({
          message: response.data.message + "添加成功"
        });
        // console.log(response);
      });
    },
    selectAttachementType() {
      // console.log(this.optionParam.attachmentType);
      var attachment = [];
      attachment.push({
        key: "attachment_type",
        value: this.optionParam.attachment_type
      });
      optionApi.save(attachment).then(response => {
        this.$notification["success"]({
          message: response.data.message + "添加成功"
        });
        // console.log(response);
      });
    },
    save() {
      // console.log(this.optionsMap)
      var aliOss = [];
      aliOss.push({
        key: "oss_ali_end_point",
        value: this.optionParam.oss_ali_end_point
      });
      aliOss.push({
        key: "oss_ali_access_key",
        value: this.optionParam.oss_ali_access_key
      });
      aliOss.push({
        key: "oss_ali_access_secret",
        value: this.optionParam.oss_ali_access_secret
      });
      aliOss.push({
        key: "oss_ali_bucket_name",
        value: this.optionParam.oss_ali_bucket_name
      });

      aliOss.push({
        key: "oss_ali_domain",
        value: this.optionParam.oss_ali_domain
      });
      aliOss.push({
        key: "oss_ali_source",
        value: this.optionParam.oss_ali_source
      });
      aliOss.push({
        key: "oss_ali_style_rule",
        value: this.optionParam.oss_ali_style_rule
      });
      aliOss.push({
        key: "oss_ali_thumbnail_style_rule",
        value: this.optionParam.oss_ali_thumbnail_style_rule
      });
      // console.log(aliOss);
      optionApi.save(aliOss).then(response => {
        this.$notification["success"]({
          message: response.data.message + "添加成功"
        });
        // console.log(response);
      });
    },setPageSize(){

    }
  }
};
</script>

<style>
</style>