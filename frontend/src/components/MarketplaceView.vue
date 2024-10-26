<!-- MarketplaceView.vue -->
<template>
  <div class="container-fluid page-layout">

    <div class="row">
      <!-- inserting carousel component here -->
      <CarouselMarketplace/>
      <!-- <img src="../assets/carousel.png"> -->
    </div>

    <div class="row">
      <!-- Sidebar Filter on the Left -->
      <div class="col-md-3 filter-container">
        <CreateDonationForm />
        <FilterSidebar @filter="applyFilters" />
      </div>

      <!-- Donation List in the Center with Pagination -->
      <div class="col-md-9">

        <!-- Faint Divider Line -->
        <hr class="divider-line" />
        
        <!-- Scrollable Donation List -->
        <div class="listing-container shadow-box">
          <DonationList
          ref="donationList"
          :current-page="currentPage"
          :items-per-page="itemsPerPage"
          :donations="paginatedDonations"
        />
        </div>

        <!-- Faint Divider Line -->
        <hr class="divider-line" />
      </div>
    </div>
  </div>
</template>

<script>
import FilterSidebar from './FilterSidebar.vue';
import DonationList from './DonationList.vue';
import CreateDonationForm from './CreateDonationForm.vue';
import CarouselMarketplace from './CarouselMarketplace.vue';

export default {
  components: {
    FilterSidebar,
    DonationList,
    CreateDonationForm,
    CarouselMarketplace,
},
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 9,
      donations: [], // Full donation list
    };
  },
  computed: {
    paginatedDonations() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.donations.slice(start, end);
    },
    totalPages() {
      return Math.max(Math.ceil(this.donations.length / this.itemsPerPage), 1);
    },
  },
  methods: {
    applyFilters(filters) {
      if (this.$refs.donationList && this.$refs.donationList.filterDonations) {
        this.$refs.donationList.filterDonations(filters);
      } else {
        console.error('DonationList ref or filterDonations method is missing.');
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    setDonations(donations) {
      this.donations = donations;
    },
  },
};
</script>

<style scoped>
/* Layout styles */
.page-layout {
  background: #FCEED5; /* Set the background color to FCEED5 */
  min-height: 100vh;
  padding-top: 20px;
  font-family: 'Georgia', serif;
}

.filter-container {
  background-color: #FCEED5;
  border-right: 1px solid #ddd;
  padding: 20px;
  min-height: 100vh;
}

/* Scrollable Donation List */
.listing-container {
  height: 900px; /* Set a fixed height */
  overflow-y: auto; /* Enable vertical scrolling */
  padding: 20px;
  background-color: #f5e0c4;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.divider-line {
  border: 0;
  height: 1px;
  background: #ddd;
  margin: 20px 0;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.card {
  background-color:  #FCEED5;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: scale(1.02);
}

.card-title,
.card-subtitle {
  color: #2c3e50;
}

.card-text {
  color: #5c4033;
}

.btn-outline-primary {
  color: #2c3e50;
  border-color: #2c3e50;
}

.btn-outline-primary:hover {
  background-color: #2c3e50;
  color: #fff;
}
</style>
