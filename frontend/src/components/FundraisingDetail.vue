<template>
  <div class="fundraising-detail">
    <div class="row align-items-start">
      <!-- Image Column -->
      <div class="col-md-6 mb-4">
        <img
          class="img-fluid rounded shadow"
          :src="fundraising.fundraisingImg"
          alt="Fundraising Campaign Image"
        />
      </div>

      <!-- Details Column -->
      <div class="col-md-6">
        <h3 class="title">{{ fundraising.title }}</h3>
        <p class="description">{{ fundraising.description }}</p>
        <p class="card-posted-date">
          Posted: {{ formattedDate(fundraising.createdAt) }}
        </p>
        <p class="goal-text">
          {{ formattedCurrency(fundraising.amountRaised) }} of {{ formattedCurrency(fundraising.targetAmount) }}
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

        <!-- Donation Amount Input -->
        <label for="donationAmount" class="label">Donation Amount</label>
        <input
          type="number"
          v-model="donationAmount"
          placeholder="Enter custom amount"
          class="input"
          :disabled="!isCustomAmount && !initialEditable"
        />

        <!-- Preset Donation Amounts -->
        <div class="preset-amounts">
          <button
            v-for="amount in presetAmounts"
            :key="amount"
            @click="setDonationAmount(amount)"
            :class="{ selected: donationAmount === amount }"
          >
            ${{ amount }}
          </button>
          <button @click="enableCustomAmount" :class="{ selected: isCustomAmount }">Other</button>
        </div>

        <!-- Styled Donate Button -->
        <button class="donate-button mt-3" @click="startCheckout">
          Donate Now
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

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
    const fundraising = ref({});
    const loading = ref(true);
    const error = ref(null);
    const donationAmount = ref(null);
    const presetAmounts = ref([5, 10, 20, 50, 100]);
    const isCustomAmount = ref(false);
    const initialEditable = ref(true);

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
      initialEditable.value = false;
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
      if (!donationAmount.value) {
        alert("Please enter or select a donation amount.");
        return;
      }

      const amountInCents = donationAmount.value * 100;

      try {
        const response = await axios.post('http://localhost:8000/create-checkout-session', {
          postName: fundraising.value.title,
          price: amountInCents,
          userId: fundraising.value.userId,
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
      initialEditable,
      setDonationAmount,
      enableCustomAmount,
      startCheckout,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Montserrat:wght@500&display=swap');

body {
  background-color: #f5f7fa; 
  font-family: 'Open Sans', sans-serif; 
}

.fundraising-detail {
  max-width: 1200px; 
  margin: 40px auto; 
  padding: 20px;
  background: #ffffff; 
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); 
  border-radius: 10px; 
}

.title {
  font-size: 2em; 
  font-weight: 700; 
  color: #333;
  text-align: left;
}

.img-fluid {
  border-radius: 10px; 
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
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

.label {
  font-size: 1em;
  margin-bottom: 5px;
  color: #555;
}

.input {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.input[disabled] {
  background-color: #f5f5f5;
  color: #888;
  cursor: not-allowed;
}

.preset-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
}

.preset-amounts button {
  flex: 1;
  padding: 10px;
  font-size: 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.preset-amounts button.selected {
  background-color: #0056b3;
}

.preset-amounts button:hover {
  background-color: #0056b3;
}

/* Updated Donate Now Button Style */
.donate-button {
  width: 50%;
  padding: 12px 20px;
  font-size: 16px;
  color: white;
  background: linear-gradient(135deg, #4b2e1c 0%, #7a5234 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  margin-top: 20px;
}

.donate-button:hover {
  background: linear-gradient(135deg, #5c3a2a 0%, #8b6543 100%);
  transform: translateY(-2px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.donate-button:active {
  transform: translateY(1px);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background: #5c3a2a;
}
</style>
