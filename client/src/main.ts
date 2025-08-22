import axios from 'axios';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Set axios baseURL globally
axios.defaults.baseURL = 'http://localhost:3000';

// Register global components
// app.component('Button', Button);
// app.component('Marker', Marker);
// app.component('Card', Card);

const app = createApp(App);
app.use(router);
app.mount('#app');