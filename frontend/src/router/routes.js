// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import usersViewTest from '../components/usersViewTest.vue';

// afsana changed
// Import necessary components (assuming they exist or will be created)
// import CreateDonation from '../components/CreateDonation.vue'; // To create a donation
// import DonationDetail from '../components/DonationDetail.vue'; // To view a specific donation
// import DonationList from '../components/DonationList.vue'; // To list all donations

import ManagePostView from '../components/ManagePostView.vue'; //Manage Post layout
import CreateFundraisingForm from '../components/CreateFundraisingForm.vue'; // Form to create a fundraising campaign
import FundraisingView from '../components/FundraisingView.vue'; // To list all fundraising campaigns
import FundraisingDetail from '../components/FundraisingDetail.vue';

import DonateSuccessful from '../components/DonateSuccessful.vue'; 
import CreateWithdrawalForm from '../components/CreateWithdrawalForm.vue'; 

//afsana changed
const routes = [
  { path: '/', 
    component: usersViewTest 
  },
   // Route to create a donation
  
  {
    path: '/managepost',
    component: ManagePostView },

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

  {
    path: '/withdrawal/create',
    component: CreateWithdrawalForm,
   
  },
 


  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
