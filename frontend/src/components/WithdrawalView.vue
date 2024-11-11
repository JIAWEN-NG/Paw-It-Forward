<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center">Loading withdrawals...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Status Filter -->
    <div class="mb-3">
      <label for="statusFilter" class="form-label">Filter by Status:</label>
      <select id="statusFilter" v-model="selectedStatus" @change="filterWithdrawals" class="form-select">
        <option value="">All</option>
        <option value="Approved">Approved</option>
        <option value="Pending">Pending</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>

    <div v-if="!loading && filteredWithdrawals.length > 0" class="table-responsive-md">
      <table class="compact-table table">
        <thead>
          <tr>
            <th>Post Title</th>
            <th>Amount Withdrawn</th>
            <th>Status</th>
            <th>Date Requested</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="withdrawal in paginatedWithdrawals" :key="withdrawal.id">
            <td>{{ getPostTitle(withdrawal.postId) }}</td>
            <td>{{ formatCurrency(withdrawal.amountWithdraw) }}</td>
            <td :class="{'text-success': withdrawal.status === 'Approved', 'text-danger': withdrawal.status === 'Rejected'}">{{ withdrawal.status }}</td>
            <td>{{ formatDate(withdrawal.requestedAt) }}</td>
            <td>
              <button 
                class="btn btn-outline-primary btn-sm btn-viewdetail" 
                @click="viewDetails(withdrawal)"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && filteredWithdrawals.length === 0" class="alert alert-warning text-center">
      No withdrawals found.
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

    <!-- Modal for Viewing Details -->
    <div v-if="selectedWithdrawal" class="modal modal-centered" tabindex="-1" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Withdrawal Details</h5>
            <button type="button" class="close" @click="selectedWithdrawal = null">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <label><strong>Proof Image:</strong></label>
            <img 
              v-if="selectedWithdrawal.proofImg" 
              :src="selectedWithdrawal.proofImg" 
              alt="Proof Image" 
              class="thumbnail mb-3"
            />
            <p><strong>Withdrawal Reason:</strong> {{ selectedWithdrawal.reason }}</p>
            <p v-if="selectedWithdrawal.status === 'Pending'"><strong>Status:</strong> This withdrawal is still being processed.</p>
            <p v-if="selectedWithdrawal.status !== 'Rejected' && selectedWithdrawal.status !== 'Pending'"><strong>Processed At:</strong> {{ formatDate(selectedWithdrawal.processedAt) }}</p>
            <p v-if="selectedWithdrawal.status === 'Approved'"><strong>Transaction ID:</strong> {{ selectedWithdrawal.transactionId }}</p>
            <p v-if="selectedWithdrawal.status === 'Rejected'"><strong>Rejection Reason:</strong> {{ selectedWithdrawal.rejectionReason }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="selectedWithdrawal = null">Close</button>
          </div>
        </div>
      </div>
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
      filteredWithdrawals: [],
      fundraisingPosts: {},
      loading: false,
      error: null,
      currentPage: 1,
      itemsPerPage: 5,
      selectedStatus: '',
      selectedWithdrawal: null,
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.filteredWithdrawals.length / this.itemsPerPage);
    },
    paginatedWithdrawals() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredWithdrawals.slice(start, end);
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
        const response = await axios.get(`${this.$api_url}/fundraising/user/${authState.userId}`);
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
        const response = await axios.get(`${this.$api_url}/withdrawals/${authState.userId}`);
        if (response.status === 200) {
          this.withdrawals = response.data.map(withdrawal => {
            return {
              ...withdrawal,
              requestedAt: withdrawal.requestedAt ? new Date(withdrawal.requestedAt) : null,
            };
          }).sort((a, b) => b.requestedAt - a.requestedAt);
          this.filteredWithdrawals = [...this.withdrawals];
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
        console.warn('Invalid date:', date);
        return 'N/A';
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
    },

    viewDetails(withdrawal) {
      this.selectedWithdrawal = withdrawal;
    },

    filterWithdrawals() {
      if (this.selectedStatus) {
        this.filteredWithdrawals = this.withdrawals.filter(withdrawal => withdrawal.status === this.selectedStatus);
      } else {
        this.filteredWithdrawals = [...this.withdrawals];
      }
      this.currentPage = 1;
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
.table-responsive-md {
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.table-responsive::-webkit-scrollbar {
  display: none;
}

@media (min-width: 768px) {
  .table-responsive-md {
    overflow-x: visible;
  }
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
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 6px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
}
#statusFilter{
  width:10%;
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

.modal-centered .modal-dialog {
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.text-success {
  color: green;
}

.text-danger {
  color: red;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn.btn-outline-primary.btn-viewdetail:hover {
  background-color: #1280c9; 
  color: #fff; 
  border-color: #1280c9; 
}
</style>
