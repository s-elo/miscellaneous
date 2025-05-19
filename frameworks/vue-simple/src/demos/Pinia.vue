<template>
  <h1>Pinia</h1>
  <div>
    <div>
      <p>Name: {{ name }}</p>
      <p>Age: {{ age }}</p>
    </div>
    <input type="text" @input="setName" placeholder="Name" />
    <input type="number" @input="setAge" placeholder="Age" />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
import { computed } from 'vue';

const userStore = useUserStore();

const name = computed(() => userStore.name);
const age = computed(() => userStore.age);

const setName = (e: Event) => {
  const target = e.target as HTMLInputElement;
  userStore.setName(target.value);
};

const setAge = (e: Event) => {
  const target = e.target as HTMLInputElement;
  userStore.setAge(Number(target.value));
};
</script>

<style scoped>
input {
  margin-right: 10px;
}
</style>