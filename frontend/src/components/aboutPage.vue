<template>
    <div class="landing-page">
        <!-- first Section -->
        <section class="hero-section">
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
                    <img :src="require('../assets/petowner.png')" alt="paw" />
                </div>
            </div>
        </section>

        <!-- Who We Are Section -->
        <section class="about-section">
            <div class="container about-content">
                <div class="image-content">
                    <img :src="require('../assets/support.png')" alt="" />
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
        </section>

                <!-- How it works Section -->
        <section class="last-section">
            <h1 style="display: block; text-align: center; font-weight: bold; font-size: 36px; padding: 10px;">How Paw-It-Forward Works</h1>
            <div class="container about-content">
                <div class="text-content" style="width: 40%;">
                    <h2>Pet Owners Seeking Support</h2>
                
                        <ol>
                            <li>
                                Create an Account: Sign up to become part of our community.
                            </li>
                            <li>
                                Share Your Story: Explain your situation—whether you need help with medical bills, food, or other essential pet supplies. Let the community know how they can support you.
                            </li>
                            <li>
                                Request Assistance: Post your needs directly, making it easy for donors to understand how they can help.
                            </li>
                        </ol>
                    
                </div>

                <div class="image-content" style="padding: 40px;">
                    <img :src="require('../assets/heart.png')" alt="" />
                </div>

                <div class="text-content" style="width: 40%;">
                    <h2>Donors Offering Assistance</h2>
                        <ol>
                            <li>
                                Create an Account: Sign up to become part of our community.
                            </li>
                            <li>
                                Browse and Support: Explore posts from pet owners in need. Choose the stories or causes that resonate with you, and offer your support.
                            </li>
                            <li>
                                Donate Unused Items: Have extra pet supplies? List them on our platform for others to claim, helping struggling pet owners access essentials without the added expense.
                            </li>
                        </ol>
                </div>
            </div>
        </section>
    </div>
</template>


<script>

export default {
    name: "aboutPage",
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
.landing-page {
    /* font-family: 'Arial', sans-serif; */
    margin-top: 80px;
}

/* Hero Section */
.hero-section {
    background: linear-gradient(103deg, rgba(252, 238, 213, 0.6) 6.43%, rgba(252, 238, 213, 0.6) 78.33%, rgba(255, 231, 186, 0.6) 104.24%);
    padding: 50px 0;
    display: flex;
    align-items: center;
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
    padding: 100px 0;
}

.about-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
</style>