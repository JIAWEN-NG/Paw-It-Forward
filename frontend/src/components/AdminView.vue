<template>
  <div class="container-fluid py-4">
    <!-- Header with Navigation -->
    <header class="d-flex justify-content-between align-items-center mb-4">
      <h1>Admin Dashboard</h1>
    </header>

    <!-- Tabs for User Status and Donation Requests -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab !== 'Donations' }" @click="activeTab = 'Pending'">
          User Verification
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'Donations' }" @click="activeTab = 'Donations'">
          Withdrawal Requests
        </button>
      </li>
    </ul>

    <!-- Conditional Rendering Based on Active Tab -->
    <div v-if="activeTab !== 'Donations'">
      <!-- User Registration Tabs for Pending, Approved, and Rejected Users -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'Pending' }" @click="activeTab = 'Pending'">
            Pending Users
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'Approved' }" @click="activeTab = 'Approved'">
            Approved Users
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'Rejected' }" @click="activeTab = 'Rejected'">
            Rejected Users
          </button>
        </li>
      </ul>
      <div class="table-responsive">
        <UserApproval :status="activeTab" :users="users" @approve="approveUser" @reject="rejectUser" @view="viewUser" />
      </div>
    </div>

    <!-- Withdrawal Requests Section -->
    <div v-if="activeTab === 'Donations'">
      <div class="table-responsive">
        <WithdrawalRequests
          :requests="paginatedRequests"
          @transfer="transferDonation"
          @reject="rejectDonation"
          @view="viewDonation"
        />
      </div>

      <!-- Pagination Controls for Withdrawals -->
      <nav class="mt-4">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import UserApproval from './UserApproval.vue';
import WithdrawalRequests from './AdminWithdrawal.vue';
import axios from 'axios';

export default {
  components: {
    UserApproval,
    WithdrawalRequests,
  },
  data() {
    return {
      activeTab: 'Pending', // Default to Pending Users
      users: [],
      donationRequests: [],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    paginatedRequests() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.donationRequests.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.donationRequests.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchUsers(status) {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/users?status=${status}`);
        this.users = response.data;
      } catch (error) {
        console.error(`Error fetching ${status} users:`, error);
      }
    },
    async fetchDonationRequests() {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/withdrawals');
        this.donationRequests = response.data;
      } catch (error) {
        console.error('Error fetching donation requests:', error);
      }
    },
    goToPage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    async approveUser(userId) {
      try {
        await axios.put(`http://localhost:8000/api/admin/users/${userId}/approve`);
        this.fetchUsers(this.activeTab);
      } catch (error) {
        console.error('Error approving user:', error);
      }
    },
    async rejectUser(userId, reason) {
      if (reason) {
        try {
          await axios.put(`http://localhost:8000/api/admin/users/${userId}/reject`, { rejectionReason: reason });
          this.fetchUsers(this.activeTab);
        } catch (error) {
          console.error('Error rejecting user:', error);
        }
      }
    },
    async transferDonation(requestId) {
      try {
        await axios.put(`http://localhost:8000/api/admin/withdrawals/${requestId}/approve`);
        this.fetchDonationRequests(); // Refresh withdrawal list after approval
      } catch (error) {
        console.error('Error transferring donation:', error);
      }
    },
    async rejectDonation(requestId, reason) {
      if (reason) {
        try {
          await axios.put(`http://localhost:8000/api/admin/withdrawals/${requestId}/reject`, { rejectionReason: reason });
          this.fetchDonationRequests(); // Refresh withdrawal list after rejection
        } catch (error) {
          console.error('Error rejecting donation:', error);
        }
      }
    },
    viewDonation(requestId) {
      console.log('View donation details:', requestId);
      // Display modal with donation details (if required)
    },
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'Donations') {
        this.fetchDonationRequests();
      } else {
        this.fetchUsers(newTab);
      }
    },
  },
  mounted() {
    this.fetchUsers(this.activeTab);
  },
};
</script>


<style scoped>
.container-fluid {
  padding-left: 5vw;
  padding-right: 5vw;
  max-width: 100%;
}

.nav-tabs .nav-link {
  color: #007bff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-tabs .nav-link.active {
  background-color: #007bff;
  color: #fff;
}

.nav-link:hover {
  background-color: #e9ecef;
  color: #0056b3;
}

.table-responsive {
  max-width: 100%;
  overflow-x: auto;
}
</style>