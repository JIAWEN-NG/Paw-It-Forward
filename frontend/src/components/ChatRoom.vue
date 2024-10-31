<template>
  <div class="chat-room">
    <!-- Chat Header (Fixed to the top) -->
    <div class="chat-header">
      <img :src="selectedChat?.receiverProfileImage || 'https://via.placeholder.com/50'" alt="User Image"
        class="profile-image" />
      <div class="user-details">
        <h5>{{ selectedChat?.receiverName || 'Unknown User' }}</h5>
        <p>Last seen 2 hours ago</p>
      </div>
    </div>

    <!-- Item Info Section -->
    <div class="item-info">
      <img :src="selectedChat?.requestedItem?.image || 'https://via.placeholder.com/50'" alt="Item Image"
        class="item-image" />
      <div class="item-details">
        <h5>{{ selectedChat?.requestedItem?.title || 'Untitled Item' }}</h5>
        <span v-if="selectedChat?.status === 'pending'">Offered: {{ selectedChat?.requestMessage }}</span>
        <span v-else
          :class="{ 'accepted': selectedChat?.requestedItem?.status === 'accepted', 'rejected': selectedChat?.requestedItem?.status === 'rejected' }">
          {{ selectedChat?.requestedItem?.status.charAt(0).toUpperCase() + selectedChat?.requestedItem?.status.slice(1)
          }}
        </span>
      </div>
      <div v-if="selectedChat?.requestId && selectedChat?.requestedItem?.status === 'pending'" class="button-group">
        <button @click="acceptRequest" class="accept-button">Accept</button>
        <button @click="rejectRequest" class="reject-button">Reject</button>
      </div>
    </div>

    <!-- Messages Section -->
    <div class="messages">
      <template v-for="(message, index) in messages" :key="message.id">
        <!-- Display date divider -->
        <div v-if="shouldShowDateDivider(message.timestamp, index)" class="timeline-divider">
          {{ formatDateDivider(message.timestamp) }}
        </div>

        <!-- Message Block -->
        <div
          :class="['message', message.senderId === currentUserId ? 'sent' : 'received']">
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
import { io } from 'socket.io-client';

export default {
  props: ['currentUserId', 'selectedChat'],
  data() {
    return {
      messages: [],
      newMessage: '',
      socket: null, // Initialize socket as null
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        message: null,
      },
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
      } catch (error) {
        console.error('Error accepting request:', error);
      }
    },
    async rejectRequest() {
      try {
        await axios.put(`http://localhost:8000/api/requests/${this.selectedChat.requestId}/decline`);
        alert('Request rejected');
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

.chat-header {
  border-color: #999;
}

.item-info,
.message-input-container {
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  align-items: center;
}


.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
}

.item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 0.75rem;

}

.user-details,
.item-details {
  flex-grow: 1;
  overflow: hidden;
}

.item-info {
  top: 64px;
  padding-left: 1rem;
  padding-right: 1rem;
  width: 100%;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 4rem;
  margin-top: 30px;
  background-color: #ffffff;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  /* Add this to ensure messages align properly */
}

.message {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.message.received {
  align-self: flex-start;
  background-color: #ffffff;
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
  /* Push the sent message content to the right */
  border-radius: 8px;
}

.message-content {
  background-color: #ffffff;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  max-width: 60%;
  display: flex;
  flex-direction: column;
}

.message-content p {
  margin: 0;
  font-size: 0.875rem;
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


.options-button,
.accept-button,
.reject-button {
  border: none;
  background: none;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.accept-button {
  background-color: #28a745;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
}

.reject-button {
  background-color: #dc3545;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
}

.send-button {
  background-color: #007bff;
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 50%;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: transform 0.2s;
}

.send-button:hover {
  transform: scale(1.1);
  background-color: #0056b3;
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