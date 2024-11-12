<template>
  <div class="container testimonial-container">
    <h2 class="title">Stories of Hope</h2>
    <p class="subtitle">Share your story of how donations brought hope and healing to your pet in need.</p>

    <!-- Only show the button if the user is logged in -->
    <button 
      v-if="isUserLoggedIn" 
      class="add-testimonial wave-button" 
      @click="openModal"
    >
      Add Your Story
    </button>

    <!-- If the user is not logged in, display a message or redirect to login -->
    <div v-else class="login-message-container">
      <p class="login-message">
        <span class="login-icon">🔒</span>
        Please <router-link to="/login" class="login-link">login</router-link> to add your story.
      </p>
    </div>

    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="testimonial in paginatedTestimonials" :key="testimonial.id" class="col mb-4">
        <div 
          class="card testimonial-card" 
          @mouseenter="flipCard(testimonial.id)" 
          @mouseleave="resetFlip"
          :class="{ 'is-flipped': flippedCardId === testimonial.id }"
        >
          <div class="card-front">
            <div class="profile-photo-container">
              <img :src="getImageUrl(testimonial.imageBase64)" alt="Animal Photo" v-if="testimonial.imageBase64" />
              <div class="no-image" v-else>No Image</div>
            </div>
            <div class="name-banner">
              <p class="author">{{ testimonial.animalName }}</p>
            </div>
            <p class="testimonial-text">{{ testimonial.background }}</p>
            <p class="client-signature">{{ testimonial.userName }}</p>
          </div>
          <div class="card-back">
            <div class="back-content">
              <div class="back-photo-container">
                <img :src="getImageUrl(testimonial.imageBase64)" alt="Enlarged Animal Photo" v-if="testimonial.imageBase64" />
              </div>
              <p class="donation-journey">"{{ testimonial.donationJourney }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for adding testimonials -->
    <div v-if="showModal" class="form-backdrop" @click.self="closeModal">
      <div class="form-content animated-modal">
        <!-- Close Button -->
        <button class="close-button" @click="closeModal">&times;</button>
        <h2 class="form-title">Add Your Story</h2>
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
            <textarea 
              id="donationJourney" 
              v-model="newTestimonial.donationJourney" 
              required
              maxlength="300" 
              @input="updateWordCount"
            ></textarea>
            <p class="word-count">Word count: {{ wordCount }} / 50</p>
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
  </div>

  <!-- Floating Donate Now Button -->
  <div class="donate-popup-container">
    <div v-if="showHeartfeltMessage" :class="['heartfelt-message-container', { 'fade-out': isFading }]">
      <p class="heartfelt-message">
        "Your kindness can be the difference between a wagging tail and a life of struggle. Help us give these pets a second chance at happiness."
      </p>
    </div>
    <router-link to="/fundraising" class="donate-popup animated-donate-button">
      Donate Now <i class="fas fa-heart heart-icon"></i>
    </router-link>
  </div>

  <div class="pagination-container">
    <button :disabled="currentPage === 1" @click="prevPage">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button :disabled="currentPage === totalPages" @click="nextPage">Next</button>
  </div>
</template>

<script>
import axios from 'axios';
import { getAuth } from 'firebase/auth'; // Firebase Auth SDK
import pixcat from '@/assets/pixcat.png';
import pixdog from '@/assets/pixdog.png';
import testimonialBackground from '@/assets/animals.jpg';

