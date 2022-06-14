<template>
  <div id="app">
    <!-- 头部栏 -->
    <comp-nav></comp-nav>
    <div class="content" :class="$isMobile && 'content-mobile'">
      <!-- rtc 房间 -->
      <comp-room
        :sdkAppId="Number(sdkAppId)"
        :secretKey="secretKey"
        :userId="userId"
        :roomId="Number(roomId)"
        :cameraId="cameraId"
        :microphoneId="microphoneId"></comp-room>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import compNav from '@/components/comp-nav.vue';
import compRoom from '@/components/comp-room.vue';
import { clearUrlParam } from '@/utils/utils';

export default {
  components: {
    compNav,
    compRoom,
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
    //max-width: 1320px;
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

