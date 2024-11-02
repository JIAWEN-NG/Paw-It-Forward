<!-- DonationList.vue -->
<template>
  <div class="donation-list">
    <!-- Scrollable Cards Container -->
    <div class="cards-container">
      <div class="row gx-2">
        <div
          v-for="donation in formattedDonations"
          :key="donation.id"
          class="col-sm-6 col-lg-4 mb-2"
        >
          <div class="card compact-card">
            <div class="card-header d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <img
                  v-if="donation.donorProfileImage"
                  :src="donation.donorProfileImage"
                  alt="Profile Image"
                  class="donor-profile-img"
                />
                <h6 class="card-subtitle mb-0 ms-2">
                  {{ donation.donorName || 'Anonymous' }}
                </h6>
              </div>
              
            </div>

            <img
              id="card_img"
              class="card-img-top compact-img"
              :src="donation.itemImage"
              alt=""
            />

            <div class="card-body">

              <!-- Title and Location in a single line -->
              <div class="d-flex justify-content-between align-items-center">
                <!-- Display itemsDonated and petType on the left -->
                <h5 class="card-title mb-0">{{ donation.itemsDonated }} | {{ donation.petType || 'N/A' }}</h5>

                <!-- Location display on the right with icon -->
                <div class="location-container" v-if="donation.location">
                  <img src="../assets/location.png" alt="Location Icon" class="location-icon" />
                  <span class="card-location">{{ donation.location }}</span>
                </div>
              </div>
              <p class="card-text condition-text">
                {{ donation.condition || 'Unknown' }}
              </p>
              <p class="card-text">
                {{ donation.itemCategory || 'N/A' }}
              </p>

              <!-- Add 'Posted on' date and button alignment -->
              <div class="d-flex justify-content-between align-items-center">
                <span class="posted-on">Posted {{ donation.postedOn }}</span>
                <a
                  href="#"
                  class="btn btn-outline-primary btn-sm"
                  @click.prevent="openRequestModal(donation)"
                >
                  Request Item
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Pagination Controls -->
    <div class="pagination-container">
      <button
        :disabled="currentPage === 1"
        @click="currentPage--"
        class="btn btn-outline-primary"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="currentPage++"
        class="btn btn-outline-primary"
      >
        Next
      </button>
    </div>

    <!-- Modal for Requesting Item -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h5>Tell the giver why your pet needs this item..</h5>
        <textarea
          v-model="requestMessage"
          placeholder="Hi, I would like to get this item because..."
          rows="4"
        ></textarea>
        <div class="modal-buttons">
          <button @click="sendRequest" class="btn btn-outline-primary">
            Send Request
          </button>
          <button @click="closeRequestModal" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      donations: [],
      selectedFilters: {
        conditions: [],
        itemCategories: [],
        petTypes: [],
      },
      currentPage: 1,
      itemsPerPage: 12,
      showModal: false,
      selectedDonation: null,
      requestMessage: '',
      filteredDonationsList: [], // Store filtered results here
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.sortedAndFilteredDonations.length / this.itemsPerPage);
    },
    sortedAndFilteredDonations() {
      // Sort donations based on the selectedSortOrder before pagination
      return [...this.filteredDonationsList].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        if (this.selectedFilters.sortOrder === 'mostRecent') {
          return dateB - dateA; // Sort descending for most recent
        } else if (this.selectedFilters.sortOrder === 'leastRecent') {
          return dateA - dateB; // Sort ascending for least recent
        }
        return 0;
      });
    },
    paginatedDonations() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedAndFilteredDonations.slice(start, end);
    },
    formattedDonations() {
      // Format dates for paginated donations
      return this.paginatedDonations.map((donation) => {
        const date = new Date(donation.createdAt);
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        return {
          ...donation,
          postedOn: formattedDate,
        };
      });
    },
  },
  methods: {
    async fetchDonations() {
      try {
        const response = await fetch('http://localhost:8000/api/marketplace');
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        this.donations = data;
        this.filteredDonationsList = data; // Initialize with all donations
      } catch (error) {
        console.error('Error fetching donations:', error);
      }
    },
    filterDonations(filters) {
      this.selectedFilters = filters;
      this.filteredDonationsList = this.donations.filter((donation) => {
        const matchesCondition =
          filters.conditions.length === 0 ||
          filters.conditions.includes(donation.condition.trim());
        const matchesCategory =
          filters.itemCategories.length === 0 ||
          filters.itemCategories.includes(donation.itemCategory.trim());
        const matchesPetType =
          filters.petTypes.length === 0 ||
          filters.petTypes.includes(donation.petType);
        const matchesLocation =
          filters.locations.length === 0 ||
          filters.locations.includes(donation.location);

        return matchesCondition && matchesCategory && matchesPetType && matchesLocation;
      });

      this.currentPage = 1; // Reset to the first page after filtering
    },
    openRequestModal(donation) {
      this.selectedDonation = donation;
      this.showModal = true;
    },
    closeRequestModal() {
      this.showModal = false;
      this.requestMessage = '';
    },
    async sendRequest() {
      if (!this.requestMessage) {
          alert('Please enter a message.');
          return;
      }

      const requestPayload = {
          donorId: this.selectedDonation.donorId,
          itemImage: this.selectedDonation.itemImage,
          itemsDonated: this.selectedDonation.itemsDonated,
          receiverId: "p8v0JBWhlfNZ13DzpBFN",
          requestMessage: this.requestMessage,
          status: "pending"
      };

      try {
          const response = await fetch('http://localhost:8000/api/requests', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestPayload),
          });

          if (!response.ok) {
              const errorData = await response.json();
              console.error('Server error response:', errorData);
              throw new Error('Error sending request');
          }

          alert('Request sent successfully!');
          this.closeRequestModal();
      } catch (error) {
          console.error('Error sending request:', error);
          alert('There was an error sending your request.');
      }
    },
  },

  async created() {
    await this.fetchDonations();
  },
};
</script>

