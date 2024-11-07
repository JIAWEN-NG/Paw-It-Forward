<!-- App.vue -->
<template>
  <div id="app">
    <navBar />
    <div id="content">
      <router-view />
    </div>
    <footerBar />
  </div>

</template>

<script>
import navBar from './components/navBar.vue';
import footerBar from './components/footerBar.vue';

export default {
  name: 'App',
  components: {
    navBar,
    footerBar,
  }
};

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  -webkit-scrollbar {
    overflow: hidden;
  }
}

#content {
  margin-top: 80px;
}
</style>
