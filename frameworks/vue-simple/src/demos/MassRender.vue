<template>
  <h2>MassRender</h2>
  <p>
    To Compare with React's <code>useTransition</code>
  </p>
  <p>- Try to click the "update" button, and then keep typing, the list will be rendered after loading the data and block your typings util the list is rendered</p>
  <div>
    <input type="text" v-model="name" />
    <button @click="handleUpdateName" :disabled="isPending">
      {{ isPending ? 'Loading...' : 'Update' }}
    </button>
    <div v-for="item in list" :key="item">
      {{ item }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { mock } from '@/utils/mock';
import { ref, nextTick } from 'vue';

const updateName = mock({}, 1000)

const name = ref('')
const list = ref<string[]>([])
const isPending = ref(false)

const handleUpdateName = async () => {
  isPending.value = true
  list.value = []
  await updateName()
  // this will block your typing
  list.value = Array.from({ length: 100000 }, () => Math.random().toString(36).substring(2, 15))
  await nextTick(() => {
    isPending.value = false
  })
}
</script>

<style scoped>

</style>