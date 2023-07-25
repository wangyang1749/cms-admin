<template>
  <div>
    <span>模板名称:</span>

    <a-form layout="horizontal">
      <a-form-item label="模板类型">
        <a-select style="width: 100%" v-model="queryParam.templateType">
          <a-select-option :value="item" v-for="item in templateType" :key="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="模板数据">
        <a-select style="width: 100%" v-model="queryParam.templateData">
          <a-select-option :value="item" v-for="item in templateData" :key="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
 
      <a-form-item label="模板名称">
        <a-input style="width: 20%" v-model="queryParam.name"></a-input>
      </a-form-item>
      <a-form-item label="模板enName">
        <a-input style="width: 20%" v-model="queryParam.enName"></a-input>
      </a-form-item>
      <a-form-item label="模板HTML文件">
        <a-input style="width: 20%" v-model="queryParam.templateValue"></a-input>
      </a-form-item>
      <a-form-item label="文章Size">
        <a-input style="width: 20%" v-model="queryParam.articleSize"></a-input>
      </a-form-item>
      <a-form-item label="parentOrder">
        <a-input style="width: 20%" v-model="queryParam.parentOrder"></a-input>
      </a-form-item>
    </a-form>




    <span>模板类型:{{ queryParam.templateType }}</span>

    <!-- <a-select style="width: 120px" v-model="queryParam.type">
      <a-select-option value="0">文档</a-select-option>
      <a-select-option value="1">首页</a-select-option>
      <a-select-option value="2">分类页</a-select-option>
      <a-select-option value="3">其它</a-select-option>
    </a-select>-->
    <a-button @click="submit">提交</a-button>

  </div>
</template>

<script>
// import TemplateApi from "@/api/template.js";
import templateApi from "@/api/template.js";
import enumApi from "@/api/enum.js";
import uploadApi from "@/api/upload.js";
// import { mavonEditor } from "mavon-editor";
// import "mavon-editor/dist/css/index.css";
// import E from "wangeditor";
import _CodeMirror from "codemirror";
const CodeMirror = window.CodeMirror || _CodeMirror;
import dynamicLoad from "@/utils/dynamicLoad.js";

// 核心样式
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/cobalt.css";
import preview from "@/api/preview.js";

