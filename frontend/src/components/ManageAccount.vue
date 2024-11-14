<template>
  <div class="account-page">
    <div class="card-container">
      <h1 class="page-title">Edit Profile</h1>
      
      <!-- Inline Success Alert -->
      <div v-if="showSuccessAlert" class="success-alert">
        <p>{{ successMessage }}</p>
      </div>

      <div v-if="isLoading" class="loading-spinner">
        <span class="sr-only">Loading...</span>
      </div>

      <template v-else-if="currentUserData">
        <div class="profile-section">
          <div class="profile-photo-container">
            <img 
              :src="currentUserData.profileImage || defaultProfileImage" 
              alt="Profile Picture" 
              class="profile-image" 
            />
            <div class="change-photo-overlay">
              <button 
                @click="showPhotoUploadModal = true" 
                class="change-photo-button"
              >
                Change Photo
              </button>
            </div>
          </div>
        </div>

        <div class="details-section">
          <div class="detail-item">
            <span class="detail-title">Name</span>
            <span class="detail-value">{{ currentUserData.name || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-title">Email</span>
            <span class="detail-value">{{ currentUserData.email || 'N/A' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-title">My Pet Description</span>
            <span class="detail-value">{{ currentUserData.petDescription || 'N/A' }}</span>
          </div>
          <button @click="showEditProfileModal = true" class="edit-profile-button">Edit Profile</button>
        </div>
      </template>

      <p v-else>No user data available. Please sign in.</p>

      <!-- Edit Profile Modal -->
      <EditProfileModal 
        v-if="showEditProfileModal" 
        :showModal="showEditProfileModal" 
        :currentUser="currentUserData"
        :userId="userId" 
        @close="showEditProfileModal = false" 
        @save="handleProfileUpdate"
        @showSuccess="setSuccessMessage"
      />

      <PhotoUploadModal 
        v-if="showPhotoUploadModal" 
        :showModal="showPhotoUploadModal" 
        :userId="userId"
        :userProfilePicUrl="currentUserData?.profileImage"
        @close="showPhotoUploadModal = false" 
        @uploadSuccess="handlePhotoUploadSuccess"
        @showSuccess="setSuccessMessage"
      />
    </div>
  </div>
</template>

<script>
import { auth, db } from '../main';
import { doc, getDoc } from 'firebase/firestore';
import { authState } from '../store/auth.js';
import defaultProfileImage from '@/assets/noprofilepic.png';
import EditProfileModal from './EditProfileModal.vue';
import PhotoUploadModal from './PhotoUploadModal.vue';

export default {
  name: 'ManageAccount',
  components: {
    EditProfileModal,
    PhotoUploadModal
  },
  data() {
    return {
      userId: null,
      userRole: null,
      userProfilePicUrl: null,
      currentUserData: null,
      defaultProfileImage,
      showSuccessAlert: false,
      successMessage: '',
      showEditProfileModal: false,
      showPhotoUploadModal: false,
      isLoading: true
    };
  },
  computed: {
    formattedRole() {
      return this.currentUserData && this.currentUserData.role
        ? this.currentUserData.role.charAt(0).toUpperCase() + this.currentUserData.role.slice(1)
        : 'N/A';
    },
  },
  created() {
    this.initializeUserData();
  },
  methods: {
    async initializeUserData() {
      this.isLoading = true;
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        await new Promise(resolve => {
          const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
          });
        });
      }

      if (auth.currentUser) {
        this.userId = auth.currentUser.uid;
        await this.fetchUserData();
      } else {
        console.error("No authenticated user found");
        this.isLoading = false;
      }
    },
    async fetchUserData() {
      try {
        const userDocRef = doc(db, "Users", this.userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          this.currentUserData = userDoc.data();
          console.log("Fetched user data:", this.currentUserData);

          // Update authState to reflect the current data
          authState.currentUserData = this.currentUserData;
          authState.userId = this.userId;
          authState.userRole = this.currentUserData.role;
          authState.userProfilePicUrl = this.currentUserData.profileImage;
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        this.isLoading = false;
      }
    },
    handleProfileUpdate(updatedInfo) {
      this.currentUserData = { ...this.currentUserData, ...updatedInfo };
    },
    handlePhotoUploadSuccess(newPhotoUrl) {
      this.currentUserData.profileImage = `${newPhotoUrl}?timestamp=${Date.now()}`;
      this.$forceUpdate();
    },
    setSuccessMessage(message) {
      console.log('Success message triggered:', message);
      this.successMessage = message;
      this.showSuccessAlert = true;

      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.success-alert {
  background-color: #d4edda;
  color: #155724;
  padding: 10px 20px;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  margin-bottom: 20px;
}

.profile-section {
  text-align: center;
  margin-bottom: 20px;
}

.profile-photo-container {
  position: relative;
  display: inline-block;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.change-photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-photo-container:hover .change-photo-overlay {
  opacity: 1;
}

.change-photo-button {
  background-color: transparent;
  color: white;
  padding: 8px 16px;
  border: 1px solid white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.change-photo-button:hover {
  background-color: darkgray;
  color: white;
}

.profile-photo-container:hover .change-photo-button {
  display: block;
}

.role-display {
  margin-top: 10px;
  font-style: italic;
  color: #666;
}

.details-section {
  border-top: 1px solid #ccc;
  padding-top: 0px;
}

.detail-item {
  background-color: white;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  padding: 30px;
  margin: 30px;
  border-bottom: 1px solid #eee;
}

.detail-title {
  font-weight: bold;
  color: #333;
}

.detail-value {
  color: #555;
}


.edit-profile-button {
  background: linear-gradient(135deg, #1f2e3d 0%, #3a506b 100%);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  margin-top: 20px;
  margin-left:auto;
  margin-right:auto;

  text-decoration: none;
}

.edit-profile-button:hover {
  background: linear-gradient(135deg, #2c3e50 0%, #506c8a 100%);
  transform: translateY(-2px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.account-page {
  background: linear-gradient(103deg, rgba(252, 238, 213, 0.6) 6.43%, rgba(252, 238, 213, 0.6) 78.33%, rgba(255, 231, 186, 0.6) 104.24%);
  padding: 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-container {
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 600px;
}

h1 {
  font-weight: bold;
  
}

.loading-spinner {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid #676672;
  border-radius: 50%;
  border-top-color: #1f2e3d;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
