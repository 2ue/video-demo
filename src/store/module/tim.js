// const localstorage = window.store;

export default {
  namespaced: true,
  state: {
    sdkIsReady: false,
    groupId: '',
    group: {},
    groupOwnerId: '',
    messageList: [],
    profile: {},
  },
  mutations: {
    updateGroupId(state, value) {
      state.groupId = value;
      // console.log('xxx updateGroupId===>', value);
      // localstorage.setItem('groupId', value);
    },
    updateProfile(state, value) {
      state.profile = value;
      state.groupOwnerId = value.groupOwnerId;
    },
    updateSdkIsReady(state, value) {
      // console.log('xxx updateSdkIsReady===>', value);
      state.sdkIsReady = value;
    },
    updateGroupInfo(state, value) {
      // console.log('xxx updateGroupInfo===>', value);
      state.group = value;
      state.groupOwnerId = value?.groupProfile?.ownerID || '';
    },
    setMessageList(state, value) {
      state.messageList = value;
    },
    updateMessageList(state, value) {
      // console.log('xxxxxeeupdate===>', JSON.parse(JSON.stringify(state.messageList)));
      state.messageList.push(...value);
      // console.log('xxxxxeeupdate===>', JSON.parse(JSON.stringify(state.messageList)));
    },
  },
};
