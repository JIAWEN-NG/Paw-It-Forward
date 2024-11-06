<template>
  <div class="fundraising-detail">
    <!-- Title Row -->
    <div class="row">
      <div class="col-12 text-center">
        <h3 class="title">{{ fundraising.title }}</h3>
      </div>
    </div>

    <!-- Image and Details Row -->
    <div class="row align-items-start mt-4">
      <!-- Image and Description Column (Wider) -->
      <div class="col-md-8 mb-4">
        <img
          class="img-fluid rounded fundraising-image"
          :src="fundraising.fundraisingImg"
          alt="Fundraising Campaign Image"
        />
        
        <!-- Posted Date and Description -->
        <p class="card-posted-date mt-3">
          Posted: {{ formattedDate(fundraising.createdAt) }}
        </p>
        
        <p class="description">{{ fundraising.description }}</p>
      </div>

      <!-- Details Column (Narrower) -->
      <div class="col-md-4">
        <!-- Styled Goal Text -->
        <p class="goal-text">
          <span class="amount-raised">{{ formattedCurrency(fundraising.amountRaised) }}</span>
          <span class="goal-divider"> of </span>
          <span class="target-amount">{{ formattedCurrency(fundraising.targetAmount) }}</span>
        </p>

        <div class="progress my-3">
          <div
            class="progress-bar"
            role="progressbar"
            :style="{ width: progressPercentage + '%' }"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        <!-- Donation Card -->
        <div class="donation-card">
          <div class="donation-card-header">
            <h4>Donate Today</h4>
          </div>
          <div class="donation-card-body">
            <!-- Donation Amount Input -->
           
            <input
              type="number"
              v-model="donationAmount"
              placeholder="Enter custom amount"
              class="input"
              min="1"
            />

            <!-- Preset Donation Amounts in 3x2 Grid -->
            <div class="preset-amounts">
              <button
                v-for="amount in presetAmounts"
                :key="amount"
                @click="setDonationAmount(amount)"
                :class="{ selected: donationAmount === amount }"
                class="button-28"
              >
                ${{ amount }}
              </button>
              <button @click="enableCustomAmount" :class="{ selected: isCustomAmount }" class="button-28">Other</button>
            </div>

            <!-- Styled Donate Button -->
            <button
              class="donate-button"
              @click="startCheckout"
              :disabled="!isDonationValid"
            >
              <i class="fas fa-heart"></i> Donate Now
            </button>

            <!-- Share This Post Button (styled like Donate button) -->
            <button class="share-button" @click="showShareModal = true">
              <i class="fas fa-share"></i> Share This Post
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="share-modal-overlay">
      <div class="share-modal">
        <button @click="closeShareModal" class="close-modal">&times;</button>
        <h4>Help by sharing</h4>
        <div class="share-options">
          <button class="share-icon whatsapp" @click="share('whatsapp')">
            <i class="fab fa-whatsapp"></i>
          </button>
          <button class="share-icon facebook" @click="share('facebook')">
            <i class="fab fa-facebook-f"></i>
          </button>
          <button class="share-icon telegram" @click="share('telegram')">
            <i class="fab fa-telegram-plane"></i>
          </button>
          <button class="share-icon twitter" @click="share('twitter')">
            <i class="fab fa-twitter"></i>
          </button>
          <button class="share-icon email" @click="share('email')">
            <i class="fas fa-envelope"></i>
          </button>
        </div>

        <div class="copy-link-section">
          <input type="text" :value="shareLink" readonly class="share-link-input" />
          <button @click="copyLink" class="copy-link-button">Copy Link</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { authState } from '../store/auth.js';

const stripePromise = loadStripe('pk_test_51Q7rxT084jqwzoKU1M4jawiKQFIgzZPyVMC4Hmq5BlynJ26b6G3ao7nJ1PPpR3CKsI22lWIPsXVcOgccOmeCxnUU00dud0pVzj');

