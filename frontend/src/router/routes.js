// src/router.js
// works like app.js
import { createRouter, createWebHistory } from 'vue-router';
// import usersViewTest from '../components/usersViewTest.vue';


import MarketplaceView from '../components/MarketplaceView.vue'; // Marketplace layout
import CreateDonationForm from '../components/CreateDonationForm.vue'; // Form to create a donation
import ManagePostView from '../components/ManagePostView.vue'; //Manage Post layout
import DonationDetails from '@/components/DonationDetails.vue';


import CreateFundraisingForm from '../components/CreateFundraisingForm.vue'; // Form to create a fundraising campaign
import FundraisingView from '../components/FundraisingView.vue'; // To list all fundraising campaigns
import FundraisingDetail from '../components/FundraisingDetail.vue';
import DonateSuccessful from '../components/DonateSuccessful.vue'; 

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
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
