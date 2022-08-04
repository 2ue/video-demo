<!--
 * @Description: 房间显示
 * @Date: 2022-03-16 17:40:28
 * @LastEditTime: 2022-03-29 16:13:06
-->
<template>
  <div class="rtc-container">
    <p>会议ID：{{ roomId }}</p>
    <div>
      <DeviceSelect deviceType="camera" @change="changeCamera"></DeviceSelect>
      <DeviceSelect deviceType="microphone" @change="changeMicrophone"></DeviceSelect>
      <DeviceSelect deviceType="speaker" @change="changeSpeaker"></DeviceSelect>
    </div>
    <!-- 进房操作区域 -->
    <div v-if="!manualEnter" class="control-container">
      <div class="rtc-control-container">
        <el-button
          class="button"
          type="primary"
          size="small" :disabled="isJoining || isJoined" @click="handleJoinRoom">{{ $t('Join Room') }}</el-button>
        <el-button
          class="button"
          type="primary"
          size="small" :disabled="isPublishing || isPublished" @click="handlePublish">{{ $t('Publish') }}</el-button>
        <el-button
          class="button"
          type="primary" size="small" @click="handleUnpublish">{{ $t('Unpublish') }}</el-button>
        <el-button
          class="button"
          type="primary" size="small" @click="handleLeave">{{ $t('Leave Room') }}</el-button>
      </div>
<!--      <div v-if="isHostMode" class="screen-share-control-container">-->
<!--        <el-button-->
<!--          class="button"-->
<!--          type="primary"-->
<!--          size="small"-->
<!--          :disabled="isShareJoined && isSharePublished"-->
<!--          @click="handleStartScreenShare">{{ $t('Start Screen Share') }}</el-button>-->
<!--        <el-button-->
<!--          class="button"-->
<!--          type="primary" size="small" @click="handleStopScreenShare">{{ $t('Stop Screen Share') }}</el-button>-->
<!--      </div>-->
    </div>

<!--    <div class="info-container" :class="$isMobile && 'info-container-mobile'">-->
<!--      &lt;!&ndash; Log 展示区域 &ndash;&gt;-->
<!--      <div v-if="isHostMode" class="log-container" ref="logContainer">-->
<!--        <p class="log-label">Log:</p>-->
<!--        <div v-for="(item, index) in logList" :key="index">-->
<!--          <span class="log-state" v-if="item.type === 'success'">🟩 </span>-->
<!--          <span class="log-state" v-if="item.type === 'failed'">🟥 </span>-->
<!--          <span>{{ item.log }}</span>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <div v-if="!noOne" class="stream-show">
      <!-- 本地流区域 -->
      <div
        v-if="currentStream"
        class="local-stream-container"
        :class="{'local-stream-container-only-one': onlyOne }"
      >
        <!-- 本地流播放区域 -->
        <div :id="currentStream.getUserId()" class="local-stream-content"></div>
        <!-- 本地流操作栏 -->
        <div v-if="hasCurrentStream" class="local-stream-control">
          <span class="user-id-local">
            {{ currentStream.getUserId() }}
          </span>
          <div class="video-control control">
            <span v-if="!isMutedVideo" @click="muteVideo">
              <svg-icon icon-name="video" class="icon-class"></svg-icon>
            </span>
            <span v-if="isMutedVideo"  @click="unmuteVideo">
              <svg-icon icon-name="video-muted" class="icon-class"></svg-icon>
            </span>
          </div>
          <div class="audio-control control">
            <span v-if="!isMutedAudio" @click="muteAudio">
              <svg-icon icon-name="audio" class="icon-class"></svg-icon>
            </span>
            <span v-if="isMutedAudio" @click="unmuteAudio">
              <svg-icon icon-name="audio-muted" class="icon-class"></svg-icon>
            </span>
          </div>
        </div>
      </div>

      <!-- 远端流区域 -->
      <div v-if="!onlyOne" class="remote-container">
        <div
          v-for="(item) in streamList"
          :key="item.getUserId()"
          :id="item.getUserId()"
          class="remote-stream-container"
          :class="{'remote-stream-container-mute': !item.hasVideo() || isMuteAudioTrack(item) }"
          @dblclick="checkStream(item)">
          <div class="local-stream-control">
            <span class="user-id-local">
              {{ item.getUserId() }}
            </span>
            <div class="video-control control">
              <span @click="changeVideo(item)">
                <svg-icon :icon-name="item.hasVideo() ? 'video' : 'video-muted'" class="icon-class"></svg-icon>
              </span>
            </div>
            <div class="audio-control control">
              <span @click="changeAudio(item)">
                <svg-icon :icon-name="isMuteAudioTrack(item) ? 'audio-muted' : 'audio'" class="icon-class"></svg-icon>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isJoined" class="stream-toolbar">
      <el-button
        v-if="!sharing"
        class="button"
        type="primary"
        size="small"
        :disabled="hasShare"
        @click="remoteShare">演示</el-button>
      <el-button
        v-if="sharing"
        class="button"
        type="primary"
        size="small"
        @click="remoteShare">结束演示</el-button>
      <el-button
        class="button"
        type="primary"
        size="small"
        @click="leaveRoom">离开会议</el-button>
      <el-button
        v-if="isOwner"
        class="button"
        type="danger"
        size="small"
        @click="overRoom">结束会议</el-button>
