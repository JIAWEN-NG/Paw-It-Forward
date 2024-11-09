<!-- FilterSidebar.vue -->
<template>
  <div class="filter-sidebar">
    <!-- Sort by Date -->
    <h4 class="mt-4" @click="toggleSection('isDateFilterOpen')">
      Sort by Date
    </h4>
    <div v-show="isDateFilterOpen" class="filter-group">
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
    <h4 class="mt-4" @click="toggleSection('isConditionFilterOpen')">
      Filter by Condition
    </h4>
    <div v-show="isConditionFilterOpen" class="filter-group">
      <label v-for="condition in conditions" :key="condition">
        <input type="checkbox" :value="condition" v-model="selectedConditions" />
        {{ condition }}
      </label>
    </div>

    <!-- Filter by Item Category -->
    <h4 class="mt-4" @click="toggleSection('isItemCategoryFilterOpen')">
      Filter by Item Category
    </h4>
    <div v-show="isItemCategoryFilterOpen" class="filter-group">
      <label v-for="category in itemCategories" :key="category">
        <input type="checkbox" :value="category" v-model="selectedItemCategories" />
        {{ category }}
      </label>
    </div>

    <!-- Filter by Pet Type -->
    <h4 class="mt-4" @click="toggleSection('isPetTypeFilterOpen')">
      Filter by Pet Type
    </h4>
    <div v-show="isPetTypeFilterOpen" class="filter-group">
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
    <h4 class="mt-4" @click="toggleSection('isLocationFilterOpen')">
      Filter by Location
    </h4>
    <div v-show="isLocationFilterOpen" class="filter-group">
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
      isDateFilterOpen: false,
      isConditionFilterOpen: false,
      isItemCategoryFilterOpen: false,
      isPetTypeFilterOpen: false,
      isLocationFilterOpen: false,
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
    toggleSection(section) {
      if (Object.prototype.hasOwnProperty.call(this, section)) {
        this[section] = !this[section];
      } else {
        console.error(`Section ${section} not found in data properties`);
      }
    },
    checkScreenSize() {
      const isLargeScreen = window.innerWidth >= 992;
      this.isDateFilterOpen = isLargeScreen;
      this.isConditionFilterOpen = isLargeScreen;
      this.isItemCategoryFilterOpen = isLargeScreen;
      this.isPetTypeFilterOpen = isLargeScreen;
      this.isLocationFilterOpen = isLargeScreen;
    },
    emitFilters() {
      this.$emit("filter", {
        conditions: this.selectedConditions,
        itemCategories: this.selectedItemCategories,
        petTypes: this.selectedPetTypes,
        locations: this.selectedLocations,
        sortOrder: this.selectedSortOrder,
      });
    },
    resetFilters() {
      this.selectedConditions = [];
      this.selectedItemCategories = [];
      this.selectedPetTypes = [];
      this.selectedLocations = [];
      this.selectedSortOrder = [];
      this.emitFilters();
    },
  },
  created() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
};
</script>

<style scoped>
/* Existing styles */
/* Optionally, hide filter options on xs screens */
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
  cursor: pointer; /* Added for clarity */
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
  width: 100%;
  text-align: center;
  font-size: medium;
}

@media (max-width: 300px) {
  .filter-group {
    display: none;
  }
  .filter-group[v-show="true"] {
    display: block;
  }
}
</style>
