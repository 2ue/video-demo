<template>
  <div id="app">
    <!-- 头部栏 -->
    <comp-nav></comp-nav>
    <div class="content" :class="$isMobile && 'content-mobile'">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import compNav from '@/components/comp-nav.vue';

export default {
  components: {
    compNav,
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
  }
}
</style>

