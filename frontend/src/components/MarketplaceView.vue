<!-- MarketplaceView.vue -->
<template>
  <div class="container-fluid page-layout">

    
    <!-- inserting carousel component here -->
    <CarouselMarketplace/>
      

    <div class="row">
      <!-- Sidebar Filter on the Left -->
      <div class="col-md-3 filter-container">
        <CreateDonationForm />
        <FilterSidebar @filter="applyFilters" />
      </div>

      <!-- Donation List in the Center with Pagination -->
      <div class="col-md-9">
        <!-- Direct Donation List -->
        <DonationList
          ref="donationList"
          :current-page="currentPage"
          :items-per-page="itemsPerPage"
          :donations="paginatedDonations"
        />

        <!-- Faint Divider Line -->
        <hr class="divider-line" />
        <!-- <PuppyAnimation/> -->
      </div>
    </div>
  </div>
</template>

<script>
import FilterSidebar from './FilterSidebar.vue';
import DonationList from './DonationList.vue';
import CreateDonationForm from './CreateDonationForm.vue';
import CarouselMarketplace from './CarouselMarketplace.vue';
// import PuppyAnimation from './PuppyAnimation.vue';

export default {
  components: {
    FilterSidebar,
    DonationList,
    CreateDonationForm,
    CarouselMarketplace,
    // PuppyAnimation,
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
  background-color: #F8F9FB;
  min-height: 100vh;
  padding-top: 20px;
  font-family: 'Georgia', serif;
}

.filter-container {
  background-color: #ffffff;
  padding: 20px;
  min-height: 100vh;
}

/* .divider-line {
  border: 0;
  height: 1px;
  background-color: linear-gradient(103deg, rgba(252, 238, 213, 0.6) 6.43%, rgba(252, 238, 213, 0.6) 78.33%, rgba(255, 231, 186, 0.6) 104.24%);
  margin: 20px 0;
} */

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.card {
  background-color: white;
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
