<template>
  <div class="chat-room">
    <!-- Chat Header -->
    <div class="chat-header d-flex align-items-center">
      <!-- Back arrow for small devices only -->
      <div class="col-auto d-flex align-items-center d-md-none back-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-6 " @click="goBackToChatList" style="cursor: pointer;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </div>
      <!-- Username, centered -->
      <div class="flex-grow-1 d-flex justify-content-center text-truncate">
        <h5 class="mb-0">{{ selectedChat?.receiverName || 'Unknown User' }}</h5>
      </div>
      <!-- Profile image, aligned right -->
      <div class="col-auto d-flex align-items-center">
        <div class="profile-image-container">
          <img :src="selectedChat?.receiverProfileImage || 'https://via.placeholder.com/50'" alt="User Image"
            class="profile-image" />
        </div>
      </div>
    </div>

    <!-- Item Info Section with Accept and Decline buttons -->
    <div class="item-info d-flex align-items-center flex-wrap">
      <!-- Item Image -->
      <div class="col-auto d-flex align-items-center p-2">
        <img :src="selectedChat?.requestedItem?.image || 'https://via.placeholder.com/50'" alt="Item Image"
          class="item-image" />
      </div>

      <!-- Title and Status Container -->
      <div class="col d-flex flex-column flex-md-row align-items-md-center justify-content-between">
        <h5 class="mb-1 mb-md-0 text-truncate item-title">{{ selectedChat?.requestedItem?.title || 'Untitled Item' }}
        </h5>

        <!-- Status Tag -->
        <div class="status-container mt-1 mt-md-0">
          <template v-if="isCurrentUserDonor && selectedChat?.requestedItem?.status === 'pending'">
            <button @click="setModalAction('accept')" class="btn accept-button me-2" data-bs-toggle="modal"
              data-bs-target="#confirmModal">Accept</button>
            <button @click="setModalAction('decline')" class="btn reject-button" data-bs-toggle="modal"
              data-bs-target="#confirmModal">Decline</button>
          </template>
          <template v-else>
            <span :class="[
              'status-label',
              selectedChat?.requestedItem?.status === 'accepted' ? 'accepted' :
                selectedChat?.requestedItem?.status === 'declined' ? 'declined' : ''
            ]">
              {{ selectedChat?.requestedItem?.status === 'accepted' ? 'Accepted' : selectedChat?.requestedItem?.status
                === 'declined' ? 'Declined' : 'Pending' }}
            </span>
          </template>
        </div>
      </div>

    </div>
    <!-- Bootstrap Modal for Accept/Decline Confirmation -->
    <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered custom-modal-dialog">
        <div class="modal-content custom-modal-content">

          <!-- Illustration Section -->
          <div class="illustration-section">
            <img :src="selectedChat?.requestedItem?.image || 'https://via.placeholder.com/300x200'" alt="Item Image"
              class="modal-image" />
            <button type="button" class="btn-close close-button" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <!-- Title Section -->
          <div class="text-section text-start px-4 pt-3">
            <h5 class="modal-title">{{ selectedChat?.requestedItem?.title || 'Cat Litter' }}</h5>
            <p class="modal-text">Are you sure you want to <b>{{ modalAction }}</b> this request?</p>
          </div>

          <!-- Buttons Section -->
          <div class="modal-footer modal-buttons d-flex justify-content-between">
            <button type="button" @click="confirmAction" class="confirm-button">Confirm</button>
            <button type="button" data-bs-dismiss="modal" class="cancel-button">Cancel</button>
          </div>
        </div>
      </div>
    </div>


    <!-- Messages Section -->
    <div class="messages">
      <template v-for="(message, index) in messages" :key="message.id">
        <!-- Date divider -->
        <div v-if="shouldShowDateDivider(message.timestamp, index)" class="timeline-divider">
          {{ formatDateDivider(message.timestamp) }}
        </div>

        <!-- Message Block -->
        <div :class="['message', message.senderId === currentUserId ? 'sent' : 'received']">
          <!-- Avatar for received messages -->
          <img v-if="message.senderId !== currentUserId"
            :src="selectedChat?.receiverProfileImage || 'https://via.placeholder.com/50'" alt="User Image"
            class="avatar me-2" />

          <!-- Message Content -->
          <div class="message-content">
            <p>{{ message.message }}</p>
          </div>

          <!-- Timestamp -->
          <small class="text-muted mx-2 message-timestamp"
            :class="message.senderId === currentUserId ? 'me-2' : 'ms-2'">
            {{ formatMessageTimestamp(message.timestamp) }}
          </small>
        </div>
      </template>
    </div>

    <!-- Message Input Section -->
    <div class="message-input-container d-flex align-items-center">
      <input v-model="newMessage" class="text-input" placeholder="Write your message here..."
        @keyup.enter="sendMessage" />
      <button @click="sendMessage" class="send-button">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
      </button>
    </div>
  </div>
</template>





