import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TaskView from '../views/TaskView.vue';
import LoginView from '../views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TaskView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
});

export default router;
