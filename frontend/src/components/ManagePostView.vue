<!-- ManagePostView.vue -->

<template>
  <div class="manage-post-view">
    <!-- <h1>Manage Post View</h1>
    <p class="test-paragraph">This component allows you to manage both marketplace listings and fundraising posts.</p> -->

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
      <!-- Left Section: Marketplace Listings (Scrollable) -->
      <div class="left-section scrollable" v-if="currentView === 'marketplace'">
        <!-- <h2>Marketplace Listings Management</h2> -->
        <p>Here, you can manage your marketplace listings.</p>
        <ManageMarketplace :loadListings="currentView === 'marketplace'" />
      </div>

      <!-- Right Section: Fundraising Posts -->
      <div class="right-section" v-if="currentView === 'fundraising'">
        <!-- <h2>Fundraising Posts Management</h2> -->
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
/* Font family for the entire component */
body {
  font-family: 'Montserrat', sans-serif; /* Apply the Montserrat font */
  background:white;
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
  background-color: #2c3e50; /* Dark blue for active */
}

.toggle-buttons button:not(.active) {
  background-color: grey; /* Grey for inactive */
}

.toggle-buttons button:hover {
  background-color: #34495e; /* Darker blue on hover */
}

.split-screen {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  height: 650px; 
  /* for the beige part */
}

.left-section, .right-section {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.left-section {
  height: 600px; /* Increased height for the scrollable section */
  overflow-y: auto;
}

.right-section {
  height: 600px;
  overflow-y: auto;
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
  .left-section, .right-section {
    height: auto;
  }
}
</style>
