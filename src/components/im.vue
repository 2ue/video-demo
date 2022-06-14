<template>
  <div class="tim-container">
    <p style="margin-bottom: 10px">聊天室</p>
    <div ref="messages" class="message-list">
      <div v-for="message in messageList" :key="message.sequence" class="message-item">
        <el-row>
          <el-col :span="3">
            <div class="avatar-container">
              <span class="avatar-image">U</span>
              <p class="avatar-user">{{ message.from }}</p>
            </div>
          </el-col>
          <el-col :span="21">
            <div class="message-time">{{ message.time | getTime }}</div>
            <div class="grid-content bg-purple-dark">{{message | getText }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="padding-bottom: 100px">
      <el-input v-model="messageText" type="textarea" name="" id="" cols="20" rows="8"></el-input>
    </div>
    <div style="position: fixed;width: 80%; max-width: 1320px;bottom: 0;left: 0;margin: 0 10%; padding: 20px 0;background: #fff">
      <el-button type="primary" @click="send">发送</el-button>
      <span style="font-size: 12px;color: #999;margin-left: 20px;">点击此处发送消息</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import tim from './mixins/tim';
import dayjs from 'dayjs';

export default {
  mixins: [tim],
  filters: {
    getText(message) {
      console.log('message', message);
      if (message.payload.data === 'group_create') {
        return '创建会议成功';
      }
      return message.payload.text;
    },
    getTime(value) {
      return dayjs.unix(value).format('YYYY-MM-DD HH:MM:ss');
    },
  },
  data() {
    return {
      // messageList: [],
      messageText: '',
    };
  },
  computed: {
    ...mapState({
      messageList: state => state.tim.messageList.sort((m1, m2) => m1.sequence - m2.sequence),
    }),
    // messageItems() {
    //   console.log('xxxxxx333333==>', this.messageList);
    //   // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    //   return this.messageList.sort((m1, m2) => m1.sequence - m2.sequence);
    // },
  },
  created() {
    // this.messageList = this.getMessageList();
  },
  mounted() {
    this.getMessageList();
    this.scrollToBottom();
  },
  beforeDestroy() {
    this.$store.commit('tim/setMessageList', []);
  },
  methods: {
    scrollToBottom(scrollHeight) {
      let height = scrollHeight;
      if (!height) height = this.$refs.messages.scrollHeight;
      setTimeout(() => {
        this.$refs.messages.scrollTop = height;
      }, 300);
    },
    send() {
      if (!this.messageText) return;
      // console.log('this====>', this.messageListii, this.messageList);
      this.sendMessage(this.messageText);
      this.messageText = '';
      this.scrollToBottom();
    },
  },
};
</script>
<style scoped>
.avatar-container {
  width: 80px;
  text-align: center;
  font-size: 12px;
}
.avatar-image{
  display: inline-block;
  width: 40px;
  height: 40px;
  background: #0D6EFD;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  color: #fff;
}
.message-item {
  margin-bottom: 30px;
}
.message-list {
  border: 1px solid #000;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
}
</style>
