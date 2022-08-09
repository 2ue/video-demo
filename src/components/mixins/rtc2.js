/*
 * @Description: 音视频通话集成
 * @Date: 2022-03-14 17:15:23
 * @LastEditTime: 2022-03-23 17:47:14
 */
import { mapState } from 'vuex';
import TRTC from 'trtc-js-sdk';
import { isUndefined } from '@/utils/utils.js';
import { MessageBox } from 'element-ui';

export default {
  data() {
    return {
      client: null,
      localStream: null,
      remoteStreamList: [],
      isJoining: false,
      isJoined: false,
      isPublishing: false,
      isPublished: false,
      isMutedVideo: false,
      isMutedAudio: false,
      isPlayingLocalStream: false,
      hasCurrentStream: false,
      currentStream: null,
    };
  },

  computed: {
    ...mapState({
      groupOwnerId(state) {
        console.log('JJJJJJ==>', JSON.parse(JSON.stringify(state.tim)));
        return state.tim.profile?.groupOwnerId || state.tim.groupOwnerId || this.groupInfo?.groupProfile?.selfInfo?.userID;
      },
    }),
    isOwner() {
      return this.groupOwnerId && this.groupOwnerId === this.userId;
    },
    streamList() {
      const streams = [];
      if (this.localStream) streams.push(this.localStream);
      if (this.remoteStreamList.length > 0) streams.push(...this.remoteStreamList);
      const streamIds = [];
      const currentStreamId = this.currentStream?.getId?.();
      if (currentStreamId) streamIds.push(currentStreamId);
      return streams.filter((stream) => {
        const streamId = stream.getId();
        if (isUndefined(streamId) || streamIds.includes(streamId)) return false;
        streamIds.push(streamId);
        return true;
      });
    },
  },
  // beforeCreate() {
  //   TRTC.genUserIdLogLevel(TRTC.Logger.LogLevel.NONE);
  // },
  beforeDestroy() {
    console.log('xxx===>', 111);
    this.leave();
    this.destroyCurrentStream();
  },
  methods: {
    // 初始化客户端
    async initClient() {
      this.client = TRTC.createClient({
        mode: 'live',
        sdkAppId: this.sdkAppId,
        userId: this.userId,
        userSig: this.userSig,
        role: 'anchor',
      });
      this.addSuccessLog(`Client [${this.userId}] created.`);
      this.handleClientEvents();
      this.initTIM(this.roomId);
      // if (this.roomId && this.groupId) {
      //   this.$store.dispatch('remoteStore/updateRemoteStore', {
      //     roomId: this.roomId,
      //   });
      // }
      // console.log('this.roomId===>', this.roomId);
    },

    async initLocalStream() {
      this.localStream = TRTC.createStream({
        audio: true,
        video: true,
        userId: this.userId,
        cameraId: this.cameraId,
        microphoneId: this.microphoneId,
      });
      console.log('createStream testtt======>', {
        audio: true,
        video: true,
        userId: this.userId,
        cameraId: this.cameraId,
        microphoneId: this.microphoneId,
      });
      this.localStream.setVideoProfile('1080p');
      this.onPlayerStateChanged(this.localStream, 'local streammm');
      try {
        await this.localStream.initialize();
        this.currentStream = this.localStream;
        this.addSuccessLog(`LocalStream [${this.userId}] initialized.`);
      } catch (error) {
        this.localStream = null;
        this.currentStream = null;
        this.addFailedLog(`LocalStream failed to initialize. Error: ${error.message}.`);
        throw error;
      }
    },

    playStream(stream) {
      if (stream) {
        stream.play(stream.getUserId())
          .then(() => {
            this.hasCurrentStream = true;
            this.addSuccessLog(`${stream.getUserId()}: stream[${stream.getId()}] play success`);
          })
          .catch((error) => {
            this.hasCurrentStream = false;
            this.addSuccessLog(`${stream.getUserId()}: stream[${stream.getId()}] play error: ${JSON.stringify(error)}`);
          });
      }
    },

    destroyCurrentStream() {
      this.destroyStream(this.currentStream);
      this.currentStream = null;
      this.isPlayingLocalStream = false;
      this.hasCurrentStream = false;
    },

    destroyStream(stream) {
      stream && stream.stop();
      // stream && stream.close();
    },

    destroyLocalStream() {
      this.localStream && this.localStream.stop();
      this.localStream && this.localStream.close();
      this.localStream = null;
      this.isPlayingLocalStream = false;
      this.hasCurrentStream = false;
    },

    playRemoteStream(remoteStream, element) {
      if (remoteStream.getType() === 'main' && remoteStream.getUserId().indexOf('share') >= 0) {
        remoteStream.play(element, { objectFit: 'contain' }).catch();
      } else {
        remoteStream.play(element).catch();
      }
    },

    resumeStream(stream) {
      stream.resume();
    },

    async join() {
      if (this.isJoining || this.isJoined) {
        return;
      }
      this.isJoining = true;
      !this.client && await this.initClient();
      try {
        await this.client.join({ roomId: this.roomId });
        this.isJoining = false;
        this.isJoined = true;

        this.addSuccessLog(`Join room [${this.roomId}] success.`);
        this.reportSuccessEvent('joinRoom');

        this.startGetAudioLevel();
      } catch (error) {
        this.isJoining = false;
        console.error('join room failed', error);
        this.addFailedLog(`Join room ${this.roomId} failed, please check your params. Error: ${error.message}`);
        this.reportFailedEvent('joinRoom', error);
        throw error;
      }
    },
    onPlayerStateChanged(stream, type) {
      stream.on('player-state-changed', event => {
        console.log('native====>', type, 'player is', event);
        console.log('native====>', type, `${event.type} 111 player is ${event.state} because of ${event.reason}`);
      });
    },

    async publish() {
      if (!this.isJoined || this.isPublishing || this.isPublished) {
        return;
      }
      this.isPublishing = true;
      try {
        await this.client.publish(this.localStream);
        this.isPublishing = false;
        this.isPublished = true;

        this.addSuccessLog('LocalStream is published successfully.');
        this.reportSuccessEvent('publish');
      } catch (error) {
        this.isPublishing = false;
        console.error('publish localStream failed', error);
        this.addFailedLog(`LocalStream is failed to publish. Error: ${error.message}`);
        this.reportFailedEvent('publish');
        throw error;
      }
    },

    async unPublish() {
      if (!this.isPublished || this.isUnPublishing) {
        return;
      }
      this.isUnPublishing = true;
      try {
        await this.client.unpublish(this.localStream);
        this.isUnPublishing = false;
        this.isPublished = false;

        this.addSuccessLog('localStream unpublish successfully.');
        this.reportSuccessEvent('unpublish');
      } catch (error) {
        this.isUnPublishing = false;
        console.error('unpublish localStream failed', error);
        this.addFailedLog(`LocalStream is failed to unpublish. Error: ${error.message}`);
        this.reportFailedEvent('unpublish', error);
        throw error;
      }
    },

    async subscribe(remoteStream, config = { audio: true, video: true }) {
      try {
        await this.client.subscribe(remoteStream, {
          audio: isUndefined(config.audio) ? true : config.audio,
          video: isUndefined(config.video) ? true : config.video,
        });
        this.addSuccessLog(`Subscribe [${remoteStream.getUserId()}] success.`);
        this.reportSuccessEvent('subscribe');
      } catch (error) {
        console.error(`subscribe ${remoteStream.getUserId()} with audio: ${config.audio} video: ${config.video} error`, error);
        this.addFailedLog(`Subscribe ${remoteStream.getUserId()} failed!`);
        this.reportFailedEvent('subscribe', error);
      }
    },

    async unSubscribe(remoteStream) {
      try {
        await this.client.unsubscribe(remoteStream);
        this.addSuccessLog(`unsubscribe [${remoteStream.getUserId()}] success.`);
        this.reportSuccessEvent('unsubscribe');
      } catch (error) {
        console.error(`unsubscribe ${remoteStream.getUserId()} error`, error);
        this.addFailedLog(`unsubscribe ${remoteStream.getUserId()} failed!`);
        this.reportFailedEvent('unsubscribe', error);
      }
    },

    async leave() {
      if (!this.isJoined || this.isLeaving) {
        return;
      }
      this.isLeaving = true;
      this.stopGetAudioLevel();
      this.isPublished && await this.unPublish();
      this.currentStream && this.destroyCurrentStream();

      try {
        await this.client.leave();
        this.isLeaving = false;
        this.isJoined = false;

        this.addSuccessLog('Leave room success.');
        this.reportSuccessEvent('leaveRoom');
      } catch (error) {
        this.isLeaving = false;
        console.error('leave room error', error);
        this.addFailedLog(`Leave room failed. Error: ${error.message}`);
        this.reportFailedEvent('leaveRoom', error);
        throw error;
      }
    },

    checkStream(stream) {
      if (!stream.hasVideo()) {
        alert('暂无视频流');
        return;
      }
      const oldStreamUserId = this.currentStream.getUserId();
      // 停止流的播放
      this.currentStream && this.currentStream.stop();
      stream && stream.stop();
      this.$nextTick(() => {
        this.currentStream = stream;
        setTimeout(() => {
          this.playStream(stream, stream.getUserId());
          this.playStream(this.streamList.find(s => s.getUserId() === oldStreamUserId), oldStreamUserId);
        }, 6);
      });
    },

    muteVideo() {
      const stream = this.currentStream;
      if (!this.isOwner && stream.getUserId() !== this.userId) return;
      if (stream) {
        stream.muteVideo();
        this.isMutedVideo = true;
        this.addSuccessLog('LocalStream muted video.');
      }
    },

    muteAudio() {
      const stream = this.currentStream;
      if (!this.isOwner && stream.getUserId() !== this.userId) return;
      if (stream) {
        stream.muteAudio();
        this.isMutedAudio = true;
        this.addSuccessLog('LocalStream muted audio.');
      }
    },

    unmuteVideo() {
      const stream = this.currentStream;
      if (!this.isOwner && stream.getUserId() !== this.userId) return;
      if (stream) {
        stream.unmuteVideo();
        this.isMutedVideo = false;
        this.addSuccessLog('LocalStream unmuted video.');
      }
    },

    unmuteAudio() {
      const stream = this.currentStream;
      if (!this.isOwner && stream.getUserId() !== this.userId) return;
      if (stream) {
        stream.unmuteAudio();
        this.isMutedAudio = false;
        this.addSuccessLog('LocalStream unmuted audio.');
      }
    },

    switchDevice(type, deviceId) {
      try {
        if (this.localStream) {
          this.localStream.switchDevice(type, deviceId);
          console.log('switchDevice run testtt', type, deviceId);
          this.addSuccessLog(`Switch ${type} device success.`);
        }
      } catch (error) {
        console.error('switchDevice failed', error);
        this.addFailedLog(`Switch ${type} device failed.`);
      }
    },

    startGetAudioLevel() {
      // 文档：https://web.sdk.qcloud.com/trtc/webrtc/doc/zh-cn/module-ClientEvent.html#.AUDIO_VOLUME
      this.client.on('audio-volume', (event) => {
        event.result.forEach(({ userId, audioVolume }) => {
          const dom = document.getElementById(userId);
          if (!dom) return;
          const className = dom.className || '';
          if (audioVolume > 2) {
            // console.log(`user: ${userId} is speaking, audioVolume: ${audioVolume}`);
            if (!className.includes('is-speaking')) dom.className = `${className} is-speaking`;
          } else {
            if (className.includes('is-speaking')) dom.className = `${className.replace(' is-speaking', '') || ''}`;
          }
        });
      });
      this.client.enableAudioVolumeEvaluation(200);
    },

    stopGetAudioLevel() {
      this.client && this.client.enableAudioVolumeEvaluation(-1);
    },

    handleClientEvents() {
      this.client.on('error', (error) => {
        console.error(error);
        alert(error);
      });
      this.client.on('client-banned', async (error) => {
        console.error(`client has been banned for ${error}`);

        this.isPublished = false;
        this.localStream = null;
        await this.leave();
        alert(error);
      });
      // fired when a remote peer is joining the room
      this.client.on('peer-join', (event) => {
        const { userId } = event;
        console.log(`peer-join ${userId}`, event);
        // if (this.userId === userId) return;
        // setTimeout(() => {
        //   this.sendNotice({
        //     groupId: this.groupId,
        //     userId,
        //   });
        // }, 4000);
      });
      // fired when a remote peer is leaving the room
      this.client.on('peer-leave', (event) => {
        const { userId } = event;
        console.log(`peer-leave ${userId}`, event);
        const that = this;
        console.log('this.$store.state.tim.groupOwnerId===>', this.groupOwnerId, userId);
        if (this.groupOwnerId === userId) {
          MessageBox('会议已结束', '提示', {
            confirmButtonText: '确定',
            showCancelButtonText: false,
            showClose: false,
            type: 'warning',
            beforeClose() {
              that.leaveRoom();
              that.dismissGroup(that.roomId);
            },
          })
            .then(() => {
              this.leaveRoom();
              this.dismissGroup(this.roomId);
            })
            .catch(() => {
              this.leaveRoom();
              this.dismissGroup(this.roomId);
            });
        }
      });

      // fired when a remote stream is added
      this.client.on('stream-added', (event) => {
        const { stream: remoteStream } = event;
        console.log('get yuv', remoteStream.getVideoTrack());
        const remoteUserId = remoteStream.getUserId();
        if (remoteUserId === `share${this.userId}`) {
          // don't need screen shared by us
          this.unSubscribe(remoteStream);
        } else {
          console.log(`remote stream added: [${remoteUserId}] type: ${remoteStream.getType()}`);
          // subscribe to this remote stream
          this.subscribe(remoteStream);
          this.onPlayerStateChanged(remoteStream, 'remote streammm');
          this.addSuccessLog(`RemoteStream added: [${remoteUserId}].`);
        }
      });
      // fired when a remote stream has been subscribed
      this.client.on('stream-subscribed', (event) => {
        const { stream: remoteStream } = event;
        const remoteUserId = remoteStream.getUserId();
        this.addSuccessLog(`RemoteStream subscribed: [${remoteUserId}].`);
        this.remoteStreamList.push(remoteStream);
        this.$nextTick(() => {
          this.playRemoteStream(remoteStream, remoteUserId);
        });
      });
      // fired when the remote stream is removed, e.g. the remote user called Client.unpublish()
      this.client.on('stream-removed', (event) => {
        const { stream: remoteStream } = event;
        remoteStream.stop();
        const index = this.remoteStreamList.indexOf(remoteStream);
        if (index >= 0) {
          this.remoteStreamList.splice(index, 1);
        }
        console.log(`stream-removed userId: ${remoteStream.getUserId()} type: ${remoteStream.getType()}`);
      });

      this.client.on('stream-updated', (event) => {
        const { stream: remoteStream } = event;
        console.log(`type: ${remoteStream.getType()} stream-updated hasAudio: ${remoteStream.hasAudio()} hasVideo: ${remoteStream.hasVideo()}`);
        this.addSuccessLog(`RemoteStream updated: [${remoteStream.getUserId()}] audio:${remoteStream.hasAudio()}, video:${remoteStream.hasVideo()}.`);
      });

      this.client.on('mute-audio', (event) => {
        const { userId } = event;
        console.log(`${userId} mute audio`);
        this.addSuccessLog(`[${event.userId}] mute audio.`);
      });
      this.client.on('unmute-audio', (event) => {
        const { userId } = event;
        console.log(`${userId} unmute audio`);
        this.addSuccessLog(`[${event.userId}] unmute audio.`);
      });
      this.client.on('mute-video', (event) => {
        const { userId } = event;
        console.log(`${userId} mute video`);
        this.addSuccessLog(`[${event.userId}] mute video.`);
      });
      this.client.on('unmute-video', (event) => {
        const { userId } = event;
        console.log(`${userId} unmute video`);
        this.addSuccessLog(`[${event.userId}] unmute video.`);
      });

      this.client.on('connection-state-changed', (event) => {
        console.log(`RtcClient state changed to ${event.state} from ${event.prevState}`);
      });

      this.client.on('network-quality', (event) => {
        const { uplinkNetworkQuality, downlinkNetworkQuality } = event;
        console.log(`network-quality uplinkNetworkQuality: ${uplinkNetworkQuality}, downlinkNetworkQuality: ${downlinkNetworkQuality}`);
      });
      // this.client.on('player-state-changed', (event) => {
      //   console.log('player-state-changed====>', event);
      // });
    },
  },
};
