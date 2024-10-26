<template>
  <div class="scrollable-container py-4">
    <h1 class="text-center mb-4">Manage Fundraising Posts</h1>

    <div v-if="loading" class="text-center">Loading fundraising posts...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && fundraisings.length > 0">
      <table class="compact-table">
        <thead>
          <tr>
            <th>Image</th>
            <th style="width: 25%;">Title</th>
            <th>Description</th>
            <th>Pet Type</th>
            <th>Target Amount</th>
            <th>Amount Raised</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fundraising in fundraisings" :key="fundraising.id">
            <td>
              <img :src="fundraising.fundraisingImg || 'https://via.placeholder.com/200'" alt="Fundraising Image" class="thumbnail">
            </td>
            <td>{{ fundraising.title }}</td>
            <td>{{ truncateText(fundraising.description, 50) }}</td>
            <td>{{ fundraising.petType }}</td>
            <td>{{ formatCurrency(fundraising.targetAmount) }}</td>
            <td>{{ formatCurrency(fundraising.amountRaised) }}</td>
            <td>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-sm btn-outline-secondary" @click="openEditForm(fundraising)">Edit</button>
                <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteFundraising(fundraising.id)">Delete</button>
                <button type="button" class="btn btn-sm btn-outline-primary" @click="withdrawFunds(fundraising.id)">Withdraw</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && fundraisings.length === 0" class="alert alert-warning text-center">
      No fundraising posts found.
    </div>

    <!-- Modal for Editing Fundraising Post -->
    <div v-if="showForm" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <span class="close" @click="closeEditForm">&times;</span>
          <h5 class="modal-title">Edit Fundraising Post</h5>
          <div class="modal-body">
            <form @submit.prevent="updateFundraising">
              <div class="form-group mb-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" id="title" v-model="fundraising.title" required class="form-control" />
              </div>

              <div class="form-group mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea id="description" v-model="fundraising.description" required class="form-control" rows="3"></textarea>
              </div>
              
              <div class="form-group mb-3">
                <label for="petType" class="form-label">Pet Type</label>
                <input type="text" id="petType" v-model="fundraising.petType" required class="form-control" />
              </div>

              <div class="form-group mb-3">
                <label for="targetAmount" class="form-label">Target Amount ($)</label>
                <input type="number" id="targetAmount" v-model="fundraising.targetAmount" required min="1" class="form-control" />
              </div>

              <!-- added -->
              <div class="form-group mb-3">
                <label for="imageUpload">Upload New Picture (Optional)</label><br />
                <div class="image-upload-box" @click="triggerFileInput">
                  <img v-if="imagePreview || fundraising.fundraisingImg" :src="imagePreview || fundraising.fundraisingImg" class="image-preview" />
                  <span v-else class="placeholder">No Image Uploaded</span>
                </div>
                <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" ref="fileInput" style="display: none;" />
                <button type="button" @click="triggerFileInput" class="upload-button">{{ fundraising.fundraisingImg ? 'Reupload' : 'Choose File' }}</button>
              </div>
              <!-- added -->

              <div class="modal-footer">
                <button type="submit" class="btn btn-success" :disabled="submitting">{{ submitting ? 'Saving...' : 'Save Changes' }}</button>
                <button type="button" class="btn btn-secondary" @click="closeEditForm">Cancel</button>
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

export default {
  data() {
    return {
      fundraisings: [],
      loading: false,
      error: null,
      userId: 'p8v0JBWhlfNZ13DzpBFN', // This should be dynamically fetched if possible
      showForm: false,
      submitting: false,
      fundraising: {
        id: '',
        title: '',
        description: '',
        petType: '',
        targetAmount: 0,
        amountRaised: 0,
        fundraisingImg: ''
      },
      imagePreview: '',       // For showing the new image preview
      selectedImageFile: null // To store the new image file
    };
  },

  async created() {
    await this.fetchFundraisings();
  },

  methods: {
  async fetchFundraisings() {
  this.loading = true;
  this.error = null;
  try {
    const response = await axios.get(`http://localhost:8000/api/fundraising/user/${this.userId}`);
    this.fundraisings = response.data
      .map(fundraising => ({ ...fundraising, createdAt: new Date(fundraising.createdAt) }))
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    this.error = 'Failed to fetch fundraising posts. Please try again later.';
    console.error("Error fetching fundraisings:", error);
  } finally {
    this.loading = false;
  }
},


    async deleteFundraising(id) {
      if (confirm('Are you sure you want to delete this fundraising post?')) {
        try {
          await axios.delete(`http://localhost:8000/api/fundraising`, { data: { id } });
          this.fundraisings = this.fundraisings.filter(f => f.id !== id);
          alert('Fundraising post deleted successfully.');
        } catch (error) {
          alert('Failed to delete the fundraising post. Please try again.');
        }
      }
    },

    openEditForm(fundraising) {
      this.fundraising = { ...fundraising };
      
      this.showForm = true;
    },

    closeEditForm() {
      this.showForm = false;
      this.fundraising = {
        id: '',
        title: '',
        description: '',
        petType: '',
        targetAmount: 0, 
      };
      
    },

   async updateFundraising() {
    this.submitting = true;

    const formData = new FormData();
    formData.append('id', this.fundraising.id);
    formData.append('title', this.fundraising.title);
    formData.append('description', this.fundraising.description);
    formData.append('petType', this.fundraising.petType);
    formData.append('targetAmount', Number(this.fundraising.targetAmount)); // Ensure it is a number

    // Add image only if a new file is selected
    if (this.selectedImageFile) {
        formData.append('image', this.selectedImageFile);
    }

    try {
        const response = await axios.put('http://localhost:8000/api/fundraising', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.fundraisings = this.fundraisings.map(f => f.id === this.fundraising.id ? { ...f, ...response.data.updatedData } : f);
        this.showForm = false;
        alert('Fundraising updated successfully.');
    } catch (error) {
        console.error('Failed to update the fundraising:', error.response?.data || error.message);
        alert(`Failed to update the fundraising: ${error.response?.data?.message || 'Please try again.'}`);
    } finally {
        this.submitting = false;
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

    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    },

    truncateText(text, length) {
      return text.length > length ? text.slice(0, length) + '...' : text;
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
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-collapse: collapse;
}

th, td {
  padding: 8px 12px;
  text-align: left;
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
  margin-top: 50px; /* Move the modal down by 50px */
}

.modal-content {
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Scrollable modal body */
.modal-body {
  max-height: 60vh; /* Limit height for scrolling */
  overflow-y: auto;
  padding: 30px;
}

/* Modal title styling */
.modal-title {
  text-align: center;
  margin-top: 15px;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50; /* Dark color for better contrast */
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}
</style>
