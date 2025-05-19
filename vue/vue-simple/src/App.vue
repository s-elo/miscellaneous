<script setup lang="ts">
import SideBar from '@/components/SideBar.vue';
</script>

<template>
  <main class="app-container">
    <SideBar />
    <section class="app-content">
      <router-view />
    </section>
  </main>
</template>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: row;
  height: 100vh;
  .app-content {
    padding: 0 20px;
    flex: 1;
  }
}
</style>
