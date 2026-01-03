<template>
  <div class="container">
    <PromptApi />
  </div>
</template>

<script setup lang="ts">
import PromptApi from './views/PromptApi.vue';
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  line-height: 1.1;
  text-align: center;
  flex-direction: column;
  justify-content: center;
}
</style>
