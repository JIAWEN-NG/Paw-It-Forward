<template>
  <div class="container-fluid page-layout">
    <div class="row">
      <CarouselFundraising />
    </div>

    <div class="row fundraising-section">
      <!-- Sidebar Filter on the Left, stacks above Fundraising List on small screens -->
      <div class="col-md-3 col-12 filter-container">
        <CreateFundraisingForm @postCreated="handlePostCreated" />
        <FilterSidebarFundraising @filter="applyFilters" />
      </div>

      <!-- Fundraising List in the Center with Pagination and Success Message -->
      <div class="col-md-9 col-12">
        <hr class="divider-line" />

        <!-- Success Message inside Fundraising List Container -->
        <div v-if="showSuccessMessage" class="alert alert-success" role="alert">
          Your fundraising post has been successfully created.
        </div>

        <!-- Dynamic Fundraising List without fixed height -->
        <FundraisingList
          :fundraisings="filteredFundraisings"
          :current-page="currentPage"
          :items-per-page="itemsPerPage"
          @update-page="updatePage"
        />

        <hr class="divider-line" />
      </div>
    </div>
  </div>
</template>

<script>
import FilterSidebarFundraising from './FilterSidebarFundraising.vue';
import FundraisingList from './FundraisingList.vue';
import CreateFundraisingForm from './CreateFundraisingForm.vue';
import CarouselFundraising from './CarouselFundraising.vue';

export default {
  components: {
    FilterSidebarFundraising,
    FundraisingList,
    CreateFundraisingForm,
    CarouselFundraising,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 9,
      fundraisings: [],
      filteredFundraisings: [],
      showSuccessMessage: false, // To control visibility of success message
    };
  },
  methods: {
    applyFilters(filters) {
      let sortedFundraisings = [...this.fundraisings];
      if (filters.sortOption === 'recent') {
        sortedFundraisings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (filters.sortOption === 'oldest') {
        sortedFundraisings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      this.filteredFundraisings = sortedFundraisings.filter((fundraiser) => {
        return filters.petTypes.length === 0 || filters.petTypes.includes(fundraiser.petType);
      });

      this.currentPage = 1;
    },
    updatePage(page) {
      this.currentPage = page;
    },
    setFundraisings(fundraisings) {
      this.fundraisings = fundraisings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      this.filteredFundraisings = this.fundraisings;
    },

    // Handle postCreated event
    handlePostCreated() {
      this.showSuccessMessage = true;
      
      // Hide the message after 3 seconds
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
      
      // Reload the list of fundraisings
      this.fetchFundraisings();
    },

    async fetchFundraisings() {
      const response = await fetch('http://localhost:8000/api/Fundraising');
      const data = await response.json();
      this.setFundraisings(data);
    },
  },
  async created() {
    this.fetchFundraisings();
  },
};
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  padding-top: 20px;
  font-family: 'Georgia', serif;
  background-color: #F8F9FB;
}

.alert {
  margin-bottom: 20px;
  text-align: center;
}

.filter-container {
  background-color: #F8F9FB;
  border-right: 1px solid #ddd;
  padding: 20px;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .filter-container {
    min-height: auto;
    border-right: none;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
  }
}

.divider-line {
  border: 0;
  height: 1px;
  background: #ddd;
  margin: 20px 0;
}
</style>
