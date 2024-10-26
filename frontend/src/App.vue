<!-- App.vue -->
<template>
<<<<<<< Updated upstream
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
=======

  <div id="app">
    <!-- afsana added -->

    <nav style="display: inline;">
      <router-link to="/marketplace">Marketplace</router-link>
    </nav>
    <nav style="display: inline; margin-left: 10px;">
      <router-link to="/managepost">Manage Posts</router-link>
    </nav>
    <nav style="display: inline; margin-left: 10px;">
      <router-link to="/fundraising">fundraising</router-link>
    </nav>
    <!-- afsana added ends -->
    <router-view />
  </div>
>>>>>>> Stashed changes
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

<<<<<<< Updated upstream
export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
=======

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

>>>>>>> Stashed changes
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
<<<<<<< Updated upstream
=======
  background-color:white
>>>>>>> Stashed changes
}
</style>
