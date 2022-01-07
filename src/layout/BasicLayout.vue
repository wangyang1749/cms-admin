<template>
  <a-layout id="components-layout-demo-top-side">
    <a-layout-header>
      <div class="logo" />
      <div>
        <a-menu
          v-model="current"
          mode="horizontal"
          theme="dark"
          :style="{ lineHeight: '64px' }"
        >
          <!-- <a-menu-item key="mail">
        <a-icon type="mail" />Navigation One
      </a-menu-item>
      <a-menu-item key="app" disabled>
        <a-icon type="appstore" />Navigation Two
      </a-menu-item> -->

          <a-sub-menu v-for="item in routes" :key="item.name">
            <span slot="title" class="submenu-title-wrapper">
              <a-icon type="setting" /> {{ item.meta.title }}
            </span>
            <a-menu-item v-for="itemSub in item.children" :key="itemSub.name">
              <router-link :to="itemSub.path">{{
                itemSub.meta.title
              }}</router-link>
            </a-menu-item>
            <!-- <a-menu-item-group title="Item 1">
          <a-menu-item key="setting:1"> Option 1 </a-menu-item>
          <a-menu-item key="setting:2"> Option 2 </a-menu-item>
        </a-menu-item-group>
        <a-menu-item-group title="Item 2">
          <a-menu-item key="setting:3"> Option 3 </a-menu-item>
          <a-menu-item key="setting:4"> Option 4 </a-menu-item>
        </a-menu-item-group> -->
          </a-sub-menu>

          <!-- <a-menu-item key="alipay">
        <a href="https://antdv.com" target="_blank" rel="noopener noreferrer"
          >Navigation Four - Link</a
        >
      </a-menu-item> -->
        </a-menu>
      </div>

      <div>
        <a-button @click="openHtml()">静态首页</a-button>
        <!-- <a-button @click="logout">退出</a-button> -->

        <a-dropdown style="margin-right: 20px">
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            <a-avatar :size="40" :src="user.avatar" />
          </a>
          <a-menu slot="overlay">
            <!-- <a-menu-item>
                <a href="javascript:;" >1st menu item</a>
              </a-menu-item>-->
            <a-menu-item>
              <a href="javascript:;">用户详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="logout">退出</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-layout-header>

    <!-- <a-layout-sider collapsible v-model="collapsed" style="z-index: 99">
      <div class="logo">CMS-SYSTEM</div>

      <a-menu theme="dark" mode="inline" :defaultSelectedKeys="[$route.name]">
        <a-sub-menu v-for="item in routes" :key="item.name">
          <span slot="title">
            <a-icon type="setting" />
            <span>{{ item.meta.title }}</span>
          </span>
          <a-menu-item v-for="itemSub in item.children" :key="itemSub.name">
            <router-link :to="itemSub.path">{{itemSub.meta.title}}</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider> -->

    <a-layout>
      <!-- <a-layout-header :style="{ background: '#fff', padding: 0 }">
      
      </a-layout-header> -->
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <!-- <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item> -->
        </a-breadcrumb>
        <div
          :style="{ padding: '24px', background: '#fff', minHeight: '360px' }"
        >
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }"
        >©2020 WNAGYANG</a-layout-footer
      >
    </a-layout>
  </a-layout>
</template>
<script>
// import UserApi from "@/api/user.js";
import preview from "@/api/preview.js";
import Vue from "vue";
export default {
  data() {
    return {
      collapsed: false,
      user: {
        avatar: "",
      },
      current: ["mail"],
    };
  },
  computed: {
    routes() {
      return this.$router.options.routes[1].children;
    },
  },
  created() {
    // console.log(this.$store.state)
    // console.log(this.routes)

    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      Vue.prototype.$user = user;
      this.user = user;
    }
    // this.user = JSON.parse(localStorage.getItem("user"));

    // console.log(this.user)
  },
  methods: {
    logout() {
      localStorage.removeItem("Authorization");
      this.$cookies.remove("Authorization");
      localStorage.removeItem("user");
      this.$router.replace("/login");
      // UserApi.logout().then(response => {
      //   this.$message.error(response.data.message)
      //   this.$router.replace("/login");
      // });
      // console.log("logout");
    },
    openHtml() {
      window.open(preview.Html("/"), "_blank");
    },
  },
};
</script>
<style>
#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>