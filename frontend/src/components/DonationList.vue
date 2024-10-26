<!-- DonationList.vue -->
<template>
  <div class="donation-list">
    <div class="row gx-2">
      <div
        v-for="donation in formattedDonations"
        :key="donation.id"
        class="col-sm-6 col-lg-4 mb-2"
      >
        <div class="card compact-card">
          <div class="card-header d-flex align-items-center">
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

          <img
            id="card_img"
            class="card-img-top compact-img"
            :src="donation.itemImage"
            alt=""
          />

          <div class="card-body">
            <h5 class="card-title">{{ donation.itemsDonated }}</h5>
            <p class="card-text condition-text">
              {{ donation.condition || 'Unknown' }}
            </p>
            <p class="card-text">
              {{ donation.itemCategory || 'N/A' }}
            </p>
            <p class="card-text">
              {{ donation.petType || 'N/A' }} 
              <span v-if="donation.breed">| {{ donation.breed }}</span>
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

    <!-- Pagination Controls -->
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
        breeds: [],
      },
      currentPage: 1,
      itemsPerPage: 9,
      showModal: false,
      selectedDonation: null,
      requestMessage: '',
      filteredDonationsList: [], // Store filtered results here
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredDonationsList.length / this.itemsPerPage);
    },
    paginatedDonations() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredDonationsList.slice(start, end);
    },
    formattedDonations() {
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
        const matchesBreed =
          filters.breeds.length === 0 ||
          (donation.breed && filters.breeds.includes(donation.breed.trim()));

        return matchesCondition && matchesCategory && matchesPetType && matchesBreed;
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
  margin-top: 20px;
  font-family: 'Montserrat', sans-serif;
}

/* Align cards to the left */
.row {
  display: flex;
  flex-wrap: wrap; /* Allow cards to wrap to the next line */
  justify-content: flex-start; /* Align items to the left */
}

.col-sm-6,
.col-lg-4 {
  display: flex;
  justify-content: flex-start; /* Align individual cards to the left */
}

/* Adjusted Compact Card Styling for Wider Card */
.compact-card {
  width: 100%;
  max-width: 22rem; /* Increase card width */
  margin: 10px; /* Adjust margin for consistent spacing */
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
  height: 220px; /* Increase image height */
  width: 100%; /* Ensure it takes the full width of the card */
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

/* Button Container */
.button-container {
  display: flex;
  justify-content: flex-end;
}

/* Button Customization */
.btn-outline-primary {
  color: #8b4513;
  border-color: #8b4513;
  font-size: 0.75rem;
  padding: 3px 6px;
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
  margin-top: 20px;
}

.pagination-container button {
  padding: 5px 10px;
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
