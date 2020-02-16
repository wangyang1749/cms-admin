import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Button } from 'ant-design-vue';
import { Layout } from 'ant-design-vue';
import { Menu } from 'ant-design-vue';
import { Table } from 'ant-design-vue';
import { Tag } from 'ant-design-vue';
import { Breadcrumb } from 'ant-design-vue';
import { Icon } from 'ant-design-vue';
import { Divider } from 'ant-design-vue';
import { Pagination } from 'ant-design-vue';
Vue.use(Menu);
Vue.use(Layout);
Vue.use(Button);
Vue.use(Table);
Vue.use(Tag);
Vue.use(Breadcrumb);
Vue.use(Icon);
Vue.use(Divider);
Vue.use(Pagination);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
