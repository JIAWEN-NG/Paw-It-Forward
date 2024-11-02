<template>
  <div class="success-page">
    <div class="card">
      <h1 class="title">Thank You for Your Generosity!</h1>
      <p class="message">
        Your contribution will make a significant difference. We are deeply grateful for your kindness!
      </p>
      <div v-if="donationDetails" class="donation-amount">
        <span class="label">Amount Donated:</span>
        <span class="amount">SGD {{ donationDetails.amount }}</span>
      </div>
      <div class="button-container">
        <button @click="returnHome" class="return-home-btn">Return to Home</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      donationDetails: null,
    };
  },
  methods: {
    async fetchDonationDetails() {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (sessionId) {
        try {
          const response = await fetch(`http://localhost:8000/get-checkout-session/${sessionId}`);
          const data = await response.json();
          this.donationDetails = data;
        } catch (error) {
          console.error('Error fetching donation details:', error);
        }
      }
    },
    returnHome() {
      this.$router.push('/');
    },
  },
  mounted() {
    this.fetchDonationDetails();
  },
};
</script>

<style scoped>
.success-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.card {
  max-width: 420px;
  padding: 40px 30px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  animation: fadeIn 0.6s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  font-size: 2.2em;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 15px;
  letter-spacing: -0.5px;
}

.message {
  color: #647d8e;
  font-size: 1.15em;
  margin-bottom: 30px;
  line-height: 1.75;
  padding: 0 10px;
}

.donation-amount {
  display: inline-block;
  background: linear-gradient(90deg, #ff6b6b, #ff8e53);
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 1.4em;
  font-weight: 600;
  margin: 20px 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.label {
  display: block;
  font-size: 0.8em;
  font-weight: 500;
  color: #ffe4e1;
  margin-bottom: 2px;
}

.amount {
  font-weight: bold;
  color: #ffffff;
}

.button-container {
  margin-top: 30px;
}

/* Updated Return to Home Button Style */
.return-home-btn {
  margin-top: 20px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #1f2e3d 0%, #3a506b 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.return-home-btn:hover {
  background: linear-gradient(135deg, #2c3e50 0%, #506c8a 100%);
  transform: translateY(-2px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.return-home-btn:active {
  transform: translateY(1px);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background: #2c3e50;
}
</style>
