<template>
  <div class="account-page">
    <h1>Account Information</h1>
    
    <SuccessAlert 
      v-if="showSuccessAlert" 
      :message="successMessage" 
      ref="successAlert" 
    />

    <div class="profile-section">
      <div class="profile-photo-container">
        <img 
          :src="currentUser.profileImage || defaultProfileImage" 
          alt="Profile Picture" 
          class="profile-image" 
        />
        <div class="change-photo-overlay">
          <button @click="showPhotoUploadModal = true" class="change-photo-button">Change Photo</button>
        </div>
      </div>
      <!-- Role Display -->
      <p class="role-display">{{ formattedRole }}</p>
    </div>
    <div class="details-section">
      <div class="detail-item">
        <span class="detail-title">Name:</span>
        <span class="detail-value">{{ currentUser.name || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-title">Email:</span>
        <span class="detail-value">{{ currentUser.email || 'N/A' }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-title">Pet Description:</span>
        <span class="detail-value">{{ currentUser.petDescription || 'N/A' }}</span>
      </div>
    </div>
    <!-- Edit Profile Button -->
    <button @click="showEditProfileModal = true" class="edit-profile-button">Edit Profile</button>
    
    <!-- Modals -->
    <PhotoUploadModal 
      v-if="showPhotoUploadModal" 
      :showModal="showPhotoUploadModal" 
      :userId="currentUser.id"
      @close="showPhotoUploadModal = false" 
      @save="handlePhotoUpload" 
    />
    <EditProfileModal 
      v-if="showEditProfileModal" 
      :showModal="showEditProfileModal" 
      @close="showEditProfileModal = false" 
      @save="handleProfileUpdate" 
      :currentUser="currentUser" 
    />
  </div>
</template>

<script>
import axios from 'axios';
import PhotoUploadModal from './PhotoUploadModal.vue';
import EditProfileModal from './EditProfileModal.vue';
import SuccessAlert from './SuccessAlert.vue'; // Import SuccessAlert component
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  name: 'UserAccount',
  components: { PhotoUploadModal, EditProfileModal, SuccessAlert },
  data() {
    return {
      currentUser: {
        id: '',
        role: '',
        profileImage: '',
        petDescription: '',
        name: '',
        email: '',
      },
      defaultProfileImage: require('@/assets/noprofilepic.png'),
      showPhotoUploadModal: false,
      showEditProfileModal: false,
      successMessage: '', // To hold the success message
      showSuccessAlert: false // To control the visibility of the success alert
    };
  },
  computed: {
    formattedRole() {
      return this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1);
    }
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      const userId = "TqTbV83gxtSTiGczXzybbyJR0AC2"; 
      console.log("Fetching data for user ID:", userId);

      try {
        const response = await axios.get(`http://localhost:8000/api/user/${userId}`);
        console.log("Fetched user data from backend:", response.data);
        this.currentUser = { id: userId, ...response.data };
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
      }
    },
    async handlePhotoUpload(newPhotoURL) {
      console.log("New photo uploaded:", newPhotoURL);
      this.currentUser.profileImage = newPhotoURL;

      // Update Firestore with the new profile image URL
      try {
        const userRef = doc(db, 'Users', this.currentUser.id);
        await updateDoc(userRef, {
          profileImage: newPhotoURL
        });
        console.log("Profile image updated in Firestore");
      } catch (error) {
        console.error("Error updating profile image in Firestore:", error.message);
      }

      // Show success message
      this.successMessage = "Your account has been updated"; // Set the success message
      this.showSuccessAlert = true; // Show the success alert
      this.$refs.successAlert.show(); // Call the show method on the SuccessAlert component
      this.showPhotoUploadModal = false; // Close the modal after saving
    },
    handleProfileUpdate(updatedInfo) {
      console.log("Profile updated with:", updatedInfo);
      this.showEditProfileModal = false;
      this.currentUser = { ...this.currentUser, ...updatedInfo };
      
      // Show success message
      this.successMessage = "Your account has been updated"; // Set the success message
      this.showSuccessAlert = true; // Show the success alert
      this.$refs.successAlert.show(); // Call the show method on the SuccessAlert component
    },
  },
};
</script>

<style scoped>
.account-page {
  max-width: 600px;
  margin: auto;
  padding: 20px;
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
  transform: scale(1.1); /* Slight expansion on hover */
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
  background-color: white;
  color: #333;
}

/* Role Display */
.role-display {
  margin-top: 10px;
  font-style: italic;
  color: #666; /* Lighter black color */
}

/* Edit Profile Button */
.edit-profile-button {
  background-color: transparent;
  color: #4CAF50;
  padding: 10px 20px;
  border: 1px solid #4CAF50;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.edit-profile-button:hover {
  background-color: #4CAF50;
  color: white;
}

.details-section {
  border-top: 1px solid #ccc;
  padding-top: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  padding: 40px 0; /* Updated padding */
  border-bottom: 1px solid #eee;
}

.detail-title {
  font-weight: bold;
  color: #333;
}

.detail-value {
  color: #555;
}
</style>
