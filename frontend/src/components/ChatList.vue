<template>
    <div class="chat-list-container d-flex flex-column h-100">
        <!-- Inbox Header (Fixed in the left pane) -->
        <div class="inbox-header p-3 text-muted fw-bold border-bottom">
            <div class="d-flex align-items-center justify-content-between">
                <p class="m-0">Chats</p>
            </div>
        </div>
        <!-- Search Bar -->
        <div class="search-bar px-2 py-3">
            <div class="search-input-wrapper position-relative">
                <input type="text" v-model="searchQuery" class="form-control search-input" placeholder="Search.."
                    aria-label="Search" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="search-icon">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>
        </div>

        <div ref="chatListContainer" v-if="!isLoadingChats" class="chat-items-wrapper flex-grow-1 overflow-auto">
            <!-- No Chats Available Message -->
            <div v-if="chats.length === 0" class="no-chats-message text-muted p-4 text-center">
                <p>You do not have any active chats.</p>
            </div>
            <!-- Chat Items (Scrollable) with Inline Filtering -->
            <div v-else class="chat-items px-2">
                <div v-for="chat in filteredChats" :key="chat.chatId"
                    class="chat-item d-flex align-items-center p-3 mb-2 rounded cursor-pointer"
                    @click="handleSelectedChat(chat)">
                    <!-- Profile Image -->
                    <img :src="chat.receiverProfileImage || 'default-avatar.png'" alt="avatar"
                        class="avatar me-3 rounded-circle" />

                    <!-- Chat Details -->
                    <div class="chat-details-wrapper flex-grow-1 d-flex align-items-center justify-content-between">
                        <div class="chat-details">
                            <!-- Username and Date Row -->
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <p class="chat-username fw-bold m-0">{{ chat.receiverName }}</p>
                                <small class="chat-date text-muted">{{ formatDate(chat.lastMessageTimestamp) }}</small>
                            </div>
                            <!-- Message Preview and Item Image Row -->
                            <div class="d-flex align-items-center">
                                <small class="text-muted text-preview flex-grow-1">{{ truncatedMessage(chat.lastMessage)
                                    }}</small>
                                <div class="item-image-wrapper">
                                    <img :src="chat.requestedItem?.image || 'placeholder-image.png'" alt="itemImage"
                                        class="item-image" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Loading Spinner -->
        <div v-else class="loading-container d-flex align-items-center justify-content-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="loading-text ms-2">Loading Chats...</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { io } from 'socket.io-client';

