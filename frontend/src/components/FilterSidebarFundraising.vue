<template>
  <div class="filter-sidebar p-3 p-md-4">
    <h4 class="mt-4">Filter by Pet Type</h4>
    <div class="filter-group">
      <label>
        <input type="checkbox" value="Cat" v-model="selectedPetTypes" />
        Cat
      </label>
      <label>
        <input type="checkbox" value="Dog" v-model="selectedPetTypes" />
        Dog
      </label>
    </div>
    <div class="divider"></div>

    <!-- Sort Options -->
    <h4 class="mt-4">Sort by</h4>
    <div class="sort-group">
      <label>
        <input type="radio" value="recent" v-model="sortOption" /> Most Recent
      </label>
      <label>
        <input type="radio" value="oldest" v-model="sortOption" /> Least Recent
      </label>
    </div>
    
    <div class="divider"></div>

    <!-- Reset Filter Button -->
    <button class="reset-button w-100" @click="resetFilters">Reset Filters</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedPetTypes: [],
      sortOption: null, // No default selection
    };
  },
  watch: {
    selectedPetTypes: {
      handler() {
        this.emitFilters();
      },
      deep: true,
    },
    sortOption() {
      this.emitFilters();
    },
  },
  methods: {
    emitFilters() {
      this.$emit('filter', {
        petTypes: this.selectedPetTypes,
        sortOption: this.sortOption,
      });
    },
    resetFilters() {
      this.selectedPetTypes = [];
      this.sortOption = null; // Reset sort option
      this.emitFilters();
    },
  },
};
</script>

<style scoped>
.filter-sidebar {
  background-color: #FCEED5;
}

h4 {
  margin-bottom: 10px;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
}

.filter-group, .sort-group {
  margin-bottom: 15px;
}

label {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
}

input[type='checkbox'],
input[type='radio'] {
  margin-right: 10px;
}

.divider {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin: 10px 0;
}

.reset-button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
}

.reset-button:hover {
  background-color: #34495e;
}
</style>
