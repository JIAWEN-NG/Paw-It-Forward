// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import usersViewTest from '../components/usersViewTest.vue';
import CombinedAuth from '../components/CombinedAuth.vue';

const routes = [
  { path: '/login', name: 'Login', component: CombinedAuth },
  { path: '/', name: 'ViewTest', component: usersViewTest }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
