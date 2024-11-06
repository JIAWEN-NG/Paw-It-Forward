<!-- ManageMarketplace.vue -->
<!-- has to be a scrollable function within ManagePostView's marketplace toggle background area  -->

<template>
  <div class="container py-4">
    <!-- Notification for Success and Error Messages -->
    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ successMessage }}
      <button type="button" class="btn-close" @click="clearMessage" aria-label="Close"></button>
    </div>
    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ errorMessage }}
      <button type="button" class="btn-close" @click="clearMessage" aria-label="Close"></button>
    </div>
    <div v-if="listings && listings.length">
      <table class="compact-table">
        <thead>
          <tr>
            <th>My Posts</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="listing in paginatedListings" :key="listing.id">
            <td>
              <div class="listing-container">
                <img :src="listing.itemImage" alt="Item Image" class="thumbnail" v-if="listing.itemImage" />
                <div class="listing-details">
                  <p id="title">{{ listing.itemsDonated }} | {{ listing.petType }}</p>
                  <p class="small-text">{{ listing.itemCategory }}</p>
                  <p class="small-text">{{ listing.condition }}</p>
                  <p class="small-text">{{ listing.location || 'Location Unknown' }}</p>
                  <p class="small-text">Posted {{ formatDate(listing.createdAt) }}</p>
                </div>
              </div>
            </td>
            <td>
              <button @click="openEditForm(listing)" class="btn btn-outline-secondary btn-sm">Edit</button>
              <button @click="confirmDeleteListing(listing.id)" class="btn btn-outline-danger btn-sm">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No listings available.</p>
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

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this listing?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteModal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteListing">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Form Modal -->
    <div v-if="showForm" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <span class="close" @click="closeEditForm">&times;</span>
          <h5 class="modal-title text-center">Edit Listing</h5>
          <div class="modal-body">
            <form @submit.prevent="updateListing">
              <div class="form-group mb-3">
                <label for="itemsDonated" class="form-label">Item Description</label>
                <textarea
                  v-model="listing.itemsDonated"
                  id="itemsDonated"
                  class="form-control"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div class="form-group mb-3">
                <label for="itemCategory" class="form-label">Item Category</label>
                <select v-model="listing.itemCategory" id="itemCategory" class="form-control" required>
                  <option value="" disabled>Select Category</option>
                  <option value="Food & Feeding Supplies">Food & Feeding Supplies</option>
                  <option value="Toys">Toys</option>
                  <option value="Bedding & Furniture">Bedding & Furniture</option>
                  <option value="Grooming & Hygiene">Grooming & Hygiene</option>
                  <option value="Clothing & Accessories">Clothing & Accessories</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Travel & Carriers">Travel & Carriers</option>
                </select>
              </div>
              
              <div class="form-group mb-3">
                <label for="condition" class="form-label">Condition</label>
                <select v-model="listing.condition" id="condition" class="form-control" required>
                  <option value="" disabled>Select Condition</option>
                  <option value="Brand New">Brand New</option>
                  <option value="Slightly Used">Slightly Used</option>
                  <option value="Well Used">Well Used</option>
                </select>
              </div>

              <div class="form-group mb-3">
                <label for="petType" class="form-label">Pet Type</label>
                <select v-model="listing.petType" id="petType" class="form-control" required>
                  <option value="" disabled>Select Pet Type</option>
                  <option value="Cat">Cat</option>
                  <option value="Dog">Dog</option>
                </select>
              </div>

              <div class="form-group mb-3">
                <label for="location" class="form-label">Location</label>
                <select v-model="listing.location" id="location" class="form-control" required>
                  <option value="" disabled>Select Location</option>
                  <option value="West">West</option>
                  <option value="East">East</option>
                  <option value="Central">Central</option>
                  <option value="North">North</option>
                  <option value="North-east">North-east</option>
                </select>
              </div>

              <div class="form-group mb-3">
                <label for="imageUpload" class="form-label">Upload New Picture (Optional)</label>
                <div class="image-upload-box" @click="triggerFileInput">
                  <img v-if="imagePreview || listing.itemImage" :src="imagePreview || listing.itemImage" class="image-preview" />
                  <span v-else class="placeholder">No Image Uploaded</span>
                </div>
                <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" ref="fileInput" style="display: none;" />
                <button type="button" @click="triggerFileInput" class="btn btn-secondary upload-button">{{ listing.itemImage ? 'Reupload' : 'Choose File' }}</button>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeEditForm">Cancel</button>
                <button type="submit" class="btn btn-success" :disabled="submitting">{{ submitting ? 'Saving...' : 'Save Changes' }}</button>
              </div>
            </form>
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
      listings: [],
      showForm: false,
      showDeleteModal: false, // Control delete modal visibility
      deleteListingId: null,   // Store ID of the listing to delete
      listing: { id: '', itemCategory: '', condition: '', petType: '', itemsDonated: '', itemImage: '', location: '' },
      imagePreview: '',
      selectedImageFile: null,
      currentPage: 1,
      itemsPerPage: 5,
      successMessage: '',
      errorMessage: ''
    };
  },
  async created() {
    if (authState.isUserLoggedIn) {
      await this.fetchListings(authState.userId);
    } else {
      console.error("User is not logged in.");
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.listings.length / this.itemsPerPage);
    },
    paginatedListings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.listings.slice(start, end);
    },
  },
  methods: {
    confirmDeleteListing(id) {
      this.deleteListingId = id;
      this.showDeleteModal = true; // Show confirmation modal
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deleteListingId = null;
    },
    async deleteListing() {
      try {
        await axios.delete('http://localhost:8000/api/marketplace', {
          data: { 
            id: this.deleteListingId,  // Use stored ID for deletion
            userId: authState.userId
          }
        });
        this.listings = this.listings.filter(l => l.id !== this.deleteListingId);
        this.setSuccessMessage('Listing deleted successfully.');
      } catch (error) {
        this.setErrorMessage('Failed to delete the listing. Please try again.');
      } finally {
        this.closeDeleteModal(); // Close modal and reset ID
      }
    },
    setSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => { this.successMessage = ''; }, 3000);
    },
    setErrorMessage(message) {
      this.errorMessage = message;
      setTimeout(() => { this.errorMessage = ''; }, 3000);
    },
    clearMessage() {
      this.successMessage = '';
      this.errorMessage = '';
    },
    async fetchListings(userId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/marketplace/${userId}`);
        this.listings = response.data
          .map(listing => ({ ...listing, createdAt: new Date(listing.createdAt) }))
          .sort((a, b) => b.createdAt - a.createdAt);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    },
    formatDate(date) {
      if (!date) return '';
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(date).toLocaleDateString('en-GB', options);
    },
    openEditForm(listing) {
      this.listing = { ...listing };
      this.showForm = true;
    },
    closeEditForm() {
      this.showForm = false;
      this.listing = { id: '', itemCategory: '', condition: '', petType: '', itemsDonated: '', itemImage: '' };
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.selectedImageFile = file;
      this.imagePreview = URL.createObjectURL(file); // Show the preview
    },
    async updateListing() {
      this.submitting = true;
      try {
        const formData = new FormData();
        formData.append('id', this.listing.id);
        formData.append('itemsDonated', this.listing.itemsDonated);
        formData.append('itemCategory', this.listing.itemCategory);
        formData.append('condition', this.listing.condition);
        formData.append('petType', this.listing.petType);
        formData.append('location', this.listing.location);
        if (this.selectedImageFile) {
          formData.append('image', this.selectedImageFile);
        }
        formData.append('userId', authState.userId);

        const response = await axios.put('http://localhost:8000/api/marketplace', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        this.listings = this.listings.map(l => (l.id === this.listing.id ? { ...l, ...response.data.updatedListing } : l));
        this.showForm = false;
        this.setSuccessMessage('Listing updated successfully.');
      } catch (error) {
        console.error('Failed to update the listing:', error.response || error.message);
        this.setErrorMessage('Failed to update the Marketplace listing. Please try again.');
      } finally {
        this.submitting = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
};
</script>


<style scoped>
/* .scrollable-container {
  max-height: 500px;
  padding: 20px;
  border-radius: 8px;
} */

.compact-table {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 0 10px; /* Add vertical space between rows */
}

th, td {
  padding: 12px 16px; /* Increased padding for better readability */
  text-align: left;
  vertical-align: middle;
  background-color: #ffffff; /* White background for cells */
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Light shadow for depth */
}

th {
  background-color: #f1f1f1; /* Slightly darker background for headers */
  color: #333; /* Dark text for headers */
  font-weight: 600;
}

tbody tr {
  transition: transform 0.2s ease;
}

tbody tr:hover {
  transform: scale(1.01); /* Slight scale-up on hover for emphasis */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.listing-container {
  display: flex;
  align-items: stretch; /* Make items take full height of the container */
  gap: 15px; /* Spacing between image and text */
}

.thumbnail {
  width: 100px; /* Fixed width */
  height: 100px; /* Remove fixed height */
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd; /* Light border for images */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for images */
  flex-shrink: 0;
}

.listing-details p {
  margin: 2px 0; /* Less margin between lines for a compact look */
  font-size: 0.9rem;
  color: #555; /* Soft gray text color */
}

/* Button styling for a cleaner look */
button {
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

button.btn-secondary:hover {
  background-color: #5a6268;
}

button.btn-danger {
  background-color: #dc3545;
  color: #fff;
}

button.btn-danger:hover {
  background-color: #c82333;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding: 10px;
}

.modal-content {
  border-radius: 8px;
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  position: relative;
}

.modal-body {
  max-height: 60vh;
  overflow-y: auto;
  padding: 20px;
}

.modal-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}



.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.image-upload-box {
  width: 100%;
  height: 200px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  background-color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

#title {
  font-weight: bold;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  
}
.pagination-button {
  border: 1px solid #2c3e50; /* Ensures a visible border */
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

.form-label {
  font-weight: 500;
  color: #2c3e50;
  display: block;
  text-align: left;
}

.form-control {
  border-radius: 5px;
  border: 1px solid #ced4da;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-control:focus {
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  border-color: #80bdff;
}

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 15px;
}

.upload-button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width:35%;
}


.action-buttons {
  display: flex;
  gap: 5px; 
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
}

</style>