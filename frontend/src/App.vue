<!-- App.vue -->
<template>

  <div id="app">
    <!-- afsana added -->


    <nav style="display: inline; margin-left: 10px;">
      <router-link to="/managepost">Manage Posts</router-link>
    </nav>
    <nav style="display: inline; margin-left: 10px;">
      <router-link to="/fundraising">fundraising</router-link>
    </nav>
    <!-- afsana added ends -->
    <router-view />
  </div>

</template>

<script>


// export default {
//   name: 'App',
//   components: {
//     UsersViewTest
//   }
// }

// Import the DonationList component

export default {
  name: 'App',
};

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color:white
}
</style>
