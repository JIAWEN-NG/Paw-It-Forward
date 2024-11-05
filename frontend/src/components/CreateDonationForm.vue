<template>
    <div>
        <button class="btn btn-primary create-listing-button" @click="checkAuthAndOpenForm">
            <span class="plus-sign">+</span>
            <span class="divider"></span>
            <span class="button-text">Create Listing</span>
        </button>

        <div v-if="showForm" class="modal d-flex justify-content-center align-items-center">
            <div class="modal-content p-4">
                <span class="close" @click="showForm = false">&times;</span>
                <br>
                <h2 class="modal-title text-center mb-4">Your donation can change a pet's life!</h2>

                <!-- Donation Form -->
                <form @submit.prevent="submitForm" class="form-scrollable">
                    <div class="form-group">
                        <label for="itemsDonated">Short Description of Items Donated</label>
                        <textarea v-model="donation.itemsDonated" id="itemsDonated" required class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="condition">Condition</label>
                        <select v-model="donation.condition" id="condition" required class="form-select">
                            <option value="" disabled>Select Condition</option>
                            <option value="Brand New">Brand New</option>
                            <option value="Slightly Used">Slightly Used</option>
                            <option value="Well Used">Well Used</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="itemCategory">Item Category</label>
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
                    <div class="form-group">
                        <label for="petType">Pet Type</label>
                        <select v-model="donation.petType" id="petType" required class="form-select">
                            <option value="" disabled>Select Pet Type</option>
                            <option value="Cat">Cat</option>
                            <option value="Dog">Dog</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="location">Location</label>
                        <select v-model="donation.location" id="location" required class="form-select">
                            <option value="" disabled>Select Location</option>
                            <option value="West">West</option>
                            <option value="East">East</option>
                            <option value="Central">Central</option>
                            <option value="North">North</option>
                            <option value="North-east">North-east</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="imageUpload">Upload Picture of Items Donated</label>
                        <div class="image-upload-box" @click="triggerFileInput">
                            <img v-if="donation.image" :src="imagePreview" class="image-preview img-fluid" />
                            <span v-else class="placeholder text-center">No Image Uploaded</span>
                        </div>
                        <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" ref="fileInput" style="display: none;" />
                        <button type="button" @click="triggerFileInput" class="btn btn-info mt-2">{{ donation.image ? 'Reupload' : 'Choose File' }}</button>
                    </div>
                    <div class="form-actions d-flex justify-content-end">
                        <button type="button" @click="showForm = false" class="btn btn-secondary me-2">Cancel</button>
                        <button type="submit" class="btn btn-success">Submit</button>
                    </div>
                </form>
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
            const response = await fetch(`http://localhost:8000/api/marketplace`, {
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
            const response = await fetch(`http://localhost:8000/api/users/${donorId}`);
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

  
<style>

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
}

.modal-content {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    max-height: 80vh; /* Reduced height */
    overflow-y: auto; /* Enable scrolling */
    position: relative;
}

.form-group {
    margin-bottom: 20px;
    text-align: left;
    font-family: 'Montserrat', sans-serif;
}

.form-actions {
    text-align: right;
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
    position: relative;
}

.image-preview {
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
}

.close {
    color: #aaa;
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover {
    color: black;
}

.upload-button {
    margin-top: 10px;
    padding: 10px 15px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
}

.upload-button:hover {
    background-color: #2980b9;
}

.modal-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    font-size: 24px;
}
</style>