export default {
  name: 'FundraisingDetail',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const currentUser = computed(() => authState.userId); // Get the logged-in user's ID

    const fundraising = ref({});
    const loading = ref(true);
    const error = ref(null);
    const donationAmount = ref(null);
    const presetAmounts = ref([5, 10, 20, 50, 100, 150]);
    const isCustomAmount = ref(false);
    const showShareModal = ref(false);
    const shareLink = ref(window.location.href);
  

    const fetchFundraisingDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/Fundraising/${props.id}`);
        fundraising.value = response.data;
      } catch (err) {
        console.error('Error fetching fundraising detail:', err);
        error.value = 'Failed to load fundraising details';
      } finally {
        loading.value = false;
      }
    };

    const setDonationAmount = (amount) => {
      donationAmount.value = amount;
      isCustomAmount.value = false;
    };

    const enableCustomAmount = () => {
      donationAmount.value = null;
      isCustomAmount.value = true;
    };

    const progressPercentage = computed(() => {
      if (fundraising.value.targetAmount > 0) {
        return (fundraising.value.amountRaised / fundraising.value.targetAmount) * 100;
      }
      return 0;
    });

    const formattedCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'SGD',
      }).format(amount);
    };

    const formattedDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    };

    const startCheckout = async () => {
      const amountInCents = donationAmount.value * 100;
      

      try {
        const response = await axios.post('http://localhost:8000/create-checkout-session', {
          postName: fundraising.value.title,
          price: amountInCents,
          userId: currentUser.value,
          postId: fundraising.value.id,
          postImage: fundraising.value.fundraisingImg,
        });

        if (response.data && response.data.id) {
          const stripe = await stripePromise;
          const { error } = await stripe.redirectToCheckout({
            sessionId: response.data.id,
          });
          if (error) {
            console.error('Stripe Checkout error:', error);
          }
        }
      } catch (error) {
        console.error('Failed to create checkout session:', error);
      }
    };

    const isDonationValid = computed(() => donationAmount.value && donationAmount.value > 0);

    const closeShareModal = () => {
      showShareModal.value = false;
    };

    const copyLink = () => {
      navigator.clipboard.writeText(shareLink.value);
    };

    const share = (platform) => {
      const encodedLink = encodeURIComponent(shareLink.value);
      let url = '';

      switch (platform) {
        case 'whatsapp':
          url = `https://wa.me/?text=${encodedLink}`;
          break;
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
          break;
        case 'telegram':
          url = `https://t.me/share/url?url=${encodedLink}`;
          break;
        case 'twitter':
          url = `https://twitter.com/intent/tweet?url=${encodedLink}`;
          break;
        case 'email':
          url = `mailto:?subject=Support this campaign&body=${encodedLink}`;
          break;
      }

      window.open(url, '_blank');
    };

    onMounted(fetchFundraisingDetail);

    return {
      fundraising,
      loading,
      error,
      progressPercentage,
      formattedCurrency,
      formattedDate,
      donationAmount,
      presetAmounts,
      isCustomAmount,
      setDonationAmount,
      enableCustomAmount,
      startCheckout,
      isDonationValid,
      showShareModal,
      shareLink,
      closeShareModal,
      copyLink,
      share,
    };
  },
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

body {
  background-color: #f5f7fa;
  font-family: 'Open Sans', sans-serif;
}

.fundraising-detail {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
}

.title {
  font-size: 2em;
  font-weight: 700;
  color: #003366;
  text-align: left;
}

.img-fluid {
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
}

.fundraising-image {
  width: 100%;
  height: 400px; /* Set a fixed height for consistent display */
  object-fit: cover; /* Crops to maintain aspect ratio */
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Styled Goal Text */
.goal-text {
  color: #666;
  text-align: left;
  font-size: 1.1em;
  margin: 5px 0;
}

.amount-raised {
  font-weight: bold;
  color: #28a745;
  font-size: 1.2em;
}

.goal-divider {
  color: #666;
  font-size: 1em;
  margin: 0 5px;
}

.target-amount {
  color: #999;
  font-size: 1em;
}

.progress {
  height: 25px;
  background-color: #e9ecef;
  border-radius: 10px;
}

.progress-bar {
  background-color: #28a745;
  border-radius: 10px;
}

.goal-text, .card-posted-date {
  color: #666;
  text-align: left;
}

.description {
  color: #666;
  text-align: justify;
  font-size: 1em;
  margin-top: 10px;
}

.donation-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.donation-card-header {
  background-color:#003366 ;
  color: white;
  padding: 10px;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
}

.donation-card-body {
  padding: 20px;
  text-align: center;
}

.input {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.button-28 {
  appearance: none;
  background-color: transparent;
  border: 2px solid #1A1A1A;
  border-radius: 15px;
  color: #3B3B3B;
  cursor: pointer;
  font-family: 'Roobert', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 10px;
  text-align: center;
  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
}

.button-28:hover {
  color: #fff;
  background-color: #1A1A1A;
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  transform: translateY(-2px);
}

.preset-amounts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.donate-button,
.share-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: white;
  background: #003366;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  margin-top: 20px;
}

.donate-button:hover,
.share-button:hover {
  background: #002244;
  transform: translateY(-2px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.share-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.share-modal {
  background: #fff;
  padding: 20px 40px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.share-modal h4 {
  font-size: 1.2em;
  font-weight: bold;
  color: #003366;
  margin-bottom: 20px;
}

.share-modal p {
  color: #555;
  margin-bottom: 20px;
}

.share-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.share-icon {
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  padding: 10px;
  font-size: 1.4em;
  cursor: pointer;
  transition: background 0.3s;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-icon.whatsapp { color: #25D366; }
.share-icon.facebook { color: #1877F2; }
.share-icon.telegram { color: #0088cc; }
.share-icon.twitter { color: #1DA1F2; }
.share-icon.email { color: #888; }

.share-icon:hover {
  background: #e0e0e0;
}

.copy-link-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.share-link-input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.9em;
}

.copy-link-button {
  background: #003366;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 0.9em;
  cursor: pointer;
}

.copy-link-button:hover {
  background: #002244;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5em;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