<script>
// import axios from 'axios';
// import { io } from 'socket.io-client';
import { getFirestore, collection, doc, query, getDoc, orderBy, onSnapshot, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';


export default {
  props: ['currentUserId', 'selectedChat'],
  data() {
    return {
      messages: [],
      newMessage: '',
      // socket: null, // Initialize socket as null
      systemMessage: '',
      lastMessageTimestamp: '', // For displaying system messages
      modalAction: '',
      systemMessageTimestamp: '',
    };
  },

  mounted() {
    if (this.selectedChat && this.selectedChat.chatId) {
      this.listenToMessages();
    }
  },

  beforeUnmount() {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
    }
  },
  computed: {
    isCurrentUserDonor() {
      return this.currentUserId === this.selectedChat.participants[0];
    },
    otherUserId() {
      return this.selectedChat?.participants?.find((id) => id !== this.currentUserId) || null;
    },
  },
  methods: {
    goBackToChatList() {

      this.$emit('backToChatList'); // Emit an event to notify the parent component
    },

    listenToMessages() {
      const db = getFirestore();
      const messagesRef = collection(db, 'Chats', this.selectedChat.chatId, 'messages');
      const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

      // Set up a Firestore real-time listener
      this.unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
        this.messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    },

    // Send a message to Firestore
    async sendMessage() {
      if (this.newMessage.trim() === '') return;

      const receiverId = this.otherUserId;
      if (!receiverId) {
        console.error('Error: receiverId is undefined. Check that selectedChat.otherUserId is set correctly.');
        return;
      }

      try {
        const db = getFirestore();
        const messagesRef = collection(db, 'Chats', this.selectedChat.chatId, 'messages');

        const messageData = {
          senderId: this.currentUserId,
          receiverId: receiverId,
          message: this.newMessage,
          requestId: this.selectedChat.requestId,
          timestamp: serverTimestamp(),
        };

        // Add the new message to the messages collection
        const messageDoc = await addDoc(messagesRef, messageData);

        // Fetch the actual timestamp after Firestore has set it
        const messageSnapshot = await getDoc(messageDoc);
        const actualTimestamp = messageSnapshot.data().timestamp;

        // After adding the message, update the lastMessage and lastMessageTimestamp in the Chats document
        const chatRef = doc(db, 'Chats', this.selectedChat.chatId);
        await updateDoc(chatRef, {
          lastMessage: messageData.message,
          lastMessageTimestamp: actualTimestamp,
        });
        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },


    async fetchChatDetails() {


      try {
        const response = await this.$axios.get(`/chats/${this.selectedChat.chatId}`); // Ensure 'chatId' is consistent
        const chatData = response.data;

        // Update selectedChat details from the response
        this.systemMessage = chatData.systemMessage || '';
        this.selectedChat.lastMessage = chatData.lastMessage || '';
        this.selectedChat.lastMessageTimestamp = chatData.lastMessageTimestamp || '';
        this.selectedChat.requestedItem = chatData.requestedItem || {};
        this.selectedChat.requestId = chatData.requestId || '';

        console.log('Chat details:', chatData);
      } catch (error) {
        console.error('Error fetching chat details:', error);
      }
    },


    setModalAction(action) {
      this.modalAction = action; // Set the action type
    },
    async confirmAction() {
      // Confirm action based on modalAction value
      if (this.modalAction === 'accept') {
        await this.acceptRequest();
        this.selectedChat.requestedItem.status = 'accepted';

      } else if (this.modalAction === 'decline') {
        await this.declineRequest();
        this.selectedChat.requestedItem.status = 'declined';

      }
      await this.fetchChatDetails(); // Refresh chat details after action
      const dismissButton = document.querySelector('#confirmModal .btn-close');
      dismissButton.click(); // Simulate a click on the close button
    },
    async acceptRequest() {
      try {
        await this.$axios.put(`/requests/${this.selectedChat.requestId}/accept`);
        await this.fetchMessages(); // Refresh messages after accepting
      } catch (error) {
        console.error('Error accepting request:', error);
      }
    },
    async declineRequest() {
      try {
        await this.$axios.put(`/requests/${this.selectedChat.requestId}/decline`);
        await this.fetchMessages(); // Refresh messages after declining
      } catch (error) {
        console.error('Error declining request:', error);
      }
    },

    // Check if date divider should be displayed
    shouldShowDateDivider(timestamp, index) {
      const messageDate = new Date(timestamp).toDateString();
      const previousMessage = this.messages[index - 1];
      const previousDate = previousMessage ? new Date(previousMessage.timestamp).toDateString() : null;
      return previousDate !== messageDate;
    },
    formatDateDivider(timestamp) {
      if (!timestamp || typeof timestamp.toDate !== 'function') {
        return ''; // Return an empty string if the timestamp is null or invalid
      }
      const messageDate = timestamp.toDate();
      const today = new Date();
      if (messageDate.toDateString() === today.toDateString()) {
        return 'Today';
      }
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    },

    formatMessageTimestamp(timestamp) {
      if (!timestamp || typeof timestamp.toDate !== 'function') {
        return 'Invalid Date'; // Placeholder if timestamp is null or invalid
      }
      const options = { hour: '2-digit', minute: '2-digit', hour12: true };
      return timestamp.toDate().toLocaleTimeString([], options);
    }


  },
  watch: {
    selectedChat: {
      immediate: true,
      handler(newChat) {
        if (newChat && newChat.chatId) {
          this.messages = [];
          this.listenToMessages();
        } else {
          console.error('Selected chat is invalid or missing chatId');
        }
      },
    },

  },


};
</script>


<style scoped>
@import '../styles/chatroom.css';
</style>