export default {
  data() {
    return {
      testimonials: [],
      flippedCardId: null,
      currentPage: 1,
      itemsPerPage: 6,
      showModal: false,
      newTestimonial: {
        animalName: '',
        image: null,
        background: '',
        donationJourney: ''
      },
      imagePreview: '',
      isSubmitting: false,
      uploadSuccess: false,
      showHeartfeltMessage: false,
      isFading: false,
      wordCount: 0,  // Track word count
      isUserLoggedIn: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.testimonials.length / this.itemsPerPage);
    },
    paginatedTestimonials() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.testimonials.slice(start, end);
    }
  },
  methods: {
    async fetchTestimonials() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/testimonials`);
        this.testimonials = response.data; // Set testimonials to the response data
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    },

    getImageUrl(imageBase64) {
      return `data:image/jpeg;base64,${imageBase64}`;
    },
    flipCard(id) {
      this.flippedCardId = id; // Set the flipped card when mouse enters
    },
    resetFlip() {
      this.flippedCardId = null; // Reset the flipped card when mouse leaves
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
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
    updateWordCount() {
      // Split text into words and count them
      const wordCount = this.newTestimonial.donationJourney.trim().split(/\s+/).length;
      this.wordCount = wordCount;
    },
    async submitForm() {
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
        const response = await axios.post(`${this.$api_url}`, formData);
        if (!response.ok) throw new Error('Failed to upload testimonial');
        this.uploadSuccess = true;
        setTimeout(() => {
          this.uploadSuccess = false;
          this.closeModal();
          this.fetchTestimonials();
        }, 2000);
      } catch (error) {
        console.error('Error uploading testimonial:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  },
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  },
  async checkLoginStatus() {
      const user = await getAuth().currentUser;
      this.isUserLoggedIn = user !== null;
  }
  },
  mounted() {
    this.fetchTestimonials();

    // Heartfelt message behavior
    this.showHeartfeltMessage = true;
    setTimeout(() => {
      this.isFading = true;
      setTimeout(() => {
        this.showHeartfeltMessage = false;
      }, 1000);
    }, 3000);
  }
};
</script>


<style scoped>

* {
  font-family: 'Montserrat', sans-serif;
}
.testimonial-container {
  padding: 40px 20px 20px;
  background: linear-gradient(103deg, rgba(252, 238, 213, 0.6) 6.43%, rgba(252, 238, 213, 0.6) 78.33%, rgba(255, 231, 186, 0.6) 104.24%);
}
.title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}
.subtitle {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 50px;
}
/* Responsive Styles */
@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .add-testimonial {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    position: absolute;
    right: 20px;
    top: 80px;
  }

  .row-cols-md-3 {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .testimonial-card {
    width: 90%;
    height: auto;
    margin-bottom: 20px;
  }

  .pagination-container {
    flex-direction: column;
    align-items: center;
  }

  .pagination-container button {
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .testimonial-container {
    padding: 20px;
  }

  .card-front, .card-back {
    padding: 1rem;
  }

  .card-front img, .card-back img {
    max-width: 100%;
  }

  .form-content {
    width: 100%;
    padding: 1.5rem;
    box-shadow: none;
  }

  .form-group {
    width: 100%;
  }

  .submit-button {
    width: 100%;
  }

  .pagination-container {
    display: block;
  }

  .pagination-container button {
    width: 100%;
  }
}

.testimonial-card {
  width: 90%; /* Make the card width smaller */
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out; /* Smooth transition for scaling and flipping */
  cursor: pointer;
  height: 400px; /* Set consistent card height */
  background-image: url('@/assets/animals.jpg'); /* Adjust the path as needed */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.testimonial-card:hover {
  transform: scale(1.50) rotateY(180deg); /* Scale up and flip the card at the same time */
}

.testimonial-card.is-flipped {
  transform: rotateY(180deg) scale(1.50); /* Keep scaling even after flip */
  z-index: 9999;
}

.card-front {
  padding: 2rem;
  color: #fff;
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}
.card-back {
  transform: rotateY(180deg);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 15px;
  background: rgba(248, 249, 250, 0.9);
}

.back-photo-container {
  width: 200px; 
  height: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: hidden;
}
.back-photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 2px solid #ddd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}
.back-content {
  margin: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-photo-container {
  position: relative;
  margin: 0 auto;
  top: -40px; /* Adjust to make sure profile image is centered */
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  z-index: 2; /* Ensure profile photo appears above other elements */
}

.profile-photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-overlay {
  position: absolute; /* Position relative to the card */
  top: 62px; /* Position slightly above the profile photo */
  left: 50%; /* Center it horizontally */
  transform: translateX(-50%); /* Adjust to center */
  display: flex; /* Use flexbox for alignment */
  gap: 10px; /* Space between the emojis */
  z-index: 3; /* Ensure it's above the card background */
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


.no-image {
  width: 100%;
  height: 100%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.name-banner {
  position: relative;
  top: -60px; /* Adjust to align closely with the profile image */
  background: #002A48;
  border-radius: 30px;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  z-index: 3; /* Ensure the banner appears in front */
}
.author {
  font-size: 18px;
  font-weight: bold;
  color: white;
  text-align: center;
}
.testimonial-text {
  font-size: 14px;
  color: #5d5d5d;
  margin-top: 20px;
  margin-bottom: 10px;
}
.client-signature {
  font-size: 16px;
  font-style: italic;
  color: #333;
  margin-top: 20px;
}
.donation-journey {
  font-size: 14px;
  color: #333;
}
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 15px; /* Space between the buttons */
}

.pagination-container button {
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  background-color: #002A48; /* Light background */
  border: 1px solid #487fff; /* Border color */
  border-radius: 4px; /* Rounded corners */
  transition: background-color 0.3s ease, transform 0.2s ease;
  color: #fefdfd;
}

.pagination-container button:hover {
  background-color: #ddd; /* Darker background on hover */
  transform: scale(1.05); /* Slight scaling effect on hover */
}

.pagination-container button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}



/* animal gif */

.animal-runner {
  overflow: hidden;
  /* background-color: #1e3a5f; */
  background-color: transparent;
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

/* add testimonial */

.add-testimonial {
  background: linear-gradient(90deg, #191e3b, #e0e3f6); /* Gradient in lighter blues */
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
  position: absolute;
  right: 110px; /* Positioning it towards the right */
  top: 100px; /* Optional: Adjust to position vertically as desired */
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

/* Style for the login prompt */
.login-message-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.login-message {
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-icon {
  font-size: 1.5rem; /* Larger icon size */
  color: #ff4b5c; /* Red color for the lock */
}

.login-link {
  color: #007BFF;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #0056b3; /* Darker blue when hovered */
}

/* form */

.form-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  animation: fadeIn 0.5s ease-in-out;
}

.form-content {
  position: relative; /* Ensure the close button is positioned correctly */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  width: 400px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.form-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(220, 220, 220, 0.7); /* Slightly darkened backdrop */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Ensure the backdrop is above other content */
}


.styled-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

label {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.1rem;
}

input[type="text"],
textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
textarea:focus {
  border-color: #007BFF;
}


textarea {
  resize: vertical;
  min-height: 100px;
}

.word-count {
  font-size: 0.9rem;
  color: #888;
  margin-top: 5px;
}

.word-limit-reached {
  border-color: red; /* Change border color when word limit is reached */
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

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 2rem; /* Increase size for better visibility */
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-weight: bold;
  z-index: 9999; /* Ensure it's above other content */
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #ff4b5c; /* Red color for hover effect */
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

/* Donate Now Button Styling */

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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.heartfelt-message-container {
  background-color: #5a73a1; /* Soft blue background */
  color: #e0efff; /* Light text color */
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-style: italic;
  font-size: 1rem;
  line-height: 1.5;
  max-width: 250px;
  margin-bottom: 0.5rem;
  opacity: 1; /* Fully visible by default */
  animation: fadeIn 1s forwards; /* Fade in animation */
}

.fade-out {
  animation: fadeOut 1s forwards; /* Fade out animation */
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

</style>