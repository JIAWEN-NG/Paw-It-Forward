<!-- FilterSidebarFundraising.vue -->
<template>
  <div class="filter-sidebar">
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

    <!-- Reset Filter Button -->
    <button class="reset-button" @click="resetFilters">Reset Filters</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedPetTypes: [],
    };
  },
  watch: {
    selectedPetTypes: {
      handler() {
        this.emitFilters();
      },
      deep: true,
    },
  },
  methods: {
    emitFilters() {
      this.$emit('filter', {
        petTypes: this.selectedPetTypes,
      });
    },
    resetFilters() {
      this.selectedPetTypes = [];
      this.emitFilters();
    },
  },
};
</script>

<style scoped>
.filter-sidebar {
  padding: 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  background-color: #FCEED5;
}

h4 {
  margin-bottom: 10px;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
}

.filter-group {
  margin-bottom: 15px;
}

label {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
}

input[type='checkbox'] {
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

@media (max-width: 768px) {
  .filter-sidebar {
    padding: 10px;
  }
}
</style>
