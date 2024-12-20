// src/router.js
// works like app.js

import { createRouter, createWebHistory } from 'vue-router';



//import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ChatView from '../components/ChatView.vue'; // Chat view
import MarketplaceView from '../components/MarketplaceView.vue'; // Marketplace layout
import CreateDonationForm from '../components/CreateDonationForm.vue'; // Form to create a donation
import ManagePostView from '../components/ManagePostView.vue'; //Manage Post layout
import DonationDetails from '@/components/DonationDetails.vue';
import CreateFundraisingForm from '../components/CreateFundraisingForm.vue';
import FundraisingView from '../components/FundraisingView.vue';
import FundraisingDetail from '../components/FundraisingDetail.vue';
import DonateSuccessful from '../components/DonateSuccessful.vue';
//import CreateWithdrawalForm from '../components/CreateWithdrawalForm.vue';
import CombinedAuth from '../components/CombinedAuth.vue';
import aboutPage from '../components/aboutPage.vue';
import teamPage from '../components/teamPage.vue';
import Testimonial from '../components/Testimonial.vue'; // Import the Testimonial page
import AdminView from '@/components/AdminView.vue';
import CancelDonation from '../components/CancelDonation.vue';
import ManageAccount from '../components/ManageAccount.vue'
// import UserAccount from '../components/UserAccount.vue';
import WithdrawalView from '../components/WithdrawalView.vue';

const routes = [
    { path: '/', component: aboutPage },
    { path: '/about', name: 'about', component: aboutPage },
    { path: '/marketplacee', component: CreateDonationForm },
    { path: '/marketplace', component: MarketplaceView },
    { path: '/managepost', component: ManagePostView },
    {
        path: '/manage-account',
        name: 'ManageAccount',
        component: ManageAccount },
    {
        path: '/:id',
        name: 'DonationDetails',
        component: DonationDetails,
        props: true,
    },
    // Routes for fundraising
    { path: '/fundraising/create', component: CreateFundraisingForm },
    { path: '/fundraising', component: FundraisingView },
    {
        path: '/fundraising/:id',
        name: 'FundraisingDetail',
        component: FundraisingDetail,
        props: true
    },
    {
        path: '/donation-success',
        name: 'DonationSuccess',
        component: DonateSuccessful,
    },
    {
        path: '/chats',
        name: 'ChatView',
        component: ChatView,
        meta: {
            requiresAuth: true,
        },
    },
    // Route for testimonials
    { path: '/testimonials', name: 'Testimonial', component: Testimonial },

    { path: '/login', 
    name: 'Login', 
    component: CombinedAuth },

    { path: '/admin',
      name:'admin',
      component: AdminView, 
    },

    {
        path: '/cancel',
        name: 'CancelDonation',
        component: CancelDonation,
    },
    {
        path: '/meetus',
        name: 'teamPage',
        component: teamPage,
    },
    {
        path: '/withdrawalview',
        name: 'WithdrawalView',
        component: WithdrawalView,
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router;