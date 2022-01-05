<template>
  <div class="container-wrapper">
    <a-card title="欢迎登录cms系统">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="用户名">
          <a-input
            v-model="user.username"
            placeholder="Please input your name"
          ></a-input>
        </a-form-item>
        <a-form-item label="用户密码">
          <a-input
            v-model="user.password"
            placeholder="Please input your password"
            type="password"
            autocomplete
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="submit">登录</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import UserApi from "@/api/user.js";
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      form: this.$form.createForm(this, { name: "horizontal_login" }),
    };
  },
  created() {
    var token = localStorage.getItem("Authorization");
    if (token != null) {
      this.$router.replace("/article/list");
    }
  },
  methods: {
    submit() {

      // console.log(this.user);
      UserApi.login(this.user).then((response) => {
        this.$message.success("登录成功!!" + response.data.message);
        // console.log(response);
        // console.log(response.data.data.id_token);
        let token  = response.data.data.token
        localStorage.setItem("Authorization", token);
        this.$cookies.set("Authorization", token);
        UserApi.getCurrentUser().then(response => {
          // console.log(response);
          localStorage.setItem("user", JSON.stringify(response.data.data));
          this.$store.state.user = JSON.stringify(response.data.data)
          this.$router.replace("/article/list");
        });
      });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          UserApi.login(values).then((response) => {
            this.$message.success("登录成功!!" + response.data.message);

            // localStorage.setItem('Authorization', str);
            // console.log(response)
            // this.$router.replace("/article/list")
          });
          // console.log(values)
        }
      });
    },
  },
};
</script>
<style >
.container-wrapper {
  width: 30rem;
  margin: 5rem auto;
}
</style>