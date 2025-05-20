import { UseTransitionDemo } from "@/demos/UseTransition";
import { Home } from "@/demos/Home";
import { ZustandDemo } from "@/demos/Zustand";
import { UseActionStateDemo } from "@/demos/UseActionState";
import { UseFormStatusDemo } from "@/demos/UseFormStatus";
import { UseOptimisticDemo } from "@/demos/UseOptimistic";
import { UseDemo } from "@/demos/Use";

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
  },
  {
    name: 'UseTransition',
    path: '/use-transition',
    Component: UseTransitionDemo
  },
  {
    name: 'UseActionState',
    path: '/use-action-state',
    Component: UseActionStateDemo
  },
  {
    name: 'UseFormStatus',
    path: '/use-form-status',
    Component: UseFormStatusDemo
  },
  {
    name: 'UseOptimistic',
    path: '/use-optimistic',
    Component: UseOptimisticDemo
  },
  {
    name: 'Use',
    path: '/use',
    Component: UseDemo
  }
]
