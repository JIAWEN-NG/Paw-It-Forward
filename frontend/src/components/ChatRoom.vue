<template>
  <div class="chat-room">
    <!-- Chat Header Section -->
    <div class="chat-header row align-items-center p-3 border-bottom">
      <!-- Back arrow for small devices only -->
      <div class="col-auto d-flex align-items-center d-md-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-6" @click="goBackToChatList" style="cursor: pointer;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </div>

      <div class="col-auto d-flex align-items-center">
        <img :src="selectedChat?.receiverProfileImage || 'https://via.placeholder.com/50'" alt="User Image"
          class="profile-image" />
      </div>
      <div class="user-details col d-flex align-items-center">
        <div>
          <h5 class="mb-0">{{ selectedChat?.receiverName || 'Unknown User' }}</h5>
        </div>
      </div>
    </div>

    <!-- Item Info Section -->
    <div class="item-info row align-items-center p-3 border-bottom">
      <!-- Item Image -->
      <div class="col-auto d-flex align-items-center">
        <img :src="selectedChat?.requestedItem?.image || 'https://via.placeholder.com/50'" alt="Item Image"
          class="item-image" />
      </div>

      <!-- Item Details -->
      <div class="item-details col d-flex align-items-center">
        <h5 class="mb-0">{{ selectedChat?.requestedItem?.title || 'Untitled Item' }}</h5>
      </div>


      <!-- Display status or action buttons -->
      <div class="col-auto d-flex align-items-center">
        <template v-if="selectedChat?.requestedItem?.status === 'pending'">
          <button @click="acceptRequest" class="btn accept-button me-2">Accept</button>
          <button @click="declineRequest" class="btn reject-button">Decline</button>
        </template>
        <template v-else>
          <span :class="['status-label', selectedChat?.requestedItem?.status]">
            {{ selectedChat?.requestedItem?.status === 'accepted' ? 'Accepted' : 'Declined' }}
          </span>
        </template>
      </div>
    </div>



    <!-- Messages Section -->
    <div class="messages">
      <!-- System Message Section -->
      <div v-if="systemMessage" class="system-message ">
        <div class="'row">
          <div class="col-auto">
            <p>{{ systemMessage }}</p>
          </div>
          <div class="col-auto">
            <small class="text-muted">{{ formatMessageTimestamp(lastMessageTimestamp) }}</small>
          </div>
        </div>
      </div>

      <template v-for="(message, index) in messages" :key="message.id">
        <!-- Display date divider -->
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
          <small class="text-muted mx-2" :class="message.senderId === currentUserId ? 'me-2' : 'ms-2'">
            {{ formatMessageTimestamp(message.timestamp) }}
          </small>
        </div>
      </template>
    </div>

    <!-- Message Input Section -->
    <div class="message-input-container">
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
import axios from 'axios';
import { comma } from 'postcss/lib/list';
import { io } from 'socket.io-client';

