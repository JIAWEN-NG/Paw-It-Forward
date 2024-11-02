<template>
  <div class="manage-post-view">
    <!-- Toggle Button Area -->
    <div class="toggle-buttons">
      <button @click="currentView = 'marketplace'" :class="{ active: currentView === 'marketplace' }">
        Manage Marketplace Listings
      </button>
      <button @click="currentView = 'fundraising'" :class="{ active: currentView === 'fundraising' }">
        Manage Fundraising Posts
      </button>
    </div>

    <!-- Split Screen Area -->
    <div class="split-screen">
      <!-- Left Section: Marketplace Listings -->
      <div class="left-section" v-if="currentView === 'marketplace'">
        <p>Here, you can manage your marketplace listings.</p>
        <ManageMarketplace :loadListings="currentView === 'marketplace'" />
      </div>

      <!-- Right Section: Fundraising Posts -->
      <div class="right-section" v-if="currentView === 'fundraising'">
        <p>Here, you can manage your fundraising posts.</p>
        <ManageFundraisingPost :loadListings="currentView === 'fundraising'" />
      </div>
    </div>
  </div>
</template>

<script>

import ManageFundraisingPost from './ManageFundraisingPost.vue';

export default {
  name: "ManagePostView",
  data() {
    return {
      currentView: 'marketplace' // Default to showing marketplace management
    };
  },
  components: { 
    
    ManageFundraisingPost
  }
};
</script>

<style scoped>
body {
  font-family: 'Montserrat', sans-serif;
  background-color:#F8F9FB;

}

.manage-post-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Toggle Buttons Area */
.toggle-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  border-radius: 8px;
  width: fit-content;
  margin: 0 auto 20px auto;
  
}

.toggle-buttons button {
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #cccccc; /* Subtle border */
  color: #333; /* Darker text for better readability */
  border-radius: 5px;
  transition: all 0.3s ease; /* Smooth transition for color and shadow */
  background-color: #ffffff; /* White background */
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); /* Light shadow for 3D effect */
}

.toggle-buttons button.active {
  background-color: #2c3e50; /* Dark blue for active state */
  color: #ffffff; /* White text on active */
  box-shadow: 0 2px 4px rgba(0,0,0,0.2); /* Deeper shadow on active */
}

.toggle-buttons button:not(.active):hover {
  background-color: #e0e0e0; /* Light grey on hover for inactive buttons */
}

.toggle-buttons button:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15); /* Enhanced shadow on hover for all buttons */
}

.split-screen {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
}

.left-section, .right-section {
  flex: 1;
  min-width: 300px;
}

h2 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
}

@media (max-width: 768px) {
  .split-screen {
    flex-direction: column;
  }
}
</style>
