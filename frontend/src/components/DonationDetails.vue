DonationDetails.vue

<template>
    <div v-if="donation" class="donation-details">
      <h1>{{ donation.itemsDonated }}</h1>
      <img :src="donation.itemImage" alt="Item Image" class="donation-img" />
      <p>Donated by: {{ donation.donorName || 'Anonymous' }}</p>
      <p>Condition: {{ donation.condition || 'Unknown' }}</p>
      <p>Category: {{ donation.itemCategory || 'N/A' }}</p>
      <p>Pet Type: {{ donation.petType || 'N/A' }}</p>
      <p>Posted on: {{ formattedDate }}</p>
    </div>
    <div v-else>
      <p>Loading donation details...</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        donation: null,
      };
    },
    computed: {
      formattedDate() {
        if (this.donation && this.donation.createdAt) {
          const date = new Date(this.donation.createdAt);
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
        }
        return '';
      },
    },
    async created() {
      try {
        const response = await fetch(`${this.$api_url}/marketplace/${this.id}`);
        if (!response.ok) {
          throw new Error('Donation not found');
        }
        this.donation = await response.json();
      } catch (error) {
        console.error('Error fetching donation:', error);
        this.$router.push('/'); // Redirect to the main list if donation is not found
      }
    },
  };
  </script>
  
  <style scoped>
  .donation-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .donation-img {
    max-width: 100%;
    height: auto;
    margin-bottom: 20px;
  }
  
  /* Add styling as per your needs */
  </style>
  