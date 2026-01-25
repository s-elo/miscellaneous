import type { RouteRecordRaw } from 'vue-router';
import RayTracer from './views/RayTracer.vue';
import Rasterizor from './views/Rasterizor.vue';

export const routes: RouteRecordRaw[] = [
  {
    name: 'Ray Tracer',
    path: '/ray-tracer',
    component: RayTracer,
  },
  {
    name: 'Rasterization',
    path: '/rasterizor',
    component: Rasterizor,
  },
];