// import HE from "@/lib/HandyEditor.min.js"
export default {
  components: {
    // mavonEditor,
  },
  data() {
    return {
      queryParam: {
        name: "",
        viewName: "",
        templateValue: "",
        path: "components",
        dataName: "",
        templateType: undefined,
        templateContent: "",
        articleSize:undefined
      },
      id: null,
      isUpdate: false,
      templateType: [],
      templateData:[],
      visibleEditor: false,
      sourceCode: "",
      // 内部真实的内容
      code: "",
      // 默认的语法类型
      mode: "html",
      // 编辑器实例
      coder: null,
      // 默认配置
      options: {
        // 缩进格式
        tabSize: 2,
        // 主题，对应主题库 JS 需要提前引入
        theme: "cobalt",
        // 显示行号
        lineNumbers: true,
        line: true,
      },

    };
  },
  computed: {
    htmlUrl() {
      if (this.isUpdate) {
        return preview.Url("preview/templates/update/" + this.id);
      } else {
        return preview.Url("preview/templates/add");
      }
    },
    formatSourceCode() {
      return this.getTemplateContent();
    },
  },
  mounted() {
    enumApi.list("TemplateType").then((resp) => {
      // console.log(resp.data.data);
      this.templateType = resp.data.data;
    });

    enumApi.list("TemplateData").then((resp) => {
      // console.log(resp.data.data);
      this.templateData = resp.data.data;
    });

    // 第一步，初始化 textarea 的值
    // $text1.val(editor.txt.html());
    // let he = window.HE.getEditor('editor')
    // he.sync();
    // console.log(jquery);
    // var scriptTag = document.createElement("script");
    // scriptTag.src =
    //   "https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
    // scriptTag.id = "my-datatable";
    // document.getElementsByTagName("head")[0].appendChild(scriptTag);
    // console.log(window.$)
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

          vm.editor.txt.html(vm.formatSourceCode);
          // vm.coder.setValue(vm.queryParam.templateContent);
          // vm.run()
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
    setTemplateContent(html) {
      // console.log(dynamicLoad.prefix()+"/templates")
      html = html.replaceAll(dynamicLoad.prefix() + "/templates", "/templates");
      html = "<!DOCTYPE html> \n" + html;
      html = html.replace(/body_replace>/g, "body>");
      html = html.replace(/head_replace>/g, "head>");
      html = html.replace(/html_replace>/g, "html>");
      // html = html.replace(/\\<body_replace\\>/g, "<\\body>");
      this.queryParam.templateContent = html;
      // console.log(this.queryParam.templateContent);
    },
    getTemplateContent() {
      let html = this.queryParam.templateContent;

      html = html.replaceAll("/templates", dynamicLoad.prefix() + "/templates");
      html = html.replace(/body>/g, "body_replace>");
      html = html.replace(/head>/g, "head_replace>");
      html = html.replace(/html>/g, "html_replace>");
      // console.log(html);
      return html;
    },
    submit() {
      if (this.isUpdate) {
        templateApi.update(this.id, this.queryParam).then((resp) => {
          this.$notification["success"]({
            message: "更新模板[" + resp.data.data.name + "]成功",
          });
          this.$router.push("/template/dynamicList");
        });
      } else {
        // console.log(this.queryParam)
        templateApi.add(this.queryParam).then((resp) => {
          this.$notification["success"]({
            message: "添加模板[" + resp.data.data.name + "]成功",
          });
          this.$router.push("/template/dynamicList");
        });
      }
    },
    imgAdd(pos, $file) {
      var formdata = new FormData();
      formdata.append("file", $file);
      this.img_file[pos] = $file;
      uploadApi.upload(formdata).then((response) => {
        // console.log(response.data.data.path);
        this.$refs.md.$img2Url(pos, response.data.data.thumbPath);
      });
    },
    imgDel() { },
    _initialize() {
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options);
      // 编辑器赋值
      // this.coder.setValue(this.value || this.code);

      // 支持双向绑定
      this.coder.on("change", (coder) => {
        let html = coder.getValue();
        html = html.replace(/\/templates/g, "http://127.0.0.1:5500/templates");
        // console.log(coder.getValue());
        this.editor.txt.html(html);
        // this.queryParam.templateContent = coder.getValue();
        // console.log(this.queryParam.templateContent)
        // if (this.$emit) {
        //   this.$emit("input", this.queryParam.templateContent);
        // }
      });

      // 尝试从父容器获取语法类型
      if (this.language) {
        // 获取具体的语法类型对象
        let modeObj = this._getLanguage(this.language);

        // 判断父容器传入的语法是否被支持
        if (modeObj) {
          this.mode = modeObj.label;
        }
      }
    }, // 获取当前语法类型
    _getLanguage(language) {
      // 在支持的语法类型列表中寻找传入的语法类型
      return this.modes.find((mode) => {
        // 所有的值都忽略大小写，方便比较
        let currentLanguage = language.toLowerCase();
        let currentLabel = mode.label.toLowerCase();
        let currentValue = mode.value.toLowerCase();

        // 由于真实值可能不规范，例如 java 的真实值是 x-java ，所以讲 value 和 label 同时和传入语法进行比较
        return (
          currentLabel === currentLanguage || currentValue === currentLanguage
        );
      });
    }, // 更改模式
    changeMode(val) {
      // 修改编辑器的语法配置
      this.coder.setOption("mode", `text/${val}`);

      // 获取修改后的语法
      let label = this._getLanguage(val).label.toLowerCase();

      // 允许父容器通过以下函数监听当前的语法值
      this.$emit("language-change", label);
    },
    run() {
      if (!this.isUpdate) {
        templateApi.add(this.queryParam).then((resp) => {
          this.id = resp.data.data.id;
          this.isUpdate = true;
          this.$notification["success"]({
            message: "添加模板[" + resp.data.data.name + "]成功",
          });
          // console.log(this.id);
          // console.log(this.isUpdate);
          this.$router.replace({ query: { id: this.id } });
        });
      }
      this.$refs.runForm.submit();

      // console.log(this.htmlUrl)
      // this.submit();
      // this.submitTryit()
      // console.log(this.htmlUrl);
      // this.$refs.iframe.action = this.htmlUrl;
      //    document.getElementById("codeForm").action = "/tiy/v.asp";
      // this.$refs.iframe.method = "post";
      // this.$refs.iframe.acceptCharset = "utf-8";
      // this.$refs.iframe.target = "iframeResult";
      // document.getElementById("codeForm").submit();
      // this.frame =
      //   '<iframe src="' +
      //   this.htmlUrl +
      //   '?aa2" style="width: 100%; height: 500px" ref="iframe"></iframe>';
    },
    showModal() {
      this.visibleEditor = true;
      this.sourceCode = this.queryParam.templateContent;
      // console.log(this.editor.txt.html());
      // this._initialize();
      // this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options);
    },
    handleOk() {
      this.visibleEditor = false;
      // this.queryParam.templateContent = this.sourceCode;
      this.setTemplateContent(this.sourceCode);
      this.editor.txt.html(this.formatSourceCode);
    },
    // submitTryit() {
    //   var form = document.createElement("form");
    //   form.setAttribute("id", "iframeResult");
    //   form.setAttribute("target", "iframeResult");
    //   form.setAttribute("action", this.htmlUrl);
    //   form.submit();
    //   // document.getElementById("iframeResult").submit();
    // },
    // change(value,render){
    //   console.log(value)
    //   console.log(render)
    // }
  },
};
</script>

<style>
.sidebar {
  position: absolute !important;
}

.w-e-toolbar {
  position: unset !important;
}

.w-e-text-container {
  position: unset !important;
}
</style>