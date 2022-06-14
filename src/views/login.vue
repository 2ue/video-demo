<template>
  <div style="width: 60%;text-align: center;margin: 50px auto;">
    <h2 style="margin-bottom: 20px">登录</h2>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="userId">
        <el-input v-model="form.userId" placeholder="userId">
          <i slot="suffix" class="el-icon-refresh" title="随机生成userId" @click="genUserId"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" placeholder="密码随便输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        userId: '',
        password: '',
      },
    };
  },
  created() {
    this.$localstorage.removeItem(['userId', 'password']);
  },
  methods: {
    genUserId() {
      this.form.userId = `user_${parseInt(Math.random() * 100000000, 10)}`;
    },
    submit() {
      console.log('form===>', this.form);
      if (!this.form.userId || !this.form.password) {
        this.$alert('请输入userId或者密码', '提示');
        return;
      }
      const userId = `user_${parseInt(Math.random() * 100000000, 10)}_${this.form.userId}`;
      this.$localstorage.setItem({
        userId,
      });
      this.$store.commit('updateUserId', userId);
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>

</style>
