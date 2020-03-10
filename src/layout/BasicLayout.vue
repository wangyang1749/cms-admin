<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">  
      <a-layout-sider
      collapsible
      v-model="collapsed"
    >
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

    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }">
        <div :style="{float: 'right'}">
          <a-button @click="openHtml()">静态首页</a-button>
          <a-button @click="logout">退出</a-button>
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">©2020 WNAGYANG</a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import UserApi from "@/api/user.js";
import preview from "@/api/preview.js";
export default {
  data(){
    return {
      collapsed: false,
    }
  },
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
        this.$message.error(response.data.message)
        this.$router.replace("/login");
      });
     // console.log("logout");
    },
    openHtml() {
      window.open(preview.Html("index"), "_blank");
    }
  }
};
</script>
<style>
#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255,255,255,.2);
  margin: 16px;
}
</style>