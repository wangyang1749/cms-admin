<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider style="z-index:99" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <div class="logo">CMS-SYSTEM</div>

      <a-menu theme="dark" mode="inline" :defaultSelectedKeys="[$route.name]">
        <!-- <a-menu-item  v-for="(item) in routes"  :key="item.name">
          <router-link :to="item.path">
            <a-icon type="user" />
            <span class="nav-text">{{item.meta.title}}</span>
          </router-link>
        </a-menu-item>-->

        <a-sub-menu v-for="(item) in routes" :key="item.name">
          <span slot="title">
            <a-icon type="setting" />
            <span>{{item.meta.title}}</span>
          </span>
          <a-menu-item v-for="(itemSub) in item.children" :key="itemSub.name">
            <router-link :to="itemSub.path">{{itemSub.meta.title}}</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-header :style="{ background: '#fff', padding: 0 }">
        <div :style="{float: 'right'}">
          <a-button @click="logout">退出</a-button>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '24px 5px 0', }">
        <div >
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">Ant Design ©2018 Created by Ant UED</a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import UserApi from "@/api/user.js";
export default {
  computed: {
    routes() {
      return this.$router.options.routes[1].children;
    }
  },
  created() {
    // console.log(this.$route);
  },
  methods: {
    logout() {
      UserApi.logout().then(response => {
        console.log(response);
        this.$router.replace("/login");
      });
      console.log("logout");
    }
  }
};
</script>
<style>
#components-layout-demo-fixed-sider .logo {
  height: 32px;
  margin: 16px;
  color: #fff;
  text-align: center;
  font-size: 1.5rem;
}
</style>
