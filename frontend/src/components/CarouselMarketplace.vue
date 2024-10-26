<template>
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
      <div class="carousel-inner">
        <div class="carousel-item" v-for="(item, index) in carouselItems" :key="item.id" :class="{ active: index === 0 }">
          <img :src="item.image" class="d-block w-100" :alt="item.alt" />
          <div class="carousel-caption d-none d-md-block">
            <!-- <h5>{{ item.label }}</h5>
            <p>{{ item.description }}</p> -->
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </template>
  
  <script>
  import image1 from '@/assets/carousel.png';
  import image2 from '@/assets/carousel.png';
  import image3 from '@/assets/carousel.png';
  
  export default {
    name: "AutoRotatingCarousel",
    data() {
      return {
        carouselItems: [
          {
            id: 1,
            image: image1, // Use imported image
            alt: "First Slide",
            label: "First Slide Label",
            description: "Some representative placeholder content for the first slide.",
          },
          {
            id: 2,
            image: image2, // Use imported image
            alt: "Second Slide",
            label: "Second Slide Label",
            description: "Some representative placeholder content for the second slide.",
          },
          {
            id: 3,
            image: image3, // Use imported image
            alt: "Third Slide",
            label: "Third Slide Label",
            description: "Some representative placeholder content for the third slide.",
          },
        ],
      };
    },
  };
  </script>
  
  <style>
  .carousel-item img {
    width: 100%;
    height: 300px; /* Adjust height as needed */
    object-fit: cover;
    border-radius: 20px;
  }
  </style>
  