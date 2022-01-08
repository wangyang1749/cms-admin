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
    <a-button @click="run">运行</a-button>
    {{ htmlUrl }}
    <form
      style="display: none"
      ref="runForm"
      :action="htmlUrl"
      method="POST"
      target="iframeResult"
    >
      <textarea type="text" name="name" v-model="queryParam.name" />
      <textarea type="text" name="enName" v-model="queryParam.enName" />
      <textarea
        type="text"
        name="templateValue"
        v-model="queryParam.templateValue"
      />
      <textarea
        type="text"
        name="templateType"
        v-model="queryParam.templateType"
      />
      <textarea
        type="text"
        name="templateContent"
        v-model="queryParam.templateContent"
      />
    </form>

    <a-row>
      <a-col :span="12">
        <!-- <a-textarea
          v-model="queryParam.templateContent"
          placeholder="Autosize height based on content lines"
          autosize
        /> -->
        <textarea ref="textarea"></textarea>
      </a-col>
      <a-col :span="12">
        <iframe
          name="iframeResult"
          style="width: 100%; height: 500px"
          ref="iframe"
        ></iframe>
      </a-col>
    </a-row>
    <!-- <div id="div1">
    </div> -->
    <!-- <textarea
      id="editor"
      name="editor"
      rows="5"
      style="display: block"
      v-model="queryParam.templateContent"
    ></textarea> -->
    <!-- <mavon-editor
      v-model="queryParam.templateContent"
      ref="md"
      style="min-height: 600px; z-index: 1"
      @imgAdd="imgAdd"
      @imgDel="imgDel"
    /> -->
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
      },
      id: null,
      isUpdate: false,
      templateType: [],

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
      // 支持切换的语法高亮类型，对应 JS 已经提前引入
      // 使用的是 MIME-TYPE ，不过作为前缀的 text/ 在后面指定时写死了
      modes: [
        {
          value: "css",
          label: "CSS",
        },
        {
          value: "javascript",
          label: "Javascript",
        },
        {
          value: "html",
          label: "XML/HTML",
        },
        {
          value: "x-java",
          label: "Java",
        },
        {
          value: "x-objectivec",
          label: "Objective-C",
        },
        {
          value: "x-python",
          label: "Python",
        },
        {
          value: "x-rsrc",
          label: "R",
        },
        {
          value: "x-sh",
          label: "Shell",
        },
        {
          value: "x-sql",
          label: "SQL",
        },
        {
          value: "x-swift",
          label: "Swift",
        },
        {
          value: "x-vue",
          label: "Vue",
        },
        {
          value: "markdown",
          label: "Markdown",
        },
      ],
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
    
  },
  mounted() {
    enumApi.list("TemplateType").then((resp) => {
      // console.log(resp.data.data);
      this.templateType = resp.data.data;
    });

    // const E = window.wangEditor;
    // this.editor = new E("#div1");
    // // const $text1 = $("#text1");
    // this.editor.config.onchange = function () {
    //   // 第二步，监控变化，同步更新到 textarea
    //   // $text1.val(html);
    // };
    // this.editor.create();

    this._initialize();
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
          // console.log(vm.editor)
          vm.coder.setValue(vm.queryParam.templateContent);
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
    submit() {
      if (this.isUpdate) {
        templateApi.update(this.id, this.queryParam).then((resp) => {
          this.$notification["success"]({
            message: "更新模板[" + resp.data.data.name + "]成功",
          });
        });
      } else {
        // console.log(this.queryParam)
        templateApi.add(this.queryParam).then((resp) => {
          this.$notification["success"]({
            message: "添加模板[" + resp.data.data.name + "]成功",
          });
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
    imgDel() {},
    _initialize() {
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options);
      // 编辑器赋值
      // this.coder.setValue(this.value || this.code);

      // 支持双向绑定
      this.coder.on("change", (coder) => {
        this.queryParam.templateContent = coder.getValue();
        // console.log(this.queryParam.templateContent)
        if (this.$emit) {
          this.$emit("input", this.queryParam.templateContent);
        }
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
</style>