<template>
  <div class="fundraising-list">
    <div class="row gx-2">
      <div
        v-for="fundraiser in paginatedFundraisings"
        :key="fundraiser.id"
        class="col-sm-6 col-lg-4 mb-2"
      >
        <router-link :to="{ name: 'FundraisingDetail', params: { id: fundraiser.id } }" class="card compact-card">
          <img
            class="card-img-top compact-img"
            :src="fundraiser.fundraisingImg"
            alt="Campaign Image"
          />
          <div class="card-body">
            <h5 class="card-title">{{ fundraiser.title }}</h5>

            <!-- Fundraiser Description (20 words) -->
            <p class="card-description">{{ truncatedDescription(fundraiser.description) }}</p>

            <!-- Progress Bar -->
            <div class="progress-container">
              <div
                class="progress-bar"
                :style="{ width: progressPercentage(fundraiser) + '%' }"
              ></div>
            </div>

            <p class="card-text goal-text">
              {{ formattedCurrency(fundraiser.amountRaised) }} of {{ formattedCurrency(fundraiser.targetAmount) }}
            </p>
            <p class="card-posted-date">
              Posted: {{ formattedDate(fundraiser.createdAt) }}
            </p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-container">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1" 
        class="btn btn-outline-primary pagination-button">
        Previous
      </button>
      <span class="pagination-text">Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages" 
        class="btn btn-outline-primary pagination-button">
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fundraisings: {
      type: Array,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      required: true,
    },
  },
  computed: {
    paginatedFundraisings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.fundraisings.slice(start, end);
    },
    totalPages() {
      return Math.max(Math.ceil(this.fundraisings.length / this.itemsPerPage), 1);
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('update-page', page);
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
    formattedDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const day = d.getDate();
      const month = d.toLocaleString('default', { month: 'long' });
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    },
    truncatedDescription(description) {
      if (!description) return '';
      const words = description.split(' ');
      return words.length <= 10 ? description : words.slice(0, 10).join(' ') + '...';
    },
  },
};
</script>

<style scoped>
.fundraising-list {
  margin-top: 20px;
  font-family: 'Montserrat', sans-serif;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.col-sm-6,
.col-lg-4 {
  display: flex;
  justify-content: flex-start;
}

.compact-card {
  width: 100%;
  max-width: 22rem;
  margin: 10px;
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

.compact-img {
  height: 220px;
  width: 100%;
  object-fit: cover;
  background-color: #fff;
}

.card-title {
  font-size: 0.9rem;
  margin-bottom: 4px;
  text-align: left;
}
.card-description {
  font-size: 0.8rem;
  color: #333;
  margin-bottom: 6px;
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

.goal-text {
  font-size: 0.75rem;
  margin-bottom: 8px;
  text-align: left;
}

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
/* Button Container */
.button-container {
  display: flex;
  justify-content: flex-end;
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
.pagination-button {
  color: #8b4513;
  border-color: #8b4513;
  font-size: 0.75rem;
  padding: 3px 6px;
}

.pagination-button:hover {
  background-color: #8b4513;
  color: #fff;
}



.pagination-text {
  font-size: 0.85rem;
  color: #333;
}
</style>
