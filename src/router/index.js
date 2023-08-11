import * as vueRouter from 'vue-router';
import MainView from '@/views/MainView.vue';

const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'home',
    component: MainView,
    props: true,
  },
];

const router = vueRouter.createRouter({
  history: vueRouter.createWebHistory(),
  routes,
});

export default router;
