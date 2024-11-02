<!-- ManagePostView.vue -->
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
/* Font family for the entire component */
body {
  font-family: 'Montserrat', sans-serif; /* Apply the Montserrat font */
}

.manage-post-view {
  padding: 0;
  width: 100%;
  margin-top: 80px;

}

/* Toggle Buttons as Full-Width Navbar */
.toggle-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 15px 0;
  background-color: #002A48; /* Navy blue background */
  width: 100%;
  margin: 0 auto 0 auto;
}

.toggle-buttons button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  background-color: transparent; /* Transparent background by default */
}

.toggle-buttons button.active {
  background-color: #34495e; /* lighter navy for active toggle */
}

.toggle-buttons button:hover {
  background-color: #1f2e3d; /* Slightly darker shade on hover */
}
/* Sections styled as extension of the navbar */
.left-section, .right-section {
  flex: 1;
  width: 90%; /* Take up 90% of the screen width */
  min-width: 300px;
  margin: 20px auto; /* Centered on the page */
  padding: 20px;
  border-radius: 8px;
}

h2 {
  color: #003459;
  margin-bottom: 10px;
}

p {
  color: #666;
}
</style>
