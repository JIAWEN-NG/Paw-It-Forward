<template>
  <!-- Primary Tabs for User Verification and Withdrawal Requests -->
  <ul class="nav primary-nav-tabs mb-4">
    <li class="nav-item">
      <button class="nav-link" :class="{ active: activeTab !== 'Donations' }"
        @click="activeTab = 'Pending'; fetchUsers('Pending')">
        User Verification
      </button>
    </li>
    <li class="nav-item">
      <button class="nav-link" :class="{ active: activeTab === 'Donations' }"
        @click="activeTab = 'Donations'; fetchDonationRequests()">
        Withdrawal Requests
      </button>
    </li>
  </ul>

  <!-- User Verification Sub-Tabs with Card Style -->
  <div v-if="activeTab !== 'Donations'">
    <div class="card-tabs">
      <button class="tab-btn" :class="{ 'active': activeTab === 'Pending' }"
        @click="activeTab = 'Pending'; fetchUsers('Pending')">
        Pending Users
      </button>
      <button class="tab-btn" :class="{ 'active': activeTab === 'Approved' }"
        @click="activeTab = 'Approved'; fetchUsers('Approved')">
        Approved Users
      </button>
      <button class="tab-btn" :class="{ 'active': activeTab === 'Rejected' }"
        @click="activeTab = 'Rejected'; fetchUsers('Rejected')">
        Rejected Users
      </button>
    </div>

    <!-- Loading Indicator or Table Content for Users -->
    <div class="table-container" v-if="loadingUsers">
      <div class="spinner-container">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
    </div>
    <div class="table-container" v-else-if="filteredUsers.length === 0">
      <p class="no-data-message">{{ getNoDataMessage(activeTab, 'users') }}</p>
    </div>
    <div class="table-container" v-else>
      <UserApproval :status="activeTab" :users="filteredUsers" @approve="approveUser" @reject="rejectUser"
        @view="viewUser" />
    </div>
  </div>

  <!-- Withdrawal Requests Section with Card Style Tabs -->
  <div v-if="activeTab === 'Donations'">
    <div class="card-tabs">
      <button class="tab-btn" :class="{ 'active': withdrawalStatus === 'Pending' }"
        @click="withdrawalStatus = 'Pending'; fetchDonationRequests()">
        Pending
      </button>
      <button class="tab-btn" :class="{ 'active': withdrawalStatus === 'Approved' }"
        @click="withdrawalStatus = 'Approved'; fetchDonationRequests()">
        Approved
      </button>
      <button class="tab-btn" :class="{ 'active': withdrawalStatus === 'Rejected' }"
        @click="withdrawalStatus = 'Rejected'; fetchDonationRequests()">
        Rejected
      </button>
    </div>

    <!-- Loading Indicator or Table Content for Withdrawals -->
    <div class="table-container" v-if="loadingWithdrawals">
      <div class="spinner-container">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
    </div>
    <div class="table-container" v-else-if="filteredRequests.length === 0">
      <p class="no-data-message">{{ getNoDataMessage(withdrawalStatus, 'withdrawals') }}</p>
    </div>
    <div class="table-container" v-else>
      <WithdrawalRequests :requests="filteredRequests" @transfer="transferDonation" @reject="rejectDonation"
        @view="viewDonation" />
    </div>
  </div>
</template>


