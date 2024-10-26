<template>
  <div class="fundraising-list">
    <div class="row gx-2">
      <div
        v-for="fundraiser in paginatedFundraisers"
        :key="fundraiser.id"
        class="col-sm-6 col-lg-4 mb-2"
      >
        <!-- Use router-link to make the entire card clickable -->
        <router-link :to="{ name: 'FundraisingDetail', params: { id: fundraiser.id } }" class="card compact-card">
          <img
            class="card-img-top compact-img"
            :src="fundraiser.fundraisingImg"
            alt="Campaign Image"
          />
          <div class="card-body">
            <h5 class="card-title">{{ fundraiser.title }}</h5>
            <h5 class="card-title" v-if="false">{{ fundraiser.petType }}</h5>

       
            <div class="progress-container">
              <div
                class="progress-bar"
                :style="{ width: progressPercentage(fundraiser) + '%' }"
              ></div>
            </div>
            
            <p class="card-text goal-text">
              {{ formattedCurrency(fundraiser.amountRaised) }} of {{ formattedCurrency(fundraiser.targetAmount) }}
            </p>
            <!-- Posted Date -->
            <p class="card-posted-date">
              Posted: {{ formattedDate(fundraiser.createdAt) }}
            </p>
          </div>
        </router-link> <!-- End router-link -->
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-container">
      <button
        :disabled="currentPage === 1"
        @click="currentPage--"
        class="btn btn-outline-primary"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="currentPage++"
        class="btn btn-outline-primary"
      >
        Next
      </button>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      fundraisers: [],
      currentPage: 1,
      itemsPerPage: 9,
      filteredFundraiserList: [],
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredFundraiserList.length / this.itemsPerPage);
    },
    paginatedFundraisers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredFundraiserList.slice(start, end);
    },
  },
  methods: {
  async fetchFundraisers() {
    try {
      const response = await fetch('http://localhost:8000/api/Fundraising');
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      const data = await response.json();

      // Ensure correct types for goalAmount and raisedAmount
      this.fundraisers = data.map(fundraiser => ({
        ...fundraiser,
        goalAmount: parseFloat(fundraiser.targetAmount) || 0,
        raisedAmount: parseFloat(fundraiser.amountRaised) || 0,
        createdAt: new Date(fundraiser.createdAt) // Ensure createdAt is a Date object
      }));

      // Sort fundraisers by createdAt date, newest first
      this.fundraisers.sort((a, b) => b.createdAt - a.createdAt);

      // Set filtered list
      this.filteredFundraiserList = this.fundraisers;
    } catch (error) {
      console.error('Error fetching fundraisers:', error);
    }
  },

    progressPercentage(fundraiser) {
      const percentage = (fundraiser.amountRaised / fundraiser.targetAmount) * 100;
      return isFinite(percentage) ? percentage.toFixed(2) : 0;
    },
    formattedCurrency(value) {
      const numberValue = parseFloat(value);
      if (isNaN(numberValue)) {
        return '$0.00';
      }
      return `$${numberValue.toFixed(2)}`;
    },
    // Add function to format the date
    formattedDate(date) {
      if (!date) return '';

      const d = new Date(date);
      const day = d.getDate();
      const month = d.toLocaleString('default', { month: 'long' });
      const year = d.getFullYear();

      return `${day} ${month} ${year}`;
    },
  },
  async created() {
    await this.fetchFundraisers();
  },
};
</script>

<style scoped>
.fundraising-list {
  margin-top: 20px;
  font-family: 'Montserrat', sans-serif;
}

/* Align cards to the left */
.row {
  display: flex;
  flex-wrap: wrap; /* Allow cards to wrap to the next line */
  justify-content: flex-start; /* Align items to the left */
}

.col-sm-6,
.col-lg-4 {
  display: flex;
  justify-content: flex-start; /* Align individual cards to the left */
}

/* Adjusted Compact Card Styling for Wider Card */
.compact-card {
  width: 100%;
  max-width: 22rem; /* Increase card width */
  margin: 10px; /* Adjust margin for consistent spacing */
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  padding: 8px;
  border-radius: 8px;
  text-decoration: none;
}

.compact-card:hover {
  transform: scale(1.02);
}

/* Adjusted Compact Image */
.compact-img {
  height: 220px; /* Increase image height */
  width: 100%; /* Ensure it takes the full width of the card */
  object-fit: cover;
  background-color: #fff;
}

/* Card Text Styling */
.card-title {
  font-size: 0.9rem;
  margin-bottom: 4px;
  text-align: left;
}

.card-body {
  padding: 8px;
  text-align: left;
}

.card-posted-date {
  font-size: 0.75rem;
  color: #555;
  text-align: left;
}

/* Progress and Goal Text Styling */
.goal-text {
  font-size: 0.75rem;
  margin-bottom: 8px;
  text-align: left;
}

/* Progress Bar Styling */
.progress-container {
  background-color: #f0f0f0;
  border-radius: 4px;
  height: 8px;
  margin-bottom: 10px;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
}

/* Pagination Styling */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination-container button {
  padding: 5px 10px;
}

.btn-outline-primary {
  color: #8b4513;
  border-color: #8b4513;
  font-size: 0.75rem;
  padding: 3px 6px;
}

.btn-outline-primary:hover {
  background-color: #8b4513;
  color: #fff;
}
</style>
