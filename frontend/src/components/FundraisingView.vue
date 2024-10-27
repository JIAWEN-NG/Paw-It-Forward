<!-- FundraisingView.vue -->
<template>
  <div class="container-fluid page-layout">
    <div class="row">
      <!-- Carousel Component -->
      <CarouselMarketplace />
    </div>

    <div class="row fundraising-section">
      <!-- Sidebar Filter on the Left -->
      <div class="col-md-3 filter-container">
        <CreateFundraisingForm />
        <FilterSidebarFundraising @filter="applyFilters" />
      </div>

      <!-- Fundraising List in the Center with Pagination -->
      <div class="col-md-9">
        <hr class="divider-line" />

        <!-- Scrollable Fundraising List -->
        <div class="listing-container shadow-box">
          <FundraisingList
            :fundraisings="filteredFundraisings"
            :current-page="currentPage"
            :items-per-page="itemsPerPage"
            @update-page="updatePage"
          />
        </div>

        <hr class="divider-line" />
      </div>
    </div>
  </div>
</template>

<script>
import FilterSidebarFundraising from './FilterSidebarFundraising.vue';
import FundraisingList from './FundraisingList.vue';
import CreateFundraisingForm from './CreateFundraisingForm.vue';
import CarouselMarketplace from './CarouselMarketplace.vue';

export default {
  components: {
    FilterSidebarFundraising,
    FundraisingList,
    CreateFundraisingForm,
    CarouselMarketplace,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 9,
      fundraisings: [],
      filteredFundraisings: [],
    };
  },
  methods: {
    applyFilters(filters) {
      this.filteredFundraisings = this.fundraisings.filter((fundraiser) => {
        return (
          filters.petTypes.length === 0 || filters.petTypes.includes(fundraiser.petType)
        );
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
  },
  async created() {
    const response = await fetch('http://localhost:8000/api/Fundraising');
    const data = await response.json();
    this.setFundraisings(data);
  },
};
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  padding-top: 20px;
  font-family: 'Georgia', serif;
  background-color: #FCEED5;
}

.filter-container {
  background-color: #FCEED5;
  border-right: 1px solid #ddd;
  padding: 20px;
  min-height: 100vh;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.listing-container {
  height: 900px;
  overflow-y: auto;
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
</style>
