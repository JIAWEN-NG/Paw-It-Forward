<template>
    <div v-if="show" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Please Submit A Photo of Yourself Doing a Peace Sign for Account Verification</h2>
        </div>
        <div class="modal-body">
          <div class="image-upload-box" @click="triggerFileInput">
            <img v-if="imagePreview" :src="imagePreview" class="image-preview" />
            <span v-else class="placeholder">Click to Upload Photo</span>
          </div>
          <input
            type="file"
            ref="fileInput"
            @change="handleImageUpload"
            accept="image/*"
            style="display: none;"
          />
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="submitPhotoForVerification">
            Submit Photo
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { authState } from '@/store/auth';

  export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      photoFile: null,
      imagePreview: null, // Local property for image preview
      modalTitle: '',
      modalMessage: '',
      showModal: false,
      userId: authState.userId
    };
  },
  methods: {
    triggerFileInput() {
      if (this.$refs.fileInput) {
        this.$refs.fileInput.click();
      } else {
        console.error('fileInput ref is not defined');
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.photoFile = file;
        this.imagePreview = URL.createObjectURL(file); // Update local property
        console.log(this.imagePreview);
      }
    },
    async submitPhotoForVerification() {
      if (!this.photoFile) {
        this.modalTitle = 'Error';
        this.modalMessage = 'Please upload a photo.';
        this.showModal = true;
        return;
      }

      const formData = new FormData();
      formData.append('image', this.photoFile);
      formData.append('userId', this.userId);

      try {
        const response = await fetch(`${this.$api_url}/photo-verification`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          this.modalTitle = 'Success';
          this.modalMessage = 'Photo submitted for verification!';
          this.showModal = true;
          this.$emit('close');
            setTimeout(() => {
                this.$router.push('/about');
            }, 1000); 
        } else {
          const data = await response.json();
          this.modalTitle = 'Error';
          this.modalMessage = `Error: ${data.message}`;
          this.showModal = true;
        }
      } catch (error) {
        this.modalTitle = 'Error';
        this.modalMessage = 'Error submitting photo. Please try again.';
        this.showModal = true;
      }
    }
  }
};

  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-container {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-body {
    margin-top: 15px;
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
  
  .image-preview {
    max-width: 100%;
    max-height: 100%;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
  
  .placeholder {
    background-color: transparent;
  }
  </style>
  