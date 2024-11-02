<template>
  <div id="app">
    <!-- Inline navigation links -->
    <nav style="display: inline;">
      <router-link to="/marketplace">Marketplace</router-link>
    </nav>
    <nav style="display: inline; margin-left: 10px;">
      <router-link to="/managepost">Manage Posts</router-link>
    </nav>
    
    <!-- Main content area for routed components -->
    <router-view />
  </div>
</template>

<script>
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
  background: #F8F9FB;
}
</style>
