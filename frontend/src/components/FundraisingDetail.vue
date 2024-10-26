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
      
        
        <button class="btn btn-primary" @click="donate">
          Donate Now
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

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

    const progressPercentage = computed(() => {
      if (fundraising.value.targetAmount > 0) {
        return (fundraising.value.amountRaised / fundraising.value.targetAmount) * 100;
      }
      return 0;
    });

    const formattedCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };

    const formattedDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    };

    const donate = () => {
      alert('Donation feature coming soon!');
    };

    onMounted(fetchFundraisingDetail);

    return {
      fundraising,
      loading,
      error,
      progressPercentage,
      formattedCurrency,
      formattedDate,
      donate,
    };
  },
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');

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
  text-align:left;
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


.goal-text, .card-posted-date, .description {
  color: #666; 
  text-align: left; 
}

.btn-primary {
  width: 30%;
  background-color: #8B4513; 
  border: 2px solid #8B4513; 
  padding: 10px 0;
  transition: background-color 0.3s ease, box-shadow 0.3s, border-color 0.3s; 
}

.btn-primary:hover {
  background-color: black; 
  box-shadow: 0 0 10px rgba(139, 69, 19, 0.75); 
  border-color: #8B4513; 
}


.description-label {
  font-size: 1.1em; 
}

.description {
  font-size: 1em;
  text-align:justify;
}
</style>

