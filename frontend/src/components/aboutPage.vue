<template>
    <div class="landing-page">
        <!-- first Section -->
        <section class="hero-section full-screen align-items-center">
            <div class="container">
                <div class="col-md-6 text-content">
                    <h1>Paw-It-Forward</h1>
                    <h2>Helping One Paw At A Time</h2>
                    <p>
                        We believe that every pet deserves love, care, and a chance to thrive.
                        Our mission is to create a compassionate community where pet owners
                        facing financial difficulties can easily access the resources they need.
                        Whether you're looking for support in times of crisis or wishing to lend
                        a helping hand, our platform connects donors directly with those in need.
                    </p>
                    <button class="cta-button">
                        <router-link to="/fundraising" style="color:white; text-decoration: none;">Donate Now</router-link>
                    </button>
                </div>
                <div class="col-md-5 image-content d-block">
                    <img :src="petOwnerImageUrl" alt="paw" class="img-fluid d-md-block" />
                </div>
            </div>
            <div class="scroll-button" @click.prevent="scrollToSection('aboutSection')">▼
            </div>
        </section>

        <!-- Who We Are Section -->
        <section class="about-section full-screen-middle" id="aboutSection">
            <div class="container-fluid about-content row align-items-center">
                <div class="col-md-6 image-content mb-4 mb-md-0 d-md-block" style="padding-right: 30px;">
                    <img :src="supportImageUrl" alt="support" v-if="supportImageUrl" />
                </div>
                <div class="col-md-6 text-content">
                    <h1>Who We're Here For</h1>
                    <h2>Never Alone</h2>
                    <p>
                        If you're struggling to provide for your pet's daily needs, dealing with
                        overwhelming medical bills, or simply need a bit of extra support, this
                        platform is here for you. We understand how stressful it can be when life's
                        circumstances make it hard to care for your beloved companion, and our
                        goal is to ensure no one feels alone in that struggle.
                    </p>
                    <button class="cta-button">
                        <router-link to="/fundraising" style="color:white; text-decoration: none;">Post Now</router-link>
                    </button>                
                </div>
            </div>
            <div class="scroll-button py-2" @click.prevent="scrollToSection('howItWorksSection')">▼</div>

        </section>

        <!-- How it works Section -->
        <section class="last-section full-screen-last" id="howItWorksSection">
            <div class="text-center text-content">
                <h1>How Paw-It-Forward Works</h1>
            </div>
            <div class="container">
                <div class=" stepper-container text-content col-md-4 d-md-block">
                    <h2>Pet Owners Seeking Support</h2>
                    <div class="step">
                    <div>
                        <div class="circle">1</div>
                    </div>
                    <div>
                        <div class="title">Create an Account</div>
                        <div class="caption">Sign up to become part of our community.</div>
                    </div>
                    </div>

                    <div class="step">
                    <div>
                        <div class="circle">2</div>
                    </div>
                    <div>
                        <div class="title">Share Your Story</div>
                        <div class="caption">Explain your situation—whether you need help with medical bills, food, or other essential pet supplies.</div>
                    </div>
                    </div>
                    <div class="step">
                    <div>
                        <div class="circle">3</div>
                    </div>
                    <div>
                        <div class="title">Request Assistance</div>
                        <div class="caption">Post your needs directly, making it easy for donors to understand how they can help.</div>
                    </div>
                    </div>
                </div>
               
                <div class="image-content col-md-4 d-md-block" style="padding: 30px; ">
                    <img :src="heartImageUrl" alt="heart" v-if="heartImageUrl" />
                </div>

                                        
                <div class="stepper-container text-content col-md-4 d-md-block">
                    <h2 style="padding-bottom: 15px;">Donors Offering Assistance</h2>

                    <div class="step">
                    <div>
                        <div class="circle">1</div>
                    </div>
                    <div>
                        <div class="title">Create an Account</div>
                        <div class="caption">Sign up to become part of our community.</div>
                    </div>
                    </div>
                    <div class="step">
                    <div>
                        <div class="circle">2</div>
                    </div>
                    <div>
                        <div class="title">Browse and Support</div>
                        <div class="caption">Explore posts from pet owners in need. Choose the stories that resonate with you.</div>
                    </div>
                    </div>
                    <div class="step">
                    <div>
                        <div class="circle">3</div>
                    </div>
                    <div>
                        <div class="title">Donate Unused Items</div>
                        <div class="caption">Have extra pet supplies? List them to help struggling pet owners access essentials without the added expense.</div>
                    </div>
                    </div>
                </div>
                
            </div>
        </section>
    </div>
</template>


<script>
import catarrowImage from '@/assets/catarrow.png';

