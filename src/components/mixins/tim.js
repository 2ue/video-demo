import TIM from 'tim-js-sdk';
import { mapState } from 'vuex';
// import this.$store from '@/this.$store';

const GROUP_TYPE = TIM.TYPES.GRP_MEETING;

export default {
  data() {
    return {
      nextReqMessageID: null,
      isCompleted: false,
      messageList: [],
    };
  },
  computed: {
    ...mapState({
      groupId: state => state.tim.groupId,
      sdkIsReady: state => state.tim.sdkIsReady,
    }),
  },
  watch: {
    sdkIsReady: {
      immediate: true,
      handler(value) {
        if (value) {
          // console.log('watch SDK===>', value, this.groupId);
          if (!this.groupId) {
            this.createGroup();
          } else {
            this.joinGroup(this.groupId);
          }
        }
      },
    },
  },
  methods: {
    initTIM() {
      this.login();
      this.initTIMEvents();
    },
    initTIMEvents() {
      window.$tim.on(TIM.EVENT.SDK_READY, this.sdkReady);
      window.$tim.on(TIM.EVENT.SDK_NOT_READY, this.sdkNotReady);
      window.$tim.on(TIM.EVENT.KICKED_OUT, this.kickedOut);
      window.$tim.on(TIM.EVENT.ERROR, this.sdkError);
      window.$tim.on(TIM.EVENT.NET_STATE_CHANGE, this.netStateChange);
      window.$tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, this.conversationListUpdate);
      window.$tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.messageReceived);
    },
    sdkReady() {
      this.$store.commit('tim/updateSdkIsReady', true);
    },
    sdkNotReady(event) {
      console.log('TIM.EVENT.SDK_NOT_READY', event);
      this.$store.commit('tim/updateSdkIsReady', false);
    },
    kickedOut() {
      console.log('你已被踢出了');
    },
    sdkError(event) {
      console.log('TIM.EVENT.ERROR', event);
    },
    netStateChange(event) {
      console.log('TIM.EVENT.NET_STATE_CHANGE', event);
    },
    conversationListUpdate(event) {
      console.log('TIM.EVENT.CONVERSATION_LIST_UPDATED', event);
      const list = event.data;
      const group = list.find(c => `${c.conversationID.replace(c.type, '')}` === this.groupId) || {};
      this.$store.commit('tim/updateGroupInfo', group);
    },
    messageReceived(event) {
      console.log('TIM.EVENT.MESSAGE_RECEIVED', event);
    },
    async login() {
      await window.$tim.login({
        userID: this.userId,
        userSig: this.userSig,
      });
    },
    logout() {},
    createGroup() {
      const promise = window.$tim.createGroup({
        type: GROUP_TYPE,
        name: 'MEETING',
      });
      promise.then((imResponse) => { // 创建成功
        const group = imResponse?.data?.group || {};
        console.log('create group', group); // 创建的群的资料
        this.$store.commit('tim/updateGroupId', group.groupID);
      }).catch((imError) => {
        console.warn('createGroup error:', imError); // 创建群组失败的相关信息
      });
    },
    joinGroup() {
      const promise = window.$tim.joinGroup({ groupID: this.groupId, type: GROUP_TYPE });
      promise.then((imResponse) => {
        switch (imResponse.data.status) {
          case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
            break;
          case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
            console.log(imResponse.data.group); // 加入的群组资料
            break;
          case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
            break;
          default:
            break;
        }
      }).catch((imError) => {
        console.warn('joinGroup error:', imError); // 申请加群失败的相关信息
      });
    },
    dismissGroup() {
      const promise = window.$tim.dismissGroup(this.groupId);
      promise.then((imResponse) => { // 解散成功
        console.log(imResponse.data.groupID); // 被解散的群组 ID
      }).catch((imError) => {
        console.warn('dismissGroup error:', imError); // 解散群组失败的相关信息
      });
    },
    quitGroup() {
      const promise = window.$tim.quitGroup(this.groupId);
      promise.then((imResponse) => { // 退出成功
        console.log(imResponse.data.groupID);
      }).catch((imError) => {
        console.warn('quitGroup error:', imError);
      });
    },
    sendMessage(text) {
      console.log('sendMessage', text);
      const message = window.$tim.createTextMessage({
        to: this.groupId,
        conversationType: 'GROUP',
        payload: {
          text,
        },
      });
      window.$tim.sendMessage(message).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.messageList.push(res.data.message);
        } else {
          this.$alert('发送失败', '提示');
        }
      });
    },
    getMessageList() {
      const promise = window.$tim.getMessageList({ conversationID: `GROUP${this.groupId}`, count: 15 });
      promise.then((imResponse) => {
        const { messageList, nextReqMessageID, isCompleted } = imResponse.data; // 消息列表。
        // const {nextReqMessageID} = imResponse.data; // 用于续拉，分页续拉时需传入该字段。
        // const {isCompleted} = imResponse.data; // 表示是否已经拉完所有消息。isCompleted 为 true 时，nextReqMessageID 为 ""。
        console.log('messageList', messageList);
        console.log('nextReqMessageID', nextReqMessageID);
        console.log('isCompleted', isCompleted);
        this.nextReqMessageID = nextReqMessageID;
        this.isCompleted = isCompleted;
        this.messageList = messageList;
      });
    },
  },
};