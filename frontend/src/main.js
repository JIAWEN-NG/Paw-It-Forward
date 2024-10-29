// import { createApp } from 'vue';
// import App from './App.vue';
// import 'bootstrap'; // Import Bootstrap JS
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import router from './router/routes'; // Import router


// const app = createApp(App); // Create the Vue app instance
// app.use(router); // Use the router
// app.mount('#app'); // Mount the app

import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap'; // Import Bootstrap JS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import router from './router/routes'; // Import router
import axios from 'axios';
import { MotionPlugin } from '@vueuse/motion'

// Import Firebase modules
import { initializeApp } from 'firebase/app';  // Import Firebase App initialization
import { getAuth } from 'firebase/auth';       // Import Firebase Auth
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);

const baseUrl = 'http://localhost:8000'; // Define your API base URL
const axiosInstance = axios.create({
    baseURL: baseUrl,
});
const app = createApp(App)
app.config.globalProperties.$axios = axiosInstance;
app.config.globalProperties.$auth = auth; // Making auth accessible globally

app.use(router)
app.use(MotionPlugin)

app.mount('#app')
export { auth, db };