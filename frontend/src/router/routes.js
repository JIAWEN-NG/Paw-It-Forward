// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import usersViewTest from '../components/usersViewTest.vue';

// afsana changed
// Import necessary components (assuming they exist or will be created)
// import CreateDonation from '../components/CreateDonation.vue'; // To create a donation
// import DonationDetail from '../components/DonationDetail.vue'; // To view a specific donation
// import DonationList from '../components/DonationList.vue'; // To list all donations


import MarketplaceView from '../components/MarketplaceView.vue'; // Marketplace layout
import CreateDonationForm from '../components/CreateDonationForm.vue'; // Form to create a donation
import ManagePostView from '../components/ManagePostView.vue'; //Manage Post layout


import CreateFundraisingForm from '../components/CreateFundraisingForm.vue'; // Form to create a fundraising campaign
//import FundraisingDetail from '../components/FundraisingDetail.vue'; // To view a specific fundraising campaign
//import FundraisingList from '../components/FundraisingList.vue'; // To list all fundraising campaigns
import FundraisingView from '../components/FundraisingView.vue'; // To list all fundraising campaigns
import FundraisingDetail from '../components/FundraisingDetail.vue';
import ManageFundraisingPost from '../components/ManageFundraisingPost.vue';
//import EditFundraisingPost from '../components/EditFundraisingPost.vue';

//afsana changed
const routes = [
  { path: '/', 
    component: usersViewTest 
  },
   // Route to create a donation
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
    path: '/fundraising/manage', 
    component: ManageFundraisingPost 
  },

  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
