<template>
    <div class="landing-page">
        <!-- first Section -->
        <section class="hero-section full-screen">
            <div class="container hero-content">
                <div class="text-content">
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
                <div class="image-content">
                    <img :src="petOwnerImageUrl" alt="paw" v-if="petOwnerImageUrl" />
                </div>
            </div>
            <div class="scroll-button" @click.prevent="scrollToSection('aboutSection')">▼</div>
        </section>

        <!-- Who We Are Section -->
        <section class="about-section full-screen" id="aboutSection">
            <div class="container about-content">
                <div class="image-content" style="padding-right: 30px;">
                    <img :src="supportImageUrl" alt="support" v-if="supportImageUrl" />
                </div>
                <div class="text-content">
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
            <div class="scroll-button" @click.prevent="scrollToSection('howItWorksSection')">▼</div>

        </section>

        <!-- How it works Section -->
        <section class="last-section full-screen" id="howItWorksSection">
            <h1 style="display: block; text-align: center; font-weight: bold; font-size: 36px; padding: 10px;">How Paw-It-Forward Works</h1>
            <div class="container last-content">
                <div class="container stepper-container">
                    <h2 style="font-size: 24px;">Pet Owners Seeking Support</h2><br/>

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
               
                <div class="image-content" style="padding: 30px; ">
                    <img :src="heartImageUrl" alt="heart" v-if="heartImageUrl" />
                </div>

                                        
                <div class="container stepper-container">
                    <h2 style="font-size: 24px;">Donors Offering Assistance</h2><br/>

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
export default {
  name: "aboutPage",
  data() {
    return {
      petOwnerImageUrl: null,
      supportImageUrl: null,
      heartImageUrl: null,
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
  },
  async mounted() {
    // Fetch each image by its filename
    this.petOwnerImageUrl = await this.fetchImage('about/petowner.png');
    this.supportImageUrl = await this.fetchImage('about/support.png');
    this.heartImageUrl = await this.fetchImage('about/heart.png');
  },
};
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
*{
    /* margin: 0;
    padding: 0; */
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}

/* General Page Styling */


/* Hero Section */
.hero-section {
    background: linear-gradient(103deg, rgba(252, 238, 213, 0.6) 6.43%, rgba(252, 238, 213, 0.6) 78.33%, rgba(255, 231, 186, 0.6) 104.24%);
    display: flex;
    align-items: center;
    display: block;
}
.last-section {
    background: linear-gradient(103deg, rgba(252, 238, 213, 0.6) 6.43%, rgba(252, 238, 213, 0.6) 78.33%, rgba(255, 231, 186, 0.6) 104.24%);
    padding: 70px 0;

}

.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.hero-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text-content{
    width: 60%;
}

.text-content h1 {
    font-size: 36px;
    font-weight: bold;
    max-width: 100%;
}

.text-content h2 {
    font-size: 24px;
    margin: 10px 0;
    max-width: 100%;

}

.text-content p {
    font-size: 16px;
    margin: 15px 0;
    max-width: 100%;
}

.cta-button {
    background-color: #0044cc;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-decoration: none;
}

.cta-button:hover {
    background-color: #0033a3;
}

.image-content img {
    width: 100%;
    height: auto;
    max-width: 400px;
    border-radius: 20px;
}

/* About Section */
.about-section {
    background-color: #f8f9fa;
    /* padding: 100px 0;    */
}

.about-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 80px 0px;

}



.about-content .image-content img {
    max-width: 400px;
    border-radius: 20px;
}

@media (max-width: 768px) {
    .container {
        flex-direction: column;
    }

    .about-content,
    .hero-content {
        flex-direction: column-reverse;
        text-align: center;
    }

    .text-content,
    .image-content {
        max-width: 100%;
    }

    .text-content h1 {
        font-size: 28px;
    }

    .text-content h2 {
        font-size: 20px;
    }
}

/* Steps */

.container.stepper-container {
    display: flex;
    flex-direction: column; /* Stack steps vertically */
    align-items: flex-start; /* Align steps to the start */
    padding: 20px;
    width: 40%;
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

/* Stepper Titles */
.title {
  line-height: 1.5em;
  font-weight: bold;
}
.caption {
  font-size: 0.8em;
}

.full-screen {
    min-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px;
    /* padding-bottom: 80px; */
    /* Extra bottom padding  */
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
</style>