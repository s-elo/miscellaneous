import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'John',
    age: 20,
  }),
  actions: {
    setName(name: string) {
      this.name = name;
    },
    setAge(age: number) {
      this.age = age;
    },
  },
});
