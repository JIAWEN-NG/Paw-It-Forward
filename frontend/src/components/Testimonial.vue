<template>
  <div class="testimonial-container">
    <div class="testimonial-header">
      <div class="text-container">
        <h2 class="title">Stories of Hope</h2>
        <p class="subtitle">Share your story of how donations brought hope and healing to your pet in need.</p>
      </div>


      <!-- Only show the button if the user is logged in and loading is complete -->
      <div class="button-container">
        <button v-if="!isLoading && isUserLoggedIn" class="add-testimonial wave-button" style="align-self: center;"
          @click="openModal">
          Add Your Story
        </button>

        <!-- If the user is not logged in and loading is complete, display a message or redirect to login -->
        <div v-else-if="!isLoading && !isUserLoggedIn" class="login-message-container">
          <p class="login-message">
            <span class="login-icon">🔒</span>
            Please <router-link to="/login" class="login-link">login</router-link> to add your story.
          </p>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="spinner-container">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
      

    <div v-else class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="testimonial in paginatedTestimonials" :key="testimonial.id" class="col mb-4">
        <div class="card testimonial-card" @mouseenter="flipCard(testimonial.id)" @mouseleave="resetFlip"
          :class="{ 'is-flipped': flippedCardId === testimonial.id }">
          <div class="card-front">
            <div class="profile-photo-container top-center">
              <img :src="getImageUrl(testimonial.imageBase64)" alt="Animal Photo" v-if="testimonial.imageBase64" />
              <div class="no-image" v-else>No Image</div>
              <div class="icon-overlay">
                <span class="emoji toy-emoji">🦴</span>
                <span class="emoji paw-emoji">🐾</span>
              </div>
            </div>
            <p class="author">{{ testimonial.animalName }}</p>
            <p class="testimonial-text">{{ testimonial.background }}</p>
          </div>
          <div class="card-back"
            :style="{ backgroundImage: `url('data:image/jpeg;base64,${testimonial.imageBase64}')` }">
            <div class="overlay">
              <img src="@/assets/quotes.png" alt="Quote" class="quote-icon-start" />
              <p class="donation-journey">
                {{ testimonial.donationJourney }}
              </p>
              <img src="@/assets/quotes.png" alt="Quote" class="quote-icon-end flip-quote" />
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
        <h2 class="form-title">Tell us your story!</h2>

        <!-- Scrollable content container -->
        <div class="scroll-container">
          <form @submit.prevent="submitForm" class="styled-form">
            <!-- Form fields remain unchanged -->
            <div class="form-group">
              <label for="animalName">What's your pet's name?</label>
              <input type="text" id="animalName" v-model="newTestimonial.animalName" required />
            </div>
            <div class="form-group">
              <label for="image">Share a photo of your pet!</label>
              <div class="dotted-area">
                <img v-if="imagePreview" :src="imagePreview" alt="Image Preview" class="image-preview" />
                <span v-else class="placeholder-text">No photo selected</span>
              </div>
              <div class="file-upload">
                <label class="upload-button" for="imageUpload">Select a photo</label>
                <input type="file" id="imageUpload" @change="handleImageUpload" accept="image/*" required />
              </div>
            </div>
            <div class="form-group">
              <label for="background">Give a little background about your pet's story</label>
              <input type="text" id="background" v-model="newTestimonial.background" required />
            </div>
            <div class="form-group">
              <label for="donationJourney">Describe how this donation made a difference!</label>
              <textarea id="donationJourney" v-model="newTestimonial.donationJourney" required maxlength="300"
                @input="updateWordCount" :class="{ 'word-limit-reached': wordCount >= 50 }"></textarea>
              <p class="word-count">Words used: {{ wordCount }} / 50</p>
            </div>
            <button type="button" @click="submitForm" :disabled="isSubmitting"
              :class="{ 'success': uploadSuccess, 'loading': isSubmitting }" class="submit-button">
              <span v-if="isSubmitting" class="loading-icon"></span>
              <span v-else-if="uploadSuccess" class="checkmark-icon">
                <svg viewBox="0 0 52 52">
                  <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
                </svg>
              </span>
              <span v-else>Share Your Story!</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="animal-runner">

  <div class="animal-strip">
    <!-- Original set of images -->
    <img src="@/assets/pixcat.png" alt="Running Cat" class="animal-image" />
    <img src="@/assets/pixdog.png" alt="Running Dog" class="animal-image" />
    <img src="@/assets/pixcat.png" alt="Running Cat" class="animal-image" />
    <img src="@/assets/pixdog.png" alt="Running Dog" class="animal-image" />
    <img src="@/assets/pixcat.png" alt="Running Cat" class="animal-image" />
    <img src="@/assets/pixdog.png" alt="Running Dog" class="animal-image" />
    <img src="@/assets/pixcat.png" alt="Running Cat" class="animal-image" />
    <img src="@/assets/pixdog.png" alt="Running Dog" class="animal-image" />
    <img src="@/assets/pixcat.png" alt="Running Cat" class="animal-image" />
    <img src="@/assets/pixdog.png" alt="Running Dog" class="animal-image" />
    <img src="@/assets/pixcat.png" alt="Running Cat" class="animal-image" />
    <img src="@/assets/pixdog.png" alt="Running Dog" class="animal-image" />
    <!-- Repeat as needed -->


    <!-- Duplicate set of images for seamless scrolling -->
    <img src="@/assets/pixcat.png" alt="Running Cat" class="animal-image" />
    <img src="@/assets/pixdog.png" alt="Running Dog" class="animal-image" />
    <img src="@/assets/pixcat.png" alt="Running Cat" class="animal-image" />
    <img src="@/assets/pixdog.png" alt="Running Dog" class="animal-image" />
    <img src="@/assets/pixcat.png" alt="Running Cat" class="animal-image" />
    <img src="@/assets/pixdog.png" alt="Running Dog" class="animal-image" />
    <img src="@/assets/pixcat.png" alt="Running Cat" class="animal-image" />
    <img src="@/assets/pixdog.png" alt="Running Dog" class="animal-image" />
    <img src="@/assets/pixcat.png" alt="Running Cat" class="animal-image" />
    <img src="@/assets/pixdog.png" alt="Running Dog" class="animal-image" />
    <img src="@/assets/pixcat.png" alt="Running Cat" class="animal-image" />
    <img src="@/assets/pixdog.png" alt="Running Dog" class="animal-image" />
    <!-- Repeat as needed -->

  </div>
  </div>

  <!-- Pagination Controls -->
