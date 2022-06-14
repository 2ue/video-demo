import LibGenerateTestUserSig from '@/utils/lib-generate-test-usersig.min.js';
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      sdkAppId: state => state.sdkAppId,
      roomId: state => state.roomId,
      secretKey: state => state.secretKey,
      userId: state => state.userId,
    }),
  },
  methods: {
    generateRoomLink({ userId, roomId }, routePath) {
      const { sdkAppId, secretKey, roomId: rId, userId: uId } = this;
      const _uId = userId || uId;
      if (!_uId) {
        this.$alert('userId缺失');
        return;
      }
      const _rId = roomId || rId;
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
