<template>
  <div
    v-if="localStream"
    class="local-stream-container"
    :class="{'local-stream-container-only-one': onlyOne }"
  >
    <!-- 本地流播放区域 -->
    <div id="localStream" class="local-stream-content"></div>
    <!-- 本地流操作栏 -->
    <div v-if="isPlayingLocalStream" class="local-stream-control">
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
</template>
<script>
export default {
  data() {
    return {
      stream: null,
      isMutedVideo: false,
    };
  },

  methods: {
    muteVideo() {
      if (this.stream) {
        this.stream.muteVideo();
        this.isMutedVideo = true;
        this.addSuccessLog('stream muted video.');
      }
    },

    muteAudio() {
      if (this.stream) {
        this.stream.muteAudio();
        this.isMutedAudio = true;
        this.addSuccessLog('stream muted audio.');
      }
    },

    unmuteVideo() {
      if (this.stream) {
        this.stream.unmuteVideo();
        this.isMutedVideo = false;
        this.addSuccessLog('stream unmuted video.');
      }
    },

    unmuteAudio() {
      if (this.stream) {
        this.stream.unmuteAudio();
        this.isMutedAudio = false;
        this.addSuccessLog('stream unmuted audio.');
      }
    },
    playRemoteStream(stream, element) {
      stream.play(element).catch();
    },
  },
};
</script>
<style lang="less" scoped>
.local-stream-container {
  width: 80%;
  position: relative;
  &.local-stream-container-only-one {
    width: 100%;
  }
  .local-stream-content {
    width: 100%;
    height: 100%;
  }
  .local-stream-control {
    width: 100%;
    height: 30px;
    position: absolute;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 10px;
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
}
</style>
