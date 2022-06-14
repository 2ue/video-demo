// import Vue from 'vue';
import TIM from 'tim-js-sdk';
import store from '@/store';
// import LibGenerateTestUserSig from '@/utils/lib-generate-test-usersig.min.js';

export default {
  install(Vue) {
    console.log('store==>', store.state);
    const tim = TIM.create({
      SDKAppID: store.state.sdkAppId,
    });
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$tim = tim;
    window.$tim = tim;
    console.log('Vue.TIM==>', Vue.TIM);
  },
};

