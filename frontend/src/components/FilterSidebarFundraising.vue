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
  background-color: #F8F9FB ;
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
    padding: 12px 20px;
    background: linear-gradient(135deg, #4b2e1c 0%, #7a5234 100%); /* Gradient from dark brown to medium brown */
    color: white;
    border: none;
    border-radius: 50px; /* Rounded edges */
    cursor: pointer;
    font-size: 16px;
    font-family: 'Montserrat', sans-serif;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15); /* Subtle shadow */
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.reset-button:hover {
    background: linear-gradient(135deg, #5c3a2a 0%, #8b6543 100%); /* Lighter gradient on hover */
    transform: translateY(-2px); /* Slight lift on hover */
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2); /* Slightly deeper shadow */
}

.reset-button:active {
    transform: translateY(1px); /* Subtle press effect */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Lighter shadow */
    background: #5c3a2a; /* Solid brown on active state */
}

</style>
