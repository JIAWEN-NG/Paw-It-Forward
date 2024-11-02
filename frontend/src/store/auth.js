// src/store/auth.js
import { reactive } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';

// Define a reactive global state for authentication
export const authState = reactive({
  isUserLoggedIn: false,
  userProfilePicUrl: null,
});

// Function to set up the listener
export function setupAuthState(auth) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authState.isUserLoggedIn = true;
      authState.userProfilePicUrl = user.photoURL || null;
    } else {
      authState.isUserLoggedIn = false;
      authState.userProfilePicUrl = null;
    }
  });
}
