<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center">Loading withdrawals...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && paginatedWithdrawals.length > 0" class="table-responsive">
      <table class="compact-table table">
        <thead>
          <tr>
            <th>Proof Image</th>
            <th>Post Title</th>
            <th>Amount Withdrawn</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Date Requested</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="withdrawal in paginatedWithdrawals" :key="withdrawal.id">
            <td>
              <img :src="withdrawal.proofImg || 'https://via.placeholder.com/100'" alt="Proof Image" class="thumbnail" />
            </td>
            <td>{{ getPostTitle(withdrawal.postId) }}</td>
            <td>{{ formatCurrency(withdrawal.amountWithdraw) }}</td>
            <td>{{ withdrawal.reason }}</td>
            <td>{{ withdrawal.status }}</td>
            <td>{{ formatDate(withdrawal.requestedAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-container">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1" 
        class="btn btn-outline-primary pagination-button"
      >
        Previous
      </button>
      <span class="pagination-text">Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages" 
        class="btn btn-outline-primary pagination-button"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { authState } from '@/store/auth';

export default {
  data() {
    return {
      withdrawals: [],
      fundraisingPosts: {},
      loading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 5,
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.withdrawals.length / this.itemsPerPage);
    },
    paginatedWithdrawals() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.withdrawals.slice(start, end);
    }
  },

  async created() {
    try {
      await this.fetchFundraisingPosts();
      await this.fetchWithdrawals();
    } catch (error) {
      console.error('Error during component creation:', error);
      this.error = 'An unexpected error occurred.';
    }
  },

  methods: {
    async fetchFundraisingPosts() {
      try {
        const response = await axios.get(`http://localhost:8000/api/fundraising/user/${authState.userId}`);
        if (response.status === 200) {
          response.data.forEach(post => {
            this.fundraisingPosts[post.id] = post.title;
          });
        } else {
          this.error = 'No fundraising posts found.';
        }
      } catch (error) {
        console.error('Error fetching fundraising posts:', error);
        this.error = error.response?.data?.message || 'Failed to fetch related fundraising posts.';
      }
    },

    async fetchWithdrawals() {
      if (!authState.isUserLoggedIn || !authState.userId) {
        this.error = 'User is not authenticated.';
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`http://localhost:8000/api/withdrawals/${authState.userId}`);
        if (response.status === 200) {
          this.withdrawals = response.data.map(withdrawal => {
            // Log each withdrawal to check the structure
            console.log('Withdrawal object:', withdrawal);

            return {
              ...withdrawal,
              requestedAt: withdrawal.requestedAt
                ? new Date(withdrawal.requestedAt) // Directly parse the ISO string
                : null, // Ensure null if the date is missing or invalid
            };
          }).sort((a, b) => b.requestedAt - a.requestedAt); // Sort by latest date first

          // Log to ensure dates are correctly parsed
          console.log('Formatted withdrawals:', this.withdrawals);
        } else {
          this.error = 'No withdrawals found.';
        }
      } catch (error) {
        console.error('Error fetching withdrawals:', error);
        this.error = error.response?.data?.message || 'Failed to fetch withdrawals. Please try again later.';
      } finally {
        this.loading = false;
      }
    },

    getPostTitle(postId) {
      return this.fundraisingPosts[postId] || 'Unknown Post';
    },

    formatDate(date) {
      if (!date) {
        console.warn('Invalid date:', date); // Log to see which dates are invalid
        return 'N/A'; // Provide a fallback if the date is invalid
      }
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(date).toLocaleDateString('en-GB', options);
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
  }
};
</script>

<style scoped>

.compact-table {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 0 10px;
}
.table-responsive {
  overflow-x: auto;
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

.table-responsive::-webkit-scrollbar {
  display: none;
}


th, td {
  padding: 12px 16px;
  text-align: left;
  vertical-align: middle;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th {
  background-color: #f1f1f1;
  color: #333;
  font-weight: 600;
}

tbody tr {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

tbody tr:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}
.pagination-button {
  border: 1px solid #2c3e50;
  color: #2c3e50;
  border-radius: 5px;
  padding: 6px 12px;
}
.btn-outline-primary {
  color: #2c3e50;
  border-color: #2c3e50;
}

.btn-outline-primary:hover {
  background-color: #2c3e50;
  color: #fff;
}
</style>
