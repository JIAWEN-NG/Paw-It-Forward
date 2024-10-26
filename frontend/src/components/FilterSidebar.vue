<!-- FilterSidebar.vue -->
<template>
  <div class="filter-sidebar">
    <h4>Filter by Condition</h4>
    <div class="filter-group">
      <label v-for="condition in conditions" :key="condition">
        <input type="checkbox" :value="condition" v-model="selectedConditions" />
        {{ condition }}
      </label>
    </div>
    <div class="divider"></div>

    <h4 class="mt-4">Filter by Item Category</h4>
    <div class="filter-group">
      <label v-for="category in itemCategories" :key="category">
        <input type="checkbox" :value="category" v-model="selectedItemCategories" />
        {{ category }}
      </label>
    </div>
    <div class="divider"></div>

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

    <h4 class="mt-4">Filter by Breed</h4>
    <div class="filter-group">
      <div v-if="selectedPetTypes.includes('Cat')">
        <h5>Cat Breeds</h5>
        <label v-for="breed in catBreeds" :key="breed">
          <input type="checkbox" :value="breed" v-model="selectedBreeds" />
          {{ breed }}
        </label>
      </div>
      <div v-if="selectedPetTypes.includes('Dog')">
        <h5>Dog Breeds</h5>
        <label v-for="breed in dogBreeds" :key="breed">
          <input type="checkbox" :value="breed" v-model="selectedBreeds" />
          {{ breed }}
        </label>
      </div>
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
      selectedConditions: [],
      selectedItemCategories: [],
      selectedPetTypes: [],
      selectedBreeds: [],
      conditions: ['Brand New', 'Well Used', 'Slightly Used', 'Heavily Used'],
      itemCategories: [
        'Food & Feeding Supplies',
        'Toys',
        'Bedding & Furniture',
        'Grooming & Hygiene',
        'Clothing & Accessories',
        'Health & Wellness',
        'Travel & Carriers',
      ],
      catBreeds: ['Maine Coon', 'Ragdoll', 'Persian', 'Bengal', 'Sphynx'],
      dogBreeds: ['Labrador Retriever', 'French Bulldog', 'Golden Retriever'],
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
    selectedBreeds: {
      handler() {
        this.emitFilters();
      },
      deep: true,
    },
  },
  methods: {
    emitFilters() {
      this.$emit('filter', {
        conditions: this.selectedConditions,
        itemCategories: this.selectedItemCategories,
        petTypes: this.selectedPetTypes,
        breeds: this.selectedBreeds,
      });
    },
    resetFilters() {
      this.selectedConditions = [];
      this.selectedItemCategories = [];
      this.selectedPetTypes = [];
      this.selectedBreeds = [];
      this.emitFilters(); // Emit reset filters to parent
    },
  },
};
</script>

<style scoped>
.filter-sidebar {
  padding: 20px; /* Add padding around the sidebar */
  font-family: 'Montserrat', sans-serif; /* Updated font family */
  font-size: 14px; /* Set base font size */
  background-color: #FCEED5; /* Set background color to FCEED5 */
}

h4 {
  margin-bottom: 10px; /* Space between heading and the checkbox group */
  font-size: 16px; /* Smaller font size for headings */
  font-family: 'Montserrat', sans-serif; /* Updated font family */
}

h5 {
  margin-bottom: 5px; /* Space between subheading and checkbox group */
  font-size: 14px; /* Smaller font size for subheadings */
  font-family: 'Montserrat', sans-serif; /* Updated font family */
}

/* Filter group styling */
.filter-group {
  margin-bottom: 15px; /* Space between filter groups */
}

/* Align labels to the left */
label {
  display: flex;
  align-items: center; /* Align checkbox and text */
  margin-bottom: 5px; /* Space between checkboxes */
  cursor: pointer; /* Change cursor on hover */
  font-family: 'Montserrat', sans-serif; /* Updated font family */
}

/* Style the checkboxes */
input[type='checkbox'] {
  margin-right: 10px; /* Space between checkbox and label text */
}

/* Divider styling */
.divider {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* Faint line */
  margin: 10px 0; /* Space above and below the divider */
}

/* Reset button styling */
.reset-button {
  margin-top: 20px; /* Space above the button */
  padding: 10px 15px; /* Padding for the button */
  background-color: #2c3e50; /* Dark blue background */
  color: white; /* White text */
  border: none; /* No border */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
  font-family: 'Montserrat', sans-serif; /* Updated font family */
}

.reset-button:hover {
  background-color: #34495e; /* Darker shade on hover */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-sidebar {
    padding: 10px; /* Less padding on smaller screens */
  }
}
</style>
