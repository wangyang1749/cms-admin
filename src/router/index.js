import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import BasicLayout from '@/layout/BasicLayout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: ()=>import(/* webpackChunkName: "login" */ '../views/user/login.vue'),
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
        component: () => import(/* webpackChunkName: "article" */ '../layout/PageView.vue'),
        meta: { title: '文章', icon: 'dashboard', hiddenHeaderContent: false, keepAlive: false },
        children: [
          {
            path: '/article/list',
            name: 'ArticleList',
            component: () => import(/* webpackChunkName: "articleList" */ '../views/article/ArticleList.vue'),
            meta: { title: '文章列表', icon: 'dashboard', hiddenHeaderContent: false, keepAlive: false },
          },
          {
            path:'/article/write',
            name:'ArticleWrite',
            component:()=>import(/* webpackChunkName: "articleList" */ '../views/article/ArticleWrite.vue'),
            meta:{title:'写文章'}
          },
          {
            path: '/article/about',
            name: 'About',
            component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
            meta: { title: '文章关于', icon: 'dashboard', hiddenHeaderContent: false, keepAlive: false }
          },
        ]
      }, {
        path: '/system',
        name: 'System',
        component: () => import(/* webpackChunkName: "article" */ '../layout/PageView.vue'),
        meta: { title: '系统', icon: 'dashboard', hiddenHeaderContent: false, keepAlive: false },
        children: [
          {
            path: '/system/home',
            name: 'SystemHome',
            component:Home,
            meta: { title: '系统Home', icon: 'dashboard', hiddenHeaderContent: false, keepAlive: false }

          }
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
