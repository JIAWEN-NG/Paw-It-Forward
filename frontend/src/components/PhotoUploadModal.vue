<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Edit Your Photo</h2>
      <div v-if="userProfilePicUrl" class="current-photo-container">
        <p>Current Photo</p>
        <img :src="userProfilePicUrl" alt="Current Profile Photo" class="current-photo" />
      </div>
      <button class="upload-button" @click="triggerFileInput">Upload New Photo</button>
      <input type="file" ref="fileInput" accept="image/*" @change="onFileChange" class="hidden-file-input" />
      
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
    },
    userProfilePicUrl: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      selectedImage: null,
      cropper: null
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
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
          formData.append('image', blob, `${this.userId}.png`);
          formData.append('userId', this.userId);

          try {
            const response = await axios.post(`http://localhost:8000/api/user/${this.userId}/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            const photoURL = response.data.photoURL;
            this.$emit('uploadSuccess', photoURL);
            console.log('Emitting showSuccess event');
            this.$emit('showSuccess', 'Profile photo updated successfully.');
            this.close();
          } catch (error) {
            console.error("Error uploading photo:", error.response.data);
          }
        }, 'image/png');
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
  margin-top: 80px;
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

.current-photo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  color: gray;
  font-weight:lighter;
}

.current-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 5px;
  border-radius: 100%;
  border: 1px solid gray; 
}


.hidden-file-input {
  display: none;
}

.upload-button {
  background-color: transparent;
  color: gray;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid gray;
  margin-bottom: 20px;
  transition: background-color 0.3s, color 0.3s;
}

.upload-button:hover {
  background-color: lightgray;
  color: white;
  border: 1px solid gray;
}


.modal-buttons {
  margin-top:10px;
  display: flex;
  justify-content: space-between;
}

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

h2 {
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>