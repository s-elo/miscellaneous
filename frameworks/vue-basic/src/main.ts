import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import { routes } from './routes';
import App from './App.vue';
import './style.css';

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

app.use(router).use(pinia).mount('#app');
