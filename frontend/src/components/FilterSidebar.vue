<!-- FilterSidebar.vue -->
<template>
  <div class="filter-sidebar">

    <!-- Sort by Date -->
    <h4 class="mt-4">Sort by Date</h4>
    <div class="filter-group">
      <label>
        <input type="radio" value="mostRecent" v-model="selectedSortOrder" />
        Most Recent
      </label>
      <label>
        <input type="radio" value="leastRecent" v-model="selectedSortOrder" />
        Least Recent
      </label>
    </div>

    

    <!-- Filter by Condition -->
    <h4 class="mt-4">Filter by Condition</h4>
    <div class="filter-group">
      <label v-for="condition in conditions" :key="condition">
        <input type="checkbox" :value="condition" v-model="selectedConditions" />
        {{ condition }}
      </label>
    </div>

   

    <!-- Filter by Item Category -->
    <h4 class="mt-4">Filter by Item Category</h4>
    <div class="filter-group">
      <label v-for="category in itemCategories" :key="category">
        <input type="checkbox" :value="category" v-model="selectedItemCategories" />
        {{ category }}
      </label>
    </div>

    

    <!-- Filter by Pet Type -->
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

    

    <!-- Filter by Location -->
    <h4 class="mt-4">Filter by Location</h4>
    <div class="filter-group">
      <label v-for="location in locations" :key="location">
        <input type="checkbox" :value="location" v-model="selectedLocations" />
        {{ location }}
      </label>
    </div>

    

    <!-- Reset Filter Button -->
    <button class="reset-button" @click="resetFilters">Reset Filters</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedConditions: [],
      selectedItemCategories: [],
      selectedPetTypes: [],
      selectedLocations: [], // New array for selected locations
      selectedSortOrder: [], // Default sort order
      conditions: ["Brand New", "Well Used", "Slightly Used", "Heavily Used"],
      itemCategories: [
        "Food & Feeding Supplies",
        "Toys",
        "Bedding & Furniture",
        "Grooming & Hygiene",
        "Clothing & Accessories",
        "Health & Wellness",
        "Travel & Carriers",
      ],
      locations: ["West", "East", "Central", "North", "North-east"], // New list of locations
    };
  },
  watch: {
    selectedConditions: {
      handler() {
        this.emitFilters();
      },
      deep: true,
    },
    selectedItemCategories: {
      handler() {
        this.emitFilters();
      },
      deep: true,
    },
    selectedPetTypes: {
      handler() {
        this.emitFilters();
      },
      deep: true,
    },
    selectedLocations: {
      handler() {
        this.emitFilters();
      },
      deep: true,
    },
    selectedSortOrder: {
      handler() {
        this.emitFilters();
      },
      immediate: true,
    },
  },
  methods: {
    emitFilters() {
      this.$emit("filter", {
        conditions: this.selectedConditions,
        itemCategories: this.selectedItemCategories,
        petTypes: this.selectedPetTypes,
        locations: this.selectedLocations, // Include selected locations in the emitted data
        sortOrder: this.selectedSortOrder,
      });
    },
    resetFilters() {
      this.selectedConditions = [];
      this.selectedItemCategories = [];
      this.selectedPetTypes = [];
      this.selectedLocations = []; // Reset selected locations
      this.selectedSortOrder = []; // Reset sort order
      this.emitFilters();
    },
  },
};
</script>

<style scoped>
/* Existing styles */
.filter-sidebar {
  padding: 25px;
  background-color: #ffffff;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  color: #333;
}

h4 {
  margin-bottom: 15px;
  font-size: 1.1em;
  color: #444;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  border-bottom: 2px solid #ececec;
  padding-bottom: 5px;
}

.filter-group {
  margin-bottom: 18px;
}


label {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  color: #555;
  font-weight: normal;
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


@media (max-width: 768px) {
  .filter-sidebar {
    padding: 15px;
    border-radius: 10px;
  }
}
</style>
