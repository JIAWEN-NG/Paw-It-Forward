// // src/store/auth.js
// import { reactive } from 'vue';
// import { onAuthStateChanged } from 'firebase/auth';

// // Define a reactive global state for authentication
// export const authState = reactive({
//   isUserLoggedIn: false,
//   userProfilePicUrl: null,
// });

// // Function to set up the listener
// export function setupAuthState(auth) {
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       authState.isUserLoggedIn = true;
//       authState.userProfilePicUrl = user.photoURL || null;
//       console.log("User is logged in:", authState.isUserLoggedIn);
//       console.log("User Profile Picture URL:", authState.userProfilePicUrl);

//     } else {
//       authState.isUserLoggedIn = false;
//       authState.userProfilePicUrl = null;
//       console.log("User is logged out");

//     }
//   });
// }


import { reactive } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';

export const authState = reactive({
  isUserLoggedIn: false,
  userProfilePicUrl: null,
  userId: null, // New user ID field
});

export function setupAuthState(auth) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authState.isUserLoggedIn = true;
      authState.userProfilePicUrl = user.photoURL || null;
      authState.userId = user.uid; // Capture user ID
      console.log("User is logged in:", authState.isUserLoggedIn);
      console.log("User ID:", authState.userId);
      console.log("User UID:", user.uid);
      console.log("User Profile Picture URL:", authState.userProfilePicUrl);

    } else {
      authState.isUserLoggedIn = false;
      authState.userProfilePicUrl = null;
      authState.userId = null;
      console.log("User is logged out");
    }
  });
}


