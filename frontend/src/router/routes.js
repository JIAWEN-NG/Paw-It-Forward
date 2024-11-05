// src/router.js
// works like app.js
import { createRouter, createWebHistory } from 'vue-router';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ChatView from '../views/ChatView.vue';
import ItemRequest from '@/components/ItemRequest.vue';




import MarketplaceView from '../components/MarketplaceView.vue'; // Marketplace layout
import CreateDonationForm from '../components/CreateDonationForm.vue'; // Form to create a donation
import ManagePostView from '../components/ManagePostView.vue'; //Manage Post layout
import DonationDetails from '@/components/DonationDetails.vue';


import CreateFundraisingForm from '../components/CreateFundraisingForm.vue'; // Form to create a fundraising campaign
import FundraisingView from '../components/FundraisingView.vue'; // To list all fundraising campaigns
import FundraisingDetail from '../components/FundraisingDetail.vue';
import DonateSuccessful from '../components/DonateSuccessful.vue'; 
import CreateWithdrawalForm from '../components/CreateWithdrawalForm.vue'; 

import CombinedAuth from '../components/CombinedAuth.vue';
import aboutPage from '../components/aboutPage.vue';
import teamPage from '../components/teamPage.vue';

//afsana changed
const routes = [

    { path: '/', 
      component: aboutPage 
    },
    { path: '/about',
      name:'about',
      component: aboutPage 
    },
    { 
      path: '/marketplacee', 
      component: CreateDonationForm 
  
    },
    { 
      path: '/marketplace', 
      component: MarketplaceView 
    },
    {
      path: '/managepost',
      component: ManagePostView },
  
    {
      path: '/:id', // Dynamic route for the full-screen donation view
      name: 'DonationDetails',
      component: DonationDetails,
      props: true, // Allows the route parameter to be passed as a prop
    },
  
   // Routes for fundraising
    { path: '/fundraising/create', 
      component: CreateFundraisingForm 
    }, // Route to create a fundraising campaign
  
    { path: '/fundraising', 
      component: FundraisingView 
    }, // Route to list all fundraising campaigns
  
    {
      path: '/fundraising/:id',
      name: 'FundraisingDetail',
      component: FundraisingDetail,
      props: true
    },// Pass route params as props
  
  
    {
      path: '/donation-success',
      name: 'DonationSuccess',
      component: DonateSuccessful,
    },
    { path: '/meetus',
      name:'meetus',
      component: teamPage 
    },

    { path: '/login', 
    name: 'Login', 
    component: CombinedAuth },

    {
      path: '/withdrawal/create',
      component: CreateWithdrawalForm,
     
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
// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//   const auth = getAuth();
//   onAuthStateChanged(auth, (user) => {
//     if (requiresAuth && !user) {
//       next('/login'); // Redirect to login if not authenticated and trying to access a restricted route
//     } else if ((to.path === '/login' || to.path === '/signup') && user) {
//       next('/chat'); // Redirect to chat if already logged in and trying to access login or signup
//     } else {
//       next(); // Proceed normally if the authentication state meets the route requirements
//     }
//   });
// });

export default router;
