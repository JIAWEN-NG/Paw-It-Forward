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
  },
  mounted() {
    // JavaScript to prevent viewport width from going below 400px
    const enforceMinWidth = () => {
      if (window.innerWidth < 400) {
        document.body.style.width = "400px";
        document.documentElement.style.overflowX = "hidden";
      } else {
        document.body.style.width = "auto";
      }
    };

    // Listen to window resize events to enforce minimum width
    window.addEventListener("resize", enforceMinWidth);

    // Call the function once to set initial width
    enforceMinWidth();
  },
  beforeUnmount() {
    window.removeEventListener("resize", enforceMinWidth);
  }
};


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

/* Global styles */
#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-width: 400px; /* Ensures the application doesn't shrink below 400px */
}

#content {
  margin-top: 80px;
}
::-webkit-scrollbar {
  display: none; /* Hide scrollbar for WebKit browsers */
}

/* Restrict the main container */
@media (max-width: 400px) {
  #app {
    width: 400px;
    margin: 0 auto;
    /* Center the app content within the viewport */
  }
}
</style>
