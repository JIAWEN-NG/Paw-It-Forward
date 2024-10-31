<template>
    <div class="signup-container">
      <h1>Sign Up</h1>
      <form @submit.prevent="signUp">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required minlength="6"  />
        <input v-model="username" type="text" placeholder="Username" required>
  
        <button type="submit">Sign Up</button>
      </form>
      <p v-if="errorMessage" style="color:red"> {{errorMessage}} </p>
    </div>
  </template>
  
  <script>
  import {signUp as FBSignUp} from '../config/firebase';
  import {useRouter} from "vue-router";
  import {ref} from "vue";
  import {updateProfile} from "firebase/auth";
  
  export default {
    setup() {
      const router = useRouter(); // Initialize the router
      const email = ref('');
      const password = ref('');
      const username = ref('');
      const errorMessage = ref('');
      const signUp = async () => {
        try {
          const userCredential = await FBSignUp(email.value, password.value);
          const user = userCredential.user;
          // Update the profile with the username
          await updateProfile(user, {
            displayName: username.value
          });
          await router.push('/chat');
        } catch (error) {
          console.error('Error signing up:', error);
          errorMessage.value = error.message;
        }
      };
  
      return { email, password, username, errorMessage, signUp };
    }
  };
  </script>
  <style scoped>
  .signup-container {
    max-width: 300px;
    margin: 50px auto;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  input[type="email"], input[type="password"], input[type="text"] {
    width: 100%;
    padding: 8px;
    margin: 10px 0;
    box-sizing: border-box;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>