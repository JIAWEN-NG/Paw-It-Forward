// src/router.js
// works like app.js
import { createRouter, createWebHistory } from 'vue-router';
import UserAccount from '../components/UserAccount.vue';



//afsana changed
const routes = [

  // Route to get a specific donation by ID
  // { path: '/donation/:id', component: DonationDetail, props: true },

  // Route to get all donations (optional filter by donorId or receiverId can be handled in DonationList component)
  // { path: '/marketplace', component: DonationList },

  // Other routes can be added as needed
  // Marketplace route (with sidebar and donation list)

    {
      path: '/useraccount',
      component: UserAccount}
    
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
