<template>
  <div class="account-page">
    <h1 class="page-title">Edit My Profile</h1>
    
    <!-- Inline Success Alert -->
    <div v-if="showSuccessAlert==true" class="success-alert">
      <p>{{ successMessage }}</p>
    </div>

    <div class="profile-section" v-if="currentUserData">
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
      <p class="role-display"><b>Role:</b> {{ formattedRole }}</p>
      <p class="role-display"><b>User ID:</b> {{userId}}</p>
    </div>

    <div class="details-section" v-if="currentUserData">
      <div class="detail-item">
        <span class="detail-title">Name:</span>
        <span class="detail-value">{{ currentUserData.name || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-title">Email:</span>
        <span class="detail-value">{{ currentUserData.email || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-title">Pet Description:</span>
        <span class="detail-value">{{ currentUserData.petDescription || 'N/A' }}</span>
      </div>
      <button @click="showEditProfileModal = true" class="edit-profile-button">Edit Profile</button>
    </div>

    <p v-else>Loading user data...</p>

    <!-- Edit Profile Modal -->
    <EditProfileModal 
      v-if="showEditProfileModal" 
      :showModal="showEditProfileModal" 
      :currentUser="currentUserData" 
      @close="showEditProfileModal = false" 
      @save="handleProfileUpdate" 
    />

    <!-- Photo Upload Modal -->
   <PhotoUploadModal 
    v-if="showPhotoUploadModal" 
    :showModal="showPhotoUploadModal" 
    :userId="userId"
    @close="showPhotoUploadModal = false" 
    @uploadSuccess="handlePhotoUploadSuccess"
  />
  </div>
</template>

<script>
import { auth, db } from '../main'; // Ensure this is your Firebase Auth config
import { doc, getDoc } from 'firebase/firestore';
import { authState } from '../store/auth.js'; // Your global store for user data
import defaultProfileImage from '@/assets/noprofilepic.png'; // Import the default image at the top
import EditProfileModal from './EditProfileModal.vue'; // Import the EditProfileModal component
import PhotoUploadModal from './PhotoUploadModal.vue'; // Import the PhotoUploadModal component

export default {
  name: 'ManageAccount',
  components: {
    EditProfileModal,
    PhotoUploadModal
  },
  data() {
    return {
      userId: authState.userId || null, // Initialize with authState or null
      userRole: authState.userRole || null,
      userProfilePicUrl: authState.userProfilePicUrl || null,
      currentUserData: authState.currentUserData || null,
      defaultProfileImage, // Reference the imported image
      showSuccessAlert: false,
      successMessage: '',
      showEditProfileModal: false, // Control the modal visibility
      showPhotoUploadModal: false, // Control the photo upload modal visibility
      hoveringPhoto: false // Track hover state for profile photo
    };
  },
  computed: {
    formattedRole() {
      return this.currentUserData && this.currentUserData.role
        ? this.currentUserData.role.charAt(0).toUpperCase() + this.currentUserData.role.slice(1)
        : 'N/A';
    },
  },
  async mounted() {
    // Check if the userId is already set in authState; otherwise, get it from auth.currentUser
    console.log('Current user id: ', this.userId)
    if (!this.userId) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        this.userId = currentUser.uid;
        console.log("User ID set from auth.currentUser:", this.userId);
      } else {
        console.log("No authenticated user found");
        return;
      }
    }

    // Fetch the user data from Firestore
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
    }
  },
  methods: {
    handleProfileUpdate(updatedInfo) {
      console.log("Profile updated with:", updatedInfo);
      this.currentUserData = { ...this.currentUserData, ...updatedInfo };

      this.successMessage = "Your profile has been updated successfully.";
      this.showSuccessAlert = true;
      console.log('showSuccessAlert set to true');

      setTimeout(() => {
        this.showSuccessAlert = false;
        console.log('showSuccessAlert set to false after timeout');
      }, 3000);
    },
    handlePhotoUploadSuccess(newPhotoUrl) {
      this.currentUserData.profileImage = `${newPhotoUrl}?timestamp=${Date.now()}`;
      authState.userProfilePicUrl = this.currentUserData.profileImage;
      this.$forceUpdate();

      this.successMessage = "Profile photo updated successfully.";
      this.showSuccessAlert = true;

      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 3000);
    },
    watch: {
    'authState.userProfilePicUrl'(newUrl) {
      this.currentUserData.profileImage = newUrl;
    }
  }
},
}
</script>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}
.account-page {
  max-width: 600px;
  min-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center; /* Center the content */
}

.success-alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #d4edda;
  color: #155724;
  padding: 10px 20px;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  z-index: 1000;
  transition: opacity 0.5s ease;
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
  display: flex;
  justify-content: space-between;
  padding: 50px 0;
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
  background-color: transparent;
  color: #4CAF50;
  padding: 10px 20px;
  border: 1px solid #4CAF50;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.edit-profile-button:hover {
  background-color: #4CAF50;
  color: white;
}
</style>
