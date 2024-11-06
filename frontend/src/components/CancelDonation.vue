<template>
  <div class="cancel-container">
    <div class="cancel-card">
      <div class="icon">
        <!-- Font Awesome cancel icon -->
        <i class="fas fa-times-circle"></i>
      </div>
      <h1>Payment Canceled</h1>
      <p>It seems like you canceled the payment. If you need assistance or would like to try again, please reach out to us.</p>
      <button @click="goBack" class="return-home-btn">Return to Home</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push('/');
    },
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.cancel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: 'Montserrat', sans-serif;
  color: #333;
}

.cancel-card {
  background-color: white;
  padding: 3rem 2.5rem;
  border-radius: 12px;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  transform: translateY(-10px);
  animation: slideUp 0.4s ease-out forwards;
  position: relative;
}

.icon {
  font-size: 4rem;
  color: #ff6b6b;
  margin-bottom: 0.5rem;
  animation: bounceIn 0.5s ease;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.8rem;
  font-weight: 600;
}

p {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
  line-height: 1.6;
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

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounceIn {
  0% { transform: scale(0.9); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
}
</style>
