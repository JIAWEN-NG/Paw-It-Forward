// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import SignUp from '../components/SignUp.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ChatView from '../views/ChatView.vue';
import ItemRequest from '@/components/ItemRequest.vue';



const routes = [

    { path: '/login', component: Login },
    { path: '/signup', component: SignUp },
    // please add the your route path here
    { path: '/item-request', component: ItemRequest },

    {
      path: '/',
      name: 'Home',
      component: () => import('../components/HomeTemp.vue'), // Lazy loading example for the home page
    },
    {
      path: '/chats',
      name: 'ChatView',
      component: ChatView,
      meta: {
        requiresAuth: true, // Add this if authentication is required for accessing the chat view
      },
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      next('/login'); // Redirect to login if not authenticated and trying to access a restricted route
    } else if ((to.path === '/login' || to.path === '/signup') && user) {
      next('/chat'); // Redirect to chat if already logged in and trying to access login or signup
    } else {
      next(); // Proceed normally if the authentication state meets the route requirements
    }
  });
});

export default router;
