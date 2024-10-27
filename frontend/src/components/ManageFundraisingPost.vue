<template>
  <div class="scrollable-container py-4">
 
    <div v-if="loading" class="text-center">Loading fundraising posts...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

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
              <button @click="openEditForm(fundraising)" class="btn btn-outline-secondary btn-sm">Edit</button>
              <button @click="deleteFundraising(fundraising.id)" class="btn btn-outline-danger btn-sm">Delete</button>
              <button @click="withdrawFunds(fundraising.id)" class="btn btn-outline-primary btn-sm">Withdraw</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && paginatedFundraisings.length === 0" class="alert alert-warning text-center">
      No fundraising posts found.
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="pagination-container">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1" 
        class="pagination-button"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages" 
        class="pagination-button"
      >
        Next
      </button>
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

              <div class="form-group mb-3">
                <label for="imageUpload" class="form-label">Upload New Picture (Optional)</label>
                <div class="image-upload-box" @click="triggerFileInput">
                  <img v-if="imagePreview || fundraising.fundraisingImg" :src="imagePreview || fundraising.fundraisingImg" class="image-preview" />
                  <span v-else class="placeholder">No Image Uploaded</span>
                </div>
                <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" ref="fileInput" style="display: none;" />
                <button type="button" @click="triggerFileInput" class="upload-button">{{ fundraising.fundraisingImg ? 'Reupload' : 'Choose File' }}</button>
              </div>

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
      userId: 'p8v0JBWhlfNZ13DzpBFN',
      showForm: false,
      submitting: false,
      currentPage: 1,
      itemsPerPage: 5, // Items per page for pagination
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
      selectedImageFile: null
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
.scrollable-container {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
}

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
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination-button {
  color: #8b4513;
  border: 1px solid #8b4513;
  font-size: 0.75rem;
  padding: 5px 10px;
  background-color: #fff;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.pagination-button:hover {
  background-color: #8b4513;
  color: #fff;
  border-color: #8b4513;
}

.pagination-button:disabled {
  color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
  background-color: #f7f7f7;
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

/* Modal styling for consistency with Code 2 */
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
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
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
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
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
</style>