<!--      <el-button-->
<!--        class="button"-->
<!--        type="primary"-->
<!--        size="small"-->
<!--        @click="inviteOne">分享会议</el-button>-->
    </div>

    <!-- 显示邀请链接 -->
    <div v-if="showInviteLink" class="invite-link-container">
      <span v-if="isEnLang">Copy the link to invite friends to join the video call, one link can invite only one person,
        the link will be updated automatically after copying.</span>
      <span v-else>复制链接邀请好友加入会议。</span>
<!--      <a :href="inviteLink" target="_blank">-->
<!--        <i class="el-icon-link"></i>-->
<!--      </a>-->
      <el-input class="invite-input" v-model="inviteLink">
        <template slot="prepend">
          <el-tooltip
            :visibleArrow="false"
            effect="dark"
            content="Copied!"
            placement="bottom"
            :manual="true"
            v-model="showCopiedTip">
            <span class="invite-btn" @click="handleCopyInviteLink">
              <svg-icon icon-name="copy"></svg-icon>
            </span>
          </el-tooltip>
        </template>
      </el-input>
    </div>
    <im-com v-if="sdkIsReady"></im-com>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import rtc from './mixins/rtc2.js';
import tim from './mixins/tim.js';
import shareRtc from  './mixins/share-rtc.js';
import roomLink from './mixins/room-link';
import LibGenerateTestUserSig from '@/utils/lib-generate-test-usersig.min.js';
import ImCom from './im';
import DeviceSelect from './comp-device-select.vue';

