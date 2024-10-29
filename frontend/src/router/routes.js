// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
// import usersViewTest from '../components/usersViewTest.vue';
import CombinedAuth from '../components/CombinedAuth.vue';
import aboutPage from '../components/aboutPage.vue';
import teamPage from '../components/teamPage.vue';

const routes = [

    { path: '/', 
      component: aboutPage 
    },
    { path: '/about',
      name:'about',
      component: aboutPage 
    },
    { path: '/meetus',
      name:'meetus',
      component: teamPage 
    },

    { path: '/login', 
    name: 'Login', 
    component: CombinedAuth },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
