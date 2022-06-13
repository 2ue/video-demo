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
