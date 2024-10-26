import { createApp } from 'vue'
import App from './App.vue'

<<<<<<< Updated upstream
createApp(App).mount('#app')
=======

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
import { MotionPlugin } from '@vueuse/motion'

const baseUrl = 'http://localhost:8000'; // Define your API base URL
const axiosInstance = axios.create({
    baseURL: baseUrl,
});
const app = createApp(App)
app.config.globalProperties.$axios = axiosInstance;

app.use(router)
app.use(MotionPlugin)

app.mount('#app')
>>>>>>> Stashed changes
