<!-- CreateDonationForm.vue -->
<template>
    <div>
        <button class="create-listing-button" @click="showForm = true">+ Create Listing</button>

        <div v-if="showForm" class="modal">
            <div class="modal-content">
                <span class="close" @click="showForm = false">&times;</span>
                <br>
                <h2 class="modal-title">Your donation can change a pet's life!</h2><br>

                <!-- Donation Form -->
                <form @submit.prevent="submitForm">
                    <div class="form-group">
                        <label for="itemsDonated">Short Description of Items Donated</label><br />
                        <textarea v-model="donation.itemsDonated" id="itemsDonated" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="condition">Condition</label><br />
                        <select v-model="donation.condition" id="condition" required>
                            <option value="" disabled>Select Condition</option>
                            <option value="Brand New">Brand New</option>
                            <option value="Slightly Used">Slightly Used</option>
                            <option value="Well Used">Well Used</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="itemCategory">Item Category</label><br />
                        <select v-model="donation.itemCategory" id="itemCategory" required>
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
                        <p style="font-size: 0.9em; color: #555;">Please select the Pet Type before choosing the Breed:</p>
                        <div style="display: flex; justify-content: space-between;">
                            <div style="flex: 1; margin-right: 10px;">
                                <label for="petType">Pet Type</label><br />
                                <select v-model="donation.petType" @change="updateBreeds" id="petType" required>
                                    <option value="" disabled>Select Pet Type</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Dog">Dog</option>
                                </select>
                            </div>
                            <div style="flex: 1;">
                                <label for="breed">Breed</label><br />
                                <select v-model="donation.breed" id="breed" required>
                                    <option value="" disabled>Select Breed Type</option>
                                    <option v-for="breed in filteredBreeds" :key="breed" :value="breed">{{ breed }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="imageUpload">Upload Picture of Items Donated</label><br />
                        <div class="image-upload-box" @click="triggerFileInput">
                            <img v-if="donation.image" :src="imagePreview" class="image-preview" />
                            <span v-else class="placeholder">No Image Uploaded</span>
                        </div>
                        <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" ref="fileInput" style="display: none;" />
                        <button type="button" @click="triggerFileInput" class="upload-button">{{ donation.image ? 'Reupload' : 'Choose File' }}</button>
                    </div>
                    <div class="form-actions">
                        <button type="button" @click="showForm = false" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-success">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            submitting: false, // Initialize the submitting flag
            showForm: false,
            donation: {
                donorId: "p8v0JBWhlfNZ13DzpBFN", // Default donor ID
                donorName: '',
                donorProfileImage: '',
                itemsDonated: '',
                condition: '', // Set to empty string for "Select Condition" placeholder
                itemCategory: '',
                petType: '', // Set to empty string for "Select Pet Type" placeholder
                breed: '',
                image: null // Image file to upload
            },
            breeds: {
                Cat: ['Maine Coon', 'Ragdoll', 'Persian', 'Bengal', 'Sphynx'],
                Dog: ['Labrador Retriever', 'French Bulldog', 'Golden Retriever']
            },
            filteredBreeds: [],
            imagePreview: '' // For image preview
        };
    },
    methods: {
        async submitForm() {
            if (this.submitting) {
                console.log('Submission already in progress, ignoring additional clicks.');
                return; // Prevent multiple submissions
            }
            this.submitting = true; // Disable the button
            console.log('Submitting form with donation data:', this.donation);

            // Fetch donor details before submission
            await this.fetchDonorDetails(this.donation.donorId);
            console.log('Donor details fetched:', this.donation.donorName, this.donation.donorProfileImage);

            const formData = new FormData();
            if (this.donation.image) {
                formData.append('image', this.donation.image);
            }

            // Append other fields
            formData.append('donorId', this.donation.donorId);
            formData.append('donorName', this.donation.donorName);
            formData.append('donorProfileImage', this.donation.donorProfileImage);
            formData.append('itemsDonated', this.donation.itemsDonated);
            formData.append('condition', this.donation.condition);
            formData.append('itemCategory', this.donation.itemCategory || "");
            formData.append('petType', this.donation.petType);
            formData.append('breed', this.donation.breed);
            formData.append('receiverId', "");
            formData.append('requestId', "");

            try {
                const response = await fetch(`http://localhost:8000/api/marketplace`, { 
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Donation created successfully!');
                    this.showForm = false;
                    this.resetForm();

                    // Asynchronous page reload after form submission
                    setTimeout(() => {
                        window.location.reload(); // Reloads the page
                    }, 500); // Add a short delay (optional) for UX smoothness
                } else {
                    console.error('Error response from server:', data);
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Error creating donation:', error);
                alert('Error creating donation. Please try again.');
            } finally {
                this.submitting = false; // Re-enable the button
            }
        },

        async fetchDonorDetails(donorId) {
            console.log('Fetching donor details for ID:', donorId);
            try {
                const response = await fetch(`http://localhost:8000/api/users/${donorId}`);
                if (response.ok) {
                    const user = await response.json();
                    console.log('Donor details fetched:', user);
                    this.donation.donorName = user.name || ''; // Ensure user object has a name property
                    this.donation.donorProfileImage = user.profileImage || ''; // Ensure user object has a profileImage property
                } else {
                    console.error('Failed to fetch donor details:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching donor details:', error);
            }
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                // Check if the file is already uploaded using FileReader for comparison
                const fileReader = new FileReader();
                
                fileReader.onload = (e) => {
                    const uploadedFile = this.donation.image;

                    // If there's an already uploaded image, check its contents
                    if (uploadedFile) {
                        const uploadedReader = new FileReader();
                        
                        uploadedReader.onload = (uploadedEvent) => {
                            // Compare base64 string of both files
                            const uploadedFileContent = uploadedEvent.target.result;
                            const newFileContent = e.target.result;

                            if (uploadedFileContent === newFileContent) {
                                alert('This image is already uploaded.');
                                console.log('Duplicate image upload attempt:', file.name);
                                return; // Prevent duplicate upload
                            } else {
                                // Set the new image if it's different
                                this.donation.image = file;
                                this.imagePreview = URL.createObjectURL(file);
                                console.log('Image replaced with new upload:', file.name);
                            }
                        };

                        // Read the uploaded file
                        uploadedReader.readAsDataURL(uploadedFile);
                    } else {
                        // If no file uploaded yet, simply set the new image
                        this.donation.image = file;
                        this.imagePreview = URL.createObjectURL(file);
                        console.log('Image uploaded:', file.name);
                    }
                };

                // Read the new file to trigger onload
                fileReader.readAsDataURL(file);
            } else {
                console.log('No image selected.');
            }
        },

        triggerFileInput() {
            this.$refs.fileInput.click(); 
        },
        resetForm() {
            console.log('Resetting form...');
            this.donation = {
                donorId: "p8v0JBWhlfNZ13DzpBFN", 
                donorName: '',
                donorProfileImage: '',
                itemsDonated: '',
                condition: 'Brand New',
                itemCategory: '',
                petType: '',
                breed: '',
                image: null 
            };
            this.filteredBreeds = [];
            this.imagePreview = ''; 
        },
        updateBreeds() {
            console.log('Updating breeds for pet type:', this.donation.petType);
            this.filteredBreeds = this.breeds[this.donation.petType] || [];
            this.donation.breed = ''; 
        }
    }
};
</script>
  
<style>
/* Button and form styling */
.create-listing-button {
    margin-top: 20px;
    padding: 10px 15px;
    background-color: #2c3e50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
}

.create-listing-button:hover {
    background-color: #34495e;
}

/* Modal styles */
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
    position: relative;
}

/* Form styles */
.form-group {
    margin-bottom: 20px;
    text-align: left;
    font-family: 'Montserrat', sans-serif;
}

.form-actions {
    text-align: right;
}

/* Image upload box */
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


/* Close button in top-right corner */
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

/* Modal title style */
.modal-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    font-size: 24px;
}

</style>