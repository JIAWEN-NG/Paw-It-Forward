// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import usersViewTest from '../components/usersViewTest.vue';

const routes = [

    { path: '/', component: usersViewTest },


    // please add the your route path here
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
