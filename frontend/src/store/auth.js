// src/store/auth.js
import { reactive } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../main'; // Import Firebase auth from your main file

// Define a reactive global state for authentication
export const authState = reactive({
  isUserLoggedIn: false,
  userProfilePicUrl: null,
});

// Set up a listener to update authState when the user's auth status changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    authState.isUserLoggedIn = true;
    authState.userProfilePicUrl = user.photoURL || null; // Use Firebase photoURL if available
  } else {
    authState.isUserLoggedIn = false;
    authState.userProfilePicUrl = null;
  }
});