<div class="pagination-container">
  <button 
    @click="changePage(currentPage - 1)" 
    :disabled="currentPage === 1" 
    class="btn btn-outline-primary pagination-button">
    Previous
  </button>

  <span class="pagination-text">Page {{ currentPage }} of {{ totalPages }}</span>

  <button 
    @click="changePage(currentPage + 1)" 
    :disabled="currentPage === totalPages" 
    class="btn btn-outline-primary pagination-button">
    Next
  </button>
</div>

  <!-- Floating Donate Now Button -->
  <div class="donate-popup-container">
    <div v-if="showHeartfeltMessage" :class="['heartfelt-message-container', { 'fade-out': isFading }]">
      <p class="heartfelt-message">
        "Your kindness can be the difference between a wagging tail and a life of struggle. Help us give these pets a
        second chance at happiness."
      </p>
    </div>
    <router-link to="/fundraising" class="donate-popup animated-donate-button">
      Donate Now <i class="fas fa-heart heart-icon"></i>
    </router-link>
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
      wordCount: 0,
      isLoading: true,
      isUserLoggedIn: null, // Changed to null initially
      pixcat,
      pixdog,
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
      this.isLoading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/testimonials`);
        this.testimonials = response.data;
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        this.isLoading = false;
      }
    },
    getImageUrl(imageBase64) {
      return `data:image/jpeg;base64,${imageBase64}`;
    },
    flipCard(id) {
      this.flippedCardId = id;
    },
    resetFlip() {
      this.flippedCardId = null;
    },
    openModal() {
      this.showModal = true;
      document.body.classList.add('modal-open');
    },
    closeModal() {
      this.showModal = false;
      document.body.classList.remove('modal-open');
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
      const wordCount = this.newTestimonial.donationJourney.trim().split(/\s+/).filter(Boolean).length;
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

      const user = getAuth().currentUser;
      const idToken = await user.getIdToken();

      try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/upload-testimonial`, formData, {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });

        if (response.status !== 200) {
          throw new Error('Failed to upload testimonial');
        }

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
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
        this.newTestimonial.image = file;
      }
    },
    initializeAuthState() {
      const auth = getAuth();
      return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          this.isUserLoggedIn = !!user;
          unsubscribe();
          resolve();
        });
      });
    }
  },
  async created() {
    await this.initializeAuthState();
    this.fetchTestimonials();
  },
  mounted() {
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
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
.spinner-border {
  width: 3rem;
  height: 3rem;
}
/* Form Title */
.form-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 1rem;
  letter-spacing: 1px;
  animation: fadeIn 0.5s ease-in-out;
}

