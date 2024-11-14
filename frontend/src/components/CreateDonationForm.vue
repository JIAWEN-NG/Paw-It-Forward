<template>
    <div>
        <button class="btn btn-primary create-listing-button" @click="checkAuthAndOpenForm">
            <span class="plus-sign">+</span>
            <span class="divider"></span>
            <span class="button-text">Create Listing</span>
        </button>

        <div v-if="showForm" class="modal-overlay">
            <div class="modal-dialog">
                <div class="modal-content">
                    <span class="close" @click="closeForm">&times;</span>
                    <h5 class="modal-title">Donate to Change a Pet's Life!</h5>
                    <div class="modal-body">
                    <!-- Donation Form -->
                        <form @submit.prevent="submitForm">
                            <div class="form-group mb-3">
                                <label for="itemsDonated" class="form-label">Share a Quick Description of the Items You’re Donating</label>
                                <textarea v-model="donation.itemsDonated" id="itemsDonated" required class="form-control"></textarea>
                            </div>
                            <div class="form-group mb-3">
                                <label for="condition" class="form-label">What’s the Condition of the Item?</label>
                                <select v-model="donation.condition" id="condition" required class="form-select">
                                    <option value="" disabled>Select Condition</option>
                                    <option value="Brand New">Brand New</option>
                                    <option value="Slightly Used">Slightly Used</option>
                                    <option value="Well Used">Well Used</option>
                                </select>
                            </div>
                            <div class="form-group mb-3">
                                <label for="itemCategory" class="form-label">Select an Item Category</label>
                                <select v-model="donation.itemCategory" id="itemCategory" required class="form-select">
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
                            <div class="form-group mb-3">
                                <label for="petType" class="form-label">Pet Type – Who Will This Help?</label>
                                <select v-model="donation.petType" id="petType" required class="form-select">
                                    <option value="" disabled>Select Pet Type</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Dog">Dog</option>
                                </select>
                            </div>
                            <div class="form-group mb-3">
                                <label for="location" class="form-label">Where Are You Located?</label>
                                <select v-model="donation.location" id="location" required class="form-select">
                                    <option value="" disabled>Select Location</option>
                                    <option value="West">West</option>
                                    <option value="East">East</option>
                                    <option value="Central">Central</option>
                                    <option value="North">North</option>
                                    <option value="North-east">North-east</option>
                                </select>
                            </div>
                            <div class="form-group mb-3">
                                <label for="imageUpload" class="form-label">Upload a Picture of Your Generous Donation!</label>
                                <div class="image-upload-box" @click="triggerFileInput">
                                    <img v-if="donation.image" :src="imagePreview" class="image-preview" />
                                    <span v-else class="text-muted">No Image Uploaded</span>
                                </div>
                                <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" ref="fileInput" style="display: none;" />
                                <button type="button" @click="triggerFileInput" class="btn btn-secondary upload-button">{{ donation.image ? 'Reupload' : 'Choose File' }}</button>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click="closeForm">Cancel</button>
                                <button type="submit" class="btn btn-success">Create a listing!</button>
                            </div>
                        </form>
                    </div>
                </div>   
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { authState } from '@/store/auth';
import { useRouter } from 'vue-router';

export default {
   setup() {
      const router = useRouter();
      const showForm = ref(false);
      const checkAuthAndOpenForm = () => {
         if (!authState.isUserLoggedIn) {
            // Redirect to login page if not logged in
            router.push('/login');
         } else {
            // Show form if logged in
            showForm.value = true;
         }
      };

      return {
         checkAuthAndOpenForm,
         showForm,
      };
   },
   data() {
      return {
         submitting: false,
         donation: {
            donorId: authState.userId,
            donorName: '',
            donorProfileImage: '',
            itemsDonated: '',
            condition: '',
            itemCategory: '',
            petType: '',
            location: '',
            image: null,
         },
         imagePreview: '',
      };
   },
   methods: {
    closeForm() {
            this.showForm = false;
            this.resetForm();
        },

      async submitForm() {
         this.donation.donorId = authState.userId;

         const formData = new FormData();
         formData.append('donorId', this.donation.donorId);
         formData.append('donorName', this.donation.donorName);
         formData.append('donorProfileImage', this.donation.donorProfileImage);
         formData.append('itemsDonated', this.donation.itemsDonated);
         formData.append('condition', this.donation.condition);
         formData.append('itemCategory', this.donation.itemCategory);
         formData.append('petType', this.donation.petType);
         formData.append('location', this.donation.location);

         if (this.donation.image) {
            formData.append('image', this.donation.image);
         }

         try {
            const api_url = import.meta.env.VITE_APP_API_BASE_URL;
            const response = await fetch(`${api_url}/marketplace`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                this.$emit('notification', { type: 'success', message: 'Donation created successfully!' });
                this.showForm = false;
                this.resetForm();
            } else {
                const data = await response.json();
                this.$emit('notification', { type: 'error', message: `Error: ${data.message}` });
            }
        } catch (error) {
            console.error('Error creating donation:', error);
            this.$emit('notification', { type: 'error', message: 'Error creating donation. Please try again.' });
        } finally {
            this.submitting = false;
        }
      },
      resetForm() {
         this.donation = {
            donorId: authState.userId,
            donorName: '',
            donorProfileImage: '',
            itemsDonated: '',
            condition: '',
            itemCategory: '',
            petType: '',
            location: '',
            image: null,
         };
      },

      async fetchDonorDetails(donorId) {
         try {
            const response = await fetch(`${this.$api_url}/users/${donorId}`);
            if (response.ok) {
               const user = await response.json();
               this.donation.donorName = user.name || '';
               this.donation.donorProfileImage = user.profileImage || '';
            }
         } catch (error) {
            console.error('Error fetching donor details:', error);
         }
      },
      handleImageUpload(event) {
         const file = event.target.files[0];
         if (file) {
            this.donation.image = file;
            this.imagePreview = URL.createObjectURL(file);
         }
      },
      triggerFileInput() {
         this.$refs.fileInput.click(); 
      },
   },
};
</script>

  
<style scoped>

.create-listing-button {
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

.create-listing-button:hover {
    background: linear-gradient(135deg, #2c3e50 0%, #506c8a 100%);
    transform: translateY(-2px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.create-listing-button:active {
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
    width: 95%;
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
  margin-top: 25px;
  margin-bottom: 10px;

}


.form-label {
  font-weight: 500;
  color: #2c3e50;
  display: block; /* Ensures label alignment */
  text-align: left;
  font-weight: bold;
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
  margin: 10px;
  font-size: 1.5rem;
  color: #000;
  cursor: pointer;
  font-weight: bold;
}

.close:hover {
    color: red;
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
  width: 130px;
}

.upload-button:hover {
  background-color: #2980b9;
}


</style>