<style scoped>
.donation-list {
  font-family: 'Montserrat', sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 100%; /* Ensures the container takes full height */
}

/* Cards Container without Scrolling */
.cards-container {
  padding: 20px;
  background-color: #F8F9FB;
  border-radius: 20px;
}

/* Align cards to the left */
.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.col-sm-6,
.col-lg-4 {
  display: flex;
  justify-content: flex-start;
}

/* Adjusted Compact Card Styling for Wider Card */
.compact-card {
  width: 100%;
  max-width: 22rem;
  margin: 10px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  padding: 8px;
}

.compact-card:hover {
  transform: scale(1.02);
}

/* Profile Image Styling */
.donor-profile-img {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Adjusted Compact Image */
.compact-img {
  height: 220px;
  width: 100%;
  object-fit: cover;
  background-color: #fff;
}

/* Card Text Styling */
.card-title {
  font-size: 0.9rem;
  margin-bottom: 4px;
  text-align: left;
}

.card-header {
  background-color: transparent;
  border: none;
  box-shadow: none;
  padding: 5px;
  text-align: left;
  display: flex;
  align-items: center;
}

/* Location Container with icon */
.location-container {
  display: flex;
  align-items: center;
  font-size: 0.75rem; /* Match font size */
  color: #555;
}

.location-icon {
  width: 14px;
  height: 14px;
  margin-right: 5px; /* Spacing between icon and text */
}

.card-location {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  color: brown;
  text-align: left;
}

.card-subtitle {
  font-size: 0.75rem;
  text-align: left;
}

.card-text {
  font-size: 0.75rem;
  margin-bottom: 2px;
  text-align: left;
}

/* Condition Text Styling */
.condition-text {
  color: #8b4513;
  font-weight: normal;
}


/* Button Customization */
.btn-outline-primary {
  color: #8b4513;
  border-color: #8b4513;
  font-size: 0.75rem;
  padding: 3px 6px;
  border-radius: 50px;

}

.btn-outline-primary:hover {
  background-color: #8b4513;
  color: #fff;
}

/* Pagination Styling */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Content */
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.modal-content h5 {
  margin-bottom: 15px;
}

.modal-content textarea {
  width: 100%;
  margin-bottom: 15px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.posted-on {
  font-size: 0.75rem;
  color: #555;
}
</style>