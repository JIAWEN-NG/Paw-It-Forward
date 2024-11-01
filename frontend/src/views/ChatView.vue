<template>
  <div class="container-fluid chat-view">
    <div class="row h-100 gx-0">
      <!-- ChatList - Left Pane -->
      <div class="col-12 col-md-6 col-lg-3 p-0 border-end chat-list-wrapper" v-show="showChatList || isLargeScreen">
        <ChatList :currentUserId="currentUserId" @chatSelected="setSelectedChat" />
      </div>

      <!-- ChatRoom - Right Pane -->
      <div
        class="col-12 col-md-6 col-lg-9 p-0 chat-room-wrapper"
        v-show="selectedChat || isLargeScreen"
      >
        <ChatRoom v-if="selectedChat" :currentUserId="currentUserId" :selectedChat="selectedChat"
          @backToChatList="handleBackToChatList" />

        <div v-else class="empty-space d-flex align-items-center justify-content-center">
          <div class="h-full flex flex-col justify-center items-center">
            <div class="w-10 h-10 mr-4 mb-4 flex justify-center items-center rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </div>
            <p class="heading-2 text-color mb-2">No chat selected</p>
            <p class="body-2 text-color flex">
              Select a chat from the chat list.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import ChatList from '../components/ChatList.vue';
import ChatRoom from '../components/ChatRoom.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  components: {
    ChatList,
    ChatRoom,
  },
  data() {
    return {
      currentUserId: 'qiDkbANAR9U1Lr2m9tqUTdU9Lgl2',
      selectedChat: null,
      showChatList: true,
      isLargeScreen: window.innerWidth > 768, // Match large breakpoint
      loading: true,
    };
  },
  methods: {
    setSelectedChat(chat) {
      this.selectedChat = chat;
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

    fetchCurrentUser() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUserId = user.uid;
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
    console.log("Initial values - showChatList:", this.showChatList, "isLargeScreen:", this.isLargeScreen);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
};
</script>

<style scoped>
.chat-view {
  height: 100vh;
  overflow: hidden;
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
}

/* Hide scrollbar for WebKit browsers */
.chat-list-wrapper::-webkit-scrollbar,
.chat-room-wrapper::-webkit-scrollbar {
  display: none;
}

/* Media Queries for Responsiveness */
@media (max-width: 480px) {

  /* Small devices: Full width */
  .chat-list-wrapper,
  .chat-room-wrapper {
    width: 100%;
  }
}

@media (min-width: 481px) and (max-width: 768px) {

  /* Medium devices: 50/50 split */
  .chat-list-wrapper {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .chat-room-wrapper {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 769px) {

  /* Large devices: 30/70 split */
  .chat-list-wrapper {
    flex: 0 0 30%;
    max-width: 30%;
  }

  .chat-room-wrapper {
    flex: 0 0 70%;
    max-width: 70%;
  }
}
</style>
