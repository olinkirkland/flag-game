import axios from 'axios';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import Button from './components/global/Button.vue';
import InputGroup from './components/global/InputGroup.vue';
import Panel from './components/global/Panel.vue';
import router from './router';

// Is 'localhost' in the hostname?
const isLocalhost = window.location.hostname.includes('localhost');
axios.defaults.baseURL = isLocalhost
    ? 'http://localhost:3001/api/'
    : 'https://flag-game-production.up.railway.app/api/';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
// app.use(i18n);

// Register global components
app.component('Button', Button);
app.component('Panel', Panel);
app.component('InputGroup', InputGroup);

app.mount('#app');
