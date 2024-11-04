<template>
  <div class="filter-sidebar">

    <!-- Sort Options -->
    <h4>Sort by</h4>
    <div class="filter-group">
      <label>
        <input type="radio" value="recent" v-model="sortOption" /> Most Recent
      </label>
      <label>
        <input type="radio" value="oldest" v-model="sortOption" /> Least Recent
      </label>
    </div>
    
    <div class="divider"></div>
    
    <h4>Filter by Pet Type</h4>
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
  padding: 25px;
  background-color: #ffffff;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  color: #333;
}

h4 {
  margin-top: 2px; 
  margin-bottom: 5px;
  font-size: 1.1em;
  color: #444;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  border-bottom: 2px solid #ececec;
  padding-bottom: 5px;
}



label {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  color: #555;
}

input[type='checkbox'],
input[type='radio'] {
  margin-right: 10px;
  accent-color: #5a6e8c;
  transform: scale(1.1);
}
.divider {
  border-bottom: 1px solid #e2e2e2;
  margin: 0;
}

.reset-button {
  margin-top: 20px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #5d483a 0%, #a0522d 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  width: 100%;
  text-align: center;
  font-size: medium;
}

.reset-button:hover {
  background: linear-gradient(135deg, #8b5726 0%, #b3573d 100%);
  transform: translateY(-2px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.reset-button:active {
  transform: translateY(1px);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

</style>
