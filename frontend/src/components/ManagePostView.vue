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
import ManageMarketplace from './ManageMarketplace.vue';
import ManageFundraisingPost from './ManageFundraisingPost.vue';

export default {
  name: "ManagePostView",
  data() {
    return {
      currentView: 'marketplace' // Default to showing marketplace management
    };
  },
  components: { 
    ManageMarketplace,
    ManageFundraisingPost
  }
};
</script>

<style scoped>
body {
  font-family: 'Montserrat', sans-serif;
  background: white;
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
  padding: 5px 15px;
  background-color: #f0f0f0;
  border-radius: 8px;
  width: fit-content;
  margin: 0 auto 20px auto;
}

.toggle-buttons button {
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.toggle-buttons button.active {
  background-color: #2c3e50;
}

.toggle-buttons button:not(.active) {
  background-color: grey;
}

.toggle-buttons button:hover {
  background-color: #34495e;
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
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  border-radius: 8px;
}

/* Remove fixed height to allow dynamic content expansion */
.left-section {
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  border-radius: 8px;
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
