import LibGenerateTestUserSig from '@/utils/lib-generate-test-usersig.min.js';
export default {
  methods: {
    generateRoomLink({ userId, roomId }, routePath) {
      const { sdkAppId, secretKey } = this.$store.state;
      // eslint-disable-next-line no-underscore-dangle
      const _rId = roomId || this.$store.state.roomId;
      // eslint-disable-next-line no-underscore-dangle
      const _uId = userId;
      if (!_uId) {
        this.$alert('userId缺失');
        return;
      }
      if (!_rId) {
        this.$alert('会议ID缺失');
        return;
      }
      const userSigGenerator = new LibGenerateTestUserSig(sdkAppId, secretKey, 604800);
      const inviteUserSig = userSigGenerator.genTestUserSig(_uId);
      return encodeURI(`${location.origin}${location.pathname}#/${routePath}?sdkAppId=${sdkAppId}&userSig=${inviteUserSig}&roomId=${_rId}&userId=${_uId}`);
    },
  },
};
