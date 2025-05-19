export const routes = [
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
];
