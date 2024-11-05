<template>
  <div class="account-page">
    <h1>Account Information</h1>
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
import { doc, updateDoc } from 'firebase/firestore'; // Ensure these are imported correctly
import { db } from '@/firebase'; // Import your Firestore instance

export default {
  name: 'UserAccount',
  components: { PhotoUploadModal, EditProfileModal },
  data() {
    return {
      currentUser: {
        id: '', // Ensure id is part of the currentUser object
        role: '',
        profileImage: '',
        petDescription: '',
        name: '',
        email: '',
      },
      defaultProfileImage: require('@/assets/noprofilepic.png'), // Default image if no profile image is available
      showPhotoUploadModal: false, // Controls the visibility of the Photo Upload Modal
      showEditProfileModal: false, // Controls the visibility of the Edit Profile Modal
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
      const userId = "TqTbV83gxtSTiGczXzybbyJR0AC2"; // Firestore user ID
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
      this.currentUser.profileImage = newPhotoURL; // Update the profile image in local state

      // Now update Firestore with the new profile image URL
      try {
        const userRef = doc(db, 'Users', this.currentUser.id); // Create a reference to the user's document
        await updateDoc(userRef, {
          profileImage: newPhotoURL // Update the user's profile image URL
        });
        console.log("Profile image updated in Firestore");
      } catch (error) {
        console.error("Error updating profile image in Firestore:", error.message);
      }

      this.showPhotoUploadModal = false; // Close the modal after saving
    },
    handleProfileUpdate(updatedInfo) {
      console.log("Profile updated with:", updatedInfo);
      this.showEditProfileModal = false; // Close the modal after saving
      this.currentUser = { ...this.currentUser, ...updatedInfo }; // Update user data
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
