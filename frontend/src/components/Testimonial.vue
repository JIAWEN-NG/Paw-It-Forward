<template>
    <div class="wrapper">
      <!-- Button to add story, now positioned in the top right corner -->
      <button class="add-testimonial wave-button" @click="openModal">
        Add Your Story
      </button>
  
      <h2>Stories of Hope</h2>
      <p class="subtext">Share your story of how donations brought hope and healing to your pet in need.</p>
  
      <!-- Animal animation section -->
      <div class="animal-runner">
    <div class="animal-strip">
        <img
          v-for="i in 70"
          :key="i"
          :src="i % 2 === 0 ? pixcat : pixdog"
          :alt="i % 2 === 0 ? 'Running Cat' : 'Running Dog'"
          :class="i % 2 === 0 ? 'running-cat' : 'running-dog'"
        />
        <img
          v-for="i in 70"
          :key="`duplicate-${i}`"
          :src="i % 2 === 0 ? pixcat : pixdog"
          :alt="i % 2 === 0 ? 'Running Cat' : 'Running Dog'"
          :class="i % 2 === 0 ? 'running-cat' : 'running-dog'"
        />
      </div>
      </div>
  
      <!-- Testimonials section with 3D flip effect on hover -->
  <div class="cols">
    <div
      class="col"
      v-for="(testimonial, index) in testimonials"
      :key="index"
    >
      <div class="card-inner" @mouseenter="hoveredIndex = index" @mouseleave="hoveredIndex = null">
        <!-- Front side of the testimonial card -->
        <div class="card-front">
          <div class="profile-photo" :style="{ backgroundImage: `url(${testimonial.image})` }">
            <!-- Dynamic emoji overlay inside profile photo -->
            <div class="icon-overlay">
              <span class="emoji toy-emoji">🦴</span>
              <span class="emoji paw-emoji">🐾</span>
            </div>
          </div>
          <p class="pet-name">{{ testimonial.animalName }}</p>
          <span class="pet-problem">{{ testimonial.background }}</span>
        </div>
        
        <!-- Back side with description -->
        <div class="card-back">
          <p class="description">{{ testimonial.donationJourney }}</p>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Expanded view modal for clicked testimonial (placed outside of the loop) -->
  <div v-if="expandedIndex !== null" class="expanded-view" @click.self="expandedIndex = null">
    <div class="expanded-content">
      <!-- Background image as a semi-transparent overlay -->
      <div class="expanded-background" :style="{ backgroundImage: `url(${testimonials[expandedIndex]?.image || ''})` }"></div>
  
      <!-- Foreground content -->
      <span class="close-btn" @click="expandedIndex = null">&times;</span>
      <div class="profile-photo-large" :style="{ backgroundImage: `url(${testimonials[expandedIndex].image})` }">
        <!-- Paw icon overlay inside expanded profile photo -->
        <div class="icon-overlay">
          <i class="fas fa-paw paw-icon"></i>
          <i class="fas fa-paw paw-icon"></i>
        </div>
      </div>
      <h3 class="animal-name">{{ testimonials[expandedIndex].animalName }}</h3>
      <p class="background">{{ testimonials[expandedIndex].background }}</p>
      <p class="donationJourney">{{ testimonials[expandedIndex].donationJourney }}</p>
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
      <div class="donate-popup-container" @click="redirectToDonation">
        <div class="heartfelt-message-container">
          <p class="heartfelt-message">
            "Your kindness can be the difference between a wagging tail and a life of struggle. Help us give these pets a second chance at happiness."
          </p>
        </div>
        <button class="donate-popup animated-donate-button">
            Donate Now <i class="fas fa-heart heart-icon"></i>
              <div class="star-1">
          <svg viewBox="0 0 784.11 815.53">
            <path
              d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              class="fil0"
            ></path>
          </svg>
        </div>
        <div class="star-2">
          <svg viewBox="0 0 784.11 815.53">
            <path
              d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
              class="fil0"
            ></path>
          </svg>
        </div>
        <div class="star-3">
      <svg viewBox="0 0 784.11 815.53">
        <path
          d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
          class="fil0"
        ></path>
      </svg>
    </div>
    <div class="star-4">
      <svg viewBox="0 0 784.11 815.53">
        <path
          d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
          class="fil0"
        ></path>
      </svg>
    </div>
    <div class="star-5">
      <svg viewBox="0 0 784.11 815.53">
        <path
          d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
          class="fil0"
        ></path>
      </svg>
    </div>
        </button>
      </div>
    </div>
  </template>
  
  
  <script>
  import pixcat from '@/assets/pixcat.png';
  import pixdog from '@/assets/pixdog.png';
  import '../styles/testimonial.css';
  export default {
    data() {
      return {
        hoveredIndex: null,
        expandedIndex: null,
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
        testimonials: [] // Initialize with an empty array
      };
    },
    methods: {
      async fetchTestimonials() {
        console.log("Fetching testimonials...");
        try {
          const response = await fetch('http://localhost:3000/testimonials'); // Use your backend URL
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
          const response = await fetch('http://localhost:3000/upload-testimonial', {
            method: 'POST',
            body: formData
          });
          if (!response.ok) throw new Error(`Failed to upload testimonial: ${response.statusText}`);
  
          console.log("Upload successful!");
  
          // Show "Submitted" message briefly, then close the modal and refresh testimonials
          this.uploadSuccess = true;
          setTimeout(() => {
            this.uploadSuccess = false;
            this.closeModal();
            this.fetchTestimonials(); // Refresh testimonials after submission
          }, 2000); // Show "Submitted" for 2 seconds
  
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
      }
    },
    mounted() {
      console.log("Component mounted, fetching testimonials...");
      this.fetchTestimonials();
    }
  };
  </script>

<style scoped>
  @import '../styles/testimonial.css';
</style>