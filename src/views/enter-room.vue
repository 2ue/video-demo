<template>
  <div id="app">
    <!-- 头部栏 -->
    <comp-nav></comp-nav>
    <div style="width: 60%;text-align: center;margin: 50px auto;">
      <h2 style="margin-bottom: 20px">加入会议</h2>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="userId">
          <el-input v-model="form.userId" placeholder="userId">
            <i slot="suffix" class="el-icon-refresh" title="随机生成userId" @click="genUserId"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="会议ID">
          <el-input v-model="form.roomId" placeholder="请输入会议ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="goBack">返回</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import compNav from '@/components/comp-nav.vue';
import roomLink from  '@/components/mixins/room-link';
import { genUserId } from '@/utils/utils';
export default {
  components: { compNav },
  mixins: [roomLink],
  data() {
    return {
      form: {
        userId: '',
        roomId: '',
      },
    };
  },
  created() {
    this.form.userId = this.$store.state.userId;
  },
  methods: {
    genUserId() {
      this.form.userId = genUserId('user');
    },
    goBack() {
      this.$router.go(-1);
    },
    submit() {
      if (!this.form.userId || !this.form.roomId) {
        this.$alert('请输userId和会议ID', '提示');
        return;
      }
      const link = this.generateRoomLink({
        roomId: this.form.roomId,
        userId: this.form.userId,
      }, 'room');
      window.location.href = link;
    },
  },
};
</script>

<style scoped>

</style>
