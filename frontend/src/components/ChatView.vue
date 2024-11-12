<template>
  <div v-if="!loading && currentUserId" class="container-fluid chat-view">
    <div class="row h-100 gx-0">
      <!-- ChatList - Left Pane -->
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3 p-0 border-end chat-list-wrapper" v-show="showChatList">
        <ChatList :currentUserId="currentUserId" @selectedChat="setSelectedChat" />
      </div>

      <!-- ChatRoom - Right Pane -->
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-9 p-0 chat-room-wrapper" v-show="selectedChat || isLargeScreen">
        <ChatRoom v-if="selectedChat" :currentUserId="currentUserId" :selectedChat="selectedChat"
          @backToChatList="handleBackToChatList" />
        <div v-else class="empty-space d-flex align-items-center justify-content-center position-relative">
          <img src="https://media.giphy.com/media/PcEHGN6WvTO2ekGICI/giphy.gif" alt="No chat selected animation"
            class="background-gif w-100 h-100 position-absolute" />

          <!-- Speech bubble for the text -->
          <div class="speech-bubble">
            <p class="bubble-text">"No chat selected meow~~</p>
            <p class="bubble-text">Paws select a chat from the chat list."</p>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import ChatList from './ChatList.vue';
import ChatRoom from './ChatRoom.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  components: {
    ChatList,
    ChatRoom,
  },
  data() {
    return {
      currentUserId: null,
      selectedChat: null,
      showChatList: true,
      loading: true,
    };
  },
  methods: {
    setSelectedChat(chat) {
      this.selectedChat = chat;
      console.log('Set selected chat:', this.selectedChat)
      if (innerWidth < 576) {
        this.showChatList = false; // Hide chat list on smaller screens
      }
    },
    handleBackToChatList() {
      this.showChatList = true;
      this.selectedChat = null; // Deselect the chat to return to chat list
    },
    toggleChatList() {
      this.showChatList = !this.showChatList;
    },
    checkScreenSize() {
      this.isLargeScreen = window.innerWidth > 768;
      console.log("Updated isLargeScreen:", this.isLargeScreen);
      if (this.isLargeScreen) {
        this.showChatList = true;
      }
    },

    /**
     * Fetches the currently authenticated user and updates the component's state.
     * If a user is authenticated, their UID is stored in `currentUserId` and the loading state is set to false.
     * If no user is authenticated, `currentUserId` is set to null and the user is redirected to the login page.
     */
    fetchCurrentUser() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUserId = user.uid;
          console.log("Current User ID:", this.currentUserId);
          this.loading = false;
        } else {
          this.currentUserId = null;
          this.$router.push({ name: 'Login' });
        }
      });
    },
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
    this.fetchCurrentUser();

  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
};
</script>

<style scoped>
.chat-view {
  height: 85vh;
  overflow: hidden;
  background-color: #f8f9fb;
}
.chat-view::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}

.chat-list-wrapper {
  height: 100%;
  overflow-y: auto;
  background-color: #f8f9fa;
}

.chat-room-wrapper {
  height: 100%;
  overflow-y: auto;
}

.empty-space {
  font-size: 1rem;
  color: #888;
  text-align: center;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.background-gif {
  object-fit: cover;
  top: 0;
  left: 0;
  width: 100%; /* Ensures GIF fills container width */
  height: 100%;
}

.speech-bubble {
  position: absolute;
  top: 30%;
  left: 70%; /* Default position for larger screens */
  background-color: #fcf8f2;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 250px;
  opacity: 0; /* Initially hidden */
  transform: translateY(10px); /* Initial position for slight movement effect */
  animation: fadeIn 0.5s ease-out forwards;
  animation-delay: 3s; /* Delay for 3 seconds */
  z-index: 1;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Adds a subtle shadow */
}

.speech-bubble::after {
  content: "";
  position: absolute;
  top: 50%;
  left: -10px;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right-color: #fcf8f2;
  border-left: 0;
  border-bottom: 0;
  margin-top: -5px;
}

.bubble-text {
  color: #333;
  font-weight: bold;
  font-size: 1rem;
  margin: 0;
  text-align: left;
}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
  .speech-bubble {
    top: 5%; /* Position bubble higher on smaller screens */
    left: 10%; /* Center it more on smaller screens */
    max-width: 200px; /* Reduce width on smaller screens */
    padding: 8px 12px;
  }

  .bubble-text {
    font-size: 0.9rem; /* Smaller font for smaller screens */
  }
}

/* Hide scrollbar for WebKit browsers */
.chat-list-wrapper::-webkit-scrollbar,
.chat-room-wrapper::-webkit-scrollbar {
  display: none;
}

/* Keyframes for bubble fade-in */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
