import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@/demos/Home.vue'),
  },
  {
    name: 'Pinia',
    path: '/pinia',
    component: () => import('@/demos/Pinia.vue'),
  },
  {
    name: 'MassRender',
    path: '/mass-render',
    component: () => import('@/demos/MassRender.vue'),
  },
];
