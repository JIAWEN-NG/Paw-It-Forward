<template>
  <div id="app">
    <navBar />
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
  padding: 0;
}
</style>
-->