export default {
  name: "aboutPage",
  data() {
    return {
        petOwnerImageUrl: null,
        supportImageUrl: null,
        heartImageUrl: null,
        sections: [],
        scrollTimeout: null,
        catarrowImage
    };
  },
  methods: {
    async fetchImage(fileName) {
      try {
        const response = await fetch(`http://localhost:8000/api/images?fileName=${fileName}`);
        const data = await response.json();
        return data.url;
      } catch (error) {
        console.error(`Failed to fetch image ${fileName}:`, error);
        return null;
      }
    },
    async scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      section.scrollIntoView({ behavior: "smooth" });
    },
    detectScroll() {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
    // Check if the user has scrolled past a certain threshold
    if (window.scrollY > 10) {
      this.scrollTimeout = setTimeout(() => {
        this.snapToNearestSection();
      }, 150); // Adjust timeout as needed
    }
    },
  snapToNearestSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    let closestSection = null;
    let minDistance = Infinity;

    // Exclude the last section to avoid snapping to it
    this.sections.slice(0, -1).forEach((section) => {
      const sectionTop = section.offsetTop;
      const distance = Math.abs(scrollPosition - sectionTop);
      if (distance < minDistance) {
        minDistance = distance;
        closestSection = section;
      }
    });

    // Check if the scroll position is close to the bottom of the document
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    if (!nearBottom && closestSection) {
      closestSection.scrollIntoView({ behavior: "smooth" });
    }
  },
  },

  async mounted() {
    // Store references to each section
    this.sections = Array.from(document.querySelectorAll(".full-screen, .full-screen-other"));

    // Add scroll event listener
    window.addEventListener("scroll", this.detectScroll);
    // Fetch each image by its filename
    this.petOwnerImageUrl = await this.fetchImage('about/petowner.png');
    this.supportImageUrl = await this.fetchImage('about/support.png');
    this.heartImageUrl = await this.fetchImage('about/heart.png');
  },
  beforeDestroy() {
    // Remove scroll event listener when the component is destroyed
    window.removeEventListener("scroll", this.detectScroll);
  },
};
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
*{
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}

/* General Page Styling */


/* Hero Section */
.hero-section {
    background: linear-gradient(103deg, rgba(252, 238, 213, 0.6) 6.43%, rgba(252, 238, 213, 0.6) 78.33%, rgba(255, 231, 186, 0.6) 104.24%);
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 80px;
}
.last-section {
    background: linear-gradient(103deg, rgba(252, 238, 213, 0.6) 6.43%, rgba(252, 238, 213, 0.6) 78.33%, rgba(255, 231, 186, 0.6) 104.24%);
    padding: 70px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
}
/* 
.hero-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
} */


.text-content h1 {
    font-size: 28px;
    font-weight: bold;
    /* max-width: 100%; */
}

.text-content h2 {
    font-size: 24px;
    margin: 10px 0;
    /* max-width: 100%; */
}

.text-content p, .caption{
    font-size: 16px;
    margin: 15px 0;
    /* max-width: 100%; */
}

.title {
  line-height: 1.5em;
  font-weight: bold;
  font-size: 18px;
}


@media (min-width: 768px) {
    .text-content h1 {
        font-size: 30px;
    }
    .text-content h2 {
        font-size:24px;
    }
    .text-content p, .caption{
        font-size:16px;
    }
    .title{
        font-size: 18px;
        line-height: 1em;
    }
}

@media (min-width: 1400px) {
    .text-content h1 {
        font-size: 40px;
    }
    .text-content h2 {
        font-size:32px;
    }
    .text-content p, .caption {
        font-size:22px;
    }
    .title{
        font-size: 22px;
    }
}
.cta-button {
    background: linear-gradient(135deg, #1f2e3d 0%, #3a506b 100%);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);

    text-decoration: none;
}

.cta-button:hover {
    background: linear-gradient(135deg, #2c3e50 0%, #506c8a 100%);
    transform: translateY(-2px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}


.image-content img {
    width: 100%;
    display: block;
}


.about-section {
    background-color: #f8f9fa;
    display: flex;
    flex-direction: column;
    align-items: center;
}


/* Steps */

.stepper-container {
    display: flex;
    flex-direction: column; 
    align-items: flex-start;
    padding: 20px;
}

.step {
  position: relative;
  min-height:2em;
  color: black;
}
.step + .step {
  margin-top: 1.5em
}
.step > div:first-child {
  position: static;
  height: 0;
}
.step > div:not(:first-child) {
  margin-left: 1.5em;
  padding-left: 1em;
}

/* Circle */
.circle {
  background:linear-gradient(135deg, #1f2e3d 0%, #3a506b 100%);
  ;
  position: relative;
  width: 1.5em;
  height: 1.5em;
  line-height: 1.5em;
  border-radius: 100%;
  color: #fff;
  text-align: center;
  box-shadow: 0 0 0 3px #fff;
}

/* Vertical Line */
.circle:after {
  content: ' ';
  position: absolute;
  display: block;
  top: 1px;
  right: 50%;
  bottom: -10px;
  left: 50%;
  /* height: 100%; */
  width: 1px;
  transform: scale(1, 2);
  transform-origin: 50% -100%;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: -1;
}
.step:last-child .circle:after {
  display: none
}


.full-screen {
    min-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 40px;
    padding-bottom: 80px;
  }

  .full-screen-middle{
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 40px;
    padding-top: 80px;
  }

  .full-screen-last{
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
    padding-top: 80px;
  }
  

  /* Downward Scroll Button */
  .scroll-button {
    display: block;
    font-size: 24px;
    color: #333;
    text-align: center;
    padding: 10px;
    cursor: pointer;
    transition: color 0.3s ease, transform 0.3s ease;
    animation: wiggle 1s infinite ease-in-out;
  }

  .scroll-button:hover {
    color: #0044cc;
    transform: translateY(5px);
  }

.stepper-container .step:hover {
  color: #4747f3;
  padding: 10px;
  transition: transform 0.3s ease, color 0.3s ease;
  transform: scale(1.02);
}

@keyframes wiggle {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}
</style>