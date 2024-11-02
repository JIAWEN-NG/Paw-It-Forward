<template>
    <div class="container-fluid py-4">
      <!-- Header with Navigation -->
      <header class="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <nav>
          <a href="#" class="me-3 text-decoration-none text-dark">Registration</a>
          <a href="#" class="text-decoration-none text-dark">Donations</a>
        </nav>
      </header>
  
      <!-- Tabs for User Status and Donation Requests -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="{ active: activeTab !== 'Donations' }"
            @click="activeTab = 'Pending'"
          >
            User Registration
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="{ active: activeTab === 'Donations' }"
            @click="activeTab = 'Donations'"
          >
            Donations
          </button>
        </li>
      </ul>
  
      <!-- Conditional Rendering Based on Active Tab -->
      <div v-if="activeTab !== 'Donations'">
        <!-- User Registration Tabs for Pending, Approved, and Rejected Users -->
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <button 
              class="nav-link" 
              :class="{ active: activeTab === 'Pending' }"
              @click="activeTab = 'Pending'"
            >
              Pending Users
            </button>
          </li>
          <li class="nav-item">
            <button 
              class="nav-link" 
              :class="{ active: activeTab === 'Approved' }"
              @click="activeTab = 'Approved'"
            >
              Approved Users
            </button>
          </li>
          <li class="nav-item">
            <button 
              class="nav-link" 
              :class="{ active: activeTab === 'Rejected' }"
              @click="activeTab = 'Rejected'"
            >
              Rejected Users
            </button>
          </li>
        </ul>
        <div class="table-responsive">
          <UserApproval 
            :status="activeTab"
            :users="users"
            @approve="approveUser"
            @reject="rejectUser"
            @view="viewUser"
          />
        </div>
      </div>
  
      <!-- Donation Requests Section -->
      <div v-if="activeTab === 'Donations'">
        <div class="table-responsive">
          <DonationRequests 
            :requests="donationRequests"
            @transfer="transferDonation"
            @reject="rejectDonation"
            @view="viewDonation"
          />
        </div>
      </div>
    </div>
  </template>
  
<script>
import UserApproval from './UserApproval.vue';
import DonationRequests from './DonationRequest.vue';
import axios from 'axios';

export default {
  components: {
    UserApproval,
    DonationRequests,
  },
  data() {
    return {
      activeTab: 'Pending', // Default to Pending Users
      users: [],
      donationRequests: [],
    };
  },
  methods: {
    // Fetch users based on their status
    async fetchUsers(status) {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/users?status=${status}`);
        this.users = response.data;
      } catch (error) {
        console.error(`Error fetching ${status} users:`, error);
      }
    },
    
    // Fetch donation requests
    async fetchDonationRequests() {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/donations');
        this.donationRequests = response.data;
      } catch (error) {
        console.error('Error fetching donation requests:', error);
      }
    },

    // Approve user
    async approveUser(userId) {
      try {
        await axios.put(`http://localhost:8000/api/admin/users/${userId}/approve`);
        this.fetchUsers(this.activeTab);
      } catch (error) {
        console.error('Error approving user:', error);
      }
    },

    // Reject user with reason
    async rejectUser(userId) {
      const reason = prompt("Enter rejection reason:");
      if (reason) {
        try {
          await axios.put(`http://localhost:8000/api/admin/users/${userId}/reject`, { reason });
          this.fetchUsers(this.activeTab);
        } catch (error) {
          console.error('Error rejecting user:', error);
        }
      }
    },

    // View user details (optional implementation)
    viewUser(userId) {
      console.log('View user details:', userId);
      // Display modal with user details (if required)
    },

    // Transfer donation request
    async transferDonation(requestId) {
      try {
        await axios.put(`http://localhost:8000/api/admin/donations/${requestId}/transfer`);
        this.fetchDonationRequests();
      } catch (error) {
        console.error('Error transferring donation:', error);
      }
    },

    // Reject donation request
    async rejectDonation(requestId) {
      const reason = prompt("Enter rejection reason:");
      if (reason) {
        try {
          await axios.put(`http://localhost:8000/api/admin/donations/${requestId}/reject`, { reason });
          this.fetchDonationRequests();
        } catch (error) {
          console.error('Error rejecting donation:', error);
        }
      }
    },

    // View donation request details (optional implementation)
    viewDonation(requestId) {
      console.log('View donation details:', requestId);
      // Display modal with donation details (if required)
    },
  },
  watch: {
    // Fetch users based on active user status tab
    activeTab(newTab) {
      if (newTab === 'Donations') {
        this.fetchDonationRequests();
      } else {
        this.fetchUsers(newTab);
      }
    },
  },
  mounted() {
    this.fetchUsers(this.activeTab); // Initial fetch for 'Pending' users
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