<script>
import UserApproval from './AdminUserApproval.vue';
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
      withdrawalStatus: 'Pending', // Default to Pending Withdrawals
      users: [],
      donationRequests: [],
      currentPage: 1,
      itemsPerPage: 10,
      loadingUsers: true, // Loading state for users
      loadingWithdrawals: true, // Loading state for withdrawals
    };
  },
  computed: {
    usersWithStatus() {
      // Map each user to add a derived `status` field based on conditions
      return this.users.map(user => {
        let status = '';
        if (!user.isPhotoVerified && user.rejectionReason === '') {
          status = 'Pending';
        } else if (user.isPhotoVerified) {
          status = 'Approved';
        } else if (!user.isPhotoVerified && user.rejectionReason) {
          status = 'Rejected';
        }
        return { ...user, status };
      });
    },
    filteredUsers() {
      // Filter users based on the derived `status` field
      return this.usersWithStatus.filter(user => user.status.toLowerCase() === this.activeTab.toLowerCase());
    },
    filteredRequests() {
      // Filter donation requests as before
      return this.donationRequests
        ? this.donationRequests
          .filter(request => (request.status || '').toLowerCase() === this.withdrawalStatus.toLowerCase())
          .slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage)
        : [];
    },
    totalPages() {
      const filteredLength = this.donationRequests
        ? this.donationRequests.filter(request => (request.status || '').toLowerCase() === this.withdrawalStatus.toLowerCase()).length
        : 0;
      return Math.ceil(filteredLength / this.itemsPerPage);
    },
  },


  methods: {
    viewUser(userId) {
      console.log('Viewing user details for:', userId);
      // Add your implementation here, such as opening a modal or showing user details
    }
    ,
    getNoDataMessage(status, type) {
      if (type === 'users') {
        return status === 'Pending' ? 'No pending requests' :
          status === 'Approved' ? 'No approved users' :
            'No rejected users';
      } else if (type === 'withdrawals') {
        return status === 'Pending' ? 'No pending withdrawals' :
          status === 'Approved' ? 'No approved withdrawals' :
            'No rejected withdrawals';
      }
    },
    async fetchUsers(status) {
      this.loadingUsers = true;
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/users?status=${status}`);
        this.users = response.data;
      } catch (error) {
        console.error(`Error fetching ${status} users:`, error);
      } finally {
        this.loadingUsers = false;
      }
    },
    async fetchDonationRequests() {
      this.loadingWithdrawals = true;
      try {
        const response = await axios.get('http://localhost:8000/api/admin/withdrawals');
        this.donationRequests = response.data;
      } catch (error) {
        console.error('Error fetching donation requests:', error);
      } finally {
        this.loadingWithdrawals = false;
      }
    },
    goToPage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    async approveUser(userId) {
      try {
        await axios.patch(`http://localhost:8000/api/admin/users/${userId}/approve`);
        this.fetchUsers(this.activeTab);
      } catch (error) {
        console.error('Error approving user:', error);
      }
    },
    async rejectUser(userId, reason) {
      if (reason) {
        try {
          await axios.patch(`http://localhost:8000/api/admin/users/${userId}/reject`, { rejectionReason: reason });
          this.fetchUsers(this.activeTab);
        } catch (error) {
          console.error('Error rejecting user:', error);
        }
      }
    },
    async transferDonation(requestId) {
      try {
        await axios.patch(`http://localhost:8000/api/admin/withdrawals/${requestId}/approve`);
        this.fetchDonationRequests(); // Refresh the list after approval
      } catch (error) {
        console.error('Error transferring donation:', error);
      }
    },

    async rejectDonation(requestId, reason) {
      if (reason) {
        try {
          await axios.patch(`http://localhost:8000/api/admin/withdrawals/${requestId}/reject`, { rejectionReason: reason });
          this.fetchDonationRequests();
        } catch (error) {
          console.error('Error rejecting donation:', error);
        }
      }
    },
    viewDonation(requestId) {
      console.log('View donation details:', requestId);
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
    withdrawalStatus() {
      this.currentPage = 1;
    },
  },
  mounted() {
    this.fetchUsers(this.activeTab);
  },
};
</script>


<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  /* Adjust height as needed to center vertically */
}

.spinner-container .fa-spinner {
  font-size: 2em;
  /* Adjust size as needed */
  color: #666;
  /* Optional: adjust color */
}

.no-data-message {

  text-align: center;
  padding: 20%;
  font-size: 1.2em;
  color: #666;
}

/* Primary Nav Tabs - Top level (User Verification, Withdrawal Requests) */
.primary-nav-tabs .nav-link {
  font-weight: 600;
  color: #333;
  padding: 10px 20px;
  border: none;
  position: relative;
  background-color: transparent;
  transition: color 0.3s ease;
}

.primary-nav-tabs .nav-link.active {
  color: #ff6b35;
  /* Brighter orange color */
}

.primary-nav-tabs .nav-link.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #ff6b35;
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Card-Style Tabs */
.card-tabs {
  display: flex;
  gap: 1px;
  padding: 0 8px;
  background-color: #ffffff;
  border-bottom: 1px solid #ddd;
}

.tab-btn {
  padding: 10px 20px;
  font-size: 14px;
  color: #666;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  transition: background-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
  position: relative;
  top: 1px;
}

.tab-btn.active {
  background-color: #ffffff;
  color: #333;
  border: 1px solid #ddd;
  border-bottom: none;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
  /* Bring active tab to the front */
}

.tab-btn:not(.active):hover {
  background-color: #e9ecef;
  color: #333;
}

/* Table Container */
.table-container {
  padding: 0;
  margin-top: -1px;
  /* Align table container with active tab */
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
