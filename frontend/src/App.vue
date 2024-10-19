<template>
  <div id="app">
    <CombinedAuth />
  </div>
</template>

<script>
import CombinedAuth from './components/CombinedAuth.vue';

export default {
  name: 'App',
  components: {
    CombinedAuth
  }
};
</script>

<!-- <template>
  <img alt="Vue logo" src="./assets/logo.png">
  <h1>Hello this is frontend</h1>
  <div id="app">
    <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
      </nav>
    <router-view />
    
  </div>
</template>

<script>
// import UsersViewTest from './components/usersViewTest.vue';


// export default {
//   name: 'App',
//   components: {
//     UsersViewTest
//   }
// }
export default {
  name: 'App',
};
</script> -->

<!-- 
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding: 0;
}
</style> -->
