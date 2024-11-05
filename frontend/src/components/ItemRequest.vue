<template>
  <div>
    <button @click="requestItem">Request Item</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    async requestItem() {
      try {
        // Hardcoded data
        const donorId = "qiDkbANAR9U1Lr2m9tqUTdU9Lgl2";
        const receiverId = "p8v0JBWhlfNZ13DzpBFN";
        const itemId = "Gs17131mK1QDbpM6Nkbz";
        const requestMessage = "I would like to request this item. My Cat really likes Green and he needs a new bed";
        const itemImage = 'https://firebasestorage.googleapis.com/v0/b/purrfessorpaws-40ca2.appspot.com/o/fundraising%2Fcatbed.png?alt=media&token=c048e694-5f91-4179-ad33-f8bc62d2e908';
        const itemsDonated = "Cat Bed (Test)";

        // Send request to the backend
        const response = await axios.post('http://localhost:8000/api/requests/sendRequest', {
          donorId,
          receiverId,
          itemId,
          requestMessage,
          itemImage,
          itemsDonated,
          
        });

        const { chatId } = response.data;
        console.log('Chat created with ID:', chatId);

      } catch (error) {
        console.error('Error requesting item:', error);
      }
    },
  },
};
</script>
