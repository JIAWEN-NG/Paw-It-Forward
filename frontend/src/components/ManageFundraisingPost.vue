<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center">Loading fundraising posts...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    
    <!-- Success Alert Message -->
    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ successMessage }}
      <button type="button" class="btn-close" @click="clearMessage" aria-label="Close"></button>
    </div>

    <div v-if="!loading && paginatedFundraisings.length > 0">
      <table class="compact-table">
        <thead>
          <tr>
            <th>Image</th>
            <th style="width: 40%;">Details</th>
            <th>Target Amount</th>
            <th>Amount Raised</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fundraising in paginatedFundraisings" :key="fundraising.id">
            <td>
              <img :src="fundraising.fundraisingImg || 'https://via.placeholder.com/200'" alt="Fundraising Image" class="thumbnail">
            </td>
            <td>
              <div class="details-column">
                <p class="title">{{ fundraising.title }}</p>
                <p class="description">{{ truncateText(fundraising.description, 50) }}</p>
                <p class="pet-type">Pet Type: {{ fundraising.petType }}</p>
                <p class="posted-date">Posted: {{ formatDate(fundraising.createdAt) }}</p>
              </div>
            </td>
            <td>{{ formatCurrency(fundraising.targetAmount) }}</td>
            <td>{{ formatCurrency(fundraising.amountRaised) }}</td>
            <td>
              <div class="action-buttons">
                <button @click="openEditForm(fundraising)" class="btn btn-outline-secondary btn-sm">Edit</button>
                <button @click="confirmDeleteFundraising(fundraising.id)" class="btn btn-outline-danger btn-sm">Delete</button>
                <button @click="openWithdrawalForm(fundraising.id)" class="btn btn-outline-primary btn-sm">Withdraw</button>
              </div>  
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && paginatedFundraisings.length === 0" class="alert alert-warning text-center">
      No fundraising posts found.
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-container">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1" 
        class="btn btn-outline-primary  pagination-button"
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

    <!-- Modal for Editing Fundraising Post -->
    <div v-if="showForm" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <span class="close" @click="closeEditForm">&times;</span>
          <h5 class="modal-title text-center">Edit Fundraising Post</h5>
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
                <select id="petType" v-model="fundraising.petType" required class="form-control">
                  <option value="">Select Pet Type</option>
                  <option value="Cat">Cat</option>
                  <option value="Dog">Dog</option>
                </select>
              </div>

              <div class="form-group mb-3">
                <label for="targetAmount" class="form-label">Target Amount ($)</label>
                <input type="number" id="targetAmount" v-model="fundraising.targetAmount" required min="1" class="form-control" />
              </div>

              <div class="form-group mb-3">
                <label for="imageUpload" class="form-label">Upload New Picture (Optional)</label>
                <div class="image-upload-box" @click="triggerFileInput">
                  <img v-if="imagePreview || fundraising.fundraisingImg" :src="imagePreview || fundraising.fundraisingImg" class="image-preview" />
                  <span v-else class="placeholder">No Image Uploaded</span>
                </div>
                <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" ref="fileInput" style="display: none;" />
                <button type="button" @click="triggerFileInput" class="btn btn-secondary upload-button">{{ fundraising.fundraisingImg ? 'Reupload' : 'Choose File' }}</button>
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

    <!-- Withdrawal Modal -->
    <CreateWithdrawalForm
      v-if="showWithdrawalForm"
      :postId="selectedPostId"
      @withdrawalCreated="handleWithdrawalCreated"
      @close="showWithdrawalForm = false"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this fundraising post?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteModal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteFundraising">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CreateWithdrawalForm from './CreateWithdrawalForm.vue';

export default {
  components: {
    CreateWithdrawalForm
  },
  data() {
    return {
      fundraisings: [],
      loading: false,
      error: null,
      successMessage: '', // Success message data property
      userId: 'p8v0JBWhlfNZ13DzpBFN',
      showForm: false,
      submitting: false,
      currentPage: 1,
      itemsPerPage: 5,
      fundraising: {
        id: '',
        title: '',
        description: '',
        petType: '',
        targetAmount: 0,
        amountRaised: 0,
        fundraisingImg: ''
      },
      imagePreview: '',
      selectedImageFile: null,
      showDeleteModal: false,
      deletePostId: null,
      // New properties for withdrawal form
      showWithdrawalForm: false,
      selectedPostId: null,
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.fundraisings.length / this.itemsPerPage);
    },
    paginatedFundraisings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.fundraisings.slice(start, end);
    }
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

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
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
      this.imagePreview = '';
      this.selectedImageFile = null;
    },

    confirmDeleteFundraising(id) {
      this.deletePostId = id;
      this.showDeleteModal = true;
    },

    async deleteFundraising() {
      try {
        await axios.delete(`http://localhost:8000/api/fundraising`, { data: { id: this.deletePostId } });
        this.fundraisings = this.fundraisings.filter(f => f.id !== this.deletePostId);
        this.setSuccessMessage('Fundraising post deleted successfully.');
      } catch (error) {
        this.error = 'Failed to delete the fundraising post. Please try again.';
      } finally {
        this.closeDeleteModal();
      }
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.deletePostId = null;
    },

    async updateFundraising() {
      this.submitting = true;

      const formData = new FormData();
      formData.append('id', this.fundraising.id);
      formData.append('title', this.fundraising.title);
      formData.append('description', this.fundraising.description);
      formData.append('petType', this.fundraising.petType);
      formData.append('targetAmount', Number(this.fundraising.targetAmount));

      if (this.selectedImageFile) {
        formData.append('image', this.selectedImageFile);
      }

      try {
        const response = await axios.put('http://localhost:8000/api/fundraising', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.fundraisings = this.fundraisings.map(f => f.id === this.fundraising.id ? { ...f, ...response.data.updatedData } : f);
        this.showForm = false;
        this.setSuccessMessage('Fundraising updated successfully.');
      } catch (error) {
        console.error('Failed to update the fundraising:', error.response?.data || error.message);
        this.error = 'Failed to update the fundraising post. Please try again.';
      } finally {
        this.submitting = false;
      }
    },

    openWithdrawalForm(postId) {
      this.selectedPostId = postId;
      this.showWithdrawalForm = true;
    },

    handleWithdrawalCreated() {
      this.showWithdrawalForm = false;
      this.fetchFundraisings();
      this.setSuccessMessage('Withdrawal request created successfully.');
    },

    setSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    },

    clearMessage() {
      this.successMessage = '';
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      this.selectedImageFile = file;
      this.imagePreview = URL.createObjectURL(file);
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    },

    formatDate(date) {
      if (!date) return '';
      const options = { day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(date).toLocaleDateString('en-GB', options);
    },

    truncateText(text, length) {
      return text.length > length ? text.slice(0, length) + '...' : text;
    }
  }
};
</script>

<style scoped>
/* Table Styling */
.compact-table {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 0 10px;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  vertical-align: middle;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th {
  background-color: #f1f1f1;
  color: #333;
  font-weight: 600;
}

tbody tr {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

tbody tr:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-radius:8px;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.details-column {
  font-size: 0.9rem;
  color: #555;
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

.image-upload-box {
  width: 100%;
  height: 200px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.image-upload-box:hover {
  border-color: #007bff;
}

.image-preview {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}

.upload-button {
  margin-top: 10px;
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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

</style>
