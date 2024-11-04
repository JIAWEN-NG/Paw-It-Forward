<template>
  <div class="container-fluid page-layout">
    
      <CarouselFundraising />


    <div class="row fundraising-section">
      <!-- Sidebar Filter on the Left, stacks above Fundraising List on small screens -->
      <div class="col-md-3 col-12 filter-container">
        <CreateFundraisingForm @postCreated="handlePostCreated" />
        <FilterSidebarFundraising @filter="applyFilters" />
      </div>

      <!-- Fundraising List in the Center with Pagination and Success Message -->
      <div class="col-md-9 col-12">
   

        <!-- Success Message inside Fundraising List Container -->
        <div v-if="showSuccessMessage" class="alert alert-success" role="alert">
          Your fundraising post has been successfully created.
        </div>

        <!-- Dynamic Fundraising List without fixed height -->
        <FundraisingList
          :fundraisings="paginatedFundraisings"
        />
        <hr class="divider-line" />
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
  computed: {
    paginatedFundraisings() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredFundraisings.slice(start, end);
    },
    totalPages() {
      return Math.max(Math.ceil(this.filteredFundraisings.length / this.itemsPerPage), 1);
    },
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
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
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
  background-color: #F8F9FB;
  min-height: 100vh;
  padding-top: 20px;
}

.alert {
  margin-bottom: 20px;
  text-align: center;
}

.filter-container {
  background-color: #ffffff;
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


.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
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
