<template>
  <header>
    <h1 class="logo">Vue Chat App</h1>
    <nav>
      <router-link to="/chats" >Chat</router-link>
      <router-link to="/item-request">request</router-link>
      <!-- Display login and logout links based on authentication status -->
      <router-link v-if="!user" to="/login">Login</router-link>
      <router-link v-if="!user" to="/signup">Sign Up</router-link>
      <button v-if="user" @click="logout">Logout</button>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth } from './config/firebase';
import {useRouter} from "vue-router";

export default {
  name: 'App',
  setup() {
    const user = ref(null);
    const router = useRouter(); // Initialize the router
    // Check user login state
    onMounted(() => {
      auth.onAuthStateChanged(u => {
        user.value = u;
      });
    });
    // Logout method
    const logout = async () => {
      try {
        await auth.signOut();
        await router.push('/');
      } catch (error) {
        console.error('Logout Failed:', error);
        alert('Logout failed. Please try again.');
      }
    };
    return { user, logout };
  }
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
}
nav {
  background-color: aqua;
}
</style>
