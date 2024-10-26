<template>
  <div class="container py-4">
    <button class="create-fundraising-button mb-3" @click="showForm = true">+ Create Fundraising Post</button>

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
                <input type="text" id="petType" v-model="fundraising.petType" required class="form-control" />
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
                <button type="button" @click="triggerFileInput" class="upload-button mt-2">{{ fundraising.image ? 'Reupload' : 'Choose File' }}</button>
              </div>

              <div class="modal-footer">
                <button type="submit" class="btn btn-success" :disabled="submitting">Submit</button>
                <button type="button" class="btn btn-secondary" @click="closeForm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        image: null
      },
      imagePreview: '' // For image preview
    };
  },
  methods: {
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

      try {
        const response = await fetch(`http://localhost:8000/api/fundraising`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (response.ok) {
          alert('Fundraising campaign created successfully!');
          this.closeForm();
          setTimeout(() => window.location.reload(), 500);
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
    },

    goToManageFundraisingPost() {
      this.$router.push('/fundraising/manage');
    }
  }
};
</script>

<style scoped>
body {
  background-color: #FCEED5;
}

.create-fundraising-button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.create-fundraising-button:hover {
  background-color: #34495e;
}

/* Modal overlay styling for center alignment */
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

/* Close button styling */
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
}

/* Modal footer styling with spaced buttons */
.modal-footer {
  display: flex;
  gap: 10px; /* Adds 10px space between buttons */
  justify-content: flex-end; /* Aligns buttons to the right */
  padding-top: 15px;
}


/* Image upload styling */
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