export default {
  props: ['currentUserId', 'selectedChat'],
  data() {
    return {
      messages: [],
      newMessage: '',
      socket: null, // Initialize socket as null
      systemMessage: '',
      lastMessageTimestamp: ''  // For displaying system messages
    };
  },
  mounted() {
    console.log("Attempting to connect to WebSocket server");

    // Initialize the socket connection in mounted lifecycle hook
    this.socket = io('http://localhost:8000', { transports: ['websocket'] });

    this.socket.on('connect', () => {
      console.log('Connected to the WebSocket server'); // This should appear after a successful connection
      console.log('Socket connected status:', this.socket.connected); // This should now show true
    });

    // Additional event listeners for troubleshooting
    this.socket.on('error', (error) => {
      console.error('Socket encountered error:', error);
    });
    this.socket.on('disconnect', () => {
      console.log('Disconnected from the WebSocket server');
    });

    this.setupSocketListeners();
    if (this.selectedChat) {
      this.joinChat(this.selectedChat.chatID);
      this.fetchMessages();
      this.fetchChatDetails();
    }
  },
  beforeUnmount() {
    this.cleanupSocketListeners();
    if (this.socket) {
      this.socket.disconnect(); // Disconnect the socket on component unmount
    }
  },
  computed: {
    isCurrentUserDonor() {
      return this.currentUserId === this.selectedChat.donorId;
    },
  },
  methods: {
    goBackToChatList() {
      console.log('Back button clicked'); // Debugging step
      this.$emit('backToChatList'); // Emit an event to notify the parent component
    },
    joinChat(chatId) {
      if (this.socket) {
        this.socket.emit('joinChat', chatId); // Join the chat room if socket is defined
      } else {
        console.error("Socket is not initialized. Cannot join chat.");
      }
    },
    setupSocketListeners() {
      console.log("Setting up socket listeners");
      // Listen for new messages
      this.socket.on('newMessage', this.handleNewMessage);
    },
    cleanupSocketListeners() {
      // Remove the event listener when the component unmounts to prevent duplicates
      this.socket.off('newMessage', this.handleNewMessage);
    },
    handleNewMessage(message) {
      if (message.requestId === this.selectedChat.requestId) {
        this.messages.push(message);
      }
    },
    async fetchChatDetails() {
      try {
        const response = await axios.get(`http://localhost:8000/api/chats/${this.selectedChat.chatID}`);
        const chatData = response.data;

        // Set the retrieved data
        this.systemMessage = chatData.systemMessage || '';
        this.lastMessageTimestamp = chatData.lastMessageTimestamp;
        console.log('Chat details:', chatData);
      } catch (error) {
        console.error('Error fetching chat details:', error);
      }
    },
    async sendMessage() {
      if (this.newMessage.trim() === '') return;

      try {
        const messageData = {
          senderId: this.currentUserId,
          receiverId: this.selectedChat.otherUserId,
          message: this.newMessage,
          requestId: this.selectedChat.requestId,
          requestedItem: this.selectedChat.requestedItem,
          timestamp: new Date().toISOString(),
        };

        // Send the message via Axios to save it in the backend
        await axios.post('http://localhost:8000/api/chats/sendMessage', messageData);

        // Emit the message event to the server via Socket.IO
        this.socket.emit('sendMessage', messageData);


        // Clear the input after sending
        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },


    async fetchMessages() {

      try {
        if (this.selectedChat) {
          const response = await axios.get(`http://localhost:8000/api/chats/${this.selectedChat.chatID}/messages`);
          this.messages = response.data.messages;
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    async acceptRequest() {
      try {
        await axios.put(`http://localhost:8000/api/requests/${this.selectedChat.requestId}/accept`);
        alert('Request accepted');

        // Optionally, refresh messages to include the system message
        this.fetchMessages();
      } catch (error) {
        console.error('Error accepting request:', error);
      }
    },
    async declineRequest() {
      try {
        await axios.put(`http://localhost:8000/api/requests/${this.selectedChat.requestId}/decline`);
        alert('Request rejected');


        // Optionally, refresh messages to include the system message
        this.fetchMessages();
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    },

    // Check if date divider should be displayed
    shouldShowDateDivider(timestamp, index) {
      const messageDate = new Date(timestamp).toDateString();
      const previousMessage = this.messages[index - 1];
      const previousDate = previousMessage ? new Date(previousMessage.timestamp).toDateString() : null;
      return previousDate !== messageDate;
    },

    // Format the date for the divider, showing "Today" for today's date
    formatDateDivider(timestamp) {
      const messageDate = new Date(timestamp);
      const today = new Date();
      if (messageDate.toDateString() === today.toDateString()) {
        return 'Today';
      }
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    },

    // Format the timestamp for individual messages
    formatMessageTimestamp(timestamp) {
      const options = { hour: '2-digit', minute: '2-digit', hour12: true };
      return new Date(timestamp).toLocaleTimeString([], options);
    },

    openContextMenu(message, event) {
      this.contextMenu.visible = true;
      this.contextMenu.x = event.clientX;
      this.contextMenu.y = event.clientY;
      this.contextMenu.message = message;
    },
    replyToMessage(message) {
      // Logic for replying to a specific message
      alert('Replying to: ' + message.message);
      this.contextMenu.visible = false;
    },
  },
  watch: {
    selectedChat: {
      immediate: true,
      handler(newChat) {
        if (newChat) {
          // Wait for the socket to be initialized and connected
          if (this.socket && this.socket.connected) {
            this.joinChat(newChat.chatID);
          } else {
            // Retry joinChat after a slight delay if socket is not ready
            const retryJoinChat = setInterval(() => {
              if (this.socket && this.socket.connected) {
                this.joinChat(newChat.chatID);
                clearInterval(retryJoinChat); // Stop retrying once successful
              }
            }, 100); // Adjust delay as needed
          }
          this.fetchMessages(newChat.chatID);
        }
      },
    },
  },
};
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100%;
  /* overflow: hidden; */
}

.chat-header,
.item-info {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.profile-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.item-image {
  width: 60px;
  height: 60px;
  /* Optional for styling */
  object-fit: cover;
}

.user-details,
.item-details {
  flex-grow: 1;
  overflow: hidden;
  font-size: 1.2rem;
  text-align: left;
}


.messages {
  flex-grow: 1;
  overflow-y: auto;
  background-color: #ffffff;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  /* Add this to ensure messages align properly */

  background-image: url("../assets/chat-bg3.jpeg");
  background-blend-mode: overlay;
  background-color: rgba(221, 218, 218, 0.5); /* Overlay color with opacity */
}

.message {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.message.received {
  align-self: flex-start;
  font-size: 1rem;
}


.message.received .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
}

.message.sent .message-content {
  background-color: #d1f7c4;
  align-self: flex-end;
  /* Additional styling to ensure alignment */
  margin-left: auto;
  border-radius: 10px;


}

.message-content {
  background-color: #ffffff;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  max-width: 60%;
  display: flex;
  flex-direction: column;
  ;
}

.message-content p {
  margin: 0;
  font-size: 1.2rem;
  text-align: left;
}

.message-content small {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;
}

.message-text {
  font-size: 0.875rem;
  color: #333333;
  margin: 0;
}

.message.received .message-content {
  background-color: #e9e9e9;
}

.message-timestamp {
  font-size: 0.75rem;
  color: #999999;
}

.message-input-container {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.text-input {
  flex-grow: 1;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid #dddddd;
  outline: none;
}



.button-group {
  display: flex;
  gap: 0.5rem;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.accept-button {
  position: relative;
  padding: 10px 25px;
  background: transparent;
  border-radius: 10px;
  border: 2px solid #2aaa3f;
  outline: 2px solid #2aaa3f;
  outline-offset: -2px;
  font-size: 1rem;
  color: #2aaa3f;
  font-weight: 500;
  cursor: pointer;
  transition: outline-offset 200ms ease;
}

.accept-button:hover {
  color: #2aaa3f;
  outline-offset: 2px;
}

.accept-button:active {
  transform: scale(0.95);
}

.reject-button {
  position: relative;
  padding: 10px 15px;
  background: transparent;
  border-radius: 10px;
  border: 2px solid #f54500;
  outline: 2px solid #f54500;
  outline-offset: -2px;
  font-size: 1rem;
  color: #f54500;
  font-weight: 500;
  cursor: pointer;
  transition: outline-offset 200ms ease;
}

.reject-button:hover {
  color: #f54500;
  outline-offset: 3px;
}

.reject-button:active {
  transform: scale(0.95);
}

.status-label {
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.status-label.accepted {
  color: green;
  background-color: #e6f4e6;
}

.status-label.declined {
  color: red;
  background-color: #fce8e8;
}

.system-message {
  text-align: center;
  font-size: 1rem;
  text-align: center;
  margin-top: 30px;
  font-weight: bold;
}

.send-button {
  background: #6771dd;
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 50%;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  cursor: pointer;
  z-index: 1;
  position: relative;
  overflow: hidden;
}

/* Scale and bounce effect on click */
.send-button:active {
  animation: bounce 0.4s ease;
}


/* Pulse effect that emanates from the button */
.send-button::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(4, 7, 238, 0.3);
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.5s ease, transform 0.5s ease;
  z-index: -1;
}

/* Show the pulse effect on click */
.send-button:active::before {
  opacity: 1;
  transform: scale(1.3);
}

/* Background inside the button */
.send-button::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: #5a62d4;
  z-index: -1;
}

/* Bounce animation for the button */
@keyframes bounce {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
    /* Slightly larger */
  }

  100% {
    transform: scale(1);
    /* Back to normal size */
  }
}


.timeline-divider {
  text-align: center;
  color: #6b7280;
  font-size: 0.85rem;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.timeline-divider::before,
.timeline-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #d1d5db;
  margin: 0 0.5rem;
}
</style>