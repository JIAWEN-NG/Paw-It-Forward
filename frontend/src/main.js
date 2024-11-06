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
// import 'bootstrap'; // Import Bootstrap JS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS
import router from './router/routes'; // Import router
import axios from 'axios';
import { MotionPlugin } from '@vueuse/motion';
import './styles/style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


// Import Firebase modules
import { initializeApp } from 'firebase/app';  // Import Firebase App initialization
import { getAuth } from 'firebase/auth';       // Import Firebase Auth
import { getFirestore } from 'firebase/firestore';
// import './store/auth.js'; // Import auth.js to initialize authState
import { setupAuthState } from './store/auth.js'; // Import the setup function

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);
setupAuthState(auth);

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