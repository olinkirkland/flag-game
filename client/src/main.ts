import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// Register global components
// app.component('Button', Button);
// app.component('Marker', Marker);
// app.component('Card', Card);

app.mount('#app');
