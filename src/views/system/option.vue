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
          <a-select  v-model="optionParam.attachment_type" >
            <a-select-option value="LOCAL">本地</a-select-option>
            <a-select-option value="ALIOSS">阿里云</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button @click="selectAttachementType">保存</a-button>
        </a-form-item>
      </a-form>
    </a-tab-pane>
    <a-tab-pane tab="Tab 3" key="3">Content of Tab Pane 3</a-tab-pane>
  </a-tabs>
</template>

<script>
import optionApi from "@/api/option.js";
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
        oss_ali_thumbnail_style_rule: ""
      },
      options: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      optionApi.list().then(response => {
        const options = {};
        response.data.data.forEach(option => {
          options[option.key] = option.value;
        });
        this.optionParam = options;
        // this.aliOss=this.options
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
    }
  }
};
</script>

<style>
</style>