export default {
    props: ['currentUserId', 'selectedChat'], // Keep selectedChat as a prop
    data() {
        return {
            chats: [],
            searchQuery: '',
            isLoadingChats: true,
            socket: null,
            updateKey: 0,
        };
    },
    computed: {
        filteredChats() {
        let chatsToDisplay = this.chats;
        // Filter chats based on search query
        if (this.searchQuery) {
            chatsToDisplay = chatsToDisplay.filter((chat) =>
                chat.receiverName && chat.receiverName.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
        // Sort chats based on lastMessageTimestamp, descending order
        return chatsToDisplay.sort((a, b) => {
            // Convert timestamps to Date objects for comparison
            const timeA = new Date(a.lastMessageTimestamp).getTime();
            const timeB = new Date(b.lastMessageTimestamp).getTime();
            return timeB - timeA; // Sort in descending order
        });
    },
    },
    watch: {
    selectedChat: {
        immediate: true,
        handler(newChat) {
            if (newChat && newChat.chatId) { // Ensure chatId is defined
                this.fetchMessages(newChat.chatId); // Fetch messages using the valid chatId
            } else {
                console.error('Selected chat is invalid or has no chatId');
            }
        },
    },
},

    methods: {
        updateChatInList(chat) {
            const chatIndex = this.chats.findIndex(c => c.chatId === chat.chatId);
            if (chatIndex !== -1) {
                this.$set(this.chats, chatIndex, chat); // Ensure reactivity
            }
        },
        async fetchInitialChats() {
            try {
                const response = await axios.get(`http://localhost:8000/api/chats/user/${this.currentUserId}`);
                const chatsData = response.data;

                const updatedChats = await Promise.all(
                    chatsData.map(async (chat) => {
                        const otherUserId = chat.participants.find((participant) => participant !== this.currentUserId);
                        chat.otherUserId = otherUserId;

                        const userResponse = await axios.get(`http://localhost:8000/api/users/${otherUserId}`);
                        const userData = userResponse.data;
                        chat.receiverName = userData.name;
                        chat.receiverProfileImage = userData.profileImage;

                        return chat;
                    })
                );

                this.chats = updatedChats;
                this.isLoadingChats = false;

                this.setupSocketListeners();
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        },
        setupSocketListeners() {
            this.socket = io('http://localhost:8000');
            this.socket.on('newChat', async (newChat) => {
                // Check if chat with the same ID already exists
                const existingChatIndex = this.chats.findIndex(chat => chat.chatId === newChat.chatId);
                if (existingChatIndex === -1) {
                    // Add receiver details to the new chat
                    const otherUserId = newChat.participants.find((participant) => participant !== this.currentUserId);
                    if (otherUserId) {
                        try {
                            const userResponse = await axios.get(`http://localhost:8000/api/users/${otherUserId}`);
                            const userData = userResponse.data;
                            newChat.receiverName = userData.name;
                            newChat.receiverProfileImage = userData.profileImage;
                        } catch (error) {
                            console.error('Error fetching user data for new chat:', error);
                        }
                    }
                    // Add the new chat and create a new array reference to force reactivity
                    this.chats.unshift(newChat);

                } else {
                    console.log("Duplicate chat detected, not adding to chats array");
                }
            });

            // Listen for updates on the selected chat
            this.socket.on('updateChat', async (updatedChat) => {
                this.updateChatInList(updatedChat); // Update the chat in the list
            });
        },

        handleSelectedChat(chat) { // Renamed method
            this.$emit('selectedChat', chat);
        },

        formatDate(date) {
            const options = { month: '2-digit', day: '2-digit' };
            return new Date(date).toLocaleDateString('en-GB', options);
        },

        truncatedMessage(message) {
            if (!message) return 'No message available';
            return message.length > 30 ? message.slice(0, 30) + '...' : message;
        },
    },

    async mounted() {
        console.log("ChatList.vue mounted");
        if (this.currentUserId) {
            await this.fetchInitialChats();
        }
    },

    beforeUnmount() {
        console.log("ChatList.vue beforeUnmount");
        if (this.socket) {
            this.socket.disconnect();
        }
    },
};
</script>



<style scoped>
.loading-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #6c757d;
}

.spinner-border {
    width: 2rem;
    height: 2rem;
}

.loading-text {
    font-size: 1.2rem;
    color: #6c757d;
}

.chat-list-container {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    overflow-y: auto;
    background-color: #f9fafb;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

/* Inbox Header */
.inbox-header {
    height: 60px;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    padding: 0.75rem 1rem;
    font-size: 1.5rem;
}

/* Search Bar */
.search-bar {
    padding: 10px 0;
    background-color: #ffffff;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-input {
    width: 100%;
    padding: 10px 15px 10px 40px;
    background-color: #f1f1f1;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 1rem;
    color: #333;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    /* Smooth transition */
}

.search-input:focus {
    outline: none;
    /* Removes the default outline */
    border-color: #007bff;
    /* Changes the border color smoothly */
    box-shadow: 0 0 8px rgba(188, 214, 241, 0.5);
    /* Adds a smooth shadow effect */
}


.search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #888;
}

/* Chat Items Wrapper */
.chat-items-wrapper {
    flex-grow: 1;
    overflow-y: auto;
}

/* Chat Items */
.chat-items {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
}

.chat-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    margin-bottom: 0.5rem;
    width: 100%;
    box-sizing: border-box;
    transition: background-color 0.3s;
}

.chat-item:hover {
    background-color: #e3edf7;
}

/* Avatar */
.avatar {
    width: 48px;
    height: 48px;
    object-fit: cover;
    flex-shrink: 0;
    border-radius: 50%;
    margin-right: 0.75rem;
    /* Consistent spacing between avatar and text */
}

/* Chat Details Wrapper */
.chat-details-wrapper {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
}

/* Chat Details */
.chat-details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Chat Username */
.chat-username {
    font-size: 1.2rem;
    margin: 0;
    color: #111827;
}

/* Text Preview */
.text-preview {
    font-size: 1rem;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-basis: auto;
    text-align: left;
    max-width: calc(100% - 80px);
    /* Adjusts max-width for consistent alignment */
}

/* Chat Date */
.chat-date {
    font-size: 0.85rem;
    color: #6b7280;
    white-space: nowrap;
    margin-left: auto;
    /* Align date to the right */
}

/* Item Image Wrapper */
.item-image-wrapper {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    margin-left: auto;
}

.item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
}

/* Responsive Adjustments */
@media (max-width: 480px) {
    .chat-list-container {
        max-width: 100vw;
    }
}

@media (min-width: 481px) and (max-width: 768px) {
    .chat-list-container {
        max-width: 50vw;
    }
}

@media (min-width: 769px) {
    .chat-list-container {
        max-width: 30vw;
    }
}
</style>