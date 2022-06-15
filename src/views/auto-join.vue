<template>
  <div class="invite-container">
    <comp-nav></comp-nav>
    <div
      v-if="loadProfile" class="content" :class="$isMobile && 'content-mobile'">
      <!-- rtc 房间 -->
      <comp-room
        ref="room"
        type="invite"
        :sdkAppId="Number(sdkAppId)"
        :inviteUserSig="userSig"
        :userId="userId"
        :roomId="Number(roomId)"
        :secretKey="secretKey"
        :manual-enter="true"
        @mounted="roomIsReady = true"
      />
    </div>
  </div>
</template>

<script>
import compNav from '@/components/comp-nav.vue';
import CompRoom from '@/components/comp-room.vue';
import { getUrlParam } from '@/utils/utils.js';
import { mapState } from 'vuex';
import {MessageBox} from "element-ui";

export default {
  data() {
    return {
      sdkAppId: 0,
      userSig: '',
      userId: '',
      roomId: 0,
      roomIsReady: false,
      joined: false,
      loadProfile: false,
    };
  },
  computed: {
    ...mapState({
      secretKey: state => state.secretKey,
    }),
  },
  components: {
    compNav,
    CompRoom,
  },
  created() {
    this.sdkAppId = Number(getUrlParam('sdkAppId'));
    this.userSig = getUrlParam('userSig');
    this.userId = this.$store.state.userId;
    this.roomId = Number(getUrlParam('roomId'));
    console.log('xxxx===>', this.sdkAppId, this.userSig, this.userId, this.roomId);
    // clearUrlParam();
    this.$store.state.remoteStore.persistence.get(`yf_${this.roomId}`).then((res) => {
      this.$store.commit('tim/updateGroupId', res.data?.groupId);
      this.$store.commit('tim/updateProfile', res?.data || {});
      // console.log('this.roomIdthis.roomI==>', this.roomId);
      if (res?.data?.status === 'off') {
        this.$alert('会议已结束');
        MessageBox('会议已结束', '提示', {
          confirmButtonText: '确定',
          showCancelButtonText: false,
          showClose: false,
          type: 'warning',
          beforeClose: () => {
            this.$router.push('/');
          },
        })
          .then(() => {
            this.$router.push('/');
          })
          .catch(() => {
            this.$router.push('/');
          });
        return;
      }
      this.loadProfile = true;
    });
  },
  watch: {
    roomIsReady: {
      immediate: true,
      handler(value) {
        if (value && !this.joined) {
          this.$refs.room && this.$refs.room.handleJoinRoom('auto');
          this.joined = true;
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
 .content {
    width: 80%;
    margin: 0 auto;
    //max-width: 1320px;
    padding-top: 30px;
    &.content-mobile {
      width: 100%;
      padding: 30px 16px 20px;
    }
    .invite-tips {
      width: 100%;
      height: 60px;
      color: #084298;
      background-color: #cfe2ff;
      position: relative;
      padding: 1rem 1rem;
      margin-bottom: 1rem;
      border: 1px solid #b6d4fe;
      border-radius: 0.25rem;
    }
 }
</style>
