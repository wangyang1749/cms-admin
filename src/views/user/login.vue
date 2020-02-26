<template>
  <div class="container-wrapper">
    <a-card title="欢迎登录cms系统">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="用户名">
          <a-input
            v-decorator="[
            'username',
            { rules: [{ required: true, message: 'Please input your username!' }] },
            ]"
            placeholder="Please input your name"
          ></a-input>
        </a-form-item>
        <a-form-item label="用户密码">
          <a-input
            v-decorator="[
                'password',
                { rules: [{ required: true, message: 'Please input your Password!' }] },
                ]"
            placeholder="Please input your password"
            type="password"
            autocomplete
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">登录</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import UserApi from '@/api/user.js'
export default {
  data() {
    return {
      model: {},
      form: this.$form.createForm(this, { name: "horizontal_login" })
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values)  => {
        if (!err) {
          UserApi.login(values).then(response=>{
            this.$message.success("登录成功!!"+response.data.message);
            // console.log(response)
            this.$router.replace("/article/list")
          });
            // console.log(values)
        }
      });
    }
  }
};
</script>
<style >
.container-wrapper {
  width: 30rem;
  margin: 5rem auto;
}
</style>