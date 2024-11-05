<template>
  <div class="fundraising-list">
    <div class="cards-container">
      <div class="row gx-2">
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
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ fundraiser.title }}</h5>
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

              <!-- Spacer to push content above the posted date -->
              <div class="flex-spacer"></div>

              <!-- Fixed "Posted on" date at the bottom -->
              <p class="card-posted-date">
                Posted {{ formattedDate(fundraiser.createdAt) }}
              </p>
            </div>
          </router-link>
        </div>
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
  font-family: 'Montserrat', sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.cards-container {
  padding: 20px;
  background-color: #F8F9FB;
  border-radius: 20px;
}
.compact-card {
  width: 100%;
  max-width: 22rem;
  height: 400px; /* Fixed height for uniform card size */
  margin: 10px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
}

.compact-card:hover {
  transform: scale(1.02);
}

.compact-img {
  height: 230px;
  width: 100%;
  object-fit: cover;
  background-color: #fff;
}

.card-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 15px;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  height: 40px; /* Fixed height for uniform alignment */
  margin-bottom: 4px; /* Small margin below title to reduce gap */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-description {
  font-size: 0.75rem;
  text-align: left;
  margin-bottom: 8px; /* Adjusts spacing between elements */
  overflow: hidden;
  white-space: nowrap; /* Prevents text from wrapping */
  text-overflow: ellipsis; /* Adds ellipsis (...) for overflow text */
}
.progress-container {
  background-color: #f0f0f0;
  border-radius: 4px;
  height: 10px;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
}

.goal-text {
  text-align: left;
  color:sienna;
  font-weight: 650;
  margin-top: 8px; /* Consistent spacing between elements */
}

.flex-spacer {
  flex-grow: 1; /* Pushes "Posted on" text to the bottom */
}

.card-posted-date {
  font-size: 0.75rem;
  color: #555;
  text-align: left;
  margin-top: auto;
}

</style>