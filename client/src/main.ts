import axios from 'axios';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Is 'localhost' in the hostname?
const isLocalhost = window.location.hostname.includes('localhost');
axios.defaults.baseURL = isLocalhost
    ? 'http://localhost:3001/api/'
    : 'https://flag-game-production.up.railway.app/api/';

// Register global components
// app.component('Button', Button);
// app.component('Marker', Marker);
// app.component('Card', Card);

const app = createApp(App);
app.use(router);
app.mount('#app');
