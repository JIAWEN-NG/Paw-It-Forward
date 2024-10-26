<!-- ManageMarketplace.vue -->
<!-- has to be a scrollable function within ManagePostView's marketplace toggle background area  -->

<template>
  <div class="scrollable-container">
    <div v-if="listings && listings.length">
      <table class="compact-table">
        <thead>
          <tr>
            <th>My Posts</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="listing in listings" :key="listing.id">
            <td>
              <div class="listing-container">
                <img :src="listing.itemImage" alt="Item Image" class="thumbnail" v-if="listing.itemImage" />
                <div class="listing-details">
                  <p>{{ listing.itemCategory }}</p>
                  <p>{{ listing.condition }}</p>
                  <p>{{ listing.petType }} - {{ listing.breed }}</p>
                  <p>Created at: {{ formatDate(listing.createdAt) }}</p>
                </div>
              </div>
            </td>
            <td>
              <button @click="openEditForm(listing)" class="btn btn-primary">Edit</button>
              <button @click="deleteListing(listing.id)" class="btn btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No listings available.</p>
    </div>

    <!-- Edit Form Modal -->
    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <h2>Edit Listing</h2>
        <form @submit.prevent="updateListing">
          <div class="form-group">
            <label for="itemCategory">Item Category</label><br />
            <select v-model="listing.itemCategory" id="itemCategory" required>
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
            <label for="condition">Condition</label><br />
            <select v-model="listing.condition" id="condition" required>
              <option value="" disabled>Select Condition</option>
              <option value="Brand New">Brand New</option>
              <option value="Slightly Used">Slightly Used</option>
              <option value="Well Used">Well Used</option>
            </select>
          </div>
          <div class="form-group">
            <p style="font-size: 0.9em; color: #555;">Please select the Pet Type before choosing the Breed:</p>
            <div style="display: flex; justify-content: space-between;">
              <div style="flex: 1; margin-right: 10px;">
                <label for="petType">Pet Type</label><br />
                <select v-model="listing.petType" @change="updateBreeds" id="petType" required>
                  <option value="" disabled>Select Pet Type</option>
                  <option value="Cat">Cat</option>
                  <option value="Dog">Dog</option>
                </select>
              </div>
              <div style="flex: 1;">
                <label for="breed">Breed</label><br />
                <select v-model="listing.breed" id="breed" required>
                  <option value="" disabled>Select Breed Type</option>
                  <option v-for="breed in filteredBreeds" :key="breed" :value="breed">{{ breed }}</option>
                </select>
              </div>
            </div>
          </div>
          <!-- added -->
          <div class="form-group">
            <label for="imageUpload">Upload New Picture (Optional)</label><br />
            <div class="image-upload-box" @click="triggerFileInput">
              <img v-if="imagePreview || listing.itemImage" :src="imagePreview || listing.itemImage" class="image-preview" />
              <span v-else class="placeholder">No Image Uploaded</span>
            </div>
            <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" ref="fileInput" style="display: none;" />
            <button type="button" @click="triggerFileInput" class="upload-button">{{ listing.itemImage ? 'Reupload' : 'Choose File' }}</button>
          </div>
          <!-- added -->
          <div class="form-actions">
            <button type="button" @click="closeEditForm" class="btn btn-secondary">Cancel</button>
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
  // data() {
  //   return {
  //     listings: [],
  //     donorId: "p8v0JBWhlfNZ13DzpBFN",
  //     showForm: false,
  //     submitting: false,
  //     listing: { id: '', itemCategory: '', condition: '', petType: '', breed: '' },
  //     filteredBreeds: []
  //   };
  // },

  data() {
    return {
      listings: [],
      donorId: "p8v0JBWhlfNZ13DzpBFN",
      showForm: false,
      submitting: false,
      listing: { id: '', itemCategory: '', condition: '', petType: '', breed: '', itemImage: '' },
      imagePreview: '',       // For showing the new image preview
      selectedImageFile: null, // To store the new image file
      filteredBreeds: []
    };
  },
  async created() {
    await this.fetchListings();
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
    openEditForm(listing) {
      this.listing = { ...listing };
      this.updateBreeds(); // Populate breeds based on the current pet type
      this.showForm = true;
    },
    closeEditForm() {
      this.showForm = false;
      this.listing = { id: '', itemCategory: '', condition: '', petType: '', breed: '' };
    },
    async deleteListing(id) {
      if (confirm('Are you sure you want to delete this listing?')) {
        try {
          const response = await axios.delete('http://localhost:8000/api/marketplace', { data: { id } });
          console.log("Response:", response.data);
          this.listings = this.listings.filter(l => l.id !== id);
          alert('Listing deleted successfully.');
        } catch (error) {
          console.error('Failed to delete the listing:', error.response || error.message);
          alert('Failed to delete the listing. Please try again.');
        }
      }
    },
    // async updateListing() {
    //   this.submitting = true;
    //   console.log('Attempting to update listing with data:', this.listing); // Debug log

    //   try {
    //     const response = await axios.put('http://localhost:8000/api/marketplace', this.listing);
    //     console.log('Update response:', response.data);
    //     this.listings = this.listings.map(l => (l.id === this.listing.id ? { ...l, ...this.listing } : l));
    //     this.showForm = false;
    //     alert('Listing updated successfully.');
    //   } catch (error) {
    //     console.error('Failed to update the listing:', error.response || error.message);
    //     alert('Failed to update the listing. Please try again.');
    //   } finally {
    //     this.submitting = false;
    //   }
    // },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    // Handle new image upload and show preview
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.selectedImageFile = file;
      this.imagePreview = URL.createObjectURL(file); // Show the preview
    },
    
    // Update listing with optional new image
    async updateListing() {
      this.submitting = true;
      try {
        const formData = new FormData();
        formData.append('id', this.listing.id);
        formData.append('itemCategory', this.listing.itemCategory);
        formData.append('condition', this.listing.condition);
        formData.append('petType', this.listing.petType);
        formData.append('breed', this.listing.breed);

        // If a new image file is selected, add it to formData
        if (this.selectedImageFile) {
          formData.append('image', this.selectedImageFile);
        }

        const response = await axios.put('http://localhost:8000/api/marketplace', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Update listing data with new response data
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
    updateBreeds() {
      if (this.listing.petType === 'Dog') {
        this.filteredBreeds = ['Labrador Retriever', 'French Bulldog', 'Golden Retriever'];
      } else if (this.listing.petType === 'Cat') {
        this.filteredBreeds = ['Maine Coon', 'Ragdoll', 'Persian', 'Bengal', 'Sphynx'];
      } else {
        this.filteredBreeds = [];
      }
    },
    formatDate(date) {
      return date ? date.toISOString().slice(0, 10) : '';
    }
  }
};
</script>

<style scoped>
.scrollable-container {
  max-height: 500px;
  overflow-y: auto;
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
}

.compact-table {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  border-collapse: collapse;
}

th, td {
  padding: 8px 12px;
  text-align: left;
}

.listing-container {
  display: flex;
  align-items: center;
}

.thumbnail {
  width: 70px;
  height: auto;
  margin-right: 10px;
  object-fit: cover;
  border-radius: 4px;
}

button {
  margin-right: 5px;
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
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
</style>

