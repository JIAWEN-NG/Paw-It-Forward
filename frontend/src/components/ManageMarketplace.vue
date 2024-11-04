<!-- ManageMarketplace.vue -->
<!-- has to be a scrollable function within ManagePostView's marketplace toggle background area  -->

<template>
  <div class="container">
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
                  <!-- Display itemsDonated and petType in one line -->
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
              <button @click="deleteListing(listing.id)" class="btn btn-outline-danger btn-sm">Delete</button>
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


    <!-- Edit Form Modal -->
    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <h2>Edit Listing</h2>
        <form @submit.prevent="updateListing">
          <div class="form-group">
            <label for="itemsDonated">Item Description</label>
            <textarea
              v-model="listing.itemsDonated"
              id="itemsDonated"
              class="form-control"
              rows="4"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label for="itemCategory">Item Category</label>
            <select v-model="listing.itemCategory" id="itemCategory" class="form-select" required>
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
          <div class="form-group">
            <label for="condition">Condition</label>
            <select v-model="listing.condition" id="condition" class="form-select" required>
              <option value="" disabled>Select Condition</option>
              <option value="Brand New">Brand New</option>
              <option value="Slightly Used">Slightly Used</option>
              <option value="Well Used">Well Used</option>
            </select>
          </div>
          <div class="form-group">
            <label for="petType">Pet Type</label>
            <select v-model="listing.petType" id="petType" class="form-select" required>
              <option value="" disabled>Select Pet Type</option>
              <option value="Cat">Cat</option>
              <option value="Dog">Dog</option>
            </select>
          </div>
          <!-- New Location Field -->
          <div class="form-group">
            <label for="location">Location</label>
            <select v-model="listing.location" id="location" class="form-select" required>
              <option value="" disabled>Select Location</option>
              <option value="West">West</option>
              <option value="East">East</option>
              <option value="Central">Central</option>
              <option value="North">North</option>
              <option value="North-east">North-east</option>
            </select>
          </div>
          <div class="form-group">
            <label for="imageUpload">Upload New Picture (Optional)</label>
            <div class="image-upload-box d-flex justify-content-center align-items-center" @click="triggerFileInput">
              <img v-if="imagePreview || listing.itemImage" :src="imagePreview || listing.itemImage" class="image-preview" />
              <span v-else class="placeholder text-muted">No Image Uploaded</span>
            </div>
            <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" ref="fileInput" style="display: none;" />
            <button type="button" @click="triggerFileInput" class="btn btn-secondary mt-2">{{ listing.itemImage ? 'Reupload' : 'Choose File' }}</button>
          </div>
          <div class="form-actions d-flex justify-content-end mt-4">
            <button type="button" @click="closeEditForm" class="btn btn-outline-secondary me-2">Cancel</button>
            <button type="submit" class="btn btn-success">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      listings: [],
      donorId: "p8v0JBWhlfNZ13DzpBFN",
      showForm: false,
      submitting: false,
      listing: { id: '', itemCategory: '', condition: '', petType: '', itemsDonated: '', itemImage: '', location: ''},
      imagePreview: '',       // For showing the new image preview
      selectedImageFile: null, // To store the new image file
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  async created() {
    await this.fetchListings();
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
    async fetchListings() {
      try {
        const response = await axios.get(`http://localhost:8000/api/marketplace/${this.donorId}`);
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
    async deleteListing(id) {
      if (confirm('Are you sure you want to delete this listing?')) {
        try {
          await axios.delete('http://localhost:8000/api/marketplace', { data: { id } });
          this.listings = this.listings.filter(l => l.id !== id);
          alert('Listing deleted successfully.');
        } catch (error) {
          console.error('Failed to delete the listing:', error.response || error.message);
          alert('Failed to delete the listing. Please try again.');
        }
      }
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
          formData.append('itemsDonated', this.listing.itemsDonated); // Include updated itemsDonated
          formData.append('itemCategory', this.listing.itemCategory);
          formData.append('condition', this.listing.condition);
          formData.append('petType', this.listing.petType);
          formData.append('location', this.listing.location); // Include location

          // If a new image file is selected, add it to formData
          if (this.selectedImageFile) {
              formData.append('image', this.selectedImageFile);
          }

          const response = await axios.put('http://localhost:8000/api/marketplace', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });

          // Update listing data in the local state
          this.listings = this.listings.map(l => (l.id === this.listing.id ? { ...l, ...response.data.updatedListing } : l));
          this.showForm = false; // Close form
          alert('Listing updated successfully.');
      } catch (error) {
          console.error('Failed to update the listing:', error.response || error.message);
          alert('Failed to update the listing. Please try again.');
      } finally {
          this.submitting = false;
      }
  },
  changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  }
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

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.image-upload-box {
  width: 100%;
  max-width: 200px;
  height: 150px;
  border: 2px dashed #ddd;
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

</style>
