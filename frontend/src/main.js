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
import { MotionPlugin } from '@vueuse/motion';
import './styles/style.css';




const baseUrl = 'http://localhost:8000'; // Define your API base URL
const axiosInstance = axios.create({
    baseURL: baseUrl,
});
const app = createApp(App)
app.config.globalProperties.$axios = axiosInstance;

app.use(router)
app.use(MotionPlugin)

app.mount('#app')