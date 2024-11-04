<template>
  <div class="fundraising-list">
    <div class="row justify-content-start">
      <div
        v-for="fundraiser in fundraisings"
        :key="fundraiser.id"
        class="col-12 col-sm-6 col-lg-4 d-flex justify-content-center mb-2"
      >
        <router-link :to="{ name: 'FundraisingDetail', params: { id: fundraiser.id } }" class="card compact-card">
          <img
            class="card-img-top compact-img"
            :src="fundraiser.fundraisingImg"
            alt="Campaign Image"
          />
          <div class="card-body">
            <h5 class="card-title">{{ fundraiser.title }}</h5>

            <!-- Fundraiser Description (truncated to 10 words) -->
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
  </div>
</template>

<script>
export default {
  props: {
    fundraisings: {
      type: Array,
      required: true,
    },
  },
  methods: {
    progressPercentage(fundraiser) {
      const percentage = (fundraiser.amountRaised / fundraiser.targetAmount) * 100;
      return isFinite(percentage) ? percentage.toFixed(2) : 0;
    },
    formattedCurrency(value) {
      const numberValue = parseFloat(value);
      return isNaN(numberValue) ? '$0.00' : `$${numberValue.toFixed(2)}`;
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

.compact-card {
  width: 100%;
  max-width: 22rem;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  border-radius: 8px;
  text-decoration: none;
  margin: 10px;
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
  font-size: 16px;
  margin-bottom: 4px;
  text-align: left;
  font-weight: bold;
}
.card-description {
  font-size: 16px;
  color: #333;
  margin-bottom: 6px;
  text-align: left;
}
.card-body {
  padding: 8px;
  text-align: left;
  padding-left: 20px;
}

.card-posted-date {
  font-size: 16px;
  color: #555;
  text-align: left;
}

.goal-text {
  font-size: 16px;
  margin-bottom: 8px;
  text-align: left;
}

.progress-container {
  background-color: #f0f0f0;
  border-radius: 4px;
  height: 10px;
  margin-bottom: 10px;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
}
</style>
