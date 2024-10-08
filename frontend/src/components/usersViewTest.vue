<template>
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
import { getAllUsers } from '../services/userService.js'; // Adjust the path if necessary

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
</style>
