<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Edit Your Photo</h2>
      <input type="file" accept="image/*" @change="onFileChange" />
      <div v-if="selectedImage" class="crop-container">
        <img :src="selectedImage" ref="image" class="crop-image" />
      </div>
      <div class="modal-buttons">
        <button class="cancel-button" @click="close">Cancel</button>
        <button class="save-button" :disabled="!selectedImage" @click="savePhoto">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';

export default {
  name: 'PhotoUploadModal',
  props: {
    showModal: {
      type: Boolean,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectedImage: null,
      cropper: null
    };
  },
  methods: {
    created() {
      console.log('User ID is:',this.userId)
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.selectedImage = e.target.result;
          this.$nextTick(() => {
            this.initCropper();
          });
        };
        reader.readAsDataURL(file);
      }
    },
    initCropper() {
      const imageElement = this.$refs.image;
      if (this.cropper) {
        this.cropper.destroy();
      }
      this.cropper = new Cropper(imageElement, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 1
      });
    },
    async savePhoto() {
      if (this.cropper) {
        this.cropper.getCroppedCanvas().toBlob(async blob => {
          const formData = new FormData();
          formData.append('image', blob, `${this.userId}.png`); // Append the blob with the userId as the file name
          formData.append('userId', this.userId); // Include userId

          try {
            const response = await axios.post(`http://localhost:8000/api/user/${this.userId}/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data' // Set the appropriate header
              }
            });

            const photoURL = response.data.photoURL; // Get the URL from the response
            this.$emit('save', photoURL); // Emit the new photo URL to the parent component
            this.close();
          } catch (error) {
            console.error("Error uploading photo:", error.response.data); // Log error details
          }
        }, 'image/png'); // Specify the image format
      }
    },
    close() {
      this.selectedImage = null;
      if (this.cropper) {
        this.cropper.destroy();
      }
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

/* Button styles */
.cancel-button {
  background-color: transparent;
  color: #6c757d;
  padding: 6px 12px;
  border: 1px solid #6c757d;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.cancel-button:hover {
  background-color: #6c757d;
  color: white;
}

.save-button {
  background-color: #28a745;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background-color: #218838;
}

.save-button:disabled {
  background-color: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}
</style>
