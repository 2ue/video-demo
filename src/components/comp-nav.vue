<!--
 * @Description: 导航栏组件
 * @Date: 2022-03-09 16:47:13
 * @LastEditTime: 2022-04-07 17:34:23
-->
<template>
  <div class="nav-container">
    <div class="right-region">
      <img v-if="isZhLang" :class="$isMobile ? 'logo-mobile' : 'logo'" src="https://web.sdk.qcloud.com/trtc/webrtc/assets/logo/trtc-logo-cn-w.png" />
      <img v-if="isEnLang" :class="$isMobile ? 'logo-mobile' : 'logo'" src="https://web.sdk.qcloud.com/trtc/webrtc/assets/logo/trtc-logo-en-w.png" />
    </div>
    <div class="left-region">
      <span class="language" @click="toggleLanguage">
        <svg-icon icon-name="language"></svg-icon>
      </span>
      <div class="github" @click="goToGithub">
        <svg-icon icon-name="github" className="github-svg"></svg-icon>
        <p><span>{{ userId }}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'navContainer',
  data() {
    return  {
    };
  },
  computed: {
    ...mapState({
      userId: state => state.userId,
    }),
    isZhLang() {
      return this.$i18n.locale === 'zh';
    },
    isEnLang() {
      return this.$i18n.locale === 'en';
    },
  },
  methods: {
    toggleLanguage() {
      switch (this.$i18n.locale) {
        case 'en':
          this.$i18n.locale = 'zh';
          localStorage.setItem('trtc-quick-vue2-language', 'zh');
          break;
        case 'zh':
          this.$i18n.locale = 'en';
          localStorage.setItem('trtc-quick-vue2-language', 'en');
          break;
      }
      document.title = this.$i18n.t('title');
    },
    goToGithub() {
      this.$aegis.reportEvent({
        name: 'jumpGithub',
        ext1: 'jumpGithub',
        ext2: 'webrtcQuickDemoVue2',
        ext3: this.sdkAppId,
      });
      window.open('https://github.com/LiteAVSDK/TRTC_Web', '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-container{
  width: 100%;
  height: 70px;
  padding: 10px 10px;
  background-color: #00182F;
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  align-items: center;
  .right-region {
    height: 60px;
    display: flex;
    align-items: center;
    .logo {
      height: 60px;
    }
    .logo-mobile {
      height: 30px;
    }
  }
  .left-region {
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    text-align: center;
    .github {
      margin-left: 20px;
      margin-right: 10px;
      cursor: pointer;
      .github-svg {
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>
