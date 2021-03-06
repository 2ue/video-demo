/*
 * @Description: 全局样式
 * @Date: 2022-03-09 16:42:16
 * @LastEditTime: 2022-03-29 16:36:04
 */
import './utils/store';
import Vue from 'vue';
import App from './App.vue';

import '@/utils/aegis.js';

import '@/assets/style/global.css';
import '@/assets/icons';
import '@/assets/style/theme/index.css';
import { isMobile } from '@/utils/utils';
import tim from '@/utils/tim';
import store from './store';

import {
  Collapse,
  CollapseItem,
  Select,
  Option,
  Input,
  Button,
  Message,
  MessageBox,
  Tooltip,
  Alert,
  Form,
  FormItem,
  Row,
  Col,
} from 'element-ui';

import router from './router';
import i18n from './locales/i18n';

/**
 *  重写ElementUI的Message
 */
const showMessage = Symbol('showMessage');
class DonMessage {
  success(options, single = true) {
    this[showMessage]('success', options, single);
  }
  warning(options, single = true) {
    this[showMessage]('warning', options, single);
  }
  info(options, single = true) {
    this[showMessage]('info', options, single);
  }
  error(options, single = true) {
    this[showMessage]('error', options, single);
  }
  [showMessage](type, options) {
    Message[type](options);
  }
}
Vue.use(tim);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(Button);
Vue.use(Tooltip);
Vue.use(Alert);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Col);
Vue.use(Row);
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = new DonMessage();
Vue.prototype.$isMobile = isMobile;
console.log('window.store===>', window.store);
Vue.prototype.$localstorage = window.store;

Vue.config.productionTip = false;

document.title = i18n.t('title');

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
