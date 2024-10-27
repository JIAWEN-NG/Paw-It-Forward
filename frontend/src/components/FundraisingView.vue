<template>
  <div class="container-fluid page-layout">
    <div class="row">
      <!-- Carousel Component -->
      <CarouselFundraising />
    </div>

    <div class="row fundraising-section">
      <!-- Sidebar Filter on the Left, stacks above Fundraising List on small screens -->
      <div class="col-md-3 col-12 filter-container">
        <CreateFundraisingForm />
        <FilterSidebarFundraising @filter="applyFilters" />
      </div>

      <!-- Fundraising List in the Center with Pagination inside listing-container -->
      <div class="col-md-9 col-12">
        <hr class="divider-line" />

        <!-- Dynamic Fundraising List without fixed height -->
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
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredFundraisings.length / this.itemsPerPage);
    }
  },
  methods: {
    applyFilters(filters) {
      let sortedFundraisings = [...this.fundraisings];

      if (filters.sortOption) {
        if (filters.sortOption === 'recent') {
          sortedFundraisings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (filters.sortOption === 'oldest') {
          sortedFundraisings.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
      }

      this.filteredFundraisings = sortedFundraisings.filter((fundraiser) => {
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

@media (max-width: 768px) {
  .filter-container {
    min-height: auto;
    border-right: none;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
  }
}

.listing-container {
  padding: 20px;
  background-color: #f5e0c4;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}

.divider-line {
  border: 0;
  height: 1px;
  background: #ddd;
  margin: 20px 0;
}


</style>
