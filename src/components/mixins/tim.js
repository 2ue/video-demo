import TIM from 'tim-js-sdk';
import { mapState } from 'vuex';
// import { genGroupId } from '@/utils/utils';
// import this.$store from '@/this.$store';

const GROUP_TYPE = TIM.TYPES.GRP_MEETING;

// let timer = null;

export default {
  data() {
    return {
      nextReqMessageID: null,
      isCompleted: false,
      isCreating: false,
      roomId2: '',
    };
  },
  computed: {
    ...mapState({
      groupId: state => state.tim.groupId,
      sdkIsReady: state => state.tim.sdkIsReady,
    }),
  },
  // watch: {
  //   sdkIsReady: {
  //     immediate: true,
  //     handler(value) {
  //       if (value) {
  //         console.log('watch SDK===>', value, this.groupId, this.isCreating);
  //         if (!this.groupId && !this.isCreating) {
  //           console.log('start ===createGroup');
  //           this.isCreating = true;
  //           this.createGroup();
  //         } else {
  //           this.joinGroup(this.groupId);
  //         }
  //       }
  //     },
  //   },
  // },
  methods: {
    initTIM(roomId) {
      this.roomId2 = roomId;
      console.log('xxx roomID==>', roomId);
      this.login();
      this.initTIMEvents();
    },
    initTIMEvents() {
      window.$tim.on(TIM.EVENT.SDK_READY, this.sdkReady);
      window.$tim.on(TIM.EVENT.SDK_NOT_READY, this.sdkNotReady);
      window.$tim.on(TIM.EVENT.KICKED_OUT, this.kickedOut);
      window.$tim.on(TIM.EVENT.ERROR, this.sdkError);
      window.$tim.on(TIM.EVENT.NET_STATE_CHANGE, this.netStateChange);
    },
    sdkReady() {
      this.$store.commit('tim/updateSdkIsReady', true);
      if (!this.groupId && !this.isCreating) {
        console.log('start ===createGroup');
        this.createGroup();
      } else {
        this.joinGroup(this.groupId);
      }
      window.$tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, this.conversationListUpdate);
      window.$tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.messageReceived);
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
      console.log('TIM.EVENT.CONVERSATION_LIST_UPDATED', this.groupId, event);
      const list = event.data;
      const group = list.find(c => `${c.conversationID.replace(c.type, '')}` === this.groupId) || {};
      this.$store.commit('tim/updateGroupInfo', group);
      if (group.conversationID) {
        this.getMessageList(group.conversationID.replace(group.type, ''));
        // this.scrollToBottom();
      }
    },
    messageReceived(event) {
      console.log('TIM.EVENT.MESSAGE_RECEIVED', event);
      const list = event.data.filter(d => !d.payload?.notice && d.conversationID.replace(d.type, '') === this.groupId);
      this.$store.commit('tim/updateMessageList', list);
    },
    async login() {
      await window.$tim.login({
        userID: this.userId,
        userSig: this.userSig,
      });
    },
    logout() {},
    createGroup() {
      if (!this.sdkIsReady || this.isCreating) return;
      console.log('xgggggggggggg==>', this.isCreating);
      this.isCreating = true;
      const promise = window.$tim.createGroup({
        type: GROUP_TYPE,
        name: 'MEETING',
      });
      promise.then((imResponse) => { // 创建成功
        const group = imResponse?.data?.group || {};
        console.log('create group', group); // 创建的群的资料
        this.$store.commit('tim/updateGroupId', group.groupID);
        this.$store.dispatch('remoteStore/updateRemoteStore', {
          roomId: this.roomId2,
          groupId: group.groupID,
          groupOwnerId: this.userId,
        });
      }).catch((imError) => {
        console.warn('createGroup error:', imError); // 创建群组失败的相关信息
      });
      this.isCreating = false;
    },
    joinGroup() {
      console.log('xxxxxxxxx========>', 22222);
      const promise = window.$tim.joinGroup({ groupID: this.groupId, type: GROUP_TYPE });
      promise.then((imResponse) => {
        console.log('xxxxxxxxx========>', imResponse);
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
    dismissGroup(roomId) {
      const promise = window.$tim.dismissGroup(this.groupId);
      promise.then((imResponse) => { // 解散成功
        console.log(imResponse.data.groupID); // 被解散的群组 ID
      }).catch((imError) => {
        console.warn('dismissGroup error:', imError); // 解散群组失败的相关信息
      });
      if (roomId) {
        this.$store.state.remoteStore.persistence.set(`yf_${roomId}`, { status: 'off' });
      }
    },
    quitGroup() {
      const promise = window.$tim.quitGroup(this.groupId);
      promise.then((imResponse) => { // 退出成功
        console.log(imResponse.data.groupID);
        this.$localstorage.removeItem('groupId');
      }).catch((imError) => {
        console.warn('quitGroup error:', imError);
      });
    },
    sendMessage(text) {
      console.log('sendMessage', text);
      const message = window.$tim.createTextMessage({
        to: this.groupId,
        conversationType: TIM.TYPES.CONV_GROUP,
        payload: {
          text,
        },
      });
      window.$tim.sendMessage(message).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$store.commit('tim/updateMessageList', [res.data.message]);
        } else {
          this.$alert('发送失败', '提示');
        }
      });
    },
    getMessageList(groupId) {
      const promise = window.$tim.getMessageList({ conversationID: `GROUP${groupId || this.groupId}`, count: 15 });
      promise.then((imResponse) => {
        const { messageList, nextReqMessageID, isCompleted } = imResponse.data; // 消息列表。
        // const {nextReqMessageID} = imResponse.data; // 用于续拉，分页续拉时需传入该字段。
        // const {isCompleted} = imResponse.data; // 表示是否已经拉完所有消息。isCompleted 为 true 时，nextReqMessageID 为 ""。
        // console.log('messageList', messageList);
        // console.log('nextReqMessageID', nextReqMessageID);
        // console.log('isCompleted', isCompleted);
        this.nextReqMessageID = nextReqMessageID;
        this.isCompleted = isCompleted;
        this.$store.commit('tim/setMessageList', messageList);
      });
    },
    sendNotice(value) {
      // console.log('===>', value, this.groupId);
      const message = window.$tim.createCustomMessage({
        to: this.groupId,
        conversationType: TIM.TYPES.CONV_GROUP,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        // priority: TIM.TYPES.MSG_PRIORITY_HIGH,
        payload: {
          notice: true,
          ...value,
        },
      });
      const promise = window.$tim.sendMessage(message);
      promise.then((imResponse) => {
        // 发送成功
        console.log(imResponse);
      }).catch((imError) => {
        // 发送失败
        console.warn('sendMessage error:', imError);
      });
    },
  },
};