/* Form Background */
.form-content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  width: 400px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 80vh;
  overflow-y: auto;
  margin-top: 40px;
}

/* Input Fields */
input[type="text"],
textarea {
  padding: 12px;
  border: 2px solid #ffbd59;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  width: 100%;
  box-sizing: border-box;
  /* background-color: #cdcccb; */
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
textarea:focus {
  border-color: #ff8a00;
}

.dotted-area {
  border: 2px dashed #999;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  width: 100%;
  height: 150px;
  /* Adjust height as needed */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
 
}

.placeholder-text {
  color: #bbb;
  font-size: 1rem;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.file-upload {
  margin-top: 10px;
  /* Space between the button and dotted area */
  align-items: center;
  justify-content: flex-start;
  /* Aligns the button to the left */
  margin-top: 10px;
  /* Space between the button and dotted area */
}

.upload-button {
  background-color: #ff8a00;
  color: #ffffff;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #ff6a00;
}

input[type="file"] {
  display: none;
  /* Hide the default file input */
}

/* Submit Button */
.submit-button {
  background-color: #1e90ff;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.submit-button:hover {
  background-color: #ff6a00;
}

/* Success Animation */
.submit-button.success {
  background-color: #28a745;
  /* Green color for success */
  color: white;
  transform: scale(1.1);
}

/* Word Count */
.word-count {
  font-size: 0.9rem;
  color: #ff8a00;
  margin-top: 5px;
}

.word-limit-reached {
  border-color: #ff4b5c;
}

/* Close Button */
.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 2rem;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  z-index: 9999;
}

.close-button:hover {
  color: #ff4b5c;
}



.scroll-container {
  width: 100%;
  max-height: 60vh;
  /* Adjust height as needed */
  overflow-y: auto;
  /* Make inner content scrollable */
  padding-right: 10px;
  /* Add padding to prevent overlap with scrollbar */
  margin-top: 1rem;
  /* Add some space below title */
}

.quote-icon-start {
  width: 40px;
  /* Adjust size as needed */
  height: auto;
  margin-right: 10px;
  /* Align left with margin to the right */
  align-self: flex-start;
  /* Align to the left */
  filter: invert(80%) sepia(30%) saturate(90%) hue-rotate(20deg) brightness(95%) contrast(90%);
  /* Applies a beige tint */

}

.quote-icon-end {
  width: 40px;
  /* Adjust size as needed */
  height: auto;
  margin-left: 10px;
  /* Align right with margin to the left */
  align-self: flex-end;
  /* Align to the right */
  transform: scaleX(-1);
  /* Flips the quote image horizontally */
  filter: invert(80%) sepia(30%) saturate(90%) hue-rotate(20deg) brightness(95%) contrast(90%);
  /* Applies a beige tint */
}

* {
  font-family: 'Montserrat', sans-serif;
}

.testimonial-container {
  padding: 60px 20px 20px; /* Adjust padding-top to push content below the navbar */
  background: linear-gradient(103deg, rgba(252, 238, 213, 0.6) 6.43%, rgba(252, 238, 213, 0.6) 78.33%, rgba(255, 231, 186, 0.6) 104.24%);
  position: relative;
  z-index: 1; /* Ensures the container is below the navbar */
}

.title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}