export default {
  name: 'compRoom',
  components: {
    ImCom,
    DeviceSelect
  },
  mixins: [tim, rtc, shareRtc, roomLink],
  props: {
    type: String,
    sdkAppId: Number,
    secretKey: String,
    userId: String,
    roomId: Number,
    // cameraId: String,
    // microphoneId: String,
    inviteUserSig: String,
    manualEnter: Boolean,
  },
  data() {
    return {
      logList: [],
      inviteLink: '',
      showCopiedTip: false,
      canShare: false,
      cameraId: '',
      microphoneId: '',
    };
  },
  computed: {
    isHostMode() {
      return this.type !== 'invite';
    },
    isEnLang() {
      return this.$i18n.locale === 'en';
    },
    showInviteLink() {
      return (this.isJoined || this.isShareJoined) && this.inviteLink;
    },
    sharing() {
      return this.isShareJoined && this.isSharePublished;
    },
    onlyOne() {
      return (this.remoteStreamList?.length || 0) === 0 && !this.localStream;
    },
    noOne() {
      return this.onlyOne || !this.currentStream;
    },
    hasShare() {
      console.log('this.streamList.find(stream => stream.getUserId().includes(\'share_\'))===>', this.streamList.find(stream => stream.getUserId().includes('share_')));
      return !!(this.streamList.find(stream => stream.getUserId().includes('share_')) || '');
    },
    groupInfo() {
      return this.$store.state.tim.group;
    },
  },
  watch: {
    cameraId(val) {
      this.switchDevice('video', val);
    },
    microphoneId(val) {
      this.switchDevice('audio', val);
    },
  },
  mounted() {
    this.$emit('mounted');
  },
  methods: {
    changeCamera(id) {
      // this.currentStream.switchDevice('video', id).then(() => {
      //   console.log('switch camera success');
      // });
      console.log('11111 switch camera success testtt', id);
      this.cameraId = id;
    },
    changeMicrophone(id) {
      // this.currentStream.switchDevice('audio', id).then(() => {
      //   console.log('switch audio success');
      // });
      console.log('22222 switch audio success testtt', id);
      this.microphoneId = id;
    },
    changeSpeaker() {
    //   this.currentStream.switchDevice('audio', id).then(() => {
    //     console.log('switch camera success');
    //   });
    },
    inviteOne() {
      this.canShare = true;
      this.generateInviteLink();
    },
    isMuteAudioTrack(stream) {
      if (stream.getUserId().includes('share_')) return false;
      return !stream.hasAudio();
    },
    changeVideo(stream) {
      if (!this.isOwner && stream.getUserId() !== this.userId) return;
      if (stream.hasVideo()) {
        stream.muteVideo();
      } else {
        stream.unmuteVideo();
      }
    },
    changeAudio(stream) {
      if (!this.isOwner && stream.getUserId() !== this.userId) return;
      if (this.isMuteAudioTrack(stream)) {
        stream.unmuteAudio();
      } else {
        stream.muteAudio();
      }
    },
    generateInviteLink() {
      this.inviteLink = this.generateRoomLink({
        roomId: this.roomId,
        userId: 'xxxx',
      }, 'room');
    },
    handleCopyInviteLink() {
      navigator.clipboard.writeText(this.inviteLink);
      this.showCopiedTip = true;
      setTimeout(() => {
        this.showCopiedTip = false;
      }, 1500);
      // this.generateInviteLink();
    },
    autoJoin() {},
    // 点击【Join Room】按钮
    async handleJoinRoom(type) {
      console.log('yyyy==>', this.sdkAppId, this.secretKey, this.userId, this.roomId);
      if (this.isHostMode || type === 'auto') {
        if (!this.sdkAppId || !this.secretKey) {
          alert(this.$t('Please enter sdkAppId and secretKey'));
          return;
        }
        if (!this.userId || !this.roomId) {
          alert(this.$t('Please enter userId and roomId'));
          return;
        }
        const userSigGenerator = new LibGenerateTestUserSig(this.sdkAppId, this.secretKey, 604800);
        this.userSig = userSigGenerator.genTestUserSig(this.userId);
      } else {
        if (!this.sdkAppId || !this.inviteUserSig || !this.userId || !this.roomId) {
          alert(this.$t('Please reacquire the invitation link'));
          return;
        }
        this.userSig = this.inviteUserSig;
      }
      await this.initClient();
      await this.join();
      await this.initLocalStream();
      await this.playStream(this.currentStream);
      await this.publish();
      this.generateInviteLink();
    },

    // 点击【Publish】按钮
    async handlePublish() {
      await this.publish();
    },

    // 点击【Unpublish】按钮
    async handleUnpublish() {
      await this.unPublish();
    },

    // 点击【Leave Room】按钮
    async handleLeave() {
      await this.leave();
    },

    // 点击【开始屏幕分享】按钮
    async handleStartScreenShare() {
      if (!this.sdkAppId || !this.secretKey) {
        alert(this.$t('Please enter sdkAppId and secretKey'));
        return;
      }
      await this.initShareClient();
      await this.initShareLocalStream();
      await this.handleShareJoin();
      await this.handleSharePublish();
      this.generateInviteLink();
    },

    // 点击【停止屏幕分享按钮】
    async handleStopScreenShare() {
      await this.handleShareUnpublish();
      await this.handleShareLeave();
    },

    // 显示成功的 Log
    addSuccessLog(log) {
      if (!this.isHostMode) {
        return;
      }
      this.logList.push({
        type: 'success',
        log,
      });
      this.sendMessage(log);
      // const { scrollHeight } = this.$refs.logContainer;
      // this.$refs.logContainer.scrollTop = scrollHeight;
    },

    // 显示失败的 Log
    addFailedLog(log) {
      if (!this.isHostMode) {
        return;
      }
      this.logList.push({
        type: 'failed',
        log,
      });
      const { scrollHeight } = this.$refs.logContainer;
      this.$refs.logContainer.scrollTop = scrollHeight;
    },
    reportSuccessEvent(name) {
      this.$aegis.reportEvent({
        name,
        ext1: `${name}-success`,
        ext2: 'webrtcQuickDemoVue2',
        ext3: this.sdkAppId,
      });
    },
    reportFailedEvent(name, error, type = 'rtc') {
      this.$aegis.reportEvent({
        name,
        ext1: `${name}-failed#${this.roomId}*${type === 'share' ? this.shareUserId : this.userId}*${error.message}`,
        ext2: 'webrtcQuickDemoVue2',
        ext3: this.sdkAppId,
      });
    },
    remoteShare() {
      if (this.sharing) {
        this.handleStopScreenShare();
      } else {
        this.handleStartScreenShare();
      }
    },
    leaveRoom() {
      this.leave();
      this.destroyCurrentStream();
      // this.destroyShareLocalStream();
      // this.destroyStream();
      // this.quitGroup();
      this.$localstorage.removeItem('groupId');
      this.$router.push('/');
    },
    overRoom() {
      MessageBox('确认结束会议?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.leaveRoom();
        this.dismissGroup(this.roomId);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.rtc-container {
  .label {
    margin: 14px 0 6px;
    text-align: left;
    font-weight: bold;
  }

  .control-container {
    text-align: left;
    margin-bottom: 10px;
    div:not(:nth-last-child(1)) {
      margin-bottom: 10px;
    }
    .button:not(:first-child) {
      margin-left: 2px;
    }
  }

  .invite-link-container {
    width: 100%;
    color: #084298;
    background-color: #cfe2ff;
    position: relative;
    padding: 10px 16px;
    margin-bottom: 16px;
    border: 1px solid #b6d4fe;
    border-radius: 0.25rem;
    .invite-input {
      margin-top: 10px;
    }
    .invite-btn {
      display: flex;
      cursor: pointer;
    }
  }

  .info-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .log-container {
      flex-grow: 1;
      border: 1px solid #dddddd;
      height: 320px;
      padding: 10px;
      margin-right: 16px;
      overflow-y: scroll;
      .log-label {
        margin: 0 0 6px;
        font-weight: bold;
      }
      .log-state {
        display: inline-block;
        margin-right: 6px;
      }
      > div {
        font-size: 12px;
      }
    }
  }

  .info-container-mobile {
    display: block;
    .log-container {
      margin-right: 0;
    }
    .local-stream-container {
      width: 320px;
      height: 240px;
      margin-top: 10px;
    }
  }
}
.stream-show {
  width: 100%;
  max-height: 640px;
  display: flex;
  border: 1px solid #000;
  .is-speaking {
    border-color: #00ff00 !important;
  }
  .local-stream-container {
    width: 80%;
    position: relative;
    .local-stream-control {
      width: 100%;
    }
    &.local-stream-container-only-one {
      width: 100%;
    }
    .local-stream-content {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 2px solid #fff;
    }
  }
  .remote-container {
    width: 20%;
    //display: flex;
    //flex-wrap: wrap;
    border-left: 1px solid #000;
    box-sizing: border-box;
    overflow-y: auto;
    .remote-stream-container {
      position: relative;
      width: 100%;
      padding: 10px;
      background: #c0c0c0;
      box-sizing: border-box;
      border: 2px solid #fff;
      border-bottom: 1px solid #000;
      margin-bottom: 1px;
    }
    video {
      border: 1px solid #00ff00;
    }
    .remote-stream-container-mute {
      position: relative;
      min-height: 150px;
      line-height: 150px;
      width: 100%;
      text-align: center;
      background: #000000;
    }
    .stream-mute-video {
      //position: absolute;
      //right: 250px;
      //bottom: 10px;
    }
    .stream-mute-audio {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
}

.local-stream-control {
  width: calc(100% - 20px);
  height: 30px;
  position: absolute;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px;
  z-index: 99;
  .control {
    margin-left: 10px;
  }
  .icon-class {
    color: #fff;
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
}
.stream-toolbar {
  margin: 10px 0;
}
.user-id-local {
  position: absolute;
  font-size: 12px;
  left: 10px;
  top: 10px;
  //z-index: 9999;
  color: #fff;
  font-weight: bold;
}
</style>

<i18n>
{
	"en": {
		"Operation": "Operation",
    "Join Room": "Join Room",
    "Publish": "Publish",
    "Unpublish": "Unpublish",
    "Leave Room": "Leave Room",
    "Start Screen Share": "Start Screen Share",
    "Stop Screen Share": "Stop Screen Share",
    "Please enter sdkAppId and secretKey": "Please enter sdkAppId and secretKey",
    "Please enter userId and roomId": "Please enter userId and roomId",
    "Please reacquire the invitation link": "Please reacquire the invitation link!"
	},
	"zh": {
		"Operation": "操作",
    "Join Room": "进入房间",
    "Publish": "发布流",
    "Unpublish": "取消发布流",
    "Leave Room": "离开房间",
    "Start Screen Share": "开始共享屏幕",
    "Stop Screen Share": "停止共享屏幕",
    "Please enter sdkAppId and secretKey": "请输入 sdkAppId 和 secretKey",
    "Please enter userId and roomId": "请输入 userId 和 roomId",
    "Please reacquire the invitation link": "请重新获取邀请链接！"
	}
}
</i18n>
