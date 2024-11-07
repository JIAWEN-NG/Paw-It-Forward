<template>
  <div class="wrapper">
      <!-- Button to add story, now positioned in the top right corner -->
      <!-- Button to add a testimonial that redirects to fundraising -->
      <button class="add-testimonial wave-button" @click="openModal">
        Add Your Story
      </button>
      

      <h2>Stories of Hope</h2>
      <p class="subtext">Share your story of how donations brought hope and healing to your pet in need.</p>

      <!-- Animal animation section generated in JavaScript -->
      <div class="animal-runner">
          <div class="animal-strip" v-html="animalBanner"></div>
      </div>

      <div class="cols">
      <div class="col" v-for="(testimonial, index) in paginatedTestimonials" :key="index" @click="showExpandedModal(testimonial)">
        <div class="card-inner">
          <div class="card-front">
            <div class="profile-photo" :style="{ backgroundImage: `url(${testimonial.image})` }"></div>
            <div class="icon-overlay">
              <span class="emoji toy-emoji">🦴</span>
              <span class="emoji paw-emoji">🐾</span>
            </div>
            <div class="testimonial-content">
              <p class="pet-name">{{ testimonial.animalName }}</p>
              <span class="pet-problem">{{ testimonial.background }}</span>
            </div>
          </div>
          <div class="card-back">
            <p>{{ testimonial.donationJourney }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
      <span class="pagination-text">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>


    <!-- Modal for expanded testimonial -->
    <div v-if="expandedTestimonial" class="modal-backdrop" @click.self="expandedTestimonial = null">
      <div class="modal-content">
        <span class="close-btn" @click="expandedTestimonial = null">&times;</span>
        <h2>{{ expandedTestimonial.animalName }}</h2>
        <p>{{ expandedTestimonial.donationJourney }}</p>
      </div>
    </div>

      <!-- Modal for adding testimonials -->
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
          <div class="modal-content animated-modal">
              <span class="close" @click="closeModal">&times;</span>
              <h2>Add Your Story</h2>
              <form @submit.prevent="submitForm" class="styled-form">
                  <div class="form-group">
                      <label for="animalName">Animal Name:</label>
                      <input type="text" id="animalName" v-model="newTestimonial.animalName" required />
                  </div>
                  <div class="form-group">
                      <label for="image">Add a Photo of the Animal:</label>
                      <div class="file-upload">
                          <label class="upload-button" for="imageUpload">Choose File</label>
                          <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" required />
                          <span class="file-name">{{ imagePreview ? 'Image Selected' : 'No file chosen' }}</span>
                      </div>
                      <img v-if="imagePreview" :src="imagePreview" alt="Image Preview" class="image-preview" />
                  </div>
                  <div class="form-group">
                      <label for="background">Background:</label>
                      <input type="text" id="background" v-model="newTestimonial.background" required />
                  </div>
                  <div class="form-group">
                      <label for="donationJourney">How the Donation Helped:</label>
                      <textarea id="donationJourney" v-model="newTestimonial.donationJourney" required></textarea>
                  </div>
                  <button
                      type="button"
                      @click="submitForm"
                      :disabled="isSubmitting"
                      :class="{ 'success': uploadSuccess, 'loading': isSubmitting }"
                      class="submit-button"
                  >
                      <span v-if="isSubmitting" class="loading-icon"></span>
                      <span v-else-if="uploadSuccess" class="checkmark-icon">
                          <svg viewBox="0 0 52 52">
                              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                              <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
                          </svg>
                      </span>
                      <span v-else>Upload</span>
                  </button>
              </form>
          </div>
      </div>

      <!-- Floating Donate Now Button -->
      
      <div class="donate-popup-container">
    <div class="heartfelt-message-container">
      <p class="heartfelt-message">
        "Your kindness can be the difference between a wagging tail and a life of struggle. Help us give these pets a second chance at happiness."
      </p>
    </div>
    <router-link to="/fundraising" class="donate-popup animated-donate-button">
      Donate Now <i class="fas fa-heart heart-icon"></i>
    </router-link>

    <!-- Star SVGs -->
    <div class="star-1">
      <svg viewBox="0 0 784.11 815.53">
        <path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" class="fil0"></path>
      </svg>
    </div>
    <div class="star-2">
      <svg viewBox="0 0 784.11 815.53">
        <path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" class="fil0"></path>
      </svg>
    </div>
    <div class="star-3">
      <svg viewBox="0 0 784.11 815.53">
        <path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" class="fil0"></path>
      </svg>
    </div>
    <div class="star-4">
      <svg viewBox="0 0 784.11 815.53">
        <path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" class="fil0"></path>
      </svg>
    </div>
    <div class="star-5">
      <svg viewBox="0 0 784.11 815.53">
        <path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" class="fil0"></path>
      </svg>
    </div>
      </div>
  </div>
  </template>
  
  
  <script>
import pixcat from '@/assets/pixcat.png';
import pixdog from '@/assets/pixdog.png';
export default {
  props: ['testimonial'],
  data() {
    return {
      expandedTestimonial: null,
      hoveredIndex: null,
      expandedIndex: null,
      showModal: false, // Keep this for modal visibility
      newTestimonial: {
        animalName: '',
        image: null,
        background: '',
        donationJourney: ''
      },
      imagePreview: '',
      isSubmitting: false,
      uploadSuccess: false,
      testimonials: [],
      currentPage: 1,
      itemsPerPage: 9
    };
  },
  computed: {
    animalBanner() {
      let bannerContent = '';
      for (let i = 0; i < 70; i++) {
        const animalImg = i % 2 === 0 ? pixcat : pixdog;
        bannerContent += `
            <img src="${animalImg}" alt="${i % 2 === 0 ? 'Running Cat' : 'Running Dog'}"
                style="width: 50px; height: 50px; display: inline-block; object-fit: cover;"
            />
        `;
      }
      return bannerContent + bannerContent;
    },
    paginatedTestimonials() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.testimonials.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.testimonials.length / this.itemsPerPage);
    }
  },
  methods: {
    showExpandedModal(testimonial) {
        this.expandedTestimonial = testimonial; // Set the expanded testimonial
    },
    showModal(index) {
      this.expandedIndex = index;
    },
    closeModal2() {
      this.expandedIndex = null;
    },
    async fetchTestimonials() {
      console.log("Fetching testimonials...");
      try {
        const response = await fetch('http://localhost:8000/api/testimonials');
        if (!response.ok) throw new Error(`Failed to fetch testimonials: ${response.statusText}`);
        
        const data = await response.json();
        this.testimonials = data.map(testimonial => ({
          animalName: testimonial.animalName || 'Unknown Pet',
          image: `data:image/jpeg;base64,${testimonial.imageBase64}`,
          background: testimonial.background || 'Unknown Problem',
          donationJourney: testimonial.donationJourney || ''
        }));

        console.log("Testimonials fetched:", this.testimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.newTestimonial.image = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    async submitForm() {
      console.log("Submitting form...");
      this.isSubmitting = true;
      this.uploadSuccess = false;

      const formData = new FormData();
      formData.append('donationJourney', this.newTestimonial.donationJourney || '');
      formData.append('animalName', this.newTestimonial.animalName || '');
      formData.append('background', this.newTestimonial.background || '');

      if (this.newTestimonial.image) {
        formData.append('image', this.newTestimonial.image);
      }

      try {
        const response = await fetch('http://localhost:8000/api/upload-testimonial', {
          method: 'POST',
          body: formData
        });
        console.log("Response status:", response.status);
        if (!response.ok) throw new Error(`Failed to upload testimonial: ${response.statusText}`);

        console.log("Upload successful!");
        this.uploadSuccess = true;

        setTimeout(() => {
          this.uploadSuccess = false;
          this.closeModal();
          this.fetchTestimonials(); // Refresh testimonials after submission
        }, 2000);
      } catch (error) {
        console.error('Error uploading testimonial:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.newTestimonial = {
        animalName: '',
        image: null,
        background: '',
        donationJourney: ''
      };
      this.imagePreview = '';
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },
  mounted() {
    console.log("Component mounted, fetching testimonials...");
    this.fetchTestimonials();
  },
  redirectToDonation() {
    this.$router.push({ name: 'fundraising' }); // Replace 'donate' with the name of your route
  }
};
</script>

<style scoped>

.wrapper {
  position: relative;
  background-color: #1e3a5f; /* Dark blue */
  color: #fdfdfd; /* Light text */
  padding: 2rem;
}

h2 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff; /* White text */
  margin-bottom: 0.2rem;
  text-align: center;
}

.subtext {
  font-size: 1.1rem;
  color: #cfd8dc; /* Light grey text */
  text-align: center;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
}

.cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
  justify-items: center;
  margin-top: 3rem;
}

.col {
  width: 250px;
  height: 300px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px; /* Add this to enable 3D effect */
}



.card-inner {
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  border-radius: 15px;
  background-color: #243b55;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}

.card-inner.flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
}



.card-back {
  transform: rotateY(180deg);
  background-color: #1b2d47;
  color: #e0efff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-backdrop2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content2 {
  background-color: #243b55;
  color: #d1e1f1;
  padding: 2rem;
  border-radius: 15px;
  width: 80%;
  max-width: 800px;
  height: 70%;
  overflow-y: auto;
  animation: scaleIn 0.5s ease forwards;
}

@keyframes scaleIn {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.card-inner:hover {
  transform: scale(1.05) translateZ(0);
  background-color: #1b2d47; /* Darker shade for hover */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.profile-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 3px solid #002982;
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-overlay {
    position: absolute; /* Position relative to the card */
    top: 20px; /* Adjust this to place below the profile photo */
    left: 50%; /* Center it horizontally */
    transform: translateX(-50%); /* Adjust to center */
    display: flex; /* Use flexbox for alignment */
    gap: 10px; /* Space between the emojis */
    z-index: 2; /* Ensure it's above the card background */
}


.emoji {
  font-size: 1.5em; /* Adjust the size as needed */
  transition: transform 0.2s ease-in-out;
}

.emoji:hover {
  transform: scale(1.2);
}

.toy-emoji {
  animation: bounce 2s infinite;
}

.paw-emoji {
  animation: pulse 3s infinite;
}

/* Bounce Animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Pulse Animation */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.testimonial-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Center content vertically */
  height: 100%; /* Ensures it takes up the full height of the card */
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  cursor: pointer;
  color: #fcfaf9;
  z-index: 3; /* Ensures button appears above everything else */
}


/* animal gif */

.animal-runner {
  overflow: hidden;
  background-color: #1e3a5f;
  padding: 10px 0;
  width: 100%;
}

.animal-strip {
  display: flex;
  animation: scroll 20s linear infinite;
  gap: 10px; /* Add space between images if needed */
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(50%);
  }
}





.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(220, 207, 207, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #243b55;
  color: #d1e1f1; /* Soft light blue */
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  transform: scale(0.5);
  opacity: 0;
  animation: scaleIn 0.5s ease forwards;
}

.add-testimonial {
  position: fixed; /* Ensures the button stays fixed in place while scrolling */
  top: 20px; /* Adjust as needed */
  left: 200px; /* Move the button to the left side */
  background: linear-gradient(90deg, #5c6bc0, #e0e3f6); /* Gradient in lighter blues */
  color: #ffffff;
  background-size: 200% 100%;
  border: none;
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: wave-smooth 4s ease-in-out infinite;
  transition: transform 0.3s ease;
  z-index: 2000; /* Higher than other elements */
}

.add-testimonial:hover {
  transform: translateY(-3px);
}




@keyframes wave-smooth {
  0% {
    background-position: 0% 0;
  }
  50% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0% 0;
  }
}

.styled-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
  color: #fffefe;
}

input[type="text"],
textarea {
  padding: 0.5rem;
  border: 1px solid #000000;
  border-radius: 5px;
  font-size: 1rem;
    color: #050000; /* Change this to your desired text color */
}


textarea {
  resize: vertical;
  min-height: 80px;
}

.file-upload {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upload-button {
  background-color: #5c6bc0; /* Soft blue */
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.file-name {
  font-size: 0.9rem;
  color: #757575;
}

input[type="file"] {
  display: none;
}

.submit-button {
  background-color: #3f51b5; /* Blue */
  color: #ffffff;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, transform 0.3s;
  position: relative;
  min-width: 100px;
}

.submit-button.success {
  background-color: #4CAF50; /* Green color for success */
  color: white;
  transform: scale(1.1);
}

.submit-button.loading {
  background-color: #6961ff;
  color: transparent;
}

.loading-icon {
  position: absolute;
  font-size: 1.5rem;
}

.loading-icon::after {
  content: '';
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  animation: spin 1s linear infinite;
}

/* SVG checkmark styles */
.checkmark-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: inline-block;
  position: relative;
}

.checkmark-circle {
  stroke: white;
  stroke-width: 2;
  animation: circleDraw 0.5s ease-in-out forwards;
}

.checkmark-check {
  stroke: white;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: checkDraw 0.3s ease-in-out 0.5s forwards;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes circleDraw {
  0% { stroke-dasharray: 0, 150; }
  100% { stroke-dasharray: 150, 150; }
}

@keyframes checkDraw {
  0% { stroke-dasharray: 0, 36; }
  100% { stroke-dasharray: 36, 36; }
}





.image-preview {
  width: 100%;
  max-width: 150px;
  margin-top: 0.5rem;
  border-radius: 5px;
}

/* Animations */
@keyframes scaleIn {
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 1.5rem;
  cursor: pointer;
}

/* profile pic */



.icon-overlay {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.emoji {
  font-size: 2em; /* Increase size of emojis */
  transition: transform 0.2s ease-in-out;
}

.emoji:hover {
  transform: scale(1.2); /* Scale up on hover for a dynamic effect */
}

.toy-emoji {
  animation: bounce 2s infinite; /* Toy emoji has a gentle bounce animation */
}

.paw-emoji {
  animation: pulse 3s infinite; /* Paw emoji has a slow pulsing effect */
}

/* Bounce Animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Pulse Animation */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}



.pet-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #fefcfc;
  margin-top: 40px;
  text-align: center;
}

.pet-problem {
  color: #fffcfc;
  font-size: 1rem;
  text-align: center;
}

.pet-name, .pet-problem {
  margin: 0; /* Remove any extra margin */
  padding: 0.5rem 0; /* Adjust padding for spacing */
  text-align: center;
}

.description {
  color: #fffefe;
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
}

/* donate now */
.heartfelt-message-container {
  background-color: #5a73a1; /* Soft blue background */
  color: #e0efff; /* Light text color */
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Soft shadow for floating effect */
  text-align: center;
  font-style: italic;
  font-size: 1rem;
  line-height: 1.5;
  max-width: 250px;
  margin-bottom: 0.5rem;
  animation: fadeIn 1s forwards;
}

/* Donate Now Button Styling */
/* Wrapper to position the entire message and button on the right side */
.donate-popup-container {
  position: fixed;
  bottom: 50px; /* Adjust for vertical positioning */
  right: 30px; /* Align to the right side of the screen */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center-aligns the button below the message */
  gap: 0.5rem;
  z-index: 1000;
}

/* Heartfelt message styling */
.heartfelt-message-container {
  background-color: #5a73a1; /* Soft blue background */
  color: #e0efff; /* Light text color */
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Soft shadow for floating effect */
  text-align: center; /* Align text to the right */
  font-style: italic;
  font-size: 1rem;
  line-height: 1.5;
  max-width: 250px;
  animation: fadeIn 1s forwards;
}

/* Donate Now Button Styling */
.animated-donate-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3e67a8, #77a0f7); /* Gradient for button */
  color: #ffffff; /* White text color */
  font-size: 1.2rem;
  font-weight: 600;
  border: 2px solid #bcbcbb; /* Yellow border for contrast */
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Hover Effects for Button */
.animated-donate-button:hover {
  background: linear-gradient(135deg, #5679c7, #6a8ed9); /* Lighten gradient on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px); /* Slight lift on hover */
}

/* Heart Icon Styling */
.heart-icon {
  color: #ff4b5c; /* Red heart icon */
  font-size: 1.2rem;
  transition: transform 0.2s ease-in-out;
}

.animated-donate-button:hover .heart-icon {
  transform: scale(1.1); /* Slight scaling of the heart on hover */
}

/* Fade-in Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}



/* Set the star colors to blue */
.fil0 {
  fill: #02008e
}

.star-1, .star-2, .star-3, .star-4, .star-5 {
  position: absolute;
  width: 25px; /* Or any size you prefer */
  height: auto;
  filter: drop-shadow(0 0 0 #02008e); /* Initial blue color for stars */
  z-index: 2; /* Ensure they are above other content */
  transition: all 1s cubic-bezier(0.05, 0.83, 0.43, 0.96);
}


.star-1 { top: 20%; left: 20%; }
.star-2 { top: 45%; left: 45%; width: 15px; }
.star-3 { top: 40%; left: 40%; width: 5px; }
.star-4 { top: 20%; left: 40%; width: 8px; }
.star-5 { top: 25%; left: 45%; width: 15px; }
.star-6 { top: 5%; left: 50%; width: 5px; }

/* Blue stars on hover */
.animated-donate-button:hover .star-1 {
  top: -80%; left: -30%; filter: drop-shadow(0 0 10px #02008e); z-index: 2;
}
.animated-donate-button:hover .star-2 {
  top: -25%; left: 10%; filter: drop-shadow(0 0 10px #02008e); z-index: 2;
}
.animated-donate-button:hover .star-3 {
  top: 55%; left: 25%; filter: drop-shadow(0 0 10px #02008e); z-index: 2;
}
.animated-donate-button:hover .star-4 {
  top: 30%; left: 80%; filter: drop-shadow(0 0 10px #02008e); z-index: 2;
}
.animated-donate-button:hover .star-5 {
  top: 25%; left: 115%; filter: drop-shadow(0 0 10px #02008e); z-index: 2;
}
.animated-donate-button:hover .star-6 {
  top: 5%; left: 60%; filter: drop-shadow(0 0 10px #02008e); z-index: 2;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}






.paw-icon {
  font-size: 1.5rem;
  color: #5d4037;
  animation: pawMove 1.5s ease-in-out infinite;
}

@keyframes pawMove {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.dog-tail {
  font-size: 1.5rem;
  color: #5d4037;
  display: inline-block;
  animation: tailWag 0.4s ease-in-out infinite alternate;
  transform-origin: top right;
}

@keyframes tailWag {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(15deg);
  }
}

.pagination {
    display: flex;
    justify-content: center; /* Center all items in the flex container */
    align-items: center; /* Center align items vertically */
    margin-top: 2rem; /* Adjust spacing above */
    margin-bottom: 1rem; /* Optional for spacing below */
}

.pagination-text {
    margin: 0 10px; /* Add margin for spacing between buttons and text */
}

.pagination button {
  background-color: #5c6bc0;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin: 0 0px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}

</style>