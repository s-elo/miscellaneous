import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import RayTracer from './views/RayTracer.vue';
import Rasterizor from './views/Rasterizor.vue';
import './index.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: 'ray-tracer',
          component: RayTracer,
        },
        {
          path: 'rasterizor',
          component: Rasterizor,
        },
      ],
    },
  ],
});

createApp(App).use(router).mount('#root');