.subtitle {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.testimonial-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.text-container {
  margin: 0 auto;
  /* Allows the text to take available space */
  text-align: center;
  /* Restricts the width to prevent stretching */
}

.button-container {
  position: absolute;
  right: 0;
  margin-top: 5px;
  /* Space between button and subtitle */
  margin-bottom: 5px;
}

.testimonial-card {
  width: 95%;
  /* Make the card width smaller */
  border: none;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
  /* Smooth transition for scaling and flipping */
  cursor: pointer;
  height: 400px;
  /* Set consistent card height */
  background-image: url('@/assets/animals.jpg');
  /* Adjust the path as needed */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.testimonial-card:hover {
  transform: scale(1.05) rotateY(180deg);
  /* Scale up and flip the card at the same time */
}

.testimonial-card.is-flipped {
  transform: rotateY(180deg) scale(1.05);
  /* Keep scaling even after flip */
  z-index: 9999;
}

.row {
  display: flex;
  justify-content: center;
  /* Centers the items horizontally */
  flex-wrap: wrap;
  /* Ensures the items wrap when needed */
  gap: 20px;
  /* Add spacing between items */
  margin-top: 5px;
}

.col {
  flex: 0 0 calc(33.33% - 20px);
  /* Ensure 3 items per row on medium and larger screens */
  max-width: calc(33.33% - 20px);
  /* Adjust the max width for 3 items */
}

@media (max-width: 768px) {
  .testimonial-card {
    width: 80%;
    /* Makes the card fill the entire width */
    max-width: 100%;
    /* Ensures it doesn't stretch too much */
    margin: 0 auto;
  }

  .add-testimonial {
    font-size: 1rem;
    padding: 0.5rem 1.5rem;
    margin-top: 10px;
  }

  .button-container {
    margin-top: 10px;
    width: 100%;
    text-align: center;
  }

  .testimonial-header {
    flex-direction: column;
    align-items: center;
  }

  .text-container {
    max-width: 100%;
    /* Full width on smaller screens */
    text-align: center;
    /* Center text for smaller screens */
  }

  .button-container {
    position: static;
    /* Stacks the elements */
    text-align: center;
    /* Center-aligns the button */
    margin-top: 5px;
  }

  .title {
    font-size: 1.8rem;
    /* Adjust title size for smaller screens */
  }

  .subtitle {
    font-size: 1rem;
    /* Adjust subtitle size */
    margin-bottom: 20px;
  }

  .row {
    flex-direction: column;
    /* Makes it stack vertically on small screens */
    align-items: center;
    /* Centers the items horizontally */
  }

  .col {
    flex: 0 0 100%;
    /* Full width on smaller screens (mobile) */
    max-width: 100%;
    /* Ensure full width on small screens */
  }

  .testimonial-card:hover {
    transform: scale(1.1) rotateY(180deg);
    /* Smaller scaling to prevent overflow */
  }
}


.card-front {
  padding: 2rem;
  color: #fff;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  font-family: 'Montserrat', sans-serif;
}

.card-back {
  transform: rotateY(180deg);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 20px;
  background: rgba(248, 249, 250, 0.9);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 3px solid rgb(255, 255, 255);
  z-index: 1; /* Adjust z-index for the expanded card */
  margin-top: 20px; /* Optional: Add margin to avoid directly touching the navbar */
}

.quote-icon-start,
.quote-icon-end {
  width: 30px;
  /* Smaller icon size */
  height: auto;
  margin: 0;
  /* Remove additional margin */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Dark overlay for better text readability */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  padding: 10px;
  /* Reduced padding */
  gap: 4px;
  /* Minimal gap between elements */
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
  top: -40px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  z-index: 2;
  text-align: center;
  /* Ensure text inside is also centered */
}


.profile-photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.icon-overlay {
  position: absolute;
  /* Position relative to the card */
  top: 62px;
  /* Position slightly above the profile photo */
  left: 50%;
  /* Center it horizontally */
  transform: translateX(-50%);
  /* Adjust to center */
  display: flex;
  /* Use flexbox for alignment */
  gap: 10px;
  /* Space between the emojis */
  z-index: 3;
  /* Ensure it's above the card background */
}

.emoji {
  font-size: 1.5em;
  /* Adjust the size as needed */
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

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

/* Pulse Animation */
@keyframes pulse {

  0%,
  100% {
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
  top: -50px;
  /* Adjust position relative to profile image */
  background: linear-gradient(135deg, #9d8d70, #e4cba9);
  /* Earth-tone gradient with brown and beige */
  border-radius: 30px;
  padding: 8px 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* Subtle shadow for depth */
  width: 150px;
  /* Fixed width for consistency */
  margin: 0 auto;
  /* Centers the banner */
  z-index: 3;
  /* Ensures it’s above other elements */
  display: flex;
  /* Flexbox for easy centering */
  justify-content: center;
  /* Centers text within the fixed width */
}

.author {
  font-size: 20px;
  /* Slightly larger for emphasis */
  font-weight: 800;
  /* Stronger weight for bold effect */
  color: #5E3A1A;
  /* Deep, earthy brown tone */
  text-align: center;
  text-transform: uppercase;
  /* Adds a distinct style */
  letter-spacing: 1px;
  /* Adds slight spacing for readability */
  font-family: 'Montserrat', sans-serif;
  /* Consistent with preferred font */
  padding: 5px 10px;
  /* Adds subtle padding */
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
  font-size: 0.80rem;
  color: #fff;
  padding: 20px;
  text-align: center;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
  /* Adds shadow for better visibility */
  position: relative;

}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  margin: 20px 0; /* Space it from the animal runner */
  background-color: rgba(255, 255, 255, 0.9); /* Solid background for visibility */
  border-radius: 10px;
  z-index: 100;
}

.pagination-button {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.2s;
}

.pagination-button:disabled {
  background-color: #f0f0f0;
  color: #ccc;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #2c3e50;
  color: #fff;
  transform: scale(1.05);
}

.pagination-text {
  font-size: 1.2rem;
  color: #2c3e50;
}


.btn-outline-primary {
  color: #2c3e50;
  border-color: #2c3e50;
}

.btn-outline-primary:hover {
  background-color: #2c3e50;
  color: #fff;
}


/* add testimonial */

.add-testimonial {
  background: linear-gradient(90deg, #191e3b, #e0e3f6);
  /* Gradient in lighter blues */
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
}

.add-testimonial:hover {
  transform: translateY(-3px);
}

/* Media Query for iPhone 14 Pro Max (portrait) */
@media only screen and (max-width: 430px) {
  .add-testimonial {
    margin-top: 20px;  /* Position the button below subtitle */
    margin-bottom: 20px; /* Add space below the button */
    position: relative;
  }

  .subtitle {
    margin-bottom: 5px; /* Ensure some space below the subtitle */
  }

  /* Hide button inside modal */
  .form-content .add-testimonial {
    display: none;
  }
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
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 72px;
}

.login-message {
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-icon {
  font-size: 1.5rem;
  /* Larger icon size */
  color: #ff4b5c;
  /* Red color for the lock */
}

.login-link {
  color: #007BFF;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #0056b3;
  /* Darker blue when hovered */
}

/* form */

.form-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  letter-spacing: 1px;
  animation: fadeIn 0.5s ease-in-out;
}

.form-content {
  position: relative;
  /* Ensure the close button is positioned correctly */
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
  max-height: 80vh;
  overflow-y: auto;
  margin-top: 40px;
}

.form-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(220, 220, 220, 0.7);
  /* Slightly darkened backdrop */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  /* Ensure the backdrop is above other content */
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
  border-color: #2c3e50;
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
  border-color: red;
  /* Change border color when word limit is reached */
}

.file-upload {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upload-button {
  background-color: #2c3e50;
  /* Soft blue */
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
  background-color: #2c3e50;
  /* Blue */
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
  position: relative;
  /* Ensure it has a positioning context */
  min-width: 120px;
  /* Ensure button is wide enough */
  height: 50px;
  /* Adjust button height for spinner visibility */
}

.submit-button.success {
  background-color: #4CAF50;
  /* Green color for success */
  color: white;
  transform: scale(1.1);
}

.submit-button.loading {
  background-color: #676672;
  color: transparent;
  min-width: 120px;
  /* Ensure button is wide enough */
  height: 50px;
  /* Adjust button height */
}

.loading-icon {
  position: absolute;
  /* Ensure it's positioned within the button */
  font-size: 1.5rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Center the icon */
  display: none;
  /* Hide the spinner by default */
}

.submit-button.loading .loading-icon {
  display: inline-block;
  /* Show the spinner in loading state */
  animation: spin 1s linear infinite;
  /* Apply spinning animation */
}

/* Spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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

@keyframes circleDraw {
  0% {
    stroke-dasharray: 0, 150;
  }

  100% {
    stroke-dasharray: 150, 150;
  }
}

@keyframes checkDraw {
  0% {
    stroke-dasharray: 0, 36;
  }

  100% {
    stroke-dasharray: 36, 36;
  }
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 2rem;
  /* Increase size for better visibility */
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-weight: bold;
  z-index: 9999;
  /* Ensure it's above other content */
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #ff4b5c;
  /* Red color for hover effect */
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
  bottom: 50px;
  /* Adjust for vertical positioning */
  right: 30px;
  /* Align to the right side of the screen */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Center-aligns the button below the message */
  gap: 0.5rem;
  z-index: 10000;
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
  background-color: #5a73a1;
  /* Soft blue background */
  color: #e0efff;
  /* Light text color */
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-style: italic;
  font-size: 1rem;
  line-height: 1.5;
  max-width: 250px;
  margin-bottom: 0.5rem;
  opacity: 1;
  /* Fully visible by default */
  animation: fadeIn 1s forwards;
  /* Fade in animation */
}

.fade-out {
  animation: fadeOut 1s forwards;
  /* Fade out animation */
}

/* Donate Now Button Styling */
.animated-donate-button {
  position: relative;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3e67a8, #77a0f7);
  /* Gradient for button */
  color: #ffffff;
  /* White text color */
  font-size: 1.2rem;
  font-weight: 600;
  border: 2px solid #bcbcbb;
  /* Yellow border for contrast */
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  overflow: hidden; /* Ensure stars don't overflow */
}

/* Hover Effects for Button */
.animated-donate-button:hover {
  background: linear-gradient(135deg, #5679c7, #6a8ed9);
  /* Lighten gradient on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
  /* Slight lift on hover */
}

/* Heart Icon Styling */
.heart-icon {
  color: #ff4b5c;
  /* Red heart icon */
  font-size: 1.2rem;
  transition: transform 0.2s ease-in-out;
}
.fas {
  font-family: "Font Awesome 5 Free";
}

.animated-donate-button:hover .heart-icon {
  transform: scale(1.1);
  /* Slight scaling of the heart on hover */
}

/* Fade-in Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* The container that holds the animal runner */
.animal-runner {
  width: 100%;
  height: 60px; /* Adjust based on the height of the images */
  overflow: hidden;
  position: relative;
  margin-top: 20px;
}

/* The strip where the animal images will be placed */
.animal-strip {
  display: flex;
  animation: scrollRight 25s linear infinite; /* Speed up the animation */
  position: absolute;
  left: 0;
}

/* Keyframes to scroll the images continuously from left to right */
@keyframes scrollRight {
  0% {
    transform: translateX(-50%); /* Start off-screen to the left */
  }
  100% {
    transform: translateX(0); /* Move to the right */
  }
}

.animal-image {
  width: 80px; /* Set a fixed width */
  height: 60px; /* Set a fixed height based on the GIF’s aspect ratio */
  object-fit: contain; /* Ensure the full image is visible within the container */
  margin-right: 5px; /* Adjust spacing as needed */
}


</style>