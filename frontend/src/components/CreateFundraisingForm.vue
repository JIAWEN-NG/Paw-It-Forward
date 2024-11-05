<template>
  <div class="container py-4">
    <button class="btn btn-primary create-fundraising-button" @click="handleCreateFundraising">
      <span class="plus-sign">+</span>
      <span class="divider"></span>
      <span class="button-text">Create Fundraising Post</span>
    </button>

    <div v-if="showForm" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-content">
          <span class="close" @click="closeForm">&times;</span>
          <h5 class="modal-title">Start a Fundraising Post!</h5>
          <div class="modal-body">
            <form @submit.prevent="submitForm">

              <div class="form-group mb-3">
                <label for="campaignName" class="form-label">Title</label>
                <input type="text" id="campaignName" v-model="fundraising.campaignName" required class="form-control" />
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
                <label for="imageUpload" class="form-label">Upload Fundraising Post Image</label>
                <div class="image-upload-box" @click="triggerFileInput">
                  <img v-if="imagePreview" :src="imagePreview" class="image-preview" />
                  <span v-else class="text-muted">No Image Uploaded</span>
                </div>
                <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" ref="fileInput" style="display: none;" />
                <button type="button" @click="triggerFileInput" class="btn btn-secondary upload-button">{{ fundraising.image ? 'Reupload' : 'Choose File' }}</button>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeForm">Cancel</button>
                <button type="submit" class="btn btn-success" :disabled="submitting">Submit</button>
              </div>
              <!-- Form Fields Here -->
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authState } from '@/store/auth';

export default {
  data() {
    return {
      showForm: false,
      submitting: false,
      fundraising: {
        campaignName: '',
        description: '',
        petType: '',
        targetAmount: null,
        image: null,
      },
      imagePreview: '' // For image preview
    };
  },
  methods: {
    handleCreateFundraising() {
      if (!authState.isUserLoggedIn) {
        this.$router.push('/login'); // Redirect to login if not authenticated
      } else {
        this.showForm = true; // Show form if authenticated
      }
    },
    
    closeForm() {
      this.showForm = false;
      this.resetForm();
    },

    async submitForm() {
      if (this.submitting) return;
      this.submitting = true;

      const formData = new FormData();
      if (this.fundraising.image) formData.append('image', this.fundraising.image);
      formData.append('title', this.fundraising.campaignName);
      formData.append('description', this.fundraising.description);
      formData.append('petType', this.fundraising.petType);
      formData.append('targetAmount', this.fundraising.targetAmount);

      // Include the logged-in user's UID
      formData.append('userId', authState.userId);

      try {
        const response = await fetch(`http://localhost:8000/api/fundraising`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (response.ok) {
          this.$emit('postCreated'); // Emit event after successful creation
          this.closeForm();
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error creating fundraising campaign:', error);
        alert('Error creating fundraising campaign. Please try again.');
      } finally {
        this.submitting = false;
      }
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.fundraising.image = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    resetForm() {
      this.fundraising = {
        campaignName: '',
        description: '',
        petType: '',
        targetAmount: null,
        image: null
      };
      this.imagePreview = '';
    }
  }
};
</script>


<style scoped>
.create-fundraising-button {
    margin-top: 20px;
    padding: 12px 20px;
    background: linear-gradient(135deg, #1f2e3d 0%, #3a506b 100%);
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 16px;
    font-family: 'Montserrat', sans-serif;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    
    align-items: center;
}

.create-fundraising-button:hover {
    background: linear-gradient(135deg, #2c3e50 0%, #506c8a 100%);
    transform: translateY(-2px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.create-fundraising-button:active {
    transform: translateY(1px);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    background: #2c3e50;
}

/* Styling for the plus sign */
.plus-sign {
    font-size: 1.2em;
    margin-right: 8px;
}

/* Divider line between "+" and "Create Listing" */
.divider {
    display: inline-block;
    width: 1px;
    height: 20px;
    background-color: white;
    margin: 0 10px;
}

/* Styling for the "Create Listing" text */
.button-text {
    font-size: 1em;
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
  font-family: 'Montserrat', sans-serif;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

.form-label {
  font-weight: 500;
  color: #2c3e50;
  display: block; /* Ensures label alignment */
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
  text-align: left;
}

.upload-button:hover {
  background-color: #2980b9;
}
</style>