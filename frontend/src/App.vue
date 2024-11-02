<!-- App.vue -->
<template>
  <div id="app">
    <navBar />
      <!-- afsana added -->

    <!-- <nav style="display: inline;">
      <router-link to="/marketplace">Marketplace</router-link>
    </nav>
    <nav style="display: inline; margin-left: 10px;">
      <router-link to="/managepost">Manage Posts</router-link>
    </nav>
    <nav style="display: inline; margin-left: 10px;">
      <router-link to="/fundraising">fundraising</router-link>
    </nav> -->
    <!-- afsana added ends -->
    <router-view />
    <footerBar />
  </div>

</template>

<script>
import navBar from './components/navBar.vue';
import footerBar from './components/footerBar.vue';

export default {
  name: 'App',
  components:{
    navBar,
    footerBar,
  }
};

</script>

<!-- 
<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background: #F8F9FB;
}
</style>
-->
