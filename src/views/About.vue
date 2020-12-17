<template>
  <div>
    <button @click="initialize">初始化系统</button>
  </div>
</template>
<script>
import optionApi from "@/api/option.js";

export default {

  methods: {
    initialize() {
      optionApi.initialize().then(response => {
        // console.log(response)
        this.$notification["success"]({
          message: "操作" + response.data
        });
      });
    }
  }
};
</script>