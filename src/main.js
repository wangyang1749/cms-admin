import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Golbal from '@/api/global_variable.js'

import { Button } from 'ant-design-vue';
import { Layout } from 'ant-design-vue';
import { Menu } from 'ant-design-vue';
import { Table } from 'ant-design-vue';
import { Tag } from 'ant-design-vue';
import { Breadcrumb } from 'ant-design-vue';
import { Icon } from 'ant-design-vue';
import { Divider } from 'ant-design-vue';
import { Pagination } from 'ant-design-vue';
import { Form } from 'ant-design-vue';
import { Input } from 'ant-design-vue';
import { Card } from 'ant-design-vue';
import { Drawer } from 'ant-design-vue';
import { Select } from 'ant-design-vue';
import { Tree } from 'ant-design-vue';
import { Radio } from 'ant-design-vue';
import { message } from 'ant-design-vue';
// import { confirm } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import { notification } from 'ant-design-vue';
import { Upload } from 'ant-design-vue';
import { Tabs } from 'ant-design-vue';
import { Switch } from 'ant-design-vue';
import { InputNumber } from 'ant-design-vue';
import { Dropdown } from 'ant-design-vue';
import { Avatar } from 'ant-design-vue';
import { List } from 'ant-design-vue';

import { Row } from 'ant-design-vue';
import { Col ,Checkbox} from 'ant-design-vue';
import VueCookies from 'vue-cookies'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import { Comment,Descriptions,Badge,FormModel,DatePicker,Tooltip} from 'ant-design-vue';
Vue.use(Comment);
Vue.use(Descriptions);
Vue.use(Badge);
Vue.use(FormModel);
Vue.use(DatePicker);
Vue.use(Tooltip);

Vue.use(VueCookies)

Vue.use(Menu);
Vue.use(Layout);
Vue.use(Button);
Vue.use(Table);
Vue.use(Tag);
Vue.use(Breadcrumb);
Vue.use(Icon);
Vue.use(Divider);
Vue.use(Pagination);
Vue.use(Form);
Vue.use(Input)
Vue.use(Card);
Vue.use(Drawer);
Vue.use(Select);
Vue.use(Tree);
Vue.use(Radio);
Vue.use(Modal);
Vue.use(Upload);
Vue.use(Tabs);
Vue.use(Switch);
Vue.use(InputNumber);
Vue.use(Dropdown);
Vue.use(Avatar);
Vue.use(List);
Vue.use(Row);
Vue.use(Col);
Vue.use(Checkbox);

Vue.prototype.$Golbal = Golbal;
Vue.prototype.$notification = notification;
Vue.config.productionTip = false
Vue.prototype.$message = message;
Vue.prototype.$confirm = Modal.confirm;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')
