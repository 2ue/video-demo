<template>
  <div id="app">
    <!-- 头部栏 -->
    <comp-nav></comp-nav>
    <div class="content" :class="$isMobile && 'content-mobile'">
      <p style="margin-top: 20px">快速会议：以当前登录userId和随机会议ID，开始会议</p>
      <el-row :gutter="20">
        <el-col :span="24"><div class="grid-content" @click="fastJoin">快速会议</div></el-col>
      </el-row>
      <p>加入会议：手动输入会议ID和userID，如果会议ID不存在，则自动创建会议</p>
      <el-row :gutter="20">
        <el-col :span="24"><div class="grid-content" @click="join">加入/创建会议</div></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import compNav from '@/components/comp-nav.vue';
import roomLink from  '@/components/mixins/room-link';
import { clearUrlParam, genRoomId } from '@/utils/utils';

export default {
  name: 'App',
  mixins: [roomLink],
  components: {
    compNav,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      sdkAppId: state => state.sdkAppId,
      secretKey: state => state.secretKey,
      userId: state => state.userId,
      roomId: state => state.roomId,
      cameraId: state => state.cameraId,
      microphoneId: state => state.microphoneId,
    }),
  },
  methods: {
    handleValueChange(value, key) {
      this[key] = value;
    },
    join() {
      this.$router.push('/join');
    },
    fastJoin() {
      const link = this.generateRoomLink({
        roomId: genRoomId(),
        userId: this.userId,
      }, 'room');
      console.log('xxxxx===>', genRoomId(), link);
      window.location.href = link;
    },
  },
  mounted() {
    clearUrlParam();
  },
};
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  padding-bottom: 40px;
  .content {
    width: 80%;
    margin: 0 auto;
    max-width: 1320px;
    .alert {
      padding-top: 20px;
      font-size: 16px !important;
    }
    &.content-mobile {
      width: 100%;
      padding: 0 16px 20px;
    }
    .label {
      margin: 14px 0 6px;
      text-align: left;
      font-weight: bold;
    }
    .param-container {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      div {
        width: calc((100% - 20px) / 2);
        margin-bottom: 10px;
      }
      div:nth-last-child(2), div:nth-last-child(1) {
        margin-bottom: 0;
      }
      &.param-container-mobile {
        div {
          width: 100%;
          margin-bottom: 10px;
        }
      }
    }
  }
}
.grid-content {
  width: 100%;
  height: 100px;
  background: #0D6EFD;
  text-align: center;
  line-height: 100px;
  font-size: 30px;
  margin: 20px 0 10px;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
}
</style>

<i18n>
{
	"en": {
		"Params": "Params",
    "Device Select": "Device Select",
    "Alert": "Notes: this Demo is only applicable for debugging. Before official launch, please migrate the UserSig calculation code and key to your backend server to avoid unauthorized traffic use caused by the leakage of encryption key.",
    "Click": "View documents",
    "Url": "https://intl.cloud.tencent.com/document/product/647/35166"
	},
	"zh": {
		"Params": "参数",
    "Device Select": "设备选择",
    "Alert": "注意️：本 Demo 仅用于调试，正式上线前请将 UserSig 计算代码和密钥迁移到您的后台服务器上，以避免加密密钥泄露导致的流量盗用。",
    "Click": "查看文档",
    "Url": "https://cloud.tencent.com/document/product/647/17275"
	}
}
</i18n>

