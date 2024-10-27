<!-- <template>
  <div>
    <h1>User List</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }} - {{ user.email }}
        </li>
      </ul>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
// Import the getAllUsers function from the service file
// import { getAllUsers } from '../services/userService.js'; // Adjust the path if necessary
import axios from 'axios';

export default {
  data() {
    return {
      users: [],          // To hold the list of users
      loading: true,      // Show loading state while fetching data
      error: null,        // To capture any error that occurs
    };
  },
  mounted() {
    // Fetch all users when the component is mounted
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        // Call the getAllUsers function to fetch user data
        const data = await getAllUsers();
        this.users = data; // Set the users data to the fetched response
      } catch (err) {
        this.error = `Failed to fetch users: ${err.message}`; // Capture error message
      } finally {
        this.loading = false; // Set loading to false when done
      }
    },
  },
};
</script>

<style>
.error {
  color: red;
}
</style> -->
<template>
  <div>
    <h1>User List</h1>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [], // Array to store users
    };
  },
  methods: {
    async fetchUsers() {
      try {
        // Make the API call using Axios
        const response = await this.$axios.get('/api/users'); // Adjust the endpoint based on your API
        this.users = response.data; // Store the response data in the users array
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
  },
  mounted() {
    // Call fetchUsers when the component is mounted
    this.fetchUsers();
  },
};
</script>

<style scoped>
/* Add any styling if needed */
</style>
