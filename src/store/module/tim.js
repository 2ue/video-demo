const localstorage = window.store;

export default {
  namespaced: true,
  state: {
    sdkIsReady: false,
    groupId: localstorage.getItem('groupId') || '',
    group: {},
  },
  mutations: {
    updateGroupId(state, value) {
      state.groupId = value;
      console.log('xxx updateGroupId===>', value);
      localstorage.setItem('groupId', value);
    },
    updateSdkIsReady(state, value) {
      console.log('xxx updateSdkIsReady===>', value);
      state.sdkIsReady = value;
    },
  },
};
