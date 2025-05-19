import { Home } from "@/demos/Home";
import { ZustandDemo } from "@/demos/Zustand";

export const routes = [
  {
    name: 'Home',
    path: '/',
    Component: Home,
  },
  {
    name: 'Zustand',
    path: '/zustand',
    Component: ZustandDemo
  }
]
