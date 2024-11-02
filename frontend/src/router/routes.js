// src/router.js
// works like app.js
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
import DonationDetails from '@/components/DonationDetails.vue';


//afsana changed
const routes = [
  { path: '/', component: usersViewTest },

  // Route to create a donation
  { path: '/marketplacee', component: CreateDonationForm },

  // Route to get a specific donation by ID
  // { path: '/donation/:id', component: DonationDetail, props: true },

  // Route to get all donations (optional filter by donorId or receiverId can be handled in DonationList component)
  // { path: '/marketplace', component: DonationList },

  // Other routes can be added as needed
  // Marketplace route (with sidebar and donation list)
  { 
    path: '/marketplace', 
    component: MarketplaceView 
  },

  {
    path: '/managepost',
    component: ManagePostView 
  },

  {
    path: '/:id', // Dynamic route for the full-screen donation view
    name: 'DonationDetails',
    component: DonationDetails,
    props: true, // Allows the route parameter to be passed as a prop
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
