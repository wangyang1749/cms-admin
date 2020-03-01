import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import BasicLayout from '@/layout/BasicLayout.vue'
import PageView from '@/layout/PageView.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/user/login.vue'),
  },
  {
    path: '/',
    name: 'Index',
    component: BasicLayout,
    redirect: "/article/list",
    children: [
      {
        path: '/article',
        name: 'Article',
        component: PageView,
        meta: { title: '文章', icon: 'dashboard', hiddenHeaderContent: false, keepAlive: false },
        children: [
          {
            path: '/article/list',
            name: 'ArticleList',
            component: () => import(/* webpackChunkName: "articleList" */ '../views/article/ArticleList.vue'),
            meta: { title: '文章列表', icon: 'dashboard', hiddenHeaderContent: false, keepAlive: false },
          },
          {
            path: '/article/write',
            name: 'ArticleWrite',
            component: () => import(/* webpackChunkName: "articleList" */ '../views/article/ArticleWrite.vue'),
            meta: { title: '写文章' }
          },
          {
            path: '/article/tags',
            name: 'ArticleTags',
            component: () => import(/* webpackChunkName: "ArticleTags" */ '../views/article/ArticleTags.vue'),
            meta: { title: '文章标签' }
          },
          {
            path: '/article/category',
            name: 'ArticleCategory',
            component: () => import(/* webpackChunkName: "ArticleCategory" */ '../views/article/ArticleCategory.vue'),
            meta: { title: '文章分类' }
          },

        ]
      },
      {
        path: '/page',
        name: 'Page',
        component: PageView,
        meta: { title: '页面管理' },
        children: [
          {
            path: '/page/list',
            name: 'PageList',
            component: () => import(/* webpackChunkName: "PageList" */ '../views/page/list.vue'),
            meta: { title: '页面列表' }
          },{
            path: '/page/create',
            name: 'PageCreate',
            component: () => import(/* webpackChunkName: "PageCreate" */ '../views/page/PageCreate.vue'),
            meta: { title: '创建页面' }
          }
        ]
      },
      {
        path: '/template',
        name: 'Template',
        component: PageView,
        meta: { title: '模板管理' },
        children: [
          {
            path: '/template/dynamicList',
            name: 'TemplateDynamicList',
            component: () => import(/* webpackChunkName: "TemplateDynamicList" */ '../views/template/TemplateDynamicList.vue'),
            meta: { title: '动态模板列表' }
          },
          {
            path: '/template/staticList',
            name: 'TemplateStaticList',
            component: () => import(/* webpackChunkName: "TemplateStaticList" */ '../views/template/TemplateStaticList.vue'),
            meta: { title: '组件模板' }
          }, {
            path: '/template/create',
            name: 'TemplateCreate',
            component: () => import(/* webpackChunkName: "TemplateCreate" */ '../views/template/TemplateCreate.vue'),
            meta: { title: '创建模板' }
          }
        ]
      },
      {
        path: '/system',
        name: 'System',
        component: () => import(/* webpackChunkName: "article" */ '../layout/PageView.vue'),
        meta: { title: '系统', icon: 'dashboard', hiddenHeaderContent: false, keepAlive: false },
        children: [
          {
            path: '/system/menu',
            name: 'SystemMenu',
            component: () => import(/* webpackChunkName: "SystemMenu" */ '../views/system/menu.vue'),
            meta: { title: '菜单设置', icon: 'dashboard', hiddenHeaderContent: false, keepAlive: false }

          }, {
            path: '/system/about',
            name: 'About',
            component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
            meta: { title: '系统关于', icon: 'dashboard', hiddenHeaderContent: false, keepAlive: false }
          },
        ]
      }
    ]
  },

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
