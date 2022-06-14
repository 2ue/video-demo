import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';

Vue.use(VueRouter);

const localstorage = window.store;

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  // 加入会议
  {
    path: '/join',
    name: 'Join',
    component: () => import('../views/enter-room.vue'),
  },
  {
    path: '/room',
    name: 'Room',
    component: () => import('../views/auto-join.vue'),
  },
  {
    path: '/invite',
    name: 'Invite',
    component: () => import('../views/Invite.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue'),
  },
];

const router = new VueRouter({
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    next();
  } else {
    const userId = localstorage.getItem('userId');
    if (userId) {
      next();
    } else {
      next({
        name: 'Login',
      });
    }
  }
});

export default router;
