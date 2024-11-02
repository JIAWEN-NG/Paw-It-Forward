<template>
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
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
  import image1 from '@/assets/carousel4.png';
  import image2 from '@/assets/carousel2.png';
  import image3 from '@/assets/carousel3.png';
  
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
  .carousel {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25); /* Soft shadow for subtle depth */
  }
  
  .carousel-item img {
    width: 100%;
    height: 300px; /* Adjust height as needed */
    object-fit: cover;
    border-radius: 20px;
    transition: opacity 0.3s ease; /* Subtle fade transition */
  }
  
  .carousel-control-prev,
  .carousel-control-next {
    opacity: 0.8; /* Slight transparency */
    transition: opacity 0.3s ease; /* Smooth transition for hover */
  }
  
  .carousel-control-prev:hover,
  .carousel-control-next:hover {
    opacity: 1; /* Full opacity on hover */
  }
  